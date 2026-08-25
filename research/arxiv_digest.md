# FleetGraph ArXiv Research Digest

**Scout Tick:** 2026-08-24 (EDT)
**Topics:** Multi-agent fleet orchestration, graph-based agent interfaces, directed acyclic supervisor/subordinate communication

---

## 1. Consilience: Conformally Calibrated Communication Control for Hidden-Profile Multi-Agent Reasoning

- **arXiv ID:** 2608.20564
- **URL:** https://arxiv.org/abs/2608.20564
- **Authors:** Abhijith Babu, Ramneet Kaur, Vishal Pramanik, Olivera Kotevska, Nathaniel D. Bastian, Susmit Jha et al.
- **Category:** Artificial Intelligence

**Relevance to FleetGraph:**
Addresses communication control between agents with *hidden profiles* — directly maps to FleetGraph's directed acyclic supervisor/subordinate layers where subordinate nodes may have latent state not fully visible to supervisors. The conformal calibration approach provides statistical guarantees on communication reliability.

**Implementation Angle:**
Adapt the conformal calibration framework to FleetGraph's DAG communication edges — use it to bound message-passing error rates between supervisor→subordinate nodes, ensuring reliable command propagation even when agent internal state is partially unobservable.

---

## 2. FL-MAESTRO: Multi-Agent LLM Orchestration for Resource-Constrained Federated Learning

- **arXiv ID:** 2608.20518
- **URL:** https://arxiv.org/abs/2608.20518
- **Authors:** Jiajun Wu, Zirui Wang, Jiayu Zhou, Qiang Ye, Steve Drew
- **Category:** Artificial Intelligence

**Relevance to FleetGraph:**
Multi-agent LLM orchestration under resource constraints — directly applicable to fleet scenarios where agents compete for limited compute/bandwidth. The federated learning angle mirrors FleetGraph's distributed node topology.

**Implementation Angle:**
Extract the resource-allocation heuristic for agent orchestration under constraints; integrate into FleetGraph's topology manager to dynamically throttle/boost subordinate agent LLM calls based on available fleet budget (token caps, GPU memory, latency SLOs).

---

## 3. Bayesian Partner Modelling enables Adaptive Replanning for LLM Coordination

- **arXiv ID:** 2608.18490
- **URL:** https://arxiv.org/abs/2608.18490
- **Authors:** Harsh Goel, Aditya Sai Ellendula, Vaishnav Tadiparthi, Ehsan Moradi Pari, Hossein Nourkhiz Mahjoub, Sandeep P. Chinchali
- **Category:** Multiagent Systems

**Relevance to FleetGraph:**
Bayesian partner modeling for adaptive replanning — highly relevant to hierarchical coordination where supervisors must model subordinate capabilities and adjust plans when subordinates fail or drift. The "partner model" is analogous to FleetGraph's node capability registry.

**Implementation Angle:**
Implement a lightweight Bayesian belief tracker per supervisor node that maintains a posterior over subordinate reliability; use it to trigger adaptive replanning when a subordinate's observed performance drops below a posterior threshold — replacing static DAG routing with probabilistic, self-correcting dispatch.

---

## 4. TH-GNN: Heterogeneous Temporal Graph Neural Networks for LLM-Agent Shilling Attack Detection

- **arXiv ID:** 2608.20376
- **URL:** https://arxiv.org/abs/2608.20376
- **Authors:** Shivam Swarup, Divya Prakash Shrivastava, Rakesh Thakur
- **Category:** Computation and Language, Machine Learning

**Relevance to FleetGraph:**
Heterogeneous temporal GNNs for agent-graph anomaly detection — relevant to FleetGraph's graph-based agent interfaces where node/edge types are heterogeneous and evolve over time. The attack-detection framing maps to fleet integrity monitoring.

**Implementation Angle:**
Adapt the TH-GNN architecture as a FleetGraph integrity monitor — train on normal DAG communication patterns to detect anomalous agent behavior (compromised nodes, prompt injection cascades, deadlock formation) as a real-time graph anomaly scorer.

---

## Summary

| Paper | FleetGraph Layer | Key Takeaway |
|-------|-----------------|--------------|
| Consiliance (2608.20564) | DAG communication edges | Conformal calibration for hidden-profile agent messaging |
| FL-MAESTRO (2608.20518) | Resource orchestration | Multi-agent LLM dispatch under compute constraints |
| Bayesian Partner Modelling (2608.18490) | Supervisor hierarchy | Adaptive replanning via posterior tracking |
| TH-GNN (2608.20376) | Graph interface / monitoring | Temporal GNN anomaly detection on heterogeneous agent graphs |

---

*Next tick: scout for "directed acyclic graph agents", "agent message passing", "fleet topology optimization"*