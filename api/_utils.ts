import { MOCK_SERVERS } from './mockServers';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  authProvider: string;
  scopes: string[];
  accessToken: string;
  verifiedInstallAllowed: boolean;
  authenticatedAt: string;
}

// In-memory persistent state across warm invocations
export const installedIds = new Set<string>(['github']);
export const sessionUsers = new Map<string, UserSession>();

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

export async function parseBody(req: any): Promise<any> {
  if (!req) return {};
  try {
    if (req.body !== undefined && req.body !== null) {
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

    if (req.readableEnded || req.complete || req.readable === false) {
      return {};
    }

    return await new Promise((resolve) => {
      let data = '';
      const timer = setTimeout(() => resolve({}), 250);

      if (typeof req.on === 'function') {
        req.on('data', (chunk: any) => {
          data += chunk;
        });
        req.on('end', () => {
          clearTimeout(timer);
          try {
            resolve(data ? JSON.parse(data) : {});
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
    console.error('Error parsing request body:', err);
    return {};
  }
}

export function sendResponse(res: any, statusCode: number, data: any) {
  try {
    if (typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-MCP-Client');
    }

    if (typeof res.status === 'function' && typeof res.json === 'function') {
      return res.status(statusCode).json(data);
    }
    if (typeof res.status === 'function' && typeof res.send === 'function') {
      return res.status(statusCode).send(JSON.stringify(data));
    }

    res.statusCode = statusCode;
    res.end(JSON.stringify(data));
  } catch (err) {
    console.error('sendResponse error:', err);
    try {
      res.statusCode = statusCode;
      res.end(JSON.stringify(data));
    } catch {}
  }
}

export function handleCors(req: any, res: any): boolean {
  if (typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-MCP-Client');
  }
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return true;
  }
  return false;
}

export { MOCK_SERVERS };
