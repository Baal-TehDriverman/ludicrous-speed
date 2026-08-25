# Spock Graph Memory — Fleet Operating Contract

## Canonical graph

- Project: `ludicrous-speed-desktop`
- Root: `/home/tehlappy/Desktop/🜏 Lilith/ludicrous-speed`
- Physical root after symlink resolution: `/home/tehlappy/🜏 Lilith/ludicrous-speed`
- Dedicated Void project: `the-void`

Two stale duplicate fleet graph databases were removed on integration. Source files were never touched.

## Automatic Hermes augmentation

Hermes runs this reviewed, local, fail-open hook before each model call:

```text
/home/tehlappy/.local/opt/codebase-memory-mcp/codebase-memory-mcp hook-augment --dialect hermes
```

The hook contributes a short user-message sidecar identifying the matched graph project and evidence tier. It does not alter prior messages, block tools, rewrite source, or mutate the stable system-prompt prefix.

Verify:

```bash
hermes hooks doctor
```

Expected: executable, allowlisted, unchanged since approval, valid JSON.

## Command bridge

```bash
SP=/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/spock_memory.py
python3 "$SP" status
python3 "$SP" architecture
python3 "$SP" architecture --path dashboard --aspects overview routes hotspots
python3 "$SP" search load_graph --path-filter '^(fleet_graph_core.py|dashboard/)'
python3 "$SP" changes
python3 "$SP" reindex --mode full
```

Environment overrides:

- `CODEBASE_MEMORY_MCP` — alternate binary
- `LUDICROUS_SPEED_CBM_PROJECT` — alternate graph project
- `LUDICROUS_SPEED_REPO` — intentional alternate checkout

## Token-efficient retrieval ladder

1. Match the exact indexed project.
2. Ask for only necessary architecture aspects.
3. Search compact symbol metadata.
4. Trace only relevant relationships.
5. Retrieve exact decisive snippets.
6. Batch coverage checks for cited paths.
7. Read direct source only for final verification and recorded coverage gaps.

Never start structural fleet work by recursively dumping the repository into model context.

## Evidence tiers

- Scout: narrow positive discovery; no exhaustive claims.
- Verify: default; graph evidence, decisive snippets, batched coverage.
- Auditor: current generation, complete bounded pagination, broader relations, direct fallback for every recorded gap.

## Current index coverage

The full fleet index recorded zero skipped source files. Nineteen TypeScript/TSX files contain partial parse ranges; consult `check_index_coverage` and read those exact lines directly before relying on missing graph constructs. Generated `__pycache__` trees and image assets are excluded by design.

## Source

Upstream: https://github.com/DeusData/codebase-memory-mcp

The upstream benchmark reports about 3,400 tokens for five structural graph queries versus about 412,000 tokens for file-by-file exploration. Treat this as the upstream benchmark—not a measured fleet result until benchmarked on this host.
