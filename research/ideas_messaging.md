# Messaging Protocol Ideas — tick 2026-08-24

Studied: `fleet_msg.py` (send/inbox/show), `fleet_graph_core.py` (edge policy),
README composer/API sections. Constraints honored: JSONL inbox contract stays
parseable; every new field is additive; old readers must never crash on it
(the `cmd_inbox` skip-malformed-lines loop is the compatibility backstop, but
we aim for *ignored*, not skipped).

---

## Idea 1 — Priority levels with escalation-aware defaulting

**Concept.** Today every message is equal-weight; an `escalate` from a
subordinate looks identical in the JSONL to a routine `update`. Add an optional
`priority` field to the send record (`"low" | "normal" | "high"`), defaulted by
type (`escalate` → high, `question` → normal, everything else → low/normal)
and overridable via `fleet-msg send --priority high`. The header line rendered
for live delivery gains a priority tag, and a new `inbox --min-priority P`
filter lets a supervisor drain only urgent traffic during a busy session.
Because the record dict simply gains one key, existing drains parse unchanged.

**Files touched.** `fleet_msg.py` (arg flag, default map, header rendering,
inbox filter), README messaging section.

**Backward compatibility.** Old inboxes have no `priority` key → readers that
don't know it ignore it; new readers use `.get("priority", "normal")`. No
schema break; no migration.

---

## Idea 2 — TTL + expiry sweep on stale inbox messages

**Concept.** Inboxes grow until manually drained and there's no notion of a
message going stale — a `question` from three weeks ago about an already-shipped
task still surfaces as fresh. Stamp each record with `expires` (ISO ts,
default now + N days via `--ttl`, e.g. `--ttl 7d`; escalates never auto-expire).
Add `fleet-msg inbox --sweep` to drop expired lines atomically (rewrite the
JSONL minus expired entries), and have `maintenance/fleet_maint.py status`
report expiring-soon counts so prune/rotate gets a natural hook point.

**Files touched.** `fleet_msg.py` (TTL arg, expiry stamp, sweep mode),
`maintenance/fleet_maint.py` (status reporting), README.

**Backward compatibility.** Records without `expires` are treated as
never-expiring — legacy lines survive sweeps untouched. JSONL shape unchanged
for parsers.

---

## Idea 3 — Delivery receipts and threaded reply IDs

**Concept.** Senders currently get only their own `ok: true`; there's no way to
know whether the target ever drained the message, and replies carry no linkage
back to what they answer. Give every message a short generated `id` at append
time, plus an optional `in_reply_to` on send (`--reply MSGID`). Add a
lightweight receipt mechanism: when a profile runs `inbox --drain`, append
receipt records `{type: "receipt", id: <drained-id>, drained_at}` to each
original sender's inbox file (edge-checked lazily — receipts are system
records, not conversational sends, so they bypass `can_communicate` but are
clearly typed). A `fleet-msg show --id X` prints the full thread chain.

**Files touched.** `fleet_msg.py` (id generation, `--reply`, drain receipts,
thread view), README composer docs.

**Backward compatibility.** Receipts are just additional well-formed JSONL
lines of a new type; old readers see them as ordinary messages (harmless) or
skip them. Existing records without `id` still parse; threading simply isn't
available for pre-existing messages.

---

*All three keep the primary-transport invariant: the durable JSONL inbox is
always written first; nothing here touches `_deliver_dm` opt-in semantics.*
