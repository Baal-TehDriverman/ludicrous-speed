import { create } from 'zustand';

export const useVoidStore = create((set, get) => ({
  // Mod engine state
  modStatus: null,
  cetStatus: null,
  activeJobs: [],
  modTools: [],
  modToolsLoaded: false,

  // Void runtime state
  voidStatus: null,
  execHistory: [],

  // UI state
  activeTab: 'terminal',
  logs: [],
  settings: {
    profile: 'no-net',
    timeoutMs: 15000,
    mode: 'eval',
  },

  // Actions
  setActiveTab: (tab) => set({ activeTab: tab }),

  setModStatus: (status) => set({ modStatus: status }),
  setCetStatus: (cet) => set({ cetStatus: cet }),
  setActiveJobs: (jobs) => set({ activeJobs: jobs }),

  setVoidStatus: (status) => set({ voidStatus: status }),
  setExecHistory: (history) => set({ execHistory: history }),

  addLog: (log) => set((state) => ({ logs: [log, ...state.logs].slice(0, 200) })),
  clearLogs: () => set({ logs: [] }),

  setSettings: (settings) => set((state) => ({ settings: { ...state.settings, ...settings } })),

  setModTools: (tools) => set({ modTools: tools, modToolsLoaded: true }),

  // Mod actions
  buildMod: async (modDir) => {
    const res = await fetch('/api/mod/build', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modDir }),
    });
    const data = await res.json();
    get().addLog({ type: 'mod', message: `Build initiated for ${modDir}`, timestamp: new Date().toISOString() });
    return data;
  },

  deployMod: async (modName, sourcePath, type) => {
    const res = await fetch('/api/mod/deploy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modName, sourcePath, type }),
    });
    const data = await res.json();
    get().addLog({ type: 'mod', message: `Deploy initiated for ${modName}`, timestamp: new Date().toISOString() });
    return data;
  },

  verifyMod: async (modName) => {
    const res = await fetch('/api/mod/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modName }),
    });
    const data = await res.json();
    return data;
  },

  scanMods: async () => {
    const res = await fetch('/api/mod/scan');
    const data = await res.json();
    return data;
  },

  quickBuild: async (modDir, modName, type) => {
    const res = await fetch('/api/mod/quick', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modDir, modName, type }),
    });
    const data = await res.json();
    return data;
  },

  // Void actions
  execCode: async (code, mode, profile, timeoutMs) => {
    const res = await fetch('/api/void/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, mode, profile, timeout_ms: timeoutMs }),
    });
    const data = await res.json();
    get().addLog({ type: 'exec', message: `Exec ${mode}: ${data.success ? 'OK' : 'FAIL'}`, timestamp: new Date().toISOString() });
    return data;
  },

  fetchVoidStatus: async () => {
    const res = await fetch('/api/void/status');
    const data = await res.json();
    get().setVoidStatus(data);
    return data;
  },

  fetchHistory: async () => {
    const res = await fetch('/api/void/history');
    const data = await res.json();
    get().setExecHistory(data);
    return data;
  },

  fetchModStatus: async () => {
    const res = await fetch('/api/mod/status');
    const data = await res.json();
    get().setModStatus(data);
    get().setActiveJobs(data.jobs || []);
    return data;
  },

  fetchCetStatus: async () => {
    const res = await fetch('/api/mod/cet');
    const data = await res.json();
    get().setCetStatus(data);
    return data;
  },
}));