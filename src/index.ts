/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Env {
	ALBUM_URL?: string;
	ALLOW_ORIGIN?: string;
	CACHE_CONTROL?: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		switch (request.method) {
			case 'GET':
				return handleGet(env);
			case 'OPTIONS':
				return handleOptions(env);
			default:
				return new Response(null, { status: 405 });
		}
	},
};

const handleGet = async (env: Env): Promise<Response> => {
	const albumUrl = env.ALBUM_URL?.trim();

	if (!albumUrl) {
		return jsonResponse({ error: 'ALBUM_URL not set' }, { status: 500, allowOrigin: env.ALLOW_ORIGIN });
	}

	const resp = await fetch(`${albumUrl}?_imcp=1`, { redirect: 'follow' });
	const text = await resp.text();

	const matches = [
		...text.matchAll(
			/\["(https:\/\/lh3\.googleusercontent\.com\/pw\/[/a-zA-Z0-9_-]+)",(\d+),(\d+)[^\]]+\][^\]]+\]\],(\d+),[^,]+,[^,]+,(\d+)/g,
		),
	];
	const images = matches.flatMap(([, url, width, height, createdTimestamp, updatedTimestamp]) => {
		if (!url || !width || !height) {
			return [];
		}

		return {
			url,
			width: Number(width),
			height: Number(height),
			createdTimestamp: Number(createdTimestamp),
			updatedTimestamp: Number(updatedTimestamp),
		};
	});

	const deduplicated = [...new Map(images.map((image) => [image.url, image])).values()];
	return jsonResponse(
		{ images: deduplicated, count: deduplicated.length },
		{
			status: 200,
			allowOrigin: env.ALLOW_ORIGIN,
			extraHeaders: { 'Cache-Control': env.CACHE_CONTROL || 'max-age=604800, stale-while-revalidate' },
		},
	);
};

const jsonResponse = (data: any, params: { status?: number; allowOrigin?: string; extraHeaders?: Record<string, string> }) => {
	return new Response(JSON.stringify(data), {
		status: params.status || 200,
		headers: { 'content-type': 'application/json', 'Access-Control-Allow-Origin': params.allowOrigin || '*', ...params.extraHeaders },
	});
};

const handleOptions = async (env: Env): Promise<Response> => {
	return new Response(null, {
		status: 204,
		headers: {
			Allow: 'GET, OPTIONS',
			'Access-Control-Allow-Origin': env.ALLOW_ORIGIN || '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Access-Control-Max-Age': '86400',
		},
	});
};
