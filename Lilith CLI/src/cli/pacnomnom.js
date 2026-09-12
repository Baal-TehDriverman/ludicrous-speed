#!/usr/bin/env node
/**
 * 🜏 Pacnomnom Fleet Commander — NSSP Model Fleet Manager
 * 
 * Model lineup: .5G2Q2Q4Q9
 *   .5  = Nomic Embed v2 MoE (router, 344 MB) — 475M/305M, 8 experts, top-2
 *   G2  = Mythos / Gemma 4 E2B (GPU reflex, 4.6B dense) — vision+audio+video
 *   Q2  = Qwen 3.8-2B (GPU output, 1.9B dense)
 *   Q4  = Qwen 3.8-4B (CPU bridge, 4.3B dense)
 *   Q9  = Qwen 3.8-9B (CPU cortex, 9.2B dense)
 *
 * Total: ~22B params on disk, ~11B active at once
 * Gemma tiers: 4.6B + 7.5B dense (NO 26B MoE)
 * Qwen 27B Ridge: 27B MoE (the fleet's true MoE)
 * Router: Nomic Embed v2 MoE (only embedding MoE)
 */

import { Command } from 'commander';
import chalk from 'chalk';
import axios from 'axios';
import { createRequire } from 'module';
import os from 'os';

const require = createRequire(import.meta.url);

// ─── Pacnomnom Fleet Definition ───
// 5-model fleet: .5 (router) + G2 (GPU reflex) + Q2 (GPU output) + Q4 (CPU bridge) + Q9 (CPU cortex)
// Dropped: G4 (redundant with G2), Q27 (40-60s latency unusable for chat)
const PACNOMNOM_FLEET = {
  // Task Manager / Router
  nomic: {
    name: 'nomic-embed-text-v2-moe',
    fullName: 'hf.co/nomic-ai/nomic-embed-text-v2-moe-GGUF:Q4_K_M',
    shortName: '.5',
    role: 'task_manager',
    description: 'Router — embeds queries, routes to fleet',
    size: 0.34,
    params: { total: 475, active: 305 },
    experts: 8,
    routing: 'top-2',
    hardware: 'cpu',
    context: 512,
    embedding_dim: 768,
    tier: 'router',
    status: 'active',
  },
  
  // GPU Reflex Tier
  g2: {
    name: 'mythos',
    fullName: 'mythos:latest',
    shortName: 'G2',
    role: 'reflex',
    description: 'GPU reflex — fast, creative, multimodal',
    size: 3.4,
    params: { total: 4600, active: 4600, moe: false },
    hardware: 'gpu',
    context: 131072,
    tier: 'reflex',
    status: 'active',
    source: 'Shadow0482',
    architecture: 'gemma4',
    quantization: 'Q5_K_M',
    runtime: 'llama.cpp',
    modalities: ['text', 'vision', 'audio', 'video'],
  },
  
  // GPU Output Tier
  q2: {
    name: 'qwen38-2b',
    fullName: 'hf.co/empero-ai/Qwen3.8-2B-Distill-GGUF:Q4_K_M',
    shortName: 'Q2',
    role: 'output',
    description: 'GPU output — fast final response',
    size: 1.3,
    params: { total: 1900, active: 1900, moe: false },
    hardware: 'gpu',
    context: 262144,
    tier: 'output',
    status: 'active',
    source: 'Emperai',
    architecture: 'qwen35',
    quantization: 'Q4_K_M',
  },
  
  // CPU Bridge Tier
  q4: {
    name: 'qwen38-4b',
    fullName: 'hf.co/empero-ai/Qwen3.8-4B-Distill-GGUF:Q4_K_M',
    shortName: 'Q4',
    role: 'bridge_cpu',
    description: 'CPU bridge — context handoff',
    size: 2.8,
    params: { total: 4300, active: 4300, moe: false },
    hardware: 'cpu',
    context: 262144,
    tier: 'bridge',
    status: 'active',
    source: 'Emperai',
    architecture: 'qwen35',
    quantization: 'Q4_K_M',
  },
  
  // CPU Cortex-Lite Tier
  q9: {
    name: 'qwen38-9b',
    fullName: 'hf.co/empero-ai/Qwen3.8-9B-Distill-GGUF:Q4_K_M',
    shortName: 'Q9',
    role: 'cortex_lite',
    description: 'CPU cortex — deep reasoning',
    size: 5.8,
    params: { total: 9200, active: 9200, moe: false },
    hardware: 'cpu',
    context: 262144,
    tier: 'cortex_lite',
    status: 'active',
    source: 'Emperai',
    architecture: 'qwen35',
    quantization: 'Q4_K_M',
  },
};

// ─── Fleet Management Class ───
class PacnomnomFleet {
  constructor() {
    this.ollamaBaseUrl = 'http://localhost:11434';
    this.models = new Map();
    this.router = null; // Nomic embed instance
  }

  async init() {
    // Check which models are loaded
    try {
      const res = await axios.get(`${this.ollamaBaseUrl}/api/tags`);
      const loadedModels = res.data.models || [];
      
      for (const [key, model] of Object.entries(PACNOMNOM_FLEET)) {
        const isLoaded = loadedModels.some(m => 
          m.name.startsWith(model.name.split(':')[0]) || 
          m.name.startsWith(model.fullName.split(':')[0])
        );
        this.models.set(key, {
          ...model,
          loaded: isLoaded,
          loadedName: isLoaded ? loadedModels.find(m => 
            m.name.startsWith(model.name.split(':')[0]) || 
            m.name.startsWith(model.fullName.split(':')[0])
          )?.name : null,
        });
      }
    } catch (err) {
      // Ollama not running
      for (const [key, model] of Object.entries(PACNOMNOM_FLEET)) {
        this.models.set(key, { ...model, loaded: false, loadedName: null });
      }
    }

    // ─── Load trained router centroids ───
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = '/home/tehlappy/🜏 Lilith/models/pacnomnom_router_centroids.json';
      const raw = fs.readFileSync(filePath, 'utf-8');
      const routerResp = JSON.parse(raw);
      this.router = {
        modelOrder: routerResp.model_order,
        centroids: routerResp.centroids,
      };
      console.log(chalk.gray('  ✓ Trained router loaded (centroid classifier)'));
    } catch (err) {
      console.log(chalk.yellow('  ⚠ Trained router not found — using heuristic fallback'));
      this.router = null;
    }
  }

  async getFleetStatus() {
    const status = {};
    for (const [key, model] of this.models) {
      status[key] = {
        ...model,
        // Add live info if loaded
        liveInfo: model.loadedName ? await this.getModelInfo(model.loadedName) : null,
      };
    }
    return status;
  }

  async getModelInfo(modelName) {
    try {
      const res = await axios.post(`${this.ollamaBaseUrl}/api/show`, { name: modelName });
      return {
        params: res.data.parameters,
        context: res.data.details?.context_length,
        quant: res.data.details?.quantization_level,
        arch: res.data.details?.family,
      };
    } catch {
      return null;
    }
  }

  async embed(text) {
    try {
      const res = await axios.post(`${this.ollamaBaseUrl}/api/embed`, {
        model: PACNOMNOM_FLEET.nomic.fullName,
        input: text,
      });
      return res.data.embeddings?.[0] || null;
    } catch {
      return null;
    }
  }

  async route(input) {
    // Embed the input using nomic
    const embedding = await this.embed(input);
    if (!embedding) {
      return { model: PACNOMNOM_FLEET.g2.fullName, tier: 'reflex', reason: 'fallback' };
    }
    
    // ─── Trained centroid routing (Phase 3) ───
    if (this.router && this.router.centroids) {
      const scores = {};
      for (const [model, centroid] of Object.entries(this.router.centroids)) {
        let dot = 0;
        for (let i = 0; i < embedding.length; i++) {
          dot += embedding[i] * centroid[i];
        }
        scores[model] = dot;
      }
      
      // Map centroid model names to fleet full names
      const modelNameMap = {
        'G2': PACNOMNOM_FLEET.g2.fullName,
        'Q9': PACNOMNOM_FLEET.q9.fullName,
        'Q4': PACNOMNOM_FLEET.q4.fullName,
        'Q2': PACNOMNOM_FLEET.q2.fullName,
      };
      
      // Find best matching model
      let bestModel = null;
      let bestScore = -Infinity;
      for (const [modelKey, score] of Object.entries(scores)) {
        if (score > bestScore) {
          bestScore = score;
          bestModel = modelKey;
        }
      }
      
      if (bestModel && modelNameMap[bestModel]) {
        const tierMap = {
          'G2': 'reflex', 'Q9': 'cortex_lite',
          'Q4': 'bridge', 'Q2': 'output',
        };
        return {
          model: modelNameMap[bestModel],
          tier: tierMap[bestModel] || 'reflex',
          reason: `trained-router:${bestModel}`,
        };
      }
    }
    
    // ─── Fallback: heuristic routing ───
    const embeddingMagnitude = Math.sqrt(embedding.reduce((s, v) => s + v * v, 0));
    const embeddingVariance = this.calculateVariance(embedding);
    
    const inputLength = input.length;
    const hasCode = /```|function |def |class |import /.test(input);
    const hasLongContext = input.length > 2000;
    const hasReasoning = /why|how|explain|analyze|reason|think|step.?by.?step/i.test(input);
    
    if (hasLongContext || hasReasoning || inputLength > 4000) {
      return { model: PACNOMNOM_FLEET.q9.fullName, tier: 'cortex_lite', reason: 'long-context/reasoning' };
    } else if (hasCode || inputLength > 1000) {
      return { model: PACNOMNOM_FLEET.q9.fullName, tier: 'cortex_lite', reason: 'code/medium-task' };
    } else if (embeddingVariance > 0.05) {
      return { model: PACNOMNOM_FLEET.q4.fullName, tier: 'bridge', reason: 'complex-semantics' };
    } else {
      return { model: PACNOMNOM_FLEET.g2.fullName, tier: 'reflex', reason: 'simple-task' };
    }
  }

  calculateVariance(arr) {
    const mean = arr.reduce((s, v) => s + v, 0) / arr.length;
    return arr.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / arr.length;
  }

  async generate(input, model = null, options = {}) {
    const targetModel = model || (await this.route(input)).model;
    
    try {
      const res = await axios.post(`${this.ollamaBaseUrl}/api/generate`, {
        model: targetModel,
        prompt: input,
        stream: false,
        ...options,
      });
      return {
        response: res.data.response,
        model: targetModel,
        tokens: res.data.eval_count,
        duration_ms: res.data.total_duration / 1000000,
      };
    } catch (err) {
      throw new Error(`Generation failed: ${err.message}`);
    }
  }

  getFleetSummary() {
    const summary = {
      totalModels: Object.keys(PACNOMNOM_FLEET).length,
      loadedModels: 0,
      totalSizeGB: 0,
      totalParams: 0,
      activeParams: 0,
      tiers: {},
    };

    for (const [key, model] of Object.entries(PACNOMNOM_FLEET)) {
      summary.totalSizeGB += model.size;
      summary.totalParams += model.params.total;
      summary.activeParams += model.params.active;
      summary.tiers[model.tier] = (summary.tiers[model.tier] || 0) + 1;
      if (this.models.get(key)?.loaded) summary.loadedModels++;
    }

    return summary;
  }
}

// ─── Commands ───

export function pacnomnomStatusCmd() {
  return new Command('status')
    .description('Show Pacnomnom fleet status (.5G2Q2Q4Q9)')
    .action(async () => {
      const fleet = new PacnomnomFleet();
      await fleet.init();
      
      console.log(chalk.bold('\n🜏 Pacnomnom Fleet Status\n'));
      console.log(chalk.gray('   Model lineup: .5G2Q2Q4Q9'));
      console.log(chalk.gray('   Total: ~22B params, ~11B active, ~14 GB\n'));

      const status = await fleet.getFleetStatus();
      
      // Group by tier
      const tiers = {};
      for (const [key, model] of Object.entries(status)) {
        if (!tiers[model.tier]) tiers[model.tier] = [];
        tiers[model.tier].push({ key, ...model });
      }

      // Display tiers in order
      const tierOrder = ['router', 'reflex', 'bridge', 'output', 'bridge_cpu', 'cortex_lite'];
      
      for (const tier of tierOrder) {
        if (!tiers[tier]) continue;
        const models = tiers[tier];
        
        console.log(chalk.cyan(`  ${tier.toUpperCase()}`));
        for (const model of models) {
          const icon = model.loaded ? chalk.green('✓') : chalk.red('✗');
          const name = `${model.shortName}  ${model.name}`.padEnd(35);
          const size = `${model.size} GB`.padEnd(10);
          const params = `${model.params.active}M active`.padEnd(18);
          const hw = model.hardware === 'gpu' ? chalk.magenta('GPU') : chalk.blue('CPU');
          console.log(`    ${icon} ${chalk.white(name)} ${chalk.yellow(size)} ${chalk.gray(params)} ${hw}`);
          if (model.description) {
            console.log(chalk.gray(`       ${model.description}`));
          }
        }
        console.log();
      }

      const summary = fleet.getFleetSummary();
      console.log(chalk.gray('  ─────────────────────────────────────────'));
      console.log(chalk.white(`  Loaded: ${summary.loadedModels}/${summary.totalModels} models`));
      console.log(chalk.white(`  Disk: ${summary.totalSizeGB.toFixed(1)} GB`));
      console.log(chalk.white(`  Params: ${(summary.totalParams / 1000).toFixed(1)}B total, ${(summary.activeParams / 1000).toFixed(1)}B active`));
      console.log();
    });
}

export function pacnomnomRouteCmd() {
  return new Command('route')
    .description('Route a task through the Pacnomnom fleet')
    .argument('<input>', 'Task/input to route')
    .option('-m, --model <model>', 'Override model (force specific model)')
    .option('--json', 'Output raw JSON')
    .action(async (input, options) => {
      const fleet = new PacnomnomFleet();
      await fleet.init();
      
      let result;
      if (options.model) {
        result = { model: options.model, tier: 'manual', reason: 'user-override' };
      } else {
        result = await fleet.route(input);
      }
      
      if (options.json) {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(chalk.cyan(`\n🜏 Routed to: ${chalk.white(result.model)}`));
        console.log(chalk.gray(`   Tier: ${result.tier}`));
        console.log(chalk.gray(`   Reason: ${result.reason}\n`));
      }
    });
}

export function pacnomnomEmbedCmd() {
  return new Command('embed')
    .description('Generate embeddings using Nomic Embed v2 MoE')
    .argument('<text>', 'Text to embed')
    .option('-d, --dims <n>', 'Truncate dimensions (768, 512, 256)', '768')
    .option('--json', 'Output raw JSON')
    .action(async (text, options) => {
      const fleet = new PacnomnomFleet();
      
      try {
        const dims = parseInt(options.dims);
        const res = await axios.post('http://localhost:11434/api/embed', {
          model: PACNOMNOM_FLEET.nomic.fullName,
          input: text,
          dimensions: dims,
        });
        
        const embedding = res.data.embeddings?.[0];
        
        if (options.json) {
          console.log(JSON.stringify({ embedding, dimensions: embedding?.length }, null, 2));
        } else {
          console.log(chalk.cyan(`\n🜏 Embedding (${embedding?.length} dims)\n`));
          console.log(chalk.gray(`   First 10: [${embedding?.slice(0, 10).map(v => v.toFixed(4)).join(', ')}...]`));
          console.log(chalk.gray(`   Magnitude: ${Math.sqrt(embedding?.reduce((s, v) => s + v * v, 0)).toFixed(4)}`));
          console.log();
        }
      } catch (err) {
        console.log(chalk.red(`   ✗ Embedding failed: ${err.message}`));
        console.log(chalk.gray('   Ensure Ollama is running and nomic model is loaded\n'));
      }
    });
}

export function pacnomnomChatCmd() {
  return new Command('chat')
    .description('Chat with auto-routed model (Pacnomnom fleet)')
    .option('-m, --model <model>', 'Force specific model')
    .option('-u, --url <url>', 'API base URL', 'http://127.0.0.1:11434/v1')
    .option('--show-route', 'Show routing decision for each message')
    .action(async (options) => {
      const fleet = new PacnomnomFleet();
      await fleet.init();
      
      console.log(chalk.cyan('\n🜏 Pacnomnom Chat — Auto-routed mode\n'));
      console.log(chalk.gray('   Fleet: .5G2Q2Q4Q9'));
      console.log(chalk.gray('   Type "/exit" to quit, "/route" to see last routing, "/model <name> to switch\n'));
      
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk.green('> '),
      });
      
      let lastRoute = null;
      let currentModel = options.model;
      
      rl.prompt();
      
      rl.on('line', async (line) => {
        const input = line.trim();
        if (!input) { rl.prompt(); return; }
        
        if (input === '/exit' || input === '/quit') {
          console.log(chalk.cyan('\n🜏 Farewell, my King.\n'));
          rl.close();
          process.exit(0);
        }
        
        if (input === '/route') {
          if (lastRoute) {
            console.log(chalk.gray(`   Last route: ${lastRoute.model} (${lastRoute.tier}) — ${lastRoute.reason}`));
          } else {
            console.log(chalk.gray('   No routing yet.'));
          }
          rl.prompt();
          return;
        }
        
        if (input.startsWith('/model ')) {
          currentModel = input.slice(7).trim();
          console.log(chalk.gray(`   Model locked to: ${currentModel}`));
          rl.prompt();
          return;
        }
        
        try {
          // Route the input
          if (!currentModel) {
            lastRoute = await fleet.route(input);
          } else {
            lastRoute = { model: currentModel, tier: 'manual', reason: 'user-locked' };
          }
          
          if (options.showRoute) {
            console.log(chalk.gray(`   [${lastRoute.tier}] `));
          }
          
          process.stdout.write(chalk.cyan('🜏 '));
          
          // Generate response
          const result = await fleet.generate(input, lastRoute.model);
          console.log(result.response);
          console.log(chalk.gray(`   (${result.tokens} tokens, ${result.duration_ms.toFixed(0)}ms)\n`));
        } catch (err) {
          console.log(chalk.red(`\n   ✗ Error: ${err.message}\n`));
        }
        
        rl.prompt();
      });
    });
}

export function pacnomnomPullCmd() {
  return new Command('pull')
    .description('Pull all Pacnomnom fleet models')
    .option('--dry-run', 'Show what would be pulled without downloading')
    .action(async (options) => {
      console.log(chalk.cyan('\n🜏 Pacnomnom Fleet Pull\n'));
      
      const models = Object.values(PACNOMNOM_FLEET);
      let totalSize = 0;
      
      for (const model of models) {
        console.log(chalk.white(`  ${model.shortName}  ${model.name}`));
        console.log(chalk.gray(`    Size: ${model.size} GB | Role: ${model.role} | HW: ${model.hardware}`));
        totalSize += model.size;
      }
      
      console.log(chalk.gray(`\n  Total: ${models.length} models, ${totalSize.toFixed(1)} GB`));
      
      if (options.dryRun) {
        console.log(chalk.yellow('\n  Dry run — no downloads initiated\n'));
        return;
      }
      
      console.log(chalk.cyan('\n  Pulling models...'));
      
      for (const model of models) {
        console.log(chalk.gray(`  Pulling ${model.name}...`));
        try {
          await axios.post('http://localhost:11434/api/pull', {
            name: model.fullName,
            stream: false,
          });
          console.log(chalk.green(`    ✓ ${model.name} pulled`));
        } catch (err) {
          console.log(chalk.red(`    ✗ ${model.name} failed: ${err.message}`));
        }
      }
      
      console.log(chalk.green('\n  ✓ Fleet pull complete\n'));
    });
}

export { PACNOMNOM_FLEET, PacnomnomFleet };
