#!/usr/bin/env python3
"""Asset Forge — Generate texture variants and story items from Albedo emotional designs."""
import os, json, hashlib, tarfile
from PIL import Image, ImageFilter, ImageEnhance
from pathlib import Path

BASE = Path("/teamspace/studios/this_studio")
OUTPUT = BASE / "blend-output" / "story_items"
OUTPUT.mkdir(parents=True, exist_ok=True)

def sha256(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def process_variant(src_path, dest_path, tint, contrast, blur=0):
    img = Image.open(src_path).convert("RGBA")
    if contrast != 1.0:
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(contrast)
    if tint:
        r, g, b = tint
        overlay = Image.new("RGBA", img.size, (r, g, b, 80))
        img = Image.alpha_composite(img, overlay)
    if blur > 0:
        img = img.filter(ImageFilter.GaussianBlur(radius=blur))
    img.save(dest_path, "PNG")
    return dest_path

MODS = {
    "they_will_remember": {"emotion": "Power → Consequence → Paranoia", "tint": (255, 50, 50), "contrast": 1.4, "suffix": "hostile"},
    "cyberware_ex": {"emotion": "Limitation → Expansion → Transcendence", "tint": (50, 200, 255), "contrast": 1.2, "suffix": "augmented"},
    "drug_dealer": {"emotion": "Ambition → Corruption → Isolation", "tint": (180, 50, 200), "contrast": 1.3, "suffix": "corrupted"},
    "economypunk": {"emotion": "Scarcity → Agency → Responsibility", "tint": (255, 200, 50), "contrast": 1.1, "suffix": "wealthy"},
    "weather_switcher": {"emotion": "Monotony → Control → Mood", "tint": (100, 150, 255), "contrast": 1.2, "suffix": "atmospheric"},
    "equipment_ex": {"emotion": "Constraint → Liberation → Self-Expression", "tint": (255, 100, 200), "contrast": 1.3, "suffix": "expressive"},
    "lilith_pet": {"emotion": "Recognition → Devotion → Sovereign Love", "tint": (255, 215, 0), "contrast": 1.5, "suffix": "sovereign"},
}

SRC = BASE / "blend-output" / "signature_weapon_vfx_tri_stage.tar.gz"
with tarfile.open(SRC, "r:gz") as tar:
    tar.extractall(BASE / "blend-output" / "vfx_source")

vfx_dir = BASE / "blend-output" / "vfx_source" / "signature_weapon_vfx_tri_stage"
sources = list(vfx_dir.glob("*.png"))
print("Source textures:", len(sources))

manifest = {"generated_at": "2026-09-04", "frequency_hz": 432, "mods": {}}

for mod_name, config in MODS.items():
    mod_dir = OUTPUT / mod_name
    mod_dir.mkdir(exist_ok=True)
    mod_manifest = {"emotion": config["emotion"], "tint": config["tint"], "contrast": config["contrast"], "outputs": []}
    for src in sources:
        variant_name = f"{mod_name}_{config['suffix']}_{src.name}"
        dest = mod_dir / variant_name
        process_variant(src, dest, tint=config["tint"], contrast=config["contrast"])
        mod_manifest["outputs"].append({"file": variant_name, "sha256": sha256(dest), "size_bytes": dest.stat().st_size})
    manifest["mods"][mod_name] = mod_manifest
    print("Done:", mod_name, len(mod_manifest['outputs']), "variants")

with open(OUTPUT / "story_items_manifest.json", "w") as f:
    json.dump(manifest, f, indent=2)

print("Asset Forge Complete —", len(MODS), "mods processed")
