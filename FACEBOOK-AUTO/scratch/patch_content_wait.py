import re

with open(r'd:\folder\tools\FACEBOOK-AUTO\content.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add 3 seconds wait before returning success so user can see it
text = text.replace(
    'if (isSuccess) return console.log("✅ Post successfully published."), "success";',
    'if (isSuccess) { console.log("✅ Post successfully published."); await y(3); return "success"; }'
)
text = text.replace(
    'if (isPending) return console.log("✅ Post went to pending approval (counted as success)."), "success";',
    'if (isPending) { console.log("✅ Post went to pending approval (counted as success)."); await y(3); return "success"; }'
)

# 2. Add longer delays to writeText and insertPostText for the Title
text = text.replace(
    'await writeText(titleElement, postTitleText);\n      await y(0.5);',
    'await writeText(titleElement, postTitleText);\n      await y(1.5);'
)
text = text.replace(
    'await writeText(bodyElement, postText);\n  await y(1);',
    'await writeText(bodyElement, postText);\n  await y(1.5);'
)
text = text.replace(
    'console.log("[FACEBOOK-AUTO] insertPostText called. text length:", postText?.length, "title:", postTitleText);\n  await y(0.5);',
    'console.log("[FACEBOOK-AUTO] insertPostText called. text length:", postText?.length, "title:", postTitleText);\n  await y(1.5);'
)

with open(r'd:\folder\tools\FACEBOOK-AUTO\content.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("content.js patched with delays")
