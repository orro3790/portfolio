<script lang="ts">
	/**
	 * @component MediaItem
	 * Unified media renderer for images and videos.
	 *
	 * Renders an `<img>` for image media or a `<video>` for video media.
	 * Videos autoplay, loop, and are muted by default (background video behavior).
	 *
	 * @example
	 * ```svelte
	 * <MediaItem
	 *   media={{ type: 'image', src: '/photo.jpg', alt: 'Description' }}
	 *   class="my-image"
	 * />
	 *
	 * <MediaItem
	 *   media={{ type: 'video', src: '/clip.mp4', alt: 'Video description' }}
	 *   class="my-video"
	 * />
	 * ```
	 */
	import type { Media } from '$lib/schemas/project';

	interface Props {
		/** Media object containing type, src, and optional alt/caption */
		media: Media;
		/** Whether to lazy load (default: true) */
		loading?: 'lazy' | 'eager';
		/** Whether the media is draggable (default: false) */
		draggable?: boolean;
		/** Additional CSS classes to apply */
		class?: string;
	}

	let { media, loading = 'lazy', draggable = false, class: className = '' }: Props = $props();

	/** Combines provided classes with base class */
	const classes = $derived(className);
</script>

{#if media.type === 'video'}
	<video
		src={media.src}
		class={classes}
		autoplay
		loop
		muted
		playsinline
		disablepictureinpicture
		aria-label={media.alt}
	>
		<track kind="captions" />
	</video>
{:else}
	<img src={media.src} alt={media.alt ?? ''} class={classes} {loading} {draggable} />
{/if}

<style>
	img,
	video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
