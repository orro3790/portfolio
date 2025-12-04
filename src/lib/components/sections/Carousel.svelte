<script lang="ts">
	/**
	 * Carousel Section — Horizontal scroll carousel with drag interaction.
	 * Based on project-layouts.md Carousel-3P specification:
	 * - Center image [b]: Fully visible, centered
	 * - Adjacent images [a] and [c]: Partially visible at edges (peek effect)
	 * - Drag to scroll interaction with custom cursor
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
		/** Aspect ratio for images (default: 3/4 for portrait-style) */
		aspectRatio?: string;
		/** Initial slide index (0-based, default: 2 for 3rd image) */
		initialIndex?: number;
	}

	let { images, aspectRatio = '3/4', initialIndex = 2 }: Props = $props();

	let visible = $state(false);
	let scrollContainer: HTMLDivElement | undefined = $state();
	let carouselElement: HTMLElement | undefined = $state();
	let activeIndex = $state(initialIndex);

	// Drag state
	let isDragging = $state(false);
	let startX = $state(0);
	let scrollLeft = $state(0);

	// Custom cursor state
	let isHovering = $state(false);
	let cursorX = $state(0);
	let cursorY = $state(0);

	// Calculate scroll position to center an item
	function scrollToIndex(index: number, smooth = true) {
		if (!scrollContainer) return;
		const items = scrollContainer.querySelectorAll('.carousel__item');
		const item = items[index] as HTMLElement;
		if (!item) return;

		const containerWidth = scrollContainer.offsetWidth;
		const itemLeft = item.offsetLeft;
		const itemWidth = item.offsetWidth;
		// Center the item in the viewport
		const scrollPos = itemLeft - (containerWidth - itemWidth) / 2;

		scrollContainer.scrollTo({ left: scrollPos, behavior: smooth ? 'smooth' : 'instant' });
		activeIndex = index;
	}

	// Handle scroll to update active index
	function handleScroll() {
		if (!scrollContainer || isDragging) return;
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

		activeIndex = closestIndex;
	}

	// Drag handlers
	function handleMouseDown(e: MouseEvent) {
		if (!scrollContainer) return;
		isDragging = true;
		startX = e.pageX - scrollContainer.offsetLeft;
		scrollLeft = scrollContainer.scrollLeft;
		scrollContainer.style.scrollBehavior = 'auto';
	}

	function handleMouseMove(e: MouseEvent) {
		// Update custom cursor position
		if (carouselElement) {
			const rect = carouselElement.getBoundingClientRect();
			cursorX = e.clientX - rect.left;
			cursorY = e.clientY - rect.top;
		}

		if (!isDragging || !scrollContainer) return;
		e.preventDefault();
		const x = e.pageX - scrollContainer.offsetLeft;
		const walk = (x - startX) * 1.5; // Multiply for faster scroll
		scrollContainer.scrollLeft = scrollLeft - walk;
	}

	function handleMouseUp() {
		if (!scrollContainer) return;
		isDragging = false;
		scrollContainer.style.scrollBehavior = 'smooth';
		// Snap to nearest item
		handleScroll();
	}

	function handleMouseLeave() {
		isHovering = false;
		if (isDragging) {
			handleMouseUp();
		}
	}

	function handleMouseEnter() {
		isHovering = true;
	}

	// Touch handlers for mobile
	function handleTouchStart(e: TouchEvent) {
		if (!scrollContainer) return;
		isDragging = true;
		startX = e.touches[0].pageX - scrollContainer.offsetLeft;
		scrollLeft = scrollContainer.scrollLeft;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isDragging || !scrollContainer) return;
		const x = e.touches[0].pageX - scrollContainer.offsetLeft;
		const walk = (x - startX) * 1.5;
		scrollContainer.scrollLeft = scrollLeft - walk;
	}

	function handleTouchEnd() {
		isDragging = false;
		handleScroll();
	}

	// Auto-trigger visibility after mount
	$effect(() => {
		const timer = setTimeout(() => {
			if (!visible) visible = true;
		}, 300);
		return () => clearTimeout(timer);
	});

	// Center initial image on mount (start at photo 3 = index 2)
	$effect(() => {
		if (visible && scrollContainer) {
			// Delay to ensure layout is computed, use instant scroll for initial position
			setTimeout(() => scrollToIndex(initialIndex, false), 100);
		}
	});
</script>

<section
	class="carousel"
	class:visible
	class:hovering={isHovering}
	bind:this={carouselElement}
	use:inview={{ threshold: 0.1 }}
	oninview={() => (visible = true)}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	onmousemove={handleMouseMove}
>
	<div
		class="carousel__track"
		class:dragging={isDragging}
		bind:this={scrollContainer}
		onscroll={handleScroll}
		onmousedown={handleMouseDown}
		onmouseup={handleMouseUp}
		ontouchstart={handleTouchStart}
		ontouchmove={handleTouchMove}
		ontouchend={handleTouchEnd}
		role="group"
		aria-label="Image carousel - drag to scroll"
		aria-roledescription="carousel"
	>
		{#each images as image, i}
			<div
				class="carousel__item"
				class:active={activeIndex === i}
				style="--aspect-ratio: {aspectRatio}; --delay: {i * 80}ms"
			>
				<div class="carousel__image-wrapper">
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

	<!-- Custom cursor that follows mouse -->
	<div
		class="carousel__cursor"
		class:active={isHovering}
		class:dragging={isDragging}
		style="transform: translate({cursorX}px, {cursorY}px)"
		aria-hidden="true"
	>
		<span>{isDragging ? 'drag' : 'drag'}</span>
	</div>
</section>

<style>
	.carousel {
		padding: var(--space-16) 0;
		overflow: hidden;
		width: 100%;
		position: relative;
		/* Hide default cursor when hovering */
		cursor: none;
	}

	.carousel__track {
		display: flex;
		gap: var(--space-6);
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
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
		/* Hide cursor on track too */
		cursor: none;
		user-select: none;
	}

	.carousel__track::-webkit-scrollbar {
		display: none;
	}

	.carousel__item {
		/* Center item takes ~50% of viewport, adjacent items peek at edges */
		flex: 0 0 50%;
		min-width: 300px;
		max-width: 500px;
		scroll-snap-align: center;
		/* Initial state for animation */
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: var(--delay);
		/* Prevent image dragging */
		pointer-events: none;
	}

	.carousel.visible .carousel__item {
		opacity: 1;
		transform: translateY(0);
	}

	/* Dim non-active items slightly */
	.carousel.visible .carousel__item:not(.active) {
		opacity: 0.6;
	}

	.carousel.visible .carousel__item.active {
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
	.carousel__image-wrapper img:not([src='']):not([src*='placeholder']) + .carousel__placeholder {
		display: none;
	}

	.carousel__caption {
		margin-top: var(--space-3);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-align: center;
	}

	/* Custom cursor */
	.carousel__cursor {
		position: absolute;
		top: 0;
		left: 0;
		width: 80px;
		height: 80px;
		margin-left: -40px;
		margin-top: -40px;
		border-radius: 50%;
		border: 1px solid var(--color-text);
		background-color: transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		opacity: 0;
		transition:
			opacity 0.2s ease,
			transform 0.05s linear,
			background-color 0.2s ease,
			border-color 0.2s ease;
		z-index: 100;
		will-change: transform;
	}

	.carousel__cursor.active {
		opacity: 1;
	}

	.carousel__cursor.dragging {
		background-color: var(--color-text);
		border-color: var(--color-text);
	}

	.carousel__cursor.dragging span {
		color: var(--color-bg);
	}

	.carousel__cursor span {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text);
		transition: color 0.2s ease;
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

		/* Hide custom cursor on touch devices */
		.carousel {
			cursor: grab;
		}

		.carousel__track {
			cursor: grab;
		}

		.carousel__track.dragging {
			cursor: grabbing;
		}

		.carousel__cursor {
			display: none;
		}
	}
</style>
