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

    def _request_with_retry(self, method: str, url: str, **kwargs) -> requests.Response:
        """Thực hiện HTTP request kèm retry tự động khi gặp sự cố mạng hoặc DNS."""
        max_retries = 3
        last_exception = None
        for attempt in range(1, max_retries + 1):
            try:
                kwargs.setdefault("timeout", 30)
                resp = requests.request(method, url, **kwargs)
                return resp
            except (requests.ConnectionError, requests.Timeout) as ex:
                last_exception = ex
                logger.warning(f"Lần thử {attempt}/{max_retries} gặp lỗi mạng ({ex}). Đang thử lại sau {attempt}s...")
                time.sleep(attempt)
        raise RuntimeError(f"Không thể kết nối đến máy chủ Meta (graph.facebook.com). Vui lòng kiểm tra kết nối mạng Internet hoặc đổi DNS sang 8.8.8.8: {last_exception}")

    def _parse_meta_error(self, err_data: dict) -> str:
        """Phân tích mã lỗi của Facebook để đưa ra thông báo tiếng Việt dễ hiểu nhất."""
        code = err_data.get("code")
        subcode = err_data.get("error_subcode")
        msg = err_data.get("message", "Lỗi không xác định từ Facebook")

        if code == 190:
            if subcode == 463:
                return "Mã Page Access Token của bạn đã HẾT HẠN (Session has expired)! Vui lòng vào Tab '4. Cài Đặt' để dán Page Access Token mới (nên dùng Token dài hạn 60 ngày hoặc vĩnh viễn)."
            elif subcode == 490:
                return "Ứng dụng Meta chưa được cấp quyền đăng nhập cho tài khoản này."
            return f"Mã Page Access Token không hợp lệ hoặc đã bị đổi mật khẩu/thu hồi (Code 190): {msg}"
        elif code in (200, 283):
            return f"Tài khoản chưa được cấp đủ quyền quản trị Page để đăng Reels. Vui lòng cấp các quyền: pages_show_list, pages_read_engagement, pages_manage_posts."
        elif code == 100:
            return f"Thông số gửi lên Meta không đúng: {msg}"
        return f"{msg} (Mã lỗi Meta: {code})"

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
                "message": "Đã chạy kiểm thử thành công! (Bật đăng thật và cập nhật Page ID & Token trong Cài Đặt)",
                "video_id": mock_video_id,
                "comment_id": mock_comment_id,
                "facebook_url": f"https://www.facebook.com/reel/{mock_video_id}",
                "published_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }

        # Chế độ thật qua Meta Graph API
        if not video_path or not os.path.exists(video_path):
            raise FileNotFoundError(f"Không tìm thấy file video trên server: {video_path}")

        try:
            # Bước 1: Khởi tạo phiên tải video Reels
            init_url = f"{GRAPH_API_BASE}/{self.page_id}/video_reels"
            init_payload = {
                "access_token": self.token,
                "upload_phase": "start"
            }
            init_resp = self._request_with_retry("POST", init_url, data=init_payload)
            init_data = init_resp.json()
            if "error" in init_data:
                raise RuntimeError(self._parse_meta_error(init_data["error"]))

            video_id = init_data["video_id"]
            upload_url = init_data["upload_url"]

            # Bước 2: Tải file nhị phân video lên server rupload của Meta
            file_size = os.path.getsize(video_path)
            with open(video_path, "rb") as f:
                upload_headers = {
                    "Authorization": f"OAuth {self.token}",
                    "offset": "0",
                    "file_size": str(file_size)
                }
                upload_resp = self._request_with_retry("POST", upload_url, data=f, headers=upload_headers, timeout=180)
                if upload_resp.status_code not in (200, 201):
                    raise RuntimeError(f"Lỗi tải video lên máy chủ Meta (HTTP {upload_resp.status_code}): {upload_resp.text}")

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

            finish_resp = self._request_with_retry("POST", init_url, data=finish_payload)
            finish_data = finish_resp.json()
            if "error" in finish_data:
                raise RuntimeError(self._parse_meta_error(finish_data["error"]))

            # Bước 4: Tự động bình luận link Shopee vào bài viết vừa đăng
            comment_id = None
            if pinned_comment:
                time.sleep(2.5)  # Đợi 2.5s để server Meta index xong video ID
                comment_url = f"{GRAPH_API_BASE}/{video_id}/comments"
                comment_resp = self._request_with_retry("POST", comment_url, data={"access_token": self.token, "message": pinned_comment})
                comment_data = comment_resp.json()
                if "id" in comment_data:
                    comment_id = comment_data["id"]

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
            raise RuntimeError(f"{str(e)}")
