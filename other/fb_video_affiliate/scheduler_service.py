"""
Scheduler Service - Quản lý hàng đợi và tự động đăng video Facebook Reels theo lịch hẹn.
Hỗ trợ cả Hẹn giờ cục bộ (Local Scheduler kèm tự động ghim bình luận Shopee)
và Hẹn giờ trực tiếp lên máy chủ Meta Cloud (scheduled_publish_time).
"""
import os
import time
import uuid
import json
import logging
import threading
from pathlib import Path
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
SCHEDULED_TASKS_FILE = DATA_DIR / "scheduled_tasks.json"

_scheduler_thread: Optional[threading.Thread] = None
_publisher_callback = None
_commenter_callback = None
_stop_event = threading.Event()

def _load_tasks() -> List[Dict[str, Any]]:
    if not SCHEDULED_TASKS_FILE.exists():
        return []
    try:
        with open(SCHEDULED_TASKS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Lỗi đọc {SCHEDULED_TASKS_FILE}: {e}")
        return []

def _save_tasks(tasks: List[Dict[str, Any]]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    try:
        with open(SCHEDULED_TASKS_FILE, "w", encoding="utf-8") as f:
            json.dump(tasks, f, ensure_ascii=False, indent=2)
    except Exception as e:
        logger.error(f"Lỗi ghi {SCHEDULED_TASKS_FILE}: {e}")

def get_scheduled_tasks() -> List[Dict[str, Any]]:
    """Trả về danh sách tất cả các bài đã lên lịch (mới nhất xếp trước)."""
    tasks = _load_tasks()
    # Thêm trường tính toán thời gian còn lại (remaining_seconds) cho client
    now = time.time()
    for t in tasks:
        target = t.get("target_timestamp", 0)
        t["remaining_seconds"] = max(0, int(target - now))
        t["is_overdue"] = target < now and t.get("status") == "pending"
    return tasks

def add_scheduled_task(task_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Thêm 1 tác vụ đăng video vào hàng đợi hẹn giờ.
    task_data bao gồm:
      - target_timestamp: int (Unix timestamp)
      - target_time_str: str (Định dạng người đọc YYYY-MM-DD HH:MM:SS)
      - video_path, thumbnail_path, title, caption, hashtags, pinned_comment, selected_product_ids, script, niche
      - meta_cloud_schedule: bool
    """
    tasks = _load_tasks()
    task_id = f"sched_{int(time.time())}_{uuid.uuid4().hex[:6]}"
    
    new_task = {
        "id": task_id,
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "status": task_data.get("status", "pending"),  # 'pending', 'publishing', 'completed', 'failed', 'cancelled'
        "target_timestamp": int(task_data.get("target_timestamp", time.time() + 900)),
        "target_time_str": task_data.get("target_time_str", ""),
        "golden_slot_label": task_data.get("golden_slot_label", ""),
        "meta_cloud_schedule": bool(task_data.get("meta_cloud_schedule", False)),
        "comment_posted": bool(task_data.get("comment_posted", False)),
        "post_type": task_data.get("post_type", "reel"),  # 'reel' hoặc 'photo'
        "photo_path": task_data.get("photo_path", ""),
        "target_page_id": task_data.get("target_page_id", ""),
        "video_path": task_data.get("video_path", ""),
        "thumbnail_path": task_data.get("thumbnail_path", ""),
        "title": task_data.get("title", ""),
        "caption": task_data.get("caption", ""),
        "hashtags": task_data.get("hashtags", []),
        "pinned_comment": task_data.get("pinned_comment", ""),
        "selected_product_ids": task_data.get("selected_product_ids", []),
        "script": task_data.get("script", ""),
        "niche": task_data.get("niche", "Sức khỏe"),
        "facebook_result": task_data.get("facebook_result", None),
        "error_message": None
    }
    
    tasks.insert(0, new_task)
    _save_tasks(tasks)
    logger.info(f"Đã lên lịch đăng video {task_id} vào lúc {new_task['target_time_str']}")
    return new_task

def delete_scheduled_task(task_id: str) -> bool:
    """Hủy bỏ và xóa 1 tác vụ hẹn giờ."""
    tasks = _load_tasks()
    original_len = len(tasks)
    tasks = [t for t in tasks if t.get("id") != task_id]
    if len(tasks) != original_len:
        _save_tasks(tasks)
        logger.info(f"Đã hủy tác vụ hẹn giờ: {task_id}")
        return True
    return False

def get_scheduled_task(task_id: str) -> Optional[Dict[str, Any]]:
    tasks = _load_tasks()
    for t in tasks:
        if t.get("id") == task_id:
            return t
    return None

def update_task_status(task_id: str, status: str, result: Optional[dict] = None, error: Optional[str] = None):
    tasks = _load_tasks()
    for t in tasks:
        if t.get("id") == task_id:
            t["status"] = status
            if result:
                t["facebook_result"] = result
                t["completed_at"] = time.strftime("%Y-%m-%d %H:%M:%S")
                # Nếu kết quả đăng bài đã kèm bình luận ghim -> Đánh dấu ngay lập tức để worker không chạy lại
                if result.get("comment_id"):
                    t["comment_posted"] = True
                    t["comment_id"] = result.get("comment_id")
            if error:
                t["error_message"] = str(error)
            break
    _save_tasks(tasks)

def _worker_loop():
    """Vòng lặp chạy ngầm kiểm tra và thực thi các bài đăng đến giờ hẹn."""
    logger.info("Scheduler worker đã khởi động thành công.")
    while not _stop_event.is_set():
        try:
            now = time.time()
            tasks = _load_tasks()
            tasks_modified = False

            for t in tasks:
                # BẢO VỆ CHỐNG ĐĂNG TRÙNG LẶP:
                # Nếu tác vụ đã có video_id/post_id trên Facebook hoặc đã hoàn thành -> Không bao giờ đăng lại!
                fb_res = t.get("facebook_result") or {}
                has_fb_id = bool(fb_res.get("video_id") or fb_res.get("post_id"))
                has_comment = bool(t.get("comment_posted") or fb_res.get("comment_id") or t.get("comment_id"))
                is_done = t.get("status") in ["completed", "cancelled", "failed"]

                # 1. Với bài lên lịch Cục bộ (Local Scheduler)
                if t.get("status") == "pending" and not t.get("meta_cloud_schedule"):
                    if has_fb_id:
                        logger.warning(f"Tác vụ {t.get('id')} đã có ID Facebook ({fb_res.get('video_id') or fb_res.get('post_id')}). Chuyển sang completed để chặn đăng trùng lặp!")
                        t["status"] = "completed"
                        tasks_modified = True
                        continue

                    target = t.get("target_timestamp", 0)
                    if target <= now:
                        task_id = t["id"]
                        logger.info(f"Đến giờ hẹn! Bắt đầu đăng bài {task_id} ({t.get('title')})...")
                        update_task_status(task_id, "publishing")
                        
                        if _publisher_callback:
                            try:
                                res = _publisher_callback(t)
                                update_task_status(task_id, "completed", result=res)
                                logger.info(f"Đã tự động đăng bài theo lịch hẹn {task_id} thành công!")
                            except Exception as ex:
                                logger.error(f"Lỗi khi tự động đăng bài {task_id}: {ex}")
                                update_task_status(task_id, "failed", error=str(ex))
                        else:
                            logger.warning(f"Chưa cấu hình publisher callback cho scheduler!")
                            update_task_status(task_id, "failed", error="Publisher callback is not configured")

                # 2. Với bài đã lên lịch trực tiếp trên Meta Cloud (Facebook Scheduled)
                # CHỈ thực thi ghim bình luận khi:
                # - Là bài meta_cloud_schedule
                # - CHƯA từng được ghim bình luận (not has_comment)
                # - CHƯA kết thúc (not is_done)
                # - Có nội dung pinned_comment
                elif t.get("meta_cloud_schedule") and not has_comment and not is_done and t.get("pinned_comment"):
                    target = t.get("target_timestamp", 0)
                    if target <= now:
                        if _commenter_callback:
                            try:
                                c_res = _commenter_callback(t)
                                if c_res and "id" in c_res:
                                    t["comment_posted"] = True
                                    t["comment_id"] = c_res.get("id")
                                    t["status"] = "completed"
                                    tasks_modified = True
                                    logger.info(f"Đã tự động ghim bình luận Shopee cho video Meta Cloud {t.get('id')} thành công!")
                            except Exception as ce:
                                logger.warning(f"Chưa thể ghim bình luận cho video Meta Cloud {t.get('id')}: {ce}")

            if tasks_modified:
                _save_tasks(tasks)

        except Exception as e:
            logger.error(f"Lỗi trong vòng lặp scheduler: {e}")

        # Nghỉ 15 giây trước lần quét tiếp theo
        _stop_event.wait(15)

def start_scheduler(publisher_callback, commenter_callback=None):
    """Bắt đầu thread chạy ngầm cho Scheduler."""
    global _scheduler_thread, _publisher_callback, _commenter_callback, _stop_event
    _publisher_callback = publisher_callback
    _commenter_callback = commenter_callback
    _stop_event.clear()
    
    if _scheduler_thread is None or not _scheduler_thread.is_alive():
        _scheduler_thread = threading.Thread(target=_worker_loop, daemon=True, name="ReelsSchedulerThread")
        _scheduler_thread.start()
        logger.info("Đã khởi tạo background thread cho Reels Scheduler.")

def stop_scheduler():
    global _stop_event
    _stop_event.set()
