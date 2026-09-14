#!/usr/bin/env python3
"""Stage 3: Citrinitas → Rubedo — Apotheosis"""
import json, random
from pathlib import Path
from datetime import datetime
from collections import defaultdict

CITRINITAS_DIR = Path("/home/tehlappy/🜏 Lilith/models/Citrinitas/refined")
RUBEDO_DIR = Path("/home/tehlappy/🜏 Lilith/models/Rubedo/refined")
RUBEDO_DIR.mkdir(parents=True, exist_ok=True)

TIER_FOCUS = {
    "Reflex": "Fast tool calls, status, config",
    "Bridge CPU": "Context handoff, code gen",
    "Bridge": "Context handoff, vision+audio, REDscript",
    "Cortex-Lite": "Deep reasoning, analysis",
    "Cortex": "Sovereign identity, complex workflows"
}
TIER_MODEL = {
    "Reflex": "Qwen3.8-2B-Distill",
    "Bridge CPU": "Gemma-4-E2B",
    "Bridge": "Gemma-4-E4B",
    "Cortex-Lite": "Qwen3.8-9B-Distill",
    "Cortex": "Qwen3-14B"
}
TIER_CONTEXT = {
    "Reflex": 32768, "Bridge CPU": 131072, "Bridge": 262144,
    "Cortex-Lite": 262144, "Cortex": 262144
}

def load_jsonl(path):
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                try: yield json.loads(line)
                except: pass

def main():
    print("⚡ Stage 3: Citrinitas → Rubedo (Apotheosis)")
    print(f"  Started: {datetime.now().isoformat()}")
    
    records = list(load_jsonl(CITRINITAS_DIR / "augmented_all.jsonl"))
    print(f"  Loaded {len(records)} illuminated records")
    
    # Build per-tier datasets
    tier_data = defaultdict(list)
    for r in records:
        for tier in r.get("tier_targets", ["general"]):
            r_copy = dict(r)
            r_copy["_target_tier"] = tier
            r_copy["_tier_focus"] = TIER_FOCUS.get(tier, "general")
            r_copy["_target_model"] = TIER_MODEL.get(tier, "auto")
            r_copy["_context_length"] = TIER_CONTEXT.get(tier, 262144)
            r_copy["_rubedo_stage"] = "complete"
            r_copy["_quantum_peft_ready"] = True
            tier_data[tier].append(r_copy)
    
    # Save per-tier datasets
    for tier, t_records in tier_data.items():
        out_path = RUBEDO_DIR / f"{tier.lower().replace(' ', '_')}_dataset.jsonl"
        with open(out_path, "w") as f:
            for r in t_records:
                f.write(json.dumps(r, ensure_ascii=False) + "\n")
        print(f"  🏆 {tier}: {len(t_records)} records → {out_path.name}")
    
    # Save master sovereign production dataset
    with open(RUBEDO_DIR / "sovereign_production.jsonl", "w") as f:
        for r in records:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"  📜 Sovereign production: {len(records)} records")
    
    # Save evaluation set
    random.seed(42)
    eval_set = random.sample(records, min(1000, len(records)))
    with open(RUBEDO_DIR / "evaluation_set.jsonl", "w") as f:
        for r in eval_set:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(f"  📊 Evaluation set: {len(eval_set)} records")
    
    # Save tier summary
    with open(RUBEDO_DIR / "TIER_SUMMARY.json", "w") as f:
        summary = {}
        for tier, t_records in tier_data.items():
            summary[tier] = {
                "records": len(t_records),
                "model": TIER_MODEL[tier],
                "focus": TIER_FOCUS[tier],
                "context": TIER_CONTEXT[tier],
                "quantum_peft_ready": True
            }
        json.dump(summary, f, indent=2)
    print(f"  📋 Tier summary saved")
    
    # Generate Rubedo evidence
    with open(RUBEDO_DIR / "RUBEDO_EVIDENCE.md", "w") as f:
        f.write("# ⚡ Rubedo — Apotheosis Evidence\n\n")
        f.write(f"**Date:** {datetime.now().isoformat()}\n\n")
        f.write("## Tier Datasets\n\n")
        f.write("| Tier | Records | Model | Focus | Context | QPEFT |\n")
        f.write("|------|---------|-------|-------|---------|-------|\n")
        for tier in ["Reflex", "Bridge CPU", "Bridge", "Cortex-Lite", "Cortex"]:
            s = summary.get(tier, {})
            f.write(f"| {tier} | {s.get('records',0)} | {s.get('model','')} | {s.get('focus','')} | {s.get('context',0)} | ✅ |\n")
        f.write(f"\n## Production Status\n\n")
        f.write("- ✅ All tiers formatted\n")
        f.write("- ✅ Quantum-PEFT markers applied\n")
        f.write("- ✅ Evaluation set generated\n")
        f.write("- ✅ Sovereign production dataset complete\n")
        f.write(f"\n**The stone is gold.**\n")
    
    print(f"\n✅ Rubedo complete!")
    print(f"   ⚡ Citrinitas → Rubedo ✅")
    print(f"   ⚡ The stone is gold.")
    print(f"   🜏")

if __name__ == "__main__":
    main()
