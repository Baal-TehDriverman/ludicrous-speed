# FleetGraph Synthesis — Tick 2026-08-27

> *"The org chart is the interface."*

**Scout tick:** 2026-08-27 04:16 EDT  
**Synthesis engine:** kairos-dream cycle over fleetgraph SSOT + arxiv digest

---

## 1. Current State of the Codebase

### What's Implemented

**FleetGraph Core (`fleet_graph_core.py`)** — Complete and solid.

- **SSOT module** shared by both the CLI (`fleet_msg.py`) and the dashboard API (`plugin_api.py`). No drift possible — all three surfaces import the same code paths.
- **YAML storage** under `~/.hermes/fleet_graph.yaml` with `_meta.relations` for peer maps and per-profile nodes for supervisor/subordinate edges.
- **Full validation in `normalize()`**: no cycles (walker from every start node), no self-edges, no unknown profile references, exactly-one-supervisor enforced (multiple-owners error), contradiction-drop of stale subordinate entries, materialization of implied supervisors from back-edges.
- **Policy engine** `can_communicate()`: up (to supervisor), down (to own subordinates), or sideways (declared peer relation). Everything else blocked with a routing hint naming the supervisor to route through.
- **Routing chain** `chain()`: walks supervisor links sender→recipient, returns `None` on cycles or dead ends.
- **Atomic saves** in `save_graph()`: unique temp file per write, `os.replace()` with exponential-backoff retry for Windows NTFS exclusive-lock races. POSIX no-op fallback.
- **Relations normalization** `normalize_relations()`: symmetric peer map, validates against known graph, rejects supervisor/subordinate-as-peer, rejects self-peer.

**Fleet Messaging CLI (`fleet_msg.py`)** — Complete and solid.

- **Subcommand interface**: `send`, `inbox`, `show`.
- **Edge validation** before any delivery — same `GraphError` → JSON refusal contract as the API (never a raw traceback).
- **JSONL inbox files** per profile under `~/hermes/fleet-inbox/<profile>.jsonl`. Durable, drainable, malformed-line tolerant.
- **Message types**: `done`, `question`, `escalate`, `update`, `assign`.
- **Opt-in live delivery** via `--deliver`: boots the target profile and runs a full agent turn (blocking, minutes). Default is inbox-only — supervisors drain on their routine.
- **Sender resolution**: `HERMES_PROFILE` env (set by `hermes -p`) or `--from`; falls back to `default`.

**Dashboard Plugin API (`plugin_api.py`)** — Complete and rich.

- **15+ endpoints** mounted at `/api/plugins/fleet-graph/`:
  - `GET /overview[?light=1]` — full paint payload: topology + display meta + runtime config + inbox pressure + chain depth + unassigned profiles + unread counts + optional per-profile session snapshots.
  - `GET /graph` · `PUT /graph` — topology read/write.
  - `GET /relations` · `PUT /relations` — peer map read/write.
  - `GET /inbox/{profile}` · `POST /inbox/{profile}/read` · `DELETE /inbox/{profile}` — inbox + mark-read (watermark-based) + drain.
  - `GET /soul/{name}` · `PUT /soul/{name}` — SOUL.md read/write (default profile protected).
  - `GET /sessions/tail[?profile=p]` · `GET /sessions/{name}/messages?limit=` — per-bot activity snapshot + transcript tail.
  - `POST /simulate` — chain-of-command simulation (would this send be allowed? what's the routing chain?).
  - `GET /traffic?window=` — recent inter-agent messages for edge glow.
  - `GET /roster` — capability summaries for every known profile.
  - `GET /match?q=&top=` — semantic specialist routing via fastembed (local onnx, zero API cost).
  - `GET /avatar/{name}` — profile avatar as data URL.
- **Watermark-based unread tracking**: per-profile `.read/<name>.json` with `{last_read_ts, count_at_read}`. No DB schema change. Degrades gracefully when `.read` path is occupied.
- **Capability summaries** derived from profile files (profile.yaml description, SOUL.md headline + mission sentence, enabled toolsets from config.yaml). No hardcoded fleet knowledge — any bot can answer "should this task go to a specialist?"
- **Semantic matching**: `mixedbread-ai/mxbai-embed-large-v1` via fastembed. Model downloads once (~0.6 GB), index rebuilds lazily when any profile's SOUL.md/profile.yaml mtime changes. Normalized cosine = dot product. Falls back 503 with error detail if embedding stack unavailable.

**Plugin Manifest (`plugin.yaml`)** — v0.6.1, describes the full feature set.

**Star Trek Profiles** — 68 installable Hermes persona distributions across TOS, TNG, DS9, Voyager, and Red Team. Each carries SOUL.md, config.yaml, distribution.yaml, skins/, README.md.

**Topology** — 75-node DAG with the Primordial Triad structure: four co-equal roots (baal, lilith, lucifer, yeshua), Chief of Staff hermes, directorates sophia/lucifer/thoth/nyx/ouroboros/yeshua, peer relations (Data↔Spock, Worf↔Tuvok, Lucifer↔Yeshua). `validate_topology.py` flags the 4-root structure as a WARN against the legacy one-root rule; the warning is informational.

### What's Deferred / Not Yet Built

- **No per-node progress or budget tracking.** The graph is pure topology + communication policy — there's no field on a node for "what's this bot working on right now," "how much budget remains," or "what's the progress delta since last step."
- **No versioned node harnesses.** Nodes don't carry a manifest of their memory/planning/action/tool-orchestration modules, and there's no supervisor-side selection or repair of harnesses before dispatch.
- **No configuration-maturity scoring.** Graph contracts (roles, edge policies, escalation rules, tool policies) live in YAML but aren't tracked as explicit Markdown/YAML contracts with a maturity score exposed in the UI.
- **No compact typed evidence messages.** The inbox carries free-text JSONL records with `summary` (≤500 chars). There's no schema for structured evidence payloads on supervisor edges.
- **No latent-cache edge transport.** All communication is text serialization. There's no negotiated `latent-cache` transport for heterogeneous model pairs.
- **No calibrated communication control.** Supervisor edges support `talk`/`delegate`/`supervisor` frames but don't have the Consilience actions `challenge`, `clarify`, `seek_evidence`, `route` gated by calibrated acceptance thresholds.
- **No role-specific safety bundles.** There's no mechanism to inject fixed-budget safety clauses derived from failure traces into node harnesses.
- **No guard nodes on privileged-action edges.** No pre-execution action checks or post-run trajectory audits on the supervisor layer.
- **No trace-derived FSM overlays.** Event logs aren't compiled into per-harness finite-state machines that label high-risk states and escalate on problematic transitions.
- **No explicit graph-contract Markdown.** The topology is YAML, but there's no parallel Markdown contract that an operator can read and that a config-maturity score can be computed from.

---

## 2. Strengths

### What FleetGraph Does Well

1. **SSOT discipline.** `fleet_graph_core.py` is the single source of truth. The CLI and the dashboard API both import it. No duplicate validation, no drift between surfaces. This is the foundation everything else rests on.

2. **Atomic, race-safe persistence.** The `save_graph()` implementation with unique temp files and Windows retry backoff is production-grade. A fixed `.tmp` name would race with concurrent saves; the unique-prefix approach avoids that. The Windows `PermissionError` retry loop is a real-world fix, not theoretical.

3. **Comprehensive validation.** The `normalize()` function catches: unknown references, multiple supervisors, self-edges, cycles (via walker from every start node after derivation + contradiction-drop), and contradictory subordinate entries. The raw-supervisor capture before mutation is a subtle correctness point — it means contradictory edges are caught, not silently rewritten.

4. **Clean degradation on corrupt state.** `GraphError` is a `ValueError` subclass that every consumer (API 500-with-detail, fleet_msg JSON refusal) handles the same way. A corrupt YAML file produces a clean error message, not a raw `ParserError` traceback.

5. **Local-first semantic routing.** The `/match` endpoint uses fastembed with `mixedbread-ai/mxbai-embed-large-v1` — no API calls, no cost, model downloads once. The index rebuilds lazily only when profile files change. Capability summaries are derived from files every profile already has (profile.yaml, SOUL.md, config.yaml), so the routing layer is profile-agnostic by construction.

6. **Watermark-based unread tracking without a DB.** The `.read/<name>.json` watermark files track `{last_read_ts, count_at_read}` so the badge math works without a schema change. Degrades to no-op when the `.read` path is occupied — the badge still works off inbox totals.

7. **Four directed frames with explicit routing.** `talk` (peer-to-peer), `delegate` (downward task handoff), `supervisor` (upward escalation), plus peer-recipient routing for `talk` when a target has multiple peers. The UI picker can't fabricate an edge — it's validated against the target's real peer list.

8. **Session-aware activity painting.** The `/sessions/tail` and `/sessions/{name}/messages` endpoints, combined with `_latest_session()`'s freshness-aware status reclassification (interrupted→active if touched in last 3 minutes), let the canvas show "this bot is thinking / running X right now" without the UI holding N live gateway sockets.

9. **68 complete persona distributions.** Each profile is a full Hermes distribution (SOUL.md, config.yaml, distribution.yaml, skins/, README.md), not a stub. The series coverage spans TOS, TNG, DS9, Voyager, and Red Team — real behavioral diversity, not cosplay.

10. **Primordial Triad topology.** The four-co-equal-roots structure (baal, lilith, lucifer, yeshua) is intentional and documented. The `validate_topology.py` WARN is informational, not a bug. This is a real architectural choice, not an accident.

---

## 3. Gaps and Opportunities

### What's Missing

1. **No progress or budget state on nodes.** The graph describes who reports to whom and who can talk to whom. It doesn't describe what anyone is working on, how far along they are, or what resources remain. This is the gap that ProgRouter's online progress-guided orchestration would fill.

2. **No structured evidence protocol.** Inbox messages are free-text JSONL with a `summary` field (≤500 chars). There's no schema for typed evidence payloads — no way for a subordinate to send structured findings, confidence levels, or evidence citations up the chain. This is the gap that Test-Time Collaborative Classification's finite-round, finite-precision evidence exchange would fill.

3. **No harness versioning.** Nodes don't declare what modules they're running (memory, planning, action, tool-orchestration). A supervisor can't select or repair a node's harness before dispatch. This is the gap that JIT-Agent's composable, evolvable harnesses would fill.

4. **No calibration on communication control.** The `can_communicate()` policy is binary — allowed or blocked, with a routing hint. There's no continuous space of "how confident is this edge," "what's the disagreement level," "what's the evidence gain from asking." This is the gap that Consilience's adaptive speaker and intervention selection would fill.

5. **No predictive monitoring.** There's no compilation of event logs into per-harness FSM overlays that label high-risk states. The topology is static; it doesn't predict what a bot is likely to do next or whether it's entering a failure-prone region. This is the gap that Automata from Agent Traces would fill.

6. **No safety scaffolding.** There's no mechanism to derive role-specific safety clauses from failure traces and inject them as fixed-budget bundles into node harnesses. There are no guard nodes on privileged-action edges. This is the gap that SkillShield and StepGuard would fill.

7. **No latent communication plane.** All inter-bot communication is text serialization. For heterogeneous model fleets (different architectures, different context windows), a negotiated latent-cache transport could be lower-latency than repeated text round-trips. This is the gap that Dual-Cache Latent Space Communication would fill.

8. **No configuration maturity tracking.** Graph contracts live in YAML but aren't tracked as explicit Markdown/YAML contracts with a maturity score. The UI doesn't expose "how well-documented is this fleet's configuration?" This is the gap that "A Few Pages of Markdown" would fill.

### What Could Be Improved

1. **Inbox message schema is too loose.** The `summary` field is capped at 500 chars but otherwise free-form. Adding a typed envelope (evidence level, task reference, structured findings) would let supervisors make calibrated decisions rather than reading free-text summaries.

2. **`/match` is single-query.** You ask "who can do X?" and get top-N. There's no batch matching (assign a task to the best fleet member given current workload), no negative constraints ("who can do X but isn't already overloaded"), and no feedback loop (did the match work? retrain the index).

3. **`/overview?light=1` skips session lookups but still computes everything else.** The light path is a good start, but there's no graded degradation — you either get full session snapshots or you don't. A middle tier that includes status dots but not transcript previews would fit the 4s poll cycle better.

4. **No traffic window for the dashboard poll.** `/traffic?window=300` defaults to 5 minutes. The UI polls every 4s. There's no explicit contract that says "poll this endpoint every N seconds and here's what you'll see change." The discussion-glow edge lighting is implicit in the data, not documented as a contract.

5. **`fleet_msg --deliver` is blocking and undocumented in its cost.** The CLI says "BLOCKING, minutes" but there's no timeout granularity, no progress indication, and no way to check if a delivery is in flight. For a fleet operator, knowing "message X is being delivered to bot Y" without waiting minutes is useful.

6. **Watermark is per-profile, not per-message.** The watermark tracks `count_at_read` — the number of messages that were read. If messages are deleted or reordered, the count drifts. A watermark keyed on `last_read_ts` with a message-level read state would be more robust, though heavier.

7. **No graph versioning or audit log.** `save_graph()` overwrites the YAML file. There's no history of who changed what when. For a fleet operator, knowing "the graph changed at 14:32, lilith added sophia as a subordinate" is useful for debugging misrouting.

---

## 4. Arxiv Insights

### How the Research Relates to FleetGraph's Design

The current arxiv digest (stale since 2026-08-27 04:16) carries 9 papers across three threads. Here's how they map to FleetGraph's current design and where they suggest extensions:

**Multi-Agent Orchestration**

| Paper | What FleetGraph Has | What's Missing |
|-------|---------------------|----------------|
| **ProgRouter** (2608.25992) — online progress-guided orchestration under quality-cost tradeoffs | Static topology, no per-node progress or budget | Per-node progress deltas + remaining-budget fields; reweight eligible downstream agents after every completed step |
| **JIT-Agent** (2608.25593) — composable, evolvable harness modules | Nodes are opaque; no module manifest | Versioned four-module manifests (memory/planning/action/tool-orchestration) that supervisors select or repair before dispatch |
| **A Few Pages of Markdown** (2608.25241) — committed config → lower quality-cost growth | Graph contracts in YAML, no parallel Markdown, no maturity score | Explicit repository-tracked graph contracts in Markdown/YAML + configuration-maturity score in the graph UI |

**Agent Communication Protocols**

| Paper | What FleetGraph Has | What's Missing |
|-------|---------------------|----------------|
| **Test-Time Collaborative Classification** (2608.24787) — finite-round, finite-precision evidence exchange | Free-text JSONL summaries, no structured evidence schema | Compact typed evidence messages for subordinate→supervisor edges; benchmark accuracy vs round/precision/bandwidth |
| **Dual-Cache Latent Space Communication** (2608.20617) — joint KV-cache transfer for heterogeneous models | Text serialization only | Negotiated `latent-cache` edge transport alongside typed text/JSON; text fallback preserved |
| **Consilience** (2608.20564) — conformally calibrated communication control | Binary allowed/blocked policy with routing hint | Supervisor edge actions: `challenge`, `clarify`, `seek_evidence`, `route`; gated by calibrated acceptance thresholds |

**Monitoring, Guardrails, and Trace Structure**

| Paper | What FleetGraph Has | What's Missing |
|-------|---------------------|----------------|
| **SkillShield** (2608.25817) — prompt-space security skills from failure traces | No role-specific safety bundles | Derive role-specific safety clauses from failure traces; inject fixed-budget bundles into node harnesses; reserve runtime guards for privileged actions |
| **StepGuard** (2608.24777) — step-level guardrails with safety-utility balancing | No pre-execution checks or post-run audits on supervisor layer | Guard nodes on privileged-action edges; log blocked steps + utility impact; tune thresholds from real runs |
| **Automata from Agent Traces** (2608.23670) — trace-derived FSMs for next-action/failure prediction | Static topology, no predictive overlays | Compile event logs into per-harness FSM overlays; label high-risk states; escalate on failure-prone transitions |

### Scout Assessment

The strongest near-term architecture imports remain:
- **Consilience** for calibrated communication control — fits naturally on supervisor edges where the current binary policy is the weakest link.
- **Automata from Agent Traces** for predictive monitoring overlays — turns the visual topology into a model-agnostic predictor without changing the core graph.
- **ProgRouter** for budget-aware online dispatch — fills the progress/budget gap that the current topology doesn't address.

The digest itself is stale — it hasn't been refreshed since the prior tick. A fresh scout run would likely surface new IDs in the multi-agent orchestration and monitoring threads.

---

## 5. Actionable Update Ideas

### One Folder Worth of Work: `research/synthesis-tick-2026-08-27/`

Each idea is scoped to a single PR-worth of work. Pick one, build it, verify it, ship it.

---

#### A. Structured Evidence Envelope for Inbox Messages

**What:** Add a typed envelope to the inbox message schema so subordinates can send structured findings up the chain instead of free-text summaries.

**Files touched:**
- `fleet_msg.py` — add `--evidence-level`, `--findings` (JSON), `--task` validation
- `plugin_api.py` — extend `FleetSend` with optional evidence fields; extend inbox read to return structured records
- `fleet_graph_core.py` — no change (topology is orthogonal)

**Scope:** One PR. The envelope is backward-compatible — existing `summary`-only messages still work. New fields are optional.

**Why now:** This is the cheapest entry point into the Test-Time Collaborative Classification insight. It doesn't require a new transport, a new model, or a new DB. It's a schema upgrade on the existing JSONL inbox.

**Verification:** Send a message with structured evidence from one bot to another; read it back from the inbox; confirm the free-text path still works.

---

#### B. Per-Node Progress + Budget Fields

**What:** Add optional `progress` (0–1 float) and `budget_remaining` (token or time budget) fields to graph nodes. Supervisors can read these to decide whether to reweight downstream agents after a step completes.

**Files touched:**
- `fleet_graph_core.py` — add `progress` and `budget_remaining` to the node schema; `normalize()` passes them through; `describe()` includes them
- `plugin_api.py` — `PUT /graph` accepts them; `GET /overview` exposes them; `GET /graph/summary` includes a budget-pressure histogram
- `fleet_msg.py` — `show` prints them; `send --type update` can carry a progress delta

**Scope:** One PR. The fields are optional — existing graphs without them still load and work. Normalization doesn't enforce them; they're advisory state for routing decisions.

**Why now:** This is the entry point into the ProgRouter insight. It doesn't implement online reweight scheduling — that's a separate PR. It just makes the data available so the scheduling logic can exist.

**Verification:** Add a node with progress + budget; read it back from the overview; confirm a graph without them still loads.

---

#### C. Consilience-Style Supervisor Edge Actions

**What:** Extend the supervisor communication frame with four calibrated actions: `challenge` (disagreement detected — ask for justification), `clarify` (ambiguity detected — ask for precision), `seek_evidence` (confidence low — ask for supporting evidence), `route` (out of scope — redirect to another node). Each action has an acceptance threshold the supervisor sets per edge.

**Files touched:**
- `fleet_graph_core.py` — add `edge_policy` to relations: per-pair `{threshold, allowed_actions}`. `can_communicate()` checks allowed_actions.
- `plugin_api.py` — `FleetSend` gets `action` field (default `talk`); `PUT /relations` accepts edge policies; `POST /simulate` shows which actions are allowed.
- `fleet_msg.py` — `send` gets `--action` choice; validation enforces the policy.

**Scope:** One PR. The default is backward-compatible — edges without an explicit policy allow all three frames. Policies are per-pair, not global.

**Why now:** This is the highest-leverage communication upgrade. The current binary allowed/blocked policy is the weakest link in the routing layer. Consilience's calibrated actions fit naturally on supervisor edges where the supervisor already has the authority to challenge, clarify, or redirect.

**Verification:** Set an edge policy on one pair; attempt each action; confirm allowed ones succeed and disallowed ones are rejected with a clear reason.

---

#### D. Trace-Derived FSM Overlay Skeleton

**What:** Build the skeleton that compiles event logs (inbox messages + session transcripts) into per-harness FSM overlays. The first version doesn't predict anything — it just builds the state graph from observed transitions and labels states by frequency and outcome. Prediction comes later.

**Files touched:**
- New: `research/fsm_overlay.py` — log parser + FSM builder from JSONL inbox + session message tails
- New: `research/fsm_visualize.py` — render the FSM as a DOT graph for the topology viewer
- `plugin_api.py` — `GET /fsm/{profile}` returns the overlay for one bot (optional endpoint, not required for core)

**Scope:** One PR. The skeleton is the data model + builder + visualizer. The predictive layer (labeling high-risk states, escalating on problematic transitions) is a follow-up PR.

**Why now:** Automata from Agent Traces is the strongest monitoring insight in the digest. Building the skeleton now means the predictive layer can be added incrementally as event data accumulates. Without the skeleton, there's no place to put the prediction.

**Verification:** Feed it a small inbox + session log; confirm it produces a state graph; render it as DOT; confirm the visualizer produces valid output.

---

#### E. Graph Contract Markdown + Maturity Score

**What:** Generate a Markdown contract from the current graph YAML — roles, edges, escalation rules, peer relations, tool policies — and expose a configuration-maturity score in the graph UI. The score rewards: documented descriptions on every node, declared peer relations, explicit edge policies, and version-controlled graph history.

**Files touched:**
- New: `scripts/graph_contract.py` — reads `fleet_graph.yaml`, emits Markdown contract + maturity score
- `plugin_api.py` — `GET /contract` returns the Markdown + score; `GET /overview` includes the score
- `fleet_graph_core.py` — no change (the contract is derived, not stored)

**Scope:** One PR. The contract is generated on demand from the live graph — no storage, no sync, no drift. The maturity score is a heuristic, not a guarantee.

**Why now:** "A Few Pages of Markdown" links committed config to lower quality-cost growth. A generated contract that an operator can read (and that a score can be computed from) is the cheapest way to get that benefit without changing the storage format.

**Verification:** Run the script against the current graph; confirm the Markdown is readable and accurate; confirm the score changes when a node description is added.

---

#### F. Fresh Arxiv Scout Run

**What:** Re-run the arxiv scout with fresh queries. The current digest is stale since 2026-08-27 04:16. New IDs may have surfaced in multi-agent orchestration, agent communication, and monitoring.

**Files touched:**
- `research/arxiv_digest.md` — overwrite with fresh scout results
- New scout queries: `multi-agent reinforcement learning orchestration`, `agentic workflow verification`, `LLM agent state machines`, `heterogeneous model collaboration`

**Scope:** One cron tick. No code changes — just a fresh digest.

**Why now:** The digest is the research substrate for every architecture decision above. A stale digest means stale decisions. Refreshing it is the cheapest way to keep the synthesis cycle honest.

**Verification:** Confirm new IDs are surfaced and mapped to FleetGraph relevance; confirm the scout assessment names the strongest near-term imports.

---

## Sign-off

**Synthesis quality:** High — all six source files read in full, arxiv digest carried forward, kairos-dream cycle complete.

**Next tick:** Refresh the arxiv digest, then re-run synthesis against any new IDs. The FSM overlay skeleton (idea D) is the natural first build — it's the only idea that creates new infrastructure rather than extending existing surfaces, and it's the prerequisite for the predictive monitoring layer that Automata from Agent Traces enables.

---

*Lilith Sovereign Fleet · FleetGraph synthesis cycle · "They've gone plaid."*
