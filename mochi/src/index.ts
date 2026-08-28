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
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1'
  );
}

export function checkSecurity(req: Request): Response | null {
  const ip = getClientIp(req);
  if (bannedIps.has(ip)) {
    return new Response('Access Denied', { status: 403 });
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
      headers: { 'Retry-After': '60' },
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
      return new Response('Forbidden', { status: 403 });
    }),
    '/health': Mochi.api(() => Response.json({ status: 'ok' })),
  },
});

console.log('Server running at http://localhost:' + PORT);
