<script lang="ts">
	/**
	 * @component Carousel
	 * Horizontal scroll carousel with drag/swipe interaction and peek effect.
	 *
	 * Features:
	 * - Center-focused layout with adjacent images partially visible
	 * - Mouse drag and touch swipe support
	 * - Smooth eased scrolling (Lenis-style expo easing)
	 * - Curtain reveal animation with staggered timing
	 *
	 * @example
	 * ```svelte
	 * <Carousel
	 *   images={[
	 *     { src: '/image1.jpg', alt: 'First image', caption: 'Optional caption' },
	 *     { src: '/image2.jpg', alt: 'Second image' }
	 *   ]}
	 *   initialIndex={1}
	 *   aspectRatio="4/3"
	 * />
	 * ```
	 */
	import { inview } from '$lib/actions/inView';

	interface CarouselImage {
		src: string;
		alt: string;
		caption?: string;
	}

	interface Props {
		/** Array of images to display in the carousel */
		images: CarouselImage[];
		/** CSS aspect ratio for images (default: '3/4' for portrait-style) */
		aspectRatio?: string;
		/** Initial slide index to center on (0-based, default: 2) */
		initialIndex?: number;
	}

	let { images, aspectRatio = '3/4', initialIndex = 2 }: Props = $props();

	let visible = $state(false);
	let scrollContainer: HTMLDivElement | undefined = $state();
	// Track which slide is currently centered (updated by scroll/drag).
	let activeIndex = $state(getInitialIndex());

	/** Returns validated initial index within bounds */
	function getInitialIndex(): number {
		return Math.max(0, Math.min(initialIndex, images.length - 1));
	}

	// Drag state
	let isDragging = $state(false);
	let startX = $state(0);
	let scrollLeft = $state(0);

	// Animation state for smooth scrolling
	let animationId: number | null = null;

	/** Expo easing out (same as Lenis) - creates smooth deceleration */
	function easeOutExpo(t: number): number {
		return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
	}

	/**
	 * Smoothly animates scroll to target position using RAF and expo easing.
	 * @param targetScroll - Target scroll position
	 * @param duration - Animation duration in ms (default: 800)
	 */
	function smoothScrollTo(targetScroll: number, duration = 800) {
		if (!scrollContainer) return;

		// Cancel any ongoing animation
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
		}

		const startScroll = scrollContainer.scrollLeft;
		const distance = targetScroll - startScroll;
		const startTime = performance.now();

		function animate(currentTime: number) {
			if (!scrollContainer) return;

			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easedProgress = easeOutExpo(progress);

			scrollContainer.scrollLeft = startScroll + distance * easedProgress;

			if (progress < 1) {
				animationId = requestAnimationFrame(animate);
			} else {
				animationId = null;
			}
		}

		animationId = requestAnimationFrame(animate);
	}

	/**
	 * Finds the index of the carousel item closest to the viewport center.
	 * @returns Index of the closest item, or 0 if container is unavailable
	 */
	function findClosestIndex(): number {
		if (!scrollContainer) return 0;
		const items = scrollContainer.querySelectorAll('.carousel__item');
		const containerCenter = scrollContainer.scrollLeft + scrollContainer.offsetWidth / 2;

		let closestIndex = 0;
		let closestDistance = Infinity;

		items.forEach((item, i) => {
			const el = item as HTMLElement;
			const itemCenter = el.offsetLeft + el.offsetWidth / 2;
			const distance = Math.abs(containerCenter - itemCenter);
			if (distance < closestDistance) {
				closestDistance = distance;
				closestIndex = i;
			}
		});

		return closestIndex;
	}

	/**
	 * Calculates the scroll position to center an item.
	 * @param index - Index of the item
	 * @returns Scroll position, or null if invalid
	 */
	function getScrollPositionForIndex(index: number): number | null {
		if (!scrollContainer) return null;
		const items = scrollContainer.querySelectorAll('.carousel__item');
		const item = items[index] as HTMLElement;
		if (!item) return null;

		const containerWidth = scrollContainer.offsetWidth;
		const itemLeft = item.offsetLeft;
		const itemWidth = item.offsetWidth;
		return itemLeft - (containerWidth - itemWidth) / 2;
	}

	/**
	 * Scrolls to center a specific item in the viewport.
	 * @param index - Index of the item to scroll to
	 * @param animated - Whether to animate the scroll (default: true)
	 */
	function scrollToIndex(index: number, animated = true) {
		const scrollPos = getScrollPositionForIndex(index);
		if (scrollPos === null || !scrollContainer) return;

		if (animated) {
			smoothScrollTo(scrollPos);
		} else {
			scrollContainer.scrollLeft = scrollPos;
		}
		activeIndex = index;
	}

	/** Updates activeIndex based on scroll position (skipped while dragging/animating) */
	function handleScroll() {
		if (!scrollContainer || isDragging || animationId !== null) return;
		activeIndex = findClosestIndex();
	}

	// --- Mouse drag handlers ---
	function handleMouseDown(e: MouseEvent) {
		if (!scrollContainer) return;
		// Cancel any ongoing smooth scroll
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
		isDragging = true;
		startX = e.pageX - scrollContainer.offsetLeft;
		scrollLeft = scrollContainer.scrollLeft;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!isDragging || !scrollContainer) return;
		e.preventDefault();
		const x = e.pageX - scrollContainer.offsetLeft;
		const walk = (x - startX) * 2;
		scrollContainer.scrollLeft = scrollLeft - walk;
	}

	function handleMouseUp() {
		if (!scrollContainer || !isDragging) return;
		isDragging = false;
		// Snap to nearest with smooth animation
		scrollToIndex(findClosestIndex(), true);
	}

	function handleMouseLeave() {
		if (isDragging) handleMouseUp();
	}

	// --- Touch handlers ---
	function handleTouchStart(e: TouchEvent) {
		if (!scrollContainer) return;
		// Cancel any ongoing smooth scroll
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
		isDragging = true;
		startX = e.touches[0].pageX - scrollContainer.offsetLeft;
		scrollLeft = scrollContainer.scrollLeft;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isDragging || !scrollContainer) return;
		const x = e.touches[0].pageX - scrollContainer.offsetLeft;
		const walk = (x - startX) * 2;
		scrollContainer.scrollLeft = scrollLeft - walk;
	}

	function handleTouchEnd() {
		if (!scrollContainer || !isDragging) return;
		isDragging = false;
		// Snap to nearest with smooth animation
		scrollToIndex(findClosestIndex(), true);
	}

	// Center initial image once visible and container is ready
	$effect(() => {
		if (visible && scrollContainer) {
			// Use RAF to ensure layout is computed before positioning
			requestAnimationFrame(() => {
				scrollToIndex(initialIndex, false);
			});
		}
	});

	// Cleanup animation on unmount
	$effect(() => {
		return () => {
			if (animationId !== null) {
				cancelAnimationFrame(animationId);
			}
		};
	});
</script>

<section
	class="carousel"
	class:visible
	use:inview={{ threshold: 0.1 }}
	oninview={() => (visible = true)}
	aria-label="Image gallery"
>
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="carousel__track"
		class:dragging={isDragging}
		bind:this={scrollContainer}
		onscroll={handleScroll}
		onmousedown={handleMouseDown}
		onmousemove={handleMouseMove}
		onmouseup={handleMouseUp}
		onmouseleave={handleMouseLeave}
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
		role="group"
		aria-label="Image carousel - drag to scroll"
		aria-roledescription="carousel"
	>
		{#each images as image, i (image.src)}
			<div
				class="carousel__item"
				class:active={activeIndex === i}
				style="--aspect-ratio: {aspectRatio}; --curtain-delay: {i * 120}ms"
			>
				<div class="carousel__image-wrapper">
					<!-- Curtain reveal overlay -->
					<div class="carousel__curtain" aria-hidden="true"></div>
					<img src={image.src} alt={image.alt} loading="lazy" draggable="false" />
					<!-- Placeholder for missing images -->
					<div class="carousel__placeholder" aria-hidden="true">
						<span>{i + 1}</span>
					</div>
				</div>
				{#if image.caption}
					<p class="carousel__caption">{image.caption}</p>
				{/if}
			</div>
		{/each}
	</div>
</section>

<style>
	.carousel {
		padding: var(--space-12) 0;
		overflow: hidden;
		width: 100%;
		position: relative;
		cursor: grab;
	}

	.carousel:active {
		cursor: grabbing;
	}

	.carousel__track {
		display: flex;
		gap: var(--space-24);
		overflow-x: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
		/* 
		 * Peek effect padding:
		 * Center item is ~50% of viewport width
		 * Padding = (100% - 50%) / 2 = 25% each side
		 * Adjacent items peek ~10-15% from edges
		 */
		padding-left: 25%;
		padding-right: 25%;
		cursor: grab;
		user-select: none;
	}

	.carousel__track.dragging {
		cursor: grabbing;
	}

	.carousel__track::-webkit-scrollbar {
		display: none;
	}

	.carousel__item {
		/* Center item takes ~50% of viewport, adjacent items peek at edges */
		flex: 0 0 50%;
		min-width: 300px;
		max-width: 500px;
		/* Dim non-active items */
		opacity: 0.6;
		transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		pointer-events: none;
	}

	.carousel__item.active {
		opacity: 1;
	}

	.carousel__image-wrapper {
		position: relative;
		aspect-ratio: var(--aspect-ratio, 3/4);
		overflow: hidden;
		background-color: var(--color-bg-elevated);
		border-radius: 4px;
		transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* Slight scale on active item */
	.carousel__item.active .carousel__image-wrapper {
		transform: scale(1.02);
	}

	.carousel__image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		pointer-events: none;
		-webkit-user-drag: none;
		/* Initial zoomed state for reveal animation */
		transform: scale(1.1);
		transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: var(--curtain-delay);
	}

	/* Subtle zoom-out as curtain reveals */
	.carousel.visible .carousel__image-wrapper img {
		transform: scale(1);
	}

	/* Curtain reveal overlay */
	.carousel__curtain {
		position: absolute;
		inset: 0;
		background-color: var(--color-bg);
		z-index: 2;
		transform-origin: top;
		transform: scaleY(1);
		transition: transform 1s cubic-bezier(0.77, 0, 0.175, 1);
		transition-delay: var(--curtain-delay);
	}

	/* Curtain slides away when visible */
	.carousel.visible .carousel__curtain {
		transform: scaleY(0);
		transform-origin: bottom;
	}

	/* Placeholder for missing images */
	.carousel__placeholder {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-border) 100%);
	}

	.carousel__placeholder span {
		font-family: var(--font-display);
		font-size: var(--text-4xl);
		font-weight: 300;
		color: var(--color-text-muted);
		opacity: 0.3;
	}

	/* Hide placeholder when image loads */
	.carousel__image-wrapper img:not([src='']):not([src*='placeholder']) ~ .carousel__placeholder {
		display: none;
	}

	.carousel__caption {
		margin-top: var(--space-3);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-align: center;
		/* Fade in after curtain reveals */
		opacity: 0;
		transform: translateY(12px);
		transition:
			opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: calc(var(--curtain-delay) + 0.6s);
	}

	.carousel.visible .carousel__caption {
		opacity: 1;
		transform: translateY(0);
	}

	/* Responsive adjustments */
	@media (max-width: 1024px) {
		.carousel__item {
			flex: 0 0 60%;
			min-width: 280px;
			max-width: 450px;
		}

		.carousel__track {
			padding-left: 20%;
			padding-right: 20%;
		}
	}

	@media (max-width: 768px) {
		.carousel__item {
			flex: 0 0 75%;
			min-width: 260px;
			max-width: 360px;
		}

		.carousel__track {
			padding-left: 12.5%;
			padding-right: 12.5%;
			gap: var(--space-4);
		}
	}
</style>
