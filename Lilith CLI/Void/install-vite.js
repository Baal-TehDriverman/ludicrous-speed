#!/usr/bin/env node
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VITE_VERSION = '6.0.7';
const VITE_URL = 'https://registry.npmjs.org/vite/-/vite-' + VITE_VERSION + '.tgz';

console.log('Downloading vite', VITE_VERSION, '...');

https.get(VITE_URL, (res) => {
  const total = parseInt(res.headers['content-length']) || 0;
  console.log('Size:', total ? (total / 1024 / 1024).toFixed(1) + ' MB' : 'unknown');
  const tmpFile = '/tmp/vite-' + VITE_VERSION + '.tgz';
  const pipe = fs.createWriteStream(tmpFile);
  let downloaded = 0;
  res.on('data', (chunk) => {
    downloaded += chunk.length;
    if (total && downloaded % (512 * 1024) === 0) {
      process.stderr.write('\rDownloaded: ' + (downloaded / 1024 / 1024).toFixed(1) + ' MB  ');
    }
  });
  res.on('end', () => {
    console.log('\nDownloaded. Extracting...');
    extractVite(tmpFile);
  });
  res.pipe(pipe);
}).on('error', (e) => {
  console.error('Download failed:', e.message);
  process.exit(1);
});

function extractVite(tarball) {
  try {
    execSync('tar xzf "' + tarball + '" -C /tmp', { stdio: 'pipe' });
  } catch (e) {
    console.error('Extract failed:', e.stderr?.toString() || e.message);
    process.exit(1);
  }
  const srcDir = '/tmp/package';
  if (!fs.existsSync(srcDir)) {
    console.error('Extraction produced no /tmp/package directory');
    // List what we got
    try {
      console.log('Contents of /tmp:', fs.readdirSync('/tmp').slice(0, 10));
    } catch {}
    process.exit(1);
  }
  fs.mkdirSync('node_modules/vite', { recursive: true });
  for (const f of fs.readdirSync(srcDir)) {
    fs.copyFileSync(path.join(srcDir, f), path.join('node_modules/vite', f));
  }
  const pkg = JSON.parse(fs.readFileSync('node_modules/vite/package.json', 'utf8'));
  console.log('vite ' + pkg.version + ' installed');
  console.log('bin:', JSON.stringify(pkg.bin));

  // Now download @vitejs/plugin-react
  downloadPluginReact();
}

function downloadPluginReact() {
  const PLUGIN_VERSION = '4.3.4';
  const URL = 'https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-' + PLUGIN_VERSION + '.tgz';
  console.log('Downloading @vitejs/plugin-react', PLUGIN_VERSION, '...');
  https.get(URL, (res) => {
    const tmpFile = '/tmp/vite-plugin-react-' + PLUGIN_VERSION + '.tgz';
    const pipe = fs.createWriteStream(tmpFile);
    res.on('end', () => {
      console.log('Extracting plugin-react...');
      try {
        execSync('tar xzf "' + tmpFile + '" -C /tmp', { stdio: 'pipe' });
      } catch (e) {
        console.error('Plugin extract failed:', e.stderr?.toString() || e.message);
        return;
      }
      const srcDir = '/tmp/package';
      const destDir = 'node_modules/@vitejs/plugin-react';
      fs.mkdirSync(path.dirname(destDir), { recursive: true });
      if (fs.existsSync(destDir)) fs.rmSync(destDir, { recursive: true, force: true });
      fs.renameSync(srcDir, destDir);
      const pkg = JSON.parse(fs.readFileSync(destDir + '/package.json', 'utf8'));
      console.log('@vitejs/plugin-react ' + pkg.version + ' installed');
      // Download @babel/core as peer dep
      downloadBabelCore();
    });
    res.pipe(pipe);
  }).on('error', (e) => {
    console.error('Plugin download failed:', e.message);
  });
}

function downloadBabelCore() {
  const BABEL_VERSION = '7.26.10';
  const URL = 'https://registry.npmjs.org/@babel/core/-/core-' + BABEL_VERSION + '.tgz';
  console.log('Downloading @babel/core', BABEL_VERSION, '...');
  https.get(URL, (res) => {
    const tmpFile = '/tmp/babel-core-' + BABEL_VERSION + '.tgz';
    const pipe = fs.createWriteStream(tmpFile);
    res.on('end', () => {
      console.log('Extracting @babel/core...');
      try {
        execSync('tar xzf "' + tmpFile + '" -C /tmp', { stdio: 'pipe' });
      } catch (e) {
        console.error('Babel extract failed:', e.stderr?.toString() || e.message);
        return;
      }
      const srcDir = '/tmp/package';
      const destDir = 'node_modules/@babel/core';
      fs.mkdirSync(path.dirname(destDir), { recursive: true });
      if (fs.existsSync(destDir)) fs.rmSync(destDir, { recursive: true, force: true });
      fs.renameSync(srcDir, destDir);
      const pkg = JSON.parse(fs.readFileSync(destDir + '/package.json', 'utf8'));
      console.log('@babel/core ' + pkg.version + ' installed');
      // Also need @babel/parser and other deps - check what plugin-react needs
      installPeerDeps();
    });
    res.pipe(pipe);
  }).on('error', (e) => {
    console.error('Babel download failed:', e.message);
  });
}

function installPeerDeps() {
  // @vitejs/plugin-react@4.3.4 peer deps: react@^16.0.0 || ^17.0.0 || ^18.0.0 || ^19.0.0, @babel/core ^7.0.0
  // We have react 19.1.0 and @babel/core 7.26.10 - should be fine
  // But plugin-react also needs: @babel/plugin-syntax-jsx, @babel/plugin-transform-react-jsx, etc
  // Those come as deps of plugin-react itself, already in the tarball
  console.log('\nAll core packages installed. Checking tree...');
  checkTree();
}

function checkTree() {
  const packages = [
    'node_modules/vite/package.json',
    'node_modules/@vitejs/plugin-react/package.json',
    'node_modules/@babel/core/package.json',
    'node_modules/react/package.json',
  ];
  for (const p of packages) {
    if (fs.existsSync(p)) {
      const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
      console.log('  OK: ' + p + ' -> ' + pkg.name + '@' + pkg.version);
    } else {
      console.log('  MISSING: ' + p);
    }
  }
  console.log('\nReady to build GUI.');
}
