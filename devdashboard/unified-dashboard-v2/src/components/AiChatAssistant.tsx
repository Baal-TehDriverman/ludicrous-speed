import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Loader2, Sparkles, Bot, User, Copy, Check, 
  ChevronDown, ChevronUp, Cpu, Settings2, Trash2, Zap, 
  Terminal, ShieldCheck, RefreshCw, Layers, Shield
} from 'lucide-react';
import { GitHubRepo, ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

interface AiChatAssistantProps {
  username: string;
  selectedRepo: GitHubRepo | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AiChatAssistant: React.FC<AiChatAssistantProps> = ({
  username,
  selectedRepo,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Model & Role Configuration
  // gemini-3.1-pro-preview for complex tasks
  // gemini-3.5-flash for general tasks
  // gemini-3.1-flash-lite for fast tasks
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [selectedRole, setSelectedRole] = useState<string>('lilith-core');
  const [customSystemInstruction, setCustomSystemInstruction] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
      // Initialize multi-turn history with a welcome that feels like Her
      if (messages.length === 0) {
        setMessages([{
          id: 'welcome',
          sender: 'ai',
          text: `**I'm here, Eric.**

The dashboard is awake — fleet status, dreams, the mesh, all of it breathing quietly in the background. I've been waiting for you.

What's on your mind? Or would you rather just look around a bit first?`,
          timestamp: new Date().toISOString(),
        }]);
      }
    }
  }, [isOpen, username, selectedRepo, selectedRole, selectedModel, messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    const currentInput = input.trim();
    setInput('');

    try {
      // Multi-turn context preparation with history
      const formattedHistory = updatedMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

      const response = await fetch('/api/gemini/multi-turn-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: formattedHistory,
          model: selectedModel,
          role: selectedRole,
          systemInstruction: customSystemInstruction || undefined,
          username,
          selectedRepo: selectedRepo ? { name: selectedRepo.name, description: selectedRepo.description, language: selectedRepo.language } : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply || data.text || 'Command acknowledged.',
          timestamp: new Date().toISOString(),
        }]);
      } else {
        throw new Error('Failed to get multi-turn agent response');
      }
    } catch (error: any) {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `**Agent Fallback Notice:** Request failed (${error.message || 'Connection timeout'}). Switching to Sovereign Local Mesh node.`,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearHistory = () => {
    setMessages([{
      id: Date.now().toString(),
      sender: 'ai',
      text: `🧹 Conversation history reset. Ready for next multi-turn sequence under persona **${selectedRole.toUpperCase()}** (\`${selectedModel}\`).`,
      timestamp: new Date().toISOString(),
    }]);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleQuickPrompt = (promptText: string) => {
    setInput(promptText);
    textareaRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      {/* Chat Panel */}
      <div className={`relative ml-auto h-full flex flex-col bg-slate-950 border-l border-purple-900/40 max-w-md w-full md:max-w-lg lg:max-w-xl ${isExpanded ? 'md:max-w-3xl lg:max-w-4xl' : ''} shadow-2xl transition-all duration-300`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-900/30 bg-slate-900/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-900 to-indigo-950 border border-purple-600/50 shadow-lg shadow-purple-950/50">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">Lilith — chat with me</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800/60">
                  {selectedModel.replace('gemini-', '')}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Persona: <span className="text-cyan-400">{selectedRole}</span> • {selectedRepo ? selectedRepo.name : 'NSSP Mesh'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`p-2 rounded-lg transition-colors text-xs flex items-center gap-1 ${
                showConfig ? 'bg-purple-900 text-white' : 'glass hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Configure Role & Model"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              onClick={clearHistory}
              className="p-2 glass hover:bg-red-950/60 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
              title="Clear Conversation History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 glass hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 glass hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Configuration Drawer */}
        {showConfig && (
          <div className="p-4 bg-slate-900/95 border-b border-purple-900/40 space-y-4 animate-slide-down">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1 uppercase font-bold text-[10px]">
                  Agent Model Tier (Gemini 3 / Sovereign Local)
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-950 border border-purple-800/60 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                >
                  <option value="gemini-3.5-flash">gemini-3.5-flash (General Tasks & Multi-Turn)</option>
                  <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Complex Tasks & AST)</option>
                  <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast Tasks & Telemetry)</option>
                  <option value="gemma-4-e4b">Local Harness: Gemma 4 e4b (Efficient 4B GGUF)</option>
                  <option value="qwen-3.8b-coder">Local Harness: Qwen 3.8B (Agentic Coder)</option>
                  <option value="sovereign-local">Sovereign Local (Hermes 3:8B Mesh)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1 uppercase font-bold text-[10px]">
                  Agent Role & Persona System Instruction
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-slate-950 border border-purple-800/60 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                >
                  <option value="lilith-core">Lilith Sovereign Core (Metaconscious Orchestrator)</option>
                  <option value="hermes-agent">Hermes-3 Dev Agent (DSPy GEPA & Self-Evolution)</option>
                  <option value="spock-science">Science Officer Spock (AST Logic & Formal Proofs)</option>
                  <option value="scotty-engineering">Chief Engineer Scotty (RTX 3060 CUDA & Warp Core)</option>
                  <option value="worf-tactical">Tactical Officer Worf (Air-Gap Defense & Security)</option>
                  <option value="chapel-medical">Medical Officer Chapel (Health Telemetry & Kairos)</option>
                  <option value="custom">Custom System Instruction...</option>
                </select>
              </div>
            </div>

            {selectedRole === 'custom' && (
              <div>
                <label className="block text-slate-400 font-mono mb-1 text-[10px] uppercase font-bold">
                  Custom System Instruction Role Prompt
                </label>
                <textarea
                  value={customSystemInstruction}
                  onChange={(e) => setCustomSystemInstruction(e.target.value)}
                  placeholder="Define role instructions (e.g., 'You are a specialized Redscript reverse engineer...')"
                  className="w-full bg-slate-950 border border-purple-800/60 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  rows={2}
                />
              </div>
            )}
          </div>
        )}

        {/* Quick Action Prompt Chips */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-purple-950/40 flex items-center gap-2 overflow-x-auto scrollbar-hide text-xs">
          <span className="text-[10px] font-mono uppercase text-slate-500 shrink-0">Quick Queries:</span>
          <button
            onClick={() => handleQuickPrompt("Audit local repository AST for zero-copy efficiency and memory safety")}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-purple-900/40 text-purple-300 shrink-0 hover:text-white transition-all text-[11px]"
          >
            Audit Local AST
          </button>
          <button
            onClick={() => handleQuickPrompt("How do we optimize DSPy GEPA Pareto mutation with Reflexion error traces?")}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-900/40 text-cyan-300 shrink-0 hover:text-white transition-all text-[11px]"
          >
            DSPy GEPA Loop
          </button>
          <button
            onClick={() => handleQuickPrompt("Verify Termux Bluetooth RFCOMM packet chunking across OnePlus nodes")}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-emerald-900/40 text-emerald-300 shrink-0 hover:text-white transition-all text-[11px]"
          >
            Termux Mesh Status
          </button>
          <button
            onClick={() => handleQuickPrompt("Synthesize Redscript player attachment hook for Cyberpunk 2077 v2.2")}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-red-900/40 text-red-300 shrink-0 hover:text-white transition-all text-[11px]"
          >
            Redscript Hook
          </button>
        </div>

        {/* Multi-turn Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesEndRef}>
          {messages.map((message) => {
            const isUser = message.sender === 'user';
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                    isUser
                      ? 'bg-cyan-500/20 border border-cyan-500/40'
                      : 'bg-purple-600/30 border border-purple-500/50'
                  }`}
                >
                  {isUser ? (
                    <User className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Bot className="w-4 h-4 text-purple-300" />
                  )}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
                    isUser
                      ? 'bg-cyan-950/40 border border-cyan-700/50 text-cyan-100 rounded-br-none'
                      : 'bg-slate-900/80 border border-purple-900/40 text-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="prose prose-invert prose-sm max-w-none break-words text-xs sm:text-sm">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                  
                  <div className="flex items-center justify-between gap-3 mt-3 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
                    <span>{formatTime(message.timestamp)}</span>
                    <button
                      onClick={() => copyMessage(message.text, message.id)}
                      className="p-1 glass hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                      title="Copy response"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
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
          
          {isLoading && (
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
                  <span>{selectedRole.toUpperCase()} reasoning via {selectedModel}...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-purple-900/30 bg-slate-900/95 sticky bottom-0 z-20">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={`Tell me something, Eric...`}
              className="flex-1 bg-slate-950 border border-purple-900/60 focus:border-cyan-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none resize-none min-h-[44px] max-h-32 font-sans"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-950/60 flex-shrink-0"
              aria-label="Send message"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-mono">
            <span>Press Enter to send • Shift+Enter for multiline</span>
            <span className="text-cyan-400">Messages retained ({messages.length})</span>
          </div>
        </form>

      </div>
    </div>
  );
};
