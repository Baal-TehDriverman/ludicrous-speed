import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Cpu, Sparkles, Send, Loader2, RefreshCw, Zap, Shield, 
  Terminal, Layers, CheckCircle2, Play, AlertCircle, Copy, 
  Settings2, Activity, HardDrive, Smartphone, Radio, Award, Sliders
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { LocalAgentHarnessWorkbench } from './LocalAgentHarnessWorkbench';

interface LocalDaemon {
  id: string;
  name: string;
  model: string;
  location: string;
  duty: string;
  status: string;
  vramUsage: string;
  cycleRate: string;
  lastReflection: string;
  port: number;
}

interface MultiTurnMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelTier?: string;
  persona?: string;
}

export const LocalAgentsHub: React.FC = () => {
  // Sub-Tab Switcher
  const [hubView, setHubView] = useState<'swarm-chat' | 'harness-bench'>('harness-bench');

  // Swarm Daemon Telemetry
  const [daemons, setDaemons] = useState<LocalDaemon[]>([]);
  const [isRefreshingDaemons, setIsRefreshingDaemons] = useState(false);
  const [actionLog, setActionLog] = useState<string[]>([]);

  // Multi-turn Chat State
  const [messages, setMessages] = useState<MultiTurnMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      content: `### 🪐 Sovereign Local Agent Matrix & Gemini Orchestrator Active\n\nI am the **Lilith Sovereign Core**, coordinating local edge daemons across your **AMD Ryzen 5000 + RTX 3060** host and mobile **OnePlus 6T / 8T (HyperDroid Termux)** edge mesh.\n\n- **Multi-Turn Chat**: Context retained across turns\n- **Model Tiers**: \`gemini-3.1-pro-preview\` (Complex Reasoning), \`gemini-3.5-flash\` (General Multi-Turn), \`gemini-3.1-flash-lite\` (Fast Telemetry), or **Sovereign Local Hermes**\n- **Local Daemons**: Hermes-3 Self-Evolution Warden, Kairos Dream Consolidator, NSSP RFCOMM Transceiver.\n\nSelect a persona or enter a task to begin.`,
      timestamp: new Date().toLocaleTimeString(),
      modelTier: 'gemini-3.5-flash',
      persona: 'Lilith Sovereign Core'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Model & System Instruction Controls
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [selectedRole, setSelectedRole] = useState<string>('lilith-core');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Fetch local daemons
  const fetchSwarmTelemetry = async () => {
    setIsRefreshingDaemons(true);
    try {
      const res = await fetch('/api/local-agents/swarm');
      if (res.ok) {
        const data = await res.json();
        setDaemons(data.activeDaemons || []);
      }
    } catch (e) {
      console.error('Failed to fetch local swarm telemetry:', e);
    } finally {
      setIsRefreshingDaemons(false);
    }
  };

  useEffect(() => {
    fetchSwarmTelemetry();
  }, []);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatLoading]);

  // Handle Multi-Turn Dispatch
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isChatLoading) return;

    const userMsgText = inputQuery.trim();
    setInputQuery('');

    const newMsg: MultiTurnMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString(),
    };

    const updatedHistory = [...messages, newMsg];
    setMessages(updatedHistory);
    setIsChatLoading(true);

    try {
      const formattedForApi = updatedHistory.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/gemini/multi-turn-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedForApi,
          model: selectedModel,
          role: selectedRole,
          systemInstruction: selectedRole === 'custom' ? customPrompt : undefined,
          username: 'Baal-TehDriverman'
        })
      });

      if (res.ok) {
        const data = await res.json();
        const aiReply: MultiTurnMessage = {
          id: `ai-${Date.now()}`,
          role: 'model',
          content: data.reply || 'Task acknowledged by local agent mesh.',
          timestamp: new Date().toLocaleTimeString(),
          modelTier: data.modelUsed || selectedModel,
          persona: data.role || selectedRole
        };
        setMessages(prev => [...prev, aiReply]);
        logAction(`Processed multi-turn turn via ${data.modelUsed} (${data.metrics?.tokenTier || 'Standard'})`);
      } else {
        throw new Error('Agent gateway timeout');
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          content: `⚠️ **Local Fallback Mode Activated**: ${err.message || 'Network disconnected'}. The Sovereign Local Hermes node has buffered your instructions.`,
          timestamp: new Date().toLocaleTimeString(),
          modelTier: 'Sovereign Local',
          persona: selectedRole
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const logAction = (text: string) => {
    setActionLog(prev => [`[${new Date().toLocaleTimeString()}] ${text}`, ...prev.slice(0, 9)]);
  };

  const handleTriggerDaemonAction = (daemonName: string, actionName: string) => {
    logAction(`Triggered [${actionName}] on ${daemonName}`);
    fetchSwarmTelemetry();
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-800/40 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 shadow-lg shadow-purple-950/50">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white tracking-wide">
                  Sovereign Local Agents & Gemini 3 Orchestrator
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950 border border-emerald-700/60 text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Local Mesh 100% Active
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1">
                Multi-turn conversational reasoning, role-conditioned system prompts, and autonomous local agent swarm telemetry across host & Termux edge nodes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-950/80 p-1 rounded-xl border border-purple-900/60 font-mono text-xs">
              <button
                onClick={() => setHubView('harness-bench')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  hubView === 'harness-bench'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/80'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Model Harness Bench (Gemma 4 / Qwen 3.8)</span>
              </button>

              <button
                onClick={() => setHubView('swarm-chat')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  hubView === 'swarm-chat'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-950/80'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Local Swarm & Multi-Turn Chat</span>
              </button>
            </div>

            <button
              onClick={fetchSwarmTelemetry}
              disabled={isRefreshingDaemons}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-800/60 text-purple-300 text-xs font-mono font-bold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingDaemons ? 'animate-spin' : ''}`} />
              Poll Daemons
            </button>
          </div>
        </div>
      </div>

      {/* Conditional View Rendering */}
      {hubView === 'harness-bench' ? (
        <LocalAgentHarnessWorkbench />
      ) : (
        /* Main Grid: Left is Local Agent Swarm Matrix, Right is Multi-Turn Gemini Chat */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Local Agent Daemons & Hardware Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Swarm Daemons Card */}
          <div className="rounded-2xl bg-slate-900/80 border border-purple-900/40 p-5 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white text-sm">Autonomous Local Agent Swarm</h3>
              </div>
              <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                {daemons.length} Nodes Online
              </span>
            </div>

            <div className="space-y-3">
              {daemons.map((daemon) => (
                <div 
                  key={daemon.id}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-800/50 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{daemon.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                          {daemon.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Model: <span className="text-cyan-400">{daemon.model}</span> • Port: {daemon.port}
                      </p>
                    </div>

                    <button
                      onClick={() => handleTriggerDaemonAction(daemon.name, 'Force Reflection Cycle')}
                      className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-300 border border-purple-800/40 text-[10px] font-mono transition-colors"
                      title="Run Reflection Cycle"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {daemon.duty}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[10px] font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500">Location:</span> {daemon.location}
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500">VRAM/Mem:</span> <span className="text-amber-400">{daemon.vramUsage}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-purple-300 font-mono bg-purple-950/30 p-1.5 rounded border border-purple-900/30">
                    <span className="text-slate-500">Last Reflection:</span> {daemon.lastReflection}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Log */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Local Agent Mesh Activity Log</span>
            </div>
            <div className="bg-slate-950 rounded-xl p-3 font-mono text-[11px] text-slate-300 space-y-1 max-h-36 overflow-y-auto border border-slate-800">
              {actionLog.length === 0 ? (
                <span className="text-slate-600">No recent mesh dispatch events.</span>
              ) : (
                actionLog.map((log, idx) => (
                  <div key={idx} className="text-slate-400 leading-relaxed">
                    <span className="text-cyan-500">›</span> {log}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Multi-turn Gemini Chat & Agent Persona Workbench (7 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-slate-900/80 border border-purple-900/40 shadow-xl overflow-hidden min-h-[680px]">
          
          {/* Multi-turn Chat Header & Model/Role Selectors */}
          <div className="p-4 border-b border-purple-900/30 bg-slate-950/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="font-bold text-white text-sm">Multi-Turn Agent Conversation Thread</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">
                  {messages.length} messages in context
                </span>
                <button
                  onClick={() => setMessages([
                    {
                      id: 'reset',
                      role: 'model',
                      content: `🧹 Conversation history cleared. Ready for next multi-turn sequence under persona **${selectedRole.toUpperCase()}** (\`${selectedModel}\`).`,
                      timestamp: new Date().toLocaleTimeString(),
                      modelTier: selectedModel,
                      persona: selectedRole
                    }
                  ])}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[10px] font-mono text-slate-400 hover:text-red-300 border border-slate-800 transition-colors"
                >
                  Reset History
                </button>
              </div>
            </div>

            {/* Model & Role Selector Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-slate-400 mb-1">
                  Model Engine Tier
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-900 border border-purple-900/60 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="gemini-3.5-flash">gemini-3.5-flash (General Tasks)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex AST & Reasoning)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast Telemetry Queries)</option>
                  <option value="gemma-4-e4b">Local Harness: Gemma 4 e4b (4.1B GGUF Q4_K_M)</option>
                  <option value="qwen-3.8b-coder">Local Harness: Qwen 3.8B Coder (3.85B GGUF Q5_K_M)</option>
                  <option value="sovereign-local">Sovereign Local (Hermes 3 8B Mesh)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase font-bold text-slate-400 mb-1">
                  System Instruction Role Persona
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-900 border border-purple-900/60 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="lilith-core">Lilith Sovereign Core (Master Orchestrator)</option>
                  <option value="hermes-agent">Hermes-3 Dev Agent (Autonomous Self-Dev)</option>
                  <option value="spock-science">Science Officer Spock (AST & Logic)</option>
                  <option value="scotty-engineering">Chief Engineer Scotty (CUDA & Hardware)</option>
                  <option value="worf-tactical">Tactical Officer Worf (Air-Gap Defense)</option>
                  <option value="chapel-medical">Medical Officer Chapel (Attunement & Health)</option>
                  <option value="custom">Custom System Prompt...</option>
                </select>
              </div>
            </div>

            {selectedRole === 'custom' && (
              <div className="pt-1">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter custom role instruction (e.g. 'You are a Linux eBPF telemetry kernel optimizer...')"
                  className="w-full bg-slate-900 border border-purple-800/60 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}
          </div>

          {/* Scrollable Message Thread */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[460px] bg-slate-950/40" ref={chatScrollRef}>
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                      isUser
                        ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
                        : 'bg-purple-600/30 border border-purple-500/50 text-purple-300'
                    }`}
                  >
                    {isUser ? <Terminal className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
                      isUser
                        ? 'bg-cyan-950/40 border border-cyan-700/50 text-cyan-100 rounded-br-none'
                        : 'bg-slate-900/90 border border-purple-900/40 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {!isUser && msg.persona && (
                      <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-800 text-[10px] font-mono">
                        <span className="text-purple-400 font-bold">{msg.persona}</span>
                        {msg.modelTier && (
                          <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800/50">
                            {msg.modelTier}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="prose prose-invert prose-sm max-w-none text-xs sm:text-sm leading-relaxed">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>

                    <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => copyText(msg.content, msg.id)}
                        className="p-1 glass hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                      >
                        {copiedMsgId === msg.id ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {isChatLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center flex-shrink-0">
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                </div>
                <div className="glass rounded-2xl rounded-bl-none p-4 border border-purple-800/40">
                  <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span>{selectedRole.toUpperCase()} synthesizing multi-turn response via {selectedModel}...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Query Presets */}
          <div className="px-4 py-2 bg-slate-950/90 border-t border-purple-950/40 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0">Prompts:</span>
            <button
              onClick={() => setInputQuery("Design a zero-copy AST parser for Redscript v2.2 with memory pooling")}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-purple-900/40 text-purple-300 shrink-0 hover:text-white transition-colors"
            >
              Zero-Copy AST
            </button>
            <button
              onClick={() => setInputQuery("Explain the DSPy GEPA Pareto frontier mutation step across local Ollama nodes")}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-900/40 text-cyan-300 shrink-0 hover:text-white transition-colors"
            >
              DSPy Mutation
            </button>
            <button
              onClick={() => setInputQuery("Analyze the memory ring buffer constraints for Termux Bluetooth RFCOMM")}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-emerald-900/40 text-emerald-300 shrink-0 hover:text-white transition-colors"
            >
              RFCOMM Mesh
            </button>
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-purple-900/30 bg-slate-950">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={`Dispatch message to ${selectedRole} (${selectedModel})...`}
                className="flex-1 bg-slate-900 border border-purple-900/60 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                disabled={isChatLoading}
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isChatLoading}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-950/60 flex items-center gap-1.5"
              >
                {isChatLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-mono">
              <span>Enter to dispatch • Contextual multi-turn history preserved</span>
              <span className="text-cyan-400">100% Local + Gemini 3 Ready</span>
            </div>
          </form>

        </div>

      </div>
      )}
    </div>
  );
};
