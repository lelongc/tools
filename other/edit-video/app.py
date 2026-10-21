import os
import time
import json
import uuid
import shutil
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from audio_service import (
    extract_audio_for_ai,
    get_media_info,
    trim_silence,
    adjust_audio_tempo_to_fit,
    detect_silence_intervals,
    slice_audio_segment,
    generate_srt_file,
    render_mixed_video
)
from tts_service import generate_speech_for_segment, batch_generate_tts, VOICES
from gemini_service import analyze_and_remix_video_audio, remix_single_segment_text
from capcut_service import export_to_capcut_draft

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ShortsRevoice")

BASE_DIR = Path(__file__).parent.resolve()
UPLOAD_DIR = BASE_DIR / "uploads"
OUTPUT_DIR = BASE_DIR / "outputs"
CONFIG_FILE = BASE_DIR / "config.json"
STATIC_DIR = BASE_DIR / "static"

for d in [UPLOAD_DIR, OUTPUT_DIR, STATIC_DIR]:
    d.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="ShortsRevoice AI Studio", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_config() -> dict:
    if CONFIG_FILE.exists():
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {}

def save_config(cfg: dict):
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(cfg, f, ensure_ascii=False, indent=2)

# Models
class AnalyzeAudioRequest(BaseModel):
    audio_path: str
    niche: str = "cooking"
    style: str = "natural"
    model_name: Optional[str] = None

class RemixSegmentRequest(BaseModel):
    original_text: str
    action: str = ""
    duration: float = 3.0
    style: str = "natural"
    model_name: Optional[str] = None

class TTSAllRequest(BaseModel):
    segments: List[Dict[str, Any]]
    voice: str = "vi-VN-HoaiMyNeural"

class RenderVideoRequest(BaseModel):
    video_path: str
    segments: List[Dict[str, Any]]
    original_audio_volume: float = 0.15
    voice_volume: float = 1.0

class ExportCapCutRequest(BaseModel):
    project_name: str
    video_path: str
    segments: List[Dict[str, Any]]
    original_video_volume: float = 0.15

# Routes
@app.get("/")
def serve_index():
    index_file = STATIC_DIR / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"message": "ShortsRevoice AI Studio API is running."}

@app.get("/api/config")
def get_config():
    return load_config()

@app.post("/api/config")
def update_config(update: dict):
    cfg = load_config()
    cfg.update(update)
    save_config(cfg)
    return {"status": "success", "config": cfg}

@app.post("/api/upload-video")
async def upload_video(file: UploadFile = File(...)):
    """Upload video, lấy metadata và tự động tách audio gửi AI."""
    filename = file.filename or f"video_{int(time.time())}.mp4"
    safe_name = "".join(c for c in filename if c.isalnum() or c in (".", "_", "-"))
    video_path = UPLOAD_DIR / safe_name
    
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    info = get_media_info(str(video_path))
    audio_path = UPLOAD_DIR / f"{video_path.stem}_audio.mp3"
    
    try:
        extract_audio_for_ai(str(video_path), str(audio_path))
        has_audio = True
    except Exception as e:
        logger.warning(f"Không thể tách audio: {e}")
        has_audio = False

    return {
        "status": "success",
        "video_filename": safe_name,
        "video_path": str(video_path).replace("\\", "/"),
        "audio_path": str(audio_path).replace("\\", "/") if has_audio else "",
        "video_url": f"/uploads/{safe_name}",
        "media_info": info
    }

@app.post("/api/analyze-audio")
def analyze_audio(req: AnalyzeAudioRequest):
    """Phân tích âm thanh bằng Gemini Flash: bóc tách mốc giây và kịch bản xào nấu."""
    cfg = load_config()
    api_key = cfg.get("gemini_api_key", "").strip()
    if not api_key:
        raise HTTPException(status_code=400, detail="Chưa cấu hình Gemini API Key!")
        
    model = req.model_name or cfg.get("default_model", "gemini-3.5-flash-lite")
    
    try:
        data = analyze_and_remix_video_audio(
            api_key=api_key,
            audio_path=req.audio_path,
            niche=req.niche,
            style=req.style,
            model_name=model
        )
        return {"status": "success", "data": data}
    except Exception as e:
        logger.error(f"Lỗi phân tích audio: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/remix-segment")
def remix_segment(req: RemixSegmentRequest):
    """Viết lại 1 câu kịch bản theo phong cách yêu cầu."""
    cfg = load_config()
    api_key = cfg.get("gemini_api_key", "").strip()
    if not api_key:
        raise HTTPException(status_code=400, detail="Chưa cấu hình Gemini API Key!")
        
    model = req.model_name or cfg.get("default_model", "gemini-3.5-flash-lite")
    try:
        remixed = remix_single_segment_text(
            api_key=api_key,
            original_text=req.original_text,
            action=req.action,
            duration=req.duration,
            style=req.style,
            model_name=model
        )
        return {"status": "success", "remix_text": remixed}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-tts-segment")
def generate_tts_segment(
    segment_id: int = Form(...),
    text: str = Form(...),
    target_duration: float = Form(...),
    voice: Optional[str] = Form(None)
):
    """Sinh giọng đọc cho 1 câu với auto-trim và tempo-stretch."""
    cfg = load_config()
    selected_voice = voice or cfg.get("default_voice", "vi-VN-HoaiMyNeural")
    out_name = f"voice_seg_{segment_id}_{int(time.time())}.mp3"
    out_path = OUTPUT_DIR / out_name

    try:
        res = generate_speech_for_segment(
            text=text.strip(),
            voice=selected_voice,
            target_duration=target_duration,
            output_path=str(out_path)
        )
        return {
            "status": "success",
            "audio_url": f"/outputs/{out_name}",
            "audio_path": str(out_path).replace("\\", "/"),
            "duration": res.get("duration", target_duration),
            "tempo_ratio": res.get("tempo_ratio", 1.0)
        }
    except Exception as e:
        logger.error(f"TTS segment error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-tts-all")
def generate_tts_all(req: TTSAllRequest):
    """Sinh giọng đọc hàng loạt cho toàn bộ các câu trong kịch bản."""
    batch_dir = OUTPUT_DIR / f"batch_{int(time.time())}"
    batch_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        updated = batch_generate_tts(
            segments=req.segments,
            voice=req.voice,
            output_dir=str(batch_dir)
        )
        for seg in updated:
            if seg.get("audio_path"):
                p = Path(seg["audio_path"])
                seg["audio_url"] = f"/outputs/{batch_dir.name}/{p.name}"
        return {"status": "success", "segments": updated}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload-recording-segment")
async def upload_recording_segment(
    segment_id: int = Form(...),
    target_duration: float = Form(...),
    file: UploadFile = File(...)
):
    """
    Nhận audio thu âm từ micro người dùng cho 1 câu:
    1. Cắt sạch khoảng lặng đầu/đuôi (silenceremove).
    2. Tự động co giãn thời gian (atempo) để khớp chuẩn xác số giây cảnh video.
    """
    raw_name = f"rec_raw_seg_{segment_id}_{int(time.time())}.webm"
    raw_path = UPLOAD_DIR / raw_name
    
    with open(raw_path, "wb") as buf:
        shutil.copyfileobj(file.file, buf)

    trimmed_name = f"rec_trim_seg_{segment_id}_{int(time.time())}.mp3"
    trimmed_path = OUTPUT_DIR / trimmed_name
    
    fitted_name = f"rec_fitted_seg_{segment_id}_{int(time.time())}.mp3"
    fitted_path = OUTPUT_DIR / fitted_name

    try:
        # Cắt khoảng lặng
        trim_silence(str(raw_path), str(trimmed_path))
        orig_info = get_media_info(str(trimmed_path))
        orig_dur = orig_info.get("duration", target_duration)
        
        # Co giãn nhịp đọc nếu lệch
        fit_res = adjust_audio_tempo_to_fit(
            input_path=str(trimmed_path),
            output_path=str(fitted_path),
            target_duration=target_duration
        )
        
        return {
            "status": "success",
            "audio_url": f"/outputs/{fitted_name}",
            "audio_path": str(fitted_path).replace("\\", "/"),
            "original_duration": orig_dur,
            "final_duration": fit_res.get("duration", orig_dur),
            "tempo_ratio": fit_res.get("tempo_ratio", 1.0),
            "adjusted": fit_res.get("adjusted", False)
        }
    except Exception as e:
        logger.error(f"Lỗi xử lý thu âm câu {segment_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload-full-recording")
async def upload_full_recording(
    segments_json: str = Form(...),
    file: UploadFile = File(...)
):
    """
    Nhận file thu âm cả bài của người dùng:
    Dò silence để chia thành các câu, cắt bỏ khoảng lặng thừa và ép khớp vào từng timestamp!
    """
    try:
        segments = json.loads(segments_json)
    except Exception:
        raise HTTPException(status_code=400, detail="segments_json không hợp lệ!")

    raw_path = UPLOAD_DIR / f"full_take_{int(time.time())}_{file.filename}"
    with open(raw_path, "wb") as buf:
        shutil.copyfileobj(file.file, buf)

    batch_dir = OUTPUT_DIR / f"full_take_split_{int(time.time())}"
    batch_dir.mkdir(parents=True, exist_ok=True)

    # Dò khoảng lặng
    silences = detect_silence_intervals(str(raw_path), min_silence_sec=0.30, noise_db=-32.0)
    logger.info(f"Dò được {len(silences)} khoảng lặng trong bản thu full")

    # Tính toán các đoạn nói (speech chunks)
    chunks = []
    prev_end = 0.0
    for s in silences:
        start_sp = prev_end
        end_sp = s["start"]
        if end_sp - start_sp > 0.4:
            chunks.append((start_sp, end_sp))
        prev_end = s["end"]
    
    full_info = get_media_info(str(raw_path))
    if full_info.get("duration", 0) - prev_end > 0.4:
        chunks.append((prev_end, full_info["duration"]))

    logger.info(f"Tách được {len(chunks)} đoạn nói cho {len(segments)} câu kịch bản")

    updated_segments = []
    for i, seg in enumerate(segments):
        seg_id = seg.get("id", i + 1)
        start_t = float(seg.get("start", 0.0))
        end_t = float(seg.get("end", start_t + 2.5))
        target_dur = max(0.8, end_t - start_t)

        out_seg_path = batch_dir / f"user_voice_{seg_id}.mp3"
        seg_copy = dict(seg)

        if i < len(chunks):
            ch_start, ch_end = chunks[i]
            slice_dur = ch_end - ch_start
            slice_tmp = batch_dir / f"slice_tmp_{seg_id}.mp3"
            slice_audio_segment(str(raw_path), str(slice_tmp), ch_start, slice_dur)
            
            # Trim & tempo fit
            trim_tmp = batch_dir / f"trim_tmp_{seg_id}.mp3"
            trim_silence(str(slice_tmp), str(trim_tmp))
            fit_res = adjust_audio_tempo_to_fit(str(trim_tmp), str(out_seg_path), target_duration=target_dur)
            
            seg_copy["audio_path"] = str(out_seg_path).replace("\\", "/")
            seg_copy["audio_url"] = f"/outputs/{batch_dir.name}/{out_seg_path.name}"
            seg_copy["actual_audio_duration"] = fit_res.get("duration", target_dur)
            seg_copy["tempo_ratio"] = fit_res.get("tempo_ratio", 1.0)
        else:
            seg_copy["audio_path"] = ""
            seg_copy["audio_url"] = ""

        updated_segments.append(seg_copy)

    return {"status": "success", "segments": updated_segments}

@app.post("/api/render-video")
def render_video(req: RenderVideoRequest):
    """Render ra video MP4 hoàn chỉnh kèm file SRT."""
    out_video_name = f"remix_final_{int(time.time())}.mp4"
    out_video_path = OUTPUT_DIR / out_video_name
    out_srt_name = f"subtitles_{int(time.time())}.srt"
    out_srt_path = OUTPUT_DIR / out_srt_name

    try:
        generate_srt_file(req.segments, str(out_srt_path))
        render_mixed_video(
            video_path=req.video_path,
            voice_segments=req.segments,
            output_path=str(out_video_path),
            original_audio_volume=req.original_audio_volume,
            voice_volume=req.voice_volume
        )
        return {
            "status": "success",
            "video_url": f"/outputs/{out_video_name}",
            "srt_url": f"/outputs/{out_srt_name}",
            "output_video_path": str(out_video_path).replace("\\", "/")
        }
    except Exception as e:
        logger.error(f"Render video error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/export-capcut")
def export_capcut(req: ExportCapCutRequest):
    """Xuất trực tiếp dự án CapCut Draft."""
    cfg = load_config()
    drafts_root = cfg.get("capcut_draft_path", "D:/YT/vid/CapCut Drafts")
    meta_path = cfg.get("capcut_meta_path", "C:/Users/Acer/AppData/Local/CapCut/User Data/Projects/com.lveditor.draft/root_meta_info.json")

    try:
        res = export_to_capcut_draft(
            project_name=req.project_name or f"Shorts_Remix_{int(time.time())}",
            video_path=req.video_path,
            voice_segments=req.segments,
            drafts_root=drafts_root,
            root_meta_path=meta_path,
            original_video_volume=req.original_video_volume
        )
        return res
    except Exception as e:
        logger.error(f"CapCut export error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Mount static and uploads
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
app.mount("/outputs", StaticFiles(directory=str(OUTPUT_DIR)), name="outputs")

if __name__ == "__main__":
    import uvicorn
    cfg = load_config()
    port = int(cfg.get("server_port", 8008))
    uvicorn.run("app:app", host="127.0.0.1", port=port, reload=True)
