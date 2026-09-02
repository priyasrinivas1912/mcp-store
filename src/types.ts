export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityLayerCheck {
  id: string;
  layerNumber?: number; // 0 through 8 (9 total stages)
  name: string;
  category: string;
  tool?: string; // e.g. PolicyLayer, Semgrep, OSV-Scanner, Ghostprobe, Docker, Hermes, MCPGuard, Cosign+SLSA+Trivy, AuditCore
  toolPurpose?: string;
  isCoreImplemented?: boolean;
  score: number; // 0 - 100
  weight: number; // weight percentage
  status: 'passed' | 'warning' | 'failed' | 'informational';
  summary: string;
  details: string[];
  telemetryLogs: string[];
  findingsCount: {
    critical: number;
    warning: number;
    pass: number;
    info: number;
  };
}

export interface SecurityFinding {
  id: string;
  layer: string;
  severity: 'pass' | 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  recommendation?: string;
  cveId?: string;
  cvssScore?: number;
}

export interface FirewallRule {
  ruleId: string;
  description: string;
  action: 'ALLOW' | 'BLOCK' | 'PROMPT_USER';
  targetTool: string;
  patternTrigger: string;
  hitsCount: number;
  enabled: boolean;
}

export interface SecurityReport {
  overallScore: number;
  overallRisk: RiskLevel;
  verifiedBadge: boolean;
  verificationTier: 'OFFICIAL_VERIFIED' | 'COMMUNITY_VERIFIED' | 'UNVERIFIED' | 'QUARANTINED';
  lastAudited: string;
  auditVersion: string;
  summary: string;
  layers: SecurityLayerCheck[];
  findings: SecurityFinding[];
  firewallRules: FirewallRule[];
  sandboxProfile: {
    filesystemScope: 'NONE' | 'READ_ONLY' | 'SCOPED_DIRECTORY' | 'FULL';
    allowedPaths?: string[];
    networkEgress: 'ISOLATED' | 'WHITELISTED_HOSTS' | 'UNRESTRICTED';
    allowedHosts?: string[];
    processSpawning: 'BLOCKED' | 'RESTRICTED' | 'UNRESTRICTED';
    memoryLimitMb: number;
    cpuQuotaPct: number;
  };
  supplyChain: {
    slsaLevel: number;
    provenanceVerified: boolean;
    signatureAlgorithm: string;
    hashSha256: string;
    registry: string;
    maintainerReputationScore: number;
  };
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
  requiresNetwork: boolean;
  requiresFilesystem: boolean;
}

export interface MCPResource {
  uri: string;
  name: string;
  mimeType: string;
  description: string;
}

export interface MCPPrompt {
  name: string;
  description: string;
  arguments?: {
    name: string;
    description: string;
    required: boolean;
  }[];
}

export interface EnvRequirement {
  name: string;
  description: string;
  required: boolean;
  isSecret: boolean;
  placeholder?: string;
}

export interface MCPServer {
  id: string;
  name: string;
  packageName: string;
  description: string;
  longDescription: string;
  category: 'Development' | 'Databases' | 'Web & Search' | 'Productivity' | 'System & Files' | 'DevOps' | 'AI & Analytics';
  author: string;
  authorAvatar?: string;
  authorUrl?: string;
  version: string;
  license: string;
  repositoryUrl: string;
  verified: boolean;
  trustScore: number; // 0 - 100
  riskLevel: RiskLevel;
  downloads: number;
  stars: number;
  iconName: string;
  gradientColors: string;
  installCommand: string;
  transport: 'stdio' | 'sse' | 'websocket';
  executable: string;
  defaultArgs: string[];
  envRequirements: EnvRequirement[];
  toolsProvided: MCPTool[];
  resourcesProvided: MCPResource[];
  promptsProvided: MCPPrompt[];
  securityReport: SecurityReport;
  installed?: boolean;
  installedAt?: string;
  status?: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
}

export interface InstallStep {
  id: number;
  label: string;
  subtext: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  logs: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  organization?: string;
  verifiedInstallAllowed?: boolean;
  authProvider?: 'github' | 'google' | 'anthropic' | 'enterprise' | 'guest';
  accessToken?: string;
  scopes?: string[];
  authenticatedAt?: string;
  tokenExpiry?: string;
}

export type BridgeType = 'electron_ipc' | 'local_daemon' | 'file_system_api' | 'backend_proxy' | 'direct_download';

export interface BridgeStatus {
  type: BridgeType;
  name: string;
  isAvailable: boolean;
  endpoint?: string;
  latencyMs?: number;
  description: string;
  capabilities: {
    canDirectWrite: boolean;
    canExecuteProcess: boolean;
    canReadConfig: boolean;
  };
}

export interface InstallExecutionResult {
  success: boolean;
  bridgeUsed: BridgeType;
  bridgeName: string;
  server: MCPServer;
  configUpdated: boolean;
  targetConfigPath?: string;
  logs: string[];
  durationMs: number;
  claudeDesktopConfig?: Record<string, any>;
  errorMessage?: string;
}
