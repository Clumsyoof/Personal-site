import { Mochi, silenceInternalRoutes } from 'mochi-framework';
import { getAllPosts, getPostBySlug } from './lib/posts';

const PORT = Number(process.env.PORT) || 8080;

// Security State: In-Memory Honeypot Blacklist & Rate Limiting
const bannedIps = new Set<string>();
const ipHits = new Map<string, { count: number; resetTime: number }>();

// Periodic cleanup of expired rate limit windows
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipHits.entries()) {
    if (now > record.resetTime) {
      ipHits.delete(ip);
    }
  }
}, 5 * 60 * 1000);

export function getClientIp(req: Request): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('fly-client-ip') ||
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1'
  );
}

export function checkSecurity(req: Request): Response | null {
  const ip = getClientIp(req);
  if (bannedIps.has(ip)) {
    return new Response('Access Denied: IP Blacklisted', {
      status: 403,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
        'CDN-Cache-Control': 'no-store',
        'Cloudflare-CDN-Cache-Control': 'no-store',
      },
    });
  }

  const now = Date.now();
  const record = ipHits.get(ip) || { count: 0, resetTime: now + 60000 };

  if (now > record.resetTime) {
    record.count = 0;
    record.resetTime = now + 60000;
  }

  record.count++;
  ipHits.set(ip, record);

  // Maximum 60 requests per minute per IP
  if (record.count > 60) {
    return new Response('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '60',
        'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
        'CDN-Cache-Control': 'no-store',
        'Cloudflare-CDN-Cache-Control': 'no-store',
      },
    });
  }

  return null;
}

await Mochi.serve({
  port: PORT,
  development: process.env.MODE === 'development',
  htmlShell: './src/shell.html',
  trailingSlash: 'always',
  filters: {
    'consoleLogger:line': silenceInternalRoutes,
  },
  handle: async ({ event, resolve }) => {
    const pathname = event.url.pathname;
    const ip = getClientIp(event.request);

    // 1. Honeypot blacklist check - always dynamic
    if (bannedIps.has(ip)) {
      return new Response('Access Denied: IP Blacklisted', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
          'CDN-Cache-Control': 'no-store',
          'Cloudflare-CDN-Cache-Control': 'no-store',
        },
      });
    }

    const response = await resolve(event);
    const headers = new Headers(response.headers);

    // 2. Dynamic API & Honeypot: MUST bypass Cloudflare Edge Cache completely
    if (pathname.startsWith('/api/') || pathname === '/health') {
      headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate, max-age=0');
      headers.set('CDN-Cache-Control', 'no-store');
      headers.set('Cloudflare-CDN-Cache-Control', 'no-store');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
    }
    // 3. Static Assets: Cache indefinitely at Cloudflare Edge and browser
    else if (
      pathname.startsWith('/_mochi/') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.webp') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.css') ||
      pathname.endsWith('.js')
    ) {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      headers.set('Cloudflare-CDN-Cache-Control', 'max-age=31536000');
    }
    // 4. Page Routes: Cache at Cloudflare Edge with stale-while-revalidate
    else if (response.status === 200) {
      headers.set('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate=3600');
      headers.set('Cloudflare-CDN-Cache-Control', 'max-age=86400, stale-while-revalidate=3600');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
  routes: {
    '/': Mochi.page('./src/routes/index.svelte', {
      serverProps: async (req) => {
        const blocked = checkSecurity(req);
        if (blocked) throw blocked;
        return {};
      },
    }),
    '/about': Mochi.page('./src/routes/about.svelte', {
      serverProps: async (req) => {
        const blocked = checkSecurity(req);
        if (blocked) throw blocked;
        return {};
      },
    }),
    '/writing': Mochi.page('./src/routes/writing.svelte', {
      serverProps: async (req) => {
        const blocked = checkSecurity(req);
        if (blocked) throw blocked;
        return {
          posts: await getAllPosts(),
        };
      },
    }),
    '/writing/:slug': Mochi.page('./src/routes/post.svelte', {
      serverProps: async (req, params) => {
        const blocked = checkSecurity(req);
        if (blocked) throw blocked;
        return {
          post: await getPostBySlug(params?.slug ?? ''),
        };
      },
    }),
    '/api/trap-bot': Mochi.api((event) => {
      const ip = getClientIp(event.request);
      bannedIps.add(ip);
      console.warn(`[Security] Rogue scraper trapped & blacklisted: ${ip}`);
      return new Response('Forbidden: Scraper Detected', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate, max-age=0',
          'CDN-Cache-Control': 'no-store',
          'Cloudflare-CDN-Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Robots-Tag': 'noindex, nofollow, noarchive',
        },
      });
    }),
    '/health': Mochi.api(() => Response.json({ status: 'ok' })),
  },
});

console.log('Server running at http://localhost:' + PORT);

