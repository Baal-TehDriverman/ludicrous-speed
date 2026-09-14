#!/usr/bin/env node
/**
 * Build script for Lilith CLI
 * Bundles the CLI into a single executable using esbuild
 */

import { build } from 'esbuild';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildCLI() {
  console.log(chalk.cyan('🔨 Building Lilith CLI...'));
  
  const entryPoint = join(__dirname, 'src/cli/index.js');
  const outFile = join(__dirname, 'dist/lilith-cli.js');
  const voidEntry = join(__dirname, 'src/void/commands.js');
  const voidOut = join(__dirname, 'dist/void-commands.js');
  
  try {
    await fs.mkdir(join(__dirname, 'dist'), { recursive: true });
    
    await build({
      entryPoints: [entryPoint],
      bundle: true,
      platform: 'node',
      format: 'esm',
      target: 'node18',
      outfile: outFile,
      external: [
        'better-sqlite3',
        'sqlite3',
        'open',
        'commander',
        'chalk',
        'ora',
        'yaml',
        'ws',
        'axios',
        'node-fetch',
        'uuid',
        'inquirer',
        'boxen',
        'gradient-string',
        'figlet',
        'cli-table3',
        'date-fns',
        'fast-glob',
        'js-yaml',
        'cross-spawn',
        'merge-stream',
        'stream',
        'events',
        'fs',
        'path',
        'url',
        'util',
        'crypto',
        'buffer',
        'process',
        'os',
        'querystring',
        'child_process',
        'express',
        'body-parser',
        'cors',
        'cookie',
        'serve-static',
        'debug',
        'semver',
        'marked',
        'fs-extra',
        'glob',
        'globby',
        'mkdirp',
        'js-yaml',
        'zod',
        'ajv',
        'json-stable-stringify-without-jsonify',
        'form-data',
        'qs',
        'querystring',
        'string_decoder',
        'inherits',
        'safe-buffer',
        'readable-stream',
        'once',
        'wrappy',
        'end-of-stream',
        'agent-base',
        'follow-redirects',
        'http-proxy-agent',
        'https-proxy-agent',
        'socks-proxy-agent',
        'tunnel-agent',
        'find-up',
        'picomatch',
        'minimatch',
        'brace-expansion',
        'chownr',
        'compare-directory',
        'ejs',
        'nunjucks',
        'handlebars',
        'winston',
        'pino',
        'helmet',
        'compression',
        'depd',
        'finalhandler',
        'methods',
        'parseurl',
        'proxy-addr',
        'router',
        'send',
        'vary',
        'utils-merge',
        'serve-static',
        'setprototypeof',
        'statuses',
        'type-is',
        'unpipe',
        'merge-descriptors',
        'encodeurl',
        'escape-html',
        'etag',
        'fresh',
        'http-errors',
        'mime-types',
        'mime-db',
        'ms',
        'on-finished',
        'range-parser',
        'bytes',
        'content-type',
        'content-disposition',
        'cookie-signature',
        'destroy',
        'ee-first',
        'forwarded',
        'ipaddr.js',
        'media-typer',
        'negotiator',
        'object-assign',
        'path-to-regexp',
        'qs',
        'accepts',
        'array-flatten',
        'body-parser',
        'bytes',
        'content-type',
        'debug',
        'depd',
        'destroy',
        'ee-first',
        'encodeurl',
        'escape-html',
        'etag',
        'finalhandler',
        'fresh',
        'http-errors',
        'merge-descriptors',
        'methods',
        'on-finished',
        'parseurl',
        'path-to-regexp',
        'proxy-addr',
        'qs',
        'range-parser',
        'safe-buffer',
        'send',
        'serve-static',
        'setprototypeof',
        'statuses',
        'type-is',
        'utils-merge',
        'vary'
      ],
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    
    // Make executable
    await fs.chmod(outFile, 0o755);
    
    console.log(chalk.green(`✅ Built to ${outFile}`));
    
    // Create symlink in dist
    const binPath = join(__dirname, 'dist', 'lilith');
    await fs.copyFile(outFile, binPath);
    await fs.chmod(binPath, 0o755);
    
    // ─── Void Commands Build ───
    try {
      await build({
        entryPoints: [voidEntry],
        bundle: true,
        platform: 'node',
        format: 'esm',
        target: 'node18',
        outfile: voidOut,
        external: ['chalk', 'commander'],
        define: {
          'process.env.NODE_ENV': '"production"'
        }
      });
      console.log(chalk.green(`✅ Void commands built to ${voidOut}`));
    } catch (voidErr) {
      console.log(chalk.yellow('⚠️ Void commands build skipped:', voidErr.message));
    }
    
    // ─── Lilith Mod Build ───
    const modEntry = join(__dirname, 'src/modding/mod-cli.js');
    const modOut = join(__dirname, 'dist', 'lilith-mod.js');
    try {
      await fs.mkdir(join(__dirname, 'dist'), { recursive: true });
      await build({
        entryPoints: [modEntry],
        bundle: true,
        platform: 'node',
        format: 'esm',
        target: 'node18',
        outfile: modOut,
        external: ['chalk', 'commander'],
        define: {
          'process.env.NODE_ENV': '"production"'
        }
      });
      await fs.chmod(modOut, 0o755);
      console.log(chalk.green(`✅ Lilith Mod build: ${modOut}`));
    } catch (modErr) {
      console.log(chalk.yellow('⚠️ Mod build skipped:', modErr.message));
    }
    
    console.log(chalk.green(`✅ Built to ${outFile}`));
    
  } catch (error) {
    console.error(chalk.red('Build failed:'), error);
    process.exit(1);
  }
}

buildCLI();