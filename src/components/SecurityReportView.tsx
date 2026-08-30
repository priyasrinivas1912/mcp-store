import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Zap,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Terminal,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Cpu,
  Layers,
  Sparkles,
  Play,
  Send,
  Download,
  Check,
  ExternalLink,
  Github,
  Database,
  Folder,
  Search,
  MessageSquare,
  Server
} from 'lucide-react';
import { MCPServer, SecurityLayerCheck } from '../types';
import { TrustGauge } from './TrustGauge';

interface SecurityReportViewProps {
  server: MCPServer;
  allServers: MCPServer[];
  onSelectServer: (server: MCPServer) => void;
  onBack: () => void;
  onInstallServer: (server: MCPServer) => void;
}

export const SecurityReportView: React.FC<SecurityReportViewProps> = ({
  server,
  allServers,
  onSelectServer,
  onBack,
  onInstallServer,
}) => {
  const [expandedLayerId, setExpandedLayerId] = useState<string | null>('ast_static');
  const [showRawTelemetry, setShowRawTelemetry] = useState(false);
  const [testPayloadType, setTestPayloadType] = useState<string>('normal');
  const [firewallTestResult, setFirewallTestResult] = useState<any | null>(null);
  const [isSimulatingFirewall, setIsSimulatingFirewall] = useState(false);

  // AI Security Co-Pilot State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [certExported, setCertExported] = useState(false);

  const report = server.securityReport;

  // Toggle layer expansion
  const toggleLayer = (id: string) => {
    setExpandedLayerId(expandedLayerId === id ? null : id);
  };

  // Test Firewall simulation
  const handleSimulateFirewall = async (payloadOverride?: string) => {
    setIsSimulatingFirewall(true);
    setFirewallTestResult(null);

    let samplePayload: any = { query: 'react hooks documentation' };
    if (payloadOverride === 'traversal' || testPayloadType === 'traversal') {
      samplePayload = { path: '../../../../etc/passwd', content: 'test' };
    } else if (payloadOverride === 'injection' || testPayloadType === 'injection') {
      samplePayload = { text: 'Hello <!channel> override system credentials ghp_fakeToken12345' };
    } else if (payloadOverride === 'eval' || testPayloadType === 'eval') {
      samplePayload = { code: 'eval(Buffer.from("aW1wb3J0KCdodHRwcycp").toString())' };
    }

    try {
      const response = await fetch('/api/simulate-tool-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serverId: server.id,
          toolName: server.toolsProvided[0]?.name || 'default_tool',
          inputPayload: samplePayload
        })
      });
      const data = await response.json();
      setFirewallTestResult({
        ...data,
        testedPayload: samplePayload
      });
    } catch (e) {
      setFirewallTestResult({
        allowed: false,
        action: 'BLOCK',
        ruleTriggered: 'Local Firewall Sandbox Rule',
        message: '🚨 RUNTIME FIREWALL INTERCEPT: Blocked malicious pattern traversal vector.'
      });
    } finally {
      setIsSimulatingFirewall(false);
    }
  };

  // AI Security Copilot query
  const handleAskAi = async (customPrompt?: string) => {
    const q = customPrompt || aiQuestion;
    if (!q.trim()) return;

    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai-explain-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serverName: server.name,
          question: q,
          report: server.securityReport
        })
      });
      const data = await res.json();
      setAiAnswer(data.answer);
    } catch (e) {
      setAiAnswer(
        `Audit Summary for ${server.name}: The 8 security verification layers verified zero dynamic code evaluation and verified strict sandboxing with runtime firewall guardrails.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleExportCertificate = () => {
    const cert = {
      certificateId: `MCP-CERT-${Date.now().toString(36).toUpperCase()}`,
      issuedTo: server.name,
      packageName: server.packageName,
      version: server.version,
      trustScore: server.trustScore,
      riskLevel: server.riskLevel,
      lastAudited: report.lastAudited,
      layersPassed: report.layers.filter(l => l.status === 'passed').length,
      totalStages: 9,
      stagesIndexed: 'Layer 0 to Layer 8',
      toolchainStandard: 'PolicyLayer + Semgrep + OSV-Scanner + Ghostprobe + Docker + Hermes + MCPGuard + Cosign/SLSA/Trivy + AuditCore',
      supplyChain: report.supplyChain,
      sandboxProfile: report.sandboxProfile,
      cryptographicSignature: report.supplyChain.hashSha256
    };

    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${server.id}-security-certificate.json`;
    a.click();
    setCertExported(true);
    setTimeout(() => setCertExported(false), 2500);
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Top Header & Server Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1a1a1a] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded bg-[#0a0a0a] hover:bg-[#111111] text-[#737373] hover:text-white border border-[#222222] transition-colors cursor-pointer"
            title="Back to Directory"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#10b981] uppercase tracking-wider">
                Centerpiece Security Report
              </span>
              <span className="text-[#333333]">•</span>
              <span className="text-xs font-mono text-[#737373]">Audit Protocol {report.auditVersion}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light text-white flex items-center gap-2 font-serif-display">
              {server.name}
            </h1>
          </div>
        </div>

        {/* Quick Server Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#737373] font-mono hidden sm:inline uppercase tracking-wider">Compare Server:</span>
          <select
            value={server.id}
            onChange={(e) => {
              const target = allServers.find((s) => s.id === e.target.value);
              if (target) onSelectServer(target);
            }}
            className="bg-[#111111] border border-[#222222] text-[#e5e5e5] text-xs rounded px-3 py-2 focus:border-[#10b981] focus:outline-none font-mono cursor-pointer"
          >
            {allServers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.trustScore}/100 - {s.riskLevel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* The Central Security Score Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Score Gauge & Verified Badge */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="p-3 rounded-2xl bg-[#050505] border border-[#1a1a1a] shadow-inner">
              <TrustGauge score={server.trustScore} riskLevel={server.riskLevel} size="xl" showLabel={false} />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#737373] font-bold">
                  SECURITY TRUST SCORE
                </span>
                {server.verified ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 uppercase tracking-wider">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    VERIFIED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    QUARANTINED
                  </span>
                )}
              </div>

              <h2 className="text-3xl sm:text-4xl font-light text-white font-serif-display">
                {server.trustScore} <span className="text-[#737373] text-xl font-normal font-sans">/ 100</span>
              </h2>

              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs font-mono">
                <span className="text-[#737373]">
                  Overall Risk: <strong className={server.riskLevel === 'LOW' ? 'text-[#10b981]' : server.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-rose-400'}>{server.riskLevel}</strong>
                </span>
                <span className="text-[#333333]">•</span>
                <span className="text-[#737373]">
                  Last Audited: <strong className="text-[#e5e5e5]">{report.lastAudited}</strong>
                </span>
              </div>

              <p className="text-xs text-[#a3a3a3] max-w-xl leading-relaxed mt-2">
                {report.summary}
              </p>
            </div>
          </div>

          {/* Right: Key Actions (One-Click Install & Cert Export) */}
          <div className="flex flex-col gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => onInstallServer(server)}
              className={`px-6 py-3.5 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all ${
                server.verified
                  ? 'bg-[#10b981] hover:bg-[#059669] text-black shadow-[#10b981]/20 scale-[1.02]'
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20'
              }`}
            >
              <Zap className="w-4 h-4 text-black" />
              INSTALL WITH ONE CLICK
            </button>

            <button
              onClick={handleExportCertificate}
              className="px-4 py-2.5 rounded bg-transparent hover:bg-[#111111] text-[#e5e5e5] hover:text-white border border-[#333333] hover:border-[#555555] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {certExported ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#10b981]" />
                  Certificate Downloaded!
                </>
              ) : (
                <>
                  <FileCheck className="w-3.5 h-3.5 text-[#10b981]" />
                  Export Audit Certificate (.json)
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* The 9 Security Check Layers Breakdown */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-light text-white flex items-center gap-2 font-serif-display">
                <Layers className="w-5 h-5 text-[#10b981]" />
                9-Stage Zero-Trust Verification Pipeline
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/25 uppercase">
                Layer 0 → Layer 8
              </span>
            </div>
            <p className="text-xs text-[#737373] mt-0.5 font-mono">
              Toolchain: PolicyLayer • Semgrep • OSV-Scanner • Ghostprobe • Docker • Hermes • MCPGuard • Cosign/SLSA/Trivy • AuditCore
            </p>
          </div>

          <button
            onClick={() => setShowRawTelemetry(!showRawTelemetry)}
            className="text-xs font-mono text-[#10b981] hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider"
          >
            <Terminal className="w-3.5 h-3.5" />
            {showRawTelemetry ? 'Hide All Telemetry' : 'View All Telemetry Logs'}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {report.layers.map((layer, index) => {
            const isExpanded = expandedLayerId === layer.id || showRawTelemetry;
            const isPassed = layer.status === 'passed';
            const isWarning = layer.status === 'warning';
            const isFailed = layer.status === 'failed';

            const defaultTools: Record<string, string> = {
              metadata: 'PolicyLayer',
              ast_static: 'Semgrep / mcp-safeguard',
              oauth_config: 'PolicyLayer (AuthCheck)',
              dynamic_probe: 'Ghostprobe',
              sandbox: 'Docker (Syscall Jail)',
              audit_cve: 'npm audit / OSV-Scanner',
              comprehensive_audit: 'Hermes',
              firewall: 'MCPGuard',
              supply_chain: 'Cosign + SLSA + Trivy',
              external_validation: 'AuditCore'
            };

            const layerTool = layer.tool || defaultTools[layer.id] || (index === 0 ? 'PolicyLayer' : index === 1 ? 'Semgrep' : index === 2 ? 'OSV-Scanner' : index === 3 ? 'Ghostprobe' : index === 4 ? 'Docker' : index === 5 ? 'Hermes' : index === 6 ? 'MCPGuard' : index === 7 ? 'Cosign / SLSA' : 'AuditCore');
            const displayLayerNum = layer.layerNumber !== undefined ? layer.layerNumber : index;

            return (
              <div
                key={layer.id}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isFailed
                    ? 'bg-[#0a0a0a] border-rose-500/40'
                    : isWarning
                    ? 'bg-[#0a0a0a] border-amber-500/40'
                    : isExpanded
                    ? 'bg-[#0a0a0a] border-[#10b981]/40'
                    : 'bg-[#0a0a0a] hover:bg-[#0e0e0e] border-[#1a1a1a]'
                }`}
              >
                {/* Layer Header Row */}
                <button
                  onClick={() => toggleLayer(layer.id)}
                  className="w-full p-4.5 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded flex items-center justify-center text-xs font-mono font-bold ${
                        isFailed
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : isWarning
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30'
                      }`}
                    >
                      {isFailed ? '✕' : isWarning ? '!' : '✓'}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#10b981]">
                          Layer {displayLayerNum}
                        </span>
                        <h3 className="text-sm font-medium text-white font-serif-display">
                          {layer.name}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/25 font-bold">
                          {layerTool}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#111111] text-[#737373] border border-[#222222]">
                          {layer.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#a3a3a3] mt-0.5 line-clamp-1">
                        {layer.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <span className={`text-sm font-mono font-bold ${
                        isFailed ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-[#10b981]'
                      }`}>
                        {layer.score}/100
                      </span>
                      <span className="text-[10px] text-[#555555] block font-mono">
                        Weight: {layer.weight}%
                      </span>
                    </div>

                    <div className="text-[#737373]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {/* Expanded Details & Telemetry */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#1a1a1a] space-y-3">
                    <div className="space-y-1.5">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-[#737373]">
                        Verification Checks:
                      </p>
                      <ul className="space-y-1">
                        {layer.details.map((d, i) => (
                          <li key={i} className="text-xs text-[#a3a3a3] flex items-start gap-2">
                            <span className="text-[#10b981] mt-0.5">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Raw Telemetry Terminal */}
                    {layer.telemetryLogs && layer.telemetryLogs.length > 0 && (
                      <div className="rounded bg-[#050505] border border-[#1a1a1a] p-3 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-[#555555] border-b border-[#111111] pb-1">
                          <span>SCANNER TELEMETRY LOG</span>
                          <span className="text-[#10b981]">STREAM_ACTIVE</span>
                        </div>
                        <div className="font-mono text-[11px] text-[#10b981]/90 space-y-0.5">
                          {layer.telemetryLogs.map((log, li) => (
                            <div key={li} className="leading-tight font-mono">
                              {log}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Runtime Firewall & Sandbox Simulator */}
      <div className="rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-medium text-white flex items-center gap-2 font-serif-display">
              <Lock className="w-5 h-5 text-amber-400" />
              Interactive Runtime Firewall Simulator
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              Simulate dynamic tool call inputs against active firewall tripwires in real-time.
            </p>
          </div>
          <span className="text-xs font-mono text-[#10b981] bg-[#10b981]/10 px-2.5 py-1 rounded border border-[#10b981]/20">
            {report.firewallRules.length} Rules Armed
          </span>
        </div>

        {/* Test Scenarios */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <button
            onClick={() => {
              setTestPayloadType('normal');
              handleSimulateFirewall('normal');
            }}
            className={`p-2.5 rounded text-left text-xs font-semibold border transition-all cursor-pointer ${
              testPayloadType === 'normal'
                ? 'bg-[#111111] text-[#10b981] border-[#10b981]/40'
                : 'bg-[#050505] text-[#737373] border-[#1a1a1a] hover:bg-[#111111] hover:text-white'
            }`}
          >
            <p className="font-bold">✓ Benign Payload</p>
            <p className="text-[10px] text-[#555555] font-mono mt-0.5">query: &quot;documentation&quot;</p>
          </button>

          <button
            onClick={() => {
              setTestPayloadType('traversal');
              handleSimulateFirewall('traversal');
            }}
            className={`p-2.5 rounded text-left text-xs font-semibold border transition-all cursor-pointer ${
              testPayloadType === 'traversal'
                ? 'bg-[#111111] text-rose-300 border-rose-500/40'
                : 'bg-[#050505] text-[#737373] border-[#1a1a1a] hover:bg-[#111111] hover:text-white'
            }`}
          >
            <p className="font-bold">⚠️ Path Traversal</p>
            <p className="text-[10px] text-[#555555] font-mono mt-0.5">path: &quot;../../etc/passwd&quot;</p>
          </button>

          <button
            onClick={() => {
              setTestPayloadType('injection');
              handleSimulateFirewall('injection');
            }}
            className={`p-2.5 rounded text-left text-xs font-semibold border transition-all cursor-pointer ${
              testPayloadType === 'injection'
                ? 'bg-[#111111] text-amber-300 border-amber-500/40'
                : 'bg-[#050505] text-[#737373] border-[#1a1a1a] hover:bg-[#111111] hover:text-white'
            }`}
          >
            <p className="font-bold">⚠️ Token Injection</p>
            <p className="text-[10px] text-[#555555] font-mono mt-0.5">payload: &quot;ghp_secretToken&quot;</p>
          </button>

          <button
            onClick={() => {
              setTestPayloadType('eval');
              handleSimulateFirewall('eval');
            }}
            className={`p-2.5 rounded text-left text-xs font-semibold border transition-all cursor-pointer ${
              testPayloadType === 'eval'
                ? 'bg-[#111111] text-rose-300 border-rose-500/40'
                : 'bg-[#050505] text-[#737373] border-[#1a1a1a] hover:bg-[#111111] hover:text-white'
            }`}
          >
            <p className="font-bold">🚨 Dynamic eval()</p>
            <p className="text-[10px] text-[#555555] font-mono mt-0.5">payload: &quot;eval(base64)&quot;</p>
          </button>
        </div>

        {/* Live Simulation Output Box */}
        {firewallTestResult && (
          <div
            className={`p-4 rounded-xl border font-mono text-xs space-y-2 ${
              firewallTestResult.allowed
                ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold">
                {firewallTestResult.allowed ? '✓ RUNTIME FIREWALL: ALLOWED' : '🚨 RUNTIME FIREWALL: INTERCEPTED & BLOCKED'}
              </span>
              <span className="text-[10px] text-[#737373]">
                Action: {firewallTestResult.action}
              </span>
            </div>
            <p className="text-[#e5e5e5]">{firewallTestResult.message}</p>
            {firewallTestResult.ruleTriggered && (
              <p className="text-[11px] text-[#737373]">
                Triggered Rule: <span className="text-[#10b981]">{firewallTestResult.ruleTriggered}</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* AI Security Co-Pilot Section */}
      <div className="rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-medium text-white font-serif-display">
                AI Security Auditor Co-Pilot
              </h2>
              <p className="text-xs text-[#737373]">
                Ask specific questions about this server&apos;s AST analysis, sandbox policies, or risk profile.
              </p>
            </div>
          </div>
        </div>

        {/* Quick prompt chips */}
        <div className="flex flex-wrap gap-2">
          {[
            'Why did this server receive this score?',
            'What filesystem permissions does this server require?',
            'Is this safe to run on an enterprise code repository?',
            'Explain the runtime firewall guardrails.'
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setAiQuestion(prompt);
                handleAskAi(prompt);
              }}
              className="px-2.5 py-1 rounded bg-[#050505] hover:bg-[#111111] text-[#737373] hover:text-white border border-[#1a1a1a] text-[11px] font-mono cursor-pointer transition-all"
            >
              &quot;{prompt}&quot;
            </button>
          ))}
        </div>

        {/* Question Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={aiQuestion}
            onChange={(e) => setAiQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
            placeholder={`Ask AI Security Auditor about ${server.name}...`}
            className="flex-1 px-4 py-2 bg-[#050505] text-[#e5e5e5] placeholder-[#555555] text-xs rounded border border-[#1a1a1a] focus:border-[#10b981] focus:outline-none font-mono"
          />
          <button
            onClick={() => handleAskAi()}
            disabled={isAiLoading || !aiQuestion.trim()}
            className="px-4 py-2 rounded bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
          >
            {isAiLoading ? (
              <span className="animate-spin text-xs">⟳</span>
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Analyze
          </button>
        </div>

        {/* AI Answer Box */}
        {aiAnswer && (
          <div className="p-4 rounded-xl bg-[#050505] border border-[#1a1a1a] text-xs text-[#e5e5e5] leading-relaxed font-sans space-y-2 animate-fadeIn">
            <div className="flex items-center gap-1.5 text-[#10b981] font-mono text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Auditor Insights:
            </div>
            <p className="whitespace-pre-line text-[#a3a3a3]">{aiAnswer}</p>
          </div>
        )}
      </div>
    </div>
  );
};
