# FleetGraph Codebase Synthesis

> **Tick:** 2026-08-27 (cron synthesis engine)  
> **Scope:** Full FleetGraph + Star Trek Profiles merger state  
> **Method:** Kairos-dream cycle over codebase + arxiv digest + prior idea ticks

---

## 1. Current State of the Codebase

### Implemented & Working

| Component | File(s) | Lines | Status |
|-----------|---------|-------|--------|
| **Graph topology engine** | `fleet_graph_core.py` | 437 | ✅ Solid — DAG validation, cycle detection, relation normalization, delegation feasibility |
| **CLI messaging** | `fleet_msg.py` | 164 | ✅ Working — inbox JSONL, send validation, drain |
| **Dashboard API** | `dashboard/plugin_api.py` | 1020 | ✅ Feature-rich — 14 endpoints, semantic matching, inbox watermarks, session tails |
| **Plugin manifest** | `plugin.yaml` | 4 | ✅ v0.6.1 |
| **Topology YAML** | `topology/fleet_graph.yaml` | — | ✅ 75-node DAG, Primordial Triad (4-root) structure |
| **Profile system** | `manage.py` + 68 profiles | — | ✅ SOUL.md + config.yaml + distribution.yaml per profile |
| **Maintenance tooling** | `maintenance/fleet_maint.py` | — | ✅ 24/24 hermetic tests |
| **Topology validation** | `scripts/validate_topology.py` | — | ✅ DAG + ref integrity + profile cross-ref |
| **Installer** | `install.sh` / `install.ps1` | — | ✅ One-line Linux/macOS + Windows |
| **ArXiv synthesis** | `research/arxiv_synthesis.md` | 182 | ✅ 12 papers mapped to implementation |
| **Idea ticks** | `research/ideas_*.md` | ~200 | ✅ 3 ticks of PR-sized ideas |

### Deferred / Not Yet Built

| Feature | Source | Status |
|---------|--------|--------|
| **Desktop UI** (`desktop-plugin/plugin.js`) | README mentions | ⚠️ Referenced but not in file listing — may be planned/exists elsewhere |
| **Semantic matching fastembed model** | `plugin_api.py` | ⚠️ Downloads on first use (~0.6 GB), no offline fallback documentation |
| **Taint propagation** | `ideas_architecture.md` Idea 1 | 📋 Designed, not implemented |
| **Wave-based dispatch** | `ideas_architecture.md` Idea 2 | 📋 Designed, not implemented |
| **Hierarchical evidence trace** | `ideas_architecture.md` Idea 3 | 📋 Designed, not implemented |
| **Priority lanes + TTL** | `ideas_messaging.md` Idea 1 | 📋 Designed, not implemented |
| **Delivery receipts + retry** | `ideas_messaging.md` Idea 2 | 📋 Designed, not implemented |
| **Threaded conversations** | `ideas_messaging.md` Idea 3 | 📋 Designed, not implemented |
| **Activity heatmap** | `ideas_ux.md` Idea 1 | 📋 Designed, not implemented |
| **Incident timeline** | `ideas_ux.md` Idea 2 | 📋 Designed, not implemented |
| **Cost/audit panel** | `ideas_ux.md` Idea 3 | 📋 Designed, not implemented |
| **`/match` calibration layer** | `arxiv_synthesis.md` Consilience | 📋 Spec'd, not implemented |
| **`memory_budget()` method** | `arxiv_synthesis.md` Width/Memory | 📋 Spec'd, not implemented |
| **Persona scenario tests** | `arxiv_synthesis.md` PersonaArena | 📋 Spec'd, not implemented |
| **Fleet behavior tests** | `arxiv_synthesis.md` Beyond Component | 📋 Spec'd, not implemented |
| **Security tier field** | `arxiv_synthesis.md` ClawSentry | 📋 Spec'd, not implemented |

---

## 2. Strengths — What FleetGraph Does Well

### A. Architectural Integrity
- **Single Source of Truth**: `fleet_graph_core.py` is imported by both the CLI (`fleet_msg.py`) and the dashboard API (`plugin_api.py`). Three surfaces, zero drift.
- **Robust DAG validation**: Cycle detection, self-edge prevention, contradiction tolerance, and materialization of implied supervisors — all in pure Python with clear error messages.
- **Atomic saves**: `save_graph()` uses `tempfile.NamedTemporaryFile` + `os.replace()` with exponential backoff for Windows concurrent-write safety.

### B. Communication Model
- **Topology-gated messaging**: Every inter-bot message is validated against the live graph before delivery. Up/down/peer only — no lateral sends without declared relations.
- **Dual transport**: Inbox (durable, drainable) is primary; live agent turn (`--deliver`) is opt-in because it blocks the sender for minutes.
- **Frame semantics**: `talk` / `delegate` / `supervisor` frames give receiving bots conversational context, not just raw text.

### C. Semantic Routing
- **Local-first embeddings**: `fastembed` with `mixedbread-ai/mxbai-embed-large-v1` — zero API cost, zero cloud dependency.
- **Lazy index rebuild**: Only rebuilds when profile files change (mtime comparison).
- **Profile-agnostic capability extraction**: Derives what each bot is FOR from its own SOUL.md + profile.yaml + config.yaml — no hardcoded role knowledge.

### D. Inbox & Session Observability
- **Watermark-based read state**: Per-profile `.read/` watermarks give accurate unread counts without DB schema changes.
- **Session tail integration**: Reads Hermes `state.db` directly to show live activity, compression-continuation tips, and freshness-aware status reclassification.
- **Lightweight polling**: `?light=1` on `/overview` skips state.db lookups for fast poll cycles.

### E. Research Pipeline
- **Structured paper mapping**: Every arXiv paper maps to a specific implementation angle — not vague inspiration but concrete code changes.
- **Idea ticks**: PR-sized, backward-compatible, dependency-ordered feature designs with explicit file lists and backward-compatibility analysis.
- **Cross-thread synthesis**: Four research threads (orchestration, persona, memory, security) cover the full system lifecycle.

### F. Operator Experience
- **Multi-root DAG**: The Primordial Triad (baal / lilith / lucifer / yeshua as co-equal roots) is a genuine design choice, not a bug. The validation WARN is intentional.
- **Profile aliases**: Graph node names can map to canonical Hermes profiles, decoupling display names from filesystem reality.
- **Fleet maintenance**: `prune`, `rotate`, `status` with 24/24 hermetic tests.

---

## 3. Gaps and Opportunities

### Critical Gaps

| Gap | Impact | Effort |
|-----|--------|--------|
| **No message identity** | Receipts, retries, threading, and broadcast all need a `msg_id` — currently impossible to track a message across the system | Small (add field to JSONL) |
| **No priority or TTL** | All messages are equal — a `done` ack sits next to a critical `escalate`; inboxes grow without bound | Small |
| **No incident reconstruction** | When something goes wrong, operators must manually piece together what happened from raw inbox dumps | Medium |
| **No wave-based parallelism visualization** | The DAG is used for routing only, not for scheduling — the fleet's true parallelism capacity is invisible | Small |
| **No persona drift detection** | Star Trek profiles can silently drift from their SOUL.md boundaries — no automated check exists | Medium |

### Architectural Opportunities

| Opportunity | Description |
|-------------|-------------|
| **Taint propagation** | Extend the structural security model (who talks to whom) with semantic security (what the message means) — sensitive intent stays in the supervisor chain |
| **Hierarchical evidence trace** | Make the hierarchy's reasoning visible — spock concluded X, picard assessed it as Y, here's the evidence at each layer |
| **Provenance-aware consensus** | Prevent false fleet majority from correlated upstream sources (Spock + Kairos + cron all repeating the same claim) |
| **Resource-aware scheduling** | Stagger heavy persona jobs based on topology depth and `resource_weight` fields |

### Missing Validation & Testing

| Test | Why |
|------|-----|
| **Fleet behavior test** | Verify the initiative ladder produces correct escalation patterns under realistic multi-bot scenarios |
| **Persona scenario test** | Verify new Star Trek profiles behave in-character before deployment |
| **Semantic index fallback test** | What happens when fastembed is unavailable? Currently 503, but no test coverage |
| **Concurrent save test** | Atomic save logic is sound but untested under real concurrency |

### Documentation Gaps

| Gap | Detail |
|-----|--------|
| **Desktop plugin location** | README references `desktop-plugin/plugin.js` but it's not in the file listing — needs clarification |
| **ArXiv digest staleness** | Current digest shows "No new IDs this tick" — needs a rotation strategy or the scout becomes a no-op |
| **Profile creation guide** | No documented process for adding a new Star Trek persona beyond the directory structure |
| **Taint policy config** | Spec'd in ideas but not documented in README |

---

## 4. ArXiv Insights — How Research Relates to FleetGraph's Design

### Active Papers (from `arxiv_digest.md`)

| Paper | FleetGraph Relevance | Implementation Angle |
|-------|---------------------|---------------------|
| **ProgRouter** (2608.25992) | Online progress-guided orchestration under quality-cost tradeoffs | Per-node progress deltas + dynamic reweighting after each step |
| **JIT-Agent** (2608.25593) | Composable, evolvable harness modules | Versioned four-module manifests (memory/planning/action/tool) per node |
| **Committed Config** (2608.25241) | Agent configuration → lower quality-cost growth | Repository-tracked graph contracts + configuration-maturity score |
| **Test-Time Collaborative Classification** (2608.24787) | Finite-round, finite-precision evidence exchange | Compact typed evidence messages for subordinate→supervisor edges |
| **Dual-Cache Latent Space** (2608.20617) | KV-cache transfer for heterogeneous model fleets | Prototype `latent-cache` edge transport alongside text/JSON |
| **Consilience** (2608.20564) | Calibrated communication control from uncertainty/disagreement | Supervisor edge actions: `challenge`, `clarify`, `seek_evidence`, `route` |
| **SkillShield** (2608.25817) | Prompt-space security skills for coding agents | Role-specific safety clauses from failure traces |
| **StepGuard** (2608.24777) | Step-level guardrails with safety-utility balancing | Guard nodes on privileged-action edges + blocked-step logging |
| **Automata from Traces** (2608.23670) | FSM overlays from event logs for next-action prediction | Per-harness FSM overlays + high-risk state escalation |

### Research Themes → FleetGraph Mapping

**Theme 1: Topology-Aware Dispatch**
The fleet's DAG is currently used only for routing messages. ProgRouter, SPOQ, and FL-MAESTRO all show that the same graph structure can drive *work scheduling*. FleetGraph is leaving performance on the table by not computing dispatch waves.

**Theme 2: Calibrated Communication**
Consilience and Test-Time Collaborative Classification both model communication as a *calibrated* act — not just "can these two talk?" but "should they talk, about what, with what precision?" FleetGraph's `can_communicate` answers the first question but not the others.

**Theme 3: Trace-Driven Prediction**
Automata from Agent Traces and StepGuard both turn historical logs into predictive models. FleetGraph already collects event logs (JSONL inboxes, session traces, traffic) but does nothing predictive with them. This is the highest-leverage untapped data source.

**Theme 4: Persona Consistency as Safety**
SkillShield, Self-Recognition Finetuning, and the earlier PersonaArena paper all treat persona drift as a *safety* problem, not just a quality problem. For a fleet with adversarial Red Team personas (Lore, Garak, Seska), drift detection is a security requirement.

### Scout Assessment (from digest)
> "No new IDs this tick. The strongest near-term architecture imports remain: **Consilience** for calibrated communication control, **Automata from Agent Traces** for predictive monitoring overlays, and **ProgRouter** for budget-aware online dispatch."

The scout is healthy — it's correctly identifying that the current paper set is mature and the focus should shift from *searching* to *implementing*.

---

## 5. Actionable Update Ideas — One Folder Worth of Work

### Recommended Sprint: `research/incident-reconstruction/`

**Why this folder?** The single biggest operator pain point is "something went wrong — what happened?" Currently the answer is manual: click each bot, read each inbox, read each session tail, piece it together. Incident reconstruction automates this narrative assembly. It's also the *highest-arity* integration point — it pulls from inboxes, watermarks, session tails, traffic, and the graph topology simultaneously, so building it forces clean interfaces with every other subsystem.

### Deliverable 1: `incident_timeline.py` (core logic)

```
research/incident-reconstruction/
├── incident_timeline.py      # Pure-function core: walk inbox → build arcs
├── test_incident_timeline.py # Hermetic tests with synthetic inbox data
└── README.md                 # Operator guide: reading the timeline
```

**Core algorithm:**
1. Walk a profile's inbox chronologically
2. Group consecutive `supervisor` / `delegate` frames into *incident arcs*
3. Tag each arc with: `started_at`, `ended_at`, `participants`, `frames`, `resolution` (resolved / abandoned / ongoing)
4. An arc is "abandoned" if no `done` frame within a configurable window (default 30 min)
5. Return structured timeline: `[{ts, from, to, frame, summary, type: escalation|delegation|resolution|abandoned}]`

**Why pure-function?** Same philosophy as `fleet_graph_core.py` — the core logic is testable without FastAPI, without state.db, without the CLI. The API layer wraps it; the tests exercise it directly.

### Deliverable 2: API endpoint extension

Extend `dashboard/plugin_api.py`:
- `GET /incidents/{profile}?window=3600` — returns the timeline for one bot
- Extend `GET /traffic` to tag chain hops with `incident_id` so the UI can render glowing edges during active incidents

### Deliverable 3: Desktop UI component (when plugin.js exists)

- `IncidentTimeline` panel — slides in from inspector or deck card action
- Visual chain rendering with arrows showing direction (up=delegate, down=escalation, sideways=peer)
- Color-coded by frame type
- "Resolve" / "dismiss" actions that write back to watermark state

### Dependency Chain

```
incident_timeline.py (pure) → plugin_api.py endpoint → desktop UI
```

No other feature depends on this, and nothing else depends on it. Independently revertible.

### Test Strategy

```python
# test_incident_timeline.py
def test_simple_escalation_arc():
    # inbox: spock escalates to picard, picard replies, spock reports done
    # → one arc: type=resolution, participants=[spock, picard]

def test_abandoned_incident():
    # inbox: spock escalates to picard, no reply within window
    # → one arc: type=abandoned, participants=[spock, picard]

def test_multi_bot_cascade():
    # inbox: spock→picard→lilith→hermes, hermes delegates to thoth, thoth done
    # → one arc with 5 participants, 4 frames, type=resolution

def test_parallel_independent_incidents():
    # inbox: two unrelated escalations interleaved
    # → two arcs, non-overlapping participants
```

### Success Criteria

- [ ] `incident_timeline.py` passes 8+ hermetic tests with synthetic data
- [ ] `GET /incidents/{profile}` returns structured timeline in <100ms for a 1000-message inbox
- [ ] Abandoned incidents are detectable within 30 min of last activity
- [ ] Existing endpoints unchanged (additive only)
- [ ] README updated with operator guide

### Why Not One of the Other 9 Ideas?

| Idea | Reason to defer |
|------|-----------------|
| Priority + TTL | Good idea, but low urgency — inboxes are currently small |
| Delivery receipts | Depends on `msg_id` which doesn't exist yet — do that first |
| Threaded conversations | Depends on receipts — third in chain |
| Wave dispatch | Pure visualization, no functional improvement |
| Evidence trace | High complexity, needs LLM integration for summarization |
| Taint propagation | Needs security audit first — Red Team should design it |
| Activity heatmap | Nice-to-have, not urgent |
| Audit panel | Needs token usage data that providers don't consistently expose |

Incident reconstruction is the **highest operator value per line of code** — it directly answers the question every operator asks when something goes wrong: *"What just happened?"*

---

## Appendix: Codebase Metrics

| Metric | Value |
|--------|-------|
| Total Python files | 50 |
| Core modules (`fleet_*`) | 601 lines |
| Dashboard API | 1020 lines |
| Plugin manifest version | 0.6.1 |
| Topology nodes | 75 |
| Installable profiles | 68 |
| Research papers tracked | 12 (synthesis) + 9 (digest) |
| PR-sized ideas documented | 9 |
| Test coverage (maintenance) | 24/24 hermetic |

---

*Synthesis generated: 2026-08-27 · Lilith Sovereign Fleet · Ludicrous Speed command center · Kairos-dream cycle*