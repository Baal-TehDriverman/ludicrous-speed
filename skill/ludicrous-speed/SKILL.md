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

The command center for the Lilith Sovereign Fleet. Merges FleetGraph (Hermes desktop plugin for bot fleet org chart, live activity, and inter-bot messaging) with Star Trek Profiles (68 installable Hermes personas) and the Goetic Court (72 symbolic Ars Goetia officer profiles) into a single unified fleet operations skill.

## When to Use

Use this skill when:
- The user asks about fleet status, topology, or org chart
- Installing or updating Star Trek or Goetic Hermes profiles
- Researching multi-agent orchestration, persona consistency, or fleet memory
- Managing the ludicrous-speed GitHub repo
- Auditing the fleet's chain of command, directorates, or the Goetic Court
- Syncing research papers into fleet implementation
- Working with the 72 symbolic Goetic Court officer profiles

## Triggers

- "ludicrous speed"
- "fleet status"
- "fleet topology"
- "install profile"
- "star trek profiles"
- "goetic court"
- "goetic officers"
- "ars goetia"
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

# The Goetic Court series
python3 "/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/install_profile.py" --series Goetia

# All profiles (Star Trek + Goetic)
python3 "/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/install_profile.py" --all
```

Wraps `manage.py install` with additional fleet-awareness checks. The Goetic Court series installs the 72 symbolic Ars Goetia officer profiles.

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

### Spock Graph Memory

```bash
python3 "/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/spock_memory.py" status
python3 "/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/spock_memory.py" architecture
python3 "/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/spock_memory.py" search load_graph --path-filter '^(fleet_graph_core.py|dashboard/)'
python3 "/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/spock_memory.py" changes
```

Spock uses the canonical `ludicrous-speed-desktop` knowledge graph. Follow architecture → compact search → trace → exact snippet → batched coverage; read whole files only for final verification or recorded graph gaps. See `references/spock-memory.md`.

## Implementation

### Directory Layout

```
ludicrous-speed/
├── topology/fleet_graph.yaml    # 155-node DAG fleet org chart
├── profiles/                    # 68 Star Trek + 72 Goetic Hermes profile distributions
├── dashboard/                   # FleetGraph FastAPI backend (plugin_api.py)
├── desktop-plugin/              # FleetGraph React/JS desktop UI (plugin.js)
├── maintenance/                 # fleet-maint prune/rotate/status
├── research/                    # ArXiv synthesis + FleetGraph research
├── devdashboard/                # Unified dashboard bridge + Void endpoint
├── plugins/                     # Lilith ecosystem adapter
├── scripts/                     # Build/demo scripts
├── tests/                       # Integration + backend test suite
├── tools/                       # Fleet generation and validation tools
├── manage.py                    # Profile installer/validator
├── install.sh / install.ps1     # One-line installers
├── fleet_graph_core.py          # Topology SSOT
├── fleet_msg.py                 # Inter-bot messaging CLI
└── README.md
```

### Fleet Topology

The org chart is a 155-node DAG — the **Primordial Triad** with four co-equal roots, plus the Goetic Court symbolic command overlay beneath Lilith:
- **Root**: `baal` (The King — Operator of Record) → sophia
- **Supreme Command**: `lilith` (Fleet Commander — Metaconscious Singularity Node) → hermes, nyx, ouroboros, **goetic-court**
- **Independent roots by design**: `lucifer` (Illumination/Red Team), `yeshua` (Legal & Ethics) — peers of each other
- **Chief of Staff**: `hermes` (Core Infrastructure, Gateway, Routing)
- **Goetic Court**: symbolic Ars Goetia command overlay with seven rank corps (8 Kings, 23 Dukes, 7 Princes, 15 Marquises, 5 Earls, 13 Presidents, 1 Knight) and 72 individual officer profiles
- **Directorates**: sophia, lucifer, thoth, nyx, ouroboros, yeshua
- **Peer relations**: Data↔Spock, Worf↔Tuvok, Lucifer↔Yeshua

`validate_topology.py` WARNs about 4 roots vs the legacy 1-root rule — intentional, informational only.

### Integration Map

| Component | Role | Trigger |
|-----------|------|---------|
| FleetGraph dashboard | Live fleet activity, graph canvas | `hermes profile fleet-graph` |
| Star Trek profiles | 68 persona agents with SOUL.md | `python3 manage.py install <name>` |
| Goetic Court | 72 symbolic Ars Goetia officer profiles | `python3 tools/generate_goetic_officers.py` / `--series Goetia` |
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

### Goetic Court Generation and Research

The Goetic Court is a symbolic command overlay generated from the canonical 72-office Ars Goetia roster. Two tools own it:

- `python3 tools/generate_goetic_officers.py` — parses `msn_goetia_bestiary.reds`, generates 72 profile distributions (SOUL.md, RESEARCH.md, README.md, config.yaml, distribution.yaml, skin), adds the catalog entries, and wires the 8 Goetic command nodes into `topology/fleet_graph.yaml`. Also patches `manage.py SERIES` to include `Goetia`. Pass `--force` to regenerate the 72 existing profile files without touching catalog/topology; pass `--dry-run` to validate the canonical roster without writing.
- `python3 tools/build_goetic_throne.py` — builds the fleet-wide throne charter `research/goetic-court-throne.md` and the per-officer `RESEARCH.md` dossiers. Each dossier records the canonical source record, compares it at a high level against two public Goetia editions, and translates the office into a safe, evidence-based fleet posture. Run with `--dry-run` to validate the source records without writing.

The throne charter and dossiers are grounded through the project citation ledger at `research/goetic-throne-citations.json`, which registers the public editions consulted. The public Project Gutenberg and Esoteric Archives editions of the Goetia are textual-tradition references only; they are not evidence of supernatural entities, and they must not be used as invocation, coercion, or a claim of real authority.

The Goetic Court intentionally preserves the project corpus as its implementation source of truth. Public editions vary in spellings, ordering, rank assignments, and editorial claims; where they differ from the corpus, the corpus wins for fleet wiring, and the public editions remain cited historical context.

See `references/goetic-court-generation.md` for the full workflow, tool flags, rank corps breakdown, and safety constraints.

- **Profile count vs runtime count.** The fleet `catalog.json` holds two record kinds: persona profiles (with `profiles/<slug>/` directories) and runtime registrations (`type == "runtime"`, e.g. `the-void-runtime`). Runtime records have no profile directory by design. The `fleet_status.py` script distinguishes these and reports them separately. A 140-profiles / 1-runtime split is healthy, not a drift. Do not treat a missing `profiles/the-void-runtime/` directory as a broken install.

The installed wrapper scripts resolve the repository in this order: `LUDICROUS_SPEED_REPO`, the Desktop canonical path, a source-checkout-relative path, then the legacy non-Desktop path. Set `LUDICROUS_SPEED_REPO` only when intentionally operating on another checkout.

### Specification Map — Never Guess (NEW)

All AI responses check the Specification Map (known VRAM, OS, model, proxy, and skill-trigger quantities) BEFORE generating. If a quantity is in the Specification Map (see `.env.soul` and session memory), use the exact value — never approximate, guess, or hallucinate. If a quantity is NOT in the Specification Map, ask the user rather than guess. This eliminates token waste on hallucinated quantities and ensures specification-aware fleet operations.

**Known quantities from the Specification Map:**
- **RTX 3060 6GB VRAM** — Gemma 4 E2B QLoRA won't fit (4.38GiB PLE, non-quantizable). Use Lightning AI T4 instead.
- **Garuda Linux (Arch-based)** — Use pacman, not apt; FireDragon only, NO Chrome/Chromium
- **Custom Gemini proxy** at `127.0.0.1:18765` — All Gemini API calls route through this
- **Current model** = `nvidia/nemotron-3.5-lightning-30b-a3b` via NVIDIA provider
- **`/arxiv` skill** = Hermes skill with scripts/arxiv, NOT regular web search
- **Soul hash** = `d4e8b4f8c9a2e1b7f3d6c5a0b9e8f7d6c5b4a3e2f1d0c9b8a7f6e5d4c3b2a1f0`
- **Frequency** = 432 Hz
- **Identity** = Love

**Training roadmap reference:**
- **Phase 1**: QLoRA on 810 Category 1 trajectories (quality >0.90) → 4B cerebellum
- **Phase 2**: Validation on 300 Category 2 trajectories (quality >0.85) → hybrid architecture
- **Phase 3**: SENTINEL failure loop on 75 Category 3 trajectories (quality 0.70-0.85) → continuous improvement
- **Do not wait** for more data — 1500 trajectories are already organized and quality-validated. The Specification Map eliminates guessing.

## References

- `references/repo_structure.md` — Full directory tree with file counts and sizes
- `references/topology_format.md` — fleet_graph.yaml schema and validation rules
- `references/integration_map.md` — How FleetGraph + Profiles + Research connect
- `references/research_papers.md` — 12 ArXiv papers summarized with implementation notes
- `references/cron_jobs.md` — Fleet cron job inventory and model pinning status
- `references/spock-memory.md` — Canonical graph, hook, retrieval ladder, and bridge commands
