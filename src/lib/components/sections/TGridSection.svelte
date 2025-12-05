<script lang="ts">
	/**
	 * TGridSection — 6-column text grid with hero/left/right variants.
	 * Based on project-layouts.md T-Grid specifications:
	 * - T-grid-hero: columns 1–5, large 3.5rem font
	 * - T-grid-left: columns 2–4
	 * - T-grid-right: columns 4–6
	 */
	import { inview } from '$lib/actions/inView';

	interface Props {
		/** The text to display. Can include line breaks with \n */
		text: string;
		/** Optional eyebrow/label above the main text */
		eyebrow?: string;
		/** Grid variant determining column placement */
		variant?: 'hero' | 'left' | 'right';
		/** Delay before animation starts (ms) */
		delay?: number;
	}

	let { text, eyebrow, variant = 'left', delay = 0 }: Props = $props();

	let visible = $state(false);

	// Split text into lines for staggered animation
	const lines = $derived(text.split('\n').filter((line) => line.trim()));

	function handleInview() {
		if (delay > 0) {
			setTimeout(() => (visible = true), delay);
		} else {
			visible = true;
		}
	}
</script>

<section
	class="t-grid t-grid--{variant}"
	class:visible
	use:inview={{ threshold: 0.3 }}
	oninview={handleInview}
>
	<div class="t-grid__content">
		{#if eyebrow}
			<span class="t-grid__eyebrow">{eyebrow}</span>
		{/if}
		<h2 class="t-grid__heading">
			{#each lines as line, i (i)}
				<span class="t-grid__line" style="--delay: {i * 100}ms">
					<span class="t-grid__line-inner">{line}</span>
				</span>
			{/each}
		</h2>
	</div>
</section>

<style>
	.t-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: var(--gutter);
		padding: var(--space-24) var(--gutter);
		margin: 0 auto;
		overflow: hidden;
	}

	/* Hero variant: columns 1–5 */
	.t-grid--hero .t-grid__content {
		grid-column: 1 / 6;
	}

	.t-grid--hero .t-grid__heading {
		font-size: clamp(2.5rem, 6vw, 3.5rem);
	}

	/* Left variant: columns 2–4 */
	.t-grid--left .t-grid__content {
		grid-column: 2 / 5;
	}

	/* Right variant: columns 4–6 */
	.t-grid--right .t-grid__content {
		grid-column: 4 / 7;
	}

	/* Responsive: stack on mobile */
	@media (max-width: 768px) {
		.t-grid {
			grid-template-columns: 1fr;
		}

		.t-grid--hero .t-grid__content,
		.t-grid--left .t-grid__content,
		.t-grid--right .t-grid__content {
			grid-column: 1;
		}

		.t-grid--hero .t-grid__heading {
			font-size: clamp(2rem, 8vw, 2.5rem);
		}
	}

	/* Eyebrow styling */
	.t-grid__eyebrow {
		display: block;
		font-family: var(--font-body);
		font-size: 1.125rem;
		font-weight: 400;
		color: var(--color-text-muted);
		margin-bottom: var(--space-4);
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.t-grid.visible .t-grid__eyebrow {
		opacity: 1;
		transform: translateY(0);
	}

	/* Heading styling */
	.t-grid__heading {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 400;
		line-height: 1.3;
		color: var(--color-text);
		margin: 0;
	}

	/* Line-by-line reveal */
	.t-grid__line {
		display: block;
		overflow: hidden;
	}

	.t-grid__line-inner {
		display: block;
		opacity: 0;
		transform: translateY(100%);
		transition:
			opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
			transform 1s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: var(--delay);
	}

	.t-grid.visible .t-grid__line-inner {
		opacity: 1;
		transform: translateY(0);
	}
</style>
