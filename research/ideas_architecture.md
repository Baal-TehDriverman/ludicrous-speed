# FleetGraph Architecture Ideas — Tick 2026-08-31

Generated from 6 arxiv papers (HiMA-MDD, AGENTSERVESIM, SPOQ, Delegated Fair Division, SafeFlow, Token Budgets) cross-read against FleetGraph's actual codebase (`fleet_graph_core.py`, `plugin_api.py`, desktop plugin, `fleet_graph.yaml`).

Each idea is PR-sized: one or two functions in the core, a schema extension, and an optional UI touch. Papers are inspiration; FleetGraph's single-file SSOT and pure-graph core are the constraints.

---

## 1. Delegation-aware subtree capacity scoring

**Concept:** `can_delegate_to()` today checks only structural depth — "does the recipient have subordinates, and is the subtree deep enough?" — but never whether that subtree is already carrying active delegations. The Delegated Fair Division paper frames delegation as an allocation problem with fairness constraints, and SPOQ models specialist pools where queue depth determines whether a specialist can absorb more work. FleetGraph could add a lightweight per-node delegation counter (active + queued) and let `can_delegate_to()` return a capacity advisory (`capacity_ok`, `near_capacity`, `overloaded`) in addition to the structural verdict. The counter is advisory-only and stored alongside the graph so it survives restarts, but never blocks sends — making it safe to roll out incrementally.

**Files touched:**
- `fleet_graph_core.py` — new `subtree_load(graph, node)` returning active/queued counts; new return field on `can_delegate_to()`; optional `touch_delegation(node, delta)` to bump counters.
- `fleet_graph.yaml` — optional `_meta.delegation_counts: {profile: {active: N, queued: N}}` (additive, defaults to zero).
- `plugin_api.py` — expose load in the `/overview` or `/roster` payload so the dashboard can color nodes by delegation pressure.
- `desktop-plugin/plugin.js` — optional load indicator ring on nodes in the graph canvas and deck view.

**Why it matters:** In a 75-node fleet, the fastest failure mode is not a wrong supervisor edge but a delegation cascade — one director hands off to a subtree that is already saturated, and the work piles up silently. Capacity awareness turns that silent failure into a visible triage signal, which is exactly what the deck view's NEEDS ATTENTION triage is built to surface.

---

## 2. Semantic information-flow labels on edges

**Concept:** `can_communicate()` is purely structural — up, down, or peer — which is correct as a floor but coarse as a ceiling. In a real fleet, not every edge is equal: a soul edit flowing from a supervisor into a subordinate is normal, but the reverse direction may be wrong; transcript data may be safe to share peer-to-peer inside a directorate but not across directorate boundaries; delegation commands are one-writer, many-reader by nature. SafeFlow's semantic information-flow control for multi-agent systems is the inspiration here: attach a small label set to each edge (or to each direction of a peer edge) and let `can_communicate()` consult both the structural rule and the label filter. The label vocabulary must stay tiny and extensible — e.g. `soul`, `transcript`, `delegation`, `control` — so it never becomes a policy engine in disguise.

**Files touched:**
- `fleet_graph_core.py` — new `can_communicate_with_policy(graph, relations, sender, recipient, channel)`; new edge-label normalization in `normalize()`; label coersion helpers so old graphs without labels still pass.
- `fleet_graph.yaml` — optional per-edge or per-direction labels (schema migration from unlabeled to labeled is additive).
- `plugin_api.py` — enforce the channel filter on `POST /send` so the UI's talk/delegate/supervisor frames map to labeled channels; return a policy denial reason alongside the structural denial reason.
- `desktop-plugin/plugin.js` — render edge labels as small badges on the canvas, so operators can see at a glance which edges carry which kind of traffic.

**Why it matters:** FleetGraph's current model asks "can these two profiles talk?" but a 75-node fleet with peer relations and multiple message types needs the more precise question "can these two profiles talk about this kind of thing?" Labels keep the topology readable while giving operators a real policy surface that degrades safely — a graph with no labels still behaves exactly as it does today.

---

## 3. Budget-aware delegation with pre-flight token projection

**Concept:** The Token Budgets paper catalogs 63 real LLM-agent budget-overrun incidents and shows that the failure is almost always a delegation or toolchain path that multiplies tokens beyond what the caller anticipated. FleetGraph already has a `/simulate` endpoint and `can_delegate_to()` for structural delegation checks; the missing piece is a budget dimension. Add optional per-node `token_budget` metadata (a soft cap, not a hard block) and a budget-projection helper that estimates the delegation's downstream token cost by walking the proposed subtree and summing per-node estimates. `can_delegate_to()` gains an optional `budget_advisory` field, and `/simulate` gains a budget projection mode so an operator can see the projected burn before committing to a delegation chain. The estimates are rough by design — the point is to make overruns visible before they happen, not to guarantee precision.

**Files touched:**
- `fleet_graph_core.py` — new per-node `token_budget` normalization; new `project_delegation_cost(graph, sender, recipient, contract)` returning estimated token cost and budget headroom; enrich `can_delegate_to()` with an optional budget advisory; expose budget-aware mode on existing functions without breaking callers.
- `fleet_graph.yaml` — optional `_meta.profile_budgets: {profile: {token_budget: N}}` (defaults to unset = no advisory).
- `plugin_api.py` — extend `/simulate` with a `?budget=1` query parameter; surface budget projection in the delegation frame response.
- `desktop-plugin/plugin.js` — optional budget bar on nodes and delegation preview in the composer, so an operator sees projected burn before confirming.

**Why it matters:** Delegation is the main token burn path in a fleet — a single unchecked cascade can consume the context window of every node in a subtree. Budget awareness does not prevent delegation; it makes the cost of delegation legible at the moment of decision, which is where operators actually have leverage. Combined with idea 1 (capacity) and idea 2 (policy labels), the three give FleetGraph a complete delegation-safety surface — structural, load, policy, and budget — without turning the core into a policy engine.

---

*Generated tick: 2026-08-31. Grounded in `fleet_graph_core.py` (pure-graph core, single-file SSOT, atomic save with Windows retry), `plugin_api.py` (FastAPI backend with /overview, /send, /simulate, /roster, /match), desktop-plugin/plugin.js (graph canvas, deck view, message composer, SOUL editor), and `fleet_graph.yaml` (75-node Primordial Triad topology with peer relations).*
