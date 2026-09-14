#!/usr/bin/env node

/**
 * 🜏 Lilith CLI — Testing & Verification Framework
 *
 * E2E tests, load tests, integration tests for the Lilith CLI.
 * Automated test runner with structured output.
 */

import chalk from 'chalk';

// ─── Test Types ───

export const TEST_TYPES = {
  UNIT: 'unit',
  INTEGRATION: 'integration',
  E2E: 'e2e',
  LOAD: 'load',
  VALIDATION: 'validation',
};

// ─── Test Result ───

class TestResult {
  constructor(name, type = TEST_TYPES.UNIT) {
    this.name = name;
    this.type = type;
    this.passed = false;
    this.error = null;
    this.duration = 0;
    this.startTime = null;
    this.endTime = null;
  }

  start() {
    this.startTime = Date.now();
    return this;
  }

  end() {
    this.endTime = Date.now();
    this.duration = this.endTime - this.startTime;
    return this;
  }

  pass() {
    this.passed = true;
    this.end();
    return this;
  }

  fail(error) {
    this.passed = false;
    this.error = error;
    this.end();
    return this;
  }

  toJSON() {
    return {
      name: this.name,
      type: this.type,
      passed: this.passed,
      duration: this.duration,
      error: this.error,
    };
  }
}

// ─── Test Suite ───

class TestSuite {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this._results = [];
  }

  /** Add a test */
  add(name, fn, type = TEST_TYPES.UNIT) {
    this.tests.push({ name, fn, type });
    return this;
  }

  /** Run all tests */
  async run() {
    this._results = [];
    let passed = 0, failed = 0;

    for (const test of this.tests) {
      const result = new TestResult(test.name, test.type);
      result.start();

      try {
        await test.fn();
        result.pass();
        passed++;
      } catch (err) {
        result.fail(err.message);
        failed++;
      }

      this._results.push(result);
    }

    return {
      suite: this.name,
      total: this.tests.length,
      passed,
      failed,
      results: this.results.map(r => r.toJSON()),
    };
  }

  get results() { return this._results || []; }
}

// ─── Test Runner ───

class TestRunner {
  constructor() {
    this.suites = [];
    this.passed = 0;
    this.failed = 0;
  }

  /** Create and register a test suite */
  createSuite(name) {
    const suite = new TestSuite(name);
    this.suites.push(suite);
    return suite;
  }

  /** Run all suites */
  async runAll() {
    this.passed = 0;
    this.failed = 0;
    const allResults = [];

    for (const suite of this.suites) {
      const result = await suite.run();
      allResults.push(result);
      this.passed += result.passed;
      this.failed += result.failed;
    }

    return {
      totalSuites: this.suites.length,
      totalTests: this.passed + this.failed,
      passed: this.passed,
      failed: this.failed,
      suites: allResults,
    };
  }

  /** Get tool definitions for mod engine */
  getModEngineToolDefinitions() {
    return [
      { type: 'function', function: { name: 'test_run', description: 'Run all test suites', parameters: { type: 'object', properties: {} } } },
      { type: 'function', function: { name: 'test_suite', description: 'Create a test suite', parameters: { type: 'object', properties: { name: { type: 'string' } }, required: ['name'] } } },
    ];
  }
}

// ─── Assertions ───

const assert = {
  equal(actual, expected, message = '') {
    if (actual !== expected) throw new Error(`${message || 'Assertion failed'}: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`);
  },
  notEqual(actual, expected, message = '') {
    if (actual === expected) throw new Error(`${message || 'Assertion failed'}: ${JSON.stringify(actual)} === ${JSON.stringify(expected)}`);
  },
  ok(value, message = '') {
    if (!value) throw new Error(`${message || 'Assertion failed'}: falsy value`);
  },
  throws(fn, message = '') {
    try { fn(); } catch (e) { return; }
    throw new Error(`${message || 'Assertion failed'}: expected throw`);
  },
  contains(str, substr, message = '') {
    if (!str.includes(substr)) throw new Error(`${message || 'Assertion failed'}: ${JSON.stringify(str)} does not contain ${JSON.stringify(substr)}`);
  },
  type(value, expectedType, message = '') {
    if (typeof value !== expectedType) throw new Error(`${message || 'Assertion failed'}: expected ${expectedType} got ${typeof value}`);
  },
};

// ─── Load Test ───

class LoadTest {
  constructor(name, options = {}) {
    this.name = name;
    this.options = {
      concurrent: 10,
      iterations: 100,
      timeout: 5000,
      ...options,
    };
    this.results = [];
  }

  /** Run load test */
  async run(fn) {
    const { concurrent, iterations, timeout } = this.options;
    const start = Date.now();

    const runIteration = async () => {
      const s = Date.now();
      try {
        await Promise.race([fn(), new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))]);
        return { success: true, duration: Date.now() - s };
      } catch (e) {
        return { success: false, duration: Date.now() - s, error: e.message };
      }
    };

    const promises = [];
    for (let i = 0; i < iterations; i++) {
      promises.push(runIteration());
    }

    this.results = await Promise.all(promises);
    const durations = this.results.filter(r => r.success).map(r => r.duration);
    const errors = this.results.filter(r => !r.success);

    return {
      name: this.name,
      total: iterations,
      succeeded: durations.length,
      failed: errors.length,
      avgDuration: durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
      minDuration: durations.length ? Math.min(...durations) : 0,
      maxDuration: durations.length ? Math.max(...durations) : 0,
      totalDuration: Date.now() - start,
    };
  }
}

export { TestRunner, TestSuite, TestResult, LoadTest, assert };
export default TestRunner;