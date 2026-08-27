# FleetGraph Messaging Protocol — Idea Generator Tick

> Generated: 2026-08-27T04:00:00Z · Source: fleet_msg.py + fleet_graph_core.py + README.md

---

## Idea 1: Priority Lanes + TTL-Based Message Expiry

### Concept

The current `fleet_msg.py` treats every message identically — a `done` acknowledgment from a worker sits in the same JSONL inbox with the same weight as an `escalate` from a failing subordinate. Supervisors draining their inbox must linearly scan every record to find what actually needs attention.

This idea introduces **priority lanes** and **TTL-based expiry** at the protocol level:

- **Priority enum**: `low`, `normal`, `high`, `critical` — set via `--priority` on `send`.
- **Critical bypass**: Messages with `priority: critical` automatically trigger `--deliver` (live agent turn) regardless of the sender's flag, because a critical escalation that sits unread in an inbox defeats its purpose.
- **TTL per type**: Each `type` carries a default TTL. `done` expires after 24h, `update` after 72h, `question` after 7 days (needs human answer), `escalate` and `assign` never expire until explicitly drained.
- **Auto-prune on read**: `cmd_inbox` silently drops expired records before returning payloads. A separate `fleet_maint.py` sweep can hard-purge them from disk.
- **Priority-aware inbox ordering**: `cmd_inbox` returns messages sorted by `priority DESC, ts DESC` so the most actionable item is always first.

This transforms the inbox from an append-only log into a self-triaging task queue.

### Files Touched

- `fleet_msg.py` — add `--priority` arg, TTL constants, priority sort in `cmd_inbox`, auto-prune logic, critical-bypass delivery.
- `maintenance/fleet_maint.py` — add `prune-expired` subcommand for hard disk purge.
- `README.md` — document priority semantics and TTL defaults.

### Backward Compatibility

Existing inboxes are JSONL with records that lack `priority` and `ttl` fields. The parser already skips malformed lines. New code reads `rec.get("priority", "normal")` and `rec.get("ttl", None)` — missing keys default gracefully. Old records simply never expire (no TTL) and sort as `normal` priority. No migration needed.

---

## Idea 2: Delivery Receipts + Retry with Exponential Backoff

### Concept

Today, `fleet_msg send` writes to the inbox and optionally fires a live `--deliver` turn. If the target profile is offline, crashed, or mid-turn, the delivery silently fails — the sender gets `{"delivered": false}` and has no way to know whether the message was ever seen.

This idea adds **delivery receipts** and **retry semantics**:

- **Message identity**: Every sent message gets a deterministic `msg_id` (SHA-256 of sender+to+ts+summary, truncated to 16 hex chars). The ID is returned in the send JSON and written into the inbox record.
- **Receipt records**: When `cmd_inbox --drain` is run, a sibling `.receipts.jsonl` file is written alongside the drained inbox, containing `{"msg_id": "...", "drained_at": "...", "by": "profile"}`. This gives senders a durable acknowledgment that their message was consumed.
- **Retry queue**: Failed `--deliver` attempts (non-zero return code or timeout) are written to a `retry-queue.jsonl` with the original payload + `attempts` count + `next_retry_at` timestamp. A new `fleet-msg retry` command drains this queue, re-attempting delivery with exponential backoff (1min, 5min, 25min, 125min — then gives up and alerts the sender's supervisor).
- **Status query**: `fleet-msg status <msg_id>` searches inbox, receipts, and retry queue to report where a message currently lives: `pending` (in inbox), `delivered` (drained), `failed` (exhausted retries), `retrying` (in queue).

This closes the observability loop — senders can finally answer "did my message reach them?"

### Files Touched

- `fleet_msg.py` — add `msg_id` generation, receipt writing on drain, retry-queue management, `retry` and `status` subcommands.
- `maintenance/fleet_maint.py` — add `retry-sweep` subcommand for cron-driven retry execution.
- `README.md` — document receipt and retry flow.

### Backward Compatibility

The `.receipts.jsonl` file is written only on `--drain`, so existing inboxes without it are unaffected. The `msg_id` field is added to new inbox records; old records without it are treated as "pre-receipt-era" and simply never appear in receipt lookups. The retry queue is a new file; absence means no retries pending. `status` on an old message returns `unknown` rather than crashing.

---

## Idea 3: Threaded Conversations + Team Broadcast

### Concept

The current protocol is strictly point-to-point: one sender, one recipient, one type, one summary. Real fleet coordination requires multi-message conversations ("I tried the fix you suggested, here's the log...") and one-to-many announcements ("All subordinates: new task assignment, ack required").

This idea adds **threading** and **broadcast**:

- **Thread ID**: Optional `--thread <thread_id>` on `send`. If omitted, a new UUID is generated and returned. Replies reference the parent's thread ID, forming a conversation chain.
- **Reply-to field**: Optional `--reply-to <msg_id>` links a message to a specific prior message within a thread, enabling precise "this answers that" semantics.
- **Broadcast flag**: `--broadcast` sends the same message to ALL of the sender's direct subordinates (down-edge). Each gets an independent inbox record with identical `msg_id` but distinct receipt tracking. Broadcast is rejected if the sender has no subordinates.
- **Thread view**: `fleet-msg thread <thread_id>` aggregates all messages across all inboxes (sender's outbox + recipients' inboxes) that share the thread ID, returning them in chronological order with sender/recipient context.
- **Ack tracking on broadcast**: Broadcast messages carry `acks_required: true`. Each recipient's drain writes a receipt; `fleet-msg status <msg_id>` on a broadcast shows per-recipient delivery state (3/5 acknowledged).

This enables the fleet to have actual conversations, not just fire-and-forget signals.

### Files Touched

- `fleet_msg.py` — add `--thread`, `--reply-to`, `--broadcast` args; broadcast fan-out logic; `thread` subcommand with cross-inbox aggregation.
- `fleet_graph_core.py` — no changes needed (broadcast uses existing `subordinates` derivation).
- `README.md` — document threading model and broadcast semantics.

### Backward Compatibility

All three new fields (`thread_id`, `reply_to`, `broadcast`) are optional. Existing messages lack them entirely. The `thread` subcommand returns an empty result set for any thread ID that doesn't exist. Broadcast is opt-in via flag — no existing send command changes behavior. The `msg_id` from Idea 2 is a prerequisite for `reply-to` to function, but if `msg_id` isn't present yet, `reply-to` simply stores `null` and the link is lost (graceful degradation).

---

## Cross-Cutting Concerns

All three ideas share a prerequisite: **the `msg_id` field** from Idea 2 must land first, since Ideas 2 and 3 both depend on message identity. Recommended merge order:

1. Idea 1 (Priority + TTL) — standalone, no dependencies.
2. Idea 2 (Receipts + Retry) — depends on nothing new.
3. Idea 3 (Threads + Broadcast) — depends on Idea 2's `msg_id`.

Each idea is independently revertible: removing the new fields from send leaves old inboxes parseable, and each subcommand is namespaced under `fleet-msg <cmd>` so removal is a single code deletion.

---

*End of tick.*