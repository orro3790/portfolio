<script lang="ts">
	/**
	 * QuadGrid Section — 2×2 equal image grid.
	 * Simple, balanced layout for showcasing 4 related images.
	 *
	 * ╔═══════╦═══════╗
	 * ║   A   ║   B   ║
	 * ╠═══════╬═══════╣
	 * ║   C   ║   D   ║
	 * ╚═══════╩═══════╝
	 */
	import { inview } from '$lib/actions/inView';

	interface ImageData {
		src: string;
		alt: string;
		caption?: string;
	}

	interface Props {
		/** Array of exactly 4 images [A, B, C, D] */
		images: [ImageData, ImageData, ImageData, ImageData];
		/** Gap between images */
		gap?: 'none' | 'small' | 'medium';
		/** Aspect ratio for each cell */
		aspectRatio?: string;
	}

	let { images, gap = 'small', aspectRatio = '1/1' }: Props = $props();

	let visible = $state(false);
</script>

<section
	class="quad-grid"
	class:visible
	class:gap-none={gap === 'none'}
	class:gap-small={gap === 'small'}
	class:gap-medium={gap === 'medium'}
	use:inview={{ threshold: 0.15 }}
	oninview={() => (visible = true)}
>
	<div class="quad-grid__layout">
		{#each images as image, i}
			<div class="quad-grid__cell" style="--delay: {i * 100}ms">
				<div class="quad-grid__image-wrapper" style="--aspect-ratio: {aspectRatio}">
					<div class="quad-grid__curtain"></div>
					<img src={image.src} alt={image.alt} loading="lazy" />
				</div>
				{#if image.caption}
					<p class="quad-grid__caption">{image.caption}</p>
				{/if}
			</div>
		{/each}
	</div>
</section>

<style>
	.quad-grid {
		/* Viewport-relative padding - no max-width constraint */
		padding: var(--space-8) var(--gutter);
	}

	.quad-grid__layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto auto;
		/* No max-width - grid fills available width */
	}

	/* Gap variations */
	.quad-grid.gap-none .quad-grid__layout {
		gap: 0;
	}

	.quad-grid.gap-small .quad-grid__layout {
		gap: var(--space-2);
	}

	.quad-grid.gap-medium .quad-grid__layout {
		gap: var(--space-4);
	}

	.quad-grid__cell {
		position: relative;
	}

	.quad-grid__image-wrapper {
		position: relative;
		aspect-ratio: var(--aspect-ratio, 4/3);
		overflow: hidden;
		background-color: var(--color-bg-elevated);
	}

	.quad-grid__image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(1.05);
		transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.quad-grid.visible .quad-grid__image-wrapper img {
		transform: scale(1);
	}

	/* Curtain reveal */
	.quad-grid__curtain {
		position: absolute;
		inset: 0;
		background-color: var(--color-bg);
		z-index: 2;
		transform-origin: top;
		transform: scaleY(1);
		transition: transform 1s cubic-bezier(0.77, 0, 0.175, 1);
		transition-delay: var(--delay);
	}

	.quad-grid.visible .quad-grid__curtain {
		transform: scaleY(0);
		transform-origin: bottom;
	}

	/* Caption */
	.quad-grid__caption {
		margin-top: var(--space-2);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: calc(var(--delay) + 0.6s);
	}

	.quad-grid.visible .quad-grid__caption {
		opacity: 1;
		transform: translateY(0);
	}

	/* Responsive: 2×2 on tablet, stack on mobile */
	@media (max-width: 640px) {
		.quad-grid__layout {
			grid-template-columns: 1fr;
			grid-template-rows: auto;
		}
	}
</style>
