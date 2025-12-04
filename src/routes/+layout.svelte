<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import ProjectNav from '$lib/components/ProjectNav.svelte';
	import { navItemsWithPreview } from '$lib/data/projects';
	import { onNavigate, afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';

	let { children } = $props();

	// Artist name - replace with actual name
	const artistName = 'Portfolio';

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

		function raf(time: number) {
			lenis?.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenis?.destroy();
			lenis = null;
		};
	});

	// Reset scroll position on navigation
	afterNavigate(() => {
		lenis?.scrollTo(0, { immediate: true });
	});

	// Enable View Transitions API for smooth page transitions
	onNavigate((navigation) => {
		// Only use view transitions for project pages
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{artistName}</title>
	<meta name="description" content="Art portfolio showcasing creative works" />
</svelte:head>

<div class="app">
	<Header {artistName} />
	<ProjectNav items={navItemsWithPreview} />

	<main class="main">
		{@render children()}
	</main>
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
