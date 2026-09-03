/**
 * Robust Path Resolution Utility
 * 
 * Accurately extracts, normalizes, and classifies incoming API request routes
 * across Vercel serverless functions, proxy rewrites, and local development environments.
 * Eliminates reliance on brittle catch-all file patterns (like [...all].ts).
 */

export interface ResolvedRoute {
  raw: string;
  normalized: string;
  routeId: string;
  params: Record<string, string>;
}

/**
 * Normalizes any route string:
 * - Collapses repeated slashes
 * - Trims trailing slashes
 * - Strips query parameters and hashes
 * - Strips serverless script suffixes (/index.js, /index.ts, /index)
 */
export function normalizePath(pathStr: string): string {
  if (!pathStr || typeof pathStr !== 'string') return '/api';

  // Strip query string and hash
  let clean = pathStr.split('?')[0].split('#')[0].trim();

  // Collapse consecutive slashes
  clean = clean.replace(/\/+/g, '/');

  // Strip internal dispatcher script targets if present
  clean = clean
    .replace(/\/api\/index\.(js|ts)$/i, '')
    .replace(/\/api\/index$/i, '')
    .replace(/\/index\.(js|ts)$/i, '');

  if (!clean.startsWith('/')) {
    clean = `/${clean}`;
  }

  // Remove trailing slash if longer than 1 character
  if (clean.length > 1 && clean.endsWith('/')) {
    clean = clean.slice(0, -1);
  }

  return clean.toLowerCase();
}

/**
 * Robust Path Resolver
 * 
 * Inspects all Vercel/reverse-proxy headers, query rewrites ($1 / path param),
 * and native request URLs to extract the true target route.
 */
export function resolveRequestPath(req: any): string {
  if (!req) return '/api';

  // 1. Check proxy / Vercel rewrite headers (highest fidelity in serverless)
  const headers = req.headers || {};
  const candidateHeaders = [
    headers['x-matched-path'],
    headers['x-vercel-matched-path'],
    headers['x-forwarded-url'],
    headers['x-original-url'],
    headers['x-rewrite-url']
  ];

  for (const h of candidateHeaders) {
    if (typeof h === 'string' && h.trim()) {
      const normalized = normalizePath(h);
      if (normalized && normalized !== '/api/index' && normalized !== '') {
        return normalized;
      }
    }
  }

  // 2. Check query parameters (e.g. from /api/index.js?path=$1 or req.query.path)
  if (req.query) {
    const qPath = req.query.path || req.query.route || req.query.endpoint || req.query.url;
    if (typeof qPath === 'string' && qPath.trim()) {
      const formatted = qPath.startsWith('/api') ? qPath : `/api/${qPath.replace(/^\//, '')}`;
      return normalizePath(formatted);
    }
    if (Array.isArray(qPath) && qPath.length > 0) {
      return normalizePath(`/api/${qPath.join('/')}`);
    }
  }

  // 3. Check URL searchParams directly from req.url
  if (req.url && typeof req.url === 'string') {
    try {
      const parsed = new URL(req.url, 'http://localhost');
      const paramPath =
        parsed.searchParams.get('path') ||
        parsed.searchParams.get('route') ||
        parsed.searchParams.get('endpoint');

      if (paramPath && paramPath.trim()) {
        const formatted = paramPath.startsWith('/api') ? paramPath : `/api/${paramPath.replace(/^\//, '')}`;
        return normalizePath(formatted);
      }

      const pathname = parsed.pathname;
      const normalizedPn = normalizePath(pathname);
      if (normalizedPn && normalizedPn !== '/api/index' && normalizedPn !== '') {
        return normalizedPn;
      }
    } catch {
      const normalizedRaw = normalizePath(req.url);
      if (normalizedRaw && normalizedRaw !== '/api/index') {
        return normalizedRaw;
      }
    }
  }

  return '/api';
}

/**
 * Route ID Classifier
 * Determines the exact semantic handler for any normalized path.
 */
export function identifyRoute(path: string): string {
  const p = normalizePath(path);

  // Exact & sub-path matching in priority order
  if (p === '/api/health' || p.endsWith('/health')) return 'HEALTH';
  if (p === '/api/system/status' || p === '/api/status' || p.endsWith('/system/status')) return 'SYSTEM_STATUS';
  
  // Auth endpoints
  if (p === '/api/auth/login' || p.endsWith('/auth/login')) return 'AUTH_LOGIN';
  if (p === '/api/auth/logout' || p.endsWith('/auth/logout')) return 'AUTH_LOGOUT';
  if (p === '/api/auth/me' || p.endsWith('/auth/me')) return 'AUTH_ME';
  if (p === '/api/auth/oauth' || p.endsWith('/auth/oauth')) return 'AUTH_OAUTH';
  if (p === '/api/auth/signup' || p.endsWith('/auth/signup')) return 'AUTH_SIGNUP';
  if (p === '/api/auth/users' || p.endsWith('/auth/users')) return 'AUTH_USERS';

  // Server management endpoints
  if (p === '/api/uninstall' || p.endsWith('/uninstall')) return 'UNINSTALL';
  if (p === '/api/install' || p.endsWith('/install')) return 'INSTALL';
  if (p === '/api/claude-config' || p.endsWith('/claude-config')) return 'CLAUDE_CONFIG';
  if (p === '/api/scan-repo' || p.endsWith('/scan-repo')) return 'SCAN_REPO';
  if (p === '/api/simulate-tool-call' || p.endsWith('/simulate-tool-call')) return 'SIMULATE_TOOL_CALL';
  if (p === '/api/ai-explain-security' || p.endsWith('/ai-explain-security')) return 'AI_EXPLAIN_SECURITY';

  // Registry & default
  if (p === '/api/servers' || p.endsWith('/servers')) return 'SERVERS';
  if (p === '/api' || p === '') return 'SERVERS';

  return 'SERVERS';
}
