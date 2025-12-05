<script lang="ts">
	/**
	 * FullBleedImage Section
	 * Edge-to-edge media (image or video) with curtain reveal animation on scroll.
	 */
	import { inview } from '$lib/actions/inView';
	import MediaItem from '$lib/components/primitives/MediaItem.svelte';
	import type { Media } from '$lib/schemas/project';

	interface Props {
		/** Media object (image or video) */
		media: Media;
		/** Optional caption below media */
		caption?: string;
		/** Aspect ratio (e.g., '16/9', '4/3', 'auto') */
		aspectRatio?: string;
		/** Reveal direction */
		revealFrom?: 'left' | 'right' | 'bottom';
	}

	let { media, caption, aspectRatio = '16/9', revealFrom = 'bottom' }: Props = $props();

	let visible = $state(false);
</script>

<section
	class="full-bleed"
	class:visible
	class:reveal-left={revealFrom === 'left'}
	class:reveal-right={revealFrom === 'right'}
	class:reveal-bottom={revealFrom === 'bottom'}
	use:inview={{ threshold: 0.1, rootMargin: '0px 0px -10% 0px' }}
	oninview={() => (visible = true)}
>
	<div class="full-bleed__wrapper" style="--aspect-ratio: {aspectRatio}">
		<MediaItem {media} class="full-bleed__media" loading="lazy" />
	</div>
	{#if caption}
		<p class="full-bleed__caption">{caption}</p>
	{/if}
</section>

<style>
	.full-bleed {
		width: 100%;
		padding: var(--space-8) var(--gutter);
	}

	.full-bleed__wrapper {
		position: relative;
		width: 100%;
		aspect-ratio: var(--aspect-ratio, 16/9);
		overflow: hidden;

		/* Curtain reveal initial state */
		clip-path: inset(100% 0 0 0);
		transition: clip-path 1.2s cubic-bezier(0.7, 0, 0.3, 1);
	}

	/* Reveal directions */
	.full-bleed.reveal-left .full-bleed__wrapper {
		clip-path: inset(0 100% 0 0);
	}

	.full-bleed.reveal-right .full-bleed__wrapper {
		clip-path: inset(0 0 0 100%);
	}

	.full-bleed.reveal-bottom .full-bleed__wrapper {
		clip-path: inset(100% 0 0 0);
	}

	/* Visible state - all directions reveal to full */
	.full-bleed.visible .full-bleed__wrapper {
		clip-path: inset(0 0 0 0);
	}

	.full-bleed :global(.full-bleed__media) {
		width: 100%;
		height: 100%;
		object-fit: cover;

		/* Subtle scale animation during reveal */
		transform: scale(1.1);
		transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.full-bleed.visible :global(.full-bleed__media) {
		transform: scale(1);
	}

	.full-bleed__caption {
		max-width: var(--max-width);
		margin: var(--space-4) auto 0;
		padding: 0 var(--space-6);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text-muted);

		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s,
			transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.8s;
	}

	.full-bleed.visible .full-bleed__caption {
		opacity: 1;
		transform: translateY(0);
	}
</style>
