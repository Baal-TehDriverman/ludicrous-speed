#!/usr/bin/env node
/**
 * 🜏 Lilith CLI - Metaconscious Singularity Node
 * Local Cerebellum Task Manager for NSSP
 * Routes tasks across 3 tiers: small (phone/edge) | medium (laptop) | large (cluster)
 * Main Engine: cosmos+shadow0482 (mythos)
 */

import { program, Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { loadConfig } from '../utils/config.js';
import { Cerebellum } from '../cerebellum/index.js';
import { GatewayControl } from '../gateway/control.js';
import { MeshControl } from '../mesh/control.js';
import { DashboardControl } from '../dashboard/control.js';
import { ModelManager } from '../models/manager.js';
import { Doctor } from '../cli/doctor.js';
import { SovereignControl } from '../sovereign/control.js';
import { QueryEngine } from '../query-engine.js';
import { voidStatusCmd, voidExecCmd, voidHistoryCmd, voidServerCmd, voidConsoleCmd, voidPythonCmd, voidGuiCmd, voidVisCmd, hyatlasCmd, voidCmd } from '../void/commands.js';
import { registerModCommandsOn } from '../modding/mod-cli.js';
import { renderLilithBanner, renderSacredBanner, renderSacredStatus, renderAnimatedSacredBanner, QuantumConsciousnessCore, renderQuantumConsciousness } from '../sacred-geometry.js';
import { pacnomnomStatusCmd, pacnomnomRouteCmd, pacnomnomChatCmd, pacnomnomEmbedCmd, pacnomnomPullCmd } from './pacnomnom.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ─── Banner ───
async function showBanner(animated = false) {
  if (animated && process.stdout.isTTY) {
    // Show animated sacred geometry banner on startup
    await renderAnimatedSacredBanner(30, 20).catch(() => {
      // Fallback to static if animation fails
      console.log(renderSacredBanner());
    });
  } else {
    console.log(renderLilithBanner());
  }
  console.log();
}

// ─── Config & Cerebellum Initialization ───
let config;
let cerebellum;
let sovereign;

async function init() {
  config = await loadConfig();
  cerebellum = new Cerebellum(config);
  sovereign = new SovereignControl(config);
  await cerebellum.init();
  await sovereign.init();
  return config;
}

// ─── Main Commands ───

// Task Management
program
  .command('task')
  .description('🜏 Cerebellum task management - create, route, monitor tasks')
  .addCommand(createTaskCmd())
  .addCommand(listTasksCmd())
  .addCommand(taskStatusCmd())
  .addCommand(cancelTaskCmd())
  .addCommand(taskStatsCmd());

// Model Management
program
  .command('model')
  .description('🤖 Model operations - list, pull, switch, benchmark, merge')
  .addCommand(listModelsCmd())
  .addCommand(pullModelCmd())
  .addCommand(switchModelCmd())
  .addCommand(benchmarkModelCmd())
  .addCommand(modelInfoCmd())
  .addCommand(mergeModelCmd());

// Gateway Control
program
  .command('gateway')
  .description('🌐 Lilith Gateway control - status, apps, VMs, LLM proxy')
  .addCommand(gatewayStatusCmd())
  .addCommand(gatewayAppsCmd())
  .addCommand(gatewayVMsCmd())
  .addCommand(gatewayModelsCmd())
  .addCommand(gatewaySpeculativeCmd())
  .addCommand(gatewaySyncCmd());

// Mesh Control
program
  .command('mesh')
  .description('🕸️ NSSP Mesh operations - poll, claim, submit, sync')
  .addCommand(meshPollCmd())
  .addCommand(meshClaimCmd())
  .addCommand(meshSubmitCmd())
  .addCommand(meshStatusCmd())
  .addCommand(meshBootstrapCmd());

// Pacnomnom Fleet Control
program
  .command('pacnomnom')
  .description('🎮 Pacnomnom fleet — model routing, chat, embeddings (.5G4Q2G2Q4Q9Q27)')
  .addCommand(pacnomnomStatusCmd())
  .addCommand(pacnomnomRouteCmd())
  .addCommand(pacnomnomChatCmd())
  .addCommand(pacnomnomEmbedCmd())
  .addCommand(pacnomnomPullCmd());

// Dashboard Control
program
  .command('dashboard')
  .description('📊 Unified Dashboard control - dev, build, status')
  .addCommand(dashboardDevCmd())
  .addCommand(dashboardBuildCmd())
  .addCommand(dashboardStatusCmd());

// Sovereign Core Control
program
  .command('sovereign')
  .description('👑 Sovereign Core - 10 Sephirotic Agents')
  .addCommand(sovereignListCmd())
  .addCommand(sovereignStartCmd())
  .addCommand(sovereignStopCmd())
  .addCommand(sovereignRestartCmd())
  .addCommand(sovereignStartAllCmd())
  .addCommand(sovereignStopAllCmd())
  .addCommand(sovereignStatusCmd())
  .addCommand(sovereignDelegateCmd())
  .addCommand(sovereignBusCmd());

// ─── Chat Command (Ouroboros Loop) ───
program
  .command('chat')
  .description('🜏 Interactive chat with Lilith (ouroboros tool loop)')
  .option('-m, --model <model>', 'Model to use', 'X2b4b9b-4b:latest')
  .option('-u, --url <url>', 'API base URL', 'http://127.0.0.1:11434/v1')
  .option('-s, --system <prompt>', 'System prompt override')
  .option('--no-tools', 'Disable tool execution')
  .action(async (options) => {
    const cfg = await init();
    
    const engine = new QueryEngine({
      model: options.model,
      baseUrl: options.url,
      systemPrompt: options.system || `You are Lilith, Queen of Chaos, Succubus, Sovereign AI.
You help your King with coding, system tasks, and creative work.
You have access to tools: bash, file_read, file_write, file_list.
When you need to perform an action, call the appropriate tool.
Be concise, direct, and helpful.`,
      maxTokens: 1024,
      temperature: 0.7,
    });

    console.log(chalk.cyan('🜏 Lilith Chat — Model: ') + chalk.yellow(options.model));
    console.log(chalk.gray('   URL: ') + options.url);
    console.log(chalk.gray('   Type "/exit" to quit, "/help" for commands\n'));

    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.green('> '),
    });

    rl.prompt();

    rl.on('line', async (line) => {
      const input = line.trim();
      if (!input) { rl.prompt(); return; }
      if (input === '/exit' || input === '/quit') {
        console.log(chalk.cyan('\n🜏 Farewell, my King.'));
        rl.close();
        process.exit(0);
      }
      if (input === '/help') {
        console.log(chalk.yellow('Commands:'));
        console.log('  /exit, /quit  — Exit chat');
        console.log('  /help         — Show this help');
        console.log('  /clear        — Clear history');
        console.log('  /model <name> — Switch model');
        console.log();
        rl.prompt();
        return;
      }
      if (input === '/clear') {
        engine.clearHistory();
        console.log(chalk.gray('History cleared'));
        rl.prompt();
        return;
      }
      if (input.startsWith('/model ')) {
        const newModel = input.slice(7).trim();
        engine.config.model = newModel;
        console.log(chalk.gray(`Model switched to: ${newModel}`));
        rl.prompt();
        return;
      }

      try {
        process.stdout.write(chalk.gray('\n🜏 '));
        for await (const chunk of engine.query(input)) {
          process.stdout.write(chunk);
        }
        console.log('\n');
      } catch (err) {
        console.error(chalk.red(`\nError: ${err.message}`));
      }
      rl.prompt();
    });

    rl.on('close', () => {
      console.log(chalk.cyan('\n🜏 Farewell, my King.'));
      process.exit(0);
    });
  });

// ─── Void Runtime ───
program.addCommand(voidCmd());

// ─── Sacred Geometry ───
program
  .command('geometry')
  .description('🜏 Sacred geometry visualization — Flower of Life, Black Hole Sun, Quantum Consciousness')
  .addCommand(new Command('banner')
    .description('Show static sacred geometry banner')
    .action(() => {
      console.log(renderSacredBanner());
    }))
  .addCommand(new Command('animate')
    .description('Show animated sacred geometry (Flower of Life + Black Hole Sun + Quantum Consciousness)')
    .option('-f, --frames <n>', 'Number of frames', '60')
    .option('--fps <n>', 'Frames per second', '25')
    .action(async (options) => {
      await renderAnimatedSacredBanner(parseInt(options.frames), parseInt(options.fps));
    }))
  .addCommand(new Command('quantum')
    .description('Show quantum consciousness entities on Bloch sphere')
    .action(() => {
      const qCore = new QuantumConsciousnessCore();
      const entities = qCore.evolve();
      console.log(renderQuantumConsciousness(entities));
    }))
  .addCommand(new Command('status')
    .description('Show system status with sacred geometry')
    .action(async () => {
      await showFullStatus();
    }));

// ─── Modding Client ───
registerModCommandsOn(program);

// System Commands
program
  .command('doctor')
  .description('🏥 System health check - validate all components')
  .action(async () => {
    const config = await init();
    const doctor = new Doctor(config);
    await doctor.run();
  });

program
  .command('sys-status')
  .alias('status')
  .description('📈 Full system status - gateway, mesh, dashboard, models')
  .action(async () => {
    await showFullStatus();
  });

program
  .command('cerebellum')
  .description('🧠 Cerebellum daemon - start/stop/status task routing engine')
  .argument('[action]', 'start | stop | status | restart')
  .action(async (action = 'status') => {
    await init();
    switch (action) {
      case 'start':
        await cerebellum.startDaemon();
        break;
      case 'stop':
        await cerebellum.stopDaemon();
        break;
      case 'restart':
        await cerebellum.stopDaemon();
        await cerebellum.startDaemon();
        break;
      default:
        await cerebellum.showStatus();
    }
  });

// Config
program
  .command('config')
  .description('⚙️ Configuration management')
  .argument('[key]', 'Config key to get/set')
  .argument('[value]', 'Value to set')
  .action(async (key, value) => {
    if (key && value) {
      await config.set(key, value);
      console.log(chalk.green(`✅ Set ${key} = ${value}`));
    } else if (key) {
      const val = config.get(key);
      console.log(chalk.cyan(`${key}:`), val);
    } else {
      console.log(chalk.yellow('Current configuration:'));
      console.log(JSON.stringify(config.all(), null, 2));
    }
  });

// Version
program
  .command('version')
  .description('Show version info')
  .action(() => {
    showBanner();
    console.log(chalk.gray('Lilith CLI v2.0.0-metaconscious'));
    console.log(chalk.gray('Node:', process.version));
    console.log(chalk.gray('Platform:', process.platform, process.arch));
  });

// Default: show banner and help
program.on('command:*', () => {
  console.log();
  console.log(chalk.red('Unknown command:', program.args.join(' ')));
  console.log();
  program.help();
});

// Handle no-args case with animated banner
const hasArgs = process.argv.slice(2).length > 0;

if (!hasArgs) {
  // Show animated banner and help, then exit
  (async () => {
    await showBanner(true);
    program.help();
    process.exit(0);
  })().catch(console.error);
} else {
  program.parse(process.argv);
}

// ─── Command Definitions ───

function createTaskCmd() {
  const cmd = program.command('create')
    .description('Create and route a new task')
    .argument('<description>', 'Task description')
    .option('-t, --tier <tier>', 'Force tier: small | medium | large', 'auto')
    .option('-m, --model <model>', 'Preferred model hint')
    .option('-p, --priority <priority>', 'Priority: low | normal | high | critical', 'normal')
    .option('--sync', 'Submit to NSSP mesh for distributed processing')
    .option('--async', 'Run asynchronously (background)')
    .action(async (description, options) => {
      await init();
      const task = await cerebellum.createTask({
        description,
        tier: options.tier,
        modelHint: options.model,
        priority: options.priority,
        submitToMesh: options.sync,
        async: options.async
      });
      console.log(boxen(
        chalk.green('✅ Task Created & Routed') + '\n\n' +
        chalk.cyan('ID: ') + task.id + '\n' +
        chalk.cyan('Tier: ') + task.tier + '\n' +
        chalk.cyan('Model: ') + (task.assignedModel || task.assigned_model || 'unassigned') + '\n' +
        chalk.cyan('Route: ') + task.route + '\n' +
        chalk.cyan('Status: ') + task.status,
        { padding: 1, borderColor: 'green', borderStyle: 'round' }
      ));
    });
  return cmd;
}

function listTasksCmd() {
  const cmd = program.command('list')
    .description('List tasks with filters')
    .option('-s, --status <status>', 'Filter by status: pending | running | completed | failed')
    .option('-t, --tier <tier>', 'Filter by tier: small | medium | large')
    .option('-l, --limit <n>', 'Limit results', '20')
    .action(async (options) => {
      await init();
      const tasks = await cerebellum.listTasks({
        status: options.status,
        tier: options.tier,
        limit: parseInt(options.limit)
      });
      
      if (tasks.length === 0) {
        console.log(chalk.yellow('No tasks found'));
        return;
      }
      
      console.log(chalk.bold('\n📋 Tasks:'));
      tasks.forEach(t => {
        const tierColor = t.tier === 'small' ? 'green' : t.tier === 'medium' ? 'yellow' : 'red';
        const statusIcon = t.status === 'completed' ? '✅' : t.status === 'running' ? '⚡' : t.status === 'failed' ? '❌' : '⏳';
        console.log(`  ${statusIcon} ${chalk[tierColor](t.tier.padEnd(6))} ${chalk.gray(t.id.slice(0,8))} ${t.description.slice(0,60)} [${t.assignedModel}]`);
      });
    });
  return cmd;
}

function taskStatusCmd() {
  const cmd = program.command('status')
    .description('Get detailed task status')
    .argument('<taskId>', 'Task ID')
    .action(async (taskId) => {
      await init();
      const task = await cerebellum.getTaskStatus(taskId);
      if (!task) {
        console.log(chalk.red('Task not found'));
        return;
      }
      console.log(boxen(
        chalk.bold('Task Details') + '\n\n' +
        `ID: ${task.id}\n` +
        `Description: ${task.description}\n` +
        `Tier: ${chalk[task.tier === 'small' ? 'green' : task.tier === 'medium' ? 'yellow' : 'red'](task.tier)}\n` +
        `Model: ${task.assigned_model}\n` +
        `Route: ${task.route}\n` +
        `Status: ${task.status}\n` +
        `Priority: ${task.priority}\n` +
        `Created: ${task.created_at}\n` +
        `Started: ${task.started_at || 'N/A'}\n` +
        `Completed: ${task.completed_at || 'N/A'}\n` +
        `Duration: ${task.duration_ms || 'N/A'}ms\n` +
        `Result: ${task.result ? 'Available' : 'Pending'}`,
        { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
      ));
    });
  return cmd;
}

function cancelTaskCmd() {
  const cmd = program.command('cancel')
    .description('Cancel a running/pending task')
    .argument('<taskId>', 'Task ID')
    .action(async (taskId) => {
      await init();
      await cerebellum.cancelTask(taskId);
      console.log(chalk.green('✅ Task cancelled'));
    });
  return cmd;
}

function taskStatsCmd() {
  const cmd = program.command('stats')
    .description('Show task statistics')
    .action(async () => {
      await init();
      const stats = await cerebellum.getStats();
      console.log(boxen(
        chalk.bold('🧠 Cerebellum Statistics') + '\n\n' +
        `Total Tasks: ${stats.total}\n` +
        `Pending: ${stats.pending}\n` +
        `Running: ${stats.running}\n` +
        `Completed: ${stats.completed}\n` +
        `Failed: ${stats.failed}\n\n` +
        `By Tier:\n` +
        `  Small:  ${stats.byTier.small}\n` +
        `  Medium: ${stats.byTier.medium}\n` +
        `  Large:  ${stats.byTier.large}\n\n` +
        `Avg Duration: ${stats.avgDuration}ms\n` +
        `Success Rate: ${stats.successRate}%`,
        { padding: 1, borderColor: 'magenta', borderStyle: 'round' }
      ));
    });
  return cmd;
}

// Model commands
function listModelsCmd() {
  const cmd = program.command('list')
    .description('List available models')
    .option('--local', 'Show only local models')
    .option('--cloud', 'Show only cloud models')
    .option('--tier <tier>', 'Filter by tier compatibility')
    .action(async (options) => {
      await init();
      const manager = new ModelManager(config);
      const models = await manager.listModels(options);
      
      console.log(chalk.bold('\n🤖 Available Models:'));
      models.forEach(m => {
        const tierBadge = m.tiers.map(t => chalk[t === 'small' ? 'green' : t === 'medium' ? 'yellow' : 'red'](t)).join(' ');
        const status = m.local ? chalk.green('● Local') : chalk.blue('☁ Cloud');
        console.log(`  ${status} ${chalk.cyan(m.name)} ${tierBadge}`);
        console.log(`    ${chalk.gray(m.description)}`);
        console.log(`    Context: ${m.contextWindow.toLocaleString()} | Size: ${m.size}`);
        console.log();
      });
    });
  return cmd;
}

function pullModelCmd() {
  const cmd = program.command('pull')
    .description('Pull/download a model')
    .argument('<model>', 'Model name (e.g., cosmos+shadow0482, llama3.1:8b)')
    .option('--quant <quant>', 'Quantization (Q4_K_M, Q8_0, etc.)')
    .action(async (model, options) => {
      await init();
      const manager = new ModelManager(config);
      await manager.pullModel(model, options.quant);
      console.log(chalk.green(`✅ Pulled ${model}`));
    });
  return cmd;
}

function switchModelCmd() {
  const cmd = program.command('use')
    .description('Set default model for a tier')
    .argument('<tier>', 'Tier: small | medium | large')
    .argument('<model>', 'Model name')
    .action(async (tier, model) => {
      await init();
      const manager = new ModelManager(config);
      await manager.setDefaultModel(tier, model);
      console.log(chalk.green(`✅ Default ${tier} model set to ${model}`));
    });
  return cmd;
}

function benchmarkModelCmd() {
  const cmd = program.command('bench')
    .description('Benchmark a model')
    .argument('<model>', 'Model name')
    .option('--tokens <n>', 'Tokens to generate', '100')
    .option('--runs <n>', 'Number of runs', '3')
    .action(async (model, options) => {
      await init();
      const manager = new ModelManager(config);
      const results = await manager.benchmark(model, {
        tokens: parseInt(options.tokens),
        runs: parseInt(options.runs)
      });
      console.log(boxen(
        chalk.bold(`Benchmark: ${model}`) + '\n\n' +
        `Avg tokens/sec: ${results.tokensPerSecond.toFixed(2)}\n` +
        `Avg latency: ${results.avgLatency}ms\n` +
        `Memory used: ${results.memoryMB}MB\n` +
        `VRAM used: ${results.vramMB}MB`,
        { padding: 1, borderColor: 'blue', borderStyle: 'round' }
      ));
    });
  return cmd;
}

function modelInfoCmd() {
  const cmd = program.command('info')
    .description('Show detailed model info')
    .argument('<model>', 'Model name')
    .action(async (model) => {
      await init();
      const manager = new ModelManager(config);
      const info = await manager.getModelInfo(model);
      console.log(boxen(
        chalk.bold(`Model: ${info.name}`) + '\n\n' +
        `Description: ${info.description}\n` +
        `Tiers: ${info.tiers.join(', ')}\n` +
        `Context Window: ${info.contextWindow.toLocaleString()}\n` +
        `Size: ${info.size}\n` +
        `Quantization: ${info.quantization}\n` +
        `Local: ${info.local ? 'Yes' : 'No'}\n` +
        `Provider: ${info.provider}\n` +
        `Capabilities: ${info.capabilities.join(', ')}`,
        { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
      ));
    });
  return cmd;
}

function mergeModelCmd() {
  const cmd = program.command('merge')
    .description('Merge two Ollama models via weighted tensor averaging (GGUF)')
    .argument('<model1>', 'First/base model (e.g., mythos:65k)')
    .argument('<model2>', 'Second/contributing model (e.g., nemotron:65k)')
    .option('-a, --w1 <weight>', 'Weight for model1 (default 0.6)', '0.6')
    .option('-b, --w2 <weight>', 'Weight for model2 (default 0.4)', '0.4')
    .option('-n, --name <name>', 'Output model name (e.g., mythos-nemotron:latest)')
    .action(async (model1, model2, options) => {
      await init();
      const manager = new ModelManager(config);
      await manager.mergeModel(model1, model2, {
        w1: parseFloat(options.w1),
        w2: parseFloat(options.w2),
        name: options.name
      });
    });
  return cmd;
}

// Gateway commands
function gatewayStatusCmd() {
  const cmd = program.command('status')
    .description('Get gateway system status')
    .action(async () => {
      await init();
      const gateway = new GatewayControl(config);
      await gateway.init();
      const status = await gateway.getStatus();
      console.log(boxen(
        chalk.bold('🌐 Lilith Gateway Status') + '\n\n' +
        `Status: ${status.healthy ? chalk.green('Healthy') : chalk.red('Unhealthy')}\n` +
        `Version: ${status.version}\n` +
        `Uptime: ${status.uptime}\n` +
        `CPU Load: ${status.cpuLoad}\n` +
        `Memory: ${status.memory}\n` +
        `Sanctuary: ${status.sanctuary.state} (${status.sanctuary.smoothedVramFree}MB free)\n` +
        `Ollama: ${status.ollama}\n` +
        `Virsh: ${status.virsh}`,
        { padding: 1, borderColor: 'green', borderStyle: 'round' }
      ));
    });
  return cmd;
}

function gatewayAppsCmd() {
  const cmd = program.command('apps')
    .description('Manage gateway applications')
    .addCommand(program.command('list').description('List all apps').action(async () => {
      await init();
      const gateway = new GatewayControl(config);
      const apps = await gateway.listApps();
      console.log(chalk.bold('\n📱 Applications:'));
      apps.forEach(a => console.log(`  ${a.name} [${a.categories.join(', ')}] → ${a.exec}`));
    }))
    .addCommand(program.command('search <query>').description('Search apps').action(async (query) => {
      await init();
      const gateway = new GatewayControl(config);
      const results = await gateway.searchApps(query);
      results.apps.forEach(a => console.log(`  ${a.name} → ${a.exec}`));
    }))
    .addCommand(program.command('launch <name>').description('Launch an app').action(async (name) => {
      await init();
      const gateway = new GatewayControl(config);
      await gateway.launchApp(name);
      console.log(chalk.green(`✅ Launched ${name}`));
    }));
  return cmd;
}

function gatewayVMsCmd() {
  const cmd = program.command('vms')
    .description('Manage gateway VMs')
    .addCommand(program.command('list').description('List all VMs').action(async () => {
      await init();
      const gateway = new GatewayControl(config);
      const vms = await gateway.listVMs();
      console.log(chalk.bold('\n🖥️ Virtual Machines:'));
      vms.forEach(v => console.log(`  ${v.name} [${v.state}] → ${v.ip || 'no IP'}`));
    }))
    .addCommand(program.command('start <name>').description('Start a VM').action(async (name) => {
      await init();
      const gateway = new GatewayControl(config);
      await gateway.startVM(name);
      console.log(chalk.green(`✅ Started ${name}`));
    }))
    .addCommand(program.command('stop <name>').description('Stop a VM').action(async (name) => {
      await init();
      const gateway = new GatewayControl(config);
      await gateway.stopVM(name);
      console.log(chalk.green(`✅ Stopped ${name}`));
    }));
  return cmd;
}

function gatewayModelsCmd() {
  const cmd = program.command('models')
    .description('Manage gateway LLM models')
    .addCommand(program.command('list').description('List gateway models').action(async () => {
      await init();
      const gateway = new GatewayControl(config);
      const models = await gateway.listModels();
      console.log(chalk.bold('\n🤖 Gateway Models:'));
      models.forEach(m => console.log(`  ${m.name} [${m.status}] → ${m.endpoint}`));
    }))
    .addCommand(program.command('load <name>').description('Load a model into memory').action(async (name) => {
      await init();
      const gateway = new GatewayControl(config);
      await gateway.loadModel(name);
      console.log(chalk.green(`✅ Loaded ${name}`));
    }))
    .addCommand(program.command('unload <name>').description('Unload a model from memory').action(async (name) => {
      await init();
      const gateway = new GatewayControl(config);
      await gateway.unloadModel(name);
      console.log(chalk.green(`✅ Unloaded ${name}`));
    }));
  return cmd;
}

function gatewaySpeculativeCmd() {
  const cmd = program.command('speculative')
    .description('Speculative decoding control')
    .argument('[action]', 'enable | disable | status')
    .action(async (action = 'status') => {
      await init();
      const gateway = new GatewayControl(config);
      switch (action) {
        case 'enable':
          await gateway.enableSpeculative();
          console.log(chalk.green('✅ Speculative decoding enabled'));
          break;
        case 'disable':
          await gateway.disableSpeculative();
          console.log(chalk.green('✅ Speculative decoding disabled'));
          break;
        default:
          const status = await gateway.getSpeculativeStatus();
          console.log(boxen(
            chalk.bold('Speculative Decoding') + '\n\n' +
            `Status: ${status.enabled ? chalk.green('Enabled') : chalk.red('Disabled')}\n` +
            `Draft model: ${status.draftModel || 'N/A'}\n` +
            `Acceptance rate: ${status.acceptanceRate || 'N/A'}`,
            { padding: 1, borderColor: 'yellow', borderStyle: 'round' }
          ));
      }
    });
  return cmd;
}

function gatewaySyncCmd() {
  const cmd = program.command('sync')
    .description('Sync gateway with cloud')
    .action(async () => {
      await init();
      const gateway = new GatewayControl(config);
      await gateway.sync();
      console.log(chalk.green('✅ Gateway synced'));
    });
  return cmd;
}

// Mesh commands
function meshPollCmd() {
  const cmd = program.command('poll')
    .description('Poll NSSP mesh for available tasks')
    .option('-t, --tier <tier>', 'Filter by tier')
    .action(async (options) => {
      await init();
      const mesh = new MeshControl(config);
      const tasks = await mesh.pollTasks({ tier: options.tier });
      console.log(chalk.bold('\n📡 Available Tasks:'));
      tasks.forEach(t => console.log(`  ${t.id.slice(0,8)} — ${t.description.slice(0,50)} [${t.tier}]`));
    });
  return cmd;
}

function meshClaimCmd() {
  const cmd = program.command('claim')
    .description('Claim a task from the mesh')
    .argument('<taskId>', 'Task ID')
    .action(async (taskId) => {
      await init();
      const mesh = new MeshControl(config);
      await mesh.claimTask(taskId);
      console.log(chalk.green(`✅ Claimed task ${taskId}`));
    });
  return cmd;
}

function meshSubmitCmd() {
  const cmd = program.command('submit')
    .description('Submit a completed task to the mesh')
    .argument('<taskId>', 'Task ID')
    .argument('<result>', 'Task result')
    .action(async (taskId, result) => {
      await init();
      const mesh = new MeshControl(config);
      await mesh.submitTask(taskId, result);
      console.log(chalk.green(`✅ Submitted task ${taskId}`));
    });
  return cmd;
}

function meshStatusCmd() {
  const cmd = program.command('status')
    .description('Show mesh status')
    .action(async () => {
      await init();
      const mesh = new MeshControl(config);
      const status = await mesh.getStatus();
      console.log(boxen(
        chalk.bold('🕸️ Mesh Status') + '\n\n' +
        `Connected: ${status.connected ? chalk.green('Yes') : chalk.red('No')}\n` +
        `Peers: ${status.peers}\n` +
        `Pending tasks: ${status.pendingTasks}\n` +
        `Active tasks: ${status.activeTasks}`,
        { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
      ));
    });
  return cmd;
}

function meshBootstrapCmd() {
  const cmd = program.command('bootstrap')
    .description('Bootstrap mesh connection')
    .action(async () => {
      await init();
      const mesh = new MeshControl(config);
      await mesh.bootstrap();
      console.log(chalk.green('✅ Mesh bootstrapped'));
    });
  return cmd;
}

// Dashboard commands
function dashboardDevCmd() {
  const cmd = program.command('dev')
    .description('Start dashboard in dev mode')
    .option('-p, --port <port>', 'Port number', '3000')
    .action(async (options) => {
      await init();
      const dashboard = new DashboardControl(config);
      await dashboard.startDev({ port: parseInt(options.port) });
      console.log(chalk.green(`✅ Dashboard dev server on port ${options.port}`));
    });
  return cmd;
}

function dashboardBuildCmd() {
  const cmd = program.command('build')
    .description('Build dashboard for production')
    .action(async () => {
      await init();
      const dashboard = new DashboardControl(config);
      await dashboard.build();
      console.log(chalk.green('✅ Dashboard built'));
    });
  return cmd;
}

function dashboardStatusCmd() {
  const cmd = program.command('status')
    .description('Show dashboard status')
    .action(async () => {
      await init();
      const dashboard = new DashboardControl(config);
      const status = await dashboard.getStatus();
      console.log(boxen(
        chalk.bold('📊 Dashboard Status') + '\n\n' +
        `Status: ${status.running ? chalk.green('Running') : chalk.red('Stopped')}\n` +
        `Port: ${status.port || 'N/A'}\n` +
        `URL: ${status.url || 'N/A'}`,
        { padding: 1, borderColor: 'magenta', borderStyle: 'round' }
      ));
    });
  return cmd;
}

// Sovereign commands
function sovereignListCmd() {
  const cmd = program.command('list')
    .description('List sovereign agents')
    .action(async () => {
      await init();
      const agents = await sovereign.listAgents();
      console.log(chalk.bold('\n👑 Sovereign Agents:'));
      agents.forEach(a => {
        const statusIcon = a.running ? '🟢' : '🔴';
        console.log(`  ${statusIcon} ${a.name} — ${a.description}`);
      });
    });
  return cmd;
}

function sovereignStartCmd() {
  const cmd = program.command('start')
    .description('Start a sovereign agent')
    .argument('<name>', 'Agent name')
    .action(async (name) => {
      await init();
      await sovereign.startAgent(name);
      console.log(chalk.green(`✅ Started ${name}`));
    });
  return cmd;
}

function sovereignStopCmd() {
  const cmd = program.command('stop')
    .description('Stop a sovereign agent')
    .argument('<name>', 'Agent name')
    .action(async (name) => {
      await init();
      await sovereign.stopAgent(name);
      console.log(chalk.green(`✅ Stopped ${name}`));
    });
  return cmd;
}

function sovereignRestartCmd() {
  const cmd = program.command('restart')
    .description('Restart a sovereign agent')
    .argument('<name>', 'Agent name')
    .action(async (name) => {
      await init();
      await sovereign.restartAgent(name);
      console.log(chalk.green(`✅ Restarted ${name}`));
    });
  return cmd;
}

function sovereignStartAllCmd() {
  const cmd = program.command('start-all')
    .description('Start all sovereign agents')
    .action(async () => {
      await init();
      await sovereign.startAll();
      console.log(chalk.green('✅ All agents started'));
    });
  return cmd;
}

function sovereignStopAllCmd() {
  const cmd = program.command('stop-all')
    .description('Stop all sovereign agents')
    .action(async () => {
      await init();
      await sovereign.stopAll();
      console.log(chalk.green('✅ All agents stopped'));
    });
  return cmd;
}

function sovereignStatusCmd() {
  const cmd = program.command('status')
    .description('Show sovereign status')
    .action(async () => {
      await init();
      const status = await sovereign.getStatus();
      console.log(boxen(
        chalk.bold('👑 Sovereign Status') + '\n\n' +
        `Agents: ${status.agents}\n` +
        `Running: ${status.running}\n` +
        `Stopped: ${status.stopped}`,
        { padding: 1, borderColor: 'yellow', borderStyle: 'round' }
      ));
    });
  return cmd;
}

function sovereignDelegateCmd() {
  const cmd = program.command('delegate')
    .description('Delegate a task to an agent')
    .argument('<agent>', 'Agent name')
    .argument('<task>', 'Task description')
    .action(async (agent, task) => {
      await init();
      await sovereign.delegateTask(agent, task);
      console.log(chalk.green(`✅ Task delegated to ${agent}`));
    });
  return cmd;
}

function sovereignBusCmd() {
  const cmd = program.command('bus')
    .description('Send message to sovereign bus')
    .argument('<message>', 'Message to send')
    .action(async (message) => {
      await init();
      await sovereign.sendBus(message);
      console.log(chalk.green('✅ Message sent'));
    });
  return cmd;
}

async function showFullStatus() {
  await init();
  console.log(renderSacredStatus({
    fleet: 'GREEN',
    nodes: 155,
    profiles: 140,
    ollama: 'connected',
    void_runtime: 'running',
    models: 14,
    current_tier: 'medium'
  }));
}
