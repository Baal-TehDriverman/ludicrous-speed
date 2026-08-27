#!/usr/bin/env python3
"""
🜏 NSSP Hardware Abstraction Layer (HAL)
Unified interface for AMD and NVIDIA GPU telemetry, optimization, and control.
Integrates Radeon Developer Tool Suite and Nvidia Gratitude Driver.
"""

import json
import subprocess
import logging
from pathlib import Path
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, asdict
from enum import Enum

logger = logging.getLogger("NSSP_HAL")

class Vendor(Enum):
    NVIDIA = "nvidia"
    AMD = "amd"
    INTEL = "intel"
    UNKNOWN = "unknown"

@dataclass
class GPUInfo:
    vendor: Vendor
    name: str
    vram_total_mb: int
    vram_used_mb: int
    gpu_utilization: float
    memory_utilization: float
    temperature_c: int
    power_draw_w: float
    power_limit_w: float
    driver_version: str

@dataclass
class OptimizationProfile:
    name: str
    description: str
    target_workload: str
    settings: Dict[str, Any]

class NvidiaHAL:
    """NVIDIA Hardware Abstraction using nvidia-smi and Nvidia Gratitude Driver."""
    
    def __init__(self):
        self.gratitude_driver_path = Path("/home/tehlappy/🜏 Lilith/NemoClaw/agents/Cosmos/cosmos-main/Quantized/nssp/Nvidia/nvidia-gratitude-driver")
        self.status_file = self.gratitude_driver_path / "runtime/nvidia_gratitude_driver/status.json"
        
    def get_gpu_info(self) -> Optional[GPUInfo]:
        """Get GPU info via nvidia-smi."""
        try:
            result = subprocess.run([
                "nvidia-smi",
                "--query-gpu=name,memory.total,memory.used,utilization.gpu,utilization.memory,temperature.gpu,power.draw,power.limit,driver_version",
                "--format=csv,noheader,nounits"
            ], capture_output=True, text=True, timeout=5)
            
            if result.returncode != 0:
                return None
                
            parts = result.stdout.strip().split(", ")
            return GPUInfo(
                vendor=Vendor.NVIDIA,
                name=parts[0].strip(),
                vram_total_mb=int(parts[1]),
                vram_used_mb=int(parts[2]),
                gpu_utilization=float(parts[3]),
                memory_utilization=float(parts[4]),
                temperature_c=int(parts[5]),
                power_draw_w=float(parts[6]),
                power_limit_w=float(parts[7]),
                driver_version=parts[8].strip()
            )
        except Exception as e:
            logger.error(f"NVIDIA GPU info error: {e}")
            return None
    
    def get_gratitude_status(self) -> Dict[str, Any]:
        """Read Nvidia Gratitude Driver status for routing decisions."""
        try:
            if self.status_file.exists():
                with open(self.status_file) as f:
                    return json.load(f)
        except Exception as e:
            logger.error(f"Gratitude driver status error: {e}")
        return {"route": "UNKNOWN", "cooldown_active": False}
    
    def should_use_local_inference(self) -> bool:
        """Check if local inference is allowed per gratitude driver."""
        status = self.get_gratitude_status()
        route = status.get("route", "CLOUD_CORTEX")
        cooldown = status.get("cooldown_active", False)
        
        if route == "LOCAL_CEREBELLUM":
            return True
        elif route == "HYBRID":
            return True  # Allow intent parsing
        elif route == "CLOUD_CORTEX" and cooldown:
            return False
        return True  # Default allow

class AMDHAL:
    """AMD Hardware Abstraction using Radeon Developer Tool Suite."""
    
    def __init__(self):
        self.radeon_path = Path("/home/tehlappy/🜏 Lilith/NemoClaw/agents/Cosmos/cosmos-main/Quantized/nssp/AMD/RadeonDeveloperToolSuite-2026-05-28-1806")
        self.rgp = self.radeon_path / "RadeonGPUProfiler"
        self.rgd = self.radeon_path / "RadeonDeveloperPanelCLI"
        self.rga = self.radeon_path / "rga"
        self.rmv = self.radeon_path / "RadeonMemoryVisualizer"
        
    def get_gpu_info(self) -> Optional[GPUInfo]:
        """Get AMD GPU info via rocm-smi or radeontop."""
        try:
            # Try rocm-smi first
            result = subprocess.run([
                "rocm-smi", "--showproductname", "--showmeminfo", "vram",
                "--showuse", "--showtemp", "--showpower"
            ], capture_output=True, text=True, timeout=5)
            
            if result.returncode == 0:
                # Parse rocm-smi output
                return self._parse_rocm_smi(result.stdout)
        except FileNotFoundError:
            pass
            
        try:
            # Fallback to radeontop
            result = subprocess.run(["radeontop", "-d", "-", "-l", "1"], 
                                  capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                return self._parse_radeontop(result.stdout)
        except FileNotFoundError:
            pass
            
        return None
    
    def _parse_rocm_smi(self, output: str) -> GPUInfo:
        """Parse rocm-smi output into GPUInfo."""
        lines = output.strip().split('\n')
        data = {}
        for line in lines:
            if ':' in line:
                key, val = line.split(':', 1)
                data[key.strip().lower()] = val.strip()
        
        return GPUInfo(
            vendor=Vendor.AMD,
            name=data.get('card series', 'AMD GPU'),
            vram_total_mb=int(data.get('vram total', '0').replace('MB', '').strip()) if 'vram total' in data else 0,
            vram_used_mb=int(data.get('vram used', '0').replace('MB', '').strip()) if 'vram used' in data else 0,
            gpu_utilization=float(data.get('gpu use', '0').replace('%', '').strip()) if 'gpu use' in data else 0.0,
            memory_utilization=0.0,
            temperature_c=int(float(data.get('temperature', '0').replace('C', '').strip())) if 'temperature' in data else 0,
            power_draw_w=float(data.get('power', '0').replace('W', '').strip()) if 'power' in data else 0.0,
            power_limit_w=0.0,
            driver_version=data.get('driver version', 'unknown')
        )
    
    def _parse_radeontop(self, output: str) -> GPUInfo:
        """Parse radeontop output."""
        # Simplified parsing
        return GPUInfo(
            vendor=Vendor.AMD,
            name="AMD GPU (radeontop)",
            vram_total_mb=0,
            vram_used_mb=0,
            gpu_utilization=0.0,
            memory_utilization=0.0,
            temperature_c=0,
            power_draw_w=0.0,
            power_limit_w=0.0,
            driver_version="unknown"
        )
    
    def profile_shader(self, shader_path: str) -> Dict[str, Any]:
        """Profile a shader using RGA (Radeon GPU Analyzer)."""
        try:
            result = subprocess.run([
                str(self.rga), "-s", shader_path, "-a", "gfx1030"
            ], capture_output=True, text=True, timeout=30)
            return {"success": result.returncode == 0, "output": result.stdout}
        except Exception as e:
            return {"success": False, "error": str(e)}

class HardwareAbstractionLayer:
    """Main HAL class providing unified interface for all GPU vendors."""
    
    def __init__(self):
        self.nvidia = NvidiaHAL()
        self.amd = AMDHAL()
        self._detected_gpus: List[GPUInfo] = []
        
    def detect_gpus(self) -> List[GPUInfo]:
        """Detect all available GPUs."""
        self._detected_gpus = []
        
        nvidia_info = self.nvidia.get_gpu_info()
        if nvidia_info:
            self._detected_gpus.append(nvidia_info)
            
        amd_info = self.amd.get_gpu_info()
        if amd_info:
            self._detected_gpus.append(amd_info)
            
        return self._detected_gpus
    
    def get_primary_gpu(self) -> Optional[GPUInfo]:
        """Get the primary GPU (prefer NVIDIA for CUDA workloads)."""
        if not self._detected_gpus:
            self.detect_gpus()
            
        # Prefer NVIDIA for AI/ML workloads
        for gpu in self._detected_gpus:
            if gpu.vendor == Vendor.NVIDIA:
                return gpu
        return self._detected_gpus[0] if self._detected_gpus else None
    
    def can_run_local_inference(self, model_vram_mb: int = 6000) -> Dict[str, Any]:
        """Check if local inference is feasible and allowed."""
        gpu = self.get_primary_gpu()
        if not gpu:
            return {"allowed": False, "reason": "No GPU detected"}
            
        vram_free = gpu.vram_total_mb - gpu.vram_used_mb
        
        # Check VRAM
        if vram_free < model_vram_mb:
            return {
                "allowed": False, 
                "reason": f"Insufficient VRAM: {vram_free}MB free, {model_vram_mb}MB required",
                "vram_free_mb": vram_free
            }
            
        # Check Nvidia Gratitude Driver routing
        if gpu.vendor == Vendor.NVIDIA:
            if not self.nvidia.should_use_local_inference():
                status = self.nvidia.get_gratitude_status()
                return {
                    "allowed": False,
                    "reason": f"Gratitude driver routes to {status.get('route', 'CLOUD_CORTEX')}",
                    "route": status.get('route'),
                    "cooldown": status.get('cooldown_active')
                }
                
        return {
            "allowed": True,
            "vram_free_mb": vram_free,
            "gpu": asdict(gpu)
        }
    
    def get_optimization_recommendations(self, workload: str) -> List[OptimizationProfile]:
        """Get optimization profiles for specific workload."""
        profiles = []
        
        gpu = self.get_primary_gpu()
        if not gpu:
            return profiles
            
        if gpu.vendor == Vendor.NVIDIA:
            profiles.append(OptimizationProfile(
                name="nvidia-ai-inference",
                description="Optimized for local LLM inference (Cosmos 3 Quantized)",
                target_workload="ai_inference",
                settings={
                    "power_limit_percent": 90,
                    "compute_mode": "exclusive_process",
                    "persistence_mode": True,
                    "clock_boost": True
                }
            ))
            
        elif gpu.vendor == Vendor.AMD:
            profiles.append(OptimizationProfile(
                name="amd-ai-inference",
                description="Optimized for ROCm-based inference",
                target_workload="ai_inference",
                settings={
                    "power_profile": "high",
                    "sclk_frequency": "max",
                    "mclk_frequency": "max"
                }
            ))
            
        return profiles
    
    def apply_optimization(self, profile: OptimizationProfile) -> bool:
        """Apply an optimization profile."""
        gpu = self.get_primary_gpu()
        if not gpu:
            return False
            
        try:
            if gpu.vendor == Vendor.NVIDIA:
                # Use nvidia-smi for power limit
                if "power_limit_percent" in profile.settings:
                    limit = int(gpu.power_limit_w * profile.settings["power_limit_percent"] / 100)
                    subprocess.run(["nvidia-smi", "-pl", str(limit)], check=True)
                    
                if profile.settings.get("persistence_mode"):
                    subprocess.run(["nvidia-smi", "-pm", "1"], check=True)
                    
                if profile.settings.get("compute_mode") == "exclusive_process":
                    subprocess.run(["nvidia-smi", "-c", "3"], check=True)  # EXCLUSIVE_PROCESS
                    
            elif gpu.vendor == Vendor.AMD:
                # AMD power profile via rocm-smi or sysfs
                if "power_profile" in profile.settings:
                    profile_path = f"/sys/class/drm/card0/device/power_dpm_force_performance_level"
                    with open(profile_path, 'w') as f:
                        f.write(profile.settings["power_profile"])
                        
            return True
        except Exception as e:
            logger.error(f"Failed to apply optimization: {e}")
            return False

# Singleton instance
hal = HardwareAbstractionLayer()