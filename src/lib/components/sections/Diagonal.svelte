<script lang="ts">
	/**
	 * Diagonal Section — Staggered diagonal image arrangement using flex rows.
	 *
	 * Layout (like Metalab's TextAnd2Images):
	 * ┌────────────────────────────────────────┐
	 * │ ┌─────────────────────┐                │  ← Row 1: Large image, flex-start
	 * │ │      LARGE          │                │
	 * │ └─────────────────────┘                │
	 * │                ┌─────────────┐         │  ← Row 2: Small image, flex-end
	 * │                │    SMALL    │         │     (overlaps via negative margin)
	 * │                └─────────────┘         │
	 * └────────────────────────────────────────┘
	 *
	 * Flex rows give more control over stagger positioning than CSS grid.
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
		/** Small image (bottom-right, staggered) */
		imageSmall: ImageData;
		/** How much the small image overlaps/staggers up (default: 15%) */
		staggerAmount?: string;
	}

	let { imageLarge, imageSmall, staggerAmount = '15%' }: Props = $props();

	let visible = $state(false);
</script>

<section
	class="diagonal"
	class:visible
	use:inview={{ threshold: 0.15 }}
	oninview={() => (visible = true)}
>
	<!-- Row 1: Large image aligned left -->
	<div class="diagonal__row diagonal__row--large">
		<div class="diagonal__media-container diagonal__media-container--large">
			<div class="diagonal__image-wrapper">
				<div class="diagonal__curtain"></div>
				<img src={imageLarge.src} alt={imageLarge.alt} loading="lazy" />
			</div>
			{#if imageLarge.caption}
				<p class="diagonal__caption">{imageLarge.caption}</p>
			{/if}
		</div>
	</div>

	<!-- Row 2: Small image aligned right with stagger overlap -->
	<div class="diagonal__row diagonal__row--small" style="--stagger: -{staggerAmount}">
		<div class="diagonal__media-container diagonal__media-container--small">
			<div class="diagonal__image-wrapper">
				<div class="diagonal__curtain diagonal__curtain--delayed"></div>
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
		padding: var(--space-8) var(--gutter);
		display: flex;
		flex-direction: column;
		gap: var(--gutter);
	}

	/* Flex rows for positioning control */
	.diagonal__row {
		display: flex;
		width: 100%;
	}

	.diagonal__row--large {
		justify-content: flex-start;
	}

	.diagonal__row--small {
		justify-content: flex-end;
	}

	/* Media containers control image widths */
	.diagonal__media-container {
		position: relative;
	}

	.diagonal__media-container--large {
		width: 65%;
	}

	.diagonal__media-container--small {
		width: 45%;
	}

	/* Image wrapper with aspect ratio */
	.diagonal__image-wrapper {
		position: relative;
		overflow: hidden;
		background-color: var(--color-bg-elevated);
		border-radius: 4px;
		aspect-ratio: 3 / 2;
	}

	.diagonal__image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(1.05);
		transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.diagonal.visible .diagonal__image-wrapper img {
		transform: scale(1);
	}

	/* Curtain reveal animation */
	.diagonal__curtain {
		position: absolute;
		inset: 0;
		background-color: var(--color-bg);
		z-index: 2;
		transform-origin: top;
		transform: scaleY(1);
		transition: transform 1s cubic-bezier(0.77, 0, 0.175, 1);
	}

	.diagonal__curtain--delayed {
		transition-delay: 200ms;
	}

	.diagonal.visible .diagonal__curtain {
		transform: scaleY(0);
		transform-origin: bottom;
	}

	/* Caption styling */
	.diagonal__caption {
		margin-top: var(--space-3);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
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
		.diagonal__row--small {
			margin-top: var(--space-4);
		}

		.diagonal__media-container--large {
			width: 100%;
		}

		.diagonal__media-container--small {
			width: 70%;
		}
	}
</style>
