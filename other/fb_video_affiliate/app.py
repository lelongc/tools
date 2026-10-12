"""
FastAPI Server - FB Video Reels & Shopee Affiliate Automation Hub
"""
import os
import json
import time
import uuid
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

from gemini_service import analyze_and_match, generate_new_script, clean_no_emojis, analyze_photo_post
from fb_service import FacebookReelsPublisher
from scheduler_service import (
    start_scheduler,
    stop_scheduler,
    get_scheduled_tasks,
    add_scheduled_task,
    delete_scheduled_task,
    get_scheduled_task,
    update_task_status
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
UPLOAD_DIR = BASE_DIR / "uploads"
CONFIG_FILE = BASE_DIR / "config.json"
PRODUCTS_FILE = DATA_DIR / "products.json"
HISTORY_FILE = DATA_DIR / "history.json"

DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="FB Reels & Shopee Affiliate Automation Hub")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_json(filepath: Path, default_val: Any) -> Any:
    if not filepath.exists():
        save_json(filepath, default_val)
        return default_val
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error reading {filepath}: {e}")
        return default_val

def save_json(filepath: Path, data: Any):
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Models
class AnalyzeRequest(BaseModel):
    script: str
    niche: str = "Sức khỏe & Đời sống (Bán hàng Affiliate)"
    model_name: Optional[str] = None
    video_filename: Optional[str] = ""

class GenerateScriptRequest(BaseModel):
    topic: Optional[str] = ""
    model_name: Optional[str] = None

class ProductItem(BaseModel):
    id: Optional[str] = None
    name: str
    affiliate_url: str
    category: str
    keywords: List[str] = []
    notes: Optional[str] = ""

class PublishRequest(BaseModel):
    video_path: Optional[str] = ""
    thumbnail_path: Optional[str] = ""
    title: str
    caption: str
    hashtags: List[str]
    pinned_comment: str
    selected_product_ids: List[str] = []
    script: Optional[str] = ""
    niche: Optional[str] = "Sức khỏe"
    target_page_id: Optional[str] = None
    is_scheduled: Optional[bool] = False
    scheduled_time: Optional[str] = ""
    meta_cloud_schedule: Optional[bool] = False
    golden_slot_label: Optional[str] = ""

class PublishPhotoRequest(BaseModel):
    photo_path: str
    caption: str
    title: Optional[str] = ""
    hashtags: List[str] = []
    pinned_comment: str = ""
    selected_product_ids: List[str] = []
    target_page_id: Optional[str] = None
    is_scheduled: Optional[bool] = False
    scheduled_time: Optional[str] = ""
    meta_cloud_schedule: Optional[bool] = False
    golden_slot_label: Optional[str] = ""

class AnalyzePhotoRequest(BaseModel):
    photo_path: Optional[str] = ""
    prompt: Optional[str] = ""
    niche: Optional[str] = "Sức khỏe"

class PageItem(BaseModel):
    id: str
    name: Optional[str] = ""
    access_token: str
    is_active: Optional[bool] = False

class VerifyPageRequest(BaseModel):
    page_id: Optional[str] = None
    id: Optional[str] = None
    access_token: str

class ConfigUpdate(BaseModel):
    gemini_api_key: Optional[str] = None
    default_model: Optional[str] = None
    page_id: Optional[str] = None
    page_access_token: Optional[str] = None
    simulation_mode: Optional[bool] = None
    active_page_id: Optional[str] = None

def get_facebook_publisher(target_page_id: Optional[str] = None) -> FacebookReelsPublisher:
    """Khởi tạo publisher cho một Fanpage cụ thể hoặc Fanpage đang active."""
    cfg = load_json(CONFIG_FILE, {})
    fb_cfg = cfg.get("facebook", {})
    sim_mode = fb_cfg.get("simulation_mode", True)
    pages = fb_cfg.get("pages", [])
    selected_page = None

    if target_page_id:
        for p in pages:
            if p.get("id") == target_page_id:
                selected_page = p
                break

    if not selected_page:
        active_id = fb_cfg.get("active_page_id") or fb_cfg.get("page_id")
        for p in pages:
            if p.get("id") == active_id or p.get("is_active"):
                selected_page = p
                break

    if selected_page:
        return FacebookReelsPublisher(
            page_id=selected_page.get("id", ""),
            page_access_token=selected_page.get("access_token", ""),
            simulation_mode=sim_mode
        )

    return FacebookReelsPublisher(
        page_id=fb_cfg.get("page_id", ""),
        page_access_token=fb_cfg.get("page_access_token", ""),
        simulation_mode=sim_mode
    )

# Endpoints
@app.get("/api/config")
def get_config():
    cfg = load_json(CONFIG_FILE, {})
    fb_cfg = cfg.get("facebook", {})
    token = fb_cfg.get("page_access_token", "")
    masked_token = f"{token[:8]}...{token[-6:]}" if len(token) > 16 else token

    pages = fb_cfg.get("pages", [])
    active_page_id = fb_cfg.get("active_page_id") or fb_cfg.get("page_id", "")

    masked_pages = []
    for p in pages:
        p_tok = p.get("access_token", "")
        m_tok = f"{p_tok[:8]}...{p_tok[-6:]}" if len(p_tok) > 16 else p_tok
        is_act = (p.get("id") == active_page_id) or p.get("is_active", False)
        masked_pages.append({
            "id": p.get("id"),
            "name": p.get("name", "Fanpage"),
            "masked_token": m_tok,
            "is_active": is_act
        })

    return {
        "gemini_api_key": cfg.get("gemini_api_key", ""),
        "default_model": cfg.get("default_model", "gemini-3.5-flash-lite"),
        "available_models": cfg.get("available_models", []),
        "facebook": {
            "page_id": fb_cfg.get("page_id", ""),
            "page_access_token": token,
            "masked_token": masked_token,
            "simulation_mode": fb_cfg.get("simulation_mode", True),
            "active_page_id": active_page_id,
            "pages": masked_pages
        }
    }

@app.post("/api/config")
def update_config(update: ConfigUpdate):
    cfg = load_json(CONFIG_FILE, {})
    if update.gemini_api_key is not None:
        cfg["gemini_api_key"] = update.gemini_api_key.strip()
    if update.default_model is not None:
        cfg["default_model"] = update.default_model.strip()
    if "facebook" not in cfg:
        cfg["facebook"] = {}
    if update.page_id is not None:
        cfg["facebook"]["page_id"] = update.page_id.strip()
    if update.page_access_token is not None:
        cfg["facebook"]["page_access_token"] = update.page_access_token.strip()
    if update.simulation_mode is not None:
        cfg["facebook"]["simulation_mode"] = update.simulation_mode
    if update.active_page_id is not None:
        cfg["facebook"]["active_page_id"] = update.active_page_id.strip()

    save_json(CONFIG_FILE, cfg)
    return {"status": "success", "message": "Đã lưu cài đặt cấu hình thành công!"}

@app.get("/api/facebook/pages")
def get_facebook_pages():
    cfg = load_json(CONFIG_FILE, {})
    fb_cfg = cfg.get("facebook", {})
    pages = fb_cfg.get("pages", [])
    active_id = fb_cfg.get("active_page_id") or fb_cfg.get("page_id", "")

    result = []
    for p in pages:
        tok = p.get("access_token", "")
        masked = f"{tok[:8]}...{tok[-6:]}" if len(tok) > 16 else tok
        result.append({
            "id": p.get("id"),
            "name": p.get("name", "Fanpage"),
            "masked_token": masked,
            "is_active": (p.get("id") == active_id)
        })
    return {"active_page_id": active_id, "pages": result}

@app.post("/api/facebook/pages")
def add_or_update_facebook_page(item: PageItem):
    cfg = load_json(CONFIG_FILE, {})
    if "facebook" not in cfg:
        cfg["facebook"] = {}

    pages = cfg["facebook"].get("pages", [])
    p_id = item.id.strip()
    p_tok = item.access_token.strip()
    p_name = item.name.strip() if item.name else ""

    # Tự động xác thực qua Graph API nếu chưa có tên
    verify_res = FacebookReelsPublisher.verify_page(p_id, p_tok)
    if not verify_res.get("valid"):
        raise HTTPException(status_code=400, detail=f"Không thể kết nối đến Page {p_id}: {verify_res.get('error')}")

    if not p_name and verify_res.get("name"):
        p_name = verify_res.get("name")

    existing = False
    for p in pages:
        if p.get("id") == p_id:
            p["name"] = p_name or p.get("name")
            p["access_token"] = p_tok
            if item.is_active:
                p["is_active"] = True
            existing = True
            break

    if not existing:
        pages.append({
            "id": p_id,
            "name": p_name or f"Page {p_id}",
            "access_token": p_tok,
            "is_active": item.is_active or (len(pages) == 0)
        })

    if item.is_active or len(pages) == 1:
        cfg["facebook"]["active_page_id"] = p_id
        cfg["facebook"]["page_id"] = p_id
        cfg["facebook"]["page_access_token"] = p_tok
        for p in pages:
            p["is_active"] = (p.get("id") == p_id)

    cfg["facebook"]["pages"] = pages
    save_json(CONFIG_FILE, cfg)
    return {"status": "success", "message": f"Đã lưu Fanpage '{p_name}' thành công!", "page": {"id": p_id, "name": p_name}}

@app.delete("/api/facebook/pages/{page_id}")
def delete_facebook_page(page_id: str):
    cfg = load_json(CONFIG_FILE, {})
    fb_cfg = cfg.get("facebook", {})
    pages = fb_cfg.get("pages", [])

    new_pages = [p for p in pages if p.get("id") != page_id]
    if len(new_pages) == len(pages):
        raise HTTPException(status_code=404, detail="Không tìm thấy Fanpage cần xóa")

    if fb_cfg.get("active_page_id") == page_id:
        if new_pages:
            new_pages[0]["is_active"] = True
            fb_cfg["active_page_id"] = new_pages[0]["id"]
            fb_cfg["page_id"] = new_pages[0]["id"]
            fb_cfg["page_access_token"] = new_pages[0]["access_token"]
        else:
            fb_cfg["active_page_id"] = ""
            fb_cfg["page_id"] = ""
            fb_cfg["page_access_token"] = ""

    fb_cfg["pages"] = new_pages
    cfg["facebook"] = fb_cfg
    save_json(CONFIG_FILE, cfg)
    return {"status": "success", "message": "Đã xóa Fanpage thành công!"}

@app.post("/api/facebook/pages/{page_id}/activate")
def activate_facebook_page(page_id: str):
    cfg = load_json(CONFIG_FILE, {})
    fb_cfg = cfg.get("facebook", {})
    pages = fb_cfg.get("pages", [])

    found = False
    for p in pages:
        if p.get("id") == page_id:
            p["is_active"] = True
            fb_cfg["active_page_id"] = page_id
            fb_cfg["page_id"] = page_id
            fb_cfg["page_access_token"] = p.get("access_token", "")
            found = True
        else:
            p["is_active"] = False

    if not found:
        raise HTTPException(status_code=404, detail="Không tìm thấy Fanpage này")

    fb_cfg["pages"] = pages
    cfg["facebook"] = fb_cfg
    save_json(CONFIG_FILE, cfg)
    return {"status": "success", "message": f"Đã chuyển sang quản lý Fanpage {page_id}!"}

@app.post("/api/facebook/pages/verify")
def verify_facebook_page(item: VerifyPageRequest):
    target_id = (item.page_id or item.id or "").strip()
    res = FacebookReelsPublisher.verify_page(target_id, item.access_token.strip())
    return res


@app.get("/api/products")
def get_products():
    return load_json(PRODUCTS_FILE, [])

@app.post("/api/products")
def add_product(prod: ProductItem):
    products = load_json(PRODUCTS_FILE, [])
    new_id = f"prod_{int(time.time())}_{uuid.uuid4().hex[:4]}"
    item = {
        "id": new_id,
        "name": prod.name.strip(),
        "affiliate_url": prod.affiliate_url.strip(),
        "category": prod.category.strip(),
        "keywords": [k.strip() for k in prod.keywords if k.strip()],
        "notes": prod.notes.strip() if prod.notes else "",
        "use_count": 0,
        "created_at": time.strftime("%Y-%m-%d")
    }
    products.insert(0, item)
    save_json(PRODUCTS_FILE, products)
    return {"status": "success", "product": item}

@app.put("/api/products/{prod_id}")
def update_product(prod_id: str, prod: ProductItem):
    products = load_json(PRODUCTS_FILE, [])
    for idx, p in enumerate(products):
        if p.get("id") == prod_id:
            products[idx]["name"] = prod.name.strip()
            products[idx]["affiliate_url"] = prod.affiliate_url.strip()
            products[idx]["category"] = prod.category.strip()
            products[idx]["keywords"] = [k.strip() for k in prod.keywords if k.strip()]
            products[idx]["notes"] = prod.notes.strip() if prod.notes else ""
            save_json(PRODUCTS_FILE, products)
            return {"status": "success", "product": products[idx]}
    raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")

@app.delete("/api/products/{prod_id}")
def delete_product(prod_id: str):
    products = load_json(PRODUCTS_FILE, [])
    filtered = [p for p in products if p.get("id") != prod_id]
    save_json(PRODUCTS_FILE, filtered)
    return {"status": "success", "message": "Đã xóa sản phẩm khỏi kho"}

@app.post("/api/upload-video")
async def upload_video(file: UploadFile = File(...)):
    filename = f"{int(time.time())}_{file.filename}"
    target_path = UPLOAD_DIR / filename
    with open(target_path, "wb") as f:
        content = await file.read()
        f.write(content)
    return {
        "status": "success",
        "filename": file.filename,
        "saved_path": str(target_path),
        "size_bytes": len(content)
    }

@app.post("/api/generate-script")
def api_generate_script(req: GenerateScriptRequest):
    cfg = load_json(CONFIG_FILE, {})
    api_key = cfg.get("gemini_api_key", "").strip()
    if not api_key:
        raise HTTPException(status_code=400, detail="Chưa cấu hình Gemini API Key!")
    model_name = req.model_name or cfg.get("default_model", "gemini-3.5-flash-lite")
    try:
        res = generate_new_script(api_key=api_key, model_name=model_name, topic=req.topic or "")
        if isinstance(res, dict):
            return {
                "status": "success",
                "script": res.get("script", ""),
                "topic": res.get("topic", ""),
                "thumbnail_banner": res.get("thumbnail_banner", {})
            }
        return {"status": "success", "script": res}
    except Exception as e:
        logger.error(f"Generate script error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze")
def analyze_script(req: AnalyzeRequest):
    cfg = load_json(CONFIG_FILE, {})
    api_key = cfg.get("gemini_api_key", "").strip()
    if not api_key:
        raise HTTPException(status_code=400, detail="Chưa cấu hình Gemini API Key!")

    model_name = req.model_name or cfg.get("default_model", "gemini-3.5-flash-lite")
    catalog = load_json(PRODUCTS_FILE, [])

    try:
        result = analyze_and_match(
            api_key=api_key,
            script=req.script,
            niche=req.niche,
            catalog=catalog,
            model_name=model_name,
            video_filename=req.video_filename or ""
        )
        return {"status": "success", "data": result}
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def execute_publish_task(task_data: dict) -> dict:
    """Hàm ủy quyền được Scheduler Worker gọi khi đến giờ hẹn đăng bài."""
    publisher = get_facebook_publisher(task_data.get("target_page_id"))
    post_type = task_data.get("post_type", "reel")

    clean_caption = clean_no_emojis(task_data.get("caption", ""))
    clean_comment = clean_no_emojis(task_data.get("pinned_comment", ""))
    clean_title = clean_no_emojis(task_data.get("title", ""))

    if post_type == "photo":
        fb_res = publisher.publish_photo_with_comment(
            photo_path=task_data.get("photo_path", ""),
            caption=clean_caption,
            hashtags=task_data.get("hashtags", []),
            pinned_comment=clean_comment
        )
    else:
        fb_res = publisher.publish_reel_with_comment(
            video_path=task_data.get("video_path", ""),
            title=clean_title,
            caption=clean_caption,
            hashtags=task_data.get("hashtags", []),
            pinned_comment=clean_comment,
            thumbnail_path=task_data.get("thumbnail_path", "")
        )

    # Cập nhật số lần dùng sản phẩm
    prod_ids = task_data.get("selected_product_ids", [])
    if prod_ids:
        products = load_json(PRODUCTS_FILE, [])
        for p in products:
            if p.get("id") in prod_ids:
                p["use_count"] = p.get("use_count", 0) + 1
        save_json(PRODUCTS_FILE, products)

    # Lưu vào lịch sử bài đăng
    history = load_json(HISTORY_FILE, [])
    record = {
        "id": f"hist_{int(time.time())}_{uuid.uuid4().hex[:4]}",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "post_type": post_type,
        "niche": task_data.get("niche", "Sức khỏe"),
        "script": task_data.get("script", ""),
        "video_path": task_data.get("video_path", ""),
        "photo_path": task_data.get("photo_path", ""),
        "thumbnail_path": task_data.get("thumbnail_path", ""),
        "title": clean_title,
        "caption": clean_caption,
        "hashtags": task_data.get("hashtags", []),
        "pinned_comment": clean_comment,
        "selected_product_ids": prod_ids,
        "facebook_result": fb_res
    }
    history.insert(0, record)
    save_json(HISTORY_FILE, history)
    return fb_res

def execute_comment_task(task_data: dict) -> Optional[dict]:
    """Hàm tự động bình luận Shopee cho bài viết Meta Cloud khi đến giờ phát sóng."""
    video_id = task_data.get("facebook_result", {}).get("video_id") or task_data.get("facebook_result", {}).get("post_id")
    comment = task_data.get("pinned_comment", "")
    if not video_id or not comment:
        return None

    publisher = get_facebook_publisher(task_data.get("target_page_id"))
    token = publisher.token
    if not token or publisher.simulation_mode:
        logger.info(f"[Simulation] Đã giả lập tự động ghim bình luận Shopee cho bài viết {video_id}")
        return {"id": f"sim_comment_{int(time.time())}"}

    import requests
    GRAPH_API_BASE = "https://graph.facebook.com/v21.0"
    url = f"{GRAPH_API_BASE}/{video_id}/comments"
    try:
        resp = requests.post(url, data={"access_token": token, "message": comment}, timeout=30)
        data = resp.json()
        if "id" in data:
            logger.info(f"Đã tự động ghim bình luận Shopee cho bài viết Meta Cloud {video_id}: {data['id']}")
            return data
        else:
            logger.warning(f"Chưa thể ghim bình luận cho bài viết Meta Cloud {video_id}: {resp.text}")
            return None
    except Exception as e:
        logger.error(f"Lỗi kết nối ghim bình luận bài viết Meta Cloud: {e}")
        return None

@app.post("/api/publish")
def publish_post(req: PublishRequest):
    publisher = get_facebook_publisher(req.target_page_id)

    clean_title = clean_no_emojis(req.title)
    clean_caption = clean_no_emojis(req.caption)
    clean_comment = clean_no_emojis(req.pinned_comment)

    # Xử lý Hẹn Giờ Đăng (Scheduled Publishing)
    if req.is_scheduled and req.scheduled_time:
        try:
            clean_time = req.scheduled_time.replace("T", " ")
            if len(clean_time) == 16:
                clean_time += ":00"
            dt = datetime.strptime(clean_time, "%Y-%m-%d %H:%M:%S")
            target_ts = int(dt.timestamp())
            now_ts = int(time.time())

            if target_ts <= now_ts + 45:
                raise HTTPException(status_code=400, detail="Thời gian hẹn giờ phải lớn hơn thời điểm hiện tại ít nhất 1 phút!")

            # Lựa chọn 1: Meta Cloud Scheduling
            if req.meta_cloud_schedule:
                if target_ts < now_ts + 600:
                    raise HTTPException(status_code=400, detail="Chính sách Meta Cloud yêu cầu thời gian hẹn trước tối thiểu 10-15 phút!")

                fb_res = publisher.publish_reel_with_comment(
                    video_path=req.video_path,
                    title=clean_title,
                    caption=clean_caption,
                    hashtags=req.hashtags,
                    pinned_comment=clean_comment,
                    thumbnail_path=req.thumbnail_path,
                    scheduled_publish_time=target_ts
                )
                task = add_scheduled_task({
                    "target_timestamp": target_ts,
                    "target_time_str": clean_time,
                    "golden_slot_label": req.golden_slot_label or "",
                    "meta_cloud_schedule": True,
                    "post_type": "reel",
                    "target_page_id": req.target_page_id or publisher.page_id,
                    "video_path": req.video_path,
                    "thumbnail_path": req.thumbnail_path,
                    "title": clean_title,
                    "caption": clean_caption,
                    "hashtags": req.hashtags,
                    "pinned_comment": clean_comment,
                    "selected_product_ids": req.selected_product_ids,
                    "script": req.script,
                    "niche": req.niche,
                    "status": "pending",
                    "facebook_result": fb_res
                })
                return {
                    "status": "scheduled",
                    "mode": "cloud",
                    "message": f"Đã lên lịch trực tiếp trên máy chủ Meta Cloud vào lúc {clean_time}!",
                    "result": fb_res,
                    "task": task
                }

            # Lựa chọn 2: Local Scheduler
            task = add_scheduled_task({
                "target_timestamp": target_ts,
                "target_time_str": clean_time,
                "golden_slot_label": req.golden_slot_label or "",
                "meta_cloud_schedule": False,
                "post_type": "reel",
                "target_page_id": req.target_page_id or publisher.page_id,
                "video_path": req.video_path,
                "thumbnail_path": req.thumbnail_path,
                "title": clean_title,
                "caption": clean_caption,
                "hashtags": req.hashtags,
                "pinned_comment": clean_comment,
                "selected_product_ids": req.selected_product_ids,
                "script": req.script,
                "niche": req.niche,
                "status": "pending"
            })
            return {
                "status": "scheduled",
                "mode": "local",
                "message": f"Đã lên lịch đăng video vào lúc {clean_time}! Hệ thống sẽ tự động đăng kèm ảnh bìa và ghim bình luận Shopee chuẩn xác.",
                "task": task
            }

        except HTTPException:
            raise
        except Exception as st_err:
            logger.error(f"Lỗi lên lịch đăng video: {st_err}")
            raise HTTPException(status_code=400, detail=str(st_err))

    # Đăng ngay lập tức (Immediate Publish)
    try:
        fb_res = publisher.publish_reel_with_comment(
            video_path=req.video_path,
            title=clean_title,
            caption=clean_caption,
            hashtags=req.hashtags,
            pinned_comment=clean_comment,
            thumbnail_path=req.thumbnail_path
        )

        if req.selected_product_ids:
            products = load_json(PRODUCTS_FILE, [])
            for p in products:
                if p.get("id") in req.selected_product_ids:
                    p["use_count"] = p.get("use_count", 0) + 1
            save_json(PRODUCTS_FILE, products)

        history = load_json(HISTORY_FILE, [])
        record = {
            "id": f"hist_{int(time.time())}_{uuid.uuid4().hex[:4]}",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "post_type": "reel",
            "niche": req.niche,
            "script": req.script,
            "video_path": req.video_path,
            "thumbnail_path": req.thumbnail_path,
            "title": clean_title,
            "caption": clean_caption,
            "hashtags": req.hashtags,
            "pinned_comment": clean_comment,
            "selected_product_ids": req.selected_product_ids,
            "facebook_result": fb_res
        }
        history.insert(0, record)
        save_json(HISTORY_FILE, history)

        return {"status": "success", "result": fb_res, "history_id": record["id"]}

    except Exception as e:
        logger.error(f"Publish error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/upload-photo")
async def upload_photo(file: UploadFile = File(...)):
    filename = f"photo_{int(time.time())}_{file.filename}"
    target_path = UPLOAD_DIR / filename
    with open(target_path, "wb") as f:
        content = await file.read()
        f.write(content)
    return {
        "status": "success",
        "filename": filename,
        "saved_path": str(target_path),
        "url": f"/uploads/{filename}",
        "size_bytes": len(content)
    }

@app.post("/api/analyze-photo")
def api_analyze_photo(req: AnalyzePhotoRequest):
    cfg = load_json(CONFIG_FILE, {})
    api_key = cfg.get("gemini_api_key", "").strip()
    if not api_key:
        raise HTTPException(status_code=400, detail="Chưa cấu hình Gemini API Key!")
    model_name = cfg.get("default_model", "gemini-3.5-flash-lite")
    catalog = load_json(PRODUCTS_FILE, [])

    try:
        result = analyze_photo_post(
            prompt_text=req.prompt or "",
            niche=req.niche or "Sức khỏe",
            catalog=catalog,
            api_key=api_key,
            model_name=model_name
        )
        return {"status": "success", "data": result}
    except Exception as e:
        logger.error(f"Analyze photo error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/publish-photo")
def api_publish_photo(req: PublishPhotoRequest):
    publisher = get_facebook_publisher(req.target_page_id)

    clean_caption = clean_no_emojis(req.caption)
    clean_title = clean_no_emojis(req.title or "")
    clean_comment = clean_no_emojis(req.pinned_comment)

    # 1. Hẹn giờ đăng ảnh
    if req.is_scheduled and req.scheduled_time:
        try:
            clean_time = req.scheduled_time.replace("T", " ")
            if len(clean_time) == 16:
                clean_time += ":00"
            dt = datetime.strptime(clean_time, "%Y-%m-%d %H:%M:%S")
            target_ts = int(dt.timestamp())
            now_ts = int(time.time())

            if target_ts <= now_ts + 45:
                raise HTTPException(status_code=400, detail="Thời gian hẹn giờ phải lớn hơn thời điểm hiện tại ít nhất 1 phút!")

            if req.meta_cloud_schedule:
                if target_ts < now_ts + 600:
                    raise HTTPException(status_code=400, detail="Chính sách Meta Cloud yêu cầu thời gian hẹn trước tối thiểu 10-15 phút!")

                fb_res = publisher.publish_photo_with_comment(
                    photo_path=req.photo_path,
                    caption=clean_caption,
                    hashtags=req.hashtags,
                    pinned_comment=clean_comment,
                    scheduled_publish_time=target_ts
                )
                task = add_scheduled_task({
                    "target_timestamp": target_ts,
                    "target_time_str": clean_time,
                    "golden_slot_label": req.golden_slot_label or "",
                    "meta_cloud_schedule": True,
                    "post_type": "photo",
                    "photo_path": req.photo_path,
                    "target_page_id": req.target_page_id or publisher.page_id,
                    "title": clean_title or "Bài Viết Ảnh",
                    "caption": clean_caption,
                    "hashtags": req.hashtags,
                    "pinned_comment": clean_comment,
                    "selected_product_ids": req.selected_product_ids,
                    "status": "pending",
                    "facebook_result": fb_res
                })
                return {
                    "status": "scheduled",
                    "mode": "cloud",
                    "message": f"Đã lên lịch đăng ảnh trực tiếp trên máy chủ Meta Cloud vào lúc {clean_time}!",
                    "result": fb_res,
                    "task": task
                }

            # Local Scheduler
            task = add_scheduled_task({
                "target_timestamp": target_ts,
                "target_time_str": clean_time,
                "golden_slot_label": req.golden_slot_label or "",
                "meta_cloud_schedule": False,
                "post_type": "photo",
                "photo_path": req.photo_path,
                "target_page_id": req.target_page_id or publisher.page_id,
                "title": clean_title or "Bài Viết Ảnh",
                "caption": clean_caption,
                "hashtags": req.hashtags,
                "pinned_comment": clean_comment,
                "selected_product_ids": req.selected_product_ids,
                "status": "pending"
            })
            return {
                "status": "scheduled",
                "mode": "local",
                "message": f"Đã lên lịch đăng ảnh vào lúc {clean_time}!",
                "task": task
            }
        except HTTPException:
            raise
        except Exception as st_err:
            logger.error(f"Lỗi lên lịch đăng ảnh: {st_err}")
            raise HTTPException(status_code=400, detail=str(st_err))

    # 2. Đăng ảnh ngay lập tức
    try:
        fb_res = publisher.publish_photo_with_comment(
            photo_path=req.photo_path,
            caption=clean_caption,
            hashtags=req.hashtags,
            pinned_comment=clean_comment
        )

        if req.selected_product_ids:
            products = load_json(PRODUCTS_FILE, [])
            for p in products:
                if p.get("id") in req.selected_product_ids:
                    p["use_count"] = p.get("use_count", 0) + 1
            save_json(PRODUCTS_FILE, products)

        history = load_json(HISTORY_FILE, [])
        record = {
            "id": f"hist_{int(time.time())}_{uuid.uuid4().hex[:4]}",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "post_type": "photo",
            "photo_path": req.photo_path,
            "title": clean_title or "Bài Viết Ảnh Sức Khỏe",
            "caption": clean_caption,
            "hashtags": req.hashtags,
            "pinned_comment": clean_comment,
            "selected_product_ids": req.selected_product_ids,
            "facebook_result": fb_res
        }
        history.insert(0, record)
        save_json(HISTORY_FILE, history)

        return {"status": "success", "result": fb_res, "history_id": record["id"]}
    except Exception as e:
        logger.error(f"Publish photo error: {e}")
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/schedule/tasks")
def api_get_scheduled_tasks():
    return get_scheduled_tasks()

@app.delete("/api/schedule/tasks/{task_id}")
def api_delete_scheduled_task(task_id: str):
    success = delete_scheduled_task(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy tác vụ hẹn giờ này")
    return {"status": "success", "message": "Đã hủy tác vụ hẹn giờ thành công"}

@app.post("/api/schedule/tasks/{task_id}/publish-now")
def api_publish_now_scheduled_task(task_id: str):
    task = get_scheduled_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Không tìm thấy tác vụ hẹn giờ này")
    try:
        update_task_status(task_id, "publishing")
        res = execute_publish_task(task)
        update_task_status(task_id, "completed", result=res)
        return {"status": "success", "result": res}
    except Exception as e:
        update_task_status(task_id, "failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
def startup_event():
    start_scheduler(execute_publish_task, execute_comment_task)

@app.on_event("shutdown")
def shutdown_event():
    stop_scheduler()

@app.get("/api/history")
def get_history():
    return load_json(HISTORY_FILE, [])

SAMPLE_SCRIPTS_FILE = DATA_DIR / "sample_scripts.json"

@app.get("/api/sample-scripts")
def get_sample_scripts():
    return load_json(SAMPLE_SCRIPTS_FILE, [])

class SaveThumbnailRequest(BaseModel):
    image_base64: str
    video_filename: Optional[str] = "thumbnail"

@app.post("/api/save-thumbnail")
def save_thumbnail(req: SaveThumbnailRequest):
    import base64
    data = req.image_base64
    if "," in data:
        data = data.split(",", 1)[1]
    raw = base64.b64decode(data)
    filename = f"thumb_{int(time.time())}.png"
    target = UPLOAD_DIR / filename
    with open(target, "wb") as f:
        f.write(raw)
    return {
        "status": "success",
        "filename": filename,
        "saved_path": str(target),
        "url": f"/uploads/{filename}"
    }

# Static & Asset files for Frontend
STATIC_DIR = BASE_DIR / "static"
ASSETS_DIR = BASE_DIR / "assets"
STATIC_DIR.mkdir(parents=True, exist_ok=True)
ASSETS_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/assets", StaticFiles(directory=str(ASSETS_DIR)), name="assets")
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
