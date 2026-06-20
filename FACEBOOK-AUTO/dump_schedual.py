import re
with open('schedual.js', 'r', encoding='utf-8') as f:
    content = f.read()

# find saveScheduleBtn click handler
match = re.search(r't\(\)\("#saveScheduleBtn"\)\.on\("click",function\(\)\{.*?\}\)', content)
if not match:
    match = re.search(r't\(\)\("#saveScheduleBtn"\)\.click\(function\(\)\{.*?\}\)', content)
if not match:
    # generic search
    match = re.search(r'saveScheduleBtn.*?\}', content)

with open('schedual_dump.txt', 'w', encoding='utf-8') as f:
    if match:
        f.write(match.group(0))
    else:
        f.write("Not found")
