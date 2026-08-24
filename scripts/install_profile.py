#!/usr/bin/env python3
"""Fleet-aware wrapper around manage.py profile installation.

Defaults to dry-run. Pass --execute to actually install.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO))

CATALOG = REPO / "catalog.json"
HERMES_PROFILES = Path.home() / ".hermes" / "profiles"
SERIES_CHOICES = ("TOS", "TNG", "DS9", "VOYAGER")


def load_catalog() -> dict:
    data = json.loads(CATALOG.read_text(encoding="utf-8"))
    return {item["slug"]: item for item in data}


def series_key(series: str) -> str:
    return {"VOYAGER": "Voyager"}.get(series.upper(), series.upper())


def select(catalog: dict, slug: str | None, series: str | None, all_flag: bool) -> list[str]:
    slugs: set[str] = set()
    if all_flag:
        slugs |= set(catalog)
    elif series:
        s = series_key(series)
        slugs |= {k for k, v in catalog.items() if v["series"].lower() == s.lower()}
    elif slug:
        slugs = {slug}
    else:
        raise SystemExit("select a PROFILE slug, --series, or --all")
    unknown = sorted(slugs - set(catalog))
    if unknown:
        raise SystemExit(f"unknown profile slug(s): {', '.join(unknown)}")
    return sorted(slugs)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("profile", nargs="?", help="profile slug from catalog.json")
    ap.add_argument("--series", choices=SERIES_CHOICES)
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--dry-run", action="store_true",
                    help="plan only (this is the default)")
    ap.add_argument("--execute", action="store_true",
                    help="actually run manage.py install")
    args = ap.parse_args()

    catalog = load_catalog()
    slugs = select(catalog, args.profile, args.series, args.all)

    # Fleet-awareness checks
    try:
        import fleet_graph_core as fgc
        graph_nodes = set(fgc.load_graph())
    except Exception as exc:  # noqa: BLE001
        print(f"[warn] could not load fleet graph: {exc}")
        graph_nodes = None

    plan: list[dict] = []
    for slug in slugs:
        entry = {"slug": slug, "name": catalog[slug]["name"],
                 "series": catalog[slug]["series"]}
        if graph_nodes is not None and slug not in graph_nodes:
            entry["fleet_warning"] = "no node in fleet_graph.yaml"
        installed_dir = HERMES_PROFILES / slug
        entry["already_installed"] = installed_dir.exists()
        if entry["already_installed"]:
            entry["install_warning"] = "already present in ~/.hermes/profiles/"
        plan.append(entry)

    mode = "EXECUTE" if args.execute else "DRY-RUN"
    print(f"=== install_profile ({mode}) — {len(plan)} profile(s) ===")
    for e in plan:
        flags = []
        if "fleet_warning" in e:
            flags.append(f"WARN: {e['fleet_warning']}")
        if "install_warning" in e:
            flags.append(f"WARN: {e['install_warning']}")
        line = f"  {e['slug']:<24} {e['name']} ({e['series']})"
        if flags:
            line += "  [" + "; ".join(flags) + "]"
        print(line)

    if not args.execute:
        print("\ndry-run only — no changes made. Pass --execute to install.")
        return 0

    cmd = [sys.executable, str(REPO / "manage.py"), "install"] + slugs
    print(f"\nrunning: {' '.join(cmd)}")
    import subprocess
    proc = subprocess.run(cmd)
    return proc.returncode


if __name__ == "__main__":
    raise SystemExit(main())
