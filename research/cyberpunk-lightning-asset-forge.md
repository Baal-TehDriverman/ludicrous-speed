# Cyberpunk Lightning Asset Forge

> Fleet operational doctrine for remote Cyberpunk 2077 asset production.
> Registered: 2026-08-27T02:58:06-04:00

## Lightning Teamspace

- Organization: `lilith-systems-llc`
- Teamspace: `cyberpunk-asset-forge`
- Canonical slug: `lilith-systems-llc/cyberpunk-asset-forge`
- Lightning teamspace ID: `01m11053pcwtdhypnknd6k5ngq`
- Creation state: verified by SDK readback
- Studios at registration: `0`
- Secrets: none stored in this document or repository

## Purpose

Use bounded Lightning CPU sessions as a remote build forge for Cyberpunk 2077 source assets while the local RTX 3060 remains available for the game, local inference, and final runtime validation.

The teamspace is for deterministic build work, not cloud gaming and not unattended persistent compute.

## Appropriate CPU Workloads

- Blender headless mesh cleanup, validation, decimation, and LOD generation
- UV and topology checks
- Procedural texture, mask, decal, icon, UI, and atlas generation
- Normal/roughness/metallic/emissive map manipulation
- Texture resize, color conversion, metadata stripping, and channel packing
- Audio normalization and conversion
- REDscript source compilation
- TweakXL and ArchiveXL source validation
- `cp77tools` archive builds and `archiveinfo` verification where Linux supports the input formats
- Checksums, manifests, release packaging, and deterministic regression checks

## Hard Boundaries

1. **No game streaming.** A CPU Studio has no gaming GPU, low-latency display path, audio/controller forwarding, or supported Steam/Proton gaming environment.
2. **No false XBM claims.** WolvenKit 8.20.0 texture import on Linux can fail because the PNG/JPEG/BMP/TIFF path depends on Windows WIC/DirectXTex. A source PNG/TGA/DDS is not a game-ready `.xbm` until conversion succeeds in a verified environment.
3. **No runtime proof in cloud.** Final deployment and game-loader proof occur on Eric's local Cyberpunk installation. Archive construction is not evidence that RED4ext, CET, ArchiveXL, TweakXL, or REDscript loaded in-game.
4. **No idle compute.** Start one machine for one bounded batch, download and hash outputs, then stop it and verify `Stopped` by API readback.
5. **No secrets in source control.** Lightning credentials remain in approved authentication stores or transient process environment only.
6. **No destructive synchronization.** Source uploads are append/copy operations. Never delete local or cloud assets merely because they are scattered; inventory and distinguish valuable assets from broken outputs first.

## Canonical Pipeline

```text
Local source assets
    -> manifest + source hashes
    -> upload to Lightning teamspace
    -> bounded CPU Studio or Job
    -> Blender/Python/ImageMagick/cp77tools processing
    -> structural validation + output hashes
    -> download verified artifacts
    -> Windows/WIC XBM conversion when required
    -> local Cyberpunk deployment
    -> runtime-log proof
    -> preserve source + build manifest
```

## Preferred Execution Contract

Each remote build receives:

- immutable input manifest
- exact tool versions
- explicit entrypoint
- explicit timeout
- isolated output directory
- machine-readable report
- SHA-256 hashes for every deliverable

A build is complete only after:

1. Remote command exits successfully.
2. Expected outputs exist and have nonzero size.
3. Format-specific inspection succeeds (`archiveinfo`, image probe, mesh probe, etc.).
4. Outputs are downloaded locally.
5. Local hashes match remote hashes.
6. The Studio or Job is stopped and read back as stopped.

## Fleet Ownership

- **Baal / Eric:** operator of record; authorizes paid compute, deployment, and destructive changes.
- **Lilith:** asset-forge orchestration, scope control, artifact verification, and shutdown enforcement.
- **Hermes:** provider authentication, tool execution, manifests, and session evidence.
- **Spock:** indexed retrieval of this doctrine and structural build knowledge.
- **Data:** dataset and artifact lineage.
- **Geordi / B'Elanna:** engineering diagnostics and build failures.
- **Worf / Tuvok:** integrity, safety, and release-gate verification.
- **Kairos Dream:** idle-time synthesis of reusable asset recipes; never launches paid compute autonomously.

## Initial State

The teamspace was created empty by design. No Studio was created and no compute was started during registration. The first asset batch should provision only the smallest sufficient CPU machine, prove the build contract on one component, download the result, and stop immediately.

## Related Fleet Knowledge

- `software-development/wolvenkit-cli-linux`
- `game-development/cyberpunk-mod-deployment-linux`
- `game-development/cyberpunk-mod-audit`
- `software-development/cp2077-mod-structure-analysis`
- `metaconscious/kairos-dream`
