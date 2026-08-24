import React, { useState, useEffect, useMemo } from 'react';
import {
  FolderGit2,
  RefreshCw,
  ExternalLink,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
  Terminal,
  Cpu,
  Brain,
  Shield,
  Zap,
  Code2,
  Server,
  Sparkles,
  BookOpen,
  GitBranch,
  Star,
  GitFork,
  HardDrive,
  Clock,
  Layers,
  Bot,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  FileCode,
  Globe,
  Radio,
  Check,
  Flame,
  ArrowUpDown,
  FileText,
  GitPullRequest,
  Tag,
  AlertTriangle,
  Send,
  Copy,
  Plus,
  Rocket,
  Wrench,
  CheckSquare,
  Lock,
  Download,
  Eye,
  Edit3,
  Save,
  Trash2,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { LudicrousSpeedFleet } from './LudicrousSpeedFleet';

interface SyncedRepo {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  updated_at: string;
  created_at: string;
  pushed_at: string;
  size: number;
  visibility: string;
  archived: boolean;
  aiCategory: string;
  aiColor: string;
  aiBadge: string;
  syncStatus: string;
  dirtyFiles: number;
}

interface RepoBranch {
  name: string;
  commit: { sha: string };
  protected: boolean;
}

interface RepoIssue {
  id: number;
  number: number;
  title: string;
  state: string;
  user: { login: string; avatar_url: string };
  labels: { name: string; color: string }[];
  comments: number;
  created_at: string;
  updated_at: string;
  body: string;
}

interface RepoPR {
  id: number;
  number: number;
  title: string;
  state: string;
  user: { login: string; avatar_url: string };
  head: { ref: string };
  base: { ref: string };
  created_at: string;
  additions: number;
  deletions: number;
  changed_files: number;
}

interface RepoRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  zipball_url: string;
  tarball_url: string;
}

const CATEGORY_ICONS: Record<string, any> = {
  'AI & Autonomous Agents': Brain,
  'NSSP Mesh & Sovereign OS': Shield,
  'GPU & Hardware Acceleration': Cpu,
  'Game Engine & Redscript': Zap,
  'Game Clients & Economy': Sparkles,
  'Developer Tooling & UI': Code2,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  'AI & Autonomous Agents': { bg: 'bg-purple-950/40', text: 'text-purple-400', border: 'border-purple-800/60', glow: 'shadow-purple-900/20' },
  'NSSP Mesh & Sovereign OS': { bg: 'bg-cyan-950/40', text: 'text-cyan-400', border: 'border-cyan-800/60', glow: 'shadow-cyan-900/20' },
  'GPU & Hardware Acceleration': { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/60', glow: 'shadow-emerald-900/20' },
  'Game Engine & Redscript': { bg: 'bg-red-950/40', text: 'text-red-400', border: 'border-red-800/60', glow: 'shadow-red-900/20' },
  'Game Clients & Economy': { bg: 'bg-pink-950/40', text: 'text-pink-400', border: 'border-pink-800/60', glow: 'shadow-pink-900/20' },
  'Developer Tooling & UI': { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-800/60', glow: 'shadow-blue-900/20' },
};

const LANG_COLORS: Record<string, string> = {
  Python: 'bg-blue-500',
  TypeScript: 'bg-cyan-400',
  JavaScript: 'bg-yellow-400',
  Redscript: 'bg-red-500',
  Shell: 'bg-emerald-400',
  'C++': 'bg-pink-500',
  C: 'bg-amber-500',
  HTML: 'bg-orange-500',
  Rust: 'bg-orange-600',
  'Config/Script': 'bg-slate-400',
};

export const AllReposManager: React.FC = () => {
  const [activeView, setActiveView] = useState<'repos' | 'ludicrous' | 'mesh-sync'>('repos');
  const [repos, setRepos] = useState<SyncedRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'name' | 'size' | 'stars'>('updated');

  // Selected Repo Detail Studio
  const [selectedRepo, setSelectedRepo] = useState<SyncedRepo | null>(null);
  const [studioTab, setStudioTab] = useState<'overview' | 'files' | 'branches' | 'issues' | 'pulls' | 'releases' | 'ai-copilot'>('overview');
  const [repoReadme, setRepoReadme] = useState<string | null>(null);
  const [loadingReadme, setLoadingReadme] = useState(false);
  
  // Repo Details Sub-states
  const [branches, setBranches] = useState<RepoBranch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  const [newBranchName, setNewBranchName] = useState('');
  const [creatingBranch, setCreatingBranch] = useState(false);

  const [issues, setIssues] = useState<RepoIssue[]>([]);
  const [issueFilter, setIssueFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [newIssueBody, setNewIssueBody] = useState('');
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);

  const [pulls, setPulls] = useState<RepoPR[]>([]);
  const [releases, setReleases] = useState<RepoRelease[]>([]);

  // File Browser & Editor
  const [currentPath, setCurrentPath] = useState<string>('');
  const [fileContents, setFileContents] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContentText, setFileContentText] = useState<string>('');
  const [fileEditMode, setFileEditMode] = useState(false);
  const [editedCode, setEditedCode] = useState<string>('');
  const [commitMessage, setCommitMessage] = useState('Update file via DevDashboard');
  const [commitFeedback, setCommitFeedback] = useState<string | null>(null);

  // AI Copilot
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Copied helper
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Fetch Synchronized Repositories
  const fetchAllRepos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/github/sync-all');
      const data = await res.json();
      if (data.success && Array.isArray(data.repos)) {
        setRepos(data.repos);
        setLastSyncTime(new Date(data.timestamp).toLocaleTimeString());
      }
    } catch (e) {
      console.error('Failed to load synchronized repositories:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRepos();
  }, []);

  // When a repo is selected, load its initial details
  const openRepoStudio = async (repo: SyncedRepo) => {
    setSelectedRepo(repo);
    setStudioTab('overview');
    setSelectedBranch(repo.default_branch || 'main');
    setSelectedFile(null);
    setFileEditMode(false);
    setCurrentPath('');
    setAiAnalysis(null);

    // Load README
    setLoadingReadme(true);
    try {
      const rRes = await fetch(`/api/github/repo/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.name)}/readme`);
      if (rRes.ok) {
        setRepoReadme(await rRes.text());
      } else {
        setRepoReadme('No README.md documentation found for this repository.');
      }
    } catch (e) {
      setRepoReadme('Error loading repository README.');
    } finally {
      setLoadingReadme(false);
    }

    // Preload branches, issues, pulls, releases
    fetchRepoBranches(repo.owner, repo.name);
    fetchRepoIssues(repo.owner, repo.name);
    fetchRepoPulls(repo.owner, repo.name);
    fetchRepoReleases(repo.owner, repo.name);
    fetchRepoFiles(repo.owner, repo.name, '');
  };

  const fetchRepoBranches = async (owner: string, repoName: string) => {
    try {
      const res = await fetch(`/api/github/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/branches`);
      if (res.ok) {
        const data = await res.json();
        setBranches(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRepoIssues = async (owner: string, repoName: string) => {
    try {
      const res = await fetch(`/api/github/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/issues`);
      if (res.ok) {
        const data = await res.json();
        setIssues(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRepoPulls = async (owner: string, repoName: string) => {
    try {
      const res = await fetch(`/api/github/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/pulls`);
      if (res.ok) {
        const data = await res.json();
        setPulls(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRepoReleases = async (owner: string, repoName: string) => {
    try {
      const res = await fetch(`/api/github/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/releases`);
      if (res.ok) {
        const data = await res.json();
        setReleases(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRepoFiles = async (owner: string, repoName: string, path: string) => {
    try {
      const url = `/api/github/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/contents${path ? '/' + path : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setFileContents(Array.isArray(data) ? data : []);
        setCurrentPath(path);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenFile = async (fileItem: any) => {
    if (!selectedRepo) return;
    if (fileItem.type === 'dir') {
      fetchRepoFiles(selectedRepo.owner, selectedRepo.name, fileItem.path);
    } else {
      setSelectedFile(fileItem.path);
      setFileEditMode(false);
      try {
        const res = await fetch(
          `/api/github/repo/${encodeURIComponent(selectedRepo.owner)}/${encodeURIComponent(selectedRepo.name)}/raw?path=${encodeURIComponent(
            fileItem.path
          )}&branch=${encodeURIComponent(selectedBranch)}`
        );
        if (res.ok) {
          const data = await res.json();
          setFileContentText(data.content || '');
          setEditedCode(data.content || '');
        } else {
          setFileContentText(`// File preview unavailable for ${fileItem.path}`);
          setEditedCode('');
        }
      } catch (e) {
        setFileContentText('Error fetching file content.');
      }
    }
  };

  const handleCommitFile = async () => {
    if (!selectedRepo || !selectedFile) return;
    try {
      const res = await fetch(`/api/github/repo/${encodeURIComponent(selectedRepo.owner)}/${encodeURIComponent(selectedRepo.name)}/commit-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: selectedFile,
          content: editedCode,
          message: commitMessage,
          branch: selectedBranch,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCommitFeedback(`✓ Committed '${selectedFile}' (${data.commit.sha.substring(0, 7)}) to ${selectedBranch}`);
        setFileContentText(editedCode);
        setFileEditMode(false);
        setTimeout(() => setCommitFeedback(null), 4000);
      }
    } catch (e) {
      setCommitFeedback('Error committing changes.');
    }
  };

  const handleCreateBranch = async () => {
    if (!selectedRepo || !newBranchName.trim()) return;
    setCreatingBranch(true);
    try {
      const res = await fetch(`/api/github/repo/${encodeURIComponent(selectedRepo.owner)}/${encodeURIComponent(selectedRepo.name)}/branches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branchName: newBranchName.trim(), baseBranch: selectedBranch }),
      });
      const data = await res.json();
      if (data.success) {
        setBranches(prev => [...prev, data.branch]);
        setSelectedBranch(data.branch.name);
        setNewBranchName('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingBranch(false);
    }
  };

  const handleCreateIssue = async () => {
    if (!selectedRepo || !newIssueTitle.trim()) return;
    try {
      const res = await fetch(`/api/github/repo/${encodeURIComponent(selectedRepo.owner)}/${encodeURIComponent(selectedRepo.name)}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newIssueTitle.trim(),
          body: newIssueBody.trim(),
          labels: ['enhancement', 'sovereign-mesh'],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIssues(prev => [data.issue, ...prev]);
        setNewIssueTitle('');
        setNewIssueBody('');
        setShowNewIssueModal(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const runAiAnalysis = async () => {
    if (!selectedRepo) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch(`/api/github/repo/${encodeURIComponent(selectedRepo.owner)}/${encodeURIComponent(selectedRepo.name)}/ai-analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: selectedRepo }),
      });
      const data = await res.json();
      if (data.success) {
        setAiAnalysis(data.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger Live Batch Sync
  const handleBatchSync = async () => {
    setIsSyncing(true);
    setShowLogs(true);
    setSyncLogs(['[INIT] Contacting Sovereign GitHub Mesh Nodes...']);

    try {
      const res = await fetch('/api/github/sync/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetOrgs: ['Baal-TehDriverman', 'Lilith-Systems'] }),
      });
      const data = await res.json();
      if (data.logs) {
        setSyncLogs(data.logs);
      }
      await fetchAllRepos();
    } catch (e) {
      setSyncLogs(prev => [...prev, '[ERROR] Mesh synchronization timed out.']);
    } finally {
      setIsSyncing(false);
    }
  };

  const copyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedText(txt);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const formatSize = (sizeKb: number) => {
    if (sizeKb >= 1024 * 1024) return `${(sizeKb / (1024 * 1024)).toFixed(1)} GB`;
    if (sizeKb >= 1024) return `${(sizeKb / 1024).toFixed(1)} MB`;
    return `${sizeKb} KB`;
  };

  // Filtered Repositories Computation
  const filteredRepos = useMemo(() => {
    return repos.filter(repo => {
      const matchesSearch =
        searchQuery === '' ||
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        repo.language.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesOrg = selectedOrg === 'all' || repo.owner.toLowerCase() === selectedOrg.toLowerCase();
      const matchesCat = selectedCategory === 'all' || repo.aiCategory === selectedCategory;
      const matchesLang = selectedLanguage === 'all' || repo.language.toLowerCase() === selectedLanguage.toLowerCase();

      return matchesSearch && matchesOrg && matchesCat && matchesLang;
    }).sort((a, b) => {
      if (sortBy === 'updated') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'size') return b.size - a.size;
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      return 0;
    });
  }, [repos, searchQuery, selectedOrg, selectedCategory, selectedLanguage, sortBy]);

  const uniqueOrgs = useMemo(() => Array.from(new Set(repos.map(r => r.owner))), [repos]);
  const uniqueCategories = useMemo(() => Array.from(new Set(repos.map(r => r.aiCategory))), [repos]);
  const uniqueLanguages = useMemo(() => Array.from(new Set(repos.map(r => r.language).filter(Boolean))), [repos]);

  return (
    <div id="all-repos-manager-hub" className="space-y-8 animate-fade-in">
      {/* Top Header & Navigation Tabs */}
      <div className="glass rounded-2xl p-6 lg:p-8 border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-inner">
              <FolderGit2 className="w-9 h-9 text-purple-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight font-mono">
                  GITHUB REPOSITORY MANAGEMENT
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                  {repos.length} REPOS SYNCED
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-cyan-400" />
                  AIR-GAP MESH ACTIVE
                </span>
              </div>
              <p className="text-sm text-slate-400 mt-1 max-w-3xl">
                Unified workspace managing all 42+ sovereign repositories across <span className="text-purple-300 font-mono font-semibold">Baal-TehDriverman</span> and <span className="text-cyan-300 font-mono font-semibold">Lilith-Systems</span>. Includes Starfleet Fleet Command for <span className="text-pink-300 font-mono font-semibold">ludicrous-speed</span>.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleBatchSync}
              disabled={isSyncing}
              className="flex-1 lg:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2"
            >
              {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {isSyncing ? 'Synchronizing Repos...' : 'Sync Git Mesh'}
            </button>
          </div>
        </div>

        {/* View Switcher Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveView('repos'); setSelectedRepo(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === 'repos'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              All Repositories ({repos.length})
            </button>

            <button
              onClick={() => { setActiveView('ludicrous'); setSelectedRepo(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeView === 'ludicrous'
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-950/40'
                  : 'bg-slate-900 border border-slate-800 text-pink-300 hover:bg-pink-950/40'
              }`}
            >
              <Rocket className="w-4 h-4 text-pink-400" />
              Ludicrous Speed — Fleet Command (68 Personas)
            </button>

            <button
              onClick={() => setShowLogs(!showLogs)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Mesh Logs
            </button>
          </div>

          {lastSyncTime && (
            <span className="text-[11px] text-slate-500 font-mono">
              Last synced at {lastSyncTime}
            </span>
          )}
        </div>
      </div>

      {/* Sync Telemetry Log Output */}
      {showLogs && (
        <div className="glass rounded-2xl p-5 border border-slate-800 bg-slate-950/90 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
              <Terminal className="w-4 h-4" />
              SOVEREIGN AIR-GAP GIT MESH LOGS
            </div>
            <button onClick={() => setShowLogs(false)} className="text-xs text-slate-500 hover:text-slate-300 font-mono">
              Close [X]
            </button>
          </div>
          <div className="p-3 bg-black/80 rounded-xl font-mono text-xs text-slate-300 space-y-1 max-h-48 overflow-y-auto border border-slate-800">
            {syncLogs.length > 0 ? (
              syncLogs.map((log, i) => (
                <div key={i} className={log.includes('[DONE]') ? 'text-emerald-400 font-bold' : log.includes('[ERROR]') ? 'text-red-400' : 'text-slate-400'}>
                  {log}
                </div>
              ))
            ) : (
              <div className="text-slate-600">No active sync log entries. Press "Sync Git Mesh" to dispatch synchronization probe.</div>
            )}
          </div>
        </div>
      )}

      {/* LUDICROUS SPEED SUB-VIEW */}
      {activeView === 'ludicrous' && (
        <LudicrousSpeedFleet />
      )}

      {/* ALL REPOS EXPLORER VIEW */}
      {activeView === 'repos' && !selectedRepo && (
        <div className="space-y-6">
          {/* Search, Org & Category Filters */}
          <div className="glass rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search 42+ repositories by name, language, category (e.g. ludicrous-speed, kernel, hermes, redscript)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all font-sans"
                />
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Sort:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none font-mono"
                >
                  <option value="updated">Recently Updated</option>
                  <option value="name">Alphabetical</option>
                  <option value="size">Size</option>
                  <option value="stars">Stars</option>
                </select>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-slate-800/80">
              {/* Org Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Organization:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setSelectedOrg('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      selectedOrg === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    All Orgs
                  </button>
                  {uniqueOrgs.map(org => (
                    <button
                      key={org}
                      onClick={() => setSelectedOrg(org)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                        selectedOrg === org ? 'bg-purple-600 text-white' : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {org}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none font-mono"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Repositories Grid */}
          {isLoading ? (
            <div className="glass rounded-2xl p-16 text-center border border-slate-800 flex flex-col items-center justify-center gap-4">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-slate-300 text-sm font-mono">Querying GitHub API & Synchronizing Worktrees...</p>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center border border-slate-800">
              <p className="text-slate-400 text-sm">No repositories found matching your filter criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRepos.map(repo => {
                const isLudicrous = repo.name === 'ludicrous-speed';
                const catColor = CATEGORY_COLORS[repo.aiCategory] || { bg: 'bg-slate-900', text: 'text-slate-400', border: 'border-slate-800', glow: '' };
                const CategoryIcon = CATEGORY_ICONS[repo.aiCategory] || FolderGit2;

                return (
                  <div
                    key={repo.id}
                    className={`glass rounded-2xl p-5 border transition-all flex flex-col justify-between group hover:shadow-xl ${
                      isLudicrous
                        ? 'border-pink-500/80 bg-gradient-to-b from-slate-950 via-pink-950/20 to-slate-900 hover:border-pink-400 shadow-pink-950/30'
                        : 'border-slate-800/80 hover:border-purple-600/70 hover:shadow-purple-950/20'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border font-mono flex items-center gap-1.5 ${catColor.bg} ${catColor.text} ${catColor.border}`}>
                          <CategoryIcon className="w-3 h-3" />
                          {repo.aiBadge}
                        </span>

                        <div className="flex items-center gap-2">
                          {isLudicrous && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-950 text-pink-300 border border-pink-700 animate-pulse font-mono">
                              68 PERSONAS
                            </span>
                          )}
                          <span className="text-[11px] text-slate-500 font-mono">
                            {repo.owner}
                          </span>
                        </div>
                      </div>

                      {/* Repo Name */}
                      <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                        {repo.name}
                        {isLudicrous && <Rocket className="w-4 h-4 text-pink-400" />}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 mb-4 leading-relaxed">
                        {repo.description || `Autonomous repo in ${repo.owner} fleet.`}
                      </p>

                      {/* Stats & Meta */}
                      <div className="flex items-center gap-4 text-xs text-slate-400 font-mono mb-4 flex-wrap">
                        <span className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${LANG_COLORS[repo.language] || 'bg-slate-400'}`} />
                          {repo.language}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400" />
                          {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3.5 h-3.5 text-slate-400" />
                          {repo.forks_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                          {formatSize(repo.size)}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                      <button
                        onClick={() => openRepoStudio(repo)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                          isLudicrous
                            ? 'bg-pink-950/80 hover:bg-pink-900 text-pink-200 border border-pink-700'
                            : 'bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-800'
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        Manage Repo
                      </button>

                      {isLudicrous && (
                        <button
                          onClick={() => setActiveView('ludicrous')}
                          className="py-2 px-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all flex items-center gap-1"
                          title="Open Ludicrous Fleet Hub"
                        >
                          <Rocket className="w-3.5 h-3.5" />
                          Fleet
                        </button>
                      )}

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
                        title="View on GitHub"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* REPOSITORY STUDIO WORKBENCH (When a repo is selected) */}
      {selectedRepo && (
        <div className="space-y-6 animate-slide-up">
          {/* Studio Header Card */}
          <div className="glass rounded-2xl p-6 border border-purple-800/80 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => setSelectedRepo(null)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  ← Back to Grid
                </button>
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
                      {selectedRepo.name}
                      {selectedRepo.name === 'ludicrous-speed' && <Rocket className="w-5 h-5 text-pink-400" />}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-purple-950 text-purple-300 border border-purple-800">
                      {selectedRepo.full_name}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {selectedBranch} branch
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">{selectedRepo.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => copyText(`git clone ${selectedRepo.html_url}.git`)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Clone URL
                </button>

                <a
                  href={selectedRepo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-purple-950 hover:bg-purple-900 border border-purple-700 text-purple-200 text-xs font-mono flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  GitHub Upstream
                </a>
              </div>
            </div>

            {/* Studio Navigation Tabs */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'overview', label: 'README & Overview', icon: FileText },
                { id: 'files', label: 'Code & File Tree', icon: FileCode },
                { id: 'branches', label: `Branches (${branches.length || 1})`, icon: GitBranch },
                { id: 'issues', label: `Issues (${issues.length})`, icon: Eye },
                { id: 'pulls', label: `Pull Requests (${pulls.length})`, icon: GitPullRequest },
                { id: 'releases', label: `Releases (${releases.length})`, icon: Tag },
                { id: 'ai-copilot', label: 'AI Copilot & AST Analyzer', icon: Brain },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStudioTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                      studioTab === tab.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/40'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: README & OVERVIEW */}
          {studioTab === 'overview' && (
            <div className="glass rounded-2xl p-6 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base flex items-center gap-2 font-mono">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  README.md
                </h3>
                <span className="text-xs text-slate-500 font-mono">Rendered Markdown Preview</span>
              </div>

              {loadingReadme ? (
                <div className="py-12 text-center text-slate-400 font-mono text-xs">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-purple-400" />
                  Loading README...
                </div>
              ) : (
                <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-200 leading-relaxed max-h-[600px] overflow-y-auto font-sans prose prose-invert max-w-none">
                  <ReactMarkdown>{repoReadme || 'No README available.'}</ReactMarkdown>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CODE & FILE TREE + BROWSER / COMMIT SIMULATOR */}
          {studioTab === 'files' && (
            <div className="glass rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-400">Path:</span>
                  <button
                    onClick={() => { setSelectedFile(null); fetchRepoFiles(selectedRepo.owner, selectedRepo.name, ''); }}
                    className="text-purple-400 hover:underline"
                  >
                    root (/)
                  </button>
                  {currentPath && <span className="text-slate-500">/ {currentPath}</span>}
                  {selectedFile && <span className="text-cyan-300">/ {selectedFile.split('/').pop()}</span>}
                </div>

                {selectedFile && !fileEditMode && (
                  <button
                    onClick={() => setFileEditMode(true)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit File
                  </button>
                )}
              </div>

              {/* Commit status feedback */}
              {commitFeedback && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-mono text-xs animate-slide-up">
                  {commitFeedback}
                </div>
              )}

              {/* File Explorer & Viewer Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* File Tree Left Column */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 max-h-[500px] overflow-y-auto">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Repository Files
                  </div>
                  {fileContents.map(item => (
                    <button
                      key={item.name}
                      onClick={() => handleOpenFile(item)}
                      className={`w-full text-left p-2 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                        selectedFile === item.path
                          ? 'bg-purple-950 text-purple-200 border border-purple-800'
                          : 'hover:bg-slate-900 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {item.type === 'dir' ? (
                          <FolderGit2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        ) : (
                          <FileCode className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        )}
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase">{item.type}</span>
                    </button>
                  ))}
                </div>

                {/* File Viewer / Editor Right Column */}
                <div className="lg:col-span-2 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  {selectedFile ? (
                    fileEditMode ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            Editing: {selectedFile}
                          </span>
                          <button
                            onClick={() => setFileEditMode(false)}
                            className="text-xs text-slate-500 hover:text-slate-300"
                          >
                            Cancel
                          </button>
                        </div>
                        <textarea
                          value={editedCode}
                          onChange={e => setEditedCode(e.target.value)}
                          rows={15}
                          className="w-full p-3 rounded-lg bg-black/80 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                        />
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            value={commitMessage}
                            onChange={e => setCommitMessage(e.target.value)}
                            placeholder="Commit message (e.g. Update AST parser logic)..."
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                          />
                          <button
                            onClick={handleCommitFile}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg"
                          >
                            <Save className="w-3.5 h-3.5" />
                            Commit Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-cyan-300">
                            Viewing: {selectedFile}
                          </span>
                          <button
                            onClick={() => copyText(fileContentText)}
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                          >
                            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            Copy
                          </button>
                        </div>
                        <pre className="p-4 rounded-lg bg-black/80 border border-slate-800 font-mono text-xs text-slate-300 max-h-[420px] overflow-y-auto whitespace-pre-wrap">
                          {fileContentText}
                        </pre>
                      </div>
                    )
                  ) : (
                    <div className="py-24 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center gap-2">
                      <FileCode className="w-8 h-8 text-slate-700" />
                      Select a file from the repository tree to view or edit code.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BRANCHES */}
          {studioTab === 'branches' && (
            <div className="glass rounded-2xl p-6 border border-slate-800 space-y-6">
              {/* Create Branch Bar */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white font-mono">Create New Branch:</span>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-md">
                  <input
                    type="text"
                    value={newBranchName}
                    onChange={e => setNewBranchName(e.target.value)}
                    placeholder="branch-name (e.g. feature/bt-wal-sync)..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <button
                    onClick={handleCreateBranch}
                    disabled={creatingBranch || !newBranchName.trim()}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create
                  </button>
                </div>
              </div>

              {/* Branch List */}
              <div className="space-y-3">
                {branches.map(b => (
                  <div
                    key={b.name}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <GitBranch className={`w-4 h-4 ${selectedBranch === b.name ? 'text-purple-400' : 'text-slate-500'}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white">{b.name}</span>
                          {b.protected && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                              Protected
                            </span>
                          )}
                          {selectedBranch === b.name && (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                              Active Workspace
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">Head commit: {b.commit?.sha?.substring(0, 7)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedBranch(b.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        selectedBranch === b.name
                          ? 'bg-purple-950 text-purple-300 border border-purple-800'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {selectedBranch === b.name ? 'Selected' : 'Switch Branch'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ISSUES & TASKS */}
          {studioTab === 'issues' && (
            <div className="glass rounded-2xl p-6 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Filter:</span>
                  <button
                    onClick={() => setIssueFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono ${issueFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                  >
                    All ({issues.length})
                  </button>
                  <button
                    onClick={() => setIssueFilter('open')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono ${issueFilter === 'open' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                  >
                    Open ({issues.filter(i => i.state === 'open').length})
                  </button>
                  <button
                    onClick={() => setIssueFilter('closed')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono ${issueFilter === 'closed' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400'}`}
                  >
                    Closed ({issues.filter(i => i.state === 'closed').length})
                  </button>
                </div>

                <button
                  onClick={() => setShowNewIssueModal(true)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Issue
                </button>
              </div>

              {/* Issues List */}
              <div className="space-y-3">
                {issues
                  .filter(i => issueFilter === 'all' || i.state === issueFilter)
                  .map(issue => (
                    <div
                      key={issue.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg mt-0.5 ${issue.state === 'open' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-900 text-slate-500'}`}>
                          <Eye className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs text-slate-500">#{issue.number}</span>
                            <span className="font-bold text-sm text-white">{issue.title}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{issue.body}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            {issue.labels?.map((label, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-cyan-300"
                              >
                                {label.name}
                              </span>
                            ))}
                            <span className="text-[11px] text-slate-500 font-mono">
                              by {issue.user?.login} • {new Date(issue.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                        issue.state === 'open' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-900 text-slate-500'
                      }`}>
                        {issue.state}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Create Issue Modal */}
              {showNewIssueModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
                    <h3 className="font-bold text-white text-lg font-mono">Create Repository Issue</h3>
                    <input
                      type="text"
                      value={newIssueTitle}
                      onChange={e => setNewIssueTitle(e.target.value)}
                      placeholder="Issue title..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500"
                    />
                    <textarea
                      value={newIssueBody}
                      onChange={e => setNewIssueBody(e.target.value)}
                      rows={4}
                      placeholder="Describe the issue or feature requirement..."
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setShowNewIssueModal(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateIssue}
                        disabled={!newIssueTitle.trim()}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                      >
                        Submit Issue
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PULL REQUESTS */}
          {studioTab === 'pulls' && (
            <div className="glass rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base font-mono flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-cyan-400" />
                  Pull Requests & Code Reviews
                </h3>
              </div>
              <div className="space-y-3">
                {pulls.map(pr => (
                  <div
                    key={pr.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-500">#{pr.number}</span>
                        <span className="font-bold text-sm text-white">{pr.title}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 font-mono text-xs text-slate-400">
                        <span>{pr.head?.ref} → {pr.base?.ref}</span>
                        <span className="text-emerald-400">+{pr.additions}</span>
                        <span className="text-red-400">-{pr.deletions}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                      pr.state === 'open' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {pr.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: RELEASES & TAGS */}
          {studioTab === 'releases' && (
            <div className="glass rounded-2xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base font-mono flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400" />
                  Releases & Tagged Artifacts
                </h3>
              </div>
              <div className="space-y-4">
                {releases.map(rel => (
                  <div
                    key={rel.id}
                    className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700 font-mono">
                          {rel.tag_name}
                        </span>
                        <h4 className="font-bold text-white text-sm">{rel.name}</h4>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        Published {new Date(rel.published_at).toLocaleDateString()}
                      </span>
                    </div>
                    <pre className="p-3 rounded-lg bg-black/60 border border-slate-900 font-mono text-xs text-slate-300 whitespace-pre-wrap">
                      {rel.body}
                    </pre>
                    <div className="flex items-center gap-3 pt-2">
                      <a
                        href={rel.zipball_url}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        Download .ZIP
                      </a>
                      <a
                        href={rel.tarball_url}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        Download .TAR.GZ
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: AI COPILOT & AST CODEBASE ANALYZER */}
          {studioTab === 'ai-copilot' && (
            <div className="glass rounded-2xl p-6 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 className="font-bold text-white text-base font-mono flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    AI Repo Architect & AST Security Copilot
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Automated static analysis, AST mutation check, zero-allocation memory audit, and patch generation.
                  </p>
                </div>
                <button
                  onClick={runAiAnalysis}
                  disabled={isAnalyzing}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isAnalyzing ? 'Scanning AST...' : 'Run Deep Code Audit'}
                </button>
              </div>

              {aiAnalysis ? (
                <div className="space-y-6 animate-slide-up">
                  {/* Summary & Score */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950 border border-purple-900/60 text-center">
                      <div className="text-3xl font-black text-purple-300 font-mono">{aiAnalysis.codeQualityScore}/100</div>
                      <div className="text-xs text-slate-400 mt-1 font-mono">Code Quality Score</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/60 text-center">
                      <div className="text-sm font-bold text-cyan-300 font-mono">{aiAnalysis.architecturePattern}</div>
                      <div className="text-xs text-slate-400 mt-1 font-mono">Architecture Archetype</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/60 text-center">
                      <div className="text-xs font-bold text-emerald-300 font-mono">{aiAnalysis.securityAssessment}</div>
                      <div className="text-xs text-slate-400 mt-1 font-mono">Air-Gap Security Rating</div>
                    </div>
                  </div>

                  {/* Summary Text */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 font-mono">
                      Executive AI Assessment
                    </h4>
                    <p className="text-sm text-slate-200 leading-relaxed font-sans">{aiAnalysis.summary}</p>
                  </div>

                  {/* Key Modules */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                      Detected Key Modules
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {aiAnalysis.keyModules.map((mod: any, idx: number) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white">{mod.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                              {mod.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{mod.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Patch Diff */}
                  {aiAnalysis.recommendedPatches?.length > 0 && (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" />
                          Recommended AST Optimization Patch: {aiAnalysis.recommendedPatches[0].title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-300 border border-red-800 font-mono">
                          {aiAnalysis.recommendedPatches[0].priority} Priority
                        </span>
                      </div>
                      <pre className="p-4 rounded-lg bg-black font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-900">
                        {aiAnalysis.recommendedPatches[0].diff}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-16 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center gap-3">
                  <Brain className="w-10 h-10 text-purple-900/60 animate-pulse" />
                  Click "Run Deep Code Audit" to initiate comprehensive repository telemetry & AST check.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
