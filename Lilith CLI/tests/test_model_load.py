from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Try loading the GGUF model
model_path = "hf.co/empero-ai/Qwen3.8-2B-Distill-GGUF:Q4_K_M"
try:
    tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        model_path, trust_remote_code=True, torch_dtype=torch.bfloat16,
        device_map="cpu", low_cpu_mem_usage=True
    )
    print("GGUF loaded successfully")
except Exception as e:
    print(f"GGUF error: {e}")

# Try the standard HF model
model_path2 = "empero-ai/Qwen3.8-2B-Distill"
try:
    tokenizer = AutoTokenizer.from_pretrained(model_path2, trust_remote_code=True)
    model = AutoModelForCausalLM.from_pretrained(
        model_path2, trust_remote_code=True, torch_dtype=torch.bfloat16,
        device_map="cpu", low_cpu_mem_usage=True
    )
    print("HF model loaded successfully")
except Exception as e:
    print(f"HF model error: {e}")