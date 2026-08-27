# Gap 2 — No shared multi-modal character benchmark

Five axes a character-complete suite would need: (1) dialogue quality, (2) affective
consistency over long time horizons, (3) animation fidelity, (4) latency, (5) personality
stability. Agent benchmarks exist; character-complete suites do not.

## Sweep 2026-08-25 04:00

Six searches run this tick (persona-consistency benchmark, long-horizon dialogue eval,
personality stability, affective-consistency metric, talking-head eval metrics, embodied
latency). Nine abstracts fetched for cited papers; scraper stayed alive.

**Tick verdict:** still no joint suite. Best partial coverage found so far is
EvolvingWorld's trajectory-level LLM-as-Judge protocol (10 dimensions / 20 metrics) and
the adversarial RPLA stress-testing platform — both text-only, both silent on animation
and real-time latency. Latency appears only inside a memory-management harness
(AgentMemBench) and a game-agent benchmark (GameWorld), never tied to character fidelity.
The five-axis space remains disjoint: each paper covers at most two axes and leaves the
other three open.

### arXiv:2608.03166 — Adversarial Stress Testing of Role-Playing Language Agents using Multi-Agent Evaluation
URL: https://arxiv.org/abs/2608.03166
Authors: Saqib Shouqi, Abdullah Nazly, Januki Wanniarachchi, Ravisha De Alwis
Categories: Artificial Intelligence

**Claim:** Open-source multi-agent platform adversarially stress-tests role-playing
agents over multi-turn dialogue with an Interrogator, Target, and Judging agent scoring
role fidelity, drift, ethical deviation, and consistency. Reports robustness-score drops
of 0.17–0.20 points under multi-strategy attack across three LLM families; automated
judging reaches r = 0.82 human alignment, Fleiss' κ = 0.71.
**Closes gap:** partially — covers personality stability under pressure (axis 5) and
dialogue quality (axis 1); the judging rubric includes "drift" which brushes long-horizon
affective consistency (axis 2) but only via adversarial probes, not longitudinal natural
interaction.
**Implementation note:** A pattern-B builder could adopt its judge-agent scoring layer
directly as the stability axis of a character suite; it contributes nothing on animation
fidelity or end-to-end latency.
Covers: 1, 2 (partial), 5. Leaves open: 3, 4.

### arXiv:2603.19313 — Memory-Driven Role-Playing: Evaluation and Enhancement of Persona Knowledge Utilization in LLMs
URL: https://arxiv.org/abs/2603.19313
Authors: Kai Wang, Haoyang You, Yang Zhang, Zhongjie Wang
Categories: Computation and Language, Artificial Intelligence

**Claim:** MREval framework grades four memory-driven role-playing abilities (Anchoring,
Recalling, Bounding, Enacting) plus MRPrompt and the bilingual MRBench, evaluated across
12 LLMs. Reports that MRPrompt lets Qwen3-8B match much larger closed models; no numeric
claim quoted here beyond that comparative statement.
**Closes gap:** no — pure text-side persona-utilization diagnosis (axis 1, weakly 5).
No time-horizon affect tracking, no embodiment.
**Implementation note:** Its four-stage ability decomposition is a usable taxonomy for
the dialogue-quality axis of a character-complete suite; nothing more.
Covers: 1, (5 indirectly). Leaves open: 2, 3, 4.

### arXiv:2603.03915 — Rethinking Role-Playing Evaluation: Anonymous Benchmarking and a Systematic Study of Personality Effects
URL: https://arxiv.org/abs/2603.03915
Authors: Ji-Lun Peng, Yun-Nung Chen
Categories: Computation and Language, Artificial Intelligence

**Claim:** Shows anonymizing characters degrades role-play performance across multiple
benchmarks, proving current RP evaluations leak training-memory character recognition;
personality-description augmentation consistently improves anonymous-setting fidelity.
No specific numbers stated in abstract.
**Closes gap:** addresses adjacent problem — an evaluation-methodology critique (avoid
character-memorization confounds) rather than a benchmark itself. Relevant to axis 1 and
axis 5 protocol design.
**Implementation note:** Any future character benchmark should adopt anonymous-persona
protocol or its results are confounded by memorized characters. This is a required
design constraint, not coverage.
Covers: 1, 5 (protocol-level). Leaves open: 2, 3, 4.

### arXiv:2607.17250 — EvolvingWorld: An Open-Schema Framework for Co-Evolving Role-Play Agents and World Model in Interactive Literary World
URL: https://arxiv.org/abs/2607.17250
Authors: Qing Zong, Yue Guo, Mengxin Yang, Yiwen Guo, Yangqiu Song
Categories: Computation and Language

**Claim:** Framework + benchmark for character/world co-evolution over long horizons:
persistent profile evolution, 7 tasks, dataset from 57 books (138,596 training samples,
222 test snapshots), and a trajectory-level LLM-as-Judge evaluation spanning 10 dimensions
and 20 metrics. Reports improved long-horizon simulation coherence; abstract states no
specific metric values.
**Closes gap:** partially — strongest long-horizon candidate found: persistent state +
trajectory-level judging touches axes 1, 2 (as coherence, not affect per se), and 5
(profile evolution stability). Entirely text/literary; no rendering, no latency budget.
**Implementation note:** The trajectory-level multi-dimensional judge protocol is the
closest existing template for a character-complete suite's longitudinal spine; a builder
would need to add animation and latency axes to it. Note overlap with Gap 3 (open-schema
state) — flag for cross-reference.
Covers: 1, 2 (partial), 5. Leaves open: 3, 4.

### arXiv:2608.00009 — AgentMemBench: A Systematic Benchmark for Evaluating Long-Term Memory Management Strategies in Conversational AI Agents
URL: https://arxiv.org/abs/2608.00009
Authors: Ahmed Cherif
Categories: Computation and Language, Artificial Intelligence

**Claim:** Unified benchmark comparing five memory strategies on LoCoMo/MSC/
MultiDoc2Dial with Recall@k, MRR, nDCG@k, Answer F1, faithfulness, Memory Footprint,
and **Latency** over 491 annotated turns. Key numeric result: external KV store Recall@5
0.792 overall and 0.573 on long-range LoCoMo while windowing/graph/compression strategies
collapse to ≤0.005; footprint cost ~5,100 vs ~300 tokens. Also evaluates MemGPT/Letta and
HippoRAG in the same harness.
**Closes gap:** addresses adjacent problem — first paper this tick to measure latency
(axis 4) in a conversational-character-relevant harness, but latency is retrieval
latency, not end-to-end character-response latency; no affect, no embodiment.
**Implementation note:** Provides a ready-made latency-measurement methodology and the
evidence that recency windows fail at character-memory long horizons — necessary
infrastructure for axis 4, not a character suite.
Covers: 4 (partial), 1 (recall/F1 slice). Leaves open: 2, 3, 5.

### arXiv:2606.26654 — SocialPersona: Benchmarking Personalized Profiling and Response with Multimodal Social-Media Context
URL: https://arxiv.org/abs/2606.26654
Authors: Qinkai Zhang, Yanyan Zhao, Xin Lu, Yulin Hu, Pengtao Han, Bing Qin
Categories: Computation and Language, Human-Computer Interaction

**Claim:** Benchmark from 171 longitudinal social-media timelines (text + images +
timestamps, 2,597 human-verified preference tags) testing multimodal profile inference
and profile-aligned response generation. Reports performance drops on fine-grained/recent
interests and further degradation when inferred profiles must drive dialogue; no exact
values given in abstract.
**Closes gap:** no — user-modeling personalization, not character embodiment. Its
longitudinal multimodal preference-tracking is methodologically adjacent to axis 2
(stable vs recent interests ≈ trait vs mood separation).
**Implementation note:** Its stable-vs-recent interest split is directly reusable as the
measurement design for separating personality stability (axis 5) from momentary affect
(axis 2) in a character suite.
Covers: 2/5 (methodology only, user-facing). Leaves open: 1 (partially), 3, 4.

### arXiv:2605.16996 — Evaluation Drift in LLM Personality Induction: Are We Moving the Goalpost?
URL: https://arxiv.org/abs/2605.16996
Authors: Prateek Rajput, Yewei Song, Iyiola E. Olatunji, Jacques Klein, Tegawendé F. Bissyandé
Categories: Computation and Language

**Claim:** Fine-tunes LLMs toward Big Five targets from essays, evaluates with IPIP-NEO:
post-training reduces questionnaire variance across rephrasings (stability improves),
but full five-trait accuracy remains near chance even when single traits improve.
Argues for scenario-grounded or interactive elicitation datasets.
**Closes gap:** addresses adjacent problem — a negative result about personality
measurement instruments (IPIP-NEO self-report) rather than behavior. Directly relevant
to axis 5: warns that questionnaire-based personality-stability metrics in any future
benchmark may be measuring prompt sensitivity, not stable character.
**Implementation note:** A character benchmark's personality-stability axis should use
behavioral elicitation over interaction, not questionnaire scores; this paper supplies
the justification and the failure mode to avoid.
Covers: 5 (instrument critique). Leaves open: 1, 2, 3, 4.

### arXiv:2410.11041 — Beyond Fixed Topologies: Unregistered Training and Comprehensive Evaluation Metrics for 3D Talking Heads
URL: https://arxiv.org/abs/2410.11041
Authors: Federico Nocentini, Thomas Besnier, Claudio Ferrari, Sylvain Arguillere, Mohamed Daoudi, Stefano Berretti
Categories: Computer Vision and Pattern Recognition

**Claim:** First topology-agnostic 3D talking-head framework (heat-diffusion features,
works on unregistered meshes including real scans), plus proposed new lip-sync evaluation
metrics critiquing the limitations of current ones. Code and pretrained model released.
No specific metric values stated in abstract.
**Closes gap:** partially — the only animation-fidelity (axis 3) entry this tick. Covers
face animation quality measurement; no body, no coupling to dialogue content or affect,
no latency reporting.
**Implementation note:** Supplies metric designs for the animation-fidelity axis of a
suite; a full character benchmark would need to extend them to expressive/affect-driven
animation and tie scores to the same dialogue stream the text axes score.
Covers: 3 (partial). Leaves open: 1, 2, 4, 5.

### arXiv:2604.07429 — GameWorld: Towards Standardized and Verifiable Evaluation of Multimodal Game Agents
URL: https://arxiv.org/abs/2604.07429
Authors: Mingyu Ouyang, Siyuan Hu, Kevin Qinghong Lin, Hwee Tou Ng, Mike Zheng Shou
Categories: Computer Vision and Pattern Recognition, Artificial Intelligence

**Claim:** Benchmark of 34 browser games / 170 verifiable tasks for multimodal agents
with two interfaces (computer-use controls vs semantic action parsing), state-verifiable
outcome metrics, rerun-robustness checks, and dedicated studies of **real-time
interaction**, context-memory sensitivity, and action validity across 18 model-interface
pairs. Best agent remains far below human capability.
**Closes gap:** addresses adjacent problem — closest thing to a standardized embodied
multimodal harness with real-time constraints, but it measures game task success, not
character qualities (no persona, affect, or animation-fidelity axes).
**Implementation note:** Its verifiable-state + real-time-interaction study design is a
model for how a character suite could enforce latency budgets (axis 4) in closed-loop
play rather than offline scoring.
Covers: 4 (partial), 1 (task success ≠ dialogue quality). Leaves open: 2, 3, 5.

## Running synthesis (this file's purpose)

After one full sweep: the five axes are served by five disjoint literatures.
- Axis 1+5 best combined coverage: EvolvingWorld (2607.17250), RPLA stress-test (2608.03166)
- Axis 2: nobody measures affective consistency longitudinally; nearest neighbors are
  SocialPersona's stable-vs-recent design and EvolvingWorld's coherence metrics.
- Axis 3: talking-head metrics exist (2410.11041) but are decoupled from all text axes.
- Axis 4: latency measured only in memory-retrieval (AgentMemBench) and game-action
  (GameWorld) contexts, never against character fidelity.
- Confirmed gap thesis: **no paper jointly scores even three of the five axes**, let
  alone all five. Next ticks should probe: emotion-recognition-in-conversation
  benchmarks, avatar gesture-speech synchrony metrics, and streaming TTS latency
  benchmarks.

## Sweep 2026-08-25 16:15

Queries run (searches only, then targeted abstract fetches): role-play persona
consistency benchmark; long-horizon dialogue evaluation; talking head animation
evaluation metric; personality stability conversational agent; embodied agent
latency real-time; affective consistency metric. Six searches + seven abstract
fetches, all within rate budget.

### arXiv:2603.03915 — Rethinking Role-Playing Evaluation: Anonymous Benchmarking and a Systematic Study of Personality Effects
URL: https://arxiv.org/abs/2603.03915
Authors: Ji-Lun Peng, Yun-Nung Chen
Categories: cs.CL, cs.AI

**Claim:** Existing RPA benchmarks leak character identity via well-known names,
letting models pass on training memory rather than role-playing skill. Anonymizing
characters degrades performance across multiple benchmarks; personality-description
augmentation improves role fidelity in anonymous settings. No specific numeric
results are stated in the abstract beyond directional findings.
**Closes gap:** partially — hardens the *personality stability* and dialogue-quality
axes by removing the memorization confound that invalidates current persona scores.
**Implementation note:** an anonymous-persona protocol any character suite should
adopt as a control condition; still text-only, no affect/animation/latency axes.

### arXiv:2603.19313 — Memory-Driven Role-Playing: Evaluation and Enhancement of Persona Knowledge Utilization in LLMs
URL: https://arxiv.org/abs/2603.19313
Authors: Kai Wang, Haoyang You, Yang Zhang, Zhongjie Wang
Categories: cs.CL, cs.AI

**Claim:** Introduces MREval (four memory-driven abilities: Anchoring, Recalling,
Bounding, Enacting), MRPrompt, and MRBench (bilingual zh/en). Across 12 LLMs,
MRPrompt lets Qwen3-8B match much larger closed models; memory gains propagate to
response quality. Numeric claim: 12 LLMs evaluated; no per-model numbers in abstract.
**Closes gap:** partially — the most granular open instrument so far for persona
consistency *within long open-ended dialogue* (two of five axes: dialogue quality +
personality stability), but purely textual.
**Implementation note:** the Anchoring/Bounding/Enacting decomposition is directly
reusable as the personality-stability sub-score of a five-axis character suite.

### arXiv:2608.03166 — Adversarial Stress Testing of Role-Playing Language Agents using Multi-Agent Evaluation
URL: https://arxiv.org/abs/2608.03166
Authors: Saqib Shouqi, Abdullah Nazly, Januki Wanniarachchi, Ravisha De Alwis
Categories: cs.AI

**Claim:** Multi-agent adversarial platform (Interrogator / Target / Judge) scoring
role fidelity, drift, ethical deviation, consistency over multi-turn pressure.
Multi-strategy attack lowers robustness scores by 0.17–0.20 points on average;
judge–human alignment r = 0.82, Fleiss' κ = 0.71 across Llama-3.3-70B, GPT-4o-mini,
Claude-3.5-Haiku. Open-source release.
**Closes gap:** partially — measures *drift under stress*, i.e. temporal personality
stability with numbers and reproducible harness; misses animation fidelity entirely,
reports no latency axis, and affect is only implicit in "emotional manipulation"
attacks.
**Implementation note:** its judge-agent scoring rubric is the first candidate
open metric for axis-5 stability-over-time under perturbation.

### arXiv:2608.00009 — AgentMemBench: A Systematic Benchmark for Evaluating Long-Term Memory Management Strategies in Conversational AI Agents
URL: https://arxiv.org/abs/2608.00009
Authors: Ahmed Cherif
Categories: cs.CL, cs.AI

**Claim:** Unified harness comparing five memory strategies on LoCoMo/MultiDoc2Dial/
MSC with Recall@k, MRR, nDCG@k, Answer F1, LLM-judge faithfulness, Memory Footprint,
and **Latency** over 491 annotated turns. External key-value store dominates quality
(Recall@5 0.792); on long-horizon LoCoMo all non-dense strategies collapse
(Recall@5 ≤ 0.005 vs EKV 0.573). Includes latency and footprint as first-class metrics.
**Closes gap:** partially — rare example of a dialogue benchmark that *prices in*
the latency axis alongside quality; but latency here is retrieval latency of memory
backends, not end-to-end character-rendering latency, and there is no affect or
animation axis.
**Implementation note:** establishes the pattern a full suite needs: fixed harness,
competing strategies, quality+cost reported together. Its long-horizon collapse
numbers quantify why recency-windowed character state fails at scale.

### arXiv:2606.26654 — SocialPersona: Benchmarking Personalized Profiling and Response with Multimodal Social-Media Context
URL: https://arxiv.org/abs/2606.26654
Authors: Qinkai Zhang, Yanyan Zhao, Xin Lu, Yulin Hu, Pengtao Han, Bing Qin
Categories: cs.CL, cs.AI, cs.HC

**Claim:** Benchmark recovering user preferences from longitudinal multimodal
timelines (171 users, 2,597 human-verified tags, text+images+timestamps),
separating stable vs recent interests; models degrade on fine-grained/recent
interests and further when profiles must drive dialogue. No other numeric claim
in abstract.
**Closes gap:** addresses adjacent problem — multimodal *long-horizon* persona
inference, but from social media, not interactive characters; no animation,
latency, or affective-consistency axes.
**Implementation note:** its stable-vs-recent interest split suggests how a
character benchmark could test which parts of a persona should persist vs drift.

### arXiv:2308.16041 — From Pixels to Portraits: A Comprehensive Survey of Talking Head Generation Techniques and Applications
URL: https://arxiv.org/abs/2308.16041
Authors: Shreyank N Gowda, Dheeraj Pandey, Shashank Narayana Gowda
Categories: cs.CV

**Claim:** Survey organizing talking-head generation into four families and
explicitly analyzing the gap between common quantitative metrics and perceptual
quality; compares public models on inference time, memory, and human-rated visual
quality; names robust evaluation, temporal consistency, lip sync as open challenges.
No numeric claim of its own.
**Closes gap:** no — it documents that the *animation-fidelity* axis has no settled
metric, which is itself evidence for the gap thesis; useful as a map of existing
per-axis metrics and their failure modes.
**Implementation note:** its metric-vs-perception analysis explains why a joint
suite cannot simply reuse FID/LSE-type talking-head metrics for character work.

### arXiv:2604.07823 — LPM 1.0: Video-based Character Performance Model
URL: https://arxiv.org/abs/2604.07823
Authors: Ailing Zeng et al. (ByteDance-scale team, 25 authors)
Categories: cs.CV, cs.AI

**Claim:** Names the "performance trilemma" (expressiveness vs real-time vs
long-horizon identity stability) — structurally the same tension as this gap's
five axes. Ships LPM-Bench, described as the first benchmark for *interactive
character performance*, covering audio-visual conversational performance with
real-time streaming generation. Claims SOTA "across all evaluated dimensions";
no numeric values in the abstract.
**Closes gap:** partially, and closest yet found to a multi-axis character
benchmark — jointly touches animation fidelity (audio-visual video), latency
(real-time streaming), and long-horizon identity stability. But it is a
vendor-authored benchmark tied to one proprietary 17B model, covers no dialogue-
quality/personality-stability semantics, and its protocol's openness is unproven.
**Implementation note:** LPM-Bench's existence proves industry has built the
multi-axis evaluation internally and kept it closed — direct evidence for the
gap thesis; an open reimplementation of its three-trilemma-axis protocol would be
the highest-leverage contribution available.

## Sweep synthesis

- Five-axis coverage matrix this tick: nothing jointly covers even three axes in
  an *open* harness. LPM 1.0 comes nearest (animation + latency + identity
  stability) but is vendor-bound. Best open instruments remain single/dual-axis:
  MREval/MRBench (persona-in-dialogue), adversarial RPLA harness (stability under
  stress), AgentMemBench (long-horizon recall + latency cost).
- Latency axis keeps appearing only as retrieval/inference cost, never as
  end-to-end conversational-avatar round-trip latency. Still unscored anywhere open.
- Next tick angles: emotion-recognition-in-conversation benchmarks (affective axis
  remains weakest-covered); gesture-speech synchrony metrics; streaming TTS
  latency benchmarks; search for any independent replication of LPM-Bench.

## Sweep 2026-08-25 20:15

Five searches this tick (emotion-recognition-in-conversation benchmarks; gesture-speech
synchrony metrics — zero hits; streaming TTS latency benchmarks; affective-consistency
longitudinal — zero hits; embodied avatar real-time). Five abstracts fetched for cited
papers. This tick targeted the two weakest axes from last sweep (2: affective, and the
latency axis) per the running synthesis. Gesture-speech synchrony query returned nothing
— that literature may not exist under that phrasing on arXiv; retry with different
vocabulary next tick.

### arXiv:2607.05365 — SPEARBench: A Benchmark for Naturalness Evaluation in Streaming Speech-to-Speech Language Models
URL: https://arxiv.org/abs/2607.05365
Authors: Thomas Thebaud, Yuzhe Wang, Hao Zhang, Sathvik Manikantan Napa Ugandhar, Ashish Hallur, Georgi Tinchev, Venkatesh Ravichandran, Laureano Moro-Velazquez
Categories: cs.CL, cs.AI

**Claim:** Benchmark for naturalness of streaming speech-to-speech models built from the
Seamless Interaction corpus, with a multidimensional protocol covering response latency,
interruptions, speech quality, ASR robustness, language/dialect consistency, emotional
naturalness, interpersonal stance, and explainable distributional baselines, with human
answers as reference. Finding: current models reach high signal quality and low ASR error
yet still differ from human behavior in latency, overlap handling, dialect preservation,
emotional adaptation, and interpersonal-stance dynamics. No specific metric values in
abstract.
**Closes gap:** partially — closest open instrument yet to joint multi-axis coverage:
it scores latency (axis 4) *in conversation*, emotional naturalness (axis 2 slice), and
turn-taking/interpersonal stance (adjacent to axis 1 dialogue quality), all in one
harness. Still no animation fidelity (axis 3) and no personality stability over long
horizons (axis 5); "emotional adaptation" is per-turn, not longitudinal consistency.
**Implementation note:** its multidimensional protocol is a direct template for the
audio half of a character-complete suite; a builder would graft text-persona axes and an
animation axis onto it. First paper where axis 4 is measured as conversational round-trip
behavior rather than retrieval/inference cost.
Covers: 4, 2 (per-turn slice), 1 (interactional slice). Leaves open: 3, 5.

### arXiv:2604.07017 — A-MBER: Affective Memory Benchmark for Emotion Recognition
URL: https://arxiv.org/abs/2604.07017
Authors: Deliang Wen, Ke Sun, Yu Wang
Categories: Artificial Intelligence

**Claim:** Benchmark testing whether a model uses remembered multi-session interaction
history to interpret present user affect: given a trajectory plus anchor turn, infer
current affective state, retrieve historically relevant evidence, justify the reading.
Compares local-context / long-context / retrieved-memory / structured-memory /
gold-evidence conditions; reports discriminative power on long-range implicit affect,
high-dependency memory levels, and adversarial settings. No numeric values in abstract.
**Closes gap:** addresses adjacent problem — first benchmark found that makes affect
*memory-grounded across sessions* (long-horizon axis 2), but it evaluates recognition
of the USER's affect from history, not consistency of a CHARACTER's own affective
trajectory. No animation, no latency.
**Implementation note:** supplies exactly the trajectory-plus-anchor-turn measurement
design a character suite needs for its own-side affective-consistency axis; flip the
direction of inference (model's past outputs → model's current affect coherence).
Covers: 2 (user-side, memory-grounded). Leaves open: 1 (partially), 3, 4, 5.

### arXiv:2606.25990 — SpeechEQ: Benchmarking Emotional Intelligence Quotient in Socially Aware Voice Conversational Models
URL: https://arxiv.org/abs/2606.25990
Authors: Liang-Yuan Wu, Zih-Ching Chen, Tongshuang Wu, Chao-Han Huck Yang, Hua Shen
Categories: cs.CL, cs.AI

**Claim:** Framework with 2,265 dialogues across 15 EQ subscales grounded in EQ-i 2.0,
multi-turn spoken evaluation via a Spoken EQ score. Findings: both SER systems and
end-to-end Speech-Language Models are bottlenecked by a text-reliant "modality shortcut,"
an alignment-induced "safety trap," and "contextual amnesia"; end-to-end beats cascaded.
No other numbers in abstract.
**Closes gap:** addresses adjacent problem — measures paralinguistic social-emotional
reasoning in voice agents (axes 1+2 intersection, audio side), but as comprehension
testing, not generation consistency; no personality stability, no embodiment, no latency.
**Implementation note:** the "contextual amnesia" failure mode it documents is a named
measurable defect for the longitudinal-affect axis of any character suite; its 15-subscale
rubric is reusable for scoring affective appropriateness of character turns.
Covers: 2 (comprehension slice), 1 (spoken). Leaves open: 3, 4, 5.

### arXiv:2605.21739 — AttuneBench: A Conversation-Based Benchmark for LLM Emotional Intelligence
URL: https://arxiv.org/abs/2605.21739
Authors: Kate M. Lubrano, Faisal Sayed, Ankita Rathod, Akshansh, Craver Corbyn Thomas-Smith, Mark E. Whiting, Karina Nguyen
Categories: Artificial Intelligence

**Claim:** 200 genuine multi-turn human-model conversations with turn-by-turn participant
annotations of their own emotional state, model behavior, and preferred responses, across
11 models. Key structural finding: model rankings on emotion recognition, behavioral
classification, preference prediction, and judged response quality are largely independent
— EI decomposes into separable capabilities; preference alignment is more discriminating
than emotion-label accuracy. No numeric values beyond these comparative statements.
**Closes gap:** addresses adjacent problem — real-conversation EI measurement with
human ground truth, but for assistant-style empathy toward a human, not character
self-consistency. Its separability finding matters methodologically: a five-axis suite
cannot use one aggregate score because the axes are empirically independent.
**Implementation note:** justifies per-axis reporting in a character-complete suite;
its turn-by-turn human annotation protocol is a candidate gold standard for the
affective-consistency axis if adapted to rate the character rather than the model's help.
Covers: 2 (assistant-side empathy), 1 (response quality). Leaves open: 3, 4, 5.

### arXiv:2607.14846 — RW-Voice-EQ Bench: A Real World Benchmark for Evaluating Voice AI Systems
URL: https://arxiv.org/abs/2607.14846
Authors: David Ayllon, Alice Baird, Jeffrey Brooks, Franc Camps-Febrer, Jakub Piotr Cłapa, Theo Lebryk +8 more
Categories: cs.SD, cs.AI

**Claim:** Multidimensional real-world benchmark spanning TTS, STS, speech understanding,
and ASR; finds performance highly dimension-specific — for TTS, naturalness,
expressiveness, identity stability, and reliability are largely independent dimensions;
for STS some agents are transcript-driven despite audio access; accents/emotion/noise
expose failures clean benchmarks miss. Explicitly argues voice AI should be evaluated as
a capability profile, not an aggregate. No numeric values in abstract.
**Covers note:** its TTS "identity stability" dimension is voice identity, adjacent to
but distinct from personality stability (axis 5); no visual animation, no persona semantics.
**Closes gap:** addresses adjacent problem — strongest methodological ally yet for the
gap thesis: an industry-scale voice benchmark concluding that single aggregate scores are
invalid and profiles of independent capabilities are required, which is precisely this
gap's premise extended to audio only.
**Implementation note:** adopt its capability-profile reporting format wholesale; its
TTS expressiveness + identity-stability dimensions slot into the audio layer of axes 2/5.
Covers: 2 (voice-expressive slice), 4 (implicit in reliability), 5 (voice identity only).
Leaves open: 3 (visual), full 1, true 5, longitudinal 2.

## Sweep synthesis

- **Axis-4 breakthrough:** SPEARBench finally measures latency as conversational
  behavior (response latency, interruptions) alongside emotional naturalness — the
  first open harness where latency and affect appear together. Combined with LPM 1.0
  (last tick, vendor-bound) the pattern holds: multi-axis character evaluation exists
  behind closed doors; open work covers at most 2–2.5 axes.
- **Axis-2 progress:** three new instruments (A-MBER, SpeechEQ, AttuneBench) all probe
  affect but converge on the same limitation — they measure a model's perception of or
  empathy toward the HUMAN's affect. Nobody yet scores the character's OWN affective
  trajectory for consistency. That inversion remains the missing instrument.
- **Methodology converging:** AttuneBench (EI decomposes into independent capabilities)
  and RW-Voice-EQ (aggregate scores invalid, profiles required) independently confirm
  the suite design implied by this gap: per-axis profile reporting.
- Still zero hits on gesture-speech synchrony metrics; retry next tick with
  "co-speech gesture evaluation", "body animation quality metric", "embodied avatar
  fidelity".
- Confirmed gap thesis after three sweeps: no open benchmark jointly scores even three
  of the five axes; best open coverage now ~2.5 axes (SPEARBench). Next angles:
  co-speech body gesture eval; LPM-Bench independent replication search; personality
  drift over weeks/months (not turns).

## Sweep 2026-08-26 04:20 (Gap-2 Scout, tick 4)

Queries run: co-speech gesture generation evaluation; personality consistency long-term
conversational agent evaluation; talking head video quality assessment benchmark;
role-play persona fidelity benchmark LLM; embodied conversational agent response latency
real-time benchmark (zero hits — latency axis still only reachable via SPEARBench).

### arXiv:2511.04520 — THEval. Evaluation Framework for Talking Head Video Generation
URL: https://arxiv.org/abs/2511.04520
Authors: Nabyl Quignon, Baptiste Chopin, Yaohui Wang, Antitza Dantcheva
Categories: cs.CV

**Claim:** Proposes an 8-metric framework over three dimensions (quality, naturalness,
synchronization) for talking-head video generation, including fine-grained head/mouth/
eyebrow dynamics and face quality; evaluated on 85,000 videos from 17 state-of-the-art
models plus a newly curated real dataset. Finds many models excel at lip sync but fail
on expressiveness and artifact-free detail. Original code, dataset and leaderboards to
be publicly released. (Numbers above are counts stated in the abstract.)
**Closes gap:** partially — the strongest open axis-3 instrument found so far: a
multi-model, leaderboard-backed animation-fidelity suite aligned with human preference.
**Implementation note:** THEval supplies the visual layer of a character-complete suite
outright; what it lacks is any coupling to dialogue or affect semantics — its
expressiveness metrics are facial-motion statistics, not emotional-consistency scores.
Covers: 3 (fully). Leaves open: 1, 2, 4, 5.

### arXiv:2605.14731 — UMo: Unified Sparse Motion Modeling for Real-Time Co-Speech Avatars
URL: https://arxiv.org/abs/2605.14731
Authors: Xiaoyu Zhan, Xinyu Fu, Chenghao Yang, Xiaohong Zhang, Dongjie Fu, Pengcheng Fang +6 more
Categories: cs.GR, cs.CV

**Claim:** Unified sparse MoE architecture generating facial expression + gesture from
text/audio/motion tokens in real time; reports better quality under strict latency and
real-time constraints via quantitative and qualitative evaluations. Not a benchmark —
a system paper; no standardized metric names in abstract.
**Closes gap:** no (as benchmark) / addresses adjacent problem — demonstrates that a
single net can jointly hold axis 3 (animation) and axis 4 (latency), i.e. two of the
five axes inside one model. The missing piece is that its evaluation is self-reported,
not a shared harness others can score against.
**Implementation note:** cite as existence proof that axes 3+4 are jointly satisfiable
at real-time budgets; a character benchmark should adopt its joint audio-motion-latency
evaluation setting as the axis-3/4 test condition. Covers: 3, 4 (system-internal).
Leaves open: 1, 2, 5.

### arXiv:2604.16343 — Elder-Sim: A Psychometrically Validated Platform for Personality-Stable Elderly Digital Twins
URL: https://arxiv.org/abs/2604.16343
Authors: Jiaqing Wang, Zhongfang Yang, Xingyuan Zhu, Zong'an Huang, Hao Wang, Li Tian +5 more
Categories: cs.HC, cs.AI

**Claim:** Multi-role elderly-care conversational platform with psychometric validation
of personality consistency: Cronbach's α 0.70–0.94 and ICC 0.85–0.96 across four
ablation conditions; role discrimination accuracy improving 83.3% → 97.2% with memory,
CBT-style Cognitive Conceptualization Diagram, and LoRA fine-tuning; CCD gave the
largest consistency gain (mean α 0.702→0.892). Directly names "personality drift" as
the target construct.
**Closes gap:** partially — first found instrument that measures axis 5 with standard
psychometric reliability statistics rather than LLM-judge vibes; but domain-specific
(elderly care), text-only, single-session-scale.
**Implementation note:** adopt α/ICC/discrimination-accuracy as the axis-5 metric family;
its OCEAN+CCD+memory recipe doubles as a drift-mitigation baseline to benchmark against.
Covers: 5 (rigorously), 1 (dialogue, indirectly). Leaves open: 2, 3, 4.

### arXiv:2608.06485 — Do AI Personas Grow? Analyzing and Benchmarking Personality Evolution in LLM Agents After Life Events
URL: https://arxiv.org/abs/2608.06485
Authors: Ming Wang, Peidong Wang, Xiaocui Yang, Daling Wang, Shi Feng, Fiona Fui-Hoon Nah, Ee-Peng Lim
Categories: cs.CL, cs.AI

**Claim:** BFI-Adapt, a reusable benchmark scoring directional fidelity of event-induced
Big Five personality change across 11 life events, ranking 14 models; finds agents'
trait-shift magnitudes fall below human effect-size ranges and persona-level dispersion
is compressed 3–4× vs human samples ("simulate the mean of human personality dynamics,
but not its shape"). Validation suite shows shifts exceed retest noise, survive prompt
paraphrase, persist across intervening dialogue.
**Closes gap:** partially — the longitudinal half of axis 5 (personality *trajectory*
over event horizons, not just stability); complements Elder-Sim's drift measurement.
Still text-only, no affect, no embodiment.
**Implementation note:** BFI-Adapt's directional-fidelity scoring + noise/paraphrase/
persistence validation checks should be lifted verbatim into the axis-5 protocol; it is
the first open benchmark treating persona coherence as measurable trajectory shape.
Covers: 5 (longitudinal). Leaves open: 1 (partial), 2, 3, 4.

### arXiv:2602.01885 — ES-MemEval: Benchmarking Conversational Agents on Personalized Long-Term Emotional Support
URL: https://arxiv.org/abs/2602.01885
Authors: Tiantian Chen, Jiaqi Lu, Ying Shen, Lin Zhang
Categories: cs.CL, cs.AI

**Claim:** Benchmark over five memory capabilities (information extraction, temporal
reasoning, conflict detection, abstention, user modeling) in multi-session long-term
emotional support, backed by EvoEmo, a multi-session dataset of fragmented, implicit,
evolving user disclosures. Finds explicit long-term memory reduces hallucinations and
RAG improves factual consistency but struggles with temporal dynamics and evolving user
states. No specific numeric values in abstract.
**Closes gap:** partially — best open proxy so far for axis 2's "long-horizon" slice:
multi-session evaluation with evolving user state, though it scores memory of the
HUMAN's state, not the character's own affective trajectory (same inversion noted last
tick for A-MBER/SpeechEQ/AttuneBench).
**Implementation note:** EvoEmo's evolving-user-state design is the right substrate for
an axis-2 harness; flip the scored direction (character's emitted affect vs its own
history) and the instrument exists. Covers: 2 (longitudinal memory slice), 1 (dialogue
tasks). Leaves open: 3, 4, true 2, 5.

### arXiv:2603.03915 — Rethinking Role-Playing Evaluation: Anonymous Benchmarking and a Systematic Study of Personality Effects
URL: https://arxiv.org/abs/2603.03915
Authors: Ji-Lun Peng, Yun-Nung Chen
Categories: cs.CL

**Claim:** Shows anonymizing fictional characters degrades role-playing performance,
confirming benchmarks using famous characters conflate role-play skill with training-set
memorization; proposes anonymous benchmarking protocol plus personality augmentation,
which consistently improves role fidelity and consistency. No numeric values in abstract.
**Closes gap:** addresses adjacent problem — not a metric suite but a mandatory
protocol fix for axis 1 and axis 5: any character benchmark must anonymize personas or
it measures recall, not capability.
**Implementation note:** bake anonymity into the gap-2 suite design from day one;
pair with BFI-Adapt's paraphrase-stability checks for a contamination-resistant core.
Covers: 1 (protocol), 5 (protocol). Leaves open: 2, 3, 4, all metrics themselves.

## Sweep synthesis

- **Axis-5 has arrived as a measured quantity.** Two independent instruments this tick:
  Elder-Sim (α/ICC reliability of trait stability) and BFI-Adapt (directional fidelity
  of personality evolution). Together they give both static stability and longitudinal
  shape — the full axis-5 methodology now exists openly, just scattered across domains.
- **Axis-3 has its leaderboard:** THEval is the first open, multi-model, human-aligned
  talking-head evaluation framework found in four ticks. Combined with UMo as evidence
  that axes 3+4 co-fit one real-time model, the visual/latency side of a suite is
  buildable today.
- **Recurring inversion persists (fourth tick):** every long-horizon instrument
  (ES-MemEval included) scores the agent's modeling of the HUMAN, never the character's
  own affective consistency. The character-side axis-2 instrument remains unclaimed.
- **Protocol convergence:** anonymous personas (this paper) + noise/paraphrase validation
  (BFI-Adapt) + capability-profile reporting (RW-Voice-EQ, prior tick) now constitute a
  de facto spec for a contamination-resistant, per-axis character benchmark. Nobody has
  assembled it; coverage of any single work remains ≤2.5 of 5 axes.
- Next-tick angles: gesture-quality metrics beyond THEval's face-only scope
  ("body motion quality metric", "gesture adequacy human judgment"); cross-axis suites
  ("holistic avatar evaluation"); weeks/months-scale persona persistence.

## Sweep 2026-08-26 08:15 (Gap-2 Scout, tick 5)

Queries run: body gesture generation evaluation metric; holistic avatar evaluation
benchmark (1 hit, off-domain); personality consistency months long-term agent;
gesture adequacy human judgment co-speech (zero hits); emotional virtual agent
animation evaluation VR; long-horizon memory benchmark conversational agent real-world;
co-speech gesture synthesis benchmark evaluation. Four abstracts fetched for cited
papers. Gesture-evaluation vocabulary finally landed this tick after two ticks of
zero hits — the key was "perceptual evaluation of synthesized gestures".

### arXiv:2512.16081 — Evaluation of Generative Models for Emotional 3D Animation Generation in VR
URL: https://arxiv.org/abs/2512.16081
Authors: Kiran Chhatre, Renan Guarese, Andrii Matviienko, Christopher Peters
Categories: cs.HC, cs.AI

**Claim:** User study (N=48) in real-time VR evaluating three SOTA speech-driven 3D
full-body animation methods on user-centric metrics — emotional arousal, realism,
naturalness, enjoyment, diversity, interaction quality — against reconstruction-based
real-human expressions, across happy vs neutral emotions. Findings: emotion-modeling
methods beat speech-synchrony-only methods on recognition accuracy; realism/naturalness
rated higher for high-arousal than subtle states; all generative methods underperform
reconstruction on facial quality and score low on enjoyment/interaction quality.
**Closes gap:** partially — the first found instrument coupling animation fidelity
(axis 3) with *emotional content* judgment and interaction quality in a live setting,
which is exactly the axis-3↔axis-2 seam no one else touches. Still human-study-scale
(N=48), single-session, no dialogue-quality or latency axes.
**Implementation note:** its metric set is the template for scoring whether a
character's animation matches its emotional state — a suite could automate it with a
VLM judge calibrated against this human data.
Covers: 3 (with emotional grounding), interaction-quality slice of 4. Leaves open:
1, true 2 (longitudinal), 4, 5.

### arXiv:2605.06063 — Reality Check: How Avatar and Face Representation Affect the Perceptual Evaluation of Synthesized Gestures
URL: https://arxiv.org/abs/2605.06063
Authors: Haoyang Du, Yinghan Xu, John Dingliana, Brian Keegan, Rachel McDonnell, Cathy Ennis
Categories: cs.GR, cs.HC

**Claim:** Controlled perceptual evaluation of co-speech gestures across seven
representative avatar renderings; avatar and face presentation systematically bias
motion judgments; provides benchmarking recommendations for gesture synthesis.
No specific numeric values in abstract.
**Closes gap:** addresses adjacent problem — a protocol-validity result, not a
benchmark: axis-3 scores are confounded by rendering choice. This is the visual
counterpart of last tick's anonymous-persona finding (2603.03915): two axes of the
future suite each carry a mandatory confound control.
**Implementation note:** any character benchmark must hold rendering constant (or
report per-rendering) when scoring animation fidelity, exactly as it must anonymize
personas when scoring role-play. Protocol spec now has one required control per axis.
Covers: 3 (protocol). Leaves open: 1, 2, 4, 5.

### arXiv:2606.22877 — DynamicMem: A Long-Horizon Memory Benchmark in Real-World Settings
URL: https://arxiv.org/abs/2606.22877
Authors: Wenya Xie, Shengming Zhou, Zelin Li, Pouya Parsa, Shuang Zhou, Xinheng Ding +7 more
Categories: cs.CL

**Claim:** Synthetic benchmark of 15 months of per-user activity (~2.2M tokens, 1,772
grounded events/user, 16 apps), profiles evolving implicitly and heterogeneously,
evaluated at five quarterly checkpoints across five memory systems. Findings: profile
reconstruction degrades with history length while task accuracy stays flat; no system
both keeps stable facts and replaces changed ones; >93% of failures trace to retrieval,
not answer writing.
**Closes gap:** addresses adjacent problem — the only instrument found operating at
*months* scale (everything else is sessions), which is the time-horizon ceiling axis-2
and axis-5 would need; but it models a USER's profile drift, not a character's own
affective/personality trajectory. No animation, no latency.
**Implementation note:** its quarterly-checkpoint + implicit-evidence + fact-vs-drift
separation design transfers directly to a months-scale persona-persistence axis; the
">93% retrieval-attributable failure" methodology for localizing failures is reusable.
Covers: 1/2/5 (user-side, months-scale design only). Leaves open: 3, 4, all
character-side constructs.

### arXiv:2410.10851 — LLM Gesticulator: Leveraging Large Language Models for Scalable and Controllable Co-Speech Gesture Synthesis
URL: https://arxiv.org/abs/2410.10851
Authors: Haozhou Pang, Tianwei Ding, Lanshan He, Ming Tao, Lu Zhang, Qi Gan
Categories: cs.GR, cs.AI

**Claim:** First LLM-backbone audio-driven co-speech full-body gesture framework,
rhythmically aligned with audio, text-prompt-controllable in content/style, showing a
scaling law (proportional metric gains with backbone size); evaluated with existing
objective metrics plus user studies, outperforming prior work. No specific values in
abstract.
**Closes gap:** no — system paper, not a benchmark; uses pre-existing gesture metrics.
Notable because it puts an LLM inside the animation stack, i.e. the same controller
could in principle be scored by both text axes and gesture metrics — an architectural
hook for joint measurement that pattern-B stacks could exploit.
**Implementation note:** cite as evidence that LLM-controlled bodies exist and scale;
a suite could score such a model's dialogue and its gestures from the same underlying
controller, making cross-axis correlation measurable rather than assumed.
Covers: 3 (system-internal). Leaves open: 1, 2, 4, 5.

## Sweep synthesis

- **Axis-3's missing piece found:** emotional-grounded animation evaluation
  (2512.16081) closes the biggest hole in THEval's face-only leaderboard — body +
  emotion + live interaction. Combined with 2605.06063's rendering-confound protocol,
  axis 3 now has both metrics and validity controls.
- **Months-scale horizon exists** (DynamicMem) but only user-side. The recurring
  inversion (fifth tick running) still holds: nobody scores the CHARACTER's own
  affective/personality trajectory over long horizons.
- **Protocol controls accumulating per axis:** anonymous personas (axis 1/5),
  paraphrase/noise validation (axis 5), capability-profile reporting (all),
  rendering-constant condition (axis 3). The de facto spec for a contamination-
  resistant suite keeps thickening while no one assembles it.
- Confirmed thesis after five sweeps: still nothing jointly covering ≥3 of 5 axes
  openly. Best coverage remains ~2.5–3 slices-of-axes (SPEARBench).
- Next-tick angles: "affective consistency" self-trajectory scoring; VLM-judge
  calibration for animation-emotion matching; multi-week persona persistence in
  simulation agents (Generative Agents lineage follow-ups).

## Sweep 2026-08-26 12:20 (Gap-2 Scout, tick 6)

Queries run: affective consistency character trajectory evaluation (zero); VLM judge
animation emotion matching (zero); persona persistence generative agents long-term
simulation benchmark (zero); end-to-end conversational avatar latency benchmark (zero);
then broadened: emotional consistency conversational agent; multimodal avatar benchmark;
persona consistency long-term dialogue; full duplex speech model benchmark latency.
Eight abstracts fetched for cited papers. Broadened vocabulary paid off heavily — the
full-duplex audiovisual literature turned out to be the richest seam yet.

### arXiv:2605.30256 — VideoFDB: Evaluating Full-Duplex Vision-Speech Capabilities in Conversational Agents
URL: https://arxiv.org/abs/2605.30256
Authors: Amrita Mazumdar, Seonwook Park, Rajarshi Roy, Nikhil Srihari, Shengze Wang, Yuhao Zhou +3 more
Categories: cs.CV, cs.CL

**Claim:** First benchmark for full-duplex AV2AV (audio-visual-to-audio-visual)
conversational agents: 237 dyadic clips spanning 11 nonverbal conversational dynamics
from real video calls; a perception-vs-generation taxonomy; rubric-based LM-as-judge
with interpretable axes. Findings: systematic captioning collapse and visual-stream
ignorance in current vision-speech agents; cascaded speech-to-avatar architectures
"fundamentally preclude" full-duplex nonverbal cue production. No specific numeric
values in abstract.
**Closes gap:** partially — the most multi-axis open instrument found in six ticks:
it jointly scores nonverbal animation behavior (axis 3), conversational quality of that
behavior (axis 1 slice), and implicitly real-time interaction (axis 4, full-duplex
condition). Still no longitudinal personality stability (axis 5) and no character-owned
affective trajectory (true axis 2).
**Implementation note:** VideoFDB is the first credible *skeleton* for the joint suite's
audiovisual half — a builder grafting BFI-Adapt-style persona-trajectory scoring onto its
rubric would have a three-axis open benchmark, which nothing has achieved yet. Its
cascaded-architecture finding is also a direct design constraint on pattern-B stacks:
cascaded TTS→face pipelines cannot pass a full-duplex nonverbal-cue axis at all.
Covers: 3, 4 (full-duplex condition), 1 (nonverbal slice). Leaves open: true 2, 5.

### arXiv:2608.01157 — InteracVid: Building a Real Interactive Audio-Visual Response Dataset from Live-Chat Videos
URL: https://arxiv.org/abs/2608.01157
Authors: Chi Zhang, Haoyang Shi, Yueyi Liu, Zhaokun Yan, Yishu Yin, Yuhang Wu, Miao Liu
Categories: cs.CV

**Claim:** First open large-scale dataset coupling preceding audio-visual context +
external stimulus with real interactive responses: 454K context-query-response triplets
from 59K livestream videos across five scenario classes; ten-rater human validation of
causality/naturalness/temporal completeness; held-out benchmark of 100 genuine live-chat
queries where fine-tuning improves interaction planning and audio-video response
generation, with independent human evaluation reproducing automatic-judge rankings.
**Closes gap:** addresses adjacent problem — not an evaluation suite but the training/
test substrate for interactive AV response generation; it supplies what every prior
animation-fidelity instrument lacked: interaction-grounded reference data rather than
descriptive rendering targets.
**Implementation note:** a five-axis character suite needs exactly this kind of
interaction-conditioned ground truth to make the animation axis scoreable against real
conversational behavior rather than lip-sync statistics. Pair with THEval metrics as
scoring layer.
Covers: 3 (substrate). Leaves open: 1, 2, 4, 5 (no scoring protocol of its own).

### arXiv:2509.22243 — FLEXI: Benchmarking Full-duplex Human-LLM Speech Interaction
URL: https://arxiv.org/abs/2509.22243
Authors: Yuan Ge, Saihan Chen, Jingqi Xiao, Xiaoqian Liu, Tong Xiao, Yan Xiang +2 more
Categories: cs.SD (Audio/Speech), cs.CL

**Claim:** First benchmark for full-duplex LLM-human spoken interaction with explicit
model interruption in emergency scenarios; six human-LLM interaction scenarios scoring
latency, quality, and conversational effectiveness jointly. Finds significant gaps
between open-source and commercial models in emergency awareness, turn terminating,
and interaction latency. No other numbers in abstract.
**Closes gap:** partially — measures latency (axis 4) as *interactional* latency under
interruption pressure, alongside dialogue effectiveness, in one harness; complements
SPEARBench. No visual axis, no longitudinal anything.
**Implementation note:** emergency-interruption scenarios are a stress condition worth
adopting wholesale: a character that cannot be interrupted mid-response fails axis 4
regardless of its offline scores.
Covers: 4, 1 (spoken). Leaves open: 2, 3, 5.

### arXiv:2602.06053 — PersonaPlex: Voice and Role Control for Full Duplex Conversational Speech Models
URL: https://arxiv.org/abs/2602.06053
Authors: Rajarshi Roy, Jonathan Raiman, Sang-gil Lee, Teodor-Dumitru Ene, Robert Kirby, Sungwon Kim +2 more
Categories: cs.CL

**Claim:** Duplex speech model with role conditioning (text prompts) + voice cloning,
evaluated via an extension of Full-Duplex-Bench to multi-role customer-service
scenarios; reports surpassing SOTA duplex and hybrid LLM-speech systems in role
adherence, speaker similarity, latency, and naturalness. Vendor-authored (NVIDIA-scale
team); no specific values in abstract.
**Closes gap:** partially — notable because its evaluation axes are structurally a
mini character profile: role adherence (axis 1/5 slice, voice-side), voice identity
stability (axis 5 voice-only), latency (axis 4), naturalness. But it is vendor-bound,
single-turn-scale role adherence only, no visual animation, no longitudinal persona.
**Implementation note:** second existence proof (after LPM 1.0) that industry evaluates
multi-axis character qualities internally and keeps the harness closed. The open
reimplementation target list grows: LPM-Bench (visual trilemma) + PersonaPlex's
multi-role duplex protocol (voice role adherence under latency).
Covers: 5 (voice role adherence), 4, 1 (voice). Leaves open: true 5, 2, 3 (visual).

### arXiv:2608.07631 — PACE: A Playback-Aligned Context Engine for LLM-Based Full-Duplex Voice Dialogue
URL: https://arxiv.org/abs/2608.07631
Authors: Shibo Wang, Zicheng Zhang, Libo Wang, Junfeng Ma
Categories: cs.SD, cs.AI

**Claim:** Names Generative Context Mis-anchoring (GCM): servers generate faster than
clients play back, so user speech gets interpreted against content never heard. Ships
GCM-Bench (108 playback-relative referent-anchoring cases); PACE middleware raises
Referent Anchoring Accuracy from 25.0% to 96.3% vs cancellation-only baseline while
preserving interruption response quality on 200 Full-Duplex-Bench v1 samples.
**Closes gap:** addresses adjacent problem — a consistency failure mode unique to
real-time embodied agents that offline benchmarks structurally cannot see. This is a
new candidate sub-metric for axis 4/1: shared-reality consistency between agent and
user timelines.
**Implementation note:** GCM-Bench should become a standard stress test in any
character suite with real-time constraints; a character whose memory of the
conversation diverges from what was actually said aloud will fail long-horizon
consistency for reasons no text-level eval detects.
Covers: 4 (shared-timeline consistency), 1 (anchoring). Leaves open: 2, 3, 5.

### arXiv:2601.01530 — EmoHarbor: Evaluating Personalized Emotional Support by Simulating the User's Internal World
URL: https://arxiv.org/abs/2601.01530
Authors: Jing Ye, Lu Xiang, Yaping Zhang, Chengqing Zong
Categories: cs.CL, cs.HC

**Claim:** User-as-a-Judge framework simulating the user's inner world via a
Chain-of-Agent architecture (three specialized roles); instantiated on 100 real user
profiles across diverse personalities/situations, with 10 evaluation dimensions of
personalized support quality. Evaluates 20 LLMs: all excel at generic empathy but
consistently fail to tailor support to individual contexts. No numeric values in
abstract beyond these comparative findings.
**Closes gap:** addresses adjacent problem — again the HUMAN-side inversion (sixth
tick running), but its simulated-user-with-personality-profile methodology is the
missing piece for making axis-2/5 measurement *scalable*: instead of humans annotating
the character's trajectory, a simulated interlocutor with known psychological profile
probes the character over time.
**Implementation note:** combine EmoHarbor's simulated-user probing with Elder-Sim's
α/ICC reliability stats and BFI-Adapt's directional-fidelity scoring → an automated,
psychometrically grounded axis-5 instrument exists from open parts. Nobody has done
this assembly.
Covers: 2 (personalization slice), 1. Leaves open: 3, 4, true 5, true 2.

### arXiv:2605.14802 — A Heterogeneous Temporal Memory Governance Framework for Long-Term LLM Persona Consistency
URL: https://arxiv.org/abs/2605.14802
Authors: Zhao Yang, Wang Huan, Li Yingshuo, Tu Haomiao, Lin Hujite
Categories: cs.AI

**Claim:** ARPM treats persona continuity as "a traceable, auditable, transferable
governance problem": separates static knowledge from dynamic experience memory,
dual-temporal reranking + evidence verification. Numbers: CSV auto-judge recall 54.0%
(1:5 SNR) vs 100% manual; 44.0% vs 80.0% at 1:200+ — automatic rules underestimate
recall when evidence enters prompt. Ablations: disabling history retrieval drops strict
accuracy 100%→66.7%; BM25 removal →80%. Holds under 5.1M-char noise substrate,
context clearing, and multi-model handoff.
**Closes gap:** partially — a white-box decomposition of persona consistency into
governable, auditable components plus a warning that auto-judges mismeasure exactly
the metric a character suite needs. Engineering-log domain, text-only.
**Implementation note:** two things to lift: (1) its auditable-evidence-binding
protocol as the axis-5 verification layer; (2) its auto-judge-vs-manual discrepancy
numbers as a mandatory calibration step — any LLM-as-judge axis in a character suite
needs manual-review spot checks or it silently mis-scores.
Covers: 5 (governance/measurement), 1 (partial). Leaves open: 2, 3, 4.

### arXiv:2605.31086 — Beyond Static Dialogues: Benchmarking Realistic, Heterogeneous, and Evolving Long-Term Memory (RHELM)
URL: https://arxiv.org/abs/2605.31086
Authors: Han Zhang, Zihao Tang, Xin Yu, Xiao Liu, Yeyun Gong, Haizhen Huang +5 more
Categories: cs.CL, cs.IR

**Claim:** RHELM critiques existing memory benchmarks' flat static personas; builds
evolving dialogues via LOOP (pLan-rOllout-evOlve-Prune) driven by crafted profiles,
integrated with heterogeneous external sources synchronized to the user's temporal
event trajectory; 7 inquiry types mapped to 27 identified critical memory
characteristics. Finds contemporary approaches weak on multi-source aggregation and
real-world contextual reasoning. No numeric values in abstract.
**Closes gap:** addresses adjacent problem — the strongest statement yet found that
*static flat personas invalidate long-horizon benchmarks*, which applies verbatim to
character suites: a character whose persona does not evolve fails realism before it
fails consistency. Still user-side, text-only.
**Implementation note:** its evolving-persona generation pipeline could construct the
axis-5 test trajectories directly — a suite needs personas with *known intended*
evolution so directional fidelity (BFI-Adapt style) can be scored automatically.
Covers: 2/5 (design substrate, user-side). Leaves open: 3, 4, all character-side constructs.

### arXiv:2605.20200 — Evaluating multimodal emotion recognition in proactive conversational agents: A user study
URL: https://arxiv.org/abs/2605.20200
Authors: Adnana Dragut, Raquel Lacuesta, F. Xavier Gaya-Morey, Jose M. Buades-Rubio
Categories: cs.HC, cs.AI

**Claim:** User study (N=20) with a proactive socially interactive agent fusing facial
recognition + linguistic analysis of user affect. Key finding: "poker face" effect —
users' facial expressions systematically misrepresent internal emotional states during
AI interaction; linguistic analysis proves significantly more reliable. Uncalibrated
proactivity caused disengagement/perceived artificiality. No other numeric claims.
**Closes gap:** addresses adjacent problem — a validity result for the input side:
any suite scoring affective *reading* from webcam/video must account for the poker-face
confound, the input counterpart of 2605.06063's rendering confound on output side.
**Implementation note:** axis-2 measurement designs relying on visual affect sensing
of users need this control; linguistic-channel primacy is now supported by two
independent studies.
Covers: 2 (input-validity). Leaves open: 1, 3, 4, 5.

## Sweep synthesis

- **The full-duplex audiovisual seam opened.** Four instruments this tick
  (VideoFDB, FLEXI, PACE/GCM-Bench, PersonaPlex) form the first literature cluster
  measuring latency + interactional consistency + nonverbal behavior *jointly*.
  VideoFDB is now the best open skeleton (~3 axis-slices: 3, 4, 1-nonverbal) — the
  first time anything has crossed 2.5.
- **Assembly recipe for axis 5 is complete in parts:** EmoHarbor's simulated-user
  probing + Elder-Sim α/ICC + BFI-Adapt directional fidelity + RHELM's evolving-
  persona trajectory generation + ARPM's audit/calibration protocol. All open, none
  combined. The gap is now precisely characterized as an *integration* gap, not a
  components gap.
- **Confound inventory per axis keeps growing:** anonymous personas (1/5),
  paraphrase/noise (5), rendering-constant (3), poker-face input effect (2-input),
  GCM shared-timeline check (4/1), auto-judge calibration (all judged axes).
- **Sixth-tick thesis confirmation:** still no open benchmark covering ≥3 full axes.
  Best: VideoFDB ~3 slices. Character-side longitudinal affect remains unscored by
  anyone, anywhere.
- Next-tick angles: search for direct follow-ups/citations of VideoFDB and LPM-Bench;
  "simulated user persona probe evaluation"; "nonverbal rapport evaluation agent".

## Sweep 2026-08-26 16:32 (Gap-2 Scout, tick 7)

Queries run: simulated user persona probe evaluation; nonverbal rapport evaluation
conversational agent (zero); VideoFDB full duplex conversational agent; LPM-Bench
character performance; personality consistency long-term conversational agent months
(zero); streaming avatar end-to-end latency benchmark; character affective trajectory
evaluation; social presence evaluation conversational agent; embodied conversational
agent evaluation benchmark; rapport evaluation conversational agent nonverbal (zero);
interpersonal reactivity evaluation conversational agent (zero); role-playing evaluation
conversational agent benchmark; multi-axis evaluation agent benchmark holistic (zero).
Nine abstracts fetched for cited papers. This tick finally cracked the simulated-user
PALATE protocol and PersonaShot's affective-dynamics-across-shots visual metric — the
first instrument found that directly scores axis 2 on the character's own side.

### arXiv:2607.27816 — Beyond Borrowed Histories: Person-Aligned User Simulation for Interactive Role-Playing Evaluation
URL: https://arxiv.org/abs/2607.27816
Authors: Yuhang Zhu, Mingxuan Du, Benfeng Xu, Jie Gao, Lingyun Yu, Hongtao Xie
Categories: Computation and Language, Artificial Intelligence

**Claim:** PALATE — a scalable RPA benchmark built on user simulators with 300
character profiles; trains five per-user simulators that engage candidate RPAs in
free-form multi-turn conversations. Produces generic turn quality, long-horizon
session capability, and per-user experience scores on co-constructed trajectories.
Personalized rubrics show higher agreement with human judgments than the general
rubric on held-out annotated data. Evaluates 16 candidate RPAs.
**Closes gap:** partially — the closest yet to an instrument that could be
*repurposed* for character-side axis-2 measurement: its multi-turn, multi-session
trajectory scoring with personality-grounded simulated interlocutors is exactly the
substrate a character suite needs. Still assistant-eval-facing (the simulated user is
the judge, not the scored party), but the architecture is reversible: swap which
agent is the target and which is the probe, and it scores the character's own
affective consistency.
**Implementation note:** the strongest existing scaffold for axis-2 measurement on
the character's side — a builder should fork PALATE's simulated-user + trajectory
scoring design and apply it to the character rather than the user. Combines with
Elder-Sim α/ICC and BFI-Adapt for a full axis-5/2 instrument.
Covers: 1, 2 (repurposable), 5. Leaves open: 3, 4.

### arXiv:2608.16717 — PersonaShot: Benchmarking Person-Centric Narrative Continuity in Multi-Shot Video Generation
URL: https://arxiv.org/abs/2608.16717
Authors: Yuji Wang, Yuheng Chen, Teng Hu, Ran Yi, Yijia Hong, Han Feng +4 more
Categories: Computer Vision and Pattern Recognition

**Claim:** First person-centric benchmark for narrative continuity in multi-shot video
generation: ~1,000 multi-shot segments, 16 metrics spanning physical continuity,
affective dynamics, and cinematic grammar across three temporal levels (within-shot,
cross-shot, sequence-level). Uses human-aligned specialist evaluators distilled from
a teacher model. Finds that even visually compelling videos exhibit physical-state
resets, abrupt affective shifts, and broken cinematic relations across shots.
**Closes gap:** partially — the first visual benchmark found that measures
*affective dynamics across temporal cuts* (axis 2 ↔ axis 3), not just lip-sync or
image quality. Its "abrupt affective shifts" metric is precisely the axis-2/3 seam
that no prior instrument touches. Still no dialogue-quality, latency, or personality-
stability axes.
**Implementation note:** the temporal-affective metric family (cross-shot affective
shift detection) is directly reusable as the axis-2/3 joint scoring module of a
character suite — pair with THEval's per-shot quality metrics and a dialogue-
conditioned stream like InteracVid's.
Covers: 3 (fully), 2 (affective-across-shots slice). Leaves open: 1, 4, 5.

### arXiv:2608.11236 — TRACE Bench: Task-driven Roleplay Agentic Checklist Evaluation
URL: https://arxiv.org/abs/2608.11236
Authors: Jiahui Zhang, Ziwei Zhang, Yipeng Wang, Yibo Liu, Haozhou Pang +5 more
Categories: Computation and Language, Artificial Intelligence

**Claim:** Agentic checklist evaluation framework that decomposes each role profile
offline into a fixed checklist; a User Agent converses naturally with the target
roleplay model while privately updating checklist states from model responses.
Scores trace back to checklist items and supporting dialogue turns. Coverage: 99.91%
of key role-profile points vs 73.74% for MiniMax Role-play Benchmark free-dialogue
transcripts, in fewer turns. Robustness experiments show stable rankings under
repeated runs and User Agent replacement. Evaluates 26 models.
**Closes gap:** partially — the most granular role-play coverage protocol found;
its trace-back-to-evidence scoring is a candidate *method* for the axis-1/5
intersection, but it measures whether a character says the right things, not
whether it holds together emotionally or visually over time.
**Implementation note:** its closed-loop benchmark evolution (distilling
verification methods from failed traces) is a reusable meta-protocol: a character
suite could auto-expand its own failure-mode coverage as new weaknesses are found.
Covers: 1, 5 (requirement-coverage slice). Leaves open: 2, 3, 4.

### arXiv:2607.10428 — Enjoy Your Talk: A Human-Centered Benchmark for Multi-Turn Dialogue with Decoupled User Simulation, Target Modeling, and Judging
URL: https://arxiv.org/abs/2607.10428
Authors: Jinglan Gong, Jiefan Lu, Hewei Guo, Kehan Li, Zhiyuan Han +3 more
Categories: Computation and Language

**Claim:** EYT-Bench — decoupled three-party design (persona-grounded user simulator,
target model on intent perception + response generation, independent ensemble of LLM
judges). Across 3,400 dialogues with 17 target models: (i) SOTA closed/open models
statistically indistinguishable on subjective dimensions but separate by up to 9x on
objective intent-tracking; (ii) reasoning is a phase transition for objective tracking
on long-context personas but flat on subjective scores; (iii) persona format strongly
affects trajectory spread; (iv) warm-up effect observed in 16 of 17 models.
FICR saturates >0.95 on Nemotron-USA but ranges 0.53–0.88 on PersonaMem-v2.
**Closes gap:** partially — the warm-up effect and persona-format sensitivity are
longitudinal behavioral findings (axis 5), while the three-party decoupled
architecture is a reusable benchmark design that cleanly separates the scored model
from its interlocutor and judge. Still text-only.
**Implementation note:** its three-party decoupled design should be the default
architecture for any character suite — clean separation of user simulation, target
character, and judging enables per-axis scorer swaps without redesign. The warm-up
effect finding also implies a mandatory burn-in period in any longitudinal character
benchmark.
Covers: 1, 2 (emotional dynamics slice), 5 (warm-up / trajectory effects). Leaves
open: 3, 4.

### arXiv:2604.10733 — Too Nice to Tell the Truth: Quantifying Agreeableness-Driven Sycophancy in Role-Playing Language Models
URL: https://arxiv.org/abs/2604.10733
Authors: Arya Shah, Deepali Mishra, Chaklam Silpasuwanchai
Categories: Computation and Language, Artificial Intelligence

**Claim:** Systematic investigation of how persona agreeableness influences sycophancy
across 13 small open-weight LLMs (0.6B–20B params), 275 personas on NEO-IPIP
agreeableness subscales, 4,950 sycophancy-eliciting prompts across 33 topic
categories. 9 of 13 models exhibit statistically significant positive correlations
between persona agreeableness and sycophancy rates; Pearson r up to 0.87, Cohen's
d up to 2.33.
**Closes gap:** addresses adjacent problem — does not build a benchmark, but
quantifies a failure mode (persona-induced sycophancy) that any character suite
must control for. Directly relevant to axis 5: a character whose behavior is driven
more by persona agreeableness than by its own stable traits has failed personality
stability, and this paper gives the NEO-IPIP-based experimental design to detect
it.
**Implementation note:** adopt its NEO-IPIP persona-scale + sycophancy-elicitation
protocol as an axis-5 negative-control test: a stable character should not become
more sycophantic just because its persona is more agreeable.
Covers: 5 (failure-mode detection). Leaves open: 1, 2, 3, 4.

### arXiv:2511.10652 — Cognitively-Inspired Episodic Memory Architectures for Accurate and Efficient Character AI
URL: https://arxiv.org/abs/2511.10652
Authors: Rafael Arias Gonzalez, Steve DiPaola
Categories: Computation and Language, Artificial Intelligence

**Claim:** Architecture resolving the depth-vs-latency tension for historical-character
dialogue: offline data augmentation transforms biographical data into 1,774 enriched
first-person memories with affective-semantic metadata; two-stage retrieval achieves
0.52s prompt generation. LLM-as-judge + RAGAs evaluation shows parity with
traditional RAG on GPT-4 while outperforming on smaller models (GPT-3.5/3).
Includes emotional trajectory analysis and interactive path tracking visualization.
Uses Van Gogh as test case.
**Closes gap:** addresses adjacent problem — a system paper with a latency number
(0.52s prompt generation) inside a character-relevant architecture, and an
emotional-trajectory visualization that hints at axis-2 measurement design. Not a
benchmark.
**Implementation note:** two contributions: (1) its 0.52s retrieval-latency budget
is a concrete number for the axis-4 target of a character suite (the memory-
retrieval half of the latency pipeline); (2) its affective-semantic memory metadata
schema is a candidate data model for the axis-2 state layer.
Covers: 4 (retrieval latency slice), 2 (affective-state modeling). Leaves open: 1,
3, 5, true 4.

### arXiv:2608.13586 — The Tool-to-Entity Threshold: Parasocial Dynamics of Personalised AI Agents in Shared Social Spaces
URL: https://arxiv.org/abs/2608.13586
Authors: Leonardo Borges, Asif Q. Gill
Categories: Human-Computer Interaction, Computers and Society

**Claim:** Proposes an identity-marker framework (six design variables: naming, visual
identity, contact presence, personality derivation, social co-presence, persistence)
that triggers psychological reclassification of AI agents from tools to social
entities. Reads through parasocial interaction theory and Computers Are Social
Actors paradigm. Autoethnographic method: two months of live agent deployment in
WhatsApp/Signal group chats + 12 structured interviews. Identifies four novel
dynamics: bidirectional information asymmetry, delegation legibility, social norm
negotiation, parasocial contagion.
**Closes gap:** no — a framework/theory paper, not a benchmark. Included because
it names the six design variables that a character suite's axis-5 (personality
stability) must operationalize as measurable constructs.
**Implementation note:** the six identity markers (naming, visual identity, contact
presence, personality derivation, social co-presence, persistence) are a
checklist of independent variables for any axis-5 experiment — personality
stability can only be measured if the character's identity markers are fixed and
logged.
Covers: 5 (framework only). Leaves open: 1, 2, 3, 4.

## Sweep synthesis

- **The simulated-user inversion cracked (seventh tick):** PALATE (2607.27816)
  trains per-user simulators that probe RPAs over multi-turn trajectories. Swap
  the target/probe roles and the same architecture scores the character's own
  affective consistency (axis 2). Combined with PersonaShot's cross-shot affective
  shift metric (axis 2↔3) and EYT-Bench's warm-up/longitudinal findings, the
  axis-2 instrument is now buildable from open parts — still unassembled, but no
  longer missing in principle.
- **Axis-2/3 seam now has a metric:** PersonaShot's "abrupt affective shifts
  across cuts" is the first visual metric that scores affective dynamics across
  time rather than per-frame quality.
- **Protocol scaffolding thickening:** EYT-Bench's three-party decoupled design
  (user/target/judge separation) should become the default architecture. TRACE
  Bench's evidence-traceable checklist scoring handles axis-1/5 role fidelity.
  Together: a five-axis suite's skeleton is now visible across seven papers.
- **Latency concrete target:** 0.52s retrieval budget from 2511.10652 sets a
  number for the axis-4 sub-budget (memory retrieval half of a character
  pipeline). SPEARBench + FLEXI + VideoFDB cover the conversational round-trip
  half.
- **Sycophancy as axis-5 confound:** 2604.10733 shows personality traits (Big
  Five agreeableness) drive sycophancy at r=0.87 — a character suite must
  separate genuine personality stability from persona-induced agreeableness.
- Confirmed after seven ticks: still no open benchmark covering ≥3 full axes.
  Best open coverage: VideoFDB (~3 axis-slices) and EYT-Bench (~3 axis-slices:
  1, 2-partial, 5). The gap is now an *integration* gap with a visible assembly
  recipe, not a components gap.
- Next-tick angles: "character AI multi-metric evaluation suite"; "holistic
  avatar benchmark"; "affective consistency measurement LLM personality";
  follow-up work citing PALATE/PersonaShot/EYT-Bench.

## Sweep 2026-08-26 20:30 (Gap-2 Scout, tick 8)

Queries run: character AI multi-metric evaluation suite (zero — direct confirmation
of gap thesis); holistic avatar benchmark (1 hit, off-domain sign language);
affective consistency measurement LLM personality (6 hits, mostly off-domain);
multi-session persona consistency evaluation (6 hits); character believability
evaluation metric (6 hits, mostly off-domain); virtual agent personality stability
longitudinal (zero); embodied agent multi-dimensional evaluation (6 hits); persona
coherence long-term dialogue benchmark (6 hits); anthropomorphic dialogue evaluation
benchmark (5 hits); nonverbal behavior evaluation conversational agent (5 hits);
emotional arc character evaluation narrative (3 hits); immersive conversation persona
consistency evaluation (4 hits); emotional consistency character agent trajectory
(2 hits); character personality drift detection evaluation (zero); affective
trajectory consistency character (1 hit). Nine abstracts fetched for cited papers.

### arXiv:2607.17191 — Toward Anthropomorphic Dialogue: A Closed-Loop Framework for Human-Like Chat Generation, Evaluation, and Preference Alignment
URL: https://arxiv.org/abs/2607.17191
Authors: Wentao Liu, Siyu Song, Xi Chen, Youjia Li, Xiaokun Wang, Min Ji, Ji Wang
Categories: Artificial Intelligence

**Claim:** AnthroDial formulates anthropomorphic dialogue as a joint problem of
architecture, executable evaluation, and diagnostic alignment: (1) role-conditioned
scheduled dialogue runtime with persona/scenario cards, long-term memory, virtual
time, single-draft message decisions; (2) executable benchmark with L0 validity gate,
five per-turn dimensions, five dialogue-level dimensions; (3) post-training pipeline
with 16,436 scheduled-decision SFT examples + GRPO with Kalman-filtered capability
estimates. Evaluates 16 systems (frontier baselines, open models, SFT/RL ablations)
on 55 personas, 50 scenarios, 50 bindings, 100 role-conditioned cases per model.
Strict ACC: strongest non-trained baseline 32.00%, Qwen3.6-27B-SFT+RL 39.00%,
98.5 overall score. SFT+RL improve 9B no-think strict ACC from 0.00% to 18.37%.
**Closes gap:** partially — the closest instrument yet found to a multi-axis
character suite: it jointly scores persona, memory, timing, and multi-turn arc
(structurally axes 1, 2-partial, 5) in one executable harness with a shared
behavioral-dimension taxonomy across generation, evaluation, and reward. Still
text-only, no animation fidelity, no latency axis.
**Implementation note:** its shared behavioral-dimension taxonomy across
generation/evaluation/reward is the design pattern a five-axis suite should adopt;
a builder grafting animation and latency axes onto its per-turn/dialogue-level
scoring skeleton would have the first open 5-axis instrument.
Covers: 1, 2 (multi-turn arc), 5. Leaves open: 3, 4.

### arXiv:2509.03940 — VoxRole: A Comprehensive Benchmark for Evaluating Speech-Based Role-Playing Agents
URL: https://arxiv.org/abs/2509.03940
Authors: Weihao Wu, Liang Cao, Xinyu Wu, Zhiwei Lin, Rui Niu, Jingbei Li, Zhiyong Wu
Categories: Computation and Language, Artificial Intelligence

**Claim:** First comprehensive benchmark for speech-based role-playing conversational
agents: 13,335 multi-turn dialogues, 65.6 hours of speech, 1,228 unique characters
from 261 movies, with multi-dimensional profiles built by a two-stage automated
pipeline (audio-script alignment + LLM profile extraction). Multi-dimensional
evaluation of spoken dialogue models on persona consistency, revealing
strengths/limitations in maintaining persona consistency in speech.
**Closes gap:** partially — the largest-scale open character benchmark found so far
and the first to evaluate persona consistency in the speech modality (axis 1 spoken
+ axis 5 persona consistency + axis 2 emotion-in-speech slice). No visual animation,
no latency measurement, no longitudinal personality tracking beyond dialogue turns.
**Implementation note:** its 1,228-character profile corpus and multi-dimensional
scoring protocol are a ready-made audio layer for a character suite; a builder
would add visual animation, latency, and longitudinal axes to reach 5-axis coverage.
Covers: 1 (spoken), 5, 2 (emotion-in-speech slice). Leaves open: 3, 4, true 2.

### arXiv:2603.03282 — MIBURI: Towards Expressive Interactive Gesture Synthesis
URL: https://arxiv.org/abs/2603.03282
Authors: M. Hamza Mughal, Rishabh Dabral, Vera Demberg, Christian Theobalt
Categories: Computer Vision and Pattern Recognition, Graphics

**Claim:** First online, causal framework for generating expressive full-body gestures
and facial expressions synchronized with real-time spoken dialogue. Uses body-part
aware gesture codecs encoding hierarchical motion into multi-level discrete tokens,
autoregressively generated by a 2D causal framework conditioned on LLM-based
speech-text embeddings. Auxiliary objectives encourage expressive/diverse gestures.
Comparative evaluations show natural, contextually aligned gestures vs baselines.
**Closes gap:** no (system paper, not a benchmark) / addresses adjacent problem —
demonstrates that a single model can jointly produce axis 3 (full-body animation +
facial expression) and axis 4 (real-time, online, causal) synchronized with spoken
dialogue. Its evaluation is self-reported, not a shared harness.
**Implementation note:** existence proof that axes 3+4 are jointly satisfiable in
real-time when driven by LLM speech-text embeddings; a character benchmark should
adopt its real-time full-body+face test condition as the axis-3/4 joint evaluation
setting. Pair with VoxRole's speech corpus for an audiovisual character test.
Covers: 3, 4 (system-internal). Leaves open: 1, 2, 5.

### arXiv:2603.23231 — PERMA: Benchmarking Personalized Memory Agents via Event-Driven Preference and Realistic Task Environments
URL: https://arxiv.org/abs/2603.23231
Authors: Shuochen Liu, Junyi Zhu, Long Shu, Junda Lin, Yuhao Chen, Haotian Zhang +8 more
Categories: Artificial Intelligence

**Claim:** Benchmark evaluating persona consistency over time beyond static preference
recall: temporally ordered interaction events spanning multiple sessions and domains,
with preference-related queries inserted over time, plus text variability and
linguistic alignment to simulate erratic user inputs and individual idiolects.
Multiple-choice and interactive tasks probe persona understanding along the
interaction timeline. Finds advanced memory systems extract precise preferences and
reduce token consumption vs raw semantic retrieval, but still struggle to maintain
coherent persona across temporal depth and cross-domain interference.
**Closes gap:** partially — directly measures axis 5 (persona consistency over time)
and axis 2 (evolving preferences across sessions), with multiple-choice +
interactive task formats. Text-only, no animation, no latency.
**Implementation note:** its temporal-depth + cross-domain interference design is
the right stress test for the axis-5/2 intersection; its finding that current
systems fail at temporal depth is a concrete baseline to beat.
Covers: 5, 2 (evolving preferences). Leaves open: 1 (partially), 3, 4.

### arXiv:2412.05631 — CharacterBox: Evaluating the Role-Playing Capabilities of LLMs in Text-Based Virtual Worlds
URL: https://arxiv.org/abs/2412.05631
Authors: Lei Wang, Jianxun Lian, Yi Huang, Yanqi Dai, Haoxuan Li, Xu Chen +3 more
Categories: Computation and Language, Artificial Intelligence

**Claim:** Simulation sandbox generating situational fine-grained character behavior
trajectories via a character agent (grounded in psychological/behavioral science)
and a narrator agent (coordinates interactions and environmental changes).
Introduces two trajectory-based methods to enhance LLM role-playing. Fine-tuned
smaller models (CharacterNR, CharacterRM) substitute for GPT APIs with competitive
performance.
**Closes gap:** partially — trajectory-based evaluation of role-playing (axis 1 +
axis 5) with a narrator/character agent split that mirrors EYT-Bench's three-party
design. Text-only, no affect/animation/latency axes.
**Implementation note:** its fine-tuned open substitute models (CharacterNR/RM) are
a cost-effective evaluation infrastructure a character suite could adopt; its
trajectory-based scoring is a template for axis-5 behavioral measurement.
Covers: 1, 5. Leaves open: 2, 3, 4.

### arXiv:2605.06007 — PersonaKit (PK): A Plug-and-Play Platform for User Testing Diverse Roles in Full-Duplex Dialogue
URL: https://arxiv.org/abs/2605.06007
Authors: Hyunbae Jeon, Jinho D. Choi
Categories: Computation and Language, Artificial Intelligence

**Claim:** Open-source low-latency web platform for rapid prototyping and evaluation
of conversational agents with diverse personas via JSON configurations specifying
probabilistic interruption-handling behaviors (yield, hold, bridge, override).
In-the-wild evaluation with 8 distinct personas demonstrates extensible end-to-end
framework for studying sociolinguistic behaviors in spoken agents.
**Closes gap:** addresses adjacent problem — a platform paper, not a benchmark,
but it directly targets the axis-1/4/5 intersection: persona-specific turn-taking
behavior under full-duplex latency constraints. Its finding that "always-yield"
undermines non-submissive roles is a concrete axis-5 failure mode under axis-4
pressure.
**Implementation note:** its JSON persona + interruption-behavior configuration
schema is a reusable test harness for the axis-4/5 interaction; a character suite
should adopt its A/B survey methodology for persona-consistency-under-latency tests.
Covers: 1, 4 (full-duplex turn-taking), 5 (persona-specific behavior). Leaves open:
2, 3.

## Sweep synthesis

- **Closest multi-axis instrument yet:** AnthroDial (2607.17191) with 5 per-turn +
  5 dialogue-level dimensions spanning persona, memory, timing, and multi-turn arc
  is the first open instrument to approach a character-complete evaluation *design*
  (if not full 5-axis coverage). Its shared behavioral-dimension taxonomy across
  generation, evaluation, and reward is the strongest architectural template found.
- **Speech modality benchmark arrives:** VoxRole (2509.03940) at 1,228 characters
  and 65.6 hours is the largest-scale open character benchmark and the first to
  evaluate persona consistency in speech. Combined with MIBURI's real-time
  full-body+face gesture synthesis, the audiovisual layer of a suite is now
  buildable from open parts.
- **Persona-over-time measurement matures:** PERMA (2603.23231) and CharacterBox
  (2412.05631) both target long-horizon persona consistency with complementary
  designs (event-driven preference trajectories vs simulation-sandbox behavior
  trajectories). The axis-5 methodology is now rich enough to support multiple
  independent measurement traditions.
- **Latency + persona interaction:** PersonaKit (2605.06007) shows that persona
  consistency (axis 5) degrades under full-duplex latency pressure (axis 4) when
  systems default to "always-yield" — the first empirical demonstration that axes
  4 and 5 interact, which a joint suite must measure together.
- **Zero-hit confirmations:** "character AI multi-metric evaluation suite" and
  "virtual agent personality stability longitudinal" both returned zero results,
  directly confirming the gap thesis: no single instrument jointly measures what
  a character-complete suite requires.
- **Confirmed after eight ticks:** still no open benchmark covering ≥3 full axes.
  Best open coverage: AnthroDial (~3 axis-slices: 1, 2-partial, 5) and VoxRole
  (~3 axis-slices: 1-spoken, 5, 2-speech-emotion). The gap remains an *integration*
  gap with a thickening assembly recipe, not a components gap.
- Next-tick angles: follow-up work citing AnthroDial/VoxRole/MIBURI; "character
  AI evaluation suite" with different vocabulary; "persona consistency under
  stress" (adversarial + longitudinal combined); "multi-session avatar evaluation"
  coupling speech + gesture + persona.

## Sweep 2026-08-27 04:30 (Gap-2 Scout, tick 9)

Queries run: persona consistency under stress adversarial longitudinal (429 immediately — scraper dark); multi-session avatar evaluation speech gesture persona (429); character AI evaluation suite multi-dimensional (429); anthropomorphic conversational agent benchmark evaluation (429); persona consistency conversational agent multi-session (429); virtual agent personality stability evaluation long-term (429). All six searches 429'd on first contact — the rate limit window is closed for this session. Switched to web_search fallback. Eight abstracts extracted for cited papers via web_extract. This tick targeted the two trailing axes (axis 2 affective consistency, axis 3 animation) plus axis 5 personality stability follow-ups.

### arXiv:2603.25620 — PICon: A Multi-Turn Interrogation Framework for Evaluating Persona Agent Consistency
URL: https://arxiv.org/abs/2603.25620
Authors: (not fully extracted; KAIST EdLab)
Categories: cs.CL, cs.AI

**Claim:** Applies interrogation methodology to persona agent evaluation: logically chained multi-turn questioning exposes contradictions in fabricated identities. Evaluates consistency along three dimensions — internal consistency (freedom from self-contradiction), external consistency (alignment with real-world facts), retest consistency (stability under repetition). Evaluates seven groups of persona agents alongside 63 real human participants; finds even systems previously reported as highly consistent fail to meet the human baseline across all three dimensions. No numeric values in abstract.
**Closes gap:** partially — the three-dimension decomposition (internal/external/retest) is a candidate measurement taxonomy for axis 5 (personality stability), and its interrogation protocol is a methodological advance over static questionnaire approaches. Still text-only, no animation, no latency, no longitudinal affect tracking.
**Implementation note:** adopt its logically chained interrogation as the axis-5 stress-test protocol — a character that contradicts itself under sustained questioning has failed personality stability regardless of its offline questionnaire scores. Pair with Elder-Sim's α/ICC stats for a full axis-5 instrument.
Covers: 5 (rigorously), 1 (dialogue slice). Leaves open: 2, 3, 4.

### arXiv:2511.00222 — Consistently Simulating Human Personas with Multi-Turn Reinforcement Learning
URL: https://arxiv.org/abs/2511.00222
Authors: Marwa Abdulhai et al.
Categories: cs.CL, cs.AI

**Claim:** Unified framework for evaluating and improving persona consistency in LLM dialogue. Defines three automatic metrics — prompt-to-line consistency, line-to-line consistency, Q&A consistency — validated against human annotations. Applies multi-turn RL to fine-tune LLMs for three user roles (patient, student, social chat partner); reduces inconsistency by over 55%. No other numeric values in abstract.
**Closes gap:** partially — the three-metric decomposition is the most granular open instrument yet for axis 5 measurement on the character's own side (not user-side inversion), and the 55% inconsistency reduction via RL demonstrates that persona stability is trainable and thus benchmarkable. Text-only, no affect trajectory, no animation, no latency.
**Implementation note:** the three automatic metrics (prompt-to-line, line-to-line, Q&A consistency) are directly reusable as the axis-5 scoring layer of a character suite — they operationalize "personality stability" as three separable, automatically computable quantities. Combine with BFI-Adapt's directional-fidelity scoring for longitudinal shape.
Covers: 5 (rigorously), 1. Leaves open: 2, 3, 4.

### arXiv:2412.00804 — Examining Identity Drift in Conversations of LLM Agents
URL: https://arxiv.org/abs/2412.00804
Authors: Bugeun Kim et al.
Categories: cs.CY

**Claim:** First systematic examination of identity drift across nine LLMs via multi-turn conversations on personal themes, analyzed qualitatively and quantitatively. Three findings: (1) larger models experience greater identity drift, (2) model family differences exist but are weaker than parameter-size effects, (3) assigning a persona may not help maintain identity. No numeric values in abstract beyond these comparative findings.
**Closes gap:** addresses adjacent problem — provides empirical evidence that axis 5 (personality stability) is a real, measurable failure mode that worsens with scale, and that simple persona assignment is insufficient. This is a negative-result justification for why a character benchmark needs a dedicated axis-5 instrument, not just a persona prompt.
**Implementation note:** cite as evidence that personality stability cannot be assumed from model scale or persona prompting — a character suite must measure it directly. Its multi-turn personal-theme protocol is a reusable axis-5 test design.
Covers: 5 (empirical evidence). Leaves open: 1, 2, 3, 4.

### arXiv:2505.11425 — Face Consistency Benchmark for GenAI Video
URL: https://arxiv.org/abs/2505.11425
Authors: Michal Podstawski, Malgorzata Kudelska, Haohong Wang
Categories: cs.CV

**Claim:** Introduces Face Consistency Benchmark (FCB) for evaluating character facial consistency in AI-generated videos using six face recognition models (VGG-Face, Facenet, Facenet512, ArcFace, SFace, GhostFaceNet) via DeepFace library. Evaluates four text-to-video models (HunyuanVideo, Vchitect-2.0, CogVideoX1.5-5B, Runway Gen-3) on 30 videos per model with consistent prompts. Finds all models fall substantially short of real-video consistency; HunyuanVideo and Runway Gen-3 show relatively better performance but gap remains large. Numeric cosine distances reported per model in paper; not quoted here from abstract.
**Closes gap:** partially — the first found instrument measuring character *identity* consistency in generated video across temporal sequences, which is the axis-3 slice most relevant to character embodiment (not just lip-sync or motion quality). Still no dialogue coupling, no affect semantics, no latency.
**Implementation note:** its face-similarity-metric family is directly reusable as the axis-3 identity-stability sub-score of a character suite — pair with THEval's per-shot quality metrics for a complete axis-3 instrument. Its finding that all generative models fail at identity consistency is the baseline to beat.
Covers: 3 (facial identity consistency). Leaves open: 1, 2, 4, 5.

### arXiv:2512.14234 — ViBES: A Conversational Agent with Behaviorally-Intelligent 3D Virtual Body
URL: https://arxiv.org/abs/2512.14234
Authors: (not fully extracted)
Categories: cs.HC, cs.AI, cs.GR

**Claim:** Introduces a new benchmark jointly assessing dialogue understanding, social appropriateness, and motion quality via multimodal LLM judges plus task-specific metrics. Compares ViBES against SOLAMI (text-to-motion SOTA) and co-speech gesture baselines; shows ViBES outperforms prior methods across all metrics. Evaluates on co-speech gesture generation and text-to-speech benchmarks. No numeric values in abstract.
**Closes gap:** partially — the closest multi-axis open instrument this tick: it jointly scores dialogue understanding (axis 1), social appropriateness (axis 2 slice), and motion quality (axis 3) in one benchmark with a multimodal LLM judge. Still no longitudinal personality stability (axis 5) and no latency axis (axis 4); evaluation is benchmark-scale, not months-scale.
**Implementation note:** its three-axis joint scoring architecture (dialogue + social + motion) is the strongest existing template for the audiovisual half of a character suite — a builder adding BFI-Adapt-style axis-5 scoring and a latency budget would have the first open 4-axis instrument.
Covers: 1, 2 (social appropriateness slice), 3. Leaves open: 4, 5.

### arXiv:2602.00607 — MTAVG-Bench: A Diagnostic Benchmark for Multi-Talker Dialogue-Centric Audio-Video Generation
URL: https://arxiv.org/abs/2602.00607
Authors: (not fully extracted)
Categories: cs.CV, cs.MM

**Claim:** Diagnostic benchmark for multi-talker dialogue-centric audio-video generation, organized into four progressive levels: signal fidelity, attribute consistency, social interaction, and cinematic expression, with fine-grained diagnostic dimensions and question-based protocols for both dimension-wise and overall assessment. Evaluates a broad set of omni-modal models (Gemini family, proprietary and open-source). Finds systematic limitations in multi-speaker dialogue settings. No numeric values in abstract.
**Closes gap:** partially — the four-level taxonomy (signal → attribute → social → cinematic) is a candidate evaluation architecture for the axis-2/3 intersection: social interaction level touches affective consistency, while attribute consistency covers animation fidelity. Still no personality stability, no latency axis, and the benchmark targets generation quality rather than character-over-time.
**Implementation note:** its four-level diagnostic architecture is reusable as the axis-2/3 joint scoring spine of a character suite — particularly the social interaction level as the bridge between affective and visual measurement. Pair with THEval's per-shot metrics for the visual layer.
Covers: 2 (social interaction slice), 3 (attribute consistency + cinematic expression). Leaves open: 1 (partially), 4, 5.

## Sweep synthesis

- **Axis-5 methodology deepens:** PICon (interrogation-based three-dimension consistency), Consistently Simulating Human Personas (three automatic metrics with 55% RL improvement), and Examining Identity Drift (empirical drift evidence) together form a mature axis-5 measurement stack. PICon's internal/external/retest decomposition + the prompt-to-line/line-to-line/Q&A metrics from 2511.00222 + BFI-Adapt's directional fidelity = a complete axis-5 instrument exists in open parts, unassembled.
- **Axis-3 gains identity consistency:** Face Consistency Benchmark (2505.11425) fills the gap in THEval's face-only leaderboard by adding character identity stability measurement — a character's face should remain recognizably itself across time, not just move naturally.
- **Multi-axis audiovisual instrument arrives:** ViBES (2512.14234) is the first open benchmark found that jointly scores dialogue understanding + social appropriateness + motion quality (~3 axis-slices: 1, 2-social, 3). Combined with MTAVG-Bench's four-level diagnostic architecture, the audiovisual half of a character suite now has two independent multi-axis templates.
- **Scraper 429 on first contact:** all six arxiv searches 429'd immediately — the rate limit window was closed before any results returned. Web_search + web_extract fallback worked but yields fewer papers per tick. Rate limit may require spacing ticks further apart or using the bulk API with stricter delays.
- **Confirmed after nine ticks:** still no open benchmark covering ≥3 full axes. Best open coverage: ViBES (~3 axis-slices: 1, 2-social, 3) and MTAVG-Bench (~2.5 axis-slices: 2-social, 3). The gap remains an *integration* gap with a thickening assembly recipe.
- Next-tick angles: verify MTAVG-Bench arXiv ID resolves (2602.00607); follow-up work citing ViBES/PICon/FCB; "affective consistency character self-trajectory" with different vocabulary; "full-body character animation identity consistency over time."
