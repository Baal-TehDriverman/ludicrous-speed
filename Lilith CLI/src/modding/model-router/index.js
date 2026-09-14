#!/usr/bin/env node

/**
 * 🜏 Lilith CLI — Model Router
 *
 * Routes LLM requests to the optimal model based on task type.
 * Implements the G2B→C14B cascade (fast blade → deep counsel).
 *
 * Model Tiers:
 *   G2B (2B blade)  — fast edge, CET console, REDscript, mod sourcing
 *   C14B (14B)      — deep reasoning, evidence adjudication
 *   X:4B (future)   — cloud training/serving
 *
 * Routing Rules:
 *   - Short queries, CET operations, REDscript → G2B
 *   - Evidence analysis, complex reasoning → C14B
 *   - Training, long-context → X:4B (when available)
 */

// ─── Model Definitions ───
export const MODEL_TIERS = {
  G2B: {
    name: 'lilith-heart-2b-blade',
    base: 'Qwen3.8-2B-Distill Q4_K_M',
    size: '1.3 GB',
    hardware: 'RTX 3060 6GB',
    speed: '~140 tok/s',
    role: 'FAST GPU BLADE — CET console, REDscript, mod sourcing',
    priority: 1,
    maxContext: 262144,
    cost: 0, // local, free
  },
  C14B: {
    name: 'throne-c14b',
    base: 'Qwen3-14B Q4_K_M (fine-tuned)',
    size: '9.0 GB',
    hardware: 'Ryzen 5600H CPU',
    speed: '~3.8 tok/s',
    role: 'Deep reasoning, evidence adjudication',
    priority: 2,
    maxContext: 131072,
    cost: 0, // local, free
  },
  X4B: {
    name: 'qwen38-2b-blackwall',
    base: 'Qwen3.8-2B-Distill',
    size: '1.3 GB',
    hardware: 'Lightning Xeon 8488C',
    speed: '~9.4 tok/s',
    role: 'Cloud training/serving (future deployment)',
    priority: 3,
    maxContext: 262144,
    cost: 0, // Lightning Xeon, free
  },
};

// ─── Task-to-Model Routing ───

const TASK_ROUTES = [
  {
    patterns: ['cet', 'check_cet', 'redscript', 'compile', 'mod source', 'quick', 'scan'],
    model: 'G2B',
    reason: 'Fast blade for CET/REDscript/mod sourcing',
  },
  {
    patterns: ['evidence', 'verify', 'adjudicat', 'analyze', 'review', 'audit', 'complex', 'reasoning', 'debate'],
    model: 'C14B',
    reason: 'Deep counsel for evidence analysis',
  },
  {
    patterns: ['train', 'fine-tune', 'dataset', 'long context', 'summariz', 'research'],
    model: 'X4B',
    reason: 'Cloud compute for training/long-context',
  },
];

// ─── Model Router ───

class ModelRouter {
  constructor(options = {}) {
    this.tiers = options.tiers || MODEL_TIERS;
    this.routes = options.routes || TASK_ROUTES;
    this.fallback = 'G2B';
    this.cache = new Map();
    this.usageLog = [];
  }

  /** Route a task to the best model */
  route(taskDescription, options = {}) {
    const task = (taskDescription || '').toLowerCase();

    // Check cache
    const cacheKey = this._cacheKey(task, options);
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      this._logRoute(cached.tier, task, 'cached');
      return cached;
    }

    // Match task patterns
    let matchedTier = null;
    let matchReason = '';

    for (const route of this.routes) {
      for (const pattern of route.patterns) {
        if (task.includes(pattern)) {
          matchedTier = route.model;
          matchReason = route.reason;
          break;
        }
      }
      if (matchedTier) break;
    }

    // Fallback to G2B
    if (!matchedTier) {
      matchedTier = this.fallback;
      matchReason = 'Default fallback — G2B blade';
    }

    const tierInfo = this.tiers[matchedTier] || this.tiers[this.fallback];
    const result = {
      tier: matchedTier,
      model: tierInfo.name,
      base: tierInfo.base,
      hardware: tierInfo.hardware,
      speed: tierInfo.speed,
      role: tierInfo.role,
      reason: matchReason,
      priority: tierInfo.priority,
      maxContext: tierInfo.maxContext,
      task: task.slice(0, 60),
    };

    // Cache the result
    this.cache.set(cacheKey, result);
    this._logRoute(matchedTier, task, 'matched');

    return result;
  }

  /** Route to G2B specifically (fast path) */
  routeFast(taskDescription) {
    return this.route(taskDescription, { forceTier: 'G2B' });
  }

  /** Route to C14B specifically (deep reasoning) */
  routeDeep(taskDescription) {
    return this.route(taskDescription, { forceTier: 'C14B' });
  }

  /** Get model info by tier */
  getModel(tier) {
    return this.tiers[tier] || null;
  }

  /** Get all model tiers */
  getAllModels() { return { ...this.tiers }; }

  /** Get routing statistics */
  stats() {
    const tierCounts = {};
    for (const [, result] of this.cache) {
      tierCounts[result.tier] = (tierCounts[result.tier] || 0) + 1;
    }
    return {
      cacheSize: this.cache.size,
      tierCounts,
      usageLogSize: this.usageLog.length,
      tiers: Object.entries(this.tiers).map(([k, v]) => ({ tier: k, model: v.name, role: v.role })),
    };
  }

  /** Get tool definitions for mod engine */
  getModEngineToolDefinitions() {
    return [
      { type: 'function', function: { name: 'model_route', description: 'Route a task to the best model', parameters: { type: 'object', properties: { task: { type: 'string' } }, required: ['task'] } } },
      { type: 'function', function: { name: 'model_route_fast', description: 'Route to G2B fast blade', parameters: { type: 'object', properties: { task: { type: 'string' } }, required: ['task'] } } },
      { type: 'function', function: { name: 'model_route_deep', description: 'Route to C14B deep counsel', parameters: { type: 'object', properties: { task: { type: 'string' } }, required: ['task'] } } },
      { type: 'function', function: { name: 'model_list', description: 'List all available models', parameters: { type: 'object', properties: {} } } },
    ];
  }

  _cacheKey(task, options) {
    return `${task}:${JSON.stringify(options)}`;
  }

  _logRoute(tier, task, method) {
    this.usageLog.push({ tier, task: task.slice(0, 50), method, timestamp: new Date().toISOString() });
    if (this.usageLog.length > 1000) this.usageLog = this.usageLog.slice(-1000);
  }
}

/**
 * Get tool definitions for the mod engine
 */
export function getModelRouterToolDefinitions() {
  return [
    { type: 'function', function: { name: 'model_route', description: 'Route a task to the best model', parameters: { type: 'object', properties: { task: { type: 'string' } }, required: ['task'] } } },
    { type: 'function', function: { name: 'model_list', description: 'List all available models', parameters: { type: 'object', properties: {} } } },
  ];
}

export default ModelRouter;
