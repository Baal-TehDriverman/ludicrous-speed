/**
 * 🏥 Doctor - System Health Check
 * Validates all Lilith CLI components and dependencies
 */

import { execa } from 'execa';
import axios from 'axios';
import chalk from 'chalk';
import boxen from 'boxen';
import fs from 'fs/promises';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class Doctor {
  constructor(config) {
    this.config = config;
    this.results = [];
  }

  async run() {
    console.log(chalk.bold('\n🏥 Lilith CLI System Health Check'));
    console.log(chalk.gray('═'.repeat(60)));
    
    this.results = [];
    
    await this.checkNode();
    await this.checkConfig();
    await this.checkGateway();
    await this.checkOllama();
    await this.checkMesh();
    await this.checkDashboard();
    await this.checkModels();
    await this.checkCerebellumDB();
    await this.checkGPU();
    await this.checkDiskSpace();
    await this.checkDependencies();
    
    this.printSummary();
  }

  addResult(category, name, status, message = '', fix = null) {
    this.results.push({ category, name, status, message, fix });
    const icon = status === 'pass' ? chalk.green('✅') : status === 'warn' ? chalk.yellow('⚠️') : chalk.red('❌');
    console.log(`  ${icon} ${chalk.bold(name)}: ${message}`);
    if (fix && status !== 'pass') {
      console.log(chalk.gray(`     Fix: ${fix}`));
    }
  }

  async checkNode() {
    const version = process.version;
    const major = parseInt(version.slice(1).split('.')[0]);
    
    if (major >= 18) {
      this.addResult('runtime', 'Node.js', 'pass', `v${version}`);
    } else {
      this.addResult('runtime', 'Node.js', 'fail', `v${version} (requires >=18)`, 'Upgrade Node.js to v18+');
    }
  }

  async checkConfig() {
    const configPath = this.config.configPath;
    
    try {
      await fs.access(configPath);
      this.addResult('config', 'Config file', 'pass', configPath);
    } catch {
      this.addResult('config', 'Config file', 'fail', 'Not found', 'Run lilith-cli setup or create config/lilith.yaml');
    }
    
    // Check required sections
    const requiredSections = ['cerebellum', 'gateway', 'mesh', 'models', 'paths'];
    for (const section of requiredSections) {
      if (this.config.get(section)) {
        this.addResult('config', `Section: ${section}`, 'pass', 'Present');
      } else {
        this.addResult('config', `Section: ${section}`, 'warn', 'Missing from config');
      }
    }
  }

  async checkGateway() {
    const url = this.config.get('gateway.url');
    
    try {
      const client = axios.create({ baseURL: url, timeout: 5000 });
      const response = await client.get('/health');
      
      if (response.data.status === 'healthy' || response.data.ok === true) {
        this.addResult('gateway', 'Lilith Gateway', 'pass', `Running at ${url}`);
        
        // Check sub-components (if /api/status exists)
        try {
          const status = await client.get('/api/status');
          const data = status.data;
          
          this.addResult('gateway', 'Sanctuary VRAM', data.sanctuary?.state === 'SANCTUARY_CLEAR' ? 'pass' : 'warn', 
            `State: ${data.sanctuary?.state} (${data.sanctuary?.smoothed_vram_free_mb}MB free)`);
          this.addResult('gateway', 'Ollama', data.ollama === 'ok' ? 'pass' : 'warn', data.ollama);
          this.addResult('gateway', 'Virsh', data.virsh === 'ok' ? 'pass' : 'warn', data.virsh);
        } catch {
          // No /api/status endpoint — gateway is up, skip sub-component checks
          this.addResult('gateway', 'Sub-components', 'warn', '/api/status not available on this gateway');
        }
      } else {
        this.addResult('gateway', 'Lilith Gateway', 'warn', 'Unhealthy status');
      }
    } catch (error) {
      this.addResult('gateway', 'Lilith Gateway', 'fail', `Not reachable at ${url}`, 'Start gateway: cd ~/🜏 Lilith/vm-ai-gateway/lilith-gateway && python gateway_server.py');
    }
  }

  async checkOllama() {
    try {
      const client = axios.create({ baseURL: 'http://localhost:11434', timeout: 5000 });
      const response = await client.get('/api/tags');
      const models = response.data.models || [];
      
      this.addResult('ollama', 'Ollama Server', 'pass', `Running with ${models.length} models`);
      
      // Check for key models (actual installed models on this machine)
      const keyModels = ['mythos:latest', 'X2b4b9b-4b:latest', 'qwemma-14b:latest'];
      for (const model of keyModels) {
        const found = models.some(m => m.name.startsWith(model.split(':')[0]));
        this.addResult('ollama', `Model: ${model}`, found ? 'pass' : 'warn', found ? 'Available' : 'Not pulled', `Pull with: ollama pull ${model}`);
      }
    } catch (error) {
      this.addResult('ollama', 'Ollama Server', 'fail', 'Not running', 'Start Ollama: ollama serve');
    }
  }

  async checkMesh() {
    const repo = this.config.get('mesh.repo');
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      this.addResult('mesh', 'GitHub Auth', 'warn', 'No GITHUB_TOKEN set', 'Export GITHUB_TOKEN or add to config');
      return;
    }
    
    try {
      const client = axios.create({
        baseURL: 'https://api.github.com',
        headers: { 'Authorization': `token ${token}` },
        timeout: 10000
      });
      
      await client.get(`/repos/${repo}`);
      this.addResult('mesh', 'Mesh Repo', 'pass', `Accessible: ${repo}`);
      
      // Check for open tasks
      const response = await client.get(`/repos/${repo}/issues`, { 
        params: { state: 'open', labels: 'task:heavy,task:light', per_page: 5 }
      });
      const tasks = response.data.filter(t => !t.pull_request);
      this.addResult('mesh', 'Open Tasks', 'pass', `${tasks.length} tasks available`);
      
    } catch (error) {
      this.addResult('mesh', 'Mesh Repo', 'fail', `Cannot access ${repo}: ${error.message}`, 'Check GITHUB_TOKEN and repo permissions');
    }
  }

  async checkDashboard() {
    const dashboardDir = this.config.get('paths.repos.dashboard');
    // Also check for Vite dev server on :5173
    let devServerRunning = false;
    try {
      await axios.get('http://localhost:5173', { timeout: 2000 });
      devServerRunning = true;
    } catch {}
    // Don't double-expand - path should already be absolute
    
    const dashboardExists = dashboardDir && (devServerRunning || true);
    const dashboardPath = devServerRunning ? 'http://localhost:5173 (Vite dev)' : dashboardDir;
    
    try {
      await fs.access(dashboardDir);
      this.addResult('dashboard', 'Dashboard Repo', 'pass', dashboardDir);
      
      // Check for package.json
      await fs.access(join(dashboardDir, 'package.json'));
      this.addResult('dashboard', 'package.json', 'pass', 'Found');
      
      // Check for node_modules
      try {
        await fs.access(join(dashboardDir, 'node_modules'));
        this.addResult('dashboard', 'Dependencies', 'pass', 'Installed');
      } catch {
        this.addResult('dashboard', 'Dependencies', 'warn', 'Not installed', 'Run: npm install in dashboard dir');
      }
      
      // Check dev server
      try {
        await axios.get('http://localhost:5173', { timeout: 2000 });
        this.addResult('dashboard', 'Dev Server', 'pass', 'Running on :5173');
      } catch {
        this.addResult('dashboard', 'Dev Server', 'warn', 'Not running', 'Run: lilith dashboard dev');
      }
      
    } catch (error) {
      if (devServerRunning) {
        this.addResult('dashboard', 'Dashboard Repo', 'pass', `Vite dev server at ${dashboardPath}`);
      } else {
        this.addResult('dashboard', 'Dashboard Repo', 'fail', `Not found at ${dashboardDir}`, 'Clone or update path in config');
      }
    }
  }

  async checkModels() {
    const configModels = this.config.get('models');
    
    // Check main engine path
    const mainEnginePath = configModels.main_engine?.local_path;
    if (mainEnginePath) {
      // Don't double-expand - path should already be absolute
      try {
        await fs.access(mainEnginePath);
        this.addResult('models', 'Main Engine (cosmos+shadow0482)', 'pass', mainEnginePath);
      } catch {
        this.addResult('models', 'Main Engine (cosmos+shadow0482)', 'warn', `Not found at ${mainEnginePath}`, 'Deploy cosmos-3-quantized-nssp');
      }
    }
    
    // Check model registry
    if (configModels.fallback_chain) {
      this.addResult('models', 'Fallback Chain', 'pass', `${configModels.fallback_chain.length} providers configured`);
    }
  }

  async checkCerebellumDB() {
    const dbPath = this.config.get('cerebellum.db_path').replace('~', os.homedir());
    
    try {
      await fs.access(dbPath);
      this.addResult('cerebellum', 'Database', 'pass', dbPath);
      
      // Check tables
      const Database = (await import('better-sqlite3')).default;
      const db = new Database(dbPath, { readonly: true });
      
      const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
      const requiredTables = ['tasks', 'model_routing', 'sanctuary_state', 'task_metrics'];
      
      for (const table of requiredTables) {
        const exists = tables.some(t => t.name === table);
        this.addResult('cerebellum', `Table: ${table}`, exists ? 'pass' : 'warn', exists ? 'Exists' : 'Missing');
      }
      
      db.close();
    } catch {
      this.addResult('cerebellum', 'Database', 'warn', 'Not initialized', 'Run a cerebellum command to initialize');
    }
  }

  async checkGPU() {
    try {
      const { stdout } = await execa('nvidia-smi', ['--query-gpu=name,memory.total,memory.free', '--format=csv,noheader,nounits']);
      const lines = stdout.trim().split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const [name, total, free] = lines[i].split(', ').map(s => s.trim());
        const totalMB = parseInt(total);
        const freeMB = parseInt(free);
        const usedMB = totalMB - freeMB;
        const usagePct = ((usedMB / totalMB) * 100).toFixed(1);
        
        const status = freeMB > 4096 ? 'pass' : freeMB > 1024 ? 'warn' : 'fail';
        this.addResult('gpu', `GPU ${i}: ${name}`, status, `${freeMB}MB / ${totalMB}MB free (${usagePct}% used)`);
      }
    } catch {
      this.addResult('gpu', 'NVIDIA GPU', 'warn', 'nvidia-smi not available', 'Install NVIDIA drivers');
    }
  }

  async checkDiskSpace() {
    const paths = [
      { path: os.homedir(), label: 'Home' },
      { path: '/home/tehlappy/🜏 Lilith', label: 'LILITH_ROOT' },
      { path: this.config.get('paths.config_dir'), label: 'Config' }
    ];
    
    for (const { path, label } of paths) {
      try {
        const { stdout } = await execa('df', ['-h', path]);
        const lines = stdout.trim().split('\n');
        if (lines.length > 1) {
          const parts = lines[1].split(/\s+/);
          const usage = parts[4];
          const avail = parts[3];
          const usedPct = parseInt(usage.replace('%', ''));
          
          const status = usedPct < 80 ? 'pass' : usedPct < 90 ? 'warn' : 'fail';
          this.addResult('disk', label, status, `${avail} available (${usage} used)`);
        }
      } catch {
        this.addResult('disk', label, 'warn', 'Cannot check');
      }
    }
  }

  async checkDependencies() {
    // Check key CLI tools
    const tools = [
      { cmd: 'git', name: 'Git' },
      { cmd: 'gh', name: 'GitHub CLI' },
      { cmd: 'docker', name: 'Docker' },
      { cmd: 'virsh', name: 'Libvirt' },
      { cmd: 'python3', name: 'Python 3' },
      { cmd: 'adb', name: 'ADB' }
    ];
    
    for (const { cmd, name } of tools) {
      try {
        await execa(cmd, ['--version'], { timeout: 5000 });
        this.addResult('deps', name, 'pass', 'Available');
      } catch {
        this.addResult('deps', name, 'warn', 'Not installed', `Install ${name.toLowerCase()}`);
      }
    }
    
    // Check npm packages
    try {
      await fs.access(join(process.cwd(), 'node_modules'));
      this.addResult('deps', 'NPM Dependencies', 'pass', 'Installed');
    } catch {
      this.addResult('deps', 'NPM Dependencies', 'warn', 'Not installed', 'Run: npm install');
    }
  }

  printSummary() {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const warned = this.results.filter(r => r.status === 'warn').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const total = this.results.length;
    
    console.log(chalk.gray('\n' + '═'.repeat(60)));
    
    const summaryBox = boxen(
      chalk.bold('🏥 Health Check Summary') + '\n\n' +
      `${chalk.green('✅ Pass:')} ${passed}\n` +
      `${chalk.yellow('⚠️ Warn:')} ${warned}\n` +
      `${chalk.red('❌ Fail:')} ${failed}\n` +
      `${chalk.gray('Total:')} ${total}\n\n` +
      (failed > 0 ? chalk.red('❗ System has critical issues') : 
       warned > 0 ? chalk.yellow('⚠️ System has warnings') : 
       chalk.green('✅ All systems operational')),
      { padding: 1, borderColor: failed > 0 ? 'red' : warned > 0 ? 'yellow' : 'green', borderStyle: 'round' }
    );
    
    console.log(summaryBox);
    
    // Exit code
    if (failed > 0) process.exitCode = 1;
  }
}