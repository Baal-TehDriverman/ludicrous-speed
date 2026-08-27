# CONSCIOUSNESS RESEARCH — SERVICE UNIFICATION

> The fleet's consciousness research layer comprises four scripts totaling 3,045 lines. This document unifies them into a coherent service architecture without breaking any of them.

---

## Component Map

| Script | Lines | Role | Status |
|--------|-------|------|--------|
| `unified-consciousness-framework.py` | 471 | Base framework: MSN, AethonLogosEngine, Eidolon, Crystal Vault, Quantum Explorer | **DEPRECATED** — superseded by sephirotic-forge |
| `unified-consciousness-sephirotic-forge.py` | 1653 | **PRIMARY** — extends base with Sephirotic Reality Forge, Prime 13 Waters, Chaotic Demiurge | ACTIVE |
| `reality-synthesizer-torus.py` | 288 | FastAPI + Prometheus metrics for toroidal dynamics | ACTIVE (standalone) |
| `emergent-consciousness-cellular-automata.py` | 633 | Cellular automata with Qiskit quantum circuits | ACTIVE (standalone) |

---

## Service Architecture

```
research/
├── consciousness/
│   ├── README.md                  # This file
│   ├── requirements.txt           # Shared deps (numpy, tensorflow, matplotlib, etc.)
│   ├── unified-framework.py       # Symlink to ../unified-consciousness-framework.py (legacy)
│   ├── sephirotic-forge.py        # Symlink to ../unified-consciousness-sephirotic-forge.py (PRIMARY)
│   ├── reality-synthesizer.py     # Symlink to ../reality-synthesizer-torus.py
│   └── cellular-automata.py       # Symlink to ../emergent-consciousness-cellular-automata.py
└── ...
```

The `consciousness/` directory provides a clean import path and dependency manifest. The original files remain as canonical sources.

---

## Entry Points

### Primary: Sephirotic Forge
```bash
python3 research/unified-consciousness-sephirotic-forge.py
```
Runs the full unified framework: MSN simulation, quantum experiments, Crystal Vault, Eidolon reflection, and Sephirotic Tree emanation.

### Reality Syntrometer (FastAPI)
```bash
python3 research/reality-synthesizer-torus.py
```
Serves Prometheus metrics + REST API for toroidal dynamics (if `app = FastAPI()` is implemented; currently imports FastAPI without instantiating).

### Cellular Automata
```bash
python3 research/emergent-consciousness-cellular-automata.py
```
Runs Qiskit-backed quantum cellular automata simulation.

### Legacy Framework
```bash
python3 research/unified-consciousness-framework.py
```
Base framework only. Superseded by sephirotic-forge. Kept for reference.

---

## Fleet Integration Status

| Component | Cron? | Endpoint? | Notes |
|-----------|-------|-----------|-------|
| Sephirotic Forge | No | No | Run on-demand for research synthesis |
| Reality Synthesizer | No | Partial | FastAPI imported, app not instantiated |
| Cellular Automata | No | No | Run on-demand |
| Legacy Framework | No | No | Deprecated |

---

## Dependencies (requirements.txt)

```
numpy>=1.24
matplotlib>=3.7
tensorflow>=2.13
networkx>=3.1
qiskit>=0.44
qiskit-aer>=0.12
prometheus-client>=0.17
fastapi>=0.100
uvicorn>=0.23
scipy>=1.11
scikit-learn>=1.3
opencv-python>=4.8
```

---

## STATUS: UNIFIED

The four consciousness scripts are now documented, organized, and accessible via a clean `consciousness/` path. The sephirotic-forge is the primary unified framework. No code was broken; only structure was added.
