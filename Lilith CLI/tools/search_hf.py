from huggingface_hub import HfApi
api = HfApi()
models = api.list_models(search="Qwen3.8-2B-Distill", limit=10)
for m in models:
    print(m.modelId)