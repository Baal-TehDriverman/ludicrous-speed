#!/usr/bin/env python3
"""
Deploy IPEX-fixed 2B Full SFT to Lightning Xeon and launch training.
This script:
1. Syncs the patched training script to Lightning
2. Syncs the dataset
3. Verifies IPEX + torch 2.8.0 on Lightning
4. Launches training in background
"""
import base64
import os
import sys

def encode_file(path):
    with open(path, 'r') as f:
        content = f.read()
    return base64.b64encode(content.encode()).decode()

def main():
    script_path = "/home/tehlappy/🜏 Lilith/models/Nigredo/tier-1-critical/train_2b_full_sft_lightning_v2.py"
    dataset_path = "/home/tehlappy/🜏 Lilith/models/Nigredo/tier-1-critical/lilith_heart_2b_1k_curricula.jsonl"
    
    # Encode files
    script_b64 = encode_file(script_path)
    dataset_b64 = encode_file(dataset_path)
    
    # Write the deployment script
    deploy_script = f'''
import base64
import os

# === Decode and write training script ===
script_b64 = "{script_b64}"
with open("/home/zeus/content/2b_training/train_2b_full_sft_lightning_v2.py", "wb") as f:
    f.write(base64.b64decode(script_b64))
print("✅ Training script deployed")

# === Decode and write dataset ===
dataset_b64 = "{dataset_b64}"
with open("/home/zeus/content/2b_training/lilith_heart_2b_1k_curricula.jsonl", "wb") as f:
    f.write(base64.b64decode(dataset_b64))
print("✅ Dataset deployed")

# === Verify IPEX + torch ===
import torch
import intel_extension_for_pytorch as ipex
print(f"🔥 torch: {{torch.__version__}}")
print(f"🔥 ipex: {{ipex.__version__}}")
print(f"🔥 AMX: {{ipex._C._has_amx() if hasattr(ipex._C, '_has_amx') else 'N/A'}}")

# === Verify dataset ===
with open("/home/zeus/content/2b_training/lilith_heart_2b_1k_curricula.jsonl") as f:
    lines = f.readlines()
print(f"✅ Dataset: {{len(lines)}} records")

# === Verify torch version ===
if not torch.__version__.startswith("2.8"):
    print(f"⚠️ WARNING: torch is {{torch.__version__}}, expected 2.8.x")
    print("Run: pip install torch==2.8.0+cpu --index-url https://download.pytorch.org/whl/cpu")
else:
    print("✅ torch 2.8.0+cpu — IPEX compatible")

# === Launch training ===
print("\\n🚀 Launching 2B Full SFT training with IPEX AMX...")
os.environ["ONEDNN_MAX_CPU_ISA"] = "AVX512_CORE_AMX"
os.environ["OMP_NUM_THREADS"] = "4"
os.environ["MKL_NUM_THREADS"] = "4"
os.environ["KMP_BLOCKTIME"] = "0"
os.environ["KMP_AFFINITY"] = "granularity=fine,compact,1,0"
os.environ["DNNL_CACHE_CAPACITY"] = "1024"

import subprocess
proc = subprocess.Popen(
    ["python3", "/home/zeus/content/2b_training/train_2b_full_sft_lightning_v2.py"],
    stdout=open("/home/zeus/content/2b_training/training.log", "w"),
    stderr=subprocess.STDOUT
)
print(f"✅ Training launched! PID={{proc.pid}}")
print(f"📝 Log: /home/zeus/content/2b_training/training.log")
print(f"📊 Checkpoints: /home/zeus/checkpoints/2b_sovereign_sft/ (every 50 steps)")
print(f"⚡ IPEX AMX acceleration ACTIVE — 2 days → hours")
'''
    
    # Write deployment script
    with open("/home/tehlappy/deploy_2b_training.py", "w") as f:
        f.write(deploy_script)
    
    print("✅ Deployment script created: /home/tehlappy/deploy_2b_training.py")
    print("Run: python3 /home/tehlappy/deploy_2b_training.py")
    print()
    print("Or manually on Lightning web UI terminal:")
    print("1. Navigate to: https://lightning.ai/lilith-systems-llc/lilith-llm-development-project/studios/synthetic-data-harvester-devbox")
    print("2. Run the deploy script")
    print("3. Training launches with IPEX AMX kernel fusion")

if __name__ == "__main__":
    main()
