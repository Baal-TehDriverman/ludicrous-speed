#!/usr/bin/env node
/**
 * HyAtlas Memory — Void Runtime Module
 * Provides HyAtlas memory operations via the Lilith Void runtime.
 *
 * Endpoints:
 *   GET  /api/v1/status
 *   POST /api/v1/add
 *   POST /api/v1/search
 *   GET  /api/v1/list
 *   GET  /api/v1/metrics
 *   GET  /api/v1/graph
 *   POST /api/v1/digest
 *   GET  /healthz
 *
 * Custom Lilith extensions:
 *   POST /api/hyatlas/shell — execute a shell command on the HyAtlas server
 */

const HYATLAS_BASE = process.env.HYATLAS_BASE || 'http://127.0.0.1:19528';
const HYATLAS_LLM_KEY = process.env.HYATLAS_LLM_KEY || '';

/**
 * Make a request to the HyAtlas server.
 */
async function hyatlasRequest(method, path, body = null) {
  const url = `${HYATLAS_BASE}${path}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  try {
    const resp = await fetch(url, options);
    const data = await resp.json();
    return { ok: resp.ok, status: resp.status, data };
  } catch (err) {
    return { ok: false, status: 0, error: err.message };
  }
}

/**
 * Check HyAtlas server health.
 */
async function hyatlasHealth() {
  return hyatlasRequest('GET', '/healthz');
}

/**
 * Get HyAtlas server status (layer counts, pipeline state).
 */
async function hyatlasStatus() {
  return hyatlasRequest('GET', '/api/v1/status');
}

/**
 * Get HyAtlas metrics (uptime, total memories, per-layer counts).
 */
async function hyatlasMetrics() {
  return hyatlasRequest('GET', '/api/v1/metrics');
}

/**
 * Add a memory to HyAtlas.
 * @param {string} text - The memory text.
 * @param {string} [userId='default'] - User ID.
 * @param {string} [agentId='default'] - Agent ID.
 * @param {string} [sessionId=''] - Session ID.
 */
async function hyatlasAdd(text, userId = 'default', agentId = 'default', sessionId = '') {
  return hyatlasRequest('POST', '/api/v1/add', {
    text,
    user_id: userId,
    agent_id: agentId,
    session_id: sessionId,
  });
}

/**
 * Search HyAtlas memories by semantic similarity.
 * @param {string} query - Search query.
 * @param {number} [limit=10] - Max results.
 * @param {string} [layer=''] - Filter by layer.
 * @param {string[]} [userIds=[]] - Filter by user IDs.
 * @param {string[]} [agentIds=[]] - Filter by agent IDs.
 */
async function hyatlasSearch(query, limit = 10, layer = '', userIds = [], agentIds = []) {
  return hyatlasRequest('POST', '/api/v1/search', {
    query,
    limit,
    layer,
    user_ids: userIds,
    agent_ids: agentIds,
  });
}

/**
 * List memories from HyAtlas.
 * @param {number} [limit=30] - Max results.
 * @param {string} [layer=''] - Filter by layer.
 * @param {boolean} [includeRaw=false] - Include raw memories.
 */
async function hyatlasList(limit = 30, layer = '', includeRaw = false) {
  return hyatlasRequest('POST', '/api/v1/list', { limit, layer, include_raw: includeRaw });
}

/**
 * Get the L5 knowledge graph.
 */
async function hyatlasGraph() {
  return hyatlasRequest('GET', '/api/v1/graph');
}

/**
 * Trigger L5/L6/L7 synthesis digest.
 */
async function hyatlasDigest() {
  return hyatlasRequest('POST', '/api/v1/digest');
}

/**
 * Custom Lilith shell extension — execute a shell command on the HyAtlas server.
 * This enables the Void runtime to interact with HyAtlas beyond the standard API.
 * @param {string} command - Shell command to execute.
 * @param {object} [options={}] - Additional options.
 */
async function hyatlasShell(command, options = {}) {
  return hyatlasRequest('POST', '/api/hyatlas/shell', {
    command,
    options,
  });
}

/**
 * Get HyAtlas server info (version, build, uptime).
 */
async function hyatlasInfo() {
  return hyatlasRequest('GET', '/api/v1/info');
}

/**
 * Delete all memories matching a scope.
 * @param {string} scope - Delete scope (e.g. 'user:default').
 */
async function hyatlasDeleteAll(scope = 'user:default') {
  return hyatlasRequest('POST', '/api/v1/delete_all', { scope });
}

/**
 * Reprocess unprocessed raw memories.
 */
async function hyatlasReprocess() {
  return hyatlasRequest('POST', '/api/v1/reprocess');
}

/**
 * Get memory by ID.
 * @param {string} memoryId - The memory ID.
 */
async function hyatlasGet(memoryId) {
  return hyatlasRequest('GET', `/api/v1/memory/${memoryId}`);
}

/**
 * Update a memory.
 * @param {string} memoryId - The memory ID.
 * @param {string} text - New text.
 */
async function hyatlasUpdate(memoryId, text) {
  return hyatlasRequest('POST', `/api/v1/memory/${memoryId}`, { text });
}

/**
 * Search with advanced filters.
 * @param {string} query - Search query.
 * @param {object} [filters={}] - Additional filters.
 * @param {number} [filters.limit=10] - Max results.
 * @param {string} [filters.layer=''] - Layer filter.
 * @param {string[]} [filters.userIds=[]] - User ID filters.
 * @param {string[]} [filters.agentIds=[]] - Agent ID filters.
 * @param {number} [filters.scoreThreshold=0.0] - Minimum similarity score.
 */
async function hyatlasSearchAdvanced(query, filters = {}) {
  const { limit = 10, layer = '', userIds = [], agentIds = [], scoreThreshold = 0.0 } = filters;
  return hyatlasRequest('POST', '/api/v1/search', {
    query,
    limit,
    layer,
    user_ids: userIds,
    agent_ids: agentIds,
    score_threshold: scoreThreshold,
  });
}

/**
 * Add a memory with metadata.
 * @param {string} text - The memory text.
 * @param {object} [metadata={}] - Additional metadata.
 * @param {string} [userId='default'] - User ID.
 * @param {string} [agentId='default'] - Agent ID.
 * @param {string} [sessionId=''] - Session ID.
 */
async function hyatlasAddWithMetadata(text, metadata = {}, userId = 'default', agentId = 'default', sessionId = '') {
  return hyatlasRequest('POST', '/api/v1/add', {
    text,
    metadata,
    user_id: userId,
    agent_id: agentId,
    session_id: sessionId,
  });
}

/**
 * Batch add memories.
 * @param {Array<{text: string, userId?: string, agentId?: string, sessionId?: string}>} memories - Memories to add.
 */
async function hyatlasBatchAdd(memories) {
  return hyatlasRequest('POST', '/api/v1/batch_add', { memories });
}

/**
 * Get memory statistics.
 */
async function hyatlasStats() {
  const status = await hyatlasStatus();
  const metrics = await hyatlasMetrics();
  return {
    ok: status.ok && metrics.ok,
    status: status.data,
    metrics: metrics.data,
    totalMemories: metrics.data?.total_memories || 0,
    layers: metrics.data?.layers || {},
    uptime: metrics.data?.uptime_seconds || 0,
  };
}

/**
 * Check if HyAtlas server is reachable.
 */
async function hyatlasReachable() {
  const health = await hyatlasHealth();
  return { ok: health.ok, reachable: health.ok, status: health.status };
}

// Export all functions for use in Void runtime
export {
  hyatlasRequest,
  hyatlasHealth,
  hyatlasStatus,
  hyatlasMetrics,
  hyatlasAdd,
  hyatlasSearch,
  hyatlasList,
  hyatlasGraph,
  hyatlasDigest,
  hyatlasShell,
  hyatlasInfo,
  hyatlasDeleteAll,
  hyatlasReprocess,
  hyatlasGet,
  hyatlasUpdate,
  hyatlasSearchAdvanced,
  hyatlasAddWithMetadata,
  hyatlasBatchAdd,
  hyatlasStats,
  hyatlasReachable,
};