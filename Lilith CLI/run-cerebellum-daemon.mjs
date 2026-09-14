#!/usr/bin/env node
/**
 * 🧠 Lilith Cerebellum Daemon — standalone runner.
 * Loads config, initializes the Cerebellum, and starts the 3-tier
 * task-routing daemon loop (polls pending tasks, executes via mythos/Ollama).
 */
import { loadConfig } from './src/utils/config.js';
import { Cerebellum } from './src/cerebellum/index.js';

async function main() {
  const config = await loadConfig();
  const cerebellum = new Cerebellum(config);
  await cerebellum.init();
  console.log('🧠 Lilith Cerebellum daemon starting (3-tier: mythos main)...');
  await cerebellum.startDaemon();
  console.log('🧠 Cerebellum daemon running. Ctrl-C to stop.');
}

main().catch((e) => {
  console.error('Cerebellum daemon failed:', e);
  process.exit(1);
});