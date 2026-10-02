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

from gemini_service import analyze_and_match
from fb_service import FacebookReelsPublisher

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

class ProductItem(BaseModel):
    id: Optional[str] = None
    name: str
    affiliate_url: str
    category: str
    keywords: List[str] = []
    notes: Optional[str] = ""

class PublishRequest(BaseModel):
    video_path: Optional[str] = ""
    title: str
    caption: str
    hashtags: List[str]
    pinned_comment: str
    selected_product_ids: List[str] = []
    script: Optional[str] = ""
    niche: Optional[str] = "Sức khỏe"

class ConfigUpdate(BaseModel):
    gemini_api_key: Optional[str] = None
    default_model: Optional[str] = None
    page_id: Optional[str] = None
    page_access_token: Optional[str] = None
    simulation_mode: Optional[bool] = None

# Endpoints
@app.get("/api/config")
def get_config():
    cfg = load_json(CONFIG_FILE, {})
    # Ẩn bớt ký tự token khi trả về client
    token = cfg.get("facebook", {}).get("page_access_token", "")
    masked_token = f"{token[:8]}...{token[-6:]}" if len(token) > 16 else token
    return {
        "gemini_api_key": cfg.get("gemini_api_key", ""),
        "default_model": cfg.get("default_model", "gemini-3.5-flash-lite"),
        "available_models": cfg.get("available_models", []),
        "facebook": {
            "page_id": cfg.get("facebook", {}).get("page_id", ""),
            "page_access_token": token,
            "masked_token": masked_token,
            "simulation_mode": cfg.get("facebook", {}).get("simulation_mode", True)
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

    save_json(CONFIG_FILE, cfg)
    return {"status": "success", "message": "Đã lưu cài đặt cấu hình thành công!"}

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

@app.post("/api/publish")
def publish_post(req: PublishRequest):
    cfg = load_json(CONFIG_FILE, {})
    fb_cfg = cfg.get("facebook", {})
    
    publisher = FacebookReelsPublisher(
        page_id=fb_cfg.get("page_id", ""),
        page_access_token=fb_cfg.get("page_access_token", ""),
        simulation_mode=fb_cfg.get("simulation_mode", True)
    )

    try:
        fb_res = publisher.publish_reel_with_comment(
            video_path=req.video_path,
            title=req.title,
            caption=req.caption,
            hashtags=req.hashtags,
            pinned_comment=req.pinned_comment
        )

        # Cập nhật số lần dùng sản phẩm
        if req.selected_product_ids:
            products = load_json(PRODUCTS_FILE, [])
            for p in products:
                if p.get("id") in req.selected_product_ids:
                    p["use_count"] = p.get("use_count", 0) + 1
            save_json(PRODUCTS_FILE, products)

        # Lưu vào lịch sử kịch bản
        history = load_json(HISTORY_FILE, [])
        record = {
            "id": f"hist_{int(time.time())}_{uuid.uuid4().hex[:4]}",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            "niche": req.niche,
            "script": req.script,
            "video_path": req.video_path,
            "title": req.title,
            "caption": req.caption,
            "hashtags": req.hashtags,
            "pinned_comment": req.pinned_comment,
            "selected_product_ids": req.selected_product_ids,
            "facebook_result": fb_res
        }
        history.insert(0, record)
        save_json(HISTORY_FILE, history)

        return {"status": "success", "result": fb_res, "history_id": record["id"]}

    except Exception as e:
        logger.error(f"Publish error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
def get_history():
    return load_json(HISTORY_FILE, [])

# Static files for Frontend
STATIC_DIR = BASE_DIR / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
