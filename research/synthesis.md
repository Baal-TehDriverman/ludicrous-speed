# FleetGraph Synthesis — 2026-08-27 EDT

**Synthesized by:** FleetGraph Synthesis Engine (kairos-dream tick)
**Inputs:** README.md, fleet_graph_core.py, fleet_msg.py, dashboard/plugin_api.py, plugin.yaml, research/arxiv_digest.md
**Codebase SSOT version:** plugin.yaml v0.6.1
**Research context:** 9 active arxiv IDs across 3 threads; no new IDs this scout tick

---

## 1. Current State of the Codebase

### What's Implemented

| Component | File | Lines | Status |
|-----------|------|-------|--------|
| Topology SSOT | `fleet_graph_core.py` | 360 | **Complete.** DAG validation, cycle detection, supervisor/subordinate derivation, peer relations, atomic saves with Windows concurrency retry. SSOT for both `fleet-msg` CLI and dashboard API. |
| Inter-bot CLI | `fleet_msg.py` | 164 | **Complete.** `send`/`inbox`/`show` commands. Dual transport: durable inbox JSONL + optional live `--deliver`. JSON refusal contract on graph errors (never a raw traceback). Five message types: `done`, `question`, `escalate`, `update`, `assign`. |
| Dashboard API | `dashboard/plugin_api.py` | 988 | **Mostly complete.** 14 REST endpoints: `GET/PUT /graph`, `GET /overview[?light]`, `GET /graph/summary`, `GET /relations`, `PUT /relations`, `POST /simulate`, `GET/POST/DELETE /inbox/{p}`, `POST /inbox/{p}/read`, `GET /soul/{n}`, `PUT /soul/{n}`, `GET /avatar/{n}`, `GET /sessions/tail`, `GET /sessions/{n}/messages`, `GET /roster`, `GET /match`, `GET /traffic`, `POST /send`. Unread watermarks, session tails via `hermes_state.SessionDB`, semantic matching via fastembed (`mixedbread-ai/mxbai-embed-large-v1`), traffic window. |
| Plugin manifest | `plugin.yaml` | 4 | v0.6.1 — graph canvas, deck view, inspector, message composer, live activity, semantic routing, member creation (advertised but not implemented in API). |
| Fleet tooling | `scripts/`, `maintenance/` | — | `validate_topology.py`, `fleet_status.py`, `topology_view.py`, `install_profile.py`, `sync_research.py`, `fleet_maint.py` (24/24 tests). |
| Research | `research/` | — | `arxiv_synthesis.md` (12 papers mapped), `ideas_architecture.md` (3 architecture ideas from tick), `ideas_ux.md`, `ideas_messaging.md`, `synthesis.md`. |

### Fleet Topology
75-node DAG in `topology/fleet_graph.yaml` — **Primordial Triad** structure with four co-equal roots: `baal` (King/Operator), `lilith` (Fleet Commander), `lucifer` (Illumination/Red Team), `yeshua` (Legal & Ethics). `hermes` is Chief of Staff. Six directorates: sophia, lucifer, thoth, nyx, ouroboros, yeshua. Peer relations: Data↔Spock, Worf↔Tuvok, Lucifer↔Yeshua. The 4-root WARN from `validate_topology.py` is intentional and documented.

### What's Deferred / Missing

1. **Member creation endpoint** — README advertises "Create members — full dialog with model picker, skills, toolsets" but `plugin_api.py` has no `POST /members`. The installer (`manage.py`) handles this offline.
2. **Graph audit / versioning** — `save_graph()` overwrites atomically but keeps no history. No `GET /graph/history`, no undo, no diff.
3. **Supervisor communication controller** — Messages validated for edge existence only. No structured `challenge`/`clarify`/`seek_evidence`/`route` vocabulary on supervisor edges.
4. **Predictive monitoring** — DAG is purely descriptive. No trace-derived FSM overlays, no failure-likelihood annotations.
5. **Traffic pagination** — `GET /traffic` reads every inbox file on every call with no cursor/limit. O(N) per poll.
6. **`hermes_state.SessionDB` runtime import** — `_latest_session()` imports inside try/except at call time. Silent `None` return if module path changes.
7. **No WebSocket / SSE push** — All activity is poll-based. No live push for graph updates.
8. **No RAMP maturity scoring** — Advertised in README research table but not implemented.
9. **No pre-execution guard layer** — `can_communicate()` validates topology edges but not action safety.
10. **Semantic index rebuild has no debounce** — `_semantic_index()` rebuilds on every call if any mtime changed.

---

## 2. Strengths

1. **True SSOT architecture.** `fleet_graph_core.py` is imported by the CLI, the dashboard API, and bots. All three surfaces share identical validation, normalization, and save logic. No drift between surfaces is possible by construction.

2. **Correct concurrent saves.** `save_graph()` uses atomic `os.replace()` with exponential backoff retry (0.05→0.8s, 5 attempts) for Windows NTFS exclusive-rename races. Each save gets a unique sibling temp file — no fixed `.tmp` collision. POSIX no-op, Windows-correct.

3. **Path-safety gates everywhere.** `_profile_dir()` rejects `..`, `.`, embedded slashes/backslashes, absolute paths, and names >255 bytes before any filesystem access. Works through configured `profile_aliases` indirection. The write guard on `PUT /soul/{n}` uses the resolved path, not the user-supplied name — aliases can't bypass it.

4. **Semantic routing is fully local.** `/match` uses fastembed with `mixedbread-ai/mxbai-embed-large-v1` — zero API cost, works offline. Cosine similarity via normalized dot product. Lazy index rebuild only when any profile's `SOUL.md`/`profile.yaml` mtime changes. Capability summary derives from three sources in priority order: `profile.yaml` description → SOUL.md headline + first "You are" sentence → enabled toolsets from `config.yaml`. Generic stopwords filtered; own name always appended as routing keyword.

5. **Watermark-based unread tracking.** Mark-read advances a pointer (`count_at_read`) rather than mutating inbox files. Inbox files are append-only audit trails; badges are a derived view. `_read_watermark()` degrades gracefully to no-op if `.read` dir is occupied or unwritable — badge math falls back to inbox totals.

6. **Graceful degradation throughout.** Corrupt YAML → `GraphError` → JSON refusal contract (never a traceback to bots). Missing `hermes_state` → sessions show as `null` rather than 500. Watermark dir unwritable → badge math degrades. Corrupt inbox lines → skipped, never crash.

7. **Relations are symmetric by construction.** `normalize_relations()` stores once, derives both ways, validates against supervisor/subordinate edges to prevent semantic confusion (peer can't also be supervisor or subordinate). Unknown profiles rejected at validation time.

8. **Topology handles the Primordial Triad correctly.** Four co-equal roots, peer relations, and the `profile_aliases` indirection are all first-class. The 4-root WARN from `validate_topology.py` is informational and intentional.

9. **Fleet message delivery is opt-in and blocking-aware.** `--deliver` triggers a full agent turn in the target, blocks the sender for minutes, and is clearly documented as opt-in. Normal flow is inbox-only; supervisors drain on their routine.

10. **`can_communicate()` has a clear, unambiguous policy.** Up (to supervisor), down (to own subordinates), or sideways (to declared peer). Everything else is blocked with a specific routing hint naming the intermediate supervisor. The refusal message tells the sender exactly who to route through.

---

## 3. Gaps and Opportunities

### A. API Surface Gaps

| Gap | Impact | Effort |
|-----|--------|--------|
| No member creation endpoint | UI "Create member" button shells out to `manage.py` or is non-functional | Medium |
| No graph history/undo | Operator rewires topology, makes a mistake, no way to roll back | Medium |
| No `POST /graph/diff` | UI cannot show "you're about to detach 3 subordinates" before committing | Low |
| Traffic endpoint unbounded | Polling traffic on a large fleet reads all inboxes every 4s | Low — add `since` cursor + `limit` |

### B. Monitoring & Predictivity Gaps

| Gap | Impact | Effort |
|-----|--------|--------|
| No trace-derived FSM overlays | DAG shows structure but not behavior patterns | High — trace ingestion + FSM compilation |
| No failure-likelihood annotations | All nodes look equally healthy; no early warning | Medium — annotate from session statuses |
| No pre-execution guard | Unsafe subordinate actions run without interception | Medium — guard node pattern on privileged edges |
| No RAMP maturity score | No quantified signal of fleet configuration health | Low — static analysis over profile files |

### C. Protocol Gaps

| Gap | Impact | Effort |
|-----|--------|--------|
| No supervisor controller vocabulary | Supervisors can't issue structured `challenge`/`clarify`/`seek_evidence`/`route` | Medium — extend `_SEND_KINDS` + handler logic |
| No typed evidence messages | Subordinate-to-supervisor edges carry free-text only; no structured evidence for collective inference | Low — add `evidence` frame type with typed payload |
| No latent-cache transport | Heterogeneous local-model fleets limited to text/JSON | High — XKV-style KV-cache transfer |
| No structured delegation protocol | `delegate` frame is fire-and-forget; no result chaining, no active delegation tracking | Medium — delegation state + result routing |

### D. Resilience Gaps

| Gap | Impact | Effort |
|-----|--------|--------|
| `hermes_state` import at runtime | Silent failure mode if module path changes | Low — import at module top, surface import error on startup |
| Semantic index rebuild thrash | Rapid profile edits cause repeated full re-embeds | Low — debounce timer (2s cooldown) |
| No WS/SSE push | 4s polling is wasteful for large fleets | High — FastAPI WebSocket or SSE endpoint |

---

## 4. ArXiv Insights

### 4.1 New This Tick (not yet in `arxiv_synthesis.md`)

**ProgRouter: Online Progress-Guided Orchestration (2608.25992)**
Step-wise routing from evolving progress, quality, time, and cost signals. FleetGraph currently routes once per message send. Adding per-node progress deltas and remaining-budget fields to inbox records would let a meta-gate reweight eligible downstream agents after every completed step — matching ProgRouter's online dispatch model. This is directly applicable to the existing DAG: a supervisor with three subordinates working on a multi-step task could re-rank which subordinate to ping next based on the step that just completed, rather than pre-assigning the full chain.

**JIT-Agent: Just-in-Time Harness Evolution (2608.25593)**
Composable and evolvable memory, planning, action, and tool-orchestration modules. FleetGraph nodes have `toolsets` (static config.yaml listing) but no versioned harness manifest. Representing each node's active harness as a four-module manifest (`memory`, `planning`, `action`, `tools`) that supervisors can select or repair before dispatch — with outcome measurements retained for later selection — would close the gap between FleetGraph's static node configs and JIT-Agent's adaptive harness model.

**RAMP: Committed AI Configuration and Lower Quality Cost (2608.25241)**
The reported link between committed agent configuration and lower quality-cost growth supports explicit, repository-tracked graph contracts. FleetGraph already stores everything as YAML/Markdown — topology, profiles, SOUL.md, config.yaml. The missing piece is a **configuration-maturity score** displayed in the graph UI: a single number showing how well-configured the fleet is, derived from % of profiles with SOUL.md + toolsets + alias + description + avatar, graph connectedness, and relation coverage. This gives the operator a concrete signal for "is my fleet actually ready?"

**Test-Time Collaborative Classification over Multi-Agent Networks (2608.24787)**
Finite-round, finite-precision evidence exchange as a model for constrained communication over directed agent edges. FleetGraph's inbox is unbounded natural language. Adding a compact typed evidence frame (`confidence`, `label`, `feature_summary`, `round`) on subordinate-to-supervisor edges would enable collective inference without full-text overhead — a subordinate can push a structured evidence summary up, and the supervisor aggregates before deciding. Fits the existing upward-message channel with minimal protocol change.

### 4.2 Carried Forward (already in `arxiv_synthesis.md`, still highest-priority)

**Consilience (2608.20564) — highest priority import.** Calibrated communication control from uncertainty, disagreement, evidence gain, and redundancy. FleetGraph's current `talk`/`delegate`/`supervisor` frames are too coarse. Extending to Consilience's vocabulary (`challenge`, `clarify`, `seek_evidence`, `route`) with calibrated acceptance thresholds would make the DAG self-regulating rather than passively descriptive.

**Automata from Agent Traces (2608.23670) — most impactful long-term.** Trace-derived FSMs that turn FleetGraph's visual topology into a model-agnostic predictor of next actions and failures. Compile event logs (inbox messages + session statuses) into per-harness FSM overlays, annotate high-risk states, and escalate when live transitions enter failure-prone regions. The DAG becomes predictive, not merely descriptive.

**StepGuard (2608.24777).** Pre-execution action checks + post-run trajectory audits fit a supervisor layer that intercepts unsafe subordinate operations while measuring utility loss. Place guard nodes on privileged-action edges, log blocked steps plus utility impact.

**SkillShield (2608.25817).** Compact failure-derived safety skills constrain tool-using nodes without per-edge runtime classifiers. Derive role-specific safety clauses from failure traces and inject fixed-budget bundles into node harnesses.

**XKV / Latent-Space Communication (2608.20617).** KV-cache transfer between heterogeneous frozen LMs is faster than text serialization. For mixed-model fleets, a negotiated `latent-cache` edge transport alongside typed text/JSON. Should remain opt-in with text fallback — the learned translator depends on model-pair geometry.

### 4.3 Scout Assessment

No new IDs this tick. The strongest near-term architecture imports remain: **Consilience** for calibrated communication control, **Automata from Agent Traces** for predictive monitoring overlays, and **ProgRouter** for budget-aware online dispatch (new this tick). The new RAMP maturity-score idea is low-effort and immediately actionable.

---

## 5. Actionable Update Ideas

### Priority 1 — Supervisor Communication Controller (Consilience-inspired)

**Folder:** `dashboard/` + `fleet_msg.py`
**What:** Extend `_SEND_KINDS` with `challenge`, `clarify`, `seek_evidence`, `route`. Add a `SupervisorController` class that scores fleet state (uncertainty, disagreement, evidence gain, redundancy) and proposes the optimal next intervention. Each intervention is gated by a calibrated acceptance threshold. The `POST /send` handler already validates edges — the new kinds ride the same validation, just with richer semantics on the receiving end.

**Files to touch:**
- `dashboard/plugin_api.py` — extend `_SEND_KINDS`, add `POST /supervisor/act` endpoint with intervention scoring
- `fleet_msg.py` — add `act` subcommand with `--intervention` flag (`challenge|clarify|seek_evidence|route`)
- `fleet_graph_core.py` — no changes needed (edge validation already supports the new kinds)

**Estimated effort:** ~150 lines new code.
**Research backing:** Consilience (2608.20564) — highest-priority import, already identified.

### Priority 2 — Graph Audit Log + Diff

**Folder:** `fleet_graph_core.py` + `dashboard/`
**What:** Append-only changelog in `~/.hermes/fleet-graph-changelog/`. Each `save_graph()` call snapshots the prior state with a timestamp and optional operator note before replacing. `GET /graph/history` returns the list; `POST /graph/rollback?to=<timestamp>` restores a prior state. Add `GET /graph/diff?from=<ts>&to=<ts>` for a pure-function diff between two states — shows exactly which edges changed, which profiles were added/removed.

**Files to touch:**
- `fleet_graph_core.py` — `save_graph()` writes snapshot before replacing; new `graph_history_dir` path
- `dashboard/plugin_api.py` — add `GET /graph/history`, `POST /graph/rollback`, `GET /graph/diff`

**Estimated effort:** ~80 lines.
**Resilience impact:** Eliminates the "operator made a mistake, no way to roll back" risk. Directly supports the RAMP committed-configuration thesis.

### Priority 3 — RAMP Fleet Maturity Score

**Folder:** `dashboard/`
**What:** `GET /fleet/maturity` returns a 0–100 score:
- % of profiles with SOUL.md (20 pts)
- % with non-empty description in profile.yaml (15 pts)
- % with toolsets configured in config.yaml (15 pts)
- % with profile_aliases configured (10 pts)
- % with avatar assets (10 pts)
- Graph connectedness — no orphans, every node reachable from a root (15 pts)
- Relations defined for nodes whose directorates require coordination (15 pts)

**Files to touch:** `dashboard/plugin_api.py` — one endpoint. Scores are pure functions over existing data; no new state.

**Estimated effort:** ~40 lines.
**Research backing:** RAMP maturity model (2608.25241) — new this tick.

### Priority 4 — Typed Evidence Frame

**Folder:** `dashboard/` + `fleet_msg.py`
**What:** Add `evidence` to `_SEND_KINDS`. Payload: `{label, confidence, features, round}`. Subordinate pushes structured evidence up; supervisor aggregates from multiple subordinates before deciding. Fits the existing upward-message channel with minimal protocol change. The `POST /send` handler validates the edge; the new frame type is just a richer payload.

**Files to touch:**
- `dashboard/plugin_api.py` — extend `FleetSend` model, add `evidence` kind handler
- `fleet_msg.py` — add `evidence` choice to `--type`

**Estimated effort:** ~30 lines.
**Research backing:** Test-Time Collaborative Classification (2608.24787) — new this tick.

### Priority 5 — Member Creation Endpoint

**Folder:** `dashboard/`
**What:** `POST /members` with payload `{name, model, provider, toolsets, supervisor, soul_template}`. Creates profile directory, writes `SOUL.md`, `config.yaml` (from template + overrides), `profile.yaml` (from template), adds node to graph with specified supervisor, returns created profile path. Must use the same path-safety gates as `_profile_dir()`.

**Files to touch:** `dashboard/plugin_api.py` — add endpoint. Mostly profile scaffolding logic; reuses existing `_profile_dir()`, `resolve_profile()`, and `save_graph()`.

**Estimated effort:** ~100 lines.
**Note:** The README advertises this feature; the API surface is the gap.

### Bonus: Traffic Pagination (quick win)

**Folder:** `dashboard/`
**What:** `GET /traffic` currently reads every inbox file on every call. Add `since` (epoch seconds) and `limit` (default 50) query params. The `_recent_traffic()` function already has a window filter — expose it to the caller. One-line change in the endpoint, marginal impact on poll load.

**Files to touch:** `dashboard/plugin_api.py` — add query params to `traffic()` endpoint.

**Estimated effort:** ~5 lines.

---

## Synthesis Assessment

**FleetGraph is at a local maximum on topology correctness.** The SSOT architecture, atomic saves with Windows-concurrency retry, path-safety gates, and local semantic routing are all well-executed. The codebase is healthy enough that the highest-leverage work is **protocol and monitoring**, not plumbing.

Three shifts define the next phase:

1. **From descriptive to predictive** — trace-derived FSM overlays + failure-likelihood annotations (Automata from Agent Traces, 2608.23670)
2. **From passive to self-regulating** — Consilience-style supervisor controller with calibrated intervention vocabulary (2608.20564)
3. **From unstructured to typed** — evidence frames on subordinate-to-supervisor edges + progress-aware rerouting (2608.24787, 2608.25992)

The new tick's papers reinforce this direction: ProgRouter adds online dispatch, JIT-Agent adds harness versioning, RAMP adds a maturity signal — all compatible with the existing DAG and requiring no new infrastructure, just protocol extensions.

The one item that should not wait: **graph audit log**. It's defensive infrastructure — when the operator rewires the topology (and they will), there must be a roll-back path. `save_graph()` already writes to a temp file; adding a pre-replace snapshot is a small extension of the same pattern.

---

*Synthesized by FleetGraph Synthesis Engine. Overwritten each tick. SSOT: fleet_graph_core.py.*
