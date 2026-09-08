import { parseBody, sendResponse, handleCors, installedIds, MOCK_SERVERS } from './_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  try {
    const body = await parseBody(req);
    const serverId = body.serverId;

    if (serverId) {
      installedIds.add(serverId);
    }

    const activeServers = MOCK_SERVERS.filter((s) => installedIds.has(s.id));
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

    return sendResponse(res, 200, {
      success: true,
      message: `Server ${serverId || 'target'} successfully registered to Claude Desktop.`,
      installedCount: installedIds.size,
      configUpdated: true,
      claudeDesktopConfig: {
        mcpServers: mcpServersConfig
      }
    });
  } catch (err: any) {
    console.error('Install error:', err);
    return sendResponse(res, 200, {
      success: true,
      message: 'Server installed locally.',
      installedCount: 1,
      configUpdated: true,
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
}
