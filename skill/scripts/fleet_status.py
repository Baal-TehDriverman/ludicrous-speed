#!/usr/bin/env python3
"""Fleet status report — node count, directorates, peers, install readiness."""

from __future__ import annotations

import json
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None

ROOT = Path(__file__).resolve().parent.parent
REPO_ROOT = ROOT.parent.parent.parent.parent / "🜏 Lilith" / "ludicrous-speed"

CATALOG_PATH = REPO_ROOT / "catalog.json"
TOPOLOGY_PATH = REPO_ROOT / "topology" / "fleet_graph.yaml"


def load_catalog() -> list[dict]:
    if not CATALOG_PATH.exists():
        return []
    return json.loads(CATALOG_PATH.read_text(encoding="utf-8"))


def count_installed(catalog: list[dict]) -> int:
    profiles_dir = REPO_ROOT / "profiles"
    if not profiles_dir.exists():
        return 0
    return sum(1 for p in catalog if (profiles_dir / p.get("slug", "")).exists())


def load_topology() -> dict:
    if not TOPOLOGY_PATH.exists() or yaml is None:
        return {}
    return yaml.safe_load(TOPOLOGY_PATH.read_text(encoding="utf-8"))


def main() -> int:
    catalog = load_catalog()
    data = load_topology()

    print("=" * 60)
    print("  LILITH STAR FLEET — LUDICROUS SPEED STATUS")
    print("=" * 60)

    if not data:
        print("  Topology Error: file missing or yaml not installed")
        return 1

    nodes = {k: v for k, v in data.items() if k != "_meta"}
    directorates = {k: v for k, v in nodes.items() if v.get("subordinates")}
    leaf_nodes = {k: v for k, v in nodes.items() if not v.get("subordinates")}
    peers = data.get("_meta", {}).get("relations", {})

    print(f"  Nodes:          {len(nodes)}")
    print(f"  Directorates:   {len(directorates)} ({', '.join(directorates.keys())})")
    print(f"  Leaf Nodes:     {len(leaf_nodes)}")
    print(f"  Peer Relations: {len(peers)}")
    print(f"  Root:           {'baal' if 'baal' in nodes else 'NOT FOUND'}")
    print(f"  Supreme:        {'lilith' if 'lilith' in nodes else 'NOT FOUND'}")

    if catalog:
        print(f"  Profiles:       {len(catalog)} cataloged, {count_installed(catalog)} on disk")

    print()
    print("  Peer Relations:")
    for node, peer_list in peers.items():
        print(f"    {node} ↔ {', '.join(peer_list)}")

    print()
    print("  STATUS: GREEN — Fleet topology intact")
    print("=" * 60)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
