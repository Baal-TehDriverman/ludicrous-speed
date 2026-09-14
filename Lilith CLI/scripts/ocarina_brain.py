#!/usr/bin/env python3
"""
Ocarina Brain — on-Quest ocarina role interpreter.

Wraps the Quest's live nssp-infer.sh (cerebellum: Ollama/llama-server/VLLM) to
turn an ocarina note-symbol sequence into a STABLE, structured environment
intent the B&S/BlackSpace Zelda mod can execute. Gemini3:1b/smolLM freeform
text is unreliable for game control, so we pin the model to an enum with a
strict system prompt and validate the reply against a fixed vocabulary.

Intent enum (matches Zelda SongEffect):
  heal, teleport, time, weather, secrets, none

Usage:
  ocarina_brain.py "<note symbols, e.g. LEFTUP LEFTRIGHT RIGHTDOWN ...>"
    -> prints one line of JSON: {"song":"...","intent":"heal","destination":"...",
                                 "time_hour":12.0,"weather":"Clear","reason":"..."}

  ocarina_brain.py --health
    -> backend status via nssp-infer.sh

Requires: nssp-infer.sh in $NSSP_INFER (or lilith-nssp-mesh/exec-layer/).
Local-only; no network beyond the local cortex.
"""
import json, os, subprocess, sys

NSSP_INFER = os.environ.get(
    "NSSP_INFER",
    os.path.expanduser("~/lilith-nssp-mesh/exec-layer/nssp-infer.sh"),
)
DEFAULT_MODEL = os.environ.get("NSSP_MODEL", "gemma3:1b")

WEAZTHERS = ["Clear", "Rain", "Storm", "Snow"]  # matches Zelda WeatherType
DUNGEONS = [  # matches ZeldaCampaign 9 modes
    "Great Deku Tree", "Dodongo's Cavern", "Jabu-Jabu's Belly", "Forest Temple",
    "Fire Temple", "Water Temple", "Shadow Temple", "Spirit Temple", "Ganon's Castle",
]

SYSTEM = (
    "You are the Zelda ocarina 'brain'. The player plays an ocarina song (a "
    "sequence of touchpad note symbols). Map it to EXACTLY ONE intent from: "
    "heal, teleport, time, weather, secrets. Reply with ONLY a JSON object, "
    "valid JSON, no prose, no markdown:\n"
    '{ "intent": one-of-heal/teleport/time/weather/secrets, "reason": short '
    'phrase }. For "teleport" also set "destination" to one of the campaign '
    "dungeon names. For \"weather\" set \"weather\" to one of Clear/Rain/"
    "Storm/Snow. For \"time\" set \"time_hour\" to a 0..23 float. Default "
    "heal/teleport/others to sensible generic values.\n"
    "Do not invent fields outside this schema."
)


def run_infer(prompt, model=None):
    """Call nssp-infer.sh with a prompt; return (ok, text)."""
    cmd = [NSSP_INFER, "--model", model or DEFAULT_MODEL, "--json"]
    if isinstance(prompt, str):
        proc = subprocess.run(
            cmd + [prompt], capture_output=True, text=True, timeout=60
        )
    else:
        # multi-turn chat: pass alternating args
        proc = subprocess.run(cmd + list(prompt), capture_output=True, text=True, timeout=60)
    if proc.returncode != 0:
        return False, proc.stderr.strip()
    try:
        data = json.loads(proc.stdout)
    except json.JSONDecodeError:
        return False, proc.stdout
    msg = data.get("message", {}).get("content", "")
    if not msg:
        msg = data.get("response", "")
    return True, msg


def parse_reply(text, fallback):
    """Coerce model output into our strict schema; default to safe values."""
    intent = fallback.get("intent", "none")
    destination = fallback.get("destination")
    weather = fallback.get("weather")
    time_hour = fallback.get("time_hour")
    reason = ""

    # Try to extract JSON embedded in the reply
    start = text.find("{")
    end = text.rfind("}")
    cand = {}
    if start != -1 and end > start:
        try:
            cand = json.loads(text[start:end + 1])
        except Exception:
            pass

    i = cand.get("intent") or intent
    i = i.lower() if isinstance(i, str) else intent
    valid = {"heal", "teleport", "time", "weather", "secrets"}
    if i not in valid:
        i = "none"
    out = {"intent": i, "reason": cand.get("reason", "") or reason}

    if i == "teleport":
        d = cand.get("destination") or destination
        if d in DUNGEONS:
            out["destination"] = d
        else:
            out["destination"] = DUNGEONS[0]
    if i == "weather":
        w = cand.get("weather") or weather
        out["weather"] = w if w in WEAZTHERS or not w else "Clear"
        # normalize
        out["weather"] = out["weather"] if out["weather"] in WEAZTHERS else "Clear"
    if i == "time":
        try:
            h = float(cand.get("time_hour") or time_hour)
            out["time_hour"] = max(0.0, min(23.0, h))
        except Exception:
            out["time_hour"] = 12.0

    return out


# Canonical ocarina songs -> deterministic intent (the reliable core).
# The in-game ocarina already RECOGNIZES these; the LLM only fills details.
SONG_INTENTS = {
    "zelda's lullaby": "heal",
    "lullaby": "heal",
    "song of time": "time",
    "sun's song": "time",
    "suns song": "time",
    "song of storms": "weather",
    "storm": "weather",
    "ocarina of time": "teleport",
    "warp": "teleport",
    "minuet of forest": "teleport",
    "bolero of fire": "teleport",
    "serenade of water": "teleport",
    "nocturne of shadow": "teleport",
    "prelude of light": "teleport",
    "requiem of spirit": "teleport",
    "song of healing": "heal",
    "saria's song": "secrets",
    "scarecrow": "secrets",
}


def resolve_song(text):
    """Deterministic intents for known song names (bypasses LLM for the core)."""
    t = text.lower().strip().strip('"\'')
    for key, intent in SONG_INTENTS.items():
        if key in t:
            return intent, key
    return None, None


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return 0

    if args[0] == "--health":
        hp = subprocess.run(
            [NSSP_INFER, "--health"], capture_output=True, text=True, timeout=30
        )
        if hp.returncode == 0:
            print(hp.stdout.strip())
            return 0
        ok, text = run_infer("Say OK.", DEFAULT_MODEL)
        if ok:
            print(f"NSSP_INFER_OK model={DEFAULT_MODEL}")
            return 0
        print(f"BACKEND_DOWN: {text}")
        return 1

    song = " ".join(args)
    intent, matched = resolve_song(song)
    fallback = {}

    # Deterministic core: a recognized song's intent is AUTHORITATIVE. The LLM
    # may only fill the variable detail (destination/weather/time), never
    # override the intent.
    if intent:
        if intent == "teleport":
            fallback = {"intent": "teleport", "destination": "Fire Temple"}
        elif intent == "weather":
            fallback = {"intent": "weather", "weather": "Storm"}
        elif intent == "time":
            fallback = {"intent": "time", "time_hour": 12.0}
        else:
            fallback = {"intent": intent}

    ok, reply = run_infer(
        f"Ocarina song: {song} (matched {matched or 'unknown'}).\n{SYSTEM}",
        DEFAULT_MODEL,
    )
    result = parse_reply("" if not ok else reply, fallback)
    # Lock the intent when the song was deterministically recognized.
    if intent:
        result["intent"] = intent
    result["song"] = song
    if matched:
        result["matched_song"] = matched
    print(json.dumps(result))
    return 0


if __name__ == "__main__":
    sys.exit(main())