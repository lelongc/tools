# 🔍 NeoClip Code Audit — Phân tích lỗi & Sai sót toàn diện

> **Ngày kiểm tra:** 27/06/2026  
> **Phạm vi:** Toàn bộ mã nguồn (`background/`, `content/`, `popup/`, `lens/`, `manifest.json`, `build.js`)

---

## MỤC LỤC
1. [🔴 Lỗi nghiêm trọng (Critical Bugs)](#1--lỗi-nghiêm-trọng-critical-bugs)
2. [🟡 Lỗi logic / Hành vi không mong muốn (Medium Bugs)](#2--lỗi-logic--hành-vi-không-mong-muốn-medium-bugs)
3. [🔵 Cải thiện hiệu năng & Chất lượng code (Improvements)](#3--cải-thiện-hiệu-năng--chất-lượng-code-improvements)
4. [✅ Những phần hoạt động tốt](#4--những-phần-hoạt-động-tốt)

---

## 1. 🔴 Lỗi nghiêm trọng (Critical Bugs)

### BUG-01: Sync chỉ upload `limit` items lên Drive, MẤT DỮ LIỆU trên cloud ❌
**File:** `sync.js` dòng 217-220

```javascript
let limit = settings.historyLimit || 50;
if (!settings.isPro && limit > 50) limit = 50;
const cappedHistory = finalLocalHistory.slice(0, limit);
```

**Vấn đề:**  
Sau khi merge xong dữ liệu local + remote, code lấy kết quả cuối cùng rồi **cắt bớt** (slice) chỉ giữ lại `limit` mục, sau đó upload lại lên Drive. Điều này gây ra:
- Nếu user đang Free (limit=50) và trên Drive có 200 items, lần sync tiếp theo sẽ **xóa sạch 150 items trên cloud** về còn 50.
- Nếu user hạ limit từ 500 → 100, toàn bộ 400 items còn lại trên Drive bị xóa vĩnh viễn.
- Mâu thuẫn trực tiếp với triết lý "SOFT-LOCK DATA PRESERVATION" trong `db.js` (chỉ xóa 1 item cũ nhất mỗi lần).

**Sửa đề xuất:**  
Không nên cắt lịch sử khi upload lên Drive. Drive nên lưu **toàn bộ** dữ liệu để bảo toàn. Việc giới hạn hiển thị chỉ nên áp dụng ở tầng UI (bubble.js / popup).

---

### BUG-02: `getRecent` trong `db.js` không lọc items thuộc Collection
**File:** `db.js` dòng 80-107

```javascript
async function getRecent(limit = 50, search = '', typeFilter = 'all') {
    // ...
    items = await db.history.orderBy('timestamp').reverse().limit(limit).toArray();
    return items;
}
```

**Vấn đề:**  
Hàm `getRecent` trả về **tất cả** các items bao gồm cả những items đã được xếp vào collection (`collectionId > 0`). Khi user di chuyển 1 item vào collection, item đó vẫn hiển thị ở tab "Recent", gây ra:
- Hiển thị trùng lặp (vừa ở Recent, vừa ở Collection).
- User nghĩ rằng "Save to Collection" = "Copy to Collection", nhưng thực tế nó chỉ đổi `collectionId` nên item biến mất khỏi Recent sau lần refresh tiếp theo... NHƯNG lại không biến mất vì code không filter.

**Sửa đề xuất:**  
Thêm filter `.filter(i => i.collectionId === 0)` vào query `getRecent` để ẩn items đã thuộc collection.

---

### BUG-03: `disconnectDrive` hủy license nhưng KHÔNG xóa license trên Drive
**File:** `service_worker.js` dòng 389-397

```javascript
case 'disconnectDrive':
    return new Promise(resolve => {
        if (typeof logoutGoogle === 'function') logoutGoogle();
        isProCache = false;
        proValidUntil = 0;
        chrome.storage.local.remove(['isPro', 'proValidUntil', 'licenseKey', 'instanceId'], () => {
            chrome.storage.local.set({ driveConnected: false, historyLimit: 50 }, () => resolve({ ok: true }));
        });
    });
```

**Vấn đề:**  
Khi user bấm "Disconnect Sync", hệ thống xóa license key ở local NHƯNG **không xóa license trên Drive** (không gọi `deleteLicenseFromDrive()`). Hậu quả:
- Lần sau user connect lại Drive, hệ thống sẽ tự động tìm thấy license cũ trên Drive và **khôi phục Pro miễn phí**.
- User có thể lợi dụng điều này: Mua 1 tháng → lưu key lên Drive → hủy subscription → connect lại → tự động được Pro tiếp.

**Sửa đề xuất:**  
Trước khi gọi `logoutGoogle()`, cần gọi `deleteLicenseFromDrive()` nếu bạn thực sự muốn revoke quyền Pro khi disconnect.
**HOẶC** đổi logic: `disconnectDrive` KHÔNG nên revoke Pro. Chỉ nên ngắt kết nối Drive và giữ nguyên trạng thái license (vì license thuộc về Lemon Squeezy, không phải Drive).

---

## 2. 🟡 Lỗi logic / Hành vi không mong muốn (Medium Bugs)

### BUG-04: Google API được gọi trùng lặp — `getSyncFileId` và `getLicenseFileId`
**File:** `sync.js` dòng 93-108 và 301-316

Cả 2 hàm đều gọi cùng 1 endpoint:
```
GET https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&pageSize=100
```
...nhưng tìm file theo tên khác nhau. Nếu cả 2 được gọi gần nhau (ví dụ: khi login thành công, hệ thống vừa sync data vừa load license), nó gây ra **2 request trùng lặp** đến Google API.

**Sửa đề xuất:**  
Gộp thành 1 hàm `getAppDataFiles(token)` trả về map `{ fileName: fileId }`, cache kết quả trong 30 giây.

---

### BUG-05: `historyExpiry` chỉ cleanup khi save item mới, KHÔNG cleanup theo lịch
**File:** `db.js` dòng 49-56

```javascript
const expiryDays = settings.historyExpiry || 0;
if (expiryDays > 0) {
    const expiryMs = expiryDays * 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - expiryMs;
    await db.history.where('timestamp').below(cutoff).filter(i => i.collectionId === 0).delete();
}
```

**Vấn đề:**  
Logic xóa items hết hạn chỉ chạy bên trong hàm `saveItem()`. Nếu user KHÔNG copy gì trong vài ngày (ví dụ: đi nghỉ), các items đáng lẽ phải hết hạn vẫn nằm yên trong database. Chúng chỉ bị xóa khi user copy nội dung mới tiếp theo.

**Sửa đề xuất:**  
Thêm 1 alarm chạy mỗi 24h để gọi hàm cleanup riêng.

---

### BUG-06: `isProActive()` gọi API mỗi khi mở popup nếu offline cache > 1h
**File:** `service_worker.js` dòng 139-153

```javascript
async function isProActive() {
    if (!isProCache) return false;
    const now = Date.now();
    if (now > proValidUntil || (now - lastApiCheck > 60 * 60 * 1000)) {
        if (navigator.onLine) {
            await validateSubscriptionBackground();
```

**Vấn đề:**  
Biến `lastApiCheck` là **in-memory**, nên mỗi lần Service Worker ngủ đông (MV3 tắt sau 30s idle) và thức dậy, `lastApiCheck` sẽ bị reset về `0`. Điều này khiến:
- Gần như MỌI thao tác mở popup hoặc sync đều trigger gọi API `licenses/validate` đến Lemon Squeezy.
- Gây chậm UX và tiêu tốn quota API không cần thiết.

**Sửa đề xuất:**  
Lưu `lastApiCheck` vào `chrome.storage.local` cùng với `proValidUntil`, hoặc đọc lại từ storage khi startup (dòng 19).

---

### BUG-07: `clearStorageAndCloud` gọi `logoutGoogle()` trước khi kiểm tra xóa backup
**File:** `service_worker.js` dòng 311-330

```javascript
case 'clearStorageAndCloud':
    await clearStorage();
    let deletedCloud = false;
    try {
        deletedCloud = await deleteBackupFromDrive();
    } catch (e) { ... }
    if (typeof logoutGoogle === 'function') logoutGoogle(); // <-- BUG: Xóa token
```

**Vấn đề:**  
Thứ tự xử lý đã đúng (xóa Drive trước, logout sau). Tuy nhiên, hàm `deleteBackupFromDrive()` bên trong gọi `getAccessToken(false)` — nếu token memory đã hết hạn, nó sẽ cố dùng `getAccessToken(true)` (interactive). Nhưng vì ngay sau đó `logoutGoogle()` xóa token, nên lần chạy tiếp theo user phải login lại. Đây **không phải lỗi nặng** nhưng luồng xử lý hơi rối.

---

### BUG-08: Popup hiển thị `autoBackupInterval` mặc định là 60 cho user Free
**File:** `popup/app.js` dòng 276

```javascript
settingBackup.value = res.autoBackupInterval !== undefined ? String(res.autoBackupInterval) : "60";
```

**Vấn đề:**  
Khi user mới cài extension (Free), dropdown Auto-Backup hiện mặc định **"60"** (60 phút). Nhưng thực tế user Free không thể dùng Auto-Backup (bị chặn ở dòng 301). Điều này tạo ấn tượng sai rằng tính năng đang hoạt động.

**Sửa đề xuất:**  
Mặc định nên là `"0"` (Off) cho user chưa có Pro:
```javascript
settingBackup.value = res.autoBackupInterval !== undefined ? String(res.autoBackupInterval) : "0";
```

---

## 3. 🔵 Cải thiện hiệu năng & Chất lượng code (Improvements)

### IMP-01: `importScripts('../libs/dexie.min.js')` bị gọi 2 lần
**File:** `service_worker.js` dòng 1 và `db.js` dòng 1

Cả 2 file đều `importScripts('../libs/dexie.min.js')`. Service Worker load `db.js` qua `importScripts('db.js')`, nghĩa là Dexie được import 2 lần. Trình duyệt sẽ bỏ qua bản thứ hai, nhưng đây là dead code gây nhầm lẫn.

**Sửa đề xuất:**  
Xóa dòng `importScripts` trong `db.js`, chỉ giữ lại trong `service_worker.js`.

---

### IMP-02: `manifest.json` — version vẫn là `3.0.0`
**File:** `manifest.json` dòng 4

Version code vẫn là `"3.0.0"` nhưng bạn đã tag Git `neoclip-v3.0.1`. Chrome Web Store yêu cầu version trong manifest phải **tăng** mỗi lần upload bản mới. Nếu upload ZIP hiện tại, sẽ bị reject vì trùng version cũ.

**Sửa đề xuất:**  
Đổi thành `"3.0.1"` hoặc cao hơn.

---

### IMP-03: `compressImage()` trong `bubble.js` không bao giờ được gọi
**File:** `bubble.js` dòng 1088-1119

Hàm `compressImage()` được định nghĩa đầy đủ nhưng **không có chỗ nào trong toàn bộ codebase gọi nó**. Đây là dead code.

**Sửa đề xuất:**  
Xóa hàm hoặc tích hợp vào flow lưu ảnh clipboard để giảm dung lượng database (ảnh clipboard screenshot thường rất lớn ~3-5MB mỗi ảnh).

---

### IMP-04: `popup/index.html` load font từ Google CDN — Lỗi offline & CSP
**File:** `popup/index.html` dòng 6

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Vấn đề:**  
- Popup sẽ không có font đẹp khi user offline.
- Một số chính sách Content Security Policy (CSP) nghiêm ngặt có thể chặn request này.

**Sửa đề xuất:**  
Download font Inter về thư mục `libs/fonts/` và load locally.

---

### IMP-05: Polling clipboard mỗi 1.5 giây có thể gây lag
**File:** `bubble.js` dòng 1122-1137

```javascript
setInterval(async () => {
    if (document.hasFocus() && Date.now() >= ignoreSyncUntil) {
        const isNew = await syncClipboard();
        // ...
    }
}, 1500);
```

**Vấn đề:**  
`setInterval` 1.5s chạy trên **MỌI** tab đang mở. Nếu user mở 20 tab, mỗi giây sẽ có ~13 lần `syncClipboard()` được gọi. Dù có check `document.hasFocus()`, mỗi lần vẫn tạo message đến service worker.

**Sửa đề xuất:**  
Tăng interval lên 3-5 giây, hoặc dùng `document.addEventListener('visibilitychange')` để chỉ poll khi tab đang visible.

---

### IMP-06: `offscreen.html` không có trong `web_accessible_resources`
**File:** `manifest.json`

File `background/offscreen.html` được tạo bởi `setupOffscreenDocument()` nhưng không cần nằm trong `web_accessible_resources` vì nó được mở bởi chính extension. Điều này OK, **không phải lỗi**.

---

## 4. ✅ Những phần hoạt động tốt

| Tính năng | Đánh giá |
|-----------|----------|
| **Bảo mật License (Store ID check)** | ✅ Kiểm tra `VALID_STORE_ID` ở cả 3 hàm: `validateSubscriptionBackground`, `checkLicense`, `restoreLicense`. Vá lỗ hổng chéo store hoàn hảo. |
| **Offline Grace Period** | ✅ Logic `proValidUntil` cho phép user dùng Pro offline đến khi hết hạn subscription, rất hợp lý. |
| **Shadow DOM Isolation** | ✅ Bubble UI sử dụng Shadow DOM, tránh xung đột CSS với website host. |
| **Deduplicate clipboard** | ✅ `saveItem()` kiểm tra trùng lặp trước khi lưu, tránh spam database. |
| **Keyboard Shortcut (Alt+V)** | ✅ Hoạt động tốt, toggle panel mượt mà. |
| **Google Lens Integration** | ✅ Upload ảnh trực tiếp đến lens.google.com qua form submit, không cần API key. |
| **Auto-backup alarm fix** | ✅ Đã sửa không reset alarm mỗi lần SW wake up. |
| **Bidirectional Sync** | ✅ Merge 2 chiều (local ↔ Drive) với dedup theo `content + type`. |
| **Soft-lock Collections** | ✅ Free user thấy collection bị khóa nhưng dữ liệu không bị xóa khi downgrade. |
| **URL Cleaner** | ✅ Loại bỏ tracking params (utm_*, fbclid, gclid...) khi copy link. |

---

## Bảng tổng kết mức độ ưu tiên sửa

| # | Mô tả | Mức | File | Ước lượng |
|---|-------|-----|------|-----------|
| BUG-01 | Sync cắt bớt dữ liệu Drive | 🔴 Critical | `sync.js` | 15 phút |
| BUG-02 | Recent hiển thị items đã vào Collection | 🔴 Critical | `db.js` | 5 phút |
| BUG-03 | Disconnect không xóa license Drive | 🔴 Critical | `service_worker.js` | 10 phút |
| BUG-06 | `lastApiCheck` bị reset mỗi lần SW wake | 🟡 Medium | `service_worker.js` | 10 phút |
| BUG-08 | Auto-Backup mặc định 60 cho Free user | 🟡 Medium | `popup/app.js` | 1 phút |
| IMP-02 | Manifest version vẫn 3.0.0 | 🟡 Medium | `manifest.json` | 1 phút |
| IMP-01 | Dexie import trùng | 🔵 Low | `db.js` | 1 phút |
| IMP-03 | `compressImage` dead code | 🔵 Low | `bubble.js` | 1 phút |
| IMP-04 | Font online | 🔵 Low | `popup/index.html` | 10 phút |
| IMP-05 | Polling 1.5s trên mọi tab | 🔵 Low | `bubble.js` | 5 phút |
