import requests
import re

url = "https://ptah.trade/_next/static/immutable/chunks/09r8n4gv06le8.js"
t = requests.get(url).text

# Look for ABI fragments with type:"function"
matches = re.findall(r'\{[^{}]*name:"([^"]+)",[^{}]*type:"function"[^{}]*\}', t)
print("ABI functions found in 09r8n4gv06le8.js:", set(matches))

# Look for encodeFunctionData or function signatures
encodes = re.findall(r'encodeFunctionData\(\{([^}]+)\}', t)
for e in encodes[:5]:
    print("encodeFunctionData:", e)

# Also search 14ekptn3iuqaj.js
t2 = requests.get("https://ptah.trade/_next/static/immutable/chunks/14ekptn3iuqaj.js").text
matches2 = re.findall(r'\{[^{}]*name:"([^"]+)",[^{}]*type:"function"[^{}]*\}', t2)
print("ABI functions in 14ekptn3iuqaj.js:", set(matches2))
