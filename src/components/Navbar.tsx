import React, { useState } from 'react';
import {
  Search,
  Cpu,
  Shield,
  Layers,
  Sparkles,
  Menu,
  X,
  Store,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentTab: 'home' | 'directory' | 'security' | 'details';
  setCurrentTab: (tab: 'home' | 'directory' | 'security' | 'details') => void;
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      {/* Top Main Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[#1f1f1f] bg-[#070707]/95 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-3">
            {/* Brand Logo */}
            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  setCurrentTab('home');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2.5 group cursor-pointer focus:outline-none select-none text-left"
                title="MCP Store Home"
              >
                <div className="w-8 h-8 rounded-lg bg-[#10b981] flex items-center justify-center font-bold text-black text-sm tracking-tight transition-transform group-hover:scale-105 shadow-xs">
                  M
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm tracking-tight text-white group-hover:text-[#10b981] transition-colors leading-none">
                      MCP Store
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
                      Zero-Trust
                    </span>
                  </div>
                  <p className="text-[10px] text-[#737373] hidden sm:block font-mono tracking-tight mt-0.5">
                    Model Context Protocol Registry
                  </p>
                </div>
              </button>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1 bg-[#111111] p-1 rounded-lg border border-[#1f1f1f]">
                <button
                  onClick={() => setCurrentTab('home')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    currentTab === 'home'
                      ? 'bg-[#222222] text-white shadow-xs'
                      : 'text-[#888888] hover:text-[#e5e5e5] hover:bg-[#181818]'
                  }`}
                >
                  Marketplace
                </button>
                <button
                  onClick={() => setCurrentTab('directory')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    currentTab === 'directory' || currentTab === 'details'
                      ? 'bg-[#222222] text-white shadow-xs'
                      : 'text-[#888888] hover:text-[#e5e5e5] hover:bg-[#181818]'
                  }`}
                >
                  Directory
                </button>
                <button
                  onClick={() => setCurrentTab('security')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    currentTab === 'security'
                      ? 'bg-[#222222] text-[#10b981] shadow-xs'
                      : 'text-[#888888] hover:text-[#e5e5e5] hover:bg-[#181818]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-[#10b981]" />
                  Security Center
                </button>
              </nav>
            </div>

            {/* Center Desktop Search Input */}
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
                  placeholder="Search servers, tools, schemas..."
                  className="w-full pl-8.5 pr-8 py-1.5 text-xs bg-[#111111] text-[#e5e5e5] placeholder-[#666666] rounded-lg border border-[#222222] focus:border-[#10b981]/50 focus:outline-none transition-colors font-mono"
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

            {/* Desktop Action Area */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onOpenArchitectureModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#999999] hover:text-white hover:bg-[#161616] border border-transparent hover:border-[#262626] transition-all cursor-pointer whitespace-nowrap"
                title="Inspect 9-Stage Security Architecture"
              >
                <Layers className="w-3.5 h-3.5 text-[#10b981]" />
                <span className="hidden xl:inline">9-Stage Pipeline</span>
                <span className="xl:hidden">Pipeline</span>
              </button>

              <button
                onClick={onOpenClientConfig}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#999999] hover:text-white bg-[#111111] hover:bg-[#161616] border border-[#222222] hover:border-[#333333] transition-all cursor-pointer whitespace-nowrap"
                title="Claude Desktop Config"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <Cpu className="w-3.5 h-3.5 text-[#737373]" />
                <span>Claude</span>
                <span className="px-1.5 py-0.2 rounded bg-[#1c1c1c] text-[10px] font-mono text-[#10b981] font-semibold">
                  {installedCount}
                </span>
              </button>

              <button
                onClick={onOpenLiveAuditor}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#10b981] hover:bg-[#059669] text-black transition-all cursor-pointer whitespace-nowrap shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Audit Repo</span>
              </button>

              <button
                onClick={onOpenLoginModal}
                className="w-7 h-7 rounded-lg bg-[#161616] hover:bg-[#222222] border border-[#2a2a2a] flex items-center justify-center text-xs font-semibold text-[#10b981] cursor-pointer transition-colors ml-1"
                title={`${user.name} (${user.role})`}
              >
                {user.name.charAt(0)}
              </button>
            </div>

            {/* Mobile Header Quick Actions */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                  mobileSearchOpen
                    ? 'bg-[#1a1a1a] border-[#10b981]/50 text-[#10b981]'
                    : 'bg-[#111111] border-[#222222] text-[#888888] hover:text-white'
                }`}
                aria-label="Toggle Search"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenLiveAuditor}
                className="px-2.5 py-1.5 rounded-lg bg-[#10b981] text-black text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Audit</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-[#111111] border border-[#222222] text-[#888888] hover:text-white cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar Expandable Drawer */}
          {mobileSearchOpen && (
            <div className="sm:hidden pb-3 pt-1 border-t border-[#1a1a1a] mt-1">
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
                  autoFocus
                  placeholder="Search servers, tools, packages..."
                  className="w-full pl-8.5 pr-8 py-2 text-xs bg-[#111111] text-[#e5e5e5] placeholder-[#666666] rounded-lg border border-[#262626] focus:border-[#10b981]/50 focus:outline-none font-mono"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#e5e5e5] text-xs p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mobile Quick Menu Sheet */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-[#1a1a1a] py-3.5 space-y-3 bg-[#0a0a0a] animate-fadeIn">
              {/* User Profile Card on Mobile */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111111] border border-[#222222]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-xs font-bold text-[#10b981]">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white leading-tight">{user.name}</p>
                    <p className="text-[10px] text-[#737373] font-mono leading-tight mt-0.5">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onOpenLoginModal();
                    setMobileMenuOpen(false);
                  }}
                  className="px-2.5 py-1 text-[11px] font-medium text-[#10b981] bg-[#10b981]/10 rounded-md border border-[#10b981]/20 cursor-pointer"
                >
                  Switch
                </button>
              </div>

              {/* Action Buttons in Mobile Sheet */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenArchitectureModal();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-[#111111] border border-[#222222] text-xs text-left hover:border-[#333333] transition-colors flex items-center gap-2"
                >
                  <Layers className="w-4 h-4 text-[#10b981] shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-white leading-tight">9-Stage Pipeline</p>
                    <p className="text-[10px] text-[#666666] leading-tight mt-0.5">Zero-trust matrix</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onOpenClientConfig();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-[#111111] border border-[#222222] text-xs text-left hover:border-[#333333] transition-colors flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-white leading-tight">Claude Config</p>
                    <p className="text-[10px] text-[#666666] leading-tight mt-0.5">{installedCount} connected</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modern Fixed Bottom Tab Bar for Mobile Users (App-Style Experience) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070707]/95 border-t border-[#1f1f1f] backdrop-blur-xl px-2 py-1 flex items-center justify-around">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
            currentTab === 'home'
              ? 'text-[#10b981]'
              : 'text-[#737373] hover:text-[#e5e5e5]'
          }`}
        >
          <Store className="w-4 h-4 mb-0.5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('directory')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
            currentTab === 'directory' || currentTab === 'details'
              ? 'text-[#10b981]'
              : 'text-[#737373] hover:text-[#e5e5e5]'
          }`}
        >
          <Compass className="w-4 h-4 mb-0.5" />
          <span>Directory</span>
        </button>

        <button
          onClick={() => setCurrentTab('security')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[10px] font-medium transition-colors cursor-pointer ${
            currentTab === 'security'
              ? 'text-[#10b981]'
              : 'text-[#737373] hover:text-[#e5e5e5]'
          }`}
        >
          <Shield className="w-4 h-4 mb-0.5" />
          <span>Security</span>
        </button>

        <button
          onClick={onOpenClientConfig}
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-lg text-[10px] font-medium text-[#737373] hover:text-[#e5e5e5] transition-colors cursor-pointer relative"
        >
          <Cpu className="w-4 h-4 mb-0.5 text-amber-400" />
          <span>Claude</span>
          {installedCount > 0 && (
            <span className="absolute top-1 right-2.5 w-2 h-2 rounded-full bg-[#10b981]" />
          )}
        </button>
      </nav>
    </>
  );
};

