---
name: mod-deploy
description: Deploy Cyberpunk 2077 mods to archive/pc/mod/ — copy never delete, CET/RED4ext Proton traps, evidence collection.
triggers:
  - deploy mod
  - mod deploy
  - deploy
  - archive/pc/mod/
  - third-party mod
  - sacred rule
  - no delete
version: 1.0.0
platforms: [linux]
---

# Mod Deployment — Lilith CLI Skill

Deploy Cyberpunk 2077 mods to the game's archive load path. **Third-party mods are sacred — never deleted, only copied.**

## When to Use

- User asks to deploy, install, or place a mod
- Building and deploying a mod archive
- Moving a mod from Nigredo to the game directory
- Verifying a deployed mod works

## Sacred Rules (non-negotiable)

1. **NEVER delete a third-party mod.** Even if it's a duplicate, old, or broken. If it doesn't work, it goes BACK into Nigredo.
2. **Deploy to `archive/pc/mod/` ONLY.** NEVER `r6/cache/modded/`. The game loads packed archives from `archive/pc/mod/`.
3. **Always COPY, never MOVE.** Preserve the source.
4. **Verify every deployment** with log + SHA-256 hash.
5. **Always use absolute paths** for mod operations.

## CET Linux Traps

### Trap 1: CET .asi Location
**Symptom:** `cyber_engine_tweaks.log` stays 0 bytes. CET is dead silent.
**Fix:** Move `.asi` from `plugins/` to `scripts/`:
```bash
mv "Cyberpunk 2077/bin/x64/plugins/cyber_engine_tweaks.asi" "Cyberpunk 2077/bin/x64/scripts/cyber_engine_tweaks.asi"
```
**Verify:** `cyber_engine_tweaks.log` must be non-zero bytes.

### Trap 2: Proton DLL-Override
**Symptom:** RED4ext/CET loaders silently fail via `proton run`.
**Fix:** Write DllOverrides to `user.reg`, NOT shell env vars:
```bash
cat >> ~/.local/share/Steam/steamapps/compatdata/1091500/pfx/user.reg <<'EOF'

[Software\\Wine\\AppDefaults\\Cyberpunk2077.exe\\DllOverrides]
"version"="native,builtin"
"winmm"="native,builtin"
EOF
```

## Deployment Workflow

1. **Fix loaders first** (CET/RED4ext Proton traps — see above)
2. **Deploy simplest mods first** (proves the stack works)
3. **Deploy complex mods with dependencies**
4. **Document each mod** in `Verified/Evidence/<mod_name>/EVIDENCE.md`

## Classification Pattern

For each mod, identify type from file structure:
- `red4ext/plugins/` + `.dll` → RED4ext plugin
- `cyber_engine_tweaks/mods/` + `.lua` → CET mod
- `archive/pc/mod/` + `.archive` → Archive mod
- `r6/scripts/` + `.reds` → REDscript mod
- `r6/input/` + `.xml` → Input mod

## Evidence Standard

Each deployed mod needs:
- Deployment steps in `Verified/Evidence/<mod_name>/EVIDENCE.md`
- Log file excerpts proving it works
- SHA-256 hashes of deployed files

## See Also

- `skills/wolvenkit-build.md` — Building mod archives
- `skills/cet-troubleshoot.md` — CET console troubleshooting
- `skills/alchemical-stage-move.md` — Stage pipeline movement
- `mod-tools.js` — `deploy_mod` tool, `quick_build` tool
