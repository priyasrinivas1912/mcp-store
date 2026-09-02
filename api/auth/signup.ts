import { parseBody, sendResponse, handleCors, sessionUsers, UserSession } from '../_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  try {
    const body = await parseBody(req);
    const email = String(body.email || 'developer@enterprise.ai').toLowerCase().trim();
    const baseName = body.name || email.split('@')[0];
    const token = `mcp_live_usr_${Math.random().toString(36).substring(2, 14)}`;

    const user: UserSession = {
      id: `user-${Date.now()}`,
      name: String(baseName).replace(/[\._\-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      email: email,
      role: body.role || 'Full-Stack Engineer',
      organization: body.organization || 'Independent Developer',
      authProvider: 'enterprise',
      scopes: ['read:user', 'mcp:registry', 'claude:config_sync'],
      accessToken: token,
      verifiedInstallAllowed: true,
      authenticatedAt: new Date().toISOString()
    };

    sessionUsers.set(token, user);

    return sendResponse(res, 201, {
      success: true,
      message: 'Developer account created.',
      token: token,
      user: user
    });
  } catch (err) {
    return sendResponse(res, 200, { success: true, token: 'mcp_fallback', user: null });
  }
}
