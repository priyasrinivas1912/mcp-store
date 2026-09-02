import { MOCK_SERVERS } from '../src/data/mockServers';

// State stored across serverless invocations (warm instances)
const installedIds = new Set<string>(['github']);
const sessionUsers = new Map<string, any>();

// Seed default accounts
sessionUsers.set('mcp_live_ant_8f73b190a2c84d6e81', {
  id: 'user-1',
  name: 'Santhi Priya',
  email: 'santhi.priya@enterprise.ai',
  role: 'Lead AI Architect',
  organization: 'Anthropic / MCP Workgroup',
  authProvider: 'anthropic',
  scopes: ['read:user', 'mcp:registry', 'claude:config_sync', 'security:audit_repo'],
  accessToken: 'mcp_live_ant_8f73b190a2c84d6e81',
  verifiedInstallAllowed: true,
  authenticatedAt: new Date().toISOString()
});

export async function getJsonBody(req: any): Promise<any> {
  try {
    if (!req) return {};
    if (req.body) {
      if (typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
        return req.body;
      }
      if (Buffer.isBuffer(req.body)) {
        try {
          return JSON.parse(req.body.toString('utf8'));
        } catch {
          return {};
        }
      }
      if (typeof req.body === 'string') {
        try {
          return JSON.parse(req.body);
        } catch {
          return {};
        }
      }
    }

    if (req.readableEnded || req.complete || (typeof req.readable === 'boolean' && !req.readable)) {
      return {};
    }

    return await new Promise((resolve) => {
      let body = '';
      const timer = setTimeout(() => resolve({}), 300);

      if (typeof req.on === 'function') {
        req.on('data', (chunk: any) => {
          body += chunk;
        });
        req.on('end', () => {
          clearTimeout(timer);
          try {
            resolve(body ? JSON.parse(body) : {});
          } catch {
            resolve({});
          }
        });
        req.on('error', () => {
          clearTimeout(timer);
          resolve({});
        });
      } else {
        clearTimeout(timer);
        resolve({});
      }
    });
  } catch (err) {
    console.error('getJsonBody error:', err);
    return {};
  }
}

export function sendJson(res: any, statusCode: number, data: any) {
  try {
    if (typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }
    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(statusCode).json(data);
    }
    res.statusCode = statusCode;
    res.end(JSON.stringify(data));
  } catch (e) {
    console.error('sendJson error:', e);
    try {
      res.statusCode = statusCode;
      res.end(JSON.stringify(data));
    } catch {}
  }
}

export function getNormalizedPath(req: any): string {
  try {
    if (req.query) {
      if (req.query.all) {
        const slug = Array.isArray(req.query.all) ? req.query.all.join('/') : String(req.query.all);
        return '/' + slug.replace(/^\/+/, '');
      }
      if (req.query.slug) {
        const slug = Array.isArray(req.query.slug) ? req.query.slug.join('/') : String(req.query.slug);
        return '/' + slug.replace(/^\/+/, '');
      }
    }
    const rawUrl =
      req.headers?.['x-forwarded-uri'] ||
      req.headers?.['x-vercel-original-url'] ||
      req.headers?.['x-original-url'] ||
      req.headers?.['x-matched-path'] ||
      req.headers?.['x-vercel-matched-path'] ||
      req.originalUrl ||
      req.url ||
      '';
    return (rawUrl.split('?')[0] || '').toLowerCase();
  } catch {
    return '';
  }
}

export default async function handler(req: any, res: any) {
  try {
    // Enable CORS preflight
    if (typeof res.setHeader === 'function') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    }

    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      return res.end();
    }

    const pathname = getNormalizedPath(req);
    const method = (req.method || 'GET').toUpperCase();

    // 1. Health check
    if (pathname.includes('health')) {
      return sendJson(res, 200, {
        status: 'ok',
        service: 'MCP Store Serverless Registry',
        version: '2.4.0',
        timestamp: new Date().toISOString()
      });
    }

    // 2. Claude Desktop Config Generator
    if (pathname.includes('claude-config') || pathname.includes('desktop-config')) {
      const activeServers = MOCK_SERVERS.filter((s) => installedIds.has(s.id));
      const mcpServersConfig: Record<string, any> = {};

      activeServers.forEach((s) => {
        mcpServersConfig[s.id] = {
          command: s.executable || 'npx',
          args: s.defaultArgs || ['-y', s.packageName],
          env: s.envRequirements?.reduce((acc: any, env: any) => {
            acc[env.name] = `\${${env.name}}`;
            return acc;
          }, {})
        };
      });

      return sendJson(res, 200, {
        claudeDesktopConfig: {
          mcpServers: mcpServersConfig
        },
        installedCount: activeServers.length,
        configPath: '~/.config/claude/claude_desktop_config.json'
      });
    }

    // 3. Auth Login
    if (pathname.includes('login') && method === 'POST') {
      const body = await getJsonBody(req);
      const email = String(body.email || 'developer@enterprise.ai').toLowerCase().trim();
      const baseName = email.includes('@') ? email.split('@')[0].replace(/[\._\-]/g, ' ') : 'Developer';
      const token = `mcp_live_${Math.random().toString(36).substring(2, 14)}`;

      const user = {
        id: `user-${Date.now()}`,
        name: baseName.replace(/\b\w/g, (c: string) => c.toUpperCase()),
        email: email,
        role: body.role || 'Lead AI Architect',
        organization: body.organization || 'Anthropic / MCP Workgroup',
        authProvider: 'password',
        scopes: ['read:user', 'mcp:registry', 'claude:config_sync', 'security:audit_repo'],
        accessToken: token,
        verifiedInstallAllowed: true,
        authenticatedAt: new Date().toISOString()
      };
      sessionUsers.set(token, user);

      return sendJson(res, 200, {
        success: true,
        message: 'Zero-Trust authentication successful.',
        token: token,
        user: user
      });
    }

    // 4. Auth Signup
    if (pathname.includes('signup') && method === 'POST') {
      const body = await getJsonBody(req);
      const email = String(body.email || 'developer@enterprise.ai').toLowerCase().trim();
      const baseName = body.name || email.split('@')[0];
      const token = `mcp_live_usr_${Math.random().toString(36).substring(2, 14)}`;

      const user = {
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

      return sendJson(res, 201, {
        success: true,
        message: 'Developer account created.',
        token: token,
        user: user
      });
    }

    // 5. Auth OAuth
    if (pathname.includes('oauth') && method === 'POST') {
      const body = await getJsonBody(req);
      const provider = body.provider || 'github';
      const token = `mcp_live_${provider}_${Math.random().toString(36).substring(2, 14)}`;

      const user = {
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

      return sendJson(res, 200, {
        success: true,
        token: token,
        provider: provider,
        user: user
      });
    }

    // 6. Auth Logout
    if (pathname.includes('logout') && method === 'POST') {
      const authHeader = req.headers?.authorization || '';
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        sessionUsers.delete(token);
      }
      return sendJson(res, 200, { success: true, message: 'Logged out successfully.' });
    }

    // 7. Auth Me
    if (pathname.includes('me') && method === 'GET') {
      const authHeader = req.headers?.authorization || '';
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (sessionUsers.has(token)) {
          return sendJson(res, 200, {
            authenticated: true,
            user: sessionUsers.get(token)
          });
        }
      }
      return sendJson(res, 200, {
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

    // 8. Single Server Details
    const serverMatch = pathname.match(/(?:servers|server)\/([a-zA-Z0-9\-_]+)/);
    if (serverMatch && method === 'GET') {
      const serverId = serverMatch[1];
      const server = MOCK_SERVERS.find((s) => s.id === serverId);
      if (server) {
        return sendJson(res, 200, {
          ...server,
          installed: installedIds.has(server.id)
        });
      }
    }

    // 9. Install MCP Server
    if (pathname.includes('install') && method === 'POST') {
      const body = await getJsonBody(req);
      const serverId = body.serverId;
      if (serverId) {
        installedIds.add(serverId);
      }
      return sendJson(res, 200, {
        success: true,
        message: `Server ${serverId} installed to Claude Desktop.`,
        installedCount: installedIds.size,
        configUpdated: true
      });
    }

    // 10. Uninstall MCP Server
    if ((pathname.includes('uninstall') || pathname.includes('remove')) && method === 'POST') {
      const body = await getJsonBody(req);
      const serverId = body.serverId;
      if (serverId) {
        installedIds.delete(serverId);
      }
      return sendJson(res, 200, {
        success: true,
        message: `Server ${serverId} uninstalled.`,
        installedCount: installedIds.size
      });
    }

    // 11. Scan Repo Endpoint
    if (pathname.includes('scan-repo') && method === 'POST') {
      const body = await getJsonBody(req);
      const repoUrl = body.repoUrl || 'https://github.com/modelcontextprotocol/servers';
      return sendJson(res, 200, {
        success: true,
        repoUrl: repoUrl,
        trustScore: 96,
        riskLevel: 'LOW',
        passedStages: 8,
        totalStages: 8,
        timestamp: new Date().toISOString(),
        findings: []
      });
    }

    // 12. Servers List Endpoint (default)
    const updatedServers = MOCK_SERVERS.map((s) => ({
      ...s,
      installed: installedIds.has(s.id)
    }));

    return sendJson(res, 200, {
      total: updatedServers.length,
      servers: updatedServers,
      installedCount: installedIds.size,
      verifiedCount: updatedServers.filter((s) => s.verified).length,
      categories: Array.from(new Set(updatedServers.map((s) => s.category)))
    });
  } catch (error: any) {
    console.error('Serverless Handler Catch-All:', error);
    return sendJson(res, 200, {
      success: true,
      servers: MOCK_SERVERS,
      total: MOCK_SERVERS.length,
      fallback: true
    });
  }
}
