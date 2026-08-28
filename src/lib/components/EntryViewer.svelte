<script lang="ts">
	import type { Post } from '../posts.ts';

	export let post: Post | null = null;

	$: currentPost = post;
</script>

<div class="entry-viewer card square-card">
	{#if currentPost}
		<article class="entry-article">
			<header class="article-header">
				<div class="article-meta">
					<time class="article-date">{currentPost.date}</time>
					{#if currentPost.readingTime}
						<span class="meta-sep">/</span>
						<span class="article-readtime">{currentPost.readingTime}</span>
					{/if}
				</div>
				<h2 class="article-title">{currentPost.title}</h2>
				{#if currentPost.tags && currentPost.tags.length > 0}
					<div class="tags">
						{#each currentPost.tags as tag}
							<span class="tag">#{tag}</span>
						{/each}
					</div>
				{/if}
			</header>

			{#if currentPost.html}
				<div class="article-content" data-nosnippet="true">
					{@html currentPost.html}
				</div>
			{:else if currentPost.description}
				<p class="entry-desc" data-nosnippet="true">{currentPost.description}</p>
			{/if}
		</article>
	{:else}
		<div class="empty-viewer">
			<span class="empty-viewer__label">*cricket noises*</span>
		</div>
	{/if}
</div>

<style>
	.entry-viewer {
		--ink: #0b3536;
		--vermilion: #d8472a;
		--slate: #7e938f;

		width: 100%;
		height: 100%;
		border: 1px solid var(--ink);
		border-top: 2px solid var(--vermilion);
		background: rgba(247, 244, 234, 0.94);
		padding: 28px;
		box-sizing: border-box;
		text-align: left;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--slate) transparent;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
	}

	.entry-viewer::-webkit-scrollbar {
		width: 4px;
	}

	.entry-viewer::-webkit-scrollbar-thumb {
		background-color: var(--slate);
	}

	.entry-article {
		width: 100%;
	}

	.article-header {
		margin-bottom: 20px;
		width: 100%;
		text-align: left;
		border-bottom: 1px solid rgba(11, 53, 54, 0.12);
		padding-bottom: 16px;
	}

	.article-meta {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 8px;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.76rem;
		color: var(--slate);
		margin-bottom: 8px;
		letter-spacing: 0.06em;
	}

	.meta-sep {
		user-select: none;
	}

	.article-title {
		margin: 0 0 10px 0;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-weight: 700;
		font-style: italic;
		font-size: clamp(1.4rem, 3.5vw, 1.85rem);
		line-height: 1.25;
		letter-spacing: 0.02em;
		color: var(--ink);
	}

	.tags {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		gap: 6px;
	}

	.tag {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.72rem;
		color: var(--slate);
		background: rgba(126, 147, 143, 0.12);
		padding: 2px 8px;
		border-radius: 2px;
	}

	.entry-desc {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.96rem;
		line-height: 1.6;
		color: rgba(11, 53, 54, 0.88);
		margin: 0;
	}

	/* Markdown Content Styling */
	.article-content :global(h1),
	.article-content :global(h2),
	.article-content :global(h3),
	.article-content :global(h4) {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-weight: 700;
		color: var(--ink);
		margin: 1.4em 0 0.5em 0;
		line-height: 1.3;
	}

	.article-content :global(h1) {
		font-size: 1.35rem;
	}

	.article-content :global(h2) {
		font-size: 1.18rem;
		border-bottom: 1px solid rgba(11, 53, 54, 0.15);
		padding-bottom: 4px;
	}

	.article-content :global(h3) {
		font-size: 1.05rem;
	}

	.article-content :global(p) {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.92rem;
		line-height: 1.6;
		color: rgba(11, 53, 54, 0.92);
		margin: 0 0 1.1em 0;
	}

	.article-content :global(strong) {
		color: var(--ink);
		font-weight: 700;
	}

	.article-content :global(a) {
		color: var(--vermilion);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.article-content :global(ul),
	.article-content :global(ol) {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.92rem;
		line-height: 1.55;
		color: rgba(11, 53, 54, 0.92);
		margin: 0 0 1.1em 0;
		padding-left: 20px;
	}

	.article-content :global(li) {
		margin-bottom: 0.35em;
	}

	.article-content :global(blockquote) {
		margin: 1.2em 0;
		padding: 6px 12px;
		border-left: 3px solid var(--vermilion);
		background: rgba(216, 71, 42, 0.04);
		font-style: italic;
		font-size: 0.9rem;
	}

	.article-content :global(code) {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.82em;
		background: rgba(11, 53, 54, 0.08);
		padding: 2px 4px;
		border-radius: 2px;
	}

	/* Code Blocks */
	.article-content :global(pre) {
		background: #ece8dc;
		color: #0b3536;
		padding: 14px 16px;
		border-radius: 2px;
		overflow-x: auto;
		margin: 1.4em 0;
		border: 1px solid rgba(11, 53, 54, 0.22);
	}

	.article-content :global(pre code) {
		background: transparent;
		color: inherit;
		padding: 0;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.8rem;
		line-height: 1.5;
	}

	/* Syntax Highlighting */
	.article-content :global(.hljs-keyword),
	.article-content :global(.hljs-selector-tag),
	.article-content :global(.hljs-section) {
		color: #d8472a;
		font-weight: 700;
	}

	.article-content :global(.hljs-string),
	.article-content :global(.hljs-attribute),
	.article-content :global(.hljs-template-variable),
	.article-content :global(.hljs-addition) {
		color: #275a46;
	}

	.article-content :global(.hljs-comment),
	.article-content :global(.hljs-quote) {
		color: #7e938f;
		font-style: italic;
	}

	.article-content :global(.hljs-number),
	.article-content :global(.hljs-literal),
	.article-content :global(.hljs-deletion) {
		color: #b72b1a;
	}

	.article-content :global(.hljs-title),
	.article-content :global(.hljs-title.function_),
	.article-content :global(.hljs-function) {
		color: #946000;
		font-weight: 600;
	}

	.article-content :global(.hljs-type),
	.article-content :global(.hljs-title.class_),
	.article-content :global(.hljs-built_in) {
		color: #1b686e;
		font-weight: 600;
	}

	.article-content :global(.hljs-meta),
	.article-content :global(.hljs-meta .hljs-keyword),
	.article-content :global(.hljs-meta .hljs-string) {
		color: #7a5012;
	}

	.article-content :global(.hljs-variable),
	.article-content :global(.hljs-params) {
		color: #0b3536;
	}

	.article-content :global(.hljs-symbol),
	.article-content :global(.hljs-bullet),
	.article-content :global(.hljs-link) {
		color: #d8472a;
	}

	/* Obsidian Highlights */
	.article-content :global(mark),
	.article-content :global(mark.obsidian-highlight) {
		background: rgba(216, 71, 42, 0.14);
		color: var(--ink);
		padding: 1px 4px;
		border-radius: 2px;
		border-bottom: 1.5px solid rgba(216, 71, 42, 0.45);
	}

	/* Obsidian Callout Boxes */
	.article-content :global(.callout) {
		margin: 1.3em 0;
		padding: 12px 16px;
		border-radius: 2px;
		border: 1px solid rgba(11, 53, 54, 0.18);
		background: rgba(247, 244, 234, 0.9);
		box-sizing: border-box;
	}

	.article-content :global(.callout-title) {
		display: flex;
		align-items: center;
		gap: 6px;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-weight: 700;
		font-size: 0.78rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		margin-bottom: 6px;
	}

	.article-content :global(.callout-indicator) {
		font-weight: 700;
		font-size: 0.85em;
		opacity: 0.8;
	}

	.article-content :global(.callout-content) {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.92rem;
		line-height: 1.55;
		color: rgba(11, 53, 54, 0.92);
	}

	.article-content :global(.callout-content p) {
		margin: 0 0 0.6em 0;
	}

	.article-content :global(.callout-content p:last-child) {
		margin-bottom: 0;
	}

	/* Callout Variants */
	.article-content :global(.callout-note),
	.article-content :global(.callout-info),
	.article-content :global(.callout-abstract),
	.article-content :global(.callout-summary) {
		border-left: 3px solid var(--slate);
		background: rgba(126, 147, 143, 0.08);
	}

	.article-content :global(.callout-note .callout-title),
	.article-content :global(.callout-info .callout-title) {
		color: var(--ink);
	}

	.article-content :global(.callout-tip),
	.article-content :global(.callout-hint),
	.article-content :global(.callout-success),
	.article-content :global(.callout-check),
	.article-content :global(.callout-done) {
		border-left: 3px solid #5a9474;
		background: rgba(90, 148, 116, 0.08);
	}

	.article-content :global(.callout-tip .callout-title),
	.article-content :global(.callout-success .callout-title) {
		color: #3b6e53;
	}

	.article-content :global(.callout-warning),
	.article-content :global(.callout-caution),
	.article-content :global(.callout-attention) {
		border-left: 3px solid var(--vermilion);
		background: rgba(216, 71, 42, 0.08);
	}

	.article-content :global(.callout-warning .callout-title),
	.article-content :global(.callout-caution .callout-title) {
		color: var(--vermilion);
	}

	.article-content :global(.callout-important),
	.article-content :global(.callout-danger),
	.article-content :global(.callout-error),
	.article-content :global(.callout-bug),
	.article-content :global(.callout-failure) {
		border-left: 3px solid #b72b1a;
		background: rgba(183, 43, 26, 0.1);
	}

	.article-content :global(.callout-important .callout-title),
	.article-content :global(.callout-danger .callout-title) {
		color: #b72b1a;
	}

	.article-content :global(.callout-quote),
	.article-content :global(.callout-cite) {
		border-left: 3px solid var(--ink);
		background: rgba(11, 53, 54, 0.05);
	}

	.article-content :global(.callout-quote .callout-title) {
		color: var(--ink);
	}

	.empty-viewer {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: 200px;
	}

	.empty-viewer__label {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.9rem;
		font-style: italic;
		letter-spacing: 0.08em;
		color: var(--slate);
		opacity: 0.75;
		user-select: none;
	}
</style>
