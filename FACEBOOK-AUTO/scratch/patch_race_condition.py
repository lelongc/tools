import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace h(o.id) with (await c(8),h(o.id))
# We need to make sure we only replace it in the loop
pattern = r's\.push\(\{link:y\[t\],response:f,groupName:gName\}\),h\(o\.id\)'
replacement = 's.push({link:y[t],response:f,groupName:gName}),await c(8),h(o.id)'

new_text = re.sub(pattern, replacement, text)

if new_text != text:
    with open(r'd:\folder\tools\FACEBOOK-AUTO\background.js', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print("Patched background.js")
else:
    print("Could not find pattern in background.js")

# Now update content.js to set operationStatus BEFORE the 10 second wait
with open(r'd:\folder\tools\FACEBOOK-AUTO\content.js', 'r', encoding='utf-8') as f:
    content_text = f.read()

# Old content.js logic for success:
# if (isPending) { console.log("✅ Post went to pending approval (counted as success)."); await y(3); return "success"; }
# if (isSuccess) { console.log("✅ Post successfully published."); await y(3); return "success"; }
# Wait, let me check what content.js actually looks like right now!
