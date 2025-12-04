<script lang="ts">
	/**
	 * AsymmetricGrid Section — Unified asymmetric 2-column layout.
	 *
	 * Replaces the confusing TriGrid + DGU components with semantic props:
	 * - largePosition: Where the spanning image sits ('left' or 'right')
	 * - smallPosition: Where the smaller image sits ('top' or 'bottom')
	 *
	 * This creates 4 natural layout combinations that Sanity can expose as
	 * simple dropdown choices for content editors.
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

	interface ImageData {
		src: string;
		alt: string;
		caption?: string;
	}

	interface Props {
		/** Position of large image (spans 2 rows) */
		largePosition: 'left' | 'right';
		/** Position of small image within the non-spanning column */
		smallPosition: 'top' | 'bottom';
		/** Large image data */
		imageLarge: ImageData;
		/** Small image data */
		imageSmall: ImageData;
		/** Optional text content for the empty cell */
		textContent?: string;
	}

	let { largePosition, smallPosition, imageLarge, imageSmall, textContent }: Props = $props();

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

	// Auto-trigger after mount as fallback
	$effect(() => {
		const timer = setTimeout(() => {
			if (!visible) visible = true;
		}, 300);
		return () => clearTimeout(timer);
	});
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
		<!-- Large image cell (spans 2 rows) -->
		<div class="asym-grid__cell asym-grid__cell--large">
			<div class="asym-grid__image-wrapper asym-grid__image-wrapper--large">
				<div class="asym-grid__curtain"></div>
				<img src={imageLarge.src} alt={imageLarge.alt} loading="lazy" />
			</div>
			{#if imageLarge.caption}
				<p class="asym-grid__caption">{imageLarge.caption}</p>
			{/if}
		</div>

		<!-- Small image cell -->
		<div class="asym-grid__cell asym-grid__cell--small">
			<div class="asym-grid__image-wrapper asym-grid__image-wrapper--small">
				<div class="asym-grid__curtain"></div>
				<img src={imageSmall.src} alt={imageSmall.alt} loading="lazy" />
			</div>
			{#if imageSmall.caption}
				<p class="asym-grid__caption">{imageSmall.caption}</p>
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
		padding: var(--space-16) var(--gutter);
	}

	.asym-grid__layout {
		display: grid;
		grid-template-columns: var(--grid-columns);
		grid-template-rows: 1fr 1fr;
		grid-template-areas: var(--grid-areas);
		gap: var(--gutter);
		max-width: var(--max-width);
		margin: 0 auto;
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
	 * Small image alignment based on position:
	 * - If small is at TOP, align content to END (bottom of cell)
	 * - If small is at BOTTOM, align content to START (top of cell)
	 * This ensures the image "hugs" the adjacent large image
	 */
	.asym-grid.small-top .asym-grid__cell--small {
		justify-content: flex-end;
	}

	.asym-grid.small-bottom .asym-grid__cell--small {
		justify-content: flex-start;
	}

	/* Empty cell alignment (opposite of small) */
	.asym-grid.small-top .asym-grid__cell--empty {
		justify-content: flex-start;
	}

	.asym-grid.small-bottom .asym-grid__cell--empty {
		justify-content: flex-end;
	}

	/* Image wrappers */
	.asym-grid__image-wrapper {
		position: relative;
		overflow: hidden;
		background-color: var(--color-bg-elevated);
		border-radius: 4px;
	}

	/* Large image: fills the spanning cell, natural aspect */
	.asym-grid__image-wrapper--large {
		width: 100%;
		height: 100%;
		min-height: 450px;
	}

	/* Small image: constrained but substantial (~65% of large) */
	.asym-grid__image-wrapper--small {
		width: 100%;
		aspect-ratio: 1 / 0.85;
		min-height: 280px;
	}

	.asym-grid__image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		/* Subtle zoom on reveal */
		transform: scale(1.05);
		transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.asym-grid.visible .asym-grid__image-wrapper img {
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

	/* Stagger the small image reveal */
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

		.asym-grid__image-wrapper--large {
			min-height: 350px;
			height: auto;
			aspect-ratio: 1 / 1;
		}

		.asym-grid__image-wrapper--small {
			min-height: 220px;
			aspect-ratio: 1 / 0.7;
		}

		/* Reset alignment on mobile */
		.asym-grid.small-top .asym-grid__cell--small,
		.asym-grid.small-bottom .asym-grid__cell--small {
			justify-content: flex-start;
		}
	}
</style>
