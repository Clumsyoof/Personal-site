import { existsSync, mkdirSync, writeFileSync, readFileSync, cpSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { getAllPosts } from '../src/lib/posts.ts';

const DIST_DIR = join(import.meta.dir, '..', 'dist');

function makeRelativeHtml(html: string, depth: number): string {
	const prefix = depth === 0 ? './' : '../'.repeat(depth);

	let out = html;

	// 1. Fix component-url in mochi-hydratable-island:
	// HydratableIsland runs inside _mochi/client/, so dynamic import must be relative to that directory (./_hydrate-*.js)
	out = out.replaceAll('component-url="/_mochi/client/', 'component-url="./');

	// 2. Fix CSS and JS asset paths in HTML headers/scripts
	out = out.replaceAll('/_mochi/', `${prefix}_mochi/`);
	out = out.replaceAll('/favicon.ico', `${prefix}favicon.ico`);
	out = out.replaceAll('/blr.jpg', `${prefix}blr.jpg`);

	// 3. Fix internal navigation links
	out = out.replaceAll('href="/about"', `href="${prefix}about/"`);
	out = out.replaceAll('href="/writing"', `href="${prefix}writing/"`);
	out = out.replaceAll('href="/"', `href="${prefix}"`);

	// 4. Fix dynamic post links
	out = out.replace(/href="\/writing\/([^"]+)"/g, `href="${prefix}writing/$1/"`);

	return out;
}

async function exportStaticSite() {
	console.log('🚀 Generating static export for GitHub Pages / static hosting...');

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

	// 2. Copy .mochi client bundles and CSS to dist/_mochi/{client,css}
	const mochiDir = join(import.meta.dir, '..', '.mochi');
	if (existsSync(mochiDir)) {
		const clientDir = join(mochiDir, 'svelte-client');
		const cssDir = join(mochiDir, 'svelte-css');

		if (existsSync(clientDir)) {
			cpSync(clientDir, join(DIST_DIR, '_mochi', 'client'), { recursive: true });
		}
		if (existsSync(cssDir)) {
			cpSync(cssDir, join(DIST_DIR, '_mochi', 'css'), { recursive: true });
		}
		console.log('  ✓ Copied client scripts & stylesheets to dist/_mochi/');
	}

	// 3. Rewrite all JS client chunks in dist/_mochi/client to use relative imports
	const distClientDir = join(DIST_DIR, '_mochi', 'client');
	if (existsSync(distClientDir)) {
		const files = readdirSync(distClientDir);
		for (const file of files) {
			if (file.endsWith('.js')) {
				const filePath = join(distClientDir, file);
				let content = readFileSync(filePath, 'utf-8');
				content = content.replaceAll('/_mochi/client/', './');
				content = content.replace(/this\.innerHTML=c4\([^)]+\)/g, 'console.warn("[Island] Hydration error caught, preserving SSR content")');
				writeFileSync(filePath, content, 'utf-8');
			}
		}
		console.log('  ✓ Rewrote client bundle imports to relative paths');
	}

	// 4. Start temporary Mochi server to prerender routes
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

	// 5. List of all routes to prerender with their folder depth
	const routeEntries: { route: string; depth: number }[] = [
		{ route: '/', depth: 0 },
		{ route: '/about', depth: 1 },
		{ route: '/writing', depth: 1 },
	];

	// Add all post routes dynamically
	const posts = await getAllPosts();
	for (const post of posts) {
		routeEntries.push({ route: `/writing/${post.slug}`, depth: 2 });
	}

	console.log(`  ✓ Prerendering ${routeEntries.length} routes...`);

	for (const { route, depth } of routeEntries) {
		const url = `http://127.0.0.1:${PORT}${route}`;
		const res = await fetch(url);
		if (!res.ok) {
			console.error(`  ✗ Failed to prerender ${route}: HTTP ${res.status}`);
			continue;
		}

		const rawHtml = await res.text();
		const relativeHtml = makeRelativeHtml(rawHtml, depth);

		// Determine target path in dist
		let outPath: string;
		if (route === '/') {
			outPath = join(DIST_DIR, 'index.html');
		} else {
			const subDir = join(DIST_DIR, route.replace(/^\//, ''));
			mkdirSync(subDir, { recursive: true });
			outPath = join(subDir, 'index.html');
		}

		writeFileSync(outPath, relativeHtml, 'utf-8');
		console.log(`  ✓ Prerendered ${route} (depth ${depth}) -> ${outPath.replace(DIST_DIR, 'dist')}`);
	}

	// 6. Create .nojekyll for GitHub Pages compatibility (allows _mochi directory)
	writeFileSync(join(DIST_DIR, '.nojekyll'), '', 'utf-8');
	console.log('  ✓ Created .nojekyll for GitHub Pages');

	// 7. Cleanup server process
	serverProcess.kill();
	console.log('🎉 Static export complete in dist/ directory!');
}

exportStaticSite().catch((err) => {
	console.error('Export error:', err);
	process.exit(1);
});
