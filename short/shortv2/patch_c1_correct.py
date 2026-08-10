import os

c1_path = r"d:\folder\tools\short\shortv2\c1.py"
with open(c1_path, "r", encoding="utf-8") as f:
    code = f.read()

# Fix the pip install line
code = code.replace(" whisper duckduckgo-search", " openai-whisper")
code = code.replace(" whisper", " openai-whisper")

with open(c1_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Patched c1.py successfully!")
