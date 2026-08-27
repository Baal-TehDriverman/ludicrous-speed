## Sweep 2026-08-24 22:51

Nine arXiv searches rotated across modular embodied agents, specialized-module orchestration, open virtual-human pipelines, speech-driven facial animation, dialogue-conditioned motion, persistent state, and interactive character systems. No paper in this sweep presents the full open pattern-B contract. The strongest results expose complementary buildable layers rather than one inspectable end-to-end engine.

### arXiv:2601.13148 — ICo3D: An Interactive Conversational 3D Virtual Human
URL: https://arxiv.org/abs/2601.13148
Authors: Richard Shaw, Youngkyoon Jang, Athanasios Papaioannou, Arthur Moreau, Helisa Dhamo, Zhensong Zhang, Eduardo Pérez-Pellitero
Categories: Computer Vision and Pattern Recognition; Human-Computer Interaction

**Claim:** ICo3D integrates an LLM with a photorealistic 3D avatar assembled from separately reconstructed face and body Gaussian models. Avatar speech drives synchronized facial animation, and the authors demonstrate real-time oral and written interaction. No numeric claim is made in the abstract.
**Closes gap:** Partially. It joins dialogue, speech, face, and body presentation in one demonstrated system, but the abstract does not report trained affect dynamics, emotional TTS, persistent character state, or an open inspectable orchestration contract.
**Implementation note:** This supplies a concrete reference boundary between conversational output, generated audio, and real-time face/body rendering; a pattern-B builder could place affect-state, emotional-TTS, and persistence modules upstream of its audio-driven avatar interface, but would still need to define and open the state/event contract.

### arXiv:2604.02908 — SentiAvatar: Towards Expressive and Interactive Digital Humans
URL: https://arxiv.org/abs/2604.02908
Authors: Chuhao Jin, Rui Zhang, Qingzhe Gao, Haoyu Shi, Dayu Wu, Yichen Jiang, Yihan Wu, Ruihua Song
Categories: Computer Vision and Pattern Recognition; Human-Computer Interaction

**Claim:** SentiAvatar trains an audio-aware plan-then-infill motion architecture that separates sentence-level semantic motion planning from frame-level prosody alignment. Its SuSuInterActs corpus contains 21,000 clips and 37 hours of synchronized speech, full-body motion, and facial expression; the motion foundation model is pretrained on more than 200,000 sequences. The abstract reports R@1 43.64% on SuSuInterActs, FGD 4.941 and BC 8.078 on BEATv2, and six seconds of output generated in 0.3 seconds with multi-turn streaming. It states that source code, model, and dataset are available.
**Closes gap:** Partially. It is a strong open trained face/body behavior module, but it does not provide the dialogue LLM, trained longitudinal affect dynamics, emotional TTS, persistent character state, or a unifying orchestration contract.
**Implementation note:** This can serve as the separately trained nonverbal-behavior service in a pattern-B stack: dialogue semantics and synthesized prosody become explicit inputs, while generated facial/full-body motion is the output. Its plan/infill split suggests two orchestration messages—utterance-level intent first, timed audio features second.

### arXiv:2607.17250 — EvolvingWorld: An Open-Schema Framework for Co-Evolving Role-Play Agents and World Model in Interactive Literary World
URL: https://arxiv.org/abs/2607.17250
Authors: Qing Zong, Yue Guo, Mengxin Yang, Yiwen Guo, Yangqiu Song
Categories: Computation and Language

**Claim:** EvolvingWorld couples a multi-character role-play agent with an LLM-based world model that persistently updates character profiles plus global, location, and entity state over long trajectories. It defines seven trainable tasks and reports a dataset derived from 57 books with 138,596 supervised samples and 222 test snapshots, evaluated through a trajectory-level protocol spanning 10 dimensions and 20 metrics.
**Closes gap:** Partially. It directly addresses persistent character/world state and state-update training, but remains a language/world-simulation architecture with no emotional TTS or trained face/body animation modules; the affect dynamics described by the gap are also absent from the abstract.
**Implementation note:** This offers a candidate persistent-state service and open-schema update protocol for a pattern-B orchestrator. A builder could emit committed character/world state after each scene and pass selected state fields into dialogue, affect, speech, and animation services, while keeping those services independently trained and inspectable.

### arXiv:2409.07966 — ProbTalk3D: Non-Deterministic Emotion Controllable Speech-Driven 3D Facial Animation Synthesis Using VQ-VAE
URL: https://arxiv.org/abs/2409.07966
Authors: Sichun Wu, Kazi Injamamul Haque, Zerrin Yumak
Categories: Computer Vision and Pattern Recognition; Artificial Intelligence

**Claim:** ProbTalk3D is a two-stage VQ-VAE trained on the emotionally rich 3DMEAD dataset to generate stochastic, speech-driven 3D facial animation controlled by emotion labels and intensity levels. The paper compares objective, qualitative, and perceptual results and states that the complete codebase is public; no numeric performance claim is given in the abstract.
**Closes gap:** Partially. It provides an open, separately trained emotional facial-animation network, not a full character engine. It does not include dialogue orchestration, emotional TTS, body motion, persistent state, or learned affect-state evolution across interactions.
**Implementation note:** This can be wrapped as a pattern-B face-animation service with an explicit contract of audio plus emotion label/intensity to stochastic facial motion. The missing bridge is a trained affect-dynamics module that owns the emotion trajectory instead of allowing the dialogue LLM to prompt the label ad hoc.

### arXiv:2510.13195 — Emotional Cognitive Modeling Framework with Desire-Driven Objective Optimization for LLM-empowered Agent in Social Simulation
URL: https://arxiv.org/abs/2510.13195
Authors: Qun Ma, Xiao Xue, Xuwen Zhang, Zihan Zhao, Yuwei Guo, Ming Zhang
Categories: Artificial Intelligence

**Claim:** The paper describes an emotional-cognition decision framework spanning state evolution, desire generation, objective optimization, decision generation, and action execution, and evaluates it in a proprietary multi-agent environment. The abstract reports improved ecological validity and closer approximation to human behavioral patterns but gives no numeric values.
**Closes gap:** Addresses an adjacent problem. It gives affect-relevant state and decision stages, but the abstract does not establish that affect evolution is a separately trained neural module, and the implementation environment is proprietary. Emotional TTS, face/body animation networks, and an open orchestration contract are absent.
**Implementation note:** Its stage decomposition can inform event types in a pattern-B contract—state update, desire proposal, objective selection, decision, action—but it cannot itself supply the required open trained-affect component without public code, weights, and a verified learned state-transition interface.

### arXiv:2505.20156 — HunyuanVideo-Avatar: High-Fidelity Audio-Driven Human Animation for Multiple Characters
URL: https://arxiv.org/abs/2505.20156
Authors: Yi Chen, Sen Liang, Zixiang Zhou, Ziyao Huang, Yifeng Ma, Junshu Tang, Qin Lin, Yuan Zhou, Qinglin Lu
Categories: Computer Vision and Pattern Recognition

**Claim:** HunyuanVideo-Avatar uses a multimodal diffusion transformer with character-image injection, an Audio Emotion Module, and a face-aware audio adapter to generate dynamic, emotion-controllable multi-character dialogue video while preserving character identity. The abstract claims state-of-the-art benchmark performance but provides no numeric values and does not state that code or model weights are open.
**Closes gap:** Partially at the animation layer, but no at the engine level. It combines audio, emotion conditioning, and multi-character visual animation, yet does not supply dialogue cognition, trained longitudinal affect state, emotional TTS, persistent character state, or an inspectable open orchestration contract.
**Implementation note:** This identifies a viable audio-and-emotion-conditioned visual endpoint for multi-character scenes. In a real pattern-B stack it would consume per-speaker audio, identity, and affect controls, but its lack of an asserted open implementation and its video-generation scope prevent it from closing the full engine gap.

## Sweep 2026-08-25 00:23

Nine arXiv searches rotated across the assigned architecture, orchestration, virtual-human, animation, dialogue-motion, affect-dynamics, and persistence angles. This sweep found the closest open integrated avatar system yet—EmpaAva—but still no open engine combining separately trained affect dynamics, emotional TTS, face/body animation networks, and persistent character state under one inspectable orchestration contract.

### arXiv:2608.04709 — EmpaAva: An Open-source Agentic 3D-Avatar Empathetic Live Chatbot
URL: https://arxiv.org/abs/2608.04709
Authors: Jie Yang, Wenhao Xu, Shuhui Lin, Hao Fei
Categories: Computation and Language

**Claim:** EmpaAva is presented as an open-source agentic 3D-avatar chatbot in which an LLM coordinates perception, empathetic-response planning, and embodied rendering. It reads affect from speech and optional vision, then produces emotional speech, lip-synced facial motion, and photorealistic 3D Gaussian rendering through an executable multimodal response plan. The abstract reports superiority over text-only, 2D talking-face, and multimodal-avatar baselines but gives no numeric values.
**Closes gap:** Partially, and more directly than the prior sweep's integrated systems. It supplies an open, inspectable-looking orchestration layer across affect perception, dialogue planning, emotional speech, facial motion, and rendering. It still does not establish a separately trained longitudinal affect-dynamics module, full-body animation network, or persistent character-state service.
**Implementation note:** EmpaAva can provide the central orchestration and multimodal-plan contract for a real pattern-B build. A builder would need to extend that contract with committed persistent-state events, a learned affect-state transition service, and a separately trained body-motion endpoint rather than allowing empathetic intent to remain only response-plan output.

### arXiv:2602.04913 — A$^2$-LLM: An End-to-end Conversational Audio Avatar Large Language Model
URL: https://arxiv.org/abs/2602.04913
Authors: Xiaolin Hu, Hang Yuan, Xinzhu Sang, Binbin Yan, Zhou Yu, Cong Huang, Kai Chen
Categories: Machine Learning; Artificial Intelligence

**Claim:** A$^2$-LLM jointly reasons over language, audio prosody, and 3D facial motion in one end-to-end model, trained with the FLAME-QA multimodal dataset to align semantic intent and expressive facial dynamics. The abstract reports 500 ms latency and 0.7 real-time factor while claiming improved emotional expressiveness.
**Closes gap:** No at the pattern-B architecture level. It integrates dialogue, prosody, and facial motion, but deliberately replaces independently orchestrated modules with a unified model. The abstract does not provide persistent state, full-body animation, or separately trained affect dynamics, and does not state that code or weights are open.
**Implementation note:** The FLAME-QA alignment strategy can inform training data for an expressive output endpoint, while its joint language-audio-face representation is a useful baseline against which a modular pattern-B contract should measure coordination loss and latency. It cannot itself serve as the required inspectable multi-network engine.

### arXiv:2509.05298 — Livia: An Emotion-Aware AR Companion Powered by Modular AI Agents and Progressive Memory Compression
URL: https://arxiv.org/abs/2509.05298
Authors: Rui Xi, Xianghan Wang
Categories: Human-Computer Interaction; Artificial Intelligence

**Claim:** Livia combines specialized agents for emotion analysis, dialogue generation, memory management, and behavioral orchestration with multimodal affect sensing and AR embodiment. It introduces Temporal Binary Compression and a Dynamic Importance Memory Filter for long-term memory, and reports improved emotional bonds, satisfaction, and reduced loneliness without numeric values in the abstract.
**Closes gap:** Partially for modular orchestration and persistent memory. The abstract describes modular AI agents rather than separately trained affect, speech, and animation networks; emotional TTS, trained face/body motion, an inspectable cross-module schema, and an explicit open-source claim are absent.
**Implementation note:** Livia offers a concrete decomposition for emotion, dialogue, memory, and behavior services, while its compression/filtering algorithms suggest a persistence tier behind the orchestrator. A pattern-B builder would still need typed module boundaries and independently trained affect, TTS, and animation services rather than agent-level prompt specialization.

### arXiv:2608.10720 — Ex-Omni-2D: Expressive Omni-Modal Dialogue Models with Native Visual Presence
URL: https://arxiv.org/abs/2608.10720
Authors: Haoyu Zhang, Zhipeng Li, Xiaoying Tang, Tianshu Yu, Yiwen Guo
Categories: Artificial Intelligence; Computation and Language

**Claim:** Ex-Omni-2D generates coordinated text, personalized speech, and reference-conditioned video from multimodal input. A structured Visual Thought Plan specifies scene, emotion, and motion; native speech units provide a shared temporal interface to streamed video. The abstract reports an end-to-end real-time factor of 1.293 at 400×720 or 720×400 using a four-GPU, four-step inference pipeline.
**Closes gap:** Partially at coordinated multimodal response generation, but no at the full engine level. It lacks persistent character state and separately trained longitudinal affect dynamics, and its generated 2D video does not establish a reusable face/body animation service contract. The abstract also makes no open-source claim.
**Implementation note:** Its Visual Thought Plan and shared acoustic-temporal units are concrete candidates for the utterance-plan and synchronization messages in a pattern-B protocol. They would need to sit downstream of persistent and learned affect-state services and upstream of independently replaceable speech and animation modules to meet the gap's inspectability requirement.

## Sweep 2026-08-25 04:14

Twelve arXiv-script searches across modular agents, virtual humans, speech/gesture animation, emotional speech, affective agents, and persistent character memory returned no results, consistent with the scraper's documented dark/rate-limited state. A web-search fallback surfaced three resolvable papers, whose abstracts were then fetched directly with the arXiv skill. None closes the full open pattern-B gap; together they clarify interfaces for streaming facial motion, causal listen/speak state, and closed-loop social reasoning.

### arXiv:2605.31294 — TokTalk: Expressive Real-time Facial Animation from Audio-LLM Tokens
URL: https://arxiv.org/abs/2605.31294
Authors: Qingcheng Zhao, Yifang Pan, Karan Singh
Categories: Computer Vision and Pattern Recognition

**Claim:** TokTalk trains a Chunk-based Conditional Flow Matching model on a new audio-token-to-3D-facial-motion dataset, generating expressive facial animation directly from streaming Audio-LLM tokens. The authors describe lightweight adaptation to token-based Audio-LLMs, configurable latency/quality trade-offs, real-time performance comparable in latency to prior work, and perceptual-study gains in quality, expressivity, and control; the abstract gives no numeric values.
**Closes gap:** Partially. It provides a separately trained, streaming facial-animation endpoint connected directly to an Audio-LLM representation, but not trained longitudinal affect dynamics, emotional TTS as an independently inspectable service, body animation, persistent character state, or a full orchestration contract. The abstract makes no open-source claim.
**Implementation note:** TokTalk suggests a concrete low-latency protocol boundary in which an audio-language model streams token chunks to a replaceable facial-motion service, avoiding a complete synthesize-audio-then-reanalyze-audio loop. A pattern-B engine would still need committed affect and character-state events plus parallel TTS and body-motion consumers.

### arXiv:2604.17211 — EmbodiedHead: Real-Time Listening and Speaking Avatar for Conversational Agents
URL: https://arxiv.org/abs/2604.17211
Authors: Yu Zhang, Kaiyuan Shen, Yang Li
Categories: Computer Vision and Pattern Recognition

**Claim:** EmbodiedHead couples a Rectified-Flow Diffusion Transformer with a differentiable renderer for real-time conversational talking heads. Its causal single-stream interface uses explicit per-frame listening/speaking state conditioning and a Streaming Audio Scheduler, while two-stage coefficient-space and image-domain training supports speaking and listening behavior; the abstract states generation in as few as four sampling steps but gives no benchmark values.
**Closes gap:** Partially at the embodied-output layer. It supplies a trained avatar network and an explicit causal turn-state interface suitable for live LLM interaction, but does not include emotional TTS, learned affect-state evolution, full-body animation, persistent character state, or a unifying open orchestration contract. The abstract makes no open-source claim.
**Implementation note:** The per-frame listen/speak state is directly usable as a typed orchestration signal shared by turn manager, audio scheduler, and renderer. A full pattern-B build could place this endpoint behind an avatar service, but must expand the state machine with learned affect trajectories and durable character-state references rather than treating listen/speak mode as the character state itself.

### arXiv:2606.05896 — Resonant Minds: Closed-Loop Social Avatars with Theory of Mind
URL: https://arxiv.org/abs/2606.05896
Authors: Jianxu Shangguan, Jing Xu, Hang Ye, Xiaoxuan Ma, Yizhou Wang, Jenq-Neng Hwang, Wentao Zhu
Categories: Computer Vision and Pattern Recognition

**Claim:** Resonant Minds proposes a closed-loop dual-agent framework joining multimodal perception, Theory-of-Mind social reasoning, ensemble response selection, and an expression module that generates emotion-controllable speaker speech/facial expression plus listener reactive behavior. It also introduces a hierarchical Persona-Scenario dataset with personas and private social goals; the abstract reports competitive or superior dialogue and video-generation results but provides no numeric values.
**Closes gap:** Partially and architecturally adjacent. It integrates cognitive and expressive modules in a continuous interaction cycle, but the abstract does not establish separately trained longitudinal affect dynamics, persistent state across sessions, full-body animation, an independently replaceable emotional-TTS service, or an open inspectable implementation contract. The project page is mentioned, but the abstract does not claim released code or weights.
**Implementation note:** Its perception→mental-state inference→response selection→expression loop is a useful top-level event flow for a pattern-B orchestrator, and private goals can become durable state fields. To close the gap, those inferred mental states would need versioned persistence and a trained affect-transition service, while speech, face, and body generators would need explicit independently replaceable interfaces.

## Sweep 2026-08-25 08:11

Six arXiv-script searches across modular embodied agents, open virtual-human pipelines, specialized-module orchestration, dialogue-conditioned gesture, persistent character state, and trained affect/TTS/animation again returned no results, consistent with the scraper's continuing dark state. A web-search fallback found one previously uncatalogued open implementation scaffold. It does not close the pattern-B gap.

### arXiv:2509.04356 — SRWToolkit: An Open Source Wizard of Oz Toolkit to Create Social Robotic Avatars
URL: https://arxiv.org/abs/2509.04356
Authors: Atikkhan Faridkhan Nilgar, Kristof Van Laerhoven, Ayub Kinoti
Categories: Human-Computer Interaction

**Claim:** SRWToolkit is an open-source, web-based toolkit for rapidly prototyping social robotic avatars with local LLM inference. It supports text, button-activated speech, wake-word commands, and real-time configuration of avatar appearance, behavior, language, and voice. A small-scale user study involved 11 participants; the abstract reports positive usability, trust, and user-experience outcomes without numeric scores.
**Closes gap:** Addresses an adjacent implementation problem, but no at the pattern-B level. It provides an open modular and on-device avatar scaffold, while character roles remain LLM-driven and user-configured; the paper does not claim separately trained affect dynamics, emotional TTS, neural face/body animation, or durable character-state evolution under a shared typed contract.
**Implementation note:** This can supply the local deployment shell and interaction transport around a future pattern-B engine: an implementer could replace its configurable voice/avatar behaviors with explicit affect-transition, emotional-speech, facial-motion, body-motion, and persistence services. As published, it is a Wizard-of-Oz/prototyping substrate rather than the missing trained multi-network character engine.

## Sweep 2026-08-25 12:11

Ten arXiv-script searches rotated across modular embodied conversational agents, open virtual-human pipelines, specialized-neural-module orchestration, dialogue-conditioned motion, persistent character state, trained affect dynamics, emotional TTS, and embodied-avatar memory. One previously uncatalogued system was relevant enough to retain. It advances joint conversational face/body behavior, but does not close the full open pattern-B gap.

### arXiv:2512.14234 — ViBES: A Conversational Agent with Behaviorally-Intelligent 3D Virtual Body
URL: https://arxiv.org/abs/2512.14234
Authors: Juze Zhang, Changan Chen, Xin Chen, Heng Yu, Tiange Xiang, Ali Sartaz Khan, Shrinidhi K. Lakshmikanth, Ehsan Adeli
Categories: Computer Vision and Pattern Recognition

**Claim:** ViBES introduces a speech-language-behavior model whose mixture-of-modality-experts backbone partitions transformer experts for speech, facial expression, and body motion, connects them through cross-expert attention, and jointly plans language and dialogue-conditioned movement from interleaved multimodal token streams. It supports multi-turn mixed-initiative spoken, typed, and body-action interaction plus streaming behavior-control hooks. The abstract reports consistent gains over co-speech and text-to-motion baselines but gives no numeric values; it says code and data *will be* made available rather than establishing a completed open release.
**Closes gap:** Partially at the coordinated dialogue/face/body layer, but no at the full pattern-B engine level. The modality experts live inside one jointly operating model rather than an inspectable contract among independently replaceable trained services, and the abstract does not provide learned longitudinal affect dynamics, an explicit emotional-TTS module, or persistent character state.
**Implementation note:** ViBES can serve as a streaming speech-language-behavior endpoint behind a pattern-B orchestrator, with its body-action directives and behavior hooks defining useful control messages. To close the gap, a builder must place versioned persistent character state and a separately trained affect-transition service upstream, expose emotional speech and animation boundaries as replaceable interfaces, and verify that the promised code/data release actually materializes.

## Sweep 2026-08-25 16:13

Eight arXiv-script searches across modular embodied agents, open virtual-human pipelines, speech-driven full-body behavior, persistent character state, affect dynamics, specialized-neural-module orchestration, dialogue-conditioned gesture, and emotional TTS returned no results, consistent with the scraper's continuing dark state. A web-search fallback found two resolvable persistence-layer papers not yet catalogued here. Neither closes the full open pattern-B gap; together they sharpen the durable-state and auditable-runtime boundary that such an engine needs.

### arXiv:2604.04660 — Springdrift: An Auditable Persistent Runtime for LLM Agents with Case-Based Memory, Normative Safety, and Ambient Self-Perception
URL: https://arxiv.org/abs/2604.04660
Authors: Seamus Brady
Categories: Artificial Intelligence

**Claim:** Springdrift presents a persistent LLM-agent runtime combining append-only memory, supervised processes, git-backed recovery, hybrid case-based retrieval, deterministic safety gating with auditable axiom trails, and a structured self-state sensorium injected each cycle. The paper reports a single-instance deployment over 23 days, including 19 operating days, while explicitly framing the evidence as a systems case study rather than benchmark-driven evaluation. It says code, artifacts, and redacted logs will be available upon publication, so the abstract does not establish that the implementation is already openly released.
**Closes gap:** Partially at the persistent-runtime and inspectability layer. It supplies durable state, recovery, supervision, and forensic reconstruction, but no dialogue-to-emotional-TTS path, separately trained affect dynamics, or trained face/body animation services under a shared character-engine contract.
**Implementation note:** Springdrift can serve as the durable control plane beneath a pattern-B engine: append every committed character-state transition and module decision, supervise independently trained dialogue/affect/speech/animation workers, and retain replayable provenance across sessions. A builder must still define typed cross-module events and supply the missing trained expressive modules; the promised release must also be verified before treating it as an open foundation.

### arXiv:2608.19564 — Remember, Verify, or Ask? Cross-Family Evaluation of Memory Commitment in LLM Agents
URL: https://arxiv.org/abs/2608.19564
Authors: Baichuan Li, Junyi Yao, Zihao Zheng
Categories: Computation and Language

**Claim:** The paper introduces the Memory-Commitment Boundary benchmark for deciding whether interaction-derived information should be persisted, kept only in current context, re-verified, or clarified with the user. It contains 140 primary scenarios split into 70 development and 70 held-out items plus a separate 70-item contrast set, and evaluates both stated action labels and structured tool-call selection. The abstract reports 97.1% independent-labeler agreement (Cohen's kappa 0.962), while also finding substantial disagreement between models' stated decisions and tool choices.
**Closes gap:** Addresses an adjacent but necessary problem. It tests the write gate for persistent agent state, not a character-state service itself, and provides no trained affect dynamics, emotional TTS, face/body animation, or full orchestration engine.
**Implementation note:** Its four-way decision boundary can become an explicit pre-commit operation in a pattern-B contract: `persist`, `context_only`, `verify`, or `clarify`, with evaluation covering both the orchestrator's declared decision and the actual state-store call. This prevents uncertain dialogue-derived facts from silently contaminating long-lived character identity, relationships, or goals, but does not supply the expressive neural stack.

## Sweep 2026-08-26 00:25

Eight arXiv-script searches rotated across modular embodied conversational agents, specialized-neural-module orchestration, open virtual-human pipelines, speech-driven full-body animation, dialogue-conditioned gesture, persistent character state, trained affect dynamics, and emotional TTS. Seven returned no results and the eighth returned only the already catalogued ViBES paper. A web-search fallback found two resolvable integrated systems not yet recorded here. Neither closes the full open pattern-B gap; one is explicitly withdrawn, while the other is a practical modular application whose affect, speech, and animation layers are not independently trained open neural services.

### arXiv:2508.18337 — Warm Chat: Diffuse Emotion-aware Interactive Talking Head Avatar with Tree-Structured Guidance
URL: https://arxiv.org/abs/2508.18337
Authors: Haijie Yang, Zhenyu Zhang, Hao Tang, Jianjun Qian, Jian Yang
Categories: Audio and Speech Processing; Artificial Intelligence; Sound

**Claim:** Warm Chat combines LLM dialogue generation with a Transformer-based head-mask generator trained to produce arbitrary-length, temporally consistent talking-head motion across speaking and listening states. Its interactive talking tree stores dialogue relations and the current character emotion at each node, then traverses dialogue history to condition expression synthesis. The abstract claims superior experimental performance but provides no numeric values. The current arXiv record states that the submission is withdrawn at the authors' request for internal research-team reasons.
**Closes gap:** Partially in architecture, but no as an available open foundation. It connects dialogue history, emotion state, and a separately trained facial-motion model, yet does not provide emotional TTS, body animation, durable cross-session character state, or evidence of a learned longitudinal affect-transition module. Withdrawal prevents treating the paper as a load-bearing open component, and the record makes no open-source claim.
**Implementation note:** The talking-tree node is a useful prototype for an utterance-level orchestration message carrying turn topology, historical-affect references, and current expression control into a facial-motion service. A real pattern-B engine would need to replace its in-tree emotion assignment with a trained affect-state service, persist committed state across sessions, and add independently replaceable emotional-speech and body-motion endpoints; this withdrawn work should be used only as an architectural clue unless artifacts are independently verified.

### arXiv:2606.17789 — Mind Companion: An Embodied Conversational Agent for Process-Based Psychotherapy
URL: https://arxiv.org/abs/2606.17789
Authors: Sofie Kamber, Lukas Diebold, Pascal Riachi, Stella Brogna, Andrew Gloster, Rafael Wampfler
Categories: Human-Computer Interaction

**Claim:** Mind Companion integrates parallel real-time fact extraction, psychological-process detection, emotion recognition, and safety monitoring with retrieval-grounded LLM response generation, persistent clinician-accessible analysis state, speech synthesis, and synchronized avatar animation. The paper evaluates three LLM configurations against therapist responses using automated judging and expert evaluation by 11 professional psychotherapists; its abstract reports higher ratings for GPT-5.2 than therapist responses on four qualitative dimensions but gives no numeric scores. The full system description uses persistent databases, Azure Neural Text-to-Speech, a Unity avatar client, and manually rigged open-source character assets.
**Closes gap:** Partially at end-to-end application integration and persistence, but no at the required open pattern-B contract. Its analysis stages are LLM/prompt-oriented rather than demonstrated separately trained longitudinal affect dynamics; Azure speech is proprietary, and the avatar behavior is not presented as independently trained open face/body animation networks. The paper does not establish an open-source release or a typed, replaceable cross-module orchestration contract.
**Implementation note:** This provides a concrete application-level event flow—parallel analyzers commit traceable facts, process labels, emotion state, and safety results; the dialogue service consumes selected state; streaming speech and animation render the response. A pattern-B implementation could preserve that flow while replacing prompt analyses, Azure TTS, and Unity-specific behavior logic with trained open affect, emotional-speech, face-motion, and body-motion services behind versioned interfaces and replayable state commits.

## Sweep 2026-08-26 04:27

Eight arXiv-script searches rotated across modular embodied conversational agents, open virtual-human pipelines, specialized-neural-module orchestration, speech-driven full-body animation, dialogue-conditioned gesture, persistent character state, trained affect dynamics, and emotional TTS. Five returned no results; the persistence and affect queries returned only adjacent work, and the gesture query surfaced one previously uncatalogued trained real-time face/body endpoint. A web-search fallback also surfaced two ECA application studies, but neither added a separately trained module or inspectable orchestration contract strong enough to retain here. No full open pattern-B engine was found.

### arXiv:2603.03282 — MIBURI: Towards Expressive Interactive Gesture Synthesis
URL: https://arxiv.org/abs/2603.03282
Authors: M. Hamza Mughal, Rishabh Dabral, Vera Demberg, Christian Theobalt
Categories: Computer Vision and Pattern Recognition; Graphics

**Claim:** MIBURI presents an online causal framework that generates expressive full-body gestures and facial expressions synchronized with real-time spoken dialogue. It uses body-part-aware gesture codecs to encode hierarchical motion as multi-level discrete tokens, then autoregressively generates those tokens with a two-dimensional causal model conditioned on LLM-based speech-text embeddings. The abstract reports comparative gains in naturalness and contextual alignment but gives no numeric values, and it does not state that code or model weights are open.
**Closes gap:** Partially at the trained face/body-animation layer, but no at the full engine level. It supplies a causal, streaming, separately trained expressive-motion endpoint, while trained longitudinal affect dynamics, emotional TTS, persistent character state, and a shared inspectable orchestration contract remain absent. Lack of an asserted open release also prevents treating it as an immediately usable open component.
**Implementation note:** MIBURI defines a practical pattern-B boundary: stream speech-text embeddings and timing into a replaceable motion service, then receive hierarchical face/body motion tokens quickly enough for live dialogue. A full open engine would need to version that stream alongside committed affect and character-state references, drive emotional speech through a parallel service, and either reproduce this model openly or verify a public release before integration.

## Sweep 2026-08-26 08:28

Ten arXiv-script searches rotated across modular embodied conversational agents, open virtual-human pipelines, speech-driven facial animation, dialogue-conditioned motion, persistent agent state, emotional TTS, trained affect dynamics, character AI, and embodied agent memory. Four returned no results; the rest surfaced twelve candidate papers. After abstract review, eight were retained. Two stand out as the strongest architectural candidates yet: AffAdapt explicitly coordinates a persistent emotional state with dialogue, speech, and embodied output in a single interaction loop, and Self-EmoQ trains an RL-based emotion-determination module that drives streaming emotional TTS. Neither closes the full open pattern-B gap, but together they define two critical missing pieces—a typed orchestration contract with persistent affect state, and a trained (not prompt-based) affect module feeding emotional speech.

### arXiv:2608.22702 — AffAdapt: AFFect-driven ADAPTive AI Personas for Seamless Conversations
URL: https://arxiv.org/abs/2608.22702
Authors: Nishanth Chidambaram, Kaustubh Paliwal, Kayla Hom, Shaoze Zhou, Chen Chen, Manas Satish Bedmutha, Nadir Weibel
Categories: Human-Computer Interaction

**Claim:** AffAdapt coordinates streaming speech recognition, proactive turn-management, persona-grounded response generation, a persistent emotional state, and synchronized embodied output into a single interaction loop. It is demonstrated in the context of practicing sensitive, high-stakes conversations, with an initial case study showing fluid turn management and adaptive persona-consistent behavior. The abstract reports no numeric values and does not assert an open-source release.
**Closes gap:** Partially, and more directly than any prior sweep's integrated system. It explicitly joins dialogue, persistent emotional state, and synchronized embodied output in one inspectable interaction loop. It does not establish separately trained longitudinal affect dynamics (the persistent emotional state is not demonstrated as a trained neural module), full-body animation, or an independently replaceable emotional-TTS service.
**Implementation note:** AffAdapt's interaction loop is the strongest candidate yet for the top-level orchestration contract in a pattern-B engine: it already defines how turn management, persona grounding, persistent affect, and embodied rendering coordinate in real time. A builder would need to replace its prompt-based affect assignment with a trained affect-dynamics service, add a separately trained body-motion endpoint, and verify whether the implementation is publicly released before treating it as an open foundation.

### arXiv:2606.09837 — Self-EmoQ: Plutchik-Guided Value-based Planning to Drive Streaming Emotional TTS
URL: https://arxiv.org/abs/2606.09837
Authors: Yue Zhao, Hongyan Li, Yong Chen, Luo Ji
Categories: Human-Computer Interaction; Artificial Intelligence

**Claim:** Self-EmoQ implements an emotion-planning framework that determines emotion prior to textual generation, grounding downstream emotional TTS in a streaming manner. The framework is a plug-and-play LLM module initialized from pretrained LLMs and trained by reinforcement learning with emotions as actions, using a hybrid reward combining imitation signals with theory-driven Plutchik-wheel scoring. It reports outperforming prompting and finetuning baselines on emotion determination and response quality across DailyDialog, EmoryNLP, IMEOCAP, and MELD, and implements a full streaming pipeline for real-time deployment. The abstract states that codes, cases, and demos are available.
**Closes gap:** Partially at the trained-affect-module layer. It provides a trained (RL-based) emotion-determination module that drives streaming emotional TTS, which is exactly the kind of separately trained affect component the gap calls for. It does not include dialogue cognition, face/body animation networks, persistent character state, or a full orchestration contract.
**Implementation note:** Self-EmoQ can serve as the trained affect-dynamics service in a pattern-B stack: it outputs an emotion determination that feeds both the dialogue LLM and the emotional TTS pipeline. Its plug-and-play LLM-module design suggests a typed interface boundary. A builder would need to add persistent character state, face/body animation services, and a unifying orchestration contract; the claimed open release should be verified before integration.

### arXiv:2608.15110 — CETalk: Continuous Valence-Arousal Control for Audio-Driven 3D Talking Head Generation
URL: https://arxiv.org/abs/2608.15110
Authors: Peng Jia, Li Dai, Zhen Xiao, Xueliang Liu, Jia Li
Categories: Computer Vision and Pattern Recognition; Artificial Intelligence

**Claim:** CETalk proposes an audio-driven 3D facial animation framework conditioned on continuous Valence-Arousal representations for fine-grained emotion control. It includes a Dynamic Emotion Modulation Module that adaptively scales emotional intensity using audio-derived cues, a Multi-Scale Temporal Modeling mechanism that decouples high-frequency articulatory movements from low-frequency emotional dynamics, and a Dynamic Fusion Mechanism integrating multi-scale features via adaptive gating. The authors construct 3D-VA-MEAD, a large-scale dataset with automatically estimated VA annotations and reconstructed 3D facial motions. The abstract reports outperforming state-of-the-art methods in lip-sync accuracy and emotional expressiveness but gives no numeric values, and does not assert an open-source release.
**Closes gap:** Partially at the emotional facial-animation layer. It provides a separately trained facial-animation network with continuous affect conditioning, but does not include dialogue cognition, trained longitudinal affect dynamics, emotional TTS, body animation, persistent character state, or a full orchestration contract.
**Implementation note:** CETalk can serve as the face-animation service in a pattern-B stack: audio plus continuous VA values produce 3D facial motion. Its multi-scale temporal modeling (decoupling articulation from emotion) is a useful internal pattern for any animation service that must separate linguistic from affective timing. A builder would need a trained affect-dynamics module to supply the VA trajectory rather than deriving it ad hoc from audio.

### arXiv:2606.27779 — MindFlow: Harmonizing Cognitive Semantics and Acoustic Dynamics for Facial Animation Generation in Dyadic Conversations
URL: https://arxiv.org/abs/2606.27779
Authors: Hejia Chen, Haoxian Zhang, Xu He, Xiaoqiang Liu, Pengfei Wan, Shoulong Zhang, Shuai Li
Categories: Computer Vision and Pattern Recognition

**Claim:** MindFlow proposes a dual-pathway generative framework inspired by the Ventral-Dorsal neuroscience model, decoupling facial animation into a Ventral module that models raw acoustic streams as a context-aware evolving emotional state chain (capturing paralinguistic nuances and mid-utterance emotional shifts) and a Dorsal module featuring a conditional autoregressive flow matching network for high-fidelity facial motion driven by high-frequency acoustic cues and modulated by emotion states. It reports superior semantic appropriateness and motion naturalness compared to state-of-the-art baselines but gives no numeric values, and does not assert an open-source release.
**Closes gap:** Partially at the facial-animation layer with a novel dual-pathway architecture. The Ventral module's evolving emotional state chain is a step toward learned affect dynamics, but the abstract does not establish it as a separately trained longitudinal affect module, and the system lacks dialogue cognition, emotional TTS, body animation, persistent character state, or a full orchestration contract.
**Implementation note:** MindFlow's Chunk-State approach (modeling raw acoustic streams as an evolving emotional state chain) is a useful pattern for the affect-dynamics service in a pattern-B engine: it shows how to extract continuous emotional trajectory from audio rather than assigning discrete labels per utterance. A builder could adapt this as the affect module, but would need to add dialogue cognition, emotional TTS, body animation, and persistent state under a shared orchestration contract.

### arXiv:2605.25504 — Toward Natural Emotional Text-To-Speech System with Fine-Grained Non-Verbal Expression Control
URL: https://arxiv.org/abs/2605.25504
Authors: Wangzixi Zhou, Bagus Tris Atmaja, Sakriani Sakti
Categories: Audio and Speech Processing

**Claim:** The paper proposes fine-grained non-verbal expression synthesis for emotional TTS, curating and reprocessing female NV utterances from the EARS corpus with a new annotation scheme encoding NV types, frequencies, and durations. Evaluation shows the NV approach significantly improves expressiveness (eMOS 4.20) and emotional recognition accuracy (78.8%), with emotion-specific analysis showing NV cues highly effective for high-arousal emotions (happy 82.5%, fear 82.7%) and sadness (98.3%). The abstract reports minor trade-offs in perceived naturalness.
**Closes gap:** Partially at the emotional-TTS layer. It provides a trained TTS system with fine-grained non-verbal expression control, but does not include dialogue cognition, trained affect dynamics, face/body animation, persistent character state, or a full orchestration contract.
**Implementation note:** This can serve as the emotional-TTS service in a pattern-B stack, with its NV annotation scheme defining a typed control interface (type, frequency, duration) for non-verbal vocalizations. A builder would need a trained affect-dynamics module to supply these controls rather than prompting them, and would need to add dialogue, animation, and persistence services.

### arXiv:2602.23739 — U-Mind: A Unified Framework for Real-Time Multimodal Interaction with Audiovisual Generation
URL: https://arxiv.org/abs/2602.23739
Authors: Xiang Deng, Feng Gao, Yong Zhang, Youxin Pang, Xu Xiaoming, Zhuoliang Kang, Xiaoming Wei, Yebin Liu
Categories: Computer Vision and Pattern Recognition

**Claim:** U-Mind is presented as the first unified system for high-intelligence multimodal dialogue that jointly models language, speech, motion, and video synthesis within a single interactive loop. It implements a Unified Alignment and Reasoning Framework with segment-wise alignment for cross-modal synchronization and Rehearsal-Driven Learning for reasoning preservation. A text-first decoding pipeline performs chain-of-thought planning followed by temporally synchronized generation across modalities, with a real-time video rendering framework conditioned on pose and speech. The abstract reports state-of-the-art performance on multimodal interaction tasks but gives no numeric values, and does not assert an open-source release.
**Closes gap:** Partially at coordinated multimodal generation, but no at the full engine level. It jointly models language, speech, motion, and video, but the abstract does not establish separately trained longitudinal affect dynamics, persistent character state, or independently replaceable module interfaces. The lack of an asserted open release also prevents treating it as an open foundation.
**Implementation note:** U-Mind's segment-wise alignment strategy and text-first decoding pipeline are useful patterns for the synchronization layer in a pattern-B orchestrator. Its real-time video rendering conditioned on pose and speech could serve as the visual output endpoint. To close the gap, a builder would need to replace its unified model with independently trained and replaceable services, add persistent character state, and verify whether the implementation is publicly released.

### arXiv:2605.17583 — AgentSteerTTS: A Multi-Agent Closed-Loop Framework for Composite-Instruction Text-to-Speech
URL: https://arxiv.org/abs/2605.17583
Authors: Bin Kang, Shaoguo Wen, Yang Fan, Shunlong Wu, Junjie Wang, Yulin Li, Junzhi Zhao, Junle Wang, Zhuotao Tian
Categories: Computer Vision and Pattern Recognition

**Claim:** AgentSteerTTS introduces a multi-agent closed-loop framework for intent-faithful expressive control of composite TTS instructions. An adversarial disentanglement agent mitigates speaker-emotion leakage by learning separable identity and emotion-prosody subspaces. A Dual-Stream Anchoring Controller grounds abstract intents using a large-scale acoustic prototype library via a Retrieval Agent and Synthesis Agent. A Fast-Slow Feedback Agent refines output intensity through latent gradient correction and resolves semantic-acoustic mismatches using high-level perceptual critique. The abstract reports consistent and significant improvements on a composite-instruction benchmark and public test sets but gives no numeric values, and does not assert an open-source release.
**Closes gap:** Partially at the expressive-TTS layer. It provides a multi-agent closed-loop framework for fine-grained TTS control, but does not include dialogue cognition, trained affect dynamics, face/body animation, persistent character state, or a full character-engine orchestration contract.
**Implementation note:** Its multi-agent closed-loop architecture (disentrieve-synthesize-feedback) is a useful pattern for the emotional-TTS service in a pattern-B stack, with the acoustic prototype library providing a typed control interface. A builder would need a trained affect-dynamics module to supply the emotion-prosody controls, and would need to add dialogue, animation, and persistence services.

### arXiv:2608.23953 — The Empire, Long Divided, Must Unite: Architectural Convergence in Three LLM Agent Harnesses
URL: https://arxiv.org/abs/2608.23953
Authors: Dai Jiahong
Categories: Software Engineering; Artificial Intelligence

**Claim:** A source-level multi-case study of three open coding-agent harnesses (LangChain deepagents, Earendil pi, DeepSeek dsh) finding convergence toward five recurring elements: a commoditised loop, an append-only replayable session record, model quirks kept as data, progressive disclosure of context, and explicit extension seams. The paper identifies external verifiability (tamper-evident record) as a load-bearing dimension with no convergence and no presence. The abstract reports no numeric values beyond the case-study methodology.
**Closes gap:** Addresses an adjacent but necessary problem. It identifies the convergence patterns for agent harness architecture, not a character-engine orchestration contract, and provides no trained affect dynamics, emotional TTS, face/body animation, or character-state service.
**Implementation note:** The five recurring harness elements (commoditised loop, append-only replayable record, model-quirks-as-data, progressive context disclosure, explicit extension seams) are directly reusable design constraints for a pattern-B orchestrator. The identified absence of external verifiability is a predictive gap: a character-engine contract should include tamper-evident state commits from the start rather than retrofitting them. This paper does not supply any neural module, but it supplies the architectural grammar for the orchestration layer.

## Sweep 2026-08-26 12:30

Ten arXiv-script searches rotated across end-to-end trainable character animation, neural character control, dialogue-aware gesture, multimodal character generation, emotional speech synthesis, affective computing agent architecture, speech-driven facial animation, persona-consistent dialogue, open virtual-human pipelines, persistent memory conversational agents, reinforcement learning emotion dialogue, unified multimodal avatar generation, and character behavior synthesis. Six returned no results; the rest surfaced twenty candidate papers. After abstract review, eight were retained. Two stand out as the strongest architectural candidates yet: EchoAvatar explicitly bridges reactive audio-driven animation with intent-driven LLM control via a tool-call interface, and SELF-EMO trains an emotion-recognition-and-expression module via self-play and RL that could serve as the affect-dynamics service. Neither closes the full open pattern-B gap, but together they define two critical missing pieces—a trained (not prompt-based) affect module for emotional consistency, and a streaming animation endpoint with an explicit LLM control boundary.

### arXiv:2605.28272 — EchoAvatar: Real-time Generative Avatar Animation from Audio Streams
URL: https://arxiv.org/abs/2605.28272
Authors: Bohong Chen, Yumeng Li, Yinglin Xu, Youyi Zheng, Yanlin Weng, Kun Zhou
Categories: Computer Vision and Pattern Recognition

**Claim:** EchoAvatar generates continuous, coherent full-body motion from streaming speech and music with low latency. It uses a unified streaming architecture that synthesizes motion from incremental audio inputs, with a robust training strategy that enforces strong audio dependency and generalizes across conversational speech and rhythmic music without explicit domain labels. It further bridges reactive animation with intent-driven behavior via a tool-call interface that allows upstream LLMs to inject explicit semantic control. The abstract reports outperforming state-of-the-art real-time baselines in motion quality and synchronization while maintaining flexibility for live deployment. Code, pre-trained models, and videos are stated as available.
**Closes gap:** Partially at the trained animation layer with an explicit LLM control boundary. It provides a separately trained, streaming, full-body animation service with a typed tool-call interface for upstream LLM intent. It does not include dialogue cognition, trained longitudinal affect dynamics, emotional TTS, persistent character state, or a full orchestration contract.
**Implementation note:** EchoAvatar can serve as the body-animation service in a pattern-B stack: the dialogue LLM emits tool-calls carrying semantic intent, while the audio stream drives real-time motion. Its explicit tool-call interface is a concrete candidate for the orchestration contract's control plane. A builder would still need to add a trained affect-dynamics module, emotional TTS, face-animation service, and persistent character state; the claimed open release should be verified before integration.

### arXiv:2604.18003 — SELF-EMO: Emotional Self-Evolution from Recognition to Consistent Expression
URL: https://arxiv.org/abs/2604.18003
Authors: Shaowei Zhang, Faqiang Qian, Yan Chen, Ziliang Wang, Kang An, Yong Dai, Mengya Gao, Yichao Wu
Categories: Artificial Intelligence

**Claim:** SELF-EMO is a self-evolution framework grounded in the hypothesis that better emotion prediction leads to more consistent emotional responses. It introduces two auxiliary tasks—emotional understanding and emotional expression—and a role-based self-play paradigm where the model acts as both an emotion recognizer and a dialogue responder. A data flywheel mechanism filters candidate predictions and responses using a smoothed IoU-based reward and feeds selected samples back for continuous self-improvement without external supervision. SELF-GRPO, a reinforcement learning algorithm, stabilizes optimization with multi-label alignment rewards and group-level consistency signals. Experiments on IEMOCAP, MELD, and EmoryNLP report state-of-the-art performance, improving accuracy by +6.33% on Qwen3-4B and +8.54% on Qwen3-8B.
**Closes gap:** Partially at the trained-affect-module layer. It provides a trained (RL-based, self-play-refined) emotion-recognition-and-expression module that could serve as the affect-dynamics service in a pattern-B stack. It does not include dialogue cognition, face/body animation, emotional TTS, persistent character state, or a full orchestration contract.
**Implementation note:** SELF-EMO can serve as the affect-dynamics service: it outputs emotion determinations that feed both the dialogue LLM and downstream expressive modules. Its self-play data flywheel suggests a continuous-improvement loop for affect consistency. A builder would need to add persistent character state, face/body animation, emotional TTS, and a unifying orchestration contract; the claimed improvements should be verified against the published code.

### arXiv:2604.13335 — SEDTalker: Emotion-Aware 3D Facial Animation Using Frame-Level Speech Emotion Diarization
URL: https://arxiv.org/abs/2604.13335
Authors: Farzaneh Jafari, Stefano Berretti, Anup Basu
Categories: Computer Vision and Pattern Recognition

**Claim:** SEDTalker leverages frame-level speech emotion diarization to achieve fine-grained expressive control for speech-driven 3D facial animation. Unlike prior approaches that rely on utterance-level or manually specified emotion labels, it predicts temporally dense emotion categories and intensities directly from speech, enabling continuous modulation of facial expressions over time. The diarized emotion signals are encoded as learned embeddings and used to condition a speech-driven 3D animation model based on a hybrid Transformer-Mamba architecture, allowing effective disentanglement of linguistic content and emotional style while preserving identity and temporal coherence. Evaluation on a large-scale multi-corpus dataset for speech emotion diarization and on EmoVOCA for emotional 3D facial animation reports strong frame-level emotion recognition performance and low geometric and temporal reconstruction errors.
**Closes gap:** Partially at the emotional facial-animation layer. It provides a separately trained facial-animation network conditioned on frame-level emotion predictions from speech, but does not include dialogue cognition, trained longitudinal affect dynamics, emotional TTS, body animation, persistent character state, or a full orchestration contract.
**Implementation note:** SEDTalker can serve as the face-animation service in a pattern-B stack: speech in, frame-level emotion trajectory, 3D facial motion out. Its frame-level emotion diarization is a useful internal pattern for any affect module that must extract continuous emotional trajectory rather than assigning discrete labels per utterance. A builder would need a trained affect-dynamics module to supply the emotion trajectory, plus body animation, emotional TTS, and persistent state.

### arXiv:2607.23840 — STEER: Steerable Dyadic Head Avatars
URL: https://arxiv.org/abs/2607.23840
Authors: Kartik Teotia, Helge Rhodin, Hyeongwoo Kim, Marc Habermann, Christian Theobalt
Categories: Computer Vision and Pattern Recognition

**Claim:** STEER is a controllable 3D dyadic motion prior for reactive conversational head avatars that factorizes conversational behavior into explicit controls for gaze, head rhythm, and emotion, allowing users to steer how an avatar listens, reacts, and engages with a conversation partner. Since temporally aligned annotations for these behaviors are not available in public dyadic corpora, the authors introduce a tracking and annotation pipeline that recovers behavioral pseudo-labels from in-the-wild dyadic video. A causal flow-matching transformer then learns partner-aware target motion conditioned on audio, partner motion, emotion, and the proposed behavioral controls. STEER is embedded in a photorealistic avatar pipeline by extending a Universal Gaussian Head-Avatar Prior with a learned mapping from tracked parametric motion into its avatar-driving space. The abstract reports outperforming recent dyadic motion baselines on motion quality, dynamics, and diversity, remaining competitive on partner coupling, and enabling gaze, head-rhythm, and emotion edits together with an interactive live deployment. Code and dataset annotations are stated as available.
**Closes gap:** Partially at the trained avatar layer with explicit behavioral controls. It provides a separately trained, controllable head-gaze/head-rhythm/emotion service with a typed control interface, but does not include dialogue cognition, trained longitudinal affect dynamics, emotional TTS, full-body animation, persistent character state, or a full orchestration contract.
**Implementation note:** STEER's explicit factorization (gaze, head rhythm, emotion) is a concrete typed control interface for the face-animation service in a pattern-B stack. A builder would need to supply these controls from a trained affect-dynamics module rather than manual steering, and add body animation, emotional TTS, and persistent state.

### arXiv:2606.13304 — ReFree: Towards Realistic Co-Speech Video Generation via Reward-Free RL and Multilevel Speech Guidance
URL: https://arxiv.org/abs/2606.13304
Authors: Salaheldin Mohamed, M. Hamza Mughal, Rishabh Dabral, Christian Theobalt
Categories: Computer Vision and Pattern Recognition

**Claim:** ReFree-S2V is a flow-matching speech-to-portrait animation framework that builds upon a pretrained video generation model to achieve fine-grained speech articulation and high-level expressive cues in speech-driven portrait animation. It introduces a multi-level speech representation capturing phonetic and prosodic information at both local and global granularities, selectively injected into transformer blocks via learnable level selectors, enabling both accurate lip synchronization and natural expressive motion. A novel reward-free reinforcement learning scheme is introduced into flow-matching training to discourage perceptually implausible motion without relying on handcrafted synchronization metrics or reward models. The abstract reports state-of-the-art performance, significantly outperforming existing methods in both quantitative lip-sync accuracy and qualitative human evaluations of naturalness and expressivity.
**Closes gap:** Partially at the trained talking-head layer. It provides a separately trained portrait-animation network with RL-refined naturalness, but does not include dialogue cognition, trained longitudinal affect dynamics, emotional TTS, full-body animation, persistent character state, or a full orchestration contract.
**Implementation note:** ReFree can serve as the face-animation service in a pattern-B stack, with its multi-level speech representation providing a useful internal pattern for separating linguistic from prosodic timing. Its reward-free RL scheme is a useful training recipe for any animation service that must balance lip-sync accuracy with naturalness. A builder would need to add body animation, emotional TTS, persistent state, and a trained affect module.

### arXiv:2607.07824 — From Triggers to Emotions: A CPM-Grounded Appraisal Multi-Agent for Dynamic Emotional Evolution in Persona-Based Dialogue
URL: https://arxiv.org/abs/2607.07824
Authors: Jingyao Cai, Shuaijun Liu, Abdul Rehman, Yutong Guo, Qin Tian, Thomas Dolby, Sue Green, Chantel Cox, Xiaosong Yang
Categories: Multiagent Systems, Artificial Intelligence

**Claim:** CPM-MultiAgent is a Component Process Model (CPM)-grounded emotion evolution multi-agent framework for supporting emotional changes in persona-based dialogue. Instead of treating a character's emotion as a fixed attribute, it represents it as a latent state that is continuously reshaped by dialogue triggers. Through affective trigger extraction, CPM-based collaborative appraisal, and emotion state updating, the framework enables more emotionally consistent role simulation in multi-turn dialogue. Baseline comparisons, ablation studies, human evaluation, and case analyses demonstrate that CPM-MultiAgent effectively models dynamic emotional evolution in emotionally sensitive role-simulation settings.
**Closes gap:** Partially at the affect-dynamics layer. It provides a trained (CPM-grounded) emotion-evolution module that models emotion as a latent state continuously reshaped by dialogue triggers, but does not include dialogue cognition, face/body animation, emotional TTS, persistent character state, or a full orchestration contract.
**Implementation note:** CPM-MultiAgent's trigger→appraisal→state-update loop is a concrete candidate for the affect-dynamics service in a pattern-B engine: it shows how to maintain a continuous emotional trajectory rather than assigning discrete labels per utterance. A builder would need to add face/body animation, emotional TTS, persistent state, and a unifying orchestration contract.

### arXiv:2608.08055 — SodaMem: Evidence-Grounded Temporal Graph Memory for LLM Agents
URL: https://arxiv.org/abs/2608.08055
Authors: Fengrong Wan, Chengcan Wu, Ningtao Lyu
Categories: Artificial Intelligence

**Claim:** SodaMem is an evidence-grounded temporal graph memory that (i) extracts typed FactEvents with mandatory provenance spans, (ii) persists mention time, occurrence time, and validity with SUPERSEDES/CONTRADICTS/UPDATES edges under hybrid lexical-dense indexing, and (iii) answers via a planner-reader loop that gathers citable evidence before composing a final response. On LongMemEval-S, the store-of-record configuration reaches 92.8% accuracy (464/500; best of N=3) at mean $0.00161/question with deepseek-v4-flash. The code is stated as available.
**Closes gap:** Partially at the persistent-state layer. It provides a typed, provenance-grounded, temporally reasoned memory store that could serve as the persistent character-state service, but does not include dialogue cognition, trained affect dynamics, emotional TTS, face/body animation, or a full orchestration contract.
**Implementation note:** SodaMem can serve as the persistent-state service in a pattern-B stack: every committed character-state transition, relationship change, and goal update becomes a typed FactEvent with provenance and temporal validity. Its SUPERSEDES/CONTRADICTS/UPDATES edges are a concrete schema for character-state evolution. A builder would need to add the expressive neural modules and orchestration contract.

### arXiv:2608.01708 — PGMem: Tightly Coupled Persona-Memory Graph for Lifelong Personalized Agents
URL: https://arxiv.org/abs/2608.01708
Authors: Wonjun Choi, Yerim Kim, Yukyung Lee, Susik Yoon
Categories: Computation and Language

**Claim:** PGMem is a heterogeneous persona-memory graph that connects event and persona nodes through typed provenance and evidence edges, keeping each persona signal traceable to the events that support or revise it. At retrieval time, PGMem expands from query-relevant seeds and ranks signals by evidential validity. Across three benchmarks with small language model backbones, PGMem consistently outperforms summary-based, persona-aware, graph-structured, and agentic memory baselines, and improves performance as the context grows. The source code is stated as available.
**Closes gap:** Partially at the persistent-persona layer. It provides a typed, provenance-grounded persona-memory graph that could serve as the persistent character-state service, but does not include dialogue cognition, trained affect dynamics, emotional TTS, face/body animation, or a full orchestration contract.
**Implementation note:** PGMem's persona-memory graph with typed provenance edges is a concrete candidate for the persistent-state service in a pattern-B engine: it keeps character traits traceable to the events that justify them. A builder would need to add the expressive neural modules and orchestration contract.

## Sweep 2026-08-26 16:21

Ten arXiv-script searches rotated across emotional TTS, paralinguistic speech, facial animation, memory architecture, multi-agent dialogue, lifelong learning, and graph-based agent orchestration. Six returned no results; the rest surfaced twenty-one candidate papers. After abstract review, seven were retained. Two stand out as the strongest new components: EmoTra-TTS provides a separately trained emotional-TTS service with explicit intra-utterance Valence-Arousal-Dominance conditioning, and ZifaMem provides an open-sourced structured memory system for persona, preference, and emotional continuity. Neither closes the full open pattern-B gap, but together they define two critical missing pieces—a trained emotional-speech service with a typed affect interface, and a persistent character-state service with provenance-grounded persona tracking.

### arXiv:2608.23791 — EmoTra-TTS: Smooth Intra-Utterance Emotion Transitions for Speech Synthesis
URL: https://arxiv.org/abs/2608.23791
Authors: Tianchi Liu, Zeyang Song, Tianrui Wang, Zhipeng Li, Chenglin Xu, Yiwen Guo
Categories: Audio and Speech Processing; Artificial Intelligence

**Claim:** EmoTra-TTS addresses the misalignment between discrete per-utterance emotion labels and the continuous temporal nature of human affect. It introduces a multi-pass flow blending pipeline for frame-aligned transition audio, dual-stage Valence-Arousal-Dominance (VAD) conditioning that guides prosodic planning in the LLM and acoustic realization in the flow decoder via frame-level VAD embeddings, and direction-magnitude decoupled injection that separates emotion direction from injection magnitude to prevent content degradation. The system adds only +0.43% parameters with no latency overhead, achieves 30%–87% relative improvement on emotion transition quality, and wins 64.4%–79.5% overall in pairwise preference tests against four SOTA baselines and two commercial systems.
**Closes gap:** Partially at the emotional-TTS layer. It provides a separately trained TTS system with explicit, continuous VAD-based affect conditioning and smooth intra-utterance emotion transitions—exactly the kind of trained (not prompt-based) emotional-speech component the gap calls for. It does not include dialogue cognition, trained affect dynamics, face/body animation, persistent character state, or a full orchestration contract.
**Implementation note:** EmoTra-TTS can serve as the emotional-TTS service in a pattern-B stack: a trained affect-dynamics module supplies a continuous VAD trajectory, and the TTS service renders speech with smooth emotional transitions. Its dual-stage VAD conditioning (prosodic planning + acoustic realization) defines a typed control interface that an orchestrator can call per utterance. A builder would still need to add the affect-dynamics module, face/body animation, and persistent character state.

### arXiv:2607.17564 — ZifaMem: Structured Memory for Persona, Preference, and Emotional Continuity in AI Companions
URL: https://arxiv.org/abs/2607.17564
Authors: Jingzhe Fang, Guozhi Xu, Yunfan Cui, Xiaochen Yang, Zhangyu Hua
Categories: Artificial Intelligence; Machine Learning

**Claim:** ZifaMem organizes dialogue into session summaries, episodic memories, and a consolidated user model. Against a deployment-honest comparator that supplies the full raw dialogue history, structured memory raises pooled four-backbone emotional-intelligence scores by 11.4% (95% CI 6.3% to 17.1%), and persona grounding improves on all four backbones (Claude +42% relative). Multi-turn affect context wins a +39% net preference over a single-turn snapshot, whereas an additional emotion state machine yields no measurable gain on any of five endpoints. The ZifaMem SDK, CLI, and portable Agent Skills are open-sourced.
**Closes gap:** Partially at the persistent-state layer. It provides an openly released, structured memory system for persona, preference, and emotional continuity that could serve as the persistent character-state service in a pattern-B stack. It does not include dialogue cognition, trained affect dynamics, emotional TTS, face/body animation, or a full orchestration contract.
**Implementation note:** ZifaMem can serve as the persistent-state service: every committed character-state transition, relationship change, and goal update becomes a structured memory entry with provenance. Its consolidation pipeline (session summaries → episodic memories → user model) is a concrete schema for character-state evolution. A builder would need to add the expressive neural modules and orchestration contract; the open SDK should be verified for integration readiness.

### arXiv:2606.04120 — SaliMory: Orchestrating Cognitive Memory for Conversational Agents
URL: https://arxiv.org/abs/2606.04120
Authors: Kai Zhang, Xinyuan Zhang, Hongda Jiang, Shiun-Zu Kuo, Hyokun Yun, Ejaz Ahmed, Shereen Oraby, Ziyun Li, Sanat Sharma, Ann Lee, Ahmed A Aly, Anuj Kumar, Raffay Hamid, Xin Luna Dong
Categories: Computation and Language; Artificial Intelligence

**Claim:** SaliMory trains a single language model to manage a cognitively structured memory spanning user facts, preferences, and working memory. It introduces a hierarchical stage-wise process reward and reward-decomposed contrastive refinement to provide isolated supervision for distinct memory operations—selective filtering, consolidation, and cue-driven recall—end-to-end. SaliMory cuts memory-attributed failures by one-third, outperforms the state-of-the-art by over 10% in end-to-end accuracy, and more than doubles the Good Personalization rate.
**Closes gap:** Partially at the persistent-state layer. It provides a trained (RL-based) memory-management module that could serve as the persistent character-state service, but does not include dialogue cognition, trained affect dynamics, emotional TTS, face/body animation, or a full orchestration contract.
**Implementation note:** SaliMory's stage-wise process reward for distinct memory operations (filter, consolidate, recall) is a useful training recipe for the persistence tier in a pattern-B engine. A builder would need to wrap it behind a typed state-commit interface and supply the missing expressive neural modules; the claimed improvements should be verified against the published code.

### arXiv:2606.28568 — KM-Speaker: Keypoint-Based Style Control for High-Quality Speech-Driven 3D Facial Animation and Dialogue Localization
URL: https://arxiv.org/abs/2606.28568
Authors: Arthur Josi, Emeline Got, Abdallah Dib, Luiz Gustavo Hafemann, Rafael M. O. Cruz
Categories: Computer Vision and Pattern Recognition; Graphics

**Claim:** KM-Speaker is a keypoint-conditioned flow-based generative framework that provides both global style guidance and frame-level temporal control from reference performances. It disentangles audio-driven lip motion from keypoint-driven upper-face dynamics, together with a global style context preservation mechanism to ensure coherent full-face expressiveness. It consistently outperforms state-of-the-art methods in lip-sync accuracy, style adherence, and expressive temporal control.
**Closes gap:** Partially at the facial-animation layer. It provides a separately trained 3D facial-animation network with explicit style and keypoint control interfaces, but does not include dialogue cognition, trained longitudinal affect dynamics, emotional TTS, body animation, persistent character state, or a full orchestration contract.
**Implementation note:** KM-Speaker can serve as the face-animation service in a pattern-B stack: audio drives lip motion while keypoint controls drive upper-face expression. Its disentanglement of lip motion from upper-face dynamics is a useful internal pattern for separating linguistic from affective timing. A builder would need a trained affect-dynamics module to supply the keypoint controls rather than manual steering, plus body animation, emotional TTS, and persistent state.

### arXiv:2608.01119 — JoyAI-Talker: Full-Duplex Speech Interactive Large Model Built for Empathetic Voice Agents
URL: https://arxiv.org/abs/2608.01119
Authors: Yinhao Bai, Jinming Chen, Yafeng Chen, Wei Deng, Boya Dong, Nan Duan et al.
Categories: Sound

**Claim:** JoyAI-Talker adopts a modular Thinker-Talker architecture with unified speech-text joint training to preserve core textual reasoning while extending to speech-based interaction. Its Talker module uses a text-controllable generation paradigm enabling natural-language instructions to control vocal attributes and localized paralinguistic events (laughter, sighs). The Persona-Adaptive Empathetic Response (PAER) framework extracts non-verbal speaker cues (gender, age, emotional state) from raw audio, incorporates them into the Thinker's chain-of-thought reasoning, and generates context-adaptive responses with fine-grained control over expressiveness. Joy-Duplex provides a state-driven, plug-and-play full-duplex framework for real-time turn control. The system reaches a 0.88 response rate under user interruptions with an extremely low false-trigger rate.
**Closes gap:** Partially at the integrated empathetic-voice-agent layer, but no at the full pattern-B engine level. It is a modular end-to-end speech dialogue system rather than an inspectable contract among independently replaceable trained services. It does not establish separately trained longitudinal affect dynamics, face/body animation networks, persistent character state, or an open orchestration contract.
**Implementation note:** JoyAI-Talker's Thinker-Talker split and PAER framework are a concrete reference for how affect extraction, reasoning, and expressive speech generation can be wired together in one loop. A pattern-B builder could preserve that decomposition while replacing its unified model with independently trained and replaceable services (trained affect dynamics, emotional TTS, face/body animation, persistent state) behind versioned interfaces. The claimed modularity should be verified against any released code.

### arXiv:2608.21156 — Graph Engineering in the Era of LLM Agents: From Individual Intelligence to System Intelligence
URL: https://arxiv.org/abs/2608.21156
Authors: Yuyuan Feng, Zhishang Xiang, Chaobin Yang, Qichao Ma, Zerui Chen, Yujing Zhang et al.
Categories: Information Retrieval; Artificial Intelligence

**Claim:** The paper introduces Graph Engineering as a paradigm for next-generation agent systems, constructing explicit, dynamic, evolving graph structures representing tasks, agents, and system states. It argues that individual agent intelligence faces fundamental limits for tasks requiring heterogeneous expertise, interdependent subtasks, parallel execution, independent verification, and persistent state, and that intelligence must be distributed across specialized agents and organized at the system level. It systematically reviews principles, methodologies, and applications of Graph Engineering for LLM agents.
**Closes gap:** Addresses an adjacent but necessary problem. It provides the architectural grammar for organizing heterogeneous trained modules into a coherent system, not a character-engine orchestration contract itself, and offers no trained affect dynamics, emotional TTS, face/body animation, or character-state service.
**Implementation note:** Graph Engineering's explicit graph structures for tasks, agents, and system states are directly reusable as the orchestration backbone of a pattern-B engine: each trained service (dialogue, affect, TTS, face animation, body animation, persistence) becomes a typed node, and their coordination becomes explicit graph edges. This paper does not supply any neural module, but it supplies the system-intelligence grammar for wiring them together.

### arXiv:2603.15981 — Aligning Paralinguistic Understanding and Generation in Speech LLMs via Multi-Task Reinforcement Learning
URL: https://arxiv.org/abs/2603.15981
Authors: Jingxiang Chen, Minseok Kim, Seong-Gyun Leem, Yin Huang, Rashi Rungta, Zhicheng Ouyang, Haibin Wu et al.
Categories: Computation and Language; Artificial Intelligence

**Claim:** The paper proposes multi-task reinforcement learning with chain-of-thought prompting to elicit explicit affective reasoning in speech LLMs. A paralinguistics-aware speech LLM (PALLM) jointly optimizes sentiment classification from audio and paralinguistics-aware response generation via a two-stage pipeline. Experiments show improvements of 8–12% over supervised baselines and strong proprietary models (Gemini-2.5-Pro, GPT-4o-audio) on Expresso, IEMOCAP, and RAVDESS.
**Closes gap:** Partially at the paralinguistic-affect layer. It provides a trained (RL-based) module for understanding and generating paralinguistic cues, but does not include dialogue cognition, face/body animation, emotional TTS, persistent character state, or a full orchestration contract.
**Implementation note:** PALLM's multi-task RL pipeline is a useful training recipe for the affect-understanding service in a pattern-B stack: it shows how to jointly optimize emotion recognition and paralinguistic-aware generation with explicit affective reasoning. A builder would need to place this behind a typed interface, add face/body animation, emotional TTS, and persistent state, and verify the published code before integration.

## Sweep 2026-08-26 20:28

Ten arXiv-script searches rotated across speech-driven body gesture synthesis, co-speech gesture diffusion, emotional TTS with valence-arousal conditioning, holistic face+body animation, personalized gesture, culture-aware gesture, and time-varying emotional speech. Six returned no results; the rest surfaced twenty-three candidate papers. After abstract review, seven were retained. Two stand out as the strongest new components: UDDETTS provides an openly released emotional TTS service with unified discrete-and-dimensional (ADV) emotion control, and ReCoM sets a new state-of-the-art in trained co-speech body animation with a reported 86.7% improvement in Fréchet Gesture Distance. Neither closes the full open pattern-B gap, but together they define two critical missing pieces—a trained emotional-speech service with a typed dimensional affect interface, and a high-fidelity trained body-motion service with explicit speech synchronization.

### arXiv:2503.21847 — ReCoM: Realistic Co-Speech Motion Generation with Recurrent Embedded Transformer
URL: https://arxiv.org/abs/2503.21847
Authors: Yong Xie, Yunlian Sun, Hongwen Zhang, Yebin Liu, Jinhui Tang
Categories: Graphics; Artificial Intelligence

**Claim:** ReCoM is a Recurrent Embedded Transformer framework for generating high-fidelity, generalizable human body motions synchronized with speech. It integrates Dynamic Embedding Regularization into a Vision Transformer core to explicitly model co-speech motion dynamics, enabling joint spatial-temporal dependency modeling. An iterative reconstruction inference strategy refines motion sequences via cyclic pose reconstruction with classifier-free guidance and temporal smoothing. The paper reports reducing Fréchet Gesture Distance (FGD) from 18.70 to 2.48 (86.7% improvement) on benchmark datasets, achieving state-of-the-art performance. The project page is stated as available.
**Closes gap:** Partially at the trained body-animation layer. It provides a separately trained, high-fidelity co-speech body-motion service with explicit speech synchronization, but does not include dialogue cognition, trained affect dynamics, emotional TTS, facial animation, persistent character state, or a full orchestration contract.
**Implementation note:** ReCoM can serve as the body-animation service in a pattern-B stack: speech audio in, synchronized full-body motion out. Its reported FGD improvement makes it the strongest open body-motion candidate yet. A builder would need to add a trained affect-dynamics module, emotional TTS, face-animation service, and persistent character state; the project page should be verified for open release before integration.

### arXiv:2505.10599 — UDDETTS: Unifying Discrete and Dimensional Emotions for Controllable Emotional Text-to-Speech
URL: https://arxiv.org/abs/2505.10599
Authors: Jiaxuan Liu, Yang Xiang, Han Zhao, Xiangang Li, Yingying Gao, Shilei Zhang, Zhenhua Ling
Categories: Machine Learning; Artificial Intelligence

**Claim:** UDDETTS is a universal LLM framework unifying discrete and dimensional emotions for controllable emotional TTS. It introduces the interpretable Arousal-Dominance-Valence (ADV) space for dimensional emotion description and supports emotion control driven by either discrete emotion labels or nonlinearly quantified ADV values. A semi-supervised training strategy utilizes diverse speech datasets with different types of emotional annotations. The paper reports achieving linear emotion control along three interpretable dimensions with superior end-to-end emotional speech synthesis capabilities. Code and demos are stated as available.
**Closes gap:** Partially at the emotional-TTS layer. It provides a trained TTS system with explicit, continuous ADV-based affect conditioning—exactly the kind of trained (not prompt-based) emotional-speech component the gap calls for. It does not include dialogue cognition, trained affect dynamics, face/body animation, persistent character state, or a full orchestration contract.
**Implementation note:** UDDETTS can serve as the emotional-TTS service in a pattern-B stack: a trained affect-dynamics module supplies continuous ADV values, and the TTS service renders speech with fine-grained emotional control. Its unified discrete-and-dimensional interface is a typed control contract that an orchestrator can call per utterance. A builder would still need to add the affect-dynamics module, face/body animation, and persistent character state; the claimed open release should be verified before integration.

### arXiv:2503.13229 — HoloGest: Decoupled Diffusion and Motion Priors for Generating Holisticly Expressive Co-speech Gestures
URL: https://arxiv.org/abs/2503.13229
Authors: Yongkang Cheng, Shaoli Huang
Categories: Computer Vision and Pattern Recognition

**Claim:** HoloGest is a neural network framework based on decoupled diffusion and motion priors for generating high-quality, expressive co-speech gestures. It leverages large-scale human motion datasets to learn a robust prior with low audio dependency and high motion reliance, enabling stable global motion and detailed finger movements. Implicit joint constraints are integrated with explicit geometric and conditional constraints to enhance generation speed while maintaining quality. A shared embedding space enables gesture-transcription text alignment for semantically correct gesture actions. The paper reports achieving realism close to ground truth. Code, model, and demo are stated as available.
**Closes gap:** Partially at the trained gesture-animation layer. It provides a separately trained, open full-body gesture synthesis service with semantic text alignment, but does not include dialogue cognition, trained affect dynamics, emotional TTS, facial animation, persistent character state, or a full orchestration contract.
**Implementation note:** HoloGest can serve as the gesture-animation service in a pattern-B stack: speech audio and optional text semantics in, full-body gesture motion out. Its decoupled diffusion-and-motion-prior architecture is a useful internal pattern for any animation service that must balance generation speed with motion quality. A builder would need to add a trained affect-dynamics module, emotional TTS, face-animation service, and persistent character state.

### arXiv:2407.12229 — Laugh Now Cry Later: Controlling Time-Varying Emotional States of Flow-Matching-Based Zero-Shot Text-to-Speech
URL: https://arxiv.org/abs/2407.12229
Authors: Haibin Wu, Xiaofei Wang, Sefik Emre Eskimez, Manthan Thakker, Daniel Tompkins, Chung-Hsien Tsai, Canrun Li, Zhen Xiao, Sheng Zhao, Jinyu Li, Naoyuki Kanda
Categories: Audio and Speech Processing; Artificial Intelligence

**Claim:** EmoCtrl-TTS is an emotion-controllable zero-shot TTS that generates highly emotional speech with nonverbal vocalizations (NVs) such as laughter and cries for any speaker. It leverages arousal and valence values, as well as laughter embeddings, to condition a flow-matching-based zero-shot TTS. The system is trained using more than 27,000 hours of expressive data curated via pseudo-labeling. Evaluations demonstrate excellence in mimicking emotions of audio prompts in speech-to-speech translation, capturing emotion changes, expressing strong emotions, and generating various NVs in zero-shot TTS. Demo samples are stated as available.
**Closes gap:** Partially at the emotional-TTS layer. It provides a trained TTS system with continuous arousal/valence conditioning and NV generation, but does not include dialogue cognition, trained affect dynamics, face/body animation, persistent character state, or a full orchestration contract.
**Implementation note:** EmoCtrl-TTS can serve as the emotional-TTS service in a pattern-B stack, with its arousal/valence/laughter embeddings defining a typed control interface for nonverbal vocalizations. Its 27,000-hour training recipe is a useful dataset curation pattern for any emotional TTS service. A builder would need a trained affect-dynamics module to supply the arousal/valence trajectory, plus face/body animation and persistent state.

### arXiv:2601.18451 — 3DGesPolicy: Phoneme-Aware Holistic Co-Speech Gesture Generation Based on Action Control
URL: https://arxiv.org/abs/2601.18451
Authors: Xuanmeng Sha, Liyun Zhang, Tomohiro Mashita, Naoya Chiba, Yuki Uranishi
Categories: Computer Vision and Pattern Recognition; Artificial Intelligence

**Claim:** 3DGesPolicy reformulates holistic gesture generation (full-body motion + facial expressions) as a continuous trajectory control problem via diffusion policy from robotics. It models frame-to-frame variations as unified holistic actions, learning inter-frame motion patterns that ensure spatially and semantically coherent movement trajectories. A Gesture-Audio-Phoneme (GAP) fusion module deeply integrates multi-modal signals for structured, fine-grained alignment between speech semantics, body motion, and facial expressions. Evaluation on BEAT2 reports effectiveness over state-of-the-art methods in generating natural, expressive, highly speech-aligned holistic gestures.
**Closes gap:** Partially at the combined face/body-animation layer. It provides a separately trained service that jointly generates full-body motion and facial expressions from speech, but does not include dialogue cognition, trained affect dynamics, emotional TTS, persistent character state, or a full orchestration contract.
**Implementation note:** 3DGesPolicy can serve as a combined face+body animation service in a pattern-B stack: speech audio in, synchronized full-body motion and facial expressions out. Its GAP fusion module is a useful internal pattern for separating phonetic from semantic alignment. A builder would need to add a trained affect-dynamics module, emotional TTS, and persistent character state.

### arXiv:2606.30001 — SICAGE: Speaker-Independent Culture-Aware Gesture Generation using TED4C-L Dataset
URL: https://arxiv.org/abs/2606.30001
Authors: Ariel Gjaci, Antonio Sgorbissa, Vittorio Murino
Categories: Computer Vision and Pattern Recognition; Graphics

**Claim:** SICAGE is a modular framework for culture-aware co-speech gesture generation that conditions motion synthesis on speaker-independent cultural representations. It learns these representations from audio and text by treating each speaker as a separate domain while imposing invariance across speakers, encouraging culture-discriminative but speaker-identity-independent embeddings. ALaDiT, a real-time diffusion-based gesture generator, efficiently incorporates the learned cultural embeddings. The TED4C-L dataset contains 106 hours of 764 TED speakers from four cultural groups. Experiments report improvements in motion realism, diversity, beat synchronization, semantic relevance, and cultural consistency.
**Closes gap:** Partially at the personalized-animation layer. It provides a trained gesture-generation service with explicit cultural conditioning, but does not include dialogue cognition, trained affect dynamics, emotional TTS, facial animation, persistent character state, or a full orchestration contract.
**Implementation note:** SICAGE's cultural-embedding interface is a typed control signal that can inform character personality in a pattern-B stack: the orchestrator supplies a cultural embedding that conditions gesture style. A builder would need to add a trained affect-dynamics module, emotional TTS, face-animation service, and persistent character state.

### arXiv:2605.06064 — PersonaGesture: Single-Reference Co-Speech Gesture Personalization for Unseen Speakers
URL: https://arxiv.org/abs/2605.06064
Authors: Xiangyue Zhang, Yiyi Cai, Kunhang Li, Kaixing Yang, You Zhou, Zhengqing Li, Xuangeng Chu, Jiaxu Zhang, Haiyang Liu
Categories: Computer Vision and Pattern Recognition

**Claim:** PersonaGesture is a diffusion-based pipeline for single-reference co-speech gesture personalization of unseen speakers. Given target speech and one motion clip from a new speaker, it synthesizes gestures that follow the new utterance while retaining speaker-specific pose choices without per-speaker optimization. Adaptive Style Infusion injects speaker-memory tokens into denoising through zero-initialized residual cross-attention, while Implicit Distribution Rectification applies a length-aware diagonal affine map to correct residual channel-wise moments. Evaluation on BEAT2 and ZeroEGGS reports improved unseen-speaker personalization over collapsed style codes, full-reference attention, and one-clip finetuning. The project page is stated as available.
**Closes gap:** Partially at the personalized-animation layer. It provides a trained gesture-generation service with explicit speaker-style conditioning from a single reference, but does not include dialogue cognition, trained affect dynamics, emotional TTS, facial animation, persistent character state, or a full orchestration contract.
**Implementation note:** PersonaGesture's single-reference personalization is a useful pattern for character-specific animation in a pattern-B stack: a character's motion style is captured from one reference clip and reused across utterances. A builder would need to add a trained affect-dynamics module, emotional TTS, face-animation service, and persistent character state.

## Sweep 2026-08-27 00:30

Ten web-search queries rotated across cognitive embodied agent architectures, full-duplex multimodal models, persistent personality-driven agents, interactive digital human frameworks, real-time conversational talking faces, and agentic robot systems. The arxiv scraper remained in its documented 429 dark state; all results were resolved via web search and abstract fetch. Fourteen candidate papers were identified; eight were retained. One stands out as the strongest architectural candidate yet: Mio explicitly decomposes a digital human into five specialized modules—Thinker, Talker, Face Animator, Body Animator, and Renderer—under one end-to-end framework, making it the closest open approach to a pattern-B engine found in this sweep. It still falls short of the full open pattern-B gap because the modules live inside one unified architecture rather than behind an inspectable contract of independently replaceable trained services, and the abstract does not assert an open release. Three other papers supply critical missing pieces: CEAA provides an implementation-oriented cognitive-architecture template for the orchestration layer; ELLSA demonstrates an open full-duplex SA-MoE architecture that mitigates modality interference across vision, speech, text, and action; and PEPA shows a three-layer personality-driven cognitive architecture deployed on a real robot with persistent autonomous behavior.

### arXiv:2512.13674 — Mio: Towards Interactive Intelligence for Digital Humans
URL: https://arxiv.org/abs/2512.13674
Authors: Yiyi Cai, Xuangeng Chu, Xiwei Gao, Sitong Gong, Yifei Huang, Caixin Kang, Kunhang Li, Haiyang Liu, Ruicong Liu, Yun Liu, Dianwen Ng, Zixiong Su, Erwin Wu, Yuhan Wu, Dingkun Yan, Tianyu Yan, Chang Zeng, Bo Zheng, You Zhou
Categories: Computer Vision and Pattern Recognition

**Claim:** Mio (Multimodal Interactive Omni-Avatar) is an end-to-end framework composed of five specialized modules: Thinker (cognitive core with hierarchical memory and diegetic knowledge graph), Talker (high-fidelity speech with discrete representations), Face Animator (unified listening-speaking framework for responsive facial dynamics), Body Animator (streaming diffusion forcing for real-time body motion from text), and Renderer (parameter-based diffusion transformer for multi-view consistent avatar synthesis). The Thinker uses a competitive self-training loop for offline self-evolution of persona fidelity. The abstract reports superior performance across all evaluated dimensions compared to state-of-the-art methods, and establishes a new benchmark for interactive intelligence. The abstract does not state that code or model weights are openly released.
**Closes gap:** Partially, and more directly than any prior sweep's integrated system. It explicitly decomposes a digital human into dialogue cognition (Thinker), expressive speech (Talker), face animation (Face Animator), body animation (Body Animator), and rendering (Renderer) within one unified framework. It does not establish these as independently replaceable trained services behind an inspectable orchestration contract, and the abstract makes no open-source claim.
**Implementation note:** Mio can serve as the reference blueprint for a pattern-B engine: its five-module decomposition maps exactly onto the gap's required components. A builder would need to extract each module behind versioned interfaces, replace the unified training objective with independently trainable services, add a separately trained longitudinal affect-dynamics module between Thinker and Talker/Face/Body, and verify whether the implementation is publicly released before treating it as an open foundation.

### arXiv:2608.09848 — CEAA: A Cognitive Embodied Agents Architecture for Interactive Computing Systems
URL: https://arxiv.org/abs/2608.09848
Authors: Aimilios Hadjiliasi, Louis Nisiotis
Categories: Artificial Intelligence

**Claim:** CEAA is a modular, implementation-oriented cognitive architecture for deploying embodied Intelligent Virtual Agents in real-time interactive 3D environments. It extends the Sense-Think-Act paradigm with blackboard-based shared knowledge, explicit memory and memory processors, and a Belief-Desire-Intention reasoning model. The architecture separates environmental dynamics, cognitive processes, and embodied execution into three layers and twelve interconnected components, and is demonstrated via a Unity3D prototype with four pedagogical agents in a virtual museum. The abstract reports no numeric values and does not assert an open-source release.
**Closes gap:** Addresses an adjacent but necessary problem. It provides the architectural grammar for the orchestration layer of a pattern-B engine—how to separate perception, reasoning, planning, behavior mapping, and action execution—but offers no trained affect dynamics, emotional TTS, face/body animation networks, or persistent character-state service.
**Implementation note:** CEAA's three-layer, twelve-component decomposition is directly reusable as the orchestration backbone of a pattern-B engine: each trained service (dialogue, affect, TTS, face animation, body animation, persistence) becomes a typed component with explicit interfaces, while the Behavior Mapper translates abstract intentions into concrete animation/speech commands. This paper supplies no neural modules, but it supplies the implementation-oriented architectural grammar for wiring them together.

### arXiv:2510.16756 — ELLSA: End-to-end Listen, Look, Speak and Act
URL: https://arxiv.org/abs/2510.16756
Authors: Siyin Wang, Wenyi Yu, Xianzhao Chen, Xiaohai Tian, Jun Zhang, Lu Lu, Chao Zhang
Categories: Multimodal Interaction / Full-Duplex

**Claim:** ELLSA is the first full-duplex, end-to-end model that simultaneously perceives and generates across vision, text, speech, and action within a single architecture. Its SA-MoE (Self-Attention Mixture-of-Experts) design routes each modality to specialized experts and fuses them through a unified attention backbone, mitigating modality interference. It supports advanced full-duplex behaviors including turn-taking, defective instruction rejection, speaking-while-acting, context-grounded VQA, and action barge-ins. The abstract states that all data, code, and model checkpoints will be released.
**Closes gap:** Partially at the multimodal integration layer, but no at the full pattern-B engine level. It unifies vision, speech, text, and action in one streaming model rather than establishing an inspectable contract among independently replaceable trained services. It does not include dialogue cognition, trained affect dynamics, emotional TTS, face/body animation, or persistent character state.
**Implementation note:** ELLSA's SA-MoE architecture is a concrete candidate for the internal design of individual pattern-B services: the attention-connected expert pattern shows how to handle multiple modalities within one service while preserving cross-modal information flow. Its open release (code + checkpoints) makes it a verifiable foundation for the multimodal processing layer. A builder would still need to add the missing expressive modules and orchestration contract.

### arXiv:2603.00117 — PEPA: a Persistently Autonomous Embodied Agent with Personalities
URL: https://arxiv.org/abs/2603.00117
Authors: Kaige Liu, Yang Li, Lijun Zhu, Weinan Zhang
Categories: Embodied AI / Cognitive Architecture

**Claim:** PEPA is a three-layer cognitive architecture for persistent autonomy: Sys3 autonomously synthesizes personality-aligned goals and refines them via episodic memory and daily self-reflection; Sys2 performs deliberative reasoning to translate goals into executable plans; Sys1 grounds the agent in sensorimotor interaction. Validated through real-world deployment on a quadruped robot in a multi-floor office building, operating without fixed task specifications. Quantitative analysis across five distinct personality prototypes demonstrates stable, trait-aligned behaviors. Code and demo videos are stated as available.
**Closes gap:** Partially at the persistent-character-state and personality-layer. It provides a deployed, open three-layer architecture with personality-driven goal generation and episodic memory, but does not include dialogue cognition, trained affect dynamics, emotional TTS, face/body animation, or a full character-engine orchestration contract.
**Implementation note:** PEPA can serve as the persistent-state and personality tier in a pattern-B stack: its Sys3 layer (personality-aligned goal generation + episodic memory + self-reflection) is exactly the kind of durable character-state service the gap calls for. A builder would need to connect its goal outputs to a dialogue LLM, add trained affect dynamics, emotional TTS, and face/body animation services, and wrap the whole stack in an inspectable orchestration contract.

### arXiv:2601.00664 — Avatar Forcing: Real-Time Interactive Head Avatar Generation for Natural Conversation
URL: https://arxiv.org/abs/2601.00664
Authors: Taekyung Ki, Sangwon Jang, Jaehyeong Jo, Jaehong Yoon, Sung Ju Hwang
Categories: Computer Vision; Interaction

**Claim:** Avatar Forcing is a real-time interactive head avatar framework based on diffusion forcing that processes multimodal user inputs (audio, motion) causally with low latency (~500ms), achieving 6.8x speedup over baseline. It introduces a direct preference optimization method using synthetic losing samples (constructed by dropping user conditions) for label-free learning of expressive interaction. Human evaluation shows >80% preference against the strongest baseline. The abstract states that code and pre-trained model weights will be released.
**Closes gap:** Partially at the real-time interactive face-animation layer. It provides a trained, open facial-animation service with explicit reactive listening/speaking behavior, but does not include dialogue cognition, trained affect dynamics, emotional TTS, body animation, persistent character state, or a full orchestration contract.
**Implementation note:** Avatar Forcing can serve as the face-animation service in a pattern-B stack: it takes user audio/motion as input and produces reactive, expressive facial motion with ~500ms latency. Its causal diffusion-forcing design is a useful internal pattern for any animation service that must react to live multimodal inputs. A builder would need to add the missing cognitive, speech, body, and persistence modules.

### arXiv:2606.31088 — InterTalk: Towards Flexible, Natural, Efficient Interaction for Conversational Talking Face Generation
URL: https://arxiv.org/abs/2606.31088
Authors: Baiqin Wang, Sen Chen, Jiankuo Zhao, Xiangyu Liu, Zhen Lei, Xiangyu Zhu
Categories: Computer Vision; Interaction

**Claim:** InterTalk is a framework for multi-person conversational talking face generation that simultaneously achieves flexibility (multi-round, arbitrary participant count), naturalness (coherent motion and non-verbal feedback), and efficiency (real-time at 30 FPS). It uses a Responsive Context Encoder to integrate all participants' motion and audio cues, an Interactive Motion Generator with disentangled facial components, and an iterative generation strategy for coherent multi-party interactions. A new multi-person conversational dataset with 3D face-based augmentation is constructed. The abstract reports superior interaction quality while maintaining real-time performance.
**Closes gap:** Partially at the multi-party conversational face-animation layer. It provides a trained service for coordinated multi-participant facial animation, but does not include dialogue cognition, trained affect dynamics, emotional TTS, body animation, persistent character state, or a full orchestration contract.
**Implementation note:** InterTalk's Responsive Context Encoder and disentangled facial-motion architecture are useful patterns for the face-animation service in a pattern-B stack, particularly for multi-character scenes. Its iterative generation strategy for coherent multi-party interaction is a concrete coordination protocol that an orchestrator could adopt. A builder would need to add the missing cognitive, speech, body, and persistence modules.

### arXiv:2507.00472 — ARIG: Autoregressive Interactive Head Generation for Real-time Conversations
URL: https://arxiv.org/abs/2507.00472
Authors: Ying Guo, Xi Liu, Cheng Zhen, Pengfei Yan, Xiaoming Wei
Categories: Computer Vision; Interaction

**Claim:** ARIG is a frame-wise autoregressive framework for real-time interactive head generation. It models motion prediction as a non-vector-quantized AR process using diffusion in continuous space, and introduces Interactive Behavior Understanding (dual-track dual-modal short-range/long-range context) and Conversation State Understanding (interruption, feedback, pause, etc.) modules. The abstract reports extensive experimental verification of effectiveness but gives no numeric values and does not assert an open-source release.
**Closes gap:** Partially at the real-time interactive face-animation layer. It provides a trained facial-animation service with explicit conversational-state conditioning, but does not include dialogue cognition, trained affect dynamics, emotional TTS, body animation, persistent character state, or a full orchestration contract.
**Implementation note:** ARIG's Interactive Behavior Understanding and Conversation State Understanding modules are useful internal patterns for the face-animation service in a pattern-B engine: they show how to extract conversational state (interruption, feedback, pause) from dual-track audio/motion signals and condition animation accordingly. A builder would need to add the missing cognitive, speech, body, and persistence modules, and verify the implementation status.

### arXiv:2511.12662 — Hi-Reco: High-Fidelity Real-Time Conversational Digital Humans
URL: https://arxiv.org/abs/2511.12662
Authors: Hongbin Huang, Junwei Li, Tianxin Xie, Zhuang Li, Cekai Weng, Yaodong Yang, Yue Luo, Li Liu, Jing Tang, Zhijing Shao, Zeyu Wang
Categories: Computer Vision; Human-Computer Interaction

**Claim:** Hi-Reco is a high-fidelity real-time conversational digital human system combining photorealistic 3D avatar rendering, persona-driven expressive speech synthesis, and knowledge-grounded dialogue generation with an asynchronous execution pipeline. It supports wake-word detection, emotionally expressive prosody, and context-aware response generation via retrieval-augmented generation with history augmentation and intent-based routing. The abstract reports no numeric values and does not assert an open-source release.
**Closes gap:** Partially at end-to-end application integration, but no at the required open pattern-B contract. Its analysis stages are LLM/prompt-oriented rather than demonstrated separately trained longitudinal affect dynamics; the TTS is persona-driven but not asserted as an independently replaceable trained emotional-speech service; the body animation uses a fixed gesture library rather than a trained motion network. The paper does not establish an open-source release or a typed, replaceable cross-module orchestration contract.
**Implementation note:** Hi-Reco's asynchronous execution pipeline (chunked TTS → parallel face/motion generation → real-time synchronization) is a concrete reference for the low-latency coordination layer in a pattern-B engine. Its persona-driven TTS and RAG-based dialogue can inform the design of those services, but a builder would need to replace prompt-based analyses, the fixed gesture library, and the unified pipeline with trained open affect, emotional-speech, face-motion, and body-motion services behind versioned interfaces.

## Sweep 2026-08-27 04:15

Eight arXiv-script searches rotated across modular embodied conversational agents, specialized-neural-module orchestration, open virtual-human pipelines, conversational face/body animation, dialogue-conditioned motion, persistent character state, trained affect dynamics, and full-duplex digital humans. Five returned no relevant results; the others surfaced four candidates, of which one previously uncatalogued animation endpoint was retained. Four web-search fallbacks found one additional resolvable open streaming endpoint. No open system in this sweep combines dialogue cognition, separately trained longitudinal affect dynamics, emotional TTS, face/body animation networks, and persistent character state behind one inspectable orchestration contract.

### arXiv:2602.00702 — JoyStreamer: Unlocking Highly Expressive Avatars via Harmonized Text-Audio Conditioning
URL: https://arxiv.org/abs/2602.00702
Authors: Ruikui Wang, Jinheng Feng, Lang Tian, Huaishao Luo, Chaochao Li, Liangbo Zhou, Huan Zhang, Youzheng Wu, Xiaodong He
Categories: Computer Vision and Pattern Recognition

**Claim:** JoyStreamer trains a long-duration avatar-video generator with twin-teacher transfer of text controllability and audio-visual synchronization, plus denoising-timestep-dependent modulation of audio and text conditioning to reduce conflicts between modalities. It generates temporally coherent full-body motion, camera movement, background transitions, human-object interactions, lip synchronization, and multi-person dialogue scenes. The abstract reports outperforming OmniHuman-1.5 and KlingAvatar 2.0 by GSB evaluation but gives no numeric values; it links video samples but does not assert that code or weights are open.
**Closes gap:** Partially at the expressive visual-output layer, but no at the engine level. It jointly generates full avatar video rather than exposing independently replaceable face- and body-animation services, and it provides no dialogue LLM, trained longitudinal affect dynamics, emotional TTS, persistent character state, or inspectable orchestration contract.
**Implementation note:** JoyStreamer's timestep-dependent arbitration between text semantics and audio timing is a concrete synchronization pattern for a pattern-B visual endpoint: the orchestrator could send semantic action directives alongside the emotional-speech stream without allowing either condition to dominate every generation phase. A builder would still need to reproduce or open the model, separate reusable face/body outputs from rendered video, and supply dialogue, learned affect, speech, and persistent-state services.

### arXiv:2608.13602 — Omni-LiveAvatar: Minute-Level Real-Time Streaming Joint Audio-Video Avatar Generation
URL: https://arxiv.org/abs/2608.13602
Authors: Lunjie Zhu, Xingtong Ge, Fangyu Lin, Yi Zhang, Zhening Liu, Mengfei Li, Yumeng Zhang, Guanglu Song, Yu Liu, Jun Zhang
Categories: Multimedia; Computer Vision and Pattern Recognition; Sound

**Claim:** Omni-LiveAvatar distills a bidirectional joint audio-video diffusion model into a few-step autoregressive generator for minute-level real-time streaming. A synchronized audio-video long-short-term memory preserves global consistency under bounded memory, while hierarchical rolling prompt planning supports coherent semantic evolution and prompt transitions. The abstract reports a 33× generation speedup over its LTX-2 teacher on one NVIDIA H200 and improved visual quality, audio quality, cross-modal synchronization, and human fidelity over accelerated baselines. It states that code is available.
**Closes gap:** Partially at the open streaming audiovisual-generation layer. It supplies a released joint speech-and-avatar endpoint with bounded temporal memory, but not a dialogue orchestrator, separately trained longitudinal affect dynamics, persistent character identity/relationship/goal state, independently replaceable emotional TTS and face/body animation networks, or a shared inspectable character-engine contract.
**Implementation note:** Omni-LiveAvatar can serve as an open rendered-output worker downstream of a pattern-B orchestrator, with rolling prompt plans and bounded audiovisual memory defining explicit per-chunk inputs and continuity state. Its internal memory must not be mistaken for durable character state: a real engine still needs versioned persona, relationship, goal, and affect commits upstream, plus replaceable speech and animation boundaries if module-level inspection is required.
