# FleetGraph Architecture Ideas — ArXiv-Inspired

> Each tick: 3 concrete PR-sized feature ideas grounded in `fleet_graph_core.py` + arxiv papers of the day.
> Overwritten each tick. Ideas are inspiration, not requirements.

---

## Tick: 2026-08-29

Papers consulted:
- **HiMA-MDD** (2608.21868) — hierarchical multi-agent harness with interpretable routing
- **SPOQ** (2606.03115) — specialist-orchestrated queuing for multi-agent software engineering
- **SafeFlow** (2607.25255) — semantic information-flow control for blocking malicious propagation in multi-agent systems
- **Token Budgets** (2606.04056) — empirical catalog of 63 LLM-agent budget-overrun incidents

---

## 1. Delegation Contract Payloads in `can_delegate_to`

**Concept:** Extend `can_delegate_to`'s `contract` dict from a depth-only gate into a structured delegation contract that carries task scope, budget constraints, and a capability hash. The caller passes `{max_depth, scope: "summarize_transcript", budget: 5000, capability: "fastembed"}` and the function validates both structural feasibility (subtree depth, subordinates exist) and semantic fit (does the recipient's subtree actually carry the requested capability, derived from a new `capabilities` field on each node in `fleet_graph.yaml`). This turns delegation from "can this node reach enough layers down" into "can this subtree do the job within budget." The FleetGraph dashboard's delegation composer (`plugin.js` message composer) would surface the contract fields as fillable slots, and `fleet_msg.py` would reject delegations that fail the capability check before they hit the wire.

**Files touched:** `fleet_graph_core.py` (`can_delegate_to`, new `node_capabilities` loader), `fleet_graph.yaml` (new optional `capabilities:` per-node), `fleet_msg.py` (contract enforcement on send), `plugin.js` (composer UI for contract fields), `plugin_api.py` (pass contract through `/send`).

**Why it matters:** Right now delegation is purely topological — depth and subordinate presence. Real fleets need to delegate to the *right* subtree, not just any subtree deep enough. A capability-gated contract prevents the common failure mode of delegating a summarization task to a subtree whose leaves are all chat-only profiles. Grounded in SPOQ's specialist-orchestrated queuing insight: routing work to specialists, not just to whoever is reachable.

---

## 2. Information-Flow Policy Labels via `SafeFlow`-Style Taint Edges

**Concept:** Add a lightweight per-edge policy label to the graph that classifies each supervisor/subordinate/peer link as one of `clear`, `review Required`, or `restricted`. The labels live in `fleet_graph.yaml` as an optional `flow_policy:` map (edge key → label) and are checked in `can_communicate` as an additional gate on top of the existing direction check. A `restricted` edge still allows communication but flags the message for human review ( surfaced as a `needs_review: true` field in the send response and rendered as an amber border in the dashboard composer). A `review_required` edge inserts a synthetic supervisor hop in the routing chain returned by `chain()` — the message routes through the reviewer node before reaching the recipient. This gives the fleet a tunable information-flow control layer inspired by SafeFlow's semantic taint tracking, without requiring a full IFC runtime.

**Files touched:** `fleet_graph_core.py` (`can_communicate`, `chain`, new `load_flow_policy` + `check_flow_policy`), `fleet_graph.yaml` (new optional `flow_policy:` key), `plugin.js` (amber/review indicator in composer + node inspector), `plugin_api.py` (expose flow policy in `/overview` and `/send` response).

**Why it matters:** FleetGraph's existing policy is binary — allowed or blocked by direction. Real multi-agent fleets leak sensitive context through otherwise-valid lateral sends. A taint-label layer on existing edges gives the operator graduated control (block, review, or clear) without restructuring the topology. Grounded in SafeFlow's finding that malicious propagation in multi-agent systems is best caught at the information-flow level, not at the agent-identity level.

---

## 3. Budget-Aware Delegation Guard from Token-Budget Incident Patterns

**Concept:** Add a `budget_guard` check to `can_delegate_to` and the `/send` endpoint that estimates whether a delegation would exceed a node's known message budget. Each node in `fleet_graph.yaml` carries an optional `budget:` field (messages/day or tokens/day); `budget_guard` sums the recipient's remaining budget (derived from a simple rolling counter stored in `_meta.budget_state`) against the estimated cost of the delegation (contract.budget if present, else a default heuristic based on subtree leaf count). If the delegation would overflow the budget, the function returns `(False, "budget exceeded: ...")` instead of allowing the send. The dashboard's delegation composer shows remaining budget per node in the inspector, and `fleet_maint.py` gains a `reset_budgets` command that zeros `_meta.budget_state` on a schedule. Grounded in Token Budgets' catalog of 63 overrun incidents — the failure mode is real and repetitive; a guard in the topology layer catches it before the LLM call.

**Files touched:** `fleet_graph_core.py` (`can_delegate_to` budget guard, new `load_budget_state` + `budget_guard`), `fleet_graph.yaml` (optional per-node `budget:` field), `_meta.budget_state` (new runtime counter in the yaml), `fleet_msg.py` (budget guard on delegate sends), `maintenance/fleet_maint.py` (`reset_budgets` command), `plugin.js` (budget display in node inspector).

**Why it matters:** The existing `can_delegate_to` checks structural capacity but not resource capacity. A delegation that cascades through a subtree can burn through a leaf node's message budget in one afternoon, and the fleet only discovers this when messages start failing. A budget guard at the topology-validation layer — the same place that already rejects cycles and unknown profiles — catches the overflow before any LLM call is made. Grounded in Token Budgets' empirical finding that budget overruns are the most common multi-agent incident category and are cheapest to prevent at the routing layer.
