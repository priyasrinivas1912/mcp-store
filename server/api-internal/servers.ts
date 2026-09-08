import { sendResponse, handleCors, installedIds, MOCK_SERVERS } from './_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  try {
    const updatedServers = MOCK_SERVERS.map((s) => ({
      ...s,
      installed: installedIds.has(s.id)
    }));

    return sendResponse(res, 200, {
      total: updatedServers.length,
      servers: updatedServers,
      installedCount: installedIds.size,
      verifiedCount: updatedServers.filter((s) => s.verified).length,
      categories: Array.from(new Set(updatedServers.map((s) => s.category)))
    });
  } catch (err) {
    return sendResponse(res, 200, {
      total: MOCK_SERVERS.length,
      servers: MOCK_SERVERS,
      installedCount: 1,
      verifiedCount: MOCK_SERVERS.filter((s) => s.verified).length,
      categories: ['Development', 'Database', 'Cloud', 'Productivity', 'Security', 'AI']
    });
  }
}
