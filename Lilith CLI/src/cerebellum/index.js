/**
 * 🧠 Local Cerebellum - Metaconscious Task Manager
 * Routes tasks across 3 tiers based on complexity, VRAM, and device capabilities
 * Integrates with Sanctuary VRAM hysteresis, NSSP mesh, Lilith Gateway
 */

import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import chalk from 'chalk';
import os from 'os';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class Cerebellum {
  constructor(config) {
    this.config = config;
    this.db = null;
    this.isRunning = false;
    this.daemonInterval = null;
    this.gatewayClient = null;
    this.ollamaClient = null;
    this.sanctuaryState = null;
  }

  async init() {
    // Initialize database
    const dbPath = this.config.get('cerebellum.db_path').replace('~', os.homedir());
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.initSchema();
    
    // Resolve provider (local-first, cloud optional)
    // Env override: LILITH_DEFAULT_PROVIDER=local-ollama|gateway|cloud
    const provider = process.env.LILITH_DEFAULT_PROVIDER
      || this.config.get('models.providers.default')
      || 'local-ollama';
    this.provider = provider;
    console.log(`  Provider: ${provider}`);
    
    // Initialize gateway client (used when provider=gateway or for fallback)
    this.gatewayClient = null;
    const gatewayUrl = this.config.get('gateway.url');
    if (gatewayUrl && gatewayUrl !== 'http://localhost:8080') {
      this.gatewayClient = axios.create({
        baseURL: gatewayUrl,
        timeout: 30000
      });
    }
    
    // Initialize direct Ollama client (OpenAI-compatible, no auth)
    // Serves the LOCAL_CEREBELLUM route with the local model.
    // Timeout 10 min — long-context models are inference-bound.
    const ollamaUrl = this.config.get('cerebellum.ollama_base') || 'http://localhost:11434';
    this.ollamaClient = axios.create({
      baseURL: ollamaUrl,
      timeout: 600000
    });
    
    // Start sanctuary monitoring (graceful fallback if gateway unavailable)
    await this.refreshSanctuaryState();
    
    return this;
  }

  initSchema() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        tier TEXT NOT NULL,
        assigned_model TEXT,
        route TEXT,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'normal',
        model_hint TEXT,
        submit_to_mesh INTEGER DEFAULT 0,
        async_mode INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        started_at TEXT,
        completed_at TEXT,
        duration_ms INTEGER,
        result TEXT,
        error TEXT,
        metadata TEXT
      );
      
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_tier ON tasks(tier);
      CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at);
      
      CREATE TABLE IF NOT EXISTS model_routing (
        tier TEXT PRIMARY KEY,
        default_model TEXT,
        fallback_chain TEXT,
        updated_at TEXT DEFAULT (datetime('now'))
      );
      
      CREATE TABLE IF NOT EXISTS sanctuary_state (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        state TEXT,
        smoothed_vram_free_mb INTEGER,
        hysteresis_lock_until REAL,
        local_model_loaded INTEGER,
        updated_at TEXT DEFAULT (datetime('now'))
      );
      
      CREATE TABLE IF NOT EXISTS task_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id TEXT,
        tier TEXT,
        model TEXT,
        duration_ms INTEGER,
        tokens_per_second REAL,
        vram_used_mb INTEGER,
        success INTEGER,
        created_at TEXT DEFAULT (datetime('now'))
      );
    `);
    
    // Initialize default routing
    const tiers = this.config.get('cerebellum.tiers');
    for (const [tierName, tierConfig] of Object.entries(tiers)) {
      const existing = this.db.prepare('SELECT 1 FROM model_routing WHERE tier = ?').get(tierName);
      if (!existing) {
        this.db.prepare(`
          INSERT INTO model_routing (tier, default_model, fallback_chain)
          VALUES (?, ?, ?)
        `).run(
          tierName,
          tierConfig.preferred_models[0],
          JSON.stringify(tierConfig.fallback_providers)
        );
      }
    }
  }

  async refreshSanctuaryState() {
    try {
      const response = await this.gatewayClient.get('/api/status');
      this.sanctuaryState = response.data.sanctuary;
      
      // Update local cache
      this.db.prepare(`
        INSERT OR REPLACE INTO sanctuary_state (id, state, smoothed_vram_free_mb, hysteresis_lock_until, local_model_loaded, updated_at)
        VALUES (1, ?, ?, ?, ?, datetime('now'))
      `).run(
        this.sanctuaryState.state,
        this.sanctuaryState.smoothed_vram_free_mb,
        this.sanctuaryState.hysteresis_lock_until || 0,
        this.sanctuaryState.local_model_loaded ? 1 : 0
      );
    } catch (error) {
      // Fallback to cached state
      const cached = this.db.prepare('SELECT * FROM sanctuary_state WHERE id = 1').get();
      if (cached) {
        this.sanctuaryState = {
          state: cached.state,
          smoothed_vram_free_mb: cached.smoothed_vram_free_mb,
          hysteresis_lock_until: cached.hysteresis_lock_until,
          local_model_loaded: cached.local_model_loaded === 1
        };
      } else {
        this.sanctuaryState = {
          state: 'SANCTUARY_CLEAR',
          smoothed_vram_free_mb: 4096,
          hysteresis_lock_until: 0,
          local_model_loaded: false
        };
      }
    }
  }

  getSanctuaryRouting(taskRequiresHardware = false) {
    if (!this.sanctuaryState) {
      return { route: 'LOCAL_CEREBELLUM', state: 'SANCTUARY_CLEAR', reason: 'No sanctuary state' };
    }
    
    const { state, smoothed_vram_free_mb, hysteresis_lock_until } = this.sanctuaryState;
    const now = Date.now() / 1000;
    
    if (taskRequiresHardware) {
      return { route: 'LOCAL_BYPASS', state, smoothed_vram_free_mb, reason: 'Hardware-dependent task' };
    }
    
    if (state === 'SANCTUARY_CLEAR') {
      return { route: 'LOCAL_CEREBELLUM', state, smoothed_vram_free_mb, reason: 'Sufficient VRAM' };
    } else if (state === 'SANCTUARY_MARGINAL') {
      return { route: 'HYBRID', state, smoothed_vram_free_mb, reason: 'Marginal VRAM - hybrid routing' };
    } else { // SANCTUARY_BREACH
      const lockRemaining = Math.max(0, hysteresis_lock_until - now);
      return { 
        route: 'CLOUD_CORTEX', 
        state, 
        smoothed_vram_free_mb, 
        hysteresis_lock_remaining: lockRemaining,
        reason: 'VRAM breach - cloud escalation'
      };
    }
  }

  classifyTask(description, modelHint = null) {
    const lowerDesc = description.toLowerCase();
    const tiers = this.config.get('cerebellum.tiers');
    const routing = this.config.get('cerebellum.routing');
    
    // Check explicit model hints first
    if (modelHint) {
      const hintLower = modelHint.toLowerCase();
      for (const [keyword, model] of Object.entries(routing.model_hints)) {
        if (hintLower.includes(keyword)) {
          // Find which tier this model belongs to
          for (const [tierName, tierConfig] of Object.entries(tiers)) {
            if (tierConfig.preferred_models.includes(model) || tierConfig.fallback_providers.includes(model)) {
              return tierName;
            }
          }
        }
      }
    }
    
    // Keyword-based classification
    let scores = { small: 0, medium: 0, large: 0 };
    
    for (const [tierName, keywords] of Object.entries(routing.keywords)) {
      for (const keyword of keywords) {
        if (lowerDesc.includes(keyword)) {
          scores[tierName] += 1;
        }
      }
    }
    
    // Return highest scoring tier, default to medium
    const maxTier = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];
    return scores[maxTier] > 0 ? maxTier : 'medium';
  }

  selectModel(tier, modelHint = null) {
    const tiers = this.config.get('cerebellum.tiers');
    const tierConfig = tiers[tier];
    
    // Check model hint
    if (modelHint) {
      const hintLower = modelHint.toLowerCase();
      for (const [keyword, model] of Object.entries(this.config.get('cerebellum.routing.model_hints'))) {
        if (hintLower.includes(keyword)) {
          return model;
        }
      }
      // Direct model name match
      if (tierConfig.preferred_models.includes(modelHint) || tierConfig.fallback_providers.includes(modelHint)) {
        return modelHint;
      }
    }
    
    // Get default from routing table
    const routing = this.db.prepare('SELECT default_model FROM model_routing WHERE tier = ?').get(tier);
    if (routing && tierConfig.preferred_models.includes(routing.default_model)) {
      return routing.default_model;
    }
    
    // Fallback to first preferred model
    return tierConfig.preferred_models[0];
  }

  async createTask({ description, tier = 'auto', modelHint = null, priority = 'normal', submitToMesh = false, async = false }) {
    const taskId = uuidv4();
    
    // Classify tier if auto
    const finalTier = tier === 'auto' ? this.classifyTask(description, modelHint) : tier;
    
    // Select model
    const assignedModel = this.selectModel(finalTier, modelHint);
    
    // Get sanctuary routing
    const routing = this.getSanctuaryRouting(false);
    
    // Create task record
    this.db.prepare(`
      INSERT INTO tasks (id, description, tier, assigned_model, route, status, priority, model_hint, submit_to_mesh, async_mode)
      VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?)
    `).run(taskId, description, finalTier, assignedModel, routing.route, priority, modelHint || '', submitToMesh ? 1 : 0, async ? 1 : 0);
    
    // If submit to mesh, create mesh task
    if (submitToMesh) {
      await this.submitToMesh(taskId, description, finalTier);
    }
    
    // If async, start processing in background
    if (async) {
      this.processTaskAsync(taskId);
    }
    
    return {
      id: taskId,
      description,
      tier: finalTier,
      assignedModel,
      route: routing.route,
      status: 'pending',
      sanctuaryState: routing.state
    };
  }

  async submitToMesh(taskId, description, tier) {
    // Create task file for NSSP mesh
    const meshDir = this.config.get('paths.mesh_dir').replace('~', os.homedir());
    const taskDir = join(meshDir, 'tasks');
    const weight = tier === 'small' ? 'light' : 'heavy';
    
    const taskContent = `---\ntask_id: ${taskId}\nweight: ${weight}\ntimeout: ${this.config.get(`cerebellum.tiers.${tier}.max_duration_seconds`) || 300}\nstatus: pending\nclaimed_by: null\ntags: [cerebellum, ${tier}, auto-generated]\n---\n\n## Goal\n${description}\n\n## Acceptance Criteria\n- [ ] Task completed successfully\n- [ ] Result stored and accessible\n\n## Device Affinity\npreferred_device: ${this.config.get(`cerebellum.tiers.${tier}.device_affinity`)}\n`;
    
    await fs.mkdir(taskDir, { recursive: true });
    const taskFile = join(taskDir, `cerebellum-${taskId}.task.md`);
    await fs.writeFile(taskFile, taskContent);
    
    // Update task with mesh info
    this.db.prepare('UPDATE tasks SET metadata = ? WHERE id = ?').run(
      JSON.stringify({ meshTaskFile: taskFile, meshWeight: weight }),
      taskId
    );
  }

  async processTaskAsync(taskId) {
    // This would be implemented with actual model execution
    // For now, mark as running and simulate
    this.db.prepare('UPDATE tasks SET status = ?, started_at = CURRENT_TIMESTAMP WHERE id = ?').run('running', taskId);
    
    // Simulate processing
    setTimeout(() => {
      this.db.prepare('UPDATE tasks SET status = ?, completed_at = CURRENT_TIMESTAMP, result = ? WHERE id = ?').run(
        'completed',
        JSON.stringify({ output: 'Task completed (simulated)', model: this.db.prepare('SELECT assigned_model FROM tasks WHERE id = ?').get(taskId).assigned_model }),
        taskId
      );
    }, 5000);
  }

  async listTasks({ status = null, tier = null, limit = 20 }) {
    let query = 'SELECT * FROM tasks';
    const params = [];
    const conditions = [];
    
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (tier) {
      conditions.push('tier = ?');
      params.push(tier);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(limit);
    
    return this.db.prepare(query).all(...params);
  }

  async getTaskStatus(taskId) {
    return this.db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  }

  async cancelTask(taskId) {
    const task = this.db.prepare('SELECT status FROM tasks WHERE id = ?').get(taskId);
    if (!task) throw new Error('Task not found');
    if (task.status === 'completed') throw new Error('Cannot cancel completed task');
    
    this.db.prepare('UPDATE tasks SET status = ?, error = ? WHERE id = ?').run('cancelled', 'Cancelled by user', taskId);
  }

  async getStats() {
    const total = this.db.prepare('SELECT COUNT(*) as count FROM tasks').get().count;
    const pending = this.db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'pending'").get().count;
    const running = this.db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'running'").get().count;
    const completed = this.db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'completed'").get().count;
    const failed = this.db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'failed'").get().count;
    
    const byTier = {
      small: this.db.prepare("SELECT COUNT(*) as count FROM tasks WHERE tier = 'small'").get().count,
      medium: this.db.prepare("SELECT COUNT(*) as count FROM tasks WHERE tier = 'medium'").get().count,
      large: this.db.prepare("SELECT COUNT(*) as count FROM tasks WHERE tier = 'large'").get().count
    };
    
    const avgDuration = this.db.prepare('SELECT AVG(duration_ms) as avg FROM tasks WHERE duration_ms IS NOT NULL').get().avg || 0;
    const successRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
    
    return { total, pending, running, completed, failed, byTier, avgDuration: Math.round(avgDuration), successRate };
  }

  async showStatus() {
    await this.refreshSanctuaryState();
    const stats = await this.getStats();
    
    console.log(chalk.bold('\n🧠 Cerebellum Status'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(`Running: ${this.isRunning ? chalk.green('Yes') : chalk.red('No')}`);
    console.log(`Sanctuary: ${this.sanctuaryState.state} (${this.sanctuaryState.smoothed_vram_free_mb}MB free)`);
    console.log(`Tasks: ${stats.total} total | ${stats.pending} pending | ${stats.running} running | ${stats.completed} done | ${stats.failed} failed`);
    console.log(`By Tier: Small: ${stats.byTier.small} | Medium: ${stats.byTier.medium} | Large: ${stats.byTier.large}`);
    console.log(`Success Rate: ${stats.successRate}%`);
  }

  async startDaemon() {
    if (this.isRunning) {
      console.log(chalk.yellow('Cerebellum daemon already running'));
      return;
    }
    
    this.isRunning = true;
    console.log(chalk.green('🧠 Cerebellum daemon started'));
    
    // Poll for pending tasks every 10 seconds
    this.daemonInterval = setInterval(async () => {
      await this.refreshSanctuaryState();
      const pendingTasks = this.db.prepare("SELECT * FROM tasks WHERE status = 'pending' ORDER BY created_at ASC").all();
      
      for (const task of pendingTasks) {
        if (!this.isRunning) break;
        await this.executeTask(task.id);
      }
    }, 10000);
  }

  async stopDaemon() {
    this.isRunning = false;
    if (this.daemonInterval) {
      clearInterval(this.daemonInterval);
      this.daemonInterval = null;
    }
    console.log(chalk.yellow('🧠 Cerebellum daemon stopped'));
  }

  async executeTask(taskId) {
    const task = this.db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    if (!task || task.status !== 'pending') return;
    
    const startTime = Date.now();
    this.db.prepare('UPDATE tasks SET status = ?, started_at = CURRENT_TIMESTAMP WHERE id = ?').run('running', taskId);
    
    try {
      // Execute based on route
      let result;
      switch (task.route) {
        case 'LOCAL_CEREBELLUM':
        case 'LOCAL_BYPASS':
          result = await this.executeLocal(task);
          break;
        case 'HYBRID':
          result = await this.executeHybrid(task);
          break;
        case 'CLOUD_CORTEX':
          result = await this.executeCloud(task);
          break;
        default:
          result = await this.executeLocal(task);
      }
      
      const duration = Date.now() - startTime;
      this.db.prepare('UPDATE tasks SET status = ?, completed_at = CURRENT_TIMESTAMP, duration_ms = ?, result = ? WHERE id = ?')
        .run('completed', duration, JSON.stringify(result), taskId);
      
      // Record metrics
      this.db.prepare(`
        INSERT INTO task_metrics (task_id, tier, model, duration_ms, success)
        VALUES (?, ?, ?, ?, 1)
      `).run(taskId, task.tier, task.assigned_model, duration);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.db.prepare('UPDATE tasks SET status = ?, completed_at = CURRENT_TIMESTAMP, duration_ms = ?, error = ? WHERE id = ?')
        .run('failed', duration, error.message, taskId);
      
      this.db.prepare(`
        INSERT INTO task_metrics (task_id, tier, model, duration_ms, success)
        VALUES (?, ?, ?, ?, 0)
      `).run(taskId, task.tier, task.assigned_model, duration);
    }
  }

  async executeLocal(task) {
    // Execute via direct local Ollama (no auth) — serves the LOCAL_CEREBELLUM
    // route with the local model. Falls back to gateway proxy if configured.
    const prompt = `Task: ${task.description}\n\nExecute this task and provide the result.`;
    
    // Resolve the local Ollama model name, handling legacy aliases
    const ollamaModel = this.resolveOllamaModel(task.assigned_model);
    
    try {
      const response = await this.ollamaClient.post('/v1/chat/completions', {
        model: ollamaModel,
        messages: [{ role: 'user', content: prompt }],
        stream: false
      });
      return { output: response.data.choices?.[0]?.message?.content || 'No response', model: ollamaModel, provider: 'ollama-local' };
    } catch (error) {
      // Fallback to gateway LLM proxy (only if gateway client is configured)
      if (this.gatewayClient) {
        try {
          const response = await this.gatewayClient.post('/v1/chat/completions', {
            model: task.assigned_model,
            messages: [{ role: 'user', content: prompt }],
            route_local: true,
            requires_hardware: false
          });
          return { output: response.data.choices?.[0]?.message?.content || 'No response', model: task.assigned_model, provider: 'gateway-local' };
        } catch (gwError) {
          // Fall through to native /api/generate
        }
      }
      // Fallback to direct Ollama native /api/generate
      try {
        const response = await this.ollamaClient.post('/api/generate', {
          model: ollamaModel,
          prompt,
          stream: false
        });
        return { output: response.data.response || 'No response', model: ollamaModel, provider: 'ollama-generate' };
      } catch (finalError) {
        throw new Error(`Local execution failed: ${finalError.message}`);
      }
    }
  }
  
  resolveOllamaModel(modelName) {
    // Handle legacy aliases
    if (!modelName) return 'mythos:latest';
    const legacyMap = {
      'cosmos+shadow0482': 'mythos:latest',
      'cosmos': 'mythos:latest',
      'shadow': 'mythos:latest',
      'mythos': 'mythos:latest',
      'muse': 'mythos-cortex:latest',
      'hermes': 'mythos-cortex:latest',
      'gemma': 'mythos:latest',
      'edge': 'mythos:latest',
      'small': 'mythos:latest',
      'local-ollama': 'mythos:latest',
      'default': 'mythos:latest'
    };
    const lower = modelName.toLowerCase();
    if (legacyMap[lower]) return legacyMap[lower];
    // If it looks like an alias with +, try the first part
    if (modelName.includes('+')) {
      const first = modelName.split('+')[0].toLowerCase();
      if (legacyMap[first]) return legacyMap[first];
    }
    // Otherwise use as-is (already a real model tag)
    return modelName;
  }

  async executeHybrid(task) {
    // Local pre-check then cloud
    const precheck = await this.gatewayClient.post('/v1/speculative/precheck', {
      task_type: 'cerebellum_task',
      target_files: [],
      requires_hardware: false
    });

    if (precheck.data.routing.route === 'CLOUD_CORTEX') {
      return this.executeCloud(task);
    }

    return this.executeLocal(task);
  }

  async executeCloud(task) {
    // Execute via cloud provider (NVIDIA NIM, OpenRouter, etc.) with subagent delegation
    const fallbackChain = this.config.get('models.fallback_chain');
    const subagentConfig = this.config.get('models.subagent_delegation');
    
    // Check if subagent delegation is enabled
    const delegationEnabled = subagentConfig?.enabled === true;
    const orchestratorModels = subagentConfig?.orchestrator_models || [];
    const subagentModels = subagentConfig?.subagent_models || { heavy: 'nemotron-3-super', light: 'nemotron-3-nano' };
    const rateLimitConfig = subagentConfig?.rate_limit || { max_retries: 3, backoff_base_seconds: 2, max_backoff_seconds: 60, delegate_on_429: true, subagent_for_429: 'nemotron-3-super' };

    // Determine if current model is an orchestrator that can delegate
    const currentModel = task.assigned_model;
    const isOrchestrator = orchestratorModels.some(m => currentModel.includes(m));

    for (const model of fallbackChain) {
      let retries = 0;
      let lastError = null;
      
      while (retries <= rateLimitConfig.max_retries) {
        try {
          const response = await this.gatewayClient.post('/v1/chat/completions', {
            model,
            messages: [{ role: 'user', content: `Task: ${task.description}` }],
            route_local: false
          });
          return { output: response.data.choices?.[0]?.message?.content || 'No response', model, provider: 'cloud' };
        } catch (error) {
          lastError = error;
          
          // Check for 429 rate limit
          const isRateLimited = error.response?.status === 429 || error.message?.includes('429');
          
          if (isRateLimited && delegationEnabled && isOrchestrator && retries < rateLimitConfig.max_retries) {
            // Delegate to subagent instead of retrying
            const subagentModel = rateLimitConfig.subagent_for_429 || subagentModels.heavy;
            console.log(chalk.yellow(`⚡ Rate limited on ${model}, delegating to subagent ${subagentModel}...`));
            
            try {
              const subResponse = await this.gatewayClient.post('/v1/chat/completions', {
                model: subagentModel,
                messages: [{ 
                  role: 'user', 
                  content: `Task (delegated from ${model} due to rate limit): ${task.description}\n\nYou are a subagent. Execute this task efficiently.` 
                }],
                route_local: false
              });
              return { 
                output: subResponse.data.choices?.[0]?.message?.content || 'No response', 
                model: subagentModel, 
                provider: 'cloud-subagent',
                delegated_from: model,
                delegation_reason: 'rate_limit_429'
              };
            } catch (subError) {
              console.log(chalk.red(`Subagent ${subagentModel} also failed: ${subError.message}`));
              // Continue to next model in fallback chain
              break;
            }
          }
          
          // Exponential backoff for other errors
          if (retries < rateLimitConfig.max_retries) {
            const backoff = Math.min(
              rateLimitConfig.backoff_base_seconds * Math.pow(2, retries) * 1000,
              rateLimitConfig.max_backoff_seconds * 1000
            );
            console.log(chalk.yellow(`Cloud model ${model} failed (attempt ${retries + 1}/${rateLimitConfig.max_retries + 1}), backing off ${backoff}ms: ${error.message}`));
            await new Promise(r => setTimeout(r, backoff));
            retries++;
          } else {
            console.log(chalk.yellow(`Cloud model ${model} failed after ${retries + 1} attempts, trying next...`));
            break;
          }
        }
      }
    }

    throw new Error(`All cloud providers failed. Last error: ${lastError?.message || 'Unknown'}`);
  }
}