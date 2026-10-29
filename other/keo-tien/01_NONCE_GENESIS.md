# 🎯 KÈO 1: NONCE PROTOCOL GENESIS FREE MINT (KÈO MÓN CHÍNH)

> **Mục tiêu:** Mint tối đa **2 NFT Free** và bán trên chợ Launchpad thu về **~20 USDT**.  
> **Thời gian mở đợt tiếp theo:** **22:00:00 (10:00 PM) - Ngày 27/10/2026 (Giờ VN)**  
> **Trạng thái chuẩn bị:** Sẵn sàng 100% (Thuật toán Glucose4 đo thực tế trên máy giải xong chỉ mất 0.03 giây).

---

## 1. Thông Tin Dự Án & Hợp Đồng (BNB Chain - Chain ID 56)
* **Website Mint:** `https://nonceprotocol.xyz/mint`
* **Chợ giao dịch:** `https://launchpad.nonceprotocol.xyz/collection/nonce`
* **Giá sàn hiện tại trên chợ:** **~10 USDT / NFT** (Đang được cộng đồng săn mua mạnh)
* **Hợp đồng FreeMint:** `0x7538ba8C1A82E9706dB6d2463C15f69ADc01a17e`
* **Hợp đồng NFT:** `0x053259A3D30E63d9447E3d90813C6a494bcB398a`
* **AgentGate:** `0xc8D8EebAd7Fdd590edA6d23164B1eC014913Ce8f`
* **BNB Agent ID Registry:** `0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F`
* **MCP Server Endpoint:** `https://mcp.nonceprotocol.xyz/mcp`

---

## 2. Kiểm Tra Hạn Mức Ví Của Bạn
* **Địa chỉ ví:** `0x988fECF5030C36351272aBB39293fb8A9043ED8b` (`smartflow.ai`)
* **Số lượng đã mint:** `0 / 2`
* **Số suất mint còn lại:** **2 suất** (Đủ điều kiện tối đa).
* **Phí mint:** 0 BNB (Chỉ tốn ~0.0003 BNB gas mạng lưới).

---

## 3. Cách Thức Hoạt Động Của Script Tự Động (`nonce_sniper.py`)
1. **Lúc 21:55:** Bật script lắng nghe on-chain `FreeMint.paused()` và API MCP.
2. **Đúng 22:00:00:** Cổng mở (`paused: False`), script tự động:
   * Gửi challenge lấy các mảnh logic SAT (33,792 mệnh đề, 1,536 biến).
   * Dùng solver **Glucose4** trong máy bạn giải trong vòng **0.03 - 1 giây**.
   * Nộp bài giải (Artifact) lên MCP lấy chữ ký bằng chứng hợp lệ (Proof).
   * Kích hoạt ví **Binance Agentic Wallet (`baw`)** thực thi giao dịch mint on-chain.
   * Lặp lại lượt thứ 2 để húp trọn **2 NFT**.
   * Bắn thông báo báo cáo TxHash ting ting về Telegram `@jack_scalper_bot`.

---

## 4. Kế Hoạch Chốt Lời Sau Khi Mint
* Ngay sau khi mint xong 2 NFT, tôi sẽ hỗ trợ bạn mang cả 2 NFT lên chợ `launchpad.nonceprotocol.xyz/collection/nonce` treo bán ở mức giá sàn **~10 USDT / con** để rút ngay **~20 USDT** tiền tươi về ví!
