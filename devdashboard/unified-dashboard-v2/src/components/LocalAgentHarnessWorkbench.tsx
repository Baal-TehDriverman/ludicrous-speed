import React, { useState, useEffect } from 'react';
import { 
  Cpu, Play, CheckCircle2, Zap, Terminal, Activity, 
  Layers, HardDrive, Sparkles, Copy, RefreshCw, BarChart3,
  Flame, ShieldAlert, Sliders, Smartphone, AlertCircle
} from 'lucide-react';

interface HarnessModel {
  id: string;
  name: string;
  architecture: string;
  parameters: string;
  quantization: string;
  contextWindow: number;
  vramRequired: string;
  throughput: string;
  optimalHardware: string;
  benchmarkScores: {
    codeEval: string;
    astReasoning: string;
    toolCallReliability: string;
    latencyToFirstToken: string;
  };
  recommendedTasks: string[];
}

interface BenchmarkResult {
  latencyMs: number;
  tokensPerSecond: number;
  tokensGenerated: number;
  vramConsumedMB: number;
  gpuTempCelsius: number;
  cudaCoreUtilizationPct: number;
}

export const LocalAgentHarnessWorkbench: React.FC = () => {
  const [models, setModels] = useState<HarnessModel[]>([]);
  const [selectedModelId, setSelectedModelId] = useState<string>('gemma-4-e4b');
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  
  // Benchmark state
  const [isRunningBench, setIsRunningBench] = useState(false);
  const [benchTaskType, setBenchTaskType] = useState<string>('code-synthesis');
  const [benchOutput, setBenchOutput] = useState<string | null>(null);
  const [benchTelemetry, setBenchTelemetry] = useState<BenchmarkResult | null>(null);
  const [copiedOutput, setCopiedOutput] = useState(false);

  // Harness parameters
  const [contextLength, setContextLength] = useState<number>(32768);
  const [quantFormat, setQuantFormat] = useState<string>('Q4_K_M');
  const [gpuOffloadLayers, setGpuOffloadLayers] = useState<number>(99);
  const [speculativeDrafting, setSpeculativeDrafting] = useState<boolean>(true);

  const fetchHarnessData = async () => {
    setIsLoadingModels(true);
    try {
      const res = await fetch('/api/local-harness/models');
      if (res.ok) {
        const data = await res.json();
        setModels(data.availableModels || []);
      }
    } catch (e) {
      console.error('Failed to load local harness models:', e);
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchHarnessData();
  }, []);

  const activeModel = models.find(m => m.id === selectedModelId) || models[0];

  const handleRunHarnessBenchmark = async () => {
    setIsRunningBench(true);
    setBenchOutput(null);
    setBenchTelemetry(null);

    try {
      const res = await fetch('/api/local-harness/run-benchmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: selectedModelId,
          taskType: benchTaskType,
          testPrompt: `Run local agent harness test for ${selectedModelId}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setBenchTelemetry(data.telemetry);
        setBenchOutput(data.output);
      }
    } catch (e) {
      console.error('Harness execution failed:', e);
    } finally {
      setIsRunningBench(false);
    }
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOutput(true);
    setTimeout(() => setCopiedOutput(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950/70 to-indigo-950/80 border border-purple-800/50 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border border-purple-400/40 shadow-xl shadow-purple-950/60">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Local Agent Model Harness Bench
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-950 border border-purple-700/60 text-purple-300">
                  Gemma 4 e4b • Qwen 3.8B • Hermes 3
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1">
                Zero-cloud local inference harness, quantized model profiling (GGUF Q4_K_M / AWQ), and speculative drafting pipelines for sub-4B weight class agents on RTX 3060 CUDA and HyperDroid Termux nodes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchHarnessData}
              disabled={isLoadingModels}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-800/60 text-purple-300 text-xs font-mono font-bold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingModels ? 'animate-spin' : ''}`} />
              Reload Profiles
            </button>
          </div>
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {models.map((model) => {
          const isSelected = model.id === selectedModelId;
          return (
            <button
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-purple-950/90 to-slate-900 border-purple-500/80 shadow-lg shadow-purple-950/50 ring-2 ring-purple-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-purple-800/60 hover:bg-slate-900/90'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400">{model.parameters}</span>
                  <h3 className="font-bold text-white text-sm mt-0.5">{model.name}</h3>
                </div>
                <div className={`p-1.5 rounded-lg text-xs font-mono ${
                  isSelected ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  <Zap className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1 text-[11px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Throughput:</span>
                  <span className="text-emerald-400 font-bold">{model.throughput}</span>
                </div>
                <div className="flex justify-between">
                  <span>VRAM Target:</span>
                  <span className="text-amber-300">{model.vramRequired}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep Model Inspector & Execution Sandbox */}
      {activeModel && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Model Specs & Benchmarks (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl bg-slate-900/80 border border-purple-900/40 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-bold text-white text-sm">Harness Profile: {activeModel.name}</h3>
                </div>
                <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/50 px-2 py-0.5 rounded">
                  {activeModel.quantization}
                </span>
              </div>

              {/* Hardware Spec Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Architecture</div>
                  <div className="text-white font-bold mt-0.5 truncate">{activeModel.architecture}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Context Window</div>
                  <div className="text-cyan-400 font-bold mt-0.5">{activeModel.contextWindow.toLocaleString()} tokens</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">VRAM Footprint</div>
                  <div className="text-amber-400 font-bold mt-0.5">{activeModel.vramRequired}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">TTFT (First Token)</div>
                  <div className="text-emerald-400 font-bold mt-0.5">{activeModel.benchmarkScores.latencyToFirstToken}</div>
                </div>
              </div>

              {/* Benchmark Radar Summary */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-mono text-slate-400 font-bold flex items-center justify-between">
                  <span>Harness Benchmark Scores:</span>
                  <span className="text-purple-400">tehlappy (RTX 3060) Tested</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Code Synthesis (HumanEval+):</span>
                      <span className="text-cyan-300 font-bold">{activeModel.benchmarkScores.codeEval}</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: activeModel.benchmarkScores.codeEval }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>AST Reasoning & Math:</span>
                      <span className="text-purple-300 font-bold">{activeModel.benchmarkScores.astReasoning}</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: activeModel.benchmarkScores.astReasoning }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>Structured Tool Call Reliability:</span>
                      <span className="text-emerald-300 font-bold">{activeModel.benchmarkScores.toolCallReliability}</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: activeModel.benchmarkScores.toolCallReliability }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Task Chips */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">Optimal Agent Task Affinities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeModel.recommendedTasks.map((task, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-purple-950/60 text-purple-300 border border-purple-800/40">
                      {task}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hardware Target Recommendation */}
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/30 text-xs font-mono text-purple-300">
                <span className="text-slate-400 font-bold">Target Device:</span> {activeModel.optimalHardware}
              </div>
            </div>

            {/* Harness Configurator */}
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-bold">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>Runtime Acceleration & Flags</span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Speculative Drafting:</span>
                  <button
                    onClick={() => setSpeculativeDrafting(!speculativeDrafting)}
                    className={`px-3 py-1 rounded-lg border transition-all ${
                      speculativeDrafting 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold' 
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    {speculativeDrafting ? 'ENABLED (Gemma 4 -> Qwen 3.8)' : 'DISABLED'}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">GPU Offload Layers:</span>
                  <span className="text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {gpuOffloadLayers} / 99 (All CUDA)
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Linux-Zen RT Scheduler:</span>
                  <span className="text-emerald-400 font-bold">ZERO-COPY RING BUFFER</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Execution Harness & Real-time Telemetry (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl bg-slate-900/80 border border-purple-900/40 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <h3 className="font-bold text-white text-sm">Harness Sandbox Execution</h3>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={benchTaskType}
                    onChange={(e) => setBenchTaskType(e.target.value)}
                    className="bg-slate-950 border border-purple-900/60 rounded-lg px-2.5 py-1 text-xs font-mono text-white focus:outline-none"
                  >
                    <option value="code-synthesis">Task: Code Synthesis (AST Injection)</option>
                    <option value="dspy-evolution">Task: DSPy GEPA Prompt Evolution</option>
                    <option value="speculative-verify">Task: Speculative Verification Loop</option>
                  </select>

                  <button
                    onClick={handleRunHarnessBenchmark}
                    disabled={isRunningBench}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-purple-950/60 disabled:opacity-50"
                  >
                    <Play className={`w-3.5 h-3.5 ${isRunningBench ? 'animate-spin' : ''}`} />
                    {isRunningBench ? 'Evaluating...' : 'Run Harness Test'}
                  </button>
                </div>
              </div>

              {/* Telemetry Result HUD */}
              {benchTelemetry ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                    <div className="text-[10px] text-slate-500">Inference Speed</div>
                    <div className="text-lg font-black text-emerald-400 mt-0.5">{benchTelemetry.tokensPerSecond} tok/s</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                    <div className="text-[10px] text-slate-500">Total Latency</div>
                    <div className="text-lg font-black text-cyan-400 mt-0.5">{benchTelemetry.latencyMs} ms</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                    <div className="text-[10px] text-slate-500">VRAM Occupied</div>
                    <div className="text-lg font-black text-amber-400 mt-0.5">{benchTelemetry.vramConsumedMB} MB</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                    <div className="text-[10px] text-slate-500">CUDA Core Util</div>
                    <div className="text-lg font-black text-purple-400 mt-0.5">{benchTelemetry.cudaCoreUtilizationPct}%</div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-dashed border-slate-800 text-center text-xs font-mono text-slate-500">
                  Click <span className="text-purple-400 font-bold">Run Harness Test</span> to benchmark <span className="text-white">{activeModel.name}</span> on local hardware.
                </div>
              )}

              {/* Live Output Stream */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Harness Code AST Synthesis Output:</span>
                  {benchOutput && (
                    <button
                      onClick={() => copyCode(benchOutput)}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                      {copiedOutput ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedOutput ? 'Copied' : 'Copy Code'}
                    </button>
                  )}
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto min-h-[220px]">
                  {isRunningBench ? (
                    <div className="flex items-center gap-2 text-purple-400">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                      <span>Streaming local tokens via {activeModel.name} on RTX 3060 CUDA...</span>
                    </div>
                  ) : benchOutput ? (
                    <pre className="text-cyan-300 leading-relaxed">{benchOutput}</pre>
                  ) : (
                    <div className="text-slate-600 italic">
                      // Local agent output buffer ready.
                      // Quantization: {activeModel.quantization}
                      // Ready to execute zero-shot AST transforms or prompt evolution mutations.
                    </div>
                  )}
                </div>
              </div>

              {/* CLI Command Helper for Local Setup */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-purple-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="text-purple-300 font-bold">Direct Ollama / llama.cpp CLI Deployment:</span>
                </div>
                <div className="p-2.5 rounded-lg bg-black/80 font-mono text-xs text-emerald-400 border border-slate-800 flex items-center justify-between overflow-x-auto">
                  <code>
                    {selectedModelId === 'gemma-4-e4b' 
                      ? 'ollama run gemma-4-e4b:instruct --gpu-layers 99'
                      : selectedModelId === 'qwen-3.8b-coder'
                      ? 'ollama run qwen-3.8b-coder:q5_k_m --ctx-size 65536'
                      : 'ollama run hermes-3:8b'}
                  </code>
                  <button
                    onClick={() => copyCode(
                      selectedModelId === 'gemma-4-e4b' 
                        ? 'ollama run gemma-4-e4b:instruct --gpu-layers 99'
                        : selectedModelId === 'qwen-3.8b-coder'
                        ? 'ollama run qwen-3.8b-coder:q5_k_m --ctx-size 65536'
                        : 'ollama run hermes-3:8b'
                    )}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white shrink-0 ml-2"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};
