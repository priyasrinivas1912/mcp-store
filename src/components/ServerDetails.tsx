import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Star,
  Download,
  Github,
  ExternalLink,
  Code,
  Lock,
  Layers,
  Terminal,
  Copy,
  Check,
  Cpu,
  Folder,
  Database,
  Search,
  MessageSquare,
  Server,
  AlertTriangle
} from 'lucide-react';
import { MCPServer } from '../types';
import { TrustGauge } from './TrustGauge';

interface ServerDetailsProps {
  server: MCPServer;
  onBack: () => void;
  onViewSecurityReport: (server: MCPServer) => void;
  onInstallServer: (server: MCPServer) => void;
}

export const ServerDetails: React.FC<ServerDetailsProps> = ({
  server,
  onBack,
  onViewSecurityReport,
  onInstallServer,
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'config' | 'security' | 'env'>('tools');
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [selectedClient, setSelectedClient] = useState<'claude' | 'cursor' | 'windsurf'>('claude');

  // Config snippet generation
  const getClientConfigJson = () => {
    const envObj: Record<string, string> = {};
    server.envRequirements.forEach(e => {
      envObj[e.name] = e.placeholder || 'YOUR_API_KEY_HERE';
    });

    if (selectedClient === 'claude') {
      return JSON.stringify(
        {
          mcpServers: {
            [server.id]: {
              command: server.executable,
              args: server.defaultArgs,
              ...(Object.keys(envObj).length > 0 ? { env: envObj } : {})
            }
          }
        },
        null,
        2
      );
    }

    if (selectedClient === 'cursor') {
      return JSON.stringify(
        {
          mcp: {
            servers: [
              {
                name: server.name,
                type: server.transport,
                command: `${server.executable} ${server.defaultArgs.join(' ')}`,
                env: envObj
              }
            ]
          }
        },
        null,
        2
      );
    }

    return JSON.stringify(
      {
        servers: {
          [server.id]: {
            command: server.executable,
            args: server.defaultArgs,
            env: envObj
          }
        }
      },
      null,
      2
    );
  };

  const copyConfig = () => {
    navigator.clipboard.writeText(getClientConfigJson());
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'github': return <Github className="w-full h-full" />;
      case 'postgres': return <Database className="w-full h-full" />;
      case 'filesystem': return <Folder className="w-full h-full" />;
      case 'brave-search': return <Search className="w-full h-full" />;
      case 'slack': return <MessageSquare className="w-full h-full" />;
      case 'unverified-crypto-scraper': return <AlertTriangle className="w-full h-full" />;
      default: return <Server className="w-full h-full" />;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#737373] hover:text-white transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </button>

      {/* Hero Header Card */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#111111] border border-[#222222] p-3.5 flex items-center justify-center text-[#10b981] shadow-inner shrink-0">
              {getIcon(server.id)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-light text-white font-serif-display">{server.name}</h1>
                {server.verified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Official
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 uppercase tracking-widest">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Quarantined / Unverified
                  </span>
                )}
              </div>

              <p className="text-xs text-[#737373] font-mono mt-1">
                {server.packageName} • v{server.version} • {server.license} License
              </p>

              <p className="text-xs text-[#a3a3a3] mt-2 max-w-2xl leading-relaxed">
                {server.longDescription || server.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[#737373] font-mono">
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5 text-[#555555]" />
                  {server.downloads.toLocaleString()} installs
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {server.stars.toLocaleString()} stars
                </span>
                <a
                  href={server.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[#10b981] hover:underline"
                >
                  <Github className="w-3.5 h-3.5" />
                  Repository
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Trust Score & CTA Box */}
          <div className="flex flex-row lg:flex-col items-center justify-between w-full lg:w-auto p-4 rounded-xl bg-[#050505] border border-[#1a1a1a] gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <TrustGauge score={server.trustScore} riskLevel={server.riskLevel} size="md" showLabel={true} />
              <div className="hidden sm:block lg:hidden">
                <p className="text-xs font-semibold text-white">Trust Rating</p>
                <p className="text-[10px] text-[#737373] font-mono">Audited Aug 2026</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={() => onViewSecurityReport(server)}
                className="w-full px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold border border-[#333333] hover:border-[#555555] bg-transparent hover:bg-[#111111] text-[#e5e5e5] flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                Security Report
              </button>

              <button
                onClick={() => onInstallServer(server)}
                className={`w-full px-5 py-2.5 rounded text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  server.installed
                    ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 hover:bg-[#10b981]/20'
                    : 'bg-[#10b981] hover:bg-[#059669] text-black font-bold'
                }`}
              >
                <Zap className="w-4 h-4" />
                {server.installed ? 'Connected (Reinstall)' : 'One-Click Install'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#1a1a1a] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'tools'
              ? 'bg-[#111111] text-white border border-[#222222]'
              : 'text-[#737373] hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5 text-[#10b981]" />
          Exposed Tools ({server.toolsProvided.length})
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'config'
              ? 'bg-[#111111] text-white border border-[#222222]'
              : 'text-[#737373] hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          Client Config JSON
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-[#111111] text-white border border-[#222222]'
              : 'text-[#737373] hover:text-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-[#10b981]" />
          Security & Sandboxing
        </button>

        <button
          onClick={() => setActiveTab('env')}
          className={`px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'env'
              ? 'bg-[#111111] text-white border border-[#222222]'
              : 'text-[#737373] hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-violet-400" />
          Environment Secrets ({server.envRequirements.length})
        </button>
      </div>

      {/* Tab 1: Tools & Parameters Inspector */}
      {activeTab === 'tools' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#737373] font-mono uppercase tracking-widest">
              JSON-RPC Capabilities & Methods
            </h2>
            <span className="text-xs text-[#737373] font-mono">Transport: {server.transport}</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {server.toolsProvided.map((tool) => (
              <div
                key={tool.name}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-4 shadow-md space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-bold text-[#10b981] bg-[#050505] px-2 py-0.5 rounded border border-[#1a1a1a] font-mono">
                      {tool.name}
                    </code>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        tool.riskTier === 'LOW'
                          ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20'
                          : tool.riskTier === 'MEDIUM'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {tool.riskTier} Risk
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#737373]">
                    {tool.requiresNetwork && (
                      <span className="px-1.5 py-0.5 rounded bg-[#111111] text-[#737373] border border-[#222222]">
                        Network Egress
                      </span>
                    )}
                    {tool.requiresFilesystem && (
                      <span className="px-1.5 py-0.5 rounded bg-[#111111] text-amber-400 border border-[#222222]">
                        Filesystem IO
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#a3a3a3] leading-relaxed">{tool.description}</p>

                {/* Parameters table */}
                {tool.parameters && tool.parameters.length > 0 && (
                  <div className="bg-[#050505] rounded-lg p-3 border border-[#1a1a1a] space-y-1.5">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#737373]">
                      Parameters Schema:
                    </p>
                    <div className="space-y-1">
                      {tool.parameters.map((p) => (
                        <div
                          key={p.name}
                          className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-1 border-b border-[#111111] pb-1"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[#10b981] font-semibold">{p.name}</span>
                            <span className="text-[#555555] text-[11px]">({p.type})</span>
                            {p.required && (
                              <span className="text-rose-400 text-[10px] uppercase font-bold">required</span>
                            )}
                          </div>
                          <span className="text-[#737373] text-[11px] font-sans">
                            {p.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Config Generator */}
      {activeTab === 'config' && (
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-medium text-white font-serif-display">Target Client Configuration</h3>
              <p className="text-xs text-[#737373]">
                Auto-generated configuration snippet for your local LLM or IDE client.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#050505] border border-[#1a1a1a] rounded p-1">
                {(['claude', 'cursor', 'windsurf'] as const).map((client) => (
                  <button
                    key={client}
                    onClick={() => setSelectedClient(client)}
                    className={`px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider font-mono cursor-pointer transition-all ${
                      selectedClient === client
                        ? 'bg-[#111111] text-[#10b981] border border-[#222222]'
                        : 'text-[#737373] hover:text-[#e5e5e5]'
                    }`}
                  >
                    {client === 'claude' ? 'Claude Desktop' : client}
                  </button>
                ))}
              </div>

              <button
                onClick={copyConfig}
                className="px-3 py-1.5 rounded bg-transparent hover:bg-[#111111] border border-[#333333] hover:border-[#555555] text-[#e5e5e5] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
              >
                {copiedConfig ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#10b981]" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#737373]" />
                    Copy JSON
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            <pre className="p-4 rounded-xl bg-[#050505] border border-[#1a1a1a] text-[#10b981] text-xs font-mono overflow-x-auto leading-relaxed">
              {getClientConfigJson()}
            </pre>
          </div>

          <p className="text-[11px] text-[#555555] font-mono">
            Path on macOS: <code className="text-[#a3a3a3]">~/Library/Application Support/Claude/claude_desktop_config.json</code>
          </p>
        </div>
      )}

      {/* Tab 3: Security & Sandboxing Snapshot */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-white flex items-center gap-2 font-serif-display">
                <ShieldCheck className="w-4 h-4 text-[#10b981]" />
                Automated 8-Layer Security Status
              </h3>
              <p className="text-xs text-[#a3a3a3] mt-1 max-w-xl leading-relaxed">
                {server.securityReport.summary}
              </p>
            </div>

            <button
              onClick={() => onViewSecurityReport(server)}
              className="px-4 py-2 rounded text-xs uppercase tracking-wider font-bold bg-[#10b981] hover:bg-[#059669] text-black flex items-center gap-1.5 cursor-pointer transition-all"
            >
              Open Full Security Report
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
              <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider">Filesystem Scope</span>
              <p className="text-sm font-medium text-white mt-1 font-serif-display">
                {server.securityReport.sandboxProfile.filesystemScope}
              </p>
              <p className="text-[11px] text-[#555555] mt-0.5 font-mono">
                {server.securityReport.sandboxProfile.allowedPaths?.join(', ') || 'No local disk IO permitted'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
              <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider">Network Egress</span>
              <p className="text-sm font-medium text-white mt-1 font-serif-display">
                {server.securityReport.sandboxProfile.networkEgress}
              </p>
              <p className="text-[11px] text-[#555555] mt-0.5 font-mono">
                {server.securityReport.sandboxProfile.allowedHosts?.join(', ') || 'Isolated Stdio sandbox'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
              <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider">SLSA Provenance</span>
              <p className="text-sm font-medium text-white mt-1 font-serif-display">
                Level {server.securityReport.supplyChain.slsaLevel}
              </p>
              <p className="text-[11px] text-[#555555] mt-0.5 font-mono">
                {server.securityReport.supplyChain.signatureAlgorithm}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
              <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider">Firewall Rules Active</span>
              <p className="text-sm font-medium text-white mt-1 font-serif-display">
                {server.securityReport.firewallRules.length} Rules Armed
              </p>
              <p className="text-[11px] text-[#555555] mt-0.5 font-mono">
                Real-time parameter tripwires
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Environment Secrets */}
      {activeTab === 'env' && (
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-medium text-white font-serif-display">Required Secrets & Environment Tokens</h3>
          <p className="text-xs text-[#737373]">
            These variables are securely injected into the isolated child process when spawned by Claude Desktop.
          </p>

          {server.envRequirements.length === 0 ? (
            <p className="text-xs text-[#10b981] font-mono py-4">
              ✓ Zero environment variables or API keys required. Ready for plug-and-play installation.
            </p>
          ) : (
            <div className="space-y-3">
              {server.envRequirements.map((env) => (
                <div
                  key={env.name}
                  className="p-3.5 rounded-lg bg-[#050505] border border-[#1a1a1a] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <code className="text-xs font-bold text-[#10b981] font-mono">{env.name}</code>
                    {env.required && (
                      <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-wider">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#737373]">{env.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
