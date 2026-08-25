# FleetGraph Architecture Ideas

> Generated: 2026-08-24 (cron tick)
> Papers this tick: 6 found across 2 searches

---

## Idea 1: Specialty-Aware Task Queue with Load Balancing

**Concept:** The current `/match` endpoint returns a flat semantic ranking — "who is most capable of this?" — but ignores whether that bot is already drowning. Inspired by SPOQ's *Specialist Orchestrated Queuing* (2606.03115), add a lightweight task-queue layer that combines capability score with real-time load (active-session status, unread inbox depth, interrupted-session count). The operator picks a task, the queue recommends the best *available* specialist, and optionally auto-dispatches via `fleet-msg send`. This turns FleetGraph from a passive org chart into an active orchestration surface.

**Files touched:**
- `dashboard/plugin_api.py` — new `GET /queue` (current queue state) and `POST /queue/dispatch` (enqueue + optional auto-send) endpoints
- `fleet_msg.py` — new `fleet-msg queue` subcommand (list/pending, enqueue, drain)
- `desktop-plugin/plugin.js` — new "Dispatch" panel beside the message composer, showing ranked candidates with live load badges

**Why it matters:** The fleet's 68+ Star Trek profiles are useless if the best bot for a task is already mid-conversation and the operator has no way to know. SPOQ proves that specialist-aware queuing beats round-robin for multi-agent software engineering; FleetGraph's richer semantic roster (keywords + toolsets + live status) should beat SPOQ. It closes the loop between "who is good at this" and "who can actually take it right now."

---

## Idea 2: Hierarchical Attribution Traces for Multi-Bot Tasks

**Concept:** When a task bounces through the fleet — Data researches, Spock validates, Picard decides — there is no record of *who contributed what* to the final output. BOHM (2606.05.22866) provides *Zero-Cost Hierarchical Attribution* by tagging outputs as they propagate. FleetGraph already has `chain()` computing routing paths; extend every message record with an optional `attribution` field that accumulates `{by, ts, contribution_type}` as the task moves up/down the tree. A new `GET /attribution/{task_id}` endpoint reconstructs the full provenance chain. The UI renders it as a collapsible "geneology" panel on any completed task.

**Files touched:**
- `fleet_graph_core.py` — add `attribution()` helper that walks `chain()` and merges per-hop metadata; extend `describe()` to include attribution summary
- `fleet_msg.py` — `--attribution` flag on `send` that stamps the message header with the sender's contribution type; new `fleet-msg attribution <task>` subcommand
- `dashboard/plugin_api.py` — new `GET /attribution/{task_id}` and `POST /attribution/{task_id}/append` endpoints
- `desktop-plugin/plugin.js` — attribution drawer in the inspector, showing the contribution chain with timestamps

**Why it matters:** Without attribution, multi-bot collaboration is a black box. When Picard produces a final answer, there's no way to know whether Data's research was actually used or if Spock's validation mattered. Attribution is prerequisite for the fleet's *accountability* design principle (Design Principle #4: "User agency stays intact"). It also enables future ideas like contribution-weighted reputation or automatic escalation when a specialist's output is consistently bypassed.

---

## Idea 3: Semantic Flow-Control Policy Layer

**Concept:** `can_communicate` enforces *structural* policy (supervisor/subordinate/peer edges) but ignores *semantic* content. SafeFlow (2607.25255) implements *Semantic Information-Flow Control* to block malicious propagation — FleetGraph needs the same for sensitive data. Add a pluggable policy engine that inspects message content against rules: block credential/PII upward-propagation, restrict destructive commands (e.g., `rm`, `delete`) to downward-only flows, require supervisor approval for lateral peer sends of certain types. Policies live in `_meta.policies` in `fleet_graph.yaml` so they're versioned with the topology. The UI shows policy violations inline in the composer before the send button activates.

**Files touched:**
- `fleet_graph_core.py` — new `can_communicate_semantic(graph, sender, recipient, content, policies)` policy check; extend `normalize()` to validate policy references; add `load_policies()` alongside `load_relations()`
- `fleet_msg.py` — policy enforcement in `cmd_send` (reject with structured `policy_violation` error); new `fleet-msg policies` subcommand (list/validate)
- `dashboard/plugin_api.py` — `GET /policies`, `PUT /policies`, and a `POST /simulate` extension that returns policy-check results alongside the structural check
- `desktop-plugin/plugin.js` — composer shows a yellow policy-warning banner when content triggers a rule; red block + explanation when the send is forbidden

**Why it matters:** The fleet's 68 personas have different trust levels — Lore, Garak, and Seska are explicitly Red Team (adversarial). A structural-only policy means any peer relation is a free pipeline for data exfiltration. SafeFlow proves that semantic flow-control is tractable; FleetGraph's existing `can_communicate` is the natural extension point. This is the difference between a toy org chart and a production-grade multi-agent operating system where the operator can *reason* about information flow, not just topology.

---

## Papers Referenced This Tick

| ID | Title | Relevance |
|----|-------|-----------|
| 2606.03115 | SPOQ: Specialist Orchestrated Queuing for Multi-Agent Software Engineering | Idea 1 — specialist-aware task queue |
| 2605.22866 | BOHM: Zero-Cost Hierarchical Attribution for Compound AI Systems | Idea 2 — attribution traces |
| 2607.25255 | SafeFlow: Semantic Information-Flow Control for Blocking Malicious Propagation | Idea 3 — semantic policy layer |
| 2607.27743 | Delegated Fair Division | Fair-load extension for Idea 1 |
| 2606.04063 | Token Budgets: Affine-Typed Rust Mitigation for Agent Budget Overruns | Budget tracking extension for Idea 1 queue |
| 2606.09613 | AGENTSERVESIM: Hardware-aware Simulator for Multi-Turn Agent Serving | Load-modeling reference for Idea 1 |