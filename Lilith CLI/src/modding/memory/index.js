#!/usr/bin/env node
/**
 * 🜏 Lilith CLI — Memory System
 *
 * Persistent user/project/session memory, fused with codebase-memory + mnemosyne MCP.
 * 5 memory types: User, Project, Session, Episodic, Knowledge.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LILITH_MEMORIES_DIR = join(__dirname, '..', '..', '.hermes', 'memories');
const PROJECT_MEMORY_DIR = join(__dirname, '..', 'memories');

// ─── Memory Types ───
const MEMORY_TYPES = {
  user: { file: 'user.json', desc: 'User preferences, name, role, style' },
  project: { file: 'project.json', desc: 'Project context, codebase facts, conventions' },
  session: { file: 'session.json', desc: 'Active session state, recent actions' },
  episodic: { file: 'episodic.jsonl', desc: 'Episodic memory log (append-only)' },
  knowledge: { file: 'knowledge.json', desc: 'Knowledge graph entries' },
};

/**
 * Memory Store — manages a single memory type
 */
class MemoryStore {
  constructor(type, options = {}) {
    this.type = type;
    this.config = MEMORY_TYPES[type] || { file: `${type}.json`, desc: type };
    this.file = join(options.dir || LILITH_MEMORIES_DIR, this.config.file);
    this.data = [];
    this.maxEntries = options.maxEntries || 500;
    this.load();
  }

  load() {
    try {
      if (!existsSync(this.file)) {
        this.data = [];
        return;
      }
      if (this.config.file.endsWith('.jsonl')) {
        const lines = readFileSync(this.file, 'utf8').trim().split('\n').filter(Boolean);
        this.data = lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
      } else {
        const raw = readFileSync(this.file, 'utf8');
        this.data = JSON.parse(raw);
      }
    } catch {
      this.data = [];
    }
  }

  save() {
    try {
      const dir = dirname(this.file);
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
      if (this.config.file.endsWith('.jsonl')) {
        const content = this.data.map(e => JSON.stringify(e)).join('\n') + '\n';
        writeFileSync(this.file, content);
      } else {
        writeFileSync(this.file, JSON.stringify(this.data, null, 2));
      }
    } catch (err) {
      console.log(chalk.yellow(`⚠️  Memory save error (${this.type}): ${err.message}`));
    }
  }

  add(entry) {
    const record = {
      id: uuidv4(),
      type: this.type,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.data.push(record);
    if (this.data.length > this.maxEntries) this.data = this.data.slice(-this.maxEntries);
    this.save();
    return record;
  }

  get(id) { return this.data.find(e => e.id === id); }
  getAll() { return [...this.data]; }

  query(keywords, options = {}) {
    const limit = options.limit || 20;
    return this.data.filter(e => {
      const text = JSON.stringify(e).toLowerCase();
      return keywords.some(k => text.includes(k.toLowerCase()));
    }).slice(-limit);
  }

  remove(id) {
    const idx = this.data.findIndex(e => e.id === id);
    if (idx >= 0) { this.data.splice(idx, 1); this.save(); return true; }
    return false;
  }

  /** Summarize memory store stats */
  stats() {
    return { type: this.type, count: this.data.length, maxEntries: this.maxEntries, file: this.file };
  }
}

/**
 * Memory Manager — orchestrates all memory types
 */
class LilithMemory {
  constructor(options = {}) {
    this.options = options;
    this.stores = {};
    this.mcpEnabled = options.mcpEnabled !== false;
    this._initStores();
  }

  _initStores() {
    for (const [type, config] of Object.entries(MEMORY_TYPES)) {
      this.stores[type] = new MemoryStore(type, {
        dir: this.options.dir,
        maxEntries: config.file.endsWith('.jsonl') ? 1000 : 200,
      });
    }
  }

  /** Get a memory store by type */
  get(type) { return this.stores[type] || null; }

  /** Add a memory entry */
  add(type, content, metadata = {}) {
    const store = this.stores[type];
    if (!store) return { success: false, error: `Unknown memory type: ${type}` };
    const record = store.add({ content, ...metadata });
    return { success: true, record, type };
  }

  /** Query all memory types */
  query(keywords, options = {}) {
    const results = {};
    for (const [type, store] of Object.entries(this.stores)) {
      const matches = store.query(keywords, options);
      if (matches.length > 0) results[type] = matches;
    }
    return results;
  }

  /** Get all memory stats */
  stats() {
    const stats = {};
    for (const [type, store] of Object.entries(this.stores)) {
      stats[type] = store.stats();
    }
    return stats;
  }

  /** Load a skill memory file into the knowledge store */
  loadSkill(path) {
    return new Promise((resolve) => {
      import('fs').then(fs => {
        try {
          const content = fs.readFileSync(path, 'utf8');
          resolve(this.add('knowledge', content, { source: path, skill: true }));
        } catch (err) {
          resolve({ success: false, error: err.message });
        }
      }).catch(err => resolve({ success: false, error: err.message }));
    });
  }

  /** Export all memories as JSON */
  exportAll() {
    const data = {};
    for (const [type, store] of Object.entries(this.stores)) {
      data[type] = store.getAll();
    }
    return data;
  }
}

/**
 * Get tool definitions for the mod engine
 */
export function getMemoryToolDefinitions() {
  return [
    {
      type: 'function',
      function: {
        name: 'memory_add',
        description: 'Add a memory entry',
        parameters: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['user', 'project', 'session', 'episodic', 'knowledge'], description: 'Memory type' },
            content: { type: 'string', description: 'Memory content' },
          },
          required: ['type', 'content'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'memory_query',
        description: 'Query memories by keywords',
        parameters: {
          type: 'object',
          properties: {
            keywords: { type: 'array', items: { type: 'string' }, description: 'Keywords to search' },
            limit: { type: 'number', description: 'Max results', default: 20 },
          },
          required: ['keywords'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'memory_stats',
        description: 'Show memory store statistics',
        parameters: { type: 'object', properties: {} },
      },
    },
  ];
}

/** Get tool definitions for mod engine */
const getModEngineToolDefinitions = () => getToolDefinitions();

export default LilithMemory;
export { MemoryStore, MEMORY_TYPES };
