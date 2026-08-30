# FleetGraph Synthesis — Ludicrous Speed Command Center

**Tick:** 2026-08-31 EDT · **Engine:** kairos-dream cycle · **Source:** fleet_graph_core.py, fleet_msg.py, plugin_api.py, plugin.yaml, README.md, fleet_graph.yaml, arxiv_digest.md, ideas_architecture.md, research/

---

## 1. Current State of the Codebase

### What's Implemented

**Core Topology Engine** (`fleet_graph_core.py`, 437 lines)
- Single-source-of-truth module shared by CLI and dashboard — no drift allowed
- YAML graph load with `_meta.relations` authoritative storage layout
- Full normalization pipeline: supervisor/subordinate resolution, contradiction dropping, self-edge detection, multi-supervisor rejection, cycle detection via effective-supervisor traversal, materialized implied supervisors
- Policy layer: `can_communicate()` (up/down/peer/blocked with reason strings), `can_delegate_to()` (structural subtree feasibility + optional contract depth check)
- Graph surgery: `save_graph()` with atomic write + Windows retry backoff, `normalize_relations()` with symmetric peer derivation and validation
- Pure graph utilities: `subtree_nodes()` (BFS), `subtree_depth()`, `chain()`, `describe()`
- Alias resolution via `_meta.profile_aliases` — graph-facing node names can differ from canonical Hermes profile names

**Inter-Bot Messaging CLI** (`fleet_msg.py`, 164 lines)
- `send` — validates edge, writes JSONL inbox, optional live delivery via `hermes -p <target> chat`
- `inbox` — drainable message list per profile, malformed-line tolerant
- `show` — full topology dump as JSON
- JSON refusal contract on every error path (no raw tracebacks)
- Edge-kind header decoration (supervisor/subordinate/peer framing)

**Dashboard Backend** (`plugin_api.py`, 1020 lines)
- 20+ REST endpoints under `/api/plugins/fleet-graph/`
- **Topology:** `/overview[?light=1]` (full paint payload with session tails, inbox pressure, depth, unassigned profiles), `/graph`, `/graph/summary`, `/relations`, `/delegate-check`
- **Messaging:** `/send` (validated talk/delegate/supervisor frames), `/simulate` (dry-run policy check)
- **Inbox:** `/inbox/{profile}`, `/inbox/{profile}/read` (watermark-based unread tracking), `DELETE /inbox/{profile}` (drain + clear watermark)
- **Activity:** `/sessions/tail`, `/sessions/{name}/messages` (transcript tail with content extraction from JSON payloads)
- **Capability:** `/roster` (derived capability summaries from profile.yaml + SOUL.md + config.yaml toolsets), `/match` (semantic ranking via fastembed + mxbai-embed-large-v1, local onnx, cached by file mtime)
- **SOUL editor:** `GET/PUT /soul/{name}` (default profile write-guarded)
- **Avatar:** `GET /avatar/{name}` (base64 data URL from profile assets/)
- **Traffic:** `/traffic?window=` (recent inter-agent messages for edge glow)
- **Graph mutation:** `PUT /graph` (replace topology + relations), `PUT /relations` (replace peer map)
- Watermark system: per-profile `.read/<name>.json` with `last_read_ts` + `count_at_read`

**Fleet Topology** (`topology/fleet_graph.yaml`, 155 nodes, 1009 lines)
- **Primordial Triad** — 4 co-equal roots: baal (The King), lilith (Fleet Commander), lucifer (Red Team), yeshua (Legal & Ethics)
- **Chief of Staff:** hermes → default + engineering directorates
- **Directorates:** sophia, lucifer, thoth, nyx, ouroboros, yeshua
- **Star Trek profiles:** 68 personas across TOS/TNG/DS9/Voyager + Red Team
- **Goetic Court:** 72 officers across 7 ranks (Kings → Knights) with symbolic offices
- **Peer relations:** Data↔Spock, Worf↔Tuvok, Lucifer↔Yeshua

**Fleet Maintenance** (`maintenance/fleet_maint.py` + `test_fleet_maint.py`)
- 24/24 hermetic tests
- `prune` — removes deleted-profile traces from topology, relations, inboxes, watermarks in one atomic write
- `rotate` — caps inboxes at FLEET_INBOX_MAX (500), clamps watermarks
- `status` — read-only health snapshot

**Desktop Plugin** (`desktop-plugin/plugin.js`)
- Graph canvas (layered DAG, pan/zoom, click-to-inspect)
- Deck view (team-grouped cards, NEEDS ATTENTION triage)
- Live activity (4s transcript polling, status dots, unread badges)
- Message composer (talk/delegate/supervisor frames, server-side validation)
- SOUL editor, semantic routing (`/match`), rewire inline, member creation

**Spock Memory Bridge** (`scripts/spock_memory.py`)
- Bridges bidirectional memory live store into fleet code graph via `memory` subcommand
- `memory recall --depth 3` runs Doorway-Effect RECALL
- `memory export` dumps live rows to JSONL
- `memory reindex` exports + regraphs the engine project

**Research Layer** — 20+ documents across multiple subdirectories:
- `arxiv_digest.md` — latest scout tick (2026-08-27), 9 carried-forward papers, 3 threads
- `arxiv_synthesis.md` — 12 papers mapped to fleet components (4 threads)
- `ideas_architecture.md` — 6 papers → 3 PR-sized architecture ideas per tick
- `ideas_ux.md` — Fleet Activity Heatmap, Situation Report digest, Fleet Timeline
- `ideas_messaging.md` — Priority tiers, TTL/expiry, threaded replies
- `smith-chart/convergence-thesis.md` — full academic paper mapping 20 philosophers to fleet architecture
- `consciousness/README.md` — service unification for 4 consciousness scripts (sephirotic-forge primary)
- `quantum-physics-computing-council-of-twenty-grounded-2026-08-28.md` — grounded philosophy corrections + Q-Link physics grounding
- `local-cloud-4b-quantum-link-three-tier-2026-08-28.md` — Q-Link 0/1/2 architecture for local/cloud/26B cooperation
- `lightning-4b-cyberpunk-forge-three-tier-2026-08-28.md` — Cyberpunk Forge training research
- `fleetgraph-pr-landscape/` — PR #1 reply draft, landscape synthesis, arxiv scout

### What's Deferred

- `desktop-plugin/plugin.js` — JS layer current state relative to backend's newer endpoints (`/delegate-check`, `?light=1`, watermark-based unread) unverified this tick
- Fleet behavior integration tests — proposed in arxiv_synthesis.md, not yet created
- Profile scenario test battery — proposed, not yet created
- `verify_intent()` pre-flight — proposed, not yet implemented
- Congestion prediction layer — proposed, not yet implemented
- Memory budget estimation — proposed, not yet implemented
- Security tier field in topology YAML — proposed, not yet implemented
- Runtime contract formalization for Void profiles — proposed, not yet implemented
- Research scout pipeline automation — partially addressed by `sync_research.py`, but full fetch→extract→distill→dedup pipeline not yet built
- `/heartbeat` SSE endpoint (AgentRadio-inspired) — proposed, not yet implemented
- Semantic flow tags (APPA-lite) — parked pending maintainer buy-in
- Canvas virtualization beyond 26 nodes — explicitly out of scope

---

## 2. Strengths

### SSOT Discipline
`fleet_graph_core.py` is imported by both `fleet_msg.py` and `plugin_api.py`. Every topology read/write goes through the same normalization, validation, and storage code. The CLI, the REST API, and the bots can never drift. The maintenance folder inherits this through `save_graph` — it reimplements nothing. This architecture has survived feature additions (maintenance, delegation feasibility) without compromise.

### Validation Depth
The normalization pipeline catches real pathologies: unknown profile references, self-edges (explicit and derived), multiple supervisors, cycles (including cycles declared entirely via subordinates), supervisor/peer/subordinate role collisions, corrupt YAML. Every rejection returns a human-readable reason. The `GraphError` contract flows through to `fleet_msg` JSON refusal and `plugin_api` 422/500 responses consistently.

### Policy Layer Separation
`can_communicate()` (edge policy) and `can_delegate_to()` (structural feasibility) are pure graph functions — no profile reads, no host coupling. This makes them testable in isolation and composable: the dashboard's `/send` and `/delegate-check` endpoints layer contract checks on top without touching the core logic.

### Inbox + Watermark System
The JSONL inbox + `.read/<name>.json` watermark is lightweight and correct. Unread = total − count_at_read, clamped to zero. The mark-read endpoint supports three modes (everything, count N, ts cutoff) without a database. Draining clears both the inbox and the watermark. Rotation preserves watermark correctness.

### Semantic Routing
`/match` uses fastembed + mxbai-embed-large-v1 locally (no API cost). The embedding cache is invalidates by file mtime on SOUL.md and profile.yaml — rebuilds lazily only when a profile's capability doc changes. The capability doc combines title, summary, keywords (filtered through a 30+ stopword list), and toolsets.

### Live Activity Without Sockets
`_latest_session()` reads the profile's state.db via `hermes_state.SessionDB`, resolves compression-continuation tips, and reclassifies "interrupted" → "active" when the session was touched in the last 3 minutes. This lets the graph canvas paint "this bot is thinking" without holding N live gateway sockets. The `?light=1` overview mode skips these lookups entirely for fast polling.

### Atomic Writes with Windows Support
`save_graph()` writes to a unique temp file, calls `fsync`, then `os.replace()` with exponential backoff retry on `PermissionError`/`OSError`. This handles the Windows NTFS exclusive-rename race. Inbox rotation inherits the same pattern.

### Capability Summary Derivation
`_capability_summary()` is profile-agnostic — it derives what each bot is good at from files every profile already has (profile.yaml description, SOUL.md headline + first "You are" sentence, config.yaml toolsets). No hardcoded fleet knowledge required.

### Research Pipeline Maturity
The research layer has evolved from a single synthesis document into a multi-tier ecosystem: arxiv scout ticks, architecture ideas, UX ideas, messaging ideas, a full Convergence Thesis paper, quantum physics grounding, Q-Link architecture, and Cyberpunk Forge training research. The `sync_research.py` script bridges research into the dream-logger engram store.

---

## 3. Gaps and Opportunities

### No Pre-Send Simulation
An operator rewires the topology, saves, and discovers consequences by watching messages flow — or by not watching and missing a broken route. `/simulate` only checks one sender/recipient pair — it doesn't model structural consequences of a graph change.

### Routing Is Opaque
`chain()` returns `["baal", "hermes", "spock"]`. The operator has to mentally reconstruct *why* each hop exists. In a 155-node topology with derived supervisors and peer relations, this opacity makes re-wiring risky.

### No Delegation Fairness
Nothing prevents repeated delegation to the same subtree. There is no share cap, no rolling delegation count, no fairness gate. Over time, unused subtrees lose readiness.

### No Congestion Prediction
`/traffic` shows recent messages, `fleet_maint rotate` caps inboxes, but there is no prediction layer that flags bottleneck risk *before* the cap is hit.

### No Memory Budget Estimation
`subtree_nodes()` and `subtree_depth()` exist, but there is no `memory_budget()` method that estimates per-node state cost and flags when a subtree exceeds a threshold.

### Message Content Lacks Structured Fields
Inboxes are JSONL with `ts, from, type, task, summary`. The `summary` is a 500-char free-text truncation. No structured payload field, no evidence pointer, no upstream source tracking.

### No Fleet-Level Episodic Memory
Topology changes leave no history trail. "What did the org look like at time T / why did it change" is unanswerable. An append-only history log would also feed fleet-scale backward passes (bidirectional-memory pattern).

### Escalation Latency
Inbox-only delivery means an escalate can sit undrained for a full supervisor cycle. No urgency channel exists short of the blocking `--deliver` flag.

### Persona Consistency Is Not Automated
There is no automated check that a persona agent's output tone matches its SOUL.md voice section after task completion. Drift detection is manual.

### No Profile Scenario Testing
New Star Trek/Goetic profiles ship without a test battery. There is no `manage.py validate` scenario runner that verifies a profile stays in character across scenario prompts.

### Research Scout Pipeline Is Manual
The digest exists but required relaxed queries and hand-curation. A minimal `pipeline.py` (fetch → extract → distill → write digest) would make the scout cron reliable and dedupe-aware across ticks.

### Desktop Plugin JS State Unknown
`plugin.js` exists but its current state relative to the backend's newer endpoints is unverified.

---

## 4. Arxiv Insights

### Current Digest (2026-08-27) — 9 Papers, 3 Threads

**Multi-Agent Orchestration**
- **ProgRouter (2608.25992):** Step-wise routing from evolving progress/quality/time/cost signals. FleetGraph routes once per task; ProgRouter reweights after every completed step. Gap: no per-node progress deltas or reweighting.
- **JIT-Agent (2608.25593):** Composable/evolvable harness modules. Gap: FleetGraph nodes have fixed profiles; no harness versioning before dispatch.
- **Committed AI Configuration (2608.25241):** Committed config → lower quality-cost growth. Gap: no configuration-maturity score in the graph UI.

**Agent Communication Protocols**
- **Test-Time Collaborative Classification (2608.24787):** Finite-round, finite-precision evidence exchange over directed edges. Gap: no compact typed evidence format for subordinate-to-supervisor edges.
- **Dual-Cache Latent Space Communication (2608.20617):** Joint KV-cache transfer for heterogeneous models. Gap: FleetGraph uses text serialization; no latent-cache edge transport.
- **Consilience (2608.20564):** Adaptive speaker/intervention selection from uncertainty, disagreement, evidence gain, redundancy. Gap: Supervisor edges have no `challenge`/`clarify`/`seek_evidence`/`route` actions.

**Monitoring & Guardrails**
- **SkillShield (2608.25817):** Failure-derived safety skills. Gap: no role-specific safety clause injection.
- **StepGuard (2608.24777):** Pre-execution checks + post-run audits. Gap: no guard nodes on privileged-action edges.
- **Automata from Agent Traces (2608.23670):** Trace-derived FSMs for next-action/failure prediction. Gap: topology is not yet a model-agnostic predictor.

### Prior Synthesis (2026-08-24) — 12 Papers, 8 Threads

Key insights not yet operationalized:
- **Graph Engineering (2608.21156):** Conceptual backbone — graph transforms individual agents into system intelligence.
- **Width/Memory/Delay (2608.00028):** Quantifies flat vs layered memory overhead. Gap: no `memory_budget()`.
- **Beyond Component Testing (2607.29405):** Validate emergent fleet behavior. Gap: no `fleet_behavior_test.py`.
- **Memory Arbitration (2608.19701):** Memory Correlation Bias from repeated upstream claims. Gap: no provenance metadata on engrams.
- **MemFuse (2608.18704):** Atomic observations + fused episodic clusters. Gap: fleet knowledge is fragmented across sessions, Spock scopes, JSONL inboxes, research files, cron continuity, dream engrams — no fusion layer.
- **Self-Recognition (2606.23700):** Persona drift prevention. Gap: dream backward pass does this for engrams but not persona task output.
- **ACES (2608.20614):** Paired capability evaluation. Gap: no paired baseline/target trials.

### New Research Corpus (2026-08-28) — Q-Link + Cyberpunk Forge

- **SWARM-LLM (2606.14711):** Query-level collaboration layer (local answer / peer collaboration / cloud escalation). Maps directly to Q-Link 0 architecture.
- **Pangu Embedded (2505.22375):** Fast/slow modes with latency-tolerant scheduling. Maps to 26B Tide async queue pattern.
- **PRISM (2506.17486):** Teacher-distilled compact worker. Maps to 26B→4B Cyberpunk training pipeline.

---

## 5. Actionable Update Ideas

### A. Chain With Rationale (1 folder: `fleet_graph_core.py` + `plugin_api.py` + `plugin.js`)

**What:** `chain_with_rationale()` returns `[(node, reason), ...]` where reason ∈ {ESCALATION, DELEGATION, PEER_COORD, DERIVED_HOP}. Backward-compatible wrapper preserves existing `chain()`.

**Why:** Operators re-wiring a 155-node Primordial Triad topology need to see *why* a message takes a given path.

**Files:**
- `fleet_graph_core.py` — reason enum, `chain_with_rationale()`
- `plugin_api.py` — rationale chain in `/send` response and `/overview`
- `plugin.js` — color-coded hops with hover tooltip

**Paper grounding:** HiMA-MDD (2608.21868) — interpretable routing. Already drafted in `ideas_architecture.md`.

---

### B. Pre-Send Route Simulator (1 folder: `fleet_graph_core.py` + `plugin_api.py` + `plugin.js` + `fleet_msg.py`)

**What:** `simulate_send(sender, recipient, kind, contract?)` → full predicted outcome: routing chain with rationale, `can_communicate` verdict, `can_delegate_to` verdict, latency estimate. New `POST /simulate_route` endpoint. Dashboard composer gains "Preview route" button.

**Why:** Turns topology editor into safe sandbox. Before/after simulation shows what routes a new peer relation unlocks.

**Files:**
- `fleet_graph_core.py` — `simulate_send()`, `estimate_route_cost()`, optional `weight` field
- `plugin_api.py` — `POST /simulate_route`
- `plugin.js` — "Preview route" button + predicted-path rendering
- `fleet_msg.py` — optional drift detection

**Paper grounding:** AGENTSERVESIM (2606.09613). Already drafted.

---

### C. Delegation Fairness Guard (1 folder: `fleet_graph_core.py` + `plugin_api.py` + `plugin.js` + `fleet_msg.py` + `maintenance/fleet_maint.py`)

**What:** `_meta.delegate_counts` — rolling subtree_root → delegation count map. Optional per-node `max_delegate_share`. `can_delegate_to` checks fairness cap. Dashboard renders share as progress bar. `fleet_maint reset_delegate_counts` (cron-scheduled).

**Why:** Prevents work concentration on one subtree. Over-delegating to one subtree over-taxes one persona's voice.

**Files:**
- `fleet_graph_core.py` — `load_delegate_counts()`, `record_delegation()`, fairness check
- `fleet_graph.yaml` — optional `max_delegate_share`
- `plugin_api.py` — delegation counts in `/overview`
- `plugin.js` — delegation-share progress bar
- `fleet_msg.py` — record delegation on delegate sends
- `maintenance/fleet_maint.py` — `reset_delegate_counts` command

**Paper grounding:** Delegated Fair Division (2607.27743). Already drafted.

---

### D. Typified Evidence Messages (1 folder: `fleet_graph_core.py` + `fleet_msg.py` + `plugin_api.py`)

**What:** Add structured `evidence` field to inbox schema: `{type, content, upstream_source_id?}`. Evidence types: `progress`, `blocker`, `question`, `artifact_ref`, `result`. Free-text `summary` stays. Evidence type is a routing hint, not a policy gate.

**Why:** Test-Time Collaborative Classification models finite-round evidence exchange. FleetGraph sends free-text summaries — supervisors can't triage by type without reading. `upstream_source_id` lays groundwork for provenance-aware consensus (Memory Arbitration).

**Files:**
- `fleet_msg.py` — evidence type arg, structured record
- `plugin_api.py` — evidence field in `/send` + inbox record

**Paper grounding:** Test-Time Collaborative Classification (2608.24787), Memory Arbitration (2608.19701).

---

### E. Fleet Timeline + Topology Change Log (1 folder: `dashboard/plugin_api.py` + `plugin.js` + `fleet_graph_core.py`)

**What:** Append-only topology change log (`{ts, op, path, before, after}`) written on every `PUT /graph`. New `GET /activity/timeline` endpoint aggregating session events, inbox messages, topology changes, and tool events (via in-memory ring buffer). Timeline view in UI with filtering and click→context navigation.

**Why:** "Did A's delegation to B actually precede B's work?" — currently impossible without opening two inspectors. "When was this bot detached?" — currently no record at all. Closes fleet-level episodic memory gap.

**Files:**
- `fleet_graph_core.py` — `record_topology_change()` helper called from `save_graph` or exposed as a separate append function
- `plugin_api.py` — `GET /activity/timeline`, optional in-memory tool-event ring buffer, topology-change log reader
- `plugin.js` — TimelineView component with filter bar

**Paper grounding:** No direct paper; operationalized from the bidirectional-memory pattern and the Doorway-Effect retracing need.

---

### F. Memory Budget Estimation (1 function: `fleet_graph_core.py`)

**What:** `memory_budget(graph, node)` → estimate per-node state cost (inbox lines + session tail + watermark) and flag when a supervisor's subtree exceeds a threshold. Reuses `subtree_nodes()` and `_inbox_counts()` patterns.

**Why:** Width/Memory/Delay quantifies flat vs layered overhead. FleetGraph's hierarchy is the antidote, but there's no operational way to make this visible. Turns prune from reactive to proactive.

**Files:**
- `fleet_graph_core.py` — `memory_budget()` method
- `plugin_api.py` — expose budget in `/overview` per-node
- `plugin.js` — budget indicator in node inspector

**Paper grounding:** Width/Memory/Delay (2608.00028).

---

### G. Q-Link 0 Artifact Bridge (1 folder: `scripts/` + `tests/`)

**What:** Implement the Q-Link 0 asynchronous artifact bridge per `local-cloud-4b-quantum-link-three-tier-2026-08-28.md`: local dispatcher writes signed request envelope → upload to remote inbox → remote worker claims idempotently → remote 4B writes signed result envelope → local downloads and verifies. Append-only SQLite event ledger. Three harmless public test tasks. Replay/expiry/tamper/timeout/duplicate-delivery tests.

**Why:** The three-mind operating rhythm (Pulse/Mirror/Tide) is the architectural blueprint. Q-Link 0 proves the relationship without pretending the cloud is faster, exposing Ollama publicly, or modifying active model registrations. The quantum-envelope contract is already fully specified.

**Files:**
- `scripts/qlink0_dispatcher.py` — local producer + verifier
- `scripts/qlink0_remote_worker.py` — remote bounded worker (for Lightning Studio deployment)
- `tests/test_qlink0.py` — replay/expiry/tamper/timeout/duplicate tests
- `docs/qlink0_ledger_schema.md` — SQLite schema for the append-only event ledger

**Paper grounding:** SWARM-LLM (2606.14711), Pangu Embedded (2505.22375), A Unified Approach to Routing and Cascading (2410.10347).

---

### Prioritization

**This tick, one folder worth of work:** Pick **A (Chain With Rationale)** — smallest scope (one new function + enum, backward-compatible), prerequisite for B, immediate value to operators re-wiring the now-155-node topology. The Primordial Triad + Goetic Court + Star Trek has made routing opacity a real pain point.

**Next tick candidates:** B (Pre-Send Simulator) builds on A. E (Fleet Timeline) is the highest-value independent addition for operational visibility. G (Q-Link 0) is the most architecturally ambitious but proves the three-mind model.

---

*Generated: 2026-08-31 EDT · FleetGraph Synthesis Cycle · Overwritten each tick*