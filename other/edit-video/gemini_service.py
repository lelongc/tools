import os
import re
import json
import base64
import logging
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

NICHE_PROMPTS = {
    "cooking": (
        "Thể loại: VIDEO ẨM THỰC / NẤU ĂN / REVIEW ĐỒ ĂN.\n"
        "Đặc thù: Cần mô tả đúng nguyên liệu, động tác nấu (thái, xào, nêm nếm, đun sôi, đảo đều). "
        "Câu từ phải gần gũi, thơm ngon, kích thích vị giác, tự nhiên như bạn bè chia sẻ công thức nấu nướng."
    ),
    "news": (
        "Thể loại: VIDEO TIN TỨC / SỰ KIỆN NÓNG / DRAMA.\n"
        "Đặc thù: Hook mở đầu giật gân, câu chữ ngắn gọn, dồn dập, kịch tính, nhấn mạnh các mốc sự kiện quan trọng."
    ),
    "tips": (
        "Thể loại: MẸO VẶT CUỘC SỐNG / SỨC KHỎE / ĐỜI SỐNG.\n"
        "Đặc thù: Nêu bật vấn đề thường gặp và đưa ra giải pháp bất ngờ, dễ áp dụng, thuyết phục."
    ),
    "review": (
        "Thể loại: REVIEW SẢN PHẨM / ĐẬP HỘP / CÔNG NGHỆ.\n"
        "Đặc thù: Giọng điệu khách quan, trải nghiệm thực tế, chỉ rõ ưu điểm và điểm cần lưu ý khi mua."
    ),
    "story": (
        "Thể loại: KỂ CHUYỆN / BÍ ẨN / GÂY TÒ MÒ.\n"
        "Đặc thù: Giọng kể lôi cuốn, tạo sự tò mò ngay từ giây đầu tiên, dẫn dắt hồi hộp tới phút cuối."
    )
}

STYLE_PROMPTS = {
    "natural": "Phong cách: Tự nhiên, đời thường, chân thật, dân dã, dễ nghe.",
    "funny": "Phong cách: Hài hước, dí dỏm, pha chút châm biếm duyên dáng, câu từ bắt trend giới trẻ.",
    "dramatic": "Phong cách: Kịch tính, nhấn nhá dồn dập, kích thích trí tò mò cao độ.",
    "concise": "Phong cách: Ngắn gọn, súc tích, đi thẳng vào trọng tâm, không rườm rà."
}

def call_gemini_json(
    api_key: str,
    model_name: str,
    prompt: str,
    audio_base64: Optional[str] = None,
    audio_mime_type: str = "audio/mp3",
    timeout: int = 50
) -> Dict[str, Any]:
    """Gọi Gemini API gửi text hoặc audio và nhận phản hồi JSON."""
    clean_model = model_name.replace("models/", "")
    url = f"{GEMINI_API_BASE}/{clean_model}:generateContent?key={api_key}"

    parts = [{"text": prompt}]
    if audio_base64:
        parts.append({
            "inlineData": {
                "mimeType": audio_mime_type,
                "data": audio_base64
            }
        })

    payload = {
        "contents": [{"parts": parts}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2,
            "topP": 0.95
        }
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json; charset=utf-8"}
    )

    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
            return json.loads(raw_text)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8", errors="replace")
        logger.error(f"Gemini API Error {e.code}: {err_body}")
        raise RuntimeError(f"Lỗi Gemini API ({e.code}): {err_body[:300]}")
    except Exception as e:
        logger.error(f"Lỗi kết nối Gemini: {e}")
        raise RuntimeError(f"Lỗi kết nối Gemini: {e}")

def analyze_and_remix_video_audio(
    api_key: str,
    audio_path: str,
    niche: str = "cooking",
    style: str = "natural",
    model_name: str = "gemini-3.5-flash-lite"
) -> Dict[str, Any]:
    """
    Phân tích file âm thanh bằng Gemini Multimodal Audio:
    1. Lắng nghe và bóc tách câu thoại gốc kèm mốc thời gian (start, end).
    2. Hiểu hành động diễn ra trong video.
    3. Tự động xào nấu (remix) lại kịch bản mới cho từng câu theo đúng thời lượng.
    """
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Không tìm thấy file audio: {audio_path}")

    with open(audio_path, "rb") as f:
        audio_b64 = base64.b64encode(f.read()).decode("utf-8")

    niche_inst = NICHE_PROMPTS.get(niche, NICHE_PROMPTS["cooking"])
    style_inst = STYLE_PROMPTS.get(style, STYLE_PROMPTS["natural"])

    prompt = f"""Bạn là đạo diễn và biên kịch video ngắn (Reels, TikTok, Shorts) triệu view.
Nhiệm vụ của bạn là nghe kỹ đoạn âm thanh của video gốc này và thực hiện 3 việc:
1. Bóc tách toàn bộ lời nói/lồng tiếng gốc theo từng phân đoạn (mốc giây bắt đầu `start` và kết thúc `end` chính xác, tính bằng số thực).
2. Nhận diện tóm tắt hành động tương ứng trong cảnh quay (`action`).
3. VIẾT LẠI (XÀO NẤU / REMIX) toàn bộ kịch bản sang một phiên bản mới lạ, hấp dẫn, giữ nguyên thời lượng tương ứng của từng phân cảnh để khi lồng tiếng mới vào không bị lệch hình.

{niche_inst}
{style_inst}

QUY TẮC ĐỘ DÀI:
- Tốc độ đọc tiếng Việt tự nhiên là khoảng 2.8 - 3.2 từ mỗi giây.
- Ví dụ: Cảnh dài 3 giây thì câu thoại viết lại nên có khoảng 7 - 10 từ. Tuyệt đối không viết quá dài khiến người đọc bị hụt hơi hoặc video chuyển cảnh rồi mà chưa đọc xong!

CẤU TRÚC JSON BẮT BUỘC TRẢ VỀ:
{{
  "video_title": "Tiêu đề video gợi ý cuốn hút",
  "summary": "Tóm tắt ngắn nội dung video",
  "segments": [
    {{
      "id": 1,
      "start": 0.0,
      "end": 3.5,
      "original_text": "Câu thoại gốc nghe được trong audio",
      "remix_text": "Câu thoại mới đã được xào nấu",
      "action": "Tóm tắt hành động trên hình (VD: Cắt hành lá bỏ vào tô)",
      "estimated_words": 9
    }}
  ]
}}"""

    return call_gemini_json(
        api_key=api_key,
        model_name=model_name,
        prompt=prompt,
        audio_base64=audio_b64,
        timeout=55
    )

def remix_single_segment_text(
    api_key: str,
    original_text: str,
    action: str,
    duration: float,
    style: str = "natural",
    model_name: str = "gemini-3.5-flash-lite"
) -> str:
    """Viết lại chỉ 1 câu kịch bản theo phong cách yêu cầu với độ dài khớp số giây."""
    style_inst = STYLE_PROMPTS.get(style, STYLE_PROMPTS["natural"])
    target_words = max(3, int(duration * 3.0))

    prompt = f"""Bạn là chuyên gia viết kịch bản lồng tiếng video ngắn.
Hãy viết lại câu thoại sau đây theo phong cách yêu cầu:
- Câu gốc: "{original_text}"
- Hành động trên cảnh: "{action}"
- Thời lượng cảnh: {duration:.1f} giây.
- Độ dài mục tiêu: Khoảng {target_words} từ (để đọc vừa khít trong {duration:.1f} giây).

{style_inst}

Trả về định dạng JSON:
{{
  "remix_text": "câu mới ngắn gọn, cuốn hút"
}}"""

    res = call_gemini_json(api_key=api_key, model_name=model_name, prompt=prompt, timeout=25)
    return res.get("remix_text", original_text)
