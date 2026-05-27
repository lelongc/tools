import fs from 'fs';

let text = fs.readFileSync('D:\\\\folder\\\\tools\\\\FACEBOOK-AUTO\\\\popup.js', 'utf-8');

// Replace j(e.postsCompleted) with window.renderLogsModal(e.postsCompleted)
text = text.replace(/j\(e\.postsCompleted\)/g, "window.renderLogsModal(e.postsCompleted)");

const newLogic = `
window.renderLogsModal = function(e) {
  const n = e.filter(item => item.response === "successful").length;
  const i = e.filter(item => item.response === "failed").length;
  const elSuccess = document.getElementById('successCount');
  const elFail = document.getElementById('failCount');
  if(elSuccess) elSuccess.innerText = n;
  if(elFail) elFail.innerText = i;
  
  const o = document.getElementById('logsList');
  if (o) {
    o.innerHTML = '';
    
    // Group by groupName
    const groups = {};
    e.forEach(item => {
      const gName = item.groupName || "Nhóm không tên";
      if (!groups[gName]) {
        groups[gName] = { total: 0, success: 0, items: [] };
      }
      groups[gName].total++;
      if (item.response === "successful") {
        groups[gName].success++;
      }
      groups[gName].items.push(item);
    });

    // Render each group
    for (const [gName, data] of Object.entries(groups)) {
      // Group Header
      const header = document.createElement("div");
      header.className = "list-group-item bg-dark text-white fw-bold d-flex justify-content-between align-items-center mt-3 border-0 rounded-top";
      header.innerHTML = \`<span><i class="bi bi-folder2-open me-2"></i>\${gName}</span> <span class="badge bg-primary fs-6">\${data.success}/\${data.total} Thành công</span>\`;
      o.appendChild(header);

      // Group Items
      data.items.forEach((item, idx) => {
        let badgeClass = "bg-secondary", linkHtml = item.link;
        if ("successful" === item.response) {
          badgeClass = "bg-success";
          linkHtml = \`<a href="\${item.link}" target="_blank" class="text-white text-decoration-underline" style="word-break: break-all;">Xem Bài Đăng</a>\`;
        } else if ("failed" === item.response) {
          badgeClass = "bg-danger";
        } else if ("restricted" === item.response) {
          badgeClass = "bg-warning text-dark";
        }
        
        const r = document.createElement("li");
        const isLast = idx === data.items.length - 1;
        r.className = \`list-group-item d-flex justify-content-between align-items-center \${badgeClass} text-white border-0 \${isLast ? 'rounded-bottom' : 'border-bottom border-light'}\`;
        
        r.innerHTML = \`
          <div class="d-flex flex-column" style="overflow: hidden; text-overflow: ellipsis; max-width: 80%;">
            <small>\${linkHtml}</small>
          </div>
          <span class="badge bg-light text-dark rounded-pill">\${"successful" === item.response ? "Thành công" : "Thất bại"}</span>
        \`;
        o.appendChild(r);
      });
    }
  }
  
  const modalEl = document.getElementById('logsModal');
  if (modalEl) {
     modalEl.classList.remove('d-none');
     try {
       const m = new bootstrap.Modal(modalEl);
       m.show();
     } catch(err) {}
  }
};
`;

if (!text.includes('window.renderLogsModal = function')) {
    text += '\\n' + newLogic;
}

fs.writeFileSync('D:\\\\folder\\\\tools\\\\FACEBOOK-AUTO\\\\popup.js', text, 'utf-8');
console.log('Successfully patched popup.js');
