#!/usr/bin/env node

/**
 * 🜏 Lilith CLI — Knowledge Management System
 *
 * Persistent memory management with bidirectional sync,
 * task tracking, and knowledge graph integration.
 */

import chalk from 'chalk';

// ─── Knowledge Types ───

export const KNOWLEDGE_TYPES = {
  FACT: 'fact',           // A known fact
  TASK: 'task',            // A task to complete
  CONCEPT: 'concept',      // A concept or idea
  REFERENCE: 'reference', // A reference to external knowledge
  INSIGHT: 'insight',     // An insight or discovery
  GOAL: 'goal',            // A goal or objective
};

// ─── Memory Entry ───

class MemoryEntry {
  constructor(id, type, content, metadata = {}) {
    this.id = id;
    this.type = type;
    this.content = content;
    this.metadata = metadata;
    this.created = new Date().toISOString();
    this.updated = new Date().toISOString();
    this.accessCount = 0;
    this.lastAccessed = null;
  }

  access() {
    this.accessCount++;
    this.lastAccessed = new Date().toISOString();
    return this;
  }

  update(content) {
    this.content = content;
    this.updated = new Date().toISOString();
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      content: this.content,
      metadata: this.metadata,
      created: this.created,
      updated: this.updated,
      accessCount: this.accessCount,
      lastAccessed: this.lastAccessed,
    };
  }
}

// ─── Knowledge Store ───

class KnowledgeStore {
  constructor() {
    this.entries = new Map();
    this.typeIndex = {};
    this.tagIndex = {};
    this._nextId = 1;
  }

  /** Store a knowledge entry */
  store(type, content, metadata = {}) {
    const id = `${type}_${this._nextId++}_${Date.now()}`;
    const entry = new MemoryEntry(id, type, content, metadata);
    this.entries.set(id, entry);

    if (!this.typeIndex[type]) this.typeIndex[type] = [];
    this.typeIndex[type].push(id);

    if (metadata.tags) {
      for (const tag of metadata.tags) {
        if (!this.tagIndex[tag]) this.tagIndex[tag] = [];
        this.tagIndex[tag].push(id);
      }
    }

    return entry;
  }

  /** Get an entry by ID */
  get(id) {
    const entry = this.entries.get(id);
    if (entry) entry.access();
    return entry || null;
  }

  /** Get all entries */
  getAll() { return Array.from(this.entries.values()); }

  /** Get entries by type */
  getByType(type) {
    const ids = this.typeIndex[type] || [];
    return ids.map(id => this.entries.get(id)).filter(Boolean);
  }

  /** Get entries by tag */
  getByTag(tag) {
    const ids = this.tagIndex[tag] || [];
    return ids.map(id => this.entries.get(id)).filter(Boolean);
  }

  /** Query knowledge (search by content) */
  query(q) {
    const query = q.toLowerCase();
    return Array.from(this.entries.values()).filter(e =>
      e.content.toLowerCase().includes(query) ||
      e.metadata.name?.toLowerCase().includes(query)
    );
  }

  /** Remove an entry */
  remove(id) {
    const entry = this.entries.get(id);
    if (!entry) return false;
    this.entries.delete(id);
    const typeIds = this.typeIndex[entry.type] || [];
    this.typeIndex[entry.type] = typeIds.filter(i => i !== id);
    return true;
  }

  /** Get store stats */
  stats() {
    const typeCounts = {};
    for (const [type, ids] of Object.entries(this.typeIndex)) {
      typeCounts[type] = ids.length;
    }
    return {
      entries: this.entries.size,
      types: typeCounts,
      tags: Object.keys(this.tagIndex).length,
      nextId: this._nextId,
    };
  }

  /** Export all knowledge */
  export() {
    return this.getAll().map(e => e.toJSON());
  }
}

// ─── Task Manager ───

class TaskManager {
  constructor(store) {
    this.store = store;
  }

  /** Create a task */
  createTask(description, options = {}) {
    const task = {
      description,
      status: options.status || 'pending',
      priority: options.priority || 'medium',
      tags: options.tags || [],
      created: new Date().toISOString(),
      completed: null,
      id: null,
    };
    const entry = this.store.store(KNOWLEDGE_TYPES.TASK, JSON.stringify(task), { ...task, ...options });
    task.id = entry.id;
    return task;
  }

  /** Get all tasks */
  getTasks() {
    const entries = this.store.getByType(KNOWLEDGE_TYPES.TASK);
    return entries.map(e => {
      try {
        const parsed = JSON.parse(e.content);
        return { ...parsed, id: e.id };
      } catch { return e.metadata; }
    });
  }

  /** Complete a task */
  completeTask(taskId) {
    const entry = this.store.get(taskId);
    if (!entry) return null;
    const task = { ...entry.metadata, description: entry.content, id: entry.id };
    task.status = 'completed';
    task.completed = new Date().toISOString();
    entry.update(JSON.stringify(task));
    return task;
  }

  /** Get pending tasks */
  getPending() { return this.getTasks().filter(t => t.status === 'pending'); }

  /** Get task stats */
  stats() {
    const tasks = this.getTasks();
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    };
  }
}

// ─── Knowledge Manager ───

class KnowledgeManager {
  constructor() {
    this.store = new KnowledgeStore();
    this.tasks = new TaskManager(this.store);
  }

  /** Store a fact */
  fact(content, metadata = {}) {
    return this.store.store(KNOWLEDGE_TYPES.FACT, content, metadata);
  }

  /** Store a concept */
  concept(content, metadata = {}) {
    return this.store.store(KNOWLEDGE_TYPES.CONCEPT, content, metadata);
  }

  /** Store a reference */
  reference(content, metadata = {}) {
    return this.store.store(KNOWLEDGE_TYPES.REFERENCE, content, metadata);
  }

  /** Store an insight */
  insight(content, metadata = {}) {
    return this.store.store(KNOWLEDGE_TYPES.INSIGHT, content, metadata);
  }

  /** Store a goal */
  goal(content, metadata = {}) {
    return this.store.store(KNOWLEDGE_TYPES.GOAL, content, metadata);
  }

  /** Create a task */
  createTask(...args) { return this.tasks.createTask(...args); }

  /** Complete a task */
  completeTask(taskId) { return this.tasks.completeTask(taskId); }

  /** Query knowledge */
  query(q) { return this.store.query(q); }

  /** Get all knowledge */
  getAll() { return this.store.getAll(); }

  /** Get store stats */
    stats() { return this.store.stats(); }

    /** Get knowledge stats */
    getStats() { return this.store.stats(); }

  /** Get tool definitions */
  getModEngineToolDefinitions() {
    return [
      { type: 'function', function: { name: 'knowledge_store', description: 'Store knowledge', parameters: { type: 'object', properties: { type: { type: 'string' }, content: { type: 'string' } }, required: ['type', 'content'] } } },
      { type: 'function', function: { name: 'knowledge_query', description: 'Query knowledge', parameters: { type: 'object', properties: { q: { type: 'string' } }, required: ['q'] } } },
      { type: 'function', function: { name: 'knowledge_create_task', description: 'Create a task', parameters: { type: 'object', properties: { description: { type: 'string' } }, required: ['description'] } } },
      { type: 'function', function: { name: 'knowledge_list', description: 'List all knowledge', parameters: { type: 'object', properties: {} } } },
    ];
  }
}

export { KnowledgeManager, KnowledgeStore, TaskManager, MemoryEntry };
export default KnowledgeManager;