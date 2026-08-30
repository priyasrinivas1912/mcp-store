import React, { useState } from 'react';
import {
  Search,
  Cpu,
  Shield,
  Layers,
  Sparkles,
  Menu,
  X,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: 'home' | 'directory' | 'security' | 'installed';
  setCurrentTab: (tab: 'home' | 'directory' | 'security' | 'installed') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  installedCount: number;
  user: UserProfile;
  onOpenLiveAuditor: () => void;
  onOpenClientConfig: () => void;
  onOpenLoginModal: () => void;
  onOpenArchitectureModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  installedCount,
  user,
  onOpenLiveAuditor,
  onOpenClientConfig,
  onOpenLoginModal,
  onOpenArchitectureModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1f1f1f] bg-[#0a0a0a]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Brand Logo & Main Nav Tabs */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setCurrentTab('home');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none select-none"
              title="MCP Store Home"
            >
              <div className="w-7 h-7 bg-[#10b981] rounded-md flex items-center justify-center font-bold text-black text-sm tracking-tight transition-transform group-hover:scale-105">
                M
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-white group-hover:text-[#10b981] transition-colors">
                  MCP Store
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-[#1a1a1a] text-[#888888] border border-[#2a2a2a]">
                  v2.4
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 bg-[#121212] p-1 rounded-lg border border-[#1f1f1f]">
              <button
                onClick={() => setCurrentTab('home')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  currentTab === 'home'
                    ? 'bg-[#222222] text-white shadow-xs'
                    : 'text-[#888888] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]'
                }`}
              >
                Marketplace
              </button>
              <button
                onClick={() => setCurrentTab('directory')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  currentTab === 'directory'
                    ? 'bg-[#222222] text-white shadow-xs'
                    : 'text-[#888888] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]'
                }`}
              >
                Directory
              </button>
              <button
                onClick={() => setCurrentTab('security')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  currentTab === 'security'
                    ? 'bg-[#222222] text-[#10b981] shadow-xs'
                    : 'text-[#888888] hover:text-[#e5e5e5] hover:bg-[#1a1a1a]'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-[#10b981]" />
                Security Center
              </button>
            </nav>
          </div>

          {/* Clean Search Input */}
          <div className="flex-1 max-w-sm hidden lg:block">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentTab !== 'directory' && e.target.value.length > 0) {
                    setCurrentTab('directory');
                  }
                }}
                placeholder="Search MCP servers..."
                className="w-full pl-8.5 pr-8 py-1.5 text-xs bg-[#111111] text-[#e5e5e5] placeholder-[#666666] rounded-lg border border-[#222222] focus:border-[#10b981]/50 focus:outline-none transition-colors"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#e5e5e5] text-xs cursor-pointer"
                >
                  ✕
                </button>
              ) : (
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#555555] bg-[#1a1a1a] px-1.5 py-0.5 rounded border border-[#262626]">
                  /
                </span>
              )}
            </div>
          </div>

          {/* Desktop Right Action Area */}
          <div className="hidden sm:flex items-center gap-2">
            {/* 9-Stage Architecture Button */}
            <button
              onClick={onOpenArchitectureModal}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#999999] hover:text-white hover:bg-[#161616] border border-transparent hover:border-[#262626] transition-all cursor-pointer whitespace-nowrap"
              title="Inspect the 9-Stage Zero-Trust Security Pipeline"
            >
              <Layers className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="hidden xl:inline">9-Stage Pipeline</span>
              <span className="xl:hidden">Pipeline</span>
            </button>

            {/* Claude Config Pill */}
            <button
              onClick={onOpenClientConfig}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#999999] hover:text-white bg-[#111111] hover:bg-[#161616] border border-[#222222] hover:border-[#333333] transition-all cursor-pointer whitespace-nowrap"
              title="Open Claude Desktop configuration"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <Cpu className="w-3.5 h-3.5 text-[#737373]" />
              <span>Claude</span>
              <span className="px-1 py-0.2 rounded bg-[#1a1a1a] text-[10px] font-mono text-[#10b981] font-semibold">
                {installedCount}
              </span>
            </button>

            {/* Primary Action: Audit Repo */}
            <button
              onClick={onOpenLiveAuditor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#10b981] hover:bg-[#059669] text-black transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>Audit Repo</span>
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={onOpenLoginModal}
              className="w-7 h-7 rounded-lg bg-[#161616] hover:bg-[#222222] border border-[#2a2a2a] flex items-center justify-center text-xs font-semibold text-[#10b981] cursor-pointer transition-colors ml-1"
              title={`${user.name} (${user.role})`}
            >
              {user.name.charAt(0)}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenLiveAuditor}
              className="p-1.5 rounded-lg bg-[#10b981] text-black text-xs font-semibold"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#141414] border border-[#222222] text-[#888888] hover:text-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-[#1a1a1a] py-3 space-y-3 bg-[#0a0a0a]">
            {/* Search Input on Mobile */}
            <div className="relative px-1">
              <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentTab !== 'directory' && e.target.value.length > 0) {
                    setCurrentTab('directory');
                  }
                }}
                placeholder="Search servers..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#111111] text-[#e5e5e5] placeholder-[#666666] rounded-lg border border-[#222222]"
              />
            </div>

            {/* Mobile Navigation Tabs */}
            <div className="grid grid-cols-3 gap-1 px-1">
              <button
                onClick={() => {
                  setCurrentTab('home');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-md font-medium text-center ${
                  currentTab === 'home'
                    ? 'bg-[#222222] text-white'
                    : 'text-[#888888] bg-[#111111]'
                }`}
              >
                Marketplace
              </button>
              <button
                onClick={() => {
                  setCurrentTab('directory');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-md font-medium text-center ${
                  currentTab === 'directory'
                    ? 'bg-[#222222] text-white'
                    : 'text-[#888888] bg-[#111111]'
                }`}
              >
                Directory
              </button>
              <button
                onClick={() => {
                  setCurrentTab('security');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 text-xs rounded-md font-medium text-center ${
                  currentTab === 'security'
                    ? 'bg-[#222222] text-[#10b981]'
                    : 'text-[#888888] bg-[#111111]'
                }`}
              >
                Security
              </button>
            </div>

            {/* Mobile Quick Action Buttons */}
            <div className="flex items-center justify-between gap-2 px-1 pt-1">
              <button
                onClick={() => {
                  onOpenArchitectureModal();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#111111] border border-[#222222] text-xs text-[#999999] flex items-center justify-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-[#10b981]" />
                <span>9-Stage Pipeline</span>
              </button>

              <button
                onClick={() => {
                  onOpenClientConfig();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#111111] border border-[#222222] text-xs text-[#999999] flex items-center justify-center gap-1.5"
              >
                <Cpu className="w-3.5 h-3.5 text-[#737373]" />
                <span>Claude ({installedCount})</span>
              </button>

              <button
                onClick={() => {
                  onOpenLoginModal();
                  setMobileMenuOpen(false);
                }}
                className="w-8 h-8 rounded-lg bg-[#161616] border border-[#262626] flex items-center justify-center text-xs font-bold text-[#10b981]"
              >
                {user.name.charAt(0)}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

