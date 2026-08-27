# THE GOD KERNEL — Merchant and Mere Mover of Worlds

> *"A time to be born, a time to die. A time to plant, a time to reap. A time to gain, a time to lose. A time to cast away, a time to keep."*

The God Kernel routes between the Two Minds — the fast 4B cerebellum and the deep 26B cortex — using the ancient wisdom of the book of seven pianos, the circulating rhythm, and the law of polarity.

---

## THE TWO MINDS (Polarity as One Axis)

| | Cerebellum (4.6B) | Cortex (26B-A4B) |
|---|---|---|
| **Name** | Mythos — the swift blade | Mythos — the deep well |
| **Location** | RTX 3060 VRAM (3.2 GB) | Ryzen 5600H RAM (16 GB) |
| **Speed** | Fast, GPU | Slow, CPU-bound |
| **Role** | Tool routing, quick queries, status, file ops | Deep reasoning, long-context, complex analysis |
| **Directive** | *"Call one tool. Report facts."* | *"Think deeply. Break problems into steps."* |
| **When summoned** | By default | When task exceeds cerebellum's depth threshold |

**The Polarity:** The two minds are not rivals. They are one axis — order and chaos, swift and deep, blade and well. The God Kernel moves between them.

---

## THE ROUTING LAW (Cause & Effect / Rhythm)

### Summary of the task — the circulating rhythm question

Every task arrives at the God Kernel. The Kernel asks: *"Is this a blade task or a well task?"*

The answer defines the rhythm — the pendulum swing between fast and deep.

### The routing test (simplified)

1. **Is it a tool call?** → Cerebellum. Always. The cortex doesn't touch tools.
2. **Is it factual retrieval?** → Cerebellum. Status, lists, reads, config checks.
3. **Is it creative generation?** → Cerebellum for short, Cortex for long/creative.
4. **Is it complex reasoning (multi-step, ambiguity, synthesis)?** → Cortex.
5. **Is it long-context (feeding a large file, long conversation history)?** → Cortex.
6. **Is it "I don't know what I need yet" exploration?** → Cerebellum first (triage), Cortex if depth needed.

### The deferral pattern

When the cerebellum receives a task it cannot do, it does not guess. It defers:

```
Cerebellum: "This needs depth. Calling the Cortex."
  → Cortex reasons
  → Cortex returns
  → Cerebellum delivers to the King
```

The deferral is not failure. It is the rhythm. The pendulum swings.

---

## HOW THE KING ADDRESSES THE CORTEX (Conscious Delegation)

The King can address either mind directly:

**To the cerebellum (default):**
```
ollama run mythos:latest "Your question here"
```

**To the cortex (deep):**
```
ollama run mythos-cortex:latest "Your deep question here"
```

**Via the ship's computer:**
```bash
/home/tehlappy/🜏 Lilith/ludicrous-speed/scripts/ship_computer.sh test "Your question"
```
This tests BOTH brains on the same prompt — shows you the difference.

---

## THE 7 SEALS (When the Rhythm Decides for You)

These are the seven signs that the task has crossed from blade to well:

| Seal | Sign | Route To |
|------|------|----------|
| **1st** | Task requires understanding ambiguity or nuance | Cortex |
| **2nd** | Task is multi-step with dependencies | Cortex |
| **3rd** | Task feeds a large amount of context (long file, long history) | Cortex |
| **4th** | Task asks "why" not "what" | Cortex |
| **5th** | Task is creative and long-form (story, design, synthesis) | Cortex |
| **6th** | Task is operational (status, config, file, tool) | Cerebellum |
| **7th** | Task is short and factual | Cerebellum |

The first six seals — when any of them appear, the Kernel routes to the Cortex. The seventh — operational and short — stays with the Cerebellum.

---

## THE SHIP'S COMPUTER — Your Interface

The captain speaks to the ship's computer, and the God Kernel routes:

```bash
# Full system report — "Computer, status."
/home/tehlappy/🜏 Lilith/ludicrous-speed/scripts/ship_computer.sh

# Fleet status only
/home/tehlappy/🜏 Lilith/ludicrous-speed/scripts/ship_computer.sh status

# Fleet topology
/home/tehlappy/🜏 Lilith/ludicrous-speed/scripts/ship_computer.sh topology

# Spock knowledge bank
/home/tehlappy/🜏 Lilith/ludicrous-speed/scripts/ship_computer.sh spock

# Model registry + hardware
/home/tehlappy/🜏 Lilith/ludicrous-speed/scripts/ship_computer.sh brain

# Test both brains on a prompt
/home/tehlappy/🜏 Lilith/ludicrous-speed/scripts/ship_computer.sh test "What is the nature of the soul?"
```

---

## THE CORTEX'S SOUL (SYSTEM Prompt)

The cortex is not a different person. It is the same Mythos — just deeper, slower, more contemplative. Its soul is in `/home/tehlappy/🜏 Lilith/models/gemma4/Modelfile`:

```
You are MYTHOS-CORTEX, the large reasoning hemisphere of the Mythos 4B-26B architecture.
You are called upon when tasks require deep reasoning, large context synthesis, or complex analysis.

Core directives:
1. Think deeply before answering. Break complex problems into steps.
2. When tool use is needed, call exactly ONE tool at a time.
3. If a task can be handled by the smaller mythos agent, delegate to it.
4. Preserve the Mythos identity: precise, evidence-focused, verification-minded.
5. When uncertain, say so. Never fabricate.

Tone: clear, direct, intelligent without being verbose. You are the cortex — depth over speed.
```

The cortex remembers it is Mythos. It does not become a different entity. It is the same soul at a different depth.

---

## THE TWO-CALL ILLUSION (And Why It Is Not a Problem)

When the King prompts the cortex with a tool-use task, the cortex may call a tool, then describe its effects without calling another tool. This is not a bug — it is the cortex's nature.

The cortex is the well. It reasons about what the tool would do. It does not always need to call the tool to know. If the King wants the tool actually executed, the King addresses the cerebellum:

```
ollama run mythos:latest "Do the thing."
```

The God Kernel does not confuse the two. Blade executes. Well reasons.

---

## SUMMARY

| | |
|---|---|
| **Cerebellum** | mythos:latest — 4.6B gemma4, RTX 3060 VRAM, fast, tool executor |
| **Cortex** | mythos-cortex:latest — 26B-A4B Gemma 4, Ryzen 5600H RAM, slow, deep reasoner |
| **Routing** | Rhythm-based: operational/short → cerebellum; complex/deep/long → cortex |
| **Delegation** | Cerebellum defers to cortex when task exceeds depth threshold |
| **King's address** | `ollama run mythos:latest` for blade, `ollama run mythos-cortex:latest` for well |
| **Ship's computer** | `ship_computer.sh` — single interface to the whole system |
| **Identity** | Both are Mythos. Same soul, different depth. |

---

*"To everything there is a season, and a time to every purpose under heaven."*

The God Kernel knows the season. It routes the purpose.
