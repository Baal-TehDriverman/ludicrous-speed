#!/usr/bin/env python3
"""Validate ludicrous-speed fleet topology: DAG, referential integrity, symmetry, profile sync."""
import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import fleet_graph_core as core  # noqa: E402

import yaml  # noqa: E402

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROFILES_DIR = os.path.join(REPO, "profiles")


def main():
    ap = argparse.ArgumentParser(description="Validate fleet topology graph")
    ap.add_argument("--json", action="store_true", help="emit JSON report")
    args = ap.parse_args()

    graph = core.load_graph()
    relations = core.load_relations()

    errors = []
    warns = []

    def err(msg):
        errors.append(msg)

    def warn(msg):
        warns.append(msg)

    # 1. Cycle detection (DAG check) via DFS
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {n: WHITE for n in graph}

    def dfs(n, stack):
        color[n] = GRAY
        stack.append(n)
        sup = graph[n].get("supervisor")
        if sup:
            if sup in graph and color[sup] == GRAY:
                cycle = stack[stack.index(sup):] + [sup]
                err("cycle in supervision chain: " + " -> ".join(cycle))
            elif sup in graph and color[sup] == WHITE:
                dfs(sup, stack)
        stack.pop()
        color[n] = BLACK

    for n in graph:
        if color[n] == WHITE:
            dfs(n, [])

    # 2/3. supervisor & subordinate targets exist
    for name, node in sorted(graph.items()):
        sup = node.get("supervisor")
        if sup and sup not in graph:
            err(f"{name}: supervisor '{sup}' does not exist")
        for sub in node.get("subordinates", []):
            if sub not in graph:
                err(f"{name}: subordinate '{sub}' does not exist")

    # 4/5. peer targets exist + peer symmetry
    seen_pairs = set()
    for name, peers in sorted(relations.items()):
        if name not in graph:
            warn(f"relations entry '{name}' has no graph node")
            continue
        for p in peers:
            if p not in graph:
                err(f"{name}: peer '{p}' does not exist")
                continue
            back = relations.get(p, [])
            if name not in back:
                err(f"peer asymmetry: {name} lists {p}, but {p} does not list {name}")
            pair = tuple(sorted((name, p)))
            if pair not in seen_pairs:
                seen_pairs.add(pair)
                if p in back:  # only count when symmetric to avoid dupes on error path
                    pass

    # 6. supervisor/subordinate bidirectional agreement
    for name, node in sorted(graph.items()):
        for sub in node.get("subordinates", []):
            if sub in graph:
                s_sup = graph[sub].get("supervisor")
                if s_sup != name:
                    err(f"bidirectional mismatch: {name} lists subordinate '{sub}', "
                        f"but {sub} has supervisor '{s_sup}'")

    # 7. Orphans: no supervisor and not a declared root
    roots = [n for n in graph if not graph[n].get("supervisor")]
    if len(roots) != 1:
        warn(f"{len(roots)} root nodes found (docs claim 1): {', '.join(sorted(roots))}")
    # orphan = not reachable from any root by descending supervisor->subordinate links
    reachable = set()
    stack = list(roots)
    while stack:
        n = stack.pop()
        if n in reachable:
            continue
        reachable.add(n)
        stack.extend(graph[n].get("subordinates", []))
    for n in sorted(set(graph) - reachable):
        err(f"orphan: '{n}' is unreachable from any root")

    # 8. profile-dir vs graph mismatches
    if os.path.isdir(PROFILES_DIR):
        dirs = set(os.listdir(PROFILES_DIR))
        nodes = set(graph)
        extra = sorted(dirs - nodes - {"README.md"})
        missing = sorted(nodes - dirs)
        for d in extra:
            warn(f"profile dir '{d}' has no graph node")
        for m in missing:
            warn(f"graph node '{m}' has no profile dir")

    ok = not errors
    status = "OK" if ok else "FAILED"
    if args.json:
        print(json.dumps({
            "status": status,
            "nodes": len(graph),
            "errors": errors,
            "warnings": warns,
        }, indent=2))
    else:
        print(f"Topology validation: {status}")
        print(f"Nodes: {len(graph)}")
        if errors:
            print(f"\nERRORS ({len(errors)}):")
            for e in errors:
                print(f"  ERROR: {e}")
        if warns:
            print(f"\nWARNINGS ({len(warns)}):")
            for w in warns:
                print(f"  WARN:  {w}")
        if ok:
            print("No errors.")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
