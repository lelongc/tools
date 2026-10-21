import os
import asyncio
import logging
from pathlib import Path
from typing import Dict, Any, List
import edge_tts
from audio_service import get_media_info, trim_silence, adjust_audio_tempo_to_fit

logger = logging.getLogger(__name__)

VOICES = {
    "vi-VN-HoaiMyNeural": "Hoài My (Nữ - Truyền cảm, tự nhiên)",
    "vi-VN-NamMinhNeural": "Nam Minh (Nam - Trầm ấm, dõng dạc)"
}

async def _synthesize_async(text: str, voice: str, output_path: str, rate: str = "+0%", pitch: str = "+0Hz"):
    """Thực hiện gọi edge-tts bất đồng bộ."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    await communicate.save(output_path)

def generate_speech(text: str, voice: str, output_path: str, rate: str = "+0%", pitch: str = "+0Hz") -> str:
    """Tạo audio từ text đồng bộ."""
    asyncio.run(_synthesize_async(text, voice, output_path, rate=rate, pitch=pitch))
    return output_path

def generate_speech_for_segment(
    text: str,
    voice: str,
    target_duration: float,
    output_path: str
) -> Dict[str, Any]:
    """
    Tạo giọng đọc cho một câu và tự động co giãn để khớp với thời lượng phân cảnh.
    1. Tạo audio bằng Edge-TTS.
    2. Cắt khoảng lặng đầu/đuôi (trim silence).
    3. Co giãn thời lượng (time-stretch) nếu câu đọc dài hơn số giây cho phép.
    """
    raw_path = output_path.replace(".mp3", "_raw.mp3")
    trimmed_path = output_path.replace(".mp3", "_trim.mp3")
    
    # 1. Tạo bản thô
    generate_speech(text, voice, raw_path)
    
    # 2. Cắt bỏ khoảng lặng đầu và cuối
    trim_silence(raw_path, trimmed_path)
    
    # 3. Điều chỉnh tempo nếu cần
    result = adjust_audio_tempo_to_fit(
        input_path=trimmed_path,
        output_path=output_path,
        target_duration=target_duration
    )
    
    # Dọn dẹp file tạm
    for p in [raw_path, trimmed_path]:
        if os.path.exists(p) and p != output_path:
            try:
                os.remove(p)
            except Exception:
                pass
                
    result["audio_path"] = output_path
    return result

def batch_generate_tts(
    segments: List[Dict[str, Any]],
    voice: str,
    output_dir: str
) -> List[Dict[str, Any]]:
    """Tạo audio cho toàn bộ danh sách câu thoại trong kịch bản."""
    os.makedirs(output_dir, exist_ok=True)
    updated_segments = []
    
    for i, seg in enumerate(segments):
        text = (seg.get("remix_text") or seg.get("original_text") or "").strip()
        if not text:
            continue
            
        start_t = float(seg.get("start", 0.0))
        end_t = float(seg.get("end", start_t + 2.5))
        duration = max(1.0, end_t - start_t)
        
        seg_id = seg.get("id", i + 1)
        out_file = os.path.join(output_dir, f"voice_seg_{seg_id}.mp3")
        
        try:
            fit_res = generate_speech_for_segment(
                text=text,
                voice=voice,
                target_duration=duration,
                output_path=out_file
            )
            seg_copy = dict(seg)
            seg_copy["audio_path"] = out_file
            seg_copy["actual_audio_duration"] = fit_res.get("duration", duration)
            seg_copy["tempo_ratio"] = fit_res.get("tempo_ratio", 1.0)
            updated_segments.append(seg_copy)
        except Exception as e:
            logger.error(f"Lỗi tạo TTS cho câu {seg_id}: {e}")
            seg_copy = dict(seg)
            seg_copy["tts_error"] = str(e)
            updated_segments.append(seg_copy)
            
    return updated_segments
