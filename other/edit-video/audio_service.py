import os
import re
import json
import logging
import subprocess
from pathlib import Path
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

def run_ffmpeg(cmd: List[str]) -> subprocess.CompletedProcess:
    """Chạy lệnh FFmpeg an toàn và log lỗi nếu có."""
    logger.debug("FFmpeg cmd: %s", " ".join(cmd))
    res = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
    if res.returncode != 0:
        logger.error(f"FFmpeg error: {res.stderr}")
        raise RuntimeError(f"FFmpeg thất bại (code {res.returncode}): {res.stderr[-400:]}")
    return res

def get_media_info(file_path: str) -> Dict[str, Any]:
    """Lấy thông tin thời lượng, kích thước video/audio."""
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration:stream=width,height,r_frame_rate,codec_type",
        "-of", "json",
        file_path
    ]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
        data = json.loads(res.stdout)
        duration = float(data.get("format", {}).get("duration", 0.0))
        width = 0
        height = 0
        fps = 30.0
        for s in data.get("streams", []):
            if s.get("codec_type") == "video":
                width = int(s.get("width", 0))
                height = int(s.get("height", 0))
                r_fps = s.get("r_frame_rate", "30/1")
                if "/" in r_fps:
                    num, den = r_fps.split("/")
                    fps = round(float(num) / float(den), 2) if float(den) > 0 else 30.0
                break
        return {
            "duration": round(duration, 2),
            "width": width,
            "height": height,
            "fps": fps
        }
    except Exception as e:
        logger.warning(f"Không thể lấy info bằng ffprobe, fallback sang ffmpeg -i: {e}")
        # Fallback ffmpeg -i
        res = subprocess.run(["ffmpeg", "-i", file_path], capture_output=True, text=True, errors="replace")
        match = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", res.stderr)
        duration = 0.0
        if match:
            h, m, s = match.groups()
            duration = int(h) * 3600 + int(m) * 60 + float(s)
        return {"duration": round(duration, 2), "width": 0, "height": 0, "fps": 30.0}

def extract_audio_for_ai(video_path: str, output_path: str) -> str:
    """Tách âm thanh từ video dạng MP3 16kHz mono nhẹ nhàng, tối ưu gửi AI."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    cmd = [
        "ffmpeg", "-y",
        "-i", video_path,
        "-vn",
        "-ar", "16000",
        "-ac", "1",
        "-ab", "64k",
        output_path
    ]
    run_ffmpeg(cmd)
    return output_path

def trim_silence(input_path: str, output_path: str, threshold_db: float = -35.0) -> str:
    """
    Tự động cắt sạch các khoảng lặng và tiếng thở ngập ngừng ở đầu và cuối file âm thanh.
    Sử dụng silenceremove 2 chiều (đầu + cuối).
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    filter_str = (
        f"silenceremove=start_periods=1:start_duration=0.04:start_threshold={threshold_db}dB:detection=peak,"
        f"areverse,"
        f"silenceremove=start_periods=1:start_duration=0.04:start_threshold={threshold_db}dB:detection=peak,"
        f"areverse"
    )
    cmd = [
        "ffmpeg", "-y",
        "-i", input_path,
        "-af", filter_str,
        output_path
    ]
    run_ffmpeg(cmd)
    return output_path

def adjust_audio_tempo_to_fit(
    input_path: str,
    output_path: str,
    target_duration: float,
    max_stretch: float = 1.35,
    min_stretch: float = 0.85
) -> Dict[str, Any]:
    """
    Tự động co giãn thời lượng âm thanh (Time-Stretching) bằng bộ lọc atempo.
    Giữ nguyên 100% cao độ (pitch), giọng không bị méo tiếng.
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    current_info = get_media_info(input_path)
    cur_dur = current_info.get("duration", 0.0)
    
    if cur_dur <= 0.05 or target_duration <= 0.05:
        # File quá ngắn hoặc lỗi, giữ nguyên
        subprocess.run(["ffmpeg", "-y", "-i", input_path, output_path], capture_output=True)
        return {"tempo_ratio": 1.0, "duration": cur_dur, "adjusted": False}

    ratio = cur_dur / target_duration
    # Giới hạn co giãn an toàn để giữ tự nhiên
    clamped_ratio = max(min_stretch, min(max_stretch, ratio))
    
    if abs(clamped_ratio - 1.0) < 0.04:
        # Lệch dưới 4%, giữ nguyên không cần can thiệp
        subprocess.run(["ffmpeg", "-y", "-i", input_path, output_path], capture_output=True)
        return {"tempo_ratio": 1.0, "duration": cur_dur, "adjusted": False}

    # atempo chỉ hỗ trợ dải 0.5 đến 2.0 trong 1 filter
    cmd = [
        "ffmpeg", "-y",
        "-i", input_path,
        "-af", f"atempo={clamped_ratio:.3f}",
        output_path
    ]
    run_ffmpeg(cmd)
    new_info = get_media_info(output_path)
    return {
        "tempo_ratio": round(clamped_ratio, 3),
        "duration": new_info.get("duration", 0.0),
        "adjusted": True
    }

def detect_silence_intervals(audio_path: str, min_silence_sec: float = 0.35, noise_db: float = -32.0) -> List[Dict[str, float]]:
    """Dò các khoảng lặng trong file âm thanh để phục vụ bổ file thu âm cả bài thành từng câu."""
    cmd = [
        "ffmpeg", "-i", audio_path,
        "-af", f"silencedetect=noise={noise_db}dB:d={min_silence_sec}",
        "-f", "null", "-"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
    lines = res.stderr.split("\n")
    silences = []
    current_start = None
    for line in lines:
        if "silence_start:" in line:
            m = re.search(r"silence_start:\s*([0-9.]+)", line)
            if m:
                current_start = float(m.group(1))
        elif "silence_end:" in line and current_start is not None:
            m = re.search(r"silence_end:\s*([0-9.]+)", line)
            if m:
                end = float(m.group(1))
                silences.append({"start": current_start, "end": end, "duration": end - current_start})
                current_start = None
    return silences

def slice_audio_segment(input_path: str, output_path: str, start_sec: float, duration_sec: float) -> str:
    """Cắt 1 đoạn từ audio."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    cmd = [
        "ffmpeg", "-y",
        "-ss", str(max(0.0, start_sec)),
        "-i", input_path,
        "-t", str(duration_sec),
        output_path
    ]
    run_ffmpeg(cmd)
    return output_path

def generate_srt_file(segments: List[Dict[str, Any]], output_path: str) -> str:
    """Tạo file phụ đề SRT từ danh sách câu kịch bản."""
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    
    def fmt_time(seconds: float) -> str:
        h = int(seconds // 3600)
        m = int((seconds % 3600) // 60)
        s = int(seconds % 60)
        ms = int(round((seconds - int(seconds)) * 1000))
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    lines = []
    idx = 1
    for seg in segments:
        text = (seg.get("remix_text") or seg.get("original_text") or "").strip()
        if not text:
            continue
        start_t = float(seg.get("start", 0.0))
        end_t = float(seg.get("end", start_t + 2.0))
        lines.append(f"{idx}")
        lines.append(f"{fmt_time(start_t)} --> {fmt_time(end_t)}")
        lines.append(text)
        lines.append("")
        idx += 1

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    return output_path

def render_mixed_video(
    video_path: str,
    voice_segments: List[Dict[str, Any]],
    output_path: str,
    original_audio_volume: float = 0.15,
    voice_volume: float = 1.0
) -> str:
    """
    Ghép video gốc với âm thanh giọng đọc mới theo từng mốc giây.
    - Video gốc được điều chỉnh âm lượng (VD: 0.15 để giữ tiếng xèo xèo/nhạc nền gốc).
    - Các file voice segment được delay đúng số mili-giây tương ứng mốc `start`.
    - Tất cả được mix lại bằng FFmpeg amix.
    """
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    
    # Lọc các segment có file audio hợp lệ
    valid_segs = [s for s in voice_segments if s.get("audio_path") and os.path.exists(s.get("audio_path"))]
    
    if not valid_segs:
        # Nếu không có audio mới nào, chỉ điều chỉnh volume video gốc
        cmd = [
            "ffmpeg", "-y",
            "-i", video_path,
            "-filter:a", f"volume={original_audio_volume:.2f}",
            "-c:v", "copy",
            output_path
        ]
        run_ffmpeg(cmd)
        return output_path

    # Xây dựng FFmpeg filter graph phức hợp
    inputs = ["-i", video_path]
    for seg in valid_segs:
        inputs.extend(["-i", seg["audio_path"]])

    filter_complex = []
    
    # Track 0: Âm thanh video gốc (nếu có volume > 0)
    if original_audio_volume > 0.01:
        filter_complex.append(f"[0:a]volume={original_audio_volume:.2f}[bg_audio]")
        mix_inputs = ["[bg_audio]"]
    else:
        mix_inputs = []

    # Các track giọng mới: delay theo start_time (tính bằng ms)
    for i, seg in enumerate(valid_segs, start=1):
        start_ms = int(float(seg.get("start", 0.0)) * 1000)
        filter_complex.append(f"[{i}:a]volume={voice_volume:.2f},adelay={start_ms}|{start_ms}[v_{i}]")
        mix_inputs.append(f"[v_{i}]")

    num_inputs = len(mix_inputs)
    if num_inputs > 1:
        filter_complex.append(f"{''.join(mix_inputs)}amix=inputs={num_inputs}:duration=first:dropout_transition=2[aout]")
        map_audio = ["[aout]"]
    elif num_inputs == 1:
        map_audio = [mix_inputs[0].strip("[]")]
    else:
        map_audio = []

    filter_str = ";".join(filter_complex)
    cmd = ["ffmpeg", "-y"] + inputs + ["-filter_complex", filter_str, "-map", "0:v"]
    if map_audio:
        cmd.extend(["-map", f"[{map_audio[0]}]"])
    cmd.extend(["-c:v", "copy", "-c:a", "aac", "-b:a", "192k", output_path])
    
    run_ffmpeg(cmd)
    return output_path
