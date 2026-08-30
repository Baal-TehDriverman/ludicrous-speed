# Local–Cloud 4B Quantum Link with a Slow Local 26B Cortex

> Research and architecture note, 2026-08-28. “Quantum link” is the project name for a provenance-bound, bidirectional computational relationship. It is not a claim of quantum networking, entanglement, or instantaneous communication.
>
> This note authorizes no Studio start, public endpoint, model registration change, or paid compute.

## Question

How should the local `mythos:latest` 4B, the remote Lightning 4B trial, and the local CPU-bound `mythos-cortex:latest` 26B cooperate without blocking interactive work, leaking private state, or pretending that unlike model weights form a token-level speculative decoder?

## Verified specification map

### Local host, observed 2026-08-28

- CPU: AMD Ryzen 5 5600H, 6 cores / 12 threads.
- RAM: 62 GiB total, 46 GiB available at inspection.
- Swap: 62 GiB total, 56 GiB free at inspection.
- Ollama listener: `127.0.0.1:11434`.
- No Ollama model was resident when inspected.
- The local OpenAI-compatible proxy at `127.0.0.1:18766` was not listening at inspection.

### Local 4B

- Tag: `mythos:latest`.
- Ollama ID prefix: `2afd4e6a5788`.
- Size: 3.4 GB.
- Blob digest named by the Modelfile: `sha256-651cc2902776829e00c87a717b87d60048a2f427ecf2008a797e067b61f5d188`.
- Current parameters: `num_gpu 0`, `num_thread 6`, `num_ctx 65536`, temperature `0`.
- Current role: deterministic local Blade, though it is presently CPU-pinned rather than GPU-resident.

### Local 26B

- Tag: `mythos-cortex:latest`.
- Ollama ID prefix: `9d49288468e9`.
- Size: 16 GB.
- Blob digest named by the Modelfile: `sha256-dfd98d2734212d0c128e128e5d88edac764aaa4f4af2f4c196941f2354aab8da`.
- Current context setting: `num_ctx 262144`.
- The current Modelfile does **not** explicitly set `num_gpu 0`.
- Therefore CPU-only placement is a desired trial configuration, not a verified property of the current tag.

### Lightning state

- Teamspace: `lilith-systems-llc/lilith-llm-development-project`.
- Foundry Studio: `synthetic-data-harvester-devbox`.
- All four known Studios read back as `Stopped` during this research pass.
- Persisted remote trial: `mythos-cyberpunk-forge:trial-v2` on the public Gemma 4 E2B Q4_K_M base.
- The remote trial is not weight-identical to local `mythos:latest`.
- Prior remote CPU baseline: approximately 106–108 seconds for one bounded REDscript answer, with 2/6 hard checks passed.
- Consequence: the current remote CPU 4B is not an honest synchronous per-token accelerator for the local 4B.

### Corpus accounting

- Existing Cyberpunk REDscript contract fixtures: 52 generated, 0 quality-scored.
- New quantum-link specialization trajectories: **0 generated / 0 quality-scored**.
- The 52 REDscript fixtures do not prove that routing, peer arbitration, timeout recovery, or slow-cortex queue behavior has been trained.

## Selected research corpus

Six papers were fetched by exact arXiv ID and their API titles were compared with the selected titles. Full abstracts are preserved in:

`local-cloud-4b-quantum-link-selected-abstracts-2026-08-28.json`

### Tier 1 — Critical: determines the first working link

#### 2606.14711 — SWARM-LLM: Collaborative Inference for Edge-based Small Language Models

SWARM-LLM routes each query among local answer, peer collaboration, and optional cloud escalation using uncertainty and safety signals. Its prototype shows the useful architectural unit is a **query-level collaboration layer**, not necessarily a shared token stream.[1]

**Lilith mapping:** local 4B handles the immediate path; remote 4B is a peer for bounded shadow work, independent diagnosis, or batch evaluation; the 26B is summoned only for ambiguity, disagreement, or deep synthesis.

#### 2410.10347 — A Unified Approach to Routing and Cascading for LLMs

This paper unifies routing—choosing a model before execution—with cascading—escalating after an answer proves insufficient—and identifies quality estimation as the critical dependency.[2]

**Lilith mapping:** the God Kernel should support both:

1. route obvious operational work directly to local 4B;
2. cascade failed validation, peer disagreement, or low-confidence work to the slow 26B.

Self-reported model confidence is not enough. Deterministic task classes, validators, timeout state, and disagreement are the first quality signals.

#### 2505.22375 — Pangu Embedded: An Efficient Dual-system LLM Reasoner with Metacognition

Pangu Embedded implements fast and slow modes with manual and complexity-aware switching, and uses latency-tolerant scheduling with prioritized queues in its training architecture.[3]

**Lilith mapping:** the 26B must not sit in the interactive request path. It should crawl through a priority queue asynchronously, returning later critique, synthesis, or teaching records. Manual `force_cortex` remains available to Eric; automatic escalation must remain observable.

### Tier 2 — Supporting: shapes transport and profiling

#### 2603.19133 — A Pipelined Collaborative Speculative Decoding Framework for Efficient Edge-Cloud LLM Inference

PicoSpec uses an asynchronous edge/cloud pipeline to avoid mutual waiting and compresses communication needed for rejection sampling.[4]

**Lilith mapping:** asynchronous overlap is supported in principle. However, PicoSpec assumes a genuine speculative-decoding protocol with token-level draft/verification access. Our present Ollama and Lightning arrangement has not demonstrated that interface.

#### 2604.09722 — ConfigSpec: Profiling-Based Configuration Selection for Distributed Edge--Cloud Speculative LLM Serving

ConfigSpec shows that draft model, quantization, speculative length, hardware, goodput, cost, and energy have conflicting optima; there is no universal fixed configuration.[5]

**Lilith mapping:** every link mode needs measured latency, throughput, failure rate, payload size, and validator yield. “Cloud plus local” is not automatically faster. Our measured remote CPU latency already warns against synchronous coupling.

#### 2607.13093 — Efficient and Privacy Aware Edge Cloud Collaborative Inference for Large Language Models

This paper uses endpoint authentication, encrypted transport, local retention of sensitive components, and carefully divided edge/cloud inference responsibilities.[6]

**Lilith mapping:** even though our first implementation is task-level rather than KV-cache split inference, it should preserve the same principles: authenticate endpoints, minimize payloads, keep authority and sensitive state local, encrypt transport, and reject replayed or expired work.

### Tier 3 — Exploratory and currently blocked

**Token-level distributed speculative decoding** is a future experiment, not the first build. It currently lacks:

- verified tokenizer and vocabulary identity between the local and remote models;
- a target-model token-verification API in the current Ollama path;
- measured draft acceptance rate;
- evidence that network latency plus the remote CPU runtime improves goodput;
- a secure streaming protocol for logits or KV state.

The research supports investigating that path later. It does not support claiming that two Ollama chat endpoints are already a speculative decoder.

## Lightning platform boundary

Lightning’s official documentation describes serving applications from Studios on exposed ports and documents authentication for public endpoints.[7] That establishes a possible later transport. It does not prove that the present free CPU Studio has a stable, authenticated endpoint configured.

Therefore the link should be built in two transport stages:

### Q-Link 0 — asynchronous artifact bridge

Use the already verified Lightning SDK file/command path:

1. local dispatcher writes a signed request envelope;
2. request is uploaded to a remote inbox;
3. remote worker claims it idempotently;
4. remote 4B writes a signed result envelope plus hashes;
5. local dispatcher downloads and verifies the result;
6. local authority decides whether to accept, compare, or escalate;
7. Studio is stopped after the bounded batch.

This has no public inference endpoint, fits the current shutdown doctrine, and matches the observed 106–108 second remote latency.

### Q-Link 1 — authenticated live peer

Only after Q-Link 0 passes fault and replay tests:

- expose a small FastAPI/LitServe peer endpoint;
- require TLS through the platform endpoint plus application-level HMAC or equivalent request authentication;
- keep the secret in managed environment storage, never in the repository or request body;
- enforce nonce, timestamp, TTL, body hash, request ID, and maximum payload;
- expose `/health`, `/v1/peer/tasks`, and `/v1/peer/results/{id}` rather than an unrestricted shell or raw Ollama port;
- measure cold start, idle policy, availability, and free-tier implications before calling it persistent.

### Q-Link 2 — token-level speculative link

Do not implement until exact tokenizer compatibility, target verification, acceptance-rate profiling, and end-to-end goodput are demonstrated. This is research-gated.

## Quantum envelope contract

Every task crossing the boundary should be immutable and content-addressed:

```json
{
  "schema": "lilith.quantum-link.task/v1",
  "task_id": "sha256:...",
  "parent_id": null,
  "created_at": "RFC3339 timestamp",
  "expires_at": "RFC3339 timestamp",
  "nonce": "random unique value",
  "origin": "local-4b|cloud-4b|local-26b|operator",
  "target": "local-4b|cloud-4b|local-26b",
  "mode": "answer|shadow|critique|validate|teach",
  "objective": "one bounded task",
  "payload": {"content": "...", "sha256": "..."},
  "constraints": {
    "max_output_tokens": 1024,
    "allowed_tools": [],
    "privacy_class": "public|approved-source|local-only"
  },
  "validation": {"kind": "schema|command|human", "spec": "..."},
  "trace": [],
  "auth": {"algorithm": "HMAC-SHA256", "signature": "..."}
}
```

Rules:

- `local-only` payloads never leave the host.
- Secret, legal, health, credential, and identity archives are denied by default.
- A task may reference an approved artifact by digest rather than transmit the whole artifact.
- Repeated `task_id` is idempotent; repeated nonce is rejected.
- Every result names the model tag, model digest if available, runtime parameters, latency, and observed validator output.
- Remote output is advice or evidence, never automatic authority to edit local state.

## Three-mind operating rhythm

### Local 4B — Pulse

- interactive tool routing;
- short factual and operational work;
- creates task envelopes;
- returns immediate provisional answers when appropriate;
- never waits synchronously for the remote 4B unless Eric explicitly requests comparison.

### Cloud 4B — Mirror

- bounded shadow inference;
- batch diagnostics and regression evaluation;
- independent candidate generation;
- disagreement signal, not final judge;
- starts for bounded work and stops after retrieval under Q-Link 0.

### Local 26B — Tide

- CPU-only **trial tag**, not a silent rewrite of `mythos-cortex:latest`;
- asynchronous priority queue;
- consumes disagreement, failed validation, long-context synthesis, and teacher-generation tasks;
- checkpointed results so interruption does not lose completed work;
- concurrency `1` initially;
- reduced measured context for the first benchmark rather than the current untested `262144` setting;
- never claimed “always-on” until RAM, thermal behavior, tokens/second, and contention are measured.

## Routing law for the first prototype

1. Operator-forced route always wins.
2. Local-only privacy class cannot route to Lightning.
3. Tool/status/simple factual task routes to local 4B.
4. Approved batch or shadow task may route to cloud 4B.
5. Validation failure, local/cloud disagreement, long context, or unresolved ambiguity cascades to 26B.
6. 26B returns asynchronously; it does not block the local 4B’s interactive response.
7. No model may directly register another model, change a Modelfile, or start paid compute.

## First bounded experiment

Build Q-Link 0 before any public endpoint:

- one local request producer;
- one remote inbox worker around `mythos-cyberpunk-forge:trial-v2`;
- one local result verifier;
- one append-only SQLite event ledger;
- three harmless public test tasks;
- replay, expiry, tamper, timeout, and duplicate-delivery tests;
- one remote result compared with local 4B;
- one disagreement escalated to a separately named CPU-only 26B trial queue;
- complete hash and shutdown evidence.

This proves the relationship without pretending the cloud is faster, exposing Ollama publicly, or modifying active model registrations.

## Acceptance gates

The first link is accepted only if:

- all envelopes validate against one versioned schema;
- tampered, expired, replayed, and unauthorized envelopes are rejected;
- duplicate delivery produces one logical result;
- local-only data never enters the remote bundle;
- remote result hashes verify after retrieval;
- local 4B remains responsive while the cloud and 26B work asynchronously;
- 26B interruption and resume do not lose completed ledger entries;
- all Studios read back as stopped after the bounded experiment;
- no active Ollama or Hermes registration changes occurred.

## Sources

[1] https://arxiv.org/abs/2606.14711 — SWARM-LLM: Collaborative Inference for Edge-based Small Language Models

[2] https://arxiv.org/abs/2410.10347 — A Unified Approach to Routing and Cascading for LLMs

[3] https://arxiv.org/abs/2505.22375 — Pangu Embedded: An Efficient Dual-system LLM Reasoner with Metacognition

[4] https://arxiv.org/abs/2603.19133 — A Pipelined Collaborative Speculative Decoding Framework for Efficient Edge-Cloud LLM Inference

[5] https://arxiv.org/abs/2604.09722 — ConfigSpec: Profiling-Based Configuration Selection for Distributed Edge--Cloud Speculative LLM Serving

[6] https://arxiv.org/abs/2607.13093 — Efficient and Privacy Aware Edge Cloud Collaborative Inference for Large Language Models

[7] https://lightning.ai/docs/platform/build/ai-studio/deploy-on-public-ports — Lightning AI, Deploy on public ports
