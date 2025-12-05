<script lang="ts">
	/**
	 * ImageGrid Section
	 * Responsive grid of media items (images/videos) with staggered fade-in animation.
	 */
	import { inview } from '$lib/actions/inView';
	import MediaItem from '$lib/components/primitives/MediaItem.svelte';
	import type { Media } from '$lib/schemas/project';

	interface Props {
		/** Array of media items to display */
		media: Media[];
		/** Number of columns (2, 3, or 4) */
		columns?: 2 | 3 | 4;
		/** Gap between media items */
		gap?: 'small' | 'medium' | 'large';
	}

	let { media, columns = 2, gap = 'medium' }: Props = $props();

	let visible = $state(false);
</script>

<section
	class="image-grid"
	class:visible
	class:gap-small={gap === 'small'}
	class:gap-medium={gap === 'medium'}
	class:gap-large={gap === 'large'}
	style="--columns: {columns}"
	use:inview={{ threshold: 0.1 }}
	oninview={() => (visible = true)}
>
	<div class="image-grid__container">
		{#each media as item, i (item.src)}
			<div class="image-grid__item" style="--delay: {i * 100}ms">
				<MediaItem media={item} class="image-grid__media" loading="lazy" />
			</div>
		{/each}
	</div>
</section>

<style>
	.image-grid {
		padding: var(--space-8) var(--gutter);
	}

	.image-grid__container {
		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		max-width: var(--max-width);
		margin: 0 auto;
	}

	/* Gap variations */
	.image-grid.gap-small .image-grid__container {
		gap: var(--space-2);
	}

	.image-grid.gap-medium .image-grid__container {
		gap: var(--space-4);
	}

	.image-grid.gap-large .image-grid__container {
		gap: var(--space-8);
	}

	/* Responsive columns */
	@media (max-width: 768px) {
		.image-grid__container {
			grid-template-columns: repeat(min(var(--columns), 2), 1fr);
		}
	}

	@media (max-width: 480px) {
		.image-grid__container {
			grid-template-columns: 1fr;
		}
	}

	.image-grid__item {
		overflow: hidden;
		border-radius: 4px;

		/* Staggered fade + scale animation */
		opacity: 0;
		transform: translateY(30px) scale(0.95);
		transition:
			opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: var(--delay);
	}

	.image-grid.visible .image-grid__item {
		opacity: 1;
		transform: translateY(0) scale(1);
	}

	.image-grid__item :global(.image-grid__media) {
		width: 100%;
		height: auto;
		display: block;
		transition: transform 0.4s ease;
	}

	.image-grid__item:hover :global(.image-grid__media) {
		transform: scale(1.03);
	}
</style>
