import React, { useState } from 'react';
import {
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Star,
  Download,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Folder,
  Database,
  Github,
  MessageSquare,
  Sparkles,
  Server,
  AlertTriangle
} from 'lucide-react';
import { MCPServer, RiskLevel } from '../types';
import { TrustGauge } from './TrustGauge';

interface ServerListProps {
  servers: MCPServer[];
  onSelectServer: (server: MCPServer) => void;
  onViewSecurityReport: (server: MCPServer) => void;
  onInstallServer: (server: MCPServer) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const ServerList: React.FC<ServerListProps> = ({
  servers,
  onSelectServer,
  onViewSecurityReport,
  onInstallServer,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
}) => {
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minScore, setMinScore] = useState<number>(0);
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'trust' | 'downloads' | 'stars' | 'name'>('trust');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    'All',
    'Development',
    'Databases',
    'System & Files',
    'Web & Search',
    'Productivity',
    'AI & Analytics'
  ];

  // Filtering
  const filteredServers = servers.filter((s) => {
    if (selectedCategory !== 'All' && s.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (verifiedOnly && !s.verified) {
      return false;
    }
    if (s.trustScore < minScore) {
      return false;
    }
    if (selectedRisk !== 'ALL' && s.riskLevel !== selectedRisk) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        s.name.toLowerCase().includes(q) ||
        s.packageName.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.toolsProvided.some((t) => t.name.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Sorting
  filteredServers.sort((a, b) => {
    if (sortBy === 'trust') return b.trustScore - a.trustScore;
    if (sortBy === 'downloads') return b.downloads - a.downloads;
    if (sortBy === 'stars') return b.stars - a.stars;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

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
    <div className="space-y-6 pb-16">
      {/* Top Filter Bar */}
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-5 shadow-xl space-y-4">
        {/* Search & Layout toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#555555] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, package, tool function (e.g. read_file, query)..."
              className="w-full pl-9 pr-4 py-2 bg-[#111111] text-[#e5e5e5] placeholder-[#555555] text-xs rounded border border-[#222222] focus:border-[#10b981]/50 focus:ring-1 focus:ring-[#10b981]/20 focus:outline-none font-mono"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#737373] uppercase tracking-wider">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#111111] border border-[#222222] text-[#e5e5e5] text-xs rounded px-2.5 py-1.5 focus:border-[#10b981]/50 focus:outline-none cursor-pointer font-mono"
              >
                <option value="trust">Highest Trust Score</option>
                <option value="downloads">Most Installed</option>
                <option value="stars">Most Starred</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>

            <div className="flex items-center border border-[#222222] rounded p-0.5 bg-[#111111]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#222222] text-[#10b981]' : 'text-[#555555] hover:text-[#e5e5e5]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#222222] text-[#10b981]' : 'text-[#555555] hover:text-[#e5e5e5]'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#10b981] text-black font-bold'
                  : 'bg-[#111111] text-[#737373] hover:text-white hover:bg-[#161616] border border-[#222222]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Security & Risk Quick Filter Switches */}
        <div className="pt-3 border-t border-[#1a1a1a] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-[#e5e5e5] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded bg-[#111111] border-[#333333] text-[#10b981] focus:ring-[#10b981]/30"
              />
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                Verified Only
              </span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-[#737373] uppercase tracking-wider font-mono text-[11px]">Min Trust:</span>
              <div className="flex items-center gap-1">
                {[0, 80, 90].map((score) => (
                  <button
                    key={score}
                    onClick={() => setMinScore(score)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
                      minScore === score
                        ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-bold'
                        : 'bg-[#111111] text-[#737373] border border-[#222222] hover:text-[#e5e5e5]'
                    }`}
                  >
                    {score === 0 ? 'All' : `>${score}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#737373] uppercase tracking-wider font-mono text-[11px]">Risk:</span>
              <div className="flex items-center gap-1">
                {['ALL', 'LOW', 'MEDIUM', 'CRITICAL'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRisk(r)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-all ${
                      selectedRisk === r
                        ? 'bg-[#222222] text-white border border-[#333333] font-bold'
                        : 'bg-[#111111] text-[#737373] border border-[#222222] hover:text-[#e5e5e5]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <span className="font-mono text-[#737373] text-[11px]">
            Showing <strong className="text-[#10b981]">{filteredServers.length}</strong> servers
          </span>
        </div>
      </div>

      {/* Server Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServers.map((server) => (
            <div
              key={server.id}
              className="rounded-xl bg-[#0a0a0a] hover:bg-[#0e0e0e] border border-[#1a1a1a] hover:border-[#262626] transition-all p-5 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#111111] border border-[#222222] p-2.5 flex items-center justify-center text-[#10b981] shadow-inner">
                      {getIcon(server.id)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-medium text-white group-hover:text-[#10b981] transition-colors font-serif-display">
                          {server.name}
                        </h3>
                      </div>
                      <p className="text-[11px] text-[#737373] font-mono">
                        {server.packageName}
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => onViewSecurityReport(server)}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    title="Click to view 8-layer Security Report"
                  >
                    <TrustGauge score={server.trustScore} riskLevel={server.riskLevel} size="sm" showLabel={false} />
                  </div>
                </div>

                <p className="text-xs text-[#a3a3a3] mt-3 line-clamp-2 leading-relaxed">
                  {server.description}
                </p>

                {/* Tags & Security info */}
                <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-[#111111] text-[#a3a3a3] border border-[#222222]">
                    {server.category}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#111111] text-[#a3a3a3] border border-[#222222]">
                    {server.toolsProvided.length} tools
                  </span>
                  {server.verified ? (
                    <span className="px-1.5 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                      ⚠ Quarantined
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-[#1a1a1a] flex items-center justify-between gap-2">
                <button
                  onClick={() => onViewSecurityReport(server)}
                  className="px-2.5 py-1.5 rounded text-xs uppercase tracking-wider font-semibold border border-[#333333] hover:border-[#555555] bg-transparent hover:bg-[#111111] text-[#e5e5e5] flex items-center gap-1 cursor-pointer transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                  Report
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onSelectServer(server)}
                    className="px-2.5 py-1.5 rounded text-xs uppercase tracking-wider font-medium text-[#737373] hover:text-white hover:bg-[#111111] transition-colors cursor-pointer"
                  >
                    Inspect
                  </button>

                  <button
                    onClick={() => onInstallServer(server)}
                    className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      server.installed
                        ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 hover:bg-[#10b981]/20'
                        : server.verified
                        ? 'bg-[#10b981] hover:bg-[#059669] text-black font-bold'
                        : 'bg-rose-900/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/60'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    {server.installed ? 'Active' : 'Install'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Server List View */}
      {viewMode === 'list' && (
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl divide-y divide-[#1a1a1a] overflow-hidden">
          {filteredServers.map((server) => (
            <div
              key={server.id}
              className="p-4 hover:bg-[#0e0e0e] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#111111] border border-[#222222] p-2 flex items-center justify-center text-[#10b981] shrink-0">
                  {getIcon(server.id)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      onClick={() => onSelectServer(server)}
                      className="text-sm font-medium text-white hover:text-[#10b981] transition-colors cursor-pointer font-serif-display"
                    >
                      {server.name}
                    </h3>
                    <span className="text-xs text-[#737373] font-mono">v{server.version}</span>
                    {server.verified ? (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20 uppercase tracking-widest">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 uppercase tracking-widest">
                        Quarantined
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#a3a3a3] line-clamp-1 mt-0.5">
                    {server.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => onViewSecurityReport(server)}
                    className="cursor-pointer"
                    title="View Security Report"
                  >
                    <TrustGauge score={server.trustScore} riskLevel={server.riskLevel} size="sm" showLabel={false} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewSecurityReport(server)}
                    className="px-3 py-1.5 rounded text-xs uppercase tracking-wider font-semibold border border-[#333333] hover:border-[#555555] bg-transparent hover:bg-[#111111] text-[#e5e5e5] cursor-pointer"
                  >
                    Security
                  </button>
                  <button
                    onClick={() => onInstallServer(server)}
                    className={`px-3.5 py-1.5 rounded text-xs uppercase tracking-wider font-bold flex items-center gap-1 cursor-pointer transition-all ${
                      server.installed
                        ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30'
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
      )}

      {filteredServers.length === 0 && (
        <div className="text-center py-16 bg-[#0a0a0a] border border-dashed border-[#222222] rounded-xl">
          <p className="text-[#737373] text-sm">No MCP servers matched your current filter criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setVerifiedOnly(false);
              setMinScore(0);
              setSelectedRisk('ALL');
            }}
            className="mt-3 text-xs uppercase tracking-wider font-semibold text-[#10b981] hover:underline cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
