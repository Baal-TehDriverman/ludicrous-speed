from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Try loading the HF model with local_files_only to use cached version
model_path = "empero-ai/Qwen3.8-2B-Distill"
try:
    # Use local cache
    tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True, local_files_only=True)
    model = AutoModelForCausalLM.from_pretrained(
        model_path, trust_remote_code=True, torch_dtype=torch.bfloat16,
        device_map="cpu", low_cpu_mem_usage=True, local_files_only=True
    )
    print("HF model loaded successfully from cache!")
    print(f"Params: {sum(p.numel() for p in model.parameters()):,}")
except Exception as e:
    print(f"HF model error: {e}")
    import traceback
    traceback.print_exc()

# Try without chat template
try:
    tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True, use_fast=False)
    print("Tokenizer loaded without chat template")
except Exception as e:
    print(f"Tokenizer error: {e}")