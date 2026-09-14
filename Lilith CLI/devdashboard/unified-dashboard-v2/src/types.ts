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

// ===== VOID RUNTIME TYPES =====

export interface VoidStatus {
  service: string;
  runtime_root: string;
  entry_point: string;
  active_executions: number;
  queued: number;
  max_concurrent: number;
  profiles: string[];
}

export interface VoidExecution {
  success: boolean;
  output?: string;
  error?: string;
  execution_time_ms?: number;
  mode: string;
  profile: string;
}

export interface VoidExecutionHistory {
  executions: VoidExecution[];
  total: number;
}

// ===== MOD ENGINE TYPES =====

export interface ModBuildResult {
  jobId: string;
  success: boolean;
  code?: number;
  stdout?: string;
  stderr?: string;
}

export interface ModDeployResult {
  jobId: string;
  success: boolean;
  action?: string;
  source?: string;
  destination?: string;
  type?: string;
  modName?: string;
  error?: string;
}

export interface ModScanResult {
  mods: Array<{ path: string; name: string }>;
  count: number;
}

export interface ModCETStatus {
  cetActive: boolean;
  cetLog: string;
  logSize: number;
  note: string;
  traps?: Record<string, string>;
}

export interface ModQuickResult {
  success: boolean;
  message?: string;
  build?: ModBuildResult;
  deploy?: ModDeployResult;
  step?: string;
}

export interface ModJob {
  jobId: string;
  status: string;
  modDir?: string;
  code?: number;
  stdout?: string;
  stderr?: string;
  action?: string;
  source?: string;
  destination?: string;
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
