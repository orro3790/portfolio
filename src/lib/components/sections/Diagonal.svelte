<script lang="ts">
	/**
	 * Diagonal Section — Staggered diagonal media arrangement using flex rows.
	 *
	 * Supports both images and videos via the Media type.
	 *
	 * Layout (like Metalab's TextAnd2Images):
	 * ┌────────────────────────────────────────┐
	 * │ ┌─────────────────────┐                │  ← Row 1: Large media, flex-start
	 * │ │      LARGE          │                │
	 * │ └─────────────────────┘                │
	 * │                ┌─────────────┐         │  ← Row 2: Small media, flex-end
	 * │                │    SMALL    │         │     (overlaps via negative margin)
	 * │                └─────────────┘         │
	 * └────────────────────────────────────────┘
	 *
	 * Flex rows give more control over stagger positioning than CSS grid.
	 */
	import { inview } from '$lib/actions/inView';
	import MediaItem from '$lib/components/primitives/MediaItem.svelte';
	import type { Media } from '$lib/schemas/project';

	interface Props {
		/** Large media (top-left) */
		mediaLarge: Media;
		/** Small media (bottom-right, staggered) */
		mediaSmall: Media;
		/** How much the small media overlaps/staggers up (default: 15%) */
		staggerAmount?: string;
	}

	let { mediaLarge, mediaSmall, staggerAmount = '15%' }: Props = $props();

	let visible = $state(false);
</script>

<section
	class="diagonal"
	class:visible
	use:inview={{ threshold: 0.15 }}
	oninview={() => (visible = true)}
>
	<!-- Row 1: Large media aligned left -->
	<div class="diagonal__row diagonal__row--large">
		<div class="diagonal__media-container diagonal__media-container--large">
			<div class="diagonal__media-wrapper">
				<div class="diagonal__curtain"></div>
				<MediaItem media={mediaLarge} class="diagonal__media" loading="lazy" />
			</div>
			{#if mediaLarge.caption}
				<p class="diagonal__caption">{mediaLarge.caption}</p>
			{/if}
		</div>
	</div>

	<!-- Row 2: Small media aligned right with stagger overlap -->
	<div class="diagonal__row diagonal__row--small" style="--stagger: -{staggerAmount}">
		<div class="diagonal__media-container diagonal__media-container--small">
			<div class="diagonal__media-wrapper">
				<div class="diagonal__curtain diagonal__curtain--delayed"></div>
				<MediaItem media={mediaSmall} class="diagonal__media" loading="lazy" />
			</div>
			{#if mediaSmall.caption}
				<p class="diagonal__caption">{mediaSmall.caption}</p>
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

	/* Media containers control widths */
	.diagonal__media-container {
		position: relative;
	}

	.diagonal__media-container--large {
		width: 65%;
	}

	.diagonal__media-container--small {
		width: 45%;
	}

	/* Media wrapper with aspect ratio */
	.diagonal__media-wrapper {
		position: relative;
		overflow: hidden;
		background-color: var(--color-bg-elevated);
		border-radius: 4px;
		aspect-ratio: 3 / 2;
	}

	.diagonal__media-wrapper :global(.diagonal__media) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(1.05);
		transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.diagonal.visible .diagonal__media-wrapper :global(.diagonal__media) {
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
