import React from 'react';
import {
  ShieldCheck,
  Shield,
  Zap,
  ArrowRight,
  Sparkles,
  Lock,
  Terminal,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Download,
  Activity,
  Server,
  Database,
  Github,
  Folder,
  MessageSquare
} from 'lucide-react';
import { MCPServer } from '../types';
import { TrustGauge } from './TrustGauge';

interface MarketplaceHomeProps {
  servers: MCPServer[];
  onSelectServer: (server: MCPServer) => void;
  onViewSecurityReport: (server: MCPServer) => void;
  onInstallServer: (server: MCPServer) => void;
  onSelectCategory: (category: string) => void;
  onOpenLiveAuditor: () => void;
}

export const MarketplaceHome: React.FC<MarketplaceHomeProps> = ({
  servers,
  onSelectServer,
  onViewSecurityReport,
  onInstallServer,
  onSelectCategory,
  onOpenLiveAuditor,
}) => {
  const verifiedServers = servers.filter(s => s.verified);
  const quarantinedServers = servers.filter(s => !s.verified || s.riskLevel === 'CRITICAL');

  const categories = [
    { name: 'Development', icon: Github, count: servers.filter(s => s.category === 'Development').length },
    { name: 'Databases', icon: Database, count: servers.filter(s => s.category === 'Databases').length },
    { name: 'System & Files', icon: Folder, count: servers.filter(s => s.category === 'System & Files').length },
    { name: 'Web & Search', icon: Search, count: servers.filter(s => s.category === 'Web & Search').length },
    { name: 'Productivity', icon: MessageSquare, count: servers.filter(s => s.category === 'Productivity').length },
    { name: 'AI & Analytics', icon: Sparkles, count: servers.filter(s => s.category === 'AI & Analytics').length },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Refined, Clean Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] p-8 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-[11px] font-mono font-medium tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
            <span>9-STAGE ZERO-TRUST VERIFICATION PROTOCOL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight font-serif-display">
            Discover verified <span className="text-[#10b981] italic font-normal">MCP servers</span> with zero-trust safety.
          </h1>

          <p className="text-sm text-[#888888] max-w-xl mx-auto leading-relaxed">
            Automated AST analysis, dependency CVE scanning, container isolation, and runtime guardrails for Claude Desktop & Cursor.
          </p>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onSelectCategory('All')}
              className="px-5 py-2.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <Search className="w-3.5 h-3.5 text-black" />
              Explore All Servers
            </button>
            <button
              onClick={onOpenLiveAuditor}
              className="px-5 py-2.5 rounded-lg bg-[#111111] hover:bg-[#161616] text-[#e5e5e5] font-semibold text-xs uppercase tracking-wider border border-[#222222] hover:border-[#333333] flex items-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
              Audit Custom Repo
            </button>
          </div>
        </div>
      </section>

      {/* Clean Telemetry Overview Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#737373] uppercase tracking-wider">Verification Pipeline</span>
            <Layers className="w-4 h-4 text-[#10b981]" />
          </div>
          <p className="text-2xl font-light text-white mt-1.5 font-serif-display">9 Stages</p>
          <p className="text-[11px] text-[#555555] mt-0.5 font-mono">Layer 0 to Layer 8 Verified</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#737373] uppercase tracking-wider">Average Trust Score</span>
            <Activity className="w-4 h-4 text-[#10b981]" />
          </div>
          <p className="text-2xl font-light text-[#10b981] mt-1.5 font-serif-display">93.4 <span className="text-xs font-sans text-[#737373]">/ 100</span></p>
          <p className="text-[11px] text-[#555555] mt-0.5 font-mono">Verified registry baseline</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#737373] uppercase tracking-wider">Sandbox Escapes</span>
            <Lock className="w-4 h-4 text-[#10b981]" />
          </div>
          <p className="text-2xl font-light text-white mt-1.5 font-serif-display">0 Intercepted</p>
          <p className="text-[11px] text-[#555555] mt-0.5 font-mono">Docker syscall containment</p>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#737373] uppercase tracking-wider">Client Integration</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-light text-white mt-1.5 font-serif-display">Claude Desktop</p>
          <p className="text-[11px] text-[#555555] mt-0.5 font-mono">1-Click JSON config patch</p>
        </div>
      </section>

      {/* Category Pills */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-[#737373] font-mono uppercase tracking-widest">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] hover:bg-[#111111] border border-[#1a1a1a] hover:border-[#333333] text-left transition-all group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-[#050505] border border-[#1a1a1a] text-[#10b981] group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-[#10b981] transition-colors leading-tight">
                    {cat.name}
                  </p>
                  <p className="text-[10px] text-[#555555] font-mono mt-0.5">
                    {cat.count} servers
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Verified Servers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-light text-white flex items-center gap-2 font-serif-display">
              <ShieldCheck className="w-5 h-5 text-[#10b981]" />
              Featured Verified MCP Servers
            </h2>
            <p className="text-xs text-[#737373] mt-0.5">
              Strictly audited, zero code vulnerabilities, official maintainer signatures.
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('All')}
            className="text-xs uppercase tracking-wider font-semibold text-[#10b981] hover:underline flex items-center gap-1 cursor-pointer"
          >
            View All ({servers.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {verifiedServers.slice(0, 4).map((server) => (
            <div
              key={server.id}
              className="rounded-xl bg-[#0a0a0a] hover:bg-[#0e0e0e] border border-[#1a1a1a] hover:border-[#262626] transition-all p-6 shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Header row: Name, Category, Trust Gauge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-[#111111] border border-[#222222] p-2.5 flex items-center justify-center text-[#10b981] shadow-inner">
                      {server.id === 'github' && <Github className="w-full h-full" />}
                      {server.id === 'postgres' && <Database className="w-full h-full" />}
                      {server.id === 'filesystem' && <Folder className="w-full h-full" />}
                      {server.id === 'brave-search' && <Search className="w-full h-full" />}
                      {server.id === 'slack' && <MessageSquare className="w-full h-full" />}
                      {server.id !== 'github' && server.id !== 'postgres' && server.id !== 'filesystem' && server.id !== 'brave-search' && server.id !== 'slack' && (
                        <Server className="w-full h-full" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-medium text-white group-hover:text-[#10b981] transition-colors font-serif-display">
                          {server.name}
                        </h3>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 uppercase tracking-widest">
                          ✓ Verified
                        </span>
                      </div>
                      <p className="text-xs text-[#737373] font-mono mt-0.5">
                        {server.packageName} • v{server.version}
                      </p>
                    </div>
                  </div>

                  <div className="cursor-pointer" onClick={() => onViewSecurityReport(server)} title="Click to view 8-layer Security Report">
                    <TrustGauge score={server.trustScore} riskLevel={server.riskLevel} size="md" showLabel={false} />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#a3a3a3] mt-3.5 line-clamp-2 leading-relaxed">
                  {server.description}
                </p>

                {/* Tools & Security Summary Badges */}
                <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#111111] text-[#a3a3a3] border border-[#222222]">
                    {server.toolsProvided.length} Tools
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
                    AST: Clean
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#111111] text-[#e5e5e5] border border-[#222222]">
                    Sandbox: {server.securityReport.sandboxProfile.filesystemScope}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#111111] text-[#737373] border border-[#222222]">
                    SLSA L{server.securityReport.supplyChain.slsaLevel}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3.5 border-t border-[#1a1a1a] flex items-center justify-between gap-3">
                <button
                  onClick={() => onViewSecurityReport(server)}
                  className="px-3 py-1.5 rounded text-xs uppercase tracking-wider font-semibold border border-[#333333] hover:border-[#555555] bg-transparent hover:bg-[#111111] text-[#e5e5e5] flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                  Security Report
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectServer(server)}
                    className="px-3 py-1.5 rounded text-xs uppercase tracking-wider font-medium text-[#737373] hover:text-white hover:bg-[#111111] transition-colors cursor-pointer"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => onInstallServer(server)}
                    className={`px-4 py-2 rounded text-xs uppercase tracking-wider font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                      server.installed
                        ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 hover:bg-[#10b981]/20'
                        : 'bg-[#10b981] hover:bg-[#059669] text-black font-bold'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {server.installed ? 'Connected' : 'Install'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Threat Quarantine Showcase */}
      {quarantinedServers.length > 0 && (
        <section className="rounded-2xl bg-[#0a0a0a] border border-rose-500/30 p-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-medium text-rose-300 font-serif-display">
                    Security Defense: Intercepted Threat Quarantine
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                    Quarantined
                  </span>
                </div>
                <p className="text-xs text-[#a3a3a3] mt-1 max-w-2xl leading-relaxed">
                  The MCP Store pipeline automatically blocked suspicious third-party servers containing obfuscated <code className="text-rose-300 font-mono font-bold">eval()</code> calls and unauthorized outbound network beacons before they could reach your desktop client.
                </p>
              </div>
            </div>

            <button
              onClick={() => onViewSecurityReport(quarantinedServers[0])}
              className="px-4 py-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 border border-rose-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shrink-0 transition-all"
            >
              <FileCode className="w-4 h-4 text-rose-400" />
              Inspect Quarantine Report
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
