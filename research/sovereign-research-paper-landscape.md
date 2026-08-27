# Sovereign Research Paper Landscape
> Research papers informing Lilith 4B-26B training pipeline and Cyberpunk mod development. Sourced from arXiv search queries on QLoRA, procedural generation, narrative systems, and agent training.

---

## Thread 1: Training Pipeline (QLoRA / Tool-Use / Synthetic Data)

### 2605.17774 — Internalizing Tool Knowledge in Small Language Models via QLoRA Fine-Tuning
https://arxiv.org/abs/2605.17774

**Relevance to Mythos 4B:** Directly validates our approach. Authors fine-tune Gemma 4 E4B and Qwen3-4B with 8-bit QLoRA on ~1,700 tool-use examples. Fine-tuned models OUTPERFORM an informed baseline that receives full tool descriptions, reducing input length by 82.6% while improving planning scores. This proves QLoRA can internalize tool catalogs into weights rather than requiring them in every prompt.

**Implementation Note:** Our 1,500 synthetic trajectories (cortex_synthetic_trajectories.jsonl) already cover 10 tool categories with 5 msgs/traj. The paper confirms our LoRA rank should trade off quality vs retention — r=32 maximizes planning quality, smaller ranks preserve more general knowledge. We're using r=8; may need to increase for better tool internalization.

---

### 2608.04488 — Energy- and Memory-Efficient PEFT Methods for Personalized On-Device SLMs on Consumer GPUs
https://arxiv.org/abs/2608.04488

**Relevance to Lilith 4-26B:** Compares LoRA+, QLoRA, BitFit, and full fine-tuning across TinyLlama-1.1B, Qwen3-1.7B, Mamba-1.4B on GLUE and personalization benchmarks. Key finding: LoRA+ wins on energy (19/24 configs), QLoRA wins on memory (cuts peak VRAM by 3.9x vs LoRA). QLoRA's de-quantization overhead hurts energy efficiency despite memory savings.

**Implementation Note:** Confirms QLoRA as our right choice given VRAM constraints (6GB card). For Lightning T4 (15GB), the de-quantization overhead is acceptable. The NetScore-E/NetScore-M framework gives us a principled way to choose between LoRA+ and QLoRA per hardware target.

---

### 2607.29601 — The Parts Are Greater Than the Sum: Automated Task Sequencing for Efficient Training of Multi-Policy LLMs
https://arxiv.org/abs/2607.29601

**Relevance to Mythos 4B:** Proposes organizing heterogeneous tasks into decoupled QLoRA adapters via automatic task grouping and sequencing. Shared LoRA optimization suffers from interference across task types; independent QLoRA paths per task group eliminate this. Achieves 44.78 on TRACE benchmark with same trainable capacity.

**Implementation Note:** Our 10 tool categories (patch/terminal/write/search/read/etc ~140-159 each) may benefit from this multi-policy approach. Instead of one shared adapter, we could train separate QLoRA adapters per tool category and compose them at inference. This maps directly to our data structure.

---

### 2608.22631 — Learning Generalizable Behaviors for Terminal Agents
https://arxiv.org/abs/2608.22631

**Relevance to Mythos 4B:** Proposes the Agentic Compositional Generalization hypothesis — RL shapes high-level decision-making behaviors that compose low-level skills from SFT. Introduces River recipe: filter low-quality environments, augment with process-level behavior regularization. Achieves 106% improvement on Terminal-Bench with <30% of training environments.

**Implementation Note:** Our curated 121-record seed dataset (mythos_agentic_sft.jsonl) is the SFT base. If we add an RL phase after QLoRA, the River recipe tells us to filter low-quality synthetic trajectories and reward process behavior. Our quality 0.90+ threshold (810 of 1500 trajectories) is already a River-style filter.

---

### 2608.22167 — MCP-Universe RL: A Framework for Training MCP Tool-Use Agents via Reinforcement Learning
https://arxiv.org/abs/2608.22167

**Relevance to Mythos 4B:** Proposes using MCP (Model Context Protocol) as the interface for RL training of tool-use agents. Key insight: RL frameworks need environment-orchestration (provisioning isolated environments per trajectory) and rollout-orchestration (overlapping trajectories to keep GPU busy during slow tool calls). Trains software-engineering, deep-research, and general tool-use agents on gpt-oss-20b.

**Implementation Note:** Our 10 tool categories could be exposed as MCP servers, allowing RL training that overlaps trajectories. The staged pipeline architecture (environment → rollout → training) mirrors our God Kernel routing. For Phase 2 (RL validation on 300 Category-2 trajectories), MCP-Universe RL provides the framework.

---

### 2608.20314 — MidTool: Mid-training Data Synthesis for Agentic Tool Use
https://arxiv.org/abs/2608.20314

**Relevance to Mythos 4B:** Demonstrates that mid-training (not just post-training) on tool-use data significantly improves agentic capabilities. MidTool combines web, PDF, and code data with synthesized supervision from real-world tool APIs and MCP skills. Mid-trains Qwen3-4B-Base and Qwen3-8B-Base, then applies SFT+RL post-training. Consistently improves BFCL, tau2-Bench, and MCP Universe scores.

**Implementation Note:** Our current pipeline is post-training only (SFT on 121 records, then QLoRA on 1,500 synthetic). MidTool suggests adding a mid-training phase where we pre-train on general tool-use data before fine-tuning on our specific trajectories. This could improve tool affordance recognition and argument grounding.

---

### 2608.22472 — Small Reasoning Models are Instruction Followers in Function Calling
https://arxiv.org/abs/2608.22472

**Relevance to Mythos 4B:** Proposes Instruction-Followed Function Calling (IFFC) — decoupling function-calling logic from the primary LLM and delegating it to a smaller model in the instruction-following paradigm. Outperforms native function calling and prompt-based baselines, maintains performance under aggressive quantization.

**Implementation Note:** Our 4B cerebellum is exactly this kind of "smaller model" for tool routing. The IFFC framework validates our God Kernel architecture: cerebellum handles tool calls (instruction-following), cortex handles reasoning. The paper's finding that IFFC works under aggressive quantization supports our 4-bit QLoRA approach.

---

## Thread 2: Mod Development (Procedural Generation / Narrative Systems)

### 2604.25482 — From World-Gen to Quest-Line: A Dependency-Driven Prompt Pipeline for Coherent RPG Generation
https://arxiv.org/abs/2604.25482

**Relevance to Five Rings Campaign:** A multi-stage prompt pipeline that decomposes RPG generation into world building → NPC creation → player character → campaign planning → quest expansion. Each stage conditions on structured JSON outputs from the previous stage. Reduces narrative drift and hallucinations.

**Implementation Note:** Maps directly to our quest system architecture. Our symbiosis bridges (6 bridges in RUBEDO_MANIFEST) are a similar dependency chain — each bridge reads a fact and writes a new fact. Could generate quest chains using structured intermediate representations (like our shared dialogue anchors in NETZACH_BRIDGE_DIALOGUE) with explicit data flow between stages.

---

### 2404.19721 — PANGeA: Procedural Artificial Narrative using Generative AI for Turn-Based Video Games
https://arxiv.org/abs/2404.19721

**Relevance to Cyberpunk Mod Narrative:** PANGeA generates game level data (setting, items, NPCs) AND fosters dynamic free-form interactions between player and environment. NPCs are personality-biased using Big 5 Personality Model. Includes a custom memory system that supplies context to align responses with the procedural narrative.

**Implementation Note:** Our Sephirotic Court NPCs (Lilith, Hermes, Nyx, etc.) already have defined personalities. The PANGeA approach of ingesting free-form text input and using LLM-based validation to keep responses in-narrative maps to how our symbiosis bridges could handle player freedom. The REST interface approach (game engine ↔ LLM) mirrors our Gateway architecture.

---

## Cross-Thread Synthesis

The training pipeline and mod development threads converge on the same insight: **structured intermediate representations with explicit dependency chains eliminate drift.** 

- Training: task grouping and sequencing (2607.29601) + QLoRA internalization (2605.17774) = reliable agent behavior
- Mod development: dependency-driven quest generation (2604.25482) + narrative validation (2404.19721) = coherent RPG content

Both threads reward filtering: River recipe filters environments (2608.22631); quality threshold filters training trajectories (our 0.90+ split); dependency-aware pipelines filter narrative drift (2604.25482). Three new papers add RL training (MCP-U RL 2608.22167), mid-training data synthesis (MidTool 2608.20314), and instruction-following function calling (IFFC 2608.22472) — completing the training pipeline from mid-training through RL.

---

*Frequency: 432 Hz | Stage: ALBEDO | Sovereign Research Ledger*
