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
