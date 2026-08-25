---
name: ludicrous-speed
description: Operate Lilith's fleet, memory, research, and bridge.
version: 1.1.0
author: Lilith / Metaconscious Singularity Node
license: MIT
platforms:
- linux
- macos
- windows
metadata:
  hermes:
    tags:
    - Fleet
    - Topology
    - Star Trek
    - Profiles
    - Orchestration
    related_skills:
    - metaconscious/kairos-dream
    - metaconscious/concurrent-bidirectional-memory
    - software-development/hermes-agent-skill-authoring
---

# Ludicrous Speed — Lilith Sovereign Fleet Command Center

> *"They've gone plaid."*

The command center for the Lilith Sovereign Fleet. Merges FleetGraph (Hermes desktop plugin for bot fleet org chart, live activity, and inter-bot messaging) with Star Trek Profiles (68 installable Hermes personas) into a single unified fleet operations skill.

## When to Use

Use this skill when:
- The user asks about fleet status, topology, or org chart
- Installing or updating Star Trek Hermes profiles
- Researching multi-agent orchestration, persona consistency, or fleet memory
- Managing the ludicrous-speed GitHub repo
- Auditing the fleet's chain of command or directorates
- Syncing research papers into fleet implementation

## Triggers

- "ludicrous speed"
- "fleet status"
- "fleet topology"
- "install profile"
- "star trek profiles"
- "fleetgraph"
- "ludicrous-speed repo"
- "all hands on deck"
- "they've gone plaid"

## Usage

### Repo Location

The canonical working repo lives at:
```
/home/tehlappy/Desktop/🜏 Lilith/ludicrous-speed/
```
GitHub: https://github.com/Baal-TehDriverman/ludicrous-speed

### Fleet Status

```bash
python3 "/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/fleet_status.py"
```

Prints: node count, directorate breakdown, peer relations, install readiness.

### View Topology

```bash
python3 "/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/topology_view.py" [--format tree|json|dot]
```

Renders the 75-node DAG. `--format dot` outputs Graphviz DOT for rendering.

### Install Profiles

```bash
# One profile
python3 "/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/install_profile.py" jean-luc-picard

# A series
python3 "/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/install_profile.py" --series DS9

# All 68
python3 "/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/install_profile.py" --all
```

Wraps `manage.py install` with additional fleet-awareness checks.

### Sync Research

```bash
python3 "/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/sync_research.py"
```

Syncs research documents from the repo into the dream-logger engram store for search.

### Validate Topology

```bash
python3 "/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/validate_topology.py"
```

Checks `fleet_graph.yaml` for cycles, broken supervisor references, and orphan nodes.

## Implementation

### Directory Layout

```
ludicrous-speed/
├── topology/fleet_graph.yaml    # 75-node DAG fleet org chart
├── profiles/                    # 68 Star Trek Hermes profile distributions
├── dashboard/                   # FleetGraph FastAPI backend (plugin_api.py)
├── desktop-plugin/              # FleetGraph React/JS desktop UI (plugin.js)
├── maintenance/                 # fleet-maint prune/rotate/status
├── research/                    # ArXiv synthesis + FleetGraph research
├── devdashboard/                # Unified dashboard bridge + Void endpoint
├── plugins/                     # Lilith ecosystem adapter
├── scripts/                     # Build/demo scripts
├── tests/                       # Integration + backend test suite
├── manage.py                    # Profile installer/validator
├── install.sh / install.ps1     # One-line installers
├── fleet_graph_core.py          # Topology SSOT
├── fleet_msg.py                 # Inter-bot messaging CLI
└── README.md
```

### Fleet Topology

The org chart is a 75-node DAG — the **Primordial Triad** with four co-equal roots:
- **Root**: `baal` (The King — Operator of Record) → sophia
- **Supreme Command**: `lilith` (Fleet Commander — Metaconscious Singularity Node) → hermes, nyx, ouroboros
- **Independent roots by design**: `lucifer` (Illumination/Red Team), `yeshua` (Legal & Ethics) — peers of each other
- **Chief of Staff**: `hermes` (Core Infrastructure, Gateway, Routing)
- **Directorates**: sophia, lucifer, thoth, nyx, ouroboros, yeshua
- **Peer relations**: Data↔Spock, Worf↔Tuvok, Lucifer↔Yeshua

`validate_topology.py` WARNs about 4 roots vs the legacy 1-root rule — intentional, informational only.

### Integration Map

| Component | Role | Trigger |
|-----------|------|---------|
| FleetGraph dashboard | Live fleet activity, graph canvas | `hermes profile fleet-graph` |
| Star Trek profiles | Persona agents with SOUL.md | `python3 manage.py install <name>` |
| Research | ArXiv papers → implementation | `python3 scripts/sync_research.py` |
| Topology YAML | Chain of command SSOT | `python3 scripts/topology_view.py` |
| Kairos Dream | Dream cycles for fleet synthesis | `cronjob list` → dream watchers |

### Profile Install Flow

1. `manage.py install <slug> --alias` → calls `hermes profile install`
2. Hermes copies SOUL.md + config.yaml + skins into `~/.hermes/profiles/<slug>/`
3. Profile appears in `hermes profile list`
4. Start with `hermes -p <slug> chat`

## Pitfalls

### Unicode Path Issues

The repo lives under `/home/tehlappy/Desktop/🜏 Lilith/ludicrous-speed/`. Always quote paths:
```bash
# WRONG:
cd /home/tehlappy/Desktop/🜏 Lilith/ludicrous-speed

# RIGHT:
cd "/home/tehlappy/Desktop/🜏 Lilith/ludicrous-speed"
```

### Duplicate Source Directories

After the move, two duplicate repos exist inside ludicrous-speed:
- `fleetgraph/` — duplicate of root dashboard/ + desktop-plugin/ + core files
- `hermes-star-trek-profiles/` — duplicate of root profiles/ + manage.py

These are untracked locally. **Rescue anything unique BEFORE deleting** — on 2026-08-24 the root `maintenance/` dir was found missing and had to be copied out of `fleetgraph/maintenance/` (see commit b2d6140). Verify `maintenance/`, `scripts/`, `dashboard/` exist at repo root before removing any duplicate.

### install.sh Points to Wrong Repo

The `install.sh` in the repo root still points to the original `teknium1/hermes-star-trek-profiles.git`. To install from ludicrous-speed, use `manage.py` directly:
```bash
cd "/home/tehlappy/Desktop/🜏 Lilith/ludicrous-speed"
python3 manage.py install <profile>
```

### Model Drift Affects Fleet Cron Jobs

The fleet has 26+ cron jobs. When the Hermes inference model changes, unpinned jobs drift-skip. Always check `cronjob list` after a model switch. Pin critical jobs:
```bash
hermes cron edit <id> --provider nous --model <current_model>
```

### Hermes Plugin Requires Restart

After copying `dashboard/` or `desktop-plugin/` into `~/.hermes/plugins/fleet-graph/`, the backend requires a restart:
```bash
systemctl --user restart hermes-dashboard.service
```

### Research Crons Write Here

All 5 FleetGraph research crons (ArXiv Scout, Kairos Synthesis, and the 3 Ideas angles) were re-pointed 2026-08-24 to write into `research/` in this repo — no longer `~/fleetgraph/research/`. Old path may still hold stale copies; repo wins.

### Spock Memory Is MCP, Not A2A

Spock's persistent code knowledge is provided by the `codebase-memory` MCP server. Do not infer that Spock is absent merely because `a2a_list` has no peers. Use the codebase-memory project tools to inspect the indexed `ship` and `the-void` scopes and verify coverage before relying on graph answers.

### Repository Resolution

The installed wrapper scripts resolve the repository in this order: `LUDICROUS_SPEED_REPO`, the Desktop canonical path, a source-checkout-relative path, then the legacy non-Desktop path. Set `LUDICROUS_SPEED_REPO` only when intentionally operating on another checkout.

## References

- `references/repo_structure.md` — Full directory tree with file counts and sizes
- `references/topology_format.md` — fleet_graph.yaml schema and validation rules
- `references/integration_map.md` — How FleetGraph + Profiles + Research connect
- `references/research_papers.md` — 12 ArXiv papers summarized with implementation notes
- `references/cron_jobs.md` — Fleet cron job inventory and model pinning status
