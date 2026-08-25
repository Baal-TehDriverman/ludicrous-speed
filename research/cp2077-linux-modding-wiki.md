# Cyberpunk 2077 Modding — Linux Guide (redmodding wiki)

> Sourced 2026-08-24 from https://wiki.redmodding.org/cyberpunk-2077-modding (llms.txt index).
> Local context: Eric's install, Garuda Linux, Steam/Proton, game v2.31.

## Linux launch setup (TL;DR from wiki "Modding on Linux")

1. Install via Protontricks into the CP77 prefix: `d3dcompiler_47` and `vcrun2022`.
2. Steam launch options MUST be exactly:
   ```
   WINEDLLOVERRIDES="winmm,version=n,b" %command%
   ```
   Case-sensitive. Steam sometimes reverts/edits these after updates — recheck on any crash.

## Core mods (canonical list + Nexus IDs)

| Framework | Nexus | Notes |
|---|---|---|
| Redscript | 1511 | Compiles to `r6/cache/final.redscripts.modded` |
| RED4ext | 2380 | Loads `.dll` plugins from `red4ext/plugins`; version-gates per game patch |
| Cyber Engine Tweaks | 107 | Requires RED4ext; CET TweakDB edits are runtime-only/non-persistent |
| ArchiveXL | 4198 | Adds resources/items; dynamic variants, resource patching |
| TweakXL | 4197 | TweakDB record changes via YAML; hashes from string key |
| Codeware | 7780 | Scripting library dependency for EquipmentEx etc. |
| EquipmentEx | 6945 | Outfit system; needs Codeware+TweakXL+ArchiveXL |

Core mods break on every CDPR API change — disable auto-update and upgrade manually once frameworks catch up.

## Key doc pages (append .md to fetch as markdown)

- Modding on Linux: /for-mod-users/users-modding-cyberpunk-2077/modding-on-linux.md
- Core Mods explained: /for-mod-creators-theory/core-mods-explained.md
- Troubleshooting requirements: /for-mod-users/user-guide-troubleshooting/requirements-explained.md
- Log files guide: /for-mod-users/user-guide-troubleshooting/finding-and-reading-log-files.md
- ArchiveXL docs: /for-mod-creators-theory/core-mods-explained/archivexl.md (+ suffixes/tags/body-refits/resource-patching/dynamic-materials subpages)
- Full index: https://wiki.redmodding.org/cyberpunk-2077-modding/llms.txt

## Local install status 2026-08-24

- RED4ext v1.30.0 loads ArchiveXL 1.27.1, Codeware 1.20.3, TweakXL 1.11.4, Mod Settings 0.2.21 on game 2.31 — all confirmed in red4ext log.
- **CET v1.37.1 has NOT loaded since Aug 22** (stale cyber_engine_tweaks.log) despite files present — prime suspect: game updated to 2.31, CET build behind, or WINEDLLOVERRIDES reverted by Steam.
- CET `mods/` folder empty.
- archive/pc/mod/ contains only EquipmentEx.archive(+.xl).
- Junk file `red4ext/plugins/ArchiveXL/ArchiveXL.log?` (empty) — safe to delete.

## Next actions

1. Verify Steam launch options contain the WINEDLLOVERRIDES string.
2. Check protontricks prefix has d3dcompiler_47 + vcrun2022.
3. If CET still silent, update CET to latest release for 2.31.
