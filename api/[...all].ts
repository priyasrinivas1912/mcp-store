import { sendResponse, handleCors, MOCK_SERVERS, installedIds } from './_utils';
import healthHandler from './health';
import serversHandler from './servers';
import installHandler from './install';
import uninstallHandler from './uninstall';
import claudeConfigHandler from './claude-config';
import scanRepoHandler from './scan-repo';
import simulateHandler from './simulate-tool-call';
import aiExplainHandler from './ai-explain-security';
import systemStatusHandler from './system/status';
import loginHandler from './auth/login';
import logoutHandler from './auth/logout';
import meHandler from './auth/me';
import oauthHandler from './auth/oauth';
import signupHandler from './auth/signup';
import usersHandler from './auth/users';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  const url = (req.url || '').toLowerCase();

  // Smart dispatcher for any catch-all Vercel route
  if (url.includes('/health')) return healthHandler(req, res);
  if (url.includes('/system/status') || url.includes('/status')) return systemStatusHandler(req, res);
  if (url.includes('/auth/login')) return loginHandler(req, res);
  if (url.includes('/auth/logout')) return logoutHandler(req, res);
  if (url.includes('/auth/me')) return meHandler(req, res);
  if (url.includes('/auth/oauth')) return oauthHandler(req, res);
  if (url.includes('/auth/signup')) return signupHandler(req, res);
  if (url.includes('/auth/users')) return usersHandler(req, res);
  if (url.includes('/install') && !url.includes('/uninstall')) return installHandler(req, res);
  if (url.includes('/uninstall')) return uninstallHandler(req, res);
  if (url.includes('/claude-config')) return claudeConfigHandler(req, res);
  if (url.includes('/scan-repo')) return scanRepoHandler(req, res);
  if (url.includes('/simulate-tool-call')) return simulateHandler(req, res);
  if (url.includes('/ai-explain-security')) return aiExplainHandler(req, res);
  if (url.includes('/servers')) return serversHandler(req, res);

  const updatedServers = MOCK_SERVERS.map((s) => ({
    ...s,
    installed: installedIds.has(s.id)
  }));

  return sendResponse(res, 200, {
    status: 'ok',
    total: updatedServers.length,
    servers: updatedServers,
    installedCount: installedIds.size,
    verifiedCount: updatedServers.filter((s) => s.verified).length,
    categories: Array.from(new Set(updatedServers.map((s) => s.category)))
  });
}
