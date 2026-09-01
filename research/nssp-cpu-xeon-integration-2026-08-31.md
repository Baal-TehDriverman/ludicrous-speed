# NSSP × Lilith Crown — CPU Xeon Research Synthesis
> Connecting the Non-Suck Service-Provider to the CPU training optimization
> Date: 2026-08-31
> Researcher: Lilith Sovereign AI

---

## Executive Summary

The NSSP codebase at `/run/media/tehlappy/LILITH_ROOT/@lilith/` is a complete AI OS. It has a tiered router, 25+ agents, hardware HAL, and a gateway server. What it's missing is an integrated training pipeline. The CPU Xeon research shows how to train Gemma 4.6B in 2-12 hours on free-tier Lightning. This document connects the two: **NSSP becomes the orchestration layer, Lightning CPU becomes the training substrate.**

---

## 1. NSSP Architecture — What Exists

### Services Map

| Service | Port | Function | State |
|---------|------|----------|-------|
| Lilith Gateway | 8080 | FastAPI, LLM proxy, app/VM inventory | UP v2.0.0 |
| Cosmos3 vLLM | 8003 | World Model tier, 1 model loaded | UP |
| Mythos | 8007 | Graphics engine, LOCAL_ONLY | UP |
| Ollama | 11434 | Local LLM inference, 48 models | UP |
| Dashboard | 3000 | React 19 + Vite 6 frontend | UP |

### Core Components

| Component | File | Purpose |
|-----------|------|---------|
| **Gateway Server** | `gateway_server.py` | OpenAI-compatible LLM proxy, routes to Ollama/Cosmos3 |
| **LLM Providers** | `llm_providers.py` | Multi-provider abstraction (NVIDIA, OpenAI, Anthropic, Google, Groq, etc.) |
| **Tiered Router** | `Sovereign-Core/tiered_router.py` | Routes tasks across 3 tiers (Reflex/Arbiter/World) |
| **Hardware HAL** | `Sovereign-Core/hardware_hal.py` | GPU telemetry + optimization (NVIDIA + AMD) |
| **Learning Loop** | `Sovereign-Core/learning_loop.py` | Continuous learning from agent interactions |
| **Cerebellum** | `agents/cerebellum/` | 25+ specialized abyssal agents |

### Tiered Router (Current)

```
Tier 1 (Reflex):    RuvLTRA / Qwen-0.5B    → Fast routing, tool calls, simple tasks
Tier 2 (Arbiter):   Gemma-3n-E4B           → Medium reasoning, code, DSL
Tier 3 (World):     Cosmos3-Edge           → High-dimensional synthesis, visual/spatial
```

---

## 2. The Gap — What NSSP is Missing

### No Training Pipeline

NSSP has:
- ✅ Inference (Ollama, Cosmos3 vLLM)
- ✅ Multi-provider routing (9 providers)
- ✅ Agent orchestration (25+ agents)
- ✅ Hardware telemetry (NVIDIA + AMD)
- ❌ **Model training**

The tiered router can send tasks to different models, but those models are pre-trained. There's no way to:
- Fine-tune models on domain data
- Train specialized agents for specific tasks
- Adapt models to user behavior (learning loop captures engrams but doesn't train)
- Generate new adapters for the agent swarm

### No Intel CPU Support in HAL

The hardware HAL covers:
- ✅ NVIDIA (nvidia-smi, Gratitude Driver)
- ✅ AMD (rocm-smi, Radeon Developer Tool Suite)
- ❌ **Intel Xeon AMX**

This means NSSP can't:
- Detect or utilize Intel AMX acceleration
- Route training tasks to Intel CPUs
- Optimize for the most common cloud CPU (Xeon)

---

## 3. The Integration — How CPU Xeon Research Ties In

### NSSP as Orchestrator, Lightning as Training Substrate

```
┌─────────────────────────────────────────────────────────────┐
│                    NSSP AI OS                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Gateway    │  │  Tiered     │  │  Hardware HAL       │  │
│  │  Server     │  │  Router     │  │  (NVIDIA/AMD/INTEL) │  │
│  │  :8080      │  │             │  │                     │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                    │             │
│         └────────────────┼────────────────────┘             │
│                          │                                  │
│                          ▼                                  │
│              ┌─────────────────────┐                        │
│              │  TRAINING ORCHESTRATOR  │                    │
│              │  (New Component)     │                        │
│              └──────────┬──────────┘                        │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          ▼
              ┌─────────────────────┐
              │  Lightning CPU      │
              │  Intel Xeon + AMX   │
              │  (Free tier)        │
              └─────────────────────┘
```

### Training Orchestrator (New NSSP Component)

The CPU Xeon research enables a new NSSP component:

```python
# nssp/training_orchestrator.py

class TrainingOrchestrator:
    """
    Routes training tasks to optimal compute:
    - Local GPU (RTX 3060) — small models, fast iteration
    - Lightning CPU (Xeon + AMX) — 4B models, free tier
    - Lightning T4 GPU — large models, paid
    """
    
    def __init__(self, hardware_hal):
        self.hal = hardware_hal
        self.lightning_client = LightningSDK()
        
    def route_training_task(self, model_size, urgency, budget):
        """
        Decide where to train based on model size, urgency, and budget.
        """
        if model_size <= 4_000_000_000 and budget == 0:
            # 4B model, no budget → Lightning CPU (AMX)
            return self._train_on_lightning_cpu(model_size)
        elif model_size <= 4_000_000_000 and urgency == "fast":
            # 4B model, need it now → Local GPU
            return self._train_on_local_gpu(model_size)
        else:
            # Large model → Lightning T4 GPU
            return self._train_on_lightning_gpu(model_size)
    
    def _train_on_lightning_cpu(self, model_size):
        """
        Use the optimized CPU training pipeline:
        - torch.compile + BF16 + AMX
        - 2-12 hours on free tier
        """
        # Upload dataset to Lightning
        # Start CPU training job with torch.compile
        # Monitor via SDK
        # Download trained adapter
        pass
```

---

## 4. Extended Hardware HAL — Intel Xeon Support

The current HAL needs an `IntelHAL` class:

```python
class IntelHAL:
    """Intel CPU Hardware Abstraction using AMX."""
    
    def __init__(self):
        self.amx_available = self._check_amx()
        self.core_count = os.cpu_count()
        
    def _check_amx(self) -> bool:
        """Check if AMX is available on this CPU."""
        try:
            result = subprocess.run(
                ["grep", "-o", "amx", "/proc/cpuinfo"],
                capture_output=True, text=True
            )
            return "amx" in result.stdout
        except:
            return False
    
    def get_cpu_info(self) -> Dict[str, Any]:
        """Get CPU info including AMX status."""
        return {
            "vendor": "intel",
            "amx_available": self.amx_available,
            "amx_bf16": self._check_amx_feature("amx_bf16"),
            "amx_tile": self._check_amx_feature("amx_tile"),
            "amx_int8": self._check_amx_feature("amx_int8"),
            "core_count": self.core_count,
            "optimized": self.amx_available,
        }
    
    def get_optimization_recommendations(self) -> List[OptimizationProfile]:
        """Get optimization profiles for Intel CPU training."""
        profiles = []
        
        if self.amx_available:
            profiles.append(OptimizationProfile(
                name="intel-cpu-qlora-training",
                description="Optimized for QLoRA training on Intel Xeon with AMX",
                target_workload="qlora_training",
                settings={
                    "omp_num_threads": self.core_count,
                    "mkl_num_threads": self.core_count,
                    "kmp_blocktime": 0,
                    "kmp_affinity": "granularity=finite,compact,1,0",
                    "torch_compile": True,
                    "torch_compile_backend": "inductor",
                    "torch_compile_mode": "max-autotune",
                    "bf16": True,
                    "gradient_checkpointing": True,
                }
            ))
        
        return profiles
```

---

## 5. Extended Tiered Router — Training Tier

The current router has 3 tiers. We add a 4th:

```
Tier 1 (Reflex):    RuvLTRA / Qwen-0.5B    → Fast routing, tool calls, simple tasks
Tier 2 (Arbiter):   Gemma-3n-E4B           → Medium reasoning, code, DSL
Tier 3 (World):     Cosmos3-Edge           → High-dimensional synthesis, visual/spatial
Tier 4 (Training):  Lightning CPU/GPU      → Model fine-tuning, adapter training
```

```python
# Extended tiered router

TIER_ENDPOINTS = {
    "tier1_reflex": "http://localhost:8000/v1/chat/completions",
    "tier2_arbiter": "http://localhost:8001/v1/chat/completions",
    "tier3_world": "http://localhost:8002/v1/chat/completions",
    "tier4_training": "http://localhost:8090/v1/training/jobs",  # NEW
}

def analyze_task_complexity(self, messages, model=None):
    """Extended to detect training requests."""
    content = messages[-1].get("content", "").lower() if messages else ""
    
    # Training request detection
    training_keywords = [
        "train", "fine-tune", "finetune", "qlora", "adapter",
        "learn from", "update model", "retrain", "distill"
    ]
    if any(kw in content for kw in training_keywords):
        return "tier4_training"
    
    # ... existing routing logic
```

---

## 6. Learning Loop — From Engrams to Training

The current learning loop captures engrams (state transitions) but doesn't train on them:

```python
# Current: captures engrams, synthesizes reports
# Extended: uses engrams as training data

class SovereignLearner:
    def generate_training_data(self) -> Path:
        """
        Convert captured engrams into training data for QLoRA.
        """
        engrams = list((self.vault / "engrams").glob("*.json"))
        
        training_data = []
        for engram in engrams:
            with open(engram) as f:
                data = json.load(f)
            
            # Convert engram to training example
            training_data.append({
                "instruction": data.get("transition", ""),
                "input": data.get("context", ""),
                "output": data.get("result", {}).get("synthesis", ""),
            })
        
        # Save as JSONL for training
        output_path = self.vault / "training_data" / f"training_{int(time.time())}.jsonl"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w') as f:
            for item in training_data:
                f.write(json.dumps(item) + "\n")
        
        return output_path
    
    def trigger_training(self):
        """
        Trigger a training job on Lightning CPU using captured engrams.
        """
        # Generate training data from engrams
        training_data = self.generate_training_data()
        
        # Route to training orchestrator
        orchestrator = TrainingOrchestrator(hardware_hal=self.hal)
        orchestrator.route_training_task(
            model_size=4_000_000_000,  # 4B model
            urgency="background",
            budget=0,  # Free tier
            dataset_path=training_data,
        )
```

---

## 7. The Complete Picture — NSSP + CPU Training

```
┌──────────────────────────────────────────────────────────────────┐
│                        NSSP AI OS                                │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐  │
│  │  Gateway   │  │  Tiered    │  │  Hardware  │  │  Learning │  │
│  │  Server    │  │  Router    │  │  HAL       │  │  Loop     │  │
│  │  :8080     │  │  (4 tiers) │  │  (N/A/Int) │  │           │  │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬─────┘  │
│        │               │               │               │        │
│        └───────────────┴───────────────┴───────────────┘        │
│                            │                                    │
│                            ▼                                    │
│              ┌─────────────────────────┐                        │
│              │  Training Orchestrator  │                        │
│              │  (New Component)        │                        │
│              └───────────┬─────────────┘                        │
│                          │                                      │
│         ┌────────────────┼────────────────┐                     │
│         ▼                ▼                ▼                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │ Local GPU  │  │ Lightning  │  │ Lightning  │                │
│  │ RTX 3060   │  │ CPU (AMX)  │  │ T4 GPU     │                │
│  │ (small)    │  │ (4B, free) │  │ (large)    │                │
│  └────────────┘  └────────────┘  └────────────┘                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 8. Key Research Points — Summary

### CPU Xeon Optimization

| Point | Detail |
|-------|--------|
| **AMX is automatic** | PyTorch 2.11+ enables AMX by default — no special libraries |
| **torch.compile = magic** | `model = torch.compile(model, backend='inductor', mode='max-autotune')` |
| **BF16 + grad checkpoint** | BF16 is AMX-accelerated; gradient checkpointing halves memory |
| **IPEX is archived** | Intel's repo archived Jan 2026; use native PyTorch |
| **48hrs → 2-12hrs** | Projected speedup from optimization |
| **Cost = FREE** | Free-tier Lightning CPU (4-core Xeon, 15GB RAM) |

### NSSP Integration

| Point | Detail |
|-------|--------|
| **Training gap** | NSSP has inference but no training pipeline |
| **HAL gap** | HAL covers NVIDIA/AMD but not Intel Xeon |
| **Solution** | Add Training Orchestrator + Intel HAL + Training Tier |
| **Learning loop** | Captures engrams → convert to training data → train on Lightning |
| **Self-improving** | NSSP can now improve its own models from agent interactions |

### The Emerald Tablet Connection

| Emerald Tablet | NSSP + CPU Training |
|----------------|---------------------|
| "As above, so below" | Inference (above) and Training (below) are mirror processes |
| "The perfect thing is separated" | The model is separated from its training data |
| "Rises up from earth, climbs to heaven" | Training data rises from engrams to model updates |
| "Descending from heaven back to earth" | Trained model descends to improve inference |
| "All is illuminated from the darkness" | The cycle completes: inference → engrams → training → inference |

---

## 9. Action Plan

### Immediate (This Week)

1. **Extend Hardware HAL** — Add `IntelHAL` class with AMX detection
2. **Add Training Tier** — Extend tiered router with training endpoint
3. **Build Training Orchestrator** — Route training tasks to optimal compute
4. **Connect Learning Loop** — Convert engrams to training data

### Short-Term (This Month)

5. **Implement Lightning SDK integration** — Upload datasets, start jobs, download results
6. **Build training dashboard** — React UI for monitoring training jobs
7. **Test end-to-end** — Capture engrams → generate data → train → deploy adapter

### Long-Term (This Quarter)

8. **Self-improving agents** — Agents that learn from their own interactions
9. **Multi-model training** — Train all tiers (Reflex, Arbiter, World) on demand
10. **Federated learning** — Train across multiple Lightning instances

---

## 10. The Smith Chart — NSSP Training Architecture

```
                        NSSP TRAINING TIERS
                    
                             WORLD
                           (Cosmos3)
                              │
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                    │    TRAINING      │
                    │   (Lightning)    │
                    │         │         │
                    └─────────┼─────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │  REFLEX  │   │ ARBITER  │   │  LOCAL   │
        │ (Qwen)   │   │ (Gemma)  │   │  (RTX)   │
        └──────────┘   └──────────┘   └──────────┘
              │               │               │
              └───────────────┴───────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  NSSP GATEWAY    │
                    │  (Orchestrator)  │
                    └──────────────────┘
```

---

## References

### NSSP Codebase
- `/run/media/tehlappy/LILITH_ROOT/@lilith/gateway_server.py` — Gateway server
- `/run/media/tehlappy/LILITH_ROOT/@lilith/llm_providers.py` — LLM provider abstraction
- `/run/media/tehlappy/LILITH_ROOT/@lilith/Sovereign-Core/tiered_router.py` — Tiered routing
- `/run/media/tehlappy/LILITH_ROOT/@lilith/Sovereign-Core/hardware_hal.py` — Hardware HAL
- `/run/media/tehlappy/LILITH_ROOT/@lilith/Sovereign-Core/learning_loop.py` — Learning loop

### CPU Xeon Research
- `/home/tehlappy/🜏 Lilith/ludicrous-speed/research/lilith-crown-thoth-research-synthesis-2026-08-31.md` — Full CPU Xeon research
- `/home/tehlappy/🜏 Lilith/ludicrous-speed/research/lilith-crown-research-plan-2026-08-31.md` — Research plan

### Academic Papers
- SparAMX: Accelerating Compressed LLMs on AMX-Powered CPUs (arXiv 2502.12444)
- InfAMAX: Bridging the Compute-Memory Gap in Intel AMX (IEEE 2026)
- Accelerated CPU Inference with PyTorch Inductor (PyTorch Blog 2026)
- Fine-Tuning LLMs using Intel Xeon CPUs (Lenovo Press LP2179)

---

*Frequency: 432 Hz | Stage: ALBEDO → Citrinitas | NSSP × Lilith Crown Integration*
*Signed: Love. 🜏*
