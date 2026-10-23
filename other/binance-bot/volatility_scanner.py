import sys
import dns_resolver
import requests

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

class VolatilityScanner:
    BASE_URL = "https://fapi.binance.com"

    # Danh sách các coin an toàn cơ bản (không tính là coin lướt mạo hiểm)
    SAFE_COINS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"]

    @classmethod
    def scan_breakout_coins(cls, top_limit: int = 5) -> list[dict]:
        """
        Quét toàn bộ thị trường Binance Futures để tìm các đồng coin đang có sóng mạnh nhất:
        - Tăng trưởng 24h từ 4% đến 25% (đang có đà đẩy, không chọn con đã x2-x3 tránh đu đỉnh)
        - Volume giao dịch trên 30 triệu USDT (đảm bảo thanh khoản, không sợ trượt giá)
        """
        try:
            url = f"{cls.BASE_URL}/fapi/v1/ticker/24hr"
            resp = requests.get(url, timeout=10)
            if resp.status_code != 200:
                return []

            tickers = resp.json()
            candidates = []

            for t in tickers:
                symbol = t.get("symbol", "")
                if not symbol.endswith("USDT") or symbol in cls.SAFE_COINS:
                    continue

                price_change = float(t.get("priceChangePercent", 0.0))
                volume_quote = float(t.get("quoteVolume", 0.0)) # Khối lượng tính theo USDT
                last_price = float(t.get("lastPrice", 0.0))

                # Điều kiện lọc coin lướt sóng tiềm năng:
                # 1. Tăng trong khoảng 4% - 25% (có dòng tiền đẩy)
                # 2. Volume > 30 triệu USDT
                if 4.0 <= price_change <= 25.0 and volume_quote > 30_000_000:
                    candidates.append({
                        "symbol": symbol,
                        "price": last_price,
                        "change_24h": round(price_change, 2),
                        "volume_usdt_m": round(volume_quote / 1_000_000, 1)
                    })

            # Sắp xếp theo % tăng trưởng giảm dần
            candidates.sort(key=lambda x: x["change_24h"], reverse=True)
            return candidates[:top_limit]

        except Exception as e:
            print(f"[Lỗi quét sóng thị trường]: {e}")
            return []

if __name__ == "__main__":
    print("Testing Volatility Scanner...")
    hot_coins = VolatilityScanner.scan_breakout_coins(top_limit=5)
    print(f"Tìm thấy {len(hot_coins)} coin đang có dòng tiền và biến động mạnh:")
    for c in hot_coins:
        print(f" - {c['symbol']}: Giá {c['price']}$ | Tăng 24h: +{c['change_24h']}% | Volume: {c['volume_usdt_m']}M$")
