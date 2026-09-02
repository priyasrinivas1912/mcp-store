import { sendResponse, handleCors, MOCK_SERVERS, installedIds } from './_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  const pathname = (req.url || '').toLowerCase();

  if (pathname.includes('health')) {
    return sendResponse(res, 200, { status: 'ok', service: 'MCP Store Registry' });
  }

  const updatedServers = MOCK_SERVERS.map((s) => ({
    ...s,
    installed: installedIds.has(s.id)
  }));

  return sendResponse(res, 200, {
    success: true,
    total: updatedServers.length,
    servers: updatedServers,
    installedCount: installedIds.size
  });
}
