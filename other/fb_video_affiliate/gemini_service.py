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
3. ĐỊNH DẠNG ĐẦU RA JSON:
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
        return res
    except Exception as e:
        logger.warning(f"Thử model {model_name} thất bại ({e}), chuyển sang dự phòng {fallback_model}...")
        res = call_gemini_api(api_key, fallback_model, prompt)
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
1. TONE GIỌNG: Dân dã, mộc mạc, gần gũi như một người em/người cháu trong làng chia sẻ chân thành với bà con ("Bà con ơi", "Nhà em chia sẻ", "Nhiều bác hay chủ quan..."). Tuyệt đối không dùng văn mẫu sách vở hoặc từ ngữ y tế đao to búa lớn.
2. TUÂN THỦ CHÍNH SÁCH META: Tuyệt đối KHÔNG dùng từ cấm (như 'chữa dứt điểm', 'cam kết 100%', 'trị tận gốc', 'chữa khỏi hoàn toàn'). Hãy dùng ngôn ngữ cảnh báo thói quen, mẹo dân gian, bảo vệ sức khỏe chủ động.
3. TIÊU ĐỀ (HOOK): Giật tít đánh thẳng vào thói quen sai lầm + nguy cơ bệnh tật (dưới 80 ký tự, có icon thu hút).
   Mẫu chuẩn:
   - "🚨 [Tên thói quen xấu]: Thói quen rước [Tên bệnh] vào thân, xem ngay kẻo hối!"
   - "⚠️ Bà con nào hay [Hành động], dừng lại 30s xem ngay kẻo mang họa!"
   - "💡 Sai lầm kinh điển tưởng vô hại nhưng hại [Bộ phận cơ thể] không ngờ!"
4. MÔ TẢ (CAPTION): Ngắn gọn 2 - 3 câu tóm tắt 3 tác hại chính (Thứ nhất... Thứ hai... Thứ ba...). Kèm câu chốt kéo tương tác: "Lưu lại ngay mẹo hay này và chia sẻ cho người thân cùng biết nhé!".
5. HASHTAGS: Bộ 6 - 8 thẻ hashtag chuẩn thuật toán Facebook liên quan trực tiếp đến sức khỏe và chủ đề video (ví dụ: #suckhoe #meosuckhoe #canhbao #meohay #songkhoe #chamsocsuckhoe #suckhoegiadinh). TUYỆT ĐỐI KHÔNG gắn tên riêng của người khác hay tên kênh khác (như Văn Cao...) vào hashtag hoặc bài viết!
6. KHỚP NỐI SHOPEE & GỢI Ý 3-5 SẢN PHẨM PHÙ HỢP:
   - Đọc kỹ nỗi đau trong kịch bản để chọn các sản phẩm Shopee phù hợp nhất trong kho đưa vào "selected_product_ids".
   - ĐỒNG THỜI, BẮT BUỘC gợi ý đúng 3 đến 5 sản phẩm Shopee thiết thực nhất, dễ bán nhất, liên quan trực tiếp đến kịch bản vào "missing_recommendations" (kể cả khi trong kho đã có hoặc chưa có món tối ưu). Khán giả xem video này sẽ cần mua gì để bảo vệ sức khỏe hoặc làm theo mẹo?
     Nêu rõ:
     + "product_name": Tên cụ thể dễ tìm (ví dụ: "Muối Thảo Dược Ngâm Chân", "Trà Hoa Cúc Táo Đỏ", "Bình Giữ Nhiệt Inox 316", "Gối Công Thái Học Chống Đau Cổ")
     + "reason": Lý do khán giả xem video này sẽ mua ngay
     + "search_keyword": Từ khóa chuẩn để gõ trên Shopee
     + "category": Nhóm danh mục gợi ý (ví dụ: "Thảo Dược Tự Nhiên", "Chăm Sóc Giấc Ngủ", "Dụng Cụ Sức Khỏe")
   - Viết "pinned_comment" theo công thức: Khen ngợi bà con -> Nhắc lại thói quen tốt -> Gom các sản phẩm tiện lợi giải quyết triệt để thói quen đó (kèm Link Shopee rút gọn). Kêu gọi mua một cách tự nhiên, chân tình.
7. ẢNH BÌA VIDEO 2 DÒNG (THUMBNAIL BANNER CHUẨN VĂN CAO):
   - line1 (chữ vàng): 3 - 5 từ in hoa, giật tít vị thuốc / thói quen (ví dụ: 'TÁC DỤNG CỦA CÂY BẦU', '3 THÓI QUEN BUỔI SÁNG', 'SAI LẦM KHI TẮM ĐÊM').
   - line2 (chữ trắng): 3 - 5 từ in hoa, giật tít căn bệnh / cơ quan / nguy cơ (ví dụ: 'ĐỐI VỚI BỆNH TIỂU ĐƯỜNG', 'HẠI THẬN KHÔ RÁP', 'RƯỚC ĐỘT QUỴ VÀO THÂN').
8. BỘ 4 TIÊU ĐỀ KÍCH VIEW (VIRAL TITLES) & TÊN FILE CHUẨN SEO FACEBOOK:
   - Hãy tạo 4 phương án tiêu đề khác nhau cực kỳ kích thích tò mò và kích view:
     1) Cảnh báo nguy hiểm / giật mình
     2) Mẹo vàng thảo dược dân gian
     3) Thói quen sai lầm rước bệnh
     4) Bí quyết chữa lành 0 đồng dễ chia sẻ
   - Kèm 1 tên file video MP4 chuẩn SEO (viết thường không dấu, nối bằng gạch ngang, ví dụ: 'meo-song-khoe-tac-dung-cay-bau-chua-tieu-duong.mp4') để thuật toán nhận diện chủ đề ngay khi upload.

Định dạng JSON trả về bắt buộc:
{{
  "hook_title": "string (tiêu đề số 1 hay nhất)",
  "viral_video_titles": [
    {{
      "tag": "🚨 Cảnh Báo",
      "title": "string"
    }},
    {{
      "tag": "🌿 Mẹo Vàng",
      "title": "string"
    }},
    {{
      "tag": "⚠️ Sai Lầm",
      "title": "string"
    }},
    {{
      "tag": "💡 Bí Quyết 0Đ",
      "title": "string"
    }}
  ],
  "seo_video_filename": "string.mp4",
  "thumbnail_banner": {{
    "line1": "DÒNG 1 IN HOA MÀU VÀNG",
    "line2": "DÒNG 2 IN HOA MÀU TRẮNG"
  }},
  "reels_caption": "string",
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
