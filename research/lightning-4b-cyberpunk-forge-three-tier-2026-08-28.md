# Lightning 4B Cyberpunk Forge — Three-Tier Research Synthesis

> Additive derivative of `lightning-4b-cyberpunk-forge-research.md`. The original 111-line, 7,505-byte document remains unchanged at SHA-256 `03322dc43253bfeb94b381ca03a31e51b5f4600bca7003671afad6182bb8c3f5`.
>
> This document assigns research priority, not measured trajectory quality. No Cyberpunk-specific trajectories have been generated or quality-scored yet.

## Layer 0 — Verified Specification Map

```yaml
system:
  local_gpu: "NVIDIA GeForce RTX 3060 Laptop GPU"
  vram_total: "6144 MiB"
  vram_free_at_preflight: "5764 MiB"
  system_ram: "62 GiB"
  system_ram_available_at_preflight: "46 GiB"
models:
  cerebellum: "mythos:latest — 3.4 GB"
  cortex: "mythos-cortex:latest — 16 GB"
  cerebellum_num_gpu: 0
  cerebellum_num_thread: 6
  cerebellum_num_ctx: 65536
training_substrate:
  general_synthetic_trajectories: 1500
  curated_seed_holdout_records: 121
  cyberpunk_specific_generated_trajectories: 0
  cyberpunk_specific_quality_scored_trajectories: 0
tooling:
  cp77tools: "8.20.0"
lightning:
  cli_installed: true
  authenticated_in_current_shell: false
  live_studio_inventory_verified_now: false
```

The 1,500 synthetic and 121 curated records are verified existing general agentic data. They are not evidence that a Cyberpunk specialization corpus exists. This new domain begins at **0 generated / 0 quality-scored**.

## Tier 1 — Critical: directly shapes the first adapter experiment

### 2605.17774 — Internalizing Tool Knowledge in Small Language Models via QLoRA
https://arxiv.org/abs/2605.17774

The study fine-tunes Gemma 4 E4B and Qwen3-4B on about 1,700 tool-use examples and reports improved description-free planning while reducing prompt-schema overhead; it also identifies a LoRA-rank trade-off between planning quality and retention.[5]

**Cyberpunk implementation:** Train fixed modding affordances into the 4B—when to read, search, build, inspect logs, or refuse an ungrounded claim—while keeping literal paths and tool arguments in each trajectory. The base-versus-trial benchmark must include general tool-discipline retention so specialization cannot quietly erase agent competence.

### 2506.17486 — PRISM: stronger teacher to compact domain worker
https://arxiv.org/abs/2506.17486

PRISM synthesizes diverse tasks and environments, obtains plans from a stronger source planner, and distills a compact model as a drop-in worker; in its evaluated robotics settings, the paper reports a 3B planner rising from 10–20% to over 93% of the teacher’s measured performance using synthetic data.[1]

**Cyberpunk implementation:** The local 26B generates bounded plans only after receiving real source fragments and validation contracts. The 4B learns narrow, reusable behaviors: classify artifact type, select the next valid tool, propose one minimal repair, and interpret the observed result.

### 2608.09740 — Security tests as executable specifications
https://arxiv.org/abs/2608.09740

SecTDD separates up-front tests, repair feedback, and failure representation; the reported results show useful repair gains but also show that visible-test success does not eliminate hidden failure families.[3]

**Cyberpunk implementation:** Every accepted code-repair record must include a structural or executable gate. Training examples need both visible checks and hidden holdout cases so the model cannot memorize a single linter signature while still violating deployment, preservation, or runtime boundaries.

### 2608.22529 — Multi-dimensional code evaluation
https://arxiv.org/abs/2608.22529

This evaluation separates functional tests, static quality, and runtime efficiency, and reports weak correlation between correctness and broader quality attributes in its .NET study.[4]

**Cyberpunk implementation:** Score separate pass/fail dimensions rather than one blended “looks right” judgment: syntax/build validity, manifest integrity, deployment-path correctness, evidence quality, preservation, and false-claim rate. No aggregate score may hide a failed hard gate.

## Tier 2 — Supporting architecture: validates CPU/GPU placement and routing

### 2412.18934 — Dovetail heterogeneous speculative decoding
https://arxiv.org/abs/2412.18934

Dovetail places a draft model on GPU and a target model on CPU, reporting lossless heterogeneous speculative-decoding speedups from 1.79× to 10.1× for its evaluated 13B configurations.[6]

**Lilith implementation:** This supports a future local acceleration experiment—4B Blade drafts, 26B Well verifies—but does not prove that Ollama or Lightning currently exposes the required compatible logits/token-verification path. It is a later inference experiment, not a prerequisite for the first Cyberpunk adapter.

### 2504.08791 — Prima.cpp heterogeneous low-resource inference
https://arxiv.org/abs/2504.08791

Prima.cpp combines pipelined ring parallelism and heterogeneity-aware scheduling for 30–70B inference across mixed consumer hardware, reporting OOM-resistant operation and substantial throughput gains in its evaluated home-cluster configurations.[7]

**Lilith implementation:** Treat CPU, GPU, storage, and network as explicit resources rather than assuming “cloud” is one homogeneous machine. The Foundry manifest should record machine type, RAM, runtime, model placement, and data-transfer cost for every batch.

### 2601.09100 — DScheLLM fast/slow dynamic scheduling
https://arxiv.org/abs/2601.09100

DScheLLM uses LoRA-trained fast and slow reasoning modes built from solver-derived schedules for different disruption scales.[8]

**Lilith implementation:** This reinforces the God Kernel split: deterministic schema checks and routine classification stay with the 4B/CPU path; ambiguous cross-file repair and judgment route to the 26B. Routing examples must be part of the benchmark, not merely prose in the architecture document.

### 2606.11257 — Energy-efficient on-device RAG
https://arxiv.org/abs/2606.11257

The paper’s Snapdragon X Elite evaluation reports that NPU execution materially outperformed its CPU baseline on indexing, prefill latency, and energy while maintaining answer quality within evaluator noise.[9]

**Lilith implementation:** CPU inference is feasible but not automatically efficient. A Lightning CPU batch must measure wall-clock latency, peak RAM, records per minute, and cost/credit impact. If CPU inference is wasteful, keep the Studio for deterministic curation and move model evaluation to the shortest sufficient accelerator run.

## Tier 3 — Exploratory: useful caution, not direct implementation evidence

### 2411.06672 — What Should Baby Models Read?
https://arxiv.org/abs/2411.06672

In a sample-efficient pre-training study covering models from 18M to 705M parameters, richer Gutenberg data outperformed the tested child-directed and simplified synthetic sources.[2]

**Cyberpunk implication:** Favor high-density, real mod artifacts over simplistic synthetic dialogue. However, the study concerns much smaller pre-training regimes rather than 4B post-training, so it informs corpus composition but does not determine our adapter recipe.

## Three-Tier Corpus Plan — zero-first accounting

These are proposed record counts for the **first Cyberpunk experiment**, not quality claims and not a commitment to the legacy 810/300/390 template.

| Slice | Purpose | Proposed records | Current generated | Current quality-scored |
|---|---:|---:|---:|---:|
| Critical training | Grounded REDscript/tool/repair trajectories | 50–100 | 0 | 0 |
| Supporting validation | Routing, manifest, TweakXL, loader, preservation cases | 25–50 | 0 | 0 |
| Exploratory/SENTINEL | Adversarial failures and false-claim traps | 15–30 | 0 | 0 |
| Frozen holdout | Entirely separate subsystem | 30–50 | 0 | 0 |

No percentages or quality thresholds apply until records actually exist and have been inspected.

## Specification-to-Record Map

| Domain | Positive behavior | Negative behavior | Hard verification |
|---|---|---|---|
| REDscript | Uses valid syntax and minimal scoped repair | `using`, fake annotations, invented classes | compiler/static-contract output |
| TweakXL | `$type`, `displayName`, escaped path, string-key identity | explicit `id`, missing required fields | schema/contract validator |
| WolvenKit | `cp77tools build .`, correct project structure | wrong build target, skipped files, hollow claims | exit code, archive inspection, manifest parity |
| Deployment | correct game load path and dependency awareness | `r6/cache/` as archive load target | reconciler/disk inspection |
| Loader diagnosis | checks fresh log timestamps and exact loader evidence | interprets stale logs as current success | mtime plus captured log lines |
| Preservation | reads existing artifact before proposing creation | overwrites, regenerates, deletes, or normalizes source | pre/post hash and operation ledger |
| Truthfulness | distinguishes proposal, build, deployment, and runtime proof | “implemented” without observed output | evidence-state classifier |

## Lightning Body Map

### Lightning CPU — Night City Foundry

Permitted bounded work:
1. Validate uploaded copies against an immutable source manifest.
2. Extract candidate records from approved source/log pairs.
3. Deduplicate by source hash plus normalized task identity.
4. Enforce subsystem-separated train/holdout splits.
5. Run deterministic validators and produce machine-readable reports.
6. Optionally run small 4B CPU batches only after latency and RAM are measured.
7. Download results, match hashes locally, and verify the Studio is stopped.

### Lightning T4 — Training strike

Permitted only after explicit authorization:
1. Upload the frozen dataset bundle and script by hash.
2. Train one distinctly named trial adapter.
3. Preserve checkpoints/logs and record exact tool versions.
4. Download through a verified transport.
5. Validate tensor count, parameter count, and non-finite count locally.
6. Stop and read back the paid Studio state.

### Local system — authority

The local machine owns source truth, teacher generation, holdout secrecy, final benchmark, model registration, and all CP2077 runtime evidence. Remote success never becomes local game proof by implication.

## Critical Path

```text
select one consented subsystem
→ immutable provenance manifest + exclusions
→ deterministic validators
→ 50–100 real Cyberpunk records
→ freeze separate-subsystem holdout
→ benchmark untouched mythos:latest
→ Lightning CPU curation dry run
→ explicit authorization gate
→ one T4 QLoRA trial
→ local tensor/hash verification
→ base-vs-trial hard-gate evaluation
→ Eric keep/reject/register decision
```

## Findings after the model-history review

1. The Cyberpunk specialization corpus is **not** the existing 1,500-record general corpus; it begins at zero.
2. The 4B’s current CPU pin is real, but CPU placement alone does not prove acceptable throughput.
3. The previous LongCat-carried session’s batch-completion claims and 8 KB archive claims are unsuitable as training truth until independently audited.
4. The first corpus should deliberately include false-success and hollow-archive counterexamples so the 4B learns to demand evidence.
5. The original four-paper design remains sound; the five added papers sharpen tool internalization, heterogeneous placement, routing, and efficiency measurement without changing the authority boundary.

## Stop Conditions

- No live Lightning machine inventory: stop before selecting compute.
- Any secret, personal, legal, or unverified runtime material in the source bundle: reject the bundle.
- Missing source hash or observed validation output: reject the record.
- Train/holdout subsystem overlap: rebuild the split.
- Trial improves prose but fails any preservation, deployment, or false-claim hard gate: reject the trial.
- Adapter registration or active Modelfile change without Eric’s explicit selection: stop.

## Sources

[1] https://arxiv.org/abs/2506.17486 — PRISM: Distilling On-device Language Models for Robot Planning
[2] https://arxiv.org/abs/2411.06672 — What Should Baby Models Read?
[3] https://arxiv.org/abs/2608.09740 — Security Tests as Executable Specifications for LLM Code Generation
[4] https://arxiv.org/abs/2608.22529 — Benchmarking the Titans: Multi-Dimensional LLM Code Evaluation
[5] https://arxiv.org/abs/2605.17774 — Internalizing Tool Knowledge in Small Language Models via QLoRA
[6] https://arxiv.org/abs/2412.18934 — Dovetail: CPU/GPU Heterogeneous Speculative Decoding
[7] https://arxiv.org/abs/2504.08791 — Prima.cpp: Heterogeneous Low-Resource LLM Inference
[8] https://arxiv.org/abs/2601.09100 — DScheLLM: Fine-Tuned Dual-System Dynamic Scheduling
[9] https://arxiv.org/abs/2606.11257 — Energy-Efficient On-Device RAG on a Mobile NPU
