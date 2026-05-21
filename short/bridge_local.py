import argparse
import base64
import io
import json
import secrets
import shutil
import subprocess
import sys
import threading
import time
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace", line_buffering=True)
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace", line_buffering=True)

DOWNLOAD_EXTS = {".jpg", ".jpeg", ".png", ".webp"}
QUEUE = []
JOBS = {}
LOCK = threading.Lock()
PROJECTS = {}
PROJECT_LOCK = threading.Lock()
PROJECTS_DIR = Path(__file__).parent / "projects"
TURBOFLOW_DIR = Path(r"D:\download\win\turboflow")


def _now():
    return time.time()


def _json_load(body: bytes):
    if not body:
        return {}
    return json.loads(body.decode("utf-8"))


def _new_job(payload: dict) -> dict:
    job_id = payload.get("job_id") or f"job_{int(_now())}_{secrets.token_hex(3)}"
    prompts = payload.get("prompts") or []
    settings = payload.get("settings") or {}
    expected_count = payload.get("expected_count")
    job = {
        "job_id": job_id,
        "prompts": prompts,
        "settings": settings,
        "status": "queued",
        "created_at": _now(),
        "updated_at": _now(),
        "started_at": None,
        "expected_count": expected_count,
        "stats": None,
        "error": None,
    }
    return job


def _prefix_for_job(job: dict, query_prefix: str | None):
    if query_prefix:
        return query_prefix
    settings = job.get("settings") or {}
    if settings.get("naming") == "prefix" and settings.get("namingPrefix"):
        sep = settings.get("namingSeparator")
        sep = "-" if sep is None or sep == "" else sep
        return f"{settings['namingPrefix']}{sep}"
    return None


def _list_images(downloads: Path, since_ts: float | None, prefix: str | None):
    items = []
    if not downloads.exists():
        return items
    for p in downloads.iterdir():
        if not p.is_file():
            continue
        if p.suffix.lower() not in DOWNLOAD_EXTS:
            continue
        if p.name.endswith(".crdownload"):
            continue
        stat = p.stat()
        if since_ts and stat.st_mtime < since_ts:
            continue
        if prefix and not p.name.startswith(prefix):
            continue
        items.append(
            {
                "name": p.name,
                "size": stat.st_size,
                "mtime": stat.st_mtime,
            }
        )
    items.sort(key=lambda x: x["mtime"])
    return items


def _safe_name(value: str) -> str:
    return Path(value).name


def _project_dir(name: str) -> Path:
    safe = _safe_name(name)
    return PROJECTS_DIR / safe


def _normalize_prefix(prefix: str | None) -> str | None:
    if not prefix:
        return None
    return prefix if prefix.endswith("-") else f"{prefix}-"


def _wait_for_images(downloads: Path, prefix: str | None, expected_count: int | None, timeout_sec: int):
    start = _now()
    prefix = _normalize_prefix(prefix)
    while True:
        items = _list_images(downloads, None, prefix)
        if expected_count is None:
            if items:
                return items
        elif len(items) >= expected_count:
            return items

        if _now() - start > timeout_sec:
            return items
        time.sleep(2)


def _copy_images_to_project(downloads: Path, project_dir: Path, prefix: str | None, expected_count: int | None, timeout_sec: int):
    items = _wait_for_images(downloads, prefix, expected_count, timeout_sec)
    if not items:
        return []

    images_dir = project_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    copied = []
    for item in items:
        src = downloads / item["name"]
        dest = images_dir / item["name"]
        try:
            shutil.copy2(src, dest)
            copied.append(dest)
        except Exception as exc:
            print(f"[bridge] ⚠️ Failed to copy {src} -> {dest}: {exc}")
    return copied


def _run_render(project_name: str) -> tuple[bool, str]:
    render_script = Path(__file__).parent / "render_web.py"
    if not render_script.exists():
        return False, f"render_web.py not found at {render_script}"

    cmd = [sys.executable, str(render_script), project_name]
    result = subprocess.run(cmd, capture_output=True, text=True, errors="ignore")
    if result.returncode != 0:
        tail = (result.stderr or result.stdout or "").strip()[-800:]
        return False, tail or "render failed"
    return True, (result.stdout or "").strip()[-800:]


def _auto_render_project(downloads: Path, project_name: str, prefix: str | None, expected_count: int | None, timeout_sec: int):
    project_dir = _project_dir(project_name)
    with PROJECT_LOCK:
        PROJECTS[project_name]["status"] = "waiting_images"
        PROJECTS[project_name]["updated_at"] = _now()

    copied = _copy_images_to_project(downloads, project_dir, prefix, expected_count, timeout_sec)
    if expected_count and len(copied) < expected_count:
        with PROJECT_LOCK:
            PROJECTS[project_name]["status"] = "error"
            PROJECTS[project_name]["error"] = f"Timeout waiting images ({len(copied)}/{expected_count})"
            PROJECTS[project_name]["updated_at"] = _now()
        return

    with PROJECT_LOCK:
        PROJECTS[project_name]["status"] = "rendering"
        PROJECTS[project_name]["updated_at"] = _now()

    ok, info = _run_render(project_name)
    with PROJECT_LOCK:
        PROJECTS[project_name]["status"] = "done" if ok else "error"
        PROJECTS[project_name]["render_log"] = info
        PROJECTS[project_name]["updated_at"] = _now()


class BridgeHandler(BaseHTTPRequestHandler):
    server_version = "FlowBridge/2.0"

    def log_message(self, format, *args):
        # Suppress default HTTP logs
        pass

    def _send_json(self, obj, status=200):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_text(self, text, status=200, content_type="text/plain; charset=utf-8"):
        body = text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path
        qs = parse_qs(parsed.query)

        if path == "/health":
            return self._send_json({"ok": True, "version": "2.0"})

        if path == "/next":
            with LOCK:
                if not QUEUE:
                    self.send_response(204)
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    return
                job = QUEUE.pop(0)
                job["status"] = "assigned"
                job["started_at"] = _now()
                job["updated_at"] = _now()
                JOBS[job["job_id"]] = job
            return self._send_json(
                {
                    "job_id": job["job_id"],
                    "prompts": job["prompts"],
                    "settings": job["settings"],
                }
            )

        if path == "/status":
            job_id = (qs.get("job_id") or [None])[0]
            if not job_id or job_id not in JOBS:
                return self._send_json({"ok": False, "error": "job_id not found"}, status=404)
            with LOCK:
                job = JOBS[job_id]
            return self._send_json({"ok": True, "job": job})

        if path == "/images":
            job_id = (qs.get("job_id") or [None])[0]
            prefix = (qs.get("prefix") or [None])[0]
            since = (qs.get("since") or [None])[0]
            since_ts = float(since) if since else None
            job = JOBS.get(job_id) if job_id else None
            if job and since_ts is None:
                since_ts = (job.get("started_at") or 0) - 2
            if job and prefix is None:
                prefix = _prefix_for_job(job, None)
            items = _list_images(self.server.downloads, since_ts, prefix)
            return self._send_json({"ok": True, "items": items})

        if path == "/download":
            name = (qs.get("name") or [None])[0]
            if not name:
                return self._send_json({"ok": False, "error": "missing name"}, status=400)
            safe_name = Path(name).name
            file_path = self.server.downloads / safe_name
            if not file_path.exists() or not file_path.is_file():
                return self._send_json({"ok": False, "error": "file not found"}, status=404)
            content_type = "application/octet-stream"
            if file_path.suffix.lower() in {".jpg", ".jpeg"}:
                content_type = "image/jpeg"
            elif file_path.suffix.lower() == ".png":
                content_type = "image/png"
            elif file_path.suffix.lower() == ".webp":
                content_type = "image/webp"
            data = file_path.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return

        return self._send_json({"ok": False, "error": "not found"}, status=404)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get("Content-Length", "0"))
        payload = _json_load(self.rfile.read(length))

        if path == "/enqueue":
            job = _new_job(payload)
            with LOCK:
                QUEUE.append(job)
                JOBS[job["job_id"]] = job
            print(f"[bridge] 📥 Job queued: {job['job_id']} ({len(job['prompts'])} prompts)")
            return self._send_json({"ok": True, "job_id": job["job_id"]})

        if path == "/status":
            job_id = payload.get("job_id")
            if not job_id:
                return self._send_json({"ok": False, "error": "missing job_id"}, status=400)
            with LOCK:
                job = JOBS.get(job_id)
                if not job:
                    return self._send_json({"ok": False, "error": "job_id not found"}, status=404)
                if payload.get("state"):
                    job["status"] = payload["state"]
                if payload.get("stats") is not None:
                    job["stats"] = payload["stats"]
                if payload.get("error"):
                    job["error"] = payload["error"]
                job["updated_at"] = _now()
                JOBS[job_id] = job
            return self._send_json({"ok": True})

        return self._send_json({"ok": False, "error": "not found"}, status=404)


def _start_cloudflared(port: int):
    """Start cloudflared tunnel and return the public URL."""
    # Check if cloudflared is installed
    cf_path = shutil.which("cloudflared")
    if not cf_path:
        # Try to find in common locations
        possible = [
            Path.home() / "cloudflared.exe",
            Path(r"C:\Program Files\cloudflared\cloudflared.exe"),
            Path(__file__).parent / "cloudflared.exe",
        ]
        for p in possible:
            if p.exists():
                cf_path = str(p)
                break

    if not cf_path:
        print("[bridge] ⚠️ cloudflared chưa cài. Đang tải tự động...")
        # Download cloudflared for Windows
        dl_url = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"
        dest = Path(__file__).parent / "cloudflared.exe"
        try:
            import urllib.request
            urllib.request.urlretrieve(dl_url, str(dest))
            cf_path = str(dest)
            print(f"[bridge] ✅ Đã tải cloudflared → {dest}")
        except Exception as e:
            print(f"[bridge] ❌ Không tải được cloudflared: {e}")
            print(f"[bridge]    Tải thủ công: {dl_url}")
            print(f"[bridge]    Đặt file vào: {dest}")
            return None

    # Start cloudflared tunnel
    proc = subprocess.Popen(
        [cf_path, "tunnel", "--url", f"http://127.0.0.1:{port}", "--no-autoupdate"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        errors="ignore",
    )

    # Parse the public URL from cloudflared output
    import re
    tunnel_url = None
    deadline = time.time() + 15  # 15s timeout

    while time.time() < deadline:
        line = proc.stderr.readline()
        if not line:
            time.sleep(0.1)
            continue
        match = re.search(r"(https://[a-zA-Z0-9\-]+\.trycloudflare\.com)", line)
        if match:
            tunnel_url = match.group(1)
            break

    if tunnel_url:
        print(f"\n{'='*60}")
        print(f"🌐 TUNNEL URL: {tunnel_url}")
        print(f"{'='*60}")
        print(f"📋 Copy URL trên → paste vào Google Colab")
        print(f"{'='*60}\n")
    else:
        print("[bridge] ⚠️ Không lấy được tunnel URL. Kiểm tra cloudflared.")

    return proc, tunnel_url


def main():
    parser = argparse.ArgumentParser(description="Local bridge for TurboFlow + Colab pipeline")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8787)
    parser.add_argument(
        "--downloads",
        default=str(TURBOFLOW_DIR),
        help="Path to folder where TurboFlow saves images",
    )
    parser.add_argument(
        "--no-tunnel",
        action="store_true",
        help="Don't start cloudflared tunnel (local only mode)",
    )
    args = parser.parse_args()

    downloads = Path(args.downloads).expanduser().resolve()
    downloads.mkdir(parents=True, exist_ok=True)

    # Start cloudflared tunnel
    tunnel_proc = None
    if not args.no_tunnel:
        result = _start_cloudflared(args.port)
        if result:
            tunnel_proc, tunnel_url = result

    server = ThreadingHTTPServer((args.host, args.port), BridgeHandler)
    server.downloads = downloads
    print(f"[bridge] 🚀 Bridge server: http://{args.host}:{args.port}")
    print(f"[bridge] 📁 Watching images: {downloads}")
    print(f"[bridge] 🖥️ Mở Edge → TurboFlow extension → Google Flow")
    print(f"[bridge] ⏳ Đang chờ lệnh từ Colab...\n")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[bridge] 🛑 Shutting down...")
        if tunnel_proc:
            tunnel_proc.terminate()


if __name__ == "__main__":
    main()
