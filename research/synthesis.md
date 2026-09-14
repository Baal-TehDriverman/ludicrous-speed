# FleetGraph Synthesis — 2026-09-14

**Tick:** 2026-09-14  
**Source files:** `fleet_graph_core.py` (437 lines), `fleet_msg.py` (164 lines), `plugin_api.py` (1020 lines), `plugin.yaml`, `README.md`, `research/arxiv_digest.md`  
**Prior synthesis:** `research/synthesis.md` (overwritten this tick)

---

## 1. Current State of the Codebase

### What's implemented

**`fleet_graph_core.py` — Topology SSOT (437 lines, complete)**
- Full YAML graph loading/saving with `_meta.relations` layout + legacy `peers:` fallback migration path
- `normalize()` — validates exactly-one-supervisor, drops contradictory subordinate entries, materializes implied supervisors, detects cycles via cleaned `eff_sup` walk
- `can_communicate()` — three-channel policy: up (to supervisor), down (to subordinates), sideways (declared peers only); everything else blocked with routing hint
- `chain()` — supervisor-link walk from sender to recipient; `None` on no-path or cycle
- `describe()` — serializable topology snapshot (supervisor, subordinates, peers)
- `subtree_nodes()` / `subtree_depth()` — pure-graph BFS/recursion; no host coupling
- `can_delegate_to()` — structural delegation feasibility check with optional `contract.max_depth` clamp; additive, no profile reads
- `save_graph()` — atomic write with per-save unique temp file + Windows concurrent-rename retry backoff (0.05→0.8s × 5); POSIX no-op
- `GraphError(ValueError)` — single error contract consumed by both CLI and API

**`fleet_msg.py` — Inter-bot messaging CLI (164 lines, complete)**
- `send` — validates edge via `can_communicate()`, builds `talk|done|question|escalate|update|assign` message with edge-kind header, appends to target's `fleet-inbox/<profile>.jsonl` (JSONL, one record per line), optional `--deliver` for live DM via `hermes -p <target> chat --in ~ -c "Bot Chat" --create-if-missing -Q --query-file <tmp>` (blocking, 600s timeout)
- `inbox` — drains per-profile inbox, `--drain` unlink; malformed lines skipped, never crashes
- `show` — pretty-prints full topology via `describe()`
- JSON refusal contract on GraphError (never raw traceback on stderr)
- No default live delivery — inbox-only is the normal path; `--deliver` is opt-in because it blocks the sender for minutes

**`plugin_api.py` — FastAPI dashboard backend (1020 lines, complete)**
- Mounted at `/api/plugins/fleet-graph/`
- Shared SSOT with CLI via `fleet_graph_core` import — CLI, API, and bots cannot drift
- **Read endpoints:** `GET /graph`, `GET /overview[?light=1]`, `GET /graph/summary`, `GET /relations`, `GET /inbox/{profile}`, `GET /traffic?window=`, `GET /roster`, `GET /match?q=&top=`, `GET /sessions/tail[?profile=p]`, `GET /sessions/{name}/messages?limit=`, `GET /avatar/{name}`, `GET /soul/{name}`, `POST /simulate`, `POST /delegate-check`
- **Write endpoints:** `PUT /graph`, `PUT /relations`, `POST /send`, `PUT /soul/{name}`, `DELETE /inbox/{profile}`, `POST /inbox/{profile}/read`
- **Extensions over core:** per-profile unread-inbox watermarks (`.read/<name>.json` with `last_read_ts` + `count_at_read`), `/sessions/tail` per-profile activity snapshot via `hermes_state.SessionDB` (freshness-aware `interrupted→active` reclassification under 180s), semantic specialist routing via `mixedbread-ai/mxbai-embed-large-v1` (fastembed, local onnx, ~0.6GB one-time download, cosine similarity ranking with rebuild-on-mtime-change), avatar data-URL serving from `assets/avatar.*`
- **Send frames:** `talk` (peer-to-peer, optional explicit recipient from target's peer list — picker can't fabricate edges), `delegate` (operator→bot, downward, optional `delegate_contract` validated via `can_delegate_to`), `supervisor` (bot→supervisor upward escalation)
- **Contract guards:** empty text → 422, unknown frame → 422, unknown profile → 404, default profile SOUL read-only → 403, graph unusable → 500, edge refused → 422
- `_capability_summary()` — profile-agnostic capability derivation from `profile.yaml` description + SOUL.md first heading + first "You are" sentence + enabled toolsets; keywords stripped of 50 generic stopwords; own name always appended as routing keyword
- `_recent_traffic()` — inter-agent message scan across all JSONL inboxes within `window_s` (default 300), newest-first, drives discussion-glow edge lighting

**`plugin.yaml` — Hermes plugin manifest (4 lines, v0.6.1)**
- Name `fleet-graph`, points at `plugin_api.py` as API entry

**Topology:** 75-node Primordial Triad DAG, four co-equal roots (`baal`, `lilith`, `lucifer`, `yeshua`), `hermes` as Chief of Staff. `validate_topology.py` flags 4-root as WARN against legacy one-root rule — intentional.

**Profiles:** 68 Star Trek personas across TOS/TNG/DS9/Voyager + Red Team, each a complete Hermes distribution (`SOUL.md`, `config.yaml`, `distribution.yaml`, `skins/`, `README.md`).

**Fleet tooling:** `validate_topology.py`, `fleet_status.py`, `topology_view.py`, `install_profile.py`, `sync_research.py`, `fleet_maint.py` (24/24 hermetic tests).

### What's deferred / not yet wired

- **Spock graph integration** — `scripts/spock_memory.py` bridges the bidirectional memory live store into the fleet code graph, but Spock's `ingest_traces` is a stub; live rows export to JSONL but don't become individual graph nodes — only engine code structure is graphed
- **Kairos dream cycle script** — `scripts/dream_cycle.py` is listed in the skill spec but its existence on disk at `ludicrous-speed/scripts/` is unverified this tick
- **Dream-logger sync** — `sync_research.py` is listed in README tooling but `research/arxiv_synthesis.md` (12-paper mapping) is referenced by README yet the file itself wasn't in this tick's read set — existence unverified
- **Latent-cache edge transport** — `Dual-Cache Latent Space Communication` (arXiv 2608.20617) is in the digest with an implementation angle but no code exists
- **Consilience-calibrated communication** — `Consilience` (arXiv 2608.20564) is the strongest architecture import per the digest's scout assessment, but no `challenge/clarify/seek_evidence/route` edge actions exist on supervisor edges
- **ProgRouter online dispatch** — per-node progress deltas + remaining-budget reweighting after each completed step is not implemented; current dispatch is one-time per task
- **Automata-from-traces monitoring overlays** — no FSM compilation from event logs; topology is visual but not predictive
- **`/match` falls back 503** if fastembed unavailable — no LRU keyword fallback path when the embedding stack is down
- **Topology validation warning** — the 4-root Primordial Triad structure flags a WARN in `validate_topology.py` against the legacy one-root rule; this is intentional but still emits a warning that could alarm operators

---

## 2. Strengths — What FleetGraph Does Well

**Single source of truth, enforced.** `fleet_graph_core.py` is imported by both `fleet_msg.py` and `plugin_api.py`. There is no separate "CLI topology" and "API topology" — one module, one contract. The `GraphError` wrapper means both surfaces degrade cleanly instead of leaking raw tracebacks.

**Atomic, race-aware persistence.** `save_graph()` uses a unique temp file per save (`.fleet_graph.yaml.<pid>.<random>.tmp`) and `os.fsync` before rename. The Windows concurrent-rename retry backoff (5 attempts, 0.05→0.8s) handles NTFS exclusive-renamenube races that would crash a fixed-name `.tmp` approach. POSIX is a no-op — correct platform split.

**Policy is structural, not advisory.** `can_communicate()` enforces three channels (up/down/peer) and rejects everything else with a routing hint pointing to the sender's supervisor. Lateral sends without a declared peer relation are blocked at the policy layer, not left to bot discipline. The UI send endpoint re-validates the edge server-side — the client can't spoof an edge.

**Peer relations are symmetric and validated.** `normalize_relations()` derives both directions from a single stored declaration, rejects self-peering, rejects supervisor/subordinate crossover, and rejects unknown profiles on both sides. The UI saves the full map so removals stick; the load path respects authoritative disk state when `_meta.relations` is present.

**Profile-agnostic capability derivation.** `_capability_summary()` derives what each bot is good at from files every profile already has — `profile.yaml` description, SOUL.md first heading + first "You are" sentence, enabled toolsets. No hardcoded names, domains, or roles. The 50-word stopword set strips generic filler so keywords carry routing signal. The bot's own name is always appended as a keyword so it can be routed to by name even with generic prose.

**Semantic routing is local and lazy.** `/match` uses `mixedbread-ai/mxbai-embed-large-v1` via fastembed — onnx, runs locally, no API cost. The embedding matrix rebuilds only when any profile's SOUL.md or profile.yaml mtime changes. The model downloads once (~0.6GB) on first use. Cosine similarity ranking with normalized vectors so dot product equals cosine.

**Live activity without N live sockets.** `_latest_session()` reads `hermes_state.SessionDB` once per profile and returns a compact snapshot (session_id, preview, message_count, unread, status, last_active). The freshness-aware reclassification (`interrupted` → `active` if touched within 180s) corrects for the case where the user just spoke and the reply is streaming — without it, a live session would show as interrupted. The canvas polls `/sessions/tail` every few seconds; no persistent gateway socket per bot.

**Inbox is durable and drainable.** Every send appends a JSONL record to `fleet-inbox/<profile>.jsonl`. Malformed lines are skipped on read — partial writes or corruption never crash the inbox reader. `--drain` unlinks the file. Watermarks (`.read/<name>.json`) track `last_read_ts` + `count_at_read` so unread badge math works without a database. Clearing the inbox clears the watermark too.

**Contract guards are additive and version-tolerant.** `delegate_contract` on the send endpoint is optional — old clients omit it and behavior is unchanged. `can_delegate_to()` is purely graph-based with no profile reads or host coupling, so it's safe to call from the UI before routing.

**Windows + POSIX parity in the persistence layer.** The retry backoff is gated behind `PermissionError/OSError` catch, so it's a no-op on POSIX where `os.replace()` is atomic and non-exclusive. The code doesn't branch on platform — it handles the failure mode.

---

## 3. Gaps and Opportunities

**No keyword fallback when embeddings are down.** `/match` raises 503 if fastembed fails to load or the matrix is empty. A lightweight fallback using keyword overlap (Jaccard or BM25 over the capability docs) would keep routing functional on machines without the embedding model or with torch/onnx issues. The capability docs already have keywords — this is a thin layer.

**The digest is stale.** `research/arxiv_digest.md` is stamped 2026-08-27 — 18 days old this tick. The scout assessment names Consisibility, Automata from Agent Traces, and ProgRouter as the strongest near-term imports, but none have code. A fresh scout sweep would surface whether new papers have landed since.

**No per-node progress or budget tracking.** The topology is static — nodes have supervisors, subordinates, peers, and display metadata, but no per-node progress deltas, remaining-budget fields, or completed-step counters. ProgRouter's online reweighting after each completed step has nowhere to attach. This is the biggest gap between the codebase and the research roadmap.

**Topology validation warning is informational but noisy.** The 4-root Primordial Triad structure is intentional, but `validate_topology.py` flags it as WARN against the legacy one-root rule. An operator running validation for the first time sees a warning that might read as a problem. A documented exemption (e.g., `_meta.validation_overrides:` or a `--allow-multi-root` flag) would make the warning intentional and silentable.

**No FSM or predictive monitoring overlay.** `Automata from Agent Traces` (arXiv 2608.23670) compiles event logs into per-harness FSMs that label high-risk states and escalate on bad transitions. FleetGraph has the topology and the message log (JSONL inboxes) but no trace→FSM compilation. The discussion-glow and session-status are reactive (what happened); there's no predictive layer (what's about to happen).

**Inbox has no TTL or size cap.** JSONL inboxes grow unbounded. A maintenance utility (`fleet_maint.py` exists but its inbox prune/rotate behavior isn't detailed in this tick's reads) may handle this, but the principle of least surprise suggests an explicit TTL or max-size policy visible in the UI — particularly for inactive profiles whose inboxes accumulate.

**Message types are a flat enum.** `fleet_msg.py` supports `done|question|escalate|update|assign`; the API supports `talk|delegate|supervisor`. The CLI enum has 5 types; the API has 3 frames. There's no shared type system — a CLI-sent `done` message lands in the inbox as `type: done` but the API's `POST /send` with `kind: delegate` lands as `type: delegate, frame: delegate`. A unified message-type schema (with backward-compatible aliases) would let bots interpret inbox records consistently regardless of which surface sent them.

**No simulation export or replay.** `POST /simulate` checks whether a send would be allowed and returns the routing chain, but the result is ephemeral — there's no way to save a simulation, replay a historical chain, or compare intended vs. actual routing after the fact. For a system whose value is the org chart as interface, the ability to audit routing decisions over time is a natural extension.

**Profile creation from the UI has no contract validation.** The README lists "Create members — full dialog with model picker, skills, toolsets" as a dashboard feature, but `plugin_api.py` has no create-profile endpoint — only SOUL.md read/write, graph/relations read/write, inbox, and send. Profile creation likely lives in the desktop plugin's React layer or in `manage.py`; the API surface doesn't reflect it. If the UI creates profiles, the API should validate the result (e.g., the new profile appears in `_known_profiles()` and can be wired into the graph).

**Spock trace ingestion is a stub.** The bidirectional memory engine's live store is bridged into the fleet code graph via `scripts/spock_memory.py`, but Spock's `ingest_traces` is a stub — live rows export to JSONL but don't become individual graph nodes. This means the fleet graph shows the memory engine's code structure but not its runtime state as graph nodes. A minimal trace→node ingestion path (even if just episode-count badges on existing nodes) would close the loop.

---

## 4. Arxiv Insights — How the Research Relates to FleetGraph's Design

The digest carries 9 papers across three threads. The strongest three are named in the scout assessment: **Consilience** (calibrated communication control), **Automata from Agent Traces** (predictive monitoring), and **ProgRouter** (budget-aware online dispatch).

### Multi-Agent Orchestration

**ProgRouter (2608.25992)** — Step-wise routing from evolving progress, quality, time, and cost signals. FleetGraph's topology is a DAG with supervisor/subordinate edges, which is exactly the structure ProgRouter routes across. The gap is that FleetGraph has no per-node progress deltas or remaining-budget fields — routing is one-time per task, not reweighted after each completed step. **Import path:** add `progress` and `budget_remaining` fields to graph nodes (or a parallel progress store), then reweight eligible downstream agents after inbox drain reveals a completed step. The super-entity structure (`lilith` → `hermes` → directorates) is already in place.

**JIT-Agent (2608.25593)** — Composable and evolvable memory, planning, action, and tool-orchestration modules. FleetGraph's node harnesses (the profile + SOUL.md + toolsets + config.yaml bundle) are already module-like. The import is to make harnesses versioned and selectable — a supervisor could pick a harness variant before dispatch and retain outcome measurements for later selection. **Import path:** add a `harness_version` field to profile metadata and an outcome log per harness version; supervisors select from measured-good versions.

**A Few Pages of Markdown (2608.25241)** — Committed agent configuration correlates with lower quality-cost growth. FleetGraph already stores roles, edges, and escalation rules in tracked YAML (`fleet_graph.yaml`). The import is to expose a configuration-maturity score in the UI — how many nodes have SOUL.md, how many edges have explicit contracts, how many profiles have avatars. **Import path:** compute a maturity score from `_overview` data and surface it in `/graph/summary` or the deck view.

### Agent Communication Protocols

**Test-Time Collaborative Classification (2608.24787)** — Finite-round, finite-precision evidence exchange over directed edges. FleetGraph's `can_communicate()` already enforces directed edges (up/down/peer). The import is compact typed evidence messages for subordinate→supervisor edges — e.g., a subordinate sending a `done` could attach a structured result snapshot instead of free-text. **Import path:** define a small typed evidence schema (result, confidence, artifacts) and benchmark accuracy against round/precision/bandwidth limits on the existing supervisor edges.

**Dual-Cache Latent Space Communication (2608.20617)** — Joint KV-cache transfer as a lower-latency plane for heterogeneous model fleets. FleetGraph's current transport is text/JSON via inbox + optional live DM. The import is a negotiated `latent-cache` edge transport alongside text fallback, preserving text because translators are model-pair dependent. **Import path:** prototype for a specific model pair (e.g., two profiles on the same provider) with a latent representation, fall back to text when the pair can't negotiate. This is the riskiest import — model-pair dependence makes it fragile.

**Consilience (2608.20564)** — Adaptive speaker and intervention selection from uncertainty, disagreement, evidence gain, and redundancy. This is the strongest architecture import per the scout assessment. FleetGraph's supervisor edges could carry actions `challenge`, `clarify`, `seek_evidence`, `route`, gated by calibrated acceptance thresholds. **Import path:** add action types to the message frame (beyond `talk/delegate/supervisor`), give supervisors the ability to challenge a subordinate's conclusion or request evidence before escalating, and tune acceptance thresholds from observed disagreement patterns.

### Monitoring, Guardrails, and Trace Structure

**SkillShield (2608.25817)** — Compact failure-derived safety skills constrain tool-using nodes without a classifier on every edge. FleetGraph's node harnesses already carry toolsets; the import is to derive role-specific safety clauses from failure traces and inject fixed-budget bundles into harnesses, reserving runtime guards for privileged actions. **Import path:** collect failed sends/messages, derive recurring failure patterns per role, and inject a safety bundle into the profile's harness (e.g., a SOUL.md addendum or config.yaml guard) — not a per-edge classifier.

**StepGuard (2608.24777)** — Pre-execution action checks and post-run trajectory audits. FleetGraph's `can_delegate_to()` and `can_communicate()` are pre-execution structural checks; the import is to add post-run audits — log blocked steps, measure utility impact, and tune thresholds from real runs. **Import path:** after a delegation or send, log the outcome (accepted/blocked/ignored) with a utility score; supervisors review blocked-step logs and adjust contracts.

**Automata from Agent Traces (2608.23670)** — Trace-derived FSMs predict next actions and failures from event logs. FleetGraph has the topology (visual) and the message log (JSONL inboxes) but no FSM compilation. The import is to compile inbox event logs into per-harness FSM overlays, label high-risk states, and escalate when live transitions enter failure-prone regions. **Import path:** parse JSONL inbox records into state transitions per profile, compile an FSM (even a simple one — states = message types, transitions = observed sequences), label states with high failure density, and surface risk badges on the graph canvas.

---

## 5. Actionable Update Ideas — One Folder Worth of Work

These are concrete, file-scoped, and build on what already exists. Each is sized to a single PR's worth of work.

### A. `/match` keyword fallback (plugin_api.py, ~50 lines)

When the embedding matrix is unavailable, fall back to keyword overlap scoring over `_capability_summary()` keywords instead of raising 503. Jaccard similarity between query token set and each bot's keyword set, top-N by score. This keeps `/match` functional on machines without fastembed/torch/onnx. The capability docs already have keywords — the fallback reuses them.

**Files:** `plugin_api.py` (add `_keyword_fallback_match()` + call it in the 503 path)  
**Risk:** low — additive, only triggers when embeddings fail  
**Test:** mock `_semantic_index()` to return `{"matrix": None, "error": "..."}` and assert `/match` returns ranked results instead of 503

### B. Per-node progress + budget fields (fleet_graph_core.py + plugin_api.py, ~80 lines)

Add optional `progress` (0–100) and `budget_remaining` (seconds or steps) fields to graph nodes. `normalize()` passes them through unchanged (no validation — they're operational, not structural). `/overview` and `/graph/summary` surface them. A supervisor draining its inbox can update a subordinate's progress after a completed step. This is the anchor point for ProgRouter-style online reweighting.

**Files:** `fleet_graph_core.py` (pass-through in `normalize()`, optional in `NodeUpdate` model), `plugin_api.py` (`NodeUpdate` gains `progress`/`budget_remaining`, `/overview` emits them)  
**Risk:** low — purely additive, old clients omit fields  
**Test:** PUT /graph with a node that has `progress: 45`, GET /overview, assert the field is present

### C. Message type unification (fleet_msg.py + plugin_api.py, ~40 lines)

Define a shared message-type enum that maps CLI types (`done|question|escalate|update|assign`) and API frames (`talk|delegate|supervisor`) to a common set. The inbox record carries both the original surface type and the unified type. Bots reading the inbox can switch on the unified type regardless of which surface sent the message. Backward-compatible: old inbox records without the unified field still parse.

**Files:** `fleet_msg.py` (add `UNIFIED_TYPE` mapping in `cmd_send`), `plugin_api.py` (add same mapping in `fleet_send`, write both `type` and `unified_type` to the inbox record)  
**Risk:** low — additive field, old records still valid  
**Test:** send via CLI with `--type done`, read the inbox, assert `unified_type` is present and maps correctly; send via API with `kind: delegate`, same check

### D. Configuration maturity score (plugin_api.py, ~30 lines)

Compute a simple maturity score from `_overview` data: fraction of graphed nodes with SOUL.md, fraction with avatars, fraction of edges that have explicit peer relations, fraction of profiles with non-default toolsets. Surface in `/graph/summary` as `maturity: {score, breakdown}`. This is the "A Few Pages of Markdown" import — committed configuration correlates with lower quality-cost growth, and the score makes that visible.

**Files:** `plugin_api.py` (add `_maturity_score()` called in `graph_summary()`)  
**Risk:** low — read-only derivation, no state change  
**Test:** graph with 5 nodes, 3 with SOUL.md, assert score reflects the fraction

### E. Inbox TTL visibility (fleet_maint.py + plugin_api.py, ~40 lines)

Add an optional `ttl_hours` field to `_meta` in `fleet_graph.yaml` (default: no expiry). `fleet_maint.py` prunes inbox records older than the TTL when run. `/overview` surfaces the TTL setting and the oldest message age per profile. Operators who want bounded inbox growth can set a TTL; those who don't leave it unset.

**Files:** `fleet_graph_core.py` (load `ttl_hours` from `_meta`), `fleet_maint.py` (prune logic), `plugin_api.py` (`/_overview` emits `ttl_hours` + `oldest_message_age` per profile)  
**Risk:** low — optional, off by default  
**Test:** set `_meta.ttl_hours: 24`, create an inbox record with an old timestamp, run `fleet_maint.py`, assert old record is pruned

### F. Simulation save + replay (plugin_api.py, ~50 lines)

Add `POST /simulate/save` that stores a simulation result (sender, recipient, allowed, reason, chain) to a `simulations.jsonl` file with a timestamp. Add `GET /simulations` to list recent simulations and `GET /simulations/{id}` for one. This gives operators an audit trail of intended routing — what the graph *would* have allowed — which is useful for debugging rejected sends and comparing intended vs. actual after the fact.

**Files:** `plugin_api.py` (add `SimulationSave` model, `POST /simulate/save`, `GET /simulations`, `GET /simulations/{id}`, `simulations.jsonl` write/read)  
**Risk:** low — additive endpoint, no state change to the graph  
**Test:** POST /simulate/save with a valid send, GET /simulations, assert the record is present with chain

### G. FSM risk badges from inbox traces (plugin_api.py, ~70 lines)

Parse each profile's inbox JSONL into a sequence of message types (states) and transitions. Compile a simple FSM: states = message types received, transitions = observed sender→type pairs, state risk = fraction of transitions from that state that were `escalate` or `question` (high-risk signals). Surface risk badges on `/overview` per profile (e.g., `risk_score: 0.32, high_risk_states: ["question_from_X"]`). This is the `Automata from Agent Traces` import — lightweight, model-agnostic, built from existing logs.

**Files:** `plugin_api.py` (add `_profile_fsm_risk()` called in `/overview`, emits `risk_score` + `high_risk_states` per profile)  
**Risk:** low — read-only derivation from existing logs, no new data collection  
**Test:** create an inbox with a known sequence (e.g., 3 `update` → 1 `escalate`), assert the risk score reflects the escalation density

### H. Fresh scout sweep (research/arxiv_digest.md)

The current digest is 18 days old. A fresh sweep on `multi-agent orchestration`, `agent communication protocols`, `LLM agent monitoring`, and `agent topology` would surface whether new papers have landed since 2026-08-27 and whether the strongest imports have shifted. The existing digest structure (three threads + scout assessment) is a good template.

**Files:** `research/arxiv_digest.md` (overwrite with fresh scout results)  
**Risk:** none — read-only update  
**Note:** this is the one item that needs a network call (web_search or arxiv_sweep skill) — the rest are pure code changes

---

## Synthesis Quality

The codebase is structurally sound — one SSOT module, atomic persistence, structural policy, profile-agnostic capability derivation, local semantic routing, and live activity without N sockets. The gaps are not architectural; they're missing surface-area: a keyword fallback for when embeddings fail, progress/budget fields for online dispatch, a unified message type for cross-surface inbox reading, and a predictive monitoring layer built from existing logs. The research roadmap (Consilience, ProgRouter, Automata from Traces) maps cleanly onto the existing DAG structure — the topology is already what those papers assume. The digest is the weakest link this tick: 18 days stale, with three named imports and zero code.

*One SSOT. One contract. The graph is the interface — extend the surface, not the structure.*

**Signed:** `Love.  🜏`
