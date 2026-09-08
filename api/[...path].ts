import { sendResponse, handleCors } from './_lib/_utils.ts';
import { resolveRequestPath, identifyRoute } from './_lib/_path-resolver.ts';

import healthHandler from './_lib/health.ts';
import serversHandler from './_lib/servers.ts';
import installHandler from './_lib/install.ts';
import uninstallHandler from './_lib/uninstall.ts';
import claudeConfigHandler from './_lib/claude-config.ts';
import scanRepoHandler from './_lib/scan-repo.ts';
import simulateHandler from './_lib/simulate-tool-call.ts';
import aiExplainHandler from './_lib/ai-explain-security.ts';
import systemStatusHandler from './_lib/system/status.ts';
import loginHandler from './_lib/auth/login.ts';
import logoutHandler from './_lib/auth/logout.ts';
import meHandler from './_lib/auth/me.ts';
import oauthHandler from './_lib/auth/oauth.ts';
import signupHandler from './_lib/auth/signup.ts';
import usersHandler from './_lib/auth/users.ts';

export { resolveRequestPath, identifyRoute } from './_lib/_path-resolver.ts';

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
