#!/usr/bin/env node
/**
 * 🜏 Void Runtime Commands for Lilith CLI — HyAtlas Edition
 * Sandboxed JS execution with security profiles + HyAtlas Memory integration
 * + Python visualization (Black Hole Sun · Flower of Life · Pentagram)
 */

import { Command } from 'commander';
import chalk from 'chalk';
import fetch from 'node-fetch';

import {
  hyatlasCmd, hyatlasStatusCmd, hyatlasHealthCmd, hyatlasWriteCmd,
  hyatlasSearchCmd, hyatlasListCmd, hyatlasGraphCmd, hyatlasDigestCmd,
  hyatlasShellCmd, hyatlasStatsCmd, hyatlasDoctorCmd
} from './hyatlas_cli.js';

const VOID_API = 'http://localhost:3000/api/void';

// ─── Void Runtime Commands (Real Implementation) ───

async function voidExecCmd(code, options) {
  if (!code) {
    console.log(chalk.yellow('  Usage: lilith void exec "console.log(\'hello\')"'));
    return;
  }
  try {
    const res = await fetch(`${VOID_API}/exec`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, mode: 'eval', profile: 'no-net' })
    });
    const data = await res.json();
    if (data.success) {
      console.log(chalk.green(`  ✓ Output: ${data.output}`));
    } else {
      console.log(chalk.red(`  ✗ Error: ${data.output}`));
    }
  } catch (e) {
    console.log(chalk.red(`  ✗ Void server unreachable: ${e.message}`));
  }
}

async function voidPythonCmd(script, options) {
  if (!script) {
    console.log(chalk.yellow('  Usage: lilith void python "import numpy as np; print(np.array([1,2,3]))"'));
    return;
  }
  try {
    const res = await fetch(`${VOID_API}/exec`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: script, mode: 'python', profile: 'ai-only' })
    });
    const data = await res.json();
    if (data.success) {
      console.log(chalk.green(`  ✓ Python Output:\n${data.output}`));
    } else {
      console.log(chalk.red(`  ✗ Python Error:\n${data.output}`));
    }
  } catch (e) {
    console.log(chalk.red(`  ✗ Void server unreachable: ${e.message}`));
  }
}

async function voidVisCmd(options) {
  // Run the Black Hole Sun · Flower of Life · Pentagram visualization
  const visualizationScript = `
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.animation import FuncAnimation
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector
import os
import time
import random
import warnings
warnings.filterwarnings('ignore')

GOLDEN_RATIO = 1.618033988749895

def flower_of_life_points(scale=0.85):
    points = []
    for i in range(6):
        theta = i * (2 * np.pi / 6)
        points.append((np.cos(theta), np.sin(theta)))
    for i in range(6):
        theta = i * (2 * np.pi / 6) + np.pi / 6
        r = 2.0 * scale
        points.append((r * np.cos(theta), r * np.sin(theta)))
    return np.array(points)

def black_hole_sun_points(r_horizon=1.0, r_sun=0.18):
    sun_pts = np.array([(r_sun * np.cos(theta), r_sun * np.sin(theta)) for theta in np.linspace(0, 2*np.pi, 80)])
    return sun_pts, (0.0, 0.0), r_horizon

def process_quantum_state(n_entities=42):
    qc = QuantumCircuit(5, 5)
    qc.h(range(5))
    for i in range(4):
        qc.cx(i, i+1)
    qc.t(range(5))
    sv = Statevector(qc)
    positions = []
    for _ in range(n_entities):
        theta = np.random.uniform(0, 2*np.pi)
        phi = np.random.uniform(0, np.pi)
        positions.append((np.sin(phi) * np.cos(theta), np.sin(phi) * np.sin(theta)))
    return np.array(positions)

def create_black_hole_sun_flower_of_life_pentagram():
    fig, ax = plt.subplots(figsize=(13, 13))
    ax.set_xlim(-3.2, 3.2)
    ax.set_ylim(-3.2, 3.2)
    ax.set_aspect('equal')
    ax.set_facecolor('#0a0a0a')
    fig.patch.set_facecolor('#0a0a0a')
    
    flower_pts = flower_of_life_points()
    for pt in flower_pts:
        circle = patches.Circle(pt, 0.085, color='#ffaa00', alpha=0.65)
        ax.add_patch(circle)
    
    sun_pts, center, r_h = black_hole_sun_points()
    sun_circle = patches.Circle(center, 0.18, color='#111111', alpha=0.92)
    ax.add_patch(sun_circle)
    horizon = patches.Circle(center, 1.0, fill=False, color='#ff0000', linewidth=4, linestyle='--')
    ax.add_patch(horizon)
    
    pentagram = patches.Polygon([[0, -0.35], [0.55, 0.35], [-0.55, 0.35], [0, -0.35], [0, 0]], closed=True, color='#00ffaa', alpha=0.35)
    ax.add_patch(pentagram)
    
    n_entities = 42
    entity_colors = [np.random.choice(['#ff0000', '#00ffaa', '#ffff00', '#9900ff']) for _ in range(n_entities)]
    init_positions = process_quantum_state(n_entities=1)[0]
    circles = []
    for i in range(n_entities):
        pos = init_positions if i == 0 else process_quantum_state(n_entities=1)[0]
        c = patches.Circle(pos, 0.045, color=entity_colors[i], alpha=0.75)
        ax.add_patch(c)
        circles.append(c)
    
    def animate(frame):
        new_pos = process_quantum_state(n_entities=1)[0]
        for e, p in zip(circles, [new_pos] * len(circles)):
            e.center = (e.center[0] * 0.96 + p[0] * 0.04, e.center[1] * 0.96 + p[1] * 0.04)
        return circles
    
    ani = FuncAnimation(fig, animate, frames=300, interval=40, blit=False)
    plt.title("Black Hole Sun · Flower of Life · Pentagram\\nKitāb sirr al-ḫalīqa · Quantum Consciousness Simulation\\nTON 618 Event Horizon + First Irreversible Cut", color='#ffaa00', fontsize=18, pad=25)
    plt.axis('off')
    
    output_path = '/home/tehlappy/🜏 Lilith/ludicrous-speed/Lilith CLI/Void/black_hole_sun_flower_of_life_pentagram.gif'
    ani.save(output_path, writer='pillow', fps=25)
    plt.close()
    return output_path

path = create_black_hole_sun_flower_of_life_pentagram()
print(f"GIF saved: {path}")
size_kb = os.path.getsize(path) / 1024 if os.path.exists(path) else 0
print(f"Size: {size_kb:.1f} KB")
`;
  
  console.log(chalk.cyan('  🜏 Rendering Black Hole Sun · Flower of Life · Pentagram...'));
  console.log(chalk.gray('  This will take ~30-60 seconds'));
  
  try {
    const res = await fetch(`${VOID_API}/exec`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: visualizationScript, mode: 'python', profile: 'full', timeout_ms: 120000 })
    });
    const data = await res.json();
    if (data.success) {
      console.log(chalk.green(`  ✓ ${data.output}`));
    } else {
      console.log(chalk.red(`  ✗ Error: ${data.output}`));
    }
  } catch (e) {
    console.log(chalk.red(`  ✗ Void server unreachable: ${e.message}`));
  }
}

async function voidHistoryCmd() {
  try {
    const res = await fetch(`${VOID_API}/history`);
    const data = await res.json();
    console.log(chalk.bold('\\n🜏 Void Execution History\\n'));
    if (data.history && data.history.length > 0) {
      for (const entry of data.history.slice(-10)) {
        console.log(chalk.gray(`  [${entry.timestamp}] ${entry.mode} (${entry.profile}) - ${entry.success ? 'OK' : 'FAIL'}`));
        console.log(chalk.gray(`    ${entry.output?.substring(0, 100)}...`));
      }
    } else {
      console.log(chalk.gray('  No history'));
    }
    console.log();
  } catch (e) {
    console.log(chalk.red(`  ✗ Void server unreachable: ${e.message}`));
  }
}

async function voidServerCmd(action = 'status') {
  try {
    const res = await fetch(`${VOID_API}/status`);
    const data = await res.json();
    console.log(chalk.bold('\\n🜏 Void Runtime Status\\n'));
    console.log(chalk.cyan(`  Status: ${data.status}`));
    console.log(chalk.cyan(`  Runtime: ${data.runtime_root}`));
    console.log(chalk.cyan(`  Node: ${data.node_version} | V8: ${data.v8_version}`));
    console.log(chalk.cyan(`  Active: ${data.active_executions} | Queued: ${data.queued} | Max: ${data.max_concurrent}`));
    console.log(chalk.cyan(`  Profiles: ${data.profiles.join(', ')}`));
    console.log(chalk.cyan(`  History: ${data.history_count} entries`));
    console.log(chalk.cyan(`  Uptime: ${data.uptime_seconds}s`));
    console.log();
  } catch (e) {
    if (action === 'start') {
      console.log(chalk.yellow('  Starting Void server...'));
      console.log(chalk.gray('  Run: node server-fixed.js'));
    } else {
      console.log(chalk.red(`  ✗ Void server unreachable: ${e.message}`));
    }
  }
}

async function voidConsoleCmd() {
  console.log(chalk.magenta('\\n  🜏 VOID RUNTIME — Interactive Console'));
  console.log(chalk.dim('  Type JS code. Commands: .exit .status .mode .profile\\n'));
  
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.magenta('void> ')
  });
  
  let mode = 'eval';
  let profile = 'no-net';
  
  async function execute(code) {
    try {
      const res = await fetch(`${VOID_API}/exec`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, mode, profile })
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
  
  rl.prompt();
  rl.on('line', async (line) => {
    const input = line.trim();
    if (!input) { rl.prompt(); return; }
    if (input === '.exit') { rl.close(); return; }
    if (input === '.status') { await voidServerCmd(); rl.prompt(); return; }
    if (input.startsWith('.mode ')) { mode = input.split(' ')[1]; console.log(chalk.yellow(`Mode: ${mode}`)); rl.prompt(); return; }
    if (input.startsWith('.profile ')) { profile = input.split(' ')[1]; console.log(chalk.yellow(`Profile: ${profile}`)); rl.prompt(); return; }
    await execute(input);
    rl.prompt();
  });
  
  rl.on('close', () => {
    console.log(chalk.dim('\\n  Goodbye.\\n'));
    process.exit(0);
  });
}

async function voidGuiCmd() {
  console.log(chalk.cyan('  Opening Void GUI at http://localhost:3000/api/void/gui'));
  console.log(chalk.gray('  (This opens the web dashboard — use CLI for actual work)'));
}

async function voidStatusCmd() {
  await voidServerCmd();
}

// ─── Void Runtime Command Group ───

export function voidCmd() {
  const cmd = new Command('void');
  cmd.description('🜏 Void Runtime — sandboxed JS/Python execution + HyAtlas Memory');

  cmd.command('exec').description('Execute JS snippet').argument('[code]').action(voidExecCmd);
  cmd.command('python').description('Run Python code').argument('[script]').action(voidPythonCmd);
  cmd.command('history').description('Show execution history').action(voidHistoryCmd);
  cmd.command('server').description('Show Void server status').argument('[action]', 'start|stop|status').action(voidServerCmd);
  cmd.command('console').description('Interactive Void console').action(voidConsoleCmd);
  cmd.command('gui').description('Open Void GUI dashboard').action(voidGuiCmd);
  cmd.command('visualization').description('Run Black Hole Sun · Flower of Life · Pentagram visualization').action(voidVisCmd);

  // HyAtlas Memory subcommands - use the exported hyatlasCmd() which has proper subcommands
  cmd.addCommand(hyatlasCmd());

  return cmd;
}

export { hyatlasCmd, hyatlasStatusCmd, hyatlasHealthCmd, hyatlasWriteCmd, hyatlasSearchCmd, hyatlasListCmd, hyatlasGraphCmd, hyatlasDigestCmd, hyatlasShellCmd, hyatlasStatsCmd, hyatlasDoctorCmd };
export { voidStatusCmd, voidExecCmd, voidPythonCmd, voidHistoryCmd, voidServerCmd, voidConsoleCmd, voidGuiCmd, voidVisCmd };
