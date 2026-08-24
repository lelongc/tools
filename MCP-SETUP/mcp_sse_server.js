import http from 'http';
import { spawn } from 'child_process';
import crypto from 'crypto';
import url from 'url';
import fs from 'fs';
import path from 'path';

// Load .env automatically
const envPath = path.join(path.dirname(url.fileURLToPath(import.meta.url)), '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=');
      const val = v.join('=').trim();
      if (!process.env[k.trim()]) {
        process.env[k.trim()] = val;
      }
    }
  }
}

const PORT = parseInt(process.env.PORT || '8080', 10);
const GODOT_SCRIPT = process.env.GODOT_MCP_SCRIPT || 'C:/Users/Acer/.gemini/antigravity-ide/mcp/godot-mcp/build/index.js';
const BLENDER_CMD = process.env.BLENDER_MCP_CMD || 'uvx blender-mcp';

// Global session registry: sessionId -> { engine, res, heartbeat }
const activeSessions = new Map();

class McpEngine {
  constructor(name, command, args, idBase) {
    this.name = name;
    this.command = command;
    this.args = args;
    this.idBase = idBase;
    this.nextId = idBase;
    this.child = null;
    this.buffer = '';
    this.pendingCallbacks = new Map();
  }

  ensureProcess() {
    if (this.child && this.child.exitCode === null && !this.child.killed) {
      return this.child;
    }

    console.log(`[${this.name}] Đang khởi động engine: ${this.command} ${this.args.join(' ')}`);
    this.child = spawn(this.command, this.args, {
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: process.platform === 'win32'
    });

    // 1. DRAIN STDERR TO PREVENT DEADLOCKS & SHOW LOGS
    this.child.stderr.on('data', chunk => {
      const text = chunk.toString().trim();
      if (text) {
        for (const line of text.split('\n')) {
          const l = line.trim();
          if (l) console.log(`[${this.name} LOG] ${l}`);
        }
      }
    });

    // 2. PARSE STDOUT JSON-RPC
    this.child.stdout.on('data', chunk => {
      this.buffer += chunk.toString();
      const lines = this.buffer.split('\n');
      this.buffer = lines.pop();

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        let parsed;
        try { parsed = JSON.parse(trimmed); } catch { continue; }

        const toolCount = parsed?.result?.tools?.length;
        if (toolCount) {
          console.log(`[${this.name}] ✅ Đã nạp thành công ${toolCount} công cụ!`);
        }

        // Direct HTTP callback
        if (parsed.id !== undefined && this.pendingCallbacks.has(parsed.id)) {
          const { originalId, resolve, timer } = this.pendingCallbacks.get(parsed.id);
          this.pendingCallbacks.delete(parsed.id);
          clearTimeout(timer);
          const response = { ...parsed, id: originalId };
          console.log(`[${this.name} HTTP] Trả kết quả (internalId=${parsed.id} -> originalId=${originalId})`);
          resolve(response);
          continue;
        }

        // Broadcast to SSE clients of this engine
        for (const [sid, session] of activeSessions) {
          if (session.engine === this) {
            try {
              session.res.write(`event: message\ndata: ${trimmed}\n\n`);
            } catch {
              activeSessions.delete(sid);
            }
          }
        }
      }
    });

    this.child.on('exit', (code) => {
      console.log(`[${this.name}] Process kết thúc (code: ${code}). Sẽ tự khởi lại khi có request.`);
      this.child = null;
      for (const [id, { originalId, resolve, timer }] of this.pendingCallbacks) {
        clearTimeout(timer);
        resolve({ jsonrpc: '2.0', id: originalId, error: { code: -32603, message: 'MCP process exited' } });
      }
      this.pendingCallbacks.clear();
    });

    return this.child;
  }

  sendRpcAndWait(msg, timeoutMs = 30000) {
    return new Promise((resolve) => {
      const child = this.ensureProcess();
      const internalId = this.nextId++;
      const originalId = msg.id;

      const timer = setTimeout(() => {
        if (this.pendingCallbacks.has(internalId)) {
          this.pendingCallbacks.delete(internalId);
          console.log(`[${this.name} HTTP] Timeout cho request internalId=${internalId}`);
          resolve({ jsonrpc: '2.0', id: originalId, error: { code: -32000, message: 'MCP Timeout' } });
        }
      }, timeoutMs);

      this.pendingCallbacks.set(internalId, { originalId, resolve, timer });
      const remapped = { ...msg, id: internalId };
      child.stdin.write(JSON.stringify(remapped) + '\n');
    });
  }

  sendToMcp(msg) {
    const child = this.ensureProcess();
    child.stdin.write(JSON.stringify(msg) + '\n');
  }
}

// Khởi tạo 2 engine độc lập
const godotEngine = new McpEngine('GODOT', 'node', [GODOT_SCRIPT], 100000);
const blenderParts = BLENDER_CMD.split(' ');
const blenderEngine = new McpEngine('BLENDER', blenderParts[0], blenderParts.slice(1), 200000);

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname || '/';

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Expose-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if ((path === '/' || path === '/health' || path === '/healthz' || path === '/blender' || path === '/godot') && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', mcp: 'active', engines: ['godot', 'blender'] }));
    return;
  }

  // OAuth Discovery Probe → Phản hồi 404 No-Auth ngay lập tức
  if (path.includes('.well-known')) {
    console.log(`[HTTP] OAuth probe -> 404 No-Auth: ${req.method} ${path}`);
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'not_found' }));
    return;
  }

  // Phân luồng Engine
  const isBlender = path.startsWith('/blender');
  const engine = isBlender ? blenderEngine : godotEngine;
  const endpointPath = isBlender ? '/blender/message' : '/message';

  // ===== 1. SSE STREAM (GET) =====
  const isSse = req.method === 'GET' && (path === '/mcp' || path === '/sse' || path === '/blender/mcp' || path === '/blender/sse' || path === '/blender');
  if (isSse) {
    const sessionId = crypto.randomUUID();
    console.log(`[SSE] 🟢 Client Spark kết nối vào ${engine.name}! Session: ${sessionId} (Path: ${path})`);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.flushHeaders();

    // Gửi relative endpoint chuẩn
    res.write(`event: endpoint\ndata: ${endpointPath}?sessionId=${sessionId}\n\n`);

    engine.ensureProcess();

    const heartbeat = setInterval(() => {
      try { res.write(': keepalive\n\n'); } catch { clearInterval(heartbeat); }
    }, 8000);

    activeSessions.set(sessionId, { engine, res, heartbeat });

    req.on('close', () => {
      console.log(`[SSE] 🔴 Client ngắt kết nối ${engine.name}: ${sessionId}`);
      clearInterval(heartbeat);
      activeSessions.delete(sessionId);
    });

    return;
  }

  // ===== 2. MESSAGE POST =====
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      let msg;
      try { msg = JSON.parse(body); } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' } }));
        return;
      }

      // Xác định Engine qua sessionId hoặc qua URL
      const sessionId = parsed.query.sessionId;
      const session = sessionId ? activeSessions.get(sessionId) : null;
      const targetEngine = session ? session.engine : engine;

      // Notification (không có ID)
      if (msg.id === undefined || msg.id === null) {
        targetEngine.sendToMcp(msg);
        res.writeHead(202, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'accepted' }));
        return;
      }

      // SSE Mode: có active session
      if (session) {
        console.log(`[${targetEngine.name} SSE POST] ${msg.method} (id=${msg.id}) -> session ${sessionId}`);
        targetEngine.sendToMcp(msg);
        res.writeHead(202, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'accepted' }));
        return;
      }

      // Direct HTTP Mode
      console.log(`[${targetEngine.name} HTTP POST] ${msg.method} (id=${msg.id}) [Direct mode]`);
      targetEngine.sendRpcAndWait(msg).then(result => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      });
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`===========================================================================`);
  console.log(`🚀 MASTER DUAL-ENGINE MCP SERVER ĐANG LẮNG NGHE TẠI CỔNG ${PORT}`);
  console.log(`---------------------------------------------------------------------------`);
  console.log(`🎮 Godot MCP  : http://127.0.0.1:${PORT}/mcp`);
  console.log(`🎨 Blender MCP: http://127.0.0.1:${PORT}/blender/mcp`);
  console.log(`===========================================================================`);
  godotEngine.ensureProcess();
  blenderEngine.ensureProcess();
});
