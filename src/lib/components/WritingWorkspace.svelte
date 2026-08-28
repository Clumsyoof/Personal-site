<script lang="ts">
	import { writingStore } from '../stores/writing.ts';
	import EntryViewer from './EntryViewer.svelte';
	import Navbar from './Navbar.svelte';
	import type { Post } from '../posts.ts';

	export let posts: Post[] = [];

	const { selectedSlug, selectPost, setPosts, selectedPost } = writingStore;

	$: if (posts) {
		setPosts(posts);
	}
</script>

<div class="canvas-grid">
	<!-- Top-Left at Line 01 (32px from top, 64px from left) -->
	<div class="top-left-block">
		<header class="header">
			<h1 class="headline">
				Advik Kaushik <span class="headline__sep">/</span> <span class="headline__section">writing</span>
			</h1>
		</header>

		<section class="card square-card">
			{#if posts && posts.length > 0}
				<ul class="post-list">
					{#each posts as post, i}
						<li class="post-row" class:is-selected={$selectedSlug === post.slug}>
							<span class="post-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
							<button
								type="button"
								class="post-btn"
								on:click={() => selectPost(post.slug)}
								aria-pressed={$selectedSlug === post.slug}
							>
								<div class="post-meta">
									<time class="post-date">{post.date}</time>
									{#if post.readingTime}
										<span class="post-sep">/</span>
										<span class="post-readtime">{post.readingTime}</span>
									{/if}
								</div>
								<h2 class="post-title">{post.title}</h2>
								{#if post.description}
									<p class="post-desc">{post.description}</p>
								{/if}
								{#if post.tags && post.tags.length > 0}
									<div class="post-tags">
										{#each post.tags as tag}
											<span class="tag">#{tag}</span>
										{/each}
									</div>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			{:else}
				<div class="empty-state">
					<p class="empty-state__title">/ NO DISPATCHES FOUND</p>
					<p class="empty-state__desc">
						Drop a <code>.md</code> file into <code>content/posts/</code> to publish an entry.
					</p>
				</div>
			{/if}
		</section>
	</div>

	<!-- Entry Content Block: Expanded by shifting left boundary by 13 grid spaces (23 + 13 = 36 modules) -->
	<aside class="entry-viewer-block" id="entry-viewer-container" aria-label="Entry Viewer">
		<EntryViewer post={$selectedPost} />
	</aside>

	<!-- Unified Navigation strictly at Line 26 (26 * 32px = 832px) -->
	<Navbar current="writing" />
</div>

<style>
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

	.post-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.post-row {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		width: 100%;
		border-bottom: 1px solid rgba(11, 53, 54, 0.1);
		padding-bottom: 6px;
	}

	.post-row:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.post-num {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.78rem;
		font-weight: 700;
		color: var(--vermilion);
		letter-spacing: 0.05em;
		min-width: 22px;
		padding-top: 6px;
		user-select: none;
		transition: color 0.15s ease;
	}

	.post-row.is-selected .post-num {
		color: var(--slate);
	}

	.post-btn {
		flex: 1;
		min-width: 0;
		display: block;
		text-align: left;
		background: transparent;
		border: none;
		border-left: 3px solid transparent;
		border-radius: 2px;
		padding: 6px 10px;
		margin: 0;
		cursor: pointer;
		color: inherit;
		font: inherit;
		outline: none;
		user-select: none;
		box-sizing: border-box;
		transition: background-color 0.15s ease, border-left-color 0.15s ease;
	}

	.post-btn:hover {
		background: rgba(11, 53, 54, 0.04);
	}

	.post-btn:focus-visible {
		outline: 1px dashed var(--vermilion);
		outline-offset: -2px;
	}

	.post-row.is-selected .post-btn {
		border-left-color: var(--vermilion);
		background: rgba(216, 71, 42, 0.08);
	}

	.post-row.is-selected .post-title {
		color: var(--vermilion);
	}

	.post-row.is-selected .post-meta {
		color: var(--ink);
	}

	.post-meta {
		display: flex;
		align-items: center;
		gap: 8px;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.76rem;
		color: var(--slate);
		margin-bottom: 6px;
		letter-spacing: 0.05em;
		transition: color 0.15s ease;
	}

	.post-sep {
		user-select: none;
	}

	.post-title {
		margin: 0 0 8px 0;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1.3;
		color: var(--ink);
		transition: color 0.15s ease;
	}

	.post-desc {
		margin: 0 0 10px 0;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.95rem;
		line-height: 1.5;
		color: rgba(11, 53, 54, 0.85);
	}

	.post-tags {
		display: flex;
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

	.empty-state {
		padding: 60px 24px;
		text-align: center;
	}

	.empty-state__title {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.85rem;
		letter-spacing: 0.12em;
		color: var(--slate);
		margin: 0 0 12px 0;
	}

	.empty-state__desc {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.96rem;
		color: rgba(11, 53, 54, 0.75);
		margin: 0;
	}

	.empty-state__desc code {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.85em;
		background: rgba(11, 53, 54, 0.08);
		padding: 2px 4px;
		border-radius: 2px;
	}

	.entry-viewer-block {
		position: absolute;
		top: calc(1 * var(--grid-unit, 32px));  /* Line 01 = 32px */
		right: calc(3 * var(--grid-unit, 32px)); /* Exact 3 * 32px modules = 96px */
		width: calc((23 + 13) * var(--grid-unit, 32px)); /* Expanded left by 13 grid spaces = 36 modules = 1152px */
		max-width: calc(100vw - calc(17 * var(--grid-unit, 32px)) - calc(2 * var(--grid-unit, 32px)) - calc(3 * var(--grid-unit, 32px)) - 32px);
		height: calc(23 * var(--grid-unit, 32px)); /* 736px = 23 modules (Line 01 to Line 24) */
		z-index: 2;
	}

	@media (max-width: 1360px) {
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

		.entry-viewer-block {
			position: static;
			width: calc(17 * var(--grid-unit, 32px));
			max-width: calc(100vw - 64px);
			height: auto;
			min-height: 480px;
		}
	}
</style>
