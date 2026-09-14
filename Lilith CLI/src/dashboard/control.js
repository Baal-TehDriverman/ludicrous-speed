/**
 * 📊 Unified Dashboard Control
 * Interface to the Unified Dashboard (React/Vite)
 */

import { execa } from 'execa';
import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class DashboardControl {
  constructor(config) {
    this.config = config;
    this.dashboardDir = config.get('paths.repos.dashboard').replace('~', os.homedir());
    this.devProcess = null;
  }

  async init() {
    // Check if dashboard directory exists
    try {
      await fs.access(this.dashboardDir);
      return true;
    } catch {
      console.log(chalk.yellow('⚠️ Dashboard not found at', this.dashboardDir));
      return false;
    }
  }

  async startDev() {
    if (!(await this.init())) return;
    
    console.log(chalk.cyan('🚀 Starting Unified Dashboard dev server...'));
    
    try {
      // Install dependencies if needed
      const nodeModules = join(this.dashboardDir, 'node_modules');
      try {
        await fs.access(nodeModules);
      } catch {
        console.log(chalk.yellow('Installing dependencies...'));
        await execa('npm', ['install'], { cwd: this.dashboardDir, stdio: 'inherit' });
      }
      
      // Start dev server
      this.devProcess = execa('npm', ['run', 'dev'], {
        cwd: this.dashboardDir,
        stdio: 'inherit'
      });
      
      console.log(chalk.green('✅ Dashboard dev server started'));
      console.log(chalk.gray('   Dev URL: http://localhost:5173'));
      console.log(chalk.gray('   API:     http://localhost:3000'));
      
      // Keep process alive
      await this.devProcess;
    } catch (error) {
      if (error.signal === 'SIGINT') {
        console.log(chalk.yellow('\n🛑 Dev server stopped'));
      } else {
        throw error;
      }
    }
  }

  async build() {
    if (!(await this.init())) return;
    
    console.log(chalk.cyan('🔨 Building Unified Dashboard for production...'));
    
    try {
      await execa('npm', ['run', 'build'], {
        cwd: this.dashboardDir,
        stdio: 'inherit'
      });
      console.log(chalk.green('✅ Dashboard built successfully'));
      console.log(chalk.gray('   Output: dist/'));
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  async getStatus() {
    const status = {
      dev: false,
      prod: false,
      port: 3000,
      tabs: []
    };
    
    if (!(await this.init())) return status;
    
    // Check for production build
    const distDir = join(this.dashboardDir, 'dist');
    try {
      await fs.access(distDir);
      status.prod = true;
    } catch {
      status.prod = false;
    }
    
    // Check if dev server is running (try to connect)
    try {
      const response = await axios.get('http://localhost:5173', { timeout: 2000 });
      status.dev = response.status === 200;
    } catch {
      status.dev = false;
    }
    
    // Get tabs from config
    status.tabs = this.config.get('dashboard.tabs') || [];
    
    return status;
  }

  async stopDev() {
    if (this.devProcess) {
      this.devProcess.kill('SIGINT');
      this.devProcess = null;
      console.log(chalk.yellow('🛑 Dev server stopped'));
    }
  }

  async openBrowser() {
    const { default: open } = await import('open');
    await open('http://localhost:5173');
  }

  async runLint() {
    if (!(await this.init())) return;
    
    try {
      await execa('npm', ['run', 'lint'], {
        cwd: this.dashboardDir,
        stdio: 'inherit'
      });
      console.log(chalk.green('✅ Lint passed'));
    } catch (error) {
      throw new Error(`Lint failed: ${error.message}`);
    }
  }

  async runTypeCheck() {
    if (!(await this.init())) return;
    
    try {
      await execa('npx', ['tsc', '--noEmit'], {
        cwd: this.dashboardDir,
        stdio: 'inherit'
      });
      console.log(chalk.green('✅ Type check passed'));
    } catch (error) {
      throw new Error(`Type check failed: ${error.message}`);
    }
  }
}