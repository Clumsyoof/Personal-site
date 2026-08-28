<script lang="ts">
	import Navbar from '../lib/components/Navbar.svelte';
	import SwissGrid from '../lib/components/SwissGrid.svelte';
	import type { Post } from '../lib/posts.ts';

	export let post: Post | null = null;
</script>

<svelte:head>
	{#if post}
		<title>{post.title} | Advik Kaushik</title>
		{#if post.description}
			<meta name="description" content={post.description} />
		{/if}
	{:else}
		<title>404 Not Found | Clumsyoof</title>
	{/if}
</svelte:head>

<main class="page">
	<SwissGrid mochi:hydrate />

	<div class="canvas-grid">
		<!-- Top-Left at Line 01 (32px from top, 64px from left) -->
		<div class="top-left-block">
			<header class="header">
				<h1 class="headline">
					Advik Kaushik <span class="headline__sep">/</span> <span class="headline__section">dispatch</span>
				</h1>
			</header>

			{#if post}
				<section class="card square-card">
					<header class="article-header">
						<div class="article-meta">
							<time class="article-date">{post.date}</time>
							{#if post.readingTime}
								<span class="meta-sep">/</span>
								<span class="article-readtime">{post.readingTime}</span>
							{/if}
						</div>
						<h2 class="article-title">{post.title}</h2>
						{#if post.tags && post.tags.length > 0}
							<div class="tags">
								{#each post.tags as tag}
									<span class="tag">#{tag}</span>
								{/each}
							</div>
						{/if}
					</header>

					<article class="article-content" data-nosnippet="true">
						{@html post.html}
					</article>
				</section>
			{:else}
				<section class="card square-card empty-card">
					<header class="article-header">
						<h2 class="article-title">404 / NOT FOUND</h2>
					</header>
					<p class="error-text">This dispatch does not exist or has been removed.</p>
					<a href="/writing" class="back-link">&larr; Return to writing</a>
				</section>
			{/if}
		</div>

		<!-- Bigger Square: 736x736px (Line 01 to Line 24) -->
		<aside class="wasm-block" id="wasm-container" aria-label="WebAssembly Viewport">
			<div class="wasm-viewport" id="wasm-slot-main">
				<span class="wasm-slot__label">/ WEBASSEMBLY 736×736</span>
			</div>
		</aside>

		<!-- Unified Navigation strictly at Line 26 (26 * 32px = 832px) -->
		<Navbar current="writing" />
	</div>
</main>

<style>
	:global(html, body) {
		margin: 0;
		background: #f7f4ea;
		color: #0b3536;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
	}

	.page {
		--bg: #f7f4ea;
		--ink: #0b3536;
		--vermilion: #d8472a;
		--slate: #7e938f;

		position: relative;
		min-height: 100vh;
		min-height: calc(32 * 32px);
		background: var(--bg);
		color: var(--ink);
		width: 100%;
		box-sizing: border-box;
		overflow-x: hidden;
	}

	.canvas-grid {
		position: relative;
		z-index: 1;
		width: 100%;
		min-height: calc(32 * 32px);
		box-sizing: border-box;
	}

	.top-left-block {
		position: absolute;
		top: calc(1 * var(--grid-unit, 32px)); /* Line 01 = 32px */
		left: calc(2 * var(--grid-unit, 32px)); /* Column 02 = 64px gutter clearance */
		width: calc(17 * var(--grid-unit, 32px)); /* 544px = 17 modules */
		max-width: calc(100vw - 80px);
		display: flex;
		flex-direction: column;
		z-index: 3;
	}

	.header {
		height: var(--grid-unit, 32px); /* Line 01 (32px to 64px) */
		margin-bottom: var(--grid-unit, 32px); /* 1 grid module gap (Line 02) */
		text-align: left;
		width: max-content;
		display: flex;
		align-items: center;
	}

	.headline {
		margin: 0;
		height: var(--grid-unit, 32px);
		line-height: var(--grid-unit, 32px);
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-weight: 700;
		font-style: italic;
		font-size: clamp(1.75rem, 3vw, 2.25rem);
		letter-spacing: 0.04em;
		color: var(--ink);
		white-space: nowrap;
	}

	.headline__sep {
		color: var(--slate);
		opacity: 0.6;
		margin: 0 0.25rem;
		font-style: normal;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.85em;
	}

	.headline__section {
		color: var(--vermilion);
	}

	.square-card {
		margin-top: 0;
		width: calc(17 * var(--grid-unit, 32px));  /* 544px = 17 modules */
		height: calc(17 * var(--grid-unit, 32px)); /* Line 03 to Line 20 = 544px */
		border: 1px solid var(--ink);
		border-top: 2px solid var(--vermilion);
		background: rgba(247, 244, 234, 0.94);
		padding: 28px;
		box-sizing: border-box;
		text-align: left;
		overflow-y: auto;
		scrollbar-width: thin;
		scrollbar-color: var(--slate) transparent;
	}

	.square-card::-webkit-scrollbar {
		width: 4px;
	}

	.square-card::-webkit-scrollbar-thumb {
		background-color: var(--slate);
	}

	.article-header {
		margin-bottom: 16px;
		width: max-content;
		max-width: 100%;
		text-align: left;
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
		font-size: clamp(1.4rem, 4vw, 1.8rem);
		line-height: 1.25;
		letter-spacing: 0.02em;
		color: var(--ink);
		white-space: nowrap;
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

	.empty-card {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.error-text {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 1rem;
		margin: 0 0 16px 0;
	}

	.back-link {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.8rem;
		color: var(--vermilion);
		text-decoration: none;
	}

	.back-link:hover {
		text-decoration: underline;
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

	.wasm-block {
		position: absolute;
		top: calc(1 * var(--grid-unit, 32px));  /* Line 01 = 32px */
		right: calc(3 * var(--grid-unit, 32px)); /* Exact 3 * 32px modules = 96px */
		width: calc(23 * var(--grid-unit, 32px)); /* 736px = 23 modules (Line 01 to Line 24) */
		max-width: calc(100vw - calc(17 * var(--grid-unit, 32px)) - calc(2 * var(--grid-unit, 32px)) - calc(3 * var(--grid-unit, 32px)) - 32px);
		height: calc(23 * var(--grid-unit, 32px)); /* 736px = 23 modules */
		aspect-ratio: 1 / 1;
		z-index: 2;
	}

	.wasm-viewport {
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		aspect-ratio: 1 / 1;
		border: 1px solid var(--ink);
		background: rgba(11, 53, 54, 0.02);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		box-sizing: border-box;
		overflow: hidden;
	}

	.wasm-slot__label {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		color: var(--slate);
		opacity: 0.65;
		user-select: none;
	}

	@media (max-width: 1360px) {
		.page {
			min-height: auto;
			padding-bottom: 96px;
		}

		.canvas-grid {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			min-height: auto;
			padding: calc(1 * var(--grid-unit, 32px)) 0 calc(2 * var(--grid-unit, 32px)) calc(2 * var(--grid-unit, 32px));
			gap: calc(1 * var(--grid-unit, 32px));
			box-sizing: border-box;
		}

		.top-left-block {
			position: static;
			width: calc(17 * var(--grid-unit, 32px));
			max-width: calc(100vw - 64px);
		}

		.square-card {
			width: 100%;
			max-width: 100%;
		}

		.wasm-block {
			position: static;
			width: calc(17 * var(--grid-unit, 32px));
			max-width: calc(100vw - 64px);
			height: auto;
			aspect-ratio: 1 / 1;
		}

		.wasm-viewport {
			width: 100%;
			height: 100%;
		}
	}
</style>
