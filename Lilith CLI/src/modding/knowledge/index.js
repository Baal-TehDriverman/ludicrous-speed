#!/usr/bin/env node

/**
 * 🜏 Lilith CLI — Knowledge Graph Indexer
 *
 * Indexes codebase memory, syncs with codebase-memory MCP,
 * and maintains a local knowledge graph of Lilith ecosystem facts.
 */

import chalk from 'chalk';

// ─── Knowledge Graph Node Types ───

export const NODE_TYPES = {
  REPO: 'repo',           // A repository
  FILE: 'file',           // A file in the ecosystem
  MOD: 'mod',             // A Cyberpunk 2077 mod
  SKILL: 'skill',         // A skill/workflow
  MODEL: 'model',         // An AI model
  SERVICE: 'service',     // A running service
  PERSONA: 'persona',     // A persona/concept
  EVENT: 'event',         // A notable event
};

// ─── Knowledge Graph Edge Types ───

export const EDGE_TYPES = {
  DEPENDS_ON: 'depends_on',
  CONTAINS: 'contains',
  INDEXES: 'indexes',
  USES: 'uses',
  BELONGS_TO: 'belongs_to',
  CREATES: 'creates',
  RELATES_TO: 'relates_to',
};

// ─── Graph Node ───

class GraphNode {
  constructor(id, type, data = {}) {
    this.id = id;
    this.type = type;
    this.data = data;
    this.created = new Date().toISOString();
    this.updated = new Date().toISOString();
    this.metadata = {};
  }

  update(data) {
    Object.assign(this.data, data);
    this.updated = new Date().toISOString();
    return this;
  }

  toJSON() {
    return { id: this.id, type: this.type, data: this.data, created: this.created, updated: this.updated };
  }
}

// ─── Graph Edge ───

class GraphEdge {
  constructor(source, target, type, data = {}) {
    this.source = source;
    this.target = target;
    this.type = type;
    this.data = data;
    this.created = new Date().toISOString();
    this.weight = data.weight || 1;
  }

  toJSON() {
    return { source: this.source, target: this.target, type: this.type, weight: this.weight };
  }
}

// ─── Knowledge Graph ───

class KnowledgeGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
    this.index = {}; // Type → [node ids]
  }

  /** Add a node */
  addNode(id, type, data = {}) {
    const node = new GraphNode(id, type, data);
    this.nodes.set(id, node);
    if (!this.index[type]) this.index[type] = [];
    if (!this.index[type].includes(id)) this.index[type].push(id);
    return node;
  }

  /** Get a node */
  getNode(id) { return this.nodes.get(id) || null; }

  /** Remove a node and its edges */
  removeNode(id) {
    this.nodes.delete(id);
    this.edges = this.edges.filter(e => e.source !== id && e.target !== id);
    for (const [type, ids] of Object.entries(this.index)) {
      this.index[type] = ids.filter(i => i !== id);
    }
    return true;
  }

  /** Add an edge */
  addEdge(source, target, type, data = {}) {
    if (!this.nodes.has(source) || !this.nodes.has(target)) return null;
    const edge = new GraphEdge(source, target, type, data);
    this.edges.push(edge);
    return edge;
  }

  /** Get edges for a node */
  getEdges(nodeId, direction = 'both') {
    return this.edges.filter(e => {
      if (direction === 'both') return e.source === nodeId || e.target === nodeId;
      if (direction === 'out') return e.source === nodeId;
      if (direction === 'in') return e.target === nodeId;
      return false;
    });
  }

  /** Get all edges */
  getEdgesForNode(nodeId) { return this.getEdges(nodeId, 'both'); }

  /** Query nodes by type */
  queryByType(type) {
    const ids = this.index[type] || [];
    return ids.map(id => this.nodes.get(id)).filter(Boolean);
  }

  /** Query nodes by data field */
  queryByData(field, value) {
    return Array.from(this.nodes.values()).filter(n => n.data[field] === value);
  }

  /** Get node count by type */
  stats() {
    const typeCounts = {};
    for (const [type] of Object.entries(this.index)) {
      typeCounts[type] = this.index[type].length;
    }
    return {
      nodes: this.nodes.size,
      edges: this.edges.length,
      types: typeCounts,
    };
  }

  /** Check if node exists */
  hasNode(id) { return this.nodes.has(id); }

  /** Get all node IDs */
  getNodeIds() { return Array.from(this.nodes.keys()); }

  /** Export graph as JSON */
  export() {
    return {
      nodes: Array.from(this.nodes.values()).map(n => n.toJSON()),
      edges: this.edges.map(e => e.toJSON()),
    };
  }
}

// ─── Indexer ───

class KnowledgeIndexer {
  constructor(graph) {
    this.graph = graph || new KnowledgeGraph();
  }

  /** Index a file path */
  indexFile(path, type = NODE_TYPES.FILE, metadata = {}) {
    const id = `file:${path}`;
    const node = this.graph.addNode(id, type, { path, ...metadata });
    return node;
  }

  /** Index a repository */
  indexRepo(name, url, metadata = {}) {
    const id = `repo:${name}`;
    const node = this.graph.addNode(id, NODE_TYPES.REPO, { name, url, ...metadata });
    return node;
  }

  /** Index a mod */
  indexMod(name, metadata = {}) {
    const id = `mod:${name}`;
    const node = this.graph.addNode(id, NODE_TYPES.MOD, { name, ...metadata });
    return node;
  }

  /** Index a skill */
  indexSkill(name, metadata = {}) {
    const id = `skill:${name}`;
    const node = this.graph.addNode(id, NODE_TYPES.SKILL, { name, ...metadata });
    return node;
  }

  /** Index a model */
  indexModel(name, metadata = {}) {
    const id = `model:${name}`;
    const node = this.graph.addNode(id, NODE_TYPES.MODEL, { name, ...metadata });
    return node;
  }

  /** Build dependency edges between indexed items */
  indexDependency(fromId, toId, type = EDGE_TYPES.DEPENDS_ON) {
    return this.graph.addEdge(fromId, toId, type);
  }

  /** Get indexed items summary */
  summary() {
    return {
      graph: this.graph.stats(),
      nodes: this.graph.getNodeIds().length,
      edges: this.graph.edges.length,
      types: Object.fromEntries(
        Object.entries(this.graph.index).map(([k, v]) => [k, v.length])
      ),
    };
  }
}

export { KnowledgeGraph, KnowledgeIndexer, GraphNode, GraphEdge };
export default KnowledgeIndexer;
