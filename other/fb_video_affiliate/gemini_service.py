"""
Gemini Service - Tích hợp Gemini 3.5 Flash-Lite & Gemini 3.1 Flash Lite
Tối ưu kịch bản video, sinh tiêu đề, caption, hashtags và tự động khớp nối kho sản phẩm Shopee Affiliate.
"""
import json
import logging
import urllib.request
import urllib.error
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

def call_gemini_api(api_key: str, model_name: str, prompt: str) -> Dict[str, Any]:
    """
    Gọi Gemini API với model chỉ định và xử lý retry tự động nếu gặp lỗi 429.
    """
    clean_model = model_name.replace("models/", "")
    url = f"{GEMINI_API_BASE}/{clean_model}:generateContent?key={api_key}"
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.7,
            "topP": 0.95
        }
    }
    
    headers = {"Content-Type": "application/json; charset=utf-8"}
    req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(raw_text)
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        logger.error(f"Gemini API Error {e.code}: {error_body}")
        raise RuntimeError(f"Lỗi gọi Gemini API ({e.code}): {error_body}")
    except Exception as e:
        logger.error(f"Exception during Gemini API call: {e}")
        raise RuntimeError(f"Lỗi phân tích Gemini: {str(e)}")

def analyze_and_match(
    api_key: str,
    script: str,
    niche: str,
    catalog: List[Dict[str, Any]],
    model_name: str = "gemini-3.5-flash-lite",
    video_filename: str = ""
) -> Dict[str, Any]:
    """
    Phân tích kịch bản video, sinh metadata Facebook Reels và khớp nối sản phẩm Shopee Affiliate.
    """
    # Rút gọn danh mục sản phẩm gửi vào prompt để tối ưu token
    catalog_summary = []
    for item in catalog:
        catalog_summary.append({
            "id": item.get("id"),
            "name": item.get("name"),
            "affiliate_url": item.get("affiliate_url"),
            "category": item.get("category"),
            "keywords": item.get("keywords", []),
            "notes": item.get("notes", "")
        })

    prompt = f"""
Bạn là chuyên gia hàng đầu về Sáng tạo Nội Dung Video Ngắn (Facebook Reels, TikTok) và Chuyên Gia Tối Ưu Tỷ Lệ Chuyển Đổi Affiliate Marketing.

KỊCH BẢN VIDEO ({niche}):
\"\"\"{script}\"\"\"
Tên file video (nếu có): {video_filename}

KHO SẢN PHẨM SHOPEE HIỆN CÓ:
{json.dumps(catalog_summary, ensure_ascii=False, indent=2)}

NHIỆM VỤ CỦA BẠN:
1. Đọc kỹ kịch bản trên, nắm bắt các nỗi đau, nguy cơ sức khỏe hoặc yếu tố gây tò mò/hài hước.
2. Tuân thủ chính sách Meta (Facebook): KHÔNG dùng từ cấm (như 'chữa dứt điểm', 'cam kết 100%', 'trị tận gốc', 'chữa khỏi hoàn toàn'). Hãy dùng ngôn ngữ phòng ngừa, chăm sóc sức khỏe chủ động, mẹo dân gian, bảo vệ cơ thể.
3. Tạo ra:
   - "hook_title": Tiêu đề video giật tít, tò mò, giữ chân 3 giây đầu (Hook), độ dài 50-80 ký tự. Có icon thu hút.
   - "reels_caption": Đoạn mô tả video ngắn gọn (2-4 câu) kèm kêu gọi hành động (xem hết video, lưu lại mẹo, xem bình luận bên dưới).
   - "hashtags": Danh sách 6 - 8 thẻ hashtag chuẩn SEO thuật toán Facebook Reels (ví dụ: ["#suckhoe", "#tamdem", "#meosuckhoe", "#songkhoe", "#canhbao"]).
   - "selected_product_ids": Danh sách ID các sản phẩm PHÙ HỢP NHẤT được chọn từ Kho Sản Phẩm trên (chọn từ 3 đến 5 sản phẩm liên quan trực tiếp đến kịch bản).
   - "missing_recommendations": Nếu chủ đề này còn thiếu các sản phẩm quan trọng mà trong Kho chưa có, hãy gợi ý 1 - 3 sản phẩm mới cần bổ sung (gồm "product_name", "reason", "search_keyword"). Nếu trong kho đã đủ thì để mảng rỗng [].
   - "pinned_comment": Soạn thảo một đoạn bình luận ghim (First Comment) cực kỳ khéo léo và hữu ích. Gom các sản phẩm đã chọn thành một cẩm nang/combo bảo vệ gia đình, chèn đầy đủ Tên Sản Phẩm và Link Shopee (dùng đúng affiliate_url từ kho). Văn phong chân thành, gần gũi, khuyên bảo tự nhiên ("Bà con ơi", "Nhà em chia sẻ..."), không gây cảm giác chèo kéo lộ liễu.

Định dạng JSON trả về bắt buộc:
{{
  "hook_title": "string",
  "reels_caption": "string",
  "hashtags": ["string"],
  "selected_product_ids": ["string"],
  "missing_recommendations": [
    {{
      "product_name": "string",
      "reason": "string",
      "search_keyword": "string"
    }}
  ],
  "pinned_comment": "string"
}}
"""
    # Thử model được chọn, nếu lỗi thì thử model dự phòng
    fallback_model = "gemini-3.1-flash-lite" if model_name == "gemini-3.5-flash-lite" else "gemini-3.5-flash-lite"
    try:
        return call_gemini_api(api_key, model_name, prompt)
    except Exception as e:
        logger.warning(f"Thử model {model_name} thất bại ({e}), chuyển sang dự phòng {fallback_model}...")
        return call_gemini_api(api_key, fallback_model, prompt)
