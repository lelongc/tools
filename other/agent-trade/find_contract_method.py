import requests
import re

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

with open(r"C:\Users\Acer\.gemini\antigravity-ide\brain\667a5c94-1188-4fce-8846-c60e367ed04e\.system_generated\steps\608\content.md", "r", encoding="utf-8") as f:
    text = f.read()

scripts = re.findall(r'src="(/_next/static/immutable/chunks/[^"]+)"', text)
contract_addr = "0xd87adb2e47979d6cb323896b1a9320e0dd132213"

found = []
for s in scripts:
    url = f"https://ptah.trade{s}"
    try:
        r = requests.get(url, headers=headers, timeout=5)
        if contract_addr in r.text.lower():
            print("Found contract in:", url)
            found.append((url, r.text))
    except Exception:
        pass

for url, content in found:
    # search around contract_addr
    idx = content.lower().find(contract_addr)
    start = max(0, idx - 500)
    end = min(len(content), idx + 1000)
    print("--- SNIPPET ---")
    print(content[start:end])
