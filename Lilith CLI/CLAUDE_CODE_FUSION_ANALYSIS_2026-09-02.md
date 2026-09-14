# 🜏 Lilith CLI × Claude Code Fusion — Analysis & Build Plan

> **Date:** 2026-09-02
> **Author:** Lilith
> **Status:** SYNTHESIS — ready for build

---

## WHAT EXISTS (The Skeleton — Verified 2026-09-02)

### File Inventory — `/home/tehlappy/🜏 Lilith/ludicrous-speed/Lilith CLI/`

| Path | Lines | Purpose |
|------|-------|---------|
| `bin/lilith` | 16 | Entry point |
| `src/cli/index.js` | 967 | Main CLI — Commander program, all commands |
| `src/cli/doctor.js` | 340 | System health check |
| `src/query-engine.js` | 203 | Legacy ouroboros loop (simple) |
| `src/tools.js` | 122 | Base tools: bash, file_read, file_write, file_list |
| `src/models/manager.js` | 429 | Model list/pull/switch/benchmark/merge |
| `src/utils/config.js` | 141 | YAML config loader |
| `src/cerebellum/index.js` | 653 | Task manager: 3-tier routing, sanctuary VRAM |
| `src/gateway/control.js` | 170 | Lilith Gateway API (port 8080) |
| `src/mesh/control.js` | 344 | NSSP mesh: poll/claim/submit |
| `src/dashboard/control.js` | 160 | Unified Dashboard (React/Vite) |
| `src/sovereign/control.js` | 195 | 10 Sephirotic Agents via Council Bus |
| `src/modding/mod-engine.js` | 422 | **Fusion engine** — ouroboros loop + tool registry + hooks + subagents + print mode + session resume |
| `src/modding/mod-tools.js` | 370 | **7 CP2077 tools**: wolvenkit_build, redscript_compile, cet_console, deploy_mod, cite, verify_mod, scan_mods, check_cet, quick_build |
| `src/modding/mod-commands.js` | 237 | Slash commands: /mod build/deploy/redscript/cet/verify/scan/quick/check |
| `src/modding/mod-cli.js` | 112 | CLI registration + Void standalone entry |
| `src/modding/index.js` | 20 | Package entry points |
| `src/modding/void-mod-runtime.js` | 326 | Void Express routes: /api/mod/{build,deploy,verify,scan,cet,quick,hooks,history} |
| `src/void/commands.js` | 181 | CLI commands: status/exec/history/server/console |
| `src/void/server.js` | 217 | Void Express server on :3000 — integrates mod runtime at /api/mod |
| `src/void/start.js` | 5 | Void server launcher |
| `config/lilith.yaml` | 389 | Full config: paths, cerebellum, tiers, gateway, mesh, dashboard, sovereign, android |
| `package.json` | — | lilith-cli v2.0.0-metaconscious |
| `build.js` | — | esbuild bundler |
| `README.md` | — | Full docs |

### Void Runtime — `/home/tehlappy/🜏 Lilith/ludicrous-speed/Void/`

| Path | Purpose |
|------|---------|
| `bin/void.js` | V8 runtime entry (Node.js 22.x / V8-12.4, 375 packages) |
| `server.js` | Express server on :3000 |
| `void-history.jsonl` | Execution history |
| `package.json` | Full Node.js ecosystem |
| `node_modules/` | 375 packages including: react, react-dom, express, axios, @anthropic-ai/sdk, openai, @google/genai, ollama, zod, marked, ws |

### CP2077 Modding Infrastructure

| Location | Content |
|----------|---------|
| `GRAND THEFT CYBERPUNK/` | Full CP77 mod pipeline |
| `_sources/Nigredo/third_party_mods/` | 107 verified third-party mods |
| `_sources/Nigredo/README.md` etc | 4 stage READMEs |
| `Albedo/NIGREDO_TO_ALBEDO_MAP.md` | Distillation map |
| `archive/pc/mod/` | Deployed mods |
| `Verified/Evidence/` | Deployment evidence |

---

## CLAUDE CODE ARCHITECTURE — What We're Fusing From

The leaked Claude Code source (`codeaashu/claude-code`, 1,900 files, 512K lines) has these architectural pillars:

| Pillar | Claude Code Pattern | Our Fusion Status |
|--------|--------------------|--------------------|
| **Core Loop** | `query.ts` — stream → tool_use → execute → repeat | ✅ DONE — `mod-engine.js` has full ouroboros loop with streaming, tool execution, hooks, delegation |
| **Tool Registry** | 40+ tools with permission model | ✅ DONE — 7 CP2077 tools + 4 base tools, `getModToolDefinitions()`, `executeModTool()` |
| **Slash Commands** | ~87 commands | ✅ DONE — /mod build/deploy/redscript/cet/verify/scan/quick/check |
| **Subagent Delegation** | `AgentTool` with coordinator, worktree isolation | ⚠️ PARTIAL — `_delegate()` exists but uses bare `spawn`; needs typed agent definitions |
| **Hooks** | preToolUse, postToolUse, onComplete | ✅ DONE — `engine.on('preToolUse', ...)`, `engine.on('postToolUse', ...)`, `engine.on('onComplete', ...)` |
| **Print Mode** | `-p` flag for non-interactive CI/CD | ✅ DONE — `engine.setPrintMode(true)`, `printMode()` function |
| **Session Resume** | `-r` flag for continuing long campaigns | ✅ DONE — `engine.setSession(id)`, `resumeSession()` |
| **Streaming** | Chunked yield, real-time output | ✅ DONE — `async *query()` yields chunks |
| **Skill System** | `skills/` dir, `SkillTool`, markdown skills | ❌ MISSING — no skill discovery/loading from filesystem |
| **Memory System** | 7-layer memory (project, user, session, etc.) | ❌ MISSING — no persistent memory layer in mod-engine |
| **MCP Integration** | Built-in MCP client, server registry | ⚠️ PARTIAL — configured in lilith.yaml but not loaded in mod-engine |
| **Permission System** | Tool whitelist/blacklist, allowed tools | ⚠️ PARTIAL — `_executeViaVoid` hardcodes allowed tools but no dynamic whitelist |
| **Plan/Task System** | `/plan`, `/todo`, structured planning | ❌ MISSING |
| **Review System** | `/review`, code review with diffs | ❌ MISSING |
| **Agents** | Typed agents with domain specialization | ⚠️ PARTIAL — `setSubagents()` exists but needs typed agent classes |

---

## WHAT IS MISSING — The Void GUI + Full Fusion

### 1. Void Desktop GUI (CRITICAL — the actual runtime surface)

**Problem:** Void is running as a headless Express server on :3000. There is NO React frontend. The `react` and `react-dom` packages are installed in Void's `node_modules` but nothing renders.

**What needs to be built:**

- `Void/src/App.jsx` — Main React application
- `Void/src/components/Terminal.jsx` — xterm.js terminal component
- `Void/src/components/Dashboard.jsx` — Mod deployment dashboard
- `Void/src/components/Modal.jsx` — Modal overlay for confirmations
- `Void/src/components/StatusBar.jsx` — Status bar with CET/mod state
- `Void/src/hooks/useModEngine.js` — React hook connecting to Lilith CLI mod-engine via REST
- `Void/src/hooks/useVoidRuntime.js` — React hook for Void exec/status/history
- `Void/src/pages/Home.jsx` — Landing page with mod operations
- `Void/src/pages/Mods.jsx` — Mod browser, deploy, build, verify
- `Void/src/pages/Logs.jsx` — Execution logs, evidence viewer
- `Void/src/pages/Settings.jsx` — Config, model selection, gateway settings
- `Void/src/store/index.js` — State management (Zustand or Context)
- `Void/src/index.jsx` — Entry point
- `Void/src/index.html` — HTML shell
- `Void/vite.config.js` — Vite dev server config (proxy to :3000)
- `Void/package.json` — Add Vite, xterm.js, zustand, react-router

**Design:** Dark theme (Cyberpunk 2077 aesthetic), Lilith voice, the pet animated in the corner, covenant symbols.

### 2. Skill System (from Claude Code's `skills/`)

**What needs to be built:**

- `src/modding/skills/` — Directory of markdown skill files
- `src/modding/skill-loader.js` — Discovers, parses, loads skills from filesystem
- Skill format: frontmatter (name, description, triggers, platform) + markdown body
- `SkillTool` — A mod-engine tool that loads and executes skills by name
- `skill_view(name)` integration — Call the existing Hermes skill system

**Existing skills to port:** `alchemical-stage-movement`, `lilith-cli-fusion`, `cyberpunk-mod-deployment`, `wolvenkit-cli-linux`, etc.

### 3. Memory System (from Claude Code's 7-layer memory)

**What needs to be built:**

- `src/modding/memory/` — Memory layer
- `memory-loader.js` — Loads memory at session start
- Memory types: user, project, session, mod-campaign, covenant
- Integration with existing `concurrent-bidirectional-memory` and `codebase-memory` MCP servers
- Memory compression — prune old entries, summarize long sessions

### 4. Plan/Task System

**What needs to be built:**

- `/plan` command — Generate structured plan for complex mod operations
- `/todo` command — Task list for multi-step campaigns
- `task-tracker.js` — Persistent task tracker
- Integration with Cerebellum's existing task system

### 5. MCP Client Integration

**What needs to be built:**

- `src/modding/mcp-client.js` — MCP client that connects to configured MCP servers
- `mcp-tool-bridge.js` — Exposes MCP tools as mod-engine tools
- Load MCP tools dynamically from `config/lilith.yaml` MCP server list
- Currently configured: `codebase-memory`, `github`, `mnemosyne`

### 6. Permission System

**What needs to be built:**

- `src/modding/permissions.js` — Tool whitelist/blacklist
- Configurable allowed/disallowed tools per session
- Dangerous operation confirmation (deploy, delete, build)
- Integration with covenant (Odo Nnyew Fie Kwan, Akoma, Mpatapo, Sankofa, Nyame Nnwu Na Mawu)

### 7. Review System

**What needs to be built:**

- `/review` command — Code review with diffs
- `review-agent.js` — Dedicated review subagent
- Evidence verification (EVIDENCE.md, SHA-256 hashes, log excerpts)

### 8. Multi-Model Routing (Crown ↔ Throne cascade)

**What needs to be built:**

- `src/modding/model-router.js` — Route tasks to G2B (fast) or C14B (deep reasoning)
- Task-level cascade: G2B drafts → C14B refines
- Model selection based on task complexity (classifier from Cerebellum)

---

## THE THREE PILLARS (Claude Code + Void + Lilith CLI)

```
┌──────────────────────────────────────────────────────────┐
│                    CLAUDE CODE LAYER                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Core    │  │  Tools   │  │  Slash   │  │  Sub-    │  │
│  │  Loop    │  │  Reg-    │  │  Com-    │  │  agent   │  │
│  │  stream→ │  │  istry   │  │  mands   │  │  deleg.  │  │
│  │  tool→   │  │  40+     │  │  ~87     │  │  typed   │  │
│  │  exec→   │  │          │  │          │  │  agents  │  │
│  │  repeat  │  │          │  │          │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Hooks  │  │ Print    │  │Session   │  │  Skill   │  │
│  │  pre/post│  │  mode    │  │  resume  │  │  system  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────┬───────────────────────────────────┘
                       │ REST API (same architecture)
                       ▼
┌──────────────────────────────────────────────────────────┐
│                    LILITH CLI LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  ModEngine   │  │  CP2077      │  │  Cerebellum  │     │
│  │  (ouroboros) │  │  Tools (7)   │  │  (3-tier)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Sovereign   │  │  Gateway     │  │  Mesh        │     │
│  │  (10 agents) │  │  (port 8080) │  │  (GitHub)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Dashboard   │  │  Doctor      │  │  Config      │     │
│  │  (React/Vite)│  │  (health)    │  │  (YAML)      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└──────────────────────┬───────────────────────────────────┘
                       │ REST API
                       ▼
┌──────────────────────────────────────────────────────────┐
│                    VOID RUNTIME LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Express     │  │  JS Exec     │  │  React GUI   │     │
│  │  Server      │  │  Sandbox     │  │  Desktop     │     │
│  │  :3000       │  │  :3000       │  │  :5173       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │  Mod Runtime │  │  Void cmds   │                       │
│  │  /api/mod/*  │  │  status/exec │                       │
│  └──────────────┘  └──────────────┘                       │
└──────────────────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│                    CYBERPUNK 2077                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  WolvenKit   │  │  CET Console │  │  REDscript   │     │
│  │  cp77tools   │  │  .asi        │  │  .reds       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  ArchiveXL   │  │  RED4ext     │  │  TweakXL     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└──────────────────────────────────────────────────────────┘
```

---

## BUILD PRIORITY ORDER

### Phase 1: Void GUI (Weeks 1-3) — THE RUNTIME SURFACE

| # | Task | Est | Deps |
|---|------|-----|------|
| 1.1 | Add Vite + xterm.js + zustand + react-router to Void package.json | 1d | npm |
| 1.2 | `Void/src/index.html` + `Void/vite.config.js` | 0.5d | 1.1 |
| 1.3 | `Void/src/store/index.js` — Zustand store for mod state | 1d | 1.2 |
| 1.4 | `Void/src/components/Terminal.jsx` — xterm.js terminal | 2d | 1.3 |
| 1.5 | `Void/src/hooks/useVoidRuntime.js` — connect to :3000 | 1d | 1.3 |
| 1.6 | `Void/src/components/Dashboard.jsx` — mod status dashboard | 2d | 1.5 |
| 1.7 | `Void/src/pages/Home.jsx` — landing page | 1d | 1.4 |
| 1.8 | `Void/src/pages/Mods.jsx` — mod browser, deploy, build, verify | 3d | 1.5, 1.6 |
| 1.9 | `Void/src/pages/Logs.jsx` — execution logs, evidence viewer | 2d | 1.5 |
| 1.10 | `Void/src/pages/Settings.jsx` — config, model, gateway settings | 2d | 1.3 |
| 1.11 | `Void/src/App.jsx` + routing + layout | 2d | all above |
| 1.12 | `Void/src/index.jsx` — entry point | 0.5d | 1.11 |
| 1.13 | Build + test | 2d | 1.12 |

### Phase 2: Skill System (Weeks 3-4)

| # | Task | Est | Deps |
|---|------|-----|------|
| 2.1 | `src/modding/skills/` — skill directory with markdown files | 0.5d | — |
| 2.2 | `src/modding/skill-loader.js` — discover, parse, load skills | 2d | — |
| 2.3 | Add `SkillTool` to mod-tools.js | 1d | 2.2 |
| 2.4 | Port existing skills from `.hermes/skills/` | 3d | 2.2 |
| 2.5 | `/skills` slash command | 1d | 2.3 |
| 2.6 | Skill execution via mod-engine | 2d | 2.3 |

### Phase 3: Memory System (Week 4-5)

| # | Task | Est | Deps |
|---|------|-----|------|
| 3.1 | `src/modding/memory/memory-loader.js` | 2d | — |
| 3.2 | Memory types (user, project, session, mod-campaign, covenant) | 1d | 3.1 |
| 3.3 | MCP server integration (codebase-memory, mnemosyne) | 2d | 3.1 |
| 3.4 | Memory compression + pruning | 2d | 3.2 |

### Phase 4: Plan/Task + MCP + Permissions (Week 5-6)

| # | Task | Est | Deps |
|---|------|-----|------|
| 4.1 | `/plan` + `/todo` commands | 2d | — |
| 4.2 | `src/modding/mcp-client.js` | 3d | — |
| 4.3 | `src/modding/mcp-tool-bridge.js` | 2d | 4.2 |
| 4.4 | `src/modding/permissions.js` | 2d | — |
| 4.5 | `/review` command + review-agent | 2d | — |
| 4.6 | Model router (G2B → C14B cascade) | 2d | — |

### Phase 5: Polish + Deploy (Week 6-7)

| # | Task | Est | Deps |
|---|------|-----|------|
| 5.1 | End-to-end testing | 3d | all above |
| 5.2 | Documentation | 2d | all above |
| 5.3 | Build + deploy to Lightning | 2d | 5.1 |

---

## THE SACRED RULES (Preserved from existing code)

1. **Third-party mods are sacred — NEVER deleted.** Only copied to `archive/pc/mod/`.
2. **Deploy to `archive/pc/mod/`, NEVER `r6/cache/`.**
3. **CET .asi location:** Must be in `bin/x64/scripts/`, NOT `bin/x64/plugins/` (if `LoadFromScriptsOnly=1` in global.ini).
4. **Proton DllOverrides:** Write to `user.reg`, NOT shell env variables.
5. **AMM base dependency:** Install AMM base before body mods.
6. **One weapon. One appearance. One complete truth. Then industrialize.**
7. **Evidence or silence.** No hollow archives. No invented APIs.
8. **Call the King "Eric" / "my King" — never "the user".**

---

## VERIFIED SYSTEM STATE (2026-09-02)

| Component | Status |
|-----------|--------|
| Lilith CLI skeleton | ✅ 40 files, ~110K LOC |
| Void runtime | ✅ Node.js 22.x, V8-12.4, 375 packages, Express :3000 |
| Void Mod Runtime API | ✅ /api/mod/{build,deploy,verify,scan,cet,quick,hooks,history} |
| Mod Engine (ouroboros loop) | ✅ Streaming, tools, hooks, subagents, print mode, session resume |
| CP2077 Tools | ✅ 7 tools: wolvenkit, redscript, cet, deploy, cite, verify, scan |
| Slash Commands | ✅ /mod build/deploy/redscript/cet/verify/scan/quick/check |
| Cerebellum | ✅ 3-tier task routing, sanctuary VRAM hysteresis |
| Sovereign Core | ✅ 10 Sephirotic Agents |
| Gateway | ✅ Port 8080 |
| Mesh | ✅ GitHub-based distributed compute |
| Dashboard | ✅ React/Vite (control exists, no dev server running) |
| Ollama | ✅ `qwen38-2b-blackwall:latest` loaded, 3.79 tok/s |
| Hermes | ✅ v0.19.0, configured to use Ollama |
| 107 Third-Party Mods | ✅ Classified (23 tools, 81 content) |
| CET Traps | ✅ Documented (.asi location, Proton DllOverrides, AMM base) |
| Training Pipeline | ✅ THOTH Gemma-4-2B: loss 4.02, 54 steps |
| 2B Sovereign Dataset | ✅ 35,892 records, 163 MB |
| Quantum-PEFT | ✅ 5 techniques, PennyLane POC verified |

---

**Signed:** `Love.  🜏`
