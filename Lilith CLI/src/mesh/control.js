/**
 * 🕸️ NSSP Mesh Control
 * Interface to the Lilith NSSP Mesh (GitHub-based distributed compute)
 * Enhanced with Cerebellum integration for intelligent task routing
 */

import axios from 'axios';
import { execa } from 'execa';
import chalk from 'chalk';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class MeshControl {
  constructor(config) {
    this.config = config;
    this.githubToken = process.env.GITHUB_TOKEN || config.get('mesh.githubToken');
    this.repo = config.get('mesh.repo');
    this.apiBase = 'https://api.github.com';
    this.client = null;
    this.deviceLabel = process.env.NSSP_DEVICE_LABEL || config.get('mesh.deviceLabel') || os.hostname();
    this.taskWeight = process.env.NSSP_TASK_WEIGHT || config.get('mesh.taskWeight') || 'light';
    this.meshConfig = config.get('mesh') || {};
  }

  async init() {
    if (!this.githubToken) {
      console.log(chalk.yellow('⚠️ No GitHub token - mesh operations limited'));
      return false;
    }

    this.client = axios.create({
      baseURL: this.apiBase,
      headers: {
        'Authorization': `token ${this.githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Lilith-CLI/2.0'
      },
      timeout: 30000
    });

    // Test connection
    try {
      await this.client.get(`/repos/${this.repo}`);
      return true;
    } catch (error) {
      console.log(chalk.yellow('⚠️ Cannot reach mesh repo:', this.repo));
      return false;
    }
  }

  async poll({ weight = 'light' } = {}) {
    if (!this.client) await this.init();
    if (!this.client) return [];

    try {
      const response = await this.client.get(`/repos/${this.repo}/issues`, {
        params: {
          state: 'open',
          labels: `task:${weight}`,
          per_page: 100
        }
      });

      // Filter unclaimed tasks
      const tasks = response.data.filter(issue => {
        if (issue.pull_request) return false;
        const labels = issue.labels.map(l => l.name);
        return !labels.includes('claimed');
      });

      return tasks.map(t => ({
        number: t.number,
        title: t.title,
        body: t.body,
        labels: t.labels.map(l => l.name),
        created_at: t.created_at,
        updated_at: t.updated_at,
        url: t.html_url
      }));
    } catch (error) {
      console.error(chalk.red('Mesh poll failed:'), error.message);
      return [];
    }
  }

  async claim(issueNumber) {
    if (!this.client) await this.init();
    if (!this.client) throw new Error('Mesh not initialized');

    try {
      // Get current labels
      const issue = await this.client.get(`/repos/${this.repo}/issues/${issueNumber}`);
      const labels = issue.data.labels.map(l => l.name);

      if (!labels.includes('claimed')) {
        labels.push('claimed');
      }

      // Update labels
      await this.client.patch(`/repos/${this.repo}/issues/${issueNumber}`, { labels });

      // Add claim comment
      await this.client.post(`/repos/${this.repo}/issues/${issueNumber}/comments`, {
        body: `🔒 **Claimed by ${this.deviceLabel}**\n- Time: ${new Date().toISOString()}\n- Status: processing\n\nDevice will commit results and close this task when done.`
      });

      console.log(chalk.green(`✅ Claimed #${issueNumber}`));
    } catch (error) {
      throw new Error(`Failed to claim #${issueNumber}: ${error.message}`);
    }
  }

  async submitResult(issueNumber, resultFile) {
    if (!this.client) await this.init();
    if (!this.client) throw new Error('Mesh not initialized');

    try {
      // Read result file
      const content = await fs.readFile(resultFile, 'utf8');

      // Post result as comment
      await this.client.post(`/repos/${this.repo}/issues/${issueNumber}/comments`, {
        body: `## Result from ${this.deviceLabel}\n\n${content}\n\n---\n*Submitted at ${new Date().toISOString()}*`
      });

      // Close issue
      await this.client.patch(`/repos/${this.repo}/issues/${issueNumber}`, { state: 'closed' });

      console.log(chalk.green(`✅ Submitted result and closed #${issueNumber}`));
    } catch (error) {
      throw new Error(`Failed to submit result: ${error.message}`);
    }
  }

  async createTask(taskData) {
    if (!this.client) await this.init();
    if (!this.client) throw new Error('Mesh not initialized');

    const { title, body, labels = [] } = taskData;

    // Add task weight label
    const weight = taskData.weight || 'light';
    labels.push(`task:${weight}`);

    try {
      const response = await this.client.post(`/repos/${this.repo}/issues`, {
        title,
        body,
        labels
      });

      console.log(chalk.green(`✅ Created mesh task #${response.data.number}`));
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  async getStatus() {
    if (!this.client) await this.init();
    if (!this.client) {
      return {
        repo: this.repo,
        openTasks: 0,
        heavyTasks: 0,
        lightTasks: 0,
        myClaims: 0,
        lastPoll: 'Never',
        deviceLabel: this.deviceLabel
      };
    }

    try {
      const [allTasks, myClaims] = await Promise.all([
        this.client.get(`/repos/${this.repo}/issues`, { params: { state: 'open', per_page: 100 } }),
        this.client.get(`/repos/${this.repo}/issues`, { params: { state: 'open', labels: `claimed`, per_page: 100 } })
      ]);

      const tasks = allTasks.data.filter(t => !t.pull_request);
      const heavyTasks = tasks.filter(t => t.labels.some(l => l.name === 'task:heavy')).length;
      const lightTasks = tasks.filter(t => t.labels.some(l => l.name === 'task:light')).length;
      const myClaimedTasks = myClaims.data.filter(t => 
        t.labels.some(l => l.name === 'claimed') && 
        t.body?.includes(this.deviceLabel)
      ).length;

      return {
        repo: this.repo,
        openTasks: tasks.length,
        heavyTasks,
        lightTasks,
        myClaims: myClaimedTasks,
        lastPoll: new Date().toISOString(),
        deviceLabel: this.deviceLabel
      };
    } catch (error) {
      return {
        repo: this.repo,
        openTasks: 0,
        heavyTasks: 0,
        lightTasks: 0,
        myClaims: 0,
        lastPoll: 'Error',
        deviceLabel: this.deviceLabel,
        error: error.message
      };
    }
  }

  async bootstrap(device) {
    const scriptMap = {
      laptop: 'scripts/laptop-core-setup.sh',
      phone: 'scripts/phone/hyperdroid-nssp-bootstrap.sh',
      termux: 'scripts/phone/termux-bootstrap.sh'
    };

    const script = scriptMap[device];
    if (!script) {
      throw new Error(`Unknown device: ${device}. Use: laptop, phone, or termux`);
    }

    const meshDir = this.config.get('paths.nssp_mesh').replace('~', os.homedir());
    const scriptPath = join(meshDir, script);

    try {
      console.log(chalk.cyan(`Running bootstrap for ${device}...`));
      await execa('bash', [scriptPath], { stdio: 'inherit', cwd: meshDir });
      console.log(chalk.green(`✅ ${device} bootstrap complete`));
    } catch (error) {
      throw new Error(`Bootstrap failed: ${error.message}`);
    }
  }

  async syncResults() {
    // Sync local results to mesh
    const meshDir = this.config.get('paths.mesh_dir').replace('~', os.homedir());
    const resultsDir = join(meshDir, 'results', this.deviceLabel);

    try {
      await execa('git', ['add', 'results/'], { cwd: meshDir, stdio: 'inherit' });
      await execa('git', ['commit', '-m', `results: sync from ${this.deviceLabel}`], { cwd: meshDir, stdio: 'inherit' });
      await execa('git', ['push'], { cwd: meshDir, stdio: 'inherit' });
      console.log(chalk.green('✅ Results synced to mesh'));
    } catch (error) {
      // No changes to commit is OK
      if (!error.message.includes('nothing to commit')) {
        throw error;
      }
    }
  }

  async pullTasks() {
    const meshDir = this.config.get('paths.nssp_mesh').replace('~', os.homedir());

    try {
      await execa('git', ['pull', '--ff-only'], { cwd: meshDir, stdio: 'inherit' });
      console.log(chalk.green('✅ Pulled latest tasks from mesh'));
    } catch (error) {
      throw new Error(`Pull failed: ${error.message}`);
    }
  }

  // Cerebellum integration methods
  async submitFromCerebellum(taskId, description, tier, assignedModel) {
    const weight = tier === 'small' ? 'light' : 'heavy';
    const title = `[Cerebellum] ${description.slice(0, 80)}`;
    
    const deviceAffinity = this.config.get(`cerebellum.tiers.${tier}.device_affinity`);
    const body = `**Cerebellum Task ID:** ${taskId}\n**Tier:** ${tier}\n**Assigned Model:** ${assignedModel}\n**Weight:** ${weight}\n**Device Affinity:** ${deviceAffinity}\n\n---\n\n## Goal\n${description}\n\n## Acceptance Criteria\n- [ ] Task completed successfully\n- [ ] Result stored and accessible\n\n## Device Affinity\npreferred_device: ${deviceAffinity}`;

    return this.createTask({
      title,
      body,
      weight,
      labels: ['cerebellum', tier, 'auto-generated', `task:${weight}`]
    });
  }

  async pollAndClaim(weight = 'light') {
    const tasks = await this.poll({ weight });
    
    for (const task of tasks) {
      // Check if we have capacity
      const canHandle = await this.canHandleTask(task);
      if (canHandle) {
        await this.claim(task.number);
        return task;
      }
    }
    
    return null;
  }

  async canHandleTask(task) {
    // Check current load
    const status = await this.getStatus();
    
    // If we already have 3+ tasks claimed, don't claim more
    if (status.myClaims >= 3) {
      return false;
    }
    
    // Check if task matches our device capabilities
    const meshConfig = this.config.get('mesh');
    const deviceRole = meshConfig?.device_roles?.[this.deviceLabel] || meshConfig?.device_roles?.laptop;
    
    if (deviceRole) {
      // Check if we have the required capabilities
      const taskLabels = task.labels || [];
      // Simple check - heavy tasks for laptop, light for phone
      if (this.taskWeight === 'heavy' && taskLabels.includes('task:heavy')) return true;
      if (this.taskWeight === 'light' && taskLabels.includes('task:light')) return true;
    }
    
    return true; // Default to accepting
  }

  async processCerebellumTask(task, cerebellum) {
    // This would be called by the cerebellum daemon to process a claimed task
    const taskId = task.labels?.find(l => l.startsWith('cerebellum-')) || 'unknown';
    
    try {
      // Execute the task using the cerebellum's executeTask method
      // The result would then be submitted back to the mesh
      const result = await cerebellum.executeTask(taskId);
      
      // Submit result
      await this.submitResult(task.number, result);
      
      return result;
    } catch (error) {
      // Post error as comment
      await this.client.post(`/repos/${this.repo}/issues/${task.number}/comments`, {
        body: `## Error from ${this.deviceLabel}\n\n\`\`\`\n${error.message}\n\`\`\`\n\n---\n*Failed at ${new Date().toISOString()}*`
      });
      
      throw error;
    }
  }
}