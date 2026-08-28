# FleetGraph Architecture Ideas — Tick Archive

> Each tick: 2 arxiv searches → 3 PR-sized ideas grounded in the codebase.
> Papers are inspiration, not requirements. If no papers found, ideas come from codebase alone.

---

## Tick: 2026-08-27

### Papers consulted
- **SafeFlow** (2607.25255) — semantic taint propagation through collaboration graphs; workflow-level validation before irreversible actions
- **HiMA-MDD** (2608.21868) — three-layer agent hierarchy with bounded feedback, Hierarchical Evidence Trace for auditability
- **SPOQ** (2606.03115) — wave-based topological dispatch from dependency graphs; dual validation gates; Human-as-Agent integration
- Secondary: Delegated Fair Division (2607.27743), Token Budgets catalog (2606.04056), AGENTSERVESIM (2606.09613)

---

### Idea 1: Semantic Taint Propagation Through the Communication Graph

**Concept:** FleetGraph's `can_communicate()` already gates every inter-bot message by topology role (up/down/peer/blocked). SafeFlow's core insight is that danger isn't in individual messages — it's in *semantic intent* that gets fragmented across delegation boundaries and evades any single agent's judgment. Extend `fleet_msg.py` and `fleet_graph_core.py` with an optional taint label attached to outbound messages: a structured tag (e.g. `sensitive`, `executable`, `financial`, `personally-identifying`) that propagates through the org chart whenever the message is forwarded, delegated, or escalated. The dashboard's `POST /send` endpoint would surface taint status in the composer UI (color-coded border on the message card), and `fleet_graph_core.can_communicate` could optionally refuse to route tainted messages laterally — forcing sensitive intent up the supervisor chain where the responsible authority sees the full context before it fragments. This is a **policy toggle**, not a hard block: operators enable taint propagation per-graph via `_meta.taint_policy: true`, so existing flat deployments are untouched.

**Files touched:**
- `fleet_graph_core.py` — add `MessageTaint` dataclass + optional taint check in `can_communicate` (new optional param, backwards-compatible)
- `fleet_msg.py` — attach taint label on outbound CLI messages; propagate taint on delegate/forward
- `dashboard/plugin_api.py` — surface taint in `POST /send` request schema + response; add `GET /taint/{profile}` for current taint state
- `desktop-plugin/plugin.js` — composer UI: taint selector dropdown + visual indicator on sent/forwarded cards

**Why it matters:** The fleet's current security model is structural (who can talk to whom) but not semantic (what the message *means*). A bot that's allowed to delegate to a subordinate can inadvertently propagate a dangerous instruction that looks locally benign — exactly the fragmentation attack SafeFlow describes. Taint propagation preserves risk semantics across delegation boundaries without changing the topology, and the supervisor chain becomes a natural audit point for sensitive workflows. This turns FleetGraph from a communication *router* into a communication *accountability layer*.

---

### Idea 2: Wave-Based Parallel Dispatch from the Fleet DAG

**Concept:** SPOQ computes parallel execution waves from a task dependency graph — nodes that share no dependencies fire in the same wave, and the scheduler approaches the critical-path lower bound. FleetGraph already has the DAG (the org chart in `fleet_graph.yaml`), but it only uses it for *routing* messages, not for *scheduling work*. Add a `compute_dispatch_waves(graph, root_profiles)` function to `fleet_graph_core.py` that topologically sorts the DAG and returns wave assignments: every bot whose supervisor is in an earlier wave gets assigned to the next wave, so the tower of `baal → lilith → hermes → thoth → ...` becomes wave 0/1/2/3/..., and all peers at the same depth fire together. The dashboard's `POST /simulate` endpoint (chain-of-command simulation) would gain a `mode=waves` option that returns the wave assignment + estimated wall-clock assuming each wave runs in parallel. The desktop plugin's deck view could color-code nodes by wave, so the operator sees the fleet's parallelism capacity at a glance — not just who reports to whom, but which groups can execute concurrently.

**Files touched:**
- `fleet_graph_core.py` — new `compute_dispatch_waves(graph, roots=None) → dict[str, int]`; `chain()` already traverses the supervisor tree, this is the parallel cousin
- `dashboard/plugin_api.py` — extend `POST /simulate` with `mode: "waves"` response schema; add `GET /waves` standalone endpoint
- `desktop-plugin/plugin.js` — deck view: wave badge on each node card; graph canvas: wave-colored layer bands behind nodes
- `topology/fleet_graph.yaml` — optional `_meta.default_roots:` to declare dispatch roots (lilith, lucifer, yeshua) without hardcoding

**Why it matters:** The fleet's current simulation is purely sequential (chain of command, one message at a time). For a 68-node fleet with peer relations and multiple roots, that's a gross underestimate of what the topology *could* do. Wave dispatch turns the org chart into a parallelism blueprint — operators can see that `data` and `spock` (peers) can run the same task in parallel, that the DS9 and Voyager directorates are independent waves, and that the critical path through `baal → lilith → hermes → default` is the bottleneck. This is especially relevant for the Primordial Triad's four-root structure: wave dispatch makes the multi-root design *operationally visible* rather than just topologically declared.

---

### Idea 3: Hierarchical Evidence Trace — Summary Propagation with Audit Trail

**Concept:** HiMA-MDD's three-layer hierarchy (evidence routing → specialist judgment → audit reconciliation) produces a *Hierarchical Evidence Trace* — every intermediate judgment, revision, and final decision is preserved and reconstructable. FleetGraph's supervisor/subordinate chains already form a natural three-layer structure for many workflows (frontline bot → supervisor → director), but there's no mechanism for a subordinate's output to bubble up as a structured *summary* rather than a raw message, and no audit trail of what was concluded at each level. Add a `summarize_up(graph, profile, payload, relations)` function to `fleet_graph_core.py` that, given a bot's work output, walks up the supervisor chain and produces a layered summary: the bot's raw conclusion, its supervisor's assessment (optional, if the supervisor is in the fleet), and the next-level synthesis, stopping at the root or at a bot that has no supervisor. Each layer is timestamped and tagged with the bot profile, producing a reconstructable chain-of-conclusion trace. The dashboard's `GET /sessions/{n}/messages` would gain an `?trace=1` option that returns the message chain with summary layers interleaved, so an operator can see not just *what was said* but *what was concluded at each level*. The desktop plugin's inspector panel would show the trace as a stacked card (bot → supervisor → director) rather than a flat thread.

**Files touched:**
- `fleet_graph_core.py` — new `summarize_up(graph, profile, payload, relations=None) → list[dict]`; `describe()` already walks all nodes, this is the upward-summary cousin
- `fleet_msg.py` — optional `—summarize` flag on delegate that attaches a summary layer instead of raw forwarding
- `dashboard/plugin_api.py` — `GET /sessions/{n}/messages?trace=1` returns interleaved summary layers; `POST /send` gains optional `summary` payload field
- `desktop-plugin/plugin.js` — inspector panel: trace view with layered cards (bot layer, supervisor layer, director layer) + timestamp + profile tag on each

**Why it matters:** Right now, if `spock` delegates a finding to `picard` (supervisor), the operator sees two messages in the inbox: spock's raw output and picard's response. There's no structured record of *what spock concluded, what picard assessed it as, and whether the conclusion changed at the supervisor layer*. For a fleet doing substantive work (legal review via yeshua, red-team analysis via lucifer, infrastructure via hermes), that chain-of-conclusion trace is the difference between "the fleet said X" and "spock concluded X, picard assessed it as Y, and here's the evidence at each layer." HiMA-MDD's Hierarchical Evidence Trace is the direct inspiration: it's not about adding more agents, it's about making the existing hierarchy's *reasoning visible* rather than implicit in a flat message log. This also creates natural audit points — if a conclusion changes between layers, that's a flag the operator can see, not a silent rewrite.
