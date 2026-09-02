import { sendResponse, handleCors } from '../_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  return sendResponse(res, 200, {
    total: 3,
    users: [
      {
        id: 'user-1',
        name: 'Santhi Priya',
        email: 'santhi.priya@enterprise.ai',
        role: 'Lead AI Architect',
        organization: 'Anthropic / MCP Workgroup',
        authProvider: 'anthropic',
        scopes: ['read:user', 'mcp:registry', 'claude:config_sync', 'security:audit_repo'],
        verifiedInstallAllowed: true
      },
      {
        id: 'user-2',
        name: 'Alex Chen',
        email: 'alex.chen@secops.io',
        role: 'Principal Security Auditor',
        organization: 'Cyber Trust Labs',
        authProvider: 'github',
        scopes: ['read:user', 'mcp:registry', 'security:audit_repo'],
        verifiedInstallAllowed: true
      },
      {
        id: 'user-3',
        name: 'Devin Vance',
        email: 'devin@frontend.dev',
        role: 'Full-Stack Developer',
        organization: 'AI Studio Builders',
        authProvider: 'google',
        scopes: ['read:user', 'mcp:registry'],
        verifiedInstallAllowed: false
      }
    ]
  });
}
