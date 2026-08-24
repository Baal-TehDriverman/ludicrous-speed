# FleetGraph arXiv Digest

Tick: 2026-08-24 (cron scout)

## Highlights (new this tick)

### Consilience: Conformally Calibrated Communication Control for Hidden-Profile Multi-Agent Reasoning
- **ID:** 2608.20564 — https://arxiv.org/abs/2608.20564
- **Relevance:** Directly addresses when agents should communicate in multi-agent reasoning — the same edge-pruning question FleetGraph's supervisor/subordinate DAG poses.
- **Implementation angle:** Borrow its conformal calibration as a confidence gate on DAG edges: only route a message subordinate→supervisor when calibrated confidence clears a threshold.

### Dual-Cache Latent Space Communication between Heterogeneous Language Models
- **ID:** 2608.20617 — https://arxiv.org/abs/2608.20617
- **Relevance:** Shows heterogeneous models exchanging compressed latent state rather than verbose text — relevant to compact inter-agent payloads on graph edges.
- **Implementation angle:** Prototype a "latent edge" message type in FleetGraph where heavy sub-agents pass cached embeddings/summaries instead of full transcripts to their supervisor.

### FL-MAESTRO: Multi-Agent LLM Orchestration for Resource-Constrained Federated Learning
- **ID:** 2608.20518 — https://arxiv.org/abs/2608.20518
- **Relevance:** Orchestrating LLM agents under tight resource budgets maps onto fleet scheduling when local models (Ollama tier) are capacity-constrained.
- **Implementation angle:** Add resource-awareness to the scheduler node: weight DAG dispatch by per-model memory/throughput budget, not just task priority.

### Bayesian Partner Modelling enables Adaptive Replanning for LLM Coordination
- **ID:** 2608.18490 — https://arxiv.org/abs/2608.18490
- **Relevance:** Agents modeling partners' states to replan adaptively — analogous to supervisors maintaining live belief about subordinate progress and re-routing on failure.
- **Implementation angle:** Give each supervisor a lightweight partner model per subordinate (last status, reliability score) used to re-plan the DAG when a branch stalls.

## Low-relevance hits (noted, not pursued)
- Edge-Based Agentic RAG for Bridge Inspection (2608.20372) — domain-specific RAG, no graph/orchestration novelty for us.
- High-Altitude Platforms Survey (2608.18587) — comms infrastructure survey, out of scope.
- Deep Academic Survey Automation (2608.18034) — pipeline automation, marginal.
- Ansari Islamic AI Assistant (2608.20390) — deployment writeup, not orchestration research.

---
*Queries run: "multi-agent orchestration", "hierarchical agents coordination", "agent communication protocols" (newest-first, max 3 each).*
