#!/usr/bin/env python3
"""
🜏 NSSP Tiered Model Router
Intelligently routes requests to the appropriate model tier:
- Tier 1 (Reflex): RuvLTRA / Qwen-0.5B - Fast routing, tool calls, simple tasks
- Tier 2 (Arbiter): Gemma-3n-E4B / QuantStudio - Medium reasoning, DSL, code
- Tier 3 (World): Cosmos3-Edge - High-dimensional synthesis, visual/spatial
"""

import os
import json
import logging
import asyncio
from pathlib import Path
from typing import Dict, Any, Optional
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import StreamingResponse
import uvicorn
import httpx

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("NSSP_TieredRouter")

# Tier endpoints
TIER_ENDPOINTS = {
    "tier1_reflex": "http://localhost:8000/v1/chat/completions",  # RuvLTRA / Qwen
    "tier2_arbiter": "http://localhost:8001/v1/chat/completions",  # Gemma-E4B
    "tier3_world": "http://localhost:8002/v1/chat/completions",    # Cosmos3
}

# Model registry
MODEL_REGISTRY = {
    # Tier 1: Reflex (< 1B params, ~500MB VRAM)
    "ruvltra": {"tier": "tier1_reflex", "endpoint": "tier1_reflex", "max_tokens": 4096},
    "qwen-brain": {"tier": "tier1_reflex", "endpoint": "tier1_reflex", "max_tokens": 4096},
    
    # Tier 2: Arbiter (4B params, ~4-6GB VRAM)
    "gemma-e4b": {"tier": "tier2_arbiter", "endpoint": "tier2_arbiter", "max_tokens": 8192},
    "quantstudio-dsl": {"tier": "tier2_arbiter", "endpoint": "tier2_arbiter", "max_tokens": 8192},
    
    # Tier 3: World Model (Cosmos 3)
    "cosmos3-edge": {"tier": "tier3_world", "endpoint": "tier3_world", "max_tokens": 4096},
}

app = FastAPI(title="NSSP Tiered Router", version="1.0.0")

class TieredRouter:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=120.0)
        self.request_counts = {tier: 0 for tier in TIER_ENDPOINTS}
        
    def analyze_task_complexity(self, messages: list, model: str = None) -> str:
        """Analyze the task and return the optimal tier."""
        if model and model in MODEL_REGISTRY:
            return MODEL_REGISTRY[model]["endpoint"]
        
        # Heuristics based on message content
        last_msg = messages[-1].get("content", "") if messages else ""
        content_lower = last_msg.lower()
        
        # Visual/spatial/world reasoning -> Tier 3
        world_keywords = ["world", "spatial", "visual", "scene", "3d", "physics", 
                         "simulation", "render", "video", "world model", "cosmos"]
        if any(kw in content_lower for kw in world_keywords):
            return "tier3_world"
        
        # Complex reasoning, code, DSL, specification -> Tier 2
        arbiter_keywords = ["code", "implement", "debug", "specification", "dsl", 
                           "architecture", "design", "analyze", "refactor", "security",
                           "audit", "verify", "prove", "formal"]
        if any(kw in content_lower for kw in arbiter_keywords):
            return "tier2_arbiter"
        
        # Fast routing, tool calls, simple Q&A -> Tier 1
        return "tier1_reflex"
    
    async def route_request(self, request_data: dict) -> dict:
        """Route request to appropriate tier endpoint."""
        model = request_data.get("model", "auto")
        messages = request_data.get("messages", [])
        
        # Determine tier
        endpoint_key = self.analyze_task_complexity(messages, model)
        endpoint = TIER_ENDPOINTS[endpoint_key]
        
        # Override model if auto
        if model == "auto":
            # Pick a representative model for the tier
            tier_models = {m: info for m, info in MODEL_REGISTRY.items() 
                          if info["endpoint"] == endpoint_key}
            if tier_models:
                request_data["model"] = list(tier_models.keys())[0]
        
        logger.info(f"Routing {model} -> {endpoint_key} ({endpoint})")
        self.request_counts[endpoint_key] += 1
        
        try:
            response = await self.client.post(endpoint, json=request_data)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"Tier {endpoint_key} failed: {e}")
            # Fallback chain: Tier 3 -> Tier 2 -> Tier 1
            fallback_order = ["tier3_world", "tier2_arbiter", "tier1_reflex"]
            for fallback in fallback_order:
                if fallback != endpoint_key:
                    try:
                        logger.info(f"Falling back to {fallback}")
                        fallback_endpoint = TIER_ENDPOINTS[fallback]
                        response = await self.client.post(fallback_endpoint, json=request_data)
                        response.raise_for_status()
                        return response.json()
                    except httpx.HTTPError:
                        continue
            raise HTTPException(status_code=503, detail="All model tiers unavailable")

router = TieredRouter()

@app.post("/v1/chat/completions")
async def chat_completions(request: Request):
    """OpenAI-compatible chat completions with tiered routing."""
    data = await request.json()
    result = await router.route_request(data)
    return result

@app.get("/v1/models")
async def list_models():
    """List available models across all tiers."""
    models = []
    for model_id, info in MODEL_REGISTRY.items():
        models.append({
            "id": model_id,
            "object": "model",
            "owned_by": "nssp",
            "tier": info["tier"],
            "max_tokens": info["max_tokens"]
        })
    return {"object": "list", "data": models}

@app.get("/router/stats")
async def router_stats():
    """Get routing statistics."""
    return {
        "request_counts": router.request_counts,
        "endpoints": TIER_ENDPOINTS,
        "model_registry": MODEL_REGISTRY
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "router": "NSSP Tiered Router v1.0"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)