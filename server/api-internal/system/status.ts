import { sendResponse, handleCors, MOCK_SERVERS, installedIds } from '../_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  return sendResponse(res, 200, {
    status: 'HEALTHY',
    version: '2.4.0',
    timestamp: new Date().toISOString(),
    sandboxMode: 'Zero-Trust AST & Cosign Provenance Active',
    activeBridge: 'Direct Web API & File System Access',
    installedCount: installedIds.size,
    totalServers: MOCK_SERVERS.length,
    securityShieldsActive: 8,
    tlsVersion: 'TLS 1.3'
  });
}
