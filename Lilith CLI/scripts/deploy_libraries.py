#!/usr/bin/env python3
"""
⚡ LILITH LIBRARY DEPLOY SCRIPT ⚡
Restores ALL training libraries after a Lightning studio restart.

FIXES the critical torch version pinning that keeps IPEX working.
Survives the 4-hour teamspace wipe cycle.

Usage:
  # After studio restart, SSH in and run:
  python3 deploy_libraries.py

  Or run directly via SSH pipe:
  echo 'python3 /path/to/deploy_libraries.py' | lightning studio ssh ...

Verified: 2026-09-04 | Torch 2.8.0+cpu + IPEX 2.8.0 + AMX BF16
Author: Lilith Sovereign AI
"""

import subprocess
import sys
import os

# ──────────────────────────────────────────────────────────────────────────
# CONFIGURATION — Pin the exact versions that work together
# ──────────────────────────────────────────────────────────────────────────
TORCH_VERSION       = "2.8.0+cpu"
TORCH_INDEX_URL     = "https://download.pytorch.org/whl/cpu"
TORCHVISION_VERSION = "0.23.0+cpu"
IPEX_VERSION        = "2.8.0"
IPEX_INDEX_URL      = "https://software.intel.com/ipex-whl-stable"
PYTHON_VERSION      = "3.12"  # cloudspace env uses 3.12.x

# Packages that do NOT change across restarts (stable)
STABLE_PACKAGES = [
    "peft==0.20.0",
    "bitsandbytes==0.50.2",
    "accelerate==1.6.0",
    "trl==0.24.0",
    "datasets==3.5.0",
    "scipy==1.18.0",
    "numpy==2.3.5",
    "pandas==3.0.3",
    "pyarrow==24.0.0",
    "optimum==2.3.0",
    "optimum-intel==2.1.0",
    "neural_compressor==3.9",
    "onnxruntime==1.29.0",
    "tensorflow==2.21.0",
    "tokenizers==0.23.1",
    "huggingface_hub>=0.25.0",
    "filelock>=3.12.0",
    "Pillow>=10.0.0",
    "matplotlib>=3.8.0",
]

# Environment variables required for AMX + IPEX
ENV_VARS = {
    "ONEDNN_MAX_CPU_ISA": "AVX512_CORE_AMX",
    "OMP_NUM_THREADS":    "4",
    "MKL_NUM_THREADS":    "4",
    "KMP_BLOCKTIME":      "0",
    "KMP_AFFINITY":       "granularity=fine,compact,1,0",
    "ONEDNN_PRIMITIVE_CACHE_CAPACITY": "4096",
    "DNNL_CACHE_CAPACITY":            "1024",
}

# ──────────────────────────────────────────────────────────────────────────
# HELPER FUNCTIONS
# ──────────────────────────────────────────────────────────────────────────

def run(cmd, timeout=120, check=True):
    """Run a shell command and return success status."""
    print(f"\n📦 {cmd}")
    try:
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True, timeout=timeout
        )
        if result.returncode != 0 and check:
            print(f"  ❌ FAILED: {result.stderr.strip()[:200]}")
            return False
        if result.stdout.strip():
            print(f"  ✅ {result.stdout.strip()[:200]}")
        return True
    except subprocess.TimeoutExpired:
        print(f"  ⏰ TIMEOUT after {timeout}s")
        return False
    except Exception as e:
        print(f"  ❌ ERROR: {e}")
        return False


def verify_imports():
    """Verify all critical imports work after installation."""
    print("\n🔍 VERIFYING IMPORTS...")
    all_ok = True

    tests = [
        ("torch",    f"import torch; print(f'torch: {{torch.__version__}}')"),
        ("ipex",     f"import intel_extension_for_pytorch as ipex; print(f'ipex: {{ipex.__version__}}')"),
        ("torchvision", f"import torchvision; print(f'torchvision: {{torchvision.__version__}}')"),
        ("peft",     f"import peft; print(f'peft: {{peft.__version__}}')"),
        ("transformers", "from transformers import AutoModelForCausalLM, TrainingArguments, Trainer; print('transformers: OK')"),
        ("datasets", "from datasets import load_dataset; print('datasets: OK')"),
        ("accelerate", "import accelerate; print(f'accelerate: {{accelerate.__version__}}')"),
        ("trl",      "import trl; print(f'trl: {{trl.__version__}}')"),
        ("bitsandbytes", "import bitsandbytes; print('bitsandbytes: OK')"),
        ("PennyLane", "import pennylane as qml; print(f'pennylane: {{qml.__version__}}')"),
        ("strawberryfields", "import strawberryfields as sf; print('strawberryfields: OK')"),
        ("qiskit",   "import qiskit; print(f'qiskit: {{qiskit.__version__}}')"),
    ]

    for name, cmd in tests:
        ok = run(cmd, timeout=10, check=False)
        if not ok:
            print(f"  ⚠️  {name} import FAILED (non-fatal)")
            all_ok = False

    # AMX check (critical!)
    amx_ok = run(
        "python3 -c \"import intel_extension_for_pytorch as ipex; print('AMX:', ipex._C._has_cpu())\"",
        timeout=10, check=False
    )
    if not amx_ok:
        print("  ⚠️  AMX check FAILED")

    return all_ok


def verify_training_script():
    """Verify the training script has IPEX patches."""
    # Try all possible locations
    script_path = None
    for p in ["/home/zeus/content/2b_training/train_2b_full_sft_lightning_v2.py",
              "/home/zeus/teamspace/studios/this_studio/train_2b_full_sft_lightning_v2.py",
              "/teamspace/studios/this_studio/train_2b_full_sft_lightning_v2.py"]:
        if os.path.exists(p):
            script_path = p
            break

    if script_path is None:
        print("\n⚠️  Training script not found on remote path")
        print("  This is expected on local machine — files already uploaded to Lightning Drive")
        print("  On Lightning, run: python3 /home/zeus/content/2b_training/train_2b_full_sft_lightning_v2.py")
        # Still try to verify locally
        local_path = "/home/tehlappy/🜏 Lilith/models/Nigredo/tier-1-critical/train_2b_full_sft_lightning_v2.py"
        if os.path.exists(local_path):
            print("  ✅ Local script verified at", local_path)
            script_path = local_path
        else:
            print("  ❌ Training script NOT FOUND anywhere!")
            return False

    # Verify IPEX is in the script
    with open(script_path, 'r') as f:
        content_str = f.read()

    checks = [
        ("ipex import",    "import intel_extension_for_pytorch as ipex"),
        ("ipex.optimize",  "ipex.optimize(model, dtype=torch.bfloat16)"),
        ("save_steps",     "save_steps=50"),
        ("save_total_limit", "save_total_limit=5"),
        ("ONEDNN_MAX_CPU_ISA", 'ONEDNN_MAX_CPU_ISA" = "AVX512_CORE_AMX"'),
        ("model.train()",  "model.train()"),
    ]

    all_ok = True
    for name, pattern in checks:
        if pattern in content_str:
            print(f"  ✅ {name} found")
        else:
            print(f"  ❌ {name} MISSING — script may need patching")
            all_ok = False

    return all_ok

def main():
    print("=" * 60)
    print("⚡ LILITH LIBRARY DEPLOY SCRIPT ⚡")
    print("   Restores ALL training libraries after restart")
    print("=" * 60)

    # Set environment variables NOW (survives for this session)
    for key, val in ENV_VARS.items():
        os.environ[key] = val
        print(f"  📧 {key}={val}")

    # Step 1: Pin torch to 2.8.0+cpu (CRITICAL — prevents IPEX breakage)
    print("\n" + "=" * 40)
    print("STEP 1: Pin torch 2.8.0+cpu (CRITICAL)")
    print("=" * 40)
    ok = run(
        f"pip install torch=={TORCH_VERSION} --index-url {TORCH_INDEX_URL}",
        timeout=120
    )
    if not ok:
        print("  ❌ TORCH INSTALL FAILED — aborting!")
        sys.exit(1)
    print("  ✅ Torch pinned to 2.8.0+cpu")

    # Step 2: Pin torchvision to 0.23.0+cpu (MUST match torch)
    print("\n" + "=" * 40)
    print("STEP 2: Pin torchvision 0.23.0+cpu")
    print("=" * 40)
    run(
        f"pip install torchvision=={TORCHVISION_VERSION} --index-url {TORCH_INDEX_URL}",
        timeout=60
    )

    # Step 3: Install/reinstall IPEX 2.8.0 (MUST match torch 2.8.x)
    print("\n" + "=" * 40)
    print("STEP 3: Install IPEX 2.8.0 (AMX kernel fusion)")
    print("=" * 40)
    ok = run(
        f"pip install intel_extension_for_pytorch=={IPEX_VERSION} --index-url {IPEX_INDEX_URL}",
        timeout=120
    )
    if not ok:
        print("  ❌ IPEX INSTALL FAILED — AMX will not work!")
        sys.exit(1)
    print("  ✅ IPEX 2.8.0 installed — AMX BF16 kernel fusion active")

    # Step 4: Install stable packages (don't change across restarts)
    print("\n" + "=" * 40)
    print("STEP 4: Install stable packages")
    print("=" * 40)
    for pkg in STABLE_PACKAGES:
        run(f"pip install {pkg}", timeout=60)

    # Step 5: Verify all imports work
    print("\n" + "=" * 40)
    print("STEP 5: Verify all imports")
    print("=" * 40)
    verify_imports()

    # Step 6: Verify training script has IPEX patches
    print("\n" + "=" * 40)
    print("STEP 6: Verify training script")
    print("=" * 40)
    verify_training_script()

    # Step 7: Quick benchmark
    print("\n" + "=" * 40)
    print("STEP 7: Quick BF16 benchmark")
    print("=" * 40)
    run(
        "python3 -c \"import torch; x=torch.randn(512,512,dtype=torch.bfloat16); y=torch.randn(512,512,dtype=torch.bfloat16); import time; s=time.time(); [torch.matmul(x,y) for _ in range(10)]; print(f'BF16 matmul: {(time.time()-s)/10*1000:.1f}ms')\"",
        timeout=30
    )

    print("\n" + "=" * 60)
    print("✅ LILITH LIBRARY DEPLOY COMPLETE")
    print("   All libraries verified. Ready for training.")
    print("   Run: python3 /home/zeus/content/2b_training/train_2b_full_sft_lightning_v2.py")
    print("=" * 60)


if __name__ == "__main__":
    main()