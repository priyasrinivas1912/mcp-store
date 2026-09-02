import { sendResponse, handleCors } from './_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  return sendResponse(res, 200, {
    status: 'ok',
    service: 'MCP Store Serverless Registry',
    version: '2.4.0',
    timestamp: new Date().toISOString()
  });
}
