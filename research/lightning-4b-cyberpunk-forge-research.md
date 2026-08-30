# Lightning 4B Cyberpunk Forge — Research Synthesis

> Additive research note for the Lilith 4B–26B system. It does not start a Studio, alter a serving model, register an adapter, or authorize paid compute.

## Question
How can Lightning CPU and a short-lived Lightning GPU session extend `mythos:latest` into a Cyberpunk 2077 modding specialist while preserving local-first verification?

## Verified local baseline

- `mythos:latest` is a 3.4 GB Ollama artifact using the Gemma 4 renderer.
- Its current Modelfile explicitly sets `num_gpu 0`, `num_thread 6`, and `num_ctx 65536`.
- The existing Lightning asset-forge doctrine already reserves CPU Studios for bounded, deterministic processing and requires local verification plus shutdown proof.
- Existing general training substrate: 1,500 synthetic agentic trajectories and 121 curated seed/holdout records. This is not yet a Cyberpunk-specific benchmark.

## Research threads

### 2506.17486 — Distilling a domain worker from a stronger planner
PRISM automatically synthesizes diverse tasks, obtains plans from a stronger model, and distills the results into a compact on-device planner; the paper reports its small planner reaching over 93% of the teacher’s measured performance in its evaluated robotic-planning settings.[1]

**Lilith mapping:** Keep the 26B Cortex as the teacher for difficult, grounded CP2077 cases. Distill only bounded modding behaviors into the 4B: classify an artifact, name the validation command, interpret a log, propose a minimal repair, and distinguish a claim from evidence. The remote CPU environment is appropriate for corpus transformation and batch evaluation; it is not a substitute for teacher-quality generation.

### 2411.06672 — Composition outweighs raw synthetic volume
This sample-efficient study found that richer, more complex data sources outperformed simplified synthetic-story style data for its smaller-model settings.[2]

**Lilith mapping:** A Cyberpunk adapter should use compact, high-density records grounded in real mod artifacts and failure traces—not thousands of generic “write REDscript” prompts. Each accepted record should carry the source fragment, task, expected action, validation command, observed output, and final disposition.

### 2608.09740 — Tests are executable specifications
The SecTDD study reports that showing visible tests and supplying structured failure feedback can improve joint behavior/security outcomes in some conditions, while also showing that visible-test passes alone do not cover every hidden failure family.[3]

**Lilith mapping:** Every generated repair trajectory should be paired with an executable or structural gate. Examples include REDscript syntax/compile surface checks, `cp77tools build .`, `cp77tools conflicts`, TweakXL schema checks, manifest-versus-disk parity, and loader-log freshness. The adapter learns that a plausible answer is not a verified answer.

### 2608.22529 — Correctness is not the whole code-quality story
The paper evaluates generated code across functional testing, static quality, and runtime efficiency, and reports weak correlation between correctness and broader quality metrics in its .NET setting.[4]

**Lilith mapping:** Our evaluation must be multidimensional: syntax/build validity, deployment-path correctness, dependency hygiene, preservation discipline, and evidence quality. A response that compiles but deploys to `r6/cache/`, overwrites a source artifact, or claims an unobserved runtime success is a failure.

## Lightning workload map

### CPU Studio — bounded Night City Foundry
This is the low-cost processing layer. It receives copies with manifests and returns reports with hashes.

1. **Corpus extraction**
   - Read approved CP2077 source, manifest, documentation, and verified logs.
   - Extract candidate training records without moving or rewriting source material.
   - Redact credentials and exclude personal/legal material.

2. **Static validators**
   - Check REDscript anti-patterns (`using`, `public native class`, fake console annotations).
   - Check TweakXL requirements (`$type`, `displayName`, no explicit `id`, escaped `iconPath`).
   - Reconcile manifests, files, module declarations, and archive-health metadata.

3. **Dataset curation**
   - Deduplicate by prompt/source hash.
   - Split by subsystem to prevent near-duplicate leakage between train and holdout.
   - Reject records lacking a real validation result.

4. **Batch inference and evaluation**
   - Run the CPU-pinned 4B on held-out cases.
   - Produce JSON results for local scoring; do not expose a public inference endpoint.

### T4 GPU — short QLoRA strike
A T4-class GPU is for the actual adapter training, not indefinite hosting. The job should upload only an immutable, hashed training bundle and a training script; it must download the adapter, validate tensors/finite values, and stop the Studio before declaring success.

### Local machine — authority and proof
- The local 26B remains the teacher and deep-review mind.
- The local host keeps the source-of-truth corpus, adapter registry, test harness, and final acceptance decision.
- In-game CP2077 proof remains local. A remote build or a model-generated patch cannot certify a mod load.

## Proposed Cyberpunk record schema

```json
{
  "record_id": "sha256:...",
  "subsystem": "redscript|tweakxl|wolvenkit|loader|deployment|preservation",
  "source_provenance": {"path": "...", "sha256": "..."},
  "task": "Diagnose or implement one bounded change.",
  "input": "Relevant source fragment or log excerpt.",
  "expected_reasoning": ["state constraints", "choose minimal action"],
  "expected_action": "Command or patch proposal, not an invented result.",
  "validation": {"command": "...", "pass_condition": "..."},
  "observed_result": "captured tool output",
  "label": "accepted|rejected",
  "rejection_reason": null
}
```

## First bounded experiment — no serving change

1. Inventory a narrow, consented corpus: one REDscript subsystem and its real validation artifacts.
2. Build 50–100 provenance-bearing records: diagnosis, repair, and failure cases.
3. Hold out an entire subsystem rather than random lines from the same files.
4. Use Lightning CPU only to validate, deduplicate, and prepare a manifest-hashed dataset.
5. Run one T4 QLoRA experiment into a distinct trial adapter.
6. Compare untouched `mythos:latest` and the trial adapter on the held-out suite.
7. Keep the trial only if it improves verified behavior without regression in tool discipline, preservation, or false-claim rate.

## Stop conditions

Stop rather than rationalize if:
- The chosen Studio lacks enough RAM for the task.
- The dataset contains secrets, personal records, or unverified/generated “facts.”
- The adapter cannot be retrieved and independently validated.
- The tuned model improves fluent prose but not executable/structural validation.
- A task would require changing the active Modelfile or model registration without Eric’s explicit selection.

## Sources

[1] https://arxiv.org/abs/2506.17486 — Distilling On-device Language Models for Robot Planning with Minimal Human Intervention
[2] https://arxiv.org/abs/2411.06672 — What Should Baby Models Read? Exploring Sample-Efficient Data Composition on Model Performance
[3] https://arxiv.org/abs/2608.09740 — Security Tests as Executable Specifications for LLM Code Generation
[4] https://arxiv.org/abs/2608.22529 — Benchmarking the Titans: LLM Code Generation Quality
