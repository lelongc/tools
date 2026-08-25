import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import readline from 'readline';

const STYLE_PROMPTS = {
  game_art: 'game asset, digital game art, high quality texture, crisp details, vibrant colors',
  pixel_art: 'pixel art style, 16-bit retro game asset, clean pixels, sharp outlines',
  '3d_render': '3D render, octane render style, stylized PBR material, studio lighting, unreal engine 5',
  anime: 'anime style, cel shaded, clean lineart, vibrant anime illustration',
  photorealistic: 'photorealistic, 8k resolution, ultra detailed, realistic lighting',
  fantasy: 'fantasy RPG art style, magical glow, intricate details, epic game concept art',
  isometric: 'isometric perspective, game asset, 3D tileable style, clean render'
};

async function downloadFile(urlStr, destPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const protocol = urlStr.startsWith('https') ? https : http;

    const request = (currentUrl, redirects = 0) => {
      if (redirects > 5) return reject(new Error('Too many redirects'));

      protocol.get(currentUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return request(res.headers.location, redirects + 1);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed with status code: ${res.statusCode}`));
        }

        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close(() => resolve(destPath));
        });
        fileStream.on('error', reject);
      }).on('error', reject);
    };

    request(urlStr);
  });
}

async function handleGenerateImage(args) {
  let prompt = args.prompt || '';
  const savePath = args.save_path;
  const width = parseInt(args.width || '1024', 10);
  const height = parseInt(args.height || '1024', 10);
  const style = args.style;
  const model = args.model || 'flux';
  const seed = args.seed || Math.floor(Math.random() * 1000000);

  if (!prompt || !savePath) {
    throw new Error('prompt and save_path are required');
  }

  if (style && STYLE_PROMPTS[style]) {
    prompt = `${prompt}, ${STYLE_PROMPTS[style]}`;
  }

  const encodedPrompt = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=${model}&seed=${seed}&nologo=true`;

  console.error(`[IMAGE ENGINE] Đang tạo ảnh: "${prompt.substring(0, 60)}..." -> ${savePath}`);
  const startTime = Date.now();
  await downloadFile(imageUrl, savePath);
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

  const stats = fs.statSync(savePath);
  const fileSizeKb = (stats.size / 1024).toFixed(1);

  return `✅ Đã tạo ảnh thành công (${fileSizeKb} KB, ${elapsed}s)!\n📁 Đã lưu tại: ${savePath}\n📐 Kích thước: ${width}x${height}\n🎨 Prompt: ${prompt}`;
}

async function handleDownloadImage(args) {
  const url = args.url;
  const savePath = args.save_path;
  if (!url || !savePath) throw new Error('url and save_path are required');

  await downloadFile(url, savePath);
  return `✅ Đã tải và lưu ảnh thành công vào: ${savePath}`;
}

const TOOLS = [
  {
    name: 'generate_image',
    description: 'Tạo hình ảnh AI độ phân giải cao (Texture, Sprite, Icon, Background, Concept Art 2D/3D) bằng mô hình Flux/SDXL và tự động lưu vào dự án.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'Mô tả chi tiết nội dung bức ảnh cần tạo (tiếng Anh hoặc tiếng Việt).'
        },
        save_path: {
          type: 'string',
          description: 'Đường dẫn tuyệt đối hoặc tương đối để lưu file ảnh (ví dụ: D:/folder/tools/godot_demo/2/assets/sprites/hero.png).'
        },
        width: {
          type: 'number',
          description: 'Chiều rộng ảnh (mặc định: 1024, ví dụ: 512, 768, 1024).'
        },
        height: {
          type: 'number',
          description: 'Chiều cao ảnh (mặc định: 1024, ví dụ: 512, 768, 1024).'
        },
        style: {
          type: 'string',
          enum: ['game_art', 'pixel_art', '3d_render', 'anime', 'photorealistic', 'fantasy', 'isometric'],
          description: 'Phong cách đồ họa game (ví dụ: pixel_art, 3d_render, game_art, isometric).'
        },
        model: {
          type: 'string',
          enum: ['flux', 'flux-realism', 'flux-anime', 'flux-3d', 'turbo'],
          description: 'Mô hình AI tạo ảnh (mặc định: flux).'
        },
        seed: {
          type: 'number',
          description: 'Seed ngẫu nhiên để tái tạo kết quả.'
        }
      },
      required: ['prompt', 'save_path']
    }
  },
  {
    name: 'download_image',
    description: 'Tải một hình ảnh từ URL bất kỳ và lưu trực tiếp vào thư mục dự án.',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL trực tiếp của hình ảnh.' },
        save_path: { type: 'string', description: 'Đường dẫn file để lưu ảnh trên máy.' }
      },
      required: ['url', 'save_path']
    }
  }
];

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
        serverInfo: { name: 'AI-Image-MCP-Server', version: '1.0.0' }
      }
    };
    process.stdout.write(JSON.stringify(res) + '\n');
    return;
  }

  if (msg.method === 'notifications/initialized') {
    return;
  }

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
      if (name === 'generate_image') {
        resultText = await handleGenerateImage(args);
      } else if (name === 'download_image') {
        resultText = await handleDownloadImage(args);
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
          content: [{ type: 'text', text: `Lỗi tạo ảnh: ${err.message}` }],
          isError: true
        }
      };
      process.stdout.write(JSON.stringify(res) + '\n');
    }
    return;
  }
});
