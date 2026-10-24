import requests
import re

url = "https://airdrop.axisrobotics.ai/_next/static/chunks/app/page-5fe9691211e1e234.js"
r = requests.get(url)
if r.status_code == 200:
    contracts = set(re.findall(r"0x[a-fA-F0-9]{40}", r.text))
    endpoints = set(re.findall(r"/api/[a-zA-Z0-9_\-/]+", r.text))
    print("Contracts found:", contracts)
    print("Endpoints found:", endpoints)
else:
    print("HTTP error:", r.status_code)
