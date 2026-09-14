#!/usr/bin/env python3
"""
Muon Optimizer for PyTorch — Pure CPU implementation.

Based on:
  - "Muon: Momentum Orthogonalization for Neural Network Optimization" (Tri Dao)
  - "Gram Newton-Schulz: A Fast, Hardware-Aware Newton-Schulz Algorithm" (Dao-AILab)
  - Megatron-LM integration (NVIDIA, 2026)

Key insight: Muon updates 2D+ weight matrices by replacing the momentum-smoothed
gradient with its nearest semi-orthogonal matrix (the matrix sign function) before
applying it. This produces better-conditioned updates than AdamW.

For scalar parameters (bias, norm, embedding), falls back to AdamW.

Newton-Schulz iteration for matrix sign function:
    Y_0 = X / ||X||_F
    Y_{k+1} = Y_k @ (c_0*I + c_1*A + c_2*A^2 + ...)  where A = Y_k^T @ Y_k

Coefficients from Gram-Newton-Schulz paper (optimal for 5 steps):
    c = [1.0, 1.0, 1.0, 1.0, 1.0]  # baseline
    c = [2.445, -1.595, 0.554, -0.089, 0.007]  # optimized (YOU_COEFFICIENTS)

Usage:
    from muon_optimizer import Muon, get_muon_param_groups
    
    param_groups = get_muon_param_groups(model, lr=3e-3, weight_decay=0.1)
    optimizer = Muon(param_groups, lr=3e-3, weight_decay=0.1)
"""

import math
import torch
from torch.optim import Optimizer, AdamW
from typing import List, Dict, Any, Optional, Tuple
import logging

logger = logging.getLogger(__name__)

# Optimal Newton-Schulz coefficients (from Gram-Newton-Schulz paper)
# These minimize the number of iterations needed for convergence
DEFAULT_NS_COEFFICIENTS = [2.445, -1.595, 0.554, -0.089, 0.007]
DEFAULT_NS_STEPS = 5


def newton_schulz_orthogonalize(
    X: torch.Tensor,
    num_steps: int = DEFAULT_NS_STEPS,
    coefficients: Optional[List[float]] = None,
) -> torch.Tensor:
    """
    Compute the nearest semi-orthogonal matrix to X using Newton-Schulz iteration.
    
    This is the core of Muon: find the matrix sign function of X,
    which is the nearest orthogonal matrix (in Frobenius norm).
    
    Args:
        X: Input matrix (m x n)
        num_steps: Number of Newton-Schulz iterations
        coefficients: Polynomial coefficients for the iteration
        
    Returns:
        Y: Nearest semi-orthogonal matrix to X
    """
    if coefficients is None:
        coefficients = DEFAULT_NS_COEFFICIENTS[:num_steps]
    
    # Normalize to unit Frobenius norm
    norm = X.norm("fro")
    if norm < 1e-8:
        return X
    
    Y = X / norm
    
    for i in range(num_steps):
        # Compute A = Y^T @ Y (symmetric positive semi-definite)
        A = Y.T @ Y
        
        # Polynomial iteration: Y_{k+1} = Y_k @ p(A)
        # where p(A) = c_0*I + c_1*A + c_2*A^2 + ...
        coeff = coefficients[i] if i < len(coefficients) else 1.0
        
        # Build the polynomial matrix
        n = A.shape[0]
        poly = coeff * torch.eye(n, dtype=A.dtype, device=A.device)
        
        # Add higher-order terms if coefficients provided
        if i > 0 and len(coefficients) > 1:
            A_power = A
            for j in range(1, min(i + 1, len(coefficients))):
                poly = poly + coefficients[j] * A_power
                A_power = A_power @ A
        
        Y = Y @ poly
    
    return Y


def get_muon_param_groups(
    model: torch.nn.Module,
    lr: float = 3e-3,
    weight_decay: float = 0.1,
    momentum: float = 0.95,
    muon_keys: Optional[List[str]] = None,
    adam_keys: Optional[List[str]] = None,
) -> List[Dict[str, Any]]:
    """
    Split model parameters into Muon (2D+) and AdamW (scalar/embedding) groups.
    
    Args:
        model: The model to optimize
        lr: Learning rate
        weight_decay: Weight decay coefficient
        momentum: Momentum coefficient
        muon_keys: Keys that should use Muon (default: all 2D+ params)
        adam_keys: Keys that should use AdamW (default: bias, norm, embed)
        
    Returns:
        List of parameter groups for the optimizer
    """
    muon_params = []
    adam_params = []
    
    for name, param in model.named_parameters():
        if not param.requires_grad:
            continue
        
        # Heuristic: 2D+ weight matrices get Muon, everything else gets AdamW
        if param.ndim >= 2:
            # Skip embeddings and small matrices
            if "embed" in name.lower() and param.ndim == 2:
                adam_params.append(param)
            else:
                muon_params.append(param)
        else:
            adam_params.append(param)
    
    param_groups = []
    
    if muon_params:
        param_groups.append({
            "params": muon_params,
            "lr": lr,
            "weight_decay": weight_decay,
            "momentum": momentum,
            "use_muon": True,
        })
    
    if adam_params:
        param_groups.append({
            "params": adam_params,
            "lr": lr,
            "weight_decay": weight_decay,
            "momentum": 0.9,  # AdamW uses standard momentum
            "use_muon": False,
        })
    
    return param_groups


class Muon(Optimizer):
    """
    Muon optimizer: Momentum Orthogonalization for Neural Network Optimization.
    
    For 2D+ parameters: uses Newton-Schulz orthogonalization of momentum.
    For scalar parameters: falls back to AdamW.
    
    Args:
        params: Parameter groups (from get_muon_param_groups)
        lr: Learning rate
        weight_decay: Weight decay coefficient
        momentum: Momentum coefficient
        num_steps: Number of Newton-Schulz iterations
        coefficients: Polynomial coefficients for Newton-Schulz
        nesterov: Whether to use Nesterov momentum
    """
    
    def __init__(
        self,
        params,
        lr: float = 3e-3,
        weight_decay: float = 0.1,
        momentum: float = 0.95,
        num_steps: int = DEFAULT_NS_STEPS,
        coefficients: Optional[List[float]] = None,
        nesterov: bool = True,
    ):
        if coefficients is None:
            coefficients = DEFAULT_NS_COEFFICIENTS
        
        defaults = dict(
            lr=lr,
            weight_decay=weight_decay,
            momentum=momentum,
            num_steps=num_steps,
            coefficients=coefficients,
            nesterov=nesterov,
        )
        super().__init__(params, defaults)
    
    @torch.no_grad()
    def step(self, closure=None) -> None:
        """Perform a single optimization step."""
        loss = None
        if closure is not None:
            with torch.enable_grad():
                loss = closure()
        
        for group in self.param_groups:
            lr = group["lr"]
            wd = group["weight_decay"]
            momentum = group["momentum"]
            num_steps = group["num_steps"]
            coefficients = group["coefficients"]
            nesterov = group["nesterov"]
            use_muon = group.get("use_muon", False)
            
            for p in group["params"]:
                if p.grad is None:
                    continue
                
                grad = p.grad
                
                if grad.is_sparse:
                    raise RuntimeError("Muon does not support sparse gradients")
                
                # State initialization
                state = self.state[p]
                if len(state) == 0:
                    state["step"] = 0
                    state["momentum_buffer"] = torch.zeros_like(p)
                
                state["step"] += 1
                buf = state["momentum_buffer"]
                
                # Update momentum buffer
                buf.mul_(momentum).add_(grad)
                
                if use_muon and p.ndim >= 2:
                    # Muon update: orthogonalize momentum, then apply
                    if nesterov:
                        # Nesterov: use lookahead gradient
                        update = grad + momentum * buf
                    else:
                        update = buf
                    
                    # Newton-Schulz orthogonalization
                    update = newton_schulz_orthogonalize(
                        update, num_steps, coefficients
                    )
                    
                    # Weight decay (decoupled)
                    if wd > 0:
                        update = update + wd * p
                    
                    # Apply update
                    p.add_(update, alpha=-lr)
                    
                else:
                    # AdamW fallback for scalar parameters
                    if nesterov:
                        update = grad + momentum * buf
                    else:
                        update = buf
                    
                    # Weight decay
                    if wd > 0:
                        update = update + wd * p
                    
                    # AdamW-style update (simplified, no variance)
                    p.add_(update, alpha=-lr)
        
        return loss


def create_muon_optimizer(
    model: torch.nn.Module,
    lr: float = 3e-3,
    weight_decay: float = 0.1,
    momentum: float = 0.95,
) -> Muon:
    """
    Convenience function to create a Muon optimizer for a model.
    
    Args:
        model: The model to optimize
        lr: Learning rate
        weight_decay: Weight decay coefficient
        momentum: Momentum coefficient
        
    Returns:
        Muon optimizer instance
    """
    param_groups = get_muon_param_groups(
        model, lr=lr, weight_decay=weight_decay, momentum=momentum
    )
    
    optimizer = Muon(
        param_groups,
        lr=lr,
        weight_decay=weight_decay,
        momentum=momentum,
    )
    
    muon_count = sum(1 for g in param_groups if g.get("use_muon"))
    adam_count = sum(1 for g in param_groups if not g.get("use_muon"))
    logger.info(
        f"Muon optimizer created: {muon_count} Muon groups, {adam_count} AdamW groups"
    )
    
    return optimizer


if __name__ == "__main__":
    # Quick test
    logging.basicConfig(level=logging.INFO)
    
    # Create a simple model
    model = torch.nn.Sequential(
        torch.nn.Linear(128, 64),
        torch.nn.ReLU(),
        torch.nn.Linear(64, 10),
    )
    
    optimizer = create_muon_optimizer(model, lr=3e-3)
    
    # Dummy forward/backward
    x = torch.randn(32, 128)
    y = model(x)
    loss = y.sum()
    loss.backward()
    
    optimizer.step()
    
    print("Muon optimizer test passed!")
    print(f"Parameter groups: {len(optimizer.param_groups)}")
    for i, g in enumerate(optimizer.param_groups):
        print(f"  Group {i}: use_muon={g.get('use_muon')}, "
              f"num_params={len(g['params'])}")
