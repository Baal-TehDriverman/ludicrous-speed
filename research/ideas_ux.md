# FleetGraph UX / Observability Ideas — Tick (2026-08-24)

*What does an operator actually need to SEE at 2am when something is wrong?*
Grounded in the current surface: `dashboard/plugin_api.py` (`/overview`, `/traffic`,
`/sessions/tail`, `/sessions/{n}/messages`, inbox watermarks, `_latest_session`
status reclassification) and `desktop-plugin/plugin.js` (tree/canvas views,
Inspector, StatusChip, traffic-glow edges). Inspiration from this tick's arXiv
scan: cascading-failure detection in agentic pipelines (CHARM) and drift-aware
lifecycle monitoring — both argue you need *propagation views*, not just
per-node status.

---

## 1. Incident Timeline — "What happened in the last hour?" scrubber

**Concept.** A fleet-wide timeline strip at the top of the canvas: a horizontal
band of the last N hours where every inter-agent message (`/traffic` history),
session state transition (active → interrupted → stale), and inbox spike is a
tick mark. The operator drags a playhead to any moment and the graph re-paints
as it looked *then* — which nodes were hot, which edge glowed, what the
transcript tail said. Backend: extend `plugin_api.py` with a `/history?from=&to=`
endpoint that replays inbox JSONL files plus session snapshots into a merged,
sorted event stream (all data already exists on disk — no new instrumentation
needed). Frontend: a new `TimelineStrip` component beside the existing viewport
controls in `CanvasGraph`.

**Files touched:** `dashboard/plugin_api.py` (new `/history` endpoint + event
merge helper), `desktop-plugin/plugin.js` (TimelineStrip component, playhead
state, per-tick graph repaint), `README.md` (endpoint table).

**Operator pain it solves:** Right now the UI only shows *now*. If a bot went
weird at 1am and the operator looks at 2am, the evidence is scattered across 68
inbox JSONLs and per-profile state.dbs. One scrubber answers "when did it start,
who talked to whom, what order" without grepping anything.

---

## 2. Escalation Heatmap — stuck-message and silence detector

**Concept.** Color every node not by its latest session status but by
*pressure age*: how long has its unread count been nonzero, how long since its
last successful session activity, and — critically — are there messages in its
inbox that reference frames it never answered (delegate/supervisor sends with
no subsequent session touch)? Render as a heatmap mode toggle on the existing
canvas: green = healthy, amber = unanswered inbound > threshold, red = silent
bot with a growing backlog (the classic "cron died but inbox keeps filling"
failure). Backend: a `/pressure` endpoint computing per-node
{oldest_unread_age_s, last_activity_age_s, backlog_rate} from watermarks +
state.db mtimes already tracked in `_latest_session`. Frontend: a view-mode
toggle next to tree/canvas that swaps node fill color for pressure color, with
hover showing the exact ages.

**Files touched:** `dashboard/plugin_api.py` (`/pressure` endpoint, small
helper reusing `_unread_counts` / `_latest_session`), `desktop-plugin/plugin.js`
(view toggle + `pressureColor()` beside existing `statusColor`),
`tests/` (endpoint unit test).

**Operator pain it solves:** Status chips lie at 2am — "interrupted" can mean
fine or dead. Pressure age doesn't: a bot with 40 unread and no session touch
in 6 hours is broken regardless of what the last row says. This turns "check
every bot one by one" into one glance.

---

## 3. Chain-of-Command Cost & Token Ledger — who is spending what

**Concept.** Every Hermes profile's config names a model/provider; sessions
accumulate token usage. Surface it: a per-bot, per-day cost/token column in the
deck cards and Inspector, plus a fleet-total header strip ("fleet today: 4.2M
tokens, $X, top spender: nyx"). Backend: a `/usage?window=` endpoint reading
per-profile usage records (Hermes session DBs carry token counts; fall back to
message_count × model-context estimate when absent), joined with each profile's
`config.yaml` model via the existing `_profile_meta`. Flag anomalies: a bot
whose spend jumped 10× vs. its trailing average (runaway loop signature).
Frontend: ledger tab in the Inspector and a compact sparkline on BotCard.

**Files touched:** `dashboard/plugin_api.py` (`/usage` endpoint, model-price
lookup table), `desktop-plugin/plugin.js` (BotCard sparkline, Inspector ledger
tab, header strip), `README.md` (feature bullet + endpoint).

**Operator pain it solves:** Token burn is invisible until the provider bill or
a rate-limit arrives. At 2am the question "is something looping?" currently has
no answer in the UI; a per-bot spend delta makes runaway agents visible in
seconds, and the fleet total makes capacity planning possible without leaving
the command center.
