import re, json
with open('schedual.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find saveScheduleBtn and extract 1000 chars after it
match = re.search(r'saveScheduleBtn.*?(\.addEventListener.*?|\.on\()', content)
idx = content.find("saveScheduleBtn")
if idx != -1:
    with open('schedual_dump.json', 'w', encoding='utf-8') as f:
        f.write(json.dumps(content[idx:idx+1500]))
