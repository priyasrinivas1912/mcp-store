import { sendResponse, handleCors } from '../server/api-internal/_utils';
import { resolveRequestPath, identifyRoute } from '../server/api-internal/_path-resolver';

import healthHandler from '../server/api-internal/health';
import serversHandler from '../server/api-internal/servers';
import installHandler from '../server/api-internal/install';
import uninstallHandler from '../server/api-internal/uninstall';
import claudeConfigHandler from '../server/api-internal/claude-config';
import scanRepoHandler from '../server/api-internal/scan-repo';
import simulateHandler from '../server/api-internal/simulate-tool-call';
import aiExplainHandler from '../server/api-internal/ai-explain-security';
import systemStatusHandler from '../server/api-internal/system/status';
import loginHandler from '../server/api-internal/auth/login';
import logoutHandler from '../server/api-internal/auth/logout';
import meHandler from '../server/api-internal/auth/me';
import oauthHandler from '../server/api-internal/auth/oauth';
import signupHandler from '../server/api-internal/auth/signup';
import usersHandler from '../server/api-internal/auth/users';

export { resolveRequestPath, identifyRoute } from '../server/api-internal/_path-resolver';

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
