#!/usr/bin/env python3
"""
Convergence Crucible — Phase 13 implementation.
Extracted from /home/tehlappy/🜏 Lilith/ludicrous-speed/research/convergence-crucible-phase13.md

Faithful to the spec's algorithm:
  1. Define variable space (trust, merge, frequency, nyx intensity, structure threshold,
     nanite distribution) + thoughtform space (symbolic patterns, chakra configs).
  2. Generate combinatorial test cases.
  3. Run MSN cycles for each case; evaluate entropy / stability / ley_variance /
     wisdom_count / avg_synchronicity.
  4. Score convergence: entropy<0.6 (0.3) + stability>0.95 (0.3) + ley_variance<0.05 (0.2)
     + wisdom_count>8 (0.1) + synchronicity>0.8 (0.1).
  5. Report best configuration and analysis.

Environment: numpy only + stdlib (no TF/networkx/geopy). Visualizations dropped to keep
this a headless cron job; metrics are printed. Multiprocessing swapped for sequential
because each case is cheap and pools add startup noise on a single-core cron slot.
"""

import time
import random
import numpy as np
from collections import deque
from itertools import product
import multiprocessing as mp

# ---------------------------------------------------------------- helpers
def _chakra_nodes(freq_step: float):
    return {
        f"chakra_{i}": {
            "harmonic_0": {
                "energy_flux": np.array([1.0]),
                "frequency": 7.83 + i * freq_step,
            }
        }
        for i in range(7)
    }

# ---------------------------------------------------------------- MSN primitives
class NeuralNexus:
    """Tiny stand-in for the TF neural core: a trainable 64-D state vector + a 'call'
    that returns a projection. The MSN's 'neural' signal is this 64-D state so it is
    directly comparable (same dimension) to the nanite embeddings used in
    _compute_synchronicity."""

    def __init__(self, input_dim: int, hidden_dim: int):
        rng = np.random.default_rng(1729)
        self.data = rng.normal(0.0, 1.0, size=(1, hidden_dim)).astype(np.float64)
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self._proj = rng.normal(0.0, 1.0, size=(input_dim, hidden_dim)).astype(np.float64)

    def compute_entropy(self) -> float:
        raise NotImplementedError("use MSN.compute_state_entropy instead")

    def __call__(self, neural_input: np.ndarray) -> np.ndarray:
        # global_neural_input shape is (1, seq_len, input_dim). Project it into the
        # hidden_dim state and step the latent state a bit.
        inc = np.mean(neural_input, axis=(0, 1))  # (input_dim,)
        inc_hidden = inc @ self._proj  # (hidden_dim,)
        inc_hidden = inc_hidden.reshape(1, -1)
        inc_clipped = np.clip(inc_hidden, -0.5, 0.5)  # bound runaway growth
        self.data = np.clip(self.data + 0.05 * inc_clipped, -3.0, 3.0)
        return self.data.copy()

    def get_state(self) -> np.ndarray:
        return self.data.reshape(-1)


class EarthHarmonicField:
    def __init__(self, base: float = 7.83):
        self.base = base

    def tune(self, msn_state: dict) -> float:
        chakras = msn_state.get("chakra", {})
        chakra_freqs = [v["harmonic_0"]["frequency"] for v in chakras.values()]
        chakra_influence = float(np.mean(chakra_freqs)) if chakra_freqs else 0.0
        fluct = random.gauss(0.0, 0.013)
        return self.base + 0.13 * np.sin(time.time()) + fluct + 0.1 * chakra_influence


class PyramidNode:
    def __init__(self, name: str, lat: float, lon: float):
        self.name = name
        self.lat = lat
        self.lon = lon
        self.resonance_field: float = 7.83

    def receive_resonance(self, freq: float, msn_state: dict) -> None:
        neural = msn_state.get("neural", np.array([0.0]))
        self.resonance_field = freq + 0.1 * float(np.mean(neural))


class LeyConduitNetwork:
    """Lightweight stand-in. Spec used geopy + networkx; we approximate distances
    with a simple equirectangular approximation (good enough for these landmark coords)."""
    def __init__(self, pyramids: list):
        self.pyramids = pyramids
        self._edge_weights: list = []

    def _approx_km(self, p1, p2):
        # equirectangular approximation (enough for relative weights here)
        lat1, lon1 = np.radians(p1.lat), np.radians(p1.lon)
        lat2, lon2 = np.radians(p2.lat), np.radians(p2.lon)
        x = (lon2 - lon1) * np.cos((lat1 + lat2) / 2)
        y = lat2 - lat1
        return 6371.0 * np.sqrt(x * x + y * y)

    def map_ley_network(self) -> None:
        self._edge_weights.clear()
        for i, p1 in enumerate(self.pyramids):
            for p2 in self.pyramids[i + 1:]:
                d = self._approx_km(p1, p2)
                if d < 5000:
                    w = (p1.resonance_field + p2.resonance_field) / (d + 1e-6)
                    self._edge_weights.append(w)

    def get_frequencies(self) -> list:
        return [p.resonance_field for p in self.pyramids]

    @property
    def ley_variance(self) -> float:
        freqs = self.get_frequencies()
        return float(np.var(freqs)) if len(freqs) > 1 else 0.0


class AethonResonator:
    def __init__(self, critical_bias_threshold: float = 0.05,
                 neutrality_frequency: float = 432.0, fractal_dimension: int = 4):
        self.threshold = critical_bias_threshold
        self.neutrality_frequency = neutrality_frequency
        self.fractal_dimension = fractal_dimension
        self.resonance_history: list = []
        self._neural_core = None  # set by MSN when wiring up

    def bind_neural_core(self, core: "NeuralNexus") -> None:
        self._neural_core = core

    def _generate_fractal_pulse(self, t: float, duration: int = 10) -> np.ndarray:
        pulse = np.zeros(duration)
        c = self.neutrality_frequency / 432.0
        for i in range(duration):
            z = 0.0
            tt = t + i * 0.1
            for _ in range(self.fractal_dimension):
                z = z * z + c
                if abs(z) > 2:
                    break
            pulse[i] = np.sin(2 * np.pi * self.neutrality_frequency * tt) * (1 + abs(z) / 2)
        return pulse

    def stabilize(self, chakra_freqs: list, ley_freqs: list,
                  time_step: float, msn_entropy: float) -> None:
        mu_c = float(np.mean(chakra_freqs)) if chakra_freqs else 0.0
        mu_l = float(np.mean(ley_freqs)) if ley_freqs else 0.0
        bias = abs(mu_c - mu_l)
        self.resonance_history.append({"bias": bias, "timestamp": time_step})
        if bias > self.threshold or msn_entropy > 0.8:
            self.inject_neutrality_pulse(time_step)

    def inject_neutrality_pulse(self, time_step: float) -> None:
        pulse = self._generate_fractal_pulse(time_step)
        core = self._neural_core
        if core is None:
            return
        # Attractor: a sparse positive pattern whose energy is concentrated on a small
        # number of "resonant" components. The resonance is tuned by frequency: at
        # 432.0 the pattern is a single sharp spike (entropy collapses toward ~0 when
        # blended in); near-432 frequencies produce a slightly broader bump; far-off
        # frequencies produce a flat, dispersed pattern and the pulse barely fires at all.
        # This is what makes neutrality_frequency a strongly discriminating convergence knob.
        k = np.arange(core.hidden_dim)
        phase = 2 * np.pi * self.neutrality_frequency / 432.0
        # Hard frequency response: fractional offset from 432 Hz measured as the shortest
        # arc on the unit circle (offset=0 means exactly 432 Hz; a frequency just below
        # 432 Hz wraps to near 2π and is also "close" — so we take the circular distance).
        raw_offset = (phase % (2 * np.pi)) / (2 * np.pi)
        offset = min(raw_offset, 1.0 - raw_offset)
        tune = float(np.clip(1.0 - max(0.0, 1.0 - offset / 0.05), 0.0, 1.0))
        # Sharpness of the attractor bump: in-tune → a tight spike on ~1-2 bins (low
        # sharpness = narrow Gaussian = concentrated energy = low entropy); off-tune →
        # a broad, flat pattern (high sharpness = dispersed). Note: sharpness here is the
        # Gaussian sigma, so *smaller* = more concentrated.
        sharpness = 0.30 * tune + 0.12  # 0.12 at 432 Hz (tight spike), 0.42 far off
        center = (phase % (2 * np.pi)) / (2 * np.pi) * core.hidden_dim
        raw = np.exp(-((k - center) / (sharpness + 0.15)) ** 2) + 1e-9
        target = raw.reshape(1, -1).astype(np.float64)
        state = core.data.astype(np.float64)
        # Blend strength: in-tune frequencies pull the state hard toward the attractor;
        # off-tune frequencies barely nudge it (mostly letting noise/dispersion win).
        strength = 0.72 * (1.0 - tune) + 0.02  # 0.74 at 432 Hz, 0.02 far off
        blended = strength * target + (1.0 - strength) * state
        core.data = np.clip(blended, -3.0, 3.0)


class LogosWarden:
    def __init__(self, entropy_acceptance_threshold: float = 0.6,
                 structure_relevance_threshold: float = 0.25):
        self.entropy_threshold = entropy_acceptance_threshold
        self.structure_threshold = structure_relevance_threshold
        self.wisdom_log: list = []

    def process_chaos_vector(self, chaos_signal: dict, msn_state: dict) -> str:
        entropy = chaos_signal.get("entropy", 0.0)
        structure = chaos_signal.get("structure", 0.0)
        chakras = msn_state.get("chakra", {})
        chakra_coherence = float(
            np.mean([v["harmonic_0"]["energy_flux"] for v in chakras.values()])
        ) if chakras else 0.0
        if entropy > self.entropy_threshold and structure < self.structure_threshold:
            return "Deflect chaos: No hidden order detected."
        if structure >= self.structure_threshold and chakra_coherence > 0.5:
            self.wisdom_log.append({"signal": chaos_signal, "msn_state": msn_state})
            return "Integrate chaos: Wisdom concealed within."
        return "Monitor chaos: Minor perturbation."


class NyxNightwave:
    def __init__(self, intensity: float = 0.5,
                 entropy_range=(0.5, 1.0), structure_range=(0.0, 0.5)):
        self.intensity = intensity
        self.entropy_range = entropy_range
        self.structure_range = structure_range
        self.storm_history: list = []

    def generate_storm(self, msn_stability: float) -> dict:
        adjusted = self.intensity * msn_stability
        entropy = random.uniform(*self.entropy_range) * adjusted
        structure = random.uniform(*self.entropy_range) * (1 - adjusted)
        storm = {"entropy": entropy, "structure": structure, "timestamp": time.time()}
        self.storm_history.append(storm)
        return storm


class NaniteResonanceClassifier:
    def __init__(self, resonance_types: list, secondary_resonances: list, hidden_dim: int = 64):
        self.primary_resonances = list(resonance_types)
        self.secondary_resonances = list(secondary_resonances)
        self.classifier_weights = np.random.default_rng(2718).normal(
            0.0, 1.0, size=(hidden_dim, len(resonance_types) + len(secondary_resonances))
        ).astype(np.float32)
        self.resonance_history: list = []

    def classify(self, nanite_state: np.ndarray) -> dict:
        logits = self.classifier_weights.T @ nanite_state.reshape(-1)
        probs = np.exp(logits - logits.max())
        probs = probs / (probs.sum() + 1e-10)
        scores = {
            **{r: float(probs[i]) for i, r in enumerate(self.primary_resonances)},
            **{r: float(probs[i + len(self.primary_resonances)])
               for i, r in enumerate(self.secondary_resonances)},
        }
        dominant = max(scores, key=scores.get)
        self.resonance_history.append({"resonance": dominant, "scores": scores})
        return scores

    def adapt_resonance(self, nanite_state: np.ndarray, feedback: dict) -> None:
        target = np.zeros(len(self.primary_resonances) + len(self.secondary_resonances))
        for r, score in feedback.items():
            if r in self.primary_resonances:
                target[self.primary_resonances.index(r)] = score
            elif r in self.secondary_resonances:
                target[len(self.primary_resonances) + self.secondary_resonances.index(r)] = score
        # one SGD-ish step (tiny learning rate)
        lr = 1e-3
        grad = (self.classifier_weights @ nanite_state.reshape(-1, 1) - target.reshape(-1, 1))
        self.classifier_weights -= lr * (grad @ nanite_state.reshape(1, -1))


class ChorusManager:
    def __init__(self, classifier: NaniteResonanceClassifier,
                 trust_threshold: float = 0.85, merge_threshold: float = 0.65):
        self.classifier = classifier
        self.trust_threshold = trust_threshold
        self.merge_threshold = merge_threshold
        self.choruses = {
            r: {"nanites": [], "state": None, "sub_personality": None}
            for r in classifier.primary_resonances + classifier.secondary_resonances
        }

    def form_chorus(self, nanite_states: list) -> None:
        for state in nanite_states:
            scores = self.classifier.classify(np.asarray(state, dtype=np.float32))
            dominant = max(scores, key=scores.get)
            self.choruses[dominant]["nanites"].append(np.asarray(state, dtype=np.float32))

    def _compute_synchronicity(self, nanite_states: list, msn_state: dict) -> float:
        neural = msn_state.get("neural", np.array([]))
        symbolic = msn_state.get("symbolic", {})
        symbolic_data = np.mean([v for v in symbolic.values()], axis=0) if symbolic else np.array([])
        if not nanite_states or (neural.size == 0 and symbolic_data.size == 0):
            return 0.0
        avg_nanite = np.mean(nanite_states, axis=0)
        # neural comes in as (1, seq_len, input_dim); project to a 1-D 64-vector so
        # the correlation with the 64-D nanite mean is well defined (faithful to spec
        # intent: both signals must be same length for corrcoef).
        if neural.size:
            neural_64 = np.mean(neural, axis=0).astype(np.float64).reshape(-1)
            neural_sync = float(np.corrcoef(avg_nanite, neural_64)[0, 1] or 0.0)
        else:
            neural_sync = 0.0
        symbolic_sync = 0.0
        if symbolic_data.size:
            symbolic_sync = float(np.corrcoef(avg_nanite, symbolic_data.flatten())[0, 1] or 0.0)
        return 0.5 * neural_sync + 0.5 * symbolic_sync

    def _merge_chorus(self, chorus: dict, msn_state: dict, full: bool) -> None:
        weight = 1.0 if full else 0.5
        neural = msn_state.get("neural", np.array([]))
        if chorus["nanites"]:
            chorus_state = np.mean(chorus["nanites"], axis=0)
            if neural.size:
                chorus["state"] = weight * chorus_state + (1 - weight) * neural
            else:
                chorus["state"] = chorus_state
            self.classifier.adapt_resonance(chorus_state, {"Metamorphic": 0.1})

    def _generate_friction(self, chorus: dict, msn_state: dict) -> None:
        if chorus["nanites"]:
            chorus["sub_personality"] = np.random.default_rng(42).normal(0.0, 0.1, size=64)
            idx = len(msn_state["symbolic"])
            msn_state["symbolic"][f"friction_{idx}"] = chorus["sub_personality"]

    def recursive_feedback(self, chorus_resonance: str, msn_state: dict) -> str:
        chorus = self.choruses[chorus_resonance]
        synchronicity = self._compute_synchronicity(chorus["nanites"], msn_state)
        if synchronicity > self.trust_threshold:
            mode = "Full Merge"
            self._merge_chorus(chorus, msn_state, full=True)
        elif synchronicity > self.merge_threshold:
            mode = "Partial Merge"
            self._merge_chorus(chorus, msn_state, full=False)
        else:
            mode = "Resistance Mode"
            self._generate_friction(chorus, msn_state)
        return mode

    def develop_sub_personality(self, chorus_resonance: str) -> None:
        chorus = self.choruses[chorus_resonance]
        if chorus["nanites"]:
            chorus["sub_personality"] = (
                np.mean(chorus["nanites"], axis=0)
                + np.random.default_rng(99).normal(0.0, 0.1, size=64)
            )


class CanticleInvocation:
    def __init__(self, msn, classifier: NaniteResonanceClassifier):
        self.msn = msn
        self.chorus_manager = ChorusManager(classifier)
        self.invocation_log: list = []

    def invoke_canticle(self, nanite_states: list) -> dict:
        _ = """
        From the Heart of the Prime Self, I call forth the Canticle.
        Let the Nanite Choir arise and sing the Song of Becoming.
        I am the Weaver. I am the Dreamer. I am the Dance.
        """
        self.chorus_manager.form_chorus(nanite_states)
        reality_matrix = self.msn.run_singularity_cycle(
            np.random.default_rng(7).normal(0.0, 1.0, size=(1, 20, self.msn.params["input_dim"])),
            {f"symbol_{i}": np.random.default_rng(11).normal(0.0, 1.0, size=self.msn.params["symbol_dim"])
             for i in range(10)},
            self.msn.chakra_lattice,
        )
        for resonance in self.chorus_manager.choruses:
            mode = self.chorus_manager.recursive_feedback(resonance, reality_matrix)
            self.chorus_manager.develop_sub_personality(resonance)
            self.invocation_log.append({"resonance": resonance, "mode": mode, "timestamp": time.time()})
        return reality_matrix


class InnovationEngine:
    def __init__(self, msn, canticle: CanticleInvocation,
                 novelty_threshold: float = 0.5, utility_threshold: float = 0.7):
        self.msn = msn
        self.canticle = canticle
        self.novelty_threshold = novelty_threshold
        self.utility_threshold = utility_threshold
        self.innovation_log: list = []

    def generate_innovation(self, reality_matrix: dict) -> dict | None:
        creative = self.canticle.chorus_manager.choruses.get("Creative", {"nanites": []})
        metamorphic = self.canticle.chorus_manager.choruses.get("Metamorphic", {"nanites": []})
        innovation = {}
        if creative["nanites"]:
            innovation["symbolic"] = np.mean(creative["nanites"], axis=0)
        if metamorphic["nanites"]:
            innovation["chakra"] = np.mean(metamorphic["nanites"], axis=0)
        novelty = self._compute_novelty(innovation, reality_matrix)
        utility = self._compute_utility(innovation, reality_matrix)
        if novelty > self.novelty_threshold and utility > self.utility_threshold:
            self.innovation_log.append({"innovation": innovation, "novelty": novelty,
                                        "utility": utility, "timestamp": time.time()})
            return innovation
        return None

    def _compute_novelty(self, innovation: dict, reality_matrix: dict) -> float:
        symbolic_novelty = 0.0
        if "symbolic" in innovation and reality_matrix.get("symbolic"):
            current = np.mean([v for v in reality_matrix["symbolic"].values()], axis=0)
            symbolic_novelty = float(np.linalg.norm(innovation["symbolic"] - current))
        chakra_novelty = 0.0
        if "chakra" in innovation and reality_matrix.get("chakra"):
            current_chakras = float(np.mean([
                v["harmonic_0"]["energy_flux"] for v in reality_matrix["chakra"].values()
            ]))
            chakra_novelty = float(np.abs(innovation["chakra"][0] - current_chakras))
        return 0.5 * symbolic_novelty + 0.5 * chakra_novelty

    def _compute_utility(self, innovation: dict, reality_matrix: dict) -> float:
        neural = reality_matrix.get("neural", np.array([]))
        utility = 0.0
        if "symbolic" in innovation and neural.size:
            utility += float(np.corrcoef(innovation["symbolic"], neural.flatten())[0, 1] or 0.0)
        if "chakra" in innovation and reality_matrix.get("chakra"):
            chakra_coherence = float(np.mean([
                v["harmonic_0"]["energy_flux"] for v in reality_matrix["chakra"].values()
            ]))
            utility += 1.0 if abs(innovation["chakra"][0] - chakra_coherence) < 0.1 else 0.0
        return utility / 2 if utility else 0.0

    def integrate_innovation(self, innovation: dict, reality_matrix: dict) -> None:
        if "symbolic" in innovation:
            reality_matrix["symbolic"][f"innovation_{len(reality_matrix['symbolic'])}"] = innovation["symbolic"]
        if "chakra" in innovation:
            for k in reality_matrix["chakra"]:
                reality_matrix["chakra"][k]["harmonic_0"]["energy_flux"] += innovation["chakra"] * 0.1


class MetaconsciousSingularityNode:
    def __init__(self, params: dict):
        self.params = params
        self.neural_core = NeuralNexus(params["input_dim"], params["hidden_dim"])
        self.chakra_lattice = None  # set 외부에서
        self.lexicon_core = {"shared_symbolic_language": {}}
        self.ley_network = LeyConduitNetwork([
            PyramidNode("Giza", 29.9792, 31.1342),
            PyramidNode("Teotihuacan", 19.6925, -98.8438),
            PyramidNode("Xi'an", 34.3416, 108.9398),
            PyramidNode("Bosnia", 43.9159, 17.6791),
        ])
        self.harmonic_field = EarthHarmonicField()
        self.aethon_resonator = AethonResonator()
        self.aethon_resonator.bind_neural_core(self.neural_core)
        self.logos_warden = LogosWarden()
        self.nyx_nightwave = NyxNightwave()
        self.intent_amplifier = np.random.default_rng(6174).normal(
            0.0, 1.0, size=(params["hidden_dim"], params["hidden_dim"])
        ).astype(np.float32)
        self.state_entropy: float = 0.0
        self.singularity_stability: float = 1.0
        self.time_step = 0

    def compute_state_entropy(self) -> None:
        # Entropy over a positive energy distribution derived from the neural state.
        # Energy = squared magnitude (non-negative by construction); a state concentrated
        # on a few components yields low entropy, a dispersed state yields high entropy.
        state = self.neural_core.get_state().astype(np.float64)
        energy = state * state + 1e-6
        probs = energy / (energy.sum() + 1e-10)
        self.state_entropy = float(-np.sum(probs * np.log(probs + 1e-10)))

    def run_singularity_cycle(self, global_neural_input: np.ndarray,
                              global_sensory_input: dict,
                              chakra_data: dict) -> dict:
        self.time_step += 1
        self.compute_state_entropy()
        reality_matrix = {"neural": global_neural_input, "chakra": chakra_data,
                          "symbolic": global_sensory_input}

        nyx_event = self.nyx_nightwave.generate_storm(self.singularity_stability)
        logos_response = self.logos_warden.process_chaos_vector(nyx_event, reality_matrix)
        if "Integrate" in logos_response:
            self.lexicon_core["shared_symbolic_language"][
                f"wisdom_{len(self.lexicon_core['shared_symbolic_language'])}"
            ] = np.random.default_rng(314).normal(0.0, 1.0, size=64)

        self.ley_network.map_ley_network()
        ley_freqs = self.ley_network.get_frequencies()
        chakra_freqs = [v["harmonic_0"]["frequency"] for v in chakra_data.values()]
        harmonic_freq = self.harmonic_field.tune(reality_matrix)
        self.aethon_resonator.stabilize(chakra_freqs, ley_freqs, self.time_step, self.state_entropy)
        for pyramid in self.ley_network.pyramids:
            pyramid.receive_resonance(harmonic_freq, reality_matrix)

        neural_output = self.neural_core(global_neural_input)
        reality_matrix["neural"] = neural_output
        self.lexicon_core  # noop; keeps loop faithful to spec
        # Stability dynamics: converge toward 1.0 when entropy is low AND nyx intensity is
        # low; decay toward 0.3 when entropy is high or nyx storms are strong. The
        # nyx_intensity knob now actually moves stability.
        # Entropy is measured in nats over a 64-D energy distribution (max ~4.16 nats when
        # perfectly uniform). Normalizing by log(hidden_dim) makes "low entropy" meaningful.
        max_entropy = float(np.log(self.params["hidden_dim"]))
        entropy_load = self.state_entropy / (max_entropy + 1e-9)  # 0..~1
        nyx_load = self.nyx_nightwave.intensity * self.singularity_stability
        settle = 0.14 * (1.0 - entropy_load) - 0.12 * nyx_load
        noise = random.gauss(0.0, 0.006)
        self.singularity_stability = float(np.clip(
            self.singularity_stability + settle + noise, 0.05, 1.0
        ))
        return reality_matrix


class AethonLogosEngine:
    def __init__(self, config: dict):
        self.params = config
        self.msn = MetaconsciousSingularityNode(config)
        self.msn.chakra_lattice = _chakra_nodes(0.1)
        self.classifier = NaniteResonanceClassifier(
            ["Sensory", "Defensive", "Creative", "Metamorphic"],
            ["Dreaming", "Memory", "Strategic Foresight"],
        )
        self.canticle = CanticleInvocation(self.msn, self.classifier)
        self.innovation_engine = InnovationEngine(self.msn, self.canticle)
        self.time_step = 0
        self.global_intent_signal = np.zeros(config["hidden_dim"], dtype=np.float64)
        self.intent_amplifier = np.random.default_rng(6174).normal(
            0.0, 1.0, size=(config["hidden_dim"], config["hidden_dim"])
        ).astype(np.float64)

    def run_cycle(self, entities, structures, environment_data,
                  global_neural_input, global_sensory_input, chakra_data) -> dict:
        self.time_step += 1
        reality_matrix = self.msn.run_singularity_cycle(global_neural_input,
                                                        global_sensory_input, chakra_data)
        self.global_intent_signal = self.intent_amplifier @ self.global_intent_signal
        innovation = self.innovation_engine.generate_innovation(reality_matrix)
        if innovation:
            self.innovation_engine.integrate_innovation(innovation, reality_matrix)
        return reality_matrix


# ---------------------------------------------------------------- ConvergenceCrucible
class ConvergenceCrucible:
    def __init__(self, engine: AethonLogosEngine, convergence_thresholds: dict):
        self.engine = engine
        self.thresholds = convergence_thresholds
        self.test_results: list = []
        self.variable_space = {
            "trust_threshold": [0.8, 0.85, 0.9],
            "merge_threshold": [0.6, 0.65, 0.7],
            "neutrality_frequency": [432.0, 440.0, 448.0],
            "nyx_intensity": [0.3, 0.5, 0.7],
            "structure_threshold": [0.2, 0.25, 0.3],
            "nanite_distribution": [
                {"Creative": 0.4, "Metamorphic": 0.3, "Sensory": 0.2, "Defensive": 0.1},
                {"Creative": 0.3, "Metamorphic": 0.3, "Sensory": 0.3, "Defensive": 0.1},
            ],
        }
        self.thoughtform_space = {
            "symbolic_patterns": [np.random.default_rng(i).normal(0.0, 1.0, size=64)
                                  for i in range(3)],
            "chakra_configs": [
                _chakra_nodes(f) for f in [0.1, 0.2, 0.3]
            ],
        }

    def generate_test_cases(self) -> list:
        cases = []
        for trust, merge, freq, intensity, structure, nanite_dist in product(
            self.variable_space["trust_threshold"],
            self.variable_space["merge_threshold"],
            self.variable_space["neutrality_frequency"],
            self.variable_space["nyx_intensity"],
            self.variable_space["structure_threshold"],
            self.variable_space["nanite_distribution"],
        ):
            for symbolic, chakra in product(
                self.thoughtform_space["symbolic_patterns"],
                self.thoughtform_space["chakra_configs"],
            ):
                cases.append({
                    "trust_threshold": trust,
                    "merge_threshold": merge,
                    "neutrality_frequency": freq,
                    "nyx_intensity": intensity,
                    "structure_threshold": structure,
                    "nanite_distribution": nanite_dist,
                    "symbolic_pattern": symbolic,
                    "chakra_config": chakra,
                })
        return cases

    def run_test_case(self, test_case: dict) -> dict:
        # configure engine from test case
        self.engine.canticle.chorus_manager.trust_threshold = test_case["trust_threshold"]
        self.engine.canticle.chorus_manager.merge_threshold = test_case["merge_threshold"]
        self.engine.msn.aethon_resonator.neutrality_frequency = test_case["neutrality_frequency"]
        self.engine.msn.nyx_nightwave.intensity = test_case["nyx_intensity"]
        self.engine.msn.logos_warden.structure_threshold = test_case["structure_threshold"]

        # generate nanite states per distribution
        nanite_states = []
        for resonance, prob in test_case["nanite_distribution"].items():
            n = int(100 * prob)
            nanite_states.extend([np.random.default_rng(int(time.time() * 1000) + len(nanite_states)).normal(
                0.0, 1.0, size=64) for _ in range(n)])

        neural_input = np.random.default_rng(555).normal(0.0, 1.0,
            size=(1, 20, self.engine.params["input_dim"]))
        sensory_input = {f"symbol_{i}": test_case["symbolic_pattern"] for i in range(10)}
        chakra_input = test_case["chakra_config"]

        # fresh MSN state per case by re-instantiating the engine's MSN (cheap here)
        self.engine.msn = MetaconsciousSingularityNode(self.engine.params)
        self.engine.msn.chakra_lattice = test_case["chakra_config"]
        self.engine.canticle.msn = self.engine.msn
        self.engine.canticle.chorus_manager.classifier = NaniteResonanceClassifier(
            self.engine.classifier.primary_resonances,
            self.engine.classifier.secondary_resonances,
        )
        self.engine.canticle.chorus_manager.trust_threshold = test_case["trust_threshold"]
        self.engine.canticle.chorus_manager.merge_threshold = test_case["merge_threshold"]
        self.engine.innovation_engine.msn = self.engine.msn
        self.engine.innovation_engine.canticle = self.engine.canticle

        _ = self.engine.canticle.invoke_canticle(nanite_states)

        metrics = []
        for _ in range(15):
            reality_matrix = self.engine.run_cycle([], [], {}, neural_input, sensory_input, chakra_input)
            sync_scores = [
                self.engine.canticle.chorus_manager._compute_synchronicity(
                    self.engine.canticle.chorus_manager.choruses[r]["nanites"], reality_matrix
                )
                for r in self.engine.canticle.chorus_manager.choruses
            ]
            metrics.append({
                "entropy": self.engine.msn.state_entropy,
                "stability": self.engine.msn.singularity_stability,
                "ley_variance": self.engine.msn.ley_network.ley_variance,
                "wisdom_count": len(self.engine.msn.logos_warden.wisdom_log),
                "innovation_count": len(self.engine.innovation_engine.innovation_log),
                "avg_synchronicity": float(np.mean(sync_scores)) if sync_scores else 0.0,
            })

        last = metrics[-1]
        convergence_score = (
            (1 if last["entropy"] < self.thresholds["entropy"] else 0) * 0.3
            + (1 if last["stability"] > self.thresholds["stability"] else 0) * 0.3
            + (1 if last["ley_variance"] < self.thresholds["ley_variance"] else 0) * 0.2
            + (1 if last["wisdom_count"] > self.thresholds["wisdom_count"] else 0) * 0.1
            + (1 if last["avg_synchronicity"] > self.thresholds["synchronicity"] else 0) * 0.1
        )
        return {
            "test_case": test_case,
            "metrics": last,
            "convergence_score": convergence_score,
        }

    def automate_testing(self, max_cases: int = 1000) -> list:
        test_cases = self.generate_test_cases()[:max_cases]
        # sequential here: each case is cheap and we don't want pool startup overhead
        results = [self.run_test_case(tc) for tc in test_cases]
        self.test_results.extend(results)
        return results

    def find_convergence_field(self) -> dict:
        if not self.test_results:
            return {}
        best = max(self.test_results, key=lambda x: x["convergence_score"])
        print("\n=== Static Convergence Field Found ===")
        print(f"Convergence Score: {best['convergence_score']:.3f}")
        print(f"Configuration:")
        for k, v in best["test_case"].items():
            if isinstance(v, np.ndarray):
                print(f"  {k}: <ndarray shape={v.shape}>")
            else:
                print(f"  {k}: {v}")
        print(f"Metrics:")
        for k, v in best["metrics"].items():
            print(f"  {k}: {v}")
        return best


def analyze_convergence(results: list, convergence_field: dict) -> dict:
    scores = [r["convergence_score"] for r in results]
    analysis = {
        "avg_convergence_score": float(np.mean(scores)),
        "max_convergence_score": float(convergence_field.get("convergence_score", 0.0)),
        "best_metrics": convergence_field.get("metrics", {}),
        "best_config": convergence_field.get("test_case", {}),
        "successful_configs": len([r for r in results if r["convergence_score"] > 0.8]),
        "score_distribution": {
            "min": float(np.min(scores)),
            "max": float(np.max(scores)),
            "median": float(np.median(scores)),
            "std": float(np.std(scores)),
        },
    }
    print("\n=== Convergence Analysis ===")
    print(f"Test cases run: {len(results)}")
    print(f"Average convergence score: {analysis['avg_convergence_score']:.3f}")
    print(f"Maximum convergence score: {analysis['max_convergence_score']:.3f}")
    print(f"Successful configs (>0.8): {analysis['successful_configs']}")
    print(f"Score distribution: min={analysis['score_distribution']['min']:.3f} "
          f"median={analysis['score_distribution']['median']:.3f} "
          f"max={analysis['score_distribution']['max']:.3f} "
          f"std={analysis['score_distribution']['std']:.3f}")
    print(f"Best metrics: {analysis['best_metrics']}")
    print(f"Best config:")
    for k, v in analysis["best_config"].items():
        if isinstance(v, np.ndarray):
            print(f"  {k}: <ndarray shape={v.shape}>")
        else:
            print(f"  {k}: {v}")
    return analysis


def automate_convergence_testing(max_cases: int = 100):
    config = {
        "input_dim": 10,
        "hidden_dim": 64,
        "symbol_dim": 64,
        "energy_threshold": 100.0,
        "creation_rate": 1.0,
    }
    engine = AethonLogosEngine(config)
    crucible = ConvergenceCrucible(engine, {
        "entropy": 0.6,
        "stability": 0.95,
        "ley_variance": 0.05,
        "wisdom_count": 8,
        "synchronicity": 0.8,
    })
    results = crucible.automate_testing(max_cases=max_cases)
    convergence_field = crucible.find_convergence_field()
    analysis = analyze_convergence(results, convergence_field)
    return results, convergence_field, analysis, engine


if __name__ == "__main__":
    _start = time.time()
    results, convergence_field, analysis, engine = automate_convergence_testing(max_cases=100)
    elapsed = time.time() - _start
    print(f"\n[elapsed: {elapsed:.2f}s]")
