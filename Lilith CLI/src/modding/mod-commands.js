/**
 * 🜏 Lilith Modding Client — Slash Commands
 *
 * Claude Code slash command system fused with Lilith modding domain.
 * Each command maps to a CP2077 modding operation via the ModEngine.
 *
 * Claude Code patterns fused:
 *   - Slash commands: /mod, /deploy, /build, /redscript, /cet, /verify
 *   - Print mode: -p flag for non-interactive CI/CD
 *   - Session resume: -r for continuing long mod campaigns
 *   - Stream output: real-time build/deploy progress
 *   - Subagent delegation: concurrent mod tasks
 */

import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { ModEngine } from './mod-engine.js';

/**
 * Register all modding slash commands on a Commander program
 */
export function registerModCommands(program, engine) {
  // ─── /mod — Root mod command ───
  const modCmd = program
    .command('mod')
    .description('🜏 Cyberpunk 2077 mod operations — build, deploy, debug')
    .addCommand(buildModCmd())
    .addCommand(deployModCmd())
    .addCommand(redscriptCmd())
    .addCommand(cetCmd())
    .addCommand(verifyModCmd())
    .addCommand(scanModsCmd())
    .addCommand(quickBuildCmd())
    .addCommand(checkCetCmd());

  return modCmd;
}

/**
 * /mod build — Build a mod archive with WolvenKit
 */
function buildModCmd() {
  const cmd = new Command('build')
    .description('Build a CP2077 mod archive using WolvenKit (cp77tools)')
    .argument('<modDir>', 'Path to mod directory')
    .option('-o, --output <path>', 'Output archive path', 'archive/pc/mod/')
    .option('--clean', 'Clean build before building')
    .option('--deploy', 'Deploy after building')
    .action(async (modDir, options) => {
      const engine = new ModEngine();
      const result = await engine.query(
        `Build the mod at ${modDir} using wolvenkit_build. Clean: ${options.clean}. Deploy: ${options.deploy}.`
      );
      for await (const chunk of result) {
        if (chunk.type === 'text') process.stdout.write(chunk.content);
      }
      console.log(chalk.green('\n✅ Build complete.'));
      if (options.deploy) {
        console.log(chalk.cyan('🜏 Deploying to archive/pc/mod/...'));
        console.log(chalk.yellow('⚠️ Third-party mods are sacred — never deleted. Only copied.'));
      }
    });
  return cmd;
}

/**
 * /mod deploy — Deploy a mod (COPY, never delete)
 */
function deployModCmd() {
  const cmd = new Command('deploy')
    .description('Deploy a mod from Nigredo to archive/pc/mod/')
    .argument('<modName>', 'Mod name')
    .argument('<sourcePath>', 'Source path in Nigredo')
    .argument('<type>', 'Mod type: red4ext | cet | archive | redscript | input')
    .action(async (modName, sourcePath, type) => {
      const engine = new ModEngine();
      const result = await engine.query(
        `Deploy the mod ${modName} from ${sourcePath} to archive/pc/mod/. Type: ${type}. Use deploy_mod tool.`
      );
      for await (const chunk of result) {
        if (chunk.type === 'text') process.stdout.write(chunk.content);
      }
      console.log(chalk.green(`\n✅ ${modName} deployed. Sacred rule preserved.`));
    });
  return cmd;
}

/**
 * /mod redscript — Compile/validate REDscript
 */
function redscriptCmd() {
  const cmd = new Command('redscript')
    .description('Compile or validate REDscript files (.reds)')
    .argument('<files...>', 'REDscript file paths')
    .option('--validate-only', 'Validate syntax only', true)
    .action(async (files, options) => {
      const engine = new ModEngine();
      const result = await engine.query(
        `Compile/validate REDscript files: ${files.join(', ')}. Use redscript_compile tool.`
      );
      for await (const chunk of result) {
        if (chunk.type === 'text') process.stdout.write(chunk.content);
      }
    });
  return cmd;
}

/**
 * /mod cet — CET console operations
 */
function cetCmd() {
  const cmd = new Command('cet')
    .description('CET console operations')
    .argument('<command>', 'CET console command')
    .option('--check', 'Check CET installation status')
    .action(async (command, options) => {
      const engine = new ModEngine();
      if (options.check) {
        const result = await engine.query('Check CET installation status. Use check_cet tool.');
        for await (const chunk of result) {
          if (chunk.type === 'text') process.stdout.write(chunk.content);
        }
      } else {
        const result = await engine.query(`Execute CET console command: ${command}. Use cet_console tool.`);
        for await (const chunk of result) {
          if (chunk.type === 'text') process.stdout.write(chunk.content);
        }
      }
    });
  return cmd;
}

/**
 * /mod verify — Verify a deployed mod
 */
function verifyModCmd() {
  const cmd = new Command('verify')
    .description('Verify a deployed mod works')
    .argument('<modName>', 'Mod name')
    .option('--type <check>', 'Check type: log | hash | in_game | all', 'all')
    .action(async (modName, options) => {
      const engine = new ModEngine();
      const result = await engine.query(
        `Verify the mod ${modName}. Check type: ${options.type}. Use verify_mod tool.`
      );
      for await (const chunk of result) {
        if (chunk.type === 'text') process.stdout.write(chunk.content);
      }
      console.log(chalk.green(`\n✅ Verification complete for ${modName}.`));
    });
  return cmd;
}

/**
 * /mod scan — Scan available mods
 */
function scanModsCmd() {
  const cmd = new Command('scan')
    .description('Scan Nigredo third_party_mods for available mods')
    .option('-d, --directory <path>', 'Directory to scan', 'Nigredo/third_party_mods')
    .action(async (options) => {
      const engine = new ModEngine();
      const result = await engine.query(
        `Scan mods in ${options.directory}. Use scan_mods tool.`
      );
      for await (const chunk of result) {
        if (chunk.type === 'text') process.stdout.write(chunk.content);
      }
    });
  return cmd;
}

/**
 * /mod quick — One weapon, one appearance, one complete truth
 */
function quickBuildCmd() {
  const cmd = new Command('quick')
    .description('Build and deploy a mod in one operation (sovereign pattern)')
    .argument('<modDir>', 'Mod directory path')
    .argument('<modName>', 'Mod name for archive')
    .argument('<type>', 'Mod type: red4ext | cet | archive | redscript')
    .action(async (modDir, modName, type) => {
      const engine = new ModEngine();
      const result = await engine.query(
        `Quick build and deploy ${modName} from ${modDir}. Type: ${type}. Use quick_build tool.`
      );
      for await (const chunk of result) {
        if (chunk.type === 'text') process.stdout.write(chunk.content);
      }
    });
  return cmd;
}

/**
 * /mod check — Check CET status
 */
function checkCetCmd() {
  const cmd = new Command('check')
    .description('Check if CET is properly installed and running')
    .action(async () => {
      const engine = new ModEngine();
      const result = await engine.query('Check CET installation status. Use check_cet tool.');
      for await (const chunk of result) {
        if (chunk.type === 'text') process.stdout.write(chunk.content);
      }
    });
  return cmd;
}

/**
 * Print mode (Claude Code -p pattern)
 * Non-interactive, exits when done. For CI/CD pipelines.
 */
export function printMode(cmd, input) {
  const engine = new ModEngine();
  engine.setPrintMode(true);
  return engine.query(input);
}

/**
 * Resume session (Claude Code -r pattern)
 */
export function resumeSession(sessionId, input) {
  const engine = new ModEngine();
  engine.setSession(sessionId);
  return engine.query(input, { resume: true });
}

/**
 * Stream mode (Claude Code streaming)
 */
export async function* streamMode(input, options = {}) {
  const engine = new ModEngine();
  yield* engine.query(input, options);
}

export default registerModCommands;