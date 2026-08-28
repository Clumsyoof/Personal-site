import { existsSync, mkdirSync, writeFileSync, cpSync } from 'node:fs';
import { join } from 'node:path';
import { getAllPosts } from '../src/lib/posts.ts';

const DIST_DIR = join(import.meta.dir, '..', 'dist');

async function exportStaticSite() {
	console.log('🚀 Generating static export for Cloudflare Pages...');

	// Ensure dist directory exists
	if (!existsSync(DIST_DIR)) {
		mkdirSync(DIST_DIR, { recursive: true });
	}

	// 1. Copy public assets (robots.txt, blr.jpg, etc.) to dist
	const publicDir = join(import.meta.dir, '..', 'public');
	if (existsSync(publicDir)) {
		cpSync(publicDir, DIST_DIR, { recursive: true });
		console.log('  ✓ Copied public assets to dist/');
	}

	// 2. Copy .mochi client bundles and CSS to dist
	const mochiDir = join(import.meta.dir, '..', '.mochi');
	if (existsSync(mochiDir)) {
		const clientDir = join(mochiDir, 'svelte-client');
		const cssDir = join(mochiDir, 'svelte-css');

		if (existsSync(clientDir)) {
			cpSync(clientDir, join(DIST_DIR, '.mochi', 'svelte-client'), { recursive: true });
		}
		if (existsSync(cssDir)) {
			cpSync(cssDir, join(DIST_DIR, '.mochi', 'svelte-css'), { recursive: true });
		}
		console.log('  ✓ Copied client scripts & stylesheets to dist/');
	}

	// 3. Start temporary Mochi server to prerender routes
	const PORT = 8787;
	process.env.PORT = String(PORT);
	process.env.MODE = 'production';

	const serverProcess = Bun.spawn(['bun', 'src/index.ts'], {
		cwd: join(import.meta.dir, '..'),
		env: { ...process.env, PORT: String(PORT) },
		stdout: 'pipe',
		stderr: 'pipe',
	});

	// Wait for server to become ready
	let ready = false;
	for (let i = 0; i < 30; i++) {
		try {
			const res = await fetch(`http://127.0.0.1:${PORT}/health`);
			if (res.ok) {
				ready = true;
				break;
			}
		} catch {
			await new Promise((r) => setTimeout(r, 100));
		}
	}

	if (!ready) {
		serverProcess.kill();
		throw new Error('Local server failed to start for prerendering.');
	}

	// 4. List of all routes to prerender
	const routes: string[] = ['/', '/about', '/writing'];

	// Add all post routes dynamically
	const posts = await getAllPosts();
	for (const post of posts) {
		routes.push(`/writing/${post.slug}`);
	}

	console.log(`  ✓ Prerendering ${routes.length} routes...`);

	for (const route of routes) {
		const url = `http://127.0.0.1:${PORT}${route}`;
		const res = await fetch(url);
		if (!res.ok) {
			console.error(`  ✗ Failed to prerender ${route}: HTTP ${res.status}`);
			continue;
		}

		const html = await res.text();

		// Determine target path in dist
		let outPath: string;
		if (route === '/') {
			outPath = join(DIST_DIR, 'index.html');
		} else {
			const subDir = join(DIST_DIR, route.replace(/^\//, ''));
			mkdirSync(subDir, { recursive: true });
			outPath = join(subDir, 'index.html');
		}

		writeFileSync(outPath, html, 'utf-8');
		console.log(`  ✓ Prerendered ${route} -> ${outPath.replace(DIST_DIR, 'dist')}`);
	}

	// 5. Cleanup server process
	serverProcess.kill();
	console.log('🎉 Static export complete in dist/ directory!');
}

exportStaticSite().catch((err) => {
	console.error('Export error:', err);
	process.exit(1);
});
