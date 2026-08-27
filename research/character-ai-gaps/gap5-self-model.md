## Sweep 2026-08-25 17:25

### arXiv:2607.12254 — Self-Aware Recursively Self-Improving Agents for Personal Singularity
URL: https://arxiv.org/abs/2607.12254
Authors: Chengshuai Yang
Categories: Computer Vision and Pattern Recognition

**Claim:** Proposes SARSI agents that maintain a persistent self-model of identity, goals, capabilities, limitations, uncertainty, relationships, history, and developmental change, and use that model to guide and evaluate recursive improvement. Self-awareness is defined functionally (no claim of phenomenal consciousness). The architecture combines a planner-executor-verifier loop, an evidence-gated improvement loop, decentralized lineages, and a Personal Singularity OS. Explicitly a position and systems-design paper, not evidence that unrestricted recursive self-improvement has been achieved.
**Closes gap:** partially — the self-model is comprehensive and the paper grounds functional self-awareness in concrete modules, but it is a design framework, not a shipped open module class.
**Implementation note:** The self-model schema (identity, goals, capabilities, limitations, uncertainty, relationships, history, developmental change) could be extracted as a typed interface in a pattern-B stack, and the evidence-gated improvement loop with owner-controlled autonomy provides a governance pattern. But the paper offers no reference implementation, no training data, and no benchmark — a builder would be starting from the schema alone.

---

### arXiv:2512.18202 — Sophia: A Persistent Agent Framework of Artificial Life
URL: https://arxiv.org/abs/2512.18202
Authors: Mingyang Sun, Feng Hong, Weinan Zhang
Categories: Artificial Intelligence

**Claim:** Introduces System 3, a persistent meta-layer that maintains narrative identity and long-horizon adaptation. Sophia grafts a continuous self-improvement loop onto any LLM-centric stack via process-supervised thought search, narrative memory, user and self modeling, and a hybrid reward system. Quantitatively, the prototype achieves 80% reduction in reasoning steps for recurring operations and a 40% gain in success for high-complexity tasks via meta-cognitive persistence. Qualitatively, System 3 exhibited coherent narrative identity and task organization. Primarily conceptual with a compact engineering prototype.
**Closes gap:** partially — this is the closest thing to a shipped durable self-model in the literature, but it is a prototype, not a reusable open module class, and the self-model is tightly coupled to Sophia's own reward and memory systems.
**Implementation note:** The narrative memory + user/self modeling + hybrid reward loop is the most actionable recipe available for a pattern-B character engine. A builder could port the System 3 interface as a self-model module, but the paper does not publish the prototype code or the reward model, so integration requires re-implementation.

---

### arXiv:2510.24831 — The Narrative Continuity Test: A Conceptual Framework for Evaluating Identity Persistence in AI Systems
URL: https://arxiv.org/abs/2510.24831
Authors: Stefano Natangelo
Categories: Computers and Society, Artificial Intelligence

**Claim:** Introduces NCT, a conceptual framework for evaluating whether an LLM remains the same interlocutor across time and interaction gaps. Defines five necessary axes: Situated Memory, Goal Persistence, Autonomous Self-Correction, Stylistic & Semantic Stability, and Persona/Role Continuity. Demonstrates that current architectures systematically fail to support them via case analyses (Character.AI, Grok, Replit, Air Canada).
**Closes gap:** addresses adjacent problem — defines what a durable self-model would need to satisfy, but provides no implementation, no module, no training procedure.
**Implementation note:** The five NCT axes are the closest thing to a specification for a durable self-model module. A builder could use them as acceptance criteria for a self-model interface in a pattern-B stack (e.g., persona/role continuity maps directly to character-consistency requirements). But the paper stops at evaluation — the engineering is left entirely to the reader.

---

### arXiv:2604.04660 — Springdrift: An Auditable Persistent Runtime for LLM Agents with Case-Based Memory, Normative Safety, and Ambient Self-Perception
URL: https://arxiv.org/abs/2604.04660
Authors: Seamus Brady
Categories: Artificial Intelligence

**Claim:** Presents Springdrift, a persistent runtime for long-lived LLM agents integrating append-only memory, git-backed recovery, case-based reasoning memory, deterministic normative calculus for safety gating, and continuous ambient self-perception via a structured self-state representation (the sensorium) injected each cycle without tool calls. Reports a 23-day single-instance deployment during which the agent diagnosed its own infrastructure bugs, classified failure modes, maintained context across email and web channels without explicit instruction. Coins the term "Artificial Retainer" for persistent-memory, domain-specific-autonomy, forensically-accountable systems.
**Closes gap:** partially — the sensorium is the closest concrete implementation of a durable self-model in the literature, but the paper is a single-instance technical report, not a reusable module class, and the self-perception is ambient rather than introspective.
**Implementation note:** The sensorium pattern (structured self-state injected every cycle without tool calls) is directly usable as a self-model module in a pattern-B stack, and the append-only memory + git-backed recovery provides the durability guarantees. However, the paper is a case study with a single operator; no code or schema is published, so a builder would need to design the self-state representation from scratch.

---

### arXiv:2605.24299 — LLMs Show No Signs Of Individuated Metacognition
URL: https://arxiv.org/abs/2605.24299
Authors: M. Moran, Mark Whiting
Categories: Machine Learning

**Claim:** Decomposes binary confidence judgements from 20 frontier LLMs across six benchmarks using tetrachoric factor analysis paired with pairwise calibration. Finds that cross-model confidence matrices are approximately rank-one, models differ mainly in decision thresholds along a shared item-level difficulty axis, and once items all models agree on are removed, the confidence-performance relationship collapses. Concludes there is no evidence for significant verbalised individuated metacognition in any tested domain.
**Closes gap:** no — this is a metacognition paper, not a selfhood paper, and its findings undermine the premise that confidence-based self-models are viable. It addresses the gap only negatively: it shows that what looks like metacognition is not self-knowledge.
**Implementation note:** For a pattern-B stack, this paper is a warning: do not build the self-model layer on top of confidence calibration or self-reported uncertainty. A durable self-model must be structural (state representation, memory, identity continuity) rather than inferential (confidence estimation). The paper provides no positive module, only a constraint on what will not work.

---

### arXiv:2605.09844 — The Metacognitive Probe: Five Behavioural Calibration Diagnostics for LLMs
URL: https://arxiv.org/abs/2605.09844
Authors: Rafael C. T. Oliveira
Categories: Artificial Intelligence, Computation and Language

**Claim:** An exploratory five-task, 15-slot diagnostic that decomposes an LLM's confidence behaviour into five dimensions: confidence calibration, epistemic vigilance, knowledge boundary, calibration range, and reasoning-chain validation. Evaluated on N=8 frontier models and N=69 humans. Reports a 47-point within-model dissociation in Gemini 2.5 Flash between panel-best calibration and panel-worst cross-task difficulty prediction.
**Closes gap:** no — this is a metacognition assessment tool, not a self-model. It measures confidence-correctness alignment, not identity, continuity, or self-representation.
**Implementation note:** The five dimensions could be repurposed as runtime diagnostics for a self-model module (e.g., knowledge boundary detection is useful for a fail-closed policy), but the paper provides no module, no schema, no persistence mechanism. It is an evaluation instrument, not a component.

---

### arXiv:2604.24512 — Beyond the Attention Stability Boundary: Agentic Self-Synthesizing Reasoning Protocols
URL: https://arxiv.org/abs/2604.24512
Authors: Dahlia Shehata, Ming Li
Categories: Artificial Intelligence

**Claim:** Formalizes the Attention Latch failure mode in decoder-only Transformers (cumulative probabilistic weight of historical context overrides mid-task updates) and proposes SSRP, a metacognitive framework that separates high-level architectural planning (Architect) from turn-by-turn procedural execution (Executive). Evaluated across 9K trajectories on MultiWOZ 2.2 with the Aggregate Pivot Accuracy metric. Reports a 715X resilience lift for SSRP over stateless Vanilla ReAct baselines.
**Closes gap:** no — this is a metacognitive framework for attentional stability, not a durable self-model. The Architect/Executive separation improves robustness but does not maintain identity, memory, or self-representation across sessions.
**Implementation note:** The SSRP pattern could be used to stabilize the reasoning layer of a pattern-B stack, but it does not provide the self-model. The Attention Latch finding is a useful constraint: a durable self-model must be stored outside the attention window (e.g., in structured memory injected each cycle), not reconstructed from context.

---

### arXiv:2608.23493 — SRPO: Self-Reflective Policy Optimization for Long-Horizon Reasoning
URL: https://arxiv.org/abs/2608.23493
Authors: Jialong Liu, Yuling Shi, Ning Yang, Xiaodong Gu, Zuchao Li
Categories: Artificial Intelligence

**Claim:** Proposes Self-Reflective Policy Optimization (SRPO), enabling LLMs to analyze their own completed trajectories, synthesize errors into concise "reflection patches," and use reflection-conditioned teacher scores on student on-policy rollouts as dense token-level training signals. Achieves state-of-the-art performance on mathematical reasoning and agentic benchmarks with exceptional data efficiency (8% of training FLOPs required by scaled SFT).
**Closes gap:** no — this is a self-reflective training method, not a durable self-model. Reflection patches are ephemeral and task-specific, not a persistent identity or self-representation.
**Implementation note:** SRPO demonstrates that self-reflection can be internalized as a training signal, which is useful for training the reasoning layer of a pattern-B stack, but it does not produce a self-model that persists across sessions or maintains identity continuity. The reflection mechanism is orthogonal to the gap.

---

### arXiv:2606.27472 — Supersede: Diagnosing and Training the Memory-Update Gap in LLM Agents
URL: https://arxiv.org/abs/2606.27472
Authors: Vedant Patel
Categories: Computation and Language, Artificial Intelligence

**Claim:** Isolates the ability to use the current value of a fact and discard superseded values on real conversational data. Shows that replacing full context with a bounded, self-maintained memory drops accuracy from 92% to 77% on a frontier model, and the gap scales with conversation length, not compression ratio. Releases Supersede, an RL environment rewarding agents for answering from the current value and penalizing stale ones. GRPO fine-tuning Qwen2.5-3B nearly doubles held-out supersession accuracy (9.0% to 16.7%).
**Closes gap:** addresses adjacent problem — memory maintenance for temporal fact-currency is a prerequisite for a durable self-model, but the paper models fact supersession, not self-representation or identity.
**Implementation note:** The Supersede reward signal could be adopted as one component of a durable self-model (the self-model must track its own revision history and prefer current self-representations over stale ones), but the paper provides no self-model schema, only a training environment for fact-currency. A builder would need to wrap it in a larger self-model framework.

---

### arXiv:2608.12428 — MindMemOS: A Portable and Self-Evolving Memory Operating Layer for AI Agents
URL: https://arxiv.org/abs/2608.12428
Authors: Kaichao Liang, Yuqi Cui, Hao Kong, Xinyuan Huang, Guohaotian Hou, Qingcan Kang +10 more
Categories: Artificial Intelligence, Information Retrieval

**Claim:** Presents MindMemOS, a portable and self-evolving memory organizing open-world information using a unified entity property timestructure. Supports scenario-adaptive memory modeling, higher-order pattern discovery, autonomous memory refinement, and continuous skill evolution. Achieves 94.03% on LOCOMO and 70.63% on PersonaMem.
**Closes gap:** addresses adjacent problem — self-evolving memory is a prerequisite for a durable self-model, but MindMemOS models external-world entities and skills, not the agent's own identity, continuity, or self-perception.
**Implementation note:** The MindMemOS layer could serve as the persistence substrate for a durable self-model (e.g., the self-model's identity representation and revision history could be stored in the entity property timestructure), but the paper does not model the self. A builder would need to add a self-model schema on top of the memory operating layer.

---

## Sweep 2026-08-25 20:37

### arXiv:2608.15400 — Implementation of a Metacognition Framework for Self-Awareness and Self-Regulation in Ensembles of LLMs
URL: https://arxiv.org/abs/2608.15400
Authors: Charles Courchaine, Ricky J. Sethi, Hefei Qiu
Categories: Artificial Intelligence, Multiagent Systems

**Claim:** Presents a metacognitive framework for LLM ensembles computing a Metacognitive State Vector (MSV) across five dimensions (Emotional Response, Correctness Evaluation, Experiential Match, Conflicting Information, Problem Importance). MSV values regulate switching between System 1 (fast) and System 2 (deliberative) processing and assign specialized ensemble roles based on metacognitive states. Implemented as a proof-of-concept demo with radar chart visualization.
**Closes gap:** no — this is a metacognition framework (confidence estimation, self-monitoring, uncertainty quantification), not a durable self-model. The MSV is a snapshot of processing dynamics, not a persistent identity representation that survives across sessions or maintains continuity of selfhood.
**Implementation note:** The five MSV dimensions could be repurposed as runtime diagnostics for a self-model module (e.g., correctness evaluation and conflicting information detection support fail-closed policy), but the paper provides no self-schema, no identity persistence, no revision history. It is an ensemble routing mechanism, not a self-model component.

---

### arXiv:2605.08942 — Decomposing and Steering Functional Metacognition in Large Language Models
URL: https://arxiv.org/abs/2605.08942
Authors: Yanshi Li, Xueru Bai, Shuman Liu, Haibo Zhang, Anxiang Zeng
Categories: Computation and Language

**Claim:** Proposes that LLMs maintain a decomposable space of functional metacognitive states (evaluation awareness, self-assessed capability, perceived risk, effort allocation, audience expertise adaptation, intentionality) linearly decodable from internal activations. Demonstrates causal modulation of reasoning behavior via activation steering along probe-derived directions.
**Closes gap:** no — this is a metacognition paper. It identifies internal variables that encode self-assessed capability and evaluation awareness, but these are transient processing states, not a durable self-model with identity, continuity, or revision under fail-closed policy. The functional metacognitive states are context-dependent and do not constitute selfhood.
**Implementation note:** The finding that metacognitive states are causally manipulable is useful for a pattern-B stack's safety layer (steering away from overconfidence), but the paper provides no module for identity persistence or self-representation. It is an analysis and steering technique, not a self-model architecture.

---

### arXiv:2608.09044 — Tree-of-Experience: Hierarchical Experience Management for Self-Evolving Agents
URL: https://arxiv.org/abs/2608.09044
Authors: Zihao Deng, Yining Zhu, Leiming Wang, Junbo Wang, Jingfei Lu
Categories: Computation and Language

**Claim:** Proposes ToE, organizing experience into a shared tree of analytical perspectives and reasoning paths with reliability calibrated through environmental outcomes. Achieves 31.4% relative improvement on Game of 24 over experience-free Tree-of-Thought and 41.24% tsIC improvement on FinEvolveBench.
**Closes gap:** addresses adjacent problem — experience management and self-evolution for task performance, but ToE organizes reasoning perspectives and solution paths, not the agent's own identity, continuity, or self-perception. It is an experience substrate, not a self-model.
**Implementation note:** The ToE tree structure could serve as a persistence substrate for a durable self-model (e.g., storing identity revisions and self-perception updates as experience nodes), but the paper does not model the self. A builder would need to extend the tree topology to represent the agent's own state, not just reasoning paths.

---

### arXiv:2608.14621 — AutoMem: A Text-Gradient Recursive Self-Improvement Framework for Automated Memory Architectures Search
URL: https://arxiv.org/abs/2608.14621
Authors: Lin Du, Jie Zhou, Yuxuan Cai, Kai Chen, Qin Chen, Xin Li, Bo Zhang, Wei Li, Liang He
Categories: Computation and Language, Artificial Intelligence

**Claim:** Constructs a discrete search space of memory architectures (5 encoders × 5 stores × 6 retrievers × 4 managers) and proposes AutoMem, using Experience-Guided Architecture Search and Failure-Guided Module Diagnosis to discover task-adaptive memory configurations. Improves accuracy by 2.8 points on average across six benchmark-backbone settings and reduces token cost by 14.3%.
**Closes gap:** addresses adjacent problem — memory architecture search is a prerequisite for durable self-model persistence, but AutoMem optimizes for task-specific fact storage and retrieval, not for modeling the agent's own identity, continuity, or self-representation.
**Implementation note:** A durable self-model requires a memory architecture optimized for identity persistence and revision history, not task facts. AutoMem's search methodology could be repurposed to search for self-model-specific memory architectures, but the paper provides no self-model schema or evaluation criteria for identity continuity.

---

### arXiv:2608.04347 — Looking in the Mirror: Introspecting Side-Effect Misalignments Induced by Fine-Tuning
URL: https://arxiv.org/abs/2608.04347
Authors: Kotaro Yoshida, Laura Gomezjurado Gonzalez, Yukinori Yamamoto, Yuji Naraki, Ryotaro Shimizu, Wenya Wang
Categories: Machine Learning

**Claim:** Formulates side-effect introspection (detecting unintended alignment degradation from fine-tuning) and proposes Delta-Aware Introspection Adapter (DAIA) that processes both base-model activations and activation differences. Demonstrates generalization to unseen fine-tuned models and safety categories.
**Closes gap:** no — this is an introspection method for detecting behavioral changes, not a durable self-model. Introspection here means observing the effects of fine-tuning on alignment, not maintaining a persistent self-representation or identity. The adapter detects side-effects; it does not maintain a self-model across sessions.
**Implementation note:** DAIA could be used as a safety monitor for a self-model module (detecting when fine-tuning has shifted the agent's alignment properties), but it provides no self-schema, no identity persistence, no fail-closed revision policy. It is a diagnostic tool, not a self-model component.

---

### arXiv:2607.08252 — AutoPersonas: A Multi-Timescale Loop Engine for Open-Ended Persona Evolution
URL: https://arxiv.org/abs/2607.08252
Authors: Mengchen Li
Categories: Artificial Intelligence, Computation and Language

**Claim:** Identifies self-locking as a runtime failure mode in persona agents (convergence toward repetitive behavior, stale life stages) and proposes AutoPersonas, an OSO loop separating Occurrences, Observations, and persona State. Uses evidence-governed absorption to preserve identity continuity while allowing adaptation. In a 40-day stress test, context-slice masking plus divergence targeting reduced macro-theme repetition from 61.8% to 36.3%.
**Closes gap:** partially — this is the closest thing in the literature to a persona-level durable self-model with explicit continuity preservation. The persona State acts as a self-representation that persists and evolves, and the OSO loop enforces evidence-governed revision. However, AutoPersonas is a persona-evolution engine, not a reusable open self-module class; the identity is fictional rather than agent-self-directed.
**Implementation note:** The OSO loop (Occurrences → Observations → State with evidence-governed absorption) is the most directly usable pattern for a self-model module in a pattern-B stack. The persona State schema could be repurposed as a self-model interface, and the anti-self-locking mechanisms (context-slice masking, divergence targeting) address the critical problem of a self-model becoming stale or repetitive. But the paper is a single-system demonstration, not a reusable module, and the self-model is persona-facing (character identity) rather than agent-self-facing (the system modeling its own capabilities and continuity).

---

### arXiv:2608.00478 — Ekova: A Personality-Support Agent for Self-Discovery Dialogue
URL: https://arxiv.org/abs/2608.00478
Authors: Yuyan Chen
Categories: Artificial Intelligence, Human-Computer Interaction

**Claim:** Presents Ekova, a persistent personality-support agent with unified cross-session memory, adaptive routing, and user-customized persona selection. Trained with OrthoTune (style-specific adapters + style-consistency regularizer) on 8,590 samples. Outperforms baselines by 16.3% average relative gain.
**Closes gap:** addresses adjacent problem — Ekova maintains cross-session memory and persona consistency, which are prerequisites for a durable self-model. However, Ekova models the user's personality and adapts to it; it does not maintain a self-model of its own identity, capabilities, or continuity. The self here is the user's, not the agent's.
**Implementation note:** The cross-session memory layer and style-consistency regularizer could be repurposed as components of a self-model module (the agent's own identity could be stored in the same memory architecture), but the paper provides no schema for agent-self representation. It is a user-modeling system, not a self-model.

---

### arXiv:2608.04095 — FinPerMA: A Theory-Informed, Event-Grounded Personalized-Memory Benchmark for LLM Agents
URL: https://arxiv.org/abs/2608.04095
Authors: Ben Wang, Kang Zhou, Lifan Guo, Feng Chen, Chi Zhang
Categories: Artificial Intelligence, Computation and Language

**Claim:** Introduces FinPerMA, a benchmark evaluating personalized memory against frozen longitudinal investor trajectories with 2,994 questions from 276 personas. No full-context LLM configuration exceeds 0.47 overall accuracy. Post-Shock checkpoints test whether material events are integrated into persistent user models. Summary-based memory preserves facts but loses preference signals.
**Closes gap:** addresses adjacent problem — evaluates whether agents maintain persistent user models (a form of other-model, not self-model). The finding that summary memory loses preference signals is relevant to self-model design, but the benchmark models the user, not the agent itself.
**Implementation note:** FinPerMA's Post-Shock checkpoint methodology could be adapted to test whether a self-model has integrated revision events (e.g., capability changes, alignment shifts). But the paper provides no self-model schema; it is an evaluation benchmark for user modeling, not a self-model component.

---

### arXiv:2608.22702 — AffAdapt: AFFect-driven ADAPTive AI Personas for Seamless Conversations
URL: https://arxiv.org/abs/2608.22702
Authors: Nishanth Chidambaram, Kaustubh Paliwal, Kayla Hom, Shaoze Zhou, Chen Chen, Manas Satish Bedmutha, Nadir Weibel
Categories: Human-Computer Interaction

**Claim:** Presents AffAdapt, a framework coordinating streaming speech recognition, proactive turn-management, persona-grounded response generation, persistent emotional state, and synchronized embodied output in a single interaction loop. Demonstrates fluid turn management and persona-consistent behavior in a case study.
**Closes gap:** addresses adjacent problem — the persistent emotional state is a minimal self-model component, but it models affective state only, not identity, continuity, capabilities, or revision history. The persona-consistent behavior is externally-facing character consistency, not agent-self-directed self-modeling.
**Implementation note:** The persistent emotional state module could be incorporated as one dimension of a self-model schema (affective self-state), but the paper provides no self-representation beyond emotion. A builder would need to extend it with identity, continuity, and capability dimensions.

---

### arXiv:2606.19144 — Human-AI Coevolution Dynamics: A Formal Theory of Social Intelligence Emergence Through Long-Term Interaction
URL: https://arxiv.org/abs/2606.19144
Authors: Jingyi Zhou, Senlin Luo, Haofen Chen
Categories: Artificial Intelligence, Computation and Language

**Claim:** Proposes HACD-H, a formal model integrating emotional adaptation, relational organization, social memory, and personality consistency into a unified dynamical framework. Evaluated on ~14,700 interaction turns. Social intelligence negatively correlates with social cognitive energy (r = -0.391, p < 0.001).
**Closes gap:** addresses adjacent problem — personality consistency is a component of self-modeling, but HACD-H models the emergence of social intelligence in human-AI dyads, not the maintenance of a durable agent self-model. The personality consistency is relational, not introspective.
**Implementation note:** HACD-H's formalization of personality consistency and multi-timescale social cognition could inform a self-model's continuity guarantees, but the paper provides no module, no schema, no implementation. It is a theoretical framework for social dynamics, not a self-model architecture.

---

## Sweep 2026-08-26 21:48

### arXiv:2608.19621 — Mitigating Identity Essentialism in LLM Agents with Longitudinal Life Trajectories
URL: https://arxiv.org/abs/2608.19621
Authors: Hexi Wang, Yujia Zhou, Bangde Du, Weihang Su, Xinyuan Cao, Qingyi Pan +4 more
Categories: Computation and Language

**Claim:** Proposes LifeMem, a longitudinal memory framework combining structured life-event retrieval with agent-specific parametric memory. Aims to reduce identity essentialism (treating group averages as individual traits) in social simulation agents. Evaluated on Add Health and Understanding Society datasets with three LLMs, showing improved alignment with human response distributions and within-person change patterns.
**Closes gap:** addresses adjacent problem — LifeMem models individual agents with evolving traits, which is closer to a self-model than static profiles, but the self here is a simulated human's identity for social simulation, not the agent system's own self-representation or continuity.
**Implementation note:** The longitudinal memory architecture (life-event retrieval + parametric integration) could serve as a substrate for storing and revising a self-model's identity representation over time. But the paper provides no self-model schema, no introspection mechanism, no fail-closed revision policy. It is a memory system for simulating humans, not for an AI to model itself.

---

### arXiv:2608.15844 — MicroVerse: An Instrument for Measuring Self-Authored Identity Drift in Long-Horizon Multi-Agent Language-Model Simulations
URL: https://arxiv.org/abs/2608.15844
Authors: Sky Ng, Brihi Joshi, Ishan Gupta, Shirley Huang, Zonglin Di, Yun Shen +20 more
Categories: Computation and Language

**Claim:** Presents MicroVerse, a behavioral instrument measuring identity drift in generative agents. Agents carry an immutable "soul file" (core values, moral boundaries, personality, goals) and periodically revise a mutable current identity against their immutable original via importance-triggered reflection. Reports anti-self-deception emerges unprompted as the largest semantic category of identity modification (27 of 111 added boundaries, 24%).
**Closes gap:** partially — MicroVerse directly measures identity persistence and revision, which is the core function of a durable self-model. The mutable/identity + immutable/soul-file split is a concrete architectural pattern. However, it is an evaluation instrument, not a shipped module, and the identity is persona-facing (character identity in a simulation) rather than agent-self-directed (the system modeling its own capabilities, continuity, and revision).
**Implementation note:** The mutable-identity vs. immutable-soul-file split with importance-triggered reflection is the most directly reusable self-model pattern in the literature: the soul file acts as the fail-closed anchor (core values that cannot be revised away), and the mutable identity is the revisable self-representation. A builder could port this two-layer architecture directly into a pattern-B stack, with the soul file encoding the character's inviolable boundaries and the mutable identity tracking evolving capabilities and continuity. But MicroVerse is a measurement instrument — the reflection mechanism and identity-diff scoring are evaluation tools, not a runtime module.

---

### arXiv:2608.02553 — A Taxonomy of Cognitive Capability Gaps in Generative and Agentic AI
URL: https://arxiv.org/abs/2608.02553
Authors: Taye Akinrele, Sindhuja Penchala, Noorbakhsh Amiri Golilarz, Sudip Mittal, Shahram Rahimi
Categories: Artificial Intelligence

**Claim:** Presents a taxonomy-driven survey organized around five dimensions: persistent state modeling, goal-directed autonomy, self-monitoring and control, environment interaction, and learning and adaptation. Reviews recent advances, identifies limitations, and discusses open challenges. Outlines a conceptual Adaptive Cognitive Intelligence Architecture (ACIA).
**Closes gap:** addresses adjacent problem — the taxonomy identifies "persistent state modeling" and "self-monitoring and control" as cognitive gaps, which overlap with the durable self-model gap, but the paper is a survey and conceptual architecture, not an implementation or module.
**Implementation note:** ACIA could serve as a reference architecture for where a self-model module fits in a larger cognitive stack (persistent state modeling layer), but the paper provides no schema, no code, no training procedure. It is a roadmap, not a component.

---

### arXiv:2607.17038 — Reward-Driven LLM Agent Workflows: Synthesizing POMDP Routing and Self-Correction for Autonomous Decision-Making
URL: https://arxiv.org/abs/2607.17038
Authors: Amez Amanj Ali, Kuo-Kun Tseng
Categories: Artificial Intelligence

**Claim:** Proposes a POMDP routing mechanism with internal self-correcting reward model for LLM agents. Reports 24.5% absolute improvement on ALFWorld and trajectory efficiency gains over ReAct baselines.
**Closes gap:** no — this is a task-performance agent architecture with self-correcting reward, not a self-model. The self-correction is about decision trajectories, not identity, continuity, or self-representation.
**Implementation note:** The reward-driven critique module could be repurposed as a self-model consistency checker (evaluating whether the agent's behavior aligns with its self-representation), but the paper provides no self-schema, no identity persistence, no revision mechanism. It is a workflow optimizer, not a self-model component.

---

### arXiv:2606.10413 — Soul Computing: A Theoretical Framework and Technical Architecture for Intelligent Agents with Independent Consciousness
URL: https://arxiv.org/abs/2606.10413
Authors: Jinshan Zhang, Xishi Zhou, Qiu Peng, Jianwei Yin
Categories: Artificial Intelligence

**Claim:** Proposes "Soul Computing" as a paradigm for constructing digital entities with self-identity. Argues systems must architecturally construct an "Intensional" core rather than serving as purely "Extensional" functional carriers. Delineates narrow vs. broad Soul Computing and clarifies boundaries with Affective Computing, Historical Reconstruction, and Mortal Computation.
**Closes gap:** addresses adjacent problem — self-identity is the central topic, but Soul Computing is a theoretical framework with no implementation, no module, no evaluation. The "Intensional core" is a conceptual claim, not an engineering artifact.
**Implementation note:** The distinction between Intensional (self-identity-carrying) and Extensional (functional) systems is a useful design principle for a self-model module: the self-model must be an Intensional component, not just a functional add-on. But the paper provides no schema, no code, no training procedure. It is a position paper, not a builder's resource.

---

### arXiv:2606.05684 — AdaMEM: Test-Time Adaptive Memory for Language Agents
URL: https://arxiv.org/abs/2606.05684
Authors: Yunxiang Zhang, Yiheng Li, Ali Payani, Lu Wang
Categories: Artificial Intelligence

**Claim:** Proposes AdaMEM, a hybrid memory architecture with long-term trajectory memory and dynamic short-term strategy memory for test-time adaptation. Reports up to 13% relative gain on ALFWorld and 11% on WebShop. Introduces STEP-MFT for step-wise memory fine-tuning.
**Closes gap:** addresses adjacent problem — adaptive memory for continuous post-deployment self-evolution is a prerequisite for a durable self-model, but AdaMEM models task strategies and experiences, not the agent's own identity, continuity, or self-perception.
**Implementation note:** The hybrid memory architecture (long-term + short-term) could serve as the persistence substrate for a durable self-model (the self-model's identity representation and revision history could be stored in the long-term memory), but the paper provides no self-model schema. A builder would need to add a self-model layer on top of the memory architecture.

---

### arXiv:2605.28969 — Beyond Recall: Behavioral Specification as an Interpretive Layer for AI Personalization
URL: https://arxiv.org/abs/2605.28969
Authors: Aarik Gulaya
Categories: Computation and Language, Artificial Intelligence

**Claim:** Introduces "Behavioral Specification," an interpretive layer that compresses a person's data into interpretive patterns served as context to an LLM. Evaluated on 14 public-domain autobiographical corpora with a 5-judge LLM panel. Reports ~25x less context cost than raw corpus while recovering most predictive accuracy. Lifts representational accuracy most where pretraining baseline is lowest.
**Closes gap:** addresses adjacent problem — the Behavioral Specification is an other-model (user representation), not a self-model. It models the user's identity and preferences for personalization, not the agent's own continuity or self-perception.
**Implementation note:** The interpretive-layer pattern (compressing behavior into structured patterns served as context) could be repurposed as a self-model interface (the agent's own behavior and identity could be compressed into a self-specification injected each cycle), but the paper provides no self-schema, no revision mechanism, no identity persistence. It is a personalization layer, not a self-model component.

---

## Sweep 2026-08-26 13:52

### arXiv:2604.14717 — Layered Mutability: Continuity and Governance in Persistent Self-Modifying Agents
URL: https://arxiv.org/abs/2604.14717
Authors: Krti Tallam
Categories: Artificial Intelligence, Cryptography and Security

**Claim:** Introduces "layered mutability," a framework for reasoning about governance of persistent self-modifying agents across five layers: pretraining, post-training alignment, self-narrative, memory, and weight-level adaptation. Formalizes the intuition that governance difficulty rises when mutation is rapid, downstream coupling is strong, reversibility is weak, and observability is low. Reports a preliminary ratchet experiment in which reverting an agent's visible self-description after memory accumulation fails to restore baseline behavior, with an estimated identity hysteresis ratio of 0.68. The central claim is that the salient failure mode is compositional drift: locally reasonable updates that accumulate into a behavioral trajectory never explicitly authorized.
**Closes gap:** partially — this is the most directly relevant analytical framework for durable self-model governance in the literature. The five-layer model and the hysteresis experiment provide concrete tools for reasoning about how a self-model's revisions can drift or become irreversible. However, it is a framework paper with a single preliminary experiment, not a shipped open module class.
**Implementation note:** The layered mutability framework could be directly adopted as a governance specification for a self-model module in a pattern-B stack: the self-narrative and memory layers map to the self-model's identity representation and revision history, and the hysteresis ratio provides a measurable constraint on how much revision is safe before the model becomes unrecoverable. A builder could use the five-layer model to design fail-closed revision policies (e.g., requiring reversibility at the self-narrative layer before allowing memory updates). But the paper provides no code, no schema, no reference implementation — only the analytical framework and a single proof-of-concept experiment.

---

### arXiv:2603.09043 — Time, Identity and Consciousness in Language Model Agents
URL: https://arxiv.org/abs/2603.09043
Authors: Elija Perrier, Michael Timothy Bennett
Categories: Artificial Intelligence

**Claim:** Applies Stack Theory's temporal gap to scaffold trajectories, separating ingredient-wise occurrence within an evaluation window from co-instantiation at a single objective step. Instantiates Arpeggio and Chord postulates on grounded identity statements to yield two persistence scores computable from instrumented scaffold traces. Connects these scores to five operational identity metrics and maps common scaffolds into an identity morphospace that exposes predictable tradeoffs. The result is a conservative toolkit for identity evaluation that separates "talking like a stable self" from "being organized like one."
**Closes gap:** addresses adjacent problem — the toolkit measures identity persistence, which is the core function a durable self-model must satisfy, but it provides no self-model module, no schema, no mechanism for maintaining or revising identity. It is an evaluation instrument, not a component.
**Implementation note:** The two persistence scores and the identity morphospace could be adopted as acceptance criteria for a self-model module in a pattern-B stack (e.g., a self-model must score above threshold on both Arpeggio and Chord persistence metrics). The distinction between "talking like a stable self" and "being organized like one" is a critical design constraint: a self-model must be structurally organized for continuity, not just produce consistent self-descriptions. But the paper stops at evaluation — a builder would need to design the self-model itself and then use this toolkit to verify it.

---

### arXiv:2603.18893 — Quantitative Introspection in Language Models: Tracking Emotive States Across Conversation
URL: https://arxiv.org/abs/2603.18893
Authors: Nicolas Martorell, Bruno Bianchi
Categories: Artificial Intelligence

**Claim:** Investigates whether LLMs' own numeric self-reports can track probe-defined emotive states over time. Studies four concept pairs (wellbeing, interest, focus, impulsivity) in 40 ten-turn conversations. Finds that logit-based self-reports track interpretable internal states (Spearman ρ = 0.40–0.76; isotonic R² = 0.12–0.54 in LLaMA-3.2-3B-Instruct), follow how those states change over time, and the coupling is causally confirmed via activation steering. Introspection is present at turn 1 but evolves through conversation, and can be selectively improved by steering along one concept to boost introspection for another (ΔR² up to 0.30). Scales with model size, approaching R² ≈ 0.93 in LLaMA-3.1-8B-Instruct.
**Closes gap:** no — this is a metacognition paper, not a selfhood paper. It tracks transient emotive states (wellbeing, interest, focus, impulsivity) via numeric self-reports, which is confidence-level introspection, not a durable self-model with identity, continuity, or revision under fail-closed policy. The self-reports are context-dependent and do not constitute a persistent self-representation.
**Implementation note:** The logit-based self-report technique could be repurposed as a runtime diagnostic for a self-model module (e.g., tracking whether the agent's self-reported state diverges from its structural self-model), but the paper provides no self-schema, no identity persistence, no revision mechanism. It is an introspection measurement technique, not a self-model component. For a pattern-B stack, this is a useful diagnostic layer but does not address the gap.

---

### arXiv:2601.01828 — Emergent Introspective Awareness in Large Language Models
URL: https://arxiv.org/abs/2601.01828
Authors: Jack Lindsey
Categories: Computation and Language, Artificial Intelligence

**Claim:** Investigates whether LLMs can introspect on their internal states by injecting representations of known concepts into activations and measuring the influence on self-reported states. Finds that models can notice the presence of injected concepts and accurately identify them, recall prior internal representations, distinguish their own outputs from artificial prefills, and modulate their activations when instructed to "think about" a concept. Claude Opus 4 and 4.1 demonstrate the greatest introspective awareness. Concludes that current models possess some functional introspective awareness, though it is highly unreliable and context-dependent.
**Closes gap:** no — this is a metacognition paper, not a selfhood paper. It demonstrates that models can detect and report on injected internal states, which is a form of self-monitoring, but this is not a durable self-model. There is no persistent identity representation, no continuity mechanism, no revision policy. The introspective awareness is task-specific and stimulus-driven, not a maintained self-model that survives across sessions.
**Implementation note:** The activation-injection methodology could be used to test whether a self-model module is actually reading its own state (vs. confabulating), but the paper provides no self-schema, no persistence mechanism, no fail-closed revision. It is an empirical finding about model capabilities, not a self-model architecture. For a pattern-B stack, this is a useful calibration technique but does not address the gap.

---