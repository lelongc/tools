"""
Gemini Service - Tích hợp Gemini 3.5 Flash-Lite & Gemini 3.1 Flash Lite
Tối ưu kịch bản video, sinh tiêu đề, caption, hashtags và tự động khớp nối kho sản phẩm Shopee Affiliate.
"""
import os
import json
import base64
import logging
import re
import urllib.request
import urllib.error
from pathlib import Path
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

EMOJI_PATTERN = re.compile(
    "["
    "\U00010000-\U0010ffff"  # Supplemental symbols, emoticons, pictographs
    "\u2600-\u27bf"          # Misc symbols & dingbats (⚠️, ✈️, ✂️, ✋, etc.)
    "\u2300-\u23ff"          # Misc Technical
    "\u2b50-\u2b55"          # Stars, symbols
    "\u200d"                 # Zero-width joiner
    "\ufe0f"                 # Variation selector
    "\u2190-\u21ff"          # Arrows (👉, ➔, ➜, etc.)
    "\u2900-\u297f"          # Supplemental arrows
    "\u25a0-\u25ff"          # Geometric shapes
    "]+",
    flags=re.UNICODE
)

VIETNAMESE_ACCENT_PATTERN = re.compile(
    r'[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]',
    re.IGNORECASE
)

def has_vietnamese_accents(text: str) -> bool:
    """Kiểm tra chuỗi có chứa ký tự tiếng Việt có dấu hay không."""
    if not text or not isinstance(text, str):
        return False
    return bool(VIETNAMESE_ACCENT_PATTERN.search(text))

def clean_no_emojis(text: str) -> str:
    """Loại bỏ hoàn toàn mọi icon, emoji, ký hiệu đồ họa để bài đăng mộc mạc chuẩn người thật."""
    if not text or not isinstance(text, str):
        return text or ""
    cleaned = EMOJI_PATTERN.sub("", text)
    cleaned = re.sub(r'[ \t]+', ' ', cleaned)
    cleaned = re.sub(r' \n', '\n', cleaned)
    cleaned = re.sub(r'\n ', '\n', cleaned)
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    return cleaned.strip()

def sanitize_analysis_output(data: Dict[str, Any]) -> Dict[str, Any]:
    """Lọc sạch mọi icon khỏi tiêu đề, mô tả, bình luận ghim và gợi ý sản phẩm."""
    if not isinstance(data, dict):
        return data
    if "hook_title" in data:
        data["hook_title"] = clean_no_emojis(data["hook_title"])
    if "reels_caption" in data:
        data["reels_caption"] = clean_no_emojis(data["reels_caption"])
    if "pinned_comment" in data:
        raw_cmt = str(data["pinned_comment"] or "")
        # Chuyển đổi các icon/bullet đầu dòng thành dấu gạch ngang mộc mạc "- "
        raw_cmt = re.sub(r'^[ \t]*[\U00010000-\U0010ffff\u2600-\u27bf\u2190-\u21ff•*–—]+\s*', '- ', raw_cmt, flags=re.MULTILINE)
        data["pinned_comment"] = clean_no_emojis(raw_cmt)
    if "viral_video_titles" in data and isinstance(data["viral_video_titles"], list):
        for item in data["viral_video_titles"]:
            if isinstance(item, dict):
                item["title"] = clean_no_emojis(item.get("title", ""))
                item["tag"] = clean_no_emojis(item.get("tag", ""))
    if "thumbnail_banner" in data and isinstance(data["thumbnail_banner"], dict):
        data["thumbnail_banner"]["line1"] = clean_no_emojis(data["thumbnail_banner"].get("line1", "")).upper()
        data["thumbnail_banner"]["line2"] = clean_no_emojis(data["thumbnail_banner"].get("line2", "")).upper()
    if "missing_recommendations" in data and isinstance(data["missing_recommendations"], list):
        for r in data["missing_recommendations"]:
            if isinstance(r, dict):
                r["product_name"] = clean_no_emojis(r.get("product_name", ""))
                r["reason"] = clean_no_emojis(r.get("reason", ""))
                r["search_keyword"] = clean_no_emojis(r.get("search_keyword", ""))
                r["category"] = clean_no_emojis(r.get("category", ""))
    return data

def call_gemini_api(
    api_key: str,
    model_name: str,
    prompt: str,
    image_base64: Optional[str] = None,
    image_mime_type: str = "image/jpeg"
) -> Dict[str, Any]:
    """
    Gọi Gemini API với model chỉ định và xử lý retry tự động nếu gặp lỗi 429.
    Hỗ trợ cả đầu vào văn bản và hình ảnh (Multimodal Vision).
    """
    clean_model = model_name.replace("models/", "")
    url = f"{GEMINI_API_BASE}/{clean_model}:generateContent?key={api_key}"
    
    parts = [{"text": prompt}]
    if image_base64:
        parts.append({
            "inlineData": {
                "mimeType": image_mime_type,
                "data": image_base64
            }
        })

    payload = {
        "contents": [
            {
                "parts": parts
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
        with urllib.request.urlopen(req, timeout=35) as resp:
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

def generate_new_script(api_key: str, model_name: str = "gemini-3.5-flash-lite", topic: str = "") -> str:
    """
    Tự động sáng tạo một kịch bản video sức khỏe 30 giây hoàn toàn mới theo đúng công thức Văn Cao:
    - 3 đoạn x 10s (khoảng 70-85 từ)
    - Đoạn 1: Thói quen xấu + Cảnh báo
    - Đoạn 2: Thứ nhất... Thứ hai... Thứ ba...
    - Đoạn 3: Lời khuyên sửa đổi + Thả tim theo dõi kênh
    """
    topic_hint = f"về chủ đề: {topic}" if topic else "về một thói quen xấu trong ăn uống, sinh hoạt, tắm rửa, hoặc chăm sóc cơ thể mà nhiều người hay mắc phải"
    prompt = f"""
Bạn là chuyên gia sáng tạo kịch bản video ngắn sức khỏe triệu view theo phong cách mộc mạc, gần gũi, dân dã ("Bà con ơi", "Nhà em chia sẻ"...).
TUYỆT ĐỐI KHÔNG đưa tên riêng của bất kỳ ai vào kịch bản (chỉ xưng "kênh em", "nhà em" hoặc "bà con").

NHIỆM VỤ:
Hãy sáng tạo 1 kịch bản video ngắn mới {topic_hint}.

YÊU CẦU BẮT BUỘC:
1. ĐỘ DÀI: Đúng 3 đoạn (mỗi đoạn xuống dòng 1 lần, tổng độ dài khoảng 70 - 85 từ, đọc vừa khít 30 giây).
2. CẤU TRÚC 3 ĐOẠN:
   - Đoạn 1 (0-10s): Bắt đầu bằng "Nhiều người hay có thói quen..." hoặc "Bà con mình hay..." + Nêu thói quen sai lầm + Cảnh báo "rước bệnh vào người lúc nào không hay" hoặc "sai lầm rước bệnh vào thân nha bà con".
   - Đoạn 2 (10-20s): Bắt buộc dùng cấu trúc: "Thứ nhất là... Thứ hai là... Thứ ba là..." chỉ rõ 3 tác hại cụ thể đến cơ quan cơ thể (dạ dày, tim mạch, huyết áp, cột sống, vi khuẩn...).
   - Đoạn 3 (20-30s): Lời khuyên làm đúng + Kết thúc bằng câu: "Bà con thấy đúng thì thả tim và theo dõi kênh để xem mẹo hay nhé." (hoặc tương tự).
3. QUY TẮC DẤU TIẾNG VIỆT (BẮT BUỘC):
   - 100% kịch bản (script), chủ đề (topic), và 2 dòng chữ ảnh bìa (thumbnail_banner) PHẢI VIẾT BẰNG TIẾNG VIỆT CÓ ĐẦY ĐỦ DẤU THANH (Ví dụ: "TÁC DỤNG CỦA CÂY BẦU", "ĐỐI VỚI BỆNH TIỂU ĐƯỜNG").
   - TUYỆT ĐỐI KHÔNG VIẾT TIẾNG VIỆT KHÔNG DẤU!
4. ĐỊNH DẠNG ĐẦU RA JSON:
{{
  "topic": "Tên chủ đề",
  "script": "Đoạn 1\\nĐoạn 2\\nĐoạn 3",
  "thumbnail_banner": {{
    "line1": "DÒNG 1 IN HOA 3-5 TỪ (VÍ DỤ: TÁC DỤNG CỦA CÂY BẦU)",
    "line2": "DÒNG 2 IN HOA 3-5 TỪ (VÍ DỤ: ĐỐI VỚI BỆNH TIỂU ĐƯỜNG)"
  }}
}}
"""
    fallback_model = "gemini-3.1-flash-lite" if model_name == "gemini-3.5-flash-lite" else "gemini-3.5-flash-lite"
    try:
        res = call_gemini_api(api_key, model_name, prompt)
    except Exception as e:
        logger.warning(f"Thử model {model_name} thất bại ({e}), chuyển sang dự phòng {fallback_model}...")
        res = call_gemini_api(api_key, fallback_model, prompt)

    if isinstance(res, dict) and not has_vietnamese_accents(res.get("script", "")):
        logger.warning("Kịch bản mới sinh ra bị thiếu dấu tiếng Việt, đang yêu cầu thử lại...")
        strict_prompt = prompt + "\n\nBẮT BUỘC 100% KỊCH BẢN VÀ ẢNH BÌA PHẢI VIẾT BẰNG TIẾNG VIỆT CÓ DẤU ĐẦY ĐỦ!"
        try:
            retry_res = call_gemini_api(api_key, fallback_model, strict_prompt)
            if has_vietnamese_accents(retry_res.get("script", "")):
                res = retry_res
        except Exception:
            pass

    if isinstance(res, dict):
        if "topic" in res:
            res["topic"] = clean_no_emojis(res["topic"])
        if "script" in res:
            res["script"] = clean_no_emojis(res["script"])
        if "thumbnail_banner" in res and isinstance(res["thumbnail_banner"], dict):
            res["thumbnail_banner"]["line1"] = clean_no_emojis(res["thumbnail_banner"].get("line1", "")).upper()
            res["thumbnail_banner"]["line2"] = clean_no_emojis(res["thumbnail_banner"].get("line2", "")).upper()
    return res

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
Bạn là chuyên gia hàng đầu về Sáng tạo Nội Dung Video Ngắn (Facebook Reels, TikTok) tại Việt Nam chuyên về mẹo sức khỏe, bài thuốc dân gian và đời sống gia đình.
TUYỆT ĐỐI KHÔNG đưa tên riêng của người khác hay tên kênh khác (như Văn Cao...) vào tiêu đề, caption, hashtags hay bình luận! Hãy dùng danh xưng chung của kênh ("Kênh em", "Nhà em", "Bà con ơi").

KỊCH BẢN VIDEO ({niche}):
\"\"\"{script}\"\"\"
Tên file video (nếu có): {video_filename}

KHO SẢN PHẨM SHOPEE HIỆN CÓ:
{json.dumps(catalog_summary, ensure_ascii=False, indent=2)}

CÔNG THỨC VIRAL VIDEO SỨC KHỎE TRIỆU VIEW:
1. QUY TẮC DẤU TIẾNG VIỆT BẮT BUỘC (QUAN TRỌNG NHẤT):
   - TẤT CẢ các trường: Tiêu đề (hook_title), 4 tiêu đề kích view (viral_video_titles), 2 dòng chữ ảnh bìa (thumbnail_banner), Mô tả (reels_caption), Bình luận ghim (pinned_comment), và gợi ý sản phẩm BẮT BUỘC 100% PHẢI VIẾT BẰNG TIẾNG VIỆT CÓ ĐẦY ĐỦ DẤU THANH (Ví dụ: "Ăn cơm chan canh: Thói quen rước bệnh dạ dày vào thân, xem ngay kẻo hối!", "ĂN CƠM CHAN CANH", "HẠI DẠ DÀY NGUY HIỂM").
   - TUYỆT ĐỐI CẤM VIẾT TIẾNG VIỆT KHÔNG DẤU (viết "Chan com vao canh", "hai da day", "khong dau" là lỗi nghiêm trọng!).
   - NGOẠI TRỪ DUY NHẤT: Chỉ riêng trường "seo_video_filename" là tên file kỹ thuật tiếng Việt viết thường không dấu nối bằng dấu gạch ngang (ví dụ: 'an-com-chan-canh-hai-da-day.mp4').
2. TONE GIỌNG: Dân dã, mộc mạc, gần gũi như một người em/người cháu trong làng chia sẻ chân thành với bà con ("Bà con ơi", "Nhà em chia sẻ", "Nhiều bác hay chủ quan..."). Tuyệt đối không dùng văn mẫu sách vở hoặc từ ngữ y tế đao to búa lớn.
2. TUÂN THỦ CHÍNH SÁCH META: Tuyệt đối KHÔNG dùng từ cấm (như 'chữa dứt điểm', 'cam kết 100%', 'trị tận gốc', 'chữa khỏi hoàn toàn'). Hãy dùng ngôn ngữ cảnh báo thói quen, mẹo dân gian, bảo vệ sức khỏe chủ động.
3. TIÊU ĐỀ (HOOK): Giật tít đánh thẳng vào thói quen sai lầm + nguy cơ bệnh tật (dưới 80 ký tự). TUYỆT ĐỐI KHÔNG DÙNG BẤT KỲ ICON / EMOJI NÀO (không dùng 🚨, ⚠️, 💡, 🔥...). Phải là chữ viết tự nhiên mộc mạc của người thật.
   Mẫu chuẩn:
   - "[Tên thói quen xấu]: Thói quen rước [Tên bệnh] vào thân, xem ngay kẻo hối!"
   - "Bà con nào hay [Hành động], dừng lại 30s xem ngay kẻo mang họa!"
   - "Sai lầm kinh điển tưởng vô hại nhưng hại [Bộ phận cơ thể] không ngờ!"
4. MÔ TẢ (CAPTION): Ngắn gọn 2 - 3 câu tóm tắt 3 tác hại chính (Thứ nhất... Thứ hai... Thứ ba...). TUYỆT ĐỐI KHÔNG DÙNG BẤT KỲ ICON / EMOJI NÀO. Kèm câu chốt kéo tương tác: "Lưu lại ngay mẹo hay này và chia sẻ cho người thân cùng biết nhé!".
5. HASHTAGS: Bộ 6 - 8 thẻ hashtag chuẩn thuật toán Facebook liên quan trực tiếp đến sức khỏe và chủ đề video (ví dụ: #suckhoe #meosuckhoe #canhbao #meohay #songkhoe #chamsocsuckhoe #suckhoegiadinh). TUYỆT ĐỐI KHÔNG gắn tên riêng của người khác hay tên kênh khác vào hashtag hoặc bài viết!
6. KHỚP NỐI SHOPEE & GỢI Ý 3-5 SẢN PHẨM PHÙ HỢP:
   - Đọc kỹ nỗi đau trong kịch bản để chọn các sản phẩm Shopee phù hợp nhất trong kho đưa vào "selected_product_ids".
   - ĐỒNG THỜI, BẮT BUỘC gợi ý đúng 3 đến 5 sản phẩm Shopee thiết thực nhất, dễ bán nhất, liên quan trực tiếp đến kịch bản vào "missing_recommendations" (kể cả khi trong kho đã có hoặc chưa có món tối ưu). Khán giả xem video này sẽ cần mua gì để bảo vệ sức khỏe hoặc làm theo mẹo?
     Nêu rõ:
     + "product_name": Tên cụ thể dễ tìm (ví dụ: "Muối Thảo Dược Ngâm Chân", "Trà Hoa Cúc Táo Đỏ", "Bình Giữ Nhiệt Inox 316", "Gối Công Thái Học Chống Đau Cổ")
     + "reason": Lý do khán giả xem video này sẽ mua ngay
     + "search_keyword": Từ khóa chuẩn để gõ trên Shopee
     + "category": Nhóm danh mục gợi ý (ví dụ: "Thảo Dược Tự Nhiên", "Chăm Sóc Giấc Ngủ", "Dụng Cụ Sức Khỏe")
   - Viết "pinned_comment" theo công thức: Khen ngợi bà con -> Nhắc lại thói quen tốt -> Gom các sản phẩm tiện lợi giải quyết triệt để thói quen đó (kèm Link Shopee rút gọn). TUYỆT ĐỐI KHÔNG DÙNG BẤT KỲ ICON / EMOJI NÀO (không dùng 👉, 🛒, 📌...). Mỗi sản phẩm trên một dòng định dạng: "- Tên sản phẩm: Link Shopee". Kêu gọi mua một cách tự nhiên, chân tình như người thật.
7. ẢNH BÌA VIDEO 2 DÒNG (THUMBNAIL BANNER CHUẨN VĂN CAO):
   - line1 (chữ vàng): 3 - 5 từ in hoa, giật tít vị thuốc / thói quen (ví dụ: 'TÁC DỤNG CỦA CÂY BẦU', '3 THÓI QUEN BUỔI SÁNG', 'SAI LẦM KHI TẮM ĐÊM').
   - line2 (chữ trắng): 3 - 5 từ in hoa, giật tít căn bệnh / cơ quan / nguy cơ (ví dụ: 'ĐỐI VỚI BỆNH TIỂU ĐƯỜNG', 'HẠI THẬN KHÔ RÁP', 'RƯỚC ĐỘT QUỴ VÀO THÂN').
8. BỘ 4 TIÊU ĐỀ KÍCH VIEW (VIRAL TITLES) & TÊN FILE CHUẨN SEO FACEBOOK:
   - Hãy tạo 4 phương án tiêu đề khác nhau cực kỳ kích thích tò mò và kích view (TUYỆT ĐỐI KHÔNG CÓ ICON / EMOJI):
     1) Cảnh báo nguy hiểm / giật mình
     2) Mẹo vàng thảo dược dân gian
     3) Thói quen sai lầm rước bệnh
     4) Bí quyết chữa lành 0 đồng dễ chia sẻ
   - Kèm 1 tên file video MP4 chuẩn SEO (viết thường không dấu, nối bằng gạch ngang, ví dụ: 'meo-song-khoe-tac-dung-cay-bau-chua-tieu-duong.mp4') để thuật toán nhận diện chủ đề ngay khi upload.

Định dạng JSON trả về bắt buộc (TUYỆT ĐỐI KHÔNG CHỨA BẤT KỲ ICON / EMOJI NÀO TRONG GIÁ TRỊ):
{{
  "hook_title": "string (BẮT BUỘC TIẾNG VIỆT CÓ ĐẦY ĐỦ DẤU, không icon)",
  "viral_video_titles": [
    {{
      "tag": "Cảnh Báo",
      "title": "string (không icon)"
    }},
    {{
      "tag": "Mẹo Vàng",
      "title": "string (không icon)"
    }},
    {{
      "tag": "Sai Lầm",
      "title": "string (không icon)"
    }},
    {{
      "tag": "Bí Quyết 0Đ",
      "title": "string (không icon)"
    }}
  ],
  "seo_video_filename": "string.mp4",
  "thumbnail_banner": {{
    "line1": "DÒNG 1 IN HOA MÀU VÀNG",
    "line2": "DÒNG 2 IN HOA MÀU TRẮNG"
  }},
  "reels_caption": "string (mô tả ngắn 2-3 câu, không icon)",
  "hashtags": ["string"],
  "selected_product_ids": ["string"],
  "missing_recommendations": [
    {{
      "product_name": "string",
      "reason": "string",
      "search_keyword": "string",
      "category": "string"
    }}
  ],
  "pinned_comment": "string (bình luận ghim chân thật, không icon, mỗi sản phẩm định dạng: - Tên SP: Link)"
}}
"""
    # Thử model được chọn, nếu lỗi thì thử model dự phòng
    fallback_model = "gemini-3.1-flash-lite" if model_name == "gemini-3.5-flash-lite" else "gemini-3.5-flash-lite"
    try:
        raw_result = call_gemini_api(api_key, model_name, prompt)
    except Exception as e:
        logger.warning(f"Thử model {model_name} thất bại ({e}), chuyển sang dự phòng {fallback_model}...")
        raw_result = call_gemini_api(api_key, fallback_model, prompt)

    # Tự động kiểm tra: Nếu kịch bản có dấu mà kết quả trả về không có dấu -> Tự động yêu cầu viết lại có dấu
    if has_vietnamese_accents(script) and isinstance(raw_result, dict) and not has_vietnamese_accents(raw_result.get("hook_title", "")):
        logger.warning("Phát hiện Gemini sinh ra Tiêu đề/Nội dung không dấu! Đang tự động yêu cầu viết lại có đầy đủ dấu...")
        strict_accent_prompt = prompt + "\n\nCẢNH BÁO KHẨN CẤP: Kết quả vừa rồi của bạn bị lỗi KHÔNG CÓ DẤU TIẾNG VIỆT. BẮT BUỘC 100% TIÊU ĐỀ, MÔ TẢ, COMMENT, ẢNH BÌA PHẢI VIẾT BẰNG TIẾNG VIỆT CÓ ĐẦY ĐỦ DẤU THANH (Ăn cơm chan canh, hại dạ dày...). Tuyệt đối không được bỏ dấu!"
        try:
            retry_result = call_gemini_api(api_key, fallback_model, strict_accent_prompt)
            if isinstance(retry_result, dict) and has_vietnamese_accents(retry_result.get("hook_title", "")):
                raw_result = retry_result
        except Exception as retry_err:
            logger.warning(f"Lỗi khi retry yêu cầu có dấu: {retry_err}")

    return sanitize_analysis_output(raw_result)

def analyze_photo_post(
    prompt_text: str = "",
    niche: str = "Sức khỏe",
    catalog: List[Dict[str, Any]] = None,
    api_key: str = "",
    model_name: str = "gemini-3.5-flash-lite"
) -> Dict[str, Any]:
    """Phân tích và tạo nội dung bài viết ảnh (Facebook Photo Post) kèm caption, hashtag và link Shopee."""
    catalog = catalog or []
    catalog_summary = []
    for item in catalog:
        catalog_summary.append({
            "id": item.get("id"),
            "name": item.get("name"),
            "affiliate_url": item.get("affiliate_url"),
            "category": item.get("category"),
            "keywords": item.get("keywords", [])
        })

    user_input = prompt_text.strip() if prompt_text else "Chia sẻ mẹo sức khỏe bổ ích, dễ áp dụng hàng ngày cho cả gia đình"

    prompt = f"""
Bạn là chuyên gia Sáng tạo Nội Dung Bài Viết Ảnh Fanpage Facebook ({niche}) tại Việt Nam chuyên về mẹo sức khỏe, thảo dược và đời sống gia đình.
TUYỆT ĐỐI KHÔNG đưa tên riêng của người khác hay tên kênh khác vào bài viết! Dùng danh xưng chung ("Kênh em", "Nhà em", "Bà con ơi").

CHỦ ĐỀ / NỘI DUNG MONG MUỐN:
\"\"\"{user_input}\"\"\"

KHO SẢN PHẨM SHOPEE HIỆN CÓ:
{json.dumps(catalog_summary, ensure_ascii=False, indent=2)}

CÔNG THỨC BÀI VIẾT ẢNH VIRAL CHUẨN MỘC MẠC:
1. BẮT BUỘC TIẾNG VIỆT CÓ ĐẦY ĐỦ DẤU THANH 100%. Tuyệt đối không viết không dấu.
2. TUYỆT ĐỐI KHÔNG DÙNG BẤT KỲ ICON / EMOJI NÀO (không dùng 🌿, 💡, 👉, ⚠️...). Phải là chữ viết tự nhiên mộc mạc như người thật.
3. TIÊU ĐỀ (title): Dưới 80 ký tự, nêu bật thói quen hoặc giải pháp sức khỏe hữu ích.
4. NỘI DUNG (caption): Ngắn gọn 3-5 câu mạch lạc, giải thích rõ nguyên nhân và mẹo khắc phục đơn giản, ngắt dòng thông thoáng dễ đọc. Kèm lời kêu gọi: "Lưu lại ngay mẹo hay này và chia sẻ cho người thân cùng biết nhé!".
5. HASHTAGS: Bộ 5 - 8 thẻ hashtag liên quan (ví dụ: #suckhoe #meosuckhoe #meohay #songkhoe #chamsocsuckhoe).
6. KHỚP NỐI SHOPEE: Chọn 1 - 2 sản phẩm liên quan nhất trong kho vào "selected_product_ids" và viết "pinned_comment" chân thành, mộc mạc. Mỗi sản phẩm trên 1 dòng định dạng: "- Tên sản phẩm: Link Shopee".

Định dạng JSON trả về bắt buộc:
{{
  "title": "string (Tiêu đề có dấu, không icon)",
  "caption": "string (Nội dung bài viết ảnh, không icon)",
  "hashtags": ["string"],
  "selected_product_ids": ["string"],
  "pinned_comment": "string (bình luận ghim mộc mạc, không icon, định dạng: - Tên SP: Link)"
}}
"""
    fallback_model = "gemini-3.1-flash-lite" if model_name == "gemini-3.5-flash-lite" else "gemini-3.5-flash-lite"
    try:
        raw_result = call_gemini_api(api_key, model_name, prompt)
    except Exception as e:
        logger.warning(f"Thử model {model_name} thất bại ({e}), chuyển sang dự phòng {fallback_model}...")
        raw_result = call_gemini_api(api_key, fallback_model, prompt)

    if isinstance(raw_result, dict):
        if "title" in raw_result:
            raw_result["title"] = clean_no_emojis(raw_result["title"])
        if "caption" in raw_result:
            raw_result["caption"] = clean_no_emojis(raw_result["caption"])
        if "pinned_comment" in raw_result:
            raw_result["pinned_comment"] = clean_no_emojis(raw_result["pinned_comment"])

    return raw_result

def remix_post_content(
    original_text: str = "",
    original_image_path: Optional[str] = None,
    writing_style: str = "rustic",
    image_edit_request: str = "",
    niche: str = "Sức khỏe",
    catalog: List[Dict[str, Any]] = None,
    api_key: str = "",
    model_name: str = "gemini-3.5-flash-lite"
) -> Dict[str, Any]:
    """
    Xào nấu toàn diện bài viết của người khác:
    - Viết lại nội dung (caption) hoàn toàn mới 100% theo phong cách yêu cầu.
    - Giật tít tiêu đề mới bắt mắt.
    - Khớp nối sản phẩm Shopee Affiliate phù hợp từ kho.
    - Soi bức ảnh gốc (qua Gemini Vision) và sinh Prompt tiếng Anh chi tiết để sửa/tạo ảnh mới độc quyền.
    """
    import base64
    from pathlib import Path

    catalog = catalog or []
    catalog_summary = []
    for item in catalog:
        catalog_summary.append({
            "id": item.get("id"),
            "name": item.get("name"),
            "affiliate_url": item.get("affiliate_url"),
            "category": item.get("category"),
            "keywords": item.get("keywords", [])
        })

    # Xử lý phong cách viết
    style_guidelines = {
        "rustic": "Phong cách dân dã, chân thành, mộc mạc ('Bà con ơi', 'Kênh em mách bà con'). Gần gũi như người trong gia đình.",
        "humorous": "Phong cách hài hước, dí dỏm, châm biếm nhẹ nhàng, tươi vui kích thích thảo luận bình luận rôm rả.",
        "expert": "Phong cách chuyên gia, bác sĩ gia đình, phân tích nguyên lý khoa học mạch lạc, đáng tin cậy và chỉn chu.",
        "warning": "Phong cách giật tít cảnh báo mạnh mẽ ('Đừng bao giờ...', 'Sai lầm rước họa...'), đánh trúng tâm lý tò mò và thói quen xấu."
    }.get(writing_style, "Phong cách mộc mạc, gần gũi, chân thành")

    # Đọc ảnh gốc nếu có để đưa vào Gemini Multimodal
    image_base64 = None
    image_mime_type = "image/jpeg"
    if original_image_path and os.path.exists(original_image_path):
        p = Path(original_image_path)
        ext = p.suffix.lower()
        if ext in [".png"]:
            image_mime_type = "image/png"
        elif ext in [".webp"]:
            image_mime_type = "image/webp"
        try:
            with open(original_image_path, "rb") as f:
                image_base64 = base64.b64encode(f.read()).decode("utf-8")
        except Exception as img_err:
            logger.warning(f"Không thể đọc file ảnh gốc để phân tích: {img_err}")

    img_prompt_req = f"YÊU CẦU BIẾN HÓA / SỬA ẢNH TỪ NGƯỜI DÙNG: \"{image_edit_request.strip()}\"" if image_edit_request.strip() else "YÊU CẦU SỬA ẢNH: Hãy tạo 1 phiên bản ảnh mới tương tự về ý nghĩa nhưng đổi góc nhìn, đổi bối cảnh hoặc nhân vật để hoàn toàn độc quyền, không dính bản quyền ảnh gốc."

    prompt = f"""
Bạn là chuyên gia Sáng Tạo & Xào Nấu Nội Dung Facebook (Remix & Content Repurposing) triệu view ({niche}).
Nhiệm vụ của bạn là lấy bài viết gốc và hình ảnh gốc của người khác để "xào nấu" lại thành một tác phẩm mới 100% độc quyền, hay hơn bài cũ, cuốn hút hơn và không thể bị quét trùng lặp nội dung.

THÔNG TIN BÀI VIẾT GỐC ĐƯỢC CUNG CẤP:
\"\"\"{original_text.strip() or "Nội dung mẹo sức khỏe, dinh dưỡng hàng ngày"}\"\"\"

PHONG CÁCH VIẾT YÊU CẦU:
{style_guidelines}

{img_prompt_req}

KHO SẢN PHẨM SHOPEE ĐỂ GHÉP LINK AFFILIATE:
{json.dumps(catalog_summary, ensure_ascii=False, indent=2)}

NGUYÊN TẮC BẮT BUỘC:
1. BẮT BUỘC TIẾNG VIỆT ĐẦY ĐỦ DẤU THANH 100%.
2. TUYỆT ĐỐI KHÔNG DÙNG BẤT KỲ ICON / EMOJI NÀO (không dùng icon, không dùng emoji). Viết như lời văn người thật trò chuyện.
3. TIÊU ĐỀ (new_title): Dưới 80 ký tự, giật tít hấp dẫn, khác biệt hoàn toàn với bài gốc.
4. NỘI DUNG (new_caption): Viết lại mới 100% câu từ, 4-6 câu súc tích, ngắt dòng thoáng, dễ đọc trên di động.
5. HASHTAGS: 5 - 8 thẻ hashtag thịnh hành.
6. GHÉP SHOPEE (pinned_comment): Chọn 1 - 2 sản phẩm phù hợp nhất trong kho, viết bình luận ghim mộc mạc định dạng: "- Tên sản phẩm: Link Shopee".
7. PHÂN TÍCH ẢNH (image_analysis): Tóm tắt nội dung/bố cục của bức ảnh gốc được gửi kèm (1-2 câu tiếng Việt).
8. PROMPT TẠO ẢNH AI (ai_image_prompt): Viết một câu prompt tiếng Anh cực kỳ chi tiết, chất lượng cao (Masterpiece, photorealistic, 8k, detailed) để người dùng có thể dán vào Midjourney, FLUX, Imagen hoặc Leonardo sinh ra bức ảnh mới đã thay đổi chi tiết theo yêu cầu.
9. TÓM TẮT THAY ĐỔI (remix_summary): Nêu ngắn gọn 2-3 điểm sáng tạo đã được làm mới so với bài gốc.

Định dạng JSON trả về bắt buộc:
{{
  "new_title": "string (Tiêu đề mới, có dấu, không icon)",
  "new_caption": "string (Nội dung bài viết mới, không icon)",
  "hashtags": ["string"],
  "selected_product_ids": ["string"],
  "pinned_comment": "string (Bình luận ghim Shopee mộc mạc)",
  "image_analysis": "string (Phân tích ảnh gốc)",
  "ai_image_prompt": "string (English prompt for AI image generator)",
  "remix_summary": "string (Tóm tắt đổi mới)"
}}
"""
    fallback_model = "gemini-3.1-flash-lite" if model_name == "gemini-3.5-flash-lite" else "gemini-3.5-flash-lite"
    try:
        raw_result = call_gemini_api(api_key, model_name, prompt, image_base64=image_base64, image_mime_type=image_mime_type)
    except Exception as e:
        logger.warning(f"Thử remix model {model_name} thất bại ({e}), chuyển sang dự phòng {fallback_model}...")
        raw_result = call_gemini_api(api_key, fallback_model, prompt, image_base64=image_base64, image_mime_type=image_mime_type)

    if isinstance(raw_result, dict):
        if "new_title" in raw_result:
            raw_result["new_title"] = clean_no_emojis(raw_result["new_title"])
        if "new_caption" in raw_result:
            raw_result["new_caption"] = clean_no_emojis(raw_result["new_caption"])
        if "pinned_comment" in raw_result:
            raw_result["pinned_comment"] = clean_no_emojis(raw_result["pinned_comment"])

    return raw_result


def remix_news_content(
    api_key: str,
    model_name: str,
    news_text: str,
    news_source: Optional[str] = None,
    image_edit_request: Optional[str] = None,
    tone_style: str = "objective",
    image_base64: Optional[str] = None,
    image_mime_type: str = "image/jpeg"
) -> Dict[str, Any]:
    """
    Xào nấu nội dung tin tức, tạo bài viết mới + kịch bản đọc video 60s
    và tạo Prompt tiếng Anh tối ưu cho Google Flow (labs.google/fx) hoặc Midjourney/FLUX.
    Đảm bảo 100% tiếng Việt chuẩn, không icon, trích dẫn nguồn báo minh bạch.
    """
    source_label = (news_source or "").strip() or "Nguồn tổng hợp báo chí"
    
    style_prompts = {
        "objective": "Báo chí thời sự khách quan, chuẩn mực, từ ngữ đanh thép, tôn trọng sự thật và trung lập.",
        "commentary": "Bình luận xã hội sắc bén, góc nhìn đa chiều, phân tích nguyên nhân và hệ lụy.",
        "storytelling": "Kể chuyện phóng sự đời sống, dẫn dắt lôi cuốn, giàu cảm xúc, chạm đến trái tim người đọc.",
        "urgent": "Bản tin nóng giật gân, tốc độ, giật tít báo động nhưng nghiêm túc, không câu view rẻ tiền."
    }
    selected_style = style_prompts.get(tone_style, style_prompts["objective"])

    img_prompt_req = ""
    if image_edit_request and image_edit_request.strip():
        img_prompt_req = f"YÊU CẦU ĐẶC BIỆT CỦA NGƯỜI DÙNG KHI SỬA ẢNH BẰNG AI: '{image_edit_request.strip()}'."
    else:
        img_prompt_req = "YÊU CẦU SỬA ẢNH: Hãy biến đổi ảnh gốc thành một bức ảnh tin tức/phóng sự mới, thay đổi bối cảnh hoặc góc chụp để không trùng lặp bức ảnh cũ của báo chí."

    prompt = f"""
Bạn là một Biên tập viên Báo chí kỳ cựu và Chuyên gia Prompt AI Đồ họa cấp cao.
Người dùng cung cấp một bản tin tức/bài viết thời sự và hình ảnh đi kèm lấy từ báo chí hoặc mạng xã hội.

NHIỆM VỤ CỦA BẠN:
1. XÀO NẤU LẠI BÀI VIẾT TIN TỨC: Viết lại 100% bằng câu từ mới độc quyền, sắc bén, cuốn hút, TUYỆT ĐỐI KHÔNG SAO CHÉP NGUYÊN VĂN để tránh bị phạt bản quyền.
2. TRÍCH DẪN NGUỒN MINH BẠCH: Cuối bài viết bắt buộc phải có dòng ghi nhận nguồn tin: "(Theo {source_label})" để tuân thủ pháp luật và giữ uy tín cho Fanpage.
3. SOẠN KỊCH BẢN ĐỌC VIDEO (VOICEOVER SCRIPT): Soạn kịch bản đọc ngắn 60 - 75 giây để người dùng tự thu âm giọng đọc hoặc dùng AI lồng tiếng.
4. SOẠN PROMPT SỬA ẢNH CHO GOOGLE FLOW (labs.google/fx) / MIDJOURNEY / FLUX:
   - Phân tích chi tiết bức ảnh gốc (chủ thể, sự kiện, góc máy).
   - Soạn một Prompt tiếng Anh chuyên sâu cho Image-to-Image / Inpainting.
   - Phong cách ảnh: Ảnh phóng sự đời thực (Photojournalism), chuẩn nhiếp ảnh báo chí quốc tế (Reuters, AP style), ánh sáng chân thực, 8k, không có watermark, không có logo cũ.

BẢN TIN GỐC:
\"\"\"{news_text.strip()}\"\"\"

NGUỒN BÁO GỐC: {source_label}

PHONG CÁCH VIẾT: {selected_style}

{img_prompt_req}

NGUYÊN TẮC BẮT BUỘC:
1. Tiếng Việt 100% đầy đủ dấu thanh, từ ngữ báo chí chững chạc, mạch lạc.
2. TUYỆT ĐỐI KHÔNG DÙNG BẤT KỲ EMOJI / ICON NÀO (không mặt cười, không ngón tay chỉ trỏ, không biểu tượng đồ họa).
3. Tiêu đề (news_title): Dưới 85 ký tự, giật tít báo chí thời sự, kích thích người đọc nhưng đúng sự thật.
4. Bài viết hoàn chỉnh (news_caption): 4 - 6 đoạn súc tích, ngắt dòng rõ ràng, kết thúc bằng dòng trích nguồn: "(Theo {source_label})".
5. Kịch bản đọc video (voiceover_script): Có 3 phân đoạn thời gian rõ ràng:
   [00:00 - 00:08] Hook mở đầu
   [00:08 - 00:50] Diễn biến chính
   [00:50 - 01:05] Bình luận & Lời kết
6. Prompt tiếng Anh (google_flow_prompt): Viết chi tiết, chuyên nghiệp bằng tiếng Anh, mô tả chủ thể, bối cảnh mới, ánh sáng, góc máy, camera lens (e.g. 35mm photography, natural lighting, documentary editorial style, hyperrealistic, authentic texture, no text, no watermark, 8k).
7. Hướng dẫn Google Flow (google_flow_guide): 2-3 gạch đầu dòng hướng dẫn người dùng cách copy ảnh và prompt này dán vào Google Flow (labs.google/fx).

Định dạng JSON trả về bắt buộc:
{{
  "news_title": "string (Tiêu đề tin tức mới, có dấu, không icon)",
  "news_caption": "string (Bài viết tin tức xào nấu hoàn chỉnh kèm trích nguồn cuối bài)",
  "voiceover_script": "string (Kịch bản đọc video 60s có mốc thời gian, không icon)",
  "news_hashtags": ["string"],
  "image_analysis": "string (Phân tích ảnh gốc bằng tiếng Việt)",
  "google_flow_prompt": "string (Prompt tiếng Anh chi tiết cho Google Flow / Midjourney / FLUX)",
  "google_flow_guide": "string (Hướng dẫn thao tác nhanh)"
}}
"""
    fallback_model = "gemini-3.1-flash-lite" if model_name == "gemini-3.5-flash-lite" else "gemini-3.5-flash-lite"
    try:
        raw_result = call_gemini_api(api_key, model_name, prompt, image_base64=image_base64, image_mime_type=image_mime_type)
    except Exception as e:
        logger.warning(f"Thử remix tin tức với model {model_name} thất bại ({e}), chuyển sang dự phòng {fallback_model}...")
        raw_result = call_gemini_api(api_key, fallback_model, prompt, image_base64=image_base64, image_mime_type=image_mime_type)

    if isinstance(raw_result, dict):
        if "news_title" in raw_result:
            raw_result["news_title"] = clean_no_emojis(raw_result["news_title"])
        if "news_caption" in raw_result:
            raw_result["news_caption"] = clean_no_emojis(raw_result["news_caption"])
        if "voiceover_script" in raw_result:
            raw_result["voiceover_script"] = clean_no_emojis(raw_result["voiceover_script"])

    return raw_result


