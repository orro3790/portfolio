<script lang="ts">
	/**
	 * Root app layout sets global chrome, meta tags, and shared navigation.
	 */
	import '../app.css';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import ProjectNav from '$lib/components/ProjectNav.svelte';
	import { onNavigate, afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { lenisStore } from '$lib/stores/lenis';
	import { isProjectToProjectNav } from '$lib/stores/ui';

	let { children } = $props();
	let navigation = $derived($page.data.navigation || []);

	/** Site title displayed in browser tab */
	const siteTitle = 'Portfolio';

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

	// Reset scroll position and navigation state after navigation completes
	afterNavigate(() => {
		lenis?.scrollTo(0, { immediate: true });
		// Reset the project-to-project flag so future navigations work correctly
		isProjectToProjectNav.set(false);
	});

	// Enable View Transitions API for smooth page transitions
	onNavigate(async (navigation) => {
		if (!document.startViewTransition) return;

		// Detect project-to-project navigation to disable hero view transition
		// This prevents the old project's hero from appearing during the transition
		const fromProject = navigation.from?.route.id === '/work/[slug]';
		const toProject = navigation.to?.route.id === '/work/[slug]';
		const isP2P = fromProject && toProject;

		// Set flag BEFORE view transition captures DOM snapshot
		isProjectToProjectNav.set(isP2P);

		// Wait for Svelte to update the DOM with the new store value
		// This ensures the old project's hero loses its view-transition-name
		await new Promise((r) => requestAnimationFrame(r));

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<title>{siteTitle}</title>
	<meta name="description" content="Art portfolio showcasing creative works" />
	<meta name="theme-color" content="#ffffff" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
	<link rel="manifest" href="/site.webmanifest" />
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

<div class="app">
	<Header />
	<ProjectNav items={navigation} />

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
