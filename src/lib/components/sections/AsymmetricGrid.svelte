<script lang="ts">
	/**
	 * AsymmetricGrid Section — Unified asymmetric 2-column layout.
	 *
	 * Semantic props:
	 * - largePosition: Where the spanning media sits ('left' or 'right')
	 * - smallPosition: Where the smaller media sits ('top' or 'bottom')
	 *
	 * This creates 4 natural layout combinations that Sanity can expose as
	 * simple dropdown choices for content editors.
	 *
	 * Supports both images and videos via the Media type.
	 *
	 * Layout ASCII examples:
	 *
	 * largePosition='left', smallPosition='top':
	 * ╔═══════════╦═══════╗
	 * ║           ║ small ║
	 * ║   LARGE   ╠═══════╣
	 * ║           ║ empty ║
	 * ╚═══════════╩═══════╝
	 *
	 * largePosition='right', smallPosition='bottom':
	 * ╔═══════╦═══════════╗
	 * ║ empty ║           ║
	 * ╠═══════╣   LARGE   ║
	 * ║ small ║           ║
	 * ╚═══════╩═══════════╝
	 */
	import { inview } from '$lib/actions/inView';
	import MediaItem from '$lib/components/primitives/MediaItem.svelte';
	import type { Media } from '$lib/schemas/project';

	interface Props {
		/** Position of large media (spans 2 rows) */
		largePosition: 'left' | 'right';
		/** Position of small media within the non-spanning column */
		smallPosition: 'top' | 'bottom';
		/** Large media item */
		mediaLarge: Media;
		/** Small media item */
		mediaSmall: Media;
		/** Optional text content for the empty cell */
		textContent?: string;
	}

	let { largePosition, smallPosition, mediaLarge, mediaSmall, textContent }: Props = $props();

	let visible = $state(false);

	// Compute grid area assignments based on position props
	const gridAreas = $derived.by(() => {
		if (largePosition === 'left') {
			return smallPosition === 'top'
				? `'large small' 'large empty'`
				: `'large empty' 'large small'`;
		} else {
			return smallPosition === 'top'
				? `'small large' 'empty large'`
				: `'empty large' 'small large'`;
		}
	});

	// Column sizing: larger column gets more space
	const gridColumns = $derived(largePosition === 'left' ? '1.1fr 0.9fr' : '0.9fr 1.1fr');
</script>

<section
	class="asym-grid"
	class:visible
	class:large-left={largePosition === 'left'}
	class:large-right={largePosition === 'right'}
	class:small-top={smallPosition === 'top'}
	class:small-bottom={smallPosition === 'bottom'}
	use:inview={{ threshold: 0.15 }}
	oninview={() => (visible = true)}
	style="--grid-areas: {gridAreas}; --grid-columns: {gridColumns};"
>
	<div class="asym-grid__layout">
		<!-- Large media cell (spans 2 rows) -->
		<div class="asym-grid__cell asym-grid__cell--large">
			<div class="asym-grid__media-wrapper asym-grid__media-wrapper--large">
				<div class="asym-grid__curtain"></div>
				<MediaItem media={mediaLarge} class="asym-grid__media" loading="lazy" />
			</div>
			{#if mediaLarge.caption}
				<p class="asym-grid__caption">{mediaLarge.caption}</p>
			{/if}
		</div>

		<!-- Small media cell -->
		<div class="asym-grid__cell asym-grid__cell--small">
			<div class="asym-grid__media-wrapper asym-grid__media-wrapper--small">
				<div class="asym-grid__curtain"></div>
				<MediaItem media={mediaSmall} class="asym-grid__media" loading="lazy" />
			</div>
			{#if mediaSmall.caption}
				<p class="asym-grid__caption">{mediaSmall.caption}</p>
			{/if}
		</div>

		<!-- Empty/text cell -->
		<div class="asym-grid__cell asym-grid__cell--empty">
			{#if textContent}
				<p class="asym-grid__text">{textContent}</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.asym-grid {
		padding: var(--space-8) var(--gutter);
	}

	.asym-grid__layout {
		display: grid;
		grid-template-columns: var(--grid-columns);
		grid-template-rows: auto auto;
		grid-template-areas: var(--grid-areas);
		gap: var(--space-4);
		/* No max-width - grid fills available width */
	}

	/* Cell positioning via grid areas */
	.asym-grid__cell--large {
		grid-area: large;
	}

	.asym-grid__cell--small {
		grid-area: small;
		display: flex;
		flex-direction: column;
	}

	.asym-grid__cell--empty {
		grid-area: empty;
		display: flex;
		flex-direction: column;
	}

	/* 
	 * Small media alignment based on position:
	 * - If small is at TOP, align content to START (top of cell)
	 * - If small is at BOTTOM, align content to END (bottom of cell)
	 */
	.asym-grid.small-top .asym-grid__cell--small {
		justify-content: flex-start;
	}

	.asym-grid.small-bottom .asym-grid__cell--small {
		justify-content: flex-end;
	}

	/* Empty cell alignment (opposite of small) */
	.asym-grid.small-top .asym-grid__cell--empty {
		justify-content: flex-end;
	}

	.asym-grid.small-bottom .asym-grid__cell--empty {
		justify-content: flex-start;
	}

	/* Media wrappers */
	.asym-grid__media-wrapper {
		position: relative;
		overflow: hidden;
		background-color: var(--color-bg-elevated);
		border-radius: 4px;
		width: 100%;
	}

	/* Large media: landscape ratio matching Metalab reference (~3:2) */
	.asym-grid__media-wrapper--large {
		aspect-ratio: 3 / 2;
	}

	/* Small media: slightly wider landscape (~16:9) */
	.asym-grid__media-wrapper--small {
		aspect-ratio: 16 / 9;
	}

	.asym-grid__media-wrapper :global(.asym-grid__media) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		/* Subtle zoom on reveal */
		transform: scale(1.05);
		transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.asym-grid.visible .asym-grid__media-wrapper :global(.asym-grid__media) {
		transform: scale(1);
	}

	/* 
	 * Curtain reveal animation (top to bottom)
	 * Uses a pseudo-element overlay that slides away
	 */
	.asym-grid__curtain {
		position: absolute;
		inset: 0;
		background-color: var(--color-bg);
		z-index: 2;
		transform-origin: top;
		transform: scaleY(1);
		transition: transform 1s cubic-bezier(0.77, 0, 0.175, 1);
	}

	.asym-grid.visible .asym-grid__curtain {
		transform: scaleY(0);
		transform-origin: bottom;
	}

	/* Stagger the small media reveal */
	.asym-grid__cell--small .asym-grid__curtain {
		transition-delay: 150ms;
	}

	/* Caption styling */
	.asym-grid__caption {
		margin-top: var(--space-3);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		/* Text animation: fade in + slide up */
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s,
			transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s;
	}

	.asym-grid.visible .asym-grid__caption {
		opacity: 1;
		transform: translateY(0);
	}

	/* Text content in empty cell */
	.asym-grid__text {
		font-family: var(--font-body);
		font-size: var(--text-base);
		line-height: 1.7;
		color: var(--color-text-muted);
		max-width: 320px;
		/* Text animation: fade in + slide up */
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s,
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
	}

	.asym-grid.visible .asym-grid__text {
		opacity: 1;
		transform: translateY(0);
	}

	/* Responsive: stack on mobile */
	@media (max-width: 768px) {
		.asym-grid__layout {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto auto;
			grid-template-areas:
				'large'
				'small'
				'empty';
		}

		/* Reset alignment on mobile */
		.asym-grid.small-top .asym-grid__cell--small,
		.asym-grid.small-bottom .asym-grid__cell--small {
			justify-content: flex-start;
		}
	}
</style>
