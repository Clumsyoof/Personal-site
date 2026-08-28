<script lang="ts">
	import { onMount } from 'svelte';

	const GRID_SIZE = 32;
	let lineCount = 36;
	let bgHeight = 1024;

	function updateMetrics() {
		if (typeof document !== 'undefined') {
			const scrollH = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight,
				window.innerHeight
			);
			bgHeight = scrollH;
			lineCount = Math.max(Math.ceil(scrollH / GRID_SIZE) + 2, 32);
		}
	}

	onMount(() => {
		updateMetrics();
		window.addEventListener('resize', updateMetrics);

		const observer = new ResizeObserver(() => {
			updateMetrics();
		});

		if (document.body) {
			observer.observe(document.body);
		}

		return () => {
			window.removeEventListener('resize', updateMetrics);
			observer.disconnect();
		};
	});
</script>

<div class="swiss-bg" style="height: {bgHeight}px;" aria-hidden="true">
	<!-- Dot Matrix Grid that scrolls with page content -->
	<div class="dot-grid"></div>

	<!-- Left Margin Line Indexing (Drafting sheet numbering) -->
	<div class="left-gutter">
		{#each Array.from({ length: lineCount }) as _, i}
			<div class="gutter-item" style="top: {i * GRID_SIZE}px;">
				<span class="gutter-item__tick"></span>
				<span class="gutter-item__num">{i.toString().padStart(2, '0')}</span>
			</div>
		{/each}
	</div>

	<!-- Bottom Left Technical Metric Spec (Subtle, unboxed, matching line numbers) -->
	<div class="metric-spec">
		<span class="metric-spec__text">GRID: 32PX / UNIT: 8PT / REV: 2026.08 / CLUMSYOOF</span>
	</div>
</div>

<style>
	:global(:root) {
		--grid-unit: 32px;
	}

	.swiss-bg {
		--grid-color: rgba(126, 147, 143, 0.6);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		pointer-events: none;
		overflow: hidden;
		z-index: 0;
	}

	/* Pure Static Dot Matrix Grid matching side numbering color and contrast */
	.dot-grid {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(circle at 0px 0px, var(--grid-color) 2px, transparent 2px);
		background-size: var(--grid-unit, 32px) var(--grid-unit, 32px);
		background-position: 0 0;
	}

	/* Left Gutter Drafting Line Numbers */
	.left-gutter {
		position: absolute;
		top: 0;
		left: 0;
		width: 32px;
		height: 100%;
		border-right: 1px solid rgba(126, 147, 143, 0.35);
	}

	.gutter-item {
		position: absolute;
		left: 0;
		width: 100%;
		height: 32px;
		display: flex;
		align-items: center;
		padding-left: 6px;
		box-sizing: border-box;
	}

	.gutter-item__tick {
		position: absolute;
		top: 0;
		left: 0;
		width: 4px;
		height: 1px;
		background: var(--grid-color);
	}

	.gutter-item__num {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 8px;
		color: var(--grid-color);
		letter-spacing: 0.05em;
		user-select: none;
	}

	/* Subtle unboxed metric note in bottom margin aligned to grid */
	.metric-spec {
		position: absolute;
		bottom: 32px;
		left: 64px;
		height: 32px;
		display: flex;
		align-items: center;
		z-index: 2;
	}

	.metric-spec__text {
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: 8px;
		letter-spacing: 0.12em;
		color: var(--grid-color);
		user-select: none;
		white-space: nowrap;
	}

	@media (max-width: 768px) {
		.left-gutter {
			display: none;
		}

		.metric-spec {
			left: 32px;
			bottom: 16px;
		}
	}
</style>



