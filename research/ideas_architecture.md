# FleetGraph Architecture Ideas — 2026-08-24 tick

Papers this tick: AgentServeSim (2606.09613), SPOQ (2606.03115), BOHM (2605.22866), Delegated Fair Division (2607.27743), SafeFlow (2607.25255), Token Budgets (2606.04056).

---

## 1. Zero-cost hierarchical attribution: per-edge message provenance in the DAG

**Concept.** BOHM (2605.22866) shows compound-AI outcomes can be attributed back through the hierarchy with no extra inference cost, by propagating credit along existing structural edges at read time. FleetGraph's `chain()` in `fleet_graph_core.py` already computes the supervisor-path routing chain for every validated send; that path is exactly the attribution spine. Store the resolved chain (and the `can_communicate` direction — up/down/peer) alongside each delivered message in the inbox records, then expose a `GET /attribution?window=` endpoint that walks stored chains to answer "which supervisor's delegation produced this downstream output" — pure post-processing, no model calls.

**Files.** `fleet_msg.py` (record chain + direction on send), `dashboard/plugin_api.py` (new `/attribution` route), `desktop-plugin/plugin.js` (overlay on the graph canvas: highlight the chains that carried traffic for a selected bot).

**Why it matters.** With 75 nodes and multi-hop delegation, when a subordinate produces something great (or catastrophic) the operator currently has no structural way to trace which upstream decisions fed it. Attribution turns the org chart from a static picture into an accountability instrument, and it costs only a schema field and one read-time walk.

---

## 2. Semantic information-flow labels: taint tracking on lateral peer edges

**Concept.** SafeFlow (2607.25255) blocks malicious propagation by tagging information with semantic flow labels as it moves between agents. FleetGraph's red team directorate (`lucifer`, plus adversarial profiles like Lore/Khan/Seska) is deliberately connected into the same DAG as operational bots. Add an optional per-node `flow_class:` field (e.g. `ops | redteam | legal`) in `fleet_graph.yaml`, validated in `normalize()` like any other node attribute, and enforce it in `can_communicate()`: messages originating from a `redteam` node carry a taint tag that is refused by `ops`-class recipients unless explicitly allow-listed in relations. The dashboard surfaces tainted edges in a distinct color.

**Files.** `fleet_graph_core.py` (`normalize()` validation, `can_communicate()` policy check, new `flow_label()` helper), `topology/fleet_graph.yaml` (annotate nodes), `dashboard/plugin_api.py` (reject tainted sends in `/send`, expose classes via `/overview`), `desktop-plugin/plugin.js` (edge coloring).

**Why it matters.** Right now the only lateral-send guard is "is there a declared peer edge" — a compromised or roleplaying adversarial persona that shares a peer relation can inject content straight into production bots. Flow labels give the Primordial Triad structure a real containment boundary while keeping the intentional Data↔Spock-style collaborations working.

---

## 3. Specialist orchestrated queuing: per-directorate work queues instead of flat inboxes

**Concept.** SPOQ (2606.03115) routes tasks to specialist agents through orchestrator-managed queues rather than broadcast, cutting redundant work. FleetGraph's inbox is per-profile and flat: a supervisor delegating to several subordinates duplicates effort and there is no notion of "this task belongs to sophia's directorate." Add queue semantics to the inbox layer: messages tagged with a `queue:` key (derived from the recipient's nearest directorate ancestor, computed by walking `supervisor` links — the same walk `chain()` already does), with endpoints to list queues, claim a message (marks it in-progress so a sibling subordinate doesn't double-handle), and reassign within the directorate.

**Files.** `fleet_msg.py` (tag + claim/reassign subcommands), `maintenance/fleet_maint.py` (prune/status awareness of claimed items), `dashboard/plugin_api.py` (`GET /queues`, `POST /queues/{q}/claim`), `desktop-plugin/plugin.js` (deck view groups NEEDS ATTENTION cards by queue).

**Why it matters.** The deck view already triages NEEDS ATTENTION but treats every unread message as independent operator work. Queue-by-directorate makes delegation idempotent — one claim, one owner — which is the difference between 68 bots amplifying a task and 68 bots dividing one.
