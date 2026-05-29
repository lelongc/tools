import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update the CSS for loading-overlay and loading-spinner
old_css = """    /* Overlays */
    .loading-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.7); z-index: 9999; display: flex;
      flex-direction: column; align-items: center; justify-content: center; color: white;
    }
    .loading-spinner {
      width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.3);
      border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite;
    }"""

new_css = """    /* Overlays */
    .loading-overlay {
      position: fixed; bottom: 20px; right: 20px; width: auto; height: auto;
      background: var(--bg-card); z-index: 9999; display: flex;
      flex-direction: row; align-items: center; justify-content: center; color: var(--text-color);
      padding: 12px 20px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      border: 1px solid var(--border-color);
      max-width: 350px;
    }
    .loading-spinner {
      width: 24px; height: 24px; border: 3px solid var(--border-color);
      border-top: 3px solid var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite;
      flex-shrink: 0;
    }"""

if old_css in html:
    html = html.replace(old_css, new_css)
else:
    print("Could not find CSS to replace")

# 2. Update the HTML structure of the loading overlay
old_html = """  <!-- Loading Overlay -->
  <div id="loadingOverlay" class="loading-overlay d-none">
    <div class="loading-spinner"></div>
    <h5 class="mt-3">Đang xử lý...</h5>
  </div>"""

new_html = """  <!-- Loading Overlay (Floating) -->
  <div id="loadingOverlay" class="loading-overlay d-none">
    <div class="loading-spinner me-3"></div>
    <div id="loadingText" class="mb-0 fs-6 fw-semibold text-truncate" style="flex-grow: 1;">Đang xử lý...</div>
  </div>"""

if old_html in html:
    html = html.replace(old_html, new_html)
else:
    print("Could not find HTML to replace")

with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Successfully patched popup.html to make the loading overlay smaller")
