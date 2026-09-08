import { parseBody, sendResponse, handleCors, installedIds } from './_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  try {
    const body = await parseBody(req);
    const serverId = body.serverId;

    if (serverId) {
      installedIds.delete(serverId);
    }

    return sendResponse(res, 200, {
      success: true,
      message: `Server ${serverId} uninstalled.`,
      installedCount: installedIds.size
    });
  } catch (err) {
    return sendResponse(res, 200, { success: true, installedCount: 0 });
  }
}
