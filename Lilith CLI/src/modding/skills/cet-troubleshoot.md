---
name: cet-troubleshoot
description: Troubleshoot Cyberpunk 2077 CET (Cyber Engine Tweaks) — .asi location, Proton DLL-overrides, RED4ext loader issues, console command injection.
triggers:
  - cet
  - cyber engine tweaks
  - .asi
  - cet console
  - CET not working
  - cyber_engine_tweaks.log
  - loadertrap
  - proton dll
version: 1.0.0
platforms: [linux]
---

# CET Troubleshooting — Lilith CLI Skill

Diagnose and fix Cyberpunk 2077 CET (Cyber Engine Tweaks) issues on Linux.

## When to Use

- CET doesn't initialize (`cyber_engine_tweaks.log` is 0 bytes)
- CET console commands don't work
- RED4ext plugins load but CET is dead silent
- Proton/Wine CET/RED4ext loaders fail
- Console command injection issues

## Critical: .asi Location Trap

**Symptom:** `cyber_engine_tweaks.log` stays 0 bytes. Everything else works (RED4ext, redscript) but CET is dead.

**Root cause:** The CET verified package ships the `.asi` at `bin/x64/plugins/cyber_engine_tweaks.asi`. But `global.ini` contains `LoadFromScriptsOnly=1`, telling the Ultimate ASI Loader to look in `bin/x64/scripts/` — NOT `plugins/`.

**Fix:**
```bash
mv "Cyberpunk 2077/bin/x64/plugins/cyber_engine_tweaks.asi" "Cyberpunk 2077/bin/x64/scripts/cyber_engine_tweaks.asi"
```

**Verify:** `cyber_engine_tweaks.log` must be non-zero bytes for CET to be active.

## Critical: Proton DLL-Override Trap

**Symptom:** RED4ext doesn't load, or CET's `version.dll` stub doesn't trigger. Both loaders silently fail under Proton.

**Root cause:** Setting `WINEDLLOVERRIDES` in a shell script does NOT survive `proton run`. Proton does not pass the variable to the game process. Wine loads its own builtin DLLs instead.

**Fix:** Write the override directly into the prefix registry:
```bash
cp ~/.local/share/Steam/steamapps/compatdata/1091500/pfx/user.reg ~/.local/share/Steam/steamapps/compatdata/1091500/pfx/user.reg.bak
cat >> ~/.local/share/Steam/steamapps/compatdata/1091500/pfx/user.reg <<'EOF'

[Software\\Wine\\AppDefaults\\Cyberpunk2077.exe\\DllOverrides]
"version"="native,builtin"
"winmm"="native,builtin"
EOF
```

## Critical: AMM Base Dependency

**Symptom:** AMM body mods installed but don't appear in-game.

**Root cause:** AMM body mods require AMM base. Body mod `.lua` files expect `bin/x64/plugins/cyber_engine_tweaks/mods/AppearanceMenuMod/...`. Without AMM base, they're orphaned.

**Fix:** Install AMM base FIRST, read its README, verify it loads. Then add body mods.

## CET Console Commands

CET console commands are injected via `cyber_engine_tweaks.asi`. The `cet_console` tool validates command format and prepares injection.

**Important:** REDscript does NOT have a `[ConsoleCommand]` attribute. Use the `exec` keyword for global functions exposed to the in-game console:
```redscript
public exec func MyCommand() -> Void { ... }
```

## Check CET Status

Run `check_cet` tool or:
```bash
ls -la "Cyberpunk 2077/cyber_engine_tweaks.log"
ls -la "Cyberpunk 2077/bin/x64/scripts/cyber_engine_tweaks.asi"
cat "Cyberpunk 2077/cyber_engine_tweaks.log"
```

## See Also

- `skills/mod-deploy.md` — Deployment and sacred rules
- `skills/wolvenkit-build.md` — Building mod archives
- `mod-tools.js` — `cet_console` tool, `check_cet` tool
