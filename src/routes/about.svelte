<script lang="ts">
	import Navbar from '../lib/components/Navbar.svelte';
	import SwissGrid from '../lib/components/SwissGrid.svelte';
</script>

<svelte:head>
	<title>About | Clumsyoof</title>
</svelte:head>

<main class="page">
	<SwissGrid mochi:hydrate />

	<div class="canvas-grid">
		<!-- Top-Left at Line 01 (32px from top, 64px from left) -->
		<div class="top-left-block">
			<header class="header">
				<h1 class="headline">
					Advik Kaushik <span class="headline__sep">/</span> <span class="headline__section">about</span>
				</h1>
			</header>

			<section class="card square-card">
				<div class="card__body">
					<p class="lead">
						Systems programmer focused on having fun
					</p>
					<p class="body-text">
						Computers go beep boop and I like that. Wide interests, from low-level code to graphics pipelines to FPGAs. Most of what I build is just me poking around for fun. Still early, still figuring it out. LARPing as a sys admin on Gentoo Linux (yes it's a flex).
					</p>
				</div>

				<div class="spec-table">
					<div class="spec-row">
						<span class="spec-key">FOCUS</span>
						<span class="spec-val">Systems, Performance, Audio ML</span>
					</div>
					<div class="spec-row">
						<span class="spec-key">LANGUAGES</span>
						<span class="spec-val">C++, Python, Go, TypeScript, Bash</span>
					</div>
					<div class="spec-row">
						<span class="spec-key">TOOLKIT</span>
						<span class="spec-val">Git, CMake, Linux, BubbleTea</span>
					</div>
				</div>
			</section>
		</div>

		<!-- Bigger Square: 736x736px (Line 01 to Line 24) -->
		<!-- Right Block: Grand Architectural Photograph (23 × 23 Modules = 736 × 736 px) -->
		<figure class="photo-block" aria-label="Bangalore cityscape photograph">
			<img
				class="photo__image"
				src="/blr.jpg"
				alt="Bangalore cityscape"
				width="736"
				height="736"
			/>
		</figure>

		<!-- Unified Navigation strictly at Line 26 (26 * 32px = 832px) -->
		<Navbar current="about" />
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
		display: flex;
		flex-direction: column;
		justify-content: space-between;
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

	.card__body {
		margin-bottom: 20px;
	}

	.lead {
		margin: 0 0 14px 0;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 1.15rem;
		line-height: 1.5;
		color: var(--ink);
		font-weight: 600;
	}

	.body-text {
		margin: 0;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.96rem;
		line-height: 1.6;
		color: rgba(11, 53, 54, 0.88);
	}

	.spec-table {
		border-top: 1px solid rgba(11, 53, 54, 0.15);
		padding-top: 16px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex-shrink: 0;
	}

	.spec-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.76rem;
		gap: 8px;
	}

	.spec-key {
		color: var(--slate);
		letter-spacing: 0.08em;
		flex-shrink: 0;
	}

	.spec-val {
		color: var(--ink);
		font-weight: 700;
		text-align: right;
	}

	/* Right Photo Block: 23 × 23 Modules (736 × 736 px), Line 01 to Line 24 */
	.photo-block {
		position: absolute;
		top: calc(1 * var(--grid-unit, 32px));  /* Line 01 = 32px */
		right: calc(3 * var(--grid-unit, 32px)); /* Exact 3 * 32px modules = 96px */
		width: calc(23 * var(--grid-unit, 32px)); /* 736px = 23 modules (Line 01 to Line 24) */
		max-width: calc(100vw - calc(17 * var(--grid-unit, 32px)) - calc(2 * var(--grid-unit, 32px)) - calc(3 * var(--grid-unit, 32px)) - 32px);
		height: calc(23 * var(--grid-unit, 32px)); /* 736px = 23 modules */
		aspect-ratio: 1 / 1;
		margin: 0;
		padding: 0;
		border: 1px solid var(--ink);
		border-top: 2px solid var(--vermilion);
		background: rgba(247, 244, 234, 0.94);
		box-sizing: border-box;
		overflow: hidden;
		z-index: 2;
	}

	.photo__image {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
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
			height: auto;
			aspect-ratio: 1 / 1;
		}

		.photo-block {
			position: static;
			width: calc(17 * var(--grid-unit, 32px));
			max-width: calc(100vw - 64px);
			height: auto;
			aspect-ratio: 1 / 1;
		}
	}
</style>

