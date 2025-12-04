<script lang="ts">
	/**
	 * Diagonal Section — Staggered diagonal image arrangement.
	 * Based on project-layouts.md Diagonal specification:
	 * - 2 rows, 2 columns
	 * - Top row: large image (left), empty (right)
	 * - Bottom row: empty (left), small image (right)
	 * - Both images 1:0.8 aspect ratio
	 * - Large image ~800px tall, small ~340px tall
	 *
	 * Features:
	 * - Curtain reveal animation (top to bottom)
	 * - Caption fade-in + slide-up animation
	 */
	import { inview } from '$lib/actions/inView';

	interface ImageData {
		src: string;
		alt: string;
		caption?: string;
	}

	interface Props {
		/** Large image (top-left) */
		imageLarge: ImageData;
		/** Small image (bottom-right) */
		imageSmall: ImageData;
	}

	let { imageLarge, imageSmall }: Props = $props();

	let visible = $state(false);

	// Auto-trigger after mount as fallback
	$effect(() => {
		const timer = setTimeout(() => {
			if (!visible) visible = true;
		}, 300);
		return () => clearTimeout(timer);
	});
</script>

<section
	class="diagonal"
	class:visible
	use:inview={{ threshold: 0.15 }}
	oninview={() => (visible = true)}
>
	<div class="diagonal__grid">
		<!-- Row 1: Large image left, empty right -->
		<div class="diagonal__cell diagonal__cell--large">
			<div class="diagonal__image-wrapper diagonal__image-wrapper--large">
				<div class="diagonal__curtain"></div>
				<img src={imageLarge.src} alt={imageLarge.alt} loading="lazy" />
			</div>
			{#if imageLarge.caption}
				<p class="diagonal__caption">{imageLarge.caption}</p>
			{/if}
		</div>
		<div class="diagonal__cell diagonal__cell--empty-top"></div>

		<!-- Row 2: Empty left, small image right -->
		<div class="diagonal__cell diagonal__cell--empty-bottom"></div>
		<div class="diagonal__cell diagonal__cell--small">
			<div class="diagonal__image-wrapper diagonal__image-wrapper--small">
				<div class="diagonal__curtain"></div>
				<img src={imageSmall.src} alt={imageSmall.alt} loading="lazy" />
			</div>
			{#if imageSmall.caption}
				<p class="diagonal__caption">{imageSmall.caption}</p>
			{/if}
		</div>
	</div>
</section>

<style>
	.diagonal {
		padding: var(--space-16) var(--gutter);
	}

	.diagonal__grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto auto;
		gap: var(--gutter);
		max-width: var(--max-width);
		margin: 0 auto;
	}

	/* Cell positioning */
	.diagonal__cell--large {
		grid-column: 1;
		grid-row: 1;
	}

	.diagonal__cell--empty-top {
		grid-column: 2;
		grid-row: 1;
	}

	.diagonal__cell--empty-bottom {
		grid-column: 1;
		grid-row: 2;
	}

	.diagonal__cell--small {
		grid-column: 2;
		grid-row: 2;
		/* Align to end so it sits at bottom of its cell */
		align-self: end;
	}

	/* Image wrappers */
	.diagonal__image-wrapper {
		position: relative;
		aspect-ratio: 1 / 0.8; /* 1:0.8 (width:height) */
		overflow: hidden;
		background-color: var(--color-bg-elevated);
		border-radius: 4px;
	}

	/* Large image sizing: ~800px equivalent */
	.diagonal__image-wrapper--large {
		max-height: 800px;
	}

	/* Small image sizing: ~340px equivalent (roughly 42.5% of large) */
	.diagonal__image-wrapper--small {
		max-height: 340px;
		max-width: 70%; /* Keep it smaller relative to column */
		margin-left: auto; /* Push to right within column */
	}

	.diagonal__image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		/* Subtle zoom on reveal */
		transform: scale(1.05);
		transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.diagonal.visible .diagonal__image-wrapper img {
		transform: scale(1);
	}

	/*
	 * Curtain reveal animation (top to bottom)
	 * Works with any image source including Unsplash
	 */
	.diagonal__curtain {
		position: absolute;
		inset: 0;
		background-color: var(--color-bg);
		z-index: 2;
		transform-origin: top;
		transform: scaleY(1);
		transition: transform 1s cubic-bezier(0.77, 0, 0.175, 1);
	}

	.diagonal.visible .diagonal__curtain {
		transform: scaleY(0);
		transform-origin: bottom;
	}

	/* Stagger the small image reveal */
	.diagonal__cell--small .diagonal__curtain {
		transition-delay: 200ms;
	}

	/* Caption styling with fade-in + slide-up animation */
	.diagonal__caption {
		margin-top: var(--space-3);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		/* Animation initial state */
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s,
			transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s;
	}

	.diagonal.visible .diagonal__caption {
		opacity: 1;
		transform: translateY(0);
	}

	/* Responsive: stack on mobile */
	@media (max-width: 768px) {
		.diagonal__grid {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto;
		}

		.diagonal__cell--large {
			grid-column: 1;
			grid-row: 1;
		}

		.diagonal__cell--small {
			grid-column: 1;
			grid-row: 2;
			justify-self: end;
		}

		.diagonal__cell--empty-top,
		.diagonal__cell--empty-bottom {
			display: none;
		}

		.diagonal__image-wrapper--small {
			max-width: 60%;
		}
	}
</style>
