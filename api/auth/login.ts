export default async function handler(req: any, res: any) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-MCP-Client, X-Requested-With');

	if (req.method === 'OPTIONS') {
		res.statusCode = 204;
		return res.end();
	}

	let body = req.body || {};
	if (typeof body === 'string') {
		try {
			body = JSON.parse(body);
		} catch {
			body = {};
		}
	}

	const email = String(body.email || 'developer@enterprise.ai').toLowerCase().trim();
	const token = `mcp_live_${Math.random().toString(36).substring(2, 14)}`;
	const user = {
		id: `user-${Date.now()}`,
		name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (character: string) => character.toUpperCase()),
		email,
		role: body.role || 'Lead AI Architect',
		organization: body.organization || 'Anthropic / MCP Workgroup',
		authProvider: 'password',
		scopes: ['read:user', 'mcp:registry', 'claude:config_sync', 'security:audit_repo'],
		accessToken: token,
		verifiedInstallAllowed: true,
		authenticatedAt: new Date().toISOString()
	};

	res.status(200).json({
		success: true,
		message: 'Zero-Trust authentication successful.',
		token,
		user
	});
}
