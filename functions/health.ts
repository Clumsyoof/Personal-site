export async function onRequest() {
	return Response.json({ status: 'ok', provider: 'cloudflare-pages' });
}
