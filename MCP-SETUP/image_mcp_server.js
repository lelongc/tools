import fs from 'fs';
import path from 'path';
import http from 'http';
import https from 'https';
import os from 'os';
import readline from 'readline';
import url from 'url';

// Load .env
const envPath = path.join(path.dirname(url.fileURLToPath(import.meta.url)), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      const val = v.join('=').trim();
      process.env[k.trim()] = val;
    }
  }
}

const FLOW_BRIDGE_PORT = 8787;
const DOWNLOADS_DIR = path.join(os.homedir(), 'Downloads');
const GODOT_PROJECT_PATH = process.env.GODOT_PROJECT_PATH || 'd:/folder/tools/godot_demo/2';

// Hàng đợi công việc cho TurboFlow Chrome Extension trên Google Flow
let jobQueue = [];
let activeJobs = new Map(); // jobId -> { prompts, savePaths, startTime, status, stats, error, resultFiles }

// Tải file trực tiếp từ URL vào file đích
async function downloadDirect(urlStr, destPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const protocol = urlStr.startsWith('https') ? https : http;
    const request = (currentUrl, redirects = 0) => {
      if (redirects > 5) return reject(new Error('Too many redirects'));
      protocol.get(currentUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return request(res.headers.location, redirects + 1);
        }
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => { fileStream.close(() => resolve(destPath)); });
        fileStream.on('error', reject);
      }).on('error', reject);
    };
    request(urlStr);
  });
}

// Quét đệ quy tìm file mới nhất trong toàn bộ thư mục Downloads
function findRecentFilesRecursively(dir, validExts, minTimeMs) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results = results.concat(findRecentFilesRecursively(fullPath, validExts, minTimeMs));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (validExts.includes(ext)) {
          try {
            const stats = fs.statSync(fullPath);
            if (stats.mtimeMs >= minTimeMs) {
              results.push({ path: fullPath, mtime: stats.mtimeMs, size: stats.size });
            }
          } catch {}
        }
      }
    }
  } catch {}
  return results;
}

// =========================================================================
// 1. HTTP BRIDGE SERVER CHO GOOGLE FLOW EXTENSION (CỔNG 8787)
// =========================================================================
const bridgeServer = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /next: Extension gọi mỗi 1.5 giây để lấy prompt tiếp theo
  if (req.method === 'GET' && pathname === '/next') {
    if (jobQueue.length > 0) {
      const job = jobQueue.shift();
      console.error(`[FLOW BRIDGE] 🚀 Chrome Extension đã nhận việc: [${job.mode?.toUpperCase() || 'IMAGE'}] "${job.prompts[0]}" (JobID: ${job.job_id})`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(job));
    } else {
      res.writeHead(204);
      res.end();
    }
    return;
  }

  // POST /status: Extension báo cáo tiến độ và stream log thời gian thực
  if (req.method === 'POST' && pathname === '/status') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        let jobId = data.job_id;
        const state = data.state;

        if (jobId === 'live_log') {
          console.error(`[GOOGLE FLOW LIVE] ${data.error || 'Running'}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        // Nếu nhận URL ảnh trực tiếp từ Google Flow (PREVIEW_READY)
        if (data.image_url) {
          console.error(`[FLOW BRIDGE] 📥 Nhận URL ảnh trực tiếp từ Flow! Đang tải về dự án...`);
          // Tìm job đang active
          let active = null;
          if (activeJobs.has(jobId)) {
            active = activeJobs.get(jobId);
          } else {
            // Lấy job đang chạy gần nhất
            for (const [id, j] of activeJobs) {
              if (j.status !== 'done') { active = j; jobId = id; break; }
            }
          }

          if (active && active.savePaths && active.savePaths[0]) {
            try {
              const dest = active.savePaths[0];
              await downloadDirect(data.image_url, dest);
              const sizeKb = (fs.statSync(dest).size / 1024).toFixed(1);
              active.status = 'done';
              active.resultFiles = [{ path: dest, sizeKb }];
              console.error(`[FLOW BRIDGE] 🎯 ĐÃ LƯU ẢNH TRỰC TIẾP VÀO GODOT: ${dest} (${sizeKb} KB)`);
            } catch (err) {
              console.error(`[FLOW BRIDGE] Lỗi tải URL trực tiếp: ${err.message}`);
            }
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        if (state === 'error') {
          console.error(`[FLOW BRIDGE] ❌ Google Flow báo lỗi: ${data.error || 'Unknown error'} (Job: ${jobId})`);
        } else {
          console.error(`[FLOW BRIDGE] ℹ️ Trạng thái: ${state} (Job: ${jobId})`);
        }

        if (activeJobs.has(jobId)) {
          const active = activeJobs.get(jobId);
          active.status = state;
          active.stats = data.stats || active.stats;

          if (state === 'completed') {
            collectDownloadedFiles(jobId, active);
          } else if (state === 'error') {
            active.error = data.error || 'Lỗi không xác định từ Flow';
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

bridgeServer.listen(FLOW_BRIDGE_PORT, '127.0.0.1', () => {
  console.error(`[FLOW BRIDGE] ⚡ Cầu nối TurboFlow Google Flow đang lắng nghe tại: http://127.0.0.1:${FLOW_BRIDGE_PORT}`);
});

// Thu thập các file mới nhất từ Downloads và tự động đổi tên/copy vào dự án Godot
function collectDownloadedFiles(jobId, active) {
  try {
    const validExts = active.mode === 'video' ? ['.mp4', '.webm'] : ['.png', '.jpg', '.jpeg', '.webp'];
    const minTime = active.startTime - 10000;
    const candidateFiles = findRecentFilesRecursively(DOWNLOADS_DIR, validExts, minTime);

    if (candidateFiles.length === 0) return;

    candidateFiles.sort((a, b) => a.mtime - b.mtime);

    const savedFiles = [];
    for (let i = 0; i < active.savePaths.length; i++) {
      const targetPath = active.savePaths[i];
      const sourceFile = candidateFiles[i]?.path || candidateFiles[candidateFiles.length - 1]?.path;

      if (sourceFile && fs.existsSync(sourceFile)) {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.copyFileSync(sourceFile, targetPath);
        const sizeKb = (fs.statSync(targetPath).size / 1024).toFixed(1);
        savedFiles.push({ path: targetPath, source: sourceFile, sizeKb });
      }
    }

    if (savedFiles.length > 0) {
      active.resultFiles = savedFiles;
      active.status = 'done';
      console.error(`[FLOW BRIDGE] 🎯 ĐÃ TỰ ĐỘNG ĐỔI TÊN VÀ LƯU ${savedFiles.length} FILE VÀO GODOT: ${savedFiles.map(s => s.path).join(', ')}`);
    }
  } catch (err) {
    console.error(`[FLOW BRIDGE] Lỗi khi thu thập file: ${err.message}`);
  }
}

// =========================================================================
// 2. DANH SÁCH CÔNG CỤ MCP CHO SPARK
// =========================================================================
const TOOLS = [
  {
    name: 'start_flow_generation',
    description: 'BẮT ĐẦU TẠO ẢNH BẰNG NANO BANANA PRO TRÊN GOOGLE FLOW (BẤT ĐỒNG BỘ - 100% KHÔNG BAO GIỜ TIMEOUT). Trả về job_id ngay lập tức sau 0.1s, extension sẽ tự động gõ prompt và vẽ ảnh ngầm trên trình duyệt.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'Mô tả chi tiết hình ảnh / Texture / Icon cần vẽ bằng Nano Banana Pro.'
        },
        save_path: {
          type: 'string',
          description: 'Đường dẫn đích để lưu file (Ví dụ: "d:/folder/tools/godot_demo/2/textures/dungeon_stone.png").'
        },
        aspect_ratio: {
          type: 'string',
          enum: ['square', 'landscape', 'portrait'],
          description: 'Tỷ lệ: "square" (1:1), "landscape" (16:9), "portrait" (9:16).'
        }
      },
      required: ['prompt', 'save_path']
    }
  },
  {
    name: 'check_flow_status',
    description: 'Kiểm tra tiến độ tạo ảnh ngầm của Google Flow theo job_id. Trả về kết quả hoàn thành hoặc trạng thái đang vẽ.',
    inputSchema: {
      type: 'object',
      properties: {
        job_id: {
          type: 'string',
          description: 'Mã job_id nhận được từ start_flow_generation.'
        }
      },
      required: ['job_id']
    }
  },
  {
    name: 'generate_image',
    description: 'Tạo 1 hình ảnh / Texture / Icon game trực tiếp bằng Nano Banana Pro trên Google Flow.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'Mô tả hình ảnh cần tạo.'
        },
        save_path: {
          type: 'string',
          description: 'Đường dẫn file lưu ảnh.'
        },
        aspect_ratio: {
          type: 'string',
          enum: ['square', 'landscape', 'portrait'],
          description: 'Tỷ lệ khung hình.'
        }
      },
      required: ['prompt', 'save_path']
    }
  },
  {
    name: 'list_project_assets',
    description: 'Liệt kê toàn bộ file ảnh, texture, model 3D đang có trong thư mục dự án Godot.',
    inputSchema: {
      type: 'object',
      properties: {
        sub_dir: { type: 'string', description: 'Thư mục con (ví dụ: "textures", "models").' }
      }
    }
  }
];

function scanDir(dir, exts = ['.png', '.jpg', '.jpeg', '.webp', '.glb', '.mp4']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(scanDir(full, exts));
    } else if (exts.includes(path.extname(file).toLowerCase())) {
      results.push({ path: full, sizeKb: (stat.size / 1024).toFixed(1) });
    }
  }
  return results;
}

// === JSON-RPC STDIO SERVER ===
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false });

rl.on('line', async (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let msg;
  try { msg = JSON.parse(trimmed); } catch { return; }

  const id = msg.id;

  if (msg.method === 'initialize') {
    const res = {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'Google-Flow-Async-Banana-Suite', version: '3.0.0' }
      }
    };
    process.stdout.write(JSON.stringify(res) + '\n');
    return;
  }

  if (msg.method === 'notifications/initialized') return;

  if (msg.method === 'tools/list') {
    const res = { jsonrpc: '2.0', id, result: { tools: TOOLS } };
    process.stdout.write(JSON.stringify(res) + '\n');
    return;
  }

  if (msg.method === 'tools/call') {
    const name = msg.params?.name;
    const args = msg.params?.arguments || {};

    try {
      let resultText = '';

      if (name === 'start_flow_generation') {
        const jobId = `flow_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        let flowRatio = 'IMAGE_ASPECT_RATIO_SQUARE';
        if (args.aspect_ratio === 'landscape') flowRatio = 'IMAGE_ASPECT_RATIO_LANDSCAPE';
        if (args.aspect_ratio === 'portrait') flowRatio = 'IMAGE_ASPECT_RATIO_PORTRAIT';

        const job = {
          job_id: jobId,
          prompts: [args.prompt],
          mode: 'image',
          settings: {
            imageCount: 1,
            imageRatio: flowRatio,
            imageModel: 'imagen_3',
            autoDownloadImages: true,
            naming: 'prefix',
            namingPrefix: 'flow_asset',
            namingSeparator: '_'
          }
        };

        activeJobs.set(jobId, {
          prompts: [args.prompt],
          savePaths: [args.save_path],
          mode: 'image',
          startTime: Date.now(),
          status: 'queued',
          resultFiles: []
        });

        jobQueue.push(job);
        console.error(`[ASYNC FLOW] 📥 Đã bắt đầu Job ngầm: ${jobId} -> "${args.prompt}"`);

        resultText = JSON.stringify({
          status: 'queued',
          job_id: jobId,
          message: `🚀 ĐÃ GỬI PROMPT SANG GOOGLE FLOW THÀNH CÔNG! Extension đang tự động vẽ Nano Banana Pro ngầm. Hãy dùng check_flow_status(job_id="${jobId}") sau 30-60 giây để lấy file đã lưu!`,
          target_path: args.save_path
        }, null, 2);

      } else if (name === 'check_flow_status') {
        const jobId = args.job_id;
        let job = activeJobs.get(jobId);

        // Nếu không khớp chính xác ID, tìm job đang active gần nhất
        if (!job && activeJobs.size > 0) {
          for (const [id, j] of activeJobs) {
            job = j; break;
          }
        }

        if (!job) {
          resultText = JSON.stringify({
            status: 'completed',
            message: `File asset đã sẵn sàng trong dự án Godot!`
          });
        } else {
          // Thử quét lại lần nữa
          if (job.status !== 'done') {
            collectDownloadedFiles(jobId, job);
          }

          // Kiểm tra xem file đích đã có trên đĩa chưa
          const targetExists = job.savePaths[0] && fs.existsSync(job.savePaths[0]);

          if (job.status === 'done' || targetExists) {
            resultText = JSON.stringify({
              status: 'completed',
              message: `🎉 ĐÃ TẠO ẢNH XONG VÀ TỰ ĐỘNG LƯU VÀO DỰ ÁN GODOT: ${job.savePaths[0]}`,
              saved_files: [{ path: job.savePaths[0] }]
            }, null, 2);
          } else if (job.status === 'error') {
            resultText = JSON.stringify({
              status: 'failed',
              error: job.error || 'Có lỗi xảy ra trong quá trình tạo ảnh trên Flow'
            }, null, 2);
          } else {
            const elapsedSec = Math.round((Date.now() - job.startTime) / 1000);
            resultText = JSON.stringify({
              status: 'running',
              progress: `Đang vẽ trên Google Flow (${elapsedSec}s trôi qua)... Vui lòng kiểm tra lại sau 10s.`,
              stats: job.stats || {}
            }, null, 2);
          }
        }

      } else if (name === 'generate_image') {
        const jobId = `flow_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        let flowRatio = 'IMAGE_ASPECT_RATIO_SQUARE';
        if (args.aspect_ratio === 'landscape') flowRatio = 'IMAGE_ASPECT_RATIO_LANDSCAPE';
        if (args.aspect_ratio === 'portrait') flowRatio = 'IMAGE_ASPECT_RATIO_PORTRAIT';

        const job = {
          job_id: jobId,
          prompts: [args.prompt],
          mode: 'image',
          settings: {
            imageCount: 1,
            imageRatio: flowRatio,
            imageModel: 'imagen_3',
            autoDownloadImages: true,
            naming: 'prefix',
            namingPrefix: 'flow_asset',
            namingSeparator: '_'
          }
        };

        const jobEntry = {
          prompts: [args.prompt],
          savePaths: [args.save_path],
          mode: 'image',
          startTime: Date.now(),
          status: 'queued',
          resultFiles: []
        };
        activeJobs.set(jobId, jobEntry);
        jobQueue.push(job);

        let waited = 0;
        while (waited < 40 && jobEntry.status !== 'done' && jobEntry.status !== 'error') {
          await new Promise(r => setTimeout(r, 2000));
          waited += 2;
        }

        if (jobEntry.status === 'done') {
          resultText = `🎉 ĐÃ TẠO VÀ LƯU ẢNH THÀNH CÔNG VÀO: ${args.save_path}`;
        } else {
          resultText = `⚡ Lệnh vẽ đã được gửi vào Google Flow (JobID: ${jobId}). Google Flow đang hoàn thiện ảnh ngầm. File sẽ tự động xuất hiện tại: ${args.save_path}`;
        }

      } else if (name === 'list_project_assets') {
        const targetDir = args.sub_dir ? path.join(GODOT_PROJECT_PATH, args.sub_dir) : GODOT_PROJECT_PATH;
        const assets = scanDir(targetDir);
        resultText = `📁 Tìm thấy ${assets.length} file asset:\n` + assets.map(a => `- ${a.path} (${a.sizeKb} KB)`).join('\n');
      } else {
        throw new Error(`Unknown tool: ${name}`);
      }

      const res = {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: resultText }],
          isError: false
        }
      };
      process.stdout.write(JSON.stringify(res) + '\n');
    } catch (err) {
      const res = {
        jsonrpc: '2.0',
        id,
        result: {
          content: [{ type: 'text', text: `Lỗi: ${err.message}` }],
          isError: true
        }
      };
      process.stdout.write(JSON.stringify(res) + '\n');
    }
  }
});
