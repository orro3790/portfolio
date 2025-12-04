<script lang="ts">
	import { page } from '$app/stores';
	import { beforeNavigate, afterNavigate, goto } from '$app/navigation';
	import { isMenuOpen } from '$lib/stores/ui';
	import type { NavItemWithPreview } from '$lib/schemas/project';
	import { tick } from 'svelte';

	interface Props {
		items: NavItemWithPreview[];
		showAllWork?: boolean;
	}

	let { items, showAllWork = true }: Props = $props();

	// Track hovered project for preview
	let hoveredProject = $state<NavItemWithPreview | null>(null);
	let isHovering = $state(false);
	let isNavigating = $state(false);
	let navigatingSlug = $state<string | null>(null);
	let hoverTimeout: ReturnType<typeof setTimeout>;

	// Determine current slug from URL
	let currentSlug = $derived($page.params.slug || '');

	// Determine if we should hide the nav (during navigation or on project detail pages)
	// On mobile, we rely on isMenuOpen
	let shouldHideNav = $derived(isNavigating || (!!currentSlug && !$isMenuOpen));

	// Clear hover state before navigation
	beforeNavigate(() => {
		if (!isNavigating) {
			isHovering = false;
			hoveredProject = null;
			clearTimeout(hoverTimeout);
			$isMenuOpen = false; // Close menu on navigation
		}
	});

	// Clear navigation state after navigation completes
	afterNavigate(() => {
		if (isNavigating) {
			isNavigating = false;
			hoveredProject = null;
			isHovering = false;
			navigatingSlug = null;
		}
	});

	function handleMouseEnter(item: NavItemWithPreview) {
		if (isNavigating) return;
		clearTimeout(hoverTimeout);
		hoveredProject = item;
		isHovering = true;
	}

	function handleMouseLeave() {
		if (isNavigating) return;

		hoverTimeout = setTimeout(() => {
			isHovering = false;
			hoveredProject = null;
		}, 50);
	}

	async function handleProjectClick(e: MouseEvent, item: NavItemWithPreview) {
		e.preventDefault();
		if (isNavigating) return;

		isNavigating = true;
		navigatingSlug = item.slug;
		hoveredProject = item; // Ensure it stays visible
		isHovering = true;

		// Wait for expansion animation (1s) - Increased duration
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Wait additional 1.2s pause - Increased pause
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Navigation triggers layout's onNavigate which handles View Transition
		await goto(`/work/${item.slug}`);
	}
</script>

<!-- Dark backdrop overlay for modal menu -->
{#if $isMenuOpen}
	<div
		class="menu-backdrop"
		class:active={$isMenuOpen}
		onclick={() => ($isMenuOpen = false)}
		onkeydown={(e) => e.key === 'Escape' && ($isMenuOpen = false)}
		role="button"
		tabindex="-1"
		aria-label="Close menu"
	></div>
{/if}

<!-- Full-screen hover preview overlay -->
<div
	class="preview-overlay"
	class:active={isHovering && hoveredProject}
	class:navigating={isNavigating}
	style="--accent-color: {hoveredProject?.accentColor || 'hsl(0, 0%, 10%)'}"
	aria-hidden="true"
>
	{#if hoveredProject}
		{#key hoveredProject.slug}
			<div class="preview-content">
				<!-- Background Layer (Full screen, behind everything) -->
				<div
					class="preview-bg"
					style="background-image: url('{hoveredProject.backgroundImage ||
						hoveredProject.heroImage}');"
				></div>
				<!-- Dark Overlay Layer -->
				<div class="preview-bg-overlay"></div>

				<!-- Content Container -->
				<div class="preview-layout">
					<!-- A: Tags (Top Left, Fade In, Slide Down) -->
					{#if hoveredProject.preview?.tags}
						<div class="preview-tags" class:visible={isHovering && !isNavigating}>
							{hoveredProject.preview.tags.join(', ')}
						</div>
					{/if}

					<!-- B: Large title (Center/Bottom Left, Fade In, Slide Right) -->
					<h2 class="preview-title" class:visible={isHovering && !isNavigating}>
						{hoveredProject.title}
					</h2>

					<!-- C: Description (Bottom Right, Fade In, Slide Up) -->
					{#if hoveredProject.preview?.description}
						<p class="preview-description" class:visible={isHovering && !isNavigating}>
							{hoveredProject.preview.description}
						</p>
					{/if}
				</div>

				<!-- D: Preview image (Right Side, Curtain Reveal Right to Left) -->
				<!-- Moved outside preview-layout to allow full viewport expansion -->
				<div
					class="preview-image-wrapper"
					class:visible={isHovering}
					class:navigating={isNavigating && navigatingSlug === hoveredProject.slug}
					style="view-transition-name: project-hero-{hoveredProject.slug}"
				>
					<img src={hoveredProject.previewImage} alt="" class="preview-image" />
				</div>
			</div>
		{/key}
	{/if}
</div>

<nav
	class="project-nav"
	aria-label="Projects"
	class:hidden={shouldHideNav && !$isMenuOpen}
	class:menu-open={$isMenuOpen}
>
	<ul class="project-nav__list">
		<!-- Home link at the top -->
		<li
			class="project-nav__item project-nav__item--home"
			class:menu-item-visible={$isMenuOpen}
			style="--delay: 0ms"
		>
			<a href="/" class="project-nav__link" onmouseenter={handleMouseLeave}>Home</a>
		</li>
		{#each items as item, index (item.slug)}
			<li
				class="project-nav__item"
				class:menu-item-visible={$isMenuOpen}
				style="--delay: {(index + 1) * 80}ms"
			>
				<a
					href="/work/{item.slug}"
					class="project-nav__link"
					class:active={currentSlug === item.slug}
					aria-current={currentSlug === item.slug ? 'page' : undefined}
					onmouseenter={() => handleMouseEnter(item)}
					onmouseleave={handleMouseLeave}
					onfocus={() => handleMouseEnter(item)}
					onblur={handleMouseLeave}
					onclick={(e) => handleProjectClick(e, item)}
				>
					{item.title}
				</a>
			</li>
		{/each}
		{#if showAllWork}
			<li
				class="project-nav__item project-nav__item--all"
				class:menu-item-visible={$isMenuOpen}
				style="--delay: {(items.length + 1) * 80}ms"
			>
				<a href="/work" class="project-nav__link" onmouseenter={handleMouseLeave}> All Work </a>
			</li>
		{/if}
		<li
			class="project-nav__item project-nav__item--contact"
			class:menu-item-visible={$isMenuOpen}
			style="--delay: {(items.length + 2) * 80}ms"
		>
			<a href="/contact" class="project-nav__link" onmouseenter={handleMouseLeave}>Get in Touch</a>
		</li>
	</ul>
</nav>

<style>
	/* ==========================================================================
	   Menu Backdrop (Dark Overlay)
	   ========================================================================== */

	.menu-backdrop {
		position: fixed;
		inset: 0;
		z-index: calc(var(--z-modal) - 1);
		background: rgba(0, 0, 0, 0);
		backdrop-filter: blur(0px);
		-webkit-backdrop-filter: blur(0px);
		pointer-events: none;
		transition:
			background 0.5s cubic-bezier(0.16, 1, 0.3, 1),
			backdrop-filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.menu-backdrop.active {
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		pointer-events: auto;
		cursor: pointer;
	}

	/* ==========================================================================
	   Preview Overlay
	   ========================================================================== */

	.preview-overlay {
		position: fixed;
		inset: 0;
		z-index: calc(var(--z-elevated) - 1);
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.3s ease;
		background-color: #000; /* Ensure black background as per reference */
	}

	.preview-overlay.active {
		opacity: 1;
	}

	.preview-overlay.navigating {
		z-index: var(--z-overlay); /* Bring to front during navigation */
	}

	.preview-content {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	/* Layout Container to manage z-indexes and placement */
	.preview-layout {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		max-width: var(--max-width);
		margin: 0 auto;
		padding: var(--space-6);
	}

	/* Background with accent color and noise texture */
	.preview-bg {
		position: absolute;
		inset: 0;
		background-color: var(--accent-color);
		background-size: cover;
		background-position: center;
		opacity: 0;
		animation: fadeIn 1s ease forwards;
	}

	.preview-bg-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.4); /* Dark overlay */
		opacity: 0;
		animation: fadeIn 1s ease forwards;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* B: Large title (Center/Bottom Left) - Fade In, Slide Right */
	.preview-title {
		position: absolute;
		left: 20%; /* Adjust based on nav width */
		bottom: 15%;
		font-family: var(--font-display);
		font-size: clamp(4rem, 10vw, 8rem);
		font-weight: 300;
		font-style: normal;
		color: var(--color-text);
		letter-spacing: -0.02em;
		line-height: 1;
		margin: 0;
		z-index: 2;

		opacity: 0;
		animation: slideRightFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	@keyframes slideRightFade {
		from {
			opacity: 0;
			transform: translateX(-40px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	/* C: Description (Bottom Right) - Fade In, Slide Up */
	.preview-description {
		position: absolute;
		bottom: 10%;
		right: 5%;
		max-width: 300px;
		font-family: var(--font-body);
		font-size: var(--text-base);
		font-weight: 400;
		color: var(--color-text);
		line-height: 1.5;
		margin: 0;
		z-index: 2;

		opacity: 0;
		animation: slideUpFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	@keyframes slideUpFade {
		from {
			opacity: 0;
			transform: translateY(40px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* A: Tags (Top Left) - Fade In, Slide Down */
	.preview-tags {
		position: absolute;
		top: 20%;
		left: 25%;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--color-text); /* White instead of muted */
		z-index: 2;

		opacity: 0;
		animation: slideDownFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	@keyframes slideDownFade {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* D: Preview image (Right Side) - Curtain Reveal Right to Left */
	.preview-image-wrapper {
		position: absolute;
		top: 30%;
		right: 10%;
		bottom: 30%;
		width: 30%;

		border-radius: 0;
		overflow: hidden;
		z-index: 1;
		box-shadow: none;

		/* Initial state: Hidden by clip-path from left */
		clip-path: inset(0 0 0 100%);
		opacity: 1;

		animation: curtainReveal 1s cubic-bezier(0.7, 0, 0.3, 1) forwards;

		/* Prepare for transition */
		transition:
			top 0.8s cubic-bezier(0.85, 0, 0.15, 1),
			bottom 0.8s cubic-bezier(0.85, 0, 0.15, 1),
			right 0.8s cubic-bezier(0.85, 0, 0.15, 1),
			width 0.8s cubic-bezier(0.85, 0, 0.15, 1);
	}

	@keyframes curtainReveal {
		from {
			clip-path: inset(0 0 0 100%);
		}
		to {
			clip-path: inset(0 0 0 0%);
		}
	}

	/* Fullscreen State - Override animation */
	.preview-image-wrapper.navigating {
		/* Position relative to viewport (preview-content) */
		top: 0;
		bottom: 0;
		right: 0;
		width: 100%;

		max-width: none;
		aspect-ratio: unset;
		transform: none;
		z-index: 9999;
		animation: none; /* Stop the reveal animation */
		clip-path: inset(0 0 0 0%); /* Ensure fully visible */
	}

	/* The thumbnail is removed from the DOM, but the View Transition API 
	   keeps a snapshot of it. We target the *destination* image on the new page 
	   with the same view-transition-name to handle the morph.
	   
	   No extra CSS keyframes are needed here for the slide down, 
	   as ::view-transition-group in app.css handles the geometry interpolation.
	*/

	.preview-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* ==========================================================================
	   Navigation
	   ========================================================================== */

	.project-nav {
		position: fixed;
		left: var(--space-6);
		top: 50%;
		transform: translateY(-50%);
		z-index: var(--z-elevated);
		transition:
			opacity 0.4s ease,
			transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
			left 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.project-nav.hidden {
		opacity: 0;
		/* removed transform slide to just fade out */
		pointer-events: none;
	}

	/* Modal menu state - centered on screen */
	.project-nav.menu-open {
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		z-index: var(--z-modal);
		opacity: 1;
		pointer-events: auto;
	}

	.project-nav__list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	/* Modal menu list styling */
	.project-nav.menu-open .project-nav__list {
		align-items: center;
		text-align: center;
		gap: var(--space-5);
	}

	.project-nav__item {
		opacity: 0;
		transform: translateX(-20px);
		animation: slideIn 0.5s ease forwards;
		animation-delay: var(--delay);
	}

	/* Reset animation for menu items when in modal mode */
	.project-nav.menu-open .project-nav__item {
		animation: none;
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: var(--delay);
	}

	/* Fade in animation when menu is open - higher specificity */
	.project-nav.menu-open .project-nav__item.menu-item-visible {
		opacity: 1;
		transform: translateY(0);
	}

	@keyframes slideIn {
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.project-nav__link {
		display: inline-block;
		padding: var(--space-1) var(--space-3);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-text);

		/* Glassy default state */
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		border: 1px solid transparent;

		border-radius: 100px;
		transition:
			background-color var(--transition-fast),
			border-color var(--transition-fast),
			color var(--transition-fast),
			transform var(--transition-fast);
	}

	/* Modal menu link styling - larger and more prominent */
	.project-nav.menu-open .project-nav__link {
		font-size: clamp(var(--text-lg), 3vw, var(--text-2xl));
		padding: var(--space-2) var(--space-6);
		background: transparent;
		border-color: transparent;
	}

	.project-nav__link:hover,
	.project-nav__link:focus {
		background-color: transparent;
		border-color: var(--color-text);
		color: var(--color-text);
		outline: none;
		transform: scale(1.05);
	}

	.project-nav.menu-open .project-nav__link:hover,
	.project-nav.menu-open .project-nav__link:focus {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.3);
	}

	.project-nav__link.active {
		background-color: var(--color-text);
		border-color: var(--color-text);
		color: var(--color-bg);
	}

	.project-nav.menu-open .project-nav__link.active {
		background: rgba(255, 255, 255, 0.15);
		border-color: var(--color-text);
		color: var(--color-text);
	}

	.project-nav__item--home {
		margin-bottom: var(--space-2);
	}

	.project-nav.menu-open .project-nav__item--home {
		margin-bottom: var(--space-6);
	}

	.project-nav__item--all {
		margin-top: var(--space-2);
	}

	.project-nav.menu-open .project-nav__item--all {
		margin-top: var(--space-6);
	}

	.project-nav.menu-open .project-nav__item--contact {
		margin-top: var(--space-2);
	}

	/* Mobile styles - also use centered modal */
	@media (max-width: 1024px) {
		.project-nav {
			opacity: 0;
			pointer-events: none;
			position: fixed;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			z-index: var(--z-modal);
		}

		.project-nav.menu-open {
			opacity: 1;
			pointer-events: auto;
		}

		.project-nav__list {
			align-items: center;
			text-align: center;
			gap: var(--space-4);
		}

		.project-nav__link {
			font-size: var(--text-xl);
			background: transparent;
			border-color: transparent;
			padding: var(--space-2) var(--space-5);
		}

		.preview-overlay {
			display: none;
		}
	}
</style>
