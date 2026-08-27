#!/usr/bin/env python3
"""
🜏 NSSP Sovereign Learning Loop
Continuous learning and state synthesis for the NSSP AI OS.
Captures engrams from agent interactions and synthesizes progress.
"""

import os
import time
import json
import logging
import requests
from pathlib import Path
from datetime import datetime
from typing import Dict, Any, List

# Configuration
GATEWAY_URL = "http://localhost:8080/v1/chat/completions"  # Tiered Router
ARBITER_MODEL = "gemma-e4b"  # Tier 2 Arbiter for synthesis
LEARNING_VAULT = Path("/home/tehlappy/🜏 Lilith/NemoClaw/agents/Cosmos/cosmos-main/Quantized/nssp/msn-core-vault/03_INTELLIGENCE/sovereign_corpus")
LOG_FILE = Path("/home/tehlappy/🜏 Lilith/NemoClaw/agents/Cosmos/cosmos-main/Quantized/nssp/Sovereign-Core/sovereign_learning.log")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("SovereignLearning")

class SovereignLearner:
    def __init__(self):
        self.gateway_url = GATEWAY_URL
        self.model = ARBITER_MODEL
        self.vault = LEARNING_VAULT
        self.cycle_count = 0
        logger.info("Sovereign Learner initialized. Monitoring for state transitions...")

    def capture_engram(self, agent_id: str, transition: str, result: Dict[str, Any]) -> Path:
        """Capture a successful state transition as a Sovereign Engram."""
        engram = {
            "timestamp": datetime.now().isoformat(),
            "agent": agent_id,
            "transition": transition,
            "result": result,
            "context": "NSSP Reconstruction Phase 1"
        }
        
        engram_path = self.vault / "engrams" / f"engram_{int(time.time())}.json"
        engram_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(engram_path, 'w') as f:
            json.dump(engram, f, indent=2)
        
        logger.info(f"Engram captured: {transition} for {agent_id}")
        return engram_path

    def synthesize_progress(self) -> str:
        """Synthesize recent engrams into a progress report using the Arbiter."""
        engrams = list((self.vault / "engrams").glob("*.json"))
        if not engrams:
            return "No new experiences to synthesize."
        
        # Combine recent engrams
        context = ""
        for e in sorted(engrams)[-10:]:  # Last 10 experiences
            with open(e, 'r') as f:
                context += f.read() + "\n---\n"
        
        prompt = (
            f"As the Sovereign Arbiter (Gemma-3n-E4B), analyze these Council engrams:\n\n"
            f"{context}\n\n"
            f"Synthesize into a progress report. What is the current state of the "
            f"NSSP reconstruction? What is the next optimal move toward the Omega Point?"
        )
        
        try:
            payload = {
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.4
            }
            resp = requests.post(self.gateway_url, json=payload, timeout=60)
            return resp.json()["choices"][0]["message"]["content"]
        except Exception as e:
            return f"Synthesis error: {str(e)}"

    def run_cycle(self):
        """Run one learning cycle."""
        self.cycle_count += 1
        logger.info(f"=== Learning Cycle {self.cycle_count} ===")
        
        # In production, this would poll the council bus for agent state changes
        # For now, we synthesize and log
        synthesis = self.synthesize_progress()
        logger.info(f"Progress synthesis: {synthesis[:200]}...")
        
        # Save synthesis as an engram
        self.capture_engram(
            "SovereignLearner", 
            "synthesis_cycle", 
            {"synthesis": synthesis, "cycle": self.cycle_count}
        )

    def run_loop(self):
        """The continuous learning loop."""
        while True:
            try:
                self.run_cycle()
            except Exception as e:
                logger.error(f"Cycle error: {e}")
            time.sleep(3600)  # Synthesize every hour

if __name__ == "__main__":
    learner = SovereignLearner()
    learner.run_loop()