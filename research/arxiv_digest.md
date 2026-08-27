# FleetGraph ArXiv Digest

**Scout tick:** 2026-08-27 04:16:30 EDT (-0400)  
**Queries:** `multi-agent orchestration`, `agent communication protocols`, `LLM agent monitoring`  
**Result:** No newly surfaced arXiv IDs since the prior tick; all 9 current results are carried forward below.

---

## Multi-Agent Orchestration

### ProgRouter: Online Progress-Guided Orchestration for Multi-Agent LLM Workflows under Quality-Cost Tradeoffs
- **arXiv ID:** 2608.25992
- **URL:** https://arxiv.org/abs/2608.25992
- **FleetGraph relevance:** Step-wise routing from evolving progress, quality, time, and cost signals directly fits dynamic scheduling across a supervisor/subordinate DAG.
- **Implementation angle:** Add per-node progress deltas and remaining-budget fields, then reweight eligible downstream agents after every completed step rather than routing only once per task.

### JIT-Agent: Scaling Harness Intelligence via Just-in-Time Harness Evolution
- **arXiv ID:** 2608.25593
- **URL:** https://arxiv.org/abs/2608.25593
- **FleetGraph relevance:** Its composable and evolvable memory, planning, action, and tool-orchestration modules map naturally to configurable FleetGraph node harnesses.
- **Implementation angle:** Represent node harnesses as versioned four-module manifests that supervisors can select or repair before dispatch, retaining outcome measurements for later selection.

### A Few Pages of Markdown: Committed AI Configuration and Lower Quality Cost after Coding-Agent Adoption
- **arXiv ID:** 2608.25241
- **URL:** https://arxiv.org/abs/2608.25241
- **FleetGraph relevance:** The reported link between committed agent configuration and lower quality-cost growth supports explicit, repository-tracked graph contracts.
- **Implementation angle:** Store roles, edge contracts, escalation rules, and tool policies in tracked Markdown/YAML and expose a configuration-maturity score in the graph UI.

---

## Agent Communication Protocols

### Test-Time Collaborative Classification over Multi-Agent Networks
- **arXiv ID:** 2608.24787
- **URL:** https://arxiv.org/abs/2608.24787
- **FleetGraph relevance:** Finite-round, finite-precision evidence exchange provides a useful model for constrained communication over directed agent edges.
- **Implementation angle:** Define compact typed evidence messages for subordinate-to-supervisor edges and benchmark accuracy against round, precision, and bandwidth limits.

### Dual-Cache Latent Space Communication between Heterogeneous Language Models
- **arXiv ID:** 2608.20617
- **URL:** https://arxiv.org/abs/2608.20617
- **FleetGraph relevance:** Joint KV-cache transfer suggests a lower-latency communication plane for heterogeneous model fleets than repeated text serialization.
- **Implementation angle:** Prototype a negotiated `latent-cache` edge transport alongside typed text/JSON, preserving text fallback because translators are model-pair dependent.

### Consilience: Conformally Calibrated Communication Control for Hidden-Profile Multi-Agent Reasoning
- **arXiv ID:** 2608.20564
- **URL:** https://arxiv.org/abs/2608.20564
- **FleetGraph relevance:** Adaptive speaker and intervention selection from uncertainty, disagreement, evidence gain, and redundancy closely matches directed supervisor communication control.
- **Implementation angle:** Give supervisor edges the actions `challenge`, `clarify`, `seek_evidence`, and `route`, then gate proposed actions with calibrated acceptance thresholds.

---

## Monitoring, Guardrails, and Trace Structure

### SkillShield: Prompt-Space Security Skills for LLM Coding Agents
- **arXiv ID:** 2608.25817
- **URL:** https://arxiv.org/abs/2608.25817
- **FleetGraph relevance:** Compact failure-derived safety skills can constrain tool-using nodes throughout execution without placing a classifier on every edge.
- **Implementation angle:** Derive role-specific safety clauses from failure traces and inject fixed-budget bundles into node harnesses, reserving runtime guards for privileged actions.

### StepGuard: Learning Step-Level Guardrails with Scalable Supervision and Safety-Utility Balancing
- **arXiv ID:** 2608.24777
- **URL:** https://arxiv.org/abs/2608.24777
- **FleetGraph relevance:** Pre-execution action checks and post-run trajectory audits fit a supervisor layer that intercepts unsafe subordinate operations while measuring utility loss.
- **Implementation angle:** Place guard nodes on privileged-action edges and log blocked steps plus utility impact so thresholds can be tuned from real runs.

### Automata from Agent Traces: Failure and Next-Step Prediction
- **arXiv ID:** 2608.23670
- **URL:** https://arxiv.org/abs/2608.23670
- **FleetGraph relevance:** Trace-derived finite-state machines can turn FleetGraph's visual topology into a model-agnostic predictor of next actions and failures.
- **Implementation angle:** Compile event logs into per-harness FSM overlays, label high-risk states, and escalate when live transitions enter failure-prone or invalid regions.

---

## Scout Assessment

No new IDs this tick. The strongest near-term architecture imports remain: **Consilience** for calibrated communication control, **Automata from Agent Traces** for predictive monitoring overlays, and **ProgRouter** for budget-aware online dispatch.
