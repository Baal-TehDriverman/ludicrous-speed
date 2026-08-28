#!/usr/bin/env python3
"""Installed-skill launcher for the canonical fleet Spock bridge."""
from pathlib import Path
import os
import runpy

candidates = [
    Path(os.environ.get("LUDICROUS_SPEED_REPO", "")) / "scripts/spock_memory.py"
    if os.environ.get("LUDICROUS_SPEED_REPO") else None,
    Path("/home/tehlappy/Desktop/🜏 Lilith/ludicrous-speed/scripts/spock_memory.py"),
    Path("/home/tehlappy/🜏 Lilith/ludicrous-speed/scripts/spock_memory.py"),
]
for candidate in candidates:
    if candidate and candidate.is_file():
        runpy.run_path(str(candidate), run_name="__main__")
        break
else:
    raise SystemExit("Spock bridge not found; set LUDICROUS_SPEED_REPO")
