# FleetGraph Synthesis — Tick 2026-08-29 (Second Cycle)

> Synthesis cycle: codebase + arxiv digest + fleet state → actionable synthesis. Overwrite each tick.

---

## 1. Current State of the Codebase

### What's implemented

**SSOT core (`fleet_graph_core.py`, 437 lines)**
- Full topology SSOT: reads/writes `~/.hermes/fleet_graph.yaml` with atomic saves (tempfile + os.replace with Windows retry backoff)
- Normalization: validates exactly-one-supervisor, derives subordinates from supervisors, drops contradictory edges, catches cycles (including subordinates-only cycles), prevents self-edges
- Communication policy: `can_communicate()` enforces up/down/peer-only routing; lateral sends blocked unless peer relation exists
- Delegation feasibility: `can_delegate_to()` checks subtree depth, subordinates exist, contract.max_depth — purely graph-based, no profile reads
- Routing: `chain()` walks supervisor chain; `describe()` serializes the full topology; `subtree_nodes()`/`subtree_depth()` for tree introspection
- Relations: symmetric peer map stored in `_meta.relations`, validated against graph (no supervisor/subordinate overlap, no self-peers)

**CLI messaging (`fleet_msg.py`, 164 lines)**
- `send` — validates edge, writes JSONL inbox, optional `--deliver` for live agent turn (blocking, opt-in)
- `inbox` — drains per-profile inbox with malformed-line tolerance
- `show` — prints topology as JSON
- JSON refusal contract everywhere: GraphError → `{"ok": false, "error": "..." }` never a raw traceback

**Dashboard API (`dashboard/plugin_api.py`, 1020 lines)**
- `GET /overview[?light=1]` — full paint payload: topology + display meta + inbox counts + unread watermarks + chain depth + unassigned profiles + per-bot latest session (or skip with light=1)
- `GET /graph` / `PUT /graph` — topology read/write with full validation
- `GET /relations` / `PUT /relations` — peer map read/write
- `GET /soul/{n}` / `PUT /soul/{n}` — SOUL.md read/write (default profile protected)
- `GET /inbox/{p}` / `DELETE /inbox/{p}` / `POST /inbox/{p}/read` — inbox + mark-read with watermark state (count_at_read + last_read_ts)
- `GET /sessions/tail` / `GET /sessions/{n}/messages` — per-bot activity snapshot + transcript tail from state.db
- `POST /simulate` — chain-of-command simulation (would this send be allowed? what's the chain?)
- `POST /delegate-check` — delegation feasibility preview (subtree depth, subtree nodes)
- `GET /roster` — capability summary per profile (derived from SOUL.md headline + mission + profile.yaml description + enabled toolsets)
- `GET /match?q=&top=` — semantic specialist routing via local fastembed (mixedbread-ai/mxbai-embed-large-v1), cosine similarity, cached + lazy-rebuild on file mtime changes
- `GET /traffic?window=` — recent inter-agent messages for edge glow
- `GET /avatar/{name}` — profile avatar as data URL from assets/
- `GET /graph/summary` — cheap header-strip payload: node count, edge count, status histogram

**Desktop plugin (`desktop-plugin/plugin.js`, ~88KB)**
- Confirmed present (88,580 bytes, dated 2026-08-24). The frontend is implemented and substantial.

**Plugin manifest (`plugin.yaml`)**
- fleet-graph v0.6.1, api: plugin_api.py

**Fleet topology (live `~/.hermes/fleet_graph.yaml`, 1009 lines)**
- 75+ nodes with the Primordial Triad structure (4 roots: baal, lilith, lucifer, yeshua)
- `_meta.relations` with peer links: Data↔Spock, Worf↔Tuvok, Lucifer↔Yeshua
- Per-node metadata: `title`, `summary`, `supervisor`, `subordinates` — but no `capabilities`, `capacity`, or `budget` fields yet

**Research foundation**
- `research/arxiv_synthesis.md` — 15 papers mapped to FleetGraph components + Star Trek integration (generated 2026-08-24)
- `research/arxiv_digest.md` — 9 active papers across 3 threads (last scouted 2026-08-27)
- `research/ideas_architecture.md` — 3 architecture ideas (delegation contracts, info-flow labels, budget guard) from 6 papers, tick 2026-08-29
- `research/ideas_ux.md` — 3 UX ideas (activity heatmap, incident timeline, per-bot cost audit), generated 2026-08-27
- `research/ideas_messaging.md` — 3 messaging protocol ideas (priority lanes + TTL, delivery receipts + retry, threaded conversations + broadcast), generated 2026-08-27

### What's deferred / absent

- **Arxiv digest staleness** — `arxiv_digest.md` last scouted 2026-08-27; no new IDs since. The scout hasn't run in this cycle.
- **No implemented research ideas** — All three idea files (architecture, UX, messaging) are pure ideation; none have been PR'd. They are concrete and PR-sized but still on paper.
- **No `msg_id` on messages** — `fleet_msg.py` inbox records lack a message identity field. This blocks delivery receipts, retry, threading, and broadcast ack tracking.
- **No SOUL.md version history** — `PUT /soul/{n}` overwrites with no audit trail, diff, or revert capability.
- **No priority/TTL on messages** — Every message has the same weight; `done` and `escalate` sit in the same FIFO.
- **No info-flow label layer** — `can_communicate` handles direction but not sensitivity; no SafeFlow-style taint edges.
- **No budget/capacity metadata on graph nodes** — The YAML has rich `title`/`summary` per node but no `capabilities: []` or `budget: {messages_per_day: N}` fields that the ideas files call for.
- **`/match` has no graceful fallback** — Returns 503 if fastembed/onnx is unavailable; no keyword-based fallback ranking.

---

## 2. Strengths — What FleetGraph Does Well

**Single source of truth, three surfaces, zero drift**
`fleet_graph_core.py` is imported by both `fleet_msg.py` and `plugin_api.py`. CLI, dashboard API, and bots share identical normalization, validation, and communication policy. This is the right architecture for topology-correctness as a safety property.

**Rigorous graph validation**
`normalize()` captures raw supervisor/subordinate input before mutation (cycle detection sees contradictory edges as written), derives subordinates from supervisors, drops contradictory entries, checks exactly-one-supervisor via the `owners` map, detects cycles through both explicit supervisor fields AND subordinates-only back-edges, and materializes implied supervisors. This is production-grade validation.

**Communication policy is clean and enforceable**
`can_communicate()` returns `(bool, reason)` — not just a boolean. The reason string is human-readable ("lateral send blocked: X and Y are not supervisor/subordinate or declared peers — route through Z"). The policy is simple (up/down/peer) but the enforcement is consistent across CLI and API.

**Inbox + watermark pattern is right**
JSONL append-only inboxes with per-profile `.read/{name}.json` watermarks (count_at_read + last_read_ts) give unread badges without a database. Mark-read supports absolute count, epoch-ms cutoff, or "everything current." This is lightweight and correct.

**Semantic routing is local-first**
`/match` uses fastembed with a local ONNX model — no API cost, no cloud dependency. Cache keyed on file mtime, so index rebuilds only when profiles change. Zero-cost capability routing.

**Simulation endpoints are additive and useful**
`/simulate` and `/delegate-check` are pure graph operations — no profile reads, no host coupling. They let the UI show feasibility before committing, with subtree_depth and subtree_nodes on success.

**Research integration is unusually deep**
The `research/` directory maps each paper to specific FleetGraph components and Star Trek integration points. The ideas files are structured as PR-sized work items with files-touched lists, not vague inspiration. The synthesis table (paper → component → persona) is a concrete implementation guide.

**Live topology has real operational metadata**
The fleet_graph.yaml (1009 lines) carries per-node `title` and `summary` fields — the graph isn't just edges, it's already a knowledge base. This is the right foundation for capability-aware routing.

---

## 3. Gaps and Opportunities

### Gaps (what's missing that the code clearly wants)

**Message identity is the linchpin missing from messaging**
`fleet_msg.py` writes inbox records without a `msg_id`. Ideas 2 and 3 in `ideas_messaging.md` both depend on this. Without it: no delivery receipts, no retry, no threading, no broadcast ack tracking. A deterministic SHA-256 (sender|to|ts|summary[:200]) truncated to 16 hex chars is backward-compatible and unlocks all messaging protocol improvements.

**SOUL.md edits have no audit trail**
`PUT /soul/{n}` overwrites the file. No diff, no previous-version storage, no "who changed what when." For personas-as-product, this is a real gap. A sidecar `.soul_history/{n}/{timestamp}.md` or a `_meta.soul_versions` map would close it.

**No capacity metadata on graph nodes**
The fleet_graph.yaml has `title` and `summary` per node but no `capabilities: []` or `budget:` fields. The architecture ideas file (Ideas 1, 3) and the Token Budgets paper both call for per-node resource modeling. Without it, delegation is purely structural and budget guards can't exist.

**The arxiv scout hasn't run this cycle**
`arxiv_digest.md` is stamped 2026-08-27. A fresh scout would either surface new papers or confirm the current 9 are still the best available. The field is moving fast — multi-agent orchestration papers are appearing daily.

**No fallback when semantic routing fails**
`/match` returns 503 if the embedding stack is unavailable. The existing `_capability_summary` keywords are already computed — a keyword-overlap fallback would let the endpoint degrade gracefully instead of going dark.

### Opportunities (what could be improved)

**The `_capability_summary` function is good but could ingest graph metadata**
Currently it reads SOUL.md + profile.yaml + config.yaml. If the graph YAML gained a `capabilities:` field per node (e.g., `data: {capabilities: [analysis, logic, starfleet]}`), capability summaries could merge operator-curated tags with derived ones. This would make `/match` both more accurate and more transparent.

**Watermark system could support per-message read tracking**
Currently count-based. A timestamp-based watermark exists but isn't used for "which specific messages are read." For incident timelines (`ideas_ux.md` Idea 2), per-message read state would let the timeline show "read at 01:54" on each escalation hop.

**Graph visualization could show capacity/feasibility state**
The desktop plugin.js (88KB) renders the graph canvas. Adding capacity heatmap overlays (budget remaining, delegation feasibility) would turn the visual topology into a planning tool, not just a status display. All the data is already available via `subtree_depth`, `subtree_nodes`, `can_delegate_to`.

**The topology YAML could carry policy metadata**
Adding `_meta.label_policy`, `_meta.budget_state`, `_meta.capabilities` maps to the existing `_meta` section would give the simulator and routing real data without changing the core graph model. All are additive — old files without them work unchanged.

---

## 4. Arxiv Insights — How the Research Relates to FleetGraph's Design

### Active digest (carried forward from 2026-08-27 scout)

The current digest carries 9 papers across 3 threads. The strongest near-term imports per the digest's own scout assessment:

**Consilience (2608.20564) — calibrated communication control**
Directly applicable to FleetGraph's directed supervisor edges. The paper's `challenge`/`clarify`/`seek_evidence`/`route` action set maps to existing frame types but adds *calibration* — the supervisor decides not just "can I send?" but "what kind of send is appropriate given uncertainty and disagreement?" FleetGraph's `can_communicate` handles the structural question; Consilience suggests adding a calibration layer on top.

**Automata from Agent Traces (2608.23670) — trace-derived FSM overlays**
FleetGraph already has `/traffic` (recent messages) and inbox JSONL files (full history). Compiling those into per-harness FSMs that predict next actions and flag failure-prone states would turn the visual topology into a predictive tool. This is the missing "what happens next?" layer.

**ProgRouter (2608.25992) — online progress-guided orchestration**
Step-wise routing from evolving progress, quality, time, and cost signals fits FleetGraph's delegation model. Currently `can_delegate_to` checks structural feasibility once at send time. ProgRouter suggests rewighting eligible downstream agents after every completed step — a dynamic version of what FleetGraph does statically.

### Architecture ideas-file papers (2026-08-29 tick)

The architecture ideas file surfaces 6 additional papers:

| Paper | Relevance to FleetGraph |
|-------|------------------------|
| **HiMA-MDD** (2608.21868) | Hierarchical specialist decomposition — validates the supervisor/subordinate chain design |
| **AGENTSERVESIM** (2606.09613) | Per-agent serving cost simulation before deployment — maps to per-node capacity modeling |
| **SPOQ** (2606.03115) | Specialist roles + work queue routing — maps to peer/supervisor routing plus a queue layer |
| **Delegated Fair Division** (2607.27743) | Formal delegation with fairness constraints — extends `can_delegate_to` beyond structural checks |
| **SafeFlow** (2607.25255) | Semantic info-flow labels + propagation rules — maps to `can_communicate` + a label layer |
| **Token Budgets** (2606.04056) | 63 budget-overrun incidents + affine-typed mitigation — maps to per-node capacity, prevents cascade failures |

The Token Budgets paper is the most urgent read — it catalogs real cascade failures from silent budget exhaustion, which is exactly the failure mode the budget guard (ideas_architecture.md Idea 3) prevents.

### The full research-to-implementation map (from arxiv_synthesis.md)

The 2026-08-24 synthesis file maps 15 papers to specific FleetGraph components. The most actionable unimplemented entries:

- **Memory Arbitration (2608.19701)** — provenance + `upstream_source_id` on engrams and fleet messages. FleetGraph messages have no provenance metadata.
- **MemFuse (2608.18704)** — atomic + fused causal memory layers. The inbox/jsonl system is atomic but not causally linked.
- **ACES (2608.20614)** — paired capability evaluation with Skill Lift scoring. FleetGraph has capability summaries but no evaluation framework.
- **Runtime Contract (2608.11274)** — formal Void policy with evidence envelopes. Relevant for code-executing nodes.

---

## 5. Actionable Update Ideas — One Folder Worth of Work

These are ordered by dependency and PR-readiness. Each is concrete and scoped.

### A. Message identity + delivery receipts (prerequisite for C)

**Files:** `fleet_msg.py`

**What:** Add deterministic `msg_id` (SHA-256 of `sender|to|ts|summary[:200]`, 16 hex) to every inbox record. On `--drain`, write sibling `.receipts.jsonl` with `msg_id + drained_at + by`. Add `fleet-msg status <msg_id>` that searches inbox + receipts.

**Why first:** The entire messaging protocol upgrade (receipts, retry, threading, broadcast acks) depends on message identity. Backward-compatible — old records without `msg_id` are "pre-era" and simply don't appear in status lookups.

**Size:** ~40 lines. One afternoon.

---

### B. Priority lanes + TTL expiry (independent)

**Files:** `fleet_msg.py`, `maintenance/fleet_maint.py`, `README.md`

**What:** `--priority` flag (low/normal/high/critical). Critical auto-triggers `--deliver`. TTL per type (done=24h, update=72h, question=7d, escalate/assign=never). Auto-prune expired in `cmd_inbox`. `fleet_maint prune-expired` for hard disk purge.

**Why:** Independent of A. Transforms inbox from append-only log to self-triaging queue. The NEEDS ATTENTION deck view already implies priority; this gives it a protocol-level foundation.

**Size:** ~60 lines. Half a day.

---

### C. Threaded conversations + team broadcast (depends on A)

**Files:** `fleet_msg.py`, `dashboard/plugin_api.py`

**What:** `--thread <id>`, `--reply-to <msg_id>`, `--broadcast` (fans to all direct subordinates). `fleet-msg thread <id>` aggregates cross-inbox. Ack tracking on broadcast via receipts from A.

**Why:** Depends on A's `msg_id`. Turns the fleet from fire-and-forget signals into actual conversations.

**Size:** ~80 lines. One day.

---

### D. Per-node capability + budget metadata in fleet_graph.yaml

**Files:** `fleet_graph_core.py` (new loaders), `fleet_graph.yaml` (new optional fields)

**What:** Extend the YAML schema with optional per-node `capabilities: [string]` and `budget: {messages_per_day: int, max_concurrent_turns: int}` fields. Add `load_node_capabilities()` and `load_budget_state()` helpers in `fleet_graph_core.py` that read from `_meta.capabilities` and `_meta.budget_state`. Wire capabilities into `_capability_summary` so `/match` can use operator-curated tags alongside derived ones.

**Why:** This is the data foundation that makes Ideas 1, 3, and E possible. Without it, capability-gated delegation and budget guards have no data source. Additive — old nodes without these fields work unchanged. The existing per-node `title` and `summary` fields prove the team already treats the graph as a knowledge base; this extends that pattern.

**Size:** ~50 lines in `fleet_graph_core.py`. Half a day.

---

### E. Budget-aware delegation guard (depends on D)

**Files:** `fleet_graph_core.py`, `dashboard/plugin_api.py`

**What:** Extend `can_delegate_to` with a `budget_guard` check that estimates whether a delegation would exceed a node's budget (from D's `budget_state`). Returns `(False, "budget exceeded: ...")` instead of allowing overflow. Wire through `/delegate-check` and `/simulate`. Add `fleet_maint reset_budgets` for scheduled counter resets.

**Why:** The Token Budgets paper (2606.04056) catalogs 63 real overrun incidents — this is the cheapest place to catch them. Delegation that cascades through a subtree can burn a leaf's budget in one afternoon; the guard catches it before the LLM call.

**Size:** ~40 lines in `fleet_graph_core.py`. Half a day.

---

### F. Information-flow labels (independent)

**Files:** `fleet_graph_core.py`, `fleet_msg.py`, `dashboard/plugin_api.py`

**What:** Add `can_transmit_label(graph, relations, sender, recipient, label)` layered on top of `can_communicate`. Labels: `soul` (up/down only), `admin` (down from root), `raw` (up only), `triage` (unrestricted). `--label` flag on send. Read policy from `_meta.label_policy`.

**Why:** SafeFlow (2607.25255) directly motivates this. A SOUL.md edit diff should route to supervisor for review, not forward peer-to-peer. Thin layer on existing policy — doesn't change the graph model.

**Size:** ~85 lines total. One day.

---

### Summary: recommended merge order

```
D (node metadata)      →  enables E
A (msg_id + receipts)  →  unlocks C
B (priority + TTL)     →  independent, can merge anytime
C (threads + broadcast)→  depends on A
E (budget guard)       →  depends on D
F (info-flow labels)   →  independent
```

- **A + B + D** can all merge in parallel (no shared-file conflicts beyond the record shape, which A extends and B reads from).
- **C** waits for A.
- **E** waits for D.
- **F** is fully independent.
- The highest-leverage single PR is **D** — it unblocks both capability-gated delegation and budget guards, and it adds the metadata layer that makes the graph a richer planning substrate.

---

*Generated: 2026-08-29 · FleetGraph tick · kairos-dream synthesis cycle · second pass*