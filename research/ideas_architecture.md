# Architecture Ideas — FleetGraph

Generated each tick from arxiv searches + codebase grounding.
Papers are inspiration, not requirements.

---

## 2026-08-30 — 6 papers found (3 per query)

### 1. Delegation Contracts with Budget Guardrails

**Concept:** Extend `can_delegate_to()` from a purely structural check (does the recipient have subordinates? is the subtree deep enough?) into a full delegation contract system with budget guardrails. The Token Budgets paper (2606.04056) catalogs 63 real LLM-agent budget-overrun incidents — delegations that spiral because nobody bounded them. SPOQ (2606.03115) shows specialist-orchestrated queuing where work is split by capability and capacity, not just topology. FleetGraph already has the structural scaffolding (`subtree_nodes()`, `subtree_depth()`, `can_delegate_to()`); what's missing is the *contract* layer that says "this delegation is allowed structurally but costs X tokens / Y turns and the sender caps at Z."

**What changes:**
- `fleet_graph_core.py`: Add `DelegationContract` typed dict (max_depth already partially supported, add max_tokens, max_turns, max_hops, expiry). Extend `can_delegate_to()` to validate against contract fields. Add `estimate_delegation_cost(graph, sender, recipient, contract)` returning a rough cost envelope (subtree size × depth × estimated per-node overhead). Add `delegation_chain_trace(graph, sender, recipient)` that returns the full delegation path with cost annotations per hop.
- `fleet_msg.py`: Add `--contract` flag to `fleet_msg delegate` that carries the contract payload; reject at send-time if contract violated.
- `dashboard/plugin_api.py`: New `POST /delegate/contract` endpoint that validates a contract against the graph before commitment; `GET /delegate/active` listing in-flight delegations with remaining budget.
- `desktop-plugin/plugin.js`: Delegation composer gains a contract panel — sliders/fields for max_depth, token budget, turn limit — with live feasibility feedback from the API. Active delegations show as a separate deck in the UI with burn-down indicators.

**Why it matters:** The current delegation check is a gate, not a guardrail. A bot can delegate to a subordinate with a deep subtree and no budget ceiling — structurally valid, operationally unbounded. Adding contracts turns delegation from "can I?" into "should I, and under what constraints?" That's the difference between a fleet that spirals and one that self-regulates. The Token Budgets paper's entire thesis is that budget overruns are the dominant failure mode in multi-agent systems; FleetGraph should be ahead of that curve.

---

### 2. Information-Flow Policy Engine (SafeFlow-Inspired)

**Concept:** `can_communicate()` currently enforces a structural policy: up to supervisor, down to subordinates, sideways to declared peers — everything else blocked. That's a *topology* policy, not a *data* policy. The SafeFlow paper (2607.25255) proposes semantic information-flow control: labeling messages by sensitivity class and enforcing propagation rules that restrict *what kind of content* can traverse *which kind of edge*. FleetGraph's architecture is ready for this — the graph already knows who can talk to whom; the missing piece is message classification and policy overlays that say "confidential messages cannot go peer-to-peer" or "restricted content only travels up the chain."

**What changes:**
- `fleet_graph_core.py`: Add `MessageClass` enum (public, internal, confidential, restricted). Add `CommunicationPolicy` typed dict: per-class rules like `allowed_channels: list[Literal["up","down","peer","all"]]`, `requires_approval: bool`, `audit_log: bool`. Add `classify_message(content: str, policy: CommunicationPolicy) -> MessageClass` (rule-based or callable). Add `can_propagate(graph, relations, sender, recipient, msg_class, policy) -> tuple[bool, str]` — extends `can_communicate()` with class-aware channel restrictions. Add `policy_violation(graph, sender, recipient, msg_class, policy) -> dict` returning the violation detail for audit.
- `fleet_msg.py`: Add `--class` flag to `fleet_msg send` (talk/delegate/supervisor frames). Reject at send-time if `can_propagate()` fails. Add `--policy` to point at a policy YAML for the fleet.
- `dashboard/plugin_api.py`: New `GET /policy` and `PUT /policy` endpoints. Extend `POST /send` to accept `message_class` and enforce policy. Extend `GET /traffic` to include `message_class` in the traffic log. New `GET /violations?window=` returning recent policy violations.
- `desktop-plugin/plugin.js`: Message composer gains a sensitivity selector (public/internal/confidential/restricted) that's enforced server-side. Policy violations in the traffic log are highlighted. The graph canvas shows policy-aware channel coloring — e.g., peer edges dimmed for restricted traffic.

**Why it matters:** The current model treats all messages as equal — a bot's casual chat and a bot's credential-bearing instruction traverse the same channels with the same permissions. That's the wrong default for a fleet that includes adversarial figures (Lore, Garak, Dukat in the Red Team). SafeFlow's insight is that multi-agent systems fail when malicious or sensitive content propagates through channels that were open for benign traffic. FleetGraph's topology is the enforcement surface; adding class-aware policy makes it a real security boundary instead of just an org chart.

---

### 3. What-If Topology Simulation + Failure Cascade Analysis

**Concept:** FleetGraph has a `/simulate` endpoint and pure-graph functions (`chain()`, `subtree_nodes()`, `subtree_depth()`, `describe()`) that could power much richer simulation. The HiMA-MDD paper (2608.21868) demonstrates hierarchical multi-agent harnesses where the hierarchy itself is the interpretable output — you can see *why* a decision flowed the way it did. AGENTSERVESIM (2606.09613) shows hardware-aware agent simulation where you model capacity and load before deploying. FleetGraph should let operators ask: "what happens to the communication graph if I detach Worf from his current supervisor and attach him under Picard?" or "if sophia goes down, what's the cascade radius?" — and see the answer visually before committing.

**What changes:**
- `fleet_graph_core.py`: Add `simulate_topology_change(graph, relations, proposed_changes: list[dict]) -> dict` — accepts a list of {action: "detach"|"attach"|"peer_add"|"peer_remove", profile, target} operations, applies them to a *copy* of the graph, returns the normalized result plus a diff against the original (added edges, removed edges, changed supervisors). Add `failure_cascade(graph, relations, failed_node: str) -> dict` — returns the set of nodes that lose their communication path to the root (or to peers) if `failed_node` goes down, the cascade depth, and which nodes become orphaned (no supervisor, no peer path). Add `load_estimate(graph, relations, node: str, window_hours: int) -> dict` — rough estimate of message volume for a node based on subtree size, peer count, and an assumed per-edge per-hour rate. Add `what_ifDelegation(graph, sender, recipient, contract) -> dict` — simulates a delegation under a contract without committing it; returns the projected delegation tree and cost envelope.
- `dashboard/plugin_api.py`: Enhance `POST /simulate` to accept what-if operations (not just chain-of-command traces). Add `POST /what-if/topology` and `POST /what-if/failure` endpoints that return the simulation result. Add `GET /what-if/cascade/{node}` convenience endpoint.
- `desktop-plugin/plugin.js`: Graph canvas gains a "what-if mode" — operator selects a node, chooses an action (detach/attach/peer add/failure simulate), and the canvas shows the *projected* topology as a translucent overlay on the current topology, with cascade radii highlighted in red. The simulation panel shows the diff: "Worf would move from pylons to picard; 3 edges added, 2 removed; cascade radius if picard fails: 7 nodes."

**Why it matters:** The current rewire inline feature lets operators change topology, but it's commit-first, inspect-later. That's fine for small fleets but dangerous for a 75-node DAG with peer relations, where a single detach can silently orphan multiple subordinates or break peer communication paths. HiMA-MDD's insight is that hierarchy is *interpretable* — you can see the structure and reason about it. FleetGraph should make topology changes *reversible in imagination* before they're irreversible on disk. The failure cascade analysis is especially relevant for the Primordial Triad's 4-root structure: if one root goes down, which directorates are affected and which are insulated by the peer topology?

---

*Generated from arxiv searches: "multi-agent orchestration hierarchy" (HiMA-MDD 2608.21868, AGENTSERVESIM 2606.09613, SPOQ 2606.03115) and "agent organization structure delegation" (Delegated Fair Division 2607.27743, SafeFlow 2607.25255, Token Budgets 2606.04056).*
