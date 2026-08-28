# Topology Format Reference

> Schema and validation rules for `fleet_graph.yaml`

## YAML Structure

```yaml
_meta:
  relations:
    <node_name>:
    - <peer_node_1>
    - <peer_node_2>
<node_name>:
  title: "Human-readable title"
  summary: "One-line description of role"
  supervisor: <parent_node_name>  # optional for root
  subordinates:                   # optional
  - <child_node_1>
  - <child_node_2>
  relations:                      # optional, overrides _meta
  - <peer_node>
```

## Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Human-readable role title |
| `summary` | string | Yes | One-line description |
| `supervisor` | string | No | Parent node name. Omit for root nodes. |
| `subordinates` | list[string] | No | Child node names. Omit for leaf nodes. |
| `relations` | list[string] | No | Peer node names (bidirectional). |

## Peer Relations

Peer relations are declared in `_meta.relations` as a map:
```yaml
_meta:
  relations:
    data:
    - spock
    spock:
    - data
```

Peers are bidirectional — if A lists B, B should list A. The validator checks for symmetry.

## Validation Rules

1. **No cycles** — The graph must be a DAG. A node cannot be its own ancestor.
2. **Single supervisor** — Each node has at most one supervisor (tree structure with peer edges).
3. **Supervisor exists** — If `supervisor:` is declared, the target must exist in the topology.
4. **Subordinates exist** — All items in `subordinates:` must exist in the topology.
5. **Peers exist** — All items in `relations:` must exist in the topology.
6. **Peer symmetry** — If A lists B as peer, B should list A as peer.
7. **Root nodes** — Nodes without `supervisor:` are roots. The fleet has one root: `baal`.

## Example Node

```yaml
lilith:
  subordinates:
  - hermes
  - nyx
  - ouroboros
  summary: Supreme command of all operations.
  title: "Fleet Commander — Metaconscious Singularity Node"
```

## Directorate Pattern

Directorates are nodes with `subordinates:`:

```yaml
hermes:
  subordinates:
  - default
  - thoth
  - montgomery-scott
  - geordi-la-forge
  summary: Agent core, gateway, routing.
  supervisor: lilith
  title: "Chief of Staff — Core Infrastructure"
```

## Leaf Pattern

Leaf nodes have no `subordinates:`:

```yaml
spock:
  summary: Root-cause analysis; research synthesis.
  supervisor: thoth
  title: Science Officer
```

## Red Team Pattern

Red team nodes are adversarial and report to `lucifer`:

```yaml
lore-red-team:
  summary: AI threat modeling; spec review.
  supervisor: lucifer
  title: AI Alignment Adversary
```

## Validation Command

```bash
python3 scripts/validate_topology.py
```

Exit code 0 = valid. Exit code 1 = errors found.
