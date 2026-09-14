---
name: wolvenkit-build
description: Build Cyberpunk 2077 mod archives with WolvenKit CLI (cp77tools). Covers cp77tools v8.20.0, deploy path (archive/pc/mod/ only), .cpmodproj Linux build, REDscript loose-file deployment.
triggers:
  - wolvenkit
  - cp77tools
  - build archive
  - .cpmodproj
  - archive compilation
  - mod packaging
  - build .
version: 1.0.0
platforms: [linux]
---

# WolvenKit CLI — Mod Archive Build

Build, inspect, and package Cyberpunk 2077 mods using WolvenKit CLI (`cp77tools`) on Linux.

**⚠️ Deploy target is `archive/pc/mod/` ONLY. NOT `r6/cache/modded/`.**

## When to Use

- Compile `.cpmodproj` projects into `.archive` files
- Inspect archive contents with `archiveinfo`
- Extract archives for debugging
- Detect mod conflicts
- Package REDscript-only mods
- Set up new mod workspaces

## Prerequisites

- **.NET 8+ runtime**: `pacman -S dotnet-runtime-8.0 aspnet-runtime-8.0`
- **WolvenKit CLI**: `dotnet tool install -g WolvenKit.CLI --version 8.20.0`
- **Command name**: `cp77tools` (NOT `wolvenkit`)
- **PATH**: `export PATH="$HOME/.dotnet/tools:$PATH"`

## Build

```bash
cd /path/to/mod/
DOTNET_ROLL_FORWARD=Major cp77tools build . --verbosity Normal
```

**Output location**: `<mod_root>/packed/archive/pc/mod/<mod_name>.archive`

## Critical: Build Syntax

**`cp77tools build .`** (with dot) — NOT `cp77tools build <project>.cpmodproj`

The dot tells cp77tools to find all `.cpmodproj` files in the current directory.

## Critical: Windows Backslash Paths on Linux

`.cpmodproj` files created on Windows use backslash paths (`scripts\\core\\mod.reds`). On Linux, `cp77tools build .` silently skips every file — producing a 16K empty archive. Convert to forward slashes:

```bash
cat my_mod.cpmodproj | tr '\\' '/' > my_mod_fixed.cpmodproj
mv my_mod_fixed.cpmodproj my_mod.cpmodproj
```

After the fix, a script-only archive should be ~30-50KB+.

## Deploy Path

Archives go ONLY to `archive/pc/mod/`. The game loads packed archives from there, NOT from `r6/cache/modded/`.

```bash
DEST="/home/tehlappy/.local/share/Steam/steamapps/common/Cyberpunk 2077/archive/pc/mod/"
mkdir -p "$DEST"
cp -v "$SRC"*.archive "$DEST"
```

## Common Pitfalls

- **Multiple .cpmodproj files**: `cp77tools build .` fails if multiple exist. Move extras to a backup dir.
- **Empty archive (16K)**: Usually means backslash paths in `.cpmodproj`. Convert to forward slashes.
- **Missing SDK PackageReferences**: `.cpmodproj` without SDK refs produces "Unknown file extension" warnings. Add `WolvenKit.REDmod`, `WolvenKit.REDmod.TweakXL`, `WolvenKit.REDmod.ArchiveXL`, `WolvenKit.REDmod.REDscript`, `WolvenKit.REDmod.Codeware`, `WolvenKit.REDmod.CyberEngineTweaks`.
- **source/resources/ must exist**: Create it even if empty, or the build fails silently.
- **Script-only archives are valid**: ~16KB, reports "0/0 entries" — normal, not an error.

## See Also

- `skills/mod-deploy.md` — Deployment workflow and sacred rules
- `skills/cet-troubleshoot.md` — CET console troubleshooting
- `mod-tools.js` — `wolvenkit_build` tool
