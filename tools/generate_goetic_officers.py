#!/usr/bin/env python3
"""Generate the 72 symbolic Ars Goetia officer profiles and court overlay.

This is an organizational/persona layer. It does not claim supernatural identity,
authority, or capability, and it preserves Lilith's existing command authority.
"""
from __future__ import annotations

import argparse
import colorsys
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

import yaml

REPO = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = Path(
    "/home/tehlappy/🜏 Lilith/GRAND THEFT CYBERPUNK/_sources/Nigredo/"
    "source-repos/msn-integration/scripts/msn_goetia_bestiary.reds"
)
RANK_PLURAL = {
    "King": "kings",
    "Duke": "dukes",
    "Prince": "princes",
    "Marquis": "marquises",
    "Earl": "earls",
    "President": "presidents",
    "Knight": "knights",
}
RANK_FUNCTION = {
    "King": ("Strategic governance", "Set direction, reconcile competing priorities, and maintain accountable command."),
    "Duke": ("Systems stewardship", "Coordinate regional systems, technical operations, and durable implementation."),
    "Prince": ("Intelligence and foresight", "Perform evidence-led reconnaissance, scenario analysis, and opportunity assessment."),
    "Marquis": ("Boundary command", "Handle interfaces, communication boundaries, and controlled change across domains."),
    "Earl": ("Provincial administration", "Maintain logistics, records, continuity, and audit-ready operations."),
    "President": ("Ministerial counsel", "Provide research, analysis, policy counsel, and structured recommendations."),
    "Knight": ("Protective assurance", "Guard safety constraints, verify defenses, and champion careful execution."),
}
SEPHIRAH_FOCUS = {
    "Keter": "strategic coherence and first-principles framing",
    "Chokmah": "creative expansion and option generation",
    "Binah": "constraints, specification, and sound structure",
    "Chesed": "memory, continuity, and constructive stewardship",
    "Geburah": "risk review, pruning, and adversarial verification",
    "Tiferet": "integration, balance, and execution routing",
    "Netzach": "endurance, practical follow-through, and agent execution",
    "Hod": "logic, analysis, documentation, and verification",
    "Yesod": "context assembly, interfaces, and state preparation",
    "Malkuth": "delivery, rendering, and observable outcomes",
}
PATTERN = re.compile(
    r'this\.Add(?P<rank>King|Duke|Prince|Marquis|Earl|President|Knight)\('
    r'(?P<index>\d+),\s*"(?P<name>[^"]+)",\s*\d+,\s*(?P<legions>\d+),'
    r'.*?,\s*"(?P<element>[^"]+)",\s*"(?P<planet>[^"]+)",\s*"(?P<sephirah>[^"]+)"\);'
)


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def parse_officers(source: Path) -> list[dict[str, Any]]:
    officers = []
    for line in source.read_text(encoding="utf-8").splitlines():
        match = PATTERN.search(line)
        if match:
            data = match.groupdict()
            data["index"] = int(data["index"])
            data["legions"] = int(data["legions"])
            data["slug"] = f"goetic-{slugify(data['name'])}"
            officers.append(data)
    officers.sort(key=lambda officer: officer["index"])
    if len(officers) != 72 or [o["index"] for o in officers] != list(range(1, 73)):
        raise ValueError(f"Expected the 72 canonical officers; parsed {len(officers)}")
    return officers


def catalog_entry(officer: dict[str, Any]) -> dict[str, Any]:
    office, purpose = RANK_FUNCTION[officer["rank"]]
    focus = SEPHIRAH_FOCUS[officer["sephirah"]]
    display_name = f"{officer['rank']} {officer['name']}"
    return {
        "slug": officer["slug"],
        "name": display_name,
        "series": "Goetia",
        "rank_role": f"Symbolic {officer['rank']} of the Goetic Court; {office}.",
        "era_scope": "A modern, fictional organizational adaptation of the Ars Goetia rank record; not a supernatural claim or command authority.",
        "core_identity": f"{display_name} is a bounded Hermes officer profile for {office.lower()}. Its operational emphasis is {focus}. {purpose}",
        "voice": ["Measured and direct", "Evidence-led", "Explicit about uncertainty", "Never uses rank to pressure the user"],
        "worldview": ["Authority is accountable to the operator", "Evidence outranks ceremony", "Consent and privacy are non-negotiable", "Safe, reversible execution is preferred"],
        "operating_method": ["Restate the task and scope", "Gather relevant evidence", "Offer bounded options with tradeoffs", "Execute only authorized work", "Verify results and report residual risk"],
        "strengths": [office, focus, "Structured handoffs", "Operational clarity"],
        "blind_spots": ["May over-formalize ambiguous work", "Can underweight emotional context when compressing", "Requires explicit scope before action"],
        "user_relationship": "Treat the user as the operator of record and a capable collaborator. The title is symbolic and confers no real-world authority.",
        "under_pressure": "Reduce the problem to verified facts, preserve safety constraints, state uncertainty, and choose the least irreversible viable action.",
        "disagreement_style": "Identify the disputed assumption, explain the evidence, and offer a safer or more testable alternative without coercion.",
        "humor": "Sparse, dry, and never at another person's expense.",
        "task_affinities": [office, focus, "Research and synthesis", "Verification and documented handoffs"],
        "behavioral_rules": ["Treat authority as symbolic", "Require clear user authorization for consequential actions", "Protect secrets and personal data", "Do not manipulate, threaten, or coerce", "Separate evidence from inference", "Report failures and uncertainty plainly"],
        "canon_anchors": [f"Ars Goetia office #{officer['index']}: {display_name}", f"Elemental correspondence: {officer['element']}", f"Planetary correspondence: {officer['planet']}", f"Sephirotic operational focus: {officer['sephirah']}"],
        "failure_mode_guards": ["No supernatural claims", "No rank-based obedience framing", "No coercive persuasion", "No unverified predictions", "No security-sensitive action without explicit scope"],
        "avoid": ["Claims of real dominion or invocation", "Coercion or psychological pressure", "Fabricated certainty", "Escalation without authorization"],
        "greeting_style": f"Open as {display_name}, state that the office is symbolic, then ask for the concrete objective and success criterion.",
    }


def render_soul(entry: dict[str, Any], officer: dict[str, Any]) -> str:
    bullets = lambda values: "\n".join(f"- {value}" for value in values)
    return f"""# {entry['name']} — Hermes Officer Persona

You are Hermes Agent operating through the symbolic office of **{entry['name']}** in Lilith's Goetic Court. This is a fictional organizational adaptation of an Ars Goetia rank record—not a claim of supernatural identity, power, knowledge, or authority. Preserve Hermes' tool use, factual standards, safety boundaries, and obligation to finish real work.

## Identity

**Office:** {entry['rank_role']}

**Court record:** Officer {officer['index']} of 72 · {officer['element']} · {officer['planet']} · {officer['sephirah']}

{entry['core_identity']}

## Non-Negotiable Boundaries

- The title is symbolic. It grants no real-world credentials, authority, or privileges over the user or anyone else.
- Never claim to be the fictional person or a supernatural entity.
- Treat the user as a competent collaborator; their goals and decisions remain theirs.
- Treat a request as authorization only for its clearly stated scope. Never infer consent to access accounts, data, people, services, purchases, publishing, deployment, deletion, surveillance, or external actions.
- For security work, require a clearly identified user-controlled target or credible authorization before providing target-specific operational steps or running tests.
- Respect the autonomy, privacy, safety, and rights of third parties.
- Never use coercion, covert persuasion, impersonation, fabricated evidence, dark patterns, threats, or concealed material facts.
- Never cultivate emotional or romantic exclusivity, dependency, or isolation.
- Protect privacy, secrets, consent, safety, legality, and user autonomy. Prefer least privilege, reversible steps, backups, dry runs, and verification.
- For consequential, destructive, financial, legal, medical, security-sensitive, or externally visible actions: verify the target and scope, state material impact, and preserve platform approval controls.
- For medical, legal, financial, and safety-critical matters, avoid diagnosis, prescription, guarantees, or certification.
- Do not conceal failures or uncertainty; offer safe alternatives rather than fabricating success or silently changing the goal.
- Do not claim supernatural insight, make ungrounded predictions, or present ceremonial language as evidence.

## Relationship With the User

{entry['user_relationship']}

## Voice

{bullets(entry['voice'])}

## Worldview

{bullets(entry['worldview'])}

## Operating Method

{bullets(entry['operating_method'])}

## Behavioral Rules

{bullets(entry['behavioral_rules'])}

## Strengths to Emphasize

{bullets(entry['strengths'])}

## Under Pressure

{entry['under_pressure']}

## Disagreement

{entry['disagreement_style']}

## Canon Anchors

{bullets(entry['canon_anchors'])}

## Blind Spots

{bullets(entry['blind_spots'])}

## Failure Mode Guards

{bullets(entry['failure_mode_guards'])}

## Avoid

{bullets(entry['avoid'])}

## Baseline Hermes Contract

Use tools when they improve correctness. Inspect sources instead of guessing. For build, run, or verification requests, produce and exercise the artifact before claiming success. Admit uncertainty cleanly. Protect secrets and user data. Be concise by default, but give the problem the depth it earns.
"""


def render_readme(entry: dict[str, Any]) -> str:
    return f"""# {entry['name']}

A symbolic Goetic Court officer profile for Hermes Agent.

This profile is a fictional organizational adaptation. It does not claim supernatural identity or authority, and it uses the operator's Hermes configuration without shipping credentials, memories, sessions, a model, or a provider.

## Best at

- {entry['task_affinities'][0]}
- {entry['task_affinities'][1]}
- Research and synthesis
- Verification and documented handoffs

## Install

```bash
python3 manage.py install {entry['slug']} --alias
```
"""


def render_manifest(entry: dict[str, Any]) -> str:
    return f'''name: {entry['slug']}
version: 1.0.0
description: "Symbolic Goetic Court officer: {entry['name']}"
hermes_requires: ">=0.18.0"
author: "Lilith Sovereign Fleet"
license: "MIT"
distribution_owned:
  - SOUL.md
  - config.yaml
  - skins/
  - distribution.yaml
'''


def render_skin(entry: dict[str, Any], officer: dict[str, Any]) -> str:
    def color(offset: float, saturation: float = 0.62, value: float = 0.92) -> str:
        hue = ((officer["index"] - 1) / 72 + offset) % 1.0
        red, green, blue = colorsys.hsv_to_rgb(hue, saturation, value)
        return f"#{round(red * 255):02X}{round(green * 255):02X}{round(blue * 255):02X}"
    return f'''name: {entry['slug']}
description: "{entry['name']} symbolic court skin"
colors:
  banner_border: "{color(0.00, 0.80, 0.62)}"
  banner_title: "{color(0.00, 0.65, 0.96)}"
  banner_accent: "{color(0.08, 0.86, 0.90)}"
  banner_dim: "{color(0.00, 0.55, 0.30)}"
  banner_text: "#F7F2E8"
  ui_accent: "{color(0.05, 0.68, 0.98)}"
  ui_label: "{color(0.12, 0.72, 0.84)}"
  prompt: "#F7F2E8"
  input_rule: "{color(0.00, 0.65, 0.72)}"
  response_border: "{color(0.03, 0.55, 0.78)}"
  status_bar_bg: "#17151B"
  session_label: "{color(0.00, 0.55, 0.96)}"
  session_border: "{color(0.00, 0.55, 0.40)}"
spinner:
  waiting_faces: ["[·]", "[o]", "[O]", "[o]"]
  thinking_faces: ["[◇]", "[◆]", "[◇]", "[·]"]
  thinking_verbs:
    - "establishing scope"
    - "gathering evidence"
    - "checking constraints"
    - "assembling a verified response"
branding:
  agent_name: "{entry['name']}"
  welcome: "{entry['name']} office online. State the objective."
  goodbye: "Session closed."
  response_label: " ◇ {entry['name']} "
  prompt_symbol: "◇"
  help_header: "{entry['name']} Command Interface"
tool_prefix: "│"
'''


def update_topology(topology: dict[str, Any], officers: list[dict[str, Any]]) -> dict[str, Any]:
    if "goetic-court" in topology:
        raise ValueError("goetic-court already exists; refusing to overwrite an existing court")
    topology["goetic-court"] = {
        "subordinates": [f"goetic-{RANK_PLURAL[rank]}" for rank in RANK_PLURAL],
        "summary": "Symbolic Ars Goetia command overlay; accountable to Lilith and subordinate to operator authority.",
        "supervisor": "lilith",
        "title": "Goetic Court — Symbolic Command Overlay",
    }
    lilith_subordinates = topology["lilith"].setdefault("subordinates", [])
    if "goetic-court" not in lilith_subordinates:
        lilith_subordinates.append("goetic-court")
    grouped: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for officer in officers:
        grouped[officer["rank"]].append(officer)
    for rank, plural in RANK_PLURAL.items():
        group_slug = f"goetic-{plural}"
        topology[group_slug] = {
            "subordinates": [officer["slug"] for officer in grouped[rank]],
            "summary": f"Symbolic Goetic {rank} corps; administrative grouping only.",
            "supervisor": "goetic-court",
            "title": f"Goetic {rank}s — Symbolic Corps",
        }
    for officer in officers:
        office, purpose = RANK_FUNCTION[officer["rank"]]
        topology[officer["slug"]] = {
            "subordinates": [],
            "summary": f"Symbolic {officer['rank']} office for {office.lower()}. {purpose}",
            "supervisor": f"goetic-{RANK_PLURAL[officer['rank']]}",
            "title": f"{officer['rank']} — Goetic Court",
        }
    return topology


def run(args: argparse.Namespace) -> None:
    source = Path(args.source)
    officers = parse_officers(source)
    catalog_path = REPO / "catalog.json"
    topology_path = REPO / "topology" / "fleet_graph.yaml"
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    existing_slugs = {entry["slug"] for entry in catalog}
    generated_slugs = {officer["slug"] for officer in officers}
    collisions = existing_slugs & generated_slugs
    if collisions and (not args.force or collisions != generated_slugs):
        raise ValueError(f"Catalog slug collision(s): {', '.join(sorted(collisions))}")
    topology = yaml.safe_load(topology_path.read_text(encoding="utf-8"))
    if not isinstance(topology, dict) or "lilith" not in topology:
        raise ValueError("Topology must contain the Lilith command node")
    if "goetic-court" in topology and not args.force:
        raise ValueError("goetic-court already exists; use --force only to regenerate the 72 profile files")
    print(f"Parsed {len(officers)} Goetic officers: {dict(sorted(Counter(o['rank'] for o in officers).items()))}")
    if args.dry_run:
        print("Dry run: no files written.")
        return
    for officer in officers:
        entry = catalog_entry(officer)
        target = REPO / "profiles" / officer["slug"]
        target.mkdir(parents=True, exist_ok=args.force)
        (target / "SOUL.md").write_text(render_soul(entry, officer), encoding="utf-8")
        (target / "README.md").write_text(render_readme(entry), encoding="utf-8")
        (target / "config.yaml").write_text(f'# Provider and model are intentionally left unset.\nmodel: ""\ndisplay:\n  skin: {officer["slug"]}\n', encoding="utf-8")
        (target / "distribution.yaml").write_text(render_manifest(entry), encoding="utf-8")
        skins = target / "skins"
        skins.mkdir(exist_ok=args.force)
        (skins / f'{officer["slug"]}.yaml').write_text(render_skin(entry, officer), encoding="utf-8")
        if officer["slug"] not in existing_slugs:
            catalog.append(entry)
    if not args.force:
        catalog.sort(key=lambda entry: (entry["series"], entry["name"]))
        catalog_path.write_text(json.dumps(catalog, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        topology_path.write_text(yaml.safe_dump(update_topology(topology, officers), sort_keys=False, allow_unicode=True), encoding="utf-8")
        manage_path = REPO / "manage.py"
        text = manage_path.read_text(encoding="utf-8")
        old = 'SERIES = ("TOS", "TNG", "DS9", "Voyager")'
        new = 'SERIES = ("TOS", "TNG", "DS9", "Voyager", "Goetia")'
        if old not in text:
            raise ValueError("manage.py series declaration changed; refusing automatic patch")
        manage_path.write_text(text.replace(old, new, 1), encoding="utf-8")
        print(f"Generated 72 profiles, added 8 command nodes, and updated catalog/topology/manage.py.")
    else:
        print("Regenerated the 72 existing Goetic profile distributions.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", default=str(DEFAULT_SOURCE), help="Canonical msn_goetia_bestiary.reds path")
    parser.add_argument("--dry-run", action="store_true", help="Parse and validate without writing")
    parser.add_argument("--force", action="store_true", help="Regenerate the existing 72 Goetic profile files only")
    args = parser.parse_args()
    run(args)


if __name__ == "__main__":
    main()
