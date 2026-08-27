# Character AI Open Gaps — Parallel ArXiv Research Swarm

> Six parallel research agents, one per open gap named in db-r-2026-007 §7.
> Each agent owns exactly one file in this directory. No agent writes another's file.

## Source of the gap list

Pujan / Design Bakery, "Multi-Network Character Minds: LLM Orchestration, Affective
Development, and the Open Gap", `db-r-2026-007`, submitted 2026-07-24.
Status: **pending, not owner-approved.** No original experimental results reported.
Treat as a landscape map, not as evidence.

URL: https://www.design-bakery.com/research/papers/db-r-2026-007

The paper sorts character-AI architectures into four patterns:

- **A** — single LLM, modules are prompts and tools (Generative Agents, Voyager, CAMEL)
- **B** — LLM as slow orchestrator over separately *trained* nets (NVIDIA ACE, Inworld, Convai, Soul Machines)
- **C** — multi-net, no foundation-model controller (classic game AI)
- **D** — hybrid LLM + world model / vision-language-action (robotics)

Industry has shipped pattern B and kept it closed. Open research is stuck in pattern A.
The six gaps below are §7 verbatim in substance.

## Gap assignments

| # | Gap | Agent file | Provider lane |
|---|-----|-----------|---------------|
| 1 | No open full pattern-B character engine (dialogue LLM + trained affect dynamics + emotional TTS + face/body nets + persistent state under one inspectable orchestration contract) | `gap1-pattern-b-engine.md` | openai-codex |
| 2 | No shared multi-modal character benchmark (dialogue quality + affective consistency over long time + animation fidelity + latency + personality stability) | `gap2-character-benchmark.md` | opencode-free |
| 3 | No interoperable character-state schema for mood, relationships, goals across systems | `gap3-state-schema.md` | opencode-free |
| 4 | Emotion-as-prompt dominance; dedicated affect networks stay narrow or proprietary | `gap4-affect-networks.md` | nous |
| 5 | Durable self-model is not a shipped open module class (metacognition is not selfhood) | `gap5-self-model.md` | nous |
| 6 | Safety composition for multi-layer character systems is under-specified relative to dialogue-only moderation | `gap6-safety-composition.md` | opencode-free |

## Ground-truth anchors (verified real, load-bearing)

These landmark references are solid and may be cited without re-verification:

- `arXiv:2304.03442` — Park et al., Generative Agents: Interactive Simulacra of Human Behavior
- `arXiv:2305.16291` — Wang et al., Voyager: An Open-Ended Embodied Agent with LLMs
- `arXiv:2303.17760` — Li et al., CAMEL: Communicative Agents for Mind Exploration
- `arXiv:2308.11432` — Wang et al., A Survey on LLM based Autonomous Agents
- `arXiv:2404.11584` — Masterman et al., Landscape of Emerging AI Agent Architectures
- `arXiv:2401.03568` — Durante et al., Agent AI: Surveying the Horizons of Multimodal Interaction
- `arXiv:2308.00352` — Hong et al., MetaGPT
- `arXiv:2310.04406` — Zhou et al., Language Agent Tree Search (LATS)
- `arXiv:2310.06775` — Shapiro et al., Conceptual Framework for Autonomous Cognitive Entities
- `arXiv:2007.14632` — Schillaci et al., Tracking Emotions: Intrinsic Motivation / Prediction Error

## Citations requiring verification before load-bearing use

db-r-2026-007 §10 admits its own 2025-26 affective-development strand needs re-checking
against canonical arXiv/DOI. Do **not** treat these as established until an agent has
confirmed the ID resolves to the claimed title:

- "Ushio et al., IEEE Access line, 2026" — free-energy emotional dynamics. No DOI given.
- "Du et al., project documentation, 2025-era" — MLLM affective geometry. No arXiv ID given.
- "PsychoAgent, CogSci 2026 line" — appraisal process simulation. No ID given.
- `arXiv:2503.15518` — Tang et al., personality shaping. **Verify ID resolves.**
- `arXiv:2512.19551` — L2-EMG lifelong empathic motion generation. **Verify ID resolves.**

An agent that cannot resolve an ID must record it as UNRESOLVED, never restate the claim.

## Rules every agent follows

1. **One file. Yours only.** Never edit another gap's file or this README.
2. **Append, never rewrite.** New findings go under a dated `## Sweep YYYY-MM-DD HH:MM` heading.
3. **Every paper entry carries a resolvable arXiv ID or an explicit UNRESOLVED marker.**
4. **No invented metrics.** If a paper reports no number, write "no numeric claim".
5. **Rate limit discipline.** arxiv scraper dies at ~10-15 calls per session. Do all
   searches first, then fetch abstracts only for papers you will actually cite, with
   `sleep 2` between fetches. If the scraper goes dark, write up what you already have.
6. **Say what closes the gap.** Each entry ends with an implementation note: what this
   paper would let a builder actually construct, or why it falls short.

## Entry format

```markdown
### arXiv:NNNN.NNNNN — Title
URL: https://arxiv.org/abs/NNNN.NNNNN
Authors: ...
Categories: ...

**Claim:** what the paper actually demonstrates (no numbers unless the paper states them)
**Closes gap:** partially / no / addresses adjacent problem — and precisely which part
**Implementation note:** what this enables in a real pattern-B stack
```

## Status

Seeded 2026-08-24. Awaiting first sweep from each agent.
