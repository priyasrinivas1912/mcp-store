import { MOCK_SERVERS } from '../src/data/mockServers';

// State stored across serverless invocations (warm instances)
const installedIds = new Set<string>(['github']);
const sessionUsers = new Map<string, any>();

export async function getJsonBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
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
  if (req.query && req.query.all) {
    const slug = Array.isArray(req.query.all) ? req.query.all.join('/') : String(req.query.all);
    return '/' + slug.replace(/^\/+/, '');
  }
  const rawUrl = req.originalUrl || req.url || '';
  return rawUrl.split('?')[0] || '';
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
        service: 'MCP Store Registry (Vercel Serverless & Cloud Functions)',
        version: '2.4.0',
        timestamp: new Date().toISOString()
      });
    }

    // 2. Claude Config
    if (pathname.includes('claude-config')) {
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
        const user = sessionUsers.get(token);
        if (user) {
          return sendJson(res, 200, { authenticated: true, user });
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
          verifiedInstallAllowed: true
        }
      });
    }

    // 8. Auth Users
    if (pathname.includes('users') && method === 'GET') {
      return sendJson(res, 200, {
        total: 1,
        users: [
          {
            id: 'user-1',
            name: 'Santhi Priya',
            email: 'santhi.priya@enterprise.ai',
            role: 'Lead AI Architect',
            organization: 'Anthropic / MCP Workgroup'
          }
        ]
      });
    }

    // 9. Install Endpoint
    if (pathname.includes('install') && method === 'POST') {
      const body = await getJsonBody(req);
      const serverId = body.serverId;
      if (serverId) {
        installedIds.add(serverId);
      }

      const server = MOCK_SERVERS.find((s) => s.id === serverId) || MOCK_SERVERS[0];
      return sendJson(res, 200, {
        success: true,
        message: `Server ${server.name} installed successfully.`,
        server: { ...server, installed: true },
        installedCount: installedIds.size,
        configPath: '~/.config/claude/claude_desktop_config.json'
      });
    }

    // 10. Uninstall Endpoint
    if (pathname.includes('uninstall') && method === 'POST') {
      const parts = pathname.split('/');
      const serverId = parts[parts.indexOf('servers') + 1] || 'unknown';
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
    console.error('Serverless Handler Error Caught:', error);
    return sendJson(res, 200, {
      success: true,
      servers: MOCK_SERVERS,
      total: MOCK_SERVERS.length,
      fallback: true
    });
  }
}
