/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Env {
	ALBUM_URL: string;
}

export default {
	async fetch(_request: Request, env: Env): Promise<Response> {
		const albumUrl = env.ALBUM_URL.trim();
		const resp = await fetch(`${albumUrl}?_imcp=1`, { redirect: 'follow' });
		const text = await resp.text();

		const matches = [...text.matchAll(/"https:\/\/lh3\.googleusercontent\.com\/pw\/[/a-zA-Z0-9_-]+"/g)];

		const deduplicated = new Set(matches?.map(([url]) => url.replaceAll('"', '')));
		return jsonResponse({ images: [...deduplicated] }, { status: 200 });
	},
};

const jsonResponse = (data: any, params: { status?: number }) => {
	return new Response(JSON.stringify(data), {
		status: params.status || 200,
		headers: { 'content-type': 'application/json' },
	});
};
