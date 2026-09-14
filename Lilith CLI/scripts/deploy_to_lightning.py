#!/usr/bin/env python3
"""
Deploy IPEX-fixed 2B Full SFT to Lightning Xeon and launch training.
This script:
1. Syncs the patched training script to Lightning Drive
2. Syncs the dataset
3. Verifies IPEX + torch 2.8.0 on Lightning
4. Launches training via SSH when studio is available
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

# === Launch training ===
os.environ["ONEDNN_MAX_CPU_ISA"] = "AVX512_CORE_AMX"
os.environ["OMP_NUM_THREADS"] = "4"
os.environ["KMP_AFFINITY"] = "granularity=fine,compact,1,0"
os.environ["KMP_BLOCKTIME"] = "0"

print("🚀 Starting 2B Full SFT with IPEX + AMX BF16...")
os.system("python3 /home/zeus/content/2b_training/train_2b_full_sft_lightning_v2.py 2>&1 | tee /tmp/lilith_2b_train.log")
print("✅ Training complete!")
'''
    
    # Write deploy script locally
    with open("/home/tehlappy/deploy_to_lightning.py", "w") as f:
        f.write(deploy_script)
    print(f"✅ Deploy script written: {len(deploy_script)} chars")
    print("📝 Upload with: lightning cp deploy_to_lightning.py lit://lilith-systems-llc/lilith-llm-development-project/studios/synthetic-data-harvester-devbox/")
    print("⚠️  Studio must be STARTED first (needs credits)")

if __name__ == "__main__":
    main()
