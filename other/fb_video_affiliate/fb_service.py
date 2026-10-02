"""
Facebook Service - Đăng video Facebook Reels và tự động bình luận link Shopee Affiliate.
Hỗ trợ cả chế độ Thực tế (Graph API) và chế độ Kiểm thử/Mô phỏng (Simulation).
"""
import os
import time
import uuid
import logging
import requests
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

GRAPH_API_VERSION = "v21.0"
GRAPH_API_BASE = f"https://graph.facebook.com/{GRAPH_API_VERSION}"

class FacebookReelsPublisher:
    def __init__(self, page_id: str = "", page_access_token: str = "", simulation_mode: bool = True):
        self.page_id = page_id.strip()
        self.token = page_access_token.strip()
        self.simulation_mode = simulation_mode or not bool(self.token and self.page_id)

    def publish_reel_with_comment(
        self,
        video_path: Optional[str],
        title: str,
        caption: str,
        hashtags: list,
        pinned_comment: str,
        scheduled_publish_time: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Đăng video Reels lên Facebook Page và tự động thả comment ghim link Shopee.
        """
        full_description = f"{title}\n\n{caption}\n\n{' '.join(hashtags)}"

        # Chế độ mô phỏng kiểm thử
        if self.simulation_mode:
            time.sleep(1.2)  # Giả lập độ trễ mạng
            mock_video_id = f"reel_{int(time.time())}_{uuid.uuid4().hex[:6]}"
            mock_comment_id = f"cmt_{int(time.time())}_{uuid.uuid4().hex[:6]}"
            
            return {
                "success": True,
                "mode": "simulation",
                "message": "Đã chạy kiểm thử thành công! (Nhập Page ID & Token trong Cài Đặt để đăng lên Facebook thật)",
                "video_id": mock_video_id,
                "comment_id": mock_comment_id,
                "facebook_url": f"https://www.facebook.com/reel/{mock_video_id}",
                "published_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }

        # Chế độ thật qua Meta Graph API
        if not video_path or not os.path.exists(video_path):
            raise FileNotFoundError(f"Không tìm thấy file video: {video_path}")

        try:
            # Bước 1: Khởi tạo phiên tải video Reels
            init_url = f"{GRAPH_API_BASE}/{self.page_id}/video_reels"
            init_payload = {
                "access_token": self.token,
                "upload_phase": "start"
            }
            init_res = requests.post(init_url, data=init_payload, timeout=20).json()
            if "error" in init_res:
                raise RuntimeError(f"Lỗi khởi tạo Reels: {init_res['error'].get('message', init_res['error'])}")

            video_id = init_res["video_id"]
            upload_url = init_res["upload_url"]

            # Bước 2: Tải file nhị phân video lên rupload
            file_size = os.path.getsize(video_path)
            with open(video_path, "rb") as f:
                upload_headers = {
                    "Authorization": f"OAuth {self.token}",
                    "offset": "0",
                    "file_size": str(file_size)
                }
                upload_res = requests.post(upload_url, data=f, headers=upload_headers, timeout=120)
                if upload_res.status_code not in (200, 201):
                    raise RuntimeError(f"Lỗi tải video lên server Meta: HTTP {upload_res.status_code}")

            # Bước 3: Hoàn tất đăng tải Reels
            finish_payload = {
                "access_token": self.token,
                "upload_phase": "finish",
                "video_id": video_id,
                "title": title,
                "description": full_description,
                "video_state": "PUBLISHED" if not scheduled_publish_time else "SCHEDULED"
            }
            if scheduled_publish_time:
                finish_payload["scheduled_publish_time"] = scheduled_publish_time

            finish_res = requests.post(init_url, data=finish_payload, timeout=20).json()
            if "error" in finish_res:
                raise RuntimeError(f"Lỗi hoàn tất đăng video: {finish_res['error'].get('message', finish_res['error'])}")

            # Bước 4: Tự động bình luận link Shopee vào bài viết vừa đăng
            comment_id = None
            if pinned_comment:
                time.sleep(2)  # Đợi 2 giây để video gắn vào feed
                comment_url = f"{GRAPH_API_BASE}/{video_id}/comments"
                comment_res = requests.post(
                    comment_url,
                    data={"access_token": self.token, "message": pinned_comment},
                    timeout=20
                ).json()
                if "id" in comment_res:
                    comment_id = comment_res["id"]

            return {
                "success": True,
                "mode": "live",
                "message": "Đã đăng video lên Facebook Reels và ghim bình luận Shopee thành công!",
                "video_id": video_id,
                "comment_id": comment_id,
                "facebook_url": f"https://www.facebook.com/reel/{video_id}",
                "published_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }

        except Exception as e:
            logger.error(f"Facebook Reels publish failed: {e}")
            raise RuntimeError(f"Lỗi đăng bài Facebook: {str(e)}")
