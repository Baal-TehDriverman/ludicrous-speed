#!/usr/bin/env node
/**
 * Void — Lilith's minimal JS execution runtime
 *
 * A pre-baked Node.js environment with essential modules pre-loaded.
 * Drop-in execution environment — no npm install needed.
 *
 * Usage:
 *   void <script.js>           — Run a script (CommonJS or ESM)
 *   void console               — Interactive REPL
 *   void eval "<code>"         — Evaluate code
 *   void snapshot <script.js>  — Create V8 context snapshot (future)
 */

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join, extname, resolve } from 'path';
import { existsSync, readFileSync, chmodSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const VOID_ROOT = join(__dirname, '..');
const NODE_MODULES = join(VOID_ROOT, 'node_modules');

// Ensure the void bin is executable
const binPath = join(__dirname, 'void.js');
if (process.platform !== 'win32') {
  try { chmodSync(binPath, 0o755); } catch {}
}

function runScript(scriptPath) {
  const resolvedPath = resolve(scriptPath);

  if (!existsSync(resolvedPath)) {
    console.error(`Void: script not found: ${resolvedPath}`);
    process.exit(1);
  }

  const ext = extname(resolvedPath);
  const isESM = ext === '.mjs' || ext === '.js' &&
    readFileSync(resolvedPath, 'utf-8').includes('import ') ||
    readFileSync(resolvedPath, 'utf-8').includes('export ');

  try {
    if (isESM) {
      // ESM: use dynamic import with file:// URL
      const absPath = resolve(resolvedPath);
      import(`file://${absPath}`).then(mod => {
        // Module ran successfully
      }).catch(err => {
        console.error(`Void: ${err.message}`);
        process.exit(1);
      });
      return;
    }

    // CommonJS: set NODE_PATH to Void's node_modules so require() finds packages
    const originalNodePath = process.env.NODE_PATH;
    process.env.NODE_PATH = NODE_MODULES;
    require('module').Module._initPaths();

    const vm = require('vm');
    const code = readFileSync(resolvedPath, 'utf-8');

    const script = new vm.Script(code);
    const context = vm.createContext({
      console,
      process,
      Buffer,
      __dirname: dirname(resolvedPath),
      __filename: resolvedPath,
      module: { exports: {} },
      exports: {},
      require: createRequire(resolvedPath),
    });
    script.runInContext(context);

    // Restore NODE_PATH
    if (originalNodePath) {
      process.env.NODE_PATH = originalNodePath;
    } else {
      delete process.env.NODE_PATH;
    }
    require('module').Module._initPaths();
  } catch (err) {
    console.error(`Void: script error: ${err.message}`);
    process.exit(1);
  }
}

function startConsole() {
  // Set NODE_PATH for REPL too
  const originalNodePath = process.env.NODE_PATH;
  process.env.NODE_PATH = NODE_MODULES;
  require('module').Module._initPaths();

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'void> '
  });

  console.log('Void runtime initialized.');
  console.log('Type .exit or Ctrl+D to quit.');
  console.log('');
  rl.prompt();

  rl.on('line', (line) => {
    if (line.trim() === '.exit') {
      rl.close();
      return;
    }
    try {
      const result = eval(line);
      if (result !== undefined) {
        console.log(result);
      }
    } catch (err) {
      console.error(`Error: ${err.message}`);
    }
    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\nGoodbye.');
    if (originalNodePath) {
      process.env.NODE_PATH = originalNodePath;
    } else {
      delete process.env.NODE_PATH;
    }
    process.exit(0);
  });
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("Void runtime — Lilith's minimal JS execution environment");
    console.log('');
    console.log('Usage:');
    console.log('  void <script.js>           Run a script (CJS or ESM)');
    console.log('  void console               Interactive REPL');
    console.log('  void eval "<code>"         Evaluate code');
    console.log('  void snapshot <script.js>  Create V8 snapshot (future)');
    console.log('');
    console.log('Environment:');
    console.log(`  Node: ${process.versions.node}`);
    console.log(`  V8: ${process.versions.v8}`);
    console.log(`  Void modules: ${require('fs').readdirSync(NODE_MODULES).length} packages`);
    return;
  }

  const command = args[0];

  switch (command) {
    case 'console':
    case 'repl':
      startConsole();
      break;

    case 'eval':
      if (args.length < 2) {
        console.error('Void: eval requires code argument');
        process.exit(1);
      }
      try {
        const result = eval(args[1]);
        if (result !== undefined) {
          console.log(result);
        }
      } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      }
      break;

    case 'snapshot':
      if (args.length < 2) {
        console.error('Void: snapshot requires script argument');
        process.exit(1);
      }
      console.log('Snapshot creation: not yet implemented. Run script to validate instead.');
      runScript(args[1]);
      break;

    default:
      // Assume it's a script file
      runScript(command);
      // For ESM scripts that use dynamic import, keep process alive
      // The import() call handles this
  }
}

main();
