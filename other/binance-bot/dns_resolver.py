import socket
import requests

# Bộ nhớ đệm IP đã phân giải để không phải gọi DoH nhiều lần
_DNS_CACHE = {}

def resolve_via_doh(domain: str) -> str:
    """
    Phân giải DNS qua Google DNS over HTTPS (DoH) hoặc Cloudflare
    Giúp vượt qua việc các nhà mạng tại VN chặn DNS tên miền binance.com
    """
    if domain in _DNS_CACHE:
        return _DNS_CACHE[domain]

    # 1. Thử qua Google DNS
    try:
        url = f"https://dns.google/resolve?name={domain}"
        resp = requests.get(url, timeout=4)
        if resp.status_code == 200:
            data = resp.json()
            for ans in data.get("Answer", []):
                if ans.get("type") == 1: # IPv4
                    ip = ans.get("data")
                    if ip:
                        _DNS_CACHE[domain] = ip
                        return ip
    except Exception:
        pass

    # 2. Thử qua Cloudflare DNS dự phòng
    try:
        url = f"https://cloudflare-dns.com/dns-query?name={domain}&type=A"
        headers = {"accept": "application/dns-json"}
        resp = requests.get(url, headers=headers, timeout=4)
        if resp.status_code == 200:
            data = resp.json()
            for ans in data.get("Answer", []):
                if ans.get("type") == 1:
                    ip = ans.get("data")
                    if ip:
                        _DNS_CACHE[domain] = ip
                        return ip
    except Exception:
        pass

    return ""

_orig_getaddrinfo = socket.getaddrinfo

def _custom_getaddrinfo(host, port, *args, **kwargs):
    if "binance" in str(host).lower():
        # Thử phân giải bình thường trước
        try:
            return _orig_getaddrinfo(host, port, *args, **kwargs)
        except socket.gaierror:
            # Nếu DNS nhà mạng chặn, tự động dùng DoH phân giải IP chuẩn
            resolved_ip = resolve_via_doh(host)
            if resolved_ip:
                return _orig_getaddrinfo(resolved_ip, port, *args, **kwargs)
            raise
    return _orig_getaddrinfo(host, port, *args, **kwargs)

# Kích hoạt tự động bypass DNS chặn
socket.getaddrinfo = _custom_getaddrinfo

if __name__ == "__main__":
    print("Testing Anti-DNS-Block...")
    res = socket.getaddrinfo("fapi.binance.com", 443)
    print("Resolved fapi.binance.com successfully:", res[0][4][0])
