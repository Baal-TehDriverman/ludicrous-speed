# FleetGraph Next — One Folder Worth of Work

> Concrete, independently-scopeable PRs that extend FleetGraph's existing structure.
> Each doc is a self-contained design sketch: what changes, why, and the arxiv paper that motivates it.

## PR Order (by leverage)

| # | PR | arXiv motivator | Scope | Risk |
|---|---|---|---|---|
| 1 | Calibrated supervisor edges | Consilience (2608.20564) | `fleet_graph_core.py` + `plugin_api.py` + `fleet_msg.py` | Low — additive frame types on existing supervisor edges |
| 2 | Trace-derived FSM overlays | Automata from Agent Traces (2608.23670) | New `fleet_graph_monitor.py` | Low — reads existing inbox + session data, no transport change |
| 3 | Dynamic dispatch with progress deltas | ProgRouter (2608.25992) | `fleet_graph_core.py` (additive) + `plugin_api.py` | Low — optional per-node fields, structural gate unchanged |
| 4 | Per-node harness manifests | JIT-Agent (2608.25593) | Optional graph node field | Low — optional, backwards-compatible |
| 5 | Typed message contracts + sequence numbers | Test-Time Collaborative (2608.24787) | `fleet_msg.py` + `plugin_api.py` + inbox format | Medium — inbox format change (additive fields) |
| 6 | Edge metadata (cost/bandwidth/reliability) | ProgRouter + Dual-Cache (2608.20617) | `fleet_graph_core.py` (additive) | Low — optional, `can_communicate` ignores it |
| 7 | Configuration maturity score | Committed Config (2608.25241) | `plugin_api.py` (new endpoint) | Low — read-only scoring |
| 8 | Topology versioning + migration | (structural hygiene) | `fleet_graph_core.py` (additive) | Low — optional `_meta.version`, migration hook |
| 9 | Graph export (DOT/GraphML) | (tooling) | `fleet_graph_core.py` (new functions) | Low — pure functions, no state |
| 10 | Reconcile `plugin_api.py` location | (layout fix) | File move / symlink / manifest update | Low — but blocks anyone following README install instructions |

## How to read these

Each doc in this folder is a standalone design sketch. Read them in PR order — later PRs build on earlier ones (e.g. harness manifests (PR 4) feed the ProgRouter reweighting (PR 3), which uses edge metadata (PR 6)).

## What's NOT in this folder

- Foundational fixes — the core is solid; these are extensions.
- Re-architecture — nothing here changes the transport, the topology model, or the single-source-of-truth discipline.
- Research synthesis — that's `synthesis.md` (this tick's read) and `arxiv_synthesis.md` (the 12-paper map).

## Status

Sketches only. No code written yet. Each doc describes a PR-scoped change that could be implemented independently.
