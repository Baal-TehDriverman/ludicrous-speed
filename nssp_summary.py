#!/usr/bin/env python3
"""Query Spock's NSSP knowledge and print a summary."""
import subprocess
import json
import sys

SP = "/home/tehlappy/.hermes/skills/orchestration/ludicrous-speed/scripts/spock_memory.py"
REPO = "/home/tehlappy/🜏 Lilith/ludicrous-speed"

def run(args):
    """Run spock_memory.py with given args, return parsed JSON."""
    proc = subprocess.run(
        ["python3", SP, "--json"] + args,
        capture_output=True,
        text=True,
        cwd=REPO,
        timeout=60,
    )
    if proc.returncode != 0:
        print(f"spock_memory.py failed: {proc.stderr}", file=sys.stderr)
        sys.exit(1)
    try:
        return json.loads(proc.stdout)
    except json.JSONDecodeError:
        print(f"Non-JSON output: {proc.stdout[:200]}", file=sys.stderr)
        sys.exit(1)

# Architecture for nssp path
arch = run(["architecture", "--path", "research/nssp", "--aspects", "all"])

print("=== NSSP IN SPOCK'S GRAPH ===")
print(f"Packages: {len(arch['packages'])}")
for p in arch['packages']:
    print(f"  {p['name']}: {p['nodes']} nodes, fan_in={p['fan_in']}, fan_out={p['fan_out']}")

print(f"\nHotspots: {len(arch['hotspots'])}")
for h in arch['hotspots']:
    parts = h['qn'].split('.')
    name = parts[-1] if parts else h['qn']
    print(f"  {name}: {h['fan_in']} references")

print(f"\nClusters: {len(arch['clusters'])}")
for c in arch['clusters']:
    members = c['members'][:5]
    print(f"  Cluster {c['id']}: {c['members']} cohesion={c['cohesion']}")

print(f"\nFile tree entries: {len(arch.get('file_tree', []))}")
print(f"\nTotal graph now: run 'python3 {SP} status' to see full fleet count")
