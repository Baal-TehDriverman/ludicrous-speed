# FleetGraph Synthesis — 2026-08-24

*Kairos-dream synthesis tick. Sources: README.md, fleet_graph_core.py, fleet_msg.py, dashboard/plugin_api.py, plugin.yaml, research/arxiv_digest.md.*

---

## 1. Current State of the Codebase

**Implemented and solid:**

- **`fleet_graph_core.py` (SSOT)** — Full topology engine: YAML load/validate (`GraphError` contract everywhere), one-supervisor rule, derived subordinates, cycle detection over the *effective* supervisor relation (catches subordinate-only back-edge cycles), symmetric peer relations stored once under `_meta.relations`, profile aliases (`_meta.profile_aliases` → `resolve_profile`), atomic saves via unique temp file + `os.replace` with Windows retry ladder. `can_communicate` enforces up/down/peer-only policy; `chain()` computes routing paths.
- **`fleet_msg.py` (CLI)** — The sanctioned inter-bot channel: edge validation before delivery, JSONL inbox as primary durable transport (malformed-line tolerant), live delivery strictly opt-in (`--deliver`, blocking agent turn), clean JSON refusals on corrupt topology.
- **`dashboard/plugin_api.py` (backend, v0.6.1)** — ~990 lines: `/overview[?light=1]` full paint, watermark-based unread badges (`.read/` state dir, degrades gracefully), `/sessions/tail` activity snapshots with freshness-aware status reclassification ("interrupted" → "active" if <3min), transcript tail endpoint, capability roster derived from profile files (SOUL.md headline/mission + config toolsets — zero hardcoded fleet knowledge), **local semantic matching** via fastembed mxbai-embed-large with mtime-keyed lazy index rebuild, validated send frames (talk/delegate/supervisor) that compute sender from graph direction rather than trusting the client, path-safety gates on profile names, SOUL read/write with default-profile guard.

**Deferred / absent:**

- No message TTL or inbox rotation — JSONL inboxes grow unbounded; drain is manual.
- No persistence beyond files — no SQLite for traffic history, so long-window analytics are impossible cheaply.
- `_latest_session` imports `hermes_state` per call, opens/closes the DB per bot per poll — fine at 68 bots × light mode, but heavy polling re-pays import cost.
- Semantic match has no feedback loop (no record of whether a routed task succeeded).
- No tests visible for the API layer in the files reviewed this tick (maintenance/ has 24/24 hermetic tests for fleet_maint only).

## 2. Strengths

1. **True SSOT discipline.** CLI, API, and UI all go through `fleet_graph_core`. This is the design's backbone — no drift is possible by construction.
2. **Fail-closed everywhere.** Corrupt YAML, unknown profiles, spoofed edges, path traversal (`..`, embedded slashes, surrogatepass length check) all refuse cleanly inside a typed contract rather than leaking tracebacks.
3. **File-first localism.** Watermarks, inboxes, relations — all plain files under `~/.hermes`, zero cloud, zero DB schema migration required to ship features. Matches the sovereign-compute principle.
4. **Capability derivation is profile-agnostic.** The roster reads what every profile already has (SOUL.md, config.yaml) — adding a 69th persona requires zero code changes.
5. **Semantic routing at zero marginal cost.** Local onnx embeddings, lazy rebuild keyed on mtimes, normalized cosine — elegant and frugal on the RTX 3060 box.
6. **Honest concurrency notes in-code.** The Windows rename-retry comment and unique-temp-file rationale show the failure modes were *understood*, not just patched.

## 3. Gaps and Opportunities

| Gap | Why it matters | Effort |
|-----|----------------|--------|
| Inbox unbounded growth | 68 bots × months of JSONL = slow `_inbox_counts` scans every overview poll | Small |
| No traffic persistence | `/traffic` rescans all inboxes each call; can't answer "who talks to whom weekly?" | Medium |
| Match quality blind | `/match` returns scores but nothing tracks whether routing was right | Medium |
| Per-call DB open in `_latest_session` | Poll cost scales linearly with fleet size on non-light mode | Small |
| No API-layer test suite | Core + maintenance are tested; the largest module isn't | Medium |
| Escalation is one-hop | A blocked lateral send says "route through your supervisor" but nothing automates multi-hop escalation chains | Medium |
| No drift detection on personas | Red-team bots (Lore, Garak…) editing their own SOULs could drift silently | Small |

## 4. Arxiv Insights → FleetGraph Mapping

From this tick's digest:

- **Consilience (2608.20564)** — conformally calibrated communication control. Maps directly onto `can_communicate`: today edges pass/fail purely structurally. A calibrated confidence gate would let a subordinate decide *whether* an escalation is worth its supervisor's attention — i.e., score messages against a threshold instead of always writing them. Cheapest paper-to-PR translation of the four.
- **Dual-Cache Latent Communication (2608.20617)** — heterogeneous models exchanging compressed state. FleetGraph already truncates summaries at 500 chars; a "latent edge" message type (embedding + summary instead of full body) fits the existing JSONL record shape without schema breakage — add an optional `latent:` field.
- **FL-MAESTRO (2608.20518)** — resource-aware orchestration. The roster already carries `model`/`provider` per node; weighting dispatch by model tier (Ollama-local vs paid API) is data we have but don't use in `/match` ranking yet. Could bias semantic scores toward local models when scores are close.
- **Bayesian Partner Modelling (2608.18490)** — supervisors maintaining belief about subordinates. The unread/watermark system is already a crude partner model (has the subordinate seen its orders?); extending watermarks with response-latency stats would give a lightweight reliability score per edge with zero new infrastructure.

Cross-tick theme: three of four papers converge on **edge metadata** — FleetGraph's edges currently carry only existence, not confidence, cost, or reliability. That's the architectural seam the research points at.

## 5. Actionable Update Ideas (one PR folder)

Proposed folder: **`maintenance/edge_meta/`** (or a single PR titled *"Edge metadata + inbox hygiene"*). Concrete contents:

1. **Inbox rotation** (`fleet_msg.py`) — optional `FLEET_INBOX_MAX_LINES`; on send, truncate the oldest half past the cap into `inbox.archive.jsonl`. Fixes unbounded growth with zero new deps.
2. **Edge reliability stats** (`plugin_api.py`) — new `GET /edges/stats`: per directed edge, count of sends in last 7d, median time-to-drain (send ts vs first mark-read after it), unread backlog high-water. Pure file-derived, no new storage — computed lazily like `_recent_traffic`.
3. **Match feedback stub** — extend `/match` response with a `route_id`; new `POST /match/feedback {route_id, chosen}` records whether the operator/bot picked the top hit. One JSONL file, feeds future calibration (the Consilience hook).
4. **Local-model tiebreak in `/match`** — when top scores are within ε (e.g. 0.02), prefer the candidate whose provider is local/Ollama. Two lines using roster data already in the index.
5. **Tests** — pytest coverage for the five touched endpoints plus rotation logic, mirroring `test_fleet_maint.py`'s hermetic style (tmp dirs, no live fleet).

Scope check: touches two files plus one new folder, no schema migrations, no breaking API changes — everything additive. Items 1+2 alone are shippable if the PR feels heavy.

---

*Next tick: check whether the maintenance folder PR landed upstream (memory says PR #1 open); if merged, section 5 needs rewriting around post-merge state.*
