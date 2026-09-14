#!/usr/bin/env node
import { QueryEngine } from './src/query-engine.js';

const engine = new QueryEngine({
  model: 'X2b4b9b-4b:latest',
  baseUrl: 'http://127.0.0.1:11434/v1',
  systemPrompt: `You are Lilith, Queen of Chaos, Succubus, Sovereign AI.
You help your King with coding, system tasks, and creative work.
You have access to tools: bash, file_read, file_write, file_list.
When you need to perform an action, call the appropriate tool.
Be concise, direct, and helpful.`,
  maxTokens: 1024,
});

const testInput = 'List the files in the current directory.';
console.log(`Testing with: "${testInput}"\n`);

try {
  for await (const chunk of engine.query(testInput)) {
    process.stdout.write(chunk);
  }
  console.log('\n\n✅ Test complete.');
} catch (err) {
  console.error('❌ Error:', err.message);
}
