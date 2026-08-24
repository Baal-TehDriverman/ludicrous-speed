#!/usr/bin/env python3
"""Print fleet status: node counts, directorates, peer pairs, roots, install readiness, model pinning."""
import argparse
import glob
import json
import os
import sys
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import fleet_graph_core as core  # noqa: E402

import yaml  # noqa: E402

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROFILES_DIR = os.path.join(REPO, "profiles")
HERMES_PROFILES = os.path.expanduser("~/.hermes/profiles")


def directorate_of(node):
    """Direct field if present, else derived by caller (root lineage)."""
    return node.get("directorate") or node.get("division") or node.get("department") or None


def build_directorates(graph):
    """Derive a directorate per node: the root it descends from."""
    parent = {n: v.get("supervisor") for n, v in graph.items()}
    cache = {}

    def lineage(n):
        if n in cache:
            return cache[n]
        chain = []
        cur = n
        while cur is not None and cur in graph:
            chain.append(cur)
            cur = parent.get(cur)
        cache[n] = chain
        return chain

    out = {}
    for n in graph:
        ch = lineage(n)
        out[n] = ch[-1] if len(ch) > 1 else "unassigned"
    return out


def main():
    ap = argparse.ArgumentParser(description="Fleet status report")
    ap.add_argument("--json", action="store_true", help="emit JSON report")
    args = ap.parse_args()

    graph = core.load_graph()
    relations = core.load_relations()

    directorates = Counter()
    derived = build_directorates(graph)
    for n, v in graph.items():
        d = directorate_of(v) or derived[n]
        directorates[d] += 1
    peer_pairs = sorted(
        tuple(sorted((a, b))) for a, bs in relations.items() for b in bs if a < b or a > b
    )
    peer_pairs = sorted(set(peer_pairs))
    roots = sorted(n for n, v in graph.items() if not v.get("supervisor"))

    installed = set()
    if os.path.isdir(HERMES_PROFILES):
        installed = set(os.listdir(HERMES_PROFILES))
    repo_dirs = set(os.listdir(PROFILES_DIR)) if os.path.isdir(PROFILES_DIR) else set()
    ready = sorted(repo_dirs & installed)
    not_installed = sorted(repo_dirs - installed)
    stale = sorted(installed - repo_dirs)

    unpinned = []
    for cfg in sorted(glob.glob(os.path.join(PROFILES_DIR, "*", "config.yaml"))):
        try:
            with open(cfg) as f:
                data = yaml.safe_load(f) or {}
        except Exception as e:
            unpinned.append((os.path.basename(os.path.dirname(cfg)), f"unreadable: {e}"))
            continue
        if data.get("model", "") == "":
            unpinned.append((os.path.basename(os.path.dirname(cfg)), ""))

    if args.json:
        print(json.dumps({
            "node_count": len(graph),
            "directorates": dict(sorted(directorates.items())),
            "peer_pairs": [" <-> ".join(p) for p in peer_pairs],
            "roots": roots,
            "install": {
                "repo_profiles": len(repo_dirs),
                "installed_profiles": len(installed),
                "ready_count": len(ready),
                "not_installed": not_installed,
                "stale_installed_not_in_repo": stale,
            },
            "unpinned_model_profiles": [u[0] for u in unpinned],
            "unpinned_model_count": len(unpinned),
        }, indent=2))
        return

    print("=== FLEET STATUS ===")
    print(f"Nodes: {len(graph)}")
    print("\nDirectorates:")
    for d, c in sorted(directorates.items()):
        print(f"  {d}: {c}")
    print(f"\nPeer pairs ({len(peer_pairs)}):")
    for a, b in peer_pairs:
        print(f"  {a} <-> {b}")
    print(f"\nRoot nodes ({len(roots)}): {', '.join(roots)}")
    print(f"\nInstall readiness: {len(ready)}/{len(repo_dirs)} profiles installed to ~/.hermes/profiles/")
    if not_installed:
        print(f"  Not installed ({len(not_installed)}): {', '.join(not_installed[:10])}"
              + (" ..." if len(not_installed) > 10 else ""))
    if stale:
        print(f"  Installed but not in repo ({len(stale)}): {', '.join(stale[:10])}"
              + (" ..." if len(stale) > 10 else ""))
    print(f"\nProfiles with model:'' (unpinned): {len(unpinned)}")


if __name__ == "__main__":
    main()
