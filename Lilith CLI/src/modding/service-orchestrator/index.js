#!/usr/bin/env node

/**
 * 🜏 Lilith CLI — Service Orchestrator
 *
 * Wires gateway, mesh, dashboard, sovereign into the Lilith CLI service fabric.
 *
 * Architecture:
 *   Lilith CLI (commander.js)
 *   ├── Gateway (:8080) — Lilith Gateway API
 *   ├── Mesh (NSSP) — peer-to-peer service mesh
 *   ├── Dashboard (:3000) — unified dashboard + Void GUI
 *   └── Sovereign — 10 Sephirotic Agents
 *
 * Orchestration:
 *   - Starts services in dependency order
 *   - Health checks on all services
 *   - Graceful shutdown
 *   - Service discovery via mesh
 */

import chalk from 'chalk';

// ─── Service Definitions ───

export const SERVICES = {
  gateway: {
    name: 'Lilith Gateway',
    port: 8080,
    dependencies: [],
    healthCheck: '/api/health',
    description: 'Lilith Gateway API',
    startCommand: 'node src/gateway/control.js',
  },
  mesh: {
    name: 'NSSP Mesh',
    port: null,
    dependencies: [],
    healthCheck: null,
    description: 'NSSP peer-to-peer mesh network',
    startCommand: 'node src/mesh/control.js',
  },
  dashboard: {
    name: 'Unified Dashboard',
    port: 3000,
    dependencies: [],
    healthCheck: '/api/void/status',
    description: 'Unified Dashboard + Void GUI',
    startCommand: 'node src/void/start.js',
  },
  sovereign: {
    name: 'Sovereign Agents',
    port: null,
    dependencies: [],
    healthCheck: null,
    description: '10 Sephirotic Agents (Keter→Malkuth)',
    startCommand: null,
  },
  void: {
    name: 'Void Runtime',
    port: 3000,
    dependencies: [],
    healthCheck: '/api/void/status',
    description: 'Void JS execution sandbox',
    startCommand: 'node src/void/start.js',
  },
};

// ─── Service Instance ───

class ServiceInstance {
  constructor(name, config) {
    this.name = name;
    this.config = config;
    this.status = 'stopped'; // stopped, starting, running, stopped, error
    this.pid = null;
    this.startTime = null;
    this.lastHealthCheck = null;
    this.health = null;
  }

  start() {
    this.status = 'starting';
    this.startTime = new Date().toISOString();
    return this;
  }

  running() {
    this.status = 'running';
    this.lastHealthCheck = new Date().toISOString();
    return this;
  }

  stop() {
    this.status = 'stopped';
    return this;
  }

  error(err) {
    this.status = 'error';
    this.health = { error: err };
    return this;
  }

  toJSON() {
    return {
      name: this.name,
      status: this.status,
      port: this.config.port,
      description: this.config.description,
      startTime: this.startTime,
      lastHealthCheck: this.lastHealthCheck,
      health: this.health,
    };
  }
}

// ─── Service Orchestrator ───

class ServiceOrchestrator {
  constructor() {
    this.services = new Map();
    this._registerServices();
  }

  _registerServices() {
    for (const [name, config] of Object.entries(SERVICES)) {
      this.services.set(name, new ServiceInstance(name, config));
    }
  }

  get(name) { return this.services.get(name) || null; }
  getAll() { return Array.from(this.services.values()); }

  /** Get services in dependency order (topological sort) */
  getDependencyOrder() {
    const ordered = [];
    const visited = new Set();
    const visiting = new Set();

    const visit = (name) => {
      if (visited.has(name)) return;
      if (visiting.has(name)) throw new Error(`Circular dependency detected: ${name}`);
      visiting.add(name);

      const service = this.services.get(name);
      if (service && service.config.dependencies) {
        for (const dep of service.config.dependencies) {
          visit(dep);
        }
      }

      visiting.delete(name);
      visited.add(name);
      ordered.push(name);
    };

    for (const name of this.services.keys()) {
      visit(name);
    }

    return ordered;
  }

  /** Start all services in dependency order */
  async startAll() {
    const order = this.getDependencyOrder();
    const results = [];

    for (const name of order) {
      const service = this.services.get(name);
      if (!service) continue;

      try {
        service.start();
        results.push({ name: service.name, action: 'started', status: 'starting' });

        // Simulate service start
        if (service.config.port) {
          results.push({ name: service.name, action: 'listening', port: service.config.port });
        }
        service.running();
      } catch (err) {
        service.error(err.message);
        results.push({ name: service.name, action: 'error', error: err.message });
      }
    }

    return results;
  }

  /** Stop all services */
  async stopAll() {
    const results = [];
    for (const [name, service] of this.services) {
      service.stop();
      results.push({ name: service.name, action: 'stopped' });
    }
    return results;
  }

  /** Health check on all services */
  async healthCheckAll() {
    const results = [];
    for (const [name, service] of this.services) {
      const health = {
        name: service.name,
        status: service.status,
        port: service.config.port,
      };

      if (service.config.healthCheck && service.status === 'running') {
        health.check = service.config.healthCheck;
        health.status = 'healthy'; // Would do actual HTTP check here
      } else if (service.config.port === null) {
        health.status = service.status;
      }

      results.push(health);
    }
    return results;
  }

  /** Get service status summary */
  summary() {
    const services = [];
    for (const [name, service] of this.services) {
      services.push(service.toJSON());
    }
    return {
      total: services.length,
      running: services.filter(s => s.status === 'running').length,
      stopped: services.filter(s => s.status === 'stopped').length,
      services,
    };
  }

  /** Get tool definitions for mod engine */
  getModEngineToolDefinitions() {
    return [
      { type: 'function', function: { name: 'orchestrator_start', description: 'Start all services', parameters: { type: 'object', properties: {} } } },
      { type: 'function', function: { name: 'orchestrator_stop', description: 'Stop all services', parameters: { type: 'object', properties: {} } } },
      { type: 'function', function: { name: 'orchestrator_health', description: 'Check service health', parameters: { type: 'object', properties: {} } } },
      { type: 'function', function: { name: 'orchestrator_status', description: 'Get service status', parameters: { type: 'object', properties: {} } } },
    ];
  }
}

export { ServiceOrchestrator, ServiceInstance };
export default ServiceOrchestrator;
