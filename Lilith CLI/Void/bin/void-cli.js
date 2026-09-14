#!/usr/bin/env node
import readline from 'readline';
import chalk from 'chalk';
import { spawn } from 'child_process';

const API = 'http://localhost:3000/api/void';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: chalk.magenta('void> '),
  history: [],
  historySize: 100,
});

let mode = 'eval';
let profile = 'no-net';

async function execute(code) {
  try {
    const res = await fetch(`${API}/exec`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, mode, profile }),
    });
    const data = await res.json();
    if (data.success) {
      if (data.output) console.log(chalk.green(data.output));
    } else {
      if (data.error) console.log(chalk.red(data.error));
    }
  } catch (e) {
    console.log(chalk.red(`Error: ${e.message}`));
  }
}

async function showStatus() {
  try {
    const res = await fetch(`${API}/status`);
    const data = await res.json();
    console.log(chalk.cyan(`Runtime: ${data.runtime_root}`));
    console.log(chalk.cyan(`Active: ${data.active_executions} | Queued: ${data.queued} | Max: ${data.max_concurrent}`));
    console.log(chalk.cyan(`Profiles: ${data.profiles.join(', ')}`));
  } catch (e) {
    console.log(chalk.red('Runtime unreachable'));
  }
}

console.log(chalk.bold.magenta('\n  🜏 VOID RUNTIME — Lilith JS Sandbox\n'));
console.log(chalk.dim('  Type JS code to execute. Commands: .status .mode .profile .exit\n'));

showStatus().then(() => {
  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();
    if (!input) { rl.prompt(); return; }

    if (input === '.exit') { rl.close(); return; }
    if (input === '.status') { await showStatus(); rl.prompt(); return; }
    if (input.startsWith('.mode ')) { mode = input.split(' ')[1]; console.log(chalk.yellow(`Mode: ${mode}`)); rl.prompt(); return; }
    if (input.startsWith('.profile ')) { profile = input.split(' ')[1]; console.log(chalk.yellow(`Profile: ${profile}`)); rl.prompt(); return; }

    await execute(input);
    rl.prompt();
  });

  rl.on('close', () => {
    console.log(chalk.dim('\n  Goodbye.\n'));
    process.exit(0);
  });
});
