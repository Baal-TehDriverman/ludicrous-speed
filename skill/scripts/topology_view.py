#!/usr/bin/env python3
"""View fleet topology as tree, JSON, or Graphviz DOT."""

from __future__ import annotations

import argparse
import json
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


def render_tree(data: dict) -> None:
    nodes = {k: v for k, v in data.items() if k != "_meta"}
    children_map: dict[str, list[str]] = {}
    for name, node in nodes.items():
        sup = node.get("supervisor")
        if sup:
            children_map.setdefault(sup, []).append(name)

    roots = [n for n in nodes if not nodes[n].get("supervisor")]
    for root in roots:
        _print_tree(root, nodes, children_map, 0)


def _print_tree(name: str, nodes: dict, children: dict, depth: int) -> None:
    node = nodes.get(name, {})
    title = node.get("title", "")
    prefix = "  " * depth + ("├─ " if depth > 0 else "")
    print(f"{prefix}{name} — {title}")
    for child in sorted(children.get(name, [])):
        _print_tree(child, nodes, children, depth + 1)


def render_json(data: dict) -> None:
    print(json.dumps(data, indent=2, ensure_ascii=False))


def render_dot(data: dict) -> None:
    nodes = {k: v for k, v in data.items() if k != "_meta"}
    print("digraph Fleet {")
    print("  rankdir=TB;")
    print("  node [shape=box];")
    for name, node in sorted(nodes.items()):
        sup = node.get("supervisor")
        if sup:
            print(f'  "{name}" -> "{sup}";')
    print("}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--format", choices=["tree", "json", "dot"], default="tree")
    args = parser.parse_args()

    data = load_topology()
    if args.format == "tree":
        render_tree(data)
    elif args.format == "json":
        render_json(data)
    elif args.format == "dot":
        render_dot(data)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
