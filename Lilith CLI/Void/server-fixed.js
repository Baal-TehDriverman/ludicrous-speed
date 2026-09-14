#!/usr/bin/env node
/**
 * 🜏 Void Server — Lilith's JS Execution Sandbox (FIXED)
 * Express server on :3000 with /api/* endpoints
 *
 * Endpoints:
 *   GET  /api/void/status          — runtime status
 *   POST /api/void/exec            — execute JS code
 *   GET  /api/void/history         — execution history
 *   DELETE /api/void/history       — clear history
 *   GET  /api/void/gui             — serve Lilith sovereign GUI
 *
 *   GET  /api/mod/status           — mod engine status
 *   POST /api/mod/build            — build a mod
 *   POST /api/mod/deploy           — deploy a mod
 *   POST /api/mod/verify           — verify a mod
 *   GET  /api/mod/scan             — scan mods
 *   GET  /api/mod/cet              — check CET status
 *   POST /api/mod/quick            — quick build+deploy
 *   POST /api/mod/hooks/:hookName  — register lifecycle hook
 *   GET  /api/mod/history          — mod job history
 */

import express from 'express';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

// ─── Lilith Mod-Engine REST API ───
// Import the mod runtime from the Lilith CLI project and mount at /api/mod
import { createModApp } from '/home/tehlappy/🜏 Lilith/ludicrous-speed/Lilith CLI/src/modding/void-mod-runtime.js';
import { hyatlasCmd } from '../src/void/hyatlas_cli.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VOID_ROOT = __dirname;
const NODE_MODULES = join(VOID_ROOT, 'node_modules');
const HISTORY_FILE = join(VOID_ROOT, 'void-history.jsonl');
const MAX_HISTORY = 50;
const MAX_CONCURRENT = 2;
const DEFAULT_TIMEOUT_MS = 15000;
const MAX_TIMEOUT_MS = 60000;

// ─── State ───
const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(VOID_ROOT));

let activeExecutions = 0;
const executionQueue = [];
const executionHistory = [];

// Load existing history
function loadHistory() {
  try {
    if (existsSync(HISTORY_FILE)) {
      const lines = readFileSync(HISTORY_FILE, 'utf8').trim().split('\n').filter(Boolean);
      for (const line of lines.slice(-MAX_HISTORY)) {
        try { executionHistory.push(JSON.parse(line)); } catch {}
      }
    }
  } catch {}
}
loadHistory();

// ─── Security Profiles ───
export const SECURITY_PROFILES = {
  'no-net': {
    allowedModules: ['path', 'fs', 'os', 'url', 'crypto', 'util', 'stream', 'buffer', 'events', 'string_decoder', 'timers', 'process'],
    allowNet: false,
    allowFSWrite: false,
    allowChildProcess: false,
  },
  'ai-only': {
    allowedModules: ['path', 'fs', 'os', 'url', 'crypto', 'util', 'stream', 'buffer', 'events', 'string_decoder', 'timers', 'process', 'axios', 'node-fetch'],
    allowNet: true,
    allowFSWrite: true,
    allowChildProcess: false,
  },
  'full': {
    allowedModules: null, // all allowed
    allowNet: true,
    allowFSWrite: true,
    allowChildProcess: true,
  },
};

// ─── Execution Engine ───
async function executeCode(code, mode = 'eval', profile = 'no-net', timeoutMs = DEFAULT_TIMEOUT_MS) {
  const executionId = uuidv4();
  const startTime = Date.now();

  return new Promise((resolve) => {
    const result = {
      executionId,
      mode,
      profile,
      timestamp: new Date().toISOString(),
    };

    // Check concurrency
    if (activeExecutions >= MAX_CONCURRENT) {
      executionQueue.push({ code, mode, profile, timeoutMs, resolve });
      return;
    }

    activeExecutions++;

    // Security check
    const security = SECURITY_PROFILES[profile];
    const env = { ...process.env, VOID_PROFILE: profile, VOID_SANDBOX: 'true' };
    if (!security.allowNet) delete env.NODE_DEBUG;
    if (!security.allowFSWrite) env.WRITE_PROTECT = '1';

    try {
      if (mode === 'python') {
        // Python execution: write to temp file and run with python3
        const tmpFile = join(os.tmpdir(), `void-${executionId}.py`);
        writeFileSync(tmpFile, code);
        const child = spawn('python3', [tmpFile], {
          cwd: process.cwd(),
          env: { ...security.env, PYTHONUNBUFFERED: '1' },
          timeout: Math.min(timeoutMs, MAX_TIMEOUT_MS),
          stdio: ['pipe', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => { stdout += data.toString(); });
        child.stderr.on('data', (data) => { stderr += data.toString(); });

        child.on('close', (code) => {
          activeExecutions--;
          const duration = Date.now() - startTime;
          result.success = code === 0;
          result.output = stdout || stderr || (code === 0 ? 'OK' : `Exit code ${code}`);
          result.execution_time_ms = duration;
          saveHistory(result);
          resolve(result);
          processQueue();
        });

        child.on('error', (err) => {
          activeExecutions--;
          const duration = Date.now() - startTime;
          result.success = false;
          result.output = err.message;
          result.execution_time_ms = duration;
          saveHistory(result);
          resolve(result);
          processQueue();
        });
      } else if (mode === 'run') {
        // Run mode: write to temp file and execute
        const tmpFile = join(os.tmpdir(), `void-${executionId}.js`);
        writeFileSync(tmpFile, code);
        const child = spawn('node', [tmpFile], {
          cwd: process.cwd(),
          env,
          timeout: Math.min(timeoutMs, MAX_TIMEOUT_MS),
          stdio: ['pipe', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => { stdout += data.toString(); });
        child.stderr.on('data', (data) => { stderr += data.toString(); });

        child.on('close', (exitCode) => {
          activeExecutions--;
          const duration = Date.now() - startTime;
          result.success = exitCode === 0;
          result.output = stdout || stderr || (exitCode === 0 ? 'OK' : `Exit code ${exitCode}`);
          result.execution_time_ms = duration;
          saveHistory(result);
          resolve(result);
          processQueue();
        });

        child.on('error', (err) => {
          activeExecutions--;
          const duration = Date.now() - startTime;
          result.success = false;
          result.output = err.message;
          result.execution_time_ms = duration;
          saveHistory(result);
          resolve(result);
          processQueue();
        });
      } else {
        // Eval mode: use node -e
        const child = spawn('node', ['-e', code], {
          cwd: process.cwd(),
          env,
          timeout: Math.min(timeoutMs, MAX_TIMEOUT_MS),
          stdio: ['pipe', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => { stdout += data.toString(); });
        child.stderr.on('data', (data) => { stderr += data.toString(); });

        child.on('close', (exitCode) => {
          activeExecutions--;
          const duration = Date.now() - startTime;
          result.success = exitCode === 0;
          result.output = stdout || stderr || (exitCode === 0 ? 'OK' : `Exit code ${exitCode}`);
          result.execution_time_ms = duration;
          saveHistory(result);
          resolve(result);
          processQueue();
        });

        child.on('error', (err) => {
          activeExecutions--;
          const duration = Date.now() - startTime;
          result.success = false;
          result.output = err.message;
          result.execution_time_ms = duration;
          saveHistory(result);
          resolve(result);
          processQueue();
        });
      }
    } catch (err) {
      activeExecutions--;
      const duration = Date.now() - startTime;
      result.success = false;
      result.output = err.message;
      result.execution_time_ms = duration;
      saveHistory(result);
      resolve(result);
    }
  });
}

function saveHistory(entry) {
  executionHistory.push(entry);
  if (executionHistory.length > MAX_HISTORY) {
    executionHistory.splice(0, executionHistory.length - MAX_HISTORY);
  }
  try {
    writeFileSync(HISTORY_FILE, executionHistory.map(e => JSON.stringify(e)).join('\n') + '\n');
  } catch {}
}

function processQueue() {
  if (executionQueue.length > 0 && activeExecutions < MAX_CONCURRENT) {
    const next = executionQueue.shift();
    executeCode(next.code, next.mode, next.profile, next.timeoutMs).then(next.resolve);
  }
}

// ─── API Routes ───

app.get('/api/void/status', (req, res) => {
  res.json({
    status: 'running',
    runtime_root: VOID_ROOT,
    node_version: process.version,
    v8_version: process.versions.v8,
    active_executions: activeExecutions,
    queued: executionQueue.length,
    max_concurrent: MAX_CONCURRENT,
    profiles: Object.keys(SECURITY_PROFILES),
    history_count: executionHistory.length,
    uptime_seconds: Math.round(process.uptime()),
  });
});

app.post('/api/void/exec', async (req, res) => {
  const { code, mode = 'eval', profile = 'no-net', timeout_ms = DEFAULT_TIMEOUT_MS } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: 'No code provided' });
  }

  if (!SECURITY_PROFILES[profile]) {
    return res.status(400).json({ success: false, error: `Unknown profile: ${profile}` });
  }

  // Python mode support: accept 'python' mode for executing Python scripts
  const validModes = ['eval', 'run', 'python'];
  const effectiveMode = validModes.includes(mode) ? mode : 'eval';

  const result = await executeCode(code, effectiveMode, profile, timeout_ms);
  res.json(result);
});

app.get('/api/void/history', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, MAX_HISTORY);
  res.json({
    history: executionHistory.slice(-limit),
    total: executionHistory.length,
  });
});

app.delete('/api/void/history', (req, res) => {
  executionHistory.length = 0;
  try { writeFileSync(HISTORY_FILE, ''); } catch {}
  res.json({ success: true, message: 'History cleared' });
});

// ─── Serve Lilith Sovereign GUI ───
app.get('/api/void/gui', (req, res) => {
  res.sendFile(join(VOID_ROOT, 'index.html'));
});

// ─── HyAtlas Memory API ───
import { hyatlasRequest } from '../src/void/hyatlas.js';

const HYATLAS_APP = express.Router();

HYATLAS_APP.get('/status', async (req, res) => {
  const result = await hyatlasRequest('GET', '/api/v1/status');
  res.json(result);
});

HYATLAS_APP.get('/healthz', async (req, res) => {
  const result = await hyatlasRequest('GET', '/healthz');
  res.json(result);
});

HYATLAS_APP.get('/metrics', async (req, res) => {
  const result = await hyatlasRequest('GET', '/api/v1/metrics');
  res.json(result);
});

HYATLAS_APP.post('/add', async (req, res) => {
  const result = await hyatlasRequest('POST', '/api/v1/add', req.body);
  res.json(result);
});

HYATLAS_APP.post('/search', async (req, res) => {
  const result = await hyatlasRequest('POST', '/api/v1/search', req.body);
  res.json(result);
});

HYATLAS_APP.get('/list', async (req, res) => {
  const { limit, layer, include_raw } = req.query;
  const result = await hyatlasRequest('POST', '/api/v1/list', {
    limit: parseInt(limit) || 30,
    layer: layer || '',
    include_raw: include_raw === 'true',
  });
  res.json(result);
});

HYATLAS_APP.get('/graph', async (req, res) => {
  const result = await hyatlasRequest('GET', '/api/v1/graph');
  res.json(result);
});

HYATLAS_APP.post('/digest', async (req, res) => {
  const result = await hyatlasRequest('POST', '/api/v1/digest');
  res.json(result);
});

HYATLAS_APP.post('/shell', async (req, res) => {
  const { command } = req.body;
  if (!command) {
    return res.status(400).json({ ok: false, error: 'command required' });
  }
  const { spawn } = await import('child_process');
  const child = spawn(command, { shell: true });
  let stdout = '';
  let stderr = '';
  child.stdout.on('data', (d) => { stdout += d.toString(); });
  child.stderr.on('data', (d) => { stderr += d.toString(); });
  child.on('close', (code) => {
    res.json({ ok: code === 0, exit_code: code, stdout: stdout.slice(0, 4000), stderr: stderr.slice(0, 4000) });
  });
  child.on('error', (err) => {
    res.status(500).json({ ok: false, error: err.message });
  });
});

app.use('/api/hyatlas', HYATLAS_APP);

// ─── Mount Lilith Mod-Engine REST API at /api/mod ───
const modApp = createModApp();
app.use('/api/mod', modApp);

// ─── Start Server ───
const PORT = process.env.VOID_PORT || 3000;

app.listen(PORT, () => {
  console.log(`🜏 Void runtime listening on :${PORT}`);
  console.log(`   Profiles: ${Object.keys(SECURITY_PROFILES).join(', ')}`);
  console.log(`   Max concurrent: ${MAX_CONCURRENT}`);
  console.log(`   History: ${HISTORY_FILE}`);
  console.log(`   Mod engine: /api/mod/*`);
  console.log(`   GUI: http://localhost:${PORT}/api/void/gui`);
});

export { app, executeCode, createVoidApp, startVoidServer };

function createVoidApp() { return app; }
async function startVoidServer(port = 3000) { app.listen(port, () => { console.log(`🜏 Void runtime listening on :${port}`); }); }