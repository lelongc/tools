import re

with open('D:\\\\folder\\\\tools\\\\FACEBOOK-AUTO\\\\popup.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the viewBtn listener block
regex = re.compile(r"viewBtn\.addEventListener\('click',\s*\(\)\s*=>\s*\{[\s\S]*?\}\);\s*\}", re.MULTILINE)
replacement = """viewBtn.addEventListener('click', () => {
      console.log('[FACEBOOK-AUTO] View logs button clicked, fetching from storage...');
      chrome.storage.local.get(['postsCompleted'], (res) => {
        if (res.postsCompleted) {
          if (typeof window.renderLogsModal === 'function') {
            window.renderLogsModal(res.postsCompleted);
          }
        }
      });
    });
  }"""

text = regex.sub(replacement, text)

with open('D:\\\\folder\\\\tools\\\\FACEBOOK-AUTO\\\\popup.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Patched viewBtn to use renderLogsModal')
