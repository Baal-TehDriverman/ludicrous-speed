# FleetGraph UX/Observability Ideas

Generated: 2026-08-27 · FleetGraph tick · operator-at-2am lens

---

## 1. Fleet Activity Heatmap — "When Does the Fleet Actually Live?"

**Concept:** A time-dimension overlay on the fleet graph that shows activity density across the last 24 hours (or week). Each node gets a small heatmap strip beneath it; brighter cells = more sessions/messages/tool activity in that time bucket. The deck view gets a fleet-wide density chart. An operator can immediately see which bots are nocturnal, which ones spike on certain days, and whether the fleet is sitting idle at 3am or quietly burning context.

**Files touched:**
- `dashboard/plugin_api.py` — new `GET /activity/heatmap?window=24h` endpoint that aggregates session starts + message counts per bot per time bucket from `state.db` + inbox files
- `desktop-plugin/plugin.js` — new `HeatmapStrip` component per node; fleet density chart in deck header; time-range selector (1h / 6h / 24h / 7d)

**Operator pain solved:** Right now you see current state — who's talking, who's idle. You can't see PATTERNS. At 2am you don't know if a bot is quietly running long sessions or if the fleet is genuinely asleep. A heatmap turns "current status" into "behavioral rhythm" — which bots need monitoring at odd hours, which ones are consistently busy, whether the fleet has a circadian rhythm you can plan around.

---

## 2. Incident/Escalation Timeline — "What Just Happened?"

**Concept:** When a bot interrupts, escalates, or cascades through the chain of command, reconstruct it as a linear timeline the operator can read at a glance. The timeline tracks: message in → escalation up → delegation down → resolution or abandonment, with timestamps. Extended from the existing traffic/inbox system: each message carries its frame (`talk` / `delegate` / `supervisor`), and the timeline stitches consecutive supervisor/delegate frames into an incident arc. A "Needs Attention" bot in the deck view gets a "View timeline" action that opens this reconstruction.

**Files touched:**
- `dashboard/plugin_api.py` — new `GET /incidents/{profile}?window=` endpoint that walks the inbox chronologically, groups consecutive supervisor/delegate frames into arcs, returns structured timeline entries `[{ts, from, to, frame, summary, type: escalation|delegation|resolution|abandoned}]`; extend `/traffic` to tag chain hops
- `desktop-plugin/plugin.js` — new `IncidentTimeline` panel (slides in from inspector or deck card action); visual chain rendering with arrows showing direction; color-coded by frame type; "resolve" / "dismiss" actions that write back to watermark state

**Operator pain solved:** At 2am something goes wrong. You open the fleet graph and see Lilith is "interrupted" and Hermes has an unread inbox. What do you do? Currently you click each bot, read its inbox, read its session tail, piece together what happened. An incident timeline gives you the narrative: *"Lilith tried to delegate to thoth at 01:47, thoth interrupted at 01:49, Lilith escalated to hermes at 01:52, hermes replied at 01:54, thoth recovered at 02:01."* That's the difference between "something's wrong" and "here's what happened and here's where it's stuck."

---

## 3. Per-Bot Cost & Session Audit Panel — "What Is Each Bot Actually Doing?"

**Concept:** An audit panel in the inspector that surfaces per-bot operational metrics: session count (last 24h), average session length, total messages sent/received, tool call count (from session tails), context window pressure estimate (session message count vs. model context limit), and — where the provider exposes it — token usage. The deck view gets a fleet-wide "top 5 by session volume" and "top 5 by context pressure" mini-list. This turns the fleet from a static org chart into a measurable operation.

**Files touched:**
- `dashboard/plugin_api.py` — extend `/sessions/{name}/messages` to return tool-call metadata (tool name, status: `started` / `completed` / `failed`) alongside message text; new `GET /audit/{name}` endpoint aggregating session stats from `state.db` (session count, message counts, tool call counts, last session timestamp); new `GET /audit/fleet` for fleet-wide ranking
- `desktop-plugin/plugin.js` — new `AuditPanel` component in the inspector (replaces or supplements the session tail); deck view "pressure list" mini-widget; tooltip on each node showing session count + context pressure indicator

**Operator pain solved:** You're running 68 bots. Some are specialists used once a week. Others are workhorses handling every inbound task. Without visibility, you can't tell which bots are burning context windows, which ones are sitting idle, which ones are carrying disproportionate load. A bot with 200 messages in its latest session is probably near its context limit and about to degrade — you want to know BEFORE it starts giving bad answers. This closes the loop from "who's in the fleet" to "how is the fleet actually running."

---

*ArXiv inspiration this tick:* multi-drone safety-critical oversight (2608.21444), drift-aware lifecycle monitoring (2606.17915), process-based conversational agent monitoring (2606.17789) — all reinforce the gap between "current state" and "operational narrative" that ideas 1 and 2 target.
