import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Code2,
  GitBranch,
  Terminal,
  Play,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  FileCode,
  Sparkles,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  BookOpen,
  FileText,
  X,
  Maximize2
} from 'lucide-react';
import {
  SelfDevTask,
  SelfDevSynthesisResult,
  GepaEvolutionResult,
  GitHubRawFile,
  LocalAgentStatus
} from '../types';
import {
  fetchSelfDevTasks,
  synthesizeSelfDevCode,
  runGepaCycle,
  fetchGitHubRawFile,
  fetchLocalAgentStatus
} from '../api';

const MODEL_OPTIONS = [
  { id: 'hermes-3:8b', name: 'Hermes-3:8B (Ollama Local)', desc: 'Self-evolution & recursive reflection persona', tag: 'SOVEREIGN LOCAL' },
  { id: 'qwen2.5-coder:7b', name: 'Qwen2.5-Coder:7B (RTX 3060)', desc: 'Optimized AST code generation & patch synthesis', tag: 'GPU ACCEL' },
  { id: 'gemma3:1b', name: 'Gemma3:1B (OnePlus Termux Edge)', desc: 'Ultra-low latency draft generation on mobile edge', tag: 'EDGE MESH' },
  { id: 'gemini-3.7-flash', name: 'Gemini-3.7-Flash (Cloud Reasoning)', desc: 'High-dimensional arXiv reasoning & cross-referencing', tag: 'CLOUD HYBRID' }
];

export const SelfDevMetaStudio: React.FC = () => {
  const [tasks, setTasks] = useState<SelfDevTask[]>([]);
  const [selectedTask, setSelectedTask] = useState<SelfDevTask | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('hermes-3:8b');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  
  // Synthesis state
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisResult, setSynthesisResult] = useState<SelfDevSynthesisResult | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<'diff' | 'code' | 'test' | 'arxiv'>('diff');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // GEPA Evolution loop state
  const [isEvolvingGepa, setIsEvolvingGepa] = useState(false);
  const [gepaResult, setGepaResult] = useState<GepaEvolutionResult | null>(null);
  const [evolutionSkill, setEvolutionSkill] = useState('tool_use_precision_asshole_mode');

  // Raw GitHub File Viewer
  const [rawFileModal, setRawFileModal] = useState<GitHubRawFile | null>(null);
  const [isLoadingRawFile, setIsLoadingRawFile] = useState(false);
  const [rawFileError, setRawFileError] = useState<string | null>(null);

  // Local agent telemetry
  const [agentStatus, setAgentStatus] = useState<LocalAgentStatus | null>(null);

  useEffect(() => {
    loadTasks();
    loadAgentTelemetry();
  }, []);

  const loadTasks = async () => {
    try {
      const res = await fetchSelfDevTasks();
      setTasks(res.tasks || []);
      if (res.tasks && res.tasks.length > 0) {
        setSelectedTask(res.tasks[0]);
      }
    } catch (err) {
      console.error('Failed to load self dev tasks:', err);
    }
  };

  const loadAgentTelemetry = async () => {
    try {
      const status = await fetchLocalAgentStatus();
      setAgentStatus(status);
    } catch (err) {
      console.error('Failed to load agent status:', err);
    }
  };

  const handleSynthesize = async () => {
    if (!selectedTask) return;
    setIsSynthesizing(true);
    try {
      const res = await synthesizeSelfDevCode({
        taskTitle: selectedTask.title,
        targetRepo: selectedTask.repo,
        targetFile: selectedTask.targetFile,
        prompt: customPrompt || selectedTask.description,
        modelType: selectedModel,
        arxivRef: selectedTask.arxivRef
      });
      setSynthesisResult(res);
      setActiveResultTab('diff');
    } catch (err) {
      console.error('Synthesis failed:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleRunGepa = async () => {
    setIsEvolvingGepa(true);
    try {
      const res = await runGepaCycle(evolutionSkill, 4);
      setGepaResult(res);
    } catch (err) {
      console.error('GEPA evolution run failed:', err);
    } finally {
      setIsEvolvingGepa(false);
    }
  };

  const inspectRepoFile = async (repo: string, filePath: string) => {
    setIsLoadingRawFile(true);
    setRawFileError(null);
    try {
      const data = await fetchGitHubRawFile(repo, filePath);
      setRawFileModal(data);
    } catch (err: any) {
      setRawFileError(`Failed to load ${repo}/${filePath}: ${err.message}`);
    } finally {
      setIsLoadingRawFile(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Self-Evolution Command */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-purple-950 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              SELF-EVOLUTION ENGINE
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono">
              "USE THE APP TO DEVELOP THE APP"
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              DSPy + GEPA + DARWINIAN EVOLVER
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Autonomous Self-Development &amp; Code Synthesis Studio
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Dispatch self-directed development objectives to local sovereign models (Ollama <code className="text-purple-300 font-mono text-xs">hermes-3:8b</code>, RTX 3060 <code className="text-cyan-300 font-mono text-xs">qwen2.5-coder:7b</code>, OnePlus edge <code className="text-emerald-300 font-mono text-xs">gemma3:1b</code>). Synthesize patch diffs, evaluate multi-generation prompt fitness, and commit updates to your Git mesh.
          </p>
        </div>
      </div>

      {/* Main Grid: Task Pipeline + Model Selector + Synthesis Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Preset Evolution Objectives & Code Inspect (4 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Target Repos &amp; Evolution Objectives</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">
              {tasks.length} Available Modules
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => {
              const isSelected = selectedTask?.id === task.id;
              return (
                <motion.div
                  key={task.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => {
                    setSelectedTask(task);
                    setCustomPrompt(task.description);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-950/40 ring-1 ring-purple-500/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-purple-300 text-[10px] font-mono font-bold">
                      {task.repo}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 text-[10px] font-mono">
                      {task.complexity} Complexity
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">
                    {task.title}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                    <span className="text-indigo-300 text-[10px]">
                      {task.arxivRef}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        inspectRepoFile(task.repo, task.targetFile);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition-colors"
                    >
                      <FileCode className="w-3 h-3 text-cyan-400" />
                      <span>Inspect Raw File</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Raw File Shortcuts to inspect codebase */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Direct GitHub File Inspector</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-xs font-mono">
              <button
                onClick={() => inspectRepoFile('hermes-agent-self-evolution', 'PLAN.md')}
                className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-purple-300 border border-slate-800 transition-colors"
              >
                PLAN.md
              </button>
              <button
                onClick={() => inspectRepoFile('hermes-agent-self-evolution', 'README.md')}
                className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-purple-300 border border-slate-800 transition-colors"
              >
                README.md
              </button>
              <button
                onClick={() => inspectRepoFile('hermes-agent-self-evolution-asshole', 'soul.md')}
                className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-purple-300 border border-slate-800 transition-colors"
              >
                soul.md
              </button>
              <button
                onClick={() => inspectRepoFile('lilith-nssp-mesh', 'NSSP_INTEGRATION_MAP.md')}
                className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-colors"
              >
                NSSP_MAP.md
              </button>
              <button
                onClick={() => inspectRepoFile('lilith-nssp-mesh', 'TASK_FLOW.md')}
                className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-cyan-300 border border-slate-800 transition-colors"
              >
                TASK_FLOW.md
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Active Model Dispatcher + Synthesis Workspace (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Model Selector Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Agent Execution Model</span>
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">
                Ollama Daemon: {agentStatus?.ollama.online ? 'Online (11434)' : 'Standby / Fallback'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MODEL_OPTIONS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModel(m.id)}
                  className={`p-3 rounded-xl border text-left font-mono transition-all space-y-1 ${
                    selectedModel === m.id
                      ? 'bg-purple-950/60 border-purple-500 text-white shadow-md ring-1 ring-purple-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{m.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300">
                      {m.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt & Dispatch Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-mono text-slate-300">
                Target File:{' '}
                <strong className="text-purple-300 font-mono">
                  {selectedTask?.repo}/{selectedTask?.targetFile}
                </strong>
              </div>
              <span className="text-[11px] font-mono text-indigo-400">
                {selectedTask?.arxivRef}
              </span>
            </div>

            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Specify the evolution instructions, constraint bounds, or feature to develop..."
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-[11px] font-mono text-slate-500">
                Press synthesize to run sovereign code generation &amp; patch diffing.
              </span>

              <button
                onClick={handleSynthesize}
                disabled={isSynthesizing || !selectedTask}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-purple-900/30 flex items-center gap-2 disabled:opacity-50"
              >
                {isSynthesizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Evolution...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Synthesize Code &amp; Diff</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Synthesis Output & Interactive Diff Viewer */}
          {synthesisResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-4 shadow-xl"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">
                      FITNESS SCORE: {(synthesisResult.fitnessScore * 100).toFixed(0)}%
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-mono">
                      {synthesisResult.modelUsed}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-semibold pt-1">
                    {synthesisResult.explanation}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800">
                    Latency: {synthesisResult.executionMetrics.latencyMs}ms
                  </span>
                  <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                    Token Eff: {synthesisResult.executionMetrics.tokenEfficiency}
                  </span>
                </div>
              </div>

              {/* Result Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveResultTab('diff')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    activeResultTab === 'diff'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <GitBranch className="w-3 h-3" />
                  <span>UNIFIED DIFF</span>
                </button>
                <button
                  onClick={() => setActiveResultTab('code')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    activeResultTab === 'code'
                      ? 'bg-cyan-600 text-slate-950 shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3 h-3" />
                  <span>SYNTHESIZED CODE</span>
                </button>
                <button
                  onClick={() => setActiveResultTab('test')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    activeResultTab === 'test'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                  <span>UNIT TEST</span>
                </button>
                <button
                  onClick={() => setActiveResultTab('arxiv')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                    activeResultTab === 'arxiv'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3 h-3" />
                  <span>ARXIV GROUNDING</span>
                </button>
              </div>

              {/* Result Content */}
              <div className="relative">
                {activeResultTab === 'diff' && (
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-72 leading-relaxed">
                    {synthesisResult.diff}
                  </pre>
                )}

                {activeResultTab === 'code' && (
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-72 leading-relaxed">
                    {synthesisResult.code}
                  </pre>
                )}

                {activeResultTab === 'test' && (
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto max-h-72 leading-relaxed">
                    {synthesisResult.unitTest}
                  </pre>
                )}

                {activeResultTab === 'arxiv' && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed space-y-2">
                    <div className="text-indigo-400 font-bold">
                      Theoretical Framework Grounding:
                    </div>
                    <p>{synthesisResult.arxivGrounding}</p>
                  </div>
                )}

                <button
                  onClick={() =>
                    copyToClipboard(
                      activeResultTab === 'diff'
                        ? synthesisResult.diff
                        : activeResultTab === 'code'
                        ? synthesisResult.code
                        : activeResultTab === 'test'
                        ? synthesisResult.unitTest
                        : synthesisResult.arxivGrounding,
                      activeResultTab
                    )
                  }
                  className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-mono flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  {copiedKey === activeResultTab ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* GEPA Multi-Generation Prompt Evolution Simulator */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span>GEPA Genetic Prompt Evolution Crucible (Asshole Mode)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Genetic-Pareto Prompt Evolution loop with adversarial contradiction injection.
                </p>
              </div>

              <button
                onClick={handleRunGepa}
                disabled={isEvolvingGepa}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-purple-900/30 flex items-center gap-1.5 disabled:opacity-50"
              >
                {isEvolvingGepa ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                <span>Run 4-Gen GEPA Loop</span>
              </button>
            </div>

            {gepaResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3 pt-2"
              >
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Baseline Fitness:</span>
                    <strong className="text-slate-300">{(gepaResult.baselineFitness * 100).toFixed(0)}%</strong>
                    <ArrowRight className="w-3 h-3 text-purple-400" />
                    <span className="text-slate-400">Final Fitness:</span>
                    <strong className="text-emerald-400">{(gepaResult.finalFitness * 100).toFixed(0)}%</strong>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold text-[10px]">
                    {gepaResult.improvementPct} Gain
                  </span>
                </div>

                <div className="space-y-2">
                  {gepaResult.generations.map((g) => (
                    <div
                      key={g.generation}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-purple-300">
                          Gen #{g.generation}: {g.strategy}
                        </div>
                        <div className="text-[11px] text-slate-400">{g.mutationDiff}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-bold">
                          {(g.fitnessScore * 100).toFixed(0)}%
                        </span>
                        <div className="text-[10px] text-slate-500">{g.passedCases} cases</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Raw File Modal */}
      <AnimatePresence>
        {rawFileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-4xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
                    {rawFileModal.repo}
                  </span>
                  <span className="text-sm font-mono text-slate-200">
                    /{rawFileModal.path}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    ({rawFileModal.branch} branch)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(rawFileModal.content, 'modal-raw')}
                    className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'modal-raw' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'modal-raw' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={() => setRawFileModal(null)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 overflow-y-auto bg-slate-950">
                <pre className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {rawFileModal.content}
                </pre>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Raw File Loading Spinner */}
      {isLoadingRawFile && (
        <div className="fixed bottom-6 right-6 z-50 p-3 rounded-xl bg-slate-900 border border-purple-500 text-purple-300 text-xs font-mono flex items-center gap-2 shadow-2xl">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Fetching raw source from GitHub...</span>
        </div>
      )}
    </div>
  );
};
