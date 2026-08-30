import React, { useState } from 'react';
import {
  Cpu,
  X,
  Copy,
  Check,
  Download,
  Trash2,
  Power,
  ShieldCheck,
  Folder,
  Database,
  Github,
  Search,
  MessageSquare,
  Server,
  Zap,
  Lock
} from 'lucide-react';
import { MCPServer } from '../types';

interface ClientConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  installedServers: MCPServer[];
  onToggleServer: (serverId: string) => void;
  onUninstallServer: (serverId: string) => void;
}

export const ClientConfigModal: React.FC<ClientConfigModalProps> = ({
  isOpen,
  onClose,
  installedServers,
  onToggleServer,
  onUninstallServer,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedClient, setSelectedClient] = useState<'claude' | 'cursor' | 'windsurf'>('claude');

  if (!isOpen) return null;

  // Generate combined config
  const generateFullConfig = () => {
    const mcpServersMap: Record<string, any> = {};
    installedServers.forEach((server) => {
      mcpServersMap[server.id] = {
        command: server.executable,
        args: server.defaultArgs,
        env: server.envRequirements.reduce((acc, env) => {
          acc[env.name] = env.placeholder || 'YOUR_KEY_HERE';
          return acc;
        }, {} as Record<string, string>)
      };
    });

    if (selectedClient === 'claude') {
      return JSON.stringify({ mcpServers: mcpServersMap }, null, 2);
    }
    if (selectedClient === 'cursor') {
      return JSON.stringify({
        mcp: {
          servers: installedServers.map(s => ({
            name: s.name,
            type: s.transport,
            command: `${s.executable} ${s.defaultArgs.join(' ')}`
          }))
        }
      }, null, 2);
    }
    return JSON.stringify({ servers: mcpServersMap }, null, 2);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateFullConfig());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadConfigFile = () => {
    const blob = new Blob([generateFullConfig()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedClient === 'claude' ? 'claude_desktop_config.json' : 'mcp.json';
    a.click();
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'github': return <Github className="w-full h-full" />;
      case 'postgres': return <Database className="w-full h-full" />;
      case 'filesystem': return <Folder className="w-full h-full" />;
      case 'brave-search': return <Search className="w-full h-full" />;
      case 'slack': return <MessageSquare className="w-full h-full" />;
      default: return <Server className="w-full h-full" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#1a1a1a] flex items-center justify-between bg-[#050505]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#111111] border border-[#222222] flex items-center justify-center text-[#10b981]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-medium text-white flex items-center gap-2 font-serif-display">
                Desktop MCP Client Integration
              </h3>
              <p className="text-xs text-[#737373] font-mono">
                Synchronized with Claude Desktop • {installedServers.length} Active Servers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#737373] hover:text-white hover:bg-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Active Connected MCP Servers List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#737373] font-bold">
                Connected Model Context Protocol Servers ({installedServers.length})
              </h4>
              <span className="text-[11px] font-mono text-[#10b981] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                Live Daemon Synced
              </span>
            </div>

            {installedServers.length === 0 ? (
              <div className="p-6 rounded-xl bg-[#050505] border border-dashed border-[#1a1a1a] text-center space-y-2">
                <p className="text-xs text-[#737373] font-mono">
                  No MCP servers are currently installed in your client.
                </p>
                <p className="text-xs text-[#555555]">
                  Browse the marketplace and click &quot;Install&quot; on any verified server.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {installedServers.map((server) => (
                  <div
                    key={server.id}
                    className="p-3.5 rounded-xl bg-[#050505] border border-[#1a1a1a] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#111111] border border-[#222222] p-1.5 flex items-center justify-center text-[#10b981] shrink-0">
                        {getIcon(server.id)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white">{server.name}</p>
                          <span className="text-[10px] font-mono text-[#10b981] bg-[#10b981]/10 px-1.5 py-0.5 rounded border border-[#10b981]/20">
                            Trust: {server.trustScore}/100
                          </span>
                        </div>
                        <p className="text-[11px] text-[#737373] font-mono">
                          {server.executable} {server.defaultArgs.join(' ')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUninstallServer(server.id)}
                        className="p-2 rounded text-[#737373] hover:text-rose-400 hover:bg-[#111111] transition-colors cursor-pointer"
                        title="Disconnect from Claude Desktop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Config file preview and client selector */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#737373] uppercase tracking-wider">Target Client:</span>
                <div className="flex items-center bg-[#050505] border border-[#1a1a1a] rounded p-0.5">
                  {(['claude', 'cursor', 'windsurf'] as const).map((client) => (
                    <button
                      key={client}
                      onClick={() => setSelectedClient(client)}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        selectedClient === client
                          ? 'bg-[#111111] text-[#10b981] border border-[#222222]'
                          : 'text-[#737373] hover:text-white'
                      }`}
                    >
                      {client === 'claude' ? 'Claude Desktop' : client}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1.5 rounded text-xs uppercase tracking-wider font-semibold bg-transparent hover:bg-[#111111] text-[#e5e5e5] border border-[#333333] hover:border-[#555555] flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  {copied ? (
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

                <button
                  onClick={downloadConfigFile}
                  className="px-3 py-1.5 rounded text-xs uppercase tracking-wider font-semibold bg-transparent hover:bg-[#111111] text-[#e5e5e5] border border-[#333333] hover:border-[#555555] flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-[#737373]" />
                  Download File
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-[#050505] border border-[#1a1a1a] text-[#10b981] text-xs font-mono overflow-x-auto max-h-56 leading-relaxed">
              {generateFullConfig()}
            </pre>

            <p className="text-[11px] text-[#555555] font-mono">
              Desktop location: <code className="text-[#a3a3a3]">~/Library/Application Support/Claude/claude_desktop_config.json</code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1a1a1a] bg-[#050505] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded text-xs uppercase tracking-wider font-bold bg-[#10b981] hover:bg-[#059669] text-black cursor-pointer transition-all"
          >
            Close Manager
          </button>
        </div>
      </div>
    </div>
  );
};
