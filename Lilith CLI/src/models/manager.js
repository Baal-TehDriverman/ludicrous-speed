/**
 * 🤖 Model Manager
 * Handles model operations: list, pull, switch, benchmark, info
 */

import axios from 'axios';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class ModelManager {
  constructor(config) {
    this.config = config;
    this.ollamaClient = null;
    this.gatewayClient = null;
  }

  async init() {
    // Ollama client
    this.ollamaClient = axios.create({
      baseURL: 'http://localhost:11434',
      timeout: 60000
    });
    
    // Gateway client for LLM proxy
    const gatewayUrl = this.config.get('gateway.url');
    this.gatewayClient = axios.create({
      baseURL: gatewayUrl,
      timeout: 60000
    });
    
    return this;
  }

  async listModels(options = {}) {
    const models = [];
    
    // Get local Ollama models
    let localModels = [];
    try {
      const response = await this.ollamaClient.get('/api/tags');
      localModels = response.data.models || [];
    } catch {
      // Ollama not running
    }
    
    // Get gateway models (from LLM proxy)
    let gatewayModels = [];
    try {
      const response = await this.gatewayClient.get('/v1/models');
      gatewayModels = response.data.data || [];
    } catch {
      // Gateway not running
    }
    
    // Build unified model list from config
    const configModels = this.config.get('models');
    const fallbackChain = configModels.fallback_chain || [];
    
    // Main engine
    const mainEngine = configModels.main_engine;
    if (mainEngine) {
      models.push({
        name: mainEngine.name,
        alias: mainEngine.alias,
        description: `Main engine: ${mainEngine.repo}`,
        tiers: ['medium', 'large'],
        contextWindow: mainEngine.context_window,
        size: 'Quantized (Q4_K_M)',
        quantization: mainEngine.quantization,
        local: true,
        provider: 'cosmos+shadow0482',
        capabilities: mainEngine.capabilities
      });
    }
    
    // Edge model
    const edgeModel = configModels.edge_model;
    if (edgeModel) {
      models.push({
        name: edgeModel.name,
        description: 'Local edge model for phone/quick tasks',
        tiers: ['small'],
        contextWindow: edgeModel.context_window,
        size: '1B params',
        quantization: 'Q4_K_M',
        local: true,
        provider: 'Ollama',
        capabilities: ['fast', 'edge', 'low-vram']
      });
    }
    
    // NIM models
    for (const modelName of configModels.nim_models || []) {
      models.push({
        name: modelName,
        description: `NVIDIA NIM: ${modelName}`,
        tiers: ['medium', 'large'],
        contextWindow: 128000,
        size: 'Cloud',
        quantization: 'FP8/BF16',
        local: false,
        provider: 'NVIDIA NIM',
        capabilities: ['reasoning', 'coding', 'analysis']
      });
    }
    
    // Local Ollama models
    for (const modelName of configModels.local_ollama || []) {
      const isLocal = localModels.some(m => m.name.startsWith(modelName.split(':')[0]));
      models.push({
        name: modelName,
        description: `Local Ollama: ${modelName}`,
        tiers: this.getModelTiers(modelName),
        contextWindow: this.getContextWindow(modelName),
        size: isLocal ? 'Local' : 'Not pulled',
        quantization: 'Various',
        local: isLocal,
        provider: 'Ollama (Local)',
        capabilities: this.getModelCapabilities(modelName)
      });
    }
    
    // Filter by options
    if (options.local) {
      return models.filter(m => m.local);
    }
    if (options.cloud) {
      return models.filter(m => !m.local);
    }
    if (options.tier) {
      return models.filter(m => m.tiers.includes(options.tier));
    }
    
    return models;
  }

  getModelTiers(modelName) {
    const name = modelName.toLowerCase();
    if (name.includes('1b') || name.includes('nano') || name.includes('edge')) {
      return ['small'];
    }
    if (name.includes('70b') || name.includes('397b') || name.includes('550b') || name.includes('ultra') || name.includes('super')) {
      return ['medium', 'large'];
    }
    return ['medium'];
  }

  getContextWindow(modelName) {
    const name = modelName.toLowerCase();
    if (name.includes('gemma3')) return 1048576; // With jailbreak
    if (name.includes('nemotron')) return 128000;
    if (name.includes('qwen')) return 128000;
    if (name.includes('llama3.1')) return 128000;
    return 8192;
  }

  getModelCapabilities(modelName) {
    const name = modelName.toLowerCase();
    const caps = ['chat', 'completion'];
    if (name.includes('code') || name.includes('nemotron') || name.includes('deepseek')) caps.push('coding');
    if (name.includes('reasoning') || name.includes('nemotron-3')) caps.push('reasoning');
    if (name.includes('1b') || name.includes('nano')) caps.push('fast', 'low-vram');
    return caps;
  }

  async pullModel(modelName, quantization = null) {
    console.log(chalk.cyan(`Pulling ${modelName}${quantization ? ` (${quantization})` : ''}...`));
    
    const pullName = quantization ? `${modelName}:${quantization}` : modelName;
    
    try {
      const response = await this.ollamaClient.post('/api/pull', {
        name: pullName,
        stream: false
      });
      
      if (response.data.status === 'success') {
        console.log(chalk.green(`✅ Pulled ${pullName}`));
      } else {
        // Streaming response - wait for completion
        console.log(chalk.green(`✅ Pull initiated for ${pullName}`));
      }
    } catch (error) {
      throw new Error(`Failed to pull model: ${error.message}`);
    }
  }

  async setDefaultModel(tier, modelName) {
    const tiers = this.config.get('cerebellum.tiers');
    if (!tiers[tier]) {
      throw new Error(`Invalid tier: ${tier}. Use: small, medium, large`);
    }
    
    // Update routing table
    // This would need access to the cerebellum database
    // For now, update config
    const tierConfig = tiers[tier];
    if (!tierConfig.preferred_models.includes(modelName) && !tierConfig.fallback_providers.includes(modelName)) {
      console.log(chalk.yellow(`⚠️ Model ${modelName} not in preferred list for ${tier}, but setting anyway`));
    }
    
    // Update config
    this.config.set(`cerebellum.tiers.${tier}.preferred_models`, [modelName, ...tierConfig.preferred_models.filter(m => m !== modelName)]);
    
    console.log(chalk.green(`✅ Default ${tier} model updated to ${modelName}`));
  }

  async benchmark(modelName, options = {}) {
    const tokens = options.tokens || 100;
    const runs = options.runs || 3;
    
    console.log(chalk.cyan(`Benchmarking ${modelName} (${tokens} tokens x ${runs} runs)...`));
    
    const results = [];
    
    for (let i = 0; i < runs; i++) {
      const startTime = Date.now();
      
      try {
        const response = await this.gatewayClient.post('/v1/chat/completions', {
          model: modelName,
          messages: [{ role: 'user', content: `Generate exactly ${tokens} tokens of text about any topic.` }],
          max_tokens: tokens,
          route_local: true
        }, { timeout: 120000 });
        
        const duration = Date.now() - startTime;
        const responseTokens = response.data.usage?.completion_tokens || tokens;
        const tps = (responseTokens / duration) * 1000;
        
        results.push({
          duration,
          tokens: responseTokens,
          tokensPerSecond: tps
        });
        
        console.log(chalk.gray(`  Run ${i + 1}: ${duration}ms, ${tps.toFixed(1)} tok/s`));
      } catch (error) {
        console.log(chalk.red(`  Run ${i + 1} failed: ${error.message}`));
        results.push({ duration: 0, tokens: 0, tokensPerSecond: 0, error: error.message });
      }
    }
    
    const successful = results.filter(r => r.tokensPerSecond > 0);
    if (successful.length === 0) {
      throw new Error('All benchmark runs failed');
    }
    
    const avgTps = successful.reduce((a, b) => a + b.tokensPerSecond, 0) / successful.length;
    const avgLatency = successful.reduce((a, b) => a + b.duration, 0) / successful.length;
    
    // Estimate memory usage (rough)
    const modelInfo = await this.getModelInfo(modelName);
    const memoryMB = modelInfo.size.includes('Local') ? 4096 : 0; // Rough estimate
    
    return {
      tokensPerSecond: avgTps,
      avgLatency: Math.round(avgLatency),
      memoryMB,
      vramMB: memoryMB,
      runs: successful.length
    };
  }

  async getModelInfo(modelName) {
    // Get from config
    const configModels = this.config.get('models');
    
    // Check main engine
    if (configModels.main_engine && (configModels.main_engine.name === modelName || configModels.main_engine.alias === modelName)) {
      return {
        name: configModels.main_engine.name,
        alias: configModels.main_engine.alias,
        description: `Main engine: ${configModels.main_engine.repo}`,
        tiers: ['medium', 'large'],
        contextWindow: configModels.main_engine.context_window,
        size: 'Quantized (Q4_K_M)',
        quantization: configModels.main_engine.quantization,
        local: true,
        provider: 'cosmos+shadow0482',
        capabilities: configModels.main_engine.capabilities
      };
    }
    
    // Check edge model
    if (configModels.edge_model && configModels.edge_model.name === modelName) {
      return {
        name: configModels.edge_model.name,
        description: 'Local edge model',
        tiers: ['small'],
        contextWindow: configModels.edge_model.context_window,
        size: '1B params',
        quantization: 'Q4_K_M',
        local: true,
        provider: 'Ollama',
        capabilities: ['fast', 'edge', 'low-vram']
      };
    }
    
    // Check NIM models
    if (configModels.nim_models?.includes(modelName)) {
      return {
        name: modelName,
        description: `NVIDIA NIM: ${modelName}`,
        tiers: ['medium', 'large'],
        contextWindow: 128000,
        size: 'Cloud',
        quantization: 'FP8/BF16',
        local: false,
        provider: 'NVIDIA NIM',
        capabilities: ['reasoning', 'coding', 'analysis']
      };
    }
    
    // Check local Ollama
    if (configModels.local_ollama?.includes(modelName)) {
      return {
        name: modelName,
        description: `Local Ollama: ${modelName}`,
        tiers: this.getModelTiers(modelName),
        contextWindow: this.getContextWindow(modelName),
        size: 'Local',
        quantization: 'Various',
        local: true,
        provider: 'Ollama (Local)',
        capabilities: this.getModelCapabilities(modelName)
      };
    }
    
    // Check fallback chain
    if (configModels.fallback_chain?.includes(modelName)) {
      return {
        name: modelName,
        description: `Fallback model: ${modelName}`,
        tiers: ['medium', 'large'],
        contextWindow: 128000,
        size: 'Cloud',
        quantization: 'Various',
        local: false,
        provider: 'Cloud',
        capabilities: ['reasoning', 'coding']
      };
    }
    
    // Not found
    return {
      name: modelName,
      description: 'Unknown model',
      tiers: ['medium'],
      contextWindow: 8192,
      size: 'Unknown',
      quantization: 'Unknown',
      local: false,
      provider: 'Unknown',
      capabilities: []
    };
  }

  async listLocalModels() {
    try {
      const response = await this.ollamaClient.get('/api/tags');
      return response.data.models || [];
    } catch {
      return [];
    }
  }

  async deleteModel(modelName) {
    try {
      await this.ollamaClient.delete('/api/delete', { data: { name: modelName } });
      console.log(chalk.green(`✅ Deleted ${modelName}`));
    } catch (error) {
      throw new Error(`Failed to delete model: ${error.message}`);
    }
  }

  async getModelDetails(modelName) {
    try {
      const response = await this.ollamaClient.post('/api/show', { name: modelName });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get model details: ${error.message}`);
    }
  }

  /**
   * Merge two Ollama models via weighted tensor averaging (GGUF).
   * Uses the standalone merge_gguf.py script (real tensor merge).
   * @param {string} model1 - First model (e.g. 'mythos:65k')
   * @param {string} model2 - Second model (e.g. 'nemotron:65k')
   * @param {object} options - { w1, w2, name }
   */
  async mergeModel(model1, model2, options = {}) {
    const w1 = options.w1 ?? 0.6;
    const w2 = options.w2 ?? 0.4;
    const name = options.name || `lilith-merged-${model1.split(':')[0]}-${model2.split(':')[0]}`;

    const { execFile } = await import('child_process');
    const { promisify } = await import('util');
    const execFileP = promisify(execFile);

    const scriptPath = '/home/tehlappy/.hermes/skills/mlops/model-merging/scripts/merge_gguf.py';
    const args = [scriptPath, model1, model2, '--w1', String(w1), '--w2', String(w2), '--name', name];

    console.log(chalk.cyan(`\n🜏 Merging ${model1} (w=${w1}) + ${model2} (w=${w2})\n`));

    // The merge script requires /usr/bin/python3.14 with a CLEAN environment
    // (unset PYTHONPATH) so it picks up the python3.14 numpy/gguf, not the
    // hermes venv's python3.11 numpy that would ABI-crash.
    const mergeEnv = { ...process.env, PYTHONPATH: '', VIRTUAL_ENV: '' };

    try {
      const { stdout, stderr } = await execFileP('/usr/bin/python3.14', args, {
        timeout: 900000,
        env: mergeEnv
      });
      console.log(chalk.gray(stdout));
      if (stderr) console.log(chalk.yellow(stderr));
      console.log(chalk.green(`\n✅ Merged model registered as: ${name}`));
      return { name, stdout };
    } catch (error) {
      throw new Error(`Merge failed: ${error.stderr || error.message}`);
    }
  }
}