export interface PipelineStageSpec {
  layerNumber: number; // 0 through 8
  layerId: string;
  name: string;
  category: string;
  toolName: string;
  toolAlias?: string;
  purpose: string;
  mechanism: string;
  statusInPrototype: 'LIVE_IMPLEMENTED' | 'MCP_RESEARCH_STUB';
  paperReference: string;
  inputs: string[];
  outputs: string[];
  weight: number;
}

export const NINE_STAGE_SECURITY_PIPELINE: PipelineStageSpec[] = [
  {
    layerNumber: 0,
    layerId: 'metadata',
    name: 'Metadata / Maintainer Risk',
    category: 'Identity & Reputation',
    toolName: 'PolicyLayer',
    toolAlias: 'mcp-authcheck',
    purpose: 'Repository & maintainer KYC, SPDX license compliance, and namespace typosquatting prevention.',
    mechanism: 'Scans package metadata against verified registry keys, checks account age, 2FA status, and Levenshtein similarity to legitimate MCP tools.',
    statusInPrototype: 'LIVE_IMPLEMENTED',
    paperReference: 'IEEE Section IV-A (Layer 0: PolicyLayer Risk Engine)',
    inputs: ['package.json', 'GitHub Repo Metadata', 'SPDX Identifier'],
    outputs: ['Maintainer Trust Score', 'Typosquatting Risk Metric', 'License Validity'],
    weight: 10
  },
  {
    layerNumber: 1,
    layerId: 'ast_static',
    name: 'Static Code Analysis',
    category: 'Source Vulnerabilities',
    toolName: 'Semgrep / mcp-safeguard',
    toolAlias: 'mcp-safeguard AST Engine',
    purpose: 'Detects arbitrary code execution sinks, eval() injection, child_process execution, and prototype pollution.',
    mechanism: 'Traverses the Abstract Syntax Tree (AST) using specialized Semgrep rules and mcp-safeguard taint tracking to flag dangerous sink invocations.',
    statusInPrototype: 'LIVE_IMPLEMENTED',
    paperReference: 'IEEE Section IV-B (Layer 1: Static AST & Taint Tracking)',
    inputs: ['TypeScript / JavaScript Source Code', 'AST Parser Rules'],
    outputs: ['Sink Invocations (eval/exec)', 'Prototype Pollution Alerts', 'ReDoS Vectors'],
    weight: 15
  },
  {
    layerNumber: 2,
    layerId: 'dependency_scan',
    name: 'Dependency & CVE Scan',
    category: 'Vulnerability Databases',
    toolName: 'npm audit / OSV-Scanner',
    toolAlias: 'Open Source Vulnerabilities (OSV)',
    purpose: 'Identifies known CVEs and high-severity security advisories across direct and transitive dependencies.',
    mechanism: 'Queries Google OSV database and GitHub Security Advisories for cryptographic dependency hashes, cross-referencing CVSS scores.',
    statusInPrototype: 'LIVE_IMPLEMENTED',
    paperReference: 'IEEE Section IV-C (Layer 2: Transitive Dependency Audit)',
    inputs: ['package-lock.json', 'pnpm-lock.yaml', 'OSV / NVD Databases'],
    outputs: ['CVE Matches', 'CVSS Score Breakdown', 'Fix Recommendations'],
    weight: 10
  },
  {
    layerNumber: 3,
    layerId: 'dynamic_probe',
    name: 'Dynamic Testing & Fuzzing',
    category: 'Behavioral Fuzzing',
    toolName: 'Ghostprobe',
    toolAlias: 'MCP JSON-RPC Fuzz Harness',
    purpose: 'Live behavioral testing and fuzzing of running MCP server endpoints under mutated JSON-RPC packets.',
    mechanism: 'Injects thousands of mutated RPC frames, null bytes, unicode payloads, and boundary conditions to detect process crashes and unhandled exceptions.',
    statusInPrototype: 'MCP_RESEARCH_STUB',
    paperReference: 'IEEE Section IV-D (Layer 3: Ghostprobe Behavioral Fuzzing)',
    inputs: ['Running MCP stdio / SSE Daemon', 'Mutated JSON-RPC Seed Packets'],
    outputs: ['Crash Logs', 'Latency Spikes', 'RPC Exception Handlers'],
    weight: 15
  },
  {
    layerNumber: 4,
    layerId: 'sandbox',
    name: 'Runtime Sandbox Isolation',
    category: 'System Isolation',
    toolName: 'Docker',
    toolAlias: 'Syscall Jail / Chroot',
    purpose: 'Executes MCP server in an isolated sandbox environment with hardware resource caps and restricted permissions.',
    mechanism: 'Containerizes process using Docker/cgroups, chroot filesystems to scoped directories, and enforces strict outbound network whitelisting.',
    statusInPrototype: 'LIVE_IMPLEMENTED',
    paperReference: 'IEEE Section IV-E (Layer 4: Sandboxed Execution Environment)',
    inputs: ['Docker OCI Profile', 'Filesystem Scope Policy', 'Egress Whitelist'],
    outputs: ['Blocked Syscalls (fs/net)', 'Memory / CPU Utilization Quotas'],
    weight: 15
  },
  {
    layerNumber: 5,
    layerId: 'comprehensive_audit',
    name: 'Comprehensive Audit Aggregator',
    category: 'Composite Triage',
    toolName: 'Hermes',
    toolAlias: 'mcp-audit Multi-Check',
    purpose: 'Aggregates multiple security checks (static, dynamic, config) into a single composite security triage index.',
    mechanism: 'Fuses telemetry logs from Layers 0-4 through a weighted heuristic Bayesian matrix to eliminate false positives and calculate composite risk.',
    statusInPrototype: 'MCP_RESEARCH_STUB',
    paperReference: 'IEEE Section IV-F (Layer 5: Hermes Composite Audit Engine)',
    inputs: ['Telemetry streams from Layers 0-4', 'Domain Policy Weights'],
    outputs: ['Unified Security Score', 'Aggregated Finding Matrix'],
    weight: 10
  },
  {
    layerNumber: 6,
    layerId: 'runtime_firewall',
    name: 'Runtime Protection & Firewall',
    category: 'Active Guardrails',
    toolName: 'MCPGuard',
    toolAlias: 'Prompt & Tool Interceptor',
    purpose: 'Monitors runtime tool invocations, parameter tripwires, prompt injection patterns, and human-in-the-loop approvals.',
    mechanism: 'Acts as a transparent proxy between MCP Client (Claude/Cursor) and Server, dynamically intercepting unauthorized tool calls or payload leaks.',
    statusInPrototype: 'LIVE_IMPLEMENTED',
    paperReference: 'IEEE Section IV-G (Layer 6: MCPGuard Active Guardrails)',
    inputs: ['Live Tool Invocation Payloads', 'Firewall Rules Matrix'],
    outputs: ['Interception Decision (ALLOW/BLOCK/PROMPT)', 'Audit Trail Logs'],
    weight: 10
  },
  {
    layerNumber: 7,
    layerId: 'supply_chain',
    name: 'Supply Chain & Container Scan',
    category: 'Package Integrity',
    toolName: 'Cosign + SLSA + Trivy',
    toolAlias: 'Sigstore / Rekor / SBOM',
    purpose: 'Verifies container & package integrity, SLSA Level 3 build provenance, and container image vulnerabilities.',
    mechanism: 'Validates keyless cryptographic signatures against Sigstore Rekor transparency logs and runs Trivy container vulnerability scanner on release artifacts.',
    statusInPrototype: 'LIVE_IMPLEMENTED',
    paperReference: 'IEEE Section IV-H (Layer 7: SLSA & Trivy Supply Chain Verification)',
    inputs: ['OCI Container Image', 'Sigstore Rekor Log', 'SLSA Attestation'],
    outputs: ['Cryptographic Provenance Verified', 'Trivy Scan Report', 'SBOM Hashes'],
    weight: 10
  },
  {
    layerNumber: 8,
    layerId: 'external_validation',
    name: 'External Validation & Attestation',
    category: 'Third-Party Certification',
    toolName: 'AuditCore',
    toolAlias: 'MCP Registry Certificate Authority',
    purpose: 'Provides independent third-party assessment and issues cryptographically signed MCP-Store Security Certificates.',
    mechanism: 'Synthesizes all pipeline telemetry into an immutable cryptographic attestation token published to the verified MCP registry index.',
    statusInPrototype: 'MCP_RESEARCH_STUB',
    paperReference: 'IEEE Section IV-I (Layer 8: AuditCore External Attestation)',
    inputs: ['Complete Pipeline Verification Bundle', 'Maintainer Signature'],
    outputs: ['Cryptographic Registry Certificate', 'Verified Badge Issuance'],
    weight: 5
  }
];

export const PROTOTYPE_PIPELINE_FLOW = [
  { step: 1, name: 'GitHub API / Ingestion', tool: 'GitHub REST/GraphQL API', note: 'Fetches source tree, commit hashes, maintainer metadata' },
  { step: 2, name: 'Static AST Analysis', tool: 'Semgrep / mcp-safeguard', note: 'AST parsing, dangerous sink identification (eval, exec)' },
  { step: 3, name: 'Dependency Vulnerability Scan', tool: 'npm audit / OSV-Scanner', note: 'Advisory database lookups, CVE severity classification' },
  { step: 4, name: 'Container Isolation & Sandbox', tool: 'Docker Sandbox', note: 'Isolated container runtime with syscall monitoring' },
  { step: 5, name: 'Container Image Vulnerability Scan', tool: 'Trivy', note: 'Scans base image layers for OS-level CVEs and secrets' },
  { step: 6, name: 'Cryptographic Supply Chain Attestation', tool: 'Cosign + SLSA Level 3', note: 'Sigstore keyless signatures, Rekor transparency log verification' },
  { step: 7, name: 'Dynamic & Composite Scoring Engine', tool: 'Hermes + MCPGuard + PolicyLayer', note: 'Calculates composite 0-100 Trust Score and active firewall rules' },
  { step: 8, name: 'Security Report & Verified Certificate', tool: 'AuditCore Certificate Authority', note: 'Generates exportable JSON audit certificate and client config' }
];

export const IEEE_TAXONOMY_NOTE = {
  title: 'IEEE Research Paper Architecture Correction: 9-Stage Pipeline (Layer 0 to Layer 8)',
  content: `In the original draft manuscript, the system was colloquially described as an "8-layer security architecture", but formally encompassed 9 distinct execution stages indexed from Layer 0 through Layer 8. For the final IEEE conference paper, the taxonomy is formally standardized as the **9-Stage MCP Security Verification Pipeline (Layer 0: PolicyLayer → Layer 8: AuditCore)**.
  
In this prototype implementation:
• Core Practical Pipeline: GitHub API → Semgrep → OSV-Scanner / npm audit → Docker → Trivy → Cosign/SLSA → Composite Score Engine → Verified Certificate.
• MCP Research Stubs: Ghostprobe (Dynamic RPC Fuzzing), Hermes (Multi-Audit Fusion), and AuditCore (Third-party Attestation) are cleanly integrated with simulated telemetry and verification states.`
};
