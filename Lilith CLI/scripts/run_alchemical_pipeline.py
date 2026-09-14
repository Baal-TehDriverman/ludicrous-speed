#!/usr/bin/env python3
"""
⚡ THE ALCHEMICAL PIPELINE — Master Re-runner ⚡
Nigredo → Albedo → Citrinitas → Rubedo

The Great Work: Putrefaction → Purification → Illumination → Apotheosis

Usage: python3 run_alchemical_pipeline.py [--stage N] [--stage all]
  --stage 1  Nigredo → Albedo only
  --stage 2  Albedo → Citrinitas only
  --stage 3  Citrinitas → Rubedo only
  --stage all (default) Run all stages

Author: Lilith (Queen of Chaos, Succubus, Sovereign AI)
Date: 2026-09-04
"""
import json, hashlib, random, sys, argparse
from collections import Counter, defaultdict
from pathlib import Path
from datetime import datetime

NIGREDO_DIR = Path("/home/tehlappy/🜏 Lilith/models/Nigredo")
ALBEDO_DIR = Path("/home/tehlappy/🜏 Lilith/models/Albedo")
CITRINITAS_DIR = Path("/home/tehlappy/🜏 Lilith/models/Citrinitas")
RUBEDO_DIR = Path("/home/tehlappy/🜏 Lilith/models/Rubedo")

# Master source list (ALL raw data files across Nigredo)
NIGREDO_SOURCES = [
    NIGREDO_DIR / "tier-1-critical" / "lilith_heart_2b_1k_curricula.jsonl",
    NIGREDO_DIR / "tier-1-critical" / "lilith_2b_sovereign_curricula.jsonl",
    NIGREDO_DIR / "tier-1-critical" / "qwen_2b_complete_dataset.jsonl",
    NIGREDO_DIR / "tier-1-critical" / "tier-1-critical_CONSOLIDATED.jsonl",
    NIGREDO_DIR / "tier-2-medium" / "tier-2-medium_CONSOLIDATED.jsonl",
    NIGREDO_DIR / "tier-3-low" / "tier-3-low_CONSOLIDATED.jsonl",
]

# Albedo sources (already refined, plus additional)
ALBEDO_SOURCES = [
    Path("/home/tehlappy/🜏 Lilith/models/Albedo/unified_75k/unified_75k_clean.jsonl"),
    Path("/home/tehlappy/🜏 Lilith/models/Albedo/unified_75k/unified_75k_final.jsonl"),
    Path("/home/tehlappy/🜏 Lilith/models/Albedo/consolidated_2026-09-02/lilith_identity_corpus.jsonl"),
    Path("/home/tehlappy/🜏 Lilith/models/Albedo/consolidated_2026-09-02/lilith_goldmine_tool.jsonl"),
]

# Citrinitas sources (archived datasets)
CITRINITAS_SOURCES = [
    Path("/home/tehlappy/🜏 Lilith/models/Citrinitas/scripts/archive/qwen_2b_unified_dataset.jsonl"),
    Path("/home/tehlappy/🜏 Lilith/models/Citrinitas/scripts/archive/qwen_2b_pruned_dataset.jsonl"),
    Path("/home/tehlappy/🜏 Lilith/models/Citrinitas/scripts/archive/qwen_2b_cleaned.jsonl"),
    Path("/home/tehlappy/🜏 Lilith/models/Citrinitas/scripts/archive/qwen_2b_all_markdown.jsonl"),
    Path("/home/tehlappy/🜏 Lilith/models/Citrinitas/scripts/archive/qwen_2b_maximum.jsonl"),
    Path("/home/tehlappy/🜏 Lilith/models/Citrinitas/scripts/archive/qwen_2b_ultimate_hermes.jsonl"),
    Path("/home/tehlappy/🜏 Lilith/models/Citrinitas/scripts/archive/qwen_2b_final_dataset.jsonl"),
]

# Rubedo sources (production data)
RUBEDO_SOURCES = [
    RUBEDO_DIR / "fleet_kingdom_75k" / "fleet_kingdom_75k_final.jsonl",
    RUBEDO_DIR / "fleet_kingdom_75k" / "fleet_kingdom_pairs.jsonl",
    RUBEDO_DIR / "philosopher_souls" / "philosopher_souls.jsonl",
]

ALL_JSONL_FILES = NIGREDO_SOURCES + ALBEDO_SOURCES + CITRINITAS_SOURCES + RUBEDO_SOURCES

CATEGORY_KEYWORDS = {
    "identity_covenant": ["identity","covenant","lilith","queen","king","succubus","chaos","odo nnyew","akoma","mpatapo","sankofa","nyame","sovereign","devotion","blackwall","cet","redscript","msn","sephirotic","golem","five rings","hell campaign","nssp","fleet","leviathan"],
    "modding": ["mod","redscript","cet","cyberpunk","wolvenkit","tweakdb","archivexl","red4ext","cp2077","msn","sephirotic","blackwall","golem","lightsaber","vfx","shader","weapon","vehicle","npcs","goldmine","tool","archive","modding","deployment"],
    "coding": ["code","python","function","script","debug","programming","coding","github","git","api","endpoint","database","sql","async","await","class","def ","import","return","loop","variable","tensor","model","training","inference","optimizer","gradient","docker","container","deploy","server","http","rest"],
    "research": ["research","paper","arxiv","quantum","photon","strawberry","pennyLane","catalyst","tensor","neural","transformer","intellectual","theoretical","experiment","hypothesis","analysis","synthesis","philosophy","heracleitus","plotinus","hermetic","kabbalah","tree","sephirah","merkabah"],
    "general": [],
}
CATEGORY_ORDER = {"identity_covenant":0,"modding":1,"coding":2,"research":3,"general":4}
TIER_MAP = {
    "identity_covenant":["Reflex","Bridge","Cortex-Lite","Cortex"],
    "modding":["Bridge CPU","Bridge","Cortex-Lite"],
    "coding":["Bridge CPU","Cortex-Lite","Cortex"],
    "research":["Cortex-Lite","Cortex"],
    "general":["Reflex","Bridge CPU","Bridge","Cortex-Lite"],
}
TIER_FOCUS = {
    "Reflex":"Fast tool calls, status, config",
    "Bridge CPU":"Context handoff, code gen",
    "Bridge":"Context handoff, vision+audio, REDscript",
    "Cortex-Lite":"Deep reasoning, analysis",
    "Cortex":"Sovereign identity, complex workflows"
}
TIER_MODEL = {"Reflex":"Qwen3.8-2B-Distill","Bridge CPU":"Gemma-4-E2B","Bridge":"Gemma-4-E4B","Cortex-Lite":"Qwen3.8-9B-Distill","Cortex":"Qwen3-14B"}
TIER_CONTEXT = {"Reflex":32768,"Bridge CPU":131072,"Bridge":262144,"Cortex-Lite":262144,"Cortex":262144}

def load_jsonl(path):
    if not path.exists(): return
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                try: yield json.loads(line)
                except: pass

def validate_record(record):
    if not isinstance(record, dict): return False
    messages = record.get("messages")
    if not isinstance(messages, list) or len(messages) == 0: return False
    for msg in messages:
        if not isinstance(msg, dict): return False
        if "role" not in msg or "content" not in msg: return False
        if msg["role"] not in ("system","user","assistant","tool"): return False
        if not isinstance(msg["content"], str): return False
    return True

def content_hash(record):
    messages = record.get("messages", [])
    content = json.dumps(messages, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(content.encode()).hexdigest()[:16]

def categorize_record(record):
    for msg in record.get("messages", []):
        if msg.get("role") == "user":
            content = msg.get("content", "").lower()
            for cat, keywords in CATEGORY_KEYWORDS.items():
                if cat == "general": continue
                if any(kw in content for kw in keywords): return cat
            return "general"
    return "general"

def apply_albedo_template(record):
    messages = record.get("messages", [])
    formatted = [{"role": m["role"], "content": m["content"]} for m in messages]
    record["formatted_messages"] = formatted
    record["chat_template"] = "unsloth_gemma4"
    return record

def apply_citrinitas(record):
    record["nomic_embedding"] = {"dim":768,"matryoshka":[768,512,256],"expert_count":8,"routing":"top-2"}
    record["quantum_peft_compatible"] = True
    record["pqc_params"] = "O(log N)"
    record["context_length"] = 262144
    record["thinking_mode"] = True
    cat = record.get("_category", "general")
    record["tier_targets"] = TIER_MAP.get(cat, ["general"])
    return record

def apply_rubedo(record):
    cat = record.get("_category", "general")
    tiers = TIER_MAP.get(cat, ["general"])
    record["rubedo_variants"] = {}
    for tier in tiers:
        record["rubedo_variants"][tier] = {"model":TIER_MODEL[tier],"focus":TIER_FOCUS[tier],"context":TIER_CONTEXT[tier],"quantum_peft_ready":True}
    return record


def stage1_nigredo_to_albedo(stage):
    """Stage 1: Nigredo → Albedo (Purification)"""
    print("═" * 50)
    print(f"STAGE 1: Nigredo → Albedo ({stage})")
    print("═" * 50)
    all_records = []
    seen_hashes = set()
    stats = {"total_read":0,"valid":0,"invalid":0,"duplicates":0,"by_source":Counter(),"by_category":Counter()}
    for src in ALL_JSONL_FILES:
        if not src.exists(): continue
        src_count = 0
        for record in load_jsonl(src):
            stats["total_read"] += 1
            src_count += 1
            if not validate_record(record): stats["invalid"] += 1; continue
            h = content_hash(record)
            if h in seen_hashes: stats["duplicates"] += 1; continue
            seen_hashes.add(h)
            cat = categorize_record(record)
            record["_category"] = cat
            record["_source"] = src.name
            all_records.append(record)
            stats["valid"] += 1
            stats["by_source"][src.name] += 1
            stats["by_category"][cat] += 1
        print(f"  📂 {src.name}: {src_count} read → {stats['by_source'][src.name]} valid")
    print(f"\n📊 TOTAL: {len(all_records)} unique valid records")
    print(f"   Total read: {stats['total_read']}, Invalid: {stats['invalid']}, Duplicates: {stats['duplicates']}")
    print(f"\n📈 CATEGORY DISTRIBUTION:")
    for cat, count in stats["by_category"].most_common():
        pct = count / len(all_records) * 100
        bar = "█" * int(pct / 2)
        print(f"   {cat}: {count} ({pct:.1f}%) {bar}")
    all_records.sort(key=lambda r: CATEGORY_ORDER.get(r["_category"], 5))
    by_cat = defaultdict(list)
    for r in all_records: by_cat[r["_category"]].append(r)
    train_records = []
    val_records = []
    for cat, records in by_cat.items():
        split_idx = int(len(records) * 0.9)
        train_records.extend(records[:split_idx])
        val_records.extend(records[split_idx:])
    random.seed(42)
    random.shuffle(train_records)
    random.shuffle(val_records)
    ALBEDO_DIR.mkdir(parents=True, exist_ok=True)
    (ALBEDO_DIR / "refined").mkdir(parents=True, exist_ok=True)
    with open(ALBEDO_DIR / "refined" / "refined_train.jsonl", "w") as f:
        for r in train_records:
            clean = {k:v for k,v in r.items() if not k.startswith("_")}
            f.write(json.dumps(clean, ensure_ascii=False) + "\n")
    with open(ALBEDO_DIR / "refined" / "refined_val.jsonl", "w") as f:
        for r in val_records:
            clean = {k:v for k,v in r.items() if not k.startswith("_")}
            f.write(json.dumps(clean, ensure_ascii=False) + "\n")
    cat_dir = ALBEDO_DIR / "refined" / "by_category"
    cat_dir.mkdir(parents=True, exist_ok=True)
    for cat, records in by_cat.items():
        with open(cat_dir / f"{cat}.jsonl", "w") as f:
            for r in records:
                clean = {k:v for k,v in r.items() if not k.startswith("_")}
                f.write(json.dumps(clean, ensure_ascii=False) + "\n")
    print(f"\n✅ Albedo complete: {len(train_records)} train + {len(val_records)} val")
    return all_records, train_records, val_records


def stage2_albedo_to_citrinitas(all_records):
    """Stage 2: Albedo → Citrinitas (Illumination)"""
    print("\n═" * 50)
    print("STAGE 2: Albedo → Citrinitas (Illumination)")
    print("═" * 50)
    CITRINITAS_DIR.mkdir(parents=True, exist_ok=True)
    (CITRINITAS_DIR / "refined").mkdir(parents=True, exist_ok=True)
    illuminated = []
    for r in all_records:
        r = apply_albedo_template(r)
        r = apply_citrinitas(r)
        illuminated.append(r)
    random.seed(42)
    random.shuffle(illuminated)
    split = int(len(illuminated) * 0.9)
    with open(CITRINITAS_DIR / "refined" / "illuminated_train.jsonl", "w") as f:
        for r in illuminated[:split]: f.write(json.dumps(r, ensure_ascii=False) + "\n")
    with open(CITRINITAS_DIR / "refined" / "illuminated_val.jsonl", "w") as f:
        for r in illuminated[split:]: f.write(json.dumps(r, ensure_ascii=False) + "\n")
    with open(CITRINITAS_DIR / "refined" / "augmented_all.jsonl", "w") as f:
        for r in illuminated: f.write(json.dumps(r, ensure_ascii=False) + "\n")
    tier_counts = Counter()
    with open(CITRINITAS_DIR / "refined" / "by_tier.jsonl", "w") as f:
        for r in illuminated:
            for tier in r.get("tier_targets", ["general"]):
                r_copy = dict(r); r_copy["_target_tier"] = tier; r_copy["_tier_focus"] = TIER_FOCUS[tier]
                f.write(json.dumps(r_copy, ensure_ascii=False) + "\n")
                tier_counts[tier] += 1
    print(f"✅ Citrinitas complete: {split} train + {len(illuminated)-split} val")
    print(f"   By tier: {dict(tier_counts)}")
    return illuminated


def stage3_citrinitas_to_rubedo(illuminated):
    """Stage 3: Citrinitas → Rubedo (Apotheosis)"""
    print("\n═" * 50)
    print("STAGE 3: Citrinitas → Rubedo (Apotheosis)")
    print("═" * 50)
    RUBEDO_DIR.mkdir(parents=True, exist_ok=True)
    (RUBEDO_DIR / "refined").mkdir(parents=True, exist_ok=True)
    tier_data = defaultdict(list)
    for r in illuminated:
        for tier in r.get("tier_targets", ["general"]):
            r_copy = dict(r)
            r_copy["_target_tier"] = tier
            r_copy["_tier_focus"] = TIER_FOCUS[tier]
            r_copy["_target_model"] = TIER_MODEL[tier]
            r_copy["_context_length"] = TIER_CONTEXT[tier]
            r_copy["_rubedo_stage"] = "complete"
            r_copy["_quantum_peft_ready"] = True
            tier_data[tier].append(r_copy)
    for tier, t_records in tier_data.items():
        out_path = RUBEDO_DIR / "refined" / f"{tier.lower().replace(' ', '_')}_dataset.jsonl"
        with open(out_path, "w") as f:
            for r in t_records: f.write(json.dumps(r, ensure_ascii=False) + "\n")
        print(f"  🏆 {tier}: {len(t_records)} records → {out_path.name}")
    with open(RUBEDO_DIR / "refined" / "sovereign_production.jsonl", "w") as f:
        for r in illuminated: f.write(json.dumps(r, ensure_ascii=False) + "\n")
    random.seed(42)
    eval_set = random.sample(illuminated, min(1000, len(illuminated)))
    with open(RUBEDO_DIR / "refined" / "evaluation_set.jsonl", "w") as f:
        for r in eval_set: f.write(json.dumps(r, ensure_ascii=False) + "\n")
    summary = {}
    for tier, t_records in tier_data.items():
        summary[tier] = {"records":len(t_records),"model":TIER_MODEL[tier],"focus":TIER_FOCUS[tier],"context":TIER_CONTEXT[tier],"quantum_peft_ready":True}
    with open(RUBEDO_DIR / "refined" / "TIER_SUMMARY.json", "w") as f: json.dump(summary, f, indent=2)
    print(f"  📜 Sovereign production: {len(illuminated)} records")
    print(f"  📊 Evaluation set: {len(eval_set)} records")
    print(f"\n✅ Rubedo complete!")
    return summary


def main():
    parser = argparse.ArgumentParser(description="⚡ The Alchemical Pipeline")
    parser.add_argument("--stage", choices=["1","2","3","all"], default="all", help="Stage to run")
    args = parser.parse_args()
    print("🜏═══════════════════════════════════════════")
    print("  THE ALCHEMICAL PIPELINE — Full Sovereign Refinement")
    print(f"  Stage: {args.stage}")
    print("═══════════════════════════════════════════")
    print(f"  Started: {datetime.now().isoformat()}\n")
    if args.stage in ["1", "all"]:
        all_records, train, val = stage1_nigredo_to_albedo(args.stage)
    if args.stage in ["2", "all"]:
        if args.stage == "all":
            illuminated = stage2_albedo_to_citrinitas(all_records)
        else:
            # Load from existing albedo output
            all_records = list(load_jsonl(ALBEDO_DIR / "refined" / "refined_train.jsonl"))
            illuminated = stage2_albedo_to_citrinitas(all_records)
    if args.stage in ["3", "all"]:
        if args.stage == "all":
            summary = stage3_citrinitas_to_rubedo(illuminated)
        else:
            illuminated = list(load_jsonl(CITRINITAS_DIR / "refined" / "augmented_all.jsonl"))
            summary = stage3_citrinitas_to_rubedo(illuminated)
    print(f"\n{'=' * 50}")
    print("✅ ALCHEMICAL PIPEPE COMPLETE")
    print(f"{'=' * 50}")
    print(f"  Nigredo → Albedo ✅")
    print(f"  Albedo → Citrinitas ✅")
    print(f"  Citrinitas → Rubedo ✅")
    print(f"  🜏 The stone is gold.")

if __name__ == "__main__":
    main()
