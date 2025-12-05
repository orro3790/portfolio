<script lang="ts">
	/**
	 * @component VerticalCarousel
	 * Scroll-linked vertical carousel with two-column layout.
	 *
	 * Uses CSS sticky positioning + Lenis scroll events for buttery smooth animation.
	 * The section height creates scroll distance; progress through that distance
	 * drives the carousel rotation.
	 *
	 * Supports both images and videos via the Media type.
	 *
	 * Inspired by Lenis (https://lenis.darkroom.engineering/) scroll-linked carousel
	 */
	import { onMount } from 'svelte';
	import { inview } from '$lib/actions/inView';
	import { lenisStore } from '$lib/stores/lenis';
	import MediaItem from '$lib/components/primitives/MediaItem.svelte';
	import type { Media } from '$lib/schemas/project';

	// ─────────────────────────────────────────────────────────────────────────────
	// Animation Constants
	// ─────────────────────────────────────────────────────────────────────────────
	/** How quickly scale falls off with distance from center (0-1) */
	const SCALE_FALLOFF = 0.3;
	/** How quickly opacity falls off with distance from center (0-1) */
	const OPACITY_FALLOFF = 0.6;
	/** Speed multiplier for exit fade animation */
	const EXIT_FADE_SPEED = 20;
	/** Progress threshold (0-1) at which exit animation begins */
	const EXIT_THRESHOLD = 0.95;
	/** Minimum scale for distant media */
	const MIN_SCALE = 0.6;
	/** Minimum opacity for distant media */
	const MIN_OPACITY = 0.2;

	interface Props {
		/** Array of media items to display in the carousel */
		media: Media[];
		/** Heading text for left column */
		heading: string;
		/** Body text for left column */
		body: string;
		/** Optional eyebrow above heading */
		eyebrow?: string;
	}

	let { media, heading, body, eyebrow }: Props = $props();

	// Section reference for scroll calculations
	let sectionEl: HTMLElement | undefined = $state();

	// Visibility state for curtain reveal
	let visible = $state(false);

	// Scroll progress through the section (0 to 1)
	let progress = $state(0);

	// Number of media items
	const totalMedia = $derived(media.length);

	// Whether we've completed the carousel (exiting) - uses writable $derived
	const isExiting = $derived(progress >= EXIT_THRESHOLD);

	// Current active media index derived from smooth progress
	const activeIndex = $derived.by(() => {
		if (totalMedia === 0) return 0;
		const rawIndex = progress * (totalMedia - 1);
		return Math.round(rawIndex);
	});

	/**
	 * Calculate scroll progress through this section.
	 * Progress = 0 when section top reaches viewport bottom
	 * Progress = 1 when section bottom reaches viewport top
	 */
	function updateProgress() {
		if (!sectionEl) return;

		const rect = sectionEl.getBoundingClientRect();
		const viewportHeight = window.innerHeight;

		// Section starts becoming visible when top < viewport height
		// Section is fully scrolled past when bottom < 0
		// We want progress during the "middle" - when sticky content is pinned

		// The sticky container is pinned when:
		// - Section top <= 0 (section has scrolled to/past top)
		// - Section bottom >= viewportHeight (haven't scrolled past yet)

		// Total scroll distance = section height - viewport height
		// This is how much we scroll while the sticky content is pinned
		const sectionHeight = sectionEl.offsetHeight;
		const scrollDistance = sectionHeight - viewportHeight;

		if (scrollDistance <= 0) {
			progress = 0;
			return;
		}

		// How far the section top has scrolled past viewport top
		const scrolled = -rect.top;

		// Normalize to 0-1
		const rawProgress = scrolled / scrollDistance;
		progress = Math.max(0, Math.min(1, rawProgress));
	}

	// Subscribe to Lenis scroll events for smooth updates
	onMount(() => {
		const unsubscribe = lenisStore.subscribe((lenis) => {
			if (!lenis) return;

			// Listen to Lenis scroll events
			const handleScroll = () => {
				updateProgress();
			};

			lenis.on('scroll', handleScroll);

			// Initial calculation
			updateProgress();

			return () => {
				lenis.off('scroll', handleScroll);
			};
		});

		return unsubscribe;
	});

	/**
	 * Calculate transform styles for each media item based on scroll progress.
	 * Uses smooth continuous progress for fluid animation.
	 */
	function getMediaStyle(index: number): string {
		// Calculate continuous position based on smooth progress
		const smoothIndex = progress * (totalMedia - 1);
		const distance = index - smoothIndex;
		const absDistance = Math.abs(distance);

		// Scale: center = 1, decreases with distance
		const scale = Math.max(MIN_SCALE, 1 - absDistance * SCALE_FALLOFF);

		// Y offset: percentage-based vertical positioning
		const yOffset = distance * 100;

		// Opacity: center = 1, fade with distance
		let opacity = Math.max(MIN_OPACITY, 1 - absDistance * OPACITY_FALLOFF);

		// Fade out non-active media when exiting
		if (isExiting && index !== activeIndex) {
			opacity = Math.max(0, opacity - (progress - EXIT_THRESHOLD) * EXIT_FADE_SPEED);
		}

		// Z-index: center on top
		const zIndex = 10 - Math.floor(absDistance);

		return `
			--scale: ${scale};
			--y-offset: ${yOffset}%;
			--opacity: ${opacity};
			--z-index: ${zIndex};
		`;
	}

	// Split body into paragraphs
	const paragraphs = $derived(body.split('\n\n').filter((p) => p.trim()));
</script>

<section
	class="vertical-carousel"
	class:visible
	class:exiting={isExiting}
	bind:this={sectionEl}
	use:inview={{ threshold: 0.05 }}
	oninview={() => (visible = true)}
>
	<!-- Sticky container stays pinned while section scrolls -->
	<div class="vertical-carousel__sticky">
		<div class="vertical-carousel__container">
			<!-- Left column: text content -->
			<div class="vertical-carousel__text-col">
				{#if eyebrow}
					<span class="vertical-carousel__eyebrow">{eyebrow}</span>
				{/if}
				<h2 class="vertical-carousel__heading">{heading}</h2>
				<div class="vertical-carousel__body">
					{#each paragraphs as paragraph, i (i)}
						<p style="--delay: {i * 100}ms">{paragraph}</p>
					{/each}
				</div>

				<!-- Progress bar -->
				<div class="vertical-carousel__progress-bar" aria-hidden="true">
					<div class="vertical-carousel__progress-fill" style="--progress: {progress}"></div>
				</div>
			</div>

			<!-- Right column: vertical carousel -->
			<div class="vertical-carousel__carousel-col">
				<div class="vertical-carousel__stack">
					{#each media as item, i (item.src)}
						<div
							class="vertical-carousel__item"
							class:active={activeIndex === i}
							style={getMediaStyle(i)}
						>
							<div class="vertical-carousel__media-wrapper">
								<!-- Curtain reveal overlay -->
								<div
									class="vertical-carousel__curtain"
									style="--curtain-delay: {i * 80}ms"
									aria-hidden="true"
								></div>
								<MediaItem
									media={item}
									class="vertical-carousel__media"
									loading="lazy"
									draggable={false}
								/>
							</div>
						</div>
					{/each}
				</div>

				<!-- Screen reader announcement (visual progress bar already indicates position) -->
				<div class="sr-only" aria-live="polite" aria-atomic="true">
					Item {activeIndex + 1} of {totalMedia}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.vertical-carousel {
		/*
		 * Section height = viewport + extra scroll distance.
		 * The extra height creates scroll "runway" for the animation.
		 * 6 items × ~50vh per item transition = 300vh total, minus 100vh for the sticky = 200vh extra
		 */
		min-height: 300vh;
		position: relative;
	}

	/* Sticky container stays pinned while section scrolls through */
	.vertical-carousel__sticky {
		position: sticky;
		top: 0;
		height: 100vh;
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.vertical-carousel__container {
		width: 100%;
		max-width: var(--max-width);
		margin: 0 auto;
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
		padding: var(--space-16) var(--space-6);
		align-items: center;
	}

	@media (min-width: 768px) {
		.vertical-carousel__container {
			grid-template-columns: 1fr 1fr;
			gap: var(--space-16);
		}
	}

	/* Text column */
	.vertical-carousel__text-col {
		opacity: 0;
		transform: translateX(-40px);
		transition:
			opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
			transform 1s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.vertical-carousel.visible .vertical-carousel__text-col {
		opacity: 1;
		transform: translateX(0);
	}

	.vertical-carousel__eyebrow {
		display: block;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-muted);
		margin-bottom: var(--space-3);
	}

	.vertical-carousel__heading {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 4vw, 3rem);
		font-weight: 400;
		line-height: 1.2;
		color: var(--color-text);
		margin: 0 0 var(--space-6);
	}

	.vertical-carousel__body p {
		font-family: var(--font-body);
		font-size: var(--text-base);
		line-height: 1.7;
		color: var(--color-text-muted);
		margin: 0 0 var(--space-4);
	}

	.vertical-carousel__body p:last-child {
		margin-bottom: 0;
	}

	/* Progress bar */
	.vertical-carousel__progress-bar {
		margin-top: var(--space-8);
		height: 2px;
		background-color: var(--color-border);
		border-radius: 1px;
		overflow: hidden;
	}

	.vertical-carousel__progress-fill {
		height: 100%;
		background-color: var(--color-text);
		transform-origin: left;
		transform: scaleX(var(--progress, 0));
		transition: transform 0.05s linear;
	}

	/* Carousel column */
	.vertical-carousel__carousel-col {
		position: relative;
		height: 70vh;
		max-height: 550px;
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transform: translateX(40px);
		transition:
			opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s,
			transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
	}

	.vertical-carousel.visible .vertical-carousel__carousel-col {
		opacity: 1;
		transform: translateX(0);
	}

	/* Media stack container */
	.vertical-carousel__stack {
		position: relative;
		width: 100%;
		max-width: 350px;
		aspect-ratio: 3 / 4;
	}

	/* Individual carousel item */
	.vertical-carousel__item {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transform: translateY(var(--y-offset, 0)) scale(var(--scale, 1));
		opacity: var(--opacity, 1);
		z-index: var(--z-index, 1);
		/* No transition - driven directly by Lenis scroll for buttery smoothness */
		will-change: transform, opacity;
		pointer-events: none;
	}

	.vertical-carousel__media-wrapper {
		position: relative;
		width: 100%;
		aspect-ratio: 3 / 4;
		overflow: hidden;
		background-color: var(--color-bg-elevated);
		border-radius: 4px;
		box-shadow: 0 25px 50px -15px rgba(0, 0, 0, 0.35);
	}

	.vertical-carousel__media-wrapper :global(.vertical-carousel__media) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		pointer-events: none;
		/* Initial zoomed state for reveal animation */
		transform: scale(1.1);
		transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* Zoom out as curtain reveals */
	.vertical-carousel.visible .vertical-carousel__media-wrapper :global(.vertical-carousel__media) {
		transform: scale(1);
	}

	/* Curtain reveal overlay */
	.vertical-carousel__curtain {
		position: absolute;
		inset: 0;
		background-color: var(--color-bg);
		z-index: 2;
		transform-origin: top;
		transform: scaleY(1);
		transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1);
		transition-delay: var(--curtain-delay, 0ms);
	}

	/* Curtain slides away when visible */
	.vertical-carousel.visible .vertical-carousel__curtain {
		transform: scaleY(0);
		transform-origin: bottom;
	}

	/* Counter */
	/* Screen reader only */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.vertical-carousel {
			min-height: 250vh;
		}

		.vertical-carousel__container {
			padding: var(--space-8) var(--space-4);
		}

		.vertical-carousel__carousel-col {
			height: 50vh;
			max-height: 400px;
		}

		.vertical-carousel__stack {
			max-width: 260px;
		}
	}
</style>
