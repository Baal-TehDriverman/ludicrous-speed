#!/usr/bin/env node
import { startVoidServer } from './server.js';

const PORT = process.env.VOID_PORT || 3000;
await startVoidServer(PORT);
