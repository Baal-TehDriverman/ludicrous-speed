#!/usr/bin/env node
/**
 * Cerebellum Daemon — production launcher
 * Imports the Cerebellum class, initializes, and starts the daemon loop.
 */
import { Cerebellum } from './src/cerebellum/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build config from lilith.yaml + env overrides
function buildConfig() {
  const configPath = path.join(__dirname, 'config/lilith.yaml');
  const raw = fs.readFileSync(configPath, 'utf8');
  const lines = raw.split('\n');
  const result = {};
  let currentPath = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const indent = line.search(/\S/);
    const parts = trimmed.split(':');
    const key = parts[0].trim();
    const value = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, '');
    
    while (currentPath.length > indent) currentPath.pop();
    
    if (value === '') {
      currentPath.push(key);
      const pathStr = currentPath.join('.');
      result[pathStr] = {};
    } else {
      const pathStr = [...currentPath, key].join('.');
      try {
        result[pathStr] = JSON.parse(value);
      } catch {
        result[pathStr] = value;
      }
    }
  }
  
  if (process.env.CEREBELLUM_DB_PATH) result['cerebellum.db_path'] = process.env.CEREBELLUM_DB_PATH;
  if (process.env.GATEWAY_URL) result['gateway.url'] = process.env.GATEWAY_URL;
  
  return result;
}

// Config wrapper that provides .get() method — the Cerebellum class expects this
class ConfigAdapter {
  constructor(data) {
    this.data = data;
  }
  get(key) {
    return this.data[key] || null;
  }
}

async function main() {
  const rawConfig = buildConfig();
  const config = new ConfigAdapter(rawConfig);
  
  // Override paths for this session
  config.data['cerebellum.db_path'] = path.join(os.homedir(), '.lilith/cerebellum.db');
  config.data['gateway.url'] = 'http://localhost:8080';
  config.data['cerebellum.ollama_base'] = 'http://localhost:11434';
  
  console.log(`[${new Date().toISOString()}] 🧠 Cerebellum Daemon v2.0`);
  console.log(`  DB: ${config.get('cerebellum.db_path')}`);
  console.log(`  Gateway: ${config.get('gateway.url')}`);
  console.log(`  Ollama: ${config.get('cerebellum.ollama_base')}`);
  
  const cerebellum = new Cerebellum(config);
  
  try {
    await cerebellum.init();
    console.log('  ✓ Initialized');
    console.log(`  Sanctuary: ${cerebellum.sanctuaryState?.state || 'unknown'}`);
    
    await cerebellum.startDaemon();
    console.log('  ✓ Daemon polling every 10s');
    console.log('  Waiting for tasks...');
    
  } catch (err) {
    console.error('Fatal:', err.message);
    process.exit(1);
  }
}

main().catch(e => {
  console.error('Cerebellum daemon failed:', e);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  process.exit(0);
});
