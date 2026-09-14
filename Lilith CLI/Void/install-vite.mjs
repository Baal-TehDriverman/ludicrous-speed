#!/usr/bin/env node
import https from 'https';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function downloadAndExtract(pkgName, version, tarballUrl, destDir) {
  return new Promise((resolve, reject) => {
    console.log('Downloading', pkgName, version, '...');
    https.get(tarballUrl, (res) => {
      const tmpFile = '/tmp/' + pkgName.replace('@', '').replace('/', '-') + '-' + version + '.tgz';
      const pipe = fs.createWriteStream(tmpFile);
      res.on('end', () => {
        console.log('Extracting ' + pkgName + '...');
        try {
          execSync('tar xzf "' + tmpFile + '" -C /tmp', { stdio: 'pipe' });
        } catch (e) {
          console.error('Extract failed:', e.stderr?.toString() || e.message);
          return reject(e);
        }
        const srcDir = '/tmp/package';
        if (!fs.existsSync(srcDir)) {
          console.error('No /tmp/package after extraction');
          return reject(new Error('extraction failed'));
        }
        // Remove dest if exists
        if (fs.existsSync(destDir)) {
          fs.rmSync(destDir, { recursive: true, force: true });
        }
        fs.mkdirSync(path.dirname(destDir), { recursive: true });
        // Copy (handles EXDEV)
        try {
          fs.renameSync(srcDir, destDir);
        } catch (e) {
          if (e.code === 'EXDEV') {
            fs.mkdirSync(destDir, { recursive: true });
            for (const f of fs.readdirSync(srcDir)) {
              const sp = path.join(srcDir, f);
              const dp = path.join(destDir, f);
              const st = fs.statSync(sp);
              if (st.isDirectory()) {
                fs.cpSync(sp, dp, { recursive: true });
              } else {
                fs.copyFileSync(sp, dp);
              }
            }
          } else {
            throw e;
          }
        }
        const pkg = JSON.parse(fs.readFileSync(destDir + '/package.json', 'utf8'));
        console.log('  ✓ ' + pkgName + '@' + pkg.version + ' installed');
        resolve(pkg);
      });
      res.pipe(pipe);
    }).on('error', reject);
  });
}

async function main() {
  try {
    // 1. Vite
    await downloadAndExtract(
      'vite', '6.0.7',
      'https://registry.npmjs.org/vite/-/vite-6.0.7.tgz',
      path.join(__dirname, 'node_modules', 'vite')
    );

    // 2. @vitejs/plugin-react
    await downloadAndExtract(
      '@vitejs/plugin-react', '4.3.4',
      'https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-4.3.4.tgz',
      path.join(__dirname, 'node_modules', '@vitejs', 'plugin-react')
    );

    // 3. @babel/core (peer dep of plugin-react)
    await downloadAndExtract(
      '@babel/core', '7.26.10',
      'https://registry.npmjs.org/@babel/core/-/core-7.26.10.tgz',
      path.join(__dirname, 'node_modules', '@babel', 'core')
    );

    // 4. react-refresh (dep of plugin-react)
    await downloadAndExtract(
      'react-refresh', '0.14.2',
      'https://registry.npmjs.org/react-refresh/-/react-refresh-0.14.2.tgz',
      path.join(__dirname, 'node_modules', 'react-refresh')
    );

    // 5. Check what else plugin-react needs from its package.json
    const pluginPkg = JSON.parse(fs.readFileSync(
      path.join(__dirname, 'node_modules', '@vitejs', 'plugin-react', 'package.json'), 'utf8'
    ));
    const neededDeps = pluginPkg.dependencies || {};
    console.log('\nPlugin-react dependencies:', JSON.stringify(neededDeps, null, 2));

    // Check which are missing
    const missing = [];
    for (const [name, ver] of Object.entries(neededDeps)) {
      const pkgPath = path.join(__dirname, 'node_modules', name);
      if (!fs.existsSync(pkgPath + '/package.json')) {
        missing.push({ name, ver });
      }
    }
    if (missing.length > 0) {
      console.log('\nMissing deps to install:', missing.map(m => m.name + '@' + m.ver).join(', '));
    } else {
      console.log('\nAll plugin-react deps present.');
    }

    console.log('\n✓ Vite + plugin-react installation complete.');
    console.log('  Next: node install-vite.mjs extras  (to install any missing deps)');
  } catch (e) {
    console.error('Installation failed:', e.message);
    process.exit(1);
  }
}

// If called with 'extras' arg, install remaining deps
if (process.argv[2] === 'extras') {
  main().then(async () => {
    const pluginPkg = JSON.parse(fs.readFileSync(
      path.join(__dirname, 'node_modules', '@vitejs', 'plugin-react', 'package.json'), 'utf8'
    ));
    const neededDeps = pluginPkg.dependencies || {};
    const missing = [];
    for (const [name, ver] of Object.entries(neededDeps)) {
      const pkgPath = path.join(__dirname, 'node_modules', name);
      if (!fs.existsSync(pkgPath + '/package.json')) {
        missing.push({ name, ver });
      }
    }
    if (missing.length === 0) {
      console.log('All deps already present.');
      return;
    }
    console.log('Installing', missing.length, 'missing deps...');
    for (const { name, ver } of missing) {
      const tgzName = name.replace('@', '').replace('/', '-');
      const url = 'https://registry.npmjs.org/' +
        (name.startsWith('@') ? encodeURIComponent(name) + '/-' : '') +
        name + '/' + name + '-' + ver + '.tgz';
      // Use a simpler version string for the tarball URL
      const cleanVer = ver.replace(/^\^/, '');
      const tgzUrl = 'https://registry.npmjs.org/' +
        (name.startsWith('@') ? encodeURIComponent(name) + '/-' : '') +
        name + '/' + name + '-' + cleanVer + '.tgz';
      console.log('  Downloading', name, cleanVer);
      try {
        await downloadAndExtract(name, cleanVer, tgzUrl,
          path.join(__dirname, 'node_modules', name.startsWith('@') ? name : name));
      } catch (e) {
        console.error('  Failed to install', name, ':', e.message);
      }
    }
    console.log('\nDone.');
  });
} else {
  main();
}
