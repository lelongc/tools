
Dưới đây là trọn bộ **4 lệnh** chuẩn theo thứ tự để bạn chạy trong Console (F12):

### Lệnh 1: Tự động cuộn và bấm mở rộng bình luận

Mở tab **Console** (bấm F12), dán đoạn mã sau vào rồi bấm **Enter** để bắt đầu cuộn tự động:

**JavaScript**

```
window.scrollFb = setInterval(() => {
  const dialog = document.querySelector('[role="dialog"]') || document;
  dialog.querySelectorAll('div').forEach(el => {
    if (el.scrollHeight > el.clientHeight && el.clientHeight > 250) {
      el.scrollTop = el.scrollHeight;
    }
  });
  window.scrollTo(0, document.body.scrollHeight);
  document.documentElement.scrollTop = document.documentElement.scrollHeight;

  const buttons = dialog.querySelectorAll('div[role="button"], span');
  buttons.forEach(btn => {
    const text = btn.innerText || "";
    if (
      text.includes("Xem thêm bình luận") ||
      text.includes("bình luận trước") ||
      text.includes("câu trả lời")
    ) {
      btn.click();
    }
  });
}, 1200);

console.log("%c[1/4] ĐANG ÉP CUỘN BÌNH LUẬN...", "color: #38bdf8; font-weight: bold; font-size: 14px;");
```

### Lệnh 2: Dừng cuộn

Khi thấy bài viết đã tải được lượng bình luận vừa ý, dán lệnh sau vào Console rồi bấm  **Enter** :

**JavaScript**

```
clearInterval(window.scrollFb);
console.log("%c[2/4] ĐÃ DỪNG CUỘN THÀNH CÔNG!", "color: #f59e0b; font-weight: bold; font-size: 14px;");
```

### Lệnh 3: Xuất file `so_chua_dung.txt` (Các số 000–999 còn trống)

Dán đoạn mã sau vào rồi bấm **Enter** để tải file danh sách các số chưa ai comment:

**JavaScript**

```
(() => {
  const text = document.body.innerText;
  const matches = text.match(/\b\d{3}\b/g) || [];
  const taken = new Set(matches.map(n => parseInt(n, 10)));

  const missing = [];
  for (let i = 0; i <= 999; i++) {
    if (!taken.has(i)) {
      missing.push(i.toString().padStart(3, '0'));
    }
  }

  const content = [
    "DANH SÁCH CÁC SỐ CHƯA AI DÙNG (000 - 999)",
    `Tổng số đã bị comment: ${taken.size}/1000`,
    `Tổng số còn trống: ${missing.length}`,
    `Gợi ý 5 số trống để cmt ngay: ${missing.sort(() => 0.5 - Math.random()).slice(0, 5).join(', ')}`,
    "-------------------------------------------",
    ...missing
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'so_chua_dung.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  console.log(`%c[3/4] Đã xuất file so_chua_dung.txt (${missing.length} số còn trống)!`, "color: #10b981; font-weight: bold; font-size: 14px;");
})();
```

### Lệnh 4: Xuất file `thong_ke_so_trung.txt` (Ai chọn, trùng mấy người, link từng comment)

Đoạn mã này quét từng thẻ bình luận (`div[role="article"]`), bóc tách  **Tên người comment** ,  **Link gắn với comment đó** , gom nhóm theo từng con số và xếp số bị trùng nhiều nhất lên đầu:

**JavaScript**

```
(() => {
  const articles = document.querySelectorAll('div[role="article"]');
  const numberMap = {};

  articles.forEach(art => {
    // 1. Lấy tên người bình luận
    const authorEl = art.querySelector('a span') || art.querySelector('h3') || art.querySelector('strong');
    const author = authorEl ? authorEl.innerText.trim() : 'Ẩn danh';

    // 2. Lấy link dẫn đến comment (thẻ a chứa comment_id hoặc chứa thời gian)
    const linkEl = art.querySelector('a[href*="comment_id"]') || 
                   art.querySelector('a[href*="/permalink/"]') || 
                   Array.from(art.querySelectorAll('a')).find(a => /\b(\d+\s*(giờ|phút|ngày|h|m|d|giây|tháng)|Vừa xong)\b/i.test(a.innerText));
    const commentLink = linkEl ? linkEl.href : '(Không tìm thấy link)';

    // 3. Lấy nội dung text và lọc số 3 chữ số
    const text = art.innerText || '';
    const matches = text.match(/\b\d{3}\b/g) || [];
    const uniqueNums = [...new Set(matches)];

    uniqueNums.forEach(num => {
      if (!numberMap[num]) numberMap[num] = [];
      numberMap[num].push({
        author,
        link: commentLink,
        preview: text.replace(/\n+/g, ' ').substring(0, 90)
      });
    });
  });

  // Sắp xếp số theo thứ tự trùng nhiều nhất -> ít nhất
  const sortedNumbers = Object.keys(numberMap).sort((a, b) => numberMap[b].length - numberMap[a].length);

  let output = [
    "==================================================================",
    "THỐNG KÊ CHI TIẾT CÁC SỐ ĐÃ COMMENT, SỐ LƯỢNG TRÙNG VÀ LINK COMMENT",
    `Tổng số lượng số khác nhau đã được chọn: ${sortedNumbers.length}`,
    "==================================================================\n"
  ];

  sortedNumbers.forEach(num => {
    const list = numberMap[num];
    const isDuplicate = list.length > 1;
    output.push(`[SỐ: ${num}] ===> Có ${list.length} người chọn ${isDuplicate ? '⚠️ (BỊ TRÙNG)' : '✅ (DUY NHẤT)'}`);
    list.forEach((item, idx) => {
      output.push(`   ${idx + 1}. Người cmt : ${item.author}`);
      output.push(`      Link cmt  : ${item.link}`);
      output.push(`      Nội dung  : ${item.preview}`);
    });
    output.push("------------------------------------------------------------------");
  });

  const blob = new Blob([output.join('\n')], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'thong_ke_so_trung.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  console.log(`%c[4/4] Đã xuất file thong_ke_so_trung.txt thành công!`, "color: #10b981; font-weight: bold; font-size: 14px;");
})();
```

Khi mở file `thong_ke_so_trung.txt`, ở mỗi con số, danh sách người chọn sẽ được liệt kê theo thứ tự từ trên xuống dưới đúng theo luồng hiển thị của Facebook. Bạn có thể nhấn trực tiếp vào link comment để xem thời gian chi tiết đến từng phút xem ai là người gõ trước.
