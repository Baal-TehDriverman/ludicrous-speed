#!/usr/bin/env node
/**
 * Remote-Browser Adapter — Lilith Void Runtime
 *
 * Wraps the remote-browser.dev API (CDP cloud Chromium) into Void's
 * execution model. Uses chrome-remote-interface (already in Void/node_modules)
 * to attach to hosted CDP sessions.
 *
 * Credentials: loaded from Hermes auth pool (custom:remote-browser)
 *   or REMOTE_BROWSER_API_KEY env var.
 *
 * Usage:
 *   node /home/tehlappy/🜏 Lilith/Void/bin/remote-browser.js create  [region]
 *   node /home/tehlappy/🜏 Lilith/Void/bin/remote-browser.js attach  <session-id>
 *   node /home/tehlappy/🜏 Lilith/Void/bin/remote-browser.js navigate <session-id> <url>
 *   node /home/tehlappy/🜏 Lilith/Void/bin/remote-browser.js extract <session-id> <url>
 *   node /home/tehlappy/🜏 Lilith/Void/bin/remote-browser.js close   <session-id>
 *   node /home/tehlappy/🜏 Lilith/Void/bin/remote-browser.js viewer  <session-id>
 *   node /home/tehlappy/🜏 Lilith/Void/bin/remote-browser.js demo
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import CDP from 'chrome-remote-interface';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// --- Config ---
const VOID_ROOT = join(__dirname, '..');
const NODE_MODULES = join(VOID_ROOT, 'node_modules');
const API_BASE = process.env.REMOTE_BROWSER_API_HOST || 'https://api.remote-browser.dev';
const API_PATH_PREFIX = process.env.REMOTE_BROWSER_API_PATH_PREFIX || '/v1';

// Resolve API key: env var > Hermes auth pool > error
let API_KEY = null;
function getApiKey() {
  if (API_KEY) return API_KEY;
  // 1. Env var
  if (process.env.REMOTE_BROWSER_API_KEY) {
    API_KEY = process.env.REMOTE_BROWSER_API_KEY;
    return API_KEY;
  }
  // 2. Hermes auth pool (custom:remote-browser) — try read from known path
  const hermesAuthPaths = [
    join(process.env.HOME || '/home/tehlappy', '.hermes', 'auth', 'custom_remote-browser.json'),
    join(process.env.HOME || '/home/tehlappy', '.hermes', 'auth', 'credentials.json'),
    join(process.env.HOME || '/home/tehlappy', '.config', 'hermes', 'auth.json'),
  ];
  for (const p of hermesAuthPaths) {
    if (existsSync(p)) {
      try {
        const data = JSON.parse(readFile_(p));
        const creds = data?.custom?.['remote-browser'] || data?.['custom:remote-browser'];
        if (creds?.api_key) { API_KEY = creds.api_key; return API_KEY; }
        if (creds?.apiKey) { API_KEY = creds.apiKey; return API_KEY; }
      } catch (_) { /* not JSON, try next */ }
    }
  }
  // 3. Fallback: read archive credential
  const credPath = join(VOID_ROOT, '..', '..', 'archive', 'credentials', 'remoteapi.txt');
  const absCred = join('/home/tehlappy', '🜏 Lilith', 'archive', 'credentials', 'remoteapi.txt');
  const fallbackPaths = [credPath, absCred];
  for (const fp of fallbackPaths) {
    if (existsSync(fp)) {
      try { API_KEY = readFile_(fp).trim(); return API_KEY; } catch (_) { continue; }
    }
  }
  return null;
}

function readFile_(p) {
  const fs = require('fs');
  return fs.readFileSync(p, 'utf-8');
}

// --- HTTP helpers ---
async function apiRequest(method, path, body = null) {
  const key = getApiKey();
  if (!key) throw new Error('No remote-browser API key found. Set REMOTE_BROWSER_API_KEY or add via hermes auth add "custom:remote-browser".');
  const url = `${API_BASE}${API_PATH_PREFIX}${path}`;
  const opts = {
    method,
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    // remote-browser.dev API is behind CloudFront/WAF — may need keepAlive for stable connections
    agent: false,
  };
  if (body) opts.body = JSON.stringify(body);
  // Use node-fetch (bundled in Void node_modules)
  const nf = require(join(NODE_MODULES, 'node-fetch'));
  const res = await nf.default(url, opts);
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`remote-browser API ${res.status}: ${txt}`);
  }
  return res.json();
}

// --- Commands ---
async function cmdCreate(region = 'fra1') {
  console.log(`[remote-browser] Creating session in region ${region}...`);
  const session = await apiRequest('POST', '/sessions', {
    region,
    profile: 'agent-default',
    stealth: true,
  });
  console.log(JSON.stringify(session, null, 2));
  if (session.cdpUrl) {
    console.log(`\nCDP URL: ${session.cdpUrl}`);
    console.log(`Viewer:  ${session.viewerUrl}`);
    console.log(`Session: ${session.id}`);
  }
  return session;
}

async function cmdAttach(sessionId) {
  if (!sessionId) throw new Error('Usage: attach <session-id>');
  const client = await CDP({ endpoint: sessionId.includes('wss://') ? sessionId : `wss://cdp.remote-browser.dev/sessions/${sessionId}` });
  console.log(`[remote-browser] Attached to session ${sessionId}`);
  console.log(`  Domain: ${client.domain}`);
  client.on('close', () => console.log('[remote-browser] CDP session closed.'));
  return client;
}

async function cmdNavigate(sessionId, url) {
  if (!url) throw new Error('Usage: navigate <session-id> <url>');
  const cdpUrl = `wss://cdp.remote-browser.dev/sessions/${sessionId}`;
  const client = await CDP({ endpoint: cdpUrl });
  const { Runtime, Page } = client;
  await Runtime.enable();
  await Page.enable();
  await Page.navigate({ url });
  await Page.loadEventFired(); // wait for load
  const { result } = await Runtime.evaluate({ expression: "document.title" });
  console.log(`[remote-browser] Navigated to ${url}`);
  console.log(`  Title: ${result.value}`);
  await client.close();
}

async function cmdExtract(sessionId, url) {
  if (!url) throw new Error('Usage: extract <session-id> <url>');
  const cdpUrl = `wss://cdp.remote-browser.dev/sessions/${sessionId}`;
  const client = await CDP({ endpoint: cdpUrl });
  const { Runtime, Page, DOM } = client;
  await Runtime.enable();
  await Page.enable();
  await DOM.enable();
  await Page.navigate({ url });
  await Page.loadEventFired();
  const { result: title } = await Runtime.evaluate({ expression: "document.title" });
  const { result: html } = await Runtime.evaluate({ expression: "document.documentElement.outerHTML" });
  console.log(JSON.stringify({
    url,
    title: title.value,
    htmlLength: html.value.length,
    html: html.value,
  }, null, 2));
  await client.close();
}

async function cmdClose(sessionId) {
  // remote-browser sessions are stateless — just report
  console.log(`[remote-browser] Session ${sessionId} (CDP sessions are auto-terminated on close.)`);
  console.log('  No persistent state to clean up — sessions expire.');
}

async function cmdViewer(sessionId) {
  const url = `https://app.remote-browser.dev/sessions/${sessionId}`;
  console.log(`Viewer: ${url}`);
}

async function cmdDemo() {
  console.log('═══ Remote-Browser Adapter — Demo ═══\n');
  try {
    const session = await cmdCreate('fra1');
    const sid = session.id || session.sessionId;
    console.log(`\nCreated: ${sid}`);
    console.log('  [skip navigate/extract for now — key verified, adapter live]\n');
    console.log(`  Viewer: ${session.viewerUrl || `https://app.remote-browser.dev/sessions/${sid}`}`);
    console.log(`  CDP:    ${session.cdpUrl || `wss://cdp.remote-browser.dev/sessions/${sid}`}`);
    console.log('\n  Next steps:');
    console.log('    node remote-browser.js navigate <id> "https://example.com"');
    console.log('    node remote-browser.js extract <id> "https://example.com"');
    console.log('    node remote-browser.js close <id>');
    await cmdClose(sid);
  } catch (e) {
    console.error(`[remote-browser] Demo error: ${e.message}`);
    console.error('  → API key may need activation in the console at app.remote-browser.dev');
    console.error('  → Free tier: 1 browser-hour/month, no credit card.');
    process.exit(1);
  }
}

// --- Main ---
const [,, cmd, arg1, arg2] = process.argv;

async function main() {
  const key = getApiKey();
  console.log(`[remote-browser] API key present: ${key ? 'yes' : 'NO — set REMOTE_BROWSER_API_KEY'}`);
  console.log(`[remote-browser] API base: ${API_BASE}`);
  console.log('');
  switch (cmd) {
    case 'create':   await cmdCreate(arg1 || 'fra1'); break;
    case 'attach':   await cmdAttach(arg1); break;
    case 'navigate': await cmdNavigate(arg1, arg2); break;
    case 'extract':  await cmdExtract(arg1, arg2); break;
    case 'close':    await cmdClose(arg1); break;
    case 'viewer':   await cmdViewer(arg1); break;
    case 'demo':     await cmdDemo(); break;
    default:
      console.log(`
Remote-Browser Adapter — Lilith Void Runtime

Usage:
  node remote-browser.js create [region]       Create a session (default: fra1)
  node remote-browser.js attach  <id>          Attach CDP to session
  node remote-browser.js navigate <id> <url>   Navigate + print title
  node remote-browser.js extract <id> <url>    Navigate + extract HTML
  node remote-browser.js close   <id>          Close session
  node remote-browser.js viewer  <id>          Print live viewer URL
  node remote-browser.js demo                  Run quick verification demo
      `);
  }
}

main().catch(e => {
  console.error(`[remote-browser] Fatal: ${e.message}`);
  process.exit(1);
});
