<script lang="ts">
	/**
	 * TwoColumnText Section
	 * Heading on one side, body text on the other.
	 * Both columns slide in from their respective sides.
	 */
	import { inview } from '$lib/actions/inView';

	interface Props {
		/** Heading text */
		heading: string;
		/** Body text (can be multiple paragraphs separated by \n\n) */
		body: string;
		/** Optional eyebrow above heading */
		eyebrow?: string;
		/** Layout direction */
		layout?: 'heading-left' | 'heading-right';
	}

	let { heading, body, eyebrow, layout = 'heading-left' }: Props = $props();

	let visible = $state(false);

	// Split body into paragraphs
	const paragraphs = $derived(body.split('\n\n').filter((p) => p.trim()));
</script>

<section
	class="two-column"
	class:visible
	class:reversed={layout === 'heading-right'}
	use:inview={{ threshold: 0.2 }}
	oninview={() => (visible = true)}
>
	<div class="two-column__container">
		<div class="two-column__heading-col">
			{#if eyebrow}
				<span class="two-column__eyebrow">{eyebrow}</span>
			{/if}
			<h2 class="two-column__heading">{heading}</h2>
		</div>
		<div class="two-column__body-col">
			{#each paragraphs as paragraph, i (i)}
				<p class="two-column__paragraph" style="--delay: {i * 100}ms">
					{paragraph}
				</p>
			{/each}
		</div>
	</div>
</section>

<style>
	.two-column {
		padding: var(--space-24) var(--space-6);
		overflow: hidden;
	}

	.two-column__container {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
		max-width: var(--max-width);
		margin: 0 auto;
	}

	@media (min-width: 768px) {
		.two-column__container {
			grid-template-columns: 1fr 1fr;
			gap: var(--space-16);
		}
	}

	/* Reversed layout */
	.two-column.reversed .two-column__heading-col {
		order: 2;
	}

	.two-column.reversed .two-column__body-col {
		order: 1;
	}

	/* Heading column */
	.two-column__heading-col {
		opacity: 0;
		transform: translateX(-40px);
		transition:
			opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
			transform 1s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.two-column.reversed .two-column__heading-col {
		transform: translateX(40px);
	}

	.two-column.visible .two-column__heading-col {
		opacity: 1;
		transform: translateX(0);
	}

	.two-column__eyebrow {
		display: block;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-muted);
		margin-bottom: var(--space-3);
	}

	.two-column__heading {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 4vw, 3rem);
		font-weight: 400;
		line-height: 1.2;
		color: var(--color-text);
		margin: 0;
	}

	/* Body column */
	.two-column__body-col {
		opacity: 0;
		transform: translateX(40px);
		transition:
			opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s,
			transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
	}

	.two-column.reversed .two-column__body-col {
		transform: translateX(-40px);
	}

	.two-column.visible .two-column__body-col {
		opacity: 1;
		transform: translateX(0);
	}

	.two-column__paragraph {
		font-family: var(--font-body);
		font-size: var(--text-base);
		line-height: 1.7;
		color: var(--color-text-muted);
		margin: 0 0 var(--space-4);
	}

	.two-column__paragraph:last-child {
		margin-bottom: 0;
	}
</style>
