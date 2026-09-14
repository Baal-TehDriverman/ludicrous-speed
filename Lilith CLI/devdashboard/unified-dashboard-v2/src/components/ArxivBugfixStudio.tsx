import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, Bug, Sparkles, BookOpen, GitBranch, Terminal, 
  CheckCircle2, Copy, Play, RefreshCw, Cpu, Layers, 
  ExternalLink, ArrowRight, ShieldCheck, Flame, Zap, FileCode, Check,
  Search, X, FileText
} from 'lucide-react';
import { ArxivPaper, ArxivBugfixResult } from '../types';
import { generateArxivBugfixPatch, fetchArxivPapers } from '../api';

const PRESET_BUGFIX_TARGETS = [
  {
    repo: 'cosmos-3-quantized-nssp',
    file: 'quant_loader.cpp',
    title: 'Speculative Token Drafting Drift & Latency',
    issue: 'Draft token rejection rate causes excessive fallback cycles due to uncalibrated speculative logits thresholding.',
    arxivId: '2302.01318',
    paperTitle: 'Fast Inference from Small Language Models via Speculative Decoding',
    recommendedModel: 'qwen-3.8b-coder'
  },
  {
    repo: 'hermes-agent-self-evolution-asshole',
    file: 'unified_consciousness_framework.py',
    title: 'Reflexion Error Trace Memory Leak & Trap Loops',
    issue: 'Episodic memory buffer lacks semantic deduplication, causing repetitive hallucination loops on failed tool calls.',
    arxivId: '2303.11366',
    paperTitle: 'Reflexion: Language Agents with Verbal Reinforcement Learning',
    recommendedModel: 'hermes-3:8b'
  },
  {
    repo: 'grand-theft-cyberpunk',
    file: 'cyber_hook.reds',
    title: 'Redscript AST Hook Collision on In-Game Event Dispatch',
    issue: 'Player telemetry event loop drops packets during intense high-framerate combat scene transitions.',
    arxivId: '2305.16291',
    paperTitle: 'Voyager: An Open-Ended Embodied Agent with Large Language Models',
    recommendedModel: 'gemma-4-e4b'
  },
  {
    repo: 'hermes-agent-termux',
    file: 'hermes_state_portability.py',
    title: 'Bluetooth RFCOMM Delta-Sync Packet Fragmentation',
    issue: 'State synchronization between OnePlus 6T/8T LineageOS edge nodes and host workstation suffers UTF-8 stream desync.',
    arxivId: '2203.08975',
    paperTitle: 'A Survey of Multi-Agent Deep Reinforcement Learning with Communication',
    recommendedModel: 'qwen-3.8b-coder'
  }
];

const MODEL_OPTIONS = [
  { id: 'qwen-3.8b-coder', name: 'Qwen 3.8B Agentic Coder', tag: 'SOVEREIGN LOCAL (RTX 3060)' },
  { id: 'gemma-4-e4b', name: 'Gemma 4 e4b (Efficient 4B GGUF)', tag: 'EDGE AST HARNESS' },
  { id: 'hermes-3:8b', name: 'Hermes-3 8B Autonomous Runner', tag: 'SELF-EVOLUTION CORE' },
  { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash Hybrid Reasoner', tag: 'CLOUD REASONING LAB' },
];

const QUICK_LOOKUP_QUERIES = [
  'all:autonomous llm bug fixing repair',
  'all:speculative decoding small language models',
  'all:self-debugging program repair',
  'all:SWE-bench code patch generation',
  'all:embodied agent action verification'
];

interface ArxivBugfixStudioProps {
  initialPaper?: ArxivPaper | null;
  onSelectPaper?: (paper: ArxivPaper) => void;
}

export const ArxivBugfixStudio: React.FC<ArxivBugfixStudioProps> = ({ initialPaper }) => {
  const [selectedRepo, setSelectedRepo] = useState<string>(PRESET_BUGFIX_TARGETS[0].repo);
  const [selectedFile, setSelectedFile] = useState<string>(PRESET_BUGFIX_TARGETS[0].file);
  const [paperTitle, setPaperTitle] = useState<string>(initialPaper?.title || PRESET_BUGFIX_TARGETS[0].paperTitle);
  const [arxivId, setArxivId] = useState<string>(initialPaper?.arxivId || PRESET_BUGFIX_TARGETS[0].arxivId);
  const [paperSummary, setPaperSummary] = useState<string>(initialPaper?.summary || 'Peer-reviewed algorithmic framework for autonomous systems');
  const [bugDescription, setBugDescription] = useState<string>(PRESET_BUGFIX_TARGETS[0].issue);
  const [selectedModel, setSelectedModel] = useState<string>('qwen-3.8b-coder');

  // ArXiv Live Search Modal / Drawer state
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [modalSearchQuery, setModalSearchQuery] = useState('all:autonomous llm bug fixing repair');
  const [searchedPapers, setSearchedPapers] = useState<ArxivPaper[]>([]);
  const [isSearchingPapers, setIsSearchingPapers] = useState(false);

  React.useEffect(() => {
    if (initialPaper) {
      setPaperTitle(initialPaper.title);
      setArxivId(initialPaper.arxivId);
      setPaperSummary(initialPaper.summary);
      setBugDescription(`Resolve algorithmic bottleneck and apply theorems from ${initialPaper.title} (${initialPaper.arxivId})`);
    }
  }, [initialPaper]);

  // Search arXiv Papers live
  const handleLiveArxivSearch = async (queryToSearch: string) => {
    setIsSearchingPapers(true);
    try {
      const data = await fetchArxivPapers(queryToSearch, 10);
      setSearchedPapers(data.papers || []);
    } catch (err) {
      console.error('Failed to search arxiv papers:', err);
    } finally {
      setIsSearchingPapers(false);
    }
  };

  const handleSelectPaperFromModal = (paper: ArxivPaper) => {
    setPaperTitle(paper.title);
    setArxivId(paper.arxivId);
    setPaperSummary(paper.summary);
    setBugDescription(`Apply peer-reviewed theorem and algorithmic patch from "${paper.title}" (arXiv:${paper.arxivId}) to fix target bottleneck.`);
    setShowSearchModal(false);
  };

  // Synthesis State
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<ArxivBugfixResult | null>(null);
  const [activeTab, setActiveTab] = useState<'diff' | 'code' | 'test' | 'diagnosis'>('diff');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleApplyPreset = (preset: typeof PRESET_BUGFIX_TARGETS[0]) => {
    setSelectedRepo(preset.repo);
    setSelectedFile(preset.file);
    setPaperTitle(preset.paperTitle);
    setArxivId(preset.arxivId);
    setBugDescription(preset.issue);
    setSelectedModel(preset.recommendedModel);
  };

  const handleSynthesizeBugfix = async () => {
    setIsGenerating(true);
    setResult(null);

    try {
      const res = await generateArxivBugfixPatch({
        paperTitle,
        arxivId,
        paperSummary,
        targetRepo: selectedRepo,
        targetFile: selectedFile,
        bugDescription,
        modelType: selectedModel
      });

      if (res.success) {
        setResult(res);
      }
    } catch (err) {
      console.error('Failed to generate arXiv bugfix patch:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-purple-950/80 to-slate-950 border border-purple-800/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 shadow-xl shadow-purple-950/60">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  ArXiv Peer-Reviewed Bugfix &amp; Code Updater
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-950 border border-purple-700/60 text-purple-300">
                  Paper-to-Patch Compiler
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-1">
                Translate academic arXiv discoveries into formal root-cause diagnostics, concrete Unified Git Diffs, executable verification tests, and high-performance AST patches.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowSearchModal(true);
                handleLiveArxivSearch(modalSearchQuery);
              }}
              className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-500/50 text-purple-300 hover:text-white font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-lg"
            >
              <Search className="w-4 h-4 text-purple-400" />
              <span>Lookup arXiv.org Papers</span>
            </button>

            <button
              onClick={handleSynthesizeBugfix}
              disabled={isGenerating}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-xl shadow-purple-950/70 disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
              <span>{isGenerating ? 'Synthesizing ArXiv Patch...' : 'Synthesize Bugfix Patch'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Problem Scenarios */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="text-purple-300 font-bold flex items-center gap-1.5">
            <Bug className="w-3.5 h-3.5 text-purple-400" />
            Quick-Select Verified ArXiv Bugfix Scenarios:
          </span>
          <span>Click to populate parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_BUGFIX_TARGETS.map((preset, idx) => {
            const isSelected = selectedRepo === preset.repo && selectedFile === preset.file;
            return (
              <button
                key={idx}
                onClick={() => handleApplyPreset(preset)}
                className={`text-left p-3.5 rounded-xl border transition-all text-xs font-mono space-y-1.5 ${
                  isSelected
                    ? 'bg-purple-950/70 border-purple-500 text-white shadow-lg ring-1 ring-purple-500/40'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-purple-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-cyan-400 font-bold truncate max-w-[140px]">{preset.repo}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-purple-300">arXiv:{preset.arxivId}</span>
                </div>
                <div className="font-bold text-white text-xs line-clamp-1">{preset.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{preset.issue}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parameters Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Target Configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
                <GitBranch className="w-4 h-4 text-purple-400" />
                <span>Target Codebase &amp; arXiv Grounding</span>
              </div>
              <button
                onClick={() => {
                  setShowSearchModal(true);
                  handleLiveArxivSearch(modalSearchQuery);
                }}
                className="text-[11px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                <Search className="w-3 h-3" />
                <span>Browse Papers</span>
              </button>
            </div>

            {/* Target Repo & File */}
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Repository:</label>
                <input
                  type="text"
                  value={selectedRepo}
                  onChange={(e) => setSelectedRepo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g. cosmos-3-quantized-nssp"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Target File to Patch:</label>
                <input
                  type="text"
                  value={selectedFile}
                  onChange={(e) => setSelectedFile(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  placeholder="e.g. quant_loader.cpp"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">arXiv Paper Title / ID:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={arxivId}
                    onChange={(e) => setArxivId(e.target.value)}
                    className="w-28 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-cyan-300 font-bold focus:outline-none focus:border-purple-500"
                    placeholder="2302.01318"
                  />
                  <input
                    type="text"
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 truncate"
                    placeholder="Paper Title"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Bug Description / Improvement Goal:</label>
                <textarea
                  value={bugDescription}
                  onChange={(e) => setBugDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 text-xs font-mono resize-none leading-relaxed"
                  placeholder="Describe the bug or optimization needed..."
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Synthesis Model Harness:</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-purple-500"
                >
                  {MODEL_OPTIONS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.tag})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSynthesizeBugfix}
              disabled={isGenerating}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-950/60 disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-white" />
              )}
              <span>{isGenerating ? 'Synthesizing Bugfix...' : 'Run Bugfix Synthesis'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Unified Diff & Generated Patch Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-slate-900/90 border border-purple-900/40 p-5 space-y-4 shadow-xl min-h-[480px] flex flex-col justify-between">
            
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => setActiveTab('diff')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'diff'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white bg-slate-950'
                  }`}
                >
                  Unified Diff (Patch)
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'code'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white bg-slate-950'
                  }`}
                >
                  Full Code
                </button>
                <button
                  onClick={() => setActiveTab('test')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'test'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white bg-slate-950'
                  }`}
                >
                  Verification Unit Test
                </button>
                <button
                  onClick={() => setActiveTab('diagnosis')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'diagnosis'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white bg-slate-950'
                  }`}
                >
                  Paper Grounding &amp; Math
                </button>
              </div>

              {result && (
                <button
                  onClick={() => handleCopy(
                    activeTab === 'diff' ? result.diff :
                    activeTab === 'code' ? result.fullCode :
                    activeTab === 'test' ? result.unitTest :
                    result.diagnosis,
                    activeTab
                  )}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5 border border-slate-800"
                >
                  {copiedKey === activeTab ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === activeTab ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>

            {/* Performance HUD (If Result Available) */}
            {result && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500">Latency Delta</div>
                  <div className="text-emerald-400 font-bold mt-0.5">{result.metrics.latencyImprovement}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500">VRAM Savings</div>
                  <div className="text-cyan-400 font-bold mt-0.5">{result.metrics.vramSavings}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500">AST Validity</div>
                  <div className="text-purple-300 font-bold mt-0.5">{result.metrics.astReliability}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500">Verification Rate</div>
                  <div className="text-amber-400 font-bold mt-0.5">{result.metrics.verifiedTokensPerSec}</div>
                </div>
              </div>
            )}

            {/* Main Code/Diff/Diagnosis Display */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto min-h-[300px] flex-1">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center space-y-3 py-16">
                  <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
                  <p className="text-slate-400">Synthesizing peer-reviewed bugfix via {selectedModel}...</p>
                </div>
              ) : result ? (
                <div>
                  {activeTab === 'diff' && (
                    <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed">
                      {result.diff}
                    </pre>
                  )}
                  {activeTab === 'code' && (
                    <pre className="text-cyan-300 whitespace-pre-wrap leading-relaxed">
                      {result.fullCode}
                    </pre>
                  )}
                  {activeTab === 'test' && (
                    <pre className="text-amber-300 whitespace-pre-wrap leading-relaxed">
                      {result.unitTest}
                    </pre>
                  )}
                  {activeTab === 'diagnosis' && (
                    <div className="space-y-3 text-slate-300">
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <strong className="text-purple-400">Root Cause Diagnosis:</strong>
                        <p className="mt-1 leading-relaxed text-slate-300">{result.diagnosis}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <strong className="text-cyan-400">Algorithmic Formulation from Paper:</strong>
                        <p className="mt-1 leading-relaxed text-slate-300">{result.algorithmicFix}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <strong className="text-amber-400">arXiv Citation:</strong>
                        <p className="mt-1 leading-relaxed text-slate-300">{result.arxivCitations}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-2 text-slate-500 py-16">
                  <Sparkles className="w-8 h-8 text-slate-700" />
                  <p>Select a scenario or lookup a paper on the left, then click <strong className="text-purple-400">Synthesize Bugfix Patch</strong>.</p>
                </div>
              )}
            </div>

            {/* Git Apply Command Line Helper */}
            {result && (
              <div className="p-3 rounded-xl bg-slate-950 border border-purple-900/40 flex items-center justify-between text-xs font-mono text-emerald-400">
                <span className="truncate">git apply --check &lt;(echo &quot;{result.diff.replace(/"/g, '\\"').slice(0, 40)}...&quot;)</span>
                <button
                  onClick={() => handleCopy(`git apply << 'EOF'\n${result.diff}\nEOF`, 'git-apply')}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 ml-2 shrink-0 flex items-center gap-1"
                >
                  {copiedKey === 'git-apply' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === 'git-apply' ? 'Copied Command' : 'Copy Git Patch Command'}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Live ArXiv Paper Lookup Modal */}
      <AnimatePresence>
        {showSearchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-950 border border-purple-800/80 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                <div className="flex items-center gap-2 text-white font-mono font-bold text-sm">
                  <Search className="w-4 h-4 text-purple-400" />
                  <span>Lookup arXiv.org Research Papers for Bugfix</span>
                </div>
                <button
                  onClick={() => setShowSearchModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Search Bar & Quick Filters */}
              <div className="p-4 border-b border-slate-800 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLiveArxivSearch(modalSearchQuery)}
                    placeholder="Search arXiv by keyword (e.g. self-debugging, speculative decoding)..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={() => handleLiveArxivSearch(modalSearchQuery)}
                    disabled={isSearchingPapers}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs flex items-center gap-2"
                  >
                    {isSearchingPapers ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>Search</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {QUICK_LOOKUP_QUERIES.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setModalSearchQuery(q);
                        handleLiveArxivSearch(q);
                      }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-900 hover:bg-purple-950/60 text-slate-400 hover:text-purple-300 border border-slate-800"
                    >
                      {q.replace('all:', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results List */}
              <div className="p-4 overflow-y-auto space-y-3 flex-1 font-mono text-xs">
                {isSearchingPapers ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-purple-400" />
                    <span>Querying arXiv.org API...</span>
                  </div>
                ) : searchedPapers.length > 0 ? (
                  searchedPapers.map((paper) => (
                    <div
                      key={paper.id}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 max-w-lg">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 font-bold text-[10px] border border-purple-800/60">
                            arXiv:{paper.arxivId}
                          </span>
                          <span className="text-[10px] text-slate-400">{paper.primaryCategory}</span>
                        </div>
                        <div className="font-bold text-white text-xs">{paper.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {paper.summary}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectPaperFromModal(paper)}
                        className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-[11px] shrink-0 flex items-center gap-1.5 shadow-md self-end sm:self-center"
                      >
                        <Wrench className="w-3.5 h-3.5 text-amber-300" />
                        <span>Use for Bugfix</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-500">
                    No papers loaded. Click Search to query arXiv.org.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
