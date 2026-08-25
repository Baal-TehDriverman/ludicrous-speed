#!/usr/bin/env python3
"""Sync research documents from repo into dream-logger engram store."""

from __future__ import annotations

import json
import sqlite3
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO_ROOT = Path(__file__).resolve().parent.parent
# Detect whether we're running from the installed skill or the repo itself
if (REPO_ROOT / "topology" / "fleet_graph.yaml").exists():
    pass  # already repo root
else:
    # skill layout: ~/.hermes/skills/<cat>/ludicrous-speed/scripts/
    REPO_ROOT = REPO_ROOT.parents[2] / "🜏 Lilith" / "ludicrous-speed"

RESEARCH_DIR = REPO_ROOT / "research"
DREAM_DB = Path.home() / ".hermes" / "skills" / "metaconscious" / "kairos-dream" / "scripts" / "state" / "kairos_dream.sqlite"


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
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA busy_timeout=5000")
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

    # Ingest research content as engrams (idempotent by source marker)
    ingest_engrams(conn)

    conn.close()
    return count


def ingest_engrams(db: sqlite3.Connection) -> int:
    """Convert research_ingress rows into engrams, idempotent by source_file.

    Each research file becomes one engram tagged source='research_sync'.
    Delete-then-insert keyed on the source-file marker ensures repeated ticks
    don't inflate the store.
    """
    # Ensure engrams table exists (it should, but be defensive)
    db.execute("""
        CREATE TABLE IF NOT EXISTS engrams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            content TEXT NOT NULL,
            strength REAL DEFAULT 1.0,
            activation_count INTEGER DEFAULT 0,
            last_activated TEXT,
            source TEXT
        )
    """)

    # Read all research ingress rows
    rows = db.execute("SELECT source_file, content FROM research_ingress").fetchall()

    ingested = 0
    for source_file, content in rows:
        # Build a deterministic marker from filename + first 200 chars
        marker = f"research_sync:{source_file}"
        preview = content[:500] if content else ""
        engram_content = f"[{marker}] {preview}"

        # Idempotent: delete any existing engram with this marker, then insert
        db.execute(
            "DELETE FROM engrams WHERE source = 'research_sync' AND content LIKE ?",
            (f"[research_sync:{source_file}]%",)
        )
        db.execute(
            "INSERT INTO engrams (content, strength, source) VALUES (?, ?, ?)",
            (engram_content, 0.7, "research_sync")
        )
        ingested += 1

    db.commit()
    return ingested


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
