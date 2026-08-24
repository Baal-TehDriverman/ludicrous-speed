#!/usr/bin/env python3
"""Sync research documents from repo into dream-logger engram store."""

from __future__ import annotations

import json
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO_ROOT = ROOT.parent.parent.parent.parent / "🜏 Lilith" / "ludicrous-speed"

RESEARCH_DIR = REPO_ROOT / "research"
DREAM_DB = ROOT.parent.parent / "metaconscious" / "kairos-dream" / "state" / "kairos_dream.sqlite"


def find_research_files() -> list[Path]:
    if not RESEARCH_DIR.exists():
        return []
    return sorted(RESEARCH_DIR.glob("*.md"))


def read_research_content(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except Exception as e:
        return f"Error reading {path.name}: {e}"


def ensure_dream_table(db: sqlite3.Connection) -> None:
    db.execute("""
        CREATE TABLE IF NOT EXISTS research_ingress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_file TEXT NOT NULL,
            content TEXT NOT NULL,
            imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    db.commit()


def sync_to_dream_db(files: list[Path]) -> int:
    if not DREAM_DB.exists():
        print(f"Dream DB not found at {DREAM_DB}", file=sys.stderr)
        print("Research files found but not synced:", len(files))
        return 0

    conn = sqlite3.connect(str(DREAM_DB))
    ensure_dream_table(conn)

    # Clear old research ingress
    conn.execute("DELETE FROM research_ingress")
    conn.commit()

    count = 0
    for f in files:
        content = read_research_content(f)
        conn.execute(
            "INSERT INTO research_ingress (source_file, content) VALUES (?, ?)",
            (f.name, content)
        )
        count += 1

    conn.commit()
    conn.close()
    return count


def main() -> int:
    files = find_research_files()

    print(f"Found {len(files)} research documents")
    for f in files:
        print(f"  {f.name}")

    if not files:
        print("No research files to sync.")
        return 0

    synced = sync_to_dream_db(files)
    print(f"Synced {synced} documents to dream DB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
