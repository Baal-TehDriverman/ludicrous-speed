# Repo Structure Reference

> Full directory tree with file counts and sizes for `/home/tehlappy/🜏 Lilith/ludicrous-speed/`

## Top-Level Layout

```
ludicrous-speed/                    (760 MB, ~50,000 files)
├── topology/                       # Fleet org chart
│   └── fleet_graph.yaml            # 68-node DAG, 10.7 KB
├── profiles/                       # 68 Star Trek Hermes profile distributions
│   ├── jean-luc-picard/            # SOUL.md, config.yaml, skins/, distribution.yaml
│   ├── data/
│   ├── spock/
│   └── ... (64 more)
├── dashboard/                      # FleetGraph FastAPI backend
│   ├── plugin_api.py               # 988 lines, REST endpoints
│   └── manifest.json
├── desktop-plugin/                 # FleetGraph React/JS desktop UI
│   └── plugin.js                   # Graph canvas, deck view, inspector
├── maintenance/                    # Fleet maintenance tooling
│   ├── fleet_maint.py              # prune, rotate, status
│   ├── test_fleet_maint.py         # 24/24 hermetic tests
│   └── README.md
├── research/                       # ArXiv synthesis + FleetGraph research
│   ├── arxiv_synthesis.md          # 12 papers → fleet implementation
│   ├── synthesis.md                # FleetGraph codebase synthesis (10 KB)
│   ├── ideas_architecture.md       # Architecture ideas from papers
│   ├── ideas_ux.md                 # UX/observability ideas
│   ├── ideas_messaging.md          # Messaging protocol ideas
│   ├── pr_reply_draft.md           # PR #1 reply draft (5.2 KB)
│   ├── final_pr_landscape.md       # PR landscape analysis
│   ├── arxiv_scout_2026-08-24.md   # ArXiv scout results
│   └── arxiv_digest.md             # ArXiv digest
├── scripts/                        # Build/demo scripts
│   └── build_demo_fleet.py
├── tests/                          # Integration + backend test suite
│   ├── public_integration_test.py  # Hermetic end-to-end suite
│   ├── backend_loop8_test.py       # 14/14 backend tests
│   ├── configurability_test.py     # 22/22 configurability tests
│   ├── a1_audit.py                 # Static audit
│   └── ... (render harnesses)
├── docs/                           # Documentation images
│   ├── fleet-command-deck-light.png
│   └── fleet-command-graph-dark.png
├── examples/                       # Example configs
│   └── demo-fleet.json
├── release/                        # Release artifacts
│   └── allowlist.txt
├── manage.py                       # Profile installer/validator (227 lines)
├── install.sh                      # One-line Linux/macOS installer
├── install.ps1                     # One-line Windows installer
├── ROSTER.md                       # Human-readable profile catalog (13 KB)
├── catalog.json                    # Machine-readable profile catalog (300 KB)
├── fleet_graph_core.py             # FleetGraph topology SSOT (14.8 KB)
├── fleet_msg.py                    # Inter-bot messaging CLI (5.6 KB)
├── plugin.yaml                     # Hermes plugin manifest
├── __init__.py                     # Python package init (7.2 KB)
├── LICENSE                         # MIT
└── README.md                       # Complete documentation (8.5 KB)
```

## Untracked Directories (after move)

These exist inside the repo but are NOT tracked in git:

```
├── fleetgraph/                     # Duplicate FleetGraph repo clone
├── hermes-star-trek-profiles/      # Duplicate Star Trek Profiles repo clone
├── devdashboard/                   # Dev intel + unified dashboard
├── hermes-agent-self-evolution/    # Self-evolution engine
├── Void/                           # Void application
├── Void_build/                     # Void build artifacts
├── Hermes Evolution Skill/         # Empty directory
├── commands/                       # Empty directory
└── ops/                            # Empty directory
```

## Profile Catalog

68 profiles across 4 series + red team:

| Series | Count | Examples |
|--------|-------|----------|
| TOS | ~8 | Pike, Spock, McCoy, Sulu, Chekov, Chapel, Scotty, Uhura |
| TNG | ~12 | Picard, Riker, Data, Worf, La Forge, Crusher, Troi, Barclay, Wesley, Hugh, Lore, Guinan |
| DS9 | ~20 | Sisko, Kira, Odo, Dax, Bashir, Garak, Dukat, Weyoun, Martok, Nog, Rom, Quark, etc. |
| Voyager | ~18 | Janeway, Chakotay, Tuvok, Paris, Kim, Torres, Neelix, Kes, The Doctor, Seven of Nine, etc. |
| Red Team | ~10 | Lore, Garak, Seska, Khan, Dukat, Ransom, Kai Winn, etc. |

## File Counts by Type

| Type | Count |
|------|-------|
| Python files | ~50 |
| JavaScript files | ~10 |
| YAML files | ~70 |
| Markdown files | ~30 |
| JSON files | ~70 |
| Shell scripts | ~5 |
| Other | ~49,000+ (mostly node_modules, .git, __pycache__) |

## Size Breakdown

| Directory | Size |
|-----------|------|
| profiles/ | ~5 MB |
| dashboard/ | ~40 KB |
| desktop-plugin/ | ~100 KB |
| research/ | ~60 KB |
| tests/ | ~200 KB |
| fleetgraph/ | ~2 MB |
| hermes-star-trek-profiles/ | ~2 MB |
| hermes-agent-self-evolution/ | ~5 MB |
| Void/ | ~300 MB |
| Void_build/ | ~200 MB |
| node_modules/ | ~250 MB |
| .git/ | ~50 MB |
| Other | ~15 MB |
