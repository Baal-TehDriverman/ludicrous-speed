# Ludicrous Speed — Directory Map
> Generated 2026-08-24 · Canonical repo: `/home/tehlappy/🜏 Lilith/ludicrous-speed/`
> GitHub: https://github.com/Baal-TehDriverman/ludicrous-speed · branch `master`, HEAD `9669397`

Legend: **[T]** tracked in git · **[U]** untracked local only

```
ludicrous-speed/
│
│ ═══ SHIP PROPER — tracked, tested, pushed ═══
│
├── topology/                    [T] Fleet org chart SSOT
│   └── fleet_graph.yaml             75-node Primordial Triad DAG, 4 roots
├── profiles/                    [T] 68 Star Trek crew distributions
│   ├── jean-luc-picard/ …           SOUL.md + config.yaml + skins + distribution.yaml
│   └── (68 total)                   all installed to ~/.hermes/profiles/
├── scripts/                     [T] Fleet tooling (all verified working)
│   ├── validate_topology.py         DAG/ref integrity + profile cross-ref
│   ├── fleet_status.py              node counts, directorates, install readiness
│   ├── topology_view.py             tree | json | dot renderer
│   ├── install_profile.py           manage.py wrapper (dry-run default)
│   ├── sync_research.py             research/ → kairos-dream engram store
│   └── build_demo_fleet.py          demo fleet builder
├── maintenance/                 [T] fleet-maint prune/rotate/status
│   ├── fleet_maint.py               inbox hygiene engine
│   └── test_fleet_maint.py          24/24 hermetic tests
│                                     (rescued from fleetgraph/, commit b2d6140)
├── dashboard/                   [T] FleetGraph FastAPI backend
│   └── plugin_api.py                ~990 lines: overview, inbox, send, match
├── desktop-plugin/              [T] FleetGraph desktop UI
│   └── plugin.js                    graph canvas, deck view, inspector (88 KB)
├── skill/                       [T] Installable Hermes skill of this whole repo
│   ├── SKILL.md                     the ship's instruction manual
│   ├── references/                  5 reference docs
│   └── scripts/                     wrapper scripts
├── plugins/
│   └── lilith-ecosystem-adapter/ [T] Lilith's memory plugin v1.0.0
│       ├── plugin.yaml              manifest
│       ├── __init__.py              12K-char ecosystem context injector
│       └── validate.py              fact-checker
│                                     (ENABLED in Hermes; tool-override declined)
├── devdashboard/
│   └── unified-dashboard-v2/    [T*] THE BRIDGE — AI Studio build, serving :3000
│       ├── server.ts                2.8K-line backend (fleet, arxiv, gemini,
│       │                            ollama fallback, gateway proxy)
│       ├── server-void.ts           POST /api/void/exec — capability-gated Void
│       │                            execution (no-net/ai-only/full profiles)
│       ├── server-testsupport.ts    real backends for BugTestingSuite assertions
│       ├── src/components/          28 React components incl. LudicrousSpeedFleet,
│       │                            LocalAgentsHub, ArxivBugfixStudio, BugTestingSuite
│       └── node_modules/            [ignored] regenerable via npm install
├── research/                    [T] Self-feeding symbiosis loop (5 crons write here)
│   ├── arxiv_digest.md              scout tick output (fresh every ~2h)
│   ├── synthesis.md                 kairos synthesis: edge-metadata theme + PR plan
│   ├── void_integration.md          14 arXiv papers → Void integration map
│   ├── ideas_architecture.md        architecture angle ideas
│   ├── ideas_ux.md                  UX/observability ideas
│   └── ideas_messaging.md           messaging protocol ideas
├── tests/                       [T] Integration suite (26/26 passing)
├── docs/                        [T] Screenshots
├── examples/                    [T] demo-fleet.json
├── assets/, source/             [T] catalog build inputs (tos/tng/ds9/voyager JSON)
├── release/                     [T] allowlist.txt
│
│ ═══ ROOT MODULES — tracked core engines ═══
│
├── fleet_graph_core.py          [T] Topology SSOT: load/save/chain/can_communicate
├── fleet_msg.py                 [T] Inter-bot messaging CLI (JSONL inboxes)
├── manage.py                    [T] Profile installer/validator
├── install.sh / install.ps1     [T] ⚠ install.sh points at OLD repo — use manage.py
├── catalog.json                 [T] 69 entries: 68 personas + the-void-runtime
├── ROSTER.md / README.md        [T] Docs (README current as of tonight)
├── plugin.yaml / __init__.py    [T] Plugin manifest + package init
├── LICENSE                      [T] MIT
└── .gitignore                   [T] node_modules/dist/.env exclusions

│ ═══ PARKED FREIGHT — untracked, awaiting verdict ═══
│
├── Void/                        [U] 108M — Lilith's pre-baked JS runtime
│   ├── bin/void.js                   entry: run|console|eval|snapshot
│   ├── node_modules/                 375 pkgs: AI SDKs, React, express, TS
│   └── squashfs-root/                empty Electron-era remnant
│                                     STATUS: registered in catalog.json, indexed
│                                     by Spock ("the-void"), live via /api/void/exec
├── Void_build/                  [U] 108M — build artifacts for above
├── fleetgraph/                  [U] 2.2M — DUPLICATE of root dashboard/core files.
│                                     SAFE TO DELETE: maintenance/ + sync_research
│                                     already rescued (b2d6140, 77b74db era)
├── hermes-star-trek-profiles/   [U] 7.4M — DUPLICATE of profiles/+manage.py. Safe.
├── hermes-agent-self-evolution/ [U] 632K — DSPy/GEPA self-evolution prototype.
│                                     Known broken checkout; own session required
├── devdashboard/.git            [U] stale gitlink remnant from old repo nesting
├── commands/, ops/,             [U] empty directories
└── Hermes Evolution Skill/      [U] near-empty stub
```

## Live Systems Beyond the Repo Walls

| System | Where | State |
|---|---|---|
| Dashboard bridge | systemd `lilith-unified-dashboard.service` → :3000 | active, v2.0.0 |
| Void exec service | same process, `/api/void/exec` | live-fire verified |
| Spock's memory | codebase-memory MCP, scopes: ship + the-void | 9.3K+ nodes indexed |
| Ecosystem adapter | `~/.hermes/plugins/` → every new session | enabled |
| Research crons ×5 | write into `research/` every 2–4h | 22/26 jobs ok |
| Dream engine | kairos-dream skill + engram store synced from research/ | cycling |

## Deletion-Safe Shortlist (when you want the space back)

1. `fleetgraph/` (2.2M) — fully superseded
2. `hermes-star-trek-profiles/` (7.4M) — fully superseded
3. `Void/squashfs-root/` — empty remnant
4. `commands/ ops/ "Hermes Evolution Skill"/` — empty/stub dirs
5. `Void_build/` (108M) — rebuildable artifacts, confirm first

**Do NOT delete:** `Void/` proper (now a registered, integrated fleet asset), anything tracked.
