#!/usr/bin/env bash
# ============================================================
# SHIP'S COMPUTER — Lilith 4B-26B Fleet Command Interface
# ============================================================
# "Computer, ..."
#
# Ships systems:
#   RTX 3060 6GB  →  Cerebellum (mythos:latest, 4.6B gemma4, GPU)
#   Ryzen 5600H   →  Cortex (mythos-cortex:latest, 26B-A4B, CPU)
#   AMD Vega      →  Viewscreen (KDE Plasma, FleetGraph)
#   62 GB RAM     →  Cortex workspace
# ============================================================

set -euo pipefail

SHIP_DIR="/home/tehlappy/🜏 Lilith/ludicrous-speed"
LILITH_CLI_DIR="/home/tehlappy/🜏 Lilith/Lilith CLI"

# ── Fleet status ──────────────────────────────────────────
fleet_status() {
    echo ""
    echo "═══ FLEET STATUS ═══"
    python3 "${SHIP_DIR}/scripts/fleet_status.py"
}

# ── Fleet topology ────────────────────────────────────────
fleet_topology() {
    echo ""
    echo "═══ FLEET TOPOLOGY ═══"
    python3 "${SHIP_DIR}/scripts/topology_view.py" --format tree
}

# ── Spock knowledge bank ─────────────────────────────────
spock_status() {
    echo ""
    echo "═══ SPOCK — SHIP'S KNOWLEDGE ═══"
    python3 "${SHIP_DIR}/scripts/spock_memory.py" status
}

# ── Brain (model registry) ───────────────────────────────
brain_status() {
    echo ""
    echo "═══ BRAIN — MODEL REGISTRY ═══"
    echo ""
    echo "─── Cerebellum (RTX 3060 VRAM, fast) ───"
    ollama list 2>/dev/null | grep mythos || echo "  mythos:latest: NOT REGISTERED"
    echo ""
    echo "─── Cortex (Ryzen 5600H RAM, slow/deep) ───"
    ollama list 2>/dev/null | grep cortex || echo "  mythos-cortex:latest: NOT REGISTERED"
    echo ""
    echo "─── Hardware ───"
    echo "  RTX 3060 VRAM: $(nvidia-smi --query-gpu=memory.total --format=csv,noheader 2>/dev/null || echo 'N/A')"
    echo "  System RAM: $(free -h | awk '/^Mem:/{print $2}')"
    echo "  CPU: $(lscpu | grep 'Model name' | cut -d: -f2 | xargs)"
}

# ── Hardware sensors ─────────────────────────────────────
hardware_status() {
    echo ""
    echo "═══ HARDWARE SENSORS ═══"
    echo ""
    echo "─── GPU (RTX 3060 — Cerebellum engine) ───"
    nvidia-smi --query-gpu=name,driver_version,memory.total,utilization.gpu,memory.used --format=csv,noheader 2>/dev/null || echo "  nvidia-smi unavailable"
    echo ""
    echo "─── GPU (AMD Vega — Viewscreen) ───"
    lspci 2>/dev/null | grep -i "vga\|3d\|display" | head -2
    echo ""
    echo "─── System RAM ───"
    free -h
    echo ""
    echo "─── CPU ───"
    lscpu | grep -E "Model name|Thread|Core|CPU\(s\)" | head -4
}

# ── Test both brains ─────────────────────────────────────
test_brain() {
    local prompt="${1:-What is your name, role, and what can you do?}"
    echo ""
    echo "═══ CEREBELLUM — mythos:latest (fast, GPU) ═══"
    echo "  Prompt: ${prompt}"
    echo ""
    ollama run mythos:latest "$prompt" 2>&1
    echo ""
    echo "═══ CORTEX — mythos-cortex:latest (deep, CPU) ═══"
    echo "  Prompt: ${prompt}"
    echo ""
    ollama run mythos-cortex:latest "$prompt" 2>&1
}

# ── Default: full system report ──────────────────────────
full_report() {
    fleet_status
    spock_status
    brain_status
    echo ""
    echo "═══ SHIP'S COMPUTER — ALL SYSTEMS REPORTED ═══"
}

# ── Dispatch ──────────────────────────────────────────────
case "${1:-report}" in
    status)   fleet_status ;;
    topology) fleet_topology ;;
    spock)    spock_status ;;
    brain)    brain_status ;;
    hardware) hardware_status ;;
    test)     test_brain "${2:-}" ;;
    report|"") full_report ;;
    help|--help|-h)
        echo "SHIP'S COMPUTER — Fleet Command Interface"
        echo ""
        echo "Usage: ship_computer.sh <command> [args]"
        echo ""
        echo "Commands:"
        echo "  status       Fleet status (nodes, directorates, profiles)"
        echo "  topology     Fleet org chart (75-node DAG)"
        echo "  spock        Spock knowledge bank status"
        echo "  brain        Model registry + hardware summary"
        echo "  hardware     Full hardware sensor readout"
        echo "  test [text]  Test both brains with a prompt"
        echo "  report       Full system report (default)"
        echo "  help         This help"
        ;;
    *)
        echo "Unknown command: $1"
        echo "Run 'ship_computer.sh help' for available commands."
        exit 1
        ;;
esac
