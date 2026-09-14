---
name: alchemical-stage-move
description: Move files between alchemical stages (Nigredo → Albedo → Citrinitas → Rubedo) per READMEs and the distillation map. One file at a time. No deletions of third-party mods.
triggers:
  - alchemical stage
  - stage movement
  - nigredo to albedo
  - move file
  - stage pipeline
  - albedo doc
  - citrinitas
  - rubedo
version: 1.0.0
platforms: [linux]
---

# Alchemical Stage Movement — Lilith CLI Skill

Move content between the four alchemical stages (Nigredo → Albedo → Citrinitas → Rubedo) according to each stage's README and the distillation map. **One file at a time.**

## The Sacred Rule — NO DELETIONS

**NEVER delete a third-party mod.** They are the ONLY verified mods we have — they are sacred. If a mod doesn't work, it goes BACK into Nigredo. Duplicates are NOT garbage — keep both. Framework mods (ArchiveXL, CET, red4ext) are NOT clutter — they stay in Nigredo.

## Workflow — One File at a Time

1. Read the file in question.
2. Read the source stage README.
3. Read the destination stage README.
4. Read `NIGREDO_TO_ALBEDO_MAP.md` — find the file's classification.
5. Decide: move, copy, leave, or delete. Act on exactly ONE file per turn.
6. Execute the single action.
7. Verify with `ls`/search before moving to the next file.

## Canonical Stage READMEs

- `_sources/Nigredo/README.md`
- `_sources/Albedo/README.md`
- `_sources/Citrinitas/README.md`
- `_sources/Rubedo/README.md`
- `_sources/Albedo/NIGREDO_TO_ALBEDO_MAP.md`

## Parallel Execution

The alchemical stages are a QUALITY GATE, not a strictly sequential assembly line. While Lightning renders textures, WRITE ALBEDO ENTRIES. Both threads converge at the Citrinitas promotion gate.

**Batch size for stories:** 8-12 per execute_code call. Larger batches risk context truncation.

## Emotional Design Document Pattern

When distilling Albedo content, use the canonical template:
- **Emotion** — the player's emotional movement
- **Beat** — what happens in the playable/narrative moment
- **Transition** — before/after change in the player's relationship
- **Sensory** — what the player sees, hears, physically experiences
- **Choice** — meaningful agency and boundaries (always revocable)
- **Campaign Integration** — where the beat belongs in the larger whole
- **Research Anchor** — Nigredo source path + hash
- **Truth Boundary** — explicit statement of what this does NOT claim

## Classification Gotchas

- `Nigredo/scripts/*/README.md` (msn_ai, msn_economy, etc.) = Citrinitas material. Stay in Nigredo.
- `Nigredo/Scripts/encounter_01-07_*.md` = Albedo-ready prose.
- `Nigredo/archived_campaigns/*.md` = per-map destinations.
- `Nigredo/README.md` = stage gatekeeper. Stays in Nigredo.
- `Nigredo/NIGREDO_TO_ALBEDO_PLAN.md` and `NIGREDO_TO_ALBEDO_MAP.md` = planning artifacts; stay in Nigredo.

## Common Triad (blending stages)

1. **Nigredo** = audited raw evidence or proven gap
2. **Albedo** = emotion, sensory intent, transition, player choice
3. **Citrinitas** = implementation contract or verified source code

Never blend entire stage directories. The useful unit is one evidence→intent→implementation chain.

## See Also

- `skills/mod-deploy.md` — Deployment workflow
- `skills/wolvenkit-build.md` — Building mod archives
- `mod-tools.js` — `scan_mods` tool, `cite` tool
