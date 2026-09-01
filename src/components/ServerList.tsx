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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-16">
      {/* Top Filter Bar */}
      <div className="bg-[#090909] border border-[#1a1a1a] rounded-xl p-3.5 sm:p-5 shadow-xl space-y-3 sm:space-y-4">
        {/* Search & Layout toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search servers, tools, schemas..."
              className="w-full pl-8.5 pr-8 py-2 bg-[#121212] text-[#e5e5e5] placeholder-[#666666] text-xs rounded-lg border border-[#222222] focus:border-[#10b981]/50 focus:outline-none font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#e5e5e5] text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2">
            <div className="flex items-center gap-1.5 bg-[#121212] px-2.5 py-1 rounded-lg border border-[#222222]">
              <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-[#e5e5e5] text-xs focus:outline-none cursor-pointer font-mono"
              >
                <option value="trust" className="bg-[#1a1a1a]">Highest Trust</option>
                <option value="downloads" className="bg-[#1a1a1a]">Most Installed</option>
                <option value="stars" className="bg-[#1a1a1a]">Most Starred</option>
                <option value="name" className="bg-[#1a1a1a]">Alphabetical</option>
              </select>
            </div>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition-colors sm:hidden ${
                showAdvancedFilters || verifiedOnly || minScore > 0 || selectedRisk !== 'ALL'
                  ? 'bg-[#1a1a1a] text-[#10b981] border-[#10b981]/40'
                  : 'bg-[#121212] text-[#888888] border-[#222222]'
              }`}
              title="Toggle Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            <div className="hidden sm:flex items-center border border-[#222222] rounded-lg p-0.5 bg-[#121212]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#222222] text-[#10b981]' : 'text-[#666666] hover:text-[#e5e5e5]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#222222] text-[#10b981]' : 'text-[#666666] hover:text-[#e5e5e5]'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#10b981] text-black font-semibold shadow-xs'
                  : 'bg-[#121212] text-[#888888] hover:text-white hover:bg-[#181818] border border-[#222222]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Security & Risk Quick Filter Switches */}
        <div
          className={`pt-3 border-t border-[#1a1a1a] flex-wrap items-center justify-between gap-3 text-xs ${
            showAdvancedFilters ? 'flex' : 'hidden sm:flex'
          }`}
        >
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <label className="flex items-center gap-2 text-[#e5e5e5] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded bg-[#111111] border-[#333333] text-[#10b981] focus:ring-[#10b981]/30 w-3.5 h-3.5"
              />
              <span className="flex items-center gap-1 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                Verified Only
              </span>
            </label>

            <div className="flex items-center gap-1.5">
              <span className="text-[#737373] uppercase tracking-wider font-mono text-[10px]">Min Trust:</span>
              <div className="flex items-center gap-1">
                {[0, 80, 90].map((score) => (
                  <button
                    key={score}
                    onClick={() => setMinScore(score)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-all ${
                      minScore === score
                        ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 font-bold'
                        : 'bg-[#121212] text-[#737373] border border-[#222222] hover:text-[#e5e5e5]'
                    }`}
                  >
                    {score === 0 ? 'All' : `>${score}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#737373] uppercase tracking-wider font-mono text-[10px]">Risk:</span>
              <div className="flex items-center gap-1">
                {['ALL', 'LOW', 'MEDIUM', 'CRITICAL'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRisk(r)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-all ${
                      selectedRisk === r
                        ? 'bg-[#222222] text-white border border-[#333333] font-bold'
                        : 'bg-[#121212] text-[#737373] border border-[#222222] hover:text-[#e5e5e5]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <span className="font-mono text-[#737373] text-[11px] w-full sm:w-auto text-right">
            Showing <strong className="text-[#10b981]">{filteredServers.length}</strong> servers
          </span>
        </div>
      </div>

      {/* Server Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {filteredServers.map((server) => (
            <div
              key={server.id}
              className="rounded-xl bg-[#090909] hover:bg-[#0d0d0d] border border-[#1a1a1a] hover:border-[#262626] transition-all p-4 sm:p-5 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#121212] border border-[#222222] p-2 sm:p-2.5 flex items-center justify-center text-[#10b981] shadow-inner shrink-0">
                      {getIcon(server.id)}
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-medium text-white group-hover:text-[#10b981] transition-colors font-serif-display leading-tight">
                        {server.name}
                      </h3>
                      <p className="text-[11px] text-[#737373] font-mono mt-0.5 truncate max-w-[170px] sm:max-w-[200px]">
                        {server.packageName}
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => onViewSecurityReport(server)}
                    className="cursor-pointer hover:scale-105 transition-transform shrink-0"
                    title="Click to view 9-stage Security Report"
                  >
                    <TrustGauge score={server.trustScore} riskLevel={server.riskLevel} size="sm" showLabel={false} />
                  </div>
                </div>

                <p className="text-xs text-[#a3a3a3] mt-3 line-clamp-2 leading-relaxed">
                  {server.description}
                </p>

                {/* Tags & Security info */}
                <div className="mt-3.5 pt-3 border-t border-[#1a1a1a] flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-[#121212] text-[#888888] border border-[#222222]">
                    {server.category}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#121212] text-[#888888] border border-[#222222]">
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
              <div className="mt-4 pt-3 border-t border-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <button
                  onClick={() => onViewSecurityReport(server)}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-lg text-xs font-medium border border-[#262626] hover:border-[#3a3a3a] bg-[#111111] hover:bg-[#161616] text-[#e5e5e5] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Report</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => onSelectServer(server)}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium text-[#888888] hover:text-white bg-[#111111] sm:bg-transparent hover:bg-[#161616] transition-colors cursor-pointer text-center"
                  >
                    Inspect
                  </button>

                  <button
                    onClick={() => onInstallServer(server)}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                      server.installed
                        ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 hover:bg-[#10b981]/25'
                        : server.verified
                        ? 'bg-[#10b981] hover:bg-[#059669] text-black'
                        : 'bg-rose-900/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/60'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{server.installed ? 'Active' : 'Install'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Server List View */}
      {viewMode === 'list' && (
        <div className="bg-[#090909] border border-[#1a1a1a] rounded-xl divide-y divide-[#1a1a1a] overflow-hidden">
          {filteredServers.map((server) => (
            <div
              key={server.id}
              className="p-3.5 sm:p-4 hover:bg-[#0d0d0d] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#121212] border border-[#222222] p-2 flex items-center justify-center text-[#10b981] shrink-0">
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
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
                        Verified
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        Quarantined
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#a3a3a3] line-clamp-1 mt-0.5">
                    {server.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5">
                <div
                  onClick={() => onViewSecurityReport(server)}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  title="View Security Report"
                >
                  <TrustGauge score={server.trustScore} riskLevel={server.riskLevel} size="sm" showLabel={false} />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectServer(server)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#888888] hover:text-white bg-[#121212] hover:bg-[#181818] border border-[#222222] transition-colors cursor-pointer"
                  >
                    Details
                  </button>

                  <button
                    onClick={() => onInstallServer(server)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                      server.installed
                        ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 hover:bg-[#10b981]/25'
                        : server.verified
                        ? 'bg-[#10b981] hover:bg-[#059669] text-black'
                        : 'bg-rose-900/40 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{server.installed ? 'Active' : 'Install'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredServers.length === 0 && (
        <div className="text-center py-16 bg-[#090909] border border-[#1a1a1a] rounded-2xl p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#121212] border border-[#222222] flex items-center justify-center mx-auto text-[#666666]">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-medium text-white">No MCP servers match your filter</h3>
          <p className="text-xs text-[#737373] max-w-sm mx-auto">
            Try adjusting your search terms, minimum trust score threshold, or category selection.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setVerifiedOnly(false);
              setMinScore(0);
              setSelectedRisk('ALL');
            }}
            className="mt-2 px-4 py-2 rounded-lg bg-[#121212] hover:bg-[#181818] border border-[#262626] text-xs font-semibold text-[#10b981] cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
