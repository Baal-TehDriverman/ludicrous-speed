/**
 * 👑 Sovereign Core Control
 * Interface to the 10 Sephirotic Agents via Council Bus
 */

import { execa } from 'execa';
import chalk from 'chalk';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class SovereignControl {
  constructor(config) {
    this.config = config;
    this.sovereignDir = config.get('paths.repos.sovereign').replace('~', os.homedir());
    this.councilBusPath = join(this.sovereignDir, 'council_bus.db');
  }

  async init() {
    try {
      await fs.access(this.sovereignDir);
      return true;
    } catch {
      console.log(chalk.yellow('⚠️ Sovereign Core not found at', this.sovereignDir));
      return false;
    }
  }

  async convene(args = []) {
    if (!(await this.init())) return;

    const convenePath = join(this.sovereignDir, 'convene.py');
    try {
      await execa('python3', [convenePath, ...args], {
        cwd: this.sovereignDir,
        stdio: 'inherit'
      });
    } catch (error) {
      throw new Error(`Convene failed: ${error.message}`);
    }
  }

  async listAgents() {
    if (!(await this.init())) return [];

    const agents = [
      { id: 'keter', sephira: 1, name: 'Throne / Orchestrator', role: 'orchestrator', domain: 'Unity, highest consciousness, divine will' },
      { id: 'chokmah', sephira: 9, name: 'Wisdom/Father', role: 'worker', domain: 'Initiation, creative flash, pure potential' },
      { id: 'binah', sephira: 2, name: 'Understanding/Mother', role: 'worker', domain: 'Form, structure, gestational womb' },
      { id: 'chesed', sephira: 7, name: 'Mercy/Jupiter', role: 'worker', domain: 'Expansion, abundance, benevolent growth' },
      { id: 'geburah', sephira: 6, name: 'Severity/Mars', role: 'worker', domain: 'Contraction, discipline, judgment, boundaries' },
      { id: 'tiferet', sephira: 5, name: 'Beauty/Sun', role: 'worker', domain: 'Balance, harmony, integration, heart center' },
      { id: 'netzach', sephira: 3, name: 'Victory/Venus', role: 'worker', domain: 'Eternity, networks, endurance, victory' },
      { id: 'hod', sephira: 1, name: 'Glory/Mercury', role: 'worker', domain: 'Splendor, communication, intellect, precision' },
      { id: 'yesod', sephira: 8, name: 'Foundation/Moon', role: 'worker', domain: 'Connection, interface, subconscious, dreams' },
      { id: 'malkuth', sephira: 4, name: 'Kingdom/Earth', role: 'worker', domain: 'Manifestation, reality, physical plane, results' }
    ];

    console.log(chalk.bold('\n👑 Sephirotic Council - 10 Agents'));
    console.log(chalk.gray('═'.repeat(60)));
    
    for (const agent of agents) {
      const agentPath = join(this.sovereignDir, agent.id, 'agent.py');
      let status = 'unknown';
      try {
        await fs.access(agentPath);
        // Check if process is running
        const { stdout } = await execa('pgrep', ['-f', `python3.*${agent.id}/agent.py`], { reject: false });
        status = stdout.trim() ? chalk.green('Running') : chalk.red('Stopped');
      } catch {
        status = chalk.yellow('Not installed');
      }
      
      const roleColor = agent.role === 'orchestrator' ? 'magenta' : 'cyan';
      console.log(`  ${agent.sephira.toString().padStart(2)} ${chalk[roleColor](agent.id.padEnd(10))} ${chalk.bold(agent.name.padEnd(25))} [${chalk[roleColor](agent.role)}] ${chalk.gray(agent.domain)} → ${status}`);
    }
    
    return agents;
  }

  async startAgent(agentId) {
    if (!(await this.init())) return;

    const agentPath = join(this.sovereignDir, agentId, 'agent.py');
    try {
      await fs.access(agentPath);
      await execa('python3', [agentPath], {
        cwd: join(this.sovereignDir, agentId),
        stdio: 'ignore',
        detached: true
      });
      console.log(chalk.green(`✅ Started ${agentId}`));
    } catch (error) {
      throw new Error(`Failed to start ${agentId}: ${error.message}`);
    }
  }

  async stopAgent(agentId) {
    try {
      await execa('pkill', ['-f', `python3.*${agentId}/agent.py`], { reject: false });
      console.log(chalk.green(`✅ Stopped ${agentId}`));
    } catch (error) {
      throw new Error(`Failed to stop ${agentId}: ${error.message}`);
    }
  }

  async restartAgent(agentId) {
    await this.stopAgent(agentId);
    await new Promise(r => setTimeout(r, 1000));
    await this.startAgent(agentId);
  }

  async startAll() {
    const agents = await this.listAgents();
    for (const agent of agents) {
      try {
        await this.startAgent(agent.id);
      } catch (error) {
        console.log(chalk.yellow(`⚠️ ${agent.id}: ${error.message}`));
      }
    }
    console.log(chalk.green('✅ All agents started'));
  }

  async stopAll() {
    const agents = await this.listAgents();
    for (const agent of agents) {
      try {
        await this.stopAgent(agent.id);
      } catch (error) {
        console.log(chalk.yellow(`⚠️ ${agent.id}: ${error.message}`));
      }
    }
    console.log(chalk.yellow('🛑 All agents stopped'));
  }

  async getCouncilBusStatus() {
    if (!(await this.init())) return null;

    try {
      const Database = (await import('better-sqlite3')).default;
      const db = new Database(this.councilBusPath, { readonly: true });
      
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
      const messages = db.prepare('SELECT COUNT(*) as count FROM messages').get();
      const agents = db.prepare('SELECT COUNT(*) as count FROM agents').get();
      
      db.close();
      
      return {
        tables: tables.map(t => t.name),
        messageCount: messages?.count || 0,
        agentCount: agents?.count || 0,
        dbPath: this.councilBusPath
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async delegateTask(taskDescription, targetAgent = null) {
    if (!(await this.init())) return;

    const args = ['delegate', taskDescription];
    if (targetAgent) {
      args.push('--agent', targetAgent);
    }
    
    await this.convene(args);
  }

  async showStatus() {
    if (!(await this.init())) return;

    console.log(chalk.bold('\n👑 Sovereign Core Status'));
    console.log(chalk.gray('═'.repeat(50)));
    
    const agents = await this.listAgents();
    const running = agents.filter(a => {
      // We'd need to check running status differently
      return false;
    }).length;
    
    const busStatus = await this.getCouncilBusStatus();
    if (busStatus && !busStatus.error) {
      console.log(`\n📋 Council Bus: ${busStatus.dbPath}`);
      console.log(`   Tables: ${busStatus.tables.join(', ')}`);
      console.log(`   Messages: ${busStatus.messageCount}`);
      console.log(`   Registered Agents: ${busStatus.agentCount}`);
    }
  }
}