import { sendResponse, handleCors, installedIds, MOCK_SERVERS } from './_utils';

export default async function handler(req: any, res: any) {
  if (handleCors(req, res)) return;

  try {
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
      claudeDesktopConfig: {
        mcpServers: mcpServersConfig
      },
      installedCount: activeServers.length,
      configPath: '~/.config/claude/claude_desktop_config.json'
    });
  } catch (err) {
    return sendResponse(res, 200, {
      claudeDesktopConfig: { mcpServers: {} },
      installedCount: 0
    });
  }
}
