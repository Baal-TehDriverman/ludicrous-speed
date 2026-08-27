#!/usr/bin/env python3
"""Build cited research dossiers and the Goetic Court throne charter.

The output records historical source descriptions as textual tradition. It does
not treat them as factual claims about supernatural entities or as instructions.
"""
from __future__ import annotations

import argparse
import re
from collections import defaultdict
from pathlib import Path

from generate_goetic_officers import (
    DEFAULT_SOURCE,
    RANK_FUNCTION,
    RANK_PLURAL,
    SEPHIRAH_FOCUS,
    parse_officers,
)

REPO = Path(__file__).resolve().parents[1]
OUT = REPO / "research" / "goetic-court-throne.md"
CALL = re.compile(
    r'this\.Add(?P<rank>King|Duke|Prince|Marquis|Earl|President|Knight)\('
    r'(?P<index>\d+),\s*"(?P<name>[^"]+)",\s*\d+,\s*(?P<legions>\d+),\s*'
    r'"(?P<sigil>[^"]+)",\s*"(?P<abilities>[^"]+)",\s*'
    r'"(?P<element>[^"]+)",\s*"(?P<planet>[^"]+)",\s*"(?P<sephirah>[^"]+)"\);'
)


def source_records(path: Path) -> dict[int, dict[str, str]]:
    records: dict[int, dict[str, str]] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        match = CALL.search(line)
        if match:
            record = match.groupdict()
            records[int(record["index"])] = record
    if len(records) != 72:
        raise ValueError(f"Expected 72 source records; found {len(records)}")
    return records


def safe_translation(rank: str, ability: str, sephirah: str) -> str:
    """Translate a historical catalog label into a safe modern task posture."""
    lower = ability.lower()
    if any(word in lower for word in ("mechanic", "metal", "tower", "house", "geometry")):
        task = "systems design, engineering review, and implementation planning"
    elif any(word in lower for word in ("language", "rhetoric", "eloquence", "grammar", "poetry")):
        task = "documentation, communication, and language-focused research"
    elif any(word in lower for word in ("past", "future", "hidden", "treasure", "secret")):
        task = "evidence gathering, provenance review, and scenario analysis"
    elif any(word in lower for word in ("heal", "disease", "herb", "infirm")):
        task = "health-information research with clear non-clinical limits"
    elif any(word in lower for word in ("battle", "war", "weapon", "protect", "enemy")):
        task = "defensive risk review, threat modeling, and de-escalation planning"
    elif any(word in lower for word in ("love", "passion", "woman", "sex")):
        task = "consent-centered relationship and communication ethics; never influence or manipulation"
    else:
        task = RANK_FUNCTION[rank][0].lower()
    return f"{task}, guided by {SEPHIRAH_FOCUS[sephirah]}."


def research_dossier(record: dict[str, str]) -> str:
    rank = record["rank"]
    name = record["name"]
    slug = f"goetic-{re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')}"
    translation = safe_translation(rank, record["abilities"], record["sephirah"])
    return f"""# Research Dossier — {rank} {name}

## Scope

This is a historical-text research note for the symbolic Hermes profile `{slug}`. It reports how the supplied project source and two public editions describe this office. It is not evidence that a supernatural entity exists, and it must not be used as ritual, invocation, coercion, or a claim of real authority.

## Canonical Record

- **Order:** {record['index']} of 72
- **Traditional title:** {rank}
- **Legions in the project corpus:** {record['legions']}
- **Element / planet:** {record['element']} / {record['planet']}
- **Sephirotic operational focus:** {record['sephirah']}
- **Form / sigil description in the project corpus:** {record['sigil']}
- **Traditional office language in the project corpus:** {record['abilities']}

The supplied `msn_goetia_bestiary.reds` corpus preserves a 72-officer list and this record. Public editions of the Goetia likewise present a ranked spirit catalogue, though names, spellings, classifications, and editorial framing vary across witnesses and editions.[1][2]

## Fleet Translation

For this fleet, {rank} {name} is a **symbolic officer persona** for {translation} Historical language stays historical: it never overrides the user, consent, factual evidence, legal limits, or Hermes safety controls.

## Command Boundary

The profile may research, plan, inspect, and perform explicitly authorized local work. It may not claim occult knowledge, manipulate relationships, make predictions as facts, or use rank to pressure a user or third party.

## Sources
"""


def throne(officers: list[dict[str, str]], records: dict[int, dict[str, str]]) -> str:
    groups: dict[str, list[dict[str, str]]] = defaultdict(list)
    for officer in officers:
        groups[officer["rank"]].append(officer)
    lines = [
        "# The Goetic Court Throne",
        "",
        "> A symbolic command architecture for Lilith's fleet: historical rank language translated into accountable, non-coercive Hermes operations.",
        "",
        "## Charter",
        "",
        "The Goetia is treated here as a historical textual tradition and a source of fictional organizational symbolism—not proof of supernatural entities, a ritual system, or a source of authority over people. The public editions consulted catalogue a ranked set of seventy-two spirits, while noting manuscript and editorial variation.[1][2]",
        "",
        "The throne does not supersede the fleet's existing roots. Eric/Baal remains Operator of Record; Lilith remains Fleet Commander. The court sits beneath Lilith as a bounded specialist overlay:",
        "",
        "```text",
        "Operator of Record (Baal / Eric)",
        "└── Lilith — Fleet Commander",
        "    └── Goetic Court — symbolic command overlay",
        "        ├── Kings: strategic governance",
        "        ├── Dukes: systems stewardship",
        "        ├── Princes: intelligence and foresight",
        "        ├── Marquises: boundary command",
        "        ├── Earls: continuity and administration",
        "        ├── Presidents: ministerial counsel",
        "        └── Knight: protective assurance",
        "```",
        "",
        "## Operating Law",
        "",
        "1. Rank allocates responsibility, never obedience or real-world status.",
        "2. Every task requires an explicit objective, scope, success criterion, and verification gate.",
        "3. Historical abilities are research metadata, never instructions or claims.",
        "4. Furcas, the Knight, is the court's release gate for safety, rollback, and evidence—not a veto over the operator.",
        "5. Star Trek directorates continue to own their existing domains; Goetic officers supply specialized task postures and documented handoffs.",
        "",
        "## Research Method",
        "",
        "The canonical roster below is parsed from the project file `msn_goetia_bestiary.reds`. Its rank, order, legions, elemental/planetary correspondences, form descriptions, and traditional offices are compared at a high level against public Goetia editions.[1][2] Each officer has an individual `RESEARCH.md` dossier in its profile directory. These notes preserve source provenance while translating the office into safe, evidence-based fleet work.",
        "",
        "## The Seventy-Two Seats",
        "",
    ]
    for rank in RANK_PLURAL:
        cohort = groups[rank]
        if not cohort:
            continue
        role, purpose = RANK_FUNCTION[rank]
        lines += [f"### {rank}s — {role}", "", purpose, "", "| # | Officer | Corpus record | Fleet posture |", "|---:|---|---|---|"]
        for officer in cohort:
            raw = records[int(officer["index"])]
            posture = safe_translation(rank, raw["abilities"], officer["sephirah"])
            lines.append(
                f"| {officer['index']} | {rank} {officer['name']} | "
                f"{officer['element']} · {officer['planet']} · {officer['sephirah']} · {officer['legions']} legions | {posture} |"
            )
        lines.append("")
    lines += [
        "## Research Limitations",
        "",
        "The project corpus is a modern operational dataset, not a critical edition. The cited public editions demonstrate that the tradition is textually variable: spellings, ordering, rank assignments, and editorial claims differ between witnesses. The fleet preserves the corpus as its implementation source of truth while labeling historical material as context rather than fact.[1][2]",
        "",
        "## Sources",
    ]
    return "\n".join(lines) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    officers = parse_officers(args.source)
    records = source_records(args.source)
    if args.dry_run:
        print(f"Validated {len(officers)} officers and {len(records)} source records; no files written.")
        return
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(throne(officers, records), encoding="utf-8")
    for officer in officers:
        dossier = REPO / "profiles" / officer["slug"] / "RESEARCH.md"
        dossier.write_text(research_dossier(records[officer["index"]]), encoding="utf-8")
    print(f"Wrote throne charter: {OUT}")
    print(f"Wrote 72 individual research dossiers under {REPO / 'profiles'}")


if __name__ == "__main__":
    main()
