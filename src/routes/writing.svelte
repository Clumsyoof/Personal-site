<script lang="ts">
	import SwissGrid from '../lib/components/SwissGrid.svelte';
	import WritingWorkspace from '../lib/components/WritingWorkspace.svelte';
	import type { Post } from '../lib/posts.ts';

	export let posts: Post[] = [];
</script>

<svelte:head>
	<title>Writing | Clumsyoof</title>
</svelte:head>

<main class="page">
	<SwissGrid mochi:hydrate />

	<WritingWorkspace mochi:hydrate {posts} />
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

	@media (max-width: 1360px) {
		.page {
			min-height: auto;
			padding-bottom: 96px;
		}
	}
</style>
