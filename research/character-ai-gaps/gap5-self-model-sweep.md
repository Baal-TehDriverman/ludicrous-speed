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