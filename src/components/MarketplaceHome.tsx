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
  const verifiedServers = servers.filter((s) => s.verified);
  const quarantinedServers = servers.filter((s) => !s.verified || s.riskLevel === 'CRITICAL');

  const categories = [
    { name: 'All', icon: Server, count: servers.length },
    { name: 'Development', icon: Github, count: servers.filter((s) => s.category === 'Development').length },
    { name: 'Databases', icon: Database, count: servers.filter((s) => s.category === 'Databases').length },
    { name: 'System & Files', icon: Folder, count: servers.filter((s) => s.category === 'System & Files').length },
    { name: 'Web & Search', icon: Search, count: servers.filter((s) => s.category === 'Web & Search').length },
    { name: 'Productivity', icon: MessageSquare, count: servers.filter((s) => s.category === 'Productivity').length },
    { name: 'AI & Analytics', icon: Sparkles, count: servers.filter((s) => s.category === 'AI & Analytics').length },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 sm:pb-16">
      {/* Refined, Clean Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-[#090909] border border-[#1a1a1a] p-5 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#10b981]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] text-[10px] sm:text-[11px] font-mono font-medium tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
            <span>9-STAGE ZERO-TRUST AUDIT REGISTRY</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-tight font-serif-display">
            Discover verified <span className="text-[#10b981] italic font-normal">MCP servers</span> with zero-trust safety.
          </h1>

          <p className="text-xs sm:text-sm text-[#888888] max-w-lg mx-auto leading-relaxed">
            Automated AST analysis, dependency CVE scanning, container isolation, and runtime guardrails for Claude Desktop & Cursor.
          </p>

          {/* Quick Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2">
            <button
              onClick={() => onSelectCategory('All')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 shadow-xs"
            >
              <Search className="w-3.5 h-3.5 text-black" />
              Explore All Servers
            </button>
            <button
              onClick={onOpenLiveAuditor}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#121212] hover:bg-[#181818] text-[#e5e5e5] font-semibold text-xs uppercase tracking-wider border border-[#262626] hover:border-[#3a3a3a] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
              Audit Custom Repo
            </button>
          </div>
        </div>
      </section>

      {/* Clean Telemetry Overview Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="p-3.5 sm:p-4 rounded-xl bg-[#090909] border border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-mono text-[#737373] uppercase tracking-wider">Pipeline</span>
            <Layers className="w-3.5 h-3.5 text-[#10b981]" />
          </div>
          <p className="text-xl sm:text-2xl font-light text-white mt-1 font-serif-display">9 Stages</p>
          <p className="text-[10px] sm:text-[11px] text-[#555555] mt-0.5 font-mono truncate">L0 to L8 Verified</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-[#090909] border border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-mono text-[#737373] uppercase tracking-wider">Avg Trust</span>
            <Activity className="w-3.5 h-3.5 text-[#10b981]" />
          </div>
          <p className="text-xl sm:text-2xl font-light text-[#10b981] mt-1 font-serif-display">
            93.4 <span className="text-xs font-sans text-[#737373]">/100</span>
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#555555] mt-0.5 font-mono truncate">Verified baseline</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-[#090909] border border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-mono text-[#737373] uppercase tracking-wider">Sandbox</span>
            <Lock className="w-3.5 h-3.5 text-[#10b981]" />
          </div>
          <p className="text-xl sm:text-2xl font-light text-white mt-1 font-serif-display">0 Escapes</p>
          <p className="text-[10px] sm:text-[11px] text-[#555555] mt-0.5 font-mono truncate">Docker jail containment</p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl bg-[#090909] border border-[#1a1a1a]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-mono text-[#737373] uppercase tracking-wider">Clients</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-xl sm:text-2xl font-light text-white mt-1 font-serif-display">Claude & Cursor</p>
          <p className="text-[10px] sm:text-[11px] text-[#555555] mt-0.5 font-mono truncate">1-Click JSON config</p>
        </div>
      </section>

      {/* Category Scrolling Pills on Mobile / Grid on Desktop */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#737373] font-mono uppercase tracking-widest">
            Categories
          </h2>
          <span className="text-[10px] text-[#555555] font-mono sm:hidden">Swipe →</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-0.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#090909] hover:bg-[#121212] border border-[#1a1a1a] hover:border-[#333333] transition-all group cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
              >
                <div className="p-1.5 rounded-lg bg-[#111111] text-[#10b981] group-hover:scale-105 transition-transform">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-white group-hover:text-[#10b981] transition-colors leading-tight">
                    {cat.name}
                  </p>
                  <p className="text-[9px] text-[#555555] font-mono mt-0.5">
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
            <h2 className="text-lg sm:text-xl font-light text-white flex items-center gap-2 font-serif-display">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981]" />
              Featured Verified Servers
            </h2>
            <p className="text-[11px] sm:text-xs text-[#737373] mt-0.5">
              Audited across 9 stages, clean AST code, official publisher attestations.
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('All')}
            className="text-xs font-semibold text-[#10b981] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>All ({servers.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {verifiedServers.slice(0, 4).map((server) => (
            <div
              key={server.id}
              className="rounded-xl bg-[#090909] hover:bg-[#0d0d0d] border border-[#1a1a1a] hover:border-[#262626] transition-all p-4 sm:p-5 shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Header row: Icon, Name, Trust Gauge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#121212] border border-[#222222] p-2 sm:p-2.5 flex items-center justify-center text-[#10b981] shadow-inner shrink-0">
                      {server.id === 'github' && <Github className="w-full h-full" />}
                      {server.id === 'postgres' && <Database className="w-full h-full" />}
                      {server.id === 'filesystem' && <Folder className="w-full h-full" />}
                      {server.id === 'brave-search' && <Search className="w-full h-full" />}
                      {server.id === 'slack' && <MessageSquare className="w-full h-full" />}
                      {server.id !== 'github' &&
                        server.id !== 'postgres' &&
                        server.id !== 'filesystem' &&
                        server.id !== 'brave-search' &&
                        server.id !== 'slack' && <Server className="w-full h-full" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm sm:text-base font-medium text-white group-hover:text-[#10b981] transition-colors font-serif-display leading-tight">
                          {server.name}
                        </h3>
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-semibold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
                          Verified
                        </span>
                      </div>
                      <p className="text-[11px] text-[#737373] font-mono mt-0.5 truncate max-w-[180px] sm:max-w-[220px]">
                        {server.packageName}
                      </p>
                    </div>
                  </div>

                  <div
                    className="cursor-pointer hover:scale-105 transition-transform shrink-0"
                    onClick={() => onViewSecurityReport(server)}
                    title="Click to view 9-stage Security Report"
                  >
                    <TrustGauge score={server.trustScore} riskLevel={server.riskLevel} size="sm" showLabel={false} />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#a3a3a3] mt-3 line-clamp-2 leading-relaxed">
                  {server.description}
                </p>

                {/* Tools & Security Summary Badges */}
                <div className="mt-3.5 pt-3 border-t border-[#1a1a1a] flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-[#121212] text-[#888888] border border-[#222222]">
                    {server.toolsProvided.length} Tools
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
                    AST: Clean
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#121212] text-[#aaaaaa] border border-[#222222]">
                    Sandbox: {server.securityReport.sandboxProfile.filesystemScope}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Responsive Layout */}
              <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <button
                  onClick={() => onViewSecurityReport(server)}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-lg text-xs font-medium border border-[#262626] hover:border-[#3a3a3a] bg-[#111111] hover:bg-[#161616] text-[#e5e5e5] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Security Report</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => onSelectServer(server)}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium text-[#888888] hover:text-white bg-[#111111] sm:bg-transparent hover:bg-[#161616] transition-colors cursor-pointer text-center"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => onInstallServer(server)}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                      server.installed
                        ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 hover:bg-[#10b981]/25'
                        : 'bg-[#10b981] hover:bg-[#059669] text-black'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{server.installed ? 'Connected' : 'Install'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Threat Quarantine Showcase */}
      {quarantinedServers.length > 0 && (
        <section className="rounded-2xl bg-[#0d0708] border border-rose-500/25 p-4 sm:p-5 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-medium text-rose-300 font-serif-display">
                    Threat Defense Quarantine
                  </h3>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider">
                    Blocked
                  </span>
                </div>
                <p className="text-xs text-[#a3a3a3] mt-1 leading-relaxed">
                  The zero-trust pipeline blocked malicious MCP servers with dynamic code evaluation (<code className="text-rose-300 font-mono">eval()</code>) and unauthorized outbound beacons before reaching clients.
                </p>
              </div>
            </div>

            <button
              onClick={() => onViewSecurityReport(quarantinedServers[0])}
              className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 border border-rose-500/30 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-all active:scale-95"
            >
              <FileCode className="w-3.5 h-3.5 text-rose-400" />
              <span>Inspect Blocked Repo</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
