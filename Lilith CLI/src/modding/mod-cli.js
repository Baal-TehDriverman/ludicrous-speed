/**
 * 🜏 Lilith Modding Client — CLI Commands
 *
 * Register mod commands on the Lilith CLI program.
 * Also provides standalone entry point for Void integration.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { ModEngine } from './mod-engine.js';
import { registerModCommands, printMode, resumeSession } from './mod-commands.js';

/**
 * Register all mod commands on a Commander program
 */
export function registerModCommandsOn(program) {
  const modEngine = new ModEngine();
  registerModCommands(program, modEngine);

  // Add mod commands to the main CLI
  program
    .command('mod')
    .description('🜏 Cyberpunk 2077 mod operations')
    .addCommand(new Command('build').description('Build a mod').action(async (modDir) => {
      const engine = new ModEngine();
      const result = await engine.query(`Build mod at ${modDir}. Use wolvenkit_build tool.`);
      for await (const chunk of result) {
        if (chunk.type === 'text') process.stdout.write(chunk.content);
      }
    }))
    .addCommand(new Command('deploy').description('Deploy a mod').action(async (modName, source, type) => {
      const engine = new ModEngine();
      const result = await engine.query(`Deploy ${modName} from ${source}. Use deploy_mod tool.`);
      for await (const chunk of result) {
        if (chunk.type === 'text') process.stdout.write(chunk.content);
      }
    }))
    .addCommand(new Command('verify').description('Verify a mod').action(async (modName) => {
      const engine = new ModEngine();
      const result = await engine.query(`Verify mod ${modName}. Use verify_mod tool.`);
      for await (const chunk of result) {
        if (chunk.type === 'text') process.stdout.write(chunk.content);
      }
    }))
    .addCommand(new Command('scan').description('Scan mods').action(async () => {
      const engine = new ModEngine();
      const result = await engine.query('Scan Nigredo third_party_mods. Use scan_mods tool.');
      for await (const chunk of result) {
        if (chunk.type === 'text') process.stdout.write(chunk.content);
      }
    }))
    .addCommand(new Command('cet').description('Check CET status').action(async () => {
      const engine = new ModEngine();
      const result = await engine.query('Check CET status. Use check_cet tool.');
      for await (const chunk of result) {
        if (chunk.type === 'text') process.stdout.write(chunk.content);
      }
    }));

  return program;
}

/**
 * Standalone entry point for Void runtime
 * Called by Void server when mod commands are requested
 */
export async function runModCommand(cmd, args = []) {
  const engine = new ModEngine();

  switch (cmd) {
    case 'build':
      return engine.query(`Build mod from ${args[0]}. Use wolvenkit_build tool.`);
    case 'deploy':
      return engine.query(`Deploy ${args[0]} from ${args[1]}. Use deploy_mod tool.`);
    case 'verify':
      return engine.query(`Verify mod ${args[0]}. Use verify_mod tool.`);
    case 'scan':
      return engine.query('Scan Nigredo third_party_mods. Use scan_mods tool.');
    case 'cet':
      return engine.query('Check CET status. Use check_cet tool.');
    case 'quick':
      return engine.query(`Quick build ${args[0]} from ${args[1]} type ${args[2]}. Use quick_build tool.`);
    default:
      return engine.query(args.join(' '));
  }
}

/**
 * Initialize the mod client with hooks and subagents
 */
export function initModClient() {
  const engine = new ModEngine();

  // Post-deploy hook: collect evidence
  engine.on('postToolUse', async ({ tool, input, result }) => {
    if (tool === 'deploy_mod') {
      console.log(chalk.cyan('🜏 Collecting evidence...'));
      // Evidence collection would be called here
    }
  });

  // Subagent delegation for concurrent mod tasks
  engine.setSubagents([
    { name: 'build-agent', domain: 'build', command: 'cp77tools build .' },
    { name: 'deploy-agent', domain: 'deploy', command: 'cp -r' },
    { name: 'verify-agent', domain: 'verify', command: 'cat cyber_engine_tweaks.log' },
  ]);

  return engine;
}

export { ModEngine };
export default registerModCommandsOn;