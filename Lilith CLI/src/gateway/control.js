/**
 * 🌐 Lilith Gateway Control
 * Interface to the Lilith Gateway API (port 8080)
 */

import axios from 'axios';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class GatewayControl {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.ws = null;
  }

  async init() {
    const gatewayUrl = this.config.get('gateway.url');
    this.client = axios.create({
      baseURL: gatewayUrl,
      timeout: 30000
    });
    
    // Test connection
    try {
      await this.client.get('/health');
      return true;
    } catch (error) {
      console.log(chalk.yellow('⚠️ Gateway not reachable at', gatewayUrl));
      return false;
    }
  }

  async getStatus() {
    const response = await this.client.get('/api/status');
    return response.data;
  }

  async listApps() {
    const response = await this.client.get('/api/apps');
    return response.data.apps || [];
  }

  async searchApps(query) {
    const response = await this.client.get(`/api/apps/search/${encodeURIComponent(query)}`);
    return response.data;
  }

  async launchApp(appName) {
    const response = await this.client.post(`/api/apps/launch/${encodeURIComponent(appName)}`);
    return response.data;
  }

  async listVMs() {
    const response = await this.client.get('/api/vms');
    return response.data.vms || [];
  }

  async vmAction(action, vmName) {
    const validActions = ['start', 'shutdown', 'reset', 'destroy', 'reboot'];
    if (!validActions.includes(action)) {
      throw new Error(`Invalid action: ${action}. Valid: ${validActions.join(', ')}`);
    }
    const response = await this.client.post(`/api/vms/${action}/${encodeURIComponent(vmName)}`);
    return response.data;
  }

  async openConsole(vmName) {
    const response = await this.client.post(`/api/vms/console/${encodeURIComponent(vmName)}`);
    return response.data;
  }

  async openManager() {
    const response = await this.client.post('/api/vms/manager');
    return response.data;
  }

  async listModels() {
    const response = await this.client.get('/v1/models');
    return response.data;
  }

  async chat(prompt, model = null) {
    const response = await this.client.post('/v1/chat/completions', {
      model: model || 'auto',
      messages: [{ role: 'user', content: prompt }]
    });
    return response.data.choices[0]?.message?.content || 'No response';
  }

  async speculativePrecheck(files, requiresHardware = false) {
    const response = await this.client.post('/v1/speculative/precheck', {
      task_type: 'cerebellum_task',
      target_files: files,
      requires_hardware: requiresHardware
    });
    return response.data;
  }

  async deltaSync() {
    const response = await this.client.post('/api/sync/delta');
    return response.data;
  }

  async egressTest(command, args) {
    const response = await this.client.post('/api/speculative/egress-test', { command, args });
    return response.data;
  }

  async ingestFile(file, source, timestamp, deviceModel) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', source);
    formData.append('timestamp', timestamp);
    formData.append('device_model', deviceModel);
    
    const response = await this.client.post('/api/ingest', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async getEngineStatus() {
    const response = await this.client.get('/api/gateway/engine/status');
    return response.data;
  }

  async triggerEngineBuild(request) {
    const response = await this.client.post('/api/gateway/engine/build', request);
    return response.data;
  }

  async runEngineTests() {
    const response = await this.client.post('/api/gateway/engine/test');
    return response.data;
  }

  async getMSNStatus() {
    const response = await this.client.get('/api/gateway/msn/status');
    return response.data;
  }

  async getCyberpunkModStatus() {
    const response = await this.client.get('/api/gateway/msn/cyberpunk');
    return response.data;
  }

  async verifyModDeployment() {
    const response = await this.client.post('/api/gateway/verify-mod-deployment');
    return response.data;
  }

  async getDreams(limit = 50) {
    const response = await this.client.get(`/api/dreams?limit=${limit}`);
    return response.data;
  }

  async triggerDreamCycle(session = 'zelda-engine') {
    const response = await this.client.post('/api/dreams/trigger', { session });
    return response.data;
  }

  async invalidateCache(cacheType = 'all') {
    const response = await this.client.post('/api/cache/invalidate', { cache_type: cacheType });
    return response.data;
  }
}