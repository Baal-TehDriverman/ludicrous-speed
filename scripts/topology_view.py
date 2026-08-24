#!/usr/bin/env python3
"""Render the Hermes fleet topology (fleet_graph.yaml) as tree, JSON, or DOT."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO))
import fleet_graph_core as fgc  # noqa: E402


def roots(graph: dict) -> list[str]:
    return sorted(n for n in graph if not graph[n].get("supervisor"))


def _walk_child(graph, relations, name, branch_prefix, cont_prefix,
                seen, depth, level, lines):
    node = graph[name]
    extra = []
    if relations.get(name):
        extra.append(f"peers: {', '.join(relations[name])}")
    suffix = f"  [{'; '.join(extra)}]" if extra else ""
    lines.append(f"{branch_prefix}{name}{suffix}")
    if depth is not None and level >= depth:
        return
    subs = [s for s in sorted(node.get("subordinates", [])) if s not in seen]
    skipped = len(node.get("subordinates", [])) - len(subs)
    if skipped:
        lines.append(f"{cont_prefix}(cycle-safe skip: already shown)")
    for i, sub in enumerate(subs):
        last = i == len(subs) - 1 and not skipped
        new_branch = cont_prefix + ("└── " if last else "├── ")
        _walk_child(graph, relations, sub, new_branch,
                    cont_prefix + ("    " if last else "│   "),
                    seen | {name}, depth, level + 1, lines)


def render_tree(graph: dict, relations: dict,
                root: str | None, depth: int | None) -> str:
    lines: list[str] = []
    selected_roots = [root] if root else roots(graph)
    for r in roots(graph) if root is None else ([root] if root in graph
                                                else (_ for _ in ()).throw(SystemExit(f"unknown root node {root!r}"))):
        pass
    for r in selected_roots:
        if r not in graph:
            raise SystemExit(f"unknown root node {r!r}")
        peers = relations.get(r, [])
        note = " [peers: %s]" % ", ".join(peers) if peers else " [root]"
        title = (graph[r].get("title") or "").strip()
        lines.append(r + note + (f" — {title}" if title else ""))
        if depth == 0:
            continue
        node = graph[r]
        subs_all = sorted(node.get("subordinates", []))
        subs = [s for s in subs_all if s not in {r}]
        skipped = len(subs_all) - len(subs)
        if skipped:
            lines.append("(cycle-safe skip)")
        items = subs + (["(cycle-safe skip)"] * skipped)
        for i, item in enumerate(items):
            last = i == len(items) - 1
            branch = "└── " if last else "├── "
            cont = "    " if last else "│   "
            if isinstance(item, str) and item == "(cycle-safe skip)":
                lines.append(branch + "(cycle-safe skip: already shown)")
                continue
            _walk_child(graph, relations, item, branch, cont,
                        {r}, depth, 1, lines)
    return "\n".join(lines)


def build_dot(graph: dict, relations: dict) -> str:
    out = ["digraph fleet {", '  rankdir=TB;', '  node [shape=box];']
    rs = roots(graph)
    out.append('  subgraph cluster_roots { label="roots"; '
               + "; ".join(rs) + "; }")
    for name in sorted(graph):
        sup = graph[name].get("supervisor")
        if sup:
            out.append(f'  "{sup}" -> "{name}" [style=solid];')
    seen_pairs = set()
    for src, peers in sorted(relations.items()):
        for p in sorted(peers):
            key = tuple(sorted((src, p)))
            if key in seen_pairs:
                continue
            seen_pairs.add(key)
            out.append(f'  "{key[0]}" -> "{key[1]}" [style=dashed, constraint=false];')
    out.append("}")
    return "\n".join(out)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--format", choices=("tree", "json", "dot"), default="tree")
    ap.add_argument("--root", help="view only the subtree under this node")
    ap.add_argument("--depth", type=int, help="limit tree depth (0 = roots only)")
    args = ap.parse_args()

    graph = fgc.load_graph()
    relations = fgc.load_relations()
    if args.format == "json":
        data = {
            "nodes": {
                n: {"title": g.get("title"), "summary": g.get("summary"),
                    "supervisor": g.get("supervisor"),
                    "subordinates": sorted(g.get("subordinates", [])),
                    "peers": relations.get(n, [])}
                for n, g in sorted(graph.items())},
            "relations": relations,
            "stats": {"nodes": len(graph),
                      "roots": roots(graph),
                      "peer_entries": sum(1 for v in relations.values() if v)},
        }
        print(json.dumps(data, indent=2))
        return 0
    if args.format == "dot":
        print(build_dot(graph, relations))
        return 0
    print(render_tree(graph, relations, args.root, args.depth))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
