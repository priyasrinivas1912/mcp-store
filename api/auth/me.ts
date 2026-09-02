import { sendResponse, handleCors, sessionUsers } from '../_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  const authHeader = req.headers?.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (sessionUsers.has(token)) {
      return sendResponse(res, 200, {
        authenticated: true,
        user: sessionUsers.get(token)
      });
    }
  }

  return sendResponse(res, 200, {
    authenticated: true,
    user: {
      id: 'user-1',
      name: 'Santhi Priya',
      email: 'santhi.priya@enterprise.ai',
      role: 'Lead AI Architect',
      organization: 'Anthropic / MCP Workgroup',
      authProvider: 'anthropic',
      scopes: ['read:user', 'mcp:registry', 'claude:config_sync'],
      accessToken: 'mcp_live_ant_8f73b190a2c84d6e81',
      verifiedInstallAllowed: true
    }
  });
}
