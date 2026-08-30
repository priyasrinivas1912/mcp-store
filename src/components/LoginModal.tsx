import React from 'react';
import { User, X, Check, Shield, ShieldCheck, Key, Lock } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectUser,
}) => {
  if (!isOpen) return null;

  const sampleUsers: UserProfile[] = [
    {
      id: 'user-1',
      name: 'Santhi Priya',
      email: 'santhi.priya@enterprise.ai',
      role: 'Lead AI Architect',
      organization: 'Anthropic / MCP Workgroup',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'user-2',
      name: 'Alex Chen',
      email: 'alex.chen@secops.io',
      role: 'Principal Security Auditor',
      organization: 'Cyber Trust Labs',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'user-3',
      name: 'Devin Vance',
      email: 'devin@frontend.dev',
      role: 'Full-Stack Developer',
      organization: 'AI Studio Builders',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#1a1a1a] flex items-center justify-between bg-[#050505]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#111111] text-[#10b981] border border-[#222222]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-medium text-white font-serif-display">User Persona & Role</h3>
              <p className="text-xs text-[#737373]">Switch workspace profile for this session</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#737373] hover:text-white hover:bg-[#111111] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Persona List */}
        <div className="p-5 space-y-3">
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
                    : 'bg-[#050505] hover:bg-[#111111] border-[#1a1a1a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#111111] border border-[#222222] flex items-center justify-center text-sm font-bold text-[#10b981] shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      {u.name}
                      {isSelected && <span className="text-[10px] text-[#10b981] font-mono uppercase tracking-wider">(Active)</span>}
                    </p>
                    <p className="text-[11px] text-[#10b981] font-mono">{u.role}</p>
                    <p className="text-[10px] text-[#737373] font-sans">{u.organization}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="p-1 rounded-full bg-[#10b981] text-black">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1a1a1a] bg-[#050505] flex items-center justify-between text-xs text-[#737373]">
          <span className="font-mono text-[11px]">Role-Based Access Control</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded text-xs uppercase tracking-wider font-bold bg-[#10b981] hover:bg-[#059669] text-black cursor-pointer transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
