# FleetGraph — Architecture Ideas (tick: 2026-08-24)

Papers scanned this tick:
- BOHM: Zero-Cost Hierarchical Attribution for Compound AI Systems (arXiv:2605.22866)
- SPOQ: Specialist Orchestrated Queuing for Multi-Agent Software Engineering (arXiv:2606.03115)
- SafeFlow: Semantic Information-Flow Control for Blocking Malicious Propagation in Multi-Agent Systems (arXiv:2607.25255)

---

## Idea 1 — Hierarchical outcome attribution on the graph (inspired by BOHM)

**Concept.** BOHM attributes a compound system's final result back through its
hierarchy at zero extra cost, instead of treating every node as an
undifferentiated contributor. FleetGraph already has the full supervisor tree
(`fleet_graph_core.chain()` / `describe()`) and per-bot session tails, but it
only shows *current status* — it never answers "which subtree actually
produced this outcome?" Add an attribution pass: when a bot's latest session
completes, walk its ancestor chain and stamp each contributing edge with a
credit marker (e.g., delegation that led to completion vs. escalation that was
superseded). Render these as weighted/colored edges in `plugin.js` and expose
them via a new `/attribution?node=` endpoint.

**Touches.** `fleet_graph_core.py` (a pure `attribute(graph, sessions)`
function beside `chain()`), `dashboard/plugin_api.py` (new GET route reading
existing session-tail data), `desktop-plugins/fleet-graph/plugin.js` (edge
styling + inspector tab showing "contributed to" rollups).

**Why it matters.** The operator currently sees 23–26 nodes of activity but no
signal about where value flows; with the deck view triaging NEEDS ATTENTION,
attribution tells you which supervisors are dead weight and which subtrees do
the real work — rewire decisions stop being guesswork. It also directly serves
the existing initiative-ladder semantics (report-done vs. escalate) by making
the difference visible.

---

## Idea 2 — Delegation queues with specialist routing hints (inspired by SPOQ)

**Concept.** SPOQ shows orchestrators gaining throughput by queueing work for
specialists rather than ad-hoc direct sends. FleetGraph already has semantic
routing (`GET /match?q=` ranks the fleet by capability) and a validated
`delegate` frame — but delegation is fire-and-forget into the inbox. Add a
lightweight per-node delegation queue: `POST /send` with a new optional
`queue=true` parks the task on the target node, visible as a count badge on
its card/node, drained FIFO when the bot goes from `conversing` back to
`ready`. The composer can pre-fill the recipient using `/match` evidence
(already computed server-side), so "delegate" suggests the best-fit specialist
instead of requiring the operator to know the org chart by heart.

**Touches.** `dashboard/plugin_api.py` (`/send` extension + queue state under
`FLEET_INBOX_DIR`), `fleet_graph_core.py` (nothing — topology SSOT stays
clean), `desktop-plugins/fleet-graph/plugin.js` (badge on cards/nodes,
composer suggestion chip from `/match`, queue drain indicator).

**Why it matters.** Removes the two failure modes documented today: messages
arriving while a bot is mid-conversation get buried, and operators mis-route
delegation because they must remember capabilities manually. Queues make load
visible on the DAG itself (a hot node lights up), turning the org chart into
a live work-distribution dashboard, not just a communication map.

---

## Idea 3 — Information-flow taint labels on peer edges (inspired by SafeFlow)

**Concept.** SafeFlow blocks malicious propagation by labeling what may flow
between agents rather than only who may talk to whom. FleetGraph's
`can_communicate()` is purely structural (up/down/peer). Extend peer relations
with an optional per-edge flow label stored in `_meta.relations` (e.g.
`{peer: [other], labels: {"research": ["summaries-only"]}}`) — or simpler for
a PR-sized cut: a boolean `untrusted` flag per peer edge meaning "messages
from this peer require operator review before acting." `can_communicate()`
returns the label alongside allow/deny; the composer UI shows a taint badge;
`POST /simulate` reports how untrusted edges would propagate. Keep validation
in `normalize_relations()` so malformed labels fail fast like every other
relation violation.

**Touches.** `fleet_graph_core.py` (`normalize_relations()` label parsing,
`can_communicate()` return contract), `dashboard/plugin_api.py`
(`/simulate` + `/relations` payload), `desktop-plugins/fleet-graph/plugin.js`
(edge styling for tainted peers + Configure-tab editor).

**Why it matters.** The fleet passes arbitrary inbox text between bots today;
one compromised or hallucinating bot can steer any peer laterally with zero
friction. A structural trust layer matches the plugin's own philosophy ("edges
can't be faked") and closes the gap README flags around last-write-wins
external writers — labels are validated server-side, so even raw PUTs can't
silently open a trusted channel.
