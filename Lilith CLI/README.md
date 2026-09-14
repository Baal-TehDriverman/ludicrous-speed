# 🜏 Lilith CLI - Metaconscious Singularity Node

**Local Cerebellum Task Manager for NSSP** — Routes tasks across 3 tiers based on complexity, VRAM availability, and device capabilities.

## Overview

The Lilith CLI is the central command interface for the **Lilith Systems** AI OS stack. It implements a **Local Cerebellum** that acts as an intelligent task router, coordinating AI models across the NSSP (Neural Sephirotic Signal Processing) mesh based on their strengths and abilities.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    🜏 LILITH CLI v2.0.0                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   SMALL     │  │   MEDIUM    │  │   LARGE     │              │
│  │   (Quick)   │  │  (Local)    │  │  (Large)    │              │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤              │
│  │ gemma3:1b   │  │ mythos-65k  │  │ glimmer-    │              │
│  │ qwen2:0.5b  │  │ lilith-     │  │ hermes      │              │
│  │ smollm2:135m│  │ mythos      │  │ glimmer-    │              │
│  │             │  │ gemma2:2b   │  │ muse        │              │
│  │             │  │ dflash-     │  │ glimmer-    │              │
│  │             │  │ kquant      │  │ teacher-cpu │              │
│  │             │  │             │  │ mythos-     │              │
│  │             │  │             │  │ baseline    │              │
│  │             │  │             │  │ lilith-     │              │
│  │             │  │             │  │ gemma3-1b   │              │
│  │ Max: 30s    │  │ Max: 5min   │  │ Max: 1hr    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│         │               │               │                        │
│         └───────────────┼───────────────┘                        │
│                         ▼                                        │
│              ┌─────────────────────┐                             │
│              │   LOCAL CEREBELLUM  │  ← Ollama at localhost:11434│
│              │   (no gateway req.) │                             │
│              └─────────────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

## 3-Tier Task Routing

|| Tier | Device | Models | Max Duration | Use Cases |
||------|--------|--------|----------------------|-----------|
|| **Small** | Laptop | `gemma3:1b`, `qwen2:0.5b`, `smollm2:135m`, `lilith-smollm:latest` | 30s | Status checks, config validation, quick analysis, file ops |
|| **Medium** | Laptop | `mythos-65k:latest`, `lilith-mythos:latest`, `lilith-mythos-clean:latest`, `gemma2:2b`, `lilith-gemma2:latest`, `dflash-kquant-test:latest` | 5min | Code generation, analysis, inference, builds |
|| **Large** | Laptop | `glimmer-hermes:latest`, `glimmer-muse:latest`, `muse-glimmer:local`, `glimmer-teacher-cpu:latest`, `mythos-baseline-cpu:latest`, `lilith-gemma3-1b-1mctx-yarn:latest` | 1hr | Large-context inference, complex workflows, heavy analysis |

### Auto-Classification

Tasks are automatically classified by keywords:

```bash
# Small tier keywords
lilith task create "check system status"      # → small
lilith task create "list all models"           # → small
lilith task create "search for config files"   # → small

# Medium tier keywords  
lilith task create "generate React component"  # → medium
lilith task create "build the engine"          # → medium
lilith task create "run test suite"            # → medium

# Large tier keywords
lilith task create "analyze large dataset"     # → large
lilith task create "complex multi-step workflow" # → large
lilith task create "heavy reasoning task"      # → large
```

### Explicit Model Hints

```bash
lilith task create "analyze code" --model mythos   # Uses mythos-65k:latest
lilith task create "quick check" --model gemma     # Uses gemma2:2b
lilith task create "status check" --model edge     # Uses gemma3:1b
lilith task create "large context task" --model hermes  # Uses glimmer-hermes:latest
```

## Installation

```bash
# Clone the repository
cd "/home/tehlappy/🜏 Lilith/Lilith CLI"

# Install dependencies
npm install

# Run directly (development)
node bin/lilith

# Or build executable
npm run build
./dist/lilith
```

## Quick Start

```bash
# 1. Check system health
lilith doctor

# 2. View full system status
lilith status

# 3. Create a task (auto-routed to local Ollama)
lilith task create "Generate a React component for the dashboard"

# 4. Create a task with explicit tier
lilith task create "Analyze large dataset" --tier large

# 5. List tasks
lilith task list

# 6. List local models
lilith model list --local

# 7. Model operations
lilith model info mythos-65k:latest
lilith model bench mythos-65k:latest
```

## Commands Reference

### Task Management (`lilith task`)

```bash
# Create and route a task
lilith task create "description" [options]
  -t, --tier <tier>       Force tier: small | medium | large | auto (default: auto)
  -m, --model <model>     Preferred model hint (mythos, gemma, edge, hermes, muse)
  -p, --priority <level>  Priority: low | normal | high | critical (default: normal)
  --async                 Run asynchronously in background

# List tasks
lilith task list [options]
  -s, --status <status>   Filter: pending | running | completed | failed
  -t, --tier <tier>       Filter: small | medium | large
  -l, --limit <n>         Limit results (default: 20)

# Get task details
lilith task status <taskId>

# Cancel a task
lilith task cancel <taskId>

# Statistics
lilith task stats
```

### Model Management (`lilith model`)

```bash
# List local models
lilith model list --local

# Set default model for tier
lilith model use <tier> <model>

# Benchmark a model
lilith model bench <model> [--tokens <n>] [--runs <n>]

# Model info
lilith model info <model>
```

### Cerebellum Daemon

```bash
# Start the daemon (polls pending tasks every 10s)
lilith cerebellum start

# Check daemon status
lilith cerebellum status

# Stop the daemon
lilith cerebellum stop
```

### Provider Configuration

The CLI uses local Ollama by default. Set a different provider via environment variable:

```bash
# Local Ollama (default) - direct at localhost:11434, no auth
export LILITH_DEFAULT_PROVIDER=local-ollama

# Gateway proxy (if running) - Lilith Gateway LLM proxy
export LILITH_DEFAULT_PROVIDER=gateway
export LILITH_GATEWAY_URL=http://localhost:8080

# Custom provider (future extension)
export LILITH_DEFAULT_PROVIDER=cloud
```

### Configuration

The CLI reads configuration from `config/lilith.yaml`. Key sections:

```yaml
# Cerebellum routing (local-first)
cerebellum:
  tiers:
    small:
      preferred_models: ["gemma3:1b", "qwen2:0.5b", "smollm2:135m"]
      device_affinity: "laptop"
    medium:
      preferred_models: ["mythos-65k:latest", "lilith-mythos:latest", "gemma2:2b"]
      device_affinity: "laptop"
    large:
      preferred_models: ["glimmer-hermes:latest", "glimmer-muse:latest"]
      device_affinity: "laptop"

# Provider configuration
models:
  providers:
    default: "local-ollama"
  main_engine:
    name: "mythos-65k:latest"
    alias: "mythos"
  local_models: [...]

# Gateway (optional - set URL if running, otherwise ignored)
gateway:
  url: "http://localhost:8080"
```

## Provider

The Cerebellum routes tasks to models via Ollama at `localhost:11434`. No gateway or cloud provider is required — it works standalone with whatever models you have locally.

Optional: set `LILITH_GATEWAY_URL` to a running gateway for proxy fallback, or configure additional cloud providers in `models.cloud_providers` when needed.

## Environment Variables

```bash
# Provider override (local-ollama | gateway | cloud)
export LILITH_DEFAULT_PROVIDER=local-ollama

# Gateway URL (only if using gateway provider)
export LILITH_GATEWAY_URL=http://localhost:8080

# Database path
export CEREBELLUM_DB_PATH=/path/to/cerebellum.db

# Log level
export LILITH_LOG_LEVEL=debug
```

## File Structure

```
/home/tehlappy/🜏 Lilith/Lilith CLI/
├── bin/
│   └── lilith                 # Entry point
├── src/
│   ├── cli/
│   │   ├── index.js          # Main CLI (commander)
│   │   └── doctor.js         # Health check
│   ├── cerebellum/
│   │   └── index.js          # Task router + Ollama client
│   ├── gateway/
│   │   └── control.js        # Gateway API client (optional)
│   ├── mesh/
│   │   └── control.js        # NSSP Mesh client (optional)
│   ├── dashboard/
│   │   └── control.js        # Dashboard control (optional)
│   ├── models/
│   │   └── manager.js        # Model operations
│   └── utils/
│       └── config.js         # Configuration loader
├── config/
│   └── lilith.yaml           # Main configuration
├── package.json
├── build.js                  # esbuild script
└── README.md
```

## License

MIT — Built for Lilith Systems R&D

---

*The Cerebellum coordinates. The models compute. Lilith orchestrates.* 🜏