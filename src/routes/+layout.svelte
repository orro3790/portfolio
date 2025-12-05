<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import ProjectNav from '$lib/components/ProjectNav.svelte';
	import PreviewBanner from '$lib/components/PreviewBanner.svelte';
	import {onNavigate, afterNavigate} from '$app/navigation';
	import {onMount} from 'svelte';
	import Lenis from 'lenis';
	import {lenisStore} from '$lib/stores/lenis';
	import {getImageUrl} from '$lib/sanity/imageUrl';
	import type {SanityNavItem} from '$lib/sanity/types';

	let {children, data} = $props();

	/** Site title from CMS or fallback */
	const siteTitle = data.siteSettings?.siteTitle || 'Portfolio';

	/**
	 * Transform Sanity nav items to the format expected by ProjectNav.
	 */
	function transformNavItems(items: SanityNavItem[]) {
		return items.map((item) => ({
			title: item.title,
			slug: item.slug,
			previewImage: getImageUrl(item.previewImage, {width: 600}),
			backgroundImage: item.backgroundImage
				? getImageUrl(item.backgroundImage, {width: 1200})
				: undefined,
			accentColor: item.accentColor,
			/** Animation template at top level for ProjectNav */
			animationTemplate: item.animationTemplate || 'layers',
			preview: {
				description: item.previewDescription || '',
				tags: item.previewTags || [],
			},
		}));
	}

	/** Navigation items transformed for ProjectNav component */
	let navItemsWithPreview = $derived(data.navigation ? transformNavItems(data.navigation) : []);

	let lenis: Lenis | null = $state(null);

	// Initialize Lenis smooth scrolling
	onMount(() => {
		lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo easing
			orientation: 'vertical',
			gestureOrientation: 'vertical',
			smoothWheel: true,
			touchMultiplier: 2
		});

		// Expose Lenis instance via store for scroll-linked components
		lenisStore.set(lenis);

		function raf(time: number) {
			lenis?.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			// Clear store first to prevent components from using destroyed instance
			lenisStore.set(null);
			lenis?.destroy();
			lenis = null;
		};
	});

	// Enable View Transitions API for smooth page transitions
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			// Stop Lenis smooth scrolling during view transition to prevent interference
			lenis?.stop();

			// Reset scroll BEFORE the view transition starts (synchronously)
			// This ensures the "after" snapshot captures the page at scroll position 0
			window.scrollTo(0, 0);

			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	// Resume Lenis after navigation completes
	afterNavigate(() => {
		// Small delay to let view transition finish, then resume Lenis
		requestAnimationFrame(() => {
			lenis?.start();
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{siteTitle}</title>
	<meta name="description" content="Art portfolio showcasing creative works" />
</svelte:head>

<div class="app">
	<Header />
	<ProjectNav items={navItemsWithPreview} />

	<main class="main">
		{@render children()}
	</main>

	{#if data.isPreview}
		<PreviewBanner />
	{/if}
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.main {
		flex: 1;
		padding-top: var(--header-height);
	}
</style>
