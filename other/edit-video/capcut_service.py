import os
import json
import time
import uuid
import shutil
import logging
from pathlib import Path
from typing import Dict, Any, List, Optional
from audio_service import get_media_info

logger = logging.getLogger(__name__)

def make_uuid() -> str:
    """Tạo UUID hoa chuẩn CapCut."""
    return str(uuid.uuid4()).upper()

def export_to_capcut_draft(
    project_name: str,
    video_path: str,
    voice_segments: List[Dict[str, Any]],
    drafts_root: str = "D:/YT/vid/CapCut Drafts",
    root_meta_path: str = "C:/Users/Acer/AppData/Local/CapCut/User Data/Projects/com.lveditor.draft/root_meta_info.json",
    original_video_volume: float = 0.15
) -> Dict[str, Any]:
    """
    Tự động tạo dự án CapCut Draft đầy đủ (gồm video track, audio voiceover track, subtitle text track)
    và đăng ký vào root_meta_info.json để CapCut hiển thị ngay trên màn hình chính!
    """
    os.makedirs(drafts_root, exist_ok=True)
    
    # 1. Tên thư mục dự án
    safe_name = re_name = "".join(c for c in project_name if c.isalnum() or c in (" ", "_", "-")).strip()
    if not safe_name:
        safe_name = f"Remix_{int(time.time())}"
    draft_folder = os.path.join(drafts_root, safe_name)
    os.makedirs(draft_folder, exist_ok=True)
    
    # Lấy thông tin video
    vid_info = get_media_info(video_path)
    vid_dur = vid_info.get("duration", 10.0)
    width = vid_info.get("width", 1080) or 1080
    height = vid_info.get("height", 1920) or 1920
    fps = vid_info.get("fps", 30.0)
    total_us = int(vid_dur * 1000000)

    # 2. Xây dựng materials & tracks
    draft_id = make_uuid()
    now_us = int(time.time() * 1000000)
    
    # Material: Video gốc
    video_mat_id = make_uuid()
    video_material = {
        "audio_fade": None,
        "cartoon_path": "",
        "category_id": "",
        "category_name": "local",
        "check_flag": 63487,
        "crop": {
            "lower_left_x": 0.0, "lower_left_y": 1.0,
            "lower_right_x": 1.0, "lower_right_y": 1.0,
            "upper_left_x": 0.0, "upper_left_y": 0.0,
            "upper_right_x": 1.0, "upper_right_y": 0.0
        },
        "crop_ratio": "free",
        "crop_scale": 1.0,
        "duration": total_us,
        "extra_type_option": 0,
        "formula_id": "",
        "freeze": None,
        "gameplay": None,
        "has_audio": True,
        "height": height,
        "id": video_mat_id,
        "intensifies_audio_path": "",
        "intensifies_path": "",
        "is_unified_beauty_mode": False,
        "material_id": "",
        "material_name": os.path.basename(video_path),
        "material_url": "",
        "path": os.path.abspath(video_path).replace("\\", "/"),
        "type": "video",
        "width": width
    }

    # Video Segment
    video_seg_id = make_uuid()
    video_seg = {
        "cartoon": False,
        "clip": {
            "alpha": 1.0,
            "flip": {"horizontal": False, "vertical": False},
            "rotation": 0.0,
            "scale": {"x": 1.0, "y": 1.0},
            "transform": {"x": 0.0, "y": 0.0}
        },
        "enable_adjust": True,
        "extra_material_refs": [],
        "group_id": "",
        "id": video_seg_id,
        "intensifies_audio": False,
        "is_placeholder": False,
        "material_id": video_mat_id,
        "render_index": 0,
        "reverse": False,
        "source_timerange": {"duration": total_us, "start": 0},
        "speed": 1.0,
        "target_timerange": {"duration": total_us, "start": 0},
        "track_attribute": 0,
        "track_render_index": 0,
        "visible": True,
        "volume": float(original_video_volume)
    }

    video_track = {
        "attribute": 0,
        "flag": 0,
        "id": make_uuid(),
        "is_default_name": True,
        "name": "Video Gốc",
        "segments": [video_seg],
        "type": "video"
    }

    # 3. Audio & Text materials / tracks
    audio_materials = []
    text_materials = []
    audio_segments = []
    text_segments = []

    for seg in voice_segments:
        start_sec = float(seg.get("start", 0.0))
        end_sec = float(seg.get("end", start_sec + 2.0))
        text_content = (seg.get("remix_text") or seg.get("original_text") or "").strip()
        
        start_us = int(start_sec * 1000000)
        dur_us = max(500000, int((end_sec - start_sec) * 1000000))
        
        # Audio track nếu có file audio
        audio_path = seg.get("audio_path")
        if audio_path and os.path.exists(audio_path):
            audio_info = get_media_info(audio_path)
            actual_dur = audio_info.get("duration", (end_sec - start_sec))
            actual_us = int(actual_dur * 1000000)
            
            aud_mat_id = make_uuid()
            aud_mat = {
                "app_id": 0,
                "category_id": "",
                "category_name": "local",
                "check_flag": 1,
                "duration": actual_us,
                "id": aud_mat_id,
                "intensifies_path": "",
                "material_name": os.path.basename(audio_path),
                "name": os.path.basename(audio_path),
                "path": os.path.abspath(audio_path).replace("\\", "/"),
                "source_platform": 0,
                "team_id": "",
                "type": "audio"
            }
            audio_materials.append(aud_mat)
            
            aud_seg = {
                "clip": None,
                "enable_adjust": True,
                "extra_material_refs": [],
                "group_id": "",
                "id": make_uuid(),
                "intensifies_audio": False,
                "material_id": aud_mat_id,
                "render_index": 0,
                "source_timerange": {"duration": actual_us, "start": 0},
                "speed": 1.0,
                "target_timerange": {"duration": actual_us, "start": start_us},
                "track_attribute": 0,
                "track_render_index": 0,
                "visible": True,
                "volume": 1.0
            }
            audio_segments.append(aud_seg)

        # Text material cho Subtitle
        if text_content:
            text_mat_id = make_uuid()
            text_mat = {
                "alignment": 1,
                "background_alpha": 1.0,
                "background_color": "",
                "bold_width": 0.0,
                "content": json.dumps({"text": text_content}),
                "font_size": 15.0,
                "font_title": "none",
                "id": text_mat_id,
                "italic_degree": 0,
                "text_color": "#FFFFFF",
                "type": "text",
                "underline": False
            }
            text_materials.append(text_mat)
            
            text_seg = {
                "caption_info": None,
                "clip": {
                    "alpha": 1.0,
                    "flip": {"horizontal": False, "vertical": False},
                    "rotation": 0.0,
                    "scale": {"x": 1.0, "y": 1.0},
                    "transform": {"x": 0.0, "y": -0.7}
                },
                "enable_adjust": True,
                "extra_material_refs": [],
                "group_id": "",
                "id": make_uuid(),
                "material_id": text_mat_id,
                "render_index": 0,
                "source_timerange": {"duration": dur_us, "start": 0},
                "speed": 1.0,
                "target_timerange": {"duration": dur_us, "start": start_us},
                "track_attribute": 0,
                "track_render_index": 0,
                "visible": True,
                "volume": 1.0
            }
            text_segments.append(text_seg)

    tracks = [video_track]
    if audio_segments:
        tracks.append({
            "attribute": 0,
            "flag": 0,
            "id": make_uuid(),
            "is_default_name": True,
            "name": "Giọng Lồng Tiếng Mới",
            "segments": audio_segments,
            "type": "audio"
        })
    if text_segments:
        tracks.append({
            "attribute": 0,
            "flag": 0,
            "id": make_uuid(),
            "is_default_name": True,
            "name": "Phụ Đề Kịch Bản",
            "segments": text_segments,
            "type": "text"
        })

    # 4. Lưu draft_content.json
    draft_content = {
        "canvas_config": {
            "height": height,
            "ratio": "original",
            "width": width
        },
        "color_space": 0,
        "config": {},
        "cover": None,
        "create_time": now_us,
        "duration": total_us,
        "extra_info": None,
        "fps": float(fps),
        "id": draft_id,
        "materials": {
            "audios": audio_materials,
            "texts": text_materials,
            "videos": [video_material],
            "speeds": []
        },
        "name": safe_name,
        "new_version": "112.0.0",
        "platform": {
            "app_id": 3704,
            "app_source": "capcut",
            "app_version": "3.5.0",
            "os": "windows"
        },
        "relationships": [],
        "tracks": tracks,
        "update_time": now_us,
        "version": 360000
    }

    content_path = os.path.join(draft_folder, "draft_content.json")
    with open(content_path, "w", encoding="utf-8") as f:
        json.dump(draft_content, f, ensure_ascii=False, indent=2)

    # 5. Lưu draft_meta_info.json bên trong thư mục draft
    draft_meta = {
        "draft_cloud_last_action_download": False,
        "draft_cloud_purchase_info": "",
        "draft_cloud_template_id": "",
        "draft_cloud_tutorial_info": "",
        "draft_cloud_videocut_purchase_info": "",
        "draft_cover": "",
        "draft_fold_path": draft_folder.replace("\\", "/"),
        "draft_id": draft_id,
        "draft_is_article_video_draft": False,
        "draft_materials": [],
        "draft_materials_copied_info": [],
        "draft_name": safe_name,
        "draft_root_path": drafts_root.replace("\\", "/"),
        "tm_draft_cloud_completed": "",
        "tm_draft_cloud_modified": 0,
        "tm_draft_create": int(time.time()),
        "tm_draft_modified": int(time.time()),
        "tm_duration": total_us
    }
    meta_path = os.path.join(draft_folder, "draft_meta_info.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(draft_meta, f, ensure_ascii=False, indent=2)

    # 6. Đăng ký vào root_meta_info.json của CapCut nếu file tồn tại
    if os.path.exists(root_meta_path):
        try:
            with open(root_meta_path, "r", encoding="utf-8") as f:
                root_data = json.load(f)
            
            store = root_data.get("all_draft_store", [])
            # Loại bỏ draft cũ cùng id nếu có
            store = [d for d in store if d.get("draft_name") != safe_name and d.get("draft_id") != draft_id]
            
            new_store_entry = {
                "draft_cloud_last_action_download": False,
                "draft_cloud_purchase_info": "",
                "draft_cloud_template_id": "",
                "draft_cloud_tutorial_info": "",
                "draft_cloud_videocut_purchase_info": "",
                "draft_cover": "",
                "draft_fold_path": draft_folder.replace("\\", "/"),
                "draft_id": draft_id,
                "draft_json_file": content_path.replace("\\", "/"),
                "draft_name": safe_name,
                "draft_root_path": drafts_root.replace("\\", "/"),
                "draft_timeline_materials_size": 0,
                "tm_draft_cloud_completed": "",
                "tm_draft_cloud_modified": 0,
                "tm_draft_create": int(time.time()),
                "tm_draft_modified": int(time.time()),
                "tm_duration": total_us
            }
            # Đưa lên đầu danh sách để mở CapCut là thấy ngay trên cùng!
            store.insert(0, new_store_entry)
            root_data["all_draft_store"] = store
            
            with open(root_meta_path, "w", encoding="utf-8") as f:
                json.dump(root_data, f, ensure_ascii=False, indent=2)
            logger.info(f"Đã đăng ký dự án '{safe_name}' vào CapCut root_meta_info.json!")
        except Exception as e:
            logger.warning(f"Không thể cập nhật root_meta_info.json: {e}")

    return {
        "status": "success",
        "draft_name": safe_name,
        "draft_folder": draft_folder,
        "draft_id": draft_id,
        "total_duration_sec": vid_dur,
        "audio_tracks_count": len(audio_segments),
        "text_tracks_count": len(text_segments)
    }
