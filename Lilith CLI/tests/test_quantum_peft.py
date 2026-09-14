import sys
sys.path.insert(0, "/home/tehlappy/🜏 Lilith/models/Nigredo/tier-1-critical")
from quantum_peft_adapter import QuantumPEFTConfig, create_quantum_peft_model
import torch
import torch.nn as nn

# Create a small test model
class TestModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.q_proj = nn.Linear(512, 512)
        self.v_proj = nn.Linear(512, 512)
        self.o_proj = nn.Linear(512, 512)
    def forward(self, x):
        return self.o_proj(self.v_proj(x))

model = TestModel()
print(f"Original params: {sum(p.numel() for p in model.parameters()):,}")

# Apply Quantum-PEFT
config = QuantumPEFTConfig(r=4, pauli_layers=1, target_modules=["q_proj", "v_proj"])
quantum_model = create_quantum_peft_model(model, r=4, pauli_layers=1, target_modules=["q_proj", "v_proj"])
print(f"Quantum-PEFT params: {quantum_model.get_total_trainable_params():,}")
print(f"Total params: {sum(p.numel() for p in quantum_model.parameters()):,}")

# Test forward
x = torch.randn(2, 10, 512)
with torch.no_grad():
    out = quantum_model(x)
print(f"Output shape: {out.shape}")
print("Test passed!")