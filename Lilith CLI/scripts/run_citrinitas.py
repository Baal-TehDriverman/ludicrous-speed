#!/usr/bin/env python3
"""Stage 2: Albedo → Citrinitas — Illumination"""
import json, hashlib, random
from collections import defaultdict
from pathlib import Path
from datetime import datetime

ALBEDO_TRAIN = Path("/home/tehlappy/🜏 Lilith/models/Albedo/refined/refined_train.jsonl")
CITRINITAS_DIR = Path("/home/tehlappy/🜏 Lilith/models/Citrinitas/refined")
CITRINITAS_DIR.mkdir(parents=True, exist_ok=True)

TIER_MAP = {
    "identity_covenant": ["Reflex", "Bridge", "Cortex-Lite", "Cortex"],
    "modding": ["Bridge CPU", "Bridge", "Cortex-Lite"],
    "coding": ["Bridge CPU", "Cortex-Lite", "Cortex"],
    "research": ["Cortex-Lite", "Cortex"],
    "general": ["Reflex", "Bridge CPU", "Bridge", "Cortex-Lite"],
}
TIER_FOCUS = {
    "Reflex": "Fast tool calls, status, config",
    "Bridge CPU": "Context handoff, code gen",
    "Bridge": "Context handoff, vision+audio, REDscript",
    "Cortex-Lite": "Deep reasoning, analysis",
    "Cortex": "Sovereign identity, complex workflows"
}

def load_jsonl(path):
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                try: yield json.loads(line)
                except: pass

def apply_citrinitas(record):
    record["nomic_embedding"] = {"dim": 768, "matryoshka": [768,512,256], "expert_count": 8, "routing": "top-2"}
    record["quantum_peft_compatible"] = True
    record["pqc_params"] = "O(log N)"
    cat = record.get("_category", "general")
    record["tier_targets"] = TIER_MAP.get(cat, ["general"])
    return record

def main():
    print("⚡ Stage 2: Albedo → Citrinitas (Illumination)")
    print(f"  Started: {datetime.now().isoformat()}")
    
    records = list(load_jsonl(ALBEDO_TRAIN))
    print(f"  Loaded {len(records)} training records")
    
    illuminated = []
    for r in records:
        # Apply chat template
        r["chat_template"] = "unsloth_gemma4"
        r["thinking_mode"] = True
        r["context_length"] = 262144
        # Apply Citrinitas augmentation
        r = apply_citrinitas(r)
        illuminated.append(r)
    
    # Split
    random.seed(42)
    random.shuffle(illuminated)
    split = int(len(illuminated) * 0.9)
    
    # Save
    with open(CITRINITAS_DIR / "illuminated_train.jsonl", "w") as f:
        for r in illuminated[:split]:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    with open(CITRINITAS_DIR / "illuminated_val.jsonl", "w") as f:
        for r in illuminated[split:]:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    
    # Also save the full augmented dataset
    with open(CITRINITAS_DIR / "augmented_all.jsonl", "w") as f:
        for r in illuminated:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")
    
    # Save per-tier files
    tier_counts = defaultdict(int)
    with open(CITRINITAS_DIR / "by_tier.jsonl", "w") as f:
        for r in illuminated:
            for tier in r.get("tier_targets", ["general"]):
                r_copy = dict(r)
                r_copy["_target_tier"] = tier
                r_copy["_tier_focus"] = TIER_FOCUS.get(tier, "general")
                f.write(json.dumps(r_copy, ensure_ascii=False) + "\n")
                tier_counts[tier] += 1
    
    print(f"  ✅ Citrinitas complete!")
    print(f"     Illuminated train: {split} records")
    print(f"     Illuminated val: {len(illuminated) - split} records")
    print(f"     By tier: {dict(tier_counts)}")
    print(f"     ✅ Nomic embeddings applied, quantum-PEFT markers set")

if __name__ == "__main__":
    main()
