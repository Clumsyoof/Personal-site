<script lang="ts">
	import { clockStore } from '../stores/clock.ts';
	import { formatClock, formatDateStamp } from '../utils/format-time.ts';

	export let location: string = 'BANGALORE';

	$: time = formatClock($clockStore);
	$: stamp = formatDateStamp($clockStore);
</script>

<div class="time-panel" role="timer" aria-label="Current time in {location}">
	<span class="time-panel__location">{location}</span>
	<span class="time-panel__sep" aria-hidden="true">/</span>
	<span class="time-panel__digits">{time.h}<i>:</i>{time.m}<i>:</i>{time.s}</span>
	<span class="time-panel__sep" aria-hidden="true">/</span>
	<time class="time-panel__date">{stamp}</time>
</div>

<style>
	.time-panel {
		--ink: #0b3536;
		--vermilion: #d8472a;
		--slate: #4d6b67;

		display: flex;
		align-items: center;
		justify-content: center;
		gap: clamp(0.35rem, 1.5vw, 0.65rem);
		height: var(--grid-unit, 32px);
		line-height: var(--grid-unit, 32px);
		margin: 0 0 var(--grid-unit, 32px) 0;
		font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
		font-size: clamp(0.76rem, 3.2vw, 0.95rem);
		color: var(--ink);
		white-space: nowrap;
		max-width: 100%;
		box-sizing: border-box;
	}

	.time-panel__location {
		color: var(--slate);
		letter-spacing: 0.12em;
		font-weight: 700;
	}

	.time-panel__sep {
		color: var(--slate);
		opacity: 0.75;
		user-select: none;
	}

	.time-panel__digits {
		font-weight: 700;
		letter-spacing: 0.06em;
		color: var(--ink);
	}

	.time-panel__digits i {
		font-style: normal;
		color: var(--vermilion);
		margin: 0 0.05em;
	}

	.time-panel__date {
		color: var(--slate);
		letter-spacing: 0.08em;
	}
</style>




