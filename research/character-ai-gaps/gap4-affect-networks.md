## Sweep 2026-08-26 13:12

**Scout:** nous | **Ticks since seed:** 7 | **Searches:** 10 | **Abstracts fetched:** 7

### Thread: Trained Empathetic Reasoning (DEVELOPMENT)

#### arXiv:2512.01282 — Kardia-R1: Unleashing LLMs to Reason toward Understanding and Empathy for Emotional Support via Rubric-as-Judge Reinforcement Learning
URL: https://arxiv.org/abs/2512.01282
Authors: Jiahao Yuan, Zhiqing Cui, Hanqing Wang, Yuansheng Gao, Yucheng Zhou, Usman Naseem
Categories: Computation and Language, Artificial Intelligence

**Claim:** Proposes Kardia-R1, a framework training models for interpretable stepwise empathetic cognition via Rubric-as-Judge Empathetic Reinforcement Learning (Rubric-ERL), a GRPO-based method using explainable human-aligned rubric rewards. Introduces KardiaBench (178,080 QA pairs, 22,080 multi-turn conversations, 671 real-world profiles) constructed via model-in-the-loop pipeline with iterative rubric-guided refinement. Outperforms other methods in emotion accuracy, empathy, relevance, persona consistency, and safety across four LLM backbones. Open source.
**Closes gap:** partially — trains for empathetic reasoning via RL rather than prompting, but the output is still dialogue, not an explicit affect-state module; the rubric reward could be adapted to train an affect network to produce state vectors rather than text
**Implementation note:** In pattern-B, Kardia-R1's Rubric-ERL recipe is the training signal for an affect network: the rubric rewards (user understanding + emotional inference + supportive response) are the multi-objective reward that an affect dynamics module would need to optimize; the 671-profile benchmark is the training population.

---

#### arXiv:2604.18356 — ComPASS: Towards Personalized Agentic Social Support via Tool-Augmented Companionship
URL: https://arxiv.org/abs/2604.18356
Authors: Zhaopei Huang, Yanfeng Jia, Jiayi Zhao, Xinjie Zhang, Wenxuan Wang, Qin Jin
Categories: Computation and Language

**Claim:** Proposes ComPASS, a tool-augmented companionship framework grounded in psychological social support theory. Designs a dozen user-centric tools simulating multimedia applications to cover different social support behaviors. Constructs ComPASS-Bench (first personalized social support benchmark for LLM agents) via multi-step automated synthesis and manual refinement. Fine-tunes Qwen3-8B into ComPASS-Qwen, which achieves comparable performance to several large-scale models with substantial improvements over base. Tool-augmented responses achieve better overall performance than directly producing conversational empathy. Open source.
**Closes gap:** partially — demonstrates that tool-augmented fine-tuned agents outperform pure empathetic prompting; not an affect network per se, but shows that training beats prompting for social-emotional behavior
**Implementation note:** In pattern-B, ComPASS's tool-augmented action space is the behavioral layer an affect network would drive: given an affective state (e.g., user is lonely), the affect network selects which support tool to activate; the fine-tuning recipe (SFT on tool-use records) is reusable for training an affect network to map emotional context to support actions.

---

#### arXiv:2412.08389 — SweetieChat: A Strategy-Enhanced Role-playing Framework for Diverse Scenarios Handling Emotional Support Agent
URL: https://arxiv.org/abs/2412.08389
Authors: Jing Ye, Lu Xiang, Yaping Zhang, Chengqing Zong
Categories: Computation and Language

**Claim:** Proposes a strategy-enhanced role-playing framework simulating authentic emotional support conversations via three roles (Seeker, Strategy Counselor, Supporter). Constructs ServeForEmotional dataset (3.7K+ multi-turn dialogues, 62.8K+ utterances). Fine-tunes LLMs into SweetieChat, an emotional support agent handling diverse open-domain scenarios. Experiments and human evaluations confirm effectiveness in enhancing emotional support with nuanced, tailored assistance.
**Closes gap:** partially — provides a fine-tuned emotional support agent; affect is still dialogue-level rather than an explicit state module, but the three-role architecture maps onto a pattern-B affect pipeline (state estimation → strategy selection → response rendering)
**Implementation note:** In pattern-B, SweetieChat's three-role decomposition is the affect-network architecture template: the Strategy Counselor role is the affect policy (what emotional strategy to take), the Supporter role is the rendering layer; the ServeForEmo dataset is training data for affect-consistent dialogue policy.

---

### Thread: Persistent User-State Memory (DEVELOPMENT — adjacent)

#### arXiv:2608.16168 — QUMem: Personalized Memory for Query-Conditioned User-State Inference in LLM Agents
URL: https://arxiv.org/abs/2608.16168
Authors: Heng Wang, Yifei Li, Lingling Zhang, Pengyu Li, Xinyu Che, Xinyu Zhang, Zesheng Yang
Categories: Computation and Language, Artificial Intelligence

**Claim:** Proposes QUMem, a structured memory framework for query-conditioned user-state inference. Segments interaction histories into variable-length episodes by semantic continuity, decomposes each episode into independently retrievable factual, preference, and transferable insight memories with temporal positions and source evidence. At inference time, three sequential agents identify task-specific information needs, plan multi-query retrieval over typed memory stores, and jointly infer a temporally and contextually valid user state. Achieves state-of-the-art on PersonaMem and KnowU-Bench.
**Closes gap:** addresses adjacent problem — provides the memory infrastructure for persistent user-state tracking; not an affect module but the substrate an affect network would read from and write to
**Implementation note:** In pattern-B, QUMem's typed memory stores (factual, preference, insight) are the persistent state an affect network would maintain: each emotional event would be stored as an insight memory with temporal evidence; the query-conditioned inference is how the affect network retrieves contextually relevant emotional history to update its current state.

---

#### arXiv:2607.27773 — ChronoMem: Version Control and Semantic Rollback for Large Language Model Agent Memory
URL: https://arxiv.org/abs/2607.27773
Authors: Yongye Su, Wujiang Xu, Chaoji Zuo, Elisa Bertino
Categories: Computation and Language

**Claim:** Presents ChronoMem, a semantic version-control layer for agentic memory integrated into Google's open-source Agent Development Kit. Commits whole-memory snapshots at each memory write, maintains structured version histories, and supports natural-language rollback requests via hybrid lexical/semantic retrieval. Introduces post-exposure evaluation protocol testing counterfactual behavior after rollback. Substantially improves rollback-consistent question answering and history summarization relative to prompt-only and retrieval-only baselines.
**Closes gap:** addresses adjacent problem — enables principled rollback of agent memory states; not an affect module but the version-control infrastructure that would let an affect network revert to prior emotional states after maladaptive updates
**Implementation note:** In pattern-B, ChronoMem is the affect-state persistence layer: an affect network's emotional state would be versioned at each update, allowing rollback to a prior emotional baseline after harmful interactions; the semantic rollback capability is what prevents an affect network from being permanently corrupted by a single traumatic exchange.

---

### Thread: Continuous Affect Decoding (RECOGNITION — mature)

#### arXiv:2606.07707 — Decoding Naturalistic Emotion Dynamics from the Brain: An LLM-Enhanced Regression Framework
URL: https://arxiv.org/abs/2606.07707
Authors: Lemei Zhang, Peng Liu, Hans Dahle Kvadsheim, August Sætre Aasvær, Shuer Ye, Reya Bonyadi, Maryam Ziaei, Jon Atle Gulla
Categories: Machine Learning

**Claim:** Reconceptualizes emotion decoding as multi-target regression tracking overlapping emotional dimensions as continuous trajectories over time. Uses LLM-extracted continuous sentiment profiles from naturalistic auditory narrative (Alice in Wonderland) as scalable proxies for subjective affect from fMRI data. Models trained on temporal snapshots of Dynamic Functional Connectivity (DFC) significantly outperform static region-of-interest amplitude representations. Graph-theoretical XAI techniques reveal emotion-specific topological configurations. Demonstrates dynamic distributed network interactions offer superior explanatory power over locationist accounts.
**Closes gap:** addresses adjacent problem — provides a continuous affect decoding methodology from neural signals; not agent affect development but a recognition-side tool
**Implementation note:** In pattern-B, the DFC-based continuous affect decoding is the perception front-end: an affect network could use the same multi-target regression approach to track the user's emotional dimensions as continuous trajectories; the LLM-automated annotation pipeline is a scalable method for generating training labels for affect recognition without manual labeling.

---

### Thread: Adaptive Behavior Training Platform (DEVELOPMENT — adjacent)

#### arXiv:2508.00850 — Gearshift Fellowship: A Next-Generation Neurocomputational Game Platform to Model and Train Human-AI Adaptability
URL: https://arxiv.org/abs/2508.00850
Authors: Nadja R. Ging-Jehli, Russell K. Childers, Joshua Lu, Robert Gemma, Rachel Zhu
Categories: Human-Computer Interaction, Artificial Intelligence

**Claim:** Presents Gearshift Fellowship (GF), a Supertask paradigm prototype combining computational neurocognitive modeling with serious gaming to assess adaptive behavior across cognitive and social contexts. Enables neurocognitive modeling of individual differences across perceptual decisions, learning, and meta-cognitive levels. Online study (n=60, ongoing) shows GF recovers effects from traditional neuropsychological tasks (construct validity) and uncovers novel patterns in how learning differs across contexts and how clinical features map onto distinct adaptations. Designed as experimental platform, clinical intervention tool, and training ground for self-regulated learning, mood, and stress resilience.
**Closes gap:** addresses adjacent problem — provides a training environment for adaptive behavior including mood and stress resilience; not an affect network but a platform for training one
**Implementation note:** In pattern-B, Gearshift Fellowship is the training environment for an affect network: the game's dynamic multi-mission structure would be the curriculum for training an affect dynamics module to adapt its emotional responses across contexts; the neurocognitive modeling parameters are the feature space an affect network would learn to map onto adaptive behavior.

---

### Summary of findings

**Strand (a) RECOGNITION (mature):** Continuous affect decoding advances with LLM-enhanced regression (arXiv:2606.07707), which uses dynamic functional connectivity to track overlapping emotional dimensions as continuous trajectories. Recognition remains well-served; the bottleneck is deciding what to do with recognized affect.

**Strand (b) DEVELOPMENT (fragmented but with growing training infrastructure):** This sweep found three new papers that train (not prompt) for empathetic/social-emotional behavior:
- Kardia-R1 (arXiv:2512.01282): GRPO-based rubric reward for empathetic reasoning, open source
- ComPASS (arXiv:2604.18356): tool-augmented fine-tuned agent for personalized social support
- SweetieChat (arXiv:2412.08389): fine-tuned emotional support agent with three-role architecture

Plus two memory infrastructure papers (QUMem, ChronoMem) that provide the persistence layer an affect network would need for longitudinal coherence.

**The gap remains:** No single open module class ships a trained affect network with longitudinal evaluation. However, the training recipes are now concrete: Kardia-R1's rubric-ERL provides the reward signal, ComPASS's tool-augmented fine-tuning provides the behavioral training methodology, and QUMem/ChronoMem provide the persistent state infrastructure. A pattern-B stack could assemble these today; the missing piece remains the integration contract that unifies them under one inspectable orchestration.

**Papers to verify further:** None from db-r-2026-007 §10 cited this sweep; all IDs resolved directly via arxiv.

---

## Sweep 2026-08-27 14:42

**Scout:** nous | **Ticks since seed:** 8 | **Searches:** 5 | **Abstracts fetched:** 6

### Thread: Emotion-Gradient Intrinsic Motivation (DEVELOPMENT)

#### arXiv:2505.07757 — Emotion-Gradient Metacognitive RSI (Part I): Theoretical Foundations and Single-Agent Architecture
URL: https://arxiv.org/abs/2505.07757
Authors: Rintaro Ando
Categories: Artificial Intelligence, Machine Learning

**Claim:** Proposes the EG-MRSI framework, a unified architecture integrating introspective metacognition, emotion-based intrinsic motivation, and recursive self-modification. Introduces a differentiable intrinsic reward function driven by confidence, error, novelty, and cumulative success that regulates a metacognitive mapping and a self-modification operator. Defines emotion-gradient dynamics, RSI trigger conditions, and a reinforcement-compatible optimization objective. Introduces Meaning Density and Meaning Conversion Efficiency as quantifiable metrics of semantic learning.
**Closes gap:** partially — a theoretical framework for agent affect development via emotion-gradient intrinsic reward; not an empirical affect network but a mathematically specified architecture for emotion-driven self-improvement
**Implementation note:** In pattern-B, the emotion-gradient intrinsic reward signal is the training signal for an affect network: the combination of confidence, error, novelty, and cumulative success is the multi-objective reward that would shape an agent's affective development trajectory; the metacognitive mapping is the self-model an affect network would maintain.

---

### Thread: Homeostatic Drive Mechanisms (DEVELOPMENT)

#### arXiv:2401.08999 — Continuous Time Continuous Space Homeostatic Reinforcement Learning (CTCS-HRRL): Towards Biological Self-Autonomous Agent
URL: https://arxiv.org/abs/2401.08999
Authors: Hugo Laurencon, Yesoda Bhargava, Riddhi Zantye, Charbel-Raphaël Ségerie, Johann Lussange, Veeky Baths, Boris Gutkin
Categories: Artificial Intelligence, Machine Learning

**Claim:** Advances the HRRL framework to continuous time-space environments. Links Drive Reduction Theory and Reinforcement Learning via the Hamilton-Jacobi-Bellman Equation with neural network function approximation. Demonstrates through simulation that an agent learns homeostatic behavior in a continuously changing internal-state milieu, dynamically choosing policies that favor homeostasis.
**Closes gap:** partially — provides the homeostatic drive mechanism for an affect network; the agent learns to maintain internal balance (emotional equilibrium) via drive reduction
**Implementation note:** In pattern-B, the homeostatic reward function is the core drive signal for an affect network: the agent's internal state variables (e.g., arousal, valence, social connection) are the homeostatic drives that the affect network must regulate; the HJB-based continuous-time formulation is the temporal dynamics model for affect state transitions.

---

#### arXiv:2510.07117 — The Conditions of Physical Embodiment Enable Generalization and Care
URL: https://arxiv.org/abs/2510.07117
Authors: Leonardo Christov-Moore, Arthur Juliani, Alex Kiefer, Joel Lehman, Nicco Reggente, B. Scot Rousse, Adam Safron, Nicolás Hinrichs, Daniel Polani, Antonio Damasio
Categories: Artificial Intelligence, Machine Learning

**Claim:** Argues that generalization and care arise from conditions of physical embodiment: being-in-the-world and being-towards-death. These necessitate a homeostatic drive to maintain oneself and maximize future capacity. Fulfilling this drive over long time horizons in multi-agent environments requires robust causal modeling of self and others' embodiment. Outlines a reinforcement-learning framework for examining these questions. Homeostatic mortal agents continually learning in open-ended environments may offer efficient robustness and trustworthy alignment.
**Closes gap:** partially — provides the theoretical foundation for why affect networks need homeostatic drives; not an implementation but a rigorous motivation for the design of affect dynamics
**Implementation note:** In pattern-B, the homeostatic drive framework motivates the reward structure of an affect network: the agent's internal drives (maintaining well-being, maximizing future capacity) are the intrinsic reward functions that would shape emotional development; the causal modeling of self and others' embodiment is the social cognition layer an affect network would need.

---

### Thread: Emotion Determination via RL (DEVELOPMENT)

#### arXiv:2606.09837 — Self-EmoQ: Plutchik-Guided Value-based Planning to Drive Streaming Emotional TTS
URL: https://arxiv.org/abs/2606.09837
Authors: Yue Zhao, Hongyan Li, Yong Chen, Luo Ji
Categories: Human-Computer Interaction, Artificial Intelligence

**Claim:** Proposes an emotion-planning framework that determines emotion prior to textual generation, grounding downstream emotional TTS in a streaming manner. Implements a plug-and-play LLM module trained by RL with emotions as actions. Uses a hybrid reward combining imitation signals with theory-driven scoring based on Plutchik's wheel of emotions. Outperforms prompting and finetuning baselines on emotion determination and response quality across DailyDialog, EmoryNLP, IMEOCAP, and MELD. Implements a full streaming pipeline for real-time deployment.
**Closes gap:** partially — trains an RL module to determine emotions (not prompt-based), but the module is specific to TTS rendering rather than general agent affect state inference
**Implementation note:** In pattern-B, the RL-based emotion determination module is a plug-and-play component that could be repurposed as the affect-state decoder: given a context, the module selects the agent's emotional state (action) via value-based planning; the Plutchik-guided reward is the theory-driven shaping signal that would ensure psychologically plausible emotional transitions.

---

### Thread: Expressive TTS Training Methodology (adjacent)

#### arXiv:2608.15910 — Iterative Self-Learning for Expressive Text-to-Speech Synthesis
URL: https://arxiv.org/abs/2608.15910
Authors: Nicholas Sanders, Gustav Eje Henter, Simon King, Korin Richmond
Categories: Audio and Speech Processing, Computation and Language

**Claim:** Proposes an Iterative Self-Learning (ISL) framework for expressive TTS to address scarcity of expressive labels. Uses Invert-Classify, a classifier-free method that recovers discrete expressive labels by inverting a frozen generative model. Iteratively pseudo-labels unlabeled speech, retrains on combined data, and repeats. Validates on word-level prominence and utterance-level emotion tasks across low-resource data splits. ISL-trained models outperform single-pass pseudo-labeling and approach fully supervised performance in data-scarce conditions.
**Closes gap:** addresses adjacent problem — provides a semi-supervised training methodology that could be used to train an affect network with limited labeled emotional data
**Implementation note:** In pattern-B, ISL's pseudo-labeling approach could bootstrap an affect network from unlabeled interaction data: the iterative self-learning loop (pseudo-label → retrain → refine) is the training recipe for an affect network when labeled emotional trajectories are scarce; the Invert-Classify method is the label recovery mechanism for inferring affective states from raw interaction logs.

---

### Thread: Temporal Dynamics Prediction (adjacent)

#### arXiv:2606.30889 — Dynamic Prediction of Alternating Recurrent Events via Neural Network
URL: https://arxiv.org/abs/2606.30889
Authors: Abigail Loe, Susan Murry, Zhenke Wu
Categories: Machine Learning, Machine Learning

**Claim:** Develops an online dynamic prediction framework for predicting subsequent alternating recurrent events using neural networks and inverse probability weighted pseudo-observations. Applied to dynamically predict alternating recurrent event-free time. Shows good performance in simulation and outstanding capability in application to predicting periods of low mood for first-year medical residents.
**Closes gap:** addresses adjacent problem — provides a statistical prediction methodology for mood dynamics that could inform affect network temporal modeling
**Implementation note:** In pattern-B, the neural network framework for predicting alternating recurrent events (e.g., mood episodes) could be adapted as the temporal dynamics model for an affect network: the online dynamic prediction mechanism is how an affect network would forecast future emotional states based on current trajectories; the inverse probability weighting handles the censored data problem inherent in longitudinal emotional tracking.

---

### Summary of findings

**Strand (a) RECOGNITION (mature):** No new recognition-side papers this sweep. The recognition strand remains well-served by existing methods.

**Strand (b) DEVELOPMENT (fragmented but with growing theoretical and training infrastructure):** This sweep found four new papers advancing agent affect development:

- EG-MRSI (arXiv:2505.07757): emotion-gradient intrinsic reward for recursive self-improvement — theoretical framework
- CTCS-HRRL (arXiv:2401.08999): homeostatic drive mechanism in continuous time-space — drive reduction theory + RL
- Self-EmoQ (arXiv:2606.09837): RL-based emotion determination module with Plutchik-guided reward — trainable, not prompted
- Embodiment & Care (arXiv:2510.07117): theoretical foundation for homeostatic drives from physical embodiment

Plus two adjacent methodology papers: ISL for expressive TTS (semi-supervised training recipe) and dynamic prediction of recurrent events (temporal dynamics modeling for mood).

**The gap remains:** No single open module class ships a trained affect network with longitudinal evaluation. However, the theoretical substrate is deepening: EG-MRSI provides the emotion-gradient reward signal, CTCS-HRRL provides the homeostatic drive mechanism, Self-EmoQ provides the trainable emotion determination module, and the embodiment paper provides the theoretical justification for why affect networks need homeostatic drives. A pattern-B stack could assemble these components; the missing piece remains the integration contract that unifies them under one inspectable orchestration.

**Papers to verify further:** None from db-r-2026-007 §10 cited this sweep; all IDs resolved directly via arxiv.

---