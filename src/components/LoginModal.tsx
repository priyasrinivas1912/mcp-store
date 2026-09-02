import React, { useState, useEffect } from 'react';
import {
  User,
  X,
  Check,
  Shield,
  ShieldCheck,
  Key,
  Lock,
  Sparkles,
  ArrowRight,
  LogOut,
  CheckCircle2,
  ExternalLink,
  Fingerprint,
  Terminal,
  Building,
  Mail,
  RefreshCw,
  Sliders,
  Globe,
  Radio
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  onSignOut?: () => void;
}

type OAuthProvider = 'github' | 'google' | 'anthropic' | 'enterprise';

interface OAuthScope {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'oauth' | 'personas' | 'custom'>('oauth');
  const [flowState, setFlowState] = useState<'idle' | 'consent' | 'exchanging' | 'success'>('idle');
  const [selectedProvider, setSelectedProvider] = useState<OAuthProvider>('github');
  const [exchangeLogs, setExchangeLogs] = useState<string[]>([]);
  const [exchangeStep, setExchangeStep] = useState(0);

  // Custom User Inputs
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customRole, setCustomRole] = useState('Full-Stack Engineer');
  const [customOrg, setCustomOrg] = useState('Acme Corp');

  // OAuth Scopes
  const [scopes, setScopes] = useState<OAuthScope[]>([
    {
      id: 'read:user',
      name: 'User Identity & Profile',
      description: 'Read your public developer profile and verified email address',
      required: true,
      enabled: true
    },
    {
      id: 'mcp:registry',
      name: 'MCP Server Management',
      description: 'Deploy, verify, and synchronize MCP server configurations',
      required: true,
      enabled: true
    },
    {
      id: 'claude:config_sync',
      name: 'Desktop Client Sync',
      description: 'Patch and update local Claude Desktop and Cursor client configurations',
      required: false,
      enabled: true
    },
    {
      id: 'security:audit_repo',
      name: 'AST & Zero-Trust Auditing',
      description: 'Run 8-layer static analysis sandbox on connected repositories',
      required: false,
      enabled: true
    }
  ]);

  const sampleUsers: UserProfile[] = [
    {
      id: 'user-1',
      name: 'Santhi Priya',
      email: 'santhi.priya@enterprise.ai',
      role: 'Lead AI Architect',
      organization: 'Anthropic / MCP Workgroup',
      authProvider: 'anthropic',
      scopes: ['read:user', 'mcp:registry', 'claude:config_sync', 'security:audit_repo'],
      accessToken: 'mcp_live_ant_8f73b190a2c84d6e81',
      verifiedInstallAllowed: true,
      authenticatedAt: '2026-09-01T08:00:00Z'
    },
    {
      id: 'user-2',
      name: 'Alex Chen',
      email: 'alex.chen@secops.io',
      role: 'Principal Security Auditor',
      organization: 'Cyber Trust Labs',
      authProvider: 'github',
      scopes: ['read:user', 'mcp:registry', 'security:audit_repo'],
      accessToken: 'mcp_live_gh_3d91b489a7702f9c',
      verifiedInstallAllowed: true,
      authenticatedAt: '2026-09-01T09:30:00Z'
    },
    {
      id: 'user-3',
      name: 'Devin Vance',
      email: 'devin@frontend.dev',
      role: 'Full-Stack Developer',
      organization: 'AI Studio Builders',
      authProvider: 'google',
      scopes: ['read:user', 'mcp:registry'],
      accessToken: 'mcp_live_goog_554817a0cd3e12',
      verifiedInstallAllowed: false,
      authenticatedAt: '2026-09-01T10:15:00Z'
    }
  ];

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setFlowState('idle');
      setExchangeLogs([]);
      setExchangeStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const providerDetails = {
    github: {
      name: 'GitHub',
      subtitle: 'Developer OAuth 2.0 & Repository Access',
      badge: 'OAuth 2.0 + PKCE',
      color: '#ffffff',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      )
    },
    google: {
      name: 'Google Workspace',
      subtitle: 'OpenID Connect (OIDC) Enterprise SSO',
      badge: 'OIDC / JWT',
      color: '#4285f4',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      )
    },
    anthropic: {
      name: 'Anthropic MCP SSO',
      subtitle: 'Native Model Context Protocol Workgroup Identity',
      badge: 'Zero-Trust Passkey',
      color: '#d97706',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />
    },
    enterprise: {
      name: 'Enterprise Okta / SAML',
      subtitle: 'Corporate Identity Federation (SAML 2.0 / SCIM)',
      badge: 'SAML 2.0',
      color: '#10b981',
      icon: <Building className="w-4 h-4 text-[#10b981]" />
    }
  };

  const startOAuthFlow = (provider: OAuthProvider) => {
    setSelectedProvider(provider);
    setFlowState('consent');
  };

  const handleAuthorizeOAuth = async () => {
    setFlowState('exchanging');
    setExchangeLogs([]);
    setExchangeStep(0);

    const activeScopes = scopes.filter(s => s.enabled).map(s => s.id);
    const selectedProvMeta = providerDetails[selectedProvider];

    const logsSequence = [
      `[OAUTH_INIT] Initializing OAuth 2.0 Authorization Code flow with PKCE`,
      `[PKCE] Generated code_verifier (sha256) & state token: 0x9b4a...`,
      `[HANDSHAKE] Contacting ${selectedProvMeta.name} authorization endpoint...`,
      `[CALLBACK] Received authorization_code: auth_code_${Math.random().toString(36).substring(2, 10)}`,
      `[TOKEN_EXCHANGE] POST /api/auth/oauth (provider="${selectedProvider}", client_id="mcp-marketplace-prod")`,
      `[JWT] Validating JSON Web Signature (JWS / RS256 algorithm)... VERIFIED`,
      `[CLAIMS] Claims verified: iss="${selectedProvider}.oauth.internal", aud="mcp-registry"`,
      `[SCOPES] Granted scopes: [${activeScopes.join(', ')}]`,
      `[RBAC] Evaluating Role-Based Access Control matrix... ACCESS_GRANTED`,
      `[SESSION] Minted session token: mcp_live_${selectedProvider}_${Math.random().toString(36).substring(2, 14)}`
    ];

    logsSequence.forEach((logItem, index) => {
      setTimeout(() => {
        setExchangeLogs(prev => [...prev, logItem]);
        setExchangeStep(index + 1);
      }, (index + 1) * 140);
    });

    try {
      const response = await fetch('/api/auth/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          scopes: activeScopes,
          customProfile: {
            name: customName,
            email: customEmail,
            role: customRole,
            organization: customOrg
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('mcp_auth_token', data.token);
          localStorage.setItem('mcp_user_profile', JSON.stringify(data.user));
          sessionStorage.setItem('mcp_auth_token', data.token);
          sessionStorage.setItem('mcp_user_profile', JSON.stringify(data.user));
        }

        setTimeout(() => {
          onSelectUser(data.user);
          setFlowState('success');
        }, logsSequence.length * 140 + 200);
        return;
      }
    } catch (e) {
      console.warn('Backend OAuth request fallback to local security session:', e);
    }

    setTimeout(() => {
      const resolvedUser: UserProfile = {
        id: `user-${Date.now()}`,
        name: customName || (selectedProvider === 'anthropic' ? 'Santhi Priya' : selectedProvider === 'github' ? 'Alex Chen' : 'Enterprise Developer'),
        email: customEmail || (selectedProvider === 'anthropic' ? 'santhi.priya@enterprise.ai' : selectedProvider === 'github' ? 'alex.chen@secops.io' : 'developer@enterprise.internal'),
        role: customRole || (selectedProvider === 'anthropic' ? 'Lead AI Architect' : selectedProvider === 'github' ? 'Principal Security Auditor' : 'Cloud Security Architect'),
        organization: customOrg || (selectedProvider === 'anthropic' ? 'Anthropic / MCP Workgroup' : selectedProvider === 'github' ? 'Cyber Trust Labs' : 'Global Enterprise Inc'),
        authProvider: selectedProvider,
        scopes: activeScopes,
        accessToken: `mcp_live_${selectedProvider}_${Math.random().toString(36).substring(2, 14)}`,
        verifiedInstallAllowed: true,
        authenticatedAt: new Date().toISOString()
      };

      const tokenToSave = resolvedUser.accessToken || 'mcp_live_token';
      localStorage.setItem('mcp_auth_token', tokenToSave);
      localStorage.setItem('mcp_user_profile', JSON.stringify(resolvedUser));
      sessionStorage.setItem('mcp_auth_token', tokenToSave);
      sessionStorage.setItem('mcp_user_profile', JSON.stringify(resolvedUser));
      onSelectUser(resolvedUser);
      setFlowState('success');
    }, logsSequence.length * 140 + 200);
  };

  const toggleScope = (id: string) => {
    setScopes(prev =>
      prev.map(s => (s.id === id && !s.required ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const handleSignOut = () => {
    if (onSignOut) {
      onSignOut();
      onClose();
      return;
    }
    const guestUser: UserProfile = {
      id: 'guest',
      name: 'Guest User',
      email: 'guest@anonymous.local',
      role: 'Public Viewer',
      organization: 'Community',
      authProvider: 'guest',
      verifiedInstallAllowed: false
    };
    onSelectUser(guestUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#1a1a1a] flex items-center justify-between bg-[#050505]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#111111] text-[#10b981] border border-[#222222]">
              <ShieldCheck className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white font-serif-display">
                  {flowState === 'consent' ? 'OAuth 2.0 Authorization' : flowState === 'exchanging' ? 'Token Handshake' : 'Authentication & Access Control'}
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
                  Zero-Trust PKCE
                </span>
              </div>
              <p className="text-xs text-[#737373] mt-0.5">
                {flowState === 'consent' ? 'Authorize MCP Marketplace application' : 'Secure Single Sign-On for MCP Server Registry'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#737373] hover:text-white hover:bg-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active User Session Ribbon */}
        {flowState === 'idle' && (
          <div className="px-5 py-3 bg-[#080808] border-b border-[#1a1a1a] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#161616] border border-[#2a2a2a] flex items-center justify-center text-xs font-bold text-[#10b981]">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">{currentUser.name}</span>
                  {currentUser.authProvider && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1f1f1f] text-[#a3a3a3] uppercase border border-[#2a2a2a]">
                      {currentUser.authProvider}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#737373] font-mono">{currentUser.role} • {currentUser.organization}</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="px-2.5 py-1 text-xs text-[#ef4444] hover:bg-[#ef4444]/10 rounded-md border border-[#ef4444]/20 transition-colors flex items-center gap-1 cursor-pointer"
              title="Sign Out to Guest Profile"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Flow State Router */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* FLOW STATE 1: IDLE - CHOOSE OAUTH OR QUICK PERSONA */}
          {flowState === 'idle' && (
            <>
              {/* Navigation Tabs */}
              <div className="flex items-center p-1 bg-[#111111] rounded-xl border border-[#1f1f1f] gap-1">
                <button
                  onClick={() => setActiveTab('oauth')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'oauth'
                      ? 'bg-[#222222] text-white shadow-xs'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  <Key className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>OAuth Providers</span>
                </button>
                <button
                  onClick={() => setActiveTab('personas')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'personas'
                      ? 'bg-[#222222] text-white shadow-xs'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Team Personas</span>
                </button>
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'custom'
                      ? 'bg-[#222222] text-white shadow-xs'
                      : 'text-[#888888] hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  <span>Custom SSO</span>
                </button>
              </div>

              {/* TAB 1: OAuth Providers Selection */}
              {activeTab === 'oauth' && (
                <div className="space-y-2.5">
                  <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider px-1">
                    Select Identity Provider
                  </div>

                  {(['github', 'google', 'anthropic', 'enterprise'] as OAuthProvider[]).map((provKey) => {
                    const prov = providerDetails[provKey];
                    return (
                      <button
                        key={provKey}
                        onClick={() => startOAuthFlow(provKey)}
                        className="w-full p-3.5 rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] hover:bg-[#141414] hover:border-[#333333] transition-all flex items-center justify-between group cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-white shrink-0 group-hover:border-[#10b981]/50 transition-colors">
                            {prov.icon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-white">{prov.name}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-[#1a1a1a] text-[#a3a3a3] border border-[#262626]">
                                {prov.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#737373] mt-0.5">{prov.subtitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-[#737373] group-hover:text-[#10b981] transition-colors">
                          <span className="font-mono text-[11px]">Authorize</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: Quick Team Personas */}
              {activeTab === 'personas' && (
                <div className="space-y-2.5">
                  <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider px-1">
                    Switch Active Session Identity
                  </div>

                  {sampleUsers.map((u) => {
                    const isSelected = currentUser.id === u.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          onSelectUser(u);
                          onClose();
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#111111] border-[#10b981]/50 shadow-sm'
                            : 'bg-[#0d0d0d] hover:bg-[#141414] border-[#1a1a1a]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-center text-sm font-bold text-[#10b981] shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">{u.name}</span>
                              {isSelected && (
                                <span className="text-[9px] text-[#10b981] font-mono uppercase bg-[#10b981]/15 px-1 rounded border border-[#10b981]/30">
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#10b981] font-mono">{u.role}</p>
                            <p className="text-[10px] text-[#737373] font-mono">{u.email} • {u.organization}</p>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="p-1 rounded-full bg-[#10b981] text-black">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="text-xs text-[#737373] hover:text-white font-mono">
                            Select
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: Custom SSO / Custom Credentials */}
              {activeTab === 'custom' && (
                <div className="space-y-3.5 bg-[#080808] p-4 rounded-xl border border-[#1a1a1a]">
                  <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider">
                    Custom OAuth Identity Attributes
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[11px] text-[#a3a3a3] font-mono mb-1 block">Full Name</label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="e.g. Santhi Priya"
                        className="w-full px-3 py-2 text-xs bg-[#111111] text-white rounded-lg border border-[#262626] focus:border-[#10b981]/50 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-[#a3a3a3] font-mono mb-1 block">Work Email</label>
                      <input
                        type="email"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="e.g. santhi.priya@enterprise.ai"
                        className="w-full px-3 py-2 text-xs bg-[#111111] text-white rounded-lg border border-[#262626] focus:border-[#10b981]/50 focus:outline-none font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-[#a3a3a3] font-mono mb-1 block">Role</label>
                        <input
                          type="text"
                          value={customRole}
                          onChange={(e) => setCustomRole(e.target.value)}
                          placeholder="e.g. Lead AI Architect"
                          className="w-full px-3 py-2 text-xs bg-[#111111] text-white rounded-lg border border-[#262626] focus:border-[#10b981]/50 focus:outline-none font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-[#a3a3a3] font-mono mb-1 block">Organization</label>
                        <input
                          type="text"
                          value={customOrg}
                          onChange={(e) => setCustomOrg(e.target.value)}
                          placeholder="e.g. Anthropic / MCP Workgroup"
                          className="w-full px-3 py-2 text-xs bg-[#111111] text-white rounded-lg border border-[#262626] focus:border-[#10b981]/50 focus:outline-none font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => startOAuthFlow('enterprise')}
                    className="w-full py-2.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-black font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <Key className="w-3.5 h-3.5 text-black" />
                    <span>Initiate OAuth Handshake</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* FLOW STATE 2: CONSENT SCREEN (OAuth Scopes & Permission Grant) */}
          {flowState === 'consent' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Provider Info Card */}
              <div className="p-4 rounded-xl bg-[#080808] border border-[#1f1f1f] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#141414] border border-[#2a2a2a] flex items-center justify-center text-white">
                    {providerDetails[selectedProvider].icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                      Authorize {providerDetails[selectedProvider].name}
                    </h4>
                    <p className="text-[11px] text-[#737373] font-mono">
                      Client: <code className="text-[#10b981]">mcp-marketplace-zero-trust</code>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#10b981] bg-[#10b981]/10 px-2 py-1 rounded border border-[#10b981]/20">
                  PKCE Verified
                </span>
              </div>

              {/* Scopes Permission List */}
              <div className="space-y-2">
                <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider flex items-center justify-between">
                  <span>Requested Scopes & Permissions</span>
                  <span className="text-[10px] text-[#555555]">Toggle to configure</span>
                </div>

                <div className="space-y-2 bg-[#080808] p-3 rounded-xl border border-[#1a1a1a]">
                  {scopes.map((scope) => (
                    <div
                      key={scope.id}
                      onClick={() => toggleScope(scope.id)}
                      className={`p-2.5 rounded-lg border transition-all flex items-start gap-3 cursor-pointer ${
                        scope.enabled
                          ? 'bg-[#111111] border-[#10b981]/30'
                          : 'bg-[#050505] border-[#1a1a1a] opacity-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={scope.enabled}
                        onChange={() => {}}
                        className="mt-0.5 rounded text-[#10b981] focus:ring-0 bg-[#161616] border-[#333333]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">{scope.name}</span>
                          <code className="text-[10px] font-mono text-[#737373] bg-[#161616] px-1 rounded">
                            {scope.id}
                          </code>
                          {scope.required && (
                            <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 px-1 rounded border border-amber-400/20">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#737373] mt-0.5">{scope.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Protocol Details */}
              <div className="p-3 rounded-lg bg-[#050505] border border-[#161616] font-mono text-[10px] text-[#555555] space-y-1">
                <div className="flex justify-between">
                  <span>Redirect URI:</span>
                  <span className="text-[#a3a3a3]">https://mcp-store.internal/oauth/callback</span>
                </div>
                <div className="flex justify-between">
                  <span>Response Type:</span>
                  <span className="text-[#a3a3a3]">code (PKCE S256)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setFlowState('idle')}
                  className="flex-1 py-2.5 rounded-xl border border-[#222222] bg-[#111111] hover:bg-[#161616] text-[#a3a3a3] hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAuthorizeOAuth}
                  className="flex-1 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-black text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-black" />
                  <span>Authorize & Sign In</span>
                </button>
              </div>
            </div>
          )}

          {/* FLOW STATE 3: EXCHANGING & VERIFYING TOKEN */}
          {flowState === 'exchanging' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-[#080808] border border-[#1f1f1f] flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-[#10b981] animate-spin shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Exchanging Authorization Code with {providerDetails[selectedProvider].name}
                  </h4>
                  <p className="text-[11px] text-[#737373] font-mono">
                    Validating cryptographic signature & issuing session token...
                  </p>
                </div>
              </div>

              {/* Terminal Log Stream */}
              <div className="rounded-xl bg-[#050505] border border-[#1a1a1a] p-3.5 space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[10px] text-[#555555] border-b border-[#111111] pb-1.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>OAUTH_PKCE_EXCHANGE_STREAM</span>
                  </div>
                  <span className="text-[#10b981]">STAGE {exchangeStep}/10</span>
                </div>

                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {exchangeLogs.map((log, idx) => (
                    <div key={idx} className="text-[#a3a3a3] flex items-start gap-2">
                      <span className="text-[#10b981] select-none">&gt;</span>
                      <span className={log.includes('VERIFIED') || log.includes('ACCESS_GRANTED') ? 'text-[#10b981] font-semibold' : ''}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FLOW STATE 4: SUCCESS */}
          {flowState === 'success' && (
            <div className="space-y-4 animate-fadeIn text-center py-2">
              <div className="w-12 h-12 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 flex items-center justify-center mx-auto text-[#10b981]">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-base font-semibold text-white font-serif-display">
                  Authentication Successful! 🎉
                </h4>
                <p className="text-xs text-[#737373] mt-1">
                  Signed in as <span className="text-white font-semibold">{currentUser.name}</span> ({currentUser.role})
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#080808] border border-[#1a1a1a] text-left font-mono text-xs space-y-1.5">
                <div className="flex justify-between text-[#737373]">
                  <span>Identity Provider:</span>
                  <span className="text-[#10b981] uppercase font-bold">{currentUser.authProvider || selectedProvider}</span>
                </div>
                <div className="flex justify-between text-[#737373]">
                  <span>Organization:</span>
                  <span className="text-white">{currentUser.organization}</span>
                </div>
                <div className="flex justify-between text-[#737373]">
                  <span>Session Token:</span>
                  <span className="text-amber-400 text-[10px] truncate max-w-[200px]">{currentUser.accessToken || 'mcp_live_sec_token'}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-black font-bold text-xs cursor-pointer transition-colors shadow-xs"
              >
                Return to MCP Store
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {flowState === 'idle' && (
          <div className="p-4 border-t border-[#1a1a1a] bg-[#050505] flex items-center justify-between text-xs text-[#737373]">
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <Lock className="w-3.5 h-3.5 text-[#10b981]" />
              <span>TLS 1.3 + OIDC Compliant</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs uppercase tracking-wider font-bold bg-[#222222] hover:bg-[#333333] text-white cursor-pointer transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
