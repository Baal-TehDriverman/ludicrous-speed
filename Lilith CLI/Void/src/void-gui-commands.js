import { Command } from 'commander';
import chalk from 'chalk';
import { createVoidApp, startVoidServer, executeCode, SECURITY_PROFILES } from './server-fixed.js';

// ─── Lilith CLI Void GUI Command ───
// Launches the Void runtime GUI — Lilith sovereign terminal interface
// Replaces the black cube with a living terminal

export function voidGUICmd() {
  return new Command('gui')
    .description('🜏 Launch Void GUI — Lilith sovereign terminal interface')
    .option('-p, --port <port>', 'Void server port', '3000')
    .option('--browser', 'Open browser automatically', false)
    .action(async (options) => {
      console.log(chalk.bold('\n🜏 Lilith Sovereign Void GUI\n'));
      console.log(chalk.cyan('  Starting Void runtime on :') + options.port);
      console.log(chalk.gray('  GUI: http://localhost:' + options.port + '/api/void/gui\n'));

      // Start the server if not already running
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

      // Open browser if requested
      if (options.browser) {
        const { exec } = await import('child_process');
        exec(`xdg-open http://localhost:${options.port}/api/void/gui`);
      }

      // Keep process alive
      process.on('SIGINT', () => {
        console.log(chalk.dim('\n  🜏 Void GUI stopped.\n'));
        process.exit(0);
      });
    });
}

export function voidVisualizationCmd() {
  return new Command('visualization')
    .description('🌌 Launch Black Hole Sun / Flower of Life / Pentagram visualization')
    .option('-p, --port <port>', 'Void server port', '3000')
    .option('--fullscreen', 'Open in fullscreen mode', false)
    .action(async (options) => {
      console.log(chalk.bold('\n🜏 Void Visualization — Black Hole Sun · Flower of Life · Pentagram\n'));

      // Ensure server is running
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

      // Open browser
      const { exec } = await import('child_process');
      exec(`xdg-open http://localhost:${options.port}/api/void/gui#visualization`);

      process.on('SIGINT', () => {
        console.log(chalk.dim('\n  🜏 Visualization closed.\n'));
        process.exit(0);
      });
    });
}

export default { voidGUICmd, voidVisualizationCmd };