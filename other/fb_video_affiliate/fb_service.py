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
        scheduled_publish_time: Optional[int] = None,
        thumbnail_path: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Đăng video Reels lên Facebook Page và tự động thả comment ghim link Shopee.
        Hỗ trợ gán ảnh bìa / thumbnail tùy chỉnh từ Thumbnail Studio lên Facebook Reels.
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
                "thumbnail_applied": bool(thumbnail_path),
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

            # Bước 3.5: Gán ảnh Thumbnail/Bìa tùy chỉnh lên Facebook Reels (is_preferred=true)
            thumbnail_applied = False
            if thumbnail_path:
                from pathlib import Path
                t_path = Path(thumbnail_path)
                if not t_path.is_absolute():
                    t_path = Path.cwd() / t_path
                if t_path.exists():
                    logger.info(f"Đang đồng bộ ảnh bìa tùy chỉnh ({t_path}) lên Facebook Reels {video_id}...")
                    thumb_url = f"{GRAPH_API_BASE}/{video_id}/thumbnails"
                    for attempt in range(1, 3):
                        try:
                            time.sleep(1.8)  # Đợi Meta đồng bộ video_id
                            with open(t_path, "rb") as tf:
                                thumb_resp = self._request_with_retry(
                                    "POST",
                                    thumb_url,
                                    data={"access_token": self.token, "is_preferred": "true"},
                                    files={"source": tf}
                                )
                            thumb_data = thumb_resp.json() if thumb_resp.text else {}
                            if thumb_resp.status_code in (200, 201) and thumb_data.get("success"):
                                logger.info(f"Đã gán Thumbnail tùy chỉnh thành công cho Reel {video_id}!")
                                thumbnail_applied = True
                                break
                            else:
                                logger.warning(f"Lần thử {attempt} gán thumbnail: {thumb_resp.text}")
                        except Exception as te:
                            logger.warning(f"Lỗi gán thumbnail lần {attempt}: {te}")
                else:
                    logger.warning(f"File thumbnail_path không tồn tại: {thumbnail_path}")

            # Bước 4: Tự động bình luận link Shopee vào bài viết vừa đăng (chỉ với video đăng ngay)
            comment_id = None
            if pinned_comment and not scheduled_publish_time:
                time.sleep(2.0)  # Đợi server Meta index xong video ID
                try:
                    comment_url = f"{GRAPH_API_BASE}/{video_id}/comments"
                    comment_resp = self._request_with_retry("POST", comment_url, data={"access_token": self.token, "message": pinned_comment})
                    comment_data = comment_resp.json()
                    if "id" in comment_data:
                        comment_id = comment_data["id"]
                except Exception as ce:
                    logger.warning(f"Lỗi khi bình luận tự động: {ce}")

            # Lấy link thật và ID thật của Reels trên Facebook (luôn giữ đúng video_id vừa tạo)
            facebook_url = f"https://www.facebook.com/reel/{video_id}"
            actual_video_id = video_id
            if not scheduled_publish_time:
                try:
                    time.sleep(1.0)
                    r_check = self._request_with_retry(
                        "GET",
                        f"{GRAPH_API_BASE}/{video_id}",
                        params={"fields": "permalink_url", "access_token": self.token}
                    )
                    r_data = r_check.json() if r_check.text else {}
                    p_url = r_data.get("permalink_url")
                    if p_url:
                        facebook_url = p_url if p_url.startswith("http") else f"https://www.facebook.com{p_url}"
                except Exception as pe:
                    logger.warning(f"Không thể truy vấn permalink Reels: {pe}")

            is_cloud_scheduled = bool(scheduled_publish_time)
            return {
                "success": True,
                "mode": "scheduled" if is_cloud_scheduled else "live",
                "message": "Đã lên lịch đăng video trên Facebook Meta Cloud thành công!" if is_cloud_scheduled else "Đã đăng video lên Facebook Reels và ghim bình luận Shopee thành công!",
                "video_id": actual_video_id,
                "comment_id": comment_id,
                "thumbnail_applied": thumbnail_applied,
                "facebook_url": facebook_url,
                "published_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                "scheduled_publish_time": scheduled_publish_time
            }

        except Exception as e:
            logger.error(f"Facebook Reels publish failed: {e}")
            raise RuntimeError(f"{str(e)}")

    def publish_photo_with_comment(
        self,
        photo_path: str,
        caption: str,
        hashtags: list,
        pinned_comment: str = "",
        scheduled_publish_time: Optional[int] = None
    ) -> Dict[str, Any]:
        """Đăng ảnh lên Facebook Fanpage kèm tự động bình luận link Shopee Affiliate."""
        full_message = caption.strip()
        if hashtags:
            clean_tags = " ".join([h if h.startswith("#") else f"#{h}" for h in hashtags])
            full_message = f"{full_message}\n\n{clean_tags}"

        if self.simulation_mode:
            time.sleep(1.0)
            mock_id = f"photo_{int(time.time())}_{uuid.uuid4().hex[:6]}"
            return {
                "success": True,
                "mode": "simulation",
                "message": "Đã chạy kiểm thử đăng ảnh thành công! (Chế độ mô phỏng)",
                "post_id": mock_id,
                "photo_id": mock_id,
                "comment_id": f"cmt_{mock_id}",
                "facebook_url": f"https://www.facebook.com/{mock_id}",
                "published_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }

        if not photo_path or not os.path.exists(photo_path):
            raise FileNotFoundError(f"Không tìm thấy file ảnh: {photo_path}")

        try:
            url = f"{GRAPH_API_BASE}/{self.page_id}/photos"
            is_scheduled = bool(scheduled_publish_time)
            payload = {
                "access_token": self.token,
                "message": full_message,
                "published": "false" if is_scheduled else "true"
            }
            if is_scheduled:
                payload["scheduled_publish_time"] = scheduled_publish_time

            with open(photo_path, "rb") as f:
                resp = self._request_with_retry("POST", url, data=payload, files={"source": f}, timeout=60)
            
            data = resp.json()
            if "error" in data:
                raise RuntimeError(self._parse_meta_error(data["error"]))

            photo_id = data.get("id")
            post_id = data.get("post_id") or photo_id

            # Bình luận tự động nếu đăng ngay
            comment_id = None
            if pinned_comment and not is_scheduled:
                time.sleep(1.5)
                try:
                    c_url = f"{GRAPH_API_BASE}/{post_id}/comments"
                    c_resp = self._request_with_retry("POST", c_url, data={"access_token": self.token, "message": pinned_comment})
                    c_data = c_resp.json()
                    if "id" in c_data:
                        comment_id = c_data["id"]
                except Exception as ce:
                    logger.warning(f"Lỗi khi bình luận tự động vào ảnh: {ce}")

            facebook_url = f"https://www.facebook.com/{post_id}"

            return {
                "success": True,
                "mode": "scheduled" if is_scheduled else "live",
                "message": "Đã lên lịch đăng ảnh lên Meta Cloud thành công!" if is_scheduled else "Đã đăng bài viết ảnh lên Facebook và ghim bình luận Shopee thành công!",
                "post_id": post_id,
                "photo_id": photo_id,
                "comment_id": comment_id,
                "facebook_url": facebook_url,
                "published_at": time.strftime("%Y-%m-%d %H:%M:%S"),
                "scheduled_publish_time": scheduled_publish_time
            }
        except Exception as e:
            logger.error(f"Facebook Photo publish failed: {e}")
            raise RuntimeError(f"{str(e)}")

    def update_comment(self, comment_id: str, new_message: str) -> bool:
        """Cập nhật nội dung bình luận đã đăng trên Facebook Fanpage."""
        if self.simulation_mode:
            logger.info(f"[MÔ PHỎNG] Đã cập nhật comment {comment_id} sang nội dung mới.")
            return True

        if not comment_id:
            return False

        try:
            url = f"{GRAPH_API_BASE}/{comment_id.strip()}"
            resp = self._request_with_retry(
                "POST",
                url,
                data={"access_token": self.token, "message": new_message}
            )
            data = resp.json() if resp.text else {}
            if resp.status_code in (200, 201) and data.get("success"):
                logger.info(f"Đã cập nhật bình luận Facebook {comment_id} thành công!")
                return True
            logger.warning(f"Không thể cập nhật bình luận {comment_id}: {resp.text}")
            return False
        except Exception as e:
            logger.error(f"Lỗi khi cập nhật bình luận {comment_id}: {e}")
            return False

    def update_post(self, post_id: str, new_message: str) -> bool:
        """Cập nhật nội dung bài viết/caption đã đăng trên Facebook Fanpage."""
        if self.simulation_mode:
            logger.info(f"[MÔ PHỎNG] Đã cập nhật bài viết {post_id} sang nội dung mới.")
            return True

        if not post_id:
            return False

        try:
            url = f"{GRAPH_API_BASE}/{post_id.strip()}"
            resp = self._request_with_retry(
                "POST",
                url,
                data={"access_token": self.token, "message": new_message}
            )
            data = resp.json() if resp.text else {}
            if resp.status_code in (200, 201) and data.get("success"):
                logger.info(f"Đã cập nhật bài viết Facebook {post_id} thành công!")
                return True
            logger.warning(f"Không thể cập nhật bài viết {post_id}: {resp.text}")
            return False
        except Exception as e:
            logger.error(f"Lỗi khi cập nhật bài viết {post_id}: {e}")
            return False

    def publish_scheduled_reel_now(self, video_id: str, pinned_comment: str = "") -> Dict[str, Any]:
        """Kích hoạt phát sóng ngay lập tức một video Reels đang ở trạng thái hẹn giờ trên Meta Cloud."""
        if self.simulation_mode:
            logger.info(f"[MÔ PHỎNG] Đã kích hoạt phát sóng ngay Reel {video_id}")
            return {
                "success": True,
                "mode": "simulation",
                "message": "Đã phát sóng video hẹn giờ thành công! (Mô phỏng)",
                "video_id": video_id,
                "facebook_url": f"https://www.facebook.com/reel/{video_id}",
                "published_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }

        try:
            # Gửi lệnh phát sóng ngay tới Meta Graph API
            url = f"{GRAPH_API_BASE}/{video_id}"
            resp = self._request_with_retry(
                "POST",
                url,
                data={"access_token": self.token, "is_published": "true"}
            )
            data = resp.json() if resp.text else {}
            if "error" in data:
                raise RuntimeError(self._parse_meta_error(data["error"]))

            # Tự động ghim bình luận Shopee nếu có
            comment_id = None
            if pinned_comment:
                time.sleep(1.5)
                try:
                    c_url = f"{GRAPH_API_BASE}/{video_id}/comments"
                    c_resp = self._request_with_retry("POST", c_url, data={"access_token": self.token, "message": pinned_comment})
                    c_data = c_resp.json()
                    if "id" in c_data:
                        comment_id = c_data["id"]
                except Exception as ce:
                    logger.warning(f"Lỗi khi bình luận tự động: {ce}")

            return {
                "success": True,
                "mode": "live",
                "message": "Đã phát sóng video hẹn giờ trên Facebook thành công!",
                "video_id": video_id,
                "comment_id": comment_id,
                "facebook_url": f"https://www.facebook.com/reel/{video_id}",
                "published_at": time.strftime("%Y-%m-%d %H:%M:%S")
            }
        except Exception as e:
            logger.error(f"Lỗi khi phát sóng video hẹn giờ {video_id}: {e}")
            raise RuntimeError(str(e))

    @staticmethod
    def verify_page(page_id: str, token: str) -> Dict[str, Any]:
        """Kiểm tra token và lấy thông tin Page từ Meta Graph API."""
        try:
            url = f"{GRAPH_API_BASE}/{page_id.strip()}?fields=id,name,link,fan_count,is_published&access_token={token.strip()}"
            resp = requests.get(url, timeout=15)
            data = resp.json()
            if "error" in data:
                return {"valid": False, "error": data["error"].get("message", "Lỗi xác thực")}
            return {
                "valid": True,
                "id": data.get("id"),
                "name": data.get("name"),
                "fan_count": data.get("fan_count", 0),
                "is_published": data.get("is_published", True)
            }
        except Exception as e:
            return {"valid": False, "error": str(e)}
