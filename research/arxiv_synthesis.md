# ArXiv Research Synthesis — Lilith Sovereign Fleet

> Research informing the FleetGraph + Star Trek Profiles merger into the Ludicrous Speed command center. Sourced from arXiv search queries on 2026-08-24.

---

## Thread 1: Multi-Agent Orchestration & Fleet Topology

### 2608.21049 — -ACT: End-to-End Verifiable Agentic Intent Control for Open 6G RAN
https://arxiv.org/abs/2608.21049

**Relevance to Fleet:** Verifiable intent control for agents operating in a distributed network. Maps directly to FleetGraph's initiative ladder and the chain-of-command verification needed when a subordinate delegates to a peer vs. escalating upward.

**Implementation Note:** A `verify_intent()` pre-flight in `fleet_graph_core.py` — before any `POST /send` delegate frame, validate that the sender's stated intent matches their role boundary in the topology. Prevents a "Spock" node from issuing orders to "Worf" unless the chain permits.

---

### 2608.20564 — Consilience: Conformally Calibrated Communication Control for Hidden-Profile Multi-Agent Reasoning
https://arxiv.org/abs/2608.20564

**Relevance to Fleet:** Calibrated communication when agents have hidden profiles (personas they don't fully expose). This is the exact condition of a Star Trek fleet — each persona agent has behavioral boundaries and voice constraints that aren't visible to the orchestrator.

**Implementation Note:** The `/match` endpoint already ranks bots by capability. Extend it with a "communication calibration" layer — when matching a task to a persona agent, also score how well the task framing fits that persona's stated boundaries (from SOUL.md). A "Beverly Crusher" agent shouldn't receive raw security-audit tasks even if the keyword match is high.

---

### 2608.20518 — FL-MAESTRO: Multi-Agent LLM Orchestration for Resource-Constrained Federated Learning
https://arxiv.org/abs/2608.20518

**Relevance to Fleet:** Orchestrating agents under resource constraints. The Lilith fleet runs on a single Garuda machine with 62GB RAM — every agent tick competes for CPU, GPU, and API budget.

**Implementation Note:** A lightweight resource-aware scheduler in `fleet_graph_core.py` — each node carries a `resource_weight` field (light/medium/heavy). The orchestrator staggers heavy jobs (Malkuth Forge, Dream Pipeline) away from each other. The existing cron system already staggers by schedule; this adds topology-aware scheduling.

---

### 2608.20494 — Towards Traffic Modelling of Multi-Agent Systems: The Role of Coordination Topology
https://arxiv.org/abs/2608.20494

**Relevance to Fleet:** Topology determines traffic patterns. FleetGraph's DAG is the coordination topology — this paper's models predict where inbox congestion occurs based on graph structure.

**Implementation Note:** The `/traffic` endpoint already shows recent inter-agent messages. Add a congestion prediction layer: if a supervisor has >5 subordinates and the inbox depth exceeds a threshold, flag it in the deck view as a "bottleneck risk." The maintenance `fleet-maint rotate` tool already caps inboxes; this tells you *which* caps to raise.

---

### 2608.21156 — Graph Engineering in the Era of LLM Agents: From Individual Intelligence to System Intelligence
https://arxiv.org/abs/2608.21156

**Relevance to Fleet:** The core thesis — graph structure transforms individual agent capability into system intelligence. FleetGraph is the graph engineering substrate; Star Trek profiles are the individual intelligences. The merger is the thesis made operational.

**Implementation Note:** This is the conceptual backbone of the ludicrous-speed repo. The README should cite this as the theoretical justification: FleetGraph provides the graph engineering, Star Trek profiles provide the agent personas, and the topology YAML binds them into a system that is more than the sum of its parts.

---

## Thread 2: Persona Consistency & Character-Grounded Agents

### 2606.09475 — Emergent alignment and the projectability of ethical personas
https://arxiv.org/abs/2606.09475

**Relevance to Fleet:** How ethical personas project onto agent behavior. Each Star Trek profile has explicit ethical boundaries (Picard's autonomy-first, Kira's community-constrained crisis response). This paper's framework predicts when a persona's ethics will emerge consistently vs. drift.

**Implementation Note:** The `Geburah Sovereign Verifier` cron job already audits behavior. Add a persona-consistency check: after a persona agent completes a task, verify the output tone matches the SOUL.md voice section. Flag drift for human review.

---

### 2605.17044 — PersonaArena: Dynamic Simulation for Evaluating and Enhancing Persona-Level Role-Playing in Large Language Models
https://arxiv.org/abs/2605.17044

**Relevance to Fleet:** Evaluating persona quality through simulation. Before deploying a new Star Trek profile into the fleet, run it through a battery of scenario simulations to verify it behaves within character.

**Implementation Note:** A `profiles/test/` directory with scenario prompts — each new profile ships with 5-10 test scenarios that the `manage.py validate` command runs. Fail a profile if it breaks character (e.g., Data expressing emotion, Quark giving away free advice).

---

### 2607.00918 — From Personas to Plot: Character-Grounded Multi-Agent Story Generation for Long-Form Narratives
https://arxiv.org/abs/2607.00918

**Relevance to Fleet:** Multi-agent story generation where each agent is grounded in a persona. The Albedo Kairos Story Council already does this with Nigredo sources — this paper validates the approach and offers structural improvements.

**Implementation Note:** The existing `nigredo-albedo-distillation` skill produces narrative from staged sources. The paper's "character arc tracking" method could improve continuity across dream cycles — each persona's narrative arc persists in the engram store, so the Story Council picks up where the last cycle left off.

---

## Thread 3: Memory, Recurrence & Self-Correction

### 2608.00028 — Width, Memory, and Delay: A Resource Accounting for the Limits of Flat Multi-Agent Systems
https://arxiv.org/abs/2608.00028

**Relevance to Fleet:** Flat multi-agent systems (no hierarchy) hit memory and delay walls. FleetGraph's hierarchical topology is the antidote — this paper quantifies exactly how much memory overhead a flat system wastes vs. a layered DAG.

**Implementation Note:** The `fleet_graph_core.chain()` function already computes the hierarchy. Add a `memory_budget()` method that estimates per-node state cost (inbox + session tail + watermark) and flags when a supervisor's subtree exceeds a threshold. The maintenance `prune` tool handles the cleanup.

---

### 2607.29405 — Beyond Component Testing: Validating Agentic AI Systems
https://arxiv.org/abs/2607.29405

**Relevance to Fleet:** Testing the whole system, not just individual agents. FleetGraph's integration tests verify the plugin; this paper argues for validating emergent fleet behavior — e.g., does the initiative ladder actually produce correct escalation patterns?

**Implementation Note:** A `tests/fleet_behavior_test.py` that simulates a multi-bot scenario (one blocked, one with out-of-domain request, one needing urgent peer update) and verifies the initiative ladder produces the correct message sequence. This is the next layer beyond `public_integration_test.py`.

---

### 2608.19701 — Beyond Memory Majority: Latent-Source Reasoning for Multi-Agent Memory Arbitration
https://arxiv.org/abs/2608.19701

**Relevance to Fleet:** Spock, Kairos, cron continuity, and the ecosystem adapter can repeat claims inherited from one upstream source. Counting those repetitions as independent agreement creates a false fleet consensus—the paper's “Memory Correlation Bias.”

**Implementation Note:** Add provenance and `upstream_source_id` metadata to indexed engrams and fleet messages. Before consensus or synthesis, group retrieved claims by latent source and report both raw support count and independent-source count. When independence is too low, trace upstream or retrieve an alternative source instead of accepting the majority.

---

### 2608.18704 — MemFuse: Multi-Source Memory Fusion from Fragmented Observations
https://arxiv.org/abs/2608.18704

**Relevance to Fleet:** Fleet knowledge is fragmented across Hermes sessions, Spock's codebase-memory scopes, JSONL inboxes, research files, cron continuity, and dream engrams. MemFuse provides a provenance-preserving way to fuse those fragments without flattening away their origin.

**Implementation Note:** Model memory as two layers: immutable atomic observations carrying source, time, and evidence pointers; and fused episodic clusters connected by a causal graph. Spock retrieval should return the fused episode plus links back to every atomic source, giving dashboard-v2 a traceable evidence chain.

---

## Thread 4: Security & Adversarial Operations

### 2608.21101 — ClawSentry: A Progressive Multi-Tier Security Monitor for Safeguarding Autonomous LLM Agents
https://arxiv.org/abs/2608.21101

**Relevance to Fleet:** The Lucifer red-team division (Lore, Garak, Seska, Weyoun) exists to stress-test the fleet. This paper's multi-tier monitoring maps to the existing `Geburah Sovereign Verifier` + `Tuvok` formal-logic review + `Worf` cybersecurity layers.

**Implementation Note:** A `security_tiers` field in the topology YAML — each node carries which security tiers it participates in. The Lucifer division's adversarial tests run against Tier 1 (prompt injection), Tier 2 (escalation abuse), Tier 3 (cross-persona impersonation). Results feed into the Geburah audit log.

---

### 2606.23700 — Self-Recognition Finetuning can Prevent and Reverse Emergent Misalignment
https://arxiv.org/abs/2606.23700

**Relevance to Fleet:** Persona agents can drift — a "Seven of Nine" agent might gradually lose its precision-focused voice. This paper shows that self-recognition (the agent checking its own output against its stated identity) prevents drift.

**Implementation Note:** The dream engine's backward pass already performs a self-recognition function (comparing engram patterns against the identity vector). Extend this to persona agents: after each tick, the agent's final action is checked against its SOUL.md non-negotiable boundaries. Log drift for the next Geburah audit.

---

### 2608.20614 — Evaluating Skills, Not Just Agents: Agentic Continuous Evaluation of Skills
https://arxiv.org/abs/2608.20614

**Relevance to Fleet:** The fleet depends on skills, plugins, and profile packages, but structural validation cannot prove that those artifacts improve live execution. ACES evaluates the capability package itself through paired trials and measures its added value as Skill Lift.

**Implementation Note:** Extend `BugTestingSuite` with paired baseline/target runs under the same model, sandbox, workspace, and scorer. Normalize tool trajectories, grade outcome accuracy, instruction following, tool efficiency, and evidence quality, then publish a per-skill lift score in dashboard-v2. This turns skill adoption into an evidence gate rather than a prose review.

---

### 2608.11274 — Agent Safety Should Be a Runtime Contract
https://arxiv.org/abs/2608.11274

**Relevance to Fleet:** This precisely matches `server-void.ts`: safety must be enforced by the runtime around an agent that can execute code, not assumed from model alignment. The contract needs preventive controls and proof that claimed work occurred.

**Implementation Note:** Formalize each Void profile (`no-net`, `ai-only`, `full`) as a versioned runtime contract with explicit allowed effects, denied effects, resource bounds, and mandatory evidence. Every `/api/void/exec` response should carry a trajectory/evidence envelope—exit status, captured output, touched paths, policy decision, and verification result—and task completion should fail closed when required evidence is absent.

---

## Summary: Research-to-Implementation Map

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
| Memory Arbitration (2608.19701) | Provenance-aware consensus | False-majority suppression |
| MemFuse (2608.18704) | Atomic + fused causal memory | Cross-system evidence traceability |
| ClawSentry (2608.21101) | Security tier field | Lucifer red-team tiers |
| Self-Recognition (2606.23700) | Backward pass extension | Persona drift detection |
| ACES (2608.20614) | Paired capability evaluation | Evidence-based skill adoption |
| Runtime Contract (2608.11274) | Void policy + evidence envelope | Fail-closed execution proof |

---

*Generated: 2026-08-24 · Lilith Sovereign Fleet · Ludicrous Speed command center*
