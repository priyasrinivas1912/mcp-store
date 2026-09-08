import { parseBody, sendResponse, handleCors } from './_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  try {
    const body = await parseBody(req);
    return sendResponse(res, 200, {
      success: true,
      allowed: true,
      action: 'ALLOW',
      tool: body.tool || 'query',
      riskScore: 5,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return sendResponse(res, 200, { success: true, allowed: true, action: 'ALLOW' });
  }
}
