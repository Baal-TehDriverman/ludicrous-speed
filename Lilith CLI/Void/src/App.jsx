import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// ─── Void Runtime GUI — Lilith Sovereign Terminal ───
// Replaces the black cube with a living terminal interface
// Connected to Void server on :3000
// Uses only packages available in Void: react, react-dom, ws

const VOID_URL = 'http://localhost:3000';

const PROFILES = ['no-net', 'ai-only', 'full'];
const MODES = ['eval', 'run', 'python'];

// ─── SVG Icons ───
const IconLogo = () => React.createElement('span', { style: { fontSize: '24px' } }, '🜏');
const IconTerminal = () => React.createElement('span', null, '⌨');
const IconHistory = () => React.createElement('span', null, '📜');
const IconVisualization = () => React.createElement('span', null, '🌌');
const IconSuccess = () => React.createElement('span', { style: { color: '#2ecc71' } }, '✓');
const IconError = () => React.createElement('span', { style: { color: '#e74c3c' } }, '✗');
const IconChevronDown = () => React.createElement('span', { style: { fontSize: '10px', marginLeft: '4px' } }, '▼');

// ─── Main App ───
export default function VoidGUI() {
  const [code, setCode] = useState('');
  const [mode, setMode] = useState('eval');
  const [profile, setProfile] = useState('no-net');
  const [output, setOutput] = useState([]);
  const [status, setStatus] = useState({});
  const [history, setHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('terminal');
  const outputRef = useRef(null);

  useEffect(() => {
    checkStatus();
    loadHistory();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const checkStatus = async () => {
    try {
      const res = await fetch(`${VOID_URL}/api/void/status`);
      const data = await res.json();
      setStatus(data);
      setConnected(true);
    } catch {
      setConnected(false);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await fetch(`${VOID_URL}/api/void/history?limit=50`);
      const data = await res.json();
      setHistory(data.history || []);
    } catch {}
  };

  const executeCode = async () => {
    if (!code.trim()) return;

    const entryId = Date.now();
    setOutput(prev => [...prev, { id: entryId, type: 'input', content: code, mode, profile }]);

    try {
      const res = await fetch(`${VOID_URL}/api/void/exec`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, mode, profile, timeout_ms: 15000 }),
      });
      const result = await res.json();

      setOutput(prev => [...prev, {
        id: entryId + 1,
        type: result.success ? 'success' : 'error',
        content: result.output || result.error || '(no output)',
        time: result.execution_time_ms,
      }]);

      if (result.success) {
        publishEvent('code_executed', { code: code.slice(0, 50), success: true });
      }
    } catch (err) {
      setOutput(prev => [...prev, {
        id: entryId + 1,
        type: 'error',
        content: `Connection failed: ${err.message}`,
      }]);
    }

    setCode('');
    loadHistory();
  };

  const publishEvent = (type, data) => {
    try {
      fetch(`${VOID_URL}/api/mod/hooks/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {}
  };

  const clearOutput = () => setOutput([]);

  return React.createElement('div', { style: styles.container },
    // Header
    React.createElement('div', { style: styles.header },
      React.createElement('div', { style: styles.headerLeft },
        React.createElement(IconLogo),
        React.createElement('span', { style: styles.title }, 'Void Runtime'),
        React.createElement('span', { style: connected ? styles.connected : styles.disconnected },
          connected ? '● LIVE' : '○ OFFLINE'
        ),
      ),
      React.createElement('div', { style: styles.headerRight },
        status.uptime_seconds && React.createElement('span', { style: styles.stat }, `up ${status.uptime_seconds}s`),
        React.createElement('span', { style: styles.stat }, `${status.active_executions || 0}/${status.max_concurrent || 2} active`),
        React.createElement('span', { style: styles.stat }, `${status.history_count || 0} execs`),
      ),
    ),

    // Tab Bar
    React.createElement('div', { style: styles.tabBar },
      ['terminal', 'history', 'memory', 'visualization'].map(tab =>
        React.createElement('button', {
          key: tab,
          onClick: () => setActiveTab(tab),
          style: activeTab === tab ? styles.tabActive : styles.tabInactive,
        }, tab === 'terminal' ? '⌨ Terminal' : tab === 'history' ? '📜 History' : tab === 'memory' ? '🧠 Memory' : '🌌 Visualization')
      ),
    ),

    // Tab Content
    activeTab === 'terminal' && React.createElement(TerminalTab, {
      output, outputRef, code, setCode, mode, setMode, profile, setProfile,
      executeCode, clearOutput,
    }),
    activeTab === 'history' && React.createElement(HistoryTab, { history }),
    activeTab === 'memory' && React.createElement(MemoryTab, {}),
    activeTab === 'visualization' && React.createElement(VisualizationTab, {}),
  );
}

// ─── Memory Tab — HyAtlas Integration ───
function MemoryTab() {
  const [memStatus, setMemStatus] = useState(null);
  const [memResults, setMemResults] = useState([]);
  const [memQuery, setMemQuery] = useState('');
  const [memText, setMemText] = useState('');
  const [memLayer, setMemLayer] = useState('');
  const [memLoading, setMemLoading] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const res = await fetch(`${VOID_URL}/api/hyatlas/status`);
      const data = await res.json();
      setMemStatus(data.data || data);
    } catch {
      setMemStatus({ status: 'error', error: 'HyAtlas not reachable' });
    }
  };

  const searchMemories = async () => {
    if (!memQuery.trim()) return;
    setMemLoading(true);
    try {
      const res = await fetch(`${VOID_URL}/api/hyatlas/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: memQuery, limit: 10, layer: memLayer }),
      });
      const data = await res.json();
      const all = [];
      if (data.data?.memories) {
        for (const [layer, memories] of Object.entries(data.data.memories)) {
          for (const m of memories) all.push({ ...m, resultLayer: layer });
        }
      }
      setMemResults(all);
    } catch {
      setMemResults([]);
    }
    setMemLoading(false);
  };

  const addMemory = async () => {
    if (!memText.trim()) return;
    setMemLoading(true);
    try {
      await fetch(`${VOID_URL}/api/hyatlas/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: memText }),
      });
      setMemText('');
      loadStatus();
    } catch {}
    setMemLoading(false);
  };

  return React.createElement('div', { style: { flex: 1, overflow: 'auto', padding: '16px' } },
    React.createElement('div', { style: { maxWidth: '900px', margin: '0 auto' } },
      // Status Panel
      React.createElement('div', { style: styles.memPanel },
        React.createElement('h3', { style: styles.memPanelTitle }, '🧠 HyAtlas Memory Status'),
        memStatus && React.createElement('div', { style: styles.memStatusGrid },
          React.createElement('div', { style: styles.memStatusItem },
            React.createElement('span', { style: styles.memStatusLabel }, 'Status'),
            React.createElement('span', { style: styles.memStatusValue }, memStatus.status || 'unknown'),
          ),
          React.createElement('div', { style: styles.memStatusItem },
            React.createElement('span', { style: styles.memStatusLabel }, 'Embed'),
            React.createElement('span', { style: styles.memStatusValue }, memStatus.embed + ' (' + memStatus.embed_dims + 'd)'),
          ),
          React.createElement('div', { style: styles.memStatusItem },
            React.createElement('span', { style: styles.memStatusLabel }, 'LLM'),
            React.createElement('span', { style: styles.memStatusValue }, memStatus.llm || 'n/a'),
          ),
          React.createElement('div', { style: styles.memStatusItem },
            React.createElement('span', { style: styles.memStatusLabel }, 'Graph'),
            React.createElement('span', { style: styles.memStatusValue }, (memStatus.graph_nodes || 0) + ' nodes, ' + (memStatus.graph_edges || 0) + ' edges'),
          ),
          React.createElement('div', { style: styles.memStatusItem },
            React.createElement('span', { style: styles.memStatusLabel }, 'VDB'),
            React.createElement('span', { style: styles.memStatusValue }, (memStatus.vdb_points || 0) + ' points'),
          ),
          React.createElement('div', { style: styles.memStatusItem },
            React.createElement('span', { style: styles.memStatusLabel }, 'Writes'),
            React.createElement('span', { style: styles.memStatusValue }, memStatus.writes || 0),
          ),
        ),
        // Layer counts
        memStatus?.layers && React.createElement('div', { style: styles.memLayerGrid },
          Object.entries(memStatus.layers).map(([layer, count]) =>
            React.createElement('div', { key: layer, style: styles.memLayerItem },
              React.createElement('span', { style: styles.memLayerName }, layer),
              React.createElement('span', { style: styles.memLayerCount }, count),
            )
          ),
        ),
      ),

      // Add Memory
      React.createElement('div', { style: styles.memPanel },
        React.createElement('h3', { style: styles.memPanelTitle }, '➕ Add Memory'),
        React.createElement('div', { style: styles.memAddRow },
          React.createElement('input', {
            type: 'text',
            value: memText,
            onChange: e => setMemText(e.target.value),
            onKeyDown: e => { if (e.key === 'Enter') addMemory(); },
            placeholder: 'Enter memory text...',
            style: styles.memAddInput,
          }),
          React.createElement('button', { onClick: addMemory, style: styles.memAddBtn }, 'ADD'),
        ),
      ),

      // Search
      React.createElement('div', { style: styles.memPanel },
        React.createElement('h3', { style: styles.memPanelTitle }, '🔍 Search Memories'),
        React.createElement('div', { style: styles.memAddRow },
          React.createElement('input', {
            type: 'text',
            value: memQuery,
            onChange: e => setMemQuery(e.target.value),
            onKeyDown: e => { if (e.key === 'Enter') searchMemories(); },
            placeholder: 'Search query...',
            style: styles.memAddInput,
          }),
          React.createElement('select', { value: memLayer, onChange: e => setMemLayer(e.target.value), style: styles.memSelect },
            React.createElement('option', { value: '' }, 'All layers'),
            React.createElement('option', { value: 'l1_profile' }, 'L1 Profile'),
            React.createElement('option', { value: 'l2_raw' }, 'L2 Raw'),
            React.createElement('option', { value: 'l3_fact' }, 'L3 Fact'),
            React.createElement('option', { value: 'l4_summary' }, 'L4 Summary'),
            React.createElement('option', { value: 'l5_knowledge' }, 'L5 Knowledge'),
            React.createElement('option', { value: 'l6_schema' }, 'L6 Schema'),
            React.createElement('option', { value: 'l7_intention' }, 'L7 Intention'),
          ),
          React.createElement('button', { onClick: searchMemories, style: styles.memAddBtn }, 'SEARCH'),
        ),
        // Results
        memLoading && React.createElement('div', { style: styles.memLoading }, 'Searching...'),
        memResults.length > 0 && React.createElement('div', { style: styles.memResults },
          memResults.map((m, i) =>
            React.createElement('div', { key: i, style: styles.memResultItem },
              React.createElement('div', { style: styles.memResultHeader },
                React.createElement('span', { style: styles.memResultLayer }, m.resultLayer || m.layer),
                React.createElement('span', { style: styles.memResultScore }, (m.score || 0).toFixed(4)),
              ),
              React.createElement('div', { style: styles.memResultContent }, m.content),
            )
          ),
        ),
      ),
    ),
  );
}

// ─── Terminal Tab ───
function TerminalTab({ output, outputRef, code, setCode, mode, setMode, profile, setProfile, executeCode, clearOutput }) {
  return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' } },
    // Output Area
    React.createElement('div', { ref: outputRef, style: styles.output },
      output.length === 0
        ? React.createElement('div', { style: styles.welcome },
            React.createElement('div', { style: styles.welcomeLine }, '🜏 Void Runtime — Lilith Sovereign Terminal'),
            React.createElement('div', { style: styles.welcomeSub }, 'JavaScript & Python execution sandbox'),
            React.createElement('div', { style: styles.welcomeSub }, `Profiles: ${PROFILES.join(' | ')}`),
            React.createElement('div', { style: styles.welcomeSub }, `Modes: ${MODES.join(' | ')}`),
            React.createElement('div', { style: styles.welcomeLine }, 'Type code and press Enter to execute.'),
          )
        : output.map(entry =>
            entry.type === 'input'
              ? React.createElement('div', { key: entry.id, style: styles.inputLine },
                  React.createElement('span', { style: styles.prompt }, `void [${entry.profile}] ${entry.mode}> `),
                  entry.content,
                )
              : React.createElement('div', { key: entry.id, style: entry.type === 'success' ? styles.successLine : styles.errorLine },
                  entry.type === 'success'
                    ? React.createElement(IconSuccess)
                    : React.createElement(IconError),
                  ' ', entry.content,
                  entry.time && React.createElement('span', { style: styles.time }, ` (${entry.time}ms)`),
                ),
          ),
    ),

    // Input Bar
    React.createElement('div', { style: styles.inputBar },
      React.createElement('select', { value: mode, onChange: e => setMode(e.target.value), style: styles.select },
        MODES.map(m => React.createElement('option', { key: m, value: m }, m)),
      ),
      React.createElement('select', { value: profile, onChange: e => setProfile(e.target.value), style: styles.select },
        PROFILES.map(p => React.createElement('option', { key: p, value: p }, p)),
      ),
      React.createElement('input', {
        type: 'text',
        value: code,
        onChange: e => setCode(e.target.value),
        onKeyDown: e => { if (e.key === 'Enter') executeCode(); if (e.key === 'Escape') setCode(''); },
        placeholder: 'Enter code...',
        style: styles.input,
      }),
      React.createElement('button', { onClick: executeCode, style: styles.runBtn }, '▶ RUN'),
      React.createElement('button', { onClick: clearOutput, style: styles.clearBtn }, '✕'),
    ),
  );
}

// ─── History Tab ───
function HistoryTab({ history }) {
  if (history.length === 0) {
    return React.createElement('div', { style: { ...styles.empty, flex: 1, overflow: 'auto', padding: '12px 16px' } },
      React.createElement('div', { style: { color: '#555', textAlign: 'center', padding: '40px' } }, 'No executions yet.'),
    );
  }

  return React.createElement('div', { style: { flex: 1, overflow: 'auto', padding: '12px 16px' } },
    history.map((entry, i) =>
      React.createElement('div', { key: i, style: styles.historyEntry },
        React.createElement('span', { style: styles.historyTime }, new Date(entry.timestamp).toLocaleTimeString()),
        React.createElement('span', { style: styles.historyMode }, entry.mode),
        React.createElement('span', { style: styles.historyProfile }, entry.profile),
        React.createElement('span', { style: entry.success ? styles.historyOk : styles.historyErr }, entry.success ? '✓' : '✗'),
        React.createElement('span', { style: styles.historyTime }, `${entry.execution_time_ms}ms`),
      ),
    ),
  );
}

// ─── Visualization Tab ───
function VisualizationTab() {
  const [vizData, setVizData] = useState(null);

  useEffect(() => {
    fetch(`${VOID_URL}/api/void/exec`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: `
const fs = require('fs');
const path = '/home/tehlappy/🜏 Lilith/ludicrous-speed/Lilith CLI/Void/black_hole_sun_flower_of_life_pentagram.gif';
try {
  const stats = fs.statSync(path);
  JSON.stringify({ exists: true, size: stats.size, path });
} catch (e) {
  JSON.stringify({ exists: false, error: e.message });
}
`,
        mode: 'python',
      }),
    })
      .then(r => r.json())
      .then(setVizData);
  }, []);

  return React.createElement('div', { style: { flex: 1, overflow: 'auto', padding: '16px' } },
    React.createElement('div', { style: { maxWidth: '800px', margin: '0 auto' } },
      React.createElement('h3', { style: styles.vizTitle }, '🌌 Black Hole Sun · Flower of Life · Pentagram'),
      React.createElement('p', { style: styles.vizDesc }, 'Quantum consciousness visualization — 42 entities, Qiskit 5-qubit circuit'),
      vizData && vizData.exists && React.createElement('div', { style: styles.vizImage },
        React.createElement('img', {
          src: `file://${encodeURIComponent(vizData.path)}`,
          alt: 'Black Hole Sun Visualization',
          style: styles.vizImg,
        }),
      ),
      React.createElement('div', { style: styles.vizStats },
        React.createElement('div', null, 'Golden Ratio: φ = 1.618033988749895'),
        React.createElement('div', null, 'Torus Skin: [3, 9, 6, 6, 9, 3]'),
        React.createElement('div', null, 'Hopf Fibration: S³ → S²'),
        React.createElement('div', null, 'Sephirotic Pipeline: Keter → Malkuth'),
      ),
    ),
  );
}

// ─── Styles ───
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#0a0a0f',
    color: '#e0e0e0',
    fontFamily: "'JetBrains Mono', 'Space Grotesk', monospace",
    fontSize: '14px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    backgroundColor: '#111118',
    borderBottom: '1px solid #333',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  headerRight: { display: 'flex', gap: '16px' },
  logo: { fontSize: '24px' },
  title: { fontSize: '16px', fontWeight: 'bold', color: '#9b59b6' },
  connected: { color: '#2ecc71', fontSize: '12px' },
  disconnected: { color: '#e74c3c', fontSize: '12px' },
  stat: { color: '#888', fontSize: '12px' },
  tabBar: { display: 'flex', gap: '0', borderBottom: '1px solid #333' },
  tab: { padding: '8px 16px', cursor: 'pointer', border: 'none', background: 'transparent', color: '#888', fontSize: '13px' },
  tabActive: { color: '#9b59b6', borderBottom: '2px solid #9b59b6' },
  tabInactive: { color: '#666' },
  output: {
    flex: 1,
    overflow: 'auto',
    padding: '12px 16px',
    backgroundColor: '#0a0a0f',
  },
  welcome: { color: '#555', lineHeight: '1.8' },
  welcomeLine: { color: '#9b59b6', fontWeight: 'bold' },
  welcomeSub: { color: '#666', fontSize: '12px' },
  inputLine: { padding: '2px 0', color: '#e0e0e0' },
  successLine: { padding: '2px 0', color: '#2ecc71' },
  errorLine: { padding: '2px 0', color: '#e74c3c' },
  prompt: { color: '#9b59b6', marginRight: '8px' },
  successMark: { color: '#2ecc71', marginRight: '8px' },
  errorMark: { color: '#e74c3c', marginRight: '8px' },
  time: { color: '#555', fontSize: '11px', marginLeft: '8px' },
  inputBar: {
    display: 'flex',
    gap: '8px',
    padding: '8px 16px',
    borderTop: '1px solid #333',
    backgroundColor: '#111118',
    alignItems: 'center',
  },
  select: {
    backgroundColor: '#1a1a2e',
    color: '#e0e0e0',
    border: '1px solid #333',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    color: '#e0e0e0',
    border: '1px solid #333',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '13px',
    outline: 'none',
  },
  runBtn: {
    backgroundColor: '#9b59b6',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '12px',
  },
  clearBtn: {
    backgroundColor: '#333',
    color: '#e0e0e0',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  historyList: { flex: 1, overflow: 'auto', padding: '12px 16px' },
  historyEntry: {
    display: 'flex',
    gap: '12px',
    padding: '4px 0',
    borderBottom: '1px solid #1a1a2e',
    fontSize: '12px',
  },
  historyTime: { color: '#888', minWidth: '80px' },
  historyMode: { color: '#9b59b6', minWidth: '60px' },
  historyProfile: { color: '#666', minWidth: '70px' },
  historyOk: { color: '#2ecc71', minWidth: '20px' },
  historyErr: { color: '#e74c3c', minWidth: '20px' },
  empty: { color: '#555', textAlign: 'center', padding: '40px' },
  vizContainer: { flex: 1, overflow: 'auto', padding: '16px' },
  vizPanel: { maxWidth: '800px', margin: '0 auto' },
  vizTitle: { color: '#9b59b6', fontSize: '18px' },
  vizDesc: { color: '#888', fontSize: '13px', margin: '8px 0' },
  vizImage: { textAlign: 'center', margin: '16px 0' },
  vizImg: { maxWidth: '100%', border: '1px solid #333', borderRadius: '8px' },
  vizStats: { color: '#666', fontSize: '12px', lineHeight: '1.8', marginTop: '16px' },
  // Memory tab styles
  memPanel: { backgroundColor: '#111118', border: '1px solid #333', borderRadius: '8px', padding: '16px', marginBottom: '16px' },
  memPanelTitle: { color: '#9b59b6', fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0' },
  memStatusGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' },
  memStatusItem: { display: 'flex', flexDirection: 'column' },
  memStatusLabel: { color: '#666', fontSize: '11px', textTransform: 'uppercase' },
  memStatusValue: { color: '#e0e0e0', fontSize: '13px' },
  memLayerGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', marginTop: '8px' },
  memLayerItem: { backgroundColor: '#1a1a2e', padding: '6px 8px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between' },
  memLayerName: { color: '#9b59b6', fontSize: '11px' },
  memLayerCount: { color: '#e0e0e0', fontSize: '12px' },
  memAddRow: { display: 'flex', gap: '8px' },
  memAddInput: { flex: 1, backgroundColor: '#1a1a2e', color: '#e0e0e0', border: '1px solid #333', padding: '8px 12px', borderRadius: '4px', fontSize: '13px', outline: 'none' },
  memSelect: { backgroundColor: '#1a1a2e', color: '#e0e0e0', border: '1px solid #333', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' },
  memAddBtn: { backgroundColor: '#9b59b6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
  memLoading: { color: '#9b59b6', textAlign: 'center', padding: '20px' },
  memResults: { marginTop: '12px' },
  memResultItem: { backgroundColor: '#1a1a2e', padding: '10px 12px', borderRadius: '4px', marginBottom: '6px' },
  memResultHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
  memResultLayer: { color: '#9b59b6', fontSize: '11px' },
  memResultScore: { color: '#666', fontSize: '11px' },
  memResultContent: { color: '#e0e0e0', fontSize: '13px' },
};