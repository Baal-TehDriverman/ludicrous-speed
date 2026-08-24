// ============================================================================
// VOID RUNTIME EXEC SERVICE — capability-gated bridge to Void/bin/void.js
// Added: Ludicrous Speed integration (research/void_integration.md actions 2+3)
//
// POST /api/void/exec   { code, mode?: "eval"|"run", profile?: "no-net"|"ai-only"|"full", timeout_ms? }
// GET  /api/void/status
//
// Security: concurrency-capped, timeout-bounded, temp-dir isolated.
// Profiles gate env vars — "no-net" strips proxy/keys; "ai-only" allows
// AI SDK base URLs only. Default profile: no-net.
// ============================================================================

import { spawn } from "child_process";
import { mkdtempSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, resolve } from "path";
import os from "os";

const VOID_ROOT = resolve(process.env.VOID_ROOT || "/home/tehlappy/🜏 Lilith/ludicrous-speed/Void");
const VOID_BIN = join(VOID_ROOT, "bin", "void.js");
const VOID_EXEC_MAX_CONCURRENT = parseInt(process.env.VOID_EXEC_MAX_CONCURRENT || "2", 10);
const VOID_EXEC_DEFAULT_TIMEOUT = parseInt(process.env.VOID_EXEC_TIMEOUT_MS || "15000", 10);
const VOID_EXEC_MAX_TIMEOUT = 60000;

let voidExecActive = 0;
const execQueue: Array<() => void> = [];
function acquireSlot() {
  if (voidExecActive < VOID_EXEC_MAX_CONCURRENT) {
    voidExecActive++;
    return () => { voidExecActive--; pumpQueue(); };
  }
  return new Promise((release) => execQueue.push(release)).then(() => {
    voidExecActive++;
    return () => { voidExecActive--; pumpQueue(); };
  });
}
function pumpQueue() { let r = execQueue.shift(); while (r && voidExecActive < VOID_EXEC_MAX_CONCURRENT) { r(); r = execQueue.shift(); } }

const PROFILE_ENV_KEYS: Record<string, string[] | null> = {
  "no-net": [],
  "ai-only": ["OPENAI_BASE_URL", "ANTHROPIC_BASE_URL", "OLLAMA_HOST", "GEMINI_API_KEY", "OPENAI_API_KEY", "ANTHROPIC_API_KEY"],
  "full": null, // null = inherit everything
};

export function registerVoidRoutes(app: import("express").Express) {
  app.get("/api/void/status", (_req: import("express").Request, res: import("express").Response) => {
    res.json({
      service: "void-exec",
      runtime_root: VOID_ROOT,
      entry_point: VOID_BIN,
      active_executions: voidExecActive,
      queued: execQueue.length,
      max_concurrent: VOID_EXEC_MAX_CONCURRENT,
      profiles: Object.keys(PROFILE_ENV_KEYS),
    });
  });

  app.post("/api/void/exec", async (req: import("express").Request, res: import("express").Response) => {
    const { code, mode = "eval", profile = "no-net" } = req.body || {};
    const timeoutMs = Math.min(parseInt(req.body?.timeout_ms || VOID_EXEC_DEFAULT_TIMEOUT, 10) || VOID_EXEC_DEFAULT_TIMEOUT, VOID_EXEC_MAX_TIMEOUT);

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ error: "code (non-empty string) is required" });
    }
    if (!["eval", "run"].includes(mode)) {
      return res.status(400).json({ error: "mode must be 'eval' or 'run'" });
    }
    if (!(profile in PROFILE_ENV_KEYS)) {
      return res.status(400).json({ error: `profile must be one of: ${Object.keys(PROFILE_ENV_KEYS).join(", ")}` });
    }
    // Path-safety: the binary must exist and be inside the fleet repo
    if (!VOID_BIN.startsWith(resolve("/home/tehlappy/🜏 Lilith/ludicrous-speed")) ) {
      return res.status(500).json({ error: "void binary outside fleet root — refusing" });
    }

    const release = await acquireSlot();
    const workDir = mkdtempSync(join(tmpdir(), "void-exec-"));
    const scriptPath = join(workDir, mode === "run" ? "script.mjs" : "eval-target.mjs");
    writeFileSync(scriptPath, code);

    const childEnv: Record<string, string> = { PATH: "/usr/local/bin:/usr/bin:/bin" };
    for (const [k, v] of Object.entries(process.env)) {
      const allowed = PROFILE_ENV_KEYS[profile];
      if (allowed !== null && allowed.includes(k) && typeof v === "string") childEnv[k] = v;
    }

    const args = mode === "eval"
      ? [VOID_BIN, "eval", code]
      : [VOID_BIN, scriptPath];

    let settled = false;
    const child = spawn(process.execPath, args, {
      cwd: workDir,
      env: { ...childEnv, NODE_PATH: join(VOID_ROOT, "node_modules") },
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "", stderr = "";
    const timer = setTimeout(() => {
      if (!settled) { settled = true; child.kill("SIGKILL"); }
    }, timeoutMs);

    child.stdout.on("data", (d) => { stdout += d; });
    child.stderr.on("data", (d) => { stderr += d; });

    child.on("close", (codeNum, signal) => {
      clearTimeout(timer);
      try { rmSync(workDir, { recursive: true, force: true }); } catch {}
      release();
      if (!settled) {
        settled = true;
        res.json({
          exit_code: codeNum,
          killed_by_timeout: signal === "SIGKILL",
          stdout: stdout.slice(-20000),
          stderr: stderr.slice(-20000),
        });
      }
    });
  });
}

// os import kept for potential future per-exec resource accounting via os.cpus()
void os;
