#!/usr/bin/env node

/**
 * 🜏 Lilith CLI — Plan & Task System
 * /plan, /todo — structured planning and task tracking.
 */

import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

export const PLAN_STATUS = { PENDING: 'pending', IN_PROGRESS: 'in_progress', COMPLETED: 'completed', CANCELLED: 'cancelled' };
export const TASK_PRIORITY = { HIGH: 'high', MEDIUM: 'medium', LOW: 'low' };

class Plan {
  constructor(id = null, title = '') {
    this.id = id || uuidv4();
    this.title = title;
    this.created = new Date().toISOString();
    this.tasks = [];
    this.status = PLAN_STATUS.PENDING;
  }

  addTask(description, options = {}) {
    const task = {
      id: uuidv4(),
      description,
      status: PLAN_STATUS.PENDING,
      priority: options.priority || TASK_PRIORITY.MEDIUM,
      dependencies: options.dependencies || [],
      created: new Date().toISOString(),
    };
    this.tasks.push(task);
    return task;
  }

  getTask(id) { return this.tasks.find(t => t.id === id); }

  updateTask(id, updates) {
    const task = this.getTask(id);
    if (!task) return null;
    Object.assign(task, updates, { updated: new Date().toISOString() });
    return task;
  }

  nextTask() {
    return this.tasks.find(t => t.status === PLAN_STATUS.PENDING) || null;
  }

  completeTask(id) { return this.updateTask(id, { status: PLAN_STATUS.COMPLETED }); }

  markInProgress(id) { return this.updateTask(id, { status: PLAN_STATUS.IN_PROGRESS }); }

  stats() {
    const total = this.tasks.length;
    return {
      id: this.id, title: this.title, total,
      completed: this.tasks.filter(t => t.status === PLAN_STATUS.COMPLETED).length,
      pending: this.tasks.filter(t => t.status === PLAN_STATUS.PENDING).length,
      in_progress: this.tasks.filter(t => t.status === PLAN_STATUS.IN_PROGRESS).length,
      priority: { high: 0, medium: 0, low: 0 },
      status: this.status,
    };
  }

  toJSON() { return { id: this.id, title: this.title, created: this.created, tasks: this.tasks, status: this.status }; }
}

class PlanManager {
  constructor() { this.plans = new Map(); }

  create(title) { const plan = new Plan(null, title); this.plans.set(plan.id, plan); return plan; }
  get(id) { return this.plans.get(id) || null; }
  list() { return Array.from(this.plans.values()); }
  remove(id) { return this.plans.delete(id); }

  toolDefinitions() {
    return [
      { type: 'function', function: { name: 'plan_create', description: 'Create a new plan', parameters: { type: 'object', properties: { title: { type: 'string' } }, required: ['title'] } } },
      { type: 'function', function: { name: 'plan_add_task', description: 'Add task to plan', parameters: { type: 'object', properties: { plan_id: { type: 'string' }, description: { type: 'string' }, priority: { type: 'string', enum: ['high','medium','low'] } }, required: ['plan_id', 'description'] } } },
      { type: 'function', function: { name: 'plan_complete_task', description: 'Complete a task', parameters: { type: 'object', properties: { plan_id: { type: 'string' }, task_id: { type: 'string' } }, required: ['plan_id', 'task_id'] } } },
      { type: 'function', function: { name: 'plan_list', description: 'List all plans', parameters: { type: 'object', properties: {} } } },
    ];
  }
}

export { Plan, PlanManager };
export default PlanManager;
