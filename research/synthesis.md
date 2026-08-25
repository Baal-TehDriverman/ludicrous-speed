# FleetGraph Synthesis — 2026-08-24 Tick

*Kairos-dream cycle: read codebase SSOT modules + arxiv digest → crystallize → backward pass.*

---

## 1. Current State of the Codebase

**Implemented and solid:**
- **`fleet_graph_core.py` (SSOT, v0.6.1)** — the strongest module in the repo. Full topology contract: single-supervisor validation with contradiction capture *before* mutation, cycle detection over the effective (derived) supervisor relation (catches subordinate-only cycles and mixed contradictory cycles), symmetric peer relations stored once under `_meta.relations`, legacy per-node `peers:` migration path read-only. Atomic saves via unique sibling temp files + `os.replace`, with Windows NTFS rename-retry backoff. Profile-alias indirection (`_meta.profile_aliases`) cleanly separates graph node names from real Hermes profile names.
- **`fleet_msg.py`** — the sanctioned inter-bot channel. Edge validated against the graph before delivery; JSON refusal contract on corrupt/cyclic topology (exit 2, never a traceback). Inbox-first transport (durable JSONL), live agent-turn delivery opt-in (`--deliver`) since it blocks for minutes. Malformed inbox lines skipped, not fatal.
- **`dashboard/plugin_api.py`** — thin FastAPI wrapper over the same core module (UI/CLI/bots cannot drift). Adds unread watermarks (file-based `.read/`) and `/sessions/tail` activity snapshots without a DB schema. Path-safety gate on profile names blocks traversal.
- **Repo convergence** — FleetGraph + Star Trek Profiles merged; fleet tooling (validator/status/topology viewer/installer), maintenance suite (24/24 tests), Void runtime wired as fleet exec service (:3000), unified dashboard-v2, ecosystem-adapter plugin enabled.

**Deferred / known gaps:**
- `scripts/validate_topology.py` still warns against the intentional 4-root Primordial Triad (informational only).
- No task/assignment lifecycle beyond free-form `--task ID` strings in messages.
- Live delivery is blocking and serial — no queue.

## 2. Strengths

1. **True SSOT discipline** — three surfaces (CLI, API, bots) import one module. This is rare and worth protecting: no PR should ever duplicate topology logic.
2. **Failure-mode thoughtfulness** — corrupt YAML, cyclic graphs, malformed inbox lines, concurrent saves, path traversal all have explicit contracts. The code degrades; it doesn't crash.
3. **Policy as structure** — `can_communicate()` makes chain-of-command an enforced invariant rather than a convention; blocked lateral sends name the correct route upward.
4. **Local-first** — file-based state (YAML + JSONL + watermark dir), zero cloud dependency, fastembed semantic routing at no API cost.
5. **Behavior-over-cosplay design principles** — personas modeled with bounded blind spots; user agency preserved.

## 3. Gaps & Opportunities

- **No message acknowledgment semantics** — inbox has mark-read, but senders get no receipt; escalation types aren't tracked to resolution.
- **Task identity is untyped** — `--task ID` is a bare string with no registry, so "assign → done" can't be queried.
- **No audit ledger** — sends append to recipient inboxes only; there's no fleet-wide traffic log beyond `/traffic`'s recent window.
- **Topology changes are unversioned** — `save_graph()` atomically replaces but keeps no history; a bad PUT can't be reverted except via git (and `~/.hermes/fleet_graph.yaml` isn't necessarily in git).
- **Simulation endpoint exists** (`POST /simulate`) but there's no batch what-if mode ("what breaks if I detach this subtree?").
- **Resource-awareness absent** — nothing tracks model size / context budget per node despite heterogeneous profiles.

## 4. ArXiv Insights vs FleetGraph Design

| Paper | Maps to | Takeaway |
|---|---|---|
| **Consilience** (2608.20564) — conformally calibrated comms | Inbox noise / when subordinates broadcast | Add statistical calibration to *when* a subordinate sends `update` vs stays silent — directly reduces DAG chatter while preserving hidden-profile reasoning quality. |
| **FL-MAESTRO** (2608.20518) — resource-constrained orchestration | Model/context budgets per node | The gap above: annotate nodes with model class + cost tier; scheduler/routing respects them. |
| **GxP-Agent** (2608.16890) — Process-DAG reliability | Topology as execution constraint | Extends FleetGraph's comm policy into *task* ordering: dependencies between tasks along graph edges, giving correctness guarantees, not just comm guarantees. |
| **MoRSE** (2608.09251) — role-subtask expert mixtures | Node granularity | Each DAG node could decompose into subtask specialists — matches the existing skill/toolset metadata already carried by profiles. |
| **Fluid Structure, Rigid Record** (2608.08516) — layered org design | The audit-ledger gap | Exactly the two-layer split FleetGraph needs: fluid routing layer (current YAML) + immutable append-only record layer of decisions/sends. |

Cross-cutting: the digest's five papers all converge on *structure-with-accountability* — FleetGraph already has the structure half (enforced edges); the record half is the missing twin.

## 5. Actionable Update Ideas (one folder of work)

**Proposed PR folder: `fleet_ledger/`** — implements the Fluid/Rigid Record split plus typed tasks:

1. **`ledger.py`** — append-only JSONL traffic log (`~/.hermes/fleet-ledger/ledger.jsonl`). Hook into `cmd_send()` after edge validation: every send gets `{ts, from, to, type, task, edge}`. Recipient inboxes stay drainable; the ledger is permanent.
2. **Typed tasks** — minimal task registry: `fleet-msg task new|done|list --id T-xxx`; messages referencing a task validate it exists. Gives `/traffic` and dashboards queryable state instead of bare strings.
3. **Send receipts** — sender's own inbox gets a mirrored `sent:` record so escalations are traceable end-to-end.
4. **Graph history** — `save_graph()` writes a timestamped snapshot to `fleet-graph-history/` (cap N=20); one-flag restore. Cheap undo without dragging `~/.hermes` under git.
5. **Node resource annotations** (stretch, informed by FL-MAESTRO): optional `resources: {model_class, context_tier}` on nodes, surfaced in `/roster` and `/match` ranking.

Scope check: items 1–3 touch only `fleet_msg.py` (+1 new module); item 4 touches `save_graph()`; item 5 is additive metadata. All preserve the SSOT rule — logic lives in core or the new module, both surfaces import it.

---

*Cycle complete. Next tick should verify whether `fleet_ledger/` work has landed and re-scope.*
