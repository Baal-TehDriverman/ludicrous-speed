# FleetGraph UX / Observability Ideas — Tick 2026-08-24

Generated from a read of `dashboard/plugin_api.py` (overview, traffic, inbox
watermarks, sessions/tail, send) and `desktop-plugin/plugin.js` (graph canvas,
discussion glow, inspector). This tick's theme: **the operator needs to
understand the fleet's *memory* and *relationships*, not just its right-now
state.** Last tick covered history (timeline), health (stuck-bot), and spend
(cost). This tick covers search, delegation flow, and activity rhythm.

---

## 1. Cross-Fleet Session Search — "Who said what about X?"

**Concept.** The inspector shows one bot's *latest* session, but the operator's
real question is fleet-wide: *"Spock mentioned a topology fix three days ago —
what exactly did he say, and which thread?"* Add a full-text search endpoint
that walks every profile's `state.db`, extracts message content via the same
path `/sessions/{name}/messages` already uses, and returns ranked snippets
with profile + timestamp. Frontend: a global search input in the header (⌘K
shortcut) that queries `/search?q=&days=7&profile=`, shows results as a
dropdown with bolded hit snippets, and clicking a result opens that bot's
inspector with the matching message scrolled into view. Backend reuses
`_latest_session()` to find each profile's session list, then reads messages
from each. No new indexing — state.db files are already SQLite FTS-capable.

**Files touched:** `dashboard/plugin_api.py` (`GET /search` endpoint, profile
iteration over `state.db` message reads), `desktop-plugin/plugin.js`
(global search modal component + ⌘K binding, search query hook).

**Operator pain solved:** The fleet has 75 bots, each with days of sessions.
Today finding a past conversation means clicking bots one-by-one and scrolling
their latest session. Search turns "I vaguely remember…" into a 2-second
answer — critical at 2am when the operator needs to confirm whether a bot
already diagnosed the current problem before waking a fresh session.

---

## 2. Delegation Chain Path Highlighter — trace the org chart in motion

**Concept.** Messages sent via `/send` with `delegate` or `supervisor` frames
already validate the routing chain through `chain()` and `can_communicate()`,
but the *sent* message records nothing about the path it took. The operator
sees two unread badges on two different bots with no visual connection between
them. Extend the message record to include a `chain` field (the ordered list
of nodes the message traversed, already computable from the graph). Then, in
the inbox inspector, add a "Trace on Graph" button that opens the canvas view
and highlights the full path — each hop glowing in sequence, with the
message type (talk/delegate/supervisor) labeled at each edge. For multi-hop
delegation (lilith → hermes → default → specialist), the operator sees the
exact route instead of guessing which bot handed off to which.

**Files touched:** `dashboard/plugin_api.py` (extend `fleet_send()` to write
the computed chain into the JSONL record; add a `GET /msg/{profile}/{id}`
endpoint that returns the chain for a single message),
`desktop-plugin/plugin.js` (trace button in inbox inspector, graph canvas
path-highlight overlay, animated edge traversal).

**Operator pain solved:** When a delegated task stalls, the operator needs to
know *where* it stopped — was it handed to the right specialist? Did the
supervisor-escalation frame reach its destination? Today that means mentally
piecing together inbox entries from multiple bots. Path highlighting turns the
org chart from a static diagram into a living record of work in flight.

---

## 3. Fleet Pulse Heatmap — directorate rhythm at a glance

**Concept.** The discussion glow shows traffic between pairs, but not the
*aggregate rhythm* of the fleet. Is the Engineering directorate humming at 2am
while Legal has been dead since midnight? A 4×7 grid of directorate-level
activity buckets (rows = directorates: Command, Supreme, Staff, Independent,
Red Team; columns = hours over last 24h) rendered as colored squares from
the existing token palette — `--fg-quaternary` (silent) through `--fg-accent`
(active) to `--fg-warning` (overloaded). Each square is hoverable for the
exact message count, clickable to filter the deck to that directorate's bots.
Backend: extend `_recent_traffic()` with aggregation into `/pulse?hours=24`
that groups messages by the recipient's directorate (computed from the graph
depth/path to root) and buckets them into hourly bins. The data already lives
in the inbox JSONL files — this is pure read-and-aggregate.

**Files touched:** `dashboard/plugin_api.py` (`GET /pulse` endpoint, directorate
resolution helper that walks each message's recipient up to its root directorate
in the graph), `desktop-plugin/plugin.js` (`<FleetPulse/>` component — grid
render with hover tooltips, click-to-filter wiring into the existing deck
status filter).

**Operator pain solved:** The header strip already counts "conversing" and
"needs attention" bots, but that's a snapshot — it tells you nothing about
*trends*. A directorate that's been silently accumulating unread escalations
for 3 hours looks identical to one that's idle because nothing was asked. The
heatmap makes the silent accumulation visible: a row of dim squares (dead) vs.
a row of glowing ones (chattering) vs. a sudden spike (storm). At 2am, one
glance at the heatmap tells the operator whether the fleet is winding down or
ramping up — and where to look.

---

### Inspiration noted (arXiv, this tick)
- Trustworthy Self-Composable Big-Data-as-a-Service (2606.17915) — lifecycle
  and cross-agent signal aggregation support Idea 3: fleet rhythm as a
  first-class observability surface.
- CHARM cascading-hallucination framework (2606.04435) — chain-of-custody
  tracking supports Idea 2: delegation paths need the same audit trail as
  hallucination chains.