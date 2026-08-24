import http from 'http';
import { spawn } from 'child_process';
import crypto from 'crypto';
import url from 'url';

const PORT = parseInt(process.env.PORT || '8080', 10);
const COMMAND = process.argv[2] || 'node';
const ARGS = process.argv.slice(3);

// === SINGLE SHARED MCP PROCESS ===
let mcpChild = null;
let mcpBuffer = '';
let nextInternalId = 100000;
const pendingCallbacks = new Map(); // internalId -> { originalId, resolve, timer }
const sseClients = new Map();       // sessionId -> res

function ensureMcpProcess() {
  if (mcpChild && mcpChild.exitCode === null && !mcpChild.killed) {
    return mcpChild;
  }

  console.log(`[MCP] Khoi tao Godot MCP process: ${COMMAND} ${ARGS.join(' ')}`);
  mcpChild = spawn(COMMAND, ARGS, {
    env: process.env,
    stdio: ['pipe', 'pipe', 'inherit'],
    shell: process.platform === 'win32'
  });

  mcpChild.stdout.on('data', chunk => {
    mcpBuffer += chunk.toString();
    const lines = mcpBuffer.split('\n');
    mcpBuffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      let parsed;
      try { parsed = JSON.parse(trimmed); } catch { continue; }

      const toolCount = parsed?.result?.tools?.length;
      if (toolCount) {
        console.log(`[MCP] Da nap ${toolCount} cong cu Godot!`);
      }

      // Route 1: Pending Direct HTTP callback (ID remapped)
      if (parsed.id !== undefined && pendingCallbacks.has(parsed.id)) {
        const { originalId, resolve, timer } = pendingCallbacks.get(parsed.id);
        pendingCallbacks.delete(parsed.id);
        clearTimeout(timer);
        // Khoi phuc ID goc truoc khi tra ve cho Spark
        const response = { ...parsed, id: originalId };
        console.log(`[HTTP] Tra ket qua cho Spark (internalId=${parsed.id} -> originalId=${originalId})`);
        resolve(response);
        continue;
      }

      // Route 2: Broadcast to SSE clients
      for (const [sid, sseRes] of sseClients) {
        try {
          sseRes.write(`event: message\ndata: ${trimmed}\n\n`);
        } catch {
          sseClients.delete(sid);
        }
      }
    }
  });

  mcpChild.on('exit', (code) => {
    console.log(`[MCP] Process thoat (code: ${code}). Tu khoi lai khi co request moi.`);
    mcpChild = null;
    for (const [id, { originalId, resolve, timer }] of pendingCallbacks) {
      clearTimeout(timer);
      resolve({ jsonrpc: '2.0', id: originalId, error: { code: -32603, message: 'MCP process exited' } });
    }
    pendingCallbacks.clear();
  });

  return mcpChild;
}

// Direct HTTP mode: Doi ID thanh internalId de tranh trung lap, cho ket qua
function sendRpcAndWait(msg, timeoutMs = 30000) {
  return new Promise((resolve) => {
    const child = ensureMcpProcess();
    const internalId = nextInternalId++;
    const originalId = msg.id;

    const timer = setTimeout(() => {
      if (pendingCallbacks.has(internalId)) {
        pendingCallbacks.delete(internalId);
        console.log(`[HTTP] Timeout cho request internalId=${internalId} (method=${msg.method})`);
        resolve({ jsonrpc: '2.0', id: originalId, error: { code: -32000, message: 'MCP Timeout' } });
      }
    }, timeoutMs);

    pendingCallbacks.set(internalId, { originalId, resolve, timer });

    // Gui vao MCP voi internalId (khong trung)
    const remapped = { ...msg, id: internalId };
    child.stdin.write(JSON.stringify(remapped) + '\n');
    console.log(`[HTTP] Gui vao MCP: ${msg.method} (originalId=${originalId} -> internalId=${internalId})`);
  });
}

// SSE mode: Gui truc tiep, ket qua tra qua SSE stream
function sendToMcp(msg) {
  const child = ensureMcpProcess();
  child.stdin.write(JSON.stringify(msg) + '\n');
}

// === HTTP SERVER ===
const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname;

  // CORS
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
  if ((path === '/' || path === '/health' || path === '/healthz') && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', mcp: 'active', server: 'godot-mcp' }));
    return;
  }

  // OAuth probe -> 404 (No-Auth)
  if (path && path.startsWith('/.well-known')) {
    console.log(`[HTTP] OAuth probe -> 404: ${req.method} ${path}`);
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'not_found' }));
    return;
  }

  // === SSE STREAM: GET /mcp hoac GET /sse ===
  if (req.method === 'GET' && (path === '/mcp' || path === '/sse')) {
    const sessionId = crypto.randomUUID();
    console.log(`[SSE] Client ket noi! Session: ${sessionId}`);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.flushHeaders();

    res.write(`event: endpoint\ndata: /message?sessionId=${sessionId}\n\n`);

    ensureMcpProcess();
    sseClients.set(sessionId, res);

    const heartbeat = setInterval(() => {
      try { res.write(': keepalive\n\n'); } catch { clearInterval(heartbeat); }
    }, 8000);

    req.on('close', () => {
      console.log(`[SSE] Client ngat: ${sessionId}`);
      clearInterval(heartbeat);
      sseClients.delete(sessionId);
    });

    return;
  }

  // === POST: /message, /mcp, /sse ===
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

      const sessionId = parsed.query.sessionId;
      const hasActiveSSE = sessionId && sseClients.has(sessionId);

      // Notification (khong co id) -> gui vao MCP va tra 202 ngay
      if (msg.id === undefined || msg.id === null) {
        sendToMcp(msg);
        res.writeHead(202, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'accepted' }));
        return;
      }

      // SSE mode: co sessionId hop le -> gui vao MCP, ket qua tra qua SSE stream
      if (hasActiveSSE) {
        console.log(`[SSE POST] ${msg.method} (id=${msg.id}) -> session ${sessionId}`);
        sendToMcp(msg);
        res.writeHead(202, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'accepted' }));
        return;
      }

      // Direct HTTP mode: Remap ID de tranh trung lap, cho ket qua truc tiep
      console.log(`[HTTP POST] ${msg.method} (id=${msg.id}) [Direct mode]`);
      sendRpcAndWait(msg).then(result => {
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
  console.log(`[SERVER] MCP Universal Bridge dang lang nghe tai: http://127.0.0.1:${PORT}`);
  console.log(`[SERVER] ID Remapping ON - Moi request duoc gan ID noi bo duy nhat, khong bao gio trung lap!`);
  ensureMcpProcess();
});
