#!/usr/bin/env node
/**
 * 🜏 Void Server — Fixed integration with Lilith Modding Client
 * The mod runtime is NOW eagerly loaded before the server starts.
 */

import express from 'express';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VOID_ROOT = join(__dirname, '..', '..', 'Void');
const NODE_MODULES = join(VOID_ROOT, 'node_modules');
const HISTORY_FILE = join(VOID_ROOT, 'void-history.jsonl');
const MAX_HISTORY = 50;
const MAX_CONCURRENT = 2;
const DEFAULT_TIMEOUT_MS = 15000;
const MAX_TIMEOUT_MS = 60000;

let activeExecutions = 0;
const executionHistory = [];

// ─── EAGERLY LOAD MOD RUNTIME ───
let modAppRef = null;
let modRuntimeError = null;
try {
  const modMod = await import('../modding/void-mod-runtime.js');
  modAppRef = modMod.createModApp();
  console.log(chalk.green('🜏 Mod runtime eagerly loaded — routes ready'));
} catch (err) {
  modRuntimeError = err.message;
  console.log(chalk.yellow('⚠️  Mod runtime unavailable:', err.message));
}

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

function saveHistory(entry) {
  try {
    executionHistory.push(entry);
    if (executionHistory.length > MAX_HISTORY) executionHistory.shift();
    const content = executionHistory.map(e => JSON.stringify(e)).join('\n') + '\n';
    writeFileSync(HISTORY_FILE, content);
  } catch {}
}

loadHistory();

const SECURITY_PROFILES = {
  'no-net': { name: 'no-net', description: 'No network access — local execution only', blockedModules: ['http', 'https', 'net', 'dgram', 'dns', 'tls'] },
  'ai-only': { name: 'ai-only', description: 'AI SDK access only', blockedModules: ['net', 'dgram', 'tls'] },
  'full': { name: 'full', description: 'Full access', blockedModules: [] },
};

async function executeCode(code, mode = 'eval', profile = 'no-net', timeoutMs = DEFAULT_TIMEOUT_MS) {
  const executionId = uuidv4();
  const startTime = Date.now();
  const result = { id: executionId, success: false, output: '', error: '', execution_time_ms: 0, mode, profile, timestamp: new Date().toISOString() };
  if (activeExecutions >= MAX_CONCURRENT) { result.error = `Max concurrent executions (${MAX_CONCURRENT}) reached.`; result.execution_time_ms = Date.now() - startTime; return result; }
  activeExecutions++;
  return new Promise((resolve) => {
    try {
      const child = spawn('node', ['-e', code], { cwd: process.cwd(), env: { ...process.env, NODE_PATH: NODE_MODULES, VOID_PROFILE: profile }, timeout: Math.min(timeoutMs, MAX_TIMEOUT_MS), stdio: ['pipe', 'pipe', 'pipe'] });
      let stdout = '', stderr = '';
      child.stdout.on('data', (d) => { stdout += d; });
      child.stderr.on('data', (d) => { stderr += d; });
      const timeout = setTimeout(() => { child.kill('SIGTERM'); result.error = `Execution timed out after ${timeoutMs}ms`; }, Math.min(timeoutMs, MAX_TIMEOUT_MS));
      child.on('close', (code) => { clearTimeout(timeout); activeExecutions--; result.execution_time_ms = Date.now() - startTime; result.output = stdout.trim(); result.error = result.error || (stderr.trim() || (code !== 0 ? `Exit code: ${code}` : '')); result.success = code === 0 && !result.error; saveHistory(result); resolve(result); });
      child.on('error', (err) => { clearTimeout(timeout); activeExecutions--; result.execution_time_ms = Date.now() - startTime; result.error = err.message; saveHistory(result); resolve(result); });
    } catch (err) { activeExecutions--; result.execution_time_ms = Date.now() - startTime; result.error = err.message; saveHistory(result); resolve(result); }
  });
}

export function createVoidApp() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/void/status', (req, res) => {
    res.json({ status: 'running', runtime_root: VOID_ROOT, node_version: process.version, v8_version: process.versions.v8, active_executions: activeExecutions, max_concurrent: MAX_CONCURRENT, profiles: Object.keys(SECURITY_PROFILES), history_count: executionHistory.length, uptime_seconds: Math.round(process.uptime()) });
  });

  app.post('/api/void/exec', async (req, res) => {
    const { code, mode = 'eval', profile = 'no-net', timeout_ms = DEFAULT_TIMEOUT_MS } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'No code provided' });
    if (!SECURITY_PROFILES[profile]) return res.status(400).json({ success: false, error: `Unknown profile: ${profile}` });
    res.json(await executeCode(code, mode, profile, timeout_ms));
  });

  app.get('/api/void/history', (req, res) => { const limit = Math.min(parseInt(req.query.limit) || 20, MAX_HISTORY); res.json({ history: executionHistory.slice(-limit), total: executionHistory.length }); });
  app.delete('/api/void/history', (req, res) => { executionHistory.length = 0; try { writeFileSync(HISTORY_FILE, ''); } catch {} res.json({ success: true, message: 'History cleared' }); });

  // ─── Mod Runtime API — EAGERLY LOADED ───
  if (modAppRef) {
    app.use('/api/mod', modAppRef);
    console.log(chalk.green('🜏 Mod routes mounted on /api/mod'));
  } else {
    // Fallback: return error for mod routes
    app.all('/api/mod/*', (req, res) => {
      res.status(503).json({ error: 'Mod runtime unavailable', reason: modRuntimeError });
    });
  }

  return app;
}

export async function startVoidServer(port = 3000) {
  const app = createVoidApp();
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`🜏 Void runtime listening on :${port}`);
      console.log(`   Profiles: ${Object.keys(SECURITY_PROFILES).join(', ')}`);
      console.log(`   Max concurrent: ${MAX_CONCURRENT}`);
      console.log(`   History: ${HISTORY_FILE}`);
      resolve(server);
    });
  });
}

export { executeCode, SECURITY_PROFILES };
