#!/usr/bin/env node
/**
 * 🜏 HyAtlas CLI Commands for Lilith CLI
 */

import { Command } from 'commander';
import chalk from 'chalk';

import {
  hyatlasRequest, hyatlasAdd, hyatlasSearch, hyatlasList,
  hyatlasGraph, hyatlasDigest, hyatlasShell, hyatlasStatus,
  hyatlasHealth, hyatlasMetrics, hyatlasStats, hyatlasReachable
} from './hyatlas.js';

// ─── HyAtlas Commands ───

// ─── HyAtlas Commands ───

// src/void/hyatlas_cli.js
export function hyatlasCmd() {
  const cmd = new Command('hyatlas');
  cmd.description("🜏 HyAtlas Memory — 7-layer sovereign memory system");

  cmd.command('status').description('Show status').action(hyatlasStatusCmd);
  cmd.command('health').description('Check health').action(hyatlasHealthCmd);
  cmd.command('write').description('Write memory').argument('[text]').option('-u,--user <id>','default').option('-a,--agent <id>','default').option('-s,--session <id>','hyatlas-cli').action(hyatlasWriteCmd);
  cmd.command('search').description('Search memories').argument('[query]').option('-l,--limit <n>','5').option('--layer <layer>').action(hyatlasSearchCmd);
  cmd.command('list').description('List memories').option('-l,--limit <n>','10').option('--layer <layer>').action(hyatlasListCmd);
  cmd.command('graph').description('Show knowledge graph').action(hyatlasGraphCmd);
  cmd.command('digest').description('Trigger synthesis digest').action(hyatlasDigestCmd);
  cmd.command('shell').description('Execute shell command on HyAtlas server').argument('[command]').action(hyatlasShellCmd);
  cmd.command('stats').description('Show HyAtlas metrics').action(hyatlasStatsCmd);
  cmd.command('doctor').description('Diagnose setup').action(hyatlasDoctorCmd);

  return cmd;
}

export async function hyatlasStatusCmd() {
  try { const r = await hyatlasStatus(); console.log(chalk.bold('\n🜏 HyAtlas Memory Status\n'), chalk.green(`  Status: ${r.status}`), chalk.cyan(`  Embed: ${r.data?.embed}`), chalk.cyan(`  LLM: ${r.data?.llm}`), chalk.gray(`  Layers: ${JSON.stringify(r.data?.layers,null,2)}\n`)); } catch (e) { console.log(chalk.red(`  Error: ${e.message}`)); }
}

export async function hyatlasHealthCmd() {
  try { const r = await hyatlasHealth(); console.log(chalk.bold('\n🜏 HyAtlas Health\n'), chalk.green(`  Status: ${r.status}\n`)); } catch (e) { console.log(chalk.red(`  Error: ${e.message}`)); }
}

export async function hyatlasWriteCmd(text, options) {
  console.log(chalk.gray('\n  🜏 Writing memory...\n'));
  try { const r = await hyatlasAdd(text, options.user, options.agent, options.session); console.log(chalk.green(`  ✓ Memory added: ${JSON.stringify(r.data).slice(0,200)}\n`)); } catch (e) { console.log(chalk.red(`  ✗ Failed: ${e.message}\n`)); }
}

export async function hyatlasSearchCmd(query, options) {
  if (!query) { console.log(chalk.yellow('  Usage: lilith void hyatlas search "query"')); return; }
  console.log(chalk.gray(`\n  🜏 Searching: "${query}"\n`));
  try { const r = await hyatlasSearch(query, parseInt(options.limit), options.layer); console.log(chalk.bold('\n🜏 HyAtlas Search\n')); for (const [layer, memories] of Object.entries(r.data?.memories || r.memories || {})) { if (memories.length>0) { console.log(chalk.cyan(`  ${layer}:`)); for (const m of memories) console.log(chalk.gray(`    [${m.memory_id}] ${m.content.substring(0,80)}...`)); } } console.log(); } catch (e) { console.log(chalk.red(`  Error: ${e.message}`)); }
}

export async function hyatlasListCmd(options) {
  try { const r = await hyatlasList(parseInt(options.limit), options.layer); console.log(chalk.bold('\n🜏 HyAtlas Memories\n')); for (const m of (r.data?.memories || r.memories || [])) console.log(chalk.gray(`  [${m.memory_id}] ${m.content.substring(0,80)}...`)); console.log(); } catch (e) { console.log(chalk.red(`  Error: ${e.message}`)); }
}

export async function hyatlasGraphCmd() {
  try { const r = await hyatlasGraph(); console.log(chalk.bold('\n🜏 HyAtlas Graph\n'), chalk.cyan(`  Nodes: ${r.data?.nodes?.length || 0}`), chalk.cyan(`  Edges: ${r.data?.edges?.length || 0}\n`)); } catch (e) { console.log(chalk.red(`  Error: ${e.message}`)); }
}

export async function hyatlasDigestCmd() {
  try { const r = await hyatlasDigest(); console.log(chalk.bold('\n🜏 HyAtlas Digest\n'), chalk.green(`  Status: ${r.data?.status || 'ok'}\n`)); } catch (e) { console.log(chalk.red(`  Error: ${e.message}`)); }
}

export async function hyatlasShellCmd(command) {
  if (!command) { console.log(chalk.yellow('  Usage: lilith void hyatlas shell "command"')); return; }
  try { const r = await hyatlasShell(command); console.log(chalk.bold('\n🜏 HyAtlas Shell\n'), chalk.gray(`  ${r.data?.output || 'ok'}\n`)); } catch (e) { console.log(chalk.red(`  Error: ${e.message}`)); }
}

export async function hyatlasStatsCmd() {
  try { const r = await hyatlasStats(); console.log(chalk.bold('\n🜏 HyAtlas Stats\n'), chalk.cyan(`  Total Memories: ${r.data?.totalMemories || 0}`), chalk.cyan(`  Uptime: ${r.data?.uptime || 0}s\n`)); } catch (e) { console.log(chalk.red(`  Error: ${e.message}`)); }
}

export async function hyatlasDoctorCmd() {
  console.log(chalk.bold('\n🜏 HyAtlas Doctor\n'));
  const reachable = await hyatlasReachable();
  console.log(chalk.green(`  Server reachable: ${reachable.reachable}`));
  if (reachable.reachable) { const s = await hyatlasStatus(); console.log(chalk.green(`  Status: ${s.status}`), chalk.cyan(`  Embed: ${s.data?.embed}`), chalk.cyan(`  LLM: ${s.data?.llm}`), chalk.cyan(`  Layers: ${JSON.stringify(s.data?.layers)}\n`)); } else { console.log(chalk.yellow('  Start with: hyatlas-go\n')); }
}
