import requests
import re

# Search all script tags from ptah.trade/poa content
with open(r"C:\Users\Acer\.gemini\antigravity-ide\brain\667a5c94-1188-4fce-8846-c60e367ed04e\.system_generated\steps\608\content.md", "r", encoding="utf-8") as f:
    text = f.read()

scripts = re.findall(r'src="(/_next/static/immutable/chunks/[^"]+)"', text)
print(f"Total scripts found: {len(scripts)}")

contract_addr = "0xD87ADb2E47979d6cb323896B1A9320E0dd132213".lower()

found_url = None
for s in scripts:
    url = f"https://ptah.trade{s}"
    try:
        r = requests.get(url, timeout=10)
        if contract_addr in r.text.lower():
            print(f"Found in: {url}")
            found_url = url
            # Look for mint method, function names, ABI
            lines = [line for line in r.text.split(";") if "mint" in line.lower() or contract_addr in line.lower()]
            for l in lines[:10]:
                print("Line:", l[:200])
    except Exception as e:
        pass
