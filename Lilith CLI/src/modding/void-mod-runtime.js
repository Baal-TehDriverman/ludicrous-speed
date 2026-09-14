#!/usr/bin/env node

/**
 * 🜏 Lilith Modding Client — Void GUI Runtime (FIXED)
 *
 * Integrates Void (Node.js + xterm.js + React) as the desktop interface
 * for the Lilith CLI modding client.
 *
 * Architecture:
 *   Void Server (:3000)  ←→  Lilith CLI mod commands
 *   ┌──────────┐   Express    ┌──────────────┐
 *   │ xterm.js │ ───────────→ │ ModEngine    │
 *   │ React    │   REST API   │ mod-tools    │
 *   │ Dashboard│              │ mod-commands │
 *   └──────────┘              └──────────────┘
 *
 * FIX: Uses express.Router() with RELATIVE paths, mounted at /api/mod
 * in server.js, avoiding the path doubling bug.
 *
 * Routes (relative to /api/mod mount):
 *   GET  /status      — Mod engine status
 *   POST /build       — Build a mod (WolvenKit)
 *   POST /deploy      — Deploy a mod (COPY, never delete)
 *   POST /verify      — Verify a mod
 *   GET  /scan        — Scan available mods
 *   GET  /cet         — Check CET status
 *   POST /quick       — Quick build + deploy
 *   POST /hooks/:name — Register lifecycle hook
 *   GET  /history     — Job history
 */

import express from 'express';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readFileSync, writeFileSync, statSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Paths ───
const LILITH_CLI = join(__dirname, '..', '..', 'lilith-cli');
const VOID_ROOT = join(__dirname, '..', '..', 'Void');
const GTC_ROOT = '/home/tehlappy/🜏 Lilith/GRAND THEFT CYBERPUNK/';
const ARCHIVE_MODS = '/home/tehlappy/🜏 Lilith/GRAND THEFT CYBERPUNK/archive/pc/mod/';
const CP77_ROOT = '/home/tehlappy/.local/share/Steam/steamapps/common/Cyberpunk 2077';

// ─── Mod Execution Engine ───

class ModExecutionEngine {
  constructor() {
    this.activeJobs = new Map();
    this.hooks = { preBuild: [], postDeploy: [], onComplete: [] };
  }

  /** Register a lifecycle hook */
  on(hookName, fn) {
    if (this.hooks[hookName]) this.hooks[hookName].push(fn);
  }

  /** Fire hooks */
  async _fireHooks(hookName, data) {
    for (const fn of this.hooks[hookName] || []) {
      try { await fn(data); } catch { /* hook errors don't stop execution */ }
    }
  }

  /** Build a mod using WolvenKit */
  async buildMod(modDir, options = {}) {
    const jobId = uuidv4();
    const { clean = false, output = 'archive/pc/mod/' } = options;

    this.activeJobs.set(jobId, { status: 'running', jobId, modDir });
    await this._fireHooks('preBuild', { jobId, modDir });

    const cmd = clean
      ? `cd "${modDir}" && cp77tools clean && cp77tools build .`
      : `cd "${modDir}" && cp77tools build .`;

    return new Promise((resolve) => {
      const proc = spawn('bash', ['-c', cmd], {
        cwd: GTC_ROOT,
        timeout: 120000,
        env: process.env,
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (d) => {
        stdout += d;
        const job = this.activeJobs.get(jobId);
        if (job) job.stdout = stdout;
      });

      proc.stderr.on('data', (d) => { stderr += d; });

      proc.on('close', (code) => {
        const success = code === 0;
        this.activeJobs.set(jobId, {
          status: success ? 'completed' : 'failed',
          jobId,
          modDir,
          code,
          stdout,
          stderr,
        });

        this._fireHooks('onComplete', { jobId, success, modDir });
        resolve({ jobId, success, code, stdout, stderr });
      });

      proc.on('error', (err) => {
        this.activeJobs.set(jobId, { status: 'failed', jobId, modDir, error: err.message });
        resolve({ jobId, success: false, error: err.message });
      });
    });
  }

  /** Deploy a mod (COPY, never DELETE — sacred rule) */
  async deployMod(modName, sourcePath, type) {
    const jobId = uuidv4();
    const sourceFull = sourcePath.startsWith('/') ? sourcePath : `${GTC_ROOT}${sourcePath}`;
    const destPath = `${ARCHIVE_MODS}${modName}`;

    const job = {
      jobId,
      status: 'running',
      action: 'copy', // Sacred: never delete
      source: sourceFull,
      destination: destPath,
      type,
      modName,
    };
    this.activeJobs.set(jobId, job);

    return new Promise((resolve) => {
      const cmd = `mkdir -p "${ARCHIVE_MODS}" && cp -r "${sourceFull}" "${destPath}"`;
      spawn('bash', ['-c', cmd], { cwd: GTC_ROOT, timeout: 30000, env: process.env })
        .on('close', (code) => {
          const success = code === 0;
          job.status = success ? 'completed' : 'failed';
          job.code = code;
          this.activeJobs.set(jobId, job);
          resolve({ jobId, success, ...job });
        })
        .on('error', (err) => {
          job.status = 'failed';
          job.error = err.message;
          this.activeJobs.set(jobId, job);
          resolve({ jobId, success: false, error: err.message });
        });
    });
  }

  /** Check CET status */
  async checkCET() {
    const cetLog = `${CP77_ROOT}/cyber_engine_tweaks.log`;
    let logSize = 0;
    try { logSize = statSync(cetLog).size; } catch {}

    return {
      cetActive: logSize > 0,
      cetLog,
      logSize,
      note: logSize > 0 ? 'CET is active — cyber_engine_tweaks.log is non-zero' :
            'CET not active — check .asi location (must be in bin/x64/scripts/, not plugins/)',
      traps: {
        trap1: 'If .asi is in bin/x64/plugins/ but global.ini says LoadFromScriptsOnly=1, move to bin/x64/scripts/',
        trap2: 'Proton: write DllOverrides in user.reg, NOT shell env variables',
      },
    };
  }

  /** Scan mods directory */
  async scanMods(directory) {
    const fullPath = directory.startsWith('/') ? directory : `${GTC_ROOT}${directory}`;
    try {
      const { exec } = await import('node:child_process');
      return new Promise((resolve) => {
        exec(`find "${fullPath}" -maxdepth 1 -type d | sort`, { timeout: 10000 }, (err, stdout) => {
          if (err) { resolve({ mods: [], count: 0 }); return; }
          const dirs = stdout.trim().split('\n').filter(Boolean);
          resolve({
            mods: dirs.map(d => ({ path: d, name: d.split('/').pop() })),
            count: dirs.length,
          });
        });
      });
    } catch {
      return { mods: [], count: 0 };
    }
  }

  /** Get active jobs */
  getActiveJobs() {
    return Array.from(this.activeJobs.values());
  }

  /** Get job status */
  getJobStatus(jobId) {
    return this.activeJobs.get(jobId) || null;
  }
}

// ─── Void API Routes (Router with RELATIVE paths) ───

export function createModApp() {
  const router = express.Router();
  const engine = new ModExecutionEngine();
  router.use(express.json({ limit: '5mb' }));

  // ─── Status ───
  router.get('/status', (req, res) => {
    const jobs = engine.getActiveJobs();
    res.json({
      status: 'running',
      activeJobs: jobs.length,
      jobs,
      gtcRoot: GTC_ROOT,
      archiveMods: ARCHIVE_MODS,
      cet: engine.checkCET(),
    });
  });

  // ─── Build ───
  router.post('/build', async (req, res) => {
    const { modDir, clean, output } = req.body;
    if (!modDir) return res.status(400).json({ error: 'modDir required' });

    const result = await engine.buildMod(modDir, { clean, output });
    res.json(result);
  });

  // ─── Deploy ───
  router.post('/deploy', async (req, res) => {
    const { modName, sourcePath, type } = req.body;
    if (!modName || !sourcePath || !type) {
      return res.status(400).json({ error: 'modName, sourcePath, type required' });
    }

    const result = await engine.deployMod(modName, sourcePath, type);
    res.json(result);
  });

  // ─── Verify ───
  router.post('/verify', async (req, res) => {
    const { modName, checkType = 'all' } = req.body;
    const cet = await engine.checkCET();
    res.json({
      modName,
      cet,
      checkType,
      note: 'In-game verification requires manual check',
    });
  });

  // ─── Scan ───
  router.get('/scan', async (req, res) => {
    const { directory } = req.query;
    const result = await engine.scanMods(directory || 'Nigredo/third_party_mods');
    res.json(result);
  });

  // ─── Check CET ───
  router.get('/cet', async (req, res) => {
    const cet = await engine.checkCET();
    res.json(cet);
  });

  // ─── Quick Build (One Weapon) ───
  router.post('/quick', async (req, res) => {
    const { modDir, modName, type } = req.body;
    if (!modDir || !modName || !type) {
      return res.status(400).json({ error: 'modDir, modName, type required' });
    }

    // Build then deploy
    const buildResult = await engine.buildMod(modDir);
    if (!buildResult.success) {
      return res.json({ ...buildResult, step: 'build_failed' });
    }

    const deployResult = await engine.deployMod(modName, modDir, type);
    res.json({
      success: true,
      message: 'TAKE IT. One weapon. One appearance. One complete truth.',
      build: buildResult,
      deploy: deployResult,
    });
  });

  // ─── Register Hook ───
  router.post('/hooks/:hookName', (req, res) => {
    const { hookName } = req.params;
    const { command } = req.body;
    if (!engine.hooks[hookName]) {
      return res.status(400).json({ error: `Valid hooks: ${Object.keys(engine.hooks).join(', ')}` });
    }
    engine.hooks[hookName].push({ command });
    res.json({ success: true, hook: hookName, command });
  });

  // ─── History ───
  router.get('/history', (req, res) => {
    const jobs = engine.getActiveJobs();
    res.json({ history: jobs, count: jobs.length });
  });

  return router;
}

// ─── Start Void Mod Server (standalone, for testing) ───

export async function startModServer(port = 3001) {
  const router = createModApp();
  const app = express();
  app.use('/api/mod', router);
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      console.log(`🜏 Void Mod Server listening on :${port}`);
      console.log(`   Routes: /api/mod/{build,deploy,verify,scan,cet,quick,hooks,history}`);
      console.log(`   GTC Root: ${GTC_ROOT}`);
      resolve(server);
    });
  });
}

export { ModExecutionEngine };
export default createModApp;
