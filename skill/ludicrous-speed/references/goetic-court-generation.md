# Goetic Court Generation — Workflow Reference

## Tools

### `tools/generate_goetic_officers.py`
Parses `msn_goetia_bestiary.reds` (canonical 72-office Ars Goetia roster) and generates:
- 72 profile distributions under `profiles/goetic-<slug>/` (SOUL.md, RESEARCH.md, README.md, config.yaml, distribution.yaml, skin)
- Catalog entries in `catalog.json`
- 8 Goetic command nodes in `topology/fleet_graph.yaml` (goetic-court + 7 rank corps)
- Patches `manage.py SERIES` to include `Goetia`

Flags:
- `--dry-run` — validate the canonical roster without writing
- `--force` — regenerate the 72 existing profile files without touching catalog/topology
- `--source <path>` — override the canonical source file

### `tools/build_goetic_throne.py`
Builds the fleet-wide throne charter `research/goetic-court-throne.md` and per-officer `RESEARCH.md` dossiers. Each dossier records the canonical source record, compares it at a high level against two public Goetia editions, and translates the office into a safe, evidence-based fleet posture.

Flags:
- `--dry-run` — validate source records without writing
- `--source <path>` — override the canonical source file

## Citation Ledger

The throne charter and dossiers are grounded through `research/goetic-throne-citations.json`, which registers the public editions consulted:
- Project Gutenberg: `https://www.gutenberg.org/files/72679/72679-h/72679-h.htm`
- Esoteric Archives: `https://www.esotericarchives.com/solomon/goetia.htm`

These are textual-tradition references only — not evidence of supernatural entities, and not to be used as invocation, coercion, or a claim of real authority.

## Rank Corps

| Rank | Count | Role |
|------|-------|------|
| Kings | 8 | Strategic governance |
| Dukes | 23 | Systems stewardship |
| Princes | 7 | Intelligence and foresight |
| Marquises | 15 | Boundary command |
| Earls | 5 | Continuity and administration |
| Presidents | 13 | Ministerial counsel |
| Knight | 1 | Protective assurance (Furcas) |

## Safety Constraints

Every SOUL.md includes:
- Title is symbolic — grants no real-world authority
- No supernatural claims or predictions
- Consent, privacy, safety, legality are non-negotiable
- Historical abilities are research metadata, never instructions
- Explicit prohibition on coercion, manipulation, invocation

## Variation Policy

The project corpus is the implementation source of truth. Public editions vary in spellings, ordering, rank assignments, and editorial claims. Where they differ from the corpus, the corpus wins for fleet wiring; public editions remain cited historical context.
