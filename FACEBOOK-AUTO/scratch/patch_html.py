with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.html', 'r', encoding='utf-8') as f:
    html = f.read()

toast_html = """
<!-- Toast Notification -->
<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
  <div id="toastNotification" class="toast align-items-center text-white bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">
        <i id="toastIcon" class="bi bi-info-circle me-2"></i>
        <span id="toastMessage">Message</span>
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
</div>
"""

if 'toastNotification' not in html:
    html = html.replace('</body>', toast_html + '\n</body>')
    with open(r'd:\folder\tools\FACEBOOK-AUTO\popup.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('Toast container injected into popup.html')
else:
    print('Toast container already exists')
