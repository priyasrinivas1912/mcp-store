import { parseBody, sendResponse, handleCors, sessionUsers, UserSession } from '../_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  try {
    const body = await parseBody(req);
    const provider = body.provider || 'github';
    const token = `mcp_live_${provider}_${Math.random().toString(36).substring(2, 14)}`;

    const user: UserSession = {
      id: `user-${Date.now()}`,
      name: body.customProfile?.name || (provider === 'anthropic' ? 'Santhi Priya' : 'Alex Chen'),
      email: (body.customProfile?.email || (provider === 'anthropic' ? 'santhi.priya@enterprise.ai' : 'alex.chen@secops.io')).toLowerCase(),
      role: body.customProfile?.role || 'Lead AI Architect',
      organization: body.customProfile?.organization || 'Anthropic / MCP Workgroup',
      authProvider: provider,
      scopes: ['read:user', 'mcp:registry', 'claude:config_sync'],
      accessToken: token,
      verifiedInstallAllowed: true,
      authenticatedAt: new Date().toISOString()
    };

    sessionUsers.set(token, user);

    return sendResponse(res, 200, {
      success: true,
      token: token,
      provider: provider,
      user: user
    });
  } catch (err) {
    return sendResponse(res, 200, { success: true, token: 'mcp_live_token' });
  }
}
