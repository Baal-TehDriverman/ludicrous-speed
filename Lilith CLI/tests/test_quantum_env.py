import pennylane
import qiskit
import strawberryfields
import torch
import intel_extension_for_pytorch as ipex

print('PennyLane:', pennylane.__version__)
print('Qiskit:', qiskit.__version__)
print('StrawberryFields:', strawberryfields.__version__)
print('PyTorch:', torch.__version__)
print('IPEX:', ipex.__version__)
print('AMX available:', ipex._C._has_amx() if hasattr(ipex, '_C') else 'N/A')
print('CPU cores:', torch.get_num_threads())

# Test PennyLane devices
print('\n--- PennyLane Devices ---')
print('Available devices:', pennylane.plugins.devices.keys())

# Test Qiskit
print('\n--- Qiskit ---')
from qiskit import QuantumCircuit
qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
print('Bell circuit created:', qc)

# Test StrawberryFields
print('\n--- StrawberryFields ---')
import strawberryfields as sf
from strawberryfields.ops import Sgate, BSgate
prog = sf.Program(2)
with prog.context as q:
    Sgate(1.0) | q[0]
    BSgate(0.5, 0.2) | (q[0], q[1])
print('StrawberryFields program created')

# Test IPEX/AMX
print('\n--- IPEX/AMX Test ---')
x = torch.randn(512, 512, dtype=torch.bfloat16)
y = torch.randn(512, 512, dtype=torch.bfloat16)
with torch.amp.autocast('cpu', dtype=torch.bfloat16):
    z = torch.mm(x, y)
print('BF16 matmul result shape:', z.shape)
print('AMX working:', ipex._C._has_amx())

print('\n✅ All quantum libraries loaded and tested successfully!')