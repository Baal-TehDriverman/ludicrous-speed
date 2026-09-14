#!/usr/bin/env node
/**
 * 🜏 Lilith CLI - Tool Executor
 * Executes tools the model requests.
 */

import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export const tools = [
  {
    name: 'bash',
    description: 'Execute a shell command and return the output',
    parameters: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'The shell command to execute' },
      },
      required: ['command'],
    },
    async execute(input) {
      return new Promise((resolve, reject) => {
        const proc = spawn('bash', ['-c', input.command], {
          cwd: process.cwd(),
          env: process.env,
        });
        let stdout = '';
        let stderr = '';
        proc.stdout.on('data', (d) => (stdout += d));
        proc.stderr.on('data', (d) => (stderr += d));
        proc.on('close', (code) => {
          const output = stdout.trim() + (stderr.trim() ? `\nSTDERR: ${stderr.trim()}` : '');
          resolve(`Exit code: ${code}\n${output}`);
        });
        proc.on('error', reject);
      });
    },
  },
  {
    name: 'file_read',
    description: 'Read the contents of a file',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to the file to read' },
      },
      required: ['path'],
    },
    async execute(input) {
      try {
        const content = await fs.readFile(input.path, 'utf8');
        return content;
      } catch (err) {
        return `Error: ${err.message}`;
      }
    },
  },
  {
    name: 'file_write',
    description: 'Write content to a file',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to the file to write' },
        content: { type: 'string', description: 'Content to write' },
      },
      required: ['path', 'content'],
    },
    async execute(input) {
      try {
        await fs.mkdir(path.dirname(input.path), { recursive: true });
        await fs.writeFile(input.path, input.content);
        return `Written to ${input.path}`;
      } catch (err) {
        return `Error: ${err.message}`;
      }
    },
  },
  {
    name: 'file_list',
    description: 'List files in a directory',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Directory path', default: '.' },
      },
      required: ['path'],
    },
    async execute(input) {
      try {
        const entries = await fs.readdir(input.path || '.', { withFileTypes: true });
        return entries
          .map((e) => (e.isDirectory() ? `${e.name}/` : e.name))
          .join('\n');
      } catch (err) {
        return `Error: ${err.message}`;
      }
    },
  },
];

export function getToolDefinitions() {
  return tools.map((t) => ({
    type: 'function',
    function: {
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    },
  }));
}

export async function executeTool(name, input) {
  const tool = tools.find((t) => t.name === name);
  if (!tool) return `Error: Unknown tool "${name}"`;
  try {
    return await tool.execute(input);
  } catch (err) {
    return `Error: ${err.message}`;
  }
}
