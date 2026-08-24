# FleetGraph ArXiv Research Digest

**Generated:** 2026-08-24 (EDT)  
**Scout:** Lilith Sovereign Fleet — ArXiv Research Tick  
**Topics:** Multi-agent orchestration, graph-based agent interfaces, DAG supervisor/subordinate communication

---

## Query 1: "multi-agent orchestration"

### 1. Consilience: Conformally Calibrated Communication Control for Hidden-Profile Multi-Agent Reasoning
- **ID:** 2608.20564
- **URL:** https://arxiv.org/abs/2608.20564
- **Relevance:** Introduces a communication control framework for multi-agent reasoning where agents have hidden profiles — directly applicable to FleetGraph's need for calibrated inter-agent messaging with uncertainty about peer capabilities.
- **Implementation Angle:** Adapt conformal calibration to FleetGraph's communication layer for uncertainty-aware message routing between supervisor/subordinate nodes.

### 2. FL-MAESTRO: Multi-Agent LLM Orchestration for Resource-Constrained Federated Learning
- **ID:** 2608.20518
- **URL:** https://arxiv.org/abs/2608.20518
- **Relevance:** Addresses orchestration of multiple LLM agents under resource constraints in federated settings — maps to FleetGraph's need for lightweight, distributed agent coordination.
- **Implementation Angle:** Borrow resource-constrained scheduling heuristics for FleetGraph's edge-deployed agent nodes.

### 3. Edge-Based Agentic RAG for Autonomous FHWA Bridge Inspection Compliance
- **ID:** 2608.20372
- **URL:** https://arxiv.org/abs/2608.20372
- **Relevance:** Edge-deployed agentic systems with RAG for autonomous inspection — less directly relevant but offers patterns for offline-capable agent reasoning.
- **Implementation Angle:** Consider edge-side RAG patterns for FleetGraph nodes operating with intermittent connectivity.

---

## Query 2: "hierarchical agents coordination"

### 4. Bayesian Partner Modelling enables Adaptive Replanning for LLM Coordination
- **ID:** 2608.18490
- **URL:** https://arxiv.org/abs/2608.18490
- **Relevance:** Proposes Bayesian modeling of partner agents to enable adaptive replanning — highly relevant to FleetGraph's hierarchical supervisor/subordinate dynamics where supervisors must model subordinate state.
- **Implementation Angle:** Integrate lightweight Bayesian belief updates into FleetGraph's supervisor nodes for real-time subordinate state estimation and replanning triggers.

### 5. Deep Academic Survey: Stateful Agentic Closed-Loop Paradigm for Academic Survey Automation
- **ID:** 2608.18034
- **URL:** https://arxiv.org/abs/2608.18034
- **Relevance:** Stateful closed-loop agentic systems with feedback — relevant to FleetGraph's need for persistent agent state across orchestration cycles.
- **Implementation Angle:** Adopt closed-loop state persistence patterns for FleetGraph's long-running agent sessions.

### 6. High-Altitude Platforms Beyond Connectivity
- **ID:** 2608.18587
- **URL:** https://arxiv.org/abs/2608.18587
- **Relevance:** Survey of integrated sensing/storage/communication/computing — tangential but offers systems-integration perspective for heterogeneous agent fleets.
- **Implementation Angle:** Low priority; systems architecture reference only.

---

## Query 3: "graph neural network agents"

### 7. TH-GNN: Heterogeneous Temporal Graph Neural Networks for LLM-Agent Shilling Attack Detection
- **ID:** 2608.20376
- **URL:** https://arxiv.org/abs/2608.20376
- **Relevance:** Heterogeneous temporal GNNs applied to LLM-agent interaction graphs — directly relevant to FleetGraph's graph-based agent interface architecture.
- **Implementation Angle:** Evaluate TH-GNN architecture for FleetGraph's temporal agent-interaction graph; potential for detecting anomalous agent behavior or coordination failures.

### 8. JANUS: Multi-modal Foundation Neural Sampler for Disordered Materials
- **ID:** 2608.19116
- **URL:** https://arxiv.org/abs/2608.19116
- **Relevance:** Materials science application — not relevant to FleetGraph.
- **Implementation Angle:** None.

### 9. ML-Based Hierarchical Prediction for Energy Scheduling in NTN-WPT Systems
- **ID:** 2608.08804
- **URL:** https://arxiv.org/abs/2608.08804
- **Relevance:** Hierarchical ML prediction for resource scheduling — moderate relevance to FleetGraph's resource allocation across agent hierarchies.
- **Implementation Angle:** Reference for hierarchical prediction patterns in resource-constrained agent scheduling.

---

## Query 4: "directed acyclic graph planning"

### 10. Repo0: Design-Driven Zero-to-All Code Generation
- **ID:** 2608.19854
- **URL:** https://arxiv.org/abs/2608.19854
- **Relevance:** Design-driven code generation pipeline — DAG-based task decomposition for code generation aligns with FleetGraph's DAG-structured supervisor/subordinate communication.
- **Implementation Angle:** Study Repo0's DAG decomposition strategy for FleetGraph's task-planning layer.

### 11. OrchBench: Evaluating Multi-Agent Orchestration Plans in Isolation via Deterministic Simulation
- **ID:** 2607.25656
- **URL:** https://arxiv.org/abs/2607.25656
- **Relevance:** Benchmark for evaluating multi-agent orchestration plans deterministically — directly applicable to FleetGraph's need for testing orchestration logic without live deployment.
- **Implementation Angle:** Adopt OrchBench-style deterministic simulation for FleetGraph's CI/CD pipeline to validate orchestration plans before deployment.

### 12. Workload-Aware Caching for Multi-Agent Systems
- **ID:** 2607.20495
- **URL:** https://arxiv.org/abs/2607.20495
- **Relevance:** Caching strategies for multi-agent workloads — relevant to FleetGraph's performance optimization for repeated sub-tasks.
- **Implementation Angle:** Implement workload-aware caching for frequently-executed FleetGraph subgraphs or common supervisor queries.

---

## Top Picks for FleetGraph Integration

| Priority | Paper | Why |
|----------|-------|-----|
| 1 | Bayesian Partner Modelling (2608.18490) | Supervisor-side belief modeling for subordinates |
| 2 | TH-GNN (2608.20376) | Temporal graph learning on agent interactions |
| 3 | OrchBench (2607.25656) | Deterministic orchestration plan evaluation |
| 4 | Consilience (2608.20564) | Calibrated communication under uncertainty |
| 5 | FL-MAESTRO (2608.20518) | Resource-constrained multi-agent orchestration |

---

*Next tick: monitor for updates on the above papers and adjacent topics.*