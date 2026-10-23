import math

class TechnicalIndicators:
    @staticmethod
    def calculate_ema(prices: list[float], period: int) -> list[float]:
        """Tính Exponential Moving Average (EMA)"""
        if len(prices) < period:
            return []
        
        multiplier = 2 / (period + 1)
        ema = [sum(prices[:period]) / period]
        
        for price in prices[period:]:
            ema.append((price - ema[-1]) * multiplier + ema[-1])
            
        return ema

    @staticmethod
    def calculate_rsi(prices: list[float], period: int = 14) -> float:
        """Tính RSI (Relative Strength Index) chuẩn 14 nến gần nhất"""
        if len(prices) < period + 1:
            return 50.0 # Mặc định trung tính
            
        gains = []
        losses = []
        
        for i in range(1, len(prices)):
            change = prices[i] - prices[i - 1]
            if change >= 0:
                gains.append(change)
                losses.append(0.0)
            else:
                gains.append(0.0)
                losses.append(abs(change))
                
        # Khởi tạo trung bình đầu tiên
        avg_gain = sum(gains[:period]) / period
        avg_loss = sum(losses[:period]) / period
        
        # Smoothed moving average cho các nến sau
        for i in range(period, len(gains)):
            avg_gain = (avg_gain * (period - 1) + gains[i]) / period
            avg_loss = (avg_loss * (period - 1) + losses[i]) / period
            
        if avg_loss == 0:
            return 100.0
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        return round(rsi, 2)

    @staticmethod
    def calculate_bollinger_bands(prices: list[float], period: int = 20, num_std: float = 2.0) -> dict:
        """Tính dải Bollinger Bands (Upper, Middle, Lower)"""
        if len(prices) < period:
            current = prices[-1] if prices else 0.0
            return {"upper": current, "middle": current, "lower": current}
            
        recent = prices[-period:]
        sma = sum(recent) / period
        variance = sum((x - sma) ** 2 for x in recent) / period
        std_dev = math.sqrt(variance)
        
        return {
            "upper": round(sma + (std_dev * num_std), 4),
            "middle": round(sma, 4),
            "lower": round(sma - (std_dev * num_std), 4)
        }
