export async function onRequest(context: { request: Request }) {
	const ip =
		context.request.headers.get('cf-connecting-ip') ||
		context.request.headers.get('x-forwarded-for') ||
		'unknown';

	console.warn(`[Cloudflare Edge] Honeypot triggered by scraper at IP: ${ip}`);

	return new Response('Forbidden: Scraper Detected', {
		status: 403,
		headers: {
			'Content-Type': 'text/plain',
			'X-Robots-Tag': 'noindex, nofollow, noarchive',
		},
	});
}
