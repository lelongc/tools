import time
import hmac
import hashlib
import urllib.parse
import requests
import dns_resolver # Tự động chống chặn DNS nhà mạng VN
from config import Config
from indicators import TechnicalIndicators

class BinanceEngine:
    def __init__(self):
        self.api_key = Config.BINANCE_API_KEY
        self.secret_key = Config.BINANCE_API_SECRET
        self.base_url = "https://testnet.binancefuture.com" if Config.USE_TESTNET else "https://fapi.binance.com"
        self.headers = {"X-MBX-APIKEY": self.api_key}

    def _format_symbol(self, symbol: str) -> str:
        """Chuẩn hóa ký hiệu coin: SOL/USDT -> SOLUSDT"""
        return symbol.replace("/", "").strip().upper()

    def _sign_params(self, params: dict) -> dict:
        """Ký HMAC-SHA256 chuẩn Binance API"""
        params["timestamp"] = int(time.time() * 1000)
        query_string = urllib.parse.urlencode(params)
        signature = hmac.new(
            self.secret_key.encode("utf-8"),
            query_string.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()
        params["signature"] = signature
        return params

    def setup_safety(self, symbol: str, leverage: int = 5):
        """
        Bảo vệ vốn: Cài đặt chế độ ký quỹ ISOLATED (cô lập) và đòn bẩy quy định
        """
        formatted = self._format_symbol(symbol)
        try:
            # 1. Đặt Margin Type = ISOLATED (Không bao giờ để Cross để tránh rủi ro toàn bộ ví)
            try:
                params = self._sign_params({"symbol": formatted, "marginType": "ISOLATED"})
                requests.post(f"{self.base_url}/fapi/v1/marginType", headers=self.headers, params=params, timeout=10)
            except Exception:
                pass

            # 2. Đặt đòn bẩy
            params = self._sign_params({"symbol": formatted, "leverage": leverage})
            resp = requests.post(f"{self.base_url}/fapi/v1/leverage", headers=self.headers, params=params, timeout=10)
            return resp.status_code == 200
        except Exception as e:
            print(f"[Cảnh báo thiết lập an toàn]: {e}")
            return False

    def get_usdt_balance(self) -> float:
        """Lấy số dư USDT khả dụng trong ví Futures"""
        if not self.api_key or not self.secret_key:
            return 0.0
        try:
            params = self._sign_params({})
            resp = requests.get(f"{self.base_url}/fapi/v2/balance", headers=self.headers, params=params, timeout=10)
            if resp.status_code == 200:
                balances = resp.json()
                for item in balances:
                    if item.get("asset") == "USDT":
                        return float(item.get("availableBalance", 0.0))
            else:
                print(f"[Lỗi Binance API Balance]: {resp.status_code} - {resp.text}")
            return 0.0
        except Exception as e:
            print(f"[Lỗi đọc số dư]: {e}")
            return 0.0

    def get_market_snapshot(self, symbol: str) -> dict:
        """
        Lấy nến 15m, tính RSI, EMA, Bollinger Bands, Funding Rate từ Binance
        """
        formatted = self._format_symbol(symbol)
        try:
            # 1. Lấy nến 15m (50 nến gần nhất)
            url = f"{self.base_url}/fapi/v1/klines?symbol={formatted}&interval=15m&limit=50"
            resp = requests.get(url, timeout=10)
            if resp.status_code != 200:
                print(f"[Lỗi đọc nến]: {resp.text}")
                return {}

            candles = resp.json()
            close_prices = [float(c[4]) for c in candles]
            current_price = close_prices[-1]

            # 2. Tính toán kỹ thuật
            rsi = TechnicalIndicators.calculate_rsi(close_prices, 14)
            ema20 = TechnicalIndicators.calculate_ema(close_prices, 20)
            ema50 = TechnicalIndicators.calculate_ema(close_prices, 50)

            ema_trend = "NEUTRAL"
            if ema20 and ema50:
                if ema20[-1] > ema50[-1]:
                    ema_trend = "BULLISH (EMA20 > EMA50 - Xu hướng tăng)"
                else:
                    ema_trend = "BEARISH (EMA20 < EMA50 - Xu hướng giảm)"

            bb = TechnicalIndicators.calculate_bollinger_bands(close_prices, 20, 2.0)

            # 3. Lấy Ticker 24h & Funding rate
            change_24h = 0.0
            t_resp = requests.get(f"{self.base_url}/fapi/v1/ticker/24hr?symbol={formatted}", timeout=10)
            if t_resp.status_code == 200:
                change_24h = float(t_resp.json().get("priceChangePercent", 0.0))

            funding_rate = 0.0
            p_resp = requests.get(f"{self.base_url}/fapi/v1/premiumIndex?symbol={formatted}", timeout=10)
            if p_resp.status_code == 200:
                funding_rate = round(float(p_resp.json().get("lastFundingRate", 0.0)) * 100, 4)

            return {
                "symbol": symbol,
                "price": current_price,
                "change_24h": round(change_24h, 2),
                "rsi": rsi,
                "ema_trend": ema_trend,
                "bb_upper": bb["upper"],
                "bb_mid": bb["middle"],
                "bb_lower": bb["lower"],
                "funding_rate": funding_rate
            }
        except Exception as e:
            print(f"[Lỗi lấy dữ liệu thị trường]: {e}")
            return {}

    def get_open_position(self, symbol: str) -> dict:
        """
        Kiểm tra trạng thái vị thế đang mở
        """
        if not self.api_key or not self.secret_key:
            return {"has_position": False, "side": None, "pnl": 0.0}
            
        formatted = self._format_symbol(symbol)
        try:
            params = self._sign_params({"symbol": formatted})
            resp = requests.get(f"{self.base_url}/fapi/v2/positionRisk", headers=self.headers, params=params, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                for pos in data:
                    amt = float(pos.get("positionAmt", 0.0))
                    if abs(amt) > 0.0001:
                        side = "LONG" if amt > 0 else "SHORT"
                        unrealized_pnl = float(pos.get("unRealizedProfit", 0.0))
                        entry_price = float(pos.get("entryPrice", 0.0))
                        mark_price = float(pos.get("markPrice", 0.0))
                        return {
                            "has_position": True,
                            "side": side,
                            "amount": abs(amt),
                            "entry_price": entry_price,
                            "mark_price": mark_price,
                            "pnl": round(unrealized_pnl, 4)
                        }
            return {"has_position": False, "side": None, "pnl": 0.0}
        except Exception as e:
            print(f"[Lỗi kiểm tra vị thế]: {e}")
            return {"has_position": False, "side": None, "pnl": 0.0}

    def open_market_order(self, symbol: str, side: str, margin_usdt: float, leverage: int):
        """
        Vào lệnh Market (LONG / SHORT) với khối lượng an toàn
        """
        formatted = self._format_symbol(symbol)
        try:
            self.setup_safety(symbol, leverage)

            # Lấy giá hiện tại
            snapshot = self.get_market_snapshot(symbol)
            current_price = snapshot.get("price")
            if not current_price:
                return None

            notional = margin_usdt * leverage
            if notional < 5.5:
                notional = 5.5

            raw_amount = notional / current_price
            
            # Làm tròn số lượng phù hợp với coin (SOL 2 chữ số thập phân)
            amount = round(raw_amount, 2)
            if amount <= 0:
                amount = 0.01

            order_side = "BUY" if side.upper() == "LONG" else "SELL"
            print(f"🚀 [ĐẶT LỆNH] {side.upper()} {amount} {formatted} (Ký quỹ: ~{margin_usdt}$, Giá: {current_price}$)")

            params = self._sign_params({
                "symbol": formatted,
                "side": order_side,
                "type": "MARKET",
                "quantity": amount
            })

            resp = requests.post(f"{self.base_url}/fapi/v1/order", headers=self.headers, params=params, timeout=12)
            if resp.status_code == 200:
                return resp.json()
            else:
                print(f"[Lỗi đặt lệnh Binance]: {resp.status_code} - {resp.text}")
                return None
        except Exception as e:
            print(f"[Lỗi vào lệnh {side}]: {e}")
            return None

    def close_market_position(self, symbol: str):
        """
        Đóng toàn bộ vị thế ngay lập tức bằng lệnh Market (reduceOnly=true)
        """
        formatted = self._format_symbol(symbol)
        try:
            pos = self.get_open_position(symbol)
            if not pos.get("has_position"):
                return True

            amount = pos["amount"]
            current_side = pos["side"]
            close_side = "SELL" if current_side == "LONG" else "BUY"

            print(f"🎯 [ĐÓNG VỊ THẾ] Đóng {current_side} {amount} {formatted}...")

            params = self._sign_params({
                "symbol": formatted,
                "side": close_side,
                "type": "MARKET",
                "quantity": amount,
                "reduceOnly": "true"
            })

            resp = requests.post(f"{self.base_url}/fapi/v1/order", headers=self.headers, params=params, timeout=12)
            if resp.status_code == 200:
                return resp.json()
            else:
                print(f"[Lỗi đóng vị thế]: {resp.status_code} - {resp.text}")
                return None
        except Exception as e:
            print(f"[Lỗi đóng vị thế]: {e}")
            return None
