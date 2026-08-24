# Void → Ludicrous-Speed Fleet Integration Research

**Date:** 2026-08-24
**Subject:** `/home/tehlappy/🜏 Lilith/ludicrous-speed/Void/` (244MB, untracked) + `Void_build/`

---

## What the Void Is

`Void/` is **Lilith's pre-baked JavaScript execution runtime**: a drop-in Node.js v22.23.2 / V8 12.4 environment with ~375 npm packages (116MB) already extracted into `node_modules/`, plus `bin/void.js` as entry point (`run | console | eval | snapshot`). No npm install needed — scripts execute immediately.

- **Origin:** rebuilt from an Electron-13-era V8 context snapshot that was binary-incompatible with Node 22; the spirit (instant execution env) was preserved as a clean runtime.
- **Payload highlights:** AI SDKs (`openai`, `@anthropic-ai/sdk`, `@google/genai`, `groq-sdk`, `ollama`, mistral), web stack (`express`, cors, ws, node-fetch), dev tooling (`typescript` 5.5, eslint, acorn, chrome-remote-interface), UI (`react`, `react-dom`, lucide-react, @xterm/xterm), validation (`zod`, ajv), utilities (fs-extra, glob, chalk, marked).
- **Also present:** `resources/app` (Electron app skeleton: extensions + node_modules) and `squashfs-root/` (a mounted/packed AppImage-style rootfs under usr/{lib,share}) — remnants of the original packaged Electron build.
- **Untracked status:** parked inside the repo but not committed; integration means wiring it into the fleet rather than vendoring it blindly.

### Shared surface with the fleet

| Fleet component | Void overlap |
|---|---|
| `fleet_graph_core.py` (Python topology engine) | Void's acorn/eslint/ts give a JS-side parser to feed nodes into the graph |
| `plugin_api.py` (FastAPI dashboard) | express/ws in Void could host or proxy plugin endpoints |
| `devdashboard/unified-dashboard-v2/` (React) | react/react-dom in Void matches dashboard toolchain exactly |
| Hermes MCP codebase-memory server | Void is a candidate execution sandbox for MCP tool scripts |

---

## Thread 1 — Graph-based code intelligence (feeds fleet_graph_core.py)

1. **arXiv 2608.16295** — *Executable Code Knowledge: Code as a Native, Validation-Carrying Knowledge Representation for AI Coding Agents* — https://arxiv.org/abs/2608.16295
   - **Relevance:** Treats code as executable, validation-carrying knowledge — directly models how Void scripts can be first-class nodes in the fleet topology graph.
   - **Implementation Note:** Extend `fleet_graph_core.py` node schema with a `runtime: "void"` attribute and attach eval-validation results from `void.js eval` runs as node metadata.

2. **arXiv 2607.18356** — *CODENS: Transforming Code Changes into Living, Accessible, and Queryable Documentation* — https://arxiv.org/abs/2607.18356
   - **Relevance:** Living documentation from code changes keeps both the Python engine and the Void JS runtime's evolving surface queryable without manual docs.
   - **Implementation Note:** Hook CODENS-style change extraction into the repo's `scripts/` CI so Void's `package.json` dependency deltas auto-update `catalog.json`.

3. **arXiv 2608.12859** — *Dissecting Software Graphs: Structural Insights for Driver-Guided Fuzzing* — https://arxiv.org/abs/2608.12859
   - **Relevance:** Software-graph structural metrics identify high-risk/high-fan-in nodes; applicable to deciding which Void packages are load-bearing for the fleet.
   - **Implementation Note:** Run centrality analysis over Void's 375-package dependency graph; mark top-fan-in modules as protected dependencies in `fleet_graph_core.py` topology output.

4. **arXiv 2608.01507** — *Deep Agentic Search for Repository-Level Code Question Answering* — https://arxiv.org/abs/2608.01507
   - **Relevance:** Empirical study of agentic repository QA — exactly what the Hermes MCP codebase-memory server does across the monorepo including Void/.
   - **Implementation Note:** Index Void/ into codebase-memory with its own project scope; expose QA results through `plugin_api.py` as a `/void/query` dashboard endpoint.

## Thread 2 — Monorepo / large-scale integration

5. **arXiv 2501.03440** — *CI at Scale: Lean, Green, and Fast* — https://arxiv.org/abs/2501.03440
   - **Relevance:** Monorepo CI at scale informs how to lint/test Void (116MB node_modules) without slowing fleet builds — e.g., selective build targets.
   - **Implementation Note:** Add a path-filtered CI job keyed on `Void/**` changes; cache Void_build artifacts keyed on `package.json` hash.

6. **arXiv 2608.21208** — *Specification Portability Across LLM Development Agents* — https://arxiv.org/abs/2608.21208
   - **Relevance:** Cross-agent spec compatibility matters because Void scripts will be executed by different agents (Hermes, Claude Code, Codex) against one shared manifest.
   - **Implementation Note:** Encode Void execution contract (paths, shebang, ESM/CJS modes) as a portable spec file consumed by all agent skills, not hardcoded in each.

7. **arXiv 2608.13730** — *Building AI-Intensive Software with AI* — https://arxiv.org/abs/2608.13730
   - **Relevance:** Cautionary data on measuring AI-development cost applies to budgeting the Void integration effort itself.
   - **Implementation Note:** Track integration tasks in measurable units (packages wired, endpoints exposed) in ROSTER.md before expanding scope.

## Thread 3 — Sandboxed multi-agent execution (Void as fleet runtime)

8. **arXiv 2607.23933** — *SpecBox: Speculative Sandbox Scheduling for Efficient LLM Agent Serving* — https://arxiv.org/abs/2607.23933
   - **Relevance:** Sandbox scheduling research maps onto Void's role as a pre-warmed execution environment agents can speculatively use.
   - **Implementation Note:** Wrap `bin/void.js` invocations behind a small FastAPI route in `plugin_api.py` (`POST /void/exec`) with timeouts and a work queue.

9. **arXiv 2607.27294** — *AgentS4D: Benchmarking Runtime Risks across the Execution Lifecycle of LLM-Based Workspace Agents* — https://arxiv.org/abs/2607.27294
   - **Relevance:** Runtime-risk taxonomy for workspace agents governs which capabilities (fs, net via axios/openai SDKs) Void exposes to fleet agents.
   - **Implementation Note:** Define capability profiles in Void config (no-net, net-only-AI-SDKs, full); enforce per-profile in the void.js launcher before exec.

10. **arXiv 2608.11166** — *Agentic Configuration Management (ACM): A Reference Configuration Model for Governed Agentic Systems* — https://arxiv.org/abs/2608.11166
    - **Relevance:** Governance model for agentic systems fits tracking Void's untracked 244MB footprint and its configuration within the governed fleet.
    - **Implementation Note:** Register Void in `catalog.json` as a managed asset with checksummed manifest; decide track-vs-gitignore policy explicitly.

11. **arXiv 2608.20614** — *Evaluating Skills, Not Just Agents: Agentic Continuous Evaluation of Skills* — https://arxiv.org/abs/2608.20614
    - **Relevance:** Continuous skill evaluation framework suits validating Void-hosted tool scripts as fleet "skills" over time.
    - **Implementation Note:** Add smoke tests in `tests/` that run representative void.js scripts on every Void/ change.

12. **arXiv 2608.08340** — *OpRAG: A Resource-Deterministic Runtime for GPU-Backed Multi-Stage RAG Workflows* — https://arxiv.org/abs/2608.08340
    - **Relevance:** Resource-deterministic staging informs bounding Void's memory/CPU when multiple agents share the single pre-baked runtime.
    - **Implementation Note:** Cap concurrent `void.js` processes via a semaphore in plugin_api.py; log resource usage to the unified dashboard.

## Thread 4 — Front-end / dashboard convergence

13. **arXiv 2607.10621** — *WebDesignIter: Co-Evolving Design Knowledge for Repository-Level Front-End Code Generation* — https://arxiv.org/abs/2607.10621
    - **Relevance:** Repository-level front-end generation applies since Void ships the exact React toolchain used by `devdashboard/unified-dashboard-v2/`.
    - **Implementation Note:** Point dashboard generators at Void's bundled react/react-dom versions to eliminate duplicate installs; alias imports in unified-dashboard-v2 build config.

14. **arXiv 2608.20393** — *Knowledge-Graph-Gated Defactualization…Agentic Conversational AI* — https://arxiv.org/abs/2608.20393
    - **Relevance:** Knowledge-graph gating suggests gating dashboard panels by graph state — Void nodes appear in the UI only once validated in fleet_graph_core.
    - **Implementation Note:** Gate the planned "Void runtime" panel in unified-dashboard-v2 on `fleet_graph_core.get_node("void").status == "integrated"`.

---

## Top-5 Action List

1. **Register & gate Void** — add Void/ to `catalog.json` with a checksummed manifest (ACM-style governance, paper #10); resolve track-vs-ignore for 244MB.
2. **Expose Void as an exec service** — `POST /void/exec` in `plugin_api.py` wrapping `bin/void.js` with capability profiles and concurrency caps (#8, #9, #12).
3. **Fold Void into the topology graph** — extend `fleet_graph_core.py` with runtime/validation-carrying node attributes; centrality-scan Void's package graph for load-bearing deps (#1, #3).
4. **Index Void in codebase-memory MCP** — separate project scope, surfaced as `/void/query` on the dashboard (#4, #14).
5. **Deduplicate the React toolchain** — point `devdashboard/unified-dashboard-v2/` at Void's bundled react/react-dom + add path-filtered CI and smoke tests (#5, #11, #13).
