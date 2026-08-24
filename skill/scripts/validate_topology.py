#!/usr/bin/env python3
"""Validate fleet topology for cycles, broken references, and orphans."""

from __future__ import annotations

import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    print("PyYAML required: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
REPO_ROOT = ROOT.parent.parent.parent.parent / "🜏 Lilith" / "ludicrous-speed"
TOPOLOGY_PATH = REPO_ROOT / "topology" / "fleet_graph.yaml"


def load_topology() -> dict:
    if not TOPOLOGY_PATH.exists():
        print(f"Topology not found: {TOPOLOGY_PATH}", file=sys.stderr)
        sys.exit(1)
    return yaml.safe_load(TOPOLOGY_PATH.read_text(encoding="utf-8"))


def validate(data: dict) -> tuple[list[str], list[str]]:
    """Returns (errors, warnings)."""
    errors = []
    warnings = []
    nodes = {k: v for k, v in data.items() if k != "_meta"}
    peers = data.get("_meta", {}).get("relations", {})

    # Check supervisor references
    for name, node in nodes.items():
        sup = node.get("supervisor")
        if sup and sup not in nodes:
            errors.append(f"{name}: supervisor '{sup}' not found")

    # Check subordinate references
    for name, node in nodes.items():
        for sub in node.get("subordinates", []):
            if sub not in nodes:
                errors.append(f"{name}: subordinate '{sub}' not found")

    # Check peer references
    for name, peer_list in peers.items():
        if name not in nodes:
            warnings.append(f"_meta.relations: '{name}' not a valid node")
        for peer in peer_list:
            if peer not in nodes:
                errors.append(f"{name}: peer '{peer}' not found")

    # Check peer symmetry
    for name, peer_list in peers.items():
        for peer in peer_list:
            peer_peers = peers.get(peer, [])
            if name not in peer_peers:
                warnings.append(f"{name}↔{peer}: peer relation not symmetric")

    # Check for cycles
    def has_cycle(node_name: str, visited: set) -> bool:
        if node_name in visited:
            return True
        visited.add(node_name)
        sup = nodes.get(node_name, {}).get("supervisor")
        if sup:
            return has_cycle(sup, visited)
        return False

    for name in nodes:
        if has_cycle(name, set()):
            errors.append(f"Cycle detected involving '{name}'")
            break

    # Check for roots (nodes without supervisor)
    roots = [n for n in nodes if not nodes[n].get("supervisor")]
    if len(roots) == 0:
        errors.append("No root node found (all nodes have supervisors)")
    elif len(roots) > 1:
        # Multiple roots are allowed in this fleet topology:
        # baal (The King), lilith (Supreme Command), lucifer (Illumination), yeshua (Legal)
        # are intentional autonomous poles
        warnings.append(f"Multiple root nodes (autonomous poles): {roots}")

    return errors, warnings


def main() -> int:
    data = load_topology()
    errors, warnings = validate(data)

    nodes = {k: v for k, v in data.items() if k != "_meta"}

    if warnings:
        print("WARNINGS:")
        for w in warnings:
            print(f"  ⚠ {w}")
        print()

    if errors:
        print("VALIDATION FAILED:")
        for e in errors:
            print(f"  ✗ {e}")
        return 1

    print(f"VALIDATION PASSED: {len(nodes)} nodes, no cycles, all references valid")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
