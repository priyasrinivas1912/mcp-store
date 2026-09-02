import { sendResponse, handleCors, sessionUsers } from '../_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  const authHeader = req.headers?.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    sessionUsers.delete(token);
  }

  return sendResponse(res, 200, { success: true, message: 'Logged out successfully.' });
}
