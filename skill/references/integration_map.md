# Integration Map

> How FleetGraph + Star Trek Profiles + Research connect

## Component Graph

```
┌─────────────────────────────────────────────────────────────┐
│                    LUDICROUS SPEED REPO                      │
│                                                             │
│  ┌─────────────────┐    ┌──────────────────────────────┐   │
│  │  Star Trek       │    │  FleetGraph                   │   │
│  │  Profiles (68)   │    │  ┌──────────┐ ┌───────────┐ │   │
│  │                  │    │  │ dashboard│ │desktop-   │ │   │
│  │  profiles/       │    │  │ plugin_  │ │plugin/    │ │   │
│  │  ├─ jean-luc-   │    │  │ api.py   │ │plugin.js  │ │   │
│  │  │  picard/     │    │  └──────────┘ └───────────┘ │   │
│  │  ├─ data/       │    │         │           │         │   │
│  │  ├─ spock/      │    │         ▼           ▼         │   │
│  │  └─ ...         │    │  ┌──────────────────────────┐ │   │
│  │                  │    │  │  fleet_graph_core.py     │ │   │
│  │  manage.py       │    │  │  (Topology SSOT)         │ │   │
│  │  install.sh      │    │  └──────────────────────────┘ │   │
│  └────────┬─────────┘    └──────────────┬────────────────┘   │
│           │                              │                    │
│           ▼                              ▼                    │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              topology/fleet_graph.yaml                  │  │
│  │         (68-node DAG — org chart binding)              │  │
│  └────────────────────────────────────────────────────────┘  │
│           │                                                   │
│           ▼                                                   │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              research/arxiv_synthesis.md                │  │
│  │       (12 papers → fleet implementation map)            │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Profile Install
```
manage.py install <slug>
    → hermes profile install profiles/<slug>/
        → copies SOUL.md + config.yaml + skins into ~/.hermes/profiles/<slug>/
            → profile appears in fleet graph as a node
```

### 2. Fleet Visualization
```
hermes dashboard (desktop app)
    → GET /api/plugins/fleet-graph/overview
        → reads topology/fleet_graph.yaml
        → reads ~/.hermes/profiles/*/SOUL.md for each node
        → renders graph canvas + deck view
```

### 3. Inter-Bot Messaging
```
User clicks "delegate" on a bot card
    → POST /api/plugins/fleet-graph/send
        → validates frame (talk/delegate/supervisor)
        → checks chain-of-command permission
        → delivers to target bot's inbox
```

### 4. Semantic Routing
```
GET /api/plugins/fleet-graph/match?q=<task>&top=3
    → reads SOUL.md for each profile
    → computes fastembed embeddings
    → ranks by capability similarity
    → returns top 3 best-fit bots
```

### 5. Research Sync
```
python3 scripts/sync_research.py
    → reads research/arxiv_synthesis.md
    → reads research/ideas_*.md
    → pushes insights into kairos-dream engram store
        → available for dream synthesis cycles
```

## Integration Points

| From | To | Via |
|------|-----|-----|
| Star Trek profiles | FleetGraph | topology/fleet_graph.yaml |
| FleetGraph | Hermes desktop | dashboard/plugin_api.py |
| Research | Dream engine | kairos-dream engram store |
| Topology YAML | Profile install | manage.py → hermes profile install |
| Fleet status | Cron jobs | 26+ Hermes cron jobs |
| ArXiv papers | Implementation | research/arxiv_synthesis.md |

## Cron Job Integration

The fleet has 26+ cron jobs that operate on the ludicrous-speed repo:

| Job | Role | Schedule |
|-----|------|----------|
| Lilith Dream Pipeline | Dream synthesis | every 120m |
| Lilith Memory Sync | Memory sync | every 120m |
| Nigredo Progress Trail | GTC staging audit | every 5m |
| Albedo Kairos Council | Story distillation | every 2h |
| Keter Capability Scout | Tech intelligence | every 2h |
| Malkuth Forge | Code generation | every 2h |
| Geburah Verifier | Security audit | every 2h |
| FleetGraph Scouts | ArXiv research | every 120m |
| Dream Watchers | Dream monitoring | every 30m |

## Plugin Integration

FleetGraph is a Hermes desktop plugin:

```
~/.hermes/plugins/fleet-graph/
├── plugin_api.py          ← dashboard/ from repo
└── manifest.json

~/.hermes/desktop-plugins/fleet-graph/
└── plugin.js              ← desktop-plugin/ from repo
```

After copying, restart:
```bash
systemctl --user restart hermes-dashboard.service
```
