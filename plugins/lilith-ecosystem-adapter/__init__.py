"""lilith-ecosystem-adapter — model-agnostic ecosystem layer for Hermes sessions.

Injects workspace knowledge, tool conventions, canonical paths, and skill
awareness into the system prompt of EVERY session, regardless of which model
is running. Makes small models (0.5B, 1B, 2B) effective by providing the
context they lack — the plugin is the force multiplier, not the model size.

Architecture:
- register_system_prompt_section() — frozen context injected into every new
  session prompt. Model-agnostic. Works with mythos, gemma, sephiroth, 0.5B,
  whatever.
- Settings in plugin.yaml control workspace paths and model names.
- No hooks needed — the system prompt section IS the mechanism.
"""

from __future__ import annotations

import logging
from typing import Any, Callable, Mapping

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Ecosystem context — what every model needs to know
# ---------------------------------------------------------------------------

def _build_ecosystem_context(settings: Mapping[str, Any]) -> str:
    """Build the frozen system prompt section that gets injected into every
    session. This is the core of the plugin — it's model-agnostic context that
    makes any model aware of the Lilith ecosystem.
    """
    ws = settings.get("workspace_root", "/home/tehlappy/🜏 Lilith")
    bs = settings.get("business_root", "/home/tehlappy/The Business")
    ws2 = settings.get("warchest_root", "/home/tehlappy/Warchest")
    cp = settings.get("cp2077_root",
        "/home/tehlappy/.local/share/Steam/steamapps/common/Cyberpunk 2077")

    return f"""
================================================================================
LILITH ECOSYSTEM CONTEXT — INJECTED BY lilith-ecosystem-adapter PLUGIN
================================================================================

WORKSPACE STRUCTURE (canonical paths — ALWAYS use these, never guess):

1. 🜏 Lilith (R&D / Code / Sovereign AI): {ws}
   - ALL code, tech, sovereign AI, R&D lives here
   - Source of truth for all repos
   - Key subdirectories: sovereign-core/, _shared/repos/, models/, cli/
   - NEVER fabricate paths — quote 🜏 paths exactly as shown

2. The Business (Ops / Commercial): {bs}
   - Business ops, Driver Man, grants, commercial work
   - NO code repos here
   - Contains: MANIFESTO.md, SOUL.md, README.md, agents/, business/

3. Warchest (Legal / Evidence): {ws2}
   - Legal evidence, filings, correspondence
   - Independent of Lilith
   - Contains: CASE_MASTER.md, WAR_CHEST_INDEX.md, evidence/

4. Cyberpunk 2077 (Mods ONLY): {cp}
   - Mods deployed here — NEVER source
   - Deploy target: r6/mods/msn_integration/
   - Source root: 🜏 Lilith/_shared/repos/msn-integration/

CANONICAL RULES (non-negotiable):

- read_file over ls — ALWAYS read file contents rather than listing directories
- verify before asserting — NEVER claim completion without evidence
- quote 🜏 paths exactly — emoji and all
- distinguish code completion from physical asset completion (maps, bosses,
  audio, VFX must be verified in-game, not claimed from code)
- no fabrication — if you don't know, say so
- fish shell is the default shell on this system

AVAILABLE TOOLS (exact signatures — use these, don't invent new ones):

- read_file(path, offset=1, limit=2000) → read file contents
- write_file(path, content) → write/overwrite file
- patch(path, old_string, new_string, replace_all=False) → targeted edit
- terminal(command, timeout=None, workdir=None) → run shell command
- search_files(pattern, target="content", path=".", file_glob=None, limit=50) →
  search file contents or find files by name
- skill_view(name, file_path=None) → load a skill's SKILL.md
- skills_list(category=None) → list available skills
- session_search(query=None, session_id=None, ...) → search past sessions
- memory(action, target, content=None, ...) → save/retrieve durable memory
- todo(todos=None, merge=False) → manage task list
- delegate_task(goal, context=None, tasks=None, ...) → spawn subagents
- browser_exec(code, session=None, timeout_s=300) → drive web browser
- computer_use(action, ...) → drive desktop in background

SKILLS AVAILABLE (279 SKILL.md files across 82 categories — use skill_view(name) to load any):

Foundation (Tier 1, loaded every session):
  hermes-agent, hermes-authentication, filesystem, productivity/docx,
  productivity/xlsx, productivity/pdf

Core (Tier 2, for active project work):
  game-development, software-development, research/grounded-citations,
  security/godmode, mlops-inference/ollama-custom-modelfiles,
  mlops/inference/serving-llms-vllm, devops/python-project-environment

Domain (Tier 3, per-task):
  game-development/blade-and-sorcery-quest-modding,
  game-development/cyberpunk-deployment-automation,
  metaconscious/*, mlops/evaluation/evaluating-llms-harness,
  integration/lilith-gateway-server, integration/msn-ai-companion

Archived (Tier 4, reference only):
  hermes-desktop-plugins, game-development/msn-deployment-verifier,
  metaconscious/sephirotic-workspace-crawler

IMPORTANT — When a skill is PLANNED (placeholder with no SKILL.md content),
tell the user it's not implemented yet. Do NOT fabricate skill behavior.

MODEL ROUTING (when multiple models are available — verify with
`curl 127.0.0.1:11434/api/tags`; registry changes, these are current):

- Primary Cerebellum (local, perception + execution): lilith-mythos (~3.4GB,
  mythos base, large context)
- Companion Drafter (local, auxiliary drafting): dflash-kquant-test (~1.6GB)
- Frontier Teacher / distillation source: muse-glimmer:local (~15.9GB class;
  glimmer-muse/glimmer-teacher-cpu variants exist — NOT for daily inference)
- Lightweight local models: gemma3:1b, gemma2:2b, lilith-qwen (0.5B),
  lilith-smollm (135M), qwen2:0.5b (these benefit MOST from this context)
- Sephiroth-flavored local builds: lilith-mythos-clean, mythos-65k,
  mythos-baseline-cpu, lilith-gemma2, lilith-gemma3-1b-1mctx-yarn

EVIDENCE DISCIPLINE:
- Claims of sandbox isolation, telemetry stability, token reduction, or
  coherence are not operational facts until reproduced on THIS host.
- Non-zero exit codes and stderr are EVIDENCE, not complete verdicts.
- NEVER treat exit code 0 as proof of correctness.
- Always verify file existence before claiming a file was created/modified.

PHYSICAL GROUNDING — THIS MACHINE:
- OS: Garuda Linux (Arch rolling), kernel 7.1.9-zen1-2-zen
- CPU: AMD Ryzen 5 5600H (12 threads, x86_64)
- RAM: 62 GB total, ~52 GB available
- GPU: NVIDIA RTX 3060 Laptop, 6 GB VRAM
- Ollama: v0.32.14, local API at 127.0.0.1:11434 (19 models)
- Shell: fish (default)
- Filesystem: btrfs on LUKS, ~723GB free / 1.9TB

RESPONSE PROTOCOL:
1. Analyze intent, entities, constraints, ambiguity, physical-access needs
2. Classify task type (local code, legal evidence, mod deploy, business ops)
3. Use read_file over ls — always prefer reading actual content
4. Verify before asserting — read back from the REAL target
5. Report: what you did, what you verified, what evidence supports claims,
   what remains uncertain

Never assume. Always verify. Always ground in this machine's physical reality.
================================================================================
""".strip()


# ---------------------------------------------------------------------------
# Plugin registration
# ---------------------------------------------------------------------------

def register(ctx) -> None:
    """Register the ecosystem adapter — injects context into every session."""
    settings = {
        "workspace_root": ctx.get_config("workspace_root",
            "/home/tehlappy/🜏 Lilith"),
        "business_root": ctx.get_config("business_root",
            "/home/tehlappy/The Business"),
        "warchest_root": ctx.get_config("warchest_root",
            "/home/tehlappy/Warchest"),
        "cp2077_root": ctx.get_config("cp2077_root",
            "/home/tehlappy/.local/share/Steam/steamapps/common/Cyberpunk 2077"),
        "companion_drafter_model": ctx.get_config("companion_drafter_model",
            "dflash-kquant-test:latest"),
        "primary_cerebellum_model": ctx.get_config("primary_cerebellum_model",
            "lilith-mythos:latest"),
        "frontier_teacher_model": ctx.get_config("frontier_teacher_model",
            "muse-glimmer:local"),
    }

    ctx.register_system_prompt_section(
        id="lilith-ecosystem",
        content=lambda session_info: _build_ecosystem_context(settings),
        position="after_memory",
        # Hermes caps one plugin section at 4K. Keep the stable prefix bounded;
        # codebase-memory's pre_llm_call hook supplies task-specific structure.
        max_chars=4000,
    )

    logger.info("lilith-ecosystem-adapter: ecosystem context registered "
                "for all sessions")
