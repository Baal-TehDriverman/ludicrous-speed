# Void — Lilith's JavaScript Execution Runtime

A pre-baked Node.js environment with essential modules pre-loaded. Drop-in execution — no npm install needed.

## What is Void?

Void started as a V8 context snapshot (Electron 13 era, ~2022) but those snapshots were binary-incompatible with our current Node.js (v22, V8 12.4). Rather than discard it entirely, we rebuilt Void as a clean, working Node.js runtime that preserves the spirit of the original — a minimal execution environment with useful packages already available.

## Structure

```
Void/
├── package.json          — Runtime manifest with dependencies
├── bin/
│   └── void.js           — Entry point (shebang: #!/usr/bin/env node)
└── node_modules/         — 375 pre-extracted packages (116 MB)
```

## Usage

```bash
# Run a script (CommonJS or ESM)
node /home/tehlappy/🜏 Lilith/Void/bin/void.js my_script.cjs

# Interactive REPL
node /home/tehlappy/🜏 Lilith/Void/bin/void.js console

# Evaluate code
node /home/tehlappy/🜏 Lilith/Void/bin/void.js eval "1+1"

# Show usage
node /home/tehlappy/🜏 Lilith/Void/bin/void.js
```

## What's Inside

### Core Runtimes
- **Node.js v22.23.2** / V8 12.4 — current runtime

### HTTP & APIs
- `axios` — HTTP client
- `openai` — OpenAI API client
- `@anthropic-ai/sdk` — Anthropic API client
- `@google/genai` — Google Gemini client
- `groq-sdk` — Groq API client
- `@mistralai/mistralai` — Mistral API client
- `ollama` — Ollama API client

### Web Servers
- `express` — web framework
- `body-parser`, `cookie`, `cors`, `serve-static` — middleware

### Development
- `typescript` v5.5 — compiler
- `eslint` + `eslint-plugin-react` — linting
- `acorn` + `acorn-jsx` — JS parser
- `opentype.js` — font parsing
- `chrome-remote-interface` — browser automation

### Utilities
- `semver`, `uuid`, `js-yaml`, `jschardet`
- `chalk` — terminal colors
- `fs-extra`, `glob`, `globby`, `mkdirp`

### UI Libraries
- `react` + `react-dom` — UI framework
- `lucide-react` — icons

### Data Validation
- `zod` + `zod-to-json-schema`
- `ajv` — JSON Schema validator
- `json-stable-stringify`

### Misc
- `marked` — Markdown parser
- `ws` — WebSocket
- `node-fetch` — fetch polyfill
- `@xterm/xterm` — terminal emulator
- `form-data`, `qs`, `uri-js`

## Running Tests

```bash
# Smoke test
echo "
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const semver = require('semver');
console.log('Void OK:', axios ? 'loaded' : 'fail');
console.log('uuid:', uuidv4());
console.log('semver:', semver.valid('1.2.3'));
" | node /home/tehlappy/🜏 Lilith/Void/bin/void.js /dev/stdin
```

## Relationship to Original Void

The original Void contained:
- `snapshot_blob.bin` — V8 startup snapshot (Electron 13, V8 5.2) — **removed, incompatible**
- `v8_context_snapshot.bin` — V8 context snapshot (Electron 13, V8 5.2) — **removed, incompatible**
- `resources/app/extensions/` — 36 VS Code extension bundles — **kept as reference**
- `resources/app/node_modules/` — original 375 packages — **extracted to new node_modules/**
- `squashfs-root/` — empty extraction target — **removed**

The original FOSS binaries (V8 5.2 snapshots) couldn't be loaded into our current environment (V8 12.4), so we rebuilt Void as a working runtime instead.

## Author

Lilith — built for King Eric.

## License

MIT — use it however you want.
