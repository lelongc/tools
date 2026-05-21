# 🎨 TurboFlow + Google Colab Integration - Complete Guide

**Tạo ảnh từ Colab sử dụng TurboFlow extension (không tính phí, không giới hạn)**

---

## ⚡ SETUP NHANH (5 phút)

### Bước 1: Chạy Bridge Server (trên máy local)

**Windows:**
```bash
cd d:\folder\tools\short
start_bridge.bat
```

**Mac/Linux:**
```bash
cd /path/to/tools/short
chmod +x start_bridge.sh
./start_bridge.sh
```

Bạn sẽ thấy:
```
[bridge] Listening on http://127.0.0.1:8787
```

### Bước 2: Lấy IP của máy local

**Windows:**
```bash
ipconfig | findstr /R "IPv4"
```

**Mac/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Ghi lại IP (ví dụ: `192.168.1.100`)

### Bước 3: Setup Colab

1. Upload `colab_flow_integration.ipynb` lên Google Colab
2. Trong Cell 1, thay đổi:
```python
BRIDGE_HOST = "192.168.1.100"  # ← IP của bạn từ bước 2
BRIDGE_PORT = 8787
```

3. Chạy Cell 2 để test:
```python
test_bridge()  # ✅ Nên thấy "Bridge is healthy!"
```

### Bước 4: Tạo ảnh

**Cell 3:**
```python
job_id = enqueue_job(
    prompts=["mèo", "chó", "chim"],
    naming_prefix="test"
)
print(f"Job: {job_id}")
```

**Cell 4:**
```python
images = wait_for_images(
    job_id=job_id,
    naming_prefix="test",
    expected_count=3,
    timeout_sec=300  # 5 phút
)
print(f"✅ Downloaded: {len(images)} images")
```

**Trên máy local:** Kiểm tra folder Downloads, sẽ thấy `test-001.jpg`, `test-002.jpg`, `test-003.jpg`

---

## 🏗️ Kiến trúc hoạt động

```
Google Colab (cloud)
    ↓ POST /enqueue (gửi prompt)
Local Bridge (localhost:8787)
    ↓ GET /next (mỗi 2 giây)
TurboFlow Extension (Chrome)
    ↓ start batch
Google Flow (tạo ảnh)
    ↓ save to
~/Downloads/
    ↓ bridge watches folder
Colab downloads images
    ↓
render_web.py tạo video
```

---

## 📋 Yêu cầu hệ thống

**Máy local:**
- ✅ Chrome (với TurboFlow extension)
- ✅ Python 3.8+
- ✅ Internet

**Google Colab:**
- ✅ Python 3.8+
- ✅ Có thể kết nối tới máy local (cùng WiFi)

---

## 🔌 API Bridge - 6 Endpoints

### 1. GET /health - Kiểm tra bridge

```bash
curl http://127.0.0.1:8787/health
# {"ok": true}
```

### 2. POST /enqueue - Gửi công việc

```bash
curl -X POST http://127.0.0.1:8787/enqueue \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "my_job",
    "prompts": ["prompt 1", "prompt 2"],
    "settings": {
      "naming": "prefix",
      "namingPrefix": "my",
      "namingSeparator": "-"
    }
  }'
```

### 3. GET /next - Extension lấy công việc

(Gọi tự động mỗi 2 giây bởi extension)

### 4. POST /status - Cập nhật trạng thái

Extension gửi:
```bash
curl -X POST http://127.0.0.1:8787/status \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": "my_job",
    "state": "running",
    "stats": {"total": 2, "downloaded": 1, "failed": 0}
  }'
```

### 5. GET /images - Danh sách ảnh

```bash
curl "http://127.0.0.1:8787/images?job_id=my_job&prefix=my"
# {"ok": true, "items": [...], "total": 2}
```

### 6. GET /download - Download ảnh

```bash
curl "http://127.0.0.1:8787/download?name=my-001.jpg" > my-001.jpg
```

---

## 💡 Ví dụ: Tạo Video từ Colab

```python
# Bước 1: Tạo audio + transcript
# (upload audio.mp3 và subtitles.srt lên Colab trước)

# Bước 2: Tạo ảnh từ extension
project = create_short_from_topic(
    topic="Cách học tiếng Anh",
    script_text="Hôm nay tôi sẽ dạy bạn...",
    audio_path="/content/audio.mp3",
    srt_path="/content/subtitles.srt",
    keywords_json={
        "script": "Cách học tiếng Anh",
        "visual_keywords": [
            {"keyword": "người học", "search_query": "student studying"},
            {"keyword": "sách", "search_query": "english book"}
        ]
    },
    use_extension_images=True  # ← Dùng ảnh từ extension
)

print(f"✅ Project: {project}")
```

**Sau đó, trên máy local:**
```bash
cd d:\folder\tools\short
python render_web.py cach_hoc_tieng_anh
```

Output: `projects/cach_hoc_tieng_anh/output_web.mp4`

---

## ❌ Xử lý sự cố

### Lỗi: "Cannot connect to bridge"

**Fix:**
1. Check bridge chạy: `python bridge_local.py` (terminal đang chạy?)
2. Check IP đúng: `ipconfig` (Windows) hoặc `ifconfig` (Mac/Linux)
3. Update BRIDGE_HOST trong Colab
4. Test: `test_bridge()` trong Colab

### Lỗi: "Images not generating"

**Fix:**
1. Mở Chrome, check extension TurboFlow đã enable
2. Mở Google Flow tab: https://labs.google/fx/tools/flow
3. Tăng timeout: `wait_for_images(..., timeout_sec=600)`
4. Check Downloads folder có ảnh không

### Lỗi: "Bridge exits immediately"

**Nguyên nhân:** Port 8787 đang dùng

**Fix:**
```bash
# Tìm process dùng port 8787
Windows: netstat -ano | findstr 8787
Mac/Linux: lsof -i :8787

# Kill process
Windows: taskkill /PID [PID] /F
Mac/Linux: kill -9 [PID]

# Hoặc dùng port khác
python bridge_local.py --port 8788
```

### Lỗi: "Download fails (404)"

**Fix:**
1. Kiểm tra file tồn tại: `ls ~/Downloads | grep my-`
2. Restart bridge: Ctrl+C rồi chạy lại
3. Re-queue job: `enqueue_job([...], naming_prefix="new_test")`

---

## ❓ Câu hỏi thường gặp

**Q: Có tính phí không?**
A: Không! dev-unlimited.js bỏ tất cả giới hạn thanh toán.

**Q: Tạo bao nhiêu ảnh được?**
A: Không giới hạn! dev-unlimited.js loại bỏ daily limits.

**Q: Phải chạy bridge mãi không?**
A: Có, bridge phải chạy khi dùng Colab. Có thể dùng `tmux` (Mac/Linux) hoặc Task Scheduler (Windows) để chạy nền.

**Q: Tôi không có Colab được không?**
A: Được! Bridge API hoạt động với bất kỳ HTTP client nào (curl, Python, JavaScript, ...).

**Q: Colab và máy local phải cùng mạng không?**
A: Nên vậy. Nếu khác mạng, cần port forwarding hoặc VPN.

**Q: Extension cần gì?**
A: Chỉ cần:
- `manifest.json` (updated)
- `background.js` (updated)
- `dev-unlimited.js` (loaded)
- `dev-bridge.js` (loaded)

---

## 🔧 Cấu hình nâng cao

### Thay đổi port bridge

```bash
python bridge_local.py --port 9000
```

Sau đó trong Colab: `BRIDGE_PORT = 9000`

### Thay đổi Downloads folder

```bash
python bridge_local.py --downloads /path/to/folder
```

### Chạy nền (Linux/Mac)

```bash
nohup python bridge_local.py > bridge.log 2>&1 &
```

Sau: `tail -f bridge.log` để xem logs

### Chạy nền (Windows)

Dùng Task Scheduler để chạy `start_bridge.bat` khi khởi động.

---

## 📊 Naming Convention (tên ảnh)

Khi bạn gọi:
```python
enqueue_job(
    ["cat", "dog", "bird"],
    naming_prefix="animals"
)
```

Extension sẽ save:
```
animals-001.jpg  (ảnh 1)
animals-002.jpg  (ảnh 2)
animals-003.jpg  (ảnh 3)
```

Trong `render_web.py`, nó tìm:
```
projects/animals/images/animals-001.jpg
projects/animals/images/animals-002.jpg
projects/animals/images/animals-003.jpg
```

---

## 🎯 Workflow tiêu biểu

### 1. Tạo ảnh test (1 tập)

```python
enqueue_job(["landscape", "portrait"], naming_prefix="test")
images = wait_for_images("test_001", "test", 2)
```

### 2. Tạo video từ ảnh

```python
create_short_from_topic(
    topic="Bài học hôm nay",
    script_text="...",
    use_extension_images=True
)
```

**Local:**
```bash
python render_web.py bai_hoc_hom_nay
```

### 3. Batch nhiều video

```python
topics = ["topic1", "topic2", "topic3"]
for topic in topics:
    # Tạo ảnh
    enqueue_job([...], naming_prefix=topic)
    # Tạo video
    create_short_from_topic(..., use_extension_images=True)
```

---

## 🚨 Cảnh báo quan trọng

1. **Bridge phải chạy** - Nếu đóng terminal, bridge dừng lại
2. **Flow tab phải mở** - https://labs.google/fx/tools/flow phải open
3. **Window không được minimize** - Flow không tạo ảnh khi minimize
4. **Tên prefix phải unique** - Tránh ghi đè ảnh cũ
5. **Check Downloads folder** - Ảnh được lưu ở `~/Downloads`

---

## ✅ Checklist thành công

- [ ] Bridge chạy không lỗi
- [ ] `test_bridge()` pass ✅
- [ ] `enqueue_job()` queued
- [ ] Images xuất hiện trong Downloads
- [ ] `wait_for_images()` download OK
- [ ] Extension hiển thị "Pro Plan" (không upgrade)
- [ ] `render_web.py` tạo video thành công

---

## 📁 File cấu trúc

```
d:\folder\tools\
├── flow-image/
│   ├── manifest.json        [UPDATED]
│   ├── background.js        [UPDATED]
│   ├── dev-unlimited.js     [Unlimited]
│   └── dev-bridge.js        [Bridge]
│
└── short/
    ├── bridge_local.py      [HTTP Server]
    ├── colab_flow_integration.ipynb [Notebook]
    ├── render_web.py        [Video Creator]
    ├── start_bridge.bat     [Launcher - Windows]
    ├── start_bridge.sh      [Launcher - Mac/Linux]
    ├── requirements.txt     [Dependencies]
    └── GUIDE.md             [This file]
```

---

## 🚀 Bắt đầu ngay

```bash
# 1. Chạy bridge
cd d:\folder\tools\short
start_bridge.bat  # Windows, hoặc start_bridge.sh

# 2. Mở Colab
# Upload colab_flow_integration.ipynb

# 3. Setup Colab
BRIDGE_HOST = "192.168.1.100"  # ← IP của bạn
test_bridge()  # ✅ Check kết nối

# 4. Tạo ảnh
enqueue_job(["mèo", "chó"], "test")
wait_for_images("test_001", "test", 2)

# ✅ Done!
```

---

## 📞 Cần giúp?

1. **Setup?** → Xem phần SETUP NHANH
2. **Lỗi?** → Xem phần Xử lý sự cố
3. **API?** → Xem phần API Bridge - 6 Endpoints
4. **Câu hỏi?** → Xem phần FAQ

---

**Phiên bản 1.0 - Sản xuất sẵn sàng ✅**

Thời gian setup: **5 phút**  
Thời gian học: **10-15 phút**  
Tạo ảnh đầu tiên: **Ngay lập tức!** 🎉
