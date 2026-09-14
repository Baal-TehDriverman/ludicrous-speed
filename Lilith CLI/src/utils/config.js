/**
 * Configuration loader for Lilith CLI
 * Loads from config/lilith.yaml with environment variable overrides
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Config {
  constructor() {
    this.data = {};
    this.configPath = null;
  }

  async load(configPath = null) {
    // Determine config path
    const possiblePaths = [
      configPath,
      path.join(__dirname, '../../config/lilith.yaml'),
      path.join(process.cwd(), 'config/lilith.yaml'),
      path.join(os.homedir(), '.lilith/config.yaml'),
      '/home/tehlappy/🜏 Lilith/Lilith CLI/config/lilith.yaml'
    ].filter(Boolean);

    for (const p of possiblePaths) {
      const expanded = p.replace('~', os.homedir());
      if (fs.existsSync(expanded)) {
        this.configPath = expanded;
        break;
      }
    }

    if (!this.configPath) {
      throw new Error('No config file found. Expected at config/lilith.yaml or ~/.lilith/config.yaml');
    }

    const content = fs.readFileSync(this.configPath, 'utf8');
    this.data = yaml.parse(content);
    
    // Expand paths
    this.expandPaths(this.data);
    
    // Apply environment overrides
    this.applyEnvOverrides();
    return this;
    
    return this;
  }

  expandPaths(obj, basePath = '') {
    for (const [key, value] of Object.entries(obj)) {
      const fullPath = basePath ? `${basePath}.${key}` : key;
      
      // Only expand ~ paths, not already absolute paths
      if (typeof value === 'string' && value.startsWith('~/')) {
        obj[key] = value.replace('~/', `${os.homedir()}/`);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        this.expandPaths(value, fullPath);
      } else if (Array.isArray(value)) {
        value.forEach((v, i) => {
          if (typeof v === 'string' && v.startsWith('~/')) {
            value[i] = v.replace('~/', `${os.homedir()}/`);
          }
        });
      }
    }
  }

  applyEnvOverrides() {
    // Gateway URL override
    if (process.env.LILITH_GATEWAY_URL) {
      this.data.gateway.url = process.env.LILITH_GATEWAY_URL;
    }
    
    // Mesh repo override
    if (process.env.LILITH_MESH_REPO) {
      this.data.mesh.repo = process.env.LILITH_MESH_REPO;
    }
    
    // GitHub token
    if (process.env.GITHUB_TOKEN) {
      this.data.mesh.githubToken = process.env.GITHUB_TOKEN;
    }
    
    // Device label
    if (process.env.NSSP_DEVICE_LABEL) {
      this.data.mesh.deviceLabel = process.env.NSSP_DEVICE_LABEL;
    }
    
    // Task weight
    if (process.env.NSSP_TASK_WEIGHT) {
      this.data.mesh.taskWeight = process.env.NSSP_TASK_WEIGHT;
    }
    
    // Log level
    if (process.env.LILITH_LOG_LEVEL) {
      this.data.logging.level = process.env.LILITH_LOG_LEVEL;
    }
  }

  get(key) {
    return key.split('.').reduce((obj, k) => obj?.[k], this.data);
  }

  set(key, value) {
    const keys = key.split('.');
    const last = keys.pop();
    const target = keys.reduce((obj, k) => {
      if (!obj[k]) obj[k] = {};
      return obj[k];
    }, this.data);
    target[last] = value;
    
    // Persist to file
    this.save();
  }

  all() {
    return this;
  }

  save() {
    if (this.configPath) {
      const content = yaml.stringify(this.data);
      fs.writeFileSync(this.configPath, content);
    }
  }
}

export async function loadConfig(configPath = null) {
  const config = new Config();
  await config.load(configPath);
  return config;
}

export { Config };