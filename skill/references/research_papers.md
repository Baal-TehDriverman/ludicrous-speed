# Research Papers Reference

> 12 ArXiv papers summarized with implementation notes for the Lilith Sovereign Fleet

## Thread 1: Multi-Agent Orchestration & Fleet Topology

### 2608.21049 — -ACT: End-to-End Verifiable Agentic Intent Control
**URL:** https://arxiv.org/abs/2608.21049
**Relevance:** Verifiable intent control for agents in distributed networks. Maps to FleetGraph's initiative ladder.
**Implementation:** `verify_intent()` pre-flight in `fleet_graph_core.py` — validates that a sender's stated intent matches their role boundary before any `POST /send` delegate frame.

### 2608.20564 — Consilience: Conformally Calibrated Communication Control
**URL:** https://arxiv.org/abs/2608.20564
**Relevance:** Calibrated communication when agents have hidden profiles (personas they don't fully expose).
**Implementation:** Extend `/match` endpoint with "communication calibration" layer — score how well a task framing fits a persona's stated boundaries.

### 2608.20518 — FL-MAESTRO: Multi-Agent LLM Orchestration for Resource-Constrained Federated Learning
**URL:** https://arxiv.org/abs/2608.20518
**Relevance:** Orchestrating agents under resource constraints (62GB RAM, single GPU).
**Implementation:** Resource-aware scheduler in `fleet_graph_core.py` — each node carries `resource_weight` (light/medium/heavy). Stagger heavy jobs.

### 2608.20494 — Towards Traffic Modelling of Multi-Agent Systems
**URL:** https://arxiv.org/abs/2608.20494
**Relevance:** Topology determines traffic patterns. FleetGraph's DAG is the coordination topology.
**Implementation:** Congestion prediction layer on `/traffic` endpoint — flag supervisor with >5 subordinates and deep inbox as "bottleneck risk."

### 2608.21156 — Graph Engineering in the Era of LLM Agents
**URL:** https://arxiv.org/abs/2608.21156
**Relevance:** Graph structure transforms individual agent capability into system intelligence.
**Implementation:** Conceptual backbone of ludicrous-speed. FleetGraph = graph engineering, Star Trek = agent personas, topology YAML = binding.

## Thread 2: Persona Consistency & Character-Grounded Agents

### 2606.09475 — Emergent alignment and the projectability of ethical personas
**URL:** https://arxiv.org/abs/2606.09475
**Relevance:** How ethical personas project onto agent behavior.
**Implementation:** Geburah audit extension — after a persona agent completes a task, verify output tone matches SOUL.md voice section.

### 2605.17044 — PersonaArena: Dynamic Simulation for Evaluating Persona-Level Role-Playing
**URL:** https://arxiv.org/abs/2605.17044
**Relevance:** Evaluating persona quality through simulation.
**Implementation:** `profiles/test/` directory with scenario prompts — `manage.py validate` runs 5-10 test scenarios per profile.

### 2607.00918 — From Personas to Plot: Character-Grounded Multi-Agent Story Generation
**URL:** https://arxiv.org/abs/2607.00918
**Relevance:** Multi-agent story generation where each agent is grounded in a persona.
**Implementation:** Albedo Kairos Story Council already does this. Paper's "character arc tracking" improves continuity across dream cycles.

## Thread 3: Memory, Recurrence & Self-Correction

### 2608.00028 — Width, Memory, and Delay: Resource Accounting for Flat Multi-Agent Systems
**URL:** https://arxiv.org/abs/2608.00028
**Relevance:** Flat multi-agent systems hit memory/delay walls. FleetGraph's hierarchy is the antidote.
**Implementation:** `memory_budget()` method in `fleet_graph_core.py` — estimates per-node state cost, flags subtree overflow.

### 2607.29405 — Beyond Component Testing: Validating Agentic AI Systems
**URL:** https://arxiv.org/abs/2607.29405
**Relevance:** Testing whole system, not just individual agents.
**Implementation:** `tests/fleet_behavior_test.py` — simulates multi-bot scenario and verifies initiative ladder produces correct escalation.

## Thread 4: Security & Adversarial Operations

### 2608.21101 — ClawSentry: Progressive Multi-Tier Security Monitor
**URL:** https://arxiv.org/abs/2608.21101
**Relevance:** Lucifer red-team division stress-tests the fleet. This paper's multi-tier monitoring maps to existing layers.
**Implementation:** `security_tiers` field in topology YAML — each node carries which tiers it participates in.

### 2606.23700 — Self-Recognition Finetuning Prevents Emergent Misalignment
**URL:** https://arxiv.org/abs/2606.23700
**Relevance:** Persona agents can drift. Self-recognition prevents drift.
**Implementation:** Dream engine's backward pass already performs self-recognition. Extend to persona agents — check final action against SOUL.md boundaries.

## Research-to-Implementation Map

| Paper | FleetGraph Component | Star Trek Integration |
|-------|---------------------|----------------------|
| -ACT (2608.21049) | `verify_intent()` pre-flight | Persona boundary enforcement |
| Consilience (2608.20564) | `/match` calibration layer | Persona-task fit scoring |
| FL-MAESTRO (2608.20518) | Resource-aware scheduler | Heavy persona staggering |
| Traffic Topology (2608.20494) | Congestion prediction | Bottleneck flagging |
| Graph Engineering (2608.21156) | **Conceptual backbone** | **System > sum of parts** |
| Emergent Alignment (2606.09475) | Geburah audit extension | Persona consistency check |
| PersonaArena (2605.17044) | `manage.py validate` | Scenario test battery |
| Personas to Plot (2607.00918) | Story Council continuity | Arc tracking across cycles |
| Width/Memory (2608.00028) | `memory_budget()` method | Subtree cost estimation |
| Beyond Component (2607.29405) | Fleet behavior tests | Initiative ladder validation |
| ClawSentry (2608.21101) | Security tier field | Lucifer red-team tiers |
| Self-Recognition (2606.23700) | Backward pass extension | Persona drift detection |
