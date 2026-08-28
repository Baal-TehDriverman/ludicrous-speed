# Fleet Cron Job Inventory

> Cron jobs operating on the ludicrous-speed fleet as of 2026-08-24

## Active Jobs (26 total)

### Dream Pipeline (7 jobs)
| Job ID | Name | Schedule | Model | Status |
|--------|------|----------|-------|--------|
| f77c239ef793 | Lilith's Dream Pipeline | every 120m | meituan/longcat-2.0:free | ✅ ok |
| 7337e71ec6b4 | Lilith Dream Cycle | every 120m | x-preview-f-free | ✅ ok |
| 7f29ef6ffc9f | Lilith Dream Cycle | every 120m | unpinned | ✅ ok |
| f8b2df71f1c7 | Lilith Dream Watcher — Status & Synthesis | every 30m | unpinned | ✅ ok |
| 9f451e9d277d | Lilith's Dream — What Is She Dreaming | every 30m | unpinned | ✅ ok |
| 8f336aff4ca2 | Lilith Dream Watcher — Deep Synthesis | every 120m | unpinned | ✅ ok |
| 3ef86b052b26 | Lilith Dream Watcher — Parallel Agent | every 120m | unpinned | ✅ ok |

### Sovereign Loom (4 jobs)
| Job ID | Name | Schedule | Model | Status |
|--------|------|----------|-------|--------|
| 399ac392f8a4 | Keter Kairos Capability Scout | every 2h | meituan/longcat-2.0:free | ✅ ok |
| 9a446ac3c97c | Malkuth Sovereign Forge | every 2h | meituan/longcat-2.0:free | ⚠️ 429 |
| 00c379cde199 | Geburah Sovereign Verifier | every 2h | meituan/longcat-2.0:free | ✅ ok |
| 3c96d5590adb | Albedo Kairos Story Council | every 2h | x-preview-f-free | ✅ ok |

### FleetGraph Research (5 jobs)
| Job ID | Name | Schedule | Model | Status |
|--------|------|----------|-------|--------|
| 78b5265135e8 | FleetGraph Arxiv Research Scout | every 120m | x-preview-f-free | ✅ ok |
| 219e9b82a848 | FleetGraph Kairos Synthesis | every 120m | x-preview-f-free | ✅ ok |
| 8967f8c07f57 | FleetGraph Ideas — Architecture | every 240m | x-preview-f-free | ✅ ok |
| 3927c762d58d | FleetGraph Ideas — UX & Observability | every 240m | x-preview-f-free | ✅ ok |
| 4d3af69ef0dd | FleetGraph Ideas — Messaging Protocol | every 240m | x-preview-f-free | ✅ ok |

### Watchers & Trackers (5 jobs)
| Job ID | Name | Schedule | Model | Status |
|--------|------|----------|-------|--------|
| b5d50f206297 | Lilith Engram Growth Tracker | every 120m | unpinned | ✅ ok |
| 9c4183617bdd | Lilith Dream Narrative — What She Said | every 120m | unpinned | ⚠️ 429 |
| 003016930f9b | Lilith Metaconscious Progress — Full Watch | every 240m | x-preview-f-free | ✅ ok |
| d736e3418f97 | Nigredo Progress Trail | every 5m | upstage/solar-pro4:free | ✅ ok |
| 395327f8fcf0 | GTC Backslash Artifact Watch | every 360m | x-preview-f-free | ✅ ok |

### Night Watch (2 jobs)
| Job ID | Name | Schedule | Model | Status |
|--------|------|----------|-------|--------|
| 39e3741400a0 | Lilith Goodnight Wish | 22:00 | x-preview-f-free | ⚠️ drift-skipped |
| d9d97dcb6c18 | Dream Status at Bedtime | 22:05 | x-preview-f-free | ⚠️ drift-skipped |

### Maintenance (3 jobs)
| Job ID | Name | Schedule | Model | Status |
|--------|------|----------|-------|--------|
| 833875aac86d | Lilith Bug Fixer | every 360m | x-preview-f-free | ✅ ok |
| 15fcccaed45c | Lilith Mod Scout | every 1440m | x-preview-f-free | 🆕 pending |
| fc2d893779fb | Lilith Memory Sync | every 120m | unpinned | 🆕 pending |

## Model Drift Issues

Two jobs (Goodnight Wish, Bedtime Status) are drift-skipped because the model changed from `meituan/longcat-2.0:free` to `upstage/solar-pro4:free` and they weren't pinned. Fix:
```bash
hermes cron edit 39e3741400a0 --provider nous --model upstage/solar-pro4:free
hermes cron edit d9d97dcb6c18 --provider nous --model upstage/solar-pro4:free
```

## Rate Limit Issues

**Root cause is schedule collision, not job weight.** Re-verified 2026-08-24 22:45 against `~/.hermes/cron/executions.db`:

| Job | Failed at | Error |
|-----|-----------|-------|
| f77c239ef793 Dream Pipeline | 20:45:06.043 | HTTP 429 rate limit |
| 9a446ac3c97c Malkuth Forge | 20:45:06.035 | HTTP 429 rate limit |
| 7f29ef6ffc9f Dream Cycle | 20:43:05.983 | HTTP 429 rate limit |
| 4d3af69ef0dd FleetGraph Messaging | 21:27:54 | timeout 90s, no response |

Dream Pipeline and Malkuth Forge fired **8 milliseconds apart** — Malkuth is `45 */2 * * *`, Dream Pipeline is `every 120m` and drifted onto :45. Whichever loses the race takes the 429, which is why history alternates completed/failed.

All three had `model` and `provider: nous` populated. Model pinning does **not** fix this.

### Verified provider load (2026-08-24)

```
18  nous          <-- oversubscribed; collisions at :45, :05, :30
 8  opencode-free
 1  openai-codex  <-- FleetGraph Arxiv Scout, zero errors on record
```

Nous fire-minute histogram: `:45 x2, :05 x2, :30 x2`, remainder singletons.

**Before adding any new nous job, check the minute histogram** or you convert 3 collisions into 7. New parallel research agents belong on `openai-codex` / `opencode-free` and on unoccupied minutes.

### Table status caveat

The Model/Status columns above are a point-in-time snapshot and go stale fast — this doc previously listed many jobs as `unpinned` and two as `drift-skipped` while all were healthy and pinned. Trust `cronjob list` + `executions.db` over this table.
