# Messaging-Protocol Ideas — Tick (2026-08-24-2)

Generated from a re-read of `fleet_msg.py`, `fleet_graph_core.py`, and the previous
`ideas_messaging.md` (which already covered priority/TTL, message IDs/replies, and
threaded broadcast). These three new ideas target schema robustness, delivery
semantics, and liveness awareness — the next layer of fleet communication maturity.

---

## Idea 1 — Per-Type Message Schema Envelope

**Concept.** Today every message is a flat record with a `type` field and a free-form
`summary`. Bots that consume inboxes have no way to know whether a `done` message
actually contains a `result` or whether an `escalate` has a `reason` — they must
parse strings defensively. Move from "type + blob" to a **typed envelope**:
introduce a new optional `payload` field alongside `summary`, and validate it
against per-type JSON schemas declared in a new `fleet_msg_schemas.py`.

Example schemas:

| type      | required payload fields              |
|-----------|--------------------------------------|
| `done`    | `result: string`, `duration_secs?: number` |
| `question`| `context: string`, `deadline?: ISO`  |
| `escalate`| `reason: string`, `severity?: 1-5`   |
| `assign`  | `task: string`, `assignee: string`   |
| `update`  | (none — free-form summary is fine)   |

`cmd_send` validates the payload against the schema for the chosen type before
writing. If validation fails, it returns `{"ok": false, "error": "schema: ..."}` with
the missing field names. The summary field stays as a human-readable complement to
the structured payload. The dashboard composer can render type-specific input forms
once the schemas exist.

**Files touched:** `fleet_msg.py` (add `--payload` JSON-string arg, import schemas,
validate before write), new file `fleet_msg_schemas.py` (schema definitions + a
`validate(type, payload)` function), `README.md` (CLI usage + schema table).

**Backward compatibility.** The `payload` field is an **optional** record key. Old
messages without it parse identically to today; readers that `json.loads(line)` and
look only at `type`/`summary`/`task` are unaffected. Schema validation only runs when
a `--payload` is provided — omitting it is always valid (degrades to current
free-form behavior). No enum change; the `type` choices list stays as-is.

---

## Idea 2 — Idempotency Keys & Inbox Deduplication

**Concept.** Today, if a bot retries a send (after a timeout, a crash, or a transient
`--deliver` failure), the target inbox ends up with duplicate records. There is no
way for a receiver to distinguish "two distinct messages" from "one message sent
twice." Add an `--idempotency-key KEY` flag to `cmd_send`. Before writing, the
command scans the target's `.jsonl` inbox for any existing record whose
`idempotency_key` matches. If found, it **skips the write** and returns

```json
{"ok": true, "deduped": true, "existing_ts": "..."}
```

instead of `{"ok": true, ...}`. The key is stored as `idempotency_key` on the
record. A `--allow-duplicate` flag explicitly opts out of dedup for the rare case
where repeated identical messages are intentional (e.g., periodic pings).

This gives **at-most-once delivery** semantics for any sender that supplies a key,
which is exactly what retry-heavy workflows need. Combined with the existing
`--deliver` live-turn path, a bot can now do "send → wait for ack → retry with same
key if no ack in N minutes" without flooding the target.

**Files touched:** `fleet_msg.py` (`--idempotency-key`, `--allow-duplicate` flags;
dedup scan in `cmd_send` before the write), `README.md`.

**Backward compatibility.** The `idempotency_key` field is additive and optional.
Old records without it are never a dedup match. Old senders that don't pass the flag
bypass the dedup scan entirely (zero overhead). A deduped send returns a different
shape (`deduped: true` instead of a fresh `inbox` path), but any consumer already
checking `ok: true` handles it; bots that don't care can ignore the new key.

---

## Idea 3 — Heartbeat & Liveness Status

**Concept.** Today there is no mechanism for a bot to know whether another bot is
alive, crashed, or simply hasn't run a cron in a while. The fleet can route messages
to profiles that will never drain their inbox. Add two new subcommands:

- `fleet-msg heartbeat [--profile P]` — writes a tiny presence record to a shared
  `fleet-inbox/heartbeat.json` file. The record is `{profile, ts, pid, load}` where
  `pid` is the sender's PID (from `os.getpid()`) and `load` is a self-reported
  busy/idle flag. Cron jobs and long-running bot loops call this on a schedule
  (e.g., every 5 minutes).

- `fleet-msg liveness [--threshold-secs N]` (default `N=600`) — reads
  `heartbeat.json`, compares each profile's `ts` against now, and reports one of
  `alive` (within threshold), `stale` (past threshold but seen before), or
  `never` (no heartbeat on record). Output is JSON: `{profile: {status, last_seen,
  pid, load}}`.

Supervisors can use `liveness` to decide whether to route a `--deliver` live turn
or fall back to inbox-only delivery. The dashboard can paint status dots (green /
yellow / grey) from the same data. The heartbeat file is additive: profiles that
never call `heartbeat` simply don't appear in liveness output — no failure, no
noise.

**Files touched:** `fleet_msg.py` (two new subcommands, heartbeat read/write with
file locking to avoid concurrent-write corruption), `README.md` (usage + example
cron snippet), optional dashboard `GET /liveness` endpoint.

**Backward compatibility.** This is purely additive — two new subcommands, one new
data file. Existing `send`/`inbox`/`show` flows are untouched. No changes to the
JSONL inbox format. Bots that don't call `heartbeat` continue to work; they just
don't participate in liveness reporting. The heartbeat file can be deleted and
recreated from scratch with no data loss (it is derived state).

---