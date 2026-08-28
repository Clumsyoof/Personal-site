import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { Marked } from 'marked';
import hljs from 'highlight.js';

const POSTS_DIR = path.resolve(process.cwd(), 'content/posts');

const marked = new Marked({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      const language = lang && hljs.getLanguage(lang) ? lang : undefined;
      try {
        const highlighted = language
          ? hljs.highlight(text, { language }).value
          : hljs.highlightAuto(text).value;
        return `<pre><code class="hljs ${language ? `language-${language}` : ''}">${highlighted}</code></pre>`;
      } catch {
        return `<pre><code>${text}</code></pre>`;
      }
    },
    blockquote(token) {
      const match = token.text.match(/^\[!([a-zA-Z_-]+)\](?:\s*([^\n]+))?(?:\n([\s\S]*))?$/);
      if (match) {
        const rawType = match[1] || 'NOTE';
        const type = rawType.toLowerCase();
        const customTitle = match[2]?.trim();
        const title = customTitle || rawType.toUpperCase();
        let parsed = this.parser.parse(token.tokens);
        parsed = parsed.replace(/^<p>\s*\[![^\]]+\][^\n]*\n?/, '<p>');
        if (parsed.startsWith('<p></p>')) {
          parsed = parsed.replace(/^<p><\/p>\s*/, '');
        }
        return `<div class="callout callout-${type}" data-callout="${type}">
  <div class="callout-title">
    <span class="callout-indicator">/</span>
    <span class="callout-title-text">${title}</span>
  </div>
  <div class="callout-content">
    ${parsed}
  </div>
</div>`;
      }
      return `<blockquote>${this.parser.parse(token.tokens)}</blockquote>`;
    },
  },
});

marked.use({
  hooks: {
    preprocess(markdown: string) {
      // Obsidian highlight syntax: ==highlighted text== -> <mark class="obsidian-highlight">highlighted text</mark>
      return markdown.replace(/==([^=\r\n]+)==/g, '<mark class="obsidian-highlight">$1</mark>');
    },
  },
});

export interface PostMeta {
  title: string;
  slug: string;
  date: string;
  description?: string;
  tags?: string[];
  readingTime?: string;
}

export interface Post extends PostMeta {
  html: string;
}

function calculateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Retrieves all posts sorted by date descending for the blog index,
 * including parsed HTML content for seamless entry viewing.
 */
export async function getAllPosts(): Promise<Post[]> {
  try {
    const exists = await fs.stat(POSTS_DIR).catch(() => null);
    if (!exists) return [];

    const files = await fs.readdir(POSTS_DIR);
    const posts: Post[] = [];

    for (const file of files) {
      if (!file.endsWith('.md')) continue;

      const raw = await Bun.file(path.join(POSTS_DIR, file)).text();
      const { data, content } = matter(raw);
      const slug = data.slug || file.replace(/\.md$/, '');
      const html = await marked.parse(content);

      posts.push({
        title: data.title || slug,
        slug,
        date: data.date ? String(data.date) : '',
        description: data.description || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        readingTime: calculateReadingTime(content),
        html,
      });
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (err) {
    console.error('Error loading posts:', err);
    return [];
  }
}

/**
 * Retrieves a single post by slug and parses markdown content to HTML.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    const file = Bun.file(filePath);
    if (!(await file.exists())) return null;

    const raw = await file.text();
    const { data, content } = matter(raw);
    const html = await marked.parse(content);

    return {
      title: data.title || slug,
      slug,
      date: data.date ? String(data.date) : '',
      description: data.description || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      readingTime: calculateReadingTime(content),
      html,
    };
  } catch (err) {
    console.error(`Error loading post ${slug}:`, err);
    return null;
  }
}
