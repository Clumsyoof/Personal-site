<script lang="ts">
	export let current: 'index' | 'about' | 'writing' | null = null;
</script>

<nav class="nav line-26" aria-label="Main Navigation">
	<a href="/" class="nav__link" class:is-active={current === 'index'}>index</a>
	<a href="/about" class="nav__link" class:is-active={current === 'about'}>about</a>
	<a href="/writing" class="nav__link" class:is-active={current === 'writing'}>writing</a>
	<a href="https://github.com/clumsyoof" target="_blank" rel="noreferrer" class="nav__link">
		github <span class="nav__arrow" aria-hidden="true">↗</span>
	</a>
	<a href="https://linkedin.com/in/advikkaushik06" target="_blank" rel="noreferrer" class="nav__link">
		linkedin <span class="nav__arrow" aria-hidden="true">↗</span>
	</a>
	<a href="mailto:advikkaushik478@gmail.com" class="nav__link">contact</a>
</nav>

<style>
	.nav.line-26 {
		position: absolute;
		top: calc(26 * var(--grid-unit, 32px)); /* Line 26 = 832px */
		left: calc(2 * var(--grid-unit, 32px)); /* Column 02 = 64px */
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		min-height: var(--grid-unit, 32px);
		gap: 8px 10px;
		margin: 0;
		z-index: 10;
	}

	.nav__link {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: clamp(0.9rem, 1.6vw, 1rem);
		font-weight: 600;
		color: var(--ink, #0b3536);
		text-decoration: none;
		background: rgba(247, 244, 234, 0.94);
		border: 1px solid var(--ink, #0b3536);
		padding: 6px 14px;
		border-radius: 2px;
		line-height: 1.2;
		cursor: pointer;
		user-select: none;
		transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
	}

	.nav__link:hover:not(.is-active) {
		background: var(--ink, #0b3536);
		color: #f7f4ea;
		border-color: var(--ink, #0b3536);
	}

	.nav__link:active {
		transform: translateY(1px);
	}

	.nav__link.is-active {
		background: var(--vermilion, #d8472a);
		color: #f7f4ea;
		border-color: var(--vermilion, #d8472a);
		font-weight: 700;
		cursor: default;
	}

	.nav__link:focus-visible {
		outline: 2px dashed var(--vermilion, #d8472a);
		outline-offset: 2px;
	}

	.nav__arrow {
		font-size: 0.85em;
		line-height: 1;
		opacity: 0.8;
		transition: transform 0.15s ease;
	}

	.nav__link:hover .nav__arrow {
		transform: translate(1px, -1px);
	}

	@media (max-width: 1360px) {
		.nav.line-26 {
			position: static;
			margin-top: calc(2 * var(--grid-unit, 32px));
			margin-bottom: calc(2 * var(--grid-unit, 32px));
			padding-left: 0;
		}
	}
</style>
