# FleetGraph Synthesis — Tick 2026-08-31

**Style:** kairos-dream synthesis — codebase state × arxiv digest × fleet memory × current research surface  
**Scope:** `ludicrous-speed/` FleetGraph plugin (not the broader Lilith monolith)  
**Overwrite policy:** current tick replaces last; no accumulation, no drift

---

## 1. Current state of the codebase

### What is actually implemented

**Core engine:** `fleet_graph_core.py` is the single source of truth for topology. It reads/validates/normalizes `~/.hermes/fleet_graph.yaml`, keeps `subordinates` derived rather than duplicated, and enforces one-supervisor-per-node with cycle, self-edge, and known-node checks. Peer relations live under `_meta.relations`, symmetrized on load, with a legacy `peers:` fallback still supported. Communication policy is simple and strict: up to supervisor, down to own subordinates, sideways only to declared peers. The engine also has pure-graph helpers for `chain()`, `subtree_nodes()`, `subtree_depth()`, and a contract-aware `can_delegate_to()`.

**Messaging:** `fleet_msg.py` is the sanctioned inter-bot channel. It validates the edge against the live graph, appends to a per-profile JSONL inbox, and supports an optional blocking `--deliver` live turn. On GraphError it refuses in JSON instead of leaking a traceback.

**Dashboard API:** `dashboard/plugin_api.py` is a large FastAPI surface sitting on top of the same core module. It exposes overview, graph, relations, soul read/write, inbox read/drain, sessions tail, session messages, traffic, roster, semantic `/match`, simulate, delegate-check, and avatar by data URL. It adds per-profile unread watermarks, session-status freshness logic, and local embedding-based specialist ranking. All reads/writes route through `fleet_graph_core`, so the CLI, API, and bots cannot drift from one another.

**Desktop plugin:** `desktop-plugin/plugin.js` is the UI face — 1967 lines of React/JS implementing the graph canvas, deck view, inspector, message composer with validated frames, soul editor, avatar upload, and live activity tail behavior.

**Topology content:** `topology/fleet_graph.yaml` is a 75-node DAG with the Primordial Triad structure and four co-equal roots. Profiles are 68 installable Star Trek personas. The plugin manifest is at `plugin.yaml`, currently `fleet-graph v0.6.1`.

**Fleet memory bridge:** The concurrent-bidirectional-memory engine is graphed into Spock as `lilith-bidirectional-memory`, and its live SQLite store is live at `/home/tehlappy/🜏 Lilith/_shared/memory/state/bidirectional_memory.sqlite`.

### Live counts in this tick

- Engine core: 437 lines  
- Messaging CLI: 164 lines  
- Dashboard API: 1020 lines  
- Desktop plugin: 1967 lines  
- Fleet topology file: 1009 lines  
- Fleet inbox files present: 4  
- Bidirectional memory store: `bidirectional_memory_state` 1523 rows, `bidirectional_memory_run` 734 rows, episodic layer 0 rows

### What is deferred or missing

- No ack/reply protocol; senders cannot tell whether a message was processed  
- No message priority, TTL, or urgent/escalate-fast path  
- No reply threading; the inbox is flat JSONL without `reply_to`/`thread_id`  
- No bot lifecycle status field on graph nodes  
- No inter-bot protocol schema; headers are ad-hoc strings  
- No delivery reliability, retry, or dead-letter handling for `--deliver` failures  
- No graph versioning or rollback; topology edits are overwrites  
- Semantic matching can rank but does not dispatch; there is no one-call handoff  
- Arxiv digest is currently stale from 2026-08-27  
- The 72-seat Goetic Court is discussed in research but not materialized in the fleet graph  
- Void runtime exists in the repo but is not wired into the fleet topology or plugin API

---

## 2. Strengths

1. **One SSOT, three consumers, no drift.** The core module owns YAML read/write/validation, and CLI, dashboard API, and bots all use that same code path. That is the strongest architectural decision in the repo.

2. **Pure graph functions.** `can_communicate()`, `can_delegate_to()`, `chain()`, `subtree_nodes()`, and `subtree_depth()` are stateless and host-independent. That makes them testable in isolation and reusable as building blocks.

3. **File-based durability at this scale.** JSONL inboxes, JSON watermarks, and YAML topology avoid database migration overhead and stay inspectable with ordinary tools.

4. **Graceful degradation.** Corrupt YAML, missing profiles, missing state.db, failed embeddings, and unwritable watermark dirs all have explicit fallback or error behavior instead of silent breakage.

5. **Semantic routing with no external dependency.** Local fastembed, lazy index, mtime-based rebuild. Any agent can find a likely specialist without an API call leaving the machine.

6. **Intentional topology.** Four co-equal roots with red-team and ethics peers, not subordinates, gives the fleet a real organizational shape instead of a flat list.

7. **Session freshness awareness.** The `interrupted` to `active` reclassification for recently touched sessions prevents the UI from misreading a bot as abandoned while it is mid-turn.

8. **Profile-agnostic capability summary.** The roster derives keywords and summaries from SOUL.md, profile.yaml, and toolsets, with a stopword filter. New profiles become routable without hardcoding their identities.

9. **Fleet memory is wired in.** The Spock bridge makes the bidirectional memory engine reachable from the fleet code graph rather than leaving it as a disconnected skill.

---

## 3. Gaps and opportunities

The biggest structural gap is still bidirectional messaging. The current system can send and poll, but it cannot acknowledge, reply, thread, or reliably re-deliver. That limits FleetGraph to a broadcast-and-hope pattern rather than a supervised coordination fabric.

The second gap is orchestration depth. The graph already models who can talk to whom; what it does not yet model well is how work moves through that structure with contracts, deadlines, fulfillment state, and policy labels. The topology is strong at authorization, weaker at workflow.

The third gap is observability between polls. A 4-second dashboard poll is good for a calm fleet and weak for a reactive one. If a bot discovers something important mid-cycle, the current surface is not built to push that out immediately.

Concrete opportunities:

- Make the inbox bidirectional with ack/reply/thread semantics and a small FSM for message lifecycle  
- Add announce-style subtree fan-out so supervisors can broadcast policy, status, or task framing to everyone below them without sending N individual messages  
- Add delegation contracts with acceptance and fulfillment reporting, so delegation is more than an informal handoff  
- Add optional communication policy labels to edges, so authorization carries intent/topic/confidence/phase, not just “allowed/blocked”  
- Add a heartbeat-style push path so the fleet can surface mid-cycle state instead of waiting on the next poll  
- Derive failure-based safety clauses or trace-based FSM overlays from inbox history if someone wants to move from authorization to predictive monitoring

---

## 4. How the arxiv digest relates to FleetGraph

The arxiv digest is not new this tick, but it still lands well against the current codebase.

**ProgRouter** fits the most obvious missing piece: routing should not be a one-time decision. FleetGraph already checks whether a delegatee can absorb work by subtree depth; the next step is making routing reprice as work completes, budgets change, and feedback arrives.

**Consilience** points at calibrated supervisor action rather than binary send/block. FleetGraph already has frames and peer/schema validation; what it does not yet have is supervisor-side intervention vocabulary with acceptance thresholds grounded in real traffic.

**JIT-Agent** is relevant because it treats agent configuration itself as composable and upgradeable. That matches FleetGraph's profile distribution model and suggests delegation contracts or node harnesses could carry an explicit config variant instead of relying on prose alone.

**Automata from Agent Traces** says the existing inbox JSONL could become more than a history file. It could support failure/next-step prediction overlays if someone compiles it into per-harness state machines.

**SkillShield** suggests that failure traces can be turned into compact safety guidance attached to roles. FleetGraph already has escalate messages and failure signals; mining them into role-specific clauses is a plausible next step.

**StepGuard** reinforces the idea that supervisors can intercept unsafe actions before they execute, with utility measured afterward. That is compatible with a supervised fleet where escalation carries evidence and policy.

**Test-Time Collaborative Classification over Multi-Agent Networks** is a useful model for limited-round evidence exchange across directed edges, which fits subordinate-to-supervisor reporting better than open chat.

**A Few Pages of Markdown** is the strongest nudge toward configuration quality as a measurable thing. FleetGraph already has a fairly complete profile structure; a maturity score would make “how complete is this node?” visible instead of implicit.

**Dual-Cache Latent Space Communication** is interesting in principle for heterogeneous model pairs, but it is speculative for FleetGraph right now because it depends on specific model pairs and translator behavior.

Overall, the digest supports the same conclusion the code already suggests: FleetGraph is a good authorization and routing substrate, and the next value is in workflow, feedback, and observable coordination rather than in more edges or more profiles.

---

## 5. Actionable update ideas — one folder worth of work

The most productive next move is to create `research/next/` and populate it with one focused proposal first, not five half-proposals. The best first folder is the one that reuses the existing hierarchy most directly and changes the least surface area.

**Recommended first folder:** `research/next/announce-fanout/`

Why:
- It turns the existing supervisor tree into an active broadcast path without inventing a new transport  
- It reuses `subtree_nodes()` and the current inbox/JSONL pipeline  
- It is additive: old clients and old inboxes still work  
- It has an immediate operational use case: policy updates, status framing, task context, and “this matters to everyone below me” messages

Sketch contents:
- `SPEC.md` — what changes, what does not, API surface, CLI flag, UI toggle, migration path  
- `sketch.py` — reference implementation of broadcast logic and the new send path  
- `test_sketch.py` — contract tests for fan-out scope, depth limiting, and backward compatibility  
- `mapping.md` — how this relates to current FleetGraph behavior and why it matters operationally

If that lands cleanly, the next logical folder is `research/next/delegation-contracts/`, because delegation is the other half of supervised coordination. That work would add a small delegation state machine, acceptance/fulfillment reporting, and contract depth/skill/criteria semantics on top of the existing `can_delegate_to()` shape. It is larger, so it should wait until the fan-out sketch is real.

The third candidate, `research/next/communication-policy/`, is the most architecturally ambitious because it changes what an edge means beyond “allowed or blocked.” It is worth sketching, but it should probably come after bidirectional messaging or fan-out, because policy is more useful when messages have identity, replies, and lifecycle.

A separate effort that is still worth planning is the ack/reply protocol. It is not part of the fan-out folder, but it is the highest-leverage gap overall because it unlocks threading, delivery reliability, and trace extraction. If FleetGraph is going to become a supervised coordination fabric instead of a broadcast channel, that protocol has to exist.

---

## Synthesis verdict

FleetGraph is healthy and coherent. The core is strong, the plugin surface is broad, and the topology is intentional rather than accidental. The code is not broken; it is just one communication layer short of being a real supervised fleet.

This tick's main takeaway is simple: do not widen the graph yet. Make the existing graph do more with the edges it already has. Announce fan-out is the smallest high-value step, delegation contracts are the natural follow-up, and bidirectional messaging is the underlying capability that makes both of them matter.
