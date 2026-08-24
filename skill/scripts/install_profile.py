#!/usr/bin/env python3
"""Install Star Trek profiles with fleet-awareness checks."""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO_ROOT = ROOT.parent.parent.parent.parent / "🜏 Lilith" / "ludicrous-speed"

CATALOG_PATH = REPO_ROOT / "catalog.json"
MANAGE_PY = REPO_ROOT / "manage.py"


def load_catalog() -> list[dict]:
    if not CATALOG_PATH.exists():
        print("catalog.json not found", file=sys.stderr)
        sys.exit(1)
    return json.loads(CATALOG_PATH.read_text(encoding="utf-8"))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("targets", nargs="*", metavar="PROFILE")
    parser.add_argument("--series", action="append", choices=["TOS", "TNG", "DS9", "Voyager"])
    parser.add_argument("--all", action="store_true", help="Install all 68 profiles")
    parser.add_argument("--alias", action="store_true")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--hermes-bin", default=os.environ.get("HERMES_BIN", "hermes"))
    args = parser.parse_args()

    catalog = load_catalog()
    by_slug = {p["slug"]: p for p in catalog}

    selected = []
    if args.all:
        selected = list(catalog)
    elif args.series:
        for s in args.series:
            selected.extend(p for p in catalog if p["series"] == s)
    elif args.targets:
        for t in args.targets:
            if t not in by_slug:
                print(f"Unknown profile: {t}", file=sys.stderr)
                return 1
            selected.append(by_slug[t])

    if not selected:
        print("No profiles selected. Use --all, --series, or list slugs.", file=sys.stderr)
        return 1

    print(f"Installing {len(selected)} profiles...")
    for p in selected:
        cmd = [args.hermes_bin, "profile", "install", str(REPO_ROOT / "profiles" / p["slug"]), "--name", p["slug"], "-y"]
        if args.alias:
            cmd.append("--alias")
        if args.force:
            cmd.append("--force")
        print(f"  Installing {p['name']}...")
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"  FAILED: {result.stderr.strip()}", file=sys.stderr)

    print("Done. Start a new session: hermes -p <slug> chat")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
