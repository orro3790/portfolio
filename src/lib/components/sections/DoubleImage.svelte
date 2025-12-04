<script lang="ts">
	/**
	 * DoubleImage Section
	 * Two images side-by-side.
	 */
	import { inview } from '$lib/actions/inView';

	interface Props {
		images: [
			{ src: string; alt: string; caption?: string },
			{ src: string; alt: string; caption?: string }
		];
		/** Aspect ratio for images */
		aspectRatio?: string;
		/** Gap size */
		gap?: 'none' | 'small' | 'medium' | 'large';
	}

	let { images, aspectRatio = '4/3', gap = 'none' }: Props = $props();

	let visible = $state(false);
</script>

<section
	class="double-image"
	class:visible
	class:gap-none={gap === 'none'}
	class:gap-small={gap === 'small'}
	class:gap-medium={gap === 'medium'}
	class:gap-large={gap === 'large'}
	use:inview={{ threshold: 0.1 }}
	oninview={() => (visible = true)}
>
	<div class="double-image__container">
		{#each images as image, i}
			<div class="double-image__item" style="--delay: {i * 150}ms">
				<div class="double-image__wrapper" style="--aspect-ratio: {aspectRatio}">
					{#if image.src}
						<img src={image.src} alt={image.alt} loading="lazy" />
					{:else}
						<div class="placeholder">
							<span>Image {i + 1}</span>
						</div>
					{/if}
				</div>
				{#if image.caption}
					<p class="double-image__caption">{image.caption}</p>
				{/if}
			</div>
		{/each}
	</div>
</section>

<style>
	.double-image {
		width: 100%;
		overflow: hidden;
	}

	.double-image__container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		width: 100%;
	}

	/* Gaps */
	.double-image.gap-none .double-image__container {
		gap: 0;
	}
	.double-image.gap-small .double-image__container {
		gap: var(--space-4);
		padding: 0 var(--space-4);
	}
	.double-image.gap-medium .double-image__container {
		gap: var(--space-8);
		padding: 0 var(--space-6);
	}
	.double-image.gap-large .double-image__container {
		gap: var(--space-16);
		padding: 0 var(--space-6);
	}

	.double-image__wrapper {
		position: relative;
		width: 100%;
		aspect-ratio: var(--aspect-ratio);
		overflow: hidden;
		background-color: var(--color-bg-elevated);

		/* Reveal animation */
		clip-path: inset(100% 0 0 0);
		transition: clip-path 1.2s cubic-bezier(0.7, 0, 0.3, 1);
		transition-delay: var(--delay);
	}

	.double-image.visible .double-image__wrapper {
		clip-path: inset(0 0 0 0);
	}

	.double-image__wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(1.1);
		transition: transform 1.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.double-image.visible .double-image__wrapper img {
		transform: scale(1);
	}

	.placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-border);
		color: var(--color-text-muted);
		font-family: var(--font-display);
		font-size: var(--text-2xl);
	}

	@media (max-width: 768px) {
		.double-image__container {
			grid-template-columns: 1fr;
			gap: var(--space-4) !important;
			padding: 0 var(--space-4) !important;
		}
	}
</style>

