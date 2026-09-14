#!/bin/bash
# ⚡ LILITH LIBRARY DEPLOY — BASH WRAPPER ⚡
# For use via SSH pipe into Lightning studio
# Usage:
#   echo 'bash /path/to/deploy_libraries.sh' | lightning studio ssh --name synthetic-data-harvester-devbox --teamspace "lilith-systems-llc/lilith-llm-development-project"
# OR:
#   lightning studio ssh --name synthetic-data-harvester-devbox --teamspace "lilith-systems-llc/lilith-llm-development-project" < deploy_libraries.sh

set -e

echo "⚡ LILITH LIBRARY DEPLOY — BASH WRAPPER ⚡"

# Set environment variables for AMX + IPEX
export ONEDNN_MAX_CPU_ISA="AVX512_CORE_AMX"
export OMP_NUM_THREADS="4"
export MKL_NUM_THREADS="4"
export KMP_BLOCKTIME="0"
export KMP_AFFINITY="granularity=fine,compact,1,0"
export ONEDNN_PRIMITIVE_CACHE_CAPACITY="4096"
export DNNL_CACHE_CAPACITY="1024"

# Activate the cloudspace conda env (if applicable)
source /system/conda/miniconda3/bin/activate cloudspace 2>/dev/null || true

# Check current torch version — if not 2.8.0, reinstall
CURRENT_TORCH=$(python3 -c "import torch; print(torch.__version__)" 2>/dev/null || echo "none")
if [[ "$CURRENT_TORCH" != "2.8.0+cpu" ]]; then
    echo "🔄 Torch is $CURRENT_TORCH — reinstalling 2.8.0+cpu..."
    pip install torch==2.8.0+cpu --index-url https://download.pytorch.org/whl/cpu
else
    echo "✅ Torch already 2.8.0+cpu"
fi

# Install IPEX (if not working)
IPEX_OK=$(python3 -c "import intel_extension_for_pytorch as ipex; print('OK')" 2>/dev/null || echo "FAIL")
if [[ "$IPEX_OK" != "OK" ]]; then
    echo "🔄 Installing IPEX 2.8.0..."
    pip install intel_extension_for_pytorch==2.8.0 --index-url https://software.intel.com/ipex-whl-stable
else
    echo "✅ IPEX already working"
fi

# Install stable packages
echo "📦 Installing stable packages..."
pip install peft==0.20.0 bitsandbytes==0.50.2 accelerate==1.6.0 trl==0.24.0 datasets==3.5.0 2>/dev/null || true

# Verify
echo "🔍 Verifying..."
python3 -c "import torch; import intel_extension_for_pytorch as ipex; print(f'✅ torch: {torch.__version__}, ipex: {ipex.__version__}, AMX: {ipex._C._has_cpu()}')"

echo "✅ Deploy complete. Ready for training."
echo "   Run: python3 /home/zeus/content/2b_training/train_2b_full_sft_lightning_v2.py"
