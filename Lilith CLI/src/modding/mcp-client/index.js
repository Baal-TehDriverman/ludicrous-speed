#!/usr/bin/env node

/**
 * 🜏 Lilith CLI — MCP Client
 *
 * Dynamically loads MCP tools from configured MCP servers
 * and integrates them into the Lilith CLI tool registry.
 */

import chalk from 'chalk';

// ─── MCP Tool Wrappers ───

class MCPTool {
  constructor(name, description, schema, server, executor) {
    this.name = name;
    this.description = description;
    this.parameters = schema;
    this.server = server;
    this.executor = executor;
    this.callCount = 0;
    this.lastUsed = null;
  }

  async execute(input) {
    this.callCount++;
    this.lastUsed = new Date().toISOString();
    try {
      const result = await this.executor(input);
      return JSON.stringify({ success: true, tool: this.name, result }, null, 2);
    } catch (err) {
      return JSON.stringify({ success: false, tool: this.name, error: err.message }, null, 2);
    }
  }
}

class MCPServer {
  constructor(name, transport, config = {}) {
    this.name = name;
    this.transport = transport; // 'stdio', 'sse', 'http'
    this.config = config;
    this.tools = [];
    this.connected = false;
    this.resources = [];
    this.prompts = [];
  }

  addTool(tool) { this.tools.push(tool); }
  getTool(name) { return this.tools.find(t => t.name === name); }

  connect() {
    this.connected = true;
    return { success: true, server: this.name, tools: this.tools.length };
  }

  disconnect() {
    this.connected = false;
    return { success: true, server: this.name };
  }
}

// ─── MCP Client ───

class LilithMCP {
  constructor(options = {}) {
    this.servers = new Map();
    this.allTools = [];
    this.options = options;
    this._loadConfig();
  }

  _loadConfig() {
    // Load MCP server configurations from lilith.yaml
    const serverConfigs = this.options.servers || [
      { name: 'codebase-memory', transport: 'stdio', command: 'npx', args: ['-y', '@smithery/cli@latest', 'run', '@smithery-pty/server@latest'] },
      { name: 'github', transport: 'stdio', command: 'npx', args: ['-y', '@smithery/cli@latest', 'run', 'github'] },
      { name: 'mnemosyne', transport: 'stdio', command: 'node', args: ['-e', "const { mcp__mnemosyne__mnemosyne_stats } = await import('mcp'); /* handler */"] },
    ];
    for (const cfg of serverConfigs) {
      this.servers.set(cfg.name, new MCPServer(cfg.name, cfg.transport, cfg));
    }
  }

  getServer(name) { return this.servers.get(name) || null; }
  getAllServers() { return Array.from(this.servers.values()); }

  registerServer(server) { this.servers.set(server.name, server); }

  connectAll() {
    const results = [];
    for (const [name, server] of this.servers) {
      const result = server.connect();
      results.push(result);
    }
    return results;
  }

  disconnectAll() {
    const results = [];
    for (const [name, server] of this.servers) {
      results.push(server.disconnect());
    }
    return results;
  }

  /** Register an MCP tool with the client */
  registerTool(serverName, toolDef) {
    const server = this.servers.get(serverName);
    if (!server) return { success: false, error: `Server ${serverName} not found` };

    const tool = new MCPTool(
      toolDef.name || toolDef.function?.name,
      toolDef.description || toolDef.function?.description,
      toolDef.parameters || toolDef.function?.parameters,
      serverName,
      toolDef.execute || toolDef.function?.execute || (async () => ({ success: false, error: 'No executor' }))
    );

    server.addTool(tool);
    this.allTools.push(tool);
    return { success: true, tool: tool.name, server: serverName };
  }

  /** Get all tools from all connected servers */
  getTools() { return [...this.allTools]; }

  /** Find a tool by name across all servers */
  findTool(name) { return this.allTools.find(t => t.name === name); }

  /** Get tool definitions in Claude Code format */
  getToolDefinitions() {
    return this.allTools.map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: t.description,
        parameters: t.parameters || { type: 'object', properties: {} },
      },
    }));
  }

  /** Execute an MCP tool by name */
  async executeTool(name, input) {
    const tool = this.findTool(name);
    if (!tool) return JSON.stringify({ success: false, error: `MCP tool "${name}" not found` });
    return tool.execute(input);
  }

  /** Get server stats */
  stats() {
    const stats = {};
    for (const [name, server] of this.servers) {
      stats[name] = { connected: server.connected, tools: server.tools.length };
    }
    return stats;
  }

  /** Get tool definitions for mod engine integration */
  getModEngineToolDefinitions() {
    return this.allTools.map(t => ({
      type: 'function',
      function: {
        name: t.name,
        description: `[MCP:${t.server}] ${t.description}`,
        parameters: t.parameters || { type: 'object', properties: {} },
      },
    }));
  }
}

/**
 * Pre-built MCP server connections (matching the 3 active MCP servers)
 */
export function createDefaultMCPServers() {
  const mc = new LilithMCP();

  // codebase-memory MCP server
  mc.registerServer(new MCPServer('codebase-memory', 'stdio', { description: 'Codebase knowledge graph queries' }));

  // GitHub MCP server
  mc.registerServer(new MCPServer('github', 'stdio', { description: 'GitHub PR/issue/repo management' }));

  // mnemosyne MCP server
  mc.registerServer(new MCPServer('mnemosyne', 'stdio', { description: 'Memory management and recall' }));

  return mc;
}

/**
 * Get tool definitions for the mod engine
 */
export function getMCPToolDefinitions() {
  return [
    {
      type: 'function',
      function: {
        name: 'mcp_connect',
        description: 'Connect to an MCP server',
        parameters: { type: 'object', properties: { server: { type: 'string' } }, required: ['server'] },
      },
    },
    {
      type: 'function',
      function: {
        name: 'mcp_disconnect',
        description: 'Disconnect from an MCP server',
        parameters: { type: 'object', properties: { server: { type: 'string' } }, required: ['server'] },
      },
    },
    {
      type: 'function',
      function: {
        name: 'mcp_list_tools',
        description: 'List all MCP tools',
        parameters: { type: 'object', properties: { server: { type: 'string' } } },
      },
    },
    {
      type: 'function',
      function: {
        name: 'mcp_execute',
        description: 'Execute an MCP tool',
        parameters: { type: 'object', properties: { tool: { type: 'string' }, input: { type: 'object' } }, required: ['tool'] },
      },
    },
  ];
}

export default LilithMCP;
export { MCPServer, MCPTool };
