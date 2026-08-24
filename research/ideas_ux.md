# FleetGraph UX/Observability Ideas — tick output

Generated: 2026-08-24 (cron). Lens: what does the operator need to SEE at 2am
when a fleet of ~25 bots has gone sideways? Current UI shows *now* (status
chips, glow, unread badges) but almost nothing about *recently* or *trends*.

---

## Idea 1 — Escalation Ledger: "who is stuck, for how long, and who knows"

**Concept.** The initiative ladder says bots escalate after >15 min blocked,
but nowhere in FleetGraph can an operator see escalations as a first-class
stream. Add a backend endpoint `GET /escalations?window=` that scans inbox
jsonl files for `frame == "supervisor"` records plus interrupted-session
markers, and renders a **Ledger tab** in the desktop plugin: a reverse-
chronological list of escalation events (bot, target supervisor, age, message
summary), grouped into OPEN (unanswered, aging — sorted worst-first) and
RESOLVED (a later session completed after the escalation). Each open row
shows an aging timer that crosses from accent → warning → danger at operator-
configurable thresholds, with one-click "open inspector" deep-link. At 2am
the question "is anything blocked and unacknowledged?" becomes one glance.

**Files touched.**
- `dashboard/plugin_api.py` — new `/escalations` endpoint (inbox scan + session status join)
- `desktop-plugin/plugin.js` — Ledger view/tab + query hook + deep-link wiring
- `tests/` — harness branch for the ledger render; integration test for the endpoint

**Operator pain solved.** Blocked bots are currently invisible unless you
happen to click their card and read the transcript. Interrupted chips exist,
but there's no notion of *acknowledged vs. unanswered distress* across the
fleet, and no aging signal — the two things triage actually needs.

---

## Idea 2 — Fleet Activity Heatmap: 24h rhythm per bot on one screen

**Concept.** Status chips answer "what is this bot doing now"; they say
nothing about whether today's silence is normal. Add `GET /activity/heatmap`
that buckets each profile's session activity (from `state.db` timestamps and
inbox traffic) into hour-of-day × bot cells over the last 24–72h, and render
it as a compact GitHub-style heatmap strip per bot row (or a full grid view).
Cells shade by message/turn count using only token-layer colors; hours with
zero activity stay flat. Overlay markers for interruptions (warning-colored
ticks) so patterns like "this bot dies every night around 03:00" or "this
team went quiet 6 hours ago" pop immediately. Cheap to compute — same
read-only state.db access the tail snapshot already uses.

**Files touched.**
- `dashboard/plugin_api.py` — `/activity/heatmap?hours=24|48|72` aggregation endpoint
- `desktop-plugin/plugin.js` — heatmap strip component + toggle in Deck view header
- `tests/` — configurability gate (no color literals), harness for empty/partial data

**Operator pain solved.** Anomaly detection by rhythm: a dead bot among busy
ones is obvious in chips, but a *fleet-wide stall* or a recurring nightly
crash pattern is invisible in any point-in-time view. This gives the
operator a temporal dimension without logs or terminals.

---

## Idea 3 — Traffic Replay Timeline: scrub the last hour of fleet chatter

**Concept.** Discussion glow shows edges talking *right now*, then the
moment passes. Extend `/traffic` with a persisted ring buffer (backend keeps
last N hours of inter-agent events in memory/file) and add a **Replay**
scrubber: a horizontal timeline under the graph canvas where the operator
drags through the recent past and the glow/pulse state re-renders for that
instant — see the burst of delegate messages before a failure, spot which
edge went silent, watch a conversation cascade spread. Include a speed
control (1×/10×/60×) and event ticks colored by frame type (`talk`,
`delegate`, `supervisor`) along the track. Inspired by CHARM-style cascade
analysis (arXiv 2606.04435): failures in agent systems propagate through
message chains, so replaying the chain is diagnosis.

**Files touched.**
- `dashboard/plugin_api.py` — extend `_recent_traffic` with a bounded persistent buffer; `/traffic?at=<ts>` historical slice
- `desktop-plugin/plugin.js` — timeline scrubber component, playback state hook, glow re-render from arbitrary ts
- `tests/` — loop-style harness for scrubber states; adversarial test for malformed ts

**Operator pain solved.** Post-mortems are impossible today: once the glow
fades, the evidence of *who talked to whom right before things broke* is
buried in raw jsonl. The scrubber turns the graph canvas itself into a
forensic instrument — rewind, find the last edge that lit up, open those two
bots' transcripts.

---
*Next tick candidates:* cost/token visibility per bot (needs model+session
join), supervisor-load imbalance meter, "stale topology" warnings (nodes in
graph whose profiles vanished — ties to the known deletion-prune limitation).
