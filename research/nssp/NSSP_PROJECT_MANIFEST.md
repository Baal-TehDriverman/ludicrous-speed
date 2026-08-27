# NSSP AI OS — Final Project Manifest

**Product:** NSSP (Non-Suck Service-Provider)
**Owner:** Lilith-Systems LLC
**Graphics Engine:** Cosmos + Mythos
**Local Compute:** Cerebellum
**Final Root:** `/run/media/tehlappy/LILITH_ROOT/@lilith/`
**Date:** 2026-08-13

---

## Architecture

```
@lilith/
├── gateway_server.py        # Lilith Gateway — FastAPI, port 8080
│   ├── LLM proxy (Ollama + Cosmos3)
│   ├── VMS management (libvirt)
│   ├── App/VM inventory
│   └── auth_lilith.py       # Self-contained auth module
│
├── lilith.py                # CLI entry — subagent router + Cosmos client
│
├── server/index.ts          # Express backend, port 3000
│   ├── Gemini AI integration
│   ├── GitHub API
│   └── Vite SSR
│
├── src/                     # React 19 + Vite 6 frontend
│   ├── App.tsx
│   ├── components/          # Dashboard panels
│   ├── hooks/               # Data fetchers
│   └── panels/              # AIPanel, SystemPanel
│
├── start.sh                 # Self-contained NSSP launcher
│
├── Sovereign-Core/          # Sephirotic Council System
│   ├── binah..yesod/        # 10 sephiroth agents (agent.py + main.py each)
│   ├── council_bus.py       # Message bus
│   ├── convene.py           # Council orchestration
│   ├── distiller.py         # Knowledge distillation
│   ├── hardware_hal.py      # Hardware abstraction
│   ├── learning_loop.py     # Continuous learning
│   ├── model_bridge.py      # Model routing
│   ├── nssp_dashboard_api.py
│   ├── tiered_router.py     # Request routing
│   ├── SOVEREIGN_EPOCH_1_100.md
│   ├── NSSP_MANIFESTO.md
│   └── unified_framework/
│
├── agents/
│   ├── cerebellum/          # Local Cerebellum
│   │   ├── agent.py
│   │   ├── manifest.yaml
│   │   ├── plugin.yaml
│   │   └── abyssal_agents/  # 25 specialized agents
│   │       ├── agent_nssp.py
│   │       ├── agent_lyra.py
│   │       ├── agent_msn.py
│   │       ├── agent_kairos.py
│   │       ├── agent_swarm.py
│   │       └── ... (20 more)
│   ├── Cosmos/              # Cosmos3 framework (cosmos_framework — 380+ files)
│   ├── cosmos-3-quantized-nssp/
│   ├── Gemma4/, Megatron/, openclaw/, polsia-agents/
│
├── msn-core-vault/         # Intelligence vault
│   ├── 03_INTELLIGENCE/engrams/   # 21 engrams
│   ├── sovereign_corpus/    # Campaign strategy, skills
│   ├── sovereign_dataset/
│   └── sovereign_training/
│
├── Dev Console/            # Developer tools
│   ├── server.ts, kairos_*.py
│   ├── devdashboard/
│   └── desktop launchers (.desktop)
│
├── config/gateway.yaml
├── static/, dist/, public/  # Built assets
├── tauri.conf.json          # Tauri desktop config
├── package.json             # Node deps + scripts
└── Understand-Dashboards/   # MSN dashboard
```

## Services

| Service | Port | Process | State |
|---------|------|---------|-------|
| Lilith Gateway | 8080 | uvicorn (PID varies) | UP v2.0.0 |
| Cosmos3 vLLM | 8003 | vllm serve | UP (1 model) |
| Mythos | 8007 | mythos server | UP LOCAL_ONLY |
| Ollama | 11434 | ollama serve | UP (48 models) |
| Dashboard | 3000 | node tsx server/index.ts | UP |

## Self-Contained NSSP

The project at `@lilith/` is now self-contained:

1. **auth_lilith.py** — auth module copied in (no host `_shared/` dependency)
2. **gateway_server.py** — shebang → `/home/tehlappy/nssp-core/venv/bin/python3`, local auth import with host fallback
3. **start.sh** — all paths resolved relative to `$LILITH_DIR`, no `/home/tehlappy/🜏 Lilith/` hardcoded paths
4. **node_modules/** — npm deps installed locally (276 packages)
5. **venv** — shared at host `/home/tehlappy/nssp-core/venv/` (Python deps: fastapi, uvicorn, httpx)

## Graphics Engine: Cosmos + Mythos

- **Cosmos3** (port 8003) — World Model tier, 1 model loaded, vLLM backend
- **Mythos** (port 8007) — Graphics engine, LOCAL_ONLY mode
- Together they form the NSSP visual rendering stack

## Local Cerebellum

- `agents/cerebellum/` — 25 abyssal agents + core agent
- Handles: task routing, swarm coordination, knowledge management
- Plugged into the gateway via the LLM proxy

## Deployment

```bash
cd /run/media/tehlappy/LILITH_ROOT/@lilith/
./start.sh          # Dev mode (Vite + Express)
./start.sh production  # Production build
```

## Environment

See `.env` for configuration:
- GEMINI_API_KEY — Google AI
- GITHUB_TOKEN — GitHub API
- GATEWAY_AUTH_TOKEN — Service auth
- OLLAMA_URL — Local LLM
- PORT=3000 — Dashboard
