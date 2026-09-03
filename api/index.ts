import { sendResponse, handleCors } from './_utils';
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

/**
 * Smart Path Resolver
 * Normalizes request paths across local dev, custom Express, and Vercel serverless rewrites.
 */
export function resolvePath(req: any): string {
  if (!req) return '/api';

  // 1. Check Vercel/proxy matched path headers
  const candidateHeader =
    req.headers?.['x-matched-path'] ||
    req.headers?.['x-vercel-matched-path'] ||
    req.headers?.['x-forwarded-url'] ||
    req.headers?.['x-original-url'] ||
    req.headers?.['x-rewrite-url'];

  if (candidateHeader && typeof candidateHeader === 'string') {
    const cleanHeader = candidateHeader.split('?')[0];
    if (!cleanHeader.endsWith('/api/index.js') && !cleanHeader.endsWith('/api/index')) {
      return cleanHeader;
    }
  }

  // 2. Check query parameter route/path (e.g. /api/index.js?path=servers)
  try {
    const rawUrl = req.url || '';
    const parsed = new URL(rawUrl, 'http://localhost');
    const paramPath = parsed.searchParams.get('path') || parsed.searchParams.get('route');
    if (paramPath) {
      return paramPath.startsWith('/') ? paramPath : `/api/${paramPath}`;
    }

    const pn = parsed.pathname;
    if (pn && !pn.endsWith('/api/index.js') && !pn.endsWith('/api/index') && pn !== '/api' && pn !== '/api/') {
      return pn;
    }
  } catch {}

  // 3. Check req.query if populated by serverless platform
  if (req.query) {
    const qPath = req.query.path || req.query.route;
    if (typeof qPath === 'string') {
      return qPath.startsWith('/') ? qPath : `/api/${qPath}`;
    }
  }

  // 4. Raw req.url fallback
  if (req.url && typeof req.url === 'string') {
    const cleanUrl = req.url.split('?')[0];
    if (!cleanUrl.endsWith('/api/index.js') && !cleanUrl.endsWith('/api/index')) {
      return cleanUrl;
    }
  }

  return '/api';
}

/**
 * Master Smart Dispatcher
 * Centralized routing and execution for all MCP Store API endpoints
 */
export default async function handler(req: any, res: any) {
  // Universal CORS pre-flight handling
  if (handleCors(req, res)) return;

  try {
    const rawPath = resolvePath(req);
    const path = rawPath.toLowerCase();

    // Route dispatching
    if (path.includes('/health')) {
      return await healthHandler(req, res);
    }
    if (path.includes('/system/status') || path.includes('/system') || path.endsWith('/status')) {
      return await systemStatusHandler(req, res);
    }
    if (path.includes('/auth/login')) {
      return await loginHandler(req, res);
    }
    if (path.includes('/auth/logout')) {
      return await logoutHandler(req, res);
    }
    if (path.includes('/auth/me')) {
      return await meHandler(req, res);
    }
    if (path.includes('/auth/oauth')) {
      return await oauthHandler(req, res);
    }
    if (path.includes('/auth/signup')) {
      return await signupHandler(req, res);
    }
    if (path.includes('/auth/users')) {
      return await usersHandler(req, res);
    }
    if (path.includes('/uninstall')) {
      return await uninstallHandler(req, res);
    }
    if (path.includes('/install')) {
      return await installHandler(req, res);
    }
    if (path.includes('/claude-config')) {
      return await claudeConfigHandler(req, res);
    }
    if (path.includes('/scan-repo')) {
      return await scanRepoHandler(req, res);
    }
    if (path.includes('/simulate-tool-call')) {
      return await simulateHandler(req, res);
    }
    if (path.includes('/ai-explain-security')) {
      return await aiExplainHandler(req, res);
    }
    if (path.includes('/servers') || path === '/api' || path === '/api/') {
      return await serversHandler(req, res);
    }

    // Default fallback: Always return servers registry data with 200 OK
    return await serversHandler(req, res);
  } catch (error: any) {
    console.error('[API Smart Dispatcher Error]:', error);
    return sendResponse(res, 500, {
      status: 'error',
      message: error?.message || 'Internal Serverless API Error',
      timestamp: new Date().toISOString()
    });
  }
}
