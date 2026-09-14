import React, { useState, useEffect, useCallback } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Code2,
  Settings,
  Activity,
  Zap,
  Shield,
  Clock,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import type { VoidStatus, VoidExecution, VoidExecutionHistory } from '../types';
import { fetchVoidStatus, executeVoid, fetchVoidHistory } from '../api';

interface VoidSectionProps {
  onRefresh: () => void;
}

const DEFAULT_CODE = [
  '// Void JS Runtime — Fleet Sandbox',
  '// Mode: eval | run | console | snapshot',
  '// Profile: no-net | ai-only | full',
  '',
  'console.log("Hello from the Void — Lilith\'s JS runtime.");',
  'console.log("Node:", process.version);',
  'console.log("Platform:", process.platform);',
  '',
].join('\n');

export const VoidSection: React.FC<VoidSectionProps> = ({ onRefresh }) => {
  const [status, setStatus] = useState<VoidStatus | null>(null);
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [mode, setMode] = useState<'eval' | 'run'>('eval');
  const [profile, setProfile] = useState<'no-net' | 'ai-only' | 'full'>('no-net');
  const [timeoutMs, setTimeoutMs] = useState<number>(15000);
  const [executing, setExecuting] = useState(false);
  const [result, setResult] = useState<VoidExecution | null>(null);
  const [history, setHistory] = useState<VoidExecutionHistory | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchVoidStatus();
      setStatus(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch void status');
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const data = await fetchVoidHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load void history:', err);
    }
  }, []);

  useEffect(() => {
    loadStatus();
    loadHistory();
    const interval = setInterval(loadStatus, 5000);
    return () => clearInterval(interval);
  }, [loadStatus, loadHistory]);

  const handleExecute = async () => {
    if (!code.trim()) return;
    setExecuting(true);
    setResult(null);
    setError(null);
    try {
      const data = await executeVoid({ code, mode, profile, timeout_ms: timeoutMs });
      setResult(data);
      loadHistory();
      loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setExecuting(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setResult(null);
    setError(null);
  };

  const handleCopyOutput = () => {
    if (result?.output) {
      navigator.clipboard.writeText(result.output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColor = status?.active_executions ? 'text-emerald-400' : 'text-slate-400';
  const statusBg = status?.active_executions ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-500/10 border-slate-500/20';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <Terminal className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Void Runtime</h2>
            <p className="text-xs text-slate-400 font-mono">Lilith&apos;s JS Execution Sandbox</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { loadStatus(); loadHistory(); onRefresh(); }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`p-3 rounded-xl border ${statusBg}`}>
          <div className="flex items-center gap-2 mb-1">
            <Activity className={`w-3 h-3 ${statusColor}`} />
            <span className="text-[10px] font-mono uppercase text-slate-500">Active</span>
          </div>
          <div className={`text-lg font-bold ${statusColor}`}>
            {status?.active_executions ?? '—'}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-mono uppercase text-slate-500">Queued</span>
          </div>
          <div className="text-lg font-bold text-slate-200">
            {status?.queued ?? '—'}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-mono uppercase text-slate-500">Max Concurrency</span>
          </div>
          <div className="text-lg font-bold text-slate-200">
            {status?.max_concurrent ?? '—'}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-mono uppercase text-slate-500">Profiles</span>
          </div>
          <div className="text-lg font-bold text-slate-200">
            {status?.profiles?.length ?? '—'}
          </div>
        </div>
      </div>

      {status?.runtime_root && (
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Code2 className="w-3 h-3" />
            <span>{status.runtime_root}</span>
          </div>
          {status.entry_point && (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mt-1">
              <Play className="w-3 h-3" />
              <span>{status.entry_point}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-500">MODE</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as 'eval' | 'run')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          >
            <option value="eval">eval</option>
            <option value="run">run</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-500">PROFILE</label>
          <select
            value={profile}
            onChange={(e) => setProfile(e.target.value as 'no-net' | 'ai-only' | 'full')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          >
            <option value="no-net">no-net</option>
            <option value="ai-only">ai-only</option>
            <option value="full">full</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-slate-500">TIMEOUT</label>
          <select
            value={timeoutMs}
            onChange={(e) => setTimeoutMs(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          >
            <option value={5000}>5s</option>
            <option value={15000}>15s</option>
            <option value={30000}>30s</option>
            <option value={60000}>60s</option>
          </select>
        </div>
        <div className="flex-1" />
        <button
          onClick={handleClear}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
        <button
          onClick={handleCopyCode}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          Copy
        </button>
        <button
          onClick={handleExecute}
          disabled={executing || !code.trim()}
          className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:text-slate-500 text-sm text-white font-medium transition-colors flex items-center gap-2"
        >
          {executing ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Executing...
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              Execute
            </>
          )}
        </button>
      </div>

      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-64 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-slate-200 focus:outline-none focus:border-violet-500 resize-none"
          placeholder="// Enter JavaScript code to execute in the Void..."
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-sm">Execution Error</div>
            <div className="text-xs font-mono mt-1">{error}</div>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              )}
              <span className="text-sm font-medium text-slate-200">
                {result.success ? 'Execution Successful' : 'Execution Failed'}
              </span>
              {result.execution_time_ms && (
                <span className="text-xs font-mono text-slate-500">
                  {result.execution_time_ms}ms
                </span>
              )}
            </div>
            <button
              onClick={handleCopyOutput}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          {result.output && (
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-64 overflow-y-auto">
              {result.output}
            </pre>
          )}
          {result.error && (
            <pre className="p-4 rounded-xl bg-red-950/40 border border-red-800/50 font-mono text-xs text-red-300 overflow-x-auto">
              {result.error}
            </pre>
          )}
        </div>
      )}

      <div className="border-t border-slate-800 pt-4">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Execution History ({history?.executions?.length ?? 0})
        </button>
        {showHistory && history?.executions && history.executions.length > 0 && (
          <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
            {history.executions.map((exec, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-900/40 border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {exec.success ? (
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                    )}
                    <span className="font-mono text-slate-500">{exec.mode}</span>
                    <span className="font-mono text-slate-500">{exec.profile}</span>
                  </div>
                  <span className="font-mono text-slate-600">
                    {exec.execution_time_ms}ms
                  </span>
                </div>
                {exec.output && (
                  <pre className="mt-2 text-[10px] font-mono text-slate-500 truncate">
                    {exec.output.split('\n')[0]}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
