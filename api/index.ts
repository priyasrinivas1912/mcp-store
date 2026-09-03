import { sendResponse, handleCors } from './_utils';
import { resolveRequestPath, identifyRoute } from './_path-resolver';

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

export { resolveRequestPath, identifyRoute } from './_path-resolver';

/**
 * Master Centralized API Handler
 * Single entrypoint for all serverless API requests on Vercel and local environments.
 */
export default async function handler(req: any, res: any) {
  // 1. Handle CORS pre-flight immediately
  if (handleCors(req, res)) return;

  try {
    // 2. Resolve request path with robust header & query normalization
    const normalizedPath = resolveRequestPath(req);
    const routeId = identifyRoute(normalizedPath);

    // 3. Deterministic dispatch based on identified route
    switch (routeId) {
      case 'HEALTH':
        return await healthHandler(req, res);

      case 'SYSTEM_STATUS':
        return await systemStatusHandler(req, res);

      case 'AUTH_LOGIN':
        return await loginHandler(req, res);

      case 'AUTH_LOGOUT':
        return await logoutHandler(req, res);

      case 'AUTH_ME':
        return await meHandler(req, res);

      case 'AUTH_OAUTH':
        return await oauthHandler(req, res);

      case 'AUTH_SIGNUP':
        return await signupHandler(req, res);

      case 'AUTH_USERS':
        return await usersHandler(req, res);

      case 'UNINSTALL':
        return await uninstallHandler(req, res);

      case 'INSTALL':
        return await installHandler(req, res);

      case 'CLAUDE_CONFIG':
        return await claudeConfigHandler(req, res);

      case 'SCAN_REPO':
        return await scanRepoHandler(req, res);

      case 'SIMULATE_TOOL_CALL':
        return await simulateHandler(req, res);

      case 'AI_EXPLAIN_SECURITY':
        return await aiExplainHandler(req, res);

      case 'SERVERS':
      default:
        return await serversHandler(req, res);
    }
  } catch (error: any) {
    console.error('[Central API Dispatcher Error]:', error);
    return sendResponse(res, 500, {
      status: 'error',
      message: error?.message || 'Internal Serverless API Error',
      timestamp: new Date().toISOString()
    });
  }
}
