# FleetGraph Architecture Ideas — Tick Report

**Tick:** 2026-08-27  
**Papers found this tick:** 3 (1st search timed out; worked from 2nd search results)  
**Papers:**
- [2607.25255] SafeFlow: Semantic Information-Flow Control for Blocking Malicious Propagation in Multi-Agent Systems
- [2607.27743] Delegated Fair Division
- [2606.04056] Token Budgets: An Empirical Catalog of 63 LLM-Agent Budget-Overrun Incidents

**Note:** No papers from the first search ("multi-agent orchestration hierarchy") — that query timed out. Ideas below are grounded in the 3 papers from the second search plus the actual FleetGraph codebase (`fleet_graph_core.py`, `README.md`).

---

## Idea 1: Semantic Message Classification with Policy-Gated Flow Control

**Inspiration:** SafeFlow (2607.25255) — semantic information-flow control that blocks malicious propagation in multi-agent systems by classifying message content, not just topology.

**Concept:** FleetGraph's `can_communicate()` currently gates messages on graph position alone (up/down/peer/lateral-blocked). SafeFlow's insight is that *what* a message contains should be as policy-relevant as *who* sends it to *whom*. Extend the communication contract so each message carries a semantic classifier label (e.g., `task`, `status`, `soul-edit`, `config`, `persona-drift-alert`, `adversarial`), and `can_communicate()` gains an optional content-policy check: even a valid supervisor→subordinate channel can be gated if the classifier is not permitted on that edge (e.g., a `persona-drift-alert` tagged by a subordinate routing up to a directorate head, or an `adversarial` tagged message blocked entirely from peer edges). The classifier vocabulary and per-edge policy matrix live in a new `_meta.message_policy` section of `fleet_graph.yaml`, surfaced in the dashboard composer as a mandatory classifier dropdown. This turns FleetGraph from a topology firewall into a content-aware information-flow controller — directly relevant given the Red Team profiles (Lore, Garak, Seska, Khan, Dukat, Ransom) that already exist in the fleet.

**Files touched:**
- `fleet_graph_core.py` — `can_communicate()` signature extended to accept optional `classifier` arg; new `check_message_policy()` function; `GraphError` gains policy-violation variant
- `fleet_graph.yaml` (topology/) — new `_meta.message_policy:` block: `{classifiers: [...], edges: {sender->recipient: [allowed_classifiers]}}`
- `dashboard/plugin_api.py` — `POST /send` validates classifier against policy before delivery; `GET /overview` returns policy metadata for the composer
- `desktop-plugin/plugin.js` — message composer gains classifier dropdown; blocked-classifier sends surface a distinct error state in the UI

**Why it matters:** The fleet already carries adversarial Red Team personas. Without content-aware gating, a compromised or drift-prone node can exfiltrate SOUL.md content or inject adversarial prompts through any structurally valid channel. SafeFlow's semantic-classification layer is the natural next hardening step for a fleet that intentionally includes adversarial actors.

---

## Idea 2: Per-Message Token Budget Enforcement with Budget-Overrun Guard

**Inspiration:** Token Budgets (2606.04056) — empirical catalog of 63 LLM-agent budget-overrun incidents with an affine-typed Rust mitigation. The paper's core finding: agents routinely blow past intended token budgets, and once overrun happens it's hard to detect ex-post.

**Concept:** FleetGraph's message composer (`POST /send`) currently accepts a message with no size or cost guard. Add a per-channel token budget to `fleet_graph.yaml` — `_meta.budgets:` mapping `{profile: {outbound: N, inbound: N, window_seconds: M}}` — and enforce it at send time. When a bot's outbound message would exceed its budget (computed from a rolling window of recent sends, tracked in-memory by the dashboard API or persisted in a lightweight `_meta.traffic_log`), the send is refused with a clear budget-exhausted error rather than silently delivered. The dashboard's "NEEDS ATTENTION" deck view gains a new triage bucket: "BUDGET EXHAUSTED" — bots that have hit their limit and need operator intervention (budget increase, channel throttling, or investigation). The idea is drawn directly from the paper's mitigation pattern: pre-compute the budget envelope, refuse at the boundary, surface the exception visibly.

**Files touched:**
- `fleet_graph_core.py` — new `load_budgets()` / `normalize_budgets()` functions mirroring the existing `load_relations()` / `normalize_relations()` pattern; `GraphError` variant for budget misconfiguration
- `fleet_graph.yaml` (topology/) — new `_meta.budgets:` block
- `dashboard/plugin_api.py` — `POST /send` checks budget before delegating to `can_communicate()`; `GET /overview` and `GET /traffic` surface budget state per node; new endpoint `POST /budgets/{p}/reset` for operator reset
- `desktop-plugin/plugin.js` — deck view "NEEDS ATTENTION" gains budget-exhausted triage; message composer shows remaining budget; operator can adjust budget inline via rewire panel

**Why it matters:** With 68 profiles in the fleet and live activity polling every 4s, unbounded messaging is a real cost risk — both in LLM token spend and in message volume that can flood the inbox/traffic surfaces. The paper's empirical 근거 (63 real incidents) makes this a concrete, not hypothetical, hardening.

---

## Idea 3: Delegation-with-Intent — Downward Task Propagation with Upward Completion/Chdocumentclass

**Inspiration:** Delegated Fair Division (2607.27743) — the structural problem of delegating a task to a subordinate and getting back a verifiable outcome, not just an acknowledgment. Combined with FleetGraph's existing `chain()` routing (supervisor chain traversal) and the existing `delegate` message frame in the composer.

**Concept:** FleetGraph currently has a `delegate` message frame, but it treats delegation as a one-shot send — there is no structured intent propagation downward and no completion/report chaining back up. Add a `delegation` message type (distinct from `talk` and existing `delegate`) that carries: `(task_description, expected_output_schema, deadline_or_priority, delegator_node)`. On send, the message is delivered down the supervisor chain (using `chain()` to validate reachability), and the recipient bot is expected to reply with a structured `delegation-result` message (success/failure/partial, output payload, runtime). The dashboard gains a delegations panel: active delegations with status (pending/completed/failed/timed-out), visible on the org chart as a dashed annotation edge from delegator to delegatee. `fleet_graph_core.py`'s `chain()` function is extended to support reverse-chain traversal (subordinate→supervisor) for result routing, and `can_communicate()` gains a `delegation-result` classifier that is only permitted on the reverse of a prior delegation edge (preventing arbitrary subordinates from pushing results to arbitrary supervisors).

**Files touched:**
- `fleet_graph_core.py` — `chain()` extended with `reverse=True` option for upward result routing; `can_communicate()` gains `delegation-result` classifier handling; new `record_delegation()` / `lookup_delegation()` in-memory state for the dashboard API (or persisted in `_meta.active_delegations:`)
- `fleet_graph.yaml` (topology/) — optional `_meta.delegation_policy:` block: `{max_active_per_sender: N, result_timeout_seconds: M}`
- `dashboard/plugin_api.py` — new endpoints: `GET /delegations`, `POST /delegations` (send delegation), `POST /delegations/{id}/result` (receive result); `GET /overview` includes active delegation count per node
- `desktop-plugin/plugin.js` — delegations panel; org chart renders active delegation edges as dashed annotations; result arrival surfaces a notification/badge

**Why it matters:** The fleet's entire topology is built around supervisor/subordinate hierarchy — escalation up, delegation down, peers sideways. But "delegation down" is currently a fire-and-forget send. Making delegation a first-class, trackable, result-producing operation turns the org chart from a static picture into an active workflow surface. This is the most directly FleetGraph-native idea of the three — it extends existing primitives (`chain()`, `delegate` frame, supervisor edges) into a coherent delegation protocol rather than adding an entirely new subsystem.
