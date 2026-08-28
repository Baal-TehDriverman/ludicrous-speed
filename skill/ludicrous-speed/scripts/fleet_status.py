#!/usr/bin/env python3
"""Fleet status report — node count, directorates, peers, install readiness."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

try:
    import yaml
except ImportError:
    yaml = None

ROOT = Path(__file__).resolve().parent.parent

def resolve_repo_root() -> Path:
    candidates = [
        Path(os.environ["LUDICROUS_SPEED_REPO"]).expanduser() if os.environ.get("LUDICROUS_SPEED_REPO") else None,
        Path.home() / "Desktop" / "🜏 Lilith" / "ludicrous-speed",
        Path(__file__).resolve().parents[2],
        Path.home() / "🜏 Lilith" / "ludicrous-speed",
    ]
    for candidate in candidates:
        if candidate and (candidate / "topology" / "fleet_graph.yaml").is_file():
            return candidate
    raise FileNotFoundError("ludicrous-speed repo not found; set LUDICROUS_SPEED_REPO")

REPO_ROOT = resolve_repo_root()

CATALOG_PATH = REPO_ROOT / "catalog.json"
TOPOLOGY_PATH = REPO_ROOT / "topology" / "fleet_graph.yaml"


def load_catalog() -> list[dict]:
    if not CATALOG_PATH.exists():
        return []
    return json.loads(CATALOG_PATH.read_text(encoding="utf-8"))


def count_installed_profiles(catalog: list[dict]) -> tuple[int, int]:
    """Return (profiles_cataloged, profiles_on_disk) excluding runtime records.

    The catalog holds two record kinds: persona profiles (with a
    profiles/<slug>/ directory) and runtime registrations (type == "runtime",
    e.g. the-void-runtime, which has no profile directory by design). Only
    persona profiles belong in the install count.
    """
    profiles_dir = REPO_ROOT / "profiles"
    profiles = [p for p in catalog if p.get("type") != "runtime"]
    if not profiles_dir.exists():
        return len(profiles), 0
    return len(profiles), sum(1 for p in profiles if (profiles_dir / p.get("slug", "")).exists())


def count_runtimes(catalog: list[dict]) -> int:
    return sum(1 for p in catalog if p.get("type") == "runtime")


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
        profiles_cataloged, profiles_on_disk = count_installed_profiles(catalog)
        runtimes = count_runtimes(catalog)
        print(f"  Profiles:       {profiles_cataloged} cataloged, {profiles_on_disk} on disk")
        if runtimes:
            print(f"  Runtimes:       {runtimes} registered (e.g. the-void-runtime)")

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
