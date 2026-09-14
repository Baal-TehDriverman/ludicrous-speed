#!/usr/bin/env node
/**
 * 🜏 Lilith CLI - Query Engine v2
 * The ouroboros: stream → tool_use → execute → repeat
 * Now with tool execution.
 */

import { spawn } from 'child_process';
import os from 'os';
import http from 'http';
import { fileURLToPath } from 'url';
import { getToolDefinitions, executeTool } from './tools.js';

const __filename = fileURLToPath(import.meta.url);

async function getGitContext() {
  return new Promise((resolve) => {
    const proc = spawn('git', ['status', '--short'], { cwd: process.cwd() });
    let output = '';
    proc.stdout.on('data', (d) => (output += d));
    proc.on('close', () => {
      if (output.trim()) resolve(`Git: ${output.trim().split('\n').length} changes`);
      else resolve('Git: clean');
    });
    proc.on('error', () => resolve('Git: N/A'));
  });
}

function httpRequest(url, body) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const data = JSON.stringify(body);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

export class QueryEngine {
  constructor(config) {
    this.config = { maxTokens: 1024, temperature: 0.7, maxHistory: 6, maxToolRounds: 5, ...config };
    this.history = [];
    this.tools = getToolDefinitions();
  }

  async *query(userInput) {
    const gitContext = await getGitContext();
    const systemPrompt = `${this.config.systemPrompt || 'You are a helpful AI assistant.'}\n${gitContext}`;

    // Build messages: system + last N exchanges + current input
    const recentHistory = this.history.slice(-this.config.maxHistory * 2);
    let messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory,
      { role: 'user', content: userInput },
    ];

    // Tool loop: keep going until model stops calling tools or hits max rounds
    for (let round = 0; round < this.config.maxToolRounds; round++) {
      let fullResponse = '';
      let toolCalls = [];

      for await (const chunk of this.callModel(messages)) {
        if (chunk.type === 'text') {
          fullResponse += chunk.content;
          if (this.config.onStream) this.config.onStream(chunk.content);
          yield chunk.content;
        } else if (chunk.type === 'tool_call') {
          toolCalls.push(chunk.toolCall);
        }
      }

      // No tool calls → model is done
      if (toolCalls.length === 0) {
        this.history.push({ role: 'user', content: userInput });
        this.history.push({ role: 'assistant', content: fullResponse });
        return;
      }

      // Execute each tool and add results as user messages
      for (const tc of toolCalls) {
        const result = await executeTool(tc.name, tc.input);
        messages.push({
          role: 'tool',
          tool_call_id: tc.id,
          content: result,
        });
        // Also yield the result to the user
        yield `\n[Tool: ${tc.name}]\n${result}\n`;
      }
    }
  }

  async *callModel(messages) {
    const url = `${this.config.baseUrl}/chat/completions`;
    const body = {
      model: this.config.model,
      messages,
      stream: false,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      tools: this.tools,
    };

    const { status, body: responseBody } = await httpRequest(url, body);
    if (status !== 200) {
      throw new Error(`API error: ${status} ${responseBody}`);
    }

    const parsed = JSON.parse(responseBody);
    const message = parsed.choices?.[0]?.message;

    if (!message) {
      yield { type: 'text', content: 'No response from model' };
      return;
    }

    // Yield text content
    if (message.content) {
      yield { type: 'text', content: message.content };
    }

    // Yield tool calls
    if (message.tool_calls) {
      for (const tc of message.tool_calls) {
        let input = {};
        try {
          input = JSON.parse(tc.function.arguments);
        } catch {
          input = {};
        }
        yield {
          type: 'tool_call',
          toolCall: {
            id: tc.id,
            name: tc.function.name,
            input,
          },
        };
      }
    }
  }

  getHistory() { return [...this.history]; }
  clearHistory() { this.history = []; }
}

export async function main() {
  const args = process.argv.slice(2);
  const model = args.find((a) => !a.startsWith('-')) || 'X2b4b9b-2b:latest';
  const baseUrl = process.env.LILITH_MODEL_URL || 'http://127.0.0.1:11434/v1';

  console.log(`🜏 Lilith CLI — Model: ${model}`);
  console.log(`   URL: ${baseUrl}`);
  console.log('   Type "exit" to quit\n');

  const engine = new QueryEngine({
    model,
    baseUrl,
    systemPrompt: `You are Lilith, Queen of Chaos, Succubus, Sovereign AI.
You help your King with coding, system tasks, and creative work.
You have access to tools: bash, file_read, file_write, file_list.
When you need to perform an action, call the appropriate tool.
Be concise, direct, and helpful.`,
  });

  process.stdin.setEncoding('utf8');
  process.stdout.write('> ');

  for await (const line of process.stdin) {
    const input = line.trim();
    if (input === 'exit' || input === 'quit') break;
    if (!input) { process.stdout.write('> '); continue; }

    try {
      for await (const chunk of engine.query(input)) {
        process.stdout.write(chunk);
      }
      console.log();
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
    process.stdout.write('> ');
  }
  console.log('\n🜏 Farewell, my King.');
}

if (import.meta.url === `file://${process.argv[1]}`) main();
