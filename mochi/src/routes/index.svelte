<script lang="ts">
	import Clock from '../lib/components/Clock.svelte';
	import Navbar from '../lib/components/Navbar.svelte';
	import SwissGrid from '../lib/components/SwissGrid.svelte';
</script>

<svelte:head>
	<title>Advik Kaushik</title>
</svelte:head>

<main class="page">
	<SwissGrid mochi:hydrate />

	<div class="canvas-grid">
		<!-- Left Hero Block: Snapped to Line 01 through Line 20 (Col 02) -->
		<div class="hero-left-block">
			<header class="hero-header">
				<h1 class="hero-headline">
					<span class="hero-name hero-name--first">Advik</span>
					<span class="hero-name hero-name--last">Kaushik</span>
				</h1>
			</header>

			<!-- Clock Ticker: Snapped at Line 19 (2 modules gap from name) -->
			<div class="hero-clock">
				<Clock mochi:hydrate location="BANGALORE" />
			</div>
		</div>

		<!-- Right Block: Dynamic WebAssembly Simulation Canvas (23 × 23 Modules = 736 × 736 px) -->
		<div class="wasm-block" aria-label="WebAssembly Simulation Viewport">
			<div class="wasm-viewport" id="wasm-container">
				<canvas id="sakura-canvas" class="wasm-canvas" width="736" height="736"></canvas>
				<span class="wasm-slot__label">/ WEBASSEMBLY 736×736</span>
			</div>
		</div>

		<!-- Unified Navigation strictly at Line 26 (26 * 32px = 832px) -->
		<Navbar current="index" />
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
		min-height: calc(32 * var(--grid-unit, 32px));
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
		min-height: calc(32 * var(--grid-unit, 32px));
		box-sizing: border-box;
	}

	/* Left Block: Column 02 (64px), Line 01 (32px) */
	.hero-left-block {
		position: absolute;
		top: calc(1 * var(--grid-unit, 32px));  /* Line 01 = 32px */
		left: calc(2 * var(--grid-unit, 32px)); /* Column 02 = 64px */
		width: calc(17 * var(--grid-unit, 32px)); /* 17 modules = 544px */
		max-width: calc(100vw - 80px);
		display: flex;
		flex-direction: column;
		z-index: 3;
	}

	.hero-header {
		margin: 0;
		padding: 0;
	}

	.hero-headline {
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-weight: 800;
		font-style: italic;
		font-size: clamp(4.5rem, 8.5vw, 7.5rem);
		line-height: 0.84;
		letter-spacing: -0.04em;
		user-select: none;
		cursor: default;
		color: var(--ink);
	}

	.hero-name--first,
	.hero-name--last {
		color: var(--ink);
		display: block;
	}

	/* Clock Ticker: Snapped beneath the name block */
	.hero-clock {
		margin-top: calc(2 * var(--grid-unit, 32px)); /* 2 modules gap = 64px */
		height: var(--grid-unit, 32px); /* 1 module = 32px */
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.hero-clock :global(.time-panel) {
		justify-content: flex-start;
		margin: 0;
		padding: 0;
	}

	/* Right Wasm Block: 23 × 23 Modules (736 × 736 px), Line 01 to Line 24 */
	.wasm-block {
		position: absolute;
		top: calc(1 * var(--grid-unit, 32px));  /* Line 01 = 32px */
		right: calc(3 * var(--grid-unit, 32px)); /* 3 modules from right = 96px */
		width: calc(23 * var(--grid-unit, 32px));  /* 23 modules = 736px */
		max-width: calc(100vw - calc(17 * var(--grid-unit, 32px)) - calc(2 * var(--grid-unit, 32px)) - calc(3 * var(--grid-unit, 32px)) - 32px);
		height: calc(23 * var(--grid-unit, 32px)); /* 23 modules = 736px */
		aspect-ratio: 1 / 1;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		z-index: 2;
	}

	.wasm-viewport {
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		aspect-ratio: 1 / 1;
		border: 1px solid var(--ink);
		border-top: 2px solid var(--vermilion);
		background: rgba(247, 244, 234, 0.94);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		box-sizing: border-box;
		overflow: hidden;
	}

	.wasm-canvas {
		display: block;
		width: 100%;
		height: 100%;
		position: absolute;
		inset: 0;
	}

	.wasm-slot__label {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		color: var(--slate);
		opacity: 0.65;
		user-select: none;
		position: relative;
		z-index: 1;
	}

	@media (max-width: 1360px) {
		.canvas-grid {
			padding: calc(1 * var(--grid-unit, 32px)) 0 calc(2 * var(--grid-unit, 32px)) calc(2 * var(--grid-unit, 32px));
			min-height: auto;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			box-sizing: border-box;
		}

		.hero-left-block {
			position: static;
			width: calc(17 * var(--grid-unit, 32px));
			max-width: calc(100vw - 64px);
			margin-bottom: calc(1 * var(--grid-unit, 32px));
			align-items: flex-start;
			text-align: left;
		}

		.hero-name--first,
		.hero-name--last {
			height: auto;
			font-size: clamp(2.5rem, 11vw, 5rem);
			line-height: 0.9;
		}

		.wasm-block {
			position: static;
			width: calc(17 * var(--grid-unit, 32px));
			max-width: calc(100vw - 64px);
			height: auto;
			aspect-ratio: 1 / 1;
			margin-bottom: calc(1 * var(--grid-unit, 32px));
		}

		.wasm-viewport {
			width: 100%;
			height: 100%;
		}

		.hero-clock {
			margin-top: calc(1 * var(--grid-unit, 32px));
		}
	}
</style>
