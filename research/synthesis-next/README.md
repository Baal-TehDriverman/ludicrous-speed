# Synthesis Next — FleetGraph Action Index

**Synthesized:** 2026-09-14 EDT
**Source:** `research/synthesis.md` (this tick's kairos-dream cycle)
**Priority order:** A → B → (C–L independent overlays)

---

## Priority ordering

1. **A — `research/synthesis-next/`** (this folder) — the index. Everything else needs a home.
2. **B — `harness/`** — versioned node harness manifests. Everything else depends on harness version resolution + outcome records.
3. **C–L** — independent overlays that layer on top of B. Any of them can be picked up next depending on what the operator wants.

---

## Folder index

| Folder | Gap addressed | Arxiv import | Dependencies | PR shape |
|--------|--------------|--------------|--------------|----------|
| `harness/` | Gap 1 — no execution harness per node | JIT-Agent (2608.25593) | None | New `harness/` dir + `tests/test_harness.py` |
| `routing/` | Gap 2 — no progress/budget-aware routing | ProgRouter (2608.25992) | `harness/` outcomes (optional) | New `routing/` dir + `tests/test_routing.py` |
| `comms/` | Gap 3 — no calibrated communication control | Consilience (2608.20564) | None (additive) | New `comms/` dir + new message types in `fleet_msg.py` + `plugin_api.py` |
| `monitor/` | Gap 4 — no predictive monitoring overlay | Automata from Agent Traces (2608.23670) | `harness/` outcomes + inbox JSONL + session snapshots | New `monitor/` dir + `tests/test_monitor.py` |
| `safety/` | Gap 5 — no safety-skill injection | SkillShield (2608.25817) + StepGuard (2608.24777) | `harness/` manifests + outcomes + inbox | New `safety/` dir + `tests/test_safety.py` |
| `latent/` | Gap 6 — no latent-cache edge transport | Dual-Cache (2608.20617) | profile model/provider awareness (already in `plugin_api`) | New `latent/` dir + `tests/test_latent.py` |
| `config-maturity/` | Gap 7 — no config-maturity score in UI | A Few Pages of Markdown (2608.25241) | `fleet_graph_core` + `plugin_api` profile discovery | New `config-maturity/` dir + add to `/overview` + `/graph/summary` |
| `spock-ingest/` | Gap 8 — Spock `ingest_traces` is a stub | (internal) | existing `scripts/export_memory_jsonl.py` + `scripts/spock_memory.py` | Wire the stub + `tests/test_spock_ingest.py` |
| `synthesis-loop/` | Gap 9 — no FleetGraph state → bidirectional memory backward pass | (kairos-dream internal) | `concurrent-bidirectional-memory` + `plugin_api` reads | New `synthesis-loop/` dir + cron/idle-triggered cycle |
| `session-tail-robust/` | Gap 11 — fragile content extraction | (internal) | None (pure function) | New extractor + patch to `plugin_api._text_of` + parametrized tests |
| `bulk-graph/` | Gap 14 — no bulk graph ops | (internal) | `fleet_graph_core` load/save/relations | New `bulk-graph/` dir + `fleet-graph-snapshot` CLI + `tests/test_bulk_graph.py` |

---

## What each gap is

### Gap 1 — No execution harness per node
The graph defines who-can-talk-to-whom, not what each node executes. No versioned harness manifest (planning, action, memory, tool-orchestration modules), no supervisor selection/repair before dispatch, no outcome measurement for later selection.

### Gap 2 — No progress-aware or budget-aware routing
`can_communicate` and `can_delegate_to` are purely structural. No per-node progress deltas, no remaining-budget fields, no quality/cost/time signals that reweight eligible downstream agents after each completed step.

### Gap 3 — No calibrated communication control on supervisor edges
Supervisor edges have no actions (`challenge`, `clarify`, `seek_evidence`, `route`) gated by calibrated acceptance thresholds. No uncertainty/disagreement/evidence-gain/redundancy signal.

### Gap 4 — No predictive monitoring overlay
No FSM compilation from event logs. The topology is visual but not predictive — can't label high-risk states or escalate on failure-prone transitions.

### Gap 5 — No safety-skill injection pipeline
No role-specific safety clauses derived from failure traces, no fixed-budget bundles injected into node harnesses, no guard nodes on privileged-action edges.

### Gap 6 — No latent-cache edge transport
All communication is text/JSON serialization. No negotiated `latent-cache` transport (joint KV-cache transfer) for heterogeneous model fleets. Text fallback needed because translators are model-pair dependent.

### Gap 7 — No configuration-maturity scoring
Graph contracts exist but no scored exposure in the UI. No indicator of how contract-complete the fleet is.

### Gap 8 — Spock `ingest_traces` is a stub
Live bidirectional-memory rows export to JSONL but don't become individual graph nodes. Only the engine code structure is graphed.

### Gap 9 — No FleetGraph state → bidirectional memory backward pass
FleetGraph's own state (inbox pressure, session status, communication patterns) is not yet episodic state in the bidirectional memory, retrievable by a RECALL trigger.

### Gap 11 — Session tail extraction is fragile
`session_messages` content extraction handles several shapes but is a nested if-else chain with hard-coded 240-char truncation. Could miss payload shapes (list-of-strings, `parts` key, base64 blob).

### Gap 14 — No bulk operations on the graph
No bulk import/export of graph state, no diff between two graph versions, no revert to a prior topology.

---

## What's not a gap (don't re-solving)

- **Graph validation** — `normalize()` is thorough. Don't touch.
- **Atomic save** — `save_graph()` with unique temp + Windows retry + `os.fsync` is production-grade.
- **Inbox transport** — JSONL + watermark unread counts is clean. Don't replace.
- **Semantic routing** — local fastembed + mxbai-embed-large-v1 is zero-cost and works. Don't re-implement.
- **Capability roster** — profile-agnostic derivation from existing profile files is the right design. Don't hardcode.
- **Live activity without N sockets** — `_latest_session()` with tip resolution + freshness-aware reclassification is good. Don't add live sockets.
- **Message frames** — `talk`/`delegate`/`supervisor` as the only frames is the right constraint. Don't add frames without a FLEET-TALK prompt section that knows them.

---

## Next move

Start with `harness/` (gap 1). It's the foundation everything else layers on. The folder shape is in `research/synthesis.md` section 5B. Implement the data layer first (manifest + registry + outcome + selection), then expose in `/roster` + `/overview`, then add `harness_version` to delegate contracts.

*One folder at a time.*
