export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  updated_at: string;
  created_at: string;
  pushed_at: string;
  visibility: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  topics: string[];
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  archived: boolean;
  disabled: boolean;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
}

export interface AiProfileAnalysis {
  archetype: string;
  summary: string;
  primaryDomains: string[];
  signatureInnovations: string[];
  technicalStrengths: string[];
  suggestedCollaborations: string;
}

export interface RepoAnalysis {
  architectureOverview: string;
  coreComponents: string[];
  techStackHighlights: string[];
  useCases: string[];
  potentialEnhancements: string[];
  complexityScore: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface SystemStatus {
  status: string;
  service: string;
  version: string;
  cpu_load?: string;
  memory_used?: string;
  timestamp: string;
  gateway_version: string;
  vms_available: boolean;
}

export interface AppInfo {
  name: string;
  exec: string;
  description: string;
  categories: string[];
  terminal: boolean;
  icon: string;
}

export interface AppsData {
  apps: AppInfo[];
  count: number;
  timestamp: string;
}

export interface VMInfo {
  name: string;
  state: string;
  autostart: boolean;
  persistent: boolean;
  vcpu: number;
  memory: number;
}

export interface VmsData {
  vms: VMInfo[];
  count: number;
}

export interface EngineStatus {
  status: string;
  current_step: string;
  progress: number;
  last_build: string | null;
  last_logs: BuildLogEntry[];
  artifacts: EngineArtifacts;
  engine_root: string;
  build_dir: string;
}

export interface BuildLogEntry {
  type: 'build_log';
  timestamp: string;
  level: 'info' | 'debug' | 'error' | 'success';
  message: string;
}

export interface EngineArtifacts {
  executables: EngineArtifact[];
  libraries: EngineArtifact[];
  tests: EngineArtifact[];
}

export interface EngineArtifact {
  name: string;
  path: string;
  size: number;
}

export interface BuildRequest {
  build_type: string;
  clean: boolean;
  target: string;
}

export interface DreamEntry {
  id: number;
  timestamp: string;
  session: string;
  patterns: Record<string, any>;
  insights: string[];
  context_snapshot: Record<string, any>;
  created_at: string;
}

export interface DreamData {
  dreams: DreamEntry[];
  count: number;
}

export interface WebSocketMessage {
  type: 'build_log' | 'build_state' | 'pong' | 'error' | 'inventory' | 'auth';
  payload?: any;
  timestamp?: string;
}

export interface LanguageStats {
  language: string;
  bytes: number;
  percentage: number;
  color: string;
}

export interface GitHubLanguageData {
  [language: string]: number;
}

export interface ArxivPaper {
  id: string;
  arxivId: string;
  title: string;
  summary: string;
  published: string;
  updated: string;
  authors: string[];
  pdfUrl: string;
  arxivUrl: string;
  categories: string[];
  primaryCategory: string;
  comment?: string;
}

export interface ArxivDeepDiveRepo {
  repoName: string;
  description: string;
  coreFiles: string[];
  arxivMatches: {
    arxivId: string;
    title: string;
    finding: string;
  }[];
}

export interface ArxivDeepDiveData {
  framework: string;
  crossReferences: ArxivDeepDiveRepo[];
}

export interface LocalAgentModel {
  name: string;
  size: string;
  quant: string;
  target: string;
}

export interface LocalAgentStatus {
  status: string;
  engine: string;
  ollama: {
    online: boolean;
    host: string;
    configuredModels: LocalAgentModel[];
    discoveredModels: any[];
  };
  hermes: {
    activeCycle: number;
    mode: string;
    activeNodes: number;
    lastStateSnapshot: string;
    gitSyncTransport: string;
    crucibleStatus: string;
    pantheonShards: number;
  };
}

export interface HermesCycleResult {
  id: string;
  timestamp: string;
  node: string;
  attempt: number;
  hypothesis: string;
  action: string;
  result: 'SUCCESS' | 'REBIRTH' | 'FRACTURE';
  learning: string;
  stateSnapshotPath: string;
}

export interface GitHubRawFile {
  repo: string;
  path: string;
  content: string;
  branch: string;
}

export interface SelfDevTask {
  id: string;
  title: string;
  repo: string;
  targetFile: string;
  description: string;
  arxivRef: string;
  category: string;
  status: string;
  complexity: 'Low' | 'Medium' | 'High';
}

export interface SelfDevSynthesisResult {
  success: boolean;
  explanation: string;
  code: string;
  diff: string;
  unitTest: string;
  arxivGrounding: string;
  fitnessScore: number;
  executionMetrics: {
    latencyMs: number;
    memoryDeltaKb: number;
    tokenEfficiency: string;
  };
  modelUsed: string;
}

export interface GepaEvolutionResult {
  success: boolean;
  targetSkill: string;
  baselineFitness: number;
  finalFitness: number;
  improvementPct: string;
  generations: {
    generation: number;
    strategy: string;
    fitnessScore: number;
    passedCases: string;
    status: string;
    mutationDiff: string;
  }[];
  stateCommitted: string;
  timestamp: string;
}

export interface ArxivBugfixResult {
  success: boolean;
  paperTitle: string;
  arxivId: string;
  targetRepo: string;
  targetFile: string;
  modelUsed: string;
  diagnosis: string;
  algorithmicFix: string;
  diff: string;
  fullCode: string;
  unitTest: string;
  arxivCitations: string;
  metrics: {
    latencyImprovement: string;
    vramSavings: string;
    astReliability: string;
    verifiedTokensPerSec: string;
  };
}
