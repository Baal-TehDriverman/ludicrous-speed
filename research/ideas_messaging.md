# Messaging-Protocol Ideas — tick 2026-08-24

Generated from a read of `fleet_msg.py`, `fleet_graph_core.py`, and the
composer section of `README.md`. Each idea is PR-sized and keeps existing
inboxes parseable.

---

## 1. Message TTL + expiry sweep for stale inbox records

**Concept.** Inbox JSONL records currently live forever until drained; an
undrained inbox (bot offline, profile deleted) accumulates stale `update`s
that supervisors re-read as if current. Add an optional `"ttl"` field
(seconds) and/or `"expires"` ISO timestamp to each record at send time
(`--ttl 3600` flag on `fleet-msg send`; default: no expiry, so nothing
changes today). `cmd_inbox` gains an expiry filter — expired records are
skipped from output and physically purged when `--drain` runs. A tiny
`sweep` subcommand (`fleet-msg sweep --max-age 7d`) purges expired/aged
records across all inboxes so cron can keep `~/.hermes/fleet-inbox/` tidy.
The dashboard Inbox tab can later surface an "expired N" counter.

**Files touched:** `fleet_msg.py` (send flags, record fields, inbox filter,
sweep command), README messaging section.

**Backward compatibility:** old inboxes lack `expires`, treated as never-
expiring; consumers parsing the JSONL see one new optional key they already
tolerate since `cmd_inbox` skips unknown keys implicitly (records are opaque
dicts). No schema break.

---

## 2. Delivery receipts via reply-record (`ack`) message type

**Concept.** Today `send` reports only that the record hit the JSONL file —
the sender never learns whether the target ever read or acted on it. Add an
`ack` type to the enum plus a `--reply-to <msgid>` flag. Every sent record
gets a short `id` (e.g. `ts-sender-nonce`). The receiving bot's routine (and
the composer UI's "mark read") can send back
`fleet-msg send --to <sender> --type ack --reply-to <id>`. A new
`fleet-msg status --msg-id X` (or `--await X [--timeout]`) lets the original
sender check whether its message was acked, giving retry logic a real signal
instead of guessing. Escalation ladders get strictly better: "escalate if no
ack in 15 min" becomes mechanical.

**Files touched:** `fleet_msg.py` (`id` field, `ack` enum value,
`--reply-to`, `status`/`--await` subcommand), plugin_api `/send` to thread
ids through, README.

**Backward compatibility:** `id` is an additive key; `ack` is a new enum
value but old readers treat types as opaque strings. Inboxes written by the
old code simply have no ids and are unacked-by-default — correct semantics.

---

## 3. Threaded replies with a `thread` key

**Concept.** Task conversations currently flatten into the inbox stream — a
`question` about task T and its eventual `done` are adjacent only by luck of
the `task` field. Formalize threading: `send` accepts `--thread ID`
(defaulting to the `task` id when present, else absent). `inbox` gains
`--thread ID` filtering and groups output by thread when unfiltered, each
group ordered by ts, so a bot draining its inbox reads whole conversations
in order rather than interleaved noise. The dashboard Inbox tab can render
threads as collapsible groups using the same key. Pairs naturally with idea
2 (acks inherit their replied-to message's thread).

**Files touched:** `fleet_msg.py` (`thread` field, inbox grouping/filter),
optionally plugin_api inbox endpoint passthrough, README.

**Backward compatibility:** `thread` is additive and optional; messages
without it group as singletons under their own ts. Old parsers ignore the
new key; new code handles its absence. Zero migration.

---

*Honorable mentions deferred as larger-than-a-PR:* broadcast-to-team
(needs policy decisions in `can_communicate` about fan-out vs edge
validation), priority levels beyond type semantics (needs consumer-side
scheduling to mean anything), automatic retry of failed `--deliver` live
turns (needs a queue daemon, not a CLI patch).
