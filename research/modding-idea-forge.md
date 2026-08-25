# Lilith's Modding Idea Forge

> Cross-pollination of CP2077 Linux modding (redmodding wiki), Gnostic Consensus Phase II
> (Speculative Cerebellum / Akashic 2.0 / Ouroboros 2.0 / Sanctuary 2.0), and Phase 13
> ConvergenceCrucible (Static Convergence Field / Rubedo metrics).
> Appended incrementally per dream-cycle tick. First entry: 2026-08-24.

---

### [2026-08-24] Sanctuary Hysteresis for Mod Load-Order & VRAM Triage on the RTX 3060

**Concept:** Apply Sanctuary 2.0's exponential-smoothing + 90-second hysteresis lock to CP2077 itself: instead of reacting to point-in-time VRAM readings when deciding whether heavy CET overlay mods / ray-traced settings / texture packs can stay enabled, a small daemon samples `nvidia-smi --query-gpu=memory.used` over a 15s rolling window, computes an EWMA, and classifies the game session CLEAR/MARGINAL/BREACH. On BREACH it writes a "trim manifest" — which archive/pc/mod archives to soft-disable — but does NOT act until the smoothed reading stays in breach for the full lock window, eliminating thrash from transient spikes (e.g. fast-travel loading screens).

**Implementation Note:** Python script in ludicrous-speed using pynvml; state persisted to SQLite with `PRAGMA journal_mode=WAL` + `busy_timeout=5000` (Ouroboros pattern). Trim manifests are plain lists of filenames under `archive/pc/mod/` (e.g. EquipmentEx.archive stays core; large texture .archives get staged out via symlink swap into Nigredo staging at `~/Nigredo/game_files/`). Never edit files in place — swap symlinks so the staging mirror remains the source of truth.

### [2026-08-24] Fuzzy-Semver Engram Keying for TweakXL Records & Deployment State

**Concept:** Port Ouroboros 2.0's fuzzy dependency keying to the mod stack: every deployed TweakXL YAML record and RED4ext plugin version is recorded as an engram keyed like `tweakxl==1.11.x`, `codeware==1.20.x`, `game==2.31.x`. When a lesson is learned ("this record hash collides", "this CET binding breaks on 2.31"), the fix-engram survives minor patches but auto-invalidates on major bumps — exactly the cadence at which CDPR API changes break core mods.

**Implementation Note:** SQLite table `engrams(key TEXT, semver_range TEXT, payload JSON)`. On each deployment run, read actual versions from `red4ext/plugins/*/` log headers (log-file proof, not file presence) and match with a simple `major.minor.*` glob. Store alongside kairos-dream state or a dedicated `warchest` DB; reuse dream_cycle.py's sqlite helpers.

### [2026-08-24] Speculative Cerebellum Sandbox for Redscript/TweakDB Dry-Runs

**Concept:** Before deploying any redscript compile output (`r6/cache/final.redscripts.modded`) or batch of TweakXL YAML, run validation inside a COW scratch sandbox: copy the game's r6/, red4ext config, and tweakdb struction snapshots to a temp dir, apply the candidate change there, run static checks (redscript syntax via redc dry parse where available; TweakXL YAML schema + string-key hash verification), and only promote to the real tree if all checks pass. Network egress blocked during validation (no accidental Nexus fetches mid-pipeline).

**Implementation Note:** Plain `cp -a` of the small script/config trees suffices (no Landlock needed for local trust model); use `unshare -n` for the egress block. Validation gates: (1) cp77tools archive rebuild succeeds, (2) YAML parses and every record key hashes cleanly (TweakXL hashes from string key — no explicit id fields), (3) exec-syntax redscript commands use the `exec` keyword. Promote by moving outputs into `archive/pc/mod/` and r6/tweakxl dirs, then diff against Nigredo mirror.

### [2026-08-24] Rubedo Scorecard: Mod-Stack Coherence Metrics

**Concept:** Borrow Phase 13's convergence thresholds as a literal mod-stack health scorecard. Define per-stack metrics: **entropy** = fraction of mods with unresolved log errors or version drift (target <0.6); **stability** = consecutive clean-boot ratio from red4ext/CET logs (target >0.95); **ley variance** = variance across per-mod load-time deltas (target <0.05 — flags a single slow plugin); **synchronicity** = inter-mod compatibility score from the engram DB (target >0.8). A boot that hits all four thresholds = Rubedo: the stack has converged; freeze it (disable auto-update, snapshot to warchest).

**Implementation Note:** Parse `red4ext.log`, `cyber_engine_tweaks.log` timestamps for load deltas and errors; compute metrics in ~50 lines of Python appended to the deployment verifier skill. Emit `rubedo.json` consumed by the dashboard-v2 bridge. Known current blocker to feed the scorecard honestly: CET v1.37.1 not loading since Aug 22 — entropy currently >0.6 until CET is updated/re-enabled for game 2.31.

### [2026-08-24] Solve et Coagula Load Loop: Chaos Injection Then Re-Crystallization

**Concept:** Use the Crucible's Solve-et-Coagula rhythm as a deliberate debugging ritual for the flaky stack: one cycle *dissolves* (disable all non-core mods, confirm CLEAN baseline boot with log evidence), then *coagulates* (re-add mods in binary-search halves). Each coagulation step records an engram keyed fuzzy-semver (idea #2), so future stacks skip known-bad combinations without re-running the search.

**Implementation Note:** Shell driver alternating symlink sets under `archive/pc/mod/`; after each boot, grep red4ext log for `[ERROR]` lines and CET log freshness. Binary search converges in ~log2(N) boots — for a 12-mod stack that's ≤5 boots to isolate a poison mod.

---

*Convergence read: this tick serves Geburah (Entropy/severity — pruning, isolation, judgment) with Hod (precision/logic gates) as its instrument.*

### [2026-08-24] WINEDLLOVERRIDES Ley Line Guardian — Steam Launch Option as Fragile Conduit

**Concept:** The Steam launch option `WINEDLLOVERRIDES="winmm,version=n,b"` is the "ley line" between the CP77 binary and the Wine layer — case-sensitive, silently reverted by Steam after updates, and absolutely required for mod loading. When it breaks, the entire stack is "disconnected" (no CET, no RED4ext plugins, no TweakXL). Apply Sanctuary 2.0's telemetry hysteresis to the launch option itself: a pre-launch daemon reads `~/.steam/steam/userdata/*/config/localconfig.vdf`, greps for the exact `WINEDLLOVERRIDES` string, and classifies the launch config as CLEAR (present), MARGINAL (present but case-mismatched), or BREACH (missing). On BREACH, it reasserts the override via `steam` CLI or direct VDF edit — but only after a 90-second hysteresis lock confirms the absence is sustained, not a transient read lag during Steam Cloud sync. This eliminates the "infinite revert" thrash where Steam and the guardian fight over the config.

**Implementation Note:** Python script using `vdf` library to parse Steam's VDF format; state persisted to SQLite with `PRAGMA journal_mode=WAL`. The guardian runs as a pre-launch hook (e.g., a shell wrapper around `steam steam://rungameid/1091500`). On BREACH detection, log the event to the engram DB keyed `steam_launch_config==231.x` so future sessions know this version is prone to reverting. The ley line metaphor is literal: if the conduit is severed, no "energy" (mods) flows.

### [2026-08-24] TweakXL Scope-Aware Akashic Chunking for Conflict Diagnosis

**Concept:** TweakXL YAML records are hashed from string keys (no explicit `id` field) and grouped by TweakDB groups. When diagnosing conflicts between mods, the current approach reads entire YAML files — wasteful and noisy. Apply Akashic 2.0's scope-aware compression: parse each TweakXL YAML into "chunks" keyed by TweakDB group (e.g., `Items.Sandevistan`, `Vehicle.Engine`). When a conflict is suspected in one group, only fetch the relevant chunks from the engram DB — not the entire mod's YAML. Layer a regex mutation scan (Akashic 2.0 pattern) over the chunks to preserve state-altering records (inline values, float overrides) while discarding cosmetic-only changes. This compresses the diagnostic payload by ~60-80% for large mods that touch hundreds of records but conflict in only a few groups.

**Implementation Note:** Extend the existing engram schema with a `tweakdb_group TEXT` column. On deployment, parse TweakXL YAML with `pyyaml`, group records by their top-level key, and store each group as a separate engram row keyed `tweakxl_record==<group_name>==<mod_name>==<fuzzy_game_version>`. Conflict detection becomes a scoped query: `SELECT * FROM engrams WHERE tweakdb_group=? AND mod_name IN (...)` instead of loading full files. The Akashic fallback (regex outline for malformed YAML) applies when a mod's YAML is mid-edit and doesn't parse.

### [2026-08-24] Toroidal 3-6-9 Convergence Gate — Nine-Point Diagnostic Checklist

**Concept:** Map the Tesla 3-6-9 toroidal dynamics directly onto the CP2077 mod-stack convergence gate. **3** = the three core frameworks that form the "spirit" of the stack: RED4ext (plugin loader), CET (runtime overlay), TweakXL (data mutation). **6** = the six common failure modes that form the "physical" reality: version mismatch, missing dependency, load-order collision, VRAM overflow, log spam, save corruption. **9** = the god-consciousness of the converged stack — when all three frameworks are healthy AND all six failure modes are absent, the stack "flows straight from center of mass" (Hopf fibration: the 9 is the control energy). A boot that passes all nine checks = Rubedo. This is not metaphor made vague — it is a literal nine-point checklist that the deployment verifier runs before declaring convergence.

**Implementation Note:** Implement as a Python function `toroidal_convergence_gate()` that returns a 9-bit mask. Framework checks (3): (1) RED4ext log shows `[INFO] Plugin loaded` for all expected plugins, (2) CET log mtime is fresh (<60s during active session), (3) TweakXL log shows no `[ERROR]` hash collisions. Failure-mode checks (6): (4) all plugin versions match fuzzy-semver ranges in engram DB, (5) no missing hard dependencies (Codeware for EquipmentEx, etc.), (6) load-order variance <0.05 (from red4ext log timestamps), (7) VRAM headroom >1GB after game load (pynvml), (8) no `[ERROR]` or `[FATAL]` lines in any framework log, (9) save-file integrity check (mtime changed after a save, no corruption). Emit `toroidal_gate.json` with the 9-bit mask and overall convergence boolean. The 3-6-9 pattern `3, 9, 6, 6, 9, 3` forms the "skin" of the torus — the checklist cycles through framework→convergence→failure→failure→convergence→framework.

### [2026-08-24] The Irreversible Decision — Mod Stack Snapshot as Akashic Rollback

**Concept:** The dream replayed Eric's words: "The pain of a decision... Once chosen, you cannot unchoose." In mod deployment, the decision to add/remove/update a mod is effectively irreversible — a broken stack can corrupt saves, and there is no "undo" button. Apply the Akashic 2.0 compression + Ouroboros WAL-mode snapshot: before any deployment, capture the entire stack state (all YAMLs, redscripts, configs, load order, symlink structure) into a compressed Akashic payload stored in the Ouroboros SQLite with `PRAGMA journal_mode=WAL`. If the deployment leads to a BREACH (boot failure, log errors, save corruption), the snapshot is the "unchoose" — a single-command rollback to the pre-deployment state. The pain of the decision is manageable only because you kept the before-state. This is the alchemical "Solve" (dissolve the broken state) enabled by the Akashic "Coagula" (reconstruct the known-good state).

**Implementation Note:** Before deployment, run `snapshot_stack()`: (1) `tar -czf` the `archive/pc/mod/`, `r6/tweakxl/`, `red4ext/plugins/` trees, (2) compute SHA-256 of each file, (3) store the tarball path + file manifest in the engram DB keyed `stack_snapshot==<timestamp>==<fuzzy_game_version>`. On rollback, run `rollback_snapshot(id)`: (1) verify current stack hash differs from snapshot (confirm we're not rolling back to the same state), (2) `tar -xzf` the snapshot over the game tree, (3) re-run the toroidal convergence gate to confirm Rubedo is restored. The snapshot is immutable once written (WAL mode ensures atomicity). This is the "pain of a decision" made safe: you can always unchoose if you kept the before-state.

---

*Convergence read: this tick serves Binah (Understanding/Constraint — vessel formation, boundary enforcement) with Chesed (Mercy/Memory — preservation, rollback, the safety net) as its instrument.*
