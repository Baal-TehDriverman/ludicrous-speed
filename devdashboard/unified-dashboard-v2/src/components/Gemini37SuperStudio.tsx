import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Brain,
  Cpu,
  Terminal,
  Zap,
  BookOpen,
  GitBranch,
  Shield,
  Layers,
  Play,
  Copy,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Award,
  Sliders,
  Send,
  Code,
  Activity,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Flame,
  Binary
} from 'lucide-react';

interface ThinkingStep {
  step: number;
  title: string;
  durationMs: number;
  thoughtText: string;
  toolInvoked?: string;
  toolArgs?: any;
  status: 'completed' | 'in_progress' | 'pending';
}

interface SynthesisResult {
  explanation: string;
  synthesizedCode: string;
  unifiedDiff: string;
  unitTest: string;
  arxivGrounding: string;
  mathematicalComplexity: string;
  paretoFitness: number;
  executionMetrics: {
    thinkingTokens: number;
    outputTokens: number;
    totalLatencyMs: number;
    tokenSpeedTps: number;
  };
}

interface BenchmarkModel {
  modelId: string;
  name: string;
  tier: string;
  contextWindow: string;
  thinkingCapability: string;
  latency: string;
  codeScore: number;
  reasoningScore: number;
  privacyRating: string;
  strengths: string;
  sampleSnippet: string;
}

export const Gemini37SuperStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'thinking_studio' | 'model_arena' | 'tool_sandbox' | 'mesh_topology'>('thinking_studio');
  const [promptInput, setPromptInput] = useState('Synthesize autonomous recursive prompt evolution with DSPy + GEPA Pareto scoring');
  const [thoughtBudget, setThoughtBudget] = useState(8192);
  const [targetRepo, setTargetRepo] = useState('hermes-agent-self-evolution');
  const [targetFile, setTargetFile] = useState('evolution/gepa_optimizer.py');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedDiff, setCopiedDiff] = useState(false);
  const [activeInspectorTab, setActiveInspectorTab] = useState<'code' | 'diff' | 'test' | 'arxiv'>('code');

  // Synthesis output state
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [synthesisData, setSynthesisData] = useState<SynthesisResult | null>(null);

  // Model Arena state
  const [arenaChallenge, setArenaChallenge] = useState('Synthesize recursive self-reflection error trace buffer in DSPy');
  const [arenaResults, setArenaResults] = useState<BenchmarkModel[]>([]);
  const [isArenaLoading, setIsArenaLoading] = useState(false);

  // Tool Sandbox state
  const [activeTool, setActiveTool] = useState<string>('execute_bash');
  const [toolArgs, setToolArgs] = useState<string>('uname -a && lspci | grep -i nvidia');
  const [toolOutput, setToolOutput] = useState<any>(null);
  const [isToolExecuting, setIsToolExecuting] = useState(false);

  // Quick Preset Prompts
  const presets = [
    {
      title: 'DSPy + GEPA Prompt Evolution',
      repo: 'hermes-agent-self-evolution',
      file: 'evolution/gepa_optimizer.py',
      prompt: 'Synthesize recursive self-reflection error trace buffer with Pareto prompt mutation'
    },
    {
      title: 'Termux Git-Delta Mobile Mesh',
      repo: 'hermes-agent-termux',
      file: 'hermes_state_portability.py',
      prompt: 'Build zero-loss atomic delta serialization with zlib compression for OnePlus 6T/8T edge nodes'
    },
    {
      title: 'Speculative Decoding Router',
      repo: 'cosmos-3-quantized-nssp',
      file: 'inference/speculative_router.cpp',
      prompt: 'Build speculative verification router pairing 1B edge drafts with RTX 3060 CUDA verification'
    },
    {
      title: 'Cyberpunk Redscript Telemetry',
      repo: 'grand-theft-cyberpunk',
      file: 'scripts/lilith_telemetry.reds',
      prompt: 'Hook Cyberpunk player combat state and stream telemetry to Lilith Gateway port 8080'
    }
  ];

  const handleRunSynthesis = async () => {
    setIsSynthesizing(true);
    setThinkingSteps([
      {
        step: 1,
        title: 'Epistemic Formulation & Constraint Ingestion',
        durationMs: 320,
        thoughtText: `Ingesting task objectives for ${targetRepo}... Checking invariants on linux-zen kernel and Hermes-3:8B persona.`,
        status: 'in_progress'
      }
    ]);

    try {
      const res = await fetch('/api/gemini37/think-synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptInput,
          thoughtBudget,
          targetRepo,
          targetFile,
          selectedSkills: ['deep_reasoning', 'tool_calling', 'arxiv_grounding', 'gepa_mutation']
        })
      });

      const data = await res.json();
      if (data.success) {
        setThinkingSteps(data.thinkingSteps);
        setSynthesisData(data.finalResponse);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleRunArena = async () => {
    setIsArenaLoading(true);
    try {
      const res = await fetch('/api/gemini37/model-arena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challenge: arenaChallenge })
      });
      const data = await res.json();
      setArenaResults(data.benchmarks || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsArenaLoading(false);
    }
  };

  const handleExecuteTool = async (tName: string, tArgs: any) => {
    setIsToolExecuting(true);
    try {
      const res = await fetch('/api/gemini37/execute-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName: tName, args: tArgs })
      });
      const data = await res.json();
      setToolOutput(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsToolExecuting(false);
    }
  };

  // Initial loads
  useEffect(() => {
    handleRunSynthesis();
    handleRunArena();
    handleExecuteTool('execute_bash', { command: 'uname -a && nvidia-smi --query-gpu=name,driver_version,memory.total --format=csv,noheader' });
  }, []);

  return (
    <div id="gemini-37-super-studio" className="space-y-8 animate-fade-in">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-inner">
                <Sparkles className="w-3.5 h-3.5" />
                GEMINI 3.7 THINKING & REASONING ENGINE
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-purple-500/20 text-purple-300 border border-purple-400/40">
                <Brain className="w-3.5 h-3.5" />
                1,048,576 TOKEN CONTEXT
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                <Shield className="w-3.5 h-3.5" />
                SOVEREIGN AIR-GAP HYBRID
              </span>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white flex items-center gap-3 font-mono">
              Lilith Sovereign Agent & Reasoning Lab
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
              Unifying Gemini 3.7 Deep Chain-of-Thought with local sovereign LLMs (<code className="text-cyan-400">Hermes-3:8B</code>, <code className="text-purple-400">Qwen2.5-Coder:7B</code>, <code className="text-emerald-400">Gemma3:1B</code>). Conducts autonomous tool use, peer-reviewed arXiv grounding, and Genetic-Pareto prompt evolution across the NSSP distributed mesh.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleRunSynthesis}
              disabled={isSynthesizing}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSynthesizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Thinking & Synthesizing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Execute Thinking Cycle
                </>
              )}
            </button>
          </div>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('thinking_studio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'thinking_studio'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Brain className="w-4 h-4" />
            Thinking Studio & Code Synthesis
          </button>
          <button
            onClick={() => setActiveSubTab('model_arena')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'model_arena'
                ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            Model Arena (Gemini vs. Local LLMs)
          </button>
          <button
            onClick={() => setActiveSubTab('tool_sandbox')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'tool_sandbox'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Autonomous Tool Sandbox
          </button>
          <button
            onClick={() => setActiveSubTab('mesh_topology')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'mesh_topology'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            Interactive NSSP Mesh Topology
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: THINKING STUDIO & CODE SYNTHESIS */}
      {activeSubTab === 'thinking_studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Control Panel: Objective, Budget, Preset Targets */}
          <div className="lg:col-span-5 space-y-6">
            {/* Presets */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-cyan-400" />
                  Target Objective Presets
                </h3>
                <span className="text-xs text-slate-500 font-mono">Quick Select</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTargetRepo(p.repo);
                      setTargetFile(p.file);
                      setPromptInput(p.prompt);
                    }}
                    className={`p-3 rounded-xl text-left transition-all border ${
                      targetRepo === p.repo
                        ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-200'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{p.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {p.repo.split('-')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-1">{p.prompt}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt & Thought Budget Config */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                Thinking Configuration & Goal
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Active Synthesis Goal</label>
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:outline-none text-xs text-slate-200 resize-none font-mono"
                  placeholder="Describe code generation, AST patch, or prompt mutation goal..."
                />
              </div>

              {/* Target Repo & File */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400">Target Repository</label>
                  <input
                    type="text"
                    value={targetRepo}
                    onChange={(e) => setTargetRepo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-400">Target File</label>
                  <input
                    type="text"
                    value={targetFile}
                    onChange={(e) => setTargetFile(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-purple-300 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Thought Budget Slider */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Gemini 3.7 Thinking Budget:</span>
                  <span className="font-mono text-cyan-400 font-bold">{thoughtBudget.toLocaleString()} tokens</span>
                </div>
                <input
                  type="range"
                  min={1024}
                  max={32768}
                  step={1024}
                  value={thoughtBudget}
                  onChange={(e) => setThoughtBudget(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Fast (1k)</span>
                  <span>Balanced (8k)</span>
                  <span>Deep Reasoning (32k)</span>
                </div>
              </div>

              <button
                onClick={handleRunSynthesis}
                disabled={isSynthesizing}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSynthesizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Executing CoT Trace...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Synthesize Patch & Grounding
                  </>
                )}
              </button>
            </div>

            {/* Live Thinking Steps Accordion */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-400" />
                Live Chain-of-Thought Steps ({thinkingSteps.length})
              </h3>

              <div className="space-y-2.5">
                {thinkingSteps.map((step) => (
                  <div
                    key={step.step}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-bold flex items-center justify-center border border-cyan-400/40">
                          {step.step}
                        </span>
                        <span className="text-xs font-semibold text-slate-200">{step.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{step.durationMs}ms</span>
                    </div>

                    <p className="text-[11px] font-mono text-slate-400 whitespace-pre-line leading-relaxed pl-7">
                      {step.thoughtText}
                    </p>

                    {step.toolInvoked && (
                      <div className="ml-7 px-2.5 py-1 rounded bg-purple-950/40 border border-purple-800/50 flex items-center gap-2 text-[10px] font-mono text-purple-300">
                        <Terminal className="w-3 h-3 text-purple-400" />
                        <span>Tool Dispatched: <code className="text-purple-200 font-bold">{step.toolInvoked}</code></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Output Inspector: Code, Diff, Tests, ArXiv */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-2xl">
              {/* Inspector Header Tabs */}
              <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveInspectorTab('code')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                      activeInspectorTab === 'code'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    Synthesized Code
                  </button>
                  <button
                    onClick={() => setActiveInspectorTab('diff')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                      activeInspectorTab === 'diff'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <GitBranch className="w-3.5 h-3.5" />
                    Unified Patch
                  </button>
                  <button
                    onClick={() => setActiveInspectorTab('test')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                      activeInspectorTab === 'test'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Unit Test
                  </button>
                  <button
                    onClick={() => setActiveInspectorTab('arxiv')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                      activeInspectorTab === 'arxiv'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    arXiv Grounding
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {synthesisData && (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      Fitness: {(synthesisData.paretoFitness * 100).toFixed(1)}%
                    </span>
                  )}
                  <button
                    onClick={() => {
                      const textToCopy =
                        activeInspectorTab === 'code'
                          ? synthesisData?.synthesizedCode
                          : activeInspectorTab === 'diff'
                          ? synthesisData?.unifiedDiff
                          : activeInspectorTab === 'test'
                          ? synthesisData?.unitTest
                          : synthesisData?.arxivGrounding;
                      if (textToCopy) {
                        navigator.clipboard.writeText(textToCopy);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                    title="Copy Content"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Inspector Content Body */}
              <div className="p-5 font-mono text-xs overflow-x-auto min-h-[420px] max-h-[560px] bg-slate-950/95">
                {activeInspectorTab === 'code' && (
                  <pre className="text-cyan-300 whitespace-pre-wrap leading-relaxed">
                    {synthesisData?.synthesizedCode || '// Awaiting synthesis execution...'}
                  </pre>
                )}

                {activeInspectorTab === 'diff' && (
                  <pre className="whitespace-pre-wrap leading-relaxed">
                    {synthesisData?.unifiedDiff ? (
                      synthesisData.unifiedDiff.split('\n').map((line, idx) => {
                        let color = 'text-slate-400';
                        if (line.startsWith('+') && !line.startsWith('+++')) color = 'text-emerald-400 bg-emerald-950/30 px-1';
                        if (line.startsWith('-') && !line.startsWith('---')) color = 'text-red-400 bg-red-950/30 px-1';
                        if (line.startsWith('@@')) color = 'text-cyan-400 font-bold';
                        return <div key={idx} className={color}>{line}</div>;
                      })
                    ) : (
                      <span className="text-slate-500">// No diff generated yet</span>
                    )}
                  </pre>
                )}

                {activeInspectorTab === 'test' && (
                  <pre className="text-purple-300 whitespace-pre-wrap leading-relaxed">
                    {synthesisData?.unitTest || '// No unit test generated yet'}
                  </pre>
                )}

                {activeInspectorTab === 'arxiv' && (
                  <div className="space-y-4 font-sans text-slate-300">
                    <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 space-y-2">
                      <div className="flex items-center gap-2 text-amber-300 text-sm font-bold">
                        <BookOpen className="w-4 h-4" />
                        Mathematical Grounding & Literature Foundation
                      </div>
                      <p className="text-xs text-amber-200/90 leading-relaxed font-mono">
                        {synthesisData?.arxivGrounding}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="text-xs text-slate-400 font-mono">Complexity Formulation:</span>
                      <p className="text-sm font-mono text-cyan-400">
                        {synthesisData?.mathematicalComplexity || 'O(G * N log N)'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Execution Metrics Bar */}
              {synthesisData && (
                <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-4">
                  <span>Thinking Tokens: <strong className="text-cyan-400">{synthesisData.executionMetrics.thinkingTokens}</strong></span>
                  <span>Output Tokens: <strong className="text-purple-400">{synthesisData.executionMetrics.outputTokens}</strong></span>
                  <span>Latency: <strong className="text-emerald-400">{synthesisData.executionMetrics.totalLatencyMs}ms</strong></span>
                  <span>Throughput: <strong className="text-amber-400">{synthesisData.executionMetrics.tokenSpeedTps} tok/s</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MODEL ARENA */}
      {activeSubTab === 'model_arena' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  Sovereign Multi-Model Arena & Benchmark
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Side-by-side execution testing Gemini 3.7 Thinking vs. Local Ollama & Termux Edge nodes.
                </p>
              </div>

              <button
                onClick={handleRunArena}
                disabled={isArenaLoading}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isArenaLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                Re-Evaluate Arena
              </button>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={arenaChallenge}
                onChange={(e) => setArenaChallenge(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                placeholder="Arena challenge query..."
              />
            </div>
          </div>

          {/* Model Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {arenaResults.map((m) => (
              <div
                key={m.modelId}
                className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                      {m.tier}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{m.latency}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white">{m.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{m.strengths}</p>
                  </div>

                  {/* Benchmark Scores */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Reasoning Depth:</span>
                      <strong className="text-cyan-400 font-mono">{m.reasoningScore}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500" style={{ width: `${m.reasoningScore}%` }} />
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Code Precision:</span>
                      <strong className="text-purple-400 font-mono">{m.codeScore}%</strong>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${m.codeScore}%` }} />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400">
                    <div>Context: <strong className="text-slate-200">{m.contextWindow}</strong></div>
                    <div>Privacy: <strong className="text-emerald-400">{m.privacyRating}</strong></div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[10px] text-cyan-300/80 max-h-24 overflow-y-auto">
                  <pre>{m.sampleSnippet}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: AUTONOMOUS TOOL SANDBOX */}
      {activeSubTab === 'tool_sandbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Available Sovereign Tools
              </h3>

              <div className="space-y-2">
                {[
                  { id: 'execute_bash', name: 'execute_bash (Local OS)', cmd: 'uname -a && nvidia-smi --query-gpu=name,driver_version --format=csv' },
                  { id: 'compress_git_delta', name: 'compress_git_delta (NSSP Mesh)', cmd: 'serialize_delta --repo hermes-agent-termux --level 9' },
                  { id: 'run_dspy_gepa', name: 'run_dspy_gepa (Prompt Crucible)', cmd: 'gepa_eval --generations 4 --dataset sovereign_v2' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setActiveTool(t.id);
                      setToolArgs(t.cmd);
                      handleExecuteTool(t.id, { command: t.cmd });
                    }}
                    className={`w-full p-3 rounded-xl text-left transition-all border ${
                      activeTool === t.id
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{t.name}</div>
                    <div className="text-[10px] font-mono text-slate-500 truncate mt-1">{t.cmd}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Tool Execution Result: <code className="text-white">{activeTool}</code>
                </span>
                <button
                  onClick={() => handleExecuteTool(activeTool, { command: toolArgs })}
                  disabled={isToolExecuting}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isToolExecuting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  Re-Execute
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 max-h-96 overflow-y-auto leading-relaxed border border-slate-800">
                {toolOutput ? (
                  <pre className="whitespace-pre-wrap">{JSON.stringify(toolOutput, null, 2)}</pre>
                ) : (
                  <span className="text-slate-500">// Executing tool payload...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: INTERACTIVE MESH TOPOLOGY */}
      {activeSubTab === 'mesh_topology' && (
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-amber-400" />
                Lilith Distributed NSSP Mesh Topology
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Real-time data synchronization pathways between Workstation, Mobile Edge Nodes, and AI Cloud Studio.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
              ALL NODES SYNCHRONIZED
            </span>
          </div>

          {/* Interactive SVG Diagram */}
          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-center overflow-x-auto">
            <svg viewBox="0 0 800 360" className="w-full max-w-4xl text-slate-300 font-mono text-xs">
              {/* Connection Lines */}
              <line x1="400" y1="60" x2="200" y2="180" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
              <line x1="400" y1="60" x2="600" y2="180" stroke="#a855f7" strokeWidth="2" strokeDasharray="4,4" className="animate-pulse" />
              <line x1="200" y1="180" x2="400" y2="300" stroke="#10b981" strokeWidth="2" />
              <line x1="600" y1="180" x2="400" y2="300" stroke="#f59e0b" strokeWidth="2" />

              {/* Node 1: Gemini 3.7 Thinking Cloud */}
              <g transform="translate(400, 60)">
                <rect x="-120" y="-30" width="240" height="60" rx="12" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                <text x="0" y="-5" textAnchor="middle" fill="#38bdf8" fontWeight="bold" fontSize="13">GEMINI 3.7 FLASH THINKING</text>
                <text x="0" y="15" textAnchor="middle" fill="#94a3b8" fontSize="10">Deep CoT & arXiv Synthesizer</text>
              </g>

              {/* Node 2: Primary Host Workstation */}
              <g transform="translate(200, 180)">
                <rect x="-120" y="-35" width="240" height="70" rx="12" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                <text x="0" y="-12" textAnchor="middle" fill="#34d399" fontWeight="bold" fontSize="13">HOST PC (tehlappy)</text>
                <text x="0" y="8" textAnchor="middle" fill="#94a3b8" fontSize="10">linux-zen 7.1.4 | RTX 3060 DKMS</text>
                <text x="0" y="24" textAnchor="middle" fill="#06b6d4" fontSize="9">Hermes-3:8B + Qwen2.5-Coder:7B</text>
              </g>

              {/* Node 3: Mobile Edge Termux */}
              <g transform="translate(600, 180)">
                <rect x="-120" y="-35" width="240" height="70" rx="12" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
                <text x="0" y="-12" textAnchor="middle" fill="#c084fc" fontWeight="bold" fontSize="13">ONEPLUS 6T / 8T NODES</text>
                <text x="0" y="8" textAnchor="middle" fill="#94a3b8" fontSize="10">LineageOS 22.1 + Magisk Termux</text>
                <text x="0" y="24" textAnchor="middle" fill="#a855f7" fontSize="9">Gemma3:1B Speculative Drafts</text>
              </g>

              {/* Node 4: Lilith AI Gateway */}
              <g transform="translate(400, 300)">
                <rect x="-130" y="-30" width="260" height="60" rx="12" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <text x="0" y="-5" textAnchor="middle" fill="#fbbf24" fontWeight="bold" fontSize="13">LILITH GATEWAY & MSN MESH</text>
                <text x="0" y="15" textAnchor="middle" fill="#94a3b8" fontSize="10">Port 8080 (AI) / Port 8081 (Win-Bridge)</text>
              </g>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
