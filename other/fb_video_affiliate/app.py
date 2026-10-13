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
SCHEDULED_TASKS_FILE = DATA_DIR / "scheduled_tasks.json"

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
    allow_duplicate: Optional[bool] = False

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

class BatchPreviewRequest(BaseModel):
    old_url: str
    product_id: Optional[str] = None

class BatchReplaceRequest(BaseModel):
    old_url: str
    new_url: str
    product_id: Optional[str] = None
    new_name: Optional[str] = None
    update_products: bool = True
    update_scheduled: bool = True
    update_facebook_comments: bool = True
    target_page_id: Optional[str] = None

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

@app.post("/api/products/batch-preview-link")
def api_batch_preview_link(req: BatchPreviewRequest):
    old_url = req.old_url.strip()
    prod_id = (req.product_id or "").strip()

    if not old_url and not prod_id:
        raise HTTPException(status_code=400, detail="Vui lòng cung cấp link cũ hoặc chọn sản phẩm cần tìm!")

    products = load_json(PRODUCTS_FILE, [])
    scheduled_tasks = load_json(SCHEDULED_TASKS_FILE, [])
    history = load_json(HISTORY_FILE, [])

    # Nếu chỉ có prod_id, tìm URL tương ứng
    target_url = old_url
    target_prod_name = ""
    if not target_url and prod_id:
        for p in products:
            if p.get("id") == prod_id:
                target_url = p.get("affiliate_url", "")
                target_prod_name = p.get("name", "")
                break

    matched_products = []
    for p in products:
        if (target_url and target_url in p.get("affiliate_url", "")) or (prod_id and p.get("id") == prod_id):
            matched_products.append({
                "id": p.get("id"),
                "name": p.get("name"),
                "affiliate_url": p.get("affiliate_url"),
                "use_count": p.get("use_count", 0)
            })

    matched_scheduled = []
    for t in scheduled_tasks:
        c = t.get("pinned_comment", "")
        p_ids = t.get("selected_product_ids", [])
        if (target_url and target_url in c) or (prod_id and prod_id in p_ids):
            matched_scheduled.append({
                "id": t.get("id"),
                "title": t.get("title", ""),
                "target_time_str": t.get("target_time_str", ""),
                "status": t.get("status", ""),
                "has_comment_id": bool(t.get("facebook_result", {}).get("comment_id"))
            })

    matched_history = []
    for h in history:
        c = h.get("pinned_comment", "")
        p_ids = h.get("selected_product_ids", [])
        if (target_url and target_url in c) or (prod_id and prod_id in p_ids):
            matched_history.append({
                "id": h.get("id"),
                "title": h.get("title", ""),
                "timestamp": h.get("timestamp", ""),
                "comment_id": h.get("facebook_result", {}).get("comment_id"),
                "facebook_url": h.get("facebook_result", {}).get("facebook_url")
            })

    return {
        "status": "success",
        "target_url": target_url,
        "product_name": target_prod_name,
        "counts": {
            "products": len(matched_products),
            "scheduled": len(matched_scheduled),
            "history": len(matched_history),
            "total": len(matched_products) + len(matched_scheduled) + len(matched_history)
        },
        "matched_products": matched_products,
        "matched_scheduled": matched_scheduled,
        "matched_history": matched_history
    }

@app.post("/api/products/batch-replace-link")
def api_batch_replace_link(req: BatchReplaceRequest):
    old_url = req.old_url.strip()
    new_url = req.new_url.strip()
    prod_id = (req.product_id or "").strip()
    new_name = (req.new_name or "").strip()

    products = load_json(PRODUCTS_FILE, [])
    scheduled_tasks = load_json(SCHEDULED_TASKS_FILE, [])
    history = load_json(HISTORY_FILE, [])

    # Nếu chưa có old_url mà có prod_id, lấy link từ product
    if not old_url and prod_id:
        for p in products:
            if p.get("id") == prod_id:
                old_url = p.get("affiliate_url", "")
                break

    if not old_url or not new_url:
        raise HTTPException(status_code=400, detail="Vui lòng cung cấp cả link Shopee cũ và link Shopee mới!")

    old_product_names = []
    updated_products_count = 0
    if req.update_products:
        for p in products:
            if (old_url and old_url in p.get("affiliate_url", "")) or (prod_id and p.get("id") == prod_id):
                old_product_names.append(p.get("name", ""))
                p["affiliate_url"] = new_url
                if new_name:
                    p["name"] = new_name
                updated_products_count += 1
        save_json(PRODUCTS_FILE, products)

    # 1. Cập nhật các bài trong hàng đợi hẹn giờ
    updated_scheduled_count = 0
    if req.update_scheduled:
        for t in scheduled_tasks:
            c = t.get("pinned_comment", "")
            if old_url in c:
                c = c.replace(old_url, new_url)
                if new_name:
                    for old_pname in old_product_names:
                        if old_pname:
                            c = c.replace(old_pname, new_name)
                t["pinned_comment"] = c
                updated_scheduled_count += 1
        save_json(SCHEDULED_TASKS_FILE, scheduled_tasks)

    # 2. Cập nhật Lịch sử và đồng bộ trực tiếp lên Facebook Live Comments
    updated_history_count = 0
    fb_comments_updated = 0
    fb_comments_failed = 0
    fb_logs = []

    for h in history:
        c = h.get("pinned_comment", "")
        if old_url in c:
            new_comment = c.replace(old_url, new_url)
            if new_name:
                for old_pname in old_product_names:
                    if old_pname:
                        new_comment = new_comment.replace(old_pname, new_name)
            h["pinned_comment"] = new_comment
            updated_history_count += 1

            if req.update_facebook_comments:
                fb_res = h.get("facebook_result", {})
                comment_id = fb_res.get("comment_id")
                if comment_id:
                    page_id = h.get("target_page_id") or req.target_page_id
                    pub = get_facebook_publisher(page_id)
                    success = pub.update_comment(comment_id, new_comment)
                    if success:
                        fb_comments_updated += 1
                        fb_logs.append(f"Đã sửa bình luận Facebook ID {comment_id} cho bài: '{h.get('title', '')[:35]}...'")
                    else:
                        fb_comments_failed += 1
                        fb_logs.append(f"Không thể sửa bình luận Facebook ID {comment_id}")

    save_json(HISTORY_FILE, history)

    return {
        "status": "success",
        "message": f"Đã thay thế hàng loạt link '{old_url}' thành '{new_url}' thành công!",
        "stats": {
            "products_updated": updated_products_count,
            "scheduled_updated": updated_scheduled_count,
            "history_updated": updated_history_count,
            "facebook_comments_updated": fb_comments_updated,
            "facebook_comments_failed": fb_comments_failed
        },
        "logs": fb_logs
    }

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
    # BẢO VỆ CHỐNG ĐĂNG TRÙNG LẶP:
    fb_res_existing = task_data.get("facebook_result") or {}
    if task_data.get("status") == "completed" or fb_res_existing.get("video_id") or fb_res_existing.get("post_id"):
        logger.warning(f"Tác vụ {task_data.get('id')} đã đăng thành công trước đó ({fb_res_existing}). Bỏ qua đăng trùng lặp!")
        return fb_res_existing

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
    # BẢO VỆ CHỐNG BÌNH LUẬN TRÙNG LẶP:
    fb_res = task_data.get("facebook_result") or {}
    if task_data.get("comment_posted") or fb_res.get("comment_id") or task_data.get("comment_id"):
        logger.warning(f"Tác vụ {task_data.get('id')} đã có comment_id ({task_data.get('comment_id') or fb_res.get('comment_id')}). Bỏ qua bình luận trùng lặp!")
        return None
    if task_data.get("status") in ["cancelled", "failed"]:
        return None

    video_id = fb_res.get("video_id") or fb_res.get("post_id")
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

    # BẢO VỆ CHỐNG ĐĂNG TRÙNG LẶP:
    if not req.allow_duplicate and req.video_path:
        history = load_json(HISTORY_FILE, [])
        target_vname = os.path.basename(req.video_path)
        for h in history:
            h_vpath = h.get("video_path", "")
            h_vname = os.path.basename(h_vpath) if h_vpath else ""
            if h_vname and h_vname == target_vname:
                h_time = h.get("timestamp", "trước đó")
                h_title = h.get("title", "")
                raise HTTPException(
                    status_code=409,
                    detail=f"Cảnh báo trùng lặp: Video '{target_vname}' ({h_title}) đã từng được đăng lên Facebook lúc {h_time}! Vui lòng chọn video khác để tránh đăng trùng bài."
                )

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
    if task.get("status") == "completed":
        raise HTTPException(status_code=400, detail="Bài viết này đã được đăng thành công trước đó trên Facebook!")

    publisher = get_facebook_publisher(task.get("target_page_id"))

    # TRƯỜNG HỢP 1: Video ĐÃ được tải lên Meta Cloud và đang chờ giờ phát sóng
    cloud_video_id = (task.get("facebook_result") or {}).get("video_id")
    if task.get("meta_cloud_schedule") and cloud_video_id:
        try:
            update_task_status(task_id, "publishing")
            clean_comment = clean_no_emojis(task.get("pinned_comment", ""))
            res = publisher.publish_scheduled_reel_now(
                video_id=cloud_video_id,
                pinned_comment=clean_comment
            )
            update_task_status(task_id, "completed", result=res)
            return {"status": "success", "result": res}
        except Exception as e:
            update_task_status(task_id, "failed", error=str(e))
            raise HTTPException(status_code=500, detail=f"Không thể kích hoạt phát sóng video trên Meta Cloud: {e}")

    # TRƯỜNG HỢP 2: Bài lên lịch Local (chưa tải lên Meta)
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

class SaveCleanPhotoRequest(BaseModel):
    image_base64: str
    original_filename: Optional[str] = "photo.jpg"

@app.post("/api/save-clean-photo")
def api_save_clean_photo(req: SaveCleanPhotoRequest):
    """
    Nhận dữ liệu ảnh đã khử AI & dán logo từ trình duyệt,
    chạy qua Pillow để xóa sạch 100% EXIF/C2PA metadata và lưu JPEG chất lượng cao.
    """
    import base64
    import io
    from PIL import Image

    data = req.image_base64
    if "," in data:
        data = data.split(",", 1)[1]
    raw = base64.b64decode(data)

    filename = f"clean_photo_{int(time.time())}_{uuid.uuid4().hex[:4]}.jpg"
    target = UPLOAD_DIR / filename

    try:
        with Image.open(io.BytesIO(raw)) as img:
            rgb = img.convert("RGB")
            # Lưu sạch 100% không mang theo thẻ metadata EXIF, IPTC hay C2PA
            rgb.save(target, "JPEG", quality=95, optimize=True)
    except Exception as e:
        logger.warning(f"Lỗi khi chuyển đổi ảnh qua Pillow: {e}, lưu trực tiếp dữ liệu nhị phân.")
        with open(target, "wb") as f:
            f.write(raw)

    return {
        "status": "success",
        "filename": filename,
        "saved_path": str(target),
        "url": f"/uploads/{filename}"
    }

@app.post("/api/upload-custom-logo")
async def api_upload_custom_logo(file: UploadFile = File(...)):
    """Tải lên logo riêng tùy chỉnh để dán đè lên ảnh bài viết."""
    filename = f"logo_custom_{int(time.time())}_{file.filename}"
    target_path = UPLOAD_DIR / filename
    content = await file.read()
    with open(target_path, "wb") as f:
        f.write(content)
    return {
        "status": "success",
        "filename": filename,
        "saved_path": str(target_path),
        "url": f"/uploads/{filename}"
    }

class ProcessPhotoAntiAIRequest(BaseModel):
    photo_path: str
    clean_anti_ai: Optional[bool] = True
    apply_logo: Optional[bool] = False
    logo_type: Optional[str] = "badge"  # 'badge', 'shadow', 'transparent', 'custom'
    custom_logo_path: Optional[str] = ""
    position: Optional[str] = "bottom-right"
    scale_percent: Optional[float] = 18.0
    opacity: Optional[float] = 0.9

@app.post("/api/process-photo-anti-ai")
def api_process_photo_anti_ai(req: ProcessPhotoAntiAIRequest):
    """Xử lý ảnh bằng Pillow trên server: xóa sạch C2PA/EXIF và dán đè logo."""
    from PIL import Image

    in_path = Path(req.photo_path)
    if not in_path.is_absolute():
        in_path = BASE_DIR / in_path

    if not in_path.exists():
        raise HTTPException(status_code=404, detail="Không tìm thấy file ảnh gốc trên server!")

    out_filename = f"anti_ai_{int(time.time())}_{uuid.uuid4().hex[:4]}.jpg"
    out_path = UPLOAD_DIR / out_filename

    logo_file = None
    if req.apply_logo:
        if req.logo_type == "badge":
            logo_file = BASE_DIR / "assets" / "watermark_huy_hieu_tron.png"
        elif req.logo_type == "shadow":
            logo_file = BASE_DIR / "assets" / "watermark_icon_bong_mo.png"
        elif req.logo_type == "transparent":
            logo_file = BASE_DIR / "assets" / "watermark_icon_trongsuot.png"
        elif req.logo_type == "custom" and req.custom_logo_path:
            logo_file = Path(req.custom_logo_path)
            if not logo_file.is_absolute():
                logo_file = BASE_DIR / logo_file

    try:
        with Image.open(in_path) as orig:
            # Tạo canvas ảnh mới hoàn toàn để hủy bỏ 100% siêu dữ liệu C2PA/EXIF gốc
            img = Image.new("RGBA", orig.size)
            img.paste(orig.convert("RGBA"), (0, 0))

        if req.apply_logo and logo_file and logo_file.exists():
            with Image.open(logo_file) as logo_orig:
                logo = logo_orig.convert("RGBA")
                w, h = img.size
                scale = max(0.05, min(0.5, (req.scale_percent or 18.0) / 100.0))
                target_w = max(40, int(w * scale))
                target_h = int(logo.height * (target_w / logo.width))
                logo = logo.resize((target_w, target_h), Image.Resampling.LANCZOS)

                op = max(0.1, min(1.0, req.opacity or 0.9))
                if op < 1.0:
                    r, g, b, a = logo.split()
                    a = a.point(lambda p: int(p * op))
                    logo = Image.merge("RGBA", (r, g, b, a))

                margin_x = int(w * 0.03)
                margin_y = int(h * 0.03)
                pos = req.position or "bottom-right"

                if pos == "bottom-right":
                    pos_x = w - target_w - margin_x
                    pos_y = h - target_h - margin_y
                elif pos == "bottom-left":
                    pos_x = margin_x
                    pos_y = h - target_h - margin_y
                elif pos == "top-right":
                    pos_x = w - target_w - margin_x
                    pos_y = margin_y
                elif pos == "top-left":
                    pos_x = margin_x
                    pos_y = margin_y
                elif pos == "center":
                    pos_x = (w - target_w) // 2
                    pos_y = (h - target_h) // 2
                else:
                    pos_x = w - target_w - margin_x
                    pos_y = h - target_h - margin_y

                img.paste(logo, (pos_x, pos_y), mask=logo)

        clean_rgb = img.convert("RGB")
        clean_rgb.save(out_path, "JPEG", quality=95, optimize=True)

        return {
            "status": "success",
            "filename": out_filename,
            "saved_path": str(out_path),
            "url": f"/uploads/{out_filename}"
        }
    except Exception as e:
        logger.error(f"Lỗi xử lý ảnh Anti-AI: {e}")
        raise HTTPException(status_code=500, detail=str(e))
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
