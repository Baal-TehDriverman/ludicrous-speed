import { GitHubUser, GitHubRepo, AiProfileAnalysis, RepoAnalysis, ChatMessage, SystemStatus, AppsData, AppInfo, VmsData, EngineStatus, BuildRequest, EngineArtifacts, DreamData } from './types';

const API_BASE = '/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new ApiError(response.status, error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// GitHub API
export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  return fetchJson<GitHubUser>(`${API_BASE}/github/user/${encodeURIComponent(username)}`);
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  return fetchJson<GitHubRepo[]>(`${API_BASE}/github/user/${encodeURIComponent(username)}/repos`);
}

export async function fetchRepoReadme(owner: string, repo: string): Promise<string> {
  const response = await fetch(`${API_BASE}/github/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`);
  if (!response.ok) throw new ApiError(response.status, 'Failed to fetch README');
  return response.text();
}

export async function fetchRepoContents(owner: string, repo: string, path: string = ''): Promise<any[]> {
  return fetchJson<any[]>(`${API_BASE}/github/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${encodeURIComponent(path)}`);
}

export async function fetchRepoCommits(owner: string, repo: string): Promise<any[]> {
  return fetchJson<any[]>(`${API_BASE}/github/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits`);
}

export async function fetchRepoLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  return fetchJson<Record<string, number>>(`${API_BASE}/github/repo/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`);
}

// AI Analysis
export async function analyzeProfile(username: string, profile: GitHubUser, repos: GitHubRepo[]): Promise<AiProfileAnalysis> {
  return fetchJson<AiProfileAnalysis>(`${API_BASE}/gemini/analyze-profile`, {
    method: 'POST',
    body: JSON.stringify({ username, profile, repos }),
  });
}

export async function analyzeRepo(repo: GitHubRepo, readmeText: string, languageBreakdown: Record<string, number>): Promise<RepoAnalysis> {
  return fetchJson<RepoAnalysis>(`${API_BASE}/gemini/analyze-repo`, {
    method: 'POST',
    body: JSON.stringify({ repo, readmeText, languageBreakdown }),
  });
}

export async function chatWithAi(username: string, selectedRepo: GitHubRepo | null, userQuery: string, history: ChatMessage[]): Promise<string> {
  const response = await fetchJson<{ text: string }>(`${API_BASE}/gemini/chat`, {
    method: 'POST',
    body: JSON.stringify({ username, selectedRepo, userQuery, history }),
  });
  return response.text;
}

// Lilith Gateway API
export async function fetchSystemStatus(): Promise<SystemStatus> {
  return fetchJson<SystemStatus>(`${API_BASE}/gateway/status`);
}

export async function fetchApps(): Promise<AppsData> {
  return fetchJson<AppsData>(`${API_BASE}/gateway/apps`);
}

export async function searchApps(query: string): Promise<{ apps: AppInfo[]; count: number; query: string }> {
  return fetchJson(`${API_BASE}/gateway/apps/search/${encodeURIComponent(query)}`);
}

export async function launchApp(appName: string): Promise<{ status: string; name: string }> {
  return fetchJson(`${API_BASE}/gateway/apps/launch/${encodeURIComponent(appName)}`, {
    method: 'POST',
  });
}

export async function fetchVMs(): Promise<VmsData> {
  return fetchJson<VmsData>(`${API_BASE}/gateway/vms`);
}

export async function vmAction(action: 'start' | 'shutdown' | 'reset' | 'destroy' | 'reboot', vmName: string): Promise<{ status: string; action: string; vm: string }> {
  return fetchJson(`${API_BASE}/gateway/vms/${action}/${encodeURIComponent(vmName)}`, {
    method: 'POST',
  });
}

export async function openVmConsole(vmName: string): Promise<{ status: string; vm: string }> {
  return fetchJson(`${API_BASE}/gateway/vms/console/${encodeURIComponent(vmName)}`, {
    method: 'POST',
  });
}

export async function openVmManager(): Promise<{ status: string }> {
  return fetchJson(`${API_BASE}/gateway/vms/manager`, {
    method: 'POST',
  });
}

export async function fetchCategories(): Promise<{ categories: Record<string, number>; total_apps: number }> {
  return fetchJson(`${API_BASE}/gateway/categories`);
}

// BlackSpace Engine API
export async function fetchEngineStatus(): Promise<EngineStatus> {
  return fetchJson<EngineStatus>(`${API_BASE}/gateway/engine/status`);
}

export async function triggerEngineBuild(request: BuildRequest): Promise<{ status: string; message: string; task_id: number }> {
  return fetchJson(`${API_BASE}/gateway/engine/build`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function fetchEngineArtifacts(): Promise<{ artifacts: EngineArtifacts }> {
  return fetchJson(`${API_BASE}/gateway/engine/artifacts`);
}

export async function runEngineTests(): Promise<{ status: string; message: string; task_id: number }> {
  return fetchJson(`${API_BASE}/gateway/engine/test`, {
    method: 'POST',
  });
}

export async function fetchRomStatus(): Promise<{ found: boolean; path: string; size?: number; modified?: number }> {
  return fetchJson(`${API_BASE}/gateway/engine/rom/status`);
}

// MSN Cyberpunk Mod API — wired to Lilith CLI mod-engine REST endpoints
export async function fetchMsnStatus(): Promise<{ status: string; port: number; health: boolean }> {
  return fetchJson<{ status: string; port: number; health: boolean }>(`${API_BASE}/mod/status`);
}

export async function fetchCyberpunkModStatus(): Promise<{
  deployed: boolean;
  fresh: boolean;
  logs_available: boolean;
  archives_present: boolean;
  latest_redscript: string | null;
  deployed_redscripts: number;
  deployed_tweakdb: number;
}> {
  const cet = await fetchJson<{ cetActive: boolean; cetLog: string; logSize: number; note: string }>(`${API_BASE}/mod/cet`);
  return {
    deployed: cet.cetActive,
    fresh: cet.logSize > 0,
    logs_available: cet.logSize > 0,
    archives_present: true,
    latest_redscript: null,
    deployed_redscripts: 0,
    deployed_tweakdb: 0,
  };
}

export async function verifyModDeployment(): Promise<{ status: string; detail: string }> {
  const cet = await fetchJson<{ cetActive: boolean; cetLog: string; logSize: number; note: string }>(`${API_BASE}/mod/cet`);
  return {
    status: cet.cetActive ? 'verified' : 'unverified',
    detail: cet.note,
  };
}

// Abyssal Assets API
export async function fetchAbyssalStatus(): Promise<{ status: string; port: number; health: boolean }> {
  return fetchJson(`${API_BASE}/gateway/abyssal/status`);
}

// Kairos Dream API
export async function fetchDreams(limit: number = 50): Promise<DreamData> {
  return fetchJson<DreamData>(`${API_BASE}/dreams?limit=${limit}`);
}

export async function triggerDreamCycle(session: string = 'zelda-engine'): Promise<any> {
  return fetchJson(`${API_BASE}/dreams/trigger`, {
    method: 'POST',
    body: JSON.stringify({ session }),
  });
}

// ArXiv Academic Research API
export async function fetchArxivPapers(
  query: string = 'all:autonomous llm agent self-evolution',
  maxResults: number = 12,
  sortBy: string = 'relevance'
): Promise<{ query: string; totalResults: number; papers: import('./types').ArxivPaper[]; fallback?: boolean; error?: string }> {
  return fetchJson(`${API_BASE}/arxiv/search?q=${encodeURIComponent(query)}&max_results=${maxResults}&sortBy=${encodeURIComponent(sortBy)}`);
}

export async function fetchArxivDeepDive(): Promise<import('./types').ArxivDeepDiveData> {
  return fetchJson(`${API_BASE}/arxiv/deep-dive`);
}

// Local Agent & Ollama/Hermes API
export async function fetchLocalAgentStatus(): Promise<import('./types').LocalAgentStatus> {
  return fetchJson(`${API_BASE}/agents/local-status`);
}

export async function executeHermesCycle(
  nodeName: string = 'Paradox Seed (Node 09)',
  hypothesis: string = 'Adaptive self-refinement cycle'
): Promise<{ success: boolean; cycle: import('./types').HermesCycleResult }> {
  return fetchJson(`${API_BASE}/agents/hermes/execute-cycle`, {
    method: 'POST',
    body: JSON.stringify({ nodeName, hypothesis }),
  });
}

// GitHub Raw File Proxy
export async function fetchGitHubRawFile(
  repo: string,
  path: string,
  owner: string = 'Baal-TehDriverman'
): Promise<import('./types').GitHubRawFile> {
  return fetchJson(`${API_BASE}/github/file-raw?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(path)}&owner=${encodeURIComponent(owner)}`);
}

// Self-Development Meta-Studio API ("Develop App with App")
export async function fetchSelfDevTasks(): Promise<{ tasks: import('./types').SelfDevTask[] }> {
  return fetchJson(`${API_BASE}/self-dev/tasks`);
}

export async function synthesizeSelfDevCode(payload: {
  taskTitle: string;
  prompt: string;
  targetRepo: string;
  targetFile: string;
  modelType?: string;
  arxivRef?: string;
}): Promise<import('./types').SelfDevSynthesisResult> {
  return fetchJson(`${API_BASE}/self-dev/synthesize`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function runGepaCycle(
  targetSkill: string = 'tool_call_precision',
  iterations: number = 4
): Promise<import('./types').GepaEvolutionResult> {
  return fetchJson(`${API_BASE}/self-dev/run-gepa-cycle`, {
    method: 'POST',
    body: JSON.stringify({ targetSkill, iterations }),
  });
}

// ArXiv Research to Bugfix & Code Updater API
export async function generateArxivBugfixPatch(payload: {
  paperTitle: string;
  arxivId: string;
  paperSummary: string;
  targetRepo: string;
  targetFile: string;
  bugDescription: string;
  modelType?: string;
}): Promise<import('./types').ArxivBugfixResult> {
  return fetchJson(`${API_BASE}/arxiv/bugfix-update`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}


// Utility functions
export function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} GB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} MB`;
  return `${bytes} KB`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    Python: '#3776AB',
    'C++': '#f34b7d',
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Redscript: '#ff2c4d',
    Shell: '#89e051',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Rust: '#dea584',
    Go: '#00ADD8',
    Lua: '#000080',
    C: '#555555',
    CMake: '#064F8C',
    Dockerfile: '#384d54',
    Makefile: '#427819',
    YAML: '#cb171e',
    JSON: '#292929',
    Markdown: '#083fa1',
  };
  return colors[language] || '#64748b';
}

// ===== VOID RUNTIME API =====
import type { VoidStatus, VoidExecution, VoidExecutionHistory } from './types';

// ===== MOD ENGINE API =====
import type { ModBuildResult, ModDeployResult, ModScanResult, ModCETStatus, ModQuickResult } from './types';

export async function fetchModStatus(): Promise<{ status: string; activeJobs: number; jobs: any[]; gtcRoot: string; archiveMods: string; cet: ModCETStatus }> {
  return fetchJson<{ status: string; activeJobs: number; jobs: any[]; gtcRoot: string; archiveMods: string; cet: ModCETStatus }>(`${API_BASE}/mod/status`);
}

export async function buildMod(request: { modDir: string; clean?: boolean; output?: string }): Promise<ModBuildResult> {
  return fetchJson<ModBuildResult>(`${API_BASE}/mod/build`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function deployMod(request: { modName: string; sourcePath: string; type: string }): Promise<ModDeployResult> {
  return fetchJson<ModDeployResult>(`${API_BASE}/mod/deploy`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function verifyMod(request: { modName: string; checkType?: string }): Promise<{ modName: string; cet: ModCETStatus; checkType: string; note: string }> {
  return fetchJson<{ modName: string; cet: ModCETStatus; checkType: string; note: string }>(`${API_BASE}/mod/verify`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function scanMods(directory?: string): Promise<ModScanResult> {
  const params = directory ? `?directory=${encodeURIComponent(directory)}` : '';
  return fetchJson<ModScanResult>(`${API_BASE}/mod/scan${params}`);
}

export async function fetchCETStatus(): Promise<ModCETStatus> {
  return fetchJson<ModCETStatus>(`${API_BASE}/mod/cet`);
}

export async function quickBuild(request: { modDir: string; modName: string; type: string }): Promise<ModQuickResult> {
  return fetchJson<ModQuickResult>(`${API_BASE}/mod/quick`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function registerHook(hookName: string, command: string): Promise<{ success: boolean; hook: string; command: string }> {
  return fetchJson<{ success: boolean; hook: string; command: string }>(`${API_BASE}/mod/hooks/${encodeURIComponent(hookName)}`, {
    method: 'POST',
    body: JSON.stringify({ command }),
  });
}

export async function fetchModHistory(): Promise<{ history: any[]; count: number }> {
  return fetchJson<{ history: any[]; count: number }>(`${API_BASE}/mod/history`);
}

export async function fetchVoidStatus(): Promise<VoidStatus> {
  return fetchJson<VoidStatus>(`${API_BASE}/void/status`);
}

export async function executeVoid(request: { code: string; mode: string; profile: string; timeout_ms?: number }): Promise<VoidExecution> {
  return fetchJson<VoidExecution>(`${API_BASE}/void/exec`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function fetchVoidHistory(): Promise<VoidExecutionHistory> {
  return fetchJson<VoidExecutionHistory>(`${API_BASE}/void/history`);
}

