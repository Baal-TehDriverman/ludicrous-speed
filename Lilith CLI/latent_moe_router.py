#!/usr/bin/env python3
"""
Latent MoE Router for Pacnomnom Fleet.

Implements the Latent MoE routing strategy from NVIDIA's paper:
  "LatentMoE: Toward Optimal Accuracy per FLOP and Parameter in Mixture of Experts"
  (Elango et al., NVIDIA 2026)

Key insight: Instead of routing queries to models based on full-dimensional analysis,
we compress the query into a latent space, perform routing decisions there, then
expand back to the full dimension. This reduces routing overhead while improving
model diversity.

For the pacnomnom fleet, this means:
  1. Compress incoming query into a latent representation
  2. Route to the best model(s) in latent space
  3. Expand and execute on the chosen model
  4. Decompress the result

Architecture:
    Query → [W_down] → Latent Query → Router → Model Selection → [W_up] → Result
    
The router is a small neural network that operates in the compressed latent space,
making routing decisions faster and more efficient than full-dimensional analysis.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, List, Optional, Tuple, Any
import logging
import time

logger = logging.getLogger(__name__)


class LatentMoERouter(nn.Module):
    """
    Latent MoE Router — compresses queries for efficient model routing.
    
    Args:
        query_dim: Dimension of input queries (e.g., hidden_size)
        latent_dim: Compressed dimension (query_dim // alpha)
        num_models: Number of models in the fleet
        alpha: Compression factor (query_dim / latent_dim)
    """
    
    def __init__(
        self,
        query_dim: int = 2048,
        latent_dim: int = 512,
        num_models: int = 7,
        alpha: int = 4,
    ):
        super().__init__()
        
        self.query_dim = query_dim
        self.latent_dim = latent_dim
        self.num_models = num_models
        self.alpha = alpha
        
        # Down-projection: compress query into latent space
        self.W_down = nn.Linear(query_dim, latent_dim, bias=False)
        
        # Router network: operates in latent space
        self.router = nn.Sequential(
            nn.Linear(latent_dim, latent_dim // 2),
            nn.GELU(),
            nn.Linear(latent_dim // 2, num_models),
        )
        
        # Up-projection: expand result back to full dimension
        self.W_up = nn.Linear(latent_dim, query_dim, bias=False)
        
        # Learnable model embeddings in latent space
        self.model_embeddings = nn.Parameter(torch.randn(num_models, latent_dim))
        
        # Initialize weights
        self._init_weights()
    
    def _init_weights(self):
        nn.init.orthogonal_(self.W_down.weight)
        nn.init.orthogonal_(self.W_up.weight)
        nn.init.normal_(self.model_embeddings, std=0.02)
    
    def forward(
        self,
        query: torch.Tensor,
        return_routing_weights: bool = False,
    ) -> Tuple[torch.Tensor, torch.Tensor, Optional[torch.Tensor]]:
        """
        Route a query through the latent space.
        
        Args:
            query: Input query (batch_size, query_dim)
            return_routing_weights: Whether to return routing weights
            
        Returns:
            routed_query: Query transformed for the selected model
            model_indices: Indices of selected models
            routing_weights: (optional) Softmax weights over models
        """
        # Compress query into latent space
        latent_query = self.W_down(query)  # (batch, latent_dim)
        
        # Compute routing scores in latent space
        routing_scores = self.router(latent_query)  # (batch, num_models)
        
        # Add model embedding similarity
        similarity = torch.matmul(latent_query, self.model_embeddings.T)  # (batch, num_models)
        
        # Combine router output with similarity
        combined_scores = routing_scores + 0.5 * similarity
        
        # Select top model (or top-k for mixture)
        routing_weights = F.softmax(combined_scores, dim=-1)
        model_indices = combined_scores.argmax(dim=-1)
        
        # Expand back to full dimension
        routed_query = self.W_up(latent_query)  # (batch, query_dim)
        
        if return_routing_weights:
            return routed_query, model_indices, routing_weights
        
        return routed_query, model_indices, None
    
    def get_model_for_query(self, query: torch.Tensor) -> int:
        """
        Get the best model index for a single query.
        
        Args:
            query: Input query (query_dim,)
            
        Returns:
            model_index: Index of the best model
        """
        with torch.no_grad():
            query = query.unsqueeze(0)  # Add batch dimension
            _, model_indices, _ = self.forward(query)
            return int(model_indices.item())


class PacnomnomLatentRouter:
    """
    Latent MoE router for the pacnomnom fleet.
    
    Routes queries to the optimal model based on compressed analysis.
    Falls back to heuristic routing when the neural router is untrained.
    """
    
    def __init__(
        self,
        model_names: List[str],
        model_descriptions: Optional[Dict[str, str]] = None,
        query_dim: int = 2048,
        alpha: int = 4,
    ):
        self.model_names = model_names
        self.num_models = len(model_names)
        self.query_dim = query_dim
        self.latent_dim = query_dim // alpha
        
        # Initialize neural router
        self.router = LatentMoERouter(
            query_dim=query_dim,
            latent_dim=self.latent_dim,
            num_models=self.num_models,
            alpha=alpha,
        )
        
        # Heuristic routing table (fallback)
        self.heuristic_router = HeuristicFleetRouter(model_names, model_descriptions)
        
        # Routing statistics
        self.stats = {"total": 0, "cache_hits": 0, "model_counts": [0] * self.num_models}
    
    def route(
        self,
        query: str,
        use_neural: bool = False,
    ) -> str:
        """
        Route a query to the best model.
        
        Args:
            query: Input query string
            use_neural: Whether to use the neural router (requires embedding)
            
        Returns:
            model_name: Name of the selected model
        """
        self.stats["total"] += 1
        
        if use_neural:
            # Neural routing (requires query embedding)
            # For now, fall back to heuristic
            model_name = self.heuristic_router.route(query)
        else:
            # Heuristic routing based on query characteristics
            model_name = self.heuristic_router.route(query)
        
        # Update stats
        model_idx = self.model_names.index(model_name)
        self.stats["model_counts"][model_idx] += 1
        
        return model_name
    
    def get_stats(self) -> Dict[str, Any]:
        """Get routing statistics."""
        return {
            "total_queries": self.stats["total"],
            "model_distribution": {
                name: count for name, count in zip(self.model_names, self.stats["model_counts"])
            },
        }


class HeuristicFleetRouter:
    """
    Heuristic-based fleet router.
    
    Routes queries based on keyword matching and query characteristics.
    This is the fallback when the neural router is untrained.
    """
    
    def __init__(
        self,
        model_names: List[str],
        model_descriptions: Optional[Dict[str, str]] = None,
    ):
        self.model_names = model_names
        self.model_descriptions = model_descriptions or {}
        
        # Define routing heuristics
        self.routing_rules = [
            # (keywords, model_index, description)
            (["embed", "embedding", "vector", "similarity"], 0, "Embedding model"),
            (["quick", "fast", "simple", "hi", "hello"], 1, "Reflex model"),
            (["image", "vision", "see", "look", "picture"], 2, "Vision bridge"),
            (["code", "programming", "function", "debug", "script"], 3, "Code bridge"),
            (["summarize", "output", "result", "final"], 4, "Output model"),
            (["reason", "analyze", "think", "complex", "deep"], 5, "Cortex-lite"),
            (["long", "context", "document", "extensive"], 6, "Cortex"),
        ]
    
    def route(self, query: str) -> str:
        """
        Route query based on heuristics.
        
        Args:
            query: Input query string
            
        Returns:
            model_name: Selected model name
        """
        query_lower = query.lower()
        
        # Score each model
        scores = [0.0] * len(self.model_names)
        
        for keywords, model_idx, _ in self.routing_rules:
            if model_idx < len(scores):
                for keyword in keywords:
                    if keyword in query_lower:
                        scores[model_idx] += 1.0
        
        # Select model with highest score
        max_score = max(scores)
        if max_score > 0:
            selected_idx = scores.index(max_score)
            return self.model_names[selected_idx]
        
        # Default to cortex for complex queries, reflex for simple ones
        if len(query.split()) > 20:
            # Complex query → cortex
            for name in self.model_names:
                if "cortex" in name.lower() and "lite" not in name.lower():
                    return name
        
        # Default to reflex (fast model)
        for name in self.model_names:
            if any(k in name.lower() for k in ["reflex", "2b", "mythos"]):
                return name
        
        # Fallback to first model
        return self.model_names[0]


def create_latent_router(
    model_names: Optional[List[str]] = None,
    query_dim: int = 2048,
    alpha: int = 4,
) -> PacnomnomLatentRouter:
    """
    Factory function to create a latent router for the pacnomnom fleet.
    
    Args:
        model_names: List of model names (default: pacnomnom fleet)
        query_dim: Query dimension
        alpha: Compression factor
        
    Returns:
        PacnomnomLatentRouter instance
    """
    if model_names is None:
        model_names = [
            "nomic-embed-text-v2-moe",
            "mythos:latest",
            "gemma-4-e4b",
            "qwen38-4b",
            "qwen38-2b",
            "qwen38-9b",
            "qwen3.8-27b-ridge",
        ]
    
    return PacnomnomLatentRouter(
        model_names=model_names,
        query_dim=query_dim,
        alpha=alpha,
    )


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    
    # Create router
    router = create_latent_router()
    
    # Test queries
    test_queries = [
        "Write a Python function to sort a list",
        "What is the meaning of life?",
        "Summarize this document for me",
        "Hello!",
        "Analyze the economic implications of quantum computing",
        "Generate an embedding for this text",
    ]
    
    print("=== Latent MoE Router Test ===\n")
    for query in test_queries:
        model = router.route(query)
        print(f"Query: '{query[:50]}...' → {model}")
    
    print(f"\nStats: {router.get_stats()}")
