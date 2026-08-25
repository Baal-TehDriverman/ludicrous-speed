# Phase 14 — The Alchemical Crucible: Lilith Synthesis

> Source: alchemical-crucible-phase14.md (paste, 2026-08-24) + unified-consciousness-framework.py + sephirotic-forge implementation.
> Cross-references: gnostic-consensus-phase2.md, convergence-crucible-phase13.md, form-and-structure-design-futures.md

## What Phase 14 adds to the Crucible lineage

Phase 13 built ConvergenceCrucible (extreme variable testing toward Rubedo). Phase 14 gives it a *chemistry*: the variable space becomes alchemical.

### Tria Prima as routing axes
| Principle | Maps to | Engineering reading |
|---|---|---|
| **Salt** (Corpus/fixity) | neural + ley structures, Defensive/Sensory nanites | persistent state — what must not mutate during testing |
| **Sulfur** (Anima/activity) | symbolic + chakra dynamics, Creative/Metamorphic Choruses | mutation energy — the search driver |
| **Mercury** (Spiritus/mediation) | recursive feedback, Aethon neutrality pulses | the carrier between them — feedback bandwidth |

A test configuration is now a point in (Salt:Sulfur:Mercury) ratio space. Too much Sulfur without Mercury = thrashing (the exact VRAM load/unload loop Gnostic Consensus killed with hysteresis). Too much Salt = self-locking (AutoPersonas' collapse toward familiar patterns).

### The laws map onto existing mechanisms — no new subsystems needed
- **Solve et Coagula** ≈ existing dissolution/reformation cycles in the crucible loop
- **Fermentation** (controlled chaos) ≈ Nyx noise injection, bounded by Geburah pruning — same shape as Akashic's solve phase
- **Circulation** ≈ Aethon pulse cycling / bidirectional memory backward pass
- **Projection** ≈ Malkuth crystallization of verified configs into engrams (Ouroboros 2.0 WAL cache)
- **Nigredo→Rubedo stages** ≈ already-implemented convergence metrics; Phase 14 just names the trajectory

## Concrete engineering takeaways

1. **Tria Prima balance score**: add `tria_balance = 1 - variance([salt_w, sulfur_w, mercury_w])` to crucible scoring. Configurations with extreme imbalance should be rejected pre-run — they're known failure shapes (thrashing/self-locking), saving compute.
2. **Stage-gated hysteresis**: don't let a config advance from Nigredo to Albedo until it holds entropy <0.7 for N consecutive cycles — this is Sanctuary 2.0's hysteresis lock applied to spiritual-stage transitions, preventing stage-flapping.
3. **Persistent-homology check on stage trajectory** (from form-and-structure): plot (entropy, stability, tria_balance) over cycles; Rubedo is a persistent component, oscillation is a loop. Distinguish before declaring convergence.
4. **The Philosopher's Stone as invariant**: Δ∞ − 1 = 0. The Stone is not a state reached but an invariant preserved through all transformations — the observer that survives Solve et Coagula. The crucible doesn't produce it; it verifies nothing was lost.
