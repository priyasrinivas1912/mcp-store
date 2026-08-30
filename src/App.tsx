/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MCPServer, UserProfile } from './types';
import { MOCK_MCP_SERVERS } from './data/mockServers';
import { Navbar } from './components/Navbar';
import { MarketplaceHome } from './components/MarketplaceHome';
import { ServerList } from './components/ServerList';
import { ServerDetails } from './components/ServerDetails';
import { SecurityReportView } from './components/SecurityReportView';
import { InstallProgressModal } from './components/InstallProgressModal';
import { ClientConfigModal } from './components/ClientConfigModal';
import { LiveAuditorModal } from './components/LiveAuditorModal';
import { LoginModal } from './components/LoginModal';
import { SecurityArchitectureModal } from './components/SecurityArchitectureModal';
import { ShieldCheck, Zap, Sparkles, Layers } from 'lucide-react';

export default function App() {
  const [servers, setServers] = useState<MCPServer[]>(MOCK_MCP_SERVERS);
  const [selectedServer, setSelectedServer] = useState<MCPServer>(MOCK_MCP_SERVERS[0]);
  const [currentTab, setCurrentTab] = useState<'home' | 'directory' | 'security' | 'details'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modals
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [serverToInstall, setServerToInstall] = useState<MCPServer>(MOCK_MCP_SERVERS[0]);
  const [isClientConfigOpen, setIsClientConfigOpen] = useState(false);
  const [isLiveAuditorOpen, setIsLiveAuditorOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user-1',
    name: 'Santhi Priya',
    email: 'santhi.priya@enterprise.ai',
    role: 'Lead AI Architect',
    organization: 'Anthropic / MCP Workgroup'
  });

  // Load servers from backend API
  useEffect(() => {
    fetch('/api/servers')
      .then((res) => res.json())
      .then((data) => {
        if (data.servers && data.servers.length > 0) {
          setServers(data.servers);
          // Default selected server to GitHub or first verified server
          const githubServer = data.servers.find((s: MCPServer) => s.id === 'github') || data.servers[0];
          setSelectedServer(githubServer);
        }
      })
      .catch((err) => {
        console.warn('Using mock servers fallback:', err);
      });
  }, []);

  const handleSelectServer = (server: MCPServer) => {
    setSelectedServer(server);
    setCurrentTab('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewSecurityReport = (server: MCPServer) => {
    setSelectedServer(server);
    setCurrentTab('security');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerInstall = (server: MCPServer) => {
    setServerToInstall(server);
    setIsInstallModalOpen(true);
  };

  const handleInstallComplete = (updatedServer: MCPServer) => {
    setServers((prev) =>
      prev.map((s) => (s.id === updatedServer.id ? { ...s, installed: true } : s))
    );
    if (selectedServer.id === updatedServer.id) {
      setSelectedServer((prev) => ({ ...prev, installed: true }));
    }
  };

  const handleAuditComplete = (newServer: MCPServer) => {
    setServers((prev) => {
      const exists = prev.some((s) => s.id === newServer.id);
      if (exists) {
        return prev.map((s) => (s.id === newServer.id ? newServer : s));
      }
      return [newServer, ...prev];
    });
    setSelectedServer(newServer);
  };

  const handleUninstallServer = (serverId: string) => {
    setServers((prev) =>
      prev.map((s) => (s.id === serverId ? { ...s, installed: false } : s))
    );
    if (selectedServer.id === serverId) {
      setSelectedServer((prev) => ({ ...prev, installed: false }));
    }
  };

  const handleToggleServer = (serverId: string) => {
    setServers((prev) =>
      prev.map((s) => (s.id === serverId ? { ...s, installed: !s.installed } : s))
    );
  };

  const installedCount = servers.filter((s) => s.installed).length;

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#10b981]/25 selection:text-[#10b981] flex flex-col">
      {/* Primary Navigation Bar */}
      <Navbar
        currentTab={currentTab === 'details' ? 'directory' : currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        installedCount={installedCount}
        user={currentUser}
        onOpenLiveAuditor={() => setIsLiveAuditorOpen(true)}
        onOpenClientConfig={() => setIsClientConfigOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenArchitectureModal={() => setIsArchitectureModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'home' && (
          <MarketplaceHome
            servers={servers}
            onSelectServer={handleSelectServer}
            onViewSecurityReport={handleViewSecurityReport}
            onInstallServer={handleTriggerInstall}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentTab('directory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenLiveAuditor={() => setIsLiveAuditorOpen(true)}
          />
        )}

        {currentTab === 'directory' && (
          <ServerList
            servers={servers}
            onSelectServer={handleSelectServer}
            onViewSecurityReport={handleViewSecurityReport}
            onInstallServer={handleTriggerInstall}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {currentTab === 'details' && (
          <ServerDetails
            server={selectedServer}
            onBack={() => setCurrentTab('directory')}
            onViewSecurityReport={handleViewSecurityReport}
            onInstallServer={handleTriggerInstall}
          />
        )}

        {currentTab === 'security' && (
          <SecurityReportView
            server={selectedServer}
            allServers={servers}
            onSelectServer={(s) => setSelectedServer(s)}
            onBack={() => setCurrentTab('home')}
            onInstallServer={handleTriggerInstall}
          />
        )}
      </main>

      {/* Persistent Sophisticated Dark Footer */}
      <footer className="mt-auto border-t border-[#1a1a1a] bg-[#050505] py-6 text-[#737373] text-[11px] font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="text-white font-bold tracking-wider uppercase">MCP Registry</span>
            <span className="text-[#555555]">• Standard 2.1 Verified</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => handleViewSecurityReport(servers[0])}
              className="text-[#a3a3a3] hover:text-[#10b981] transition-colors cursor-pointer"
            >
              Security Inspection
            </button>
            <span className="text-[#333333]">•</span>
            <button
              onClick={() => setIsLiveAuditorOpen(true)}
              className="text-[#a3a3a3] hover:text-[#10b981] transition-colors cursor-pointer"
            >
              AST Sandbox
            </button>
            <span className="text-[#333333]">•</span>
            <button
              onClick={() => setIsClientConfigOpen(true)}
              className="text-[#a3a3a3] hover:text-[#10b981] transition-colors cursor-pointer"
            >
              Desktop Client
            </button>
          </div>
        </div>
      </footer>

      {/* 5-Step Animated Installation Modal */}
      <InstallProgressModal
        server={serverToInstall}
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onOpenClientConfig={() => setIsClientConfigOpen(true)}
        onInstallComplete={handleInstallComplete}
      />

      {/* Claude Desktop Client Manager Modal */}
      <ClientConfigModal
        isOpen={isClientConfigOpen}
        onClose={() => setIsClientConfigOpen(false)}
        installedServers={servers.filter((s) => s.installed)}
        onToggleServer={handleToggleServer}
        onUninstallServer={handleUninstallServer}
      />

      {/* 8-Layer Live Repository Scanner Modal */}
      <LiveAuditorModal
        isOpen={isLiveAuditorOpen}
        onClose={() => setIsLiveAuditorOpen(false)}
        onAuditComplete={handleAuditComplete}
        onViewSecurityReport={handleViewSecurityReport}
      />

      {/* User Login Persona Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(u) => setCurrentUser(u)}
      />

      {/* 9-Stage Security Architecture & Tool Matrix Modal */}
      {isArchitectureModalOpen && (
        <SecurityArchitectureModal
          onClose={() => setIsArchitectureModalOpen(false)}
          onOpenLiveScanner={() => setIsLiveAuditorOpen(true)}
        />
      )}
    </div>
  );
}
