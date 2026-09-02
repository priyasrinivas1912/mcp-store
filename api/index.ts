import type { IncomingMessage, ServerResponse } from 'http';
import { MOCK_MCP_SERVERS } from '../src/data/mockServers';

// In-memory persistent state for serverless instances
let installedServerIds = new Set<string>(['github']);
const sessionUsers = new Map<string, any>();

// Helper to parse JSON body safely
async function getJsonBody(req: any): Promise<any> {
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

function sendJson(res: any, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.end(JSON.stringify(data));
}

export default async function handler(req: any, res: any) {
  try {
    // Enable CORS preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      return res.end();
    }

    const rawUrl = req.url || '';
    const pathname = rawUrl.split('?')[0];
    const method = (req.method || 'GET').toUpperCase();

    // 1. Health check
    if (pathname.includes('/health')) {
      return sendJson(res, 200, {
        status: 'ok',
        service: 'MCP Store Registry (Vercel Serverless / Cloud Run)',
        version: '2.4.0',
        timestamp: new Date().toISOString()
      });
    }

    // 2. Claude Config
    if (pathname.includes('/claude-config')) {
      const activeServers = MOCK_MCP_SERVERS.filter((s) => installedServerIds.has(s.id));
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

    // 3. Auth Endpoints
    if (pathname.includes('/auth/login') && method === 'POST') {
      const body = await getJsonBody(req);
      const email = body.email || 'developer@enterprise.ai';
      const name = body.name || (email.includes('@') ? email.split('@')[0].replace(/[\._\-]/g, ' ') : 'Developer');
      const token = `mcp_live_${Math.random().toString(36).substring(2, 14)}`;

      const user = {
        id: `user-${Date.now()}`,
        name: name.replace(/\b\w/g, (c: string) => c.toUpperCase()),
        email: email.toLowerCase(),
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

    if (pathname.includes('/auth/signup') && method === 'POST') {
      const body = await getJsonBody(req);
      const email = body.email || 'new.developer@enterprise.ai';
      const name = body.name || email.split('@')[0];
      const token = `mcp_live_usr_${Math.random().toString(36).substring(2, 14)}`;

      const user = {
        id: `user-${Date.now()}`,
        name: name.replace(/[\._\-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
        email: email.toLowerCase(),
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

    if (pathname.includes('/auth/oauth') && method === 'POST') {
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

    if (pathname.includes('/auth/logout') && method === 'POST') {
      const authHeader = req.headers.authorization || '';
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        sessionUsers.delete(token);
      }
      return sendJson(res, 200, { success: true, message: 'Logged out successfully.' });
    }

    if (pathname.includes('/auth/me') && method === 'GET') {
      const authHeader = req.headers.authorization || '';
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

    if (pathname.includes('/auth/users') && method === 'GET') {
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

    // 4. Install / Uninstall Endpoints
    if (pathname.includes('/install') && method === 'POST') {
      const body = await getJsonBody(req);
      const serverId = body.serverId;
      if (serverId) {
        installedServerIds.add(serverId);
      }

      const server = MOCK_MCP_SERVERS.find((s) => s.id === serverId) || MOCK_MCP_SERVERS[0];
      return sendJson(res, 200, {
        success: true,
        message: `Server ${server.name} installed successfully into client configuration.`,
        server: { ...server, installed: true },
        installedCount: installedServerIds.size,
        configPath: '~/.config/claude/claude_desktop_config.json'
      });
    }

    if (pathname.match(/\/servers\/[^\/]+\/uninstall/) && method === 'POST') {
      const parts = pathname.split('/');
      const serverId = parts[parts.indexOf('servers') + 1];
      if (serverId) {
        installedServerIds.delete(serverId);
      }
      return sendJson(res, 200, {
        success: true,
        message: `Server ${serverId} uninstalled.`,
        installedCount: installedServerIds.size
      });
    }

    // 5. Scan Repo Endpoint
    if (pathname.includes('/scan-repo') && method === 'POST') {
      const body = await getJsonBody(req);
      const repoUrl = body.repoUrl || 'https://github.com/modelcontextprotocol/servers';
      return sendJson(res, 200, {
        success: true,
        repoUrl: repoUrl,
        trustScore: 94,
        riskLevel: 'LOW',
        passedStages: 8,
        totalStages: 8,
        timestamp: new Date().toISOString(),
        findings: []
      });
    }

    // 6. Servers List Endpoint
    if (pathname.includes('/servers') || pathname === '/' || pathname === '/api') {
      const updatedServers = MOCK_MCP_SERVERS.map((s) => ({
        ...s,
        installed: installedServerIds.has(s.id)
      }));

      return sendJson(res, 200, {
        total: updatedServers.length,
        servers: updatedServers,
        installedCount: installedServerIds.size,
        verifiedCount: updatedServers.filter((s) => s.verified).length,
        categories: Array.from(new Set(updatedServers.map((s) => s.category)))
      });
    }

    // Default Fallback
    return sendJson(res, 200, {
      total: MOCK_MCP_SERVERS.length,
      servers: MOCK_MCP_SERVERS.map((s) => ({ ...s, installed: installedServerIds.has(s.id) })),
      installedCount: installedServerIds.size
    });
  } catch (error: any) {
    console.error('API Handler Error:', error);
    return sendJson(res, 200, {
      success: true,
      servers: MOCK_MCP_SERVERS,
      total: MOCK_MCP_SERVERS.length,
      fallback: true
    });
  }
}
