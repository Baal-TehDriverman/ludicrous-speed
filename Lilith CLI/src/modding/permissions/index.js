#!/usr/bin/env node

/**
 * 🜏 Lilith CLI — Permission System
 *
 * Tool whitelist/blacklist, agent permission model, safety guardrails.
 */

import chalk from 'chalk';

export const PERMISSION_LEVEL = { FULL: 'full', MODERATED: 'moderated', RESTRICTED: 'restricted' };

export const SENSITIVE_TOOLS = [
  'deploy_mod', 'quick_build', 'exec', 'cp77tools_build', 'runCmd',
];
export const NETWORK_TOOLS = ['fetch', 'http_request'];
export const FILESYSTEM_TOOLS = ['file_write', 'file_delete'];
export const SAFE_TOOLS = [
  'check_cet', 'list_models', 'scan_mods', 'verify_mod', 'cite',
];

class AgentPermissions {
  constructor(name, level = PERMISSION_LEVEL.MODERATED, allowedTools = null, blockedTools = null) {
    this.name = name;
    this.level = level;
    this.allowedTools = allowedTools || [];
    this.blockedTools = blockedTools || [];
    this.confirmations = [];
  }

  canUse(toolName, options = {}) {
    if (this.blockedTools.includes(toolName)) return { allowed: false, reason: 'BLOCKED', tool: toolName };
    if (this.allowedTools.length > 0 && !this.allowedTools.includes(toolName)) return { allowed: false, reason: 'NOT_IN_WHITELIST', tool: toolName };
    if (this.level === PERMISSION_LEVEL.RESTRICTED && SENSITIVE_TOOLS.includes(toolName)) return { allowed: false, reason: 'RESTRICTED_LEVEL', tool: toolName };
    if (this.level === PERMISSION_LEVEL.MODERATED && SENSITIVE_TOOLS.includes(toolName)) {
      if (!options.confirmed) return { allowed: false, reason: 'NEEDS_CONFIRMATION', tool: toolName };
      return { allowed: true, reason: 'CONFIRMED', tool: toolName };
    }
    if (this.level === PERMISSION_LEVEL.MODERATED && NETWORK_TOOLS.includes(toolName)) {
      if (!options.confirmed) return { allowed: false, reason: 'NEEDS_CONFIRMATION', tool: toolName };
      return { allowed: true, reason: 'CONFIRMED', tool: toolName };
    }
    return { allowed: true, reason: 'ALLOWED', tool: toolName };
  }

  requestConfirmation(toolName, details = {}) {
    const confirmation = { id: `confirm_${Date.now()}`, tool: toolName, details, timestamp: new Date().toISOString(), status: 'pending' };
    this.confirmations.push(confirmation);
    return confirmation;
  }

  confirm(confirmationId) {
    const conf = this.confirmations.find(c => c.id === confirmationId);
    if (conf) { conf.status = 'granted'; return { success: true, confirmationId }; }
    return { success: false, error: `Confirmation ${confirmationId} not found` };
  }

  deny(confirmationId) {
    const conf = this.confirmations.find(c => c.id === confirmationId);
    if (conf) { conf.status = 'denied'; return { success: true, confirmationId }; }
    return { success: false, error: `Confirmation ${confirmationId} not found` };
  }

  summary() {
    return {
      name: this.name, level: this.level,
      allowedCount: this.allowedTools.length,
      blockedCount: this.blockedTools.length,
      pendingConfirmations: this.confirmations.filter(c => c.status === 'pending').length,
    };
  }
}

class AgentRegistry {
  constructor() {
    this.agents = new Map();
    this._registerDefaults();
  }

  _registerDefaults() {
    this.register(new AgentPermissions('operator', PERMISSION_LEVEL.FULL, null, ['malicious_tool']));
    this.register(new AgentPermissions('mod_builder', PERMISSION_LEVEL.MODERATED));
    this.register(new AgentPermissions('viewer', PERMISSION_LEVEL.RESTRICTED, SAFE_TOOLS));
  }

  register(agent) { this.agents.set(agent.name, agent); }
  get(name) { return this.agents.get(name) || null; }
  list() { return Array.from(this.agents.values()); }
  findAgentForTool(toolName) {
    for (const [name, agent] of this.agents) { if (agent.canUse(toolName).allowed) return name; }
    return null;
  }
}

class PermissionGuard {
  constructor(registry) {
    this.registry = registry || new AgentRegistry();
  }

  check(toolName, agentName = 'mod_builder', options = {}) {
    const agent = this.registry.get(agentName);
    if (!agent) return { allowed: false, reason: 'AGENT_NOT_FOUND', agent: agentName };
    return agent.canUse(toolName, options);
  }

  getModEngineToolDefinitions() {
    return [
      { type: 'function', function: { name: 'permission_check', description: 'Check if a tool use is permitted', parameters: { type: 'object', properties: { tool: { type: 'string' }, agent: { type: 'string' } }, required: ['tool'] } } },
      { type: 'function', function: { name: 'permission_confirm', description: 'Confirm a sensitive operation', parameters: { type: 'object', properties: { confirmation_id: { type: 'string' } } } } },
      { type: 'function', function: { name: 'permission_list_agents', description: 'List all registered agents', parameters: { type: 'object', properties: {} } } },
    ];
  }
}

export { AgentPermissions, AgentRegistry, PermissionGuard };
export default PermissionGuard;
