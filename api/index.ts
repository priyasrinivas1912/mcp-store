import type { Request, Response } from 'express';
import { MOCK_SERVERS } from '../src/data/mockServers';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';

  if (url.includes('/api/health')) {
    return res.status(200).json({
      status: 'ok',
      service: 'MCP Store Registry (Vercel Serverless & Express)',
      version: '2.4.0',
      timestamp: new Date().toISOString()
    });
  }

  if (url.includes('/api/claude-config')) {
    return res.status(200).json({
      claudeDesktopConfig: {
        mcpServers: {
          github: {
            command: 'npx',
            args: ['-y', '@modelcontextprotocol/server-github']
          }
        }
      }
    });
  }

  // Default return servers list
  return res.status(200).json({
    total: MOCK_SERVERS.length,
    servers: MOCK_SERVERS,
    installedCount: 1,
    verifiedCount: MOCK_SERVERS.filter(s => s.verified).length
  });
}
