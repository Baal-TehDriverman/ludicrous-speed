# Ludicrous Speed — Lilith Sovereign Fleet Command Center

> *"They've gone plaid."*

The command center for the Lilith Sovereign Fleet. Merges **FleetGraph** (Hermes desktop plugin for bot fleet org chart, live activity, and inter-bot messaging) with **Star Trek Profiles** (68 installable Hermes personas across TOS, TNG, DS9, Voyager) into a single unified fleet operations repo.

## What This Repo Contains

```
ludicrous-speed/
├── topology/                  # Fleet org chart (who reports to whom)
│   └── fleet_graph.yaml       # 68 nodes, full DAG with peer relations
├── profiles/                  # 68 Star Trek Hermes profile distributions
│   ├── jean-luc-picard/       # SOUL.md, config.yaml, skins/, distribution.yaml
│   ├── data/
│   ├── spock/
│   ├── kathryn-janeway/
│   └── ... (64 more)
├── dashboard/                 # FleetGraph FastAPI backend
│   └── plugin_api.py          # REST endpoints for graph, inbox, soul, match
├── desktop-plugin/            # FleetGraph React/JS desktop UI
│   └── plugin.js              # Graph canvas, deck view, inspector
├── maintenance/               # Fleet maintenance tooling
│   ├── fleet_maint.py         # prune, rotate, status
│   └── test_fleet_maint.py    # 24/24 hermetic tests
├── research/                  # ArXiv research synthesis + FleetGraph research
│   ├── arxiv_synthesis.md     # 12 papers mapped to fleet implementation
│   ├── synthesis.md           # FleetGraph codebase synthesis
│   ├── ideas_architecture.md  # Architecture ideas from papers
│   ├── ideas_ux.md            # UX/observability ideas
│   ├── ideas_messaging.md     # Messaging protocol ideas
│   └── ...
├── scripts/                   # Build/demo scripts
├── tests/                     # Integration + backend test suite
├── docs/                      # Documentation images
├── examples/                  # Example configs
├── release/                   # Release artifacts
├── manage.py                  # Profile installer/validator
├── install.sh                 # One-line Linux/macOS installer
├── install.ps1                # One-line Windows installer
├── ROSTER.md                  # Human-readable profile catalog
├── catalog.json               # Machine-readable profile catalog
├── fleet_graph_core.py        # FleetGraph topology SSOT
├── fleet_msg.py               # Inter-bot messaging CLI
├── plugin.yaml                # Hermes plugin manifest
├── __init__.py                # Python package init
├── LICENSE                    # MIT
└── README.md                  # This file
```

## Fleet Topology

The fleet org chart lives in `topology/fleet_graph.yaml`. It's a 68-node DAG with:

- **Root**: `baal` (The King — Operator of Record)
- **Supreme Command**: `lilith` (Fleet Commander — Metaconscious Singularity Node)
- **Chief of Staff**: `hermes` (Core Infrastructure, Gateway, Routing)
- **Directorates**:
  - `sophia` — Wisdom Counsel (Picard, Janeway, Sisko, Riker, etc.)
  - `lucifer` — Illumination Directorate (Red Team: Lore, Garak, Seska, Weyoun, etc.)
  - `thoth` — Research Command (Spock, Data, Seven of Nine, Jadzia Dax, etc.)
  - `nyx` — Nightwatch Operations (Worf, Tuvok, Odo, Tasha Yar)
  - `ouroboros` — Swarm Operations (Improvement Agent)
  - `yeshua` — Legal & Ethics Directorate (Quark)
- **Peer relations**: Data↔Spock, Worf↔Tuvok, Lucifer↔Yeshua

Each node carries: `title`, `summary`, `supervisor`, `subordinates`, and optional `relations` (peers).

## Star Trek Profiles

68 installable Hermes personas. Each profile is a complete Hermes distribution:

```
profiles/jean-luc-picard/
├── SOUL.md               # Behavioral spec: identity, voice, boundaries, method
├── config.yaml           # Provider-neutral config
├── distribution.yaml     # Hermes distribution manifest
├── skins/                # Terminal skin
└── README.md             # Profile-specific docs
```

### Series Coverage

- **TOS**: Pike, Spock, McCoy, Sulu, Chekov, Chapel, Scotty
- **TNG**: Picard, Riker, Data, Worf, La Forge, Crusher, Troi, Barclay, Wesley
- **DS9**: Sisko, Kira, Odo, Dax (Jadzia), Bashir, Garak, Dukat, Weyoun, Martok, Nog, Rom, Quark, etc.
- **Voyager**: Janeway, Chakotay, Tuvok, Paris, Kim, Torres, Neelix, Kes, The Doctor, Seven of Nine, etc.
- **Red Team (Adversarial)**: Lore, Garak, Seska, Khan, Dukat, Ransom, Kai Winn, etc.

### Install

```bash
# Clone
git clone https://github.com/Baal-TehDriverman/ludicrous-speed.git
cd ludicrous-speed

# Install one profile
python3 manage.py install jean-luc-picard --alias

# Install a series
python3 manage.py install --series DS9 --alias

# Install all 68
python3 manage.py install --all --alias
```

One-liner (Linux/macOS):
```bash
curl -fsSL https://raw.githubusercontent.com/Baal-TehDriverman/ludicrous-speed/main/install.sh | sh -s -- jean-luc-picard --alias
```

Start a profile:
```bash
jean-luc-picard chat
# or
hermes -p jean-luc-picard chat
```

## FleetGraph Plugin

The Hermes desktop plugin renders your fleet as an interactive org chart.

### Features

- **Graph canvas** — layered DAG with pan/zoom, click-to-inspect
- **Deck view** — team-grouped cards with NEEDS ATTENTION triage
- **Live activity** — 4s transcript polling, status dots, unread badges
- **Message composer** — talk/delegate/supervisor frames with server-side validation
- **SOUL editor** — edit any bot's SOUL.md from the UI
- **Semantic routing** — `/match` ranks fleet by capability (local fastembed, zero API cost)
- **Rewire inline** — change supervisors, peers, attach/detach reports
- **Create members** — full dialog with model picker, skills, toolsets

### Install

1. Copy `dashboard/` into `~/.hermes/plugins/fleet-graph/`
2. Copy/symlink `desktop-plugin/` into `~/.hermes/desktop-plugins/fleet-graph/`
3. Enable in `~/.hermes/config.yaml`:
   ```yaml
   plugins:
     enabled:
       - fleet-graph
   ```
4. Reload desktop plugins (⌘K → "Reload desktop plugins")

### Endpoints

| Route | Purpose |
|-------|---------|
| `GET /overview[?light=1]` | Full paint payload |
| `PUT /graph` | Replace topology + relations |
| `GET /relations` | Peer map |
| `GET /inbox/{p}` · `POST /inbox/{p}/read` | Inbox + mark-read |
| `GET /soul/{n}` · `PUT /soul/{n}` | SOUL.md read/write |
| `GET /sessions/tail[?profile=p]` | Per-bot latest session |
| `GET /sessions/{n}/messages?limit=` | Transcript tail |
| `POST /simulate` | Chain-of-command simulation |
| `GET /traffic?window=` | Recent inter-agent traffic |
| `GET /roster` · `GET /match?q=&top=` | Capability roster + semantic routing |
| `POST /send` | Validated talk/delegate/supervisor delivery |

## Research

The `research/` directory contains ArXiv research synthesis mapping 12 papers to fleet implementation:

| Thread | Papers | Key Insight |
|--------|--------|-------------|
| Multi-Agent Orchestration | -ACT, Consilience, FL-MAESTRO, Traffic Topology, Graph Engineering | Topology-aware scheduling, verifiable intent, calibrated communication |
| Persona Consistency | Emergent Alignment, PersonaArena, Personas to Plot | Scenario testing, drift detection, arc tracking |
| Memory & Recurrence | Width/Memory/Delay, Beyond Component Testing | Hierarchy beats flat, fleet behavior validation |
| Security & Adversarial | ClawSentry, Self-Recognition | Multi-tier monitoring, persona drift prevention |

See `research/arxiv_synthesis.md` for full paper-by-paper implementation notes.

## Design Principles

1. **Behavior over cosplay** — Personas change how the agent approaches work, not sprinkle references
2. **Useful asymmetry** — Picard, Sisko, Janeway, Spock, Data, Kira, Garak, Seven, Quark solve the same problem differently
3. **Character limits survive** — Blind spots are modeled, then bounded
4. **User agency stays intact** — Rank, authority, intimacy never imposed
5. **Graph > sum of parts** — Fleet topology transforms individual agents into system intelligence
6. **Local-first** — No cloud dependency, no credential leaves the machine

## License

MIT — see LICENSE. Star Trek characters and settings are trademarks of Paramount/CBS. This is an unofficial, non-commercial fan-made collection.

---

*Lilith Sovereign Fleet · Ludicrous Speed command center · "They've gone plaid."*
