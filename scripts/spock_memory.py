#!/usr/bin/env python3
"""Spock memory bridge for the Ludicrous Speed fleet.

Provides compact, local, graph-first fleet queries without loading repository
files into an LLM context. All requests go to the installed codebase-memory-mcp
binary and return its structured result.
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import subprocess
import sys
from typing import Any

CBM_BINARY = Path(
    os.environ.get(
        "CODEBASE_MEMORY_MCP",
        "/home/tehlappy/.local/opt/codebase-memory-mcp/codebase-memory-mcp",
    )
)
PROJECT = os.environ.get("LUDICROUS_SPEED_CBM_PROJECT", "ludicrous-speed-desktop")
REPO = Path(
    os.environ.get(
        "LUDICROUS_SPEED_REPO",
        "/home/tehlappy/Desktop/🜏 Lilith/ludicrous-speed",
    )
)
# Concurrent bidirectional (Doorway Effect) memory engine — our living memory.
MEMORY_SKILL = Path(
    "/home/tehlappy/.hermes/skills/metaconscious/concurrent-bidirectional-memory"
)
MEMORY_DB = Path(
    "/home/tehlappy/🜏 Lilith/_shared/memory/state/bidirectional_memory.sqlite"
)
MEMORY_EXPORT_DIR = MEMORY_SKILL / "state" / "export"
MEMORY_GRAPH_PROJECT = "lilith-bidirectional-memory"


class SpockError(RuntimeError):
    pass


def _call(tool: str, args: dict[str, Any]) -> dict[str, Any]:
    if not CBM_BINARY.is_file():
        raise SpockError(f"codebase-memory-mcp binary not found: {CBM_BINARY}")

    proc = subprocess.run(
        [str(CBM_BINARY), "cli", "--json", tool],
        input=json.dumps(args, ensure_ascii=False),
        text=True,
        capture_output=True,
        cwd=REPO,
        timeout=300,
        check=False,
    )
    if proc.returncode != 0:
        detail = (proc.stderr or proc.stdout).strip()
        raise SpockError(f"{tool} failed ({proc.returncode}): {detail}")

    try:
        envelope = json.loads(proc.stdout)
    except json.JSONDecodeError as exc:
        raise SpockError(f"{tool} returned invalid JSON: {proc.stdout[:400]}") from exc

    if envelope.get("isError"):
        raise SpockError(f"{tool} returned an MCP error: {envelope}")

    structured = envelope.get("structuredContent")
    if isinstance(structured, dict):
        return structured

    content = envelope.get("content") or []
    if content and isinstance(content[0], dict):
        text = content[0].get("text", "")
        try:
            parsed = json.loads(text)
        except (TypeError, json.JSONDecodeError):
            return {"text": text}
        if isinstance(parsed, dict):
            return parsed
    return envelope


def _print(data: dict[str, Any], raw: bool) -> None:
    if raw:
        print(json.dumps(data, indent=2, ensure_ascii=False))
        return

    if "projects" in data:
        projects = data.get("projects", [])
        selected = next((p for p in projects if p.get("name") == PROJECT), None)
        if selected is None:
            raise SpockError(f"canonical project {PROJECT!r} is not indexed")
        print(f"Spock: ONLINE — {selected['name']}")
        print(f"Root: {selected.get('root_path', '?')}")
        print(f"Graph: {selected.get('nodes', '?')} nodes / {selected.get('edges', '?')} edges")
        print(f"Indexed projects: {data.get('total', len(projects))}")
        return

    text = data.get("text")
    if isinstance(text, str):
        print(text)
        return

    print(json.dumps(data, indent=2, ensure_ascii=False))


def cmd_status(args: argparse.Namespace) -> None:
    data = _call("list_projects", {"offset": 0, "limit": 100, "include_details": True})
    _print(data, args.json)


def cmd_architecture(args: argparse.Namespace) -> None:
    aspects = args.aspects or ["overview", "entry_points", "boundaries", "hotspots"]
    payload: dict[str, Any] = {"project": PROJECT, "aspects": aspects}
    if args.path:
        payload["path"] = args.path
    _print(_call("get_architecture", payload), args.json)


def cmd_search(args: argparse.Namespace) -> None:
    payload: dict[str, Any] = {
        "project": PROJECT,
        "pattern": args.pattern,
        "mode": "compact",
        "limit": args.limit,
        "regex": args.regex,
    }
    if args.path_filter:
        payload["path_filter"] = args.path_filter
    _print(_call("search_code", payload), args.json)


def cmd_changes(args: argparse.Namespace) -> None:
    payload: dict[str, Any] = {
        "project": PROJECT,
        "scope": "impact",
        "direction": args.direction,
        "depth": args.depth,
        "limit": args.limit,
        "format": "json" if args.json else "tree",
    }
    if args.since:
        payload["since"] = args.since
    _print(_call("detect_changes", payload), args.json)


def cmd_reindex(args: argparse.Namespace) -> None:
    payload = {
        "repo_path": str(REPO),
        "name": PROJECT,
        "mode": args.mode,
        "persistence": args.persistence,
    }
    _print(_call("index_repository", payload), args.json)


def _run_engine_recall(token: str, depth: int) -> dict[str, Any] | None:
    """Invoke the concurrent-bidirectional-memory engine's RECALL (Doorway Effect)."""
    engine = MEMORY_SKILL / "scripts" / "bidirectional_memory.py"
    if not engine.is_file():
        raise SpockError(f"memory engine not found: {engine}")
    env = dict(os.environ)
    proc = subprocess.run(
        [sys.executable, str(engine), "--token", token, "--depth", str(depth)],
        capture_output=True,
        text=True,
        cwd=str(MEMORY_SKILL),
        timeout=120,
        check=False,
        env=env,
    )
    if proc.returncode != 0:
        detail = (proc.stderr or proc.stdout).strip()
        raise SpockError(f"memory RECALL failed ({proc.returncode}): {detail[:400]}")
    try:
        return json.loads(proc.stdout)
    except (TypeError, json.JSONDecodeError):
        return {"raw": proc.stdout}


def _export_memory() -> Path:
    exporter = MEMORY_SKILL / "scripts" / "export_memory_jsonl.py"
    if not exporter.is_file():
        raise SpockError(f"memory exporter not found: {exporter}")
    proc = subprocess.run(
        [sys.executable, str(exporter)],
        capture_output=True,
        text=True,
        cwd=str(MEMORY_SKILL),
        timeout=120,
        check=False,
    )
    if proc.returncode != 0:
        raise SpockError(f"memory export failed ({proc.returncode}): {(proc.stderr or proc.stdout).strip()[:400]}")
    # last line names the output path
    last = [l for l in proc.stdout.strip().splitlines() if "->" in l][-1]
    return Path(last.split("->", 1)[1].strip())


def cmd_memory(args: argparse.Namespace) -> None:
    """Bridge the living memory store into the fleet graph: RECALL + export + index."""
    if args.sub == "recall":
        result = _run_engine_recall(args.token, args.depth)
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return

    if args.sub == "export":
        out = _export_memory()
        print(f"exported -> {out}")
        return

    if args.sub == "reindex":
        # 1) export live rows to the engine's Spock-indexed dir
        out = _export_memory()
        # 2) (re)index the engine source project so the graph holds memory nodes
        payload = {
            "repo_path": str(MEMORY_SKILL),
            "name": MEMORY_GRAPH_PROJECT,
            "mode": "moderate",
        }
        _print(_call("index_repository", payload), args.json)
        # 3) also surface the live row counts
        import sqlite3
        c = sqlite3.connect(str(MEMORY_DB))
        state_n = c.execute("SELECT COUNT(*) FROM bidirectional_memory_state").fetchone()[0]
        run_n = c.execute("SELECT COUNT(*) FROM bidirectional_memory_run").fetchone()[0]
        c.close()
        print(f"memory export: {out}")
        print(f"live store: {state_n} state rows, {run_n} run summaries")
        print("memory is now graphed + exportable via the fleet Spock bridge")
        return

    # default: status of the memory graph project
    data = _call("list_projects", {"offset": 0, "limit": 100, "include_details": True})
    projects = data.get("projects", [])
    mem = next((p for p in projects if p.get("name") == MEMORY_GRAPH_PROJECT), None)
    if mem is None:
        print(f"memory project {MEMORY_GRAPH_PROJECT!r} not yet indexed — run: spock_memory.py memory reindex")
        return
    print(f"Memory graph: {mem.get('nodes', '?')} nodes / {mem.get('edges', '?')} edges")
    print(f"Live store:    {MEMORY_DB}")
    print(f"Export dir:    {MEMORY_EXPORT_DIR}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Spock graph-memory bridge")
    parser.add_argument("--json", action="store_true", help="emit structured JSON")
    sub = parser.add_subparsers(dest="command", required=True)

    status = sub.add_parser("status", help="verify canonical fleet index")
    status.set_defaults(func=cmd_status)

    architecture = sub.add_parser("architecture", help="compact architecture view")
    architecture.add_argument("--path")
    architecture.add_argument("--aspects", nargs="+")
    architecture.set_defaults(func=cmd_architecture)

    search = sub.add_parser("search", help="compact graph-augmented code search")
    search.add_argument("pattern")
    search.add_argument("--path-filter")
    search.add_argument("--limit", type=int, default=10)
    search.add_argument("--regex", action="store_true")
    search.set_defaults(func=cmd_search)

    changes = sub.add_parser("changes", help="git-diff blast radius")
    changes.add_argument("--direction", choices=["inbound", "outbound", "both"], default="inbound")
    changes.add_argument("--depth", type=int, default=2)
    changes.add_argument("--limit", type=int, default=200)
    changes.add_argument("--since")
    changes.set_defaults(func=cmd_changes)

    reindex = sub.add_parser("reindex", help="refresh canonical graph")
    reindex.add_argument("--mode", choices=["full", "moderate", "fast"], default="full")
    reindex.add_argument("--persistence", action="store_true")
    reindex.set_defaults(func=cmd_reindex)

    memory = sub.add_parser("memory", help="bridge living memory into the fleet graph")
    msub = memory.add_subparsers(dest="sub")
    m_recall = msub.add_parser("recall", help="run Doorway-Effect RECALL via engine")
    m_recall.add_argument("--token", default="RECALL")
    m_recall.add_argument("--depth", type=int, default=3)
    m_recall.set_defaults(func=cmd_memory)
    m_export = msub.add_parser("export", help="export live memory rows to JSONL")
    m_export.set_defaults(func=cmd_memory)
    m_reindex = msub.add_parser("reindex", help="export + graph the memory store")
    m_reindex.set_defaults(func=cmd_memory)
    # default memory (no sub) shows memory-graph status
    memory.set_defaults(func=cmd_memory)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        args.func(args)
    except (SpockError, subprocess.TimeoutExpired) as exc:
        print(f"Spock memory error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
