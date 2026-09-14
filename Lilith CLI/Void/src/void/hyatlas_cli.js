#!/usr/bin/env node
/**
 * HyAtlas CLI commands — memory operations for Lilith CLI
 * Bridges CLI to HyAtlas Go server via fetch
 */

import { Command } from 'commander';
import chalk from 'chalk';

const HYATLAS_URL = 'http://localhost:19528';

async function hyatlasFetch(path, method = 'GET', body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${HYATLAS_URL}${path}`, opts);
  return res.json();
}

export function hyatlasStatusCmd() {
  return new Command('status')
    .description('Show HyAtlas memory status')
    .action(async () => {
      try {
        const data = await hyatlasFetch('/api/v1/status');
        console.log(chalk.bold('\n🜏 HyAtlas Memory Status\n'));
        console.log(chalk.cyan('  Status:'), data.status);
        console.log(chalk.cyan('  Embed:'), data.embed, `(${data.embed_dims}d)`);
        console.log(chalk.cyan('  LLM:'), data.llm, `(${data.llm_model})`);
        console.log(chalk.cyan('  Graph:'), `${data.graph_nodes} nodes, ${data.graph_edges} edges`);
        console.log(chalk.cyan('  VDB:'), data.vdb, `(${data.vdb_points} points)`);
        console.log(chalk.cyan('  Writes:'), data.writes);
        console.log(chalk.cyan('  Searches:'), data.searches);
        if (data.write_pipeline && data.write_pipeline !== 'ok') {
          console.log(chalk.yellow('  Pipeline:'), data.write_pipeline.slice(0, 100));
        }
        console.log();
      } catch (err) {
        console.log(chalk.red('  HyAtlas not running on :19528\n'));
      }
    });
}

export function hyatlasSearchCmd() {
  return new Command('search')
    .description('Search HyAtlas memories')
    .argument('<query>', 'Search query')
    .option('-l, --limit <n>', 'Number of results', '10')
    .action(async (query, options) => {
      try {
        const data = await hyatlasFetch('/api/v1/search', 'POST', {
          query,
          limit: parseInt(options.limit),
        });
        console.log(chalk.bold(`\n🜏 HyAtlas Search: "${query}"\n`));
        if (data.memories) {
          const all = [...data.memories.normal, ...data.memories.proactive, ...data.memories.profile];
          if (all.length === 0) {
            console.log(chalk.gray('  No results found.\n'));
            return;
          }
          for (const m of all) {
            console.log(chalk.cyan(`  [${m.layer}]`), m.content);
            console.log(chalk.gray(`    score: ${m.score.toFixed(4)} | id: ${m.memory_id}`));
          }
        }
        console.log();
      } catch (err) {
        console.log(chalk.red('  HyAtlas not running on :19528\n'));
      }
    });
}

export function hyatlasAddCmd() {
  return new Command('add')
    .description('Add a memory to HyAtlas')
    .argument('<text>', 'Memory text to store')
    .option('-u, --user <id>', 'User ID', 'default')
    .option('-a, --agent <id>', 'Agent ID', 'default')
    .action(async (text, options) => {
      try {
        const data = await hyatlasFetch('/api/v1/add', 'POST', {
          text,
          user_id: options.user,
          agent_id: options.agent,
        });
        console.log(chalk.green('  ✓ Memory added'));
        console.log(chalk.gray(`    id: ${data.memory_id || 'n/a'}`));
        console.log();
      } catch (err) {
        console.log(chalk.red('  HyAtlas not running on :19528\n'));
      }
    });
}

export function hyatlasListCmd() {
  return new Command('list')
    .description('List HyAtlas memories')
    .option('-l, --limit <n>', 'Number of results', '30')
    .option('--layer <layer>', 'Filter by layer (l1-l7)', '')
    .option('--raw', 'Include raw content')
    .action(async (options) => {
      try {
        const data = await hyatlasFetch('/api/v1/list', 'POST', {
          limit: parseInt(options.limit),
          layer: options.layer,
          include_raw: options.raw || false,
        });
        console.log(chalk.bold('\n🜏 HyAtlas Memories\n'));
        if (!data.memories || data.memories.length === 0) {
          console.log(chalk.gray('  No memories found.\n'));
          return;
        }
        for (const m of data.memories) {
          console.log(chalk.cyan(`  [${m.layer}]`), m.content.slice(0, 120));
          console.log(chalk.gray(`    id: ${m.memory_id} | score: ${m.score?.toFixed(4) || 'n/a'}`));
        }
        console.log();
      } catch (err) {
        console.log(chalk.red('  HyAtlas not running on :19528\n'));
      }
    });
}

export function hyatlasGraphCmd() {
  return new Command('graph')
    .description('Show HyAtlas knowledge graph')
    .action(async () => {
      try {
        const data = await hyatlasFetch('/api/v1/graph');
        console.log(chalk.bold('\n🜏 HyAtlas Knowledge Graph\n'));
        console.log(chalk.cyan('  Nodes:'), data.node_count);
        console.log(chalk.cyan('  Edges:'), data.edge_count);
        if (data.extract_err) {
          console.log(chalk.yellow('  Extract error:'), data.extract_err.slice(0, 100));
        }
        console.log();
      } catch (err) {
        console.log(chalk.red('  HyAtlas not running on :19528\n'));
      }
    });
}

export function hyatlasMetricsCmd() {
  return new Command('metrics')
    .description('Show HyAtlas layer metrics')
    .action(async () => {
      try {
        const data = await hyatlasFetch('/api/v1/metrics');
        console.log(chalk.bold('\n🜏 HyAtlas Layer Metrics\n'));
        if (data.layers) {
          for (const [layer, count] of Object.entries(data.layers)) {
            console.log(chalk.cyan(`  ${layer}:`), count);
          }
        }
        console.log(chalk.cyan('  Total:'), data.total);
        console.log();
      } catch (err) {
        console.log(chalk.red('  HyAtlas not running on :19528\n'));
      }
    });
}

export function hyatlasDigestCmd() {
  return new Command('digest')
    .description('Run HyAtlas digest cycle')
    .action(async () => {
      try {
        const data = await hyatlasFetch('/api/v1/digest', 'POST', {});
        console.log(chalk.green('  ✓ Digest complete'));
        console.log(chalk.gray(`    ${JSON.stringify(data).slice(0, 200)}`));
        console.log();
      } catch (err) {
        console.log(chalk.red('  HyAtlas not running on :19528\n'));
      }
    });
}

export default {
  hyatlasStatusCmd,
  hyatlasSearchCmd,
  hyatlasAddCmd,
  hyatlasListCmd,
  hyatlasGraphCmd,
  hyatlasMetricsCmd,
  hyatlasDigestCmd,
};
