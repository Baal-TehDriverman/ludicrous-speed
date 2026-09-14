#!/usr/bin/env node
/**
 * 🜏 Void Runtime Commands for Lilith CLI
 * Sandboxed JS execution with security profiles
 * Fixed: All emoji characters removed for clean Node.js parsing
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { createVoidApp, startVoidServer, executeCode, SECURITY_PROFILES } from '../../server-fixed.js';

export function voidStatusCmd() {
  return new Command('status')
    .description('Show Void runtime status')
    .action(async () => {
      try {
        const res = await fetch('http://localhost:3000/api/void/status');
        const data = await res.json();

        console.log(chalk.bold('\nVoid Runtime Status\n'));
        console.log(chalk.cyan('  Runtime:'), data.runtime_root);
        console.log(chalk.cyan('  Node:'), data.node_version);
        console.log(chalk.cyan('  V8:'), data.v8_version);
        console.log(chalk.cyan('  Active:'), `${data.active_executions}/${data.max_concurrent}`);
        console.log(chalk.cyan('  History:'), data.history_count, 'entries');
        console.log(chalk.cyan('  Uptime:'), `${data.uptime_seconds}s`);
        console.log(chalk.cyan('  Profiles:'), data.profiles.join(', '));
        console.log();
      } catch (err) {
        console.log(chalk.red('  Void server not running on :3000'));
        console.log(chalk.gray('  Start with: lilith void server\n'));
      }
    });
}

export function voidExecCmd() {
  return new Command('exec')
    .description('Execute JS code in Void sandbox')
    .argument('<code>', 'JavaScript code to execute')
    .option('-p, --profile <profile>', 'Security profile: no-net, ai-only, full', 'no-net')
    .option('-t, --timeout <ms>', 'Timeout in milliseconds', '15000')
    .option('--local', 'Execute locally (no server needed)')
    .action(async (code, options) => {
      console.log(chalk.gray('  Executing in Void sandbox...\n'));

      let result;
      if (options.local) {
        result = await executeCode(code, 'eval', options.profile, parseInt(options.timeout));
      } else {
        try {
          const res = await fetch('http://localhost:3000/api/void/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, mode: 'eval', profile: options.profile, timeout_ms: parseInt(options.timeout) }),
          });
          result = await res.json();
        } catch (err) {
          console.log(chalk.red('  Void server not running. Use --local or start server.\n'));
          return;
        }
      }

      if (result.success) {
        if (result.output) {
          console.log(chalk.green(result.output));
        }
        console.log(chalk.gray(`\n  Executed in ${result.execution_time_ms}ms`));
      } else {
        if (result.output) console.log(result.output);
        if (result.error) console.log(chalk.red(`\n  ${result.error}`));
      }
      console.log();
    });
}

export function voidPythonCmd() {
  return new Command('python')
    .description('Execute Python code in Void sandbox')
    .argument('<script>', 'Python script file path or code')
    .option('-p, --profile <profile>', 'Security profile: no-net, ai-only, full', 'no-net')
    .option('-t, --timeout <ms>', 'Timeout in milliseconds', '15000')
    .action(async (script, options) => {
      console.log(chalk.gray('  Executing Python in Void sandbox...\n'));

      try {
        const res = await fetch('http://localhost:3000/api/void/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: script, mode: 'python', profile: options.profile, timeout_ms: parseInt(options.timeout) }),
        });
        const result = await res.json();

        if (result.success) {
          if (result.output) {
            console.log(chalk.green(result.output));
          }
          console.log(chalk.gray(`\n  Executed in ${result.execution_time_ms}ms`));
        } else {
          if (result.output) console.log(result.output);
          if (result.error) console.log(chalk.red(`\n  ${result.error}`));
        }
        console.log();
      } catch (err) {
        console.log(chalk.red('  Void server not running.\n'));
      }
    });
}

export function voidHistoryCmd() {
  return new Command('history')
    .description('Show execution history')
    .option('-l, --limit <n>', 'Number of entries', '20')
    .option('--clear', 'Clear history')
    .action(async (options) => {
      if (options.clear) {
        try {
          await fetch('http://localhost:3000/api/void/history', { method: 'DELETE' });
          console.log(chalk.green('  History cleared\n'));
        } catch {
          console.log(chalk.red('  Void server not running\n'));
        }
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/void/history?limit=${options.limit}`);
        const data = await res.json();

        console.log(chalk.bold('\nVoid Execution History\n'));
        if (data.history.length === 0) {
          console.log(chalk.gray('  No executions yet.\n'));
          return;
        }

        for (const entry of data.history) {
          const icon = entry.success ? chalk.green('[OK]') : chalk.red('[ERR]');
          const time = new Date(entry.timestamp).toLocaleTimeString();
          console.log(`  ${icon} ${chalk.gray(time)} ${entry.profile} ${chalk.cyan(entry.mode)} -- ${entry.execution_time_ms}ms`);
          if (entry.error) {
            console.log(chalk.red(`    Error: ${entry.error.split('\n')[0]}`));
          }
        }
        console.log();
      } catch {
        console.log(chalk.red('  Void server not running\n'));
      }
    });
}

export function voidServerCmd() {
  return new Command('server')
    .description('Start Void server on :3000')
    .option('-p, --port <port>', 'Port number', '3000')
    .action(async (options) => {
      console.log(chalk.bold('\nStarting Void server...\n'));
      await startVoidServer(parseInt(options.port));
    });
}

export function voidConsoleCmd() {
  return new Command('console')
    .description('Launch interactive Void REPL')
    .action(async () => {
      console.log(chalk.bold('\nVoid Interactive Console\n'));
      console.log(chalk.dim('  Type .exit to quit, .status for runtime info\n'));

      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk.magenta('void> '),
      });

      rl.prompt();

      rl.on('line', async (line) => {
        const input = line.trim();
        if (!input) { rl.prompt(); return; }
        if (input === '.exit') { rl.close(); return; }
        if (input === '.status') {
          try {
            const res = await fetch('http://localhost:3000/api/void/status');
            const data = await res.json();
            console.log(chalk.cyan(`  Active: ${data.active_executions}/${data.max_concurrent} | History: ${data.history_count}`));
          } catch {
            console.log(chalk.red('  Server not running'));
          }
          rl.prompt();
          return;
        }

        try {
          const res = await fetch('http://localhost:3000/api/void/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: input, mode: 'eval', profile: 'no-net' }),
          });
          const result = await res.json();
          if (result.success && result.output) {
            console.log(chalk.green(result.output));
          } else if (result.error) {
            console.log(chalk.red(result.error));
          }
        } catch (err) {
          console.log(chalk.red(`  Error: ${err.message}`));
        }
        rl.prompt();
      });

      rl.on('close', () => {
        console.log(chalk.dim('\n  Goodbye.\n'));
        process.exit(0);
      });
    });
}

// GUI Commands

export function voidGUICmd() {
  return new Command('gui')
    .description('Launch Void GUI -- Lilith sovereign terminal interface')
    .option('-p, --port <port>', 'Void server port', '3000')
    .option('--browser', 'Open browser automatically', false)
    .action(async (options) => {
      console.log(chalk.bold('\nLilith Sovereign Void GUI\n'));
      console.log(chalk.cyan('  Starting Void runtime on :') + options.port);
      console.log(chalk.gray('  GUI: http://localhost:' + options.port + '/api/void/gui\n'));

      try {
        await startVoidServer(parseInt(options.port));
      } catch (err) {
        if (err.message.includes('EADDRINUSE')) {
          console.log(chalk.yellow('  Void server already running on :' + options.port));
          console.log(chalk.gray('  Open http://localhost:' + options.port + '/api/void/gui in your browser\n'));
        } else {
          throw err;
        }
      }

      if (options.browser) {
        const { exec } = await import('child_process');
        exec(`xdg-open http://localhost:${options.port}/api/void/gui`);
      }

      process.on('SIGINT', () => {
        console.log(chalk.dim('\n  Void GUI stopped.\n'));
        process.exit(0);
      });
    });
}

export function voidVisualizationCmd() {
  return new Command('visualization')
    .description('Launch Black Hole Sun / Flower of Life / Pentagram visualization')
    .option('-p, --port <port>', 'Void server port', '3000')
    .option('--fullscreen', 'Open in fullscreen mode', false)
    .action(async (options) => {
      console.log(chalk.bold('\nVoid Visualization -- Black Hole Sun / Flower of Life / Pentagram\n'));

      try {
        await startVoidServer(parseInt(options.port));
      } catch (err) {
        if (err.message.includes('EADDRINUSE')) {
          console.log(chalk.yellow('  Void server already running on :' + options.port));
        } else {
          throw err;
        }
      }

      console.log(chalk.cyan('  GUI: http://localhost:' + options.port + '/api/void/gui'));
      console.log(chalk.gray('  Tab: Visualization\n'));

      const { exec } = await import('child_process');
      exec(`xdg-open http://localhost:${options.port}/api/void/gui#visualization`);

      process.on('SIGINT', () => {
        console.log(chalk.dim('\n  Visualization closed.\n'));
        process.exit(0);
      });
    });
}

export default { voidStatusCmd, voidExecCmd, voidPythonCmd, voidHistoryCmd, voidServerCmd, voidConsoleCmd, voidGUICmd, voidVisualizationCmd };