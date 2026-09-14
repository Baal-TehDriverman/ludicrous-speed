#!/usr/bin/env node
/**
 * HyAtlas proxy — bridges Void to HyAtlas memory server
 * Routes requests from :3000/api/hyatlas/* to :19528/api/v1/*
 */

const HYATLAS_URL = 'http://localhost:19528';

/**
 * Forward a request to HyAtlas Go server
 */
export async function hyatlasRequest(method, path, body = null) {
  const url = `${HYATLAS_URL}${path}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(url, options);
  return res.json();
}

/**
 * Search memories
 */
export async function hyatlasSearch(query, limit = 10) {
  return hyatlasRequest('POST', '/api/v1/search', { query, limit });
}

/**
 * Add a memory
 */
export async function hyatlasAdd(text, userId = 'default', agentId = 'default') {
  return hyatlasRequest('POST', '/api/v1/add', { text, user_id: userId, agent_id: agentId });
}

/**
 * Get status
 */
export async function hyatlasStatus() {
  return hyatlasRequest('GET', '/api/v1/status');
}

/**
 * Get metrics
 */
export async function hyatlasMetrics() {
  return hyatlasRequest('GET', '/api/v1/metrics');
}

/**
 * Get graph
 */
export async function hyatlasGraph() {
  return hyatlasRequest('GET', '/api/v1/graph');
}

/**
 * List memories
 */
export async function hyatlasList(limit = 30, layer = '', includeRaw = false) {
  return hyatlasRequest('POST', '/api/v1/list', { limit, layer, include_raw: includeRaw });
}

/**
 * Digest
 */
export async function hyatlasDigest() {
  return hyatlasRequest('POST', '/api/v1/digest');
}

export default { hyatlasRequest, hyatlasSearch, hyatlasAdd, hyatlasStatus, hyatlasMetrics, hyatlasGraph, hyatlasList, hyatlasDigest };
