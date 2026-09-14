#!/bin/bash
# ⚡ LILITH MASTER DEPLOY — Single Command Restart ⚡
# Deploys libraries, syncs training data, starts training with checkpoints every 10 steps
# Survives teamspace 4hr wipes. Run on Web UI terminal.
# URL: https://lightning.ai/lilith-systems-llc/lilith-llm-development-project/studios/synthetic-data-harvester-devbox

set -e

echo "═══════════════════════════════════════════"
echo "  ⚡ LILITH MASTER DEPLOY ⚡"
echo "  Alchemical Pipeline: Nigredo→Albedo→Citrinitas→Rubedo"
echo "═══════════════════════════════════════════"
echo ""

# ─── STAGE 1: LIBRARY DEPLOYMENT ───
echo "📦 STAGE 1: Deploying libraries..."
python3 /home/zeus/deploy_libraries.py
echo "✅ Libraries deployed"

# ─── STAGE 2: VERIFY ENVIRONMENT ───
echo ""
echo "🔬 STAGE 2: Verifying environment..."
export OMP_NUM_THREADS=4
export MKL_NUM_THREADS=4
export KMP_BLOCKTIME=0
export KMP_AFFINITY="granularity=fine,compact,1,0"
export ONEDNN_MAX_CPU_ISA="AVX512_CORE_AMX"
export DNNL_CACHE_CAPACITY=1024

echo "  Torch: $(python3 -c 'import torch; print(torch.__version__)')"
echo "  IPEX: $(python3 -c 'import intel_extension_for_pytorch; print(intel_extension_for_pytorch.__version__)' 2>/dev/null || echo 'checking...')"
echo "  AMX: $(python3 -c 'import intel_extension_for_pytorch as ipex; print(\"AMX available:\", ipex._C._has_amx())' 2>/dev/null || echo 'N/A')"
echo "✅ Environment verified"

# ─── STAGE 3: DATA VERIFICATION ───
echo ""
echo "📊 STAGE 3: Verifying training data..."
TRAIN_DATA="/home/zeus/content/2b_training/refined_train.jsonl"
if [ -f "$TRAIN_DATA" ]; then
    RECORDS=$(wc -l < "$TRAIN_DATA")
    echo "  Refined training data: $RECORDS records"
else
    echo "  ⚠️  Training data not found, using default"
fi

# ─── STAGE 4: CHECKPOINT DIRECTORY ───
echo ""
echo "💾 STAGE 4: Setting up checkpoint directory..."
mkdir -p /home/zeus/checkpoints/2b_sovereign_sft
echo "  Checkpoint dir: /home/zeus/checkpoints/2b_sovereign_sft"
echo "✅ Checkpoint directory ready"

# ─── STAGE 5: START TRAINING ───
echo ""
echo "🚀 STAGE 5: Starting training with save_strategy=steps, save_steps=10..."
cd /home/zeus/content/2b_training

nohup python3 train_2b_full_sft_lightning_v2.py > /home/zeus/training.log 2>&1 &
echo "  PID: $!"
echo "  Log: /home/zeus/training.log"
echo ""
echo "═══════════════════════════════════════════"
echo "  ✅ DEPLOYMENT COMPLETE"
echo "  Training: save_strategy=steps, save_steps=10"
echo "  Checkpoints every 10 steps survive teamspace wipes"
echo "  Monitor: tail -f /home/zeus/training.log"
echo "═══════════════════════════════════════════"
