import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BookOpen,
  Cpu,
  RefreshCw,
  ExternalLink,
  Sparkles,
  GitBranch,
  FileText,
  FileCode,
  Zap,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  Database,
  ShieldAlert,
  Sliders,
  BookmarkPlus,
  Wrench,
  Bug
} from 'lucide-react';
import { ArxivPaper, ArxivDeepDiveData, LocalAgentStatus, HermesCycleResult } from '../types';
import { fetchArxivPapers, fetchArxivDeepDive, fetchLocalAgentStatus, executeHermesCycle } from '../api';
import { SelfDevMetaStudio } from './SelfDevMetaStudio';
import { ArxivBugfixStudio } from './ArxivBugfixStudio';

const QUICK_TOPICS = [
  { label: 'Autonomous Bugfix & Self-Correction', query: 'all:autonomous llm agent bug fixing repair' },
  { label: 'Quantized Edge & Speculative', query: 'all:speculative decoding llm edge quantization' },
  { label: 'Gemma & Qwen Edge Harness', query: 'all:small language model agent code reasoning' },
  { label: 'Multi-Agent Git Mesh', query: 'all:multi-agent communication consensus' },
  { label: 'Embodied Game Engine Agents', query: 'all:embodied agent game world' },
  { label: 'Agent Reflection & Memory', query: 'all:llm memory reflection verbal reinforcement' }
];

export const ArxivResearchSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('all:autonomous llm agent bug fixing repair');
  const [activeTab, setActiveTab] = useState<'bugfix' | 'selfdev' | 'deepdive' | 'arxiv' | 'local-agents'>('bugfix');
  const [papers, setPapers] = useState<ArxivPaper[]>([]);

  const [isLoadingPapers, setIsLoadingPapers] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<ArxivPaper | null>(null);
  const [deepDiveData, setDeepDiveData] = useState<ArxivDeepDiveData | null>(null);
  const [localAgentStatus, setLocalAgentStatus] = useState<LocalAgentStatus | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('Autonomous Self-Evolution');
  
  // Interactive Hermes Cycle
  const [isExecutingCycle, setIsExecutingCycle] = useState(false);
  const [cycleLogs, setCycleLogs] = useState<HermesCycleResult[]>([]);
  const [customHypothesis, setCustomHypothesis] = useState(
    'Evaluating edge latency delta between gemma3:1b and RTX 3060 vLLM proxy'
  );

  // Load deep dive data and initial papers
  useEffect(() => {
    loadDeepDive();
    loadAgentStatus();
    runSearch(searchQuery);
  }, []);

  const loadDeepDive = async () => {
    try {
      const data = await fetchArxivDeepDive();
      setDeepDiveData(data);
    } catch (err) {
      console.error('Failed to load deep dive mapping:', err);
    }
  };

  const loadAgentStatus = async () => {
    try {
      const status = await fetchLocalAgentStatus();
      setLocalAgentStatus(status);
    } catch (err) {
      console.error('Failed to load local agent status:', err);
    }
  };

  const runSearch = async (query: string) => {
    setIsLoadingPapers(true);
    try {
      const res = await fetchArxivPapers(query, 10);
      setPapers(res.papers || []);
      if (res.papers && res.papers.length > 0) {
        setSelectedPaper(res.papers[0]);
      }
    } catch (err) {
      console.error('ArXiv search failed:', err);
    } finally {
      setIsLoadingPapers(false);
    }
  };

  const handleTopicSelect = (topic: { label: string; query: string }) => {
    setSelectedTopic(topic.label);
    setSearchQuery(topic.query);
    runSearch(topic.query);
  };

  const handleExecuteHermes = async () => {
    setIsExecutingCycle(true);
    try {
      const res = await executeHermesCycle('Paradox Seed (Node 09)', customHypothesis);
      if (res.success) {
        setCycleLogs(prev => [res.cycle, ...prev]);
      }
    } catch (err) {
      console.error('Failed to execute Hermes cycle:', err);
    } finally {
      setIsExecutingCycle(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                ARXIV.ORG RESEARCH &amp; LOCAL AGENT ENGINE
              </span>
              <span className="px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                OLLAMA + HERMES LOCAL MESH
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                SOVEREIGN RECURSIVE ARCHITECTURE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Academic Literature Deep Dive &amp; Sovereign Agent Nexus
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl mt-1">
              Cross-reference arXiv peer-reviewed computer science literature directly against the GitHub codebase (<code className="text-cyan-300 font-mono text-xs">Baal-TehDriverman</code>) and orchestrate local sovereign agents via Ollama &amp; Hermes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadAgentStatus();
                runSearch(searchQuery);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPapers ? 'animate-spin' : ''}`} />
              <span>Sync arXiv &amp; Agents</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 border-t border-slate-800/80 pt-4">
          <button
            onClick={() => setActiveTab('bugfix')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeTab === 'bugfix'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40 ring-1 ring-purple-400'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 text-purple-300" />
            <span>ARXIV BUGFIX &amp; CODE UPDATER</span>
          </button>
          <button
            onClick={() => setActiveTab('selfdev')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeTab === 'selfdev'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40 ring-1 ring-indigo-400'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>DEVELOP THE APP WITH THE APP</span>
          </button>
          <button
            onClick={() => setActiveTab('deepdive')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeTab === 'deepdive'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>CODEBASE ARXIV DEEP-DIVE</span>
          </button>
          <button
            onClick={() => setActiveTab('arxiv')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeTab === 'arxiv'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>LIVE ARXIV SEARCH &amp; EXPLORER</span>
          </button>
          <button
            onClick={() => setActiveTab('local-agents')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeTab === 'local-agents'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>LOCAL AGENTS (OLLAMA &amp; HERMES)</span>
          </button>
        </div>
      </div>

      {/* TAB 0: ARXIV BUGFIX & CODE UPDATER */}
      {activeTab === 'bugfix' && <ArxivBugfixStudio initialPaper={selectedPaper} />}

      {/* TAB 1: DEVELOP THE APP WITH THE APP (SELF-DEV META STUDIO) */}
      {activeTab === 'selfdev' && <SelfDevMetaStudio />}

      {/* TAB 1: CODEBASE ARXIV DEEP-DIVE */}
      {activeTab === 'deepdive' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-indigo-300 font-mono">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                <strong>Cross-Reference Matrix:</strong> Mapping arXiv fundamental research to the sovereign repositories in your GitHub workspace.
              </span>
            </div>
            <span className="text-slate-500 font-mono">
              Target: <strong className="text-slate-300">github.com/Baal-TehDriverman</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deepDiveData?.crossReferences.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                      {item.repoName}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">
                      {item.coreFiles.length} Core Files
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {item.coreFiles.map((file, fileIdx) => (
                      <span
                        key={fileIdx}
                        className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-[11px] font-mono"
                      >
                        {file}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-slate-800/80 pt-3 space-y-2.5">
                    <div className="text-[11px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      <span>arXiv Peer-Reviewed Scientific Alignment</span>
                    </div>

                    {item.arxivMatches.map((match, matchIdx) => (
                      <div
                        key={matchIdx}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 space-y-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-indigo-900/60 text-[10px] font-mono text-indigo-200">
                              arXiv:{match.arxivId}
                            </span>
                            <span className="line-clamp-1">{match.title}</span>
                          </span>
                          <a
                            href={`https://arxiv.org/abs/${match.arxivId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-white shrink-0 ml-2"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {match.finding}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setActiveTab('arxiv');
                      setSearchQuery(`all:${item.arxivMatches[0]?.title || item.repoName}`);
                      runSearch(`all:${item.arxivMatches[0]?.title || item.repoName}`);
                    }}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                  >
                    <span>Explore Matching Literature on arXiv</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE ARXIV SEARCH & EXPLORER */}
      {activeTab === 'arxiv' && (
        <div className="space-y-6">
          {/* Quick Topic Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-mono text-slate-500 uppercase mr-1">Frontiers:</span>
            {QUICK_TOPICS.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => handleTopicSelect(topic)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  selectedTopic === topic.label
                    ? 'bg-cyan-600 text-slate-950 font-bold shadow-md shadow-cyan-900/30'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              runSearch(searchQuery);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Query arXiv (e.g. all:speculative decoding, cs.AI:autonomous agent, all:GGUF)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLoadingPapers}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isLoadingPapers ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Search arXiv</span>
            </button>
          </form>

          {/* Papers Grid + Detail Modal/Viewer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Paper Cards */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Returned {papers.length} Academic Papers</span>
                <span>Sorted by Relevance</span>
              </div>

              {isLoadingPapers ? (
                <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  <p className="text-sm font-mono text-slate-400">Querying arXiv export feed &amp; parsing Atom XML...</p>
                </div>
              ) : papers.length === 0 ? (
                <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-sm font-mono">
                  No arXiv papers found for query. Try broader keywords like "autonomous agents" or "speculative decoding".
                </div>
              ) : (
                papers.map((paper) => {
                  const isSelected = selectedPaper?.id === paper.id;
                  return (
                    <motion.div
                      key={paper.id}
                      whileHover={{ scale: 1.005 }}
                      onClick={() => setSelectedPaper(paper)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2.5 ${
                        isSelected
                          ? 'bg-cyan-950/30 border-cyan-500/50 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/30'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px] font-mono font-bold">
                            arXiv:{paper.arxivId}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono">
                            {paper.primaryCategory}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {paper.published ? new Date(paper.published).toLocaleDateString() : ''}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug">
                        {paper.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {paper.summary}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-500">
                        <span className="line-clamp-1">
                          Authors: {paper.authors.slice(0, 3).join(', ')} {paper.authors.length > 3 ? 'et al.' : ''}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPaper(paper);
                              setActiveTab('bugfix');
                            }}
                            className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                          >
                            <Wrench className="w-3 h-3" />
                            <span>Patch/Fix</span>
                          </button>
                          <a
                            href={paper.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                          >
                            <span>PDF</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Right Col: Selected Paper Full Abstract & Synthesis */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-6">
              {selectedPaper ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
                      arXiv:{selectedPaper.arxivId}
                    </span>
                    <a
                      href={selectedPaper.arxivUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>View on arXiv.org</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-tight">
                    {selectedPaper.title}
                  </h3>

                  <div className="text-xs text-slate-400 font-mono space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <strong className="text-slate-300">Authors:</strong> {selectedPaper.authors.join(', ')}
                    </div>
                    <div>
                      <strong className="text-slate-300">Categories:</strong> {selectedPaper.categories.join(', ')}
                    </div>
                    <div>
                      <strong className="text-slate-300">Published:</strong>{' '}
                      {new Date(selectedPaper.published).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
                      Abstract
                    </h4>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed max-h-64 overflow-y-auto">
                      {selectedPaper.summary}
                    </div>
                  </div>

                  {/* ArXiv Bugfix Compiler Trigger Button */}
                  <button
                    onClick={() => {
                      setActiveTab('bugfix');
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-purple-950/60"
                  >
                    <Wrench className="w-4 h-4 text-amber-300" />
                    <span>⚡ Compile ArXiv Bugfix &amp; Code Patch</span>
                  </button>

                  {/* PDF Quick Download Button */}
                  <a
                    href={selectedPaper.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Download Full Paper PDF</span>
                  </a>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 font-mono text-xs">
                  Select a paper from the list to view the full abstract, author metadata, and direct PDF download links.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOCAL AGENTS (OLLAMA & HERMES) */}
      {activeTab === 'local-agents' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ollama Status */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  OLLAMA LOCAL DAEMON
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    localAgentStatus?.ollama.online
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {localAgentStatus?.ollama.online ? 'ONLINE (11434)' : 'STANDBY READY'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sovereign local LLM execution daemon. Coordinates high-throughput low-latency inference on RTX 3060 &amp; Ryzen host.
              </p>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300">
                Endpoint: {localAgentStatus?.ollama.host || 'http://127.0.0.1:11434'}
              </div>
            </div>

            {/* Hermes Autonomous Runner */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  HERMES AUTONOMOUS RUNNER
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold">
                  CYCLE #{localAgentStatus?.hermes.activeCycle || 28}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Self-Evolution &amp; Recursive Reflection loop with adversarial contradiction injection.
              </p>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-purple-300">
                Snapshot: {localAgentStatus?.hermes.lastStateSnapshot || '~/.hermes/state.json'}
              </div>
            </div>

            {/* Git Delta Mesh Transport */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <GitBranch className="w-4 h-4" />
                  TERMUX GIT TRANSPORT
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                  DELTA SYNC ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Synchronizes agent state deltas and weights between host PC and OnePlus HyperDroid edge nodes.
              </p>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300">
                Transport: termux://git-delta-sync
              </div>
            </div>
          </div>

          {/* Configured Local Models & Weight Classes */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold font-mono text-white uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Configured Sovereign Models &amp; Dynamic Weight Class Routing</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {localAgentStatus?.ollama.configuredModels.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{m.name}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px]">
                      {m.quant}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Size: <strong className="text-slate-200">{m.size}</strong>
                  </div>
                  <div className="text-indigo-400 text-[11px] pt-1 border-t border-slate-900">
                    Target: {m.target}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Hermes Cycle Crucible */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>Hermes Prompt Crucible &amp; Self-Evolution Loop</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Execute a self-directed iteration cycle. Evaluates hypothesis, resolves contradiction, and logs state to ~/.hermes/state.json.
                </p>
              </div>

              <button
                onClick={handleExecuteHermes}
                disabled={isExecutingCycle}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg shadow-purple-900/30 flex items-center gap-2 disabled:opacity-50"
              >
                <Zap className={`w-4 h-4 ${isExecutingCycle ? 'animate-spin' : ''}`} />
                <span>Execute Sovereign Cycle</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 uppercase">
                Active Iteration Hypothesis
              </label>
              <input
                type="text"
                value={customHypothesis}
                onChange={(e) => setCustomHypothesis(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Cycle History Logs */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono font-bold text-slate-400 uppercase">
                Recent Cycle Executions
              </div>

              {cycleLogs.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs font-mono text-slate-500">
                  Press "Execute Sovereign Cycle" above to run an iterative reflection step through the Hermes engine.
                </div>
              ) : (
                cycleLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-300">
                        [{log.timestamp}] • {log.node} (Attempt #{log.attempt})
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 font-bold text-[10px]">
                        {log.result}
                      </span>
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-500">HYPOTHESIS:</span> {log.hypothesis}
                    </div>
                    <div className="text-slate-400">
                      <span className="text-slate-500">ACTION:</span> {log.action}
                    </div>
                    <div className="text-emerald-400 border-t border-slate-900 pt-1.5">
                      <span className="text-slate-500">LEARNING:</span> {log.learning}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
