<script lang="ts">
	import { page } from '$app/stores';
	import { beforeNavigate, afterNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { isMenuOpen } from '$lib/stores/ui';
	import type { NavItemWithPreview } from '$lib/schemas/project';

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

	// Filter out the current project from the menu items
	let filteredItems = $derived(
		currentSlug ? items.filter((item) => item.slug !== currentSlug) : items
	);

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

	function handleMenuLinkClick() {
		// Close menu immediately when any menu item is clicked
		$isMenuOpen = false;
	}

	async function handleProjectClick(e: MouseEvent, item: NavItemWithPreview) {
		e.preventDefault();
		if (isNavigating) return;

		// Close menu immediately on click
		$isMenuOpen = false;

		isNavigating = true;
		navigatingSlug = item.slug;
		hoveredProject = item; // Ensure it stays visible
		isHovering = true;

		// Wait for expansion animation (1s) - Increased duration
		await new Promise((resolve) => setTimeout(resolve, 1000));

		// Wait additional 1.2s pause - Increased pause
		await new Promise((resolve) => setTimeout(resolve, 300));

		// Navigation triggers layout's onNavigate which handles View Transition
		await goto(resolve(`/work/${item.slug}`));
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
		{@const template = hoveredProject.animationTemplate || 'layers'}
		{#key hoveredProject.slug}
			<div class="preview-content template-{template}">
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
					<!-- Tags (position varies by template) -->
					{#if hoveredProject.preview?.tags?.length}
						<div class="preview-tags" class:visible={isHovering && !isNavigating}>
							{hoveredProject.preview.tags.join(', ')}
						</div>
					{/if}

					<!-- Large title (position varies by template) -->
					<h2 class="preview-title" class:visible={isHovering && !isNavigating}>
						{hoveredProject.title}
					</h2>

					<!-- Description (position varies by template) -->
					{#if hoveredProject.preview?.description}
						<p class="preview-description" class:visible={isHovering && !isNavigating}>
							{hoveredProject.preview.description}
						</p>
					{/if}
				</div>

				<!-- Preview image (position and animation vary by template) -->
				<div
					class="preview-image-wrapper"
					class:visible={isHovering}
					class:navigating={isNavigating && navigatingSlug === hoveredProject.slug}
					style="view-transition-name: project-hero"
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
			<a
				href={resolve('/')}
				class="project-nav__link"
				onmouseenter={handleMouseLeave}
				onclick={handleMenuLinkClick}>Home</a
			>
		</li>
		{#each filteredItems as item, index (item.slug)}
			<li
				class="project-nav__item"
				class:menu-item-visible={$isMenuOpen}
				style="--delay: {(index + 1) * 80}ms"
			>
				<a
					href={resolve(`/work/${item.slug}`)}
					class="project-nav__link"
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
				style="--delay: {(filteredItems.length + 1) * 80}ms"
			>
				<a
					href={resolve('/work')}
					class="project-nav__link"
					onmouseenter={handleMouseLeave}
					onclick={handleMenuLinkClick}
				>
					All Work
				</a>
			</li>
		{/if}
		<li
			class="project-nav__item project-nav__item--contact"
			class:menu-item-visible={$isMenuOpen}
			style="--delay: {(filteredItems.length + 2) * 80}ms"
		>
			<a
				href={resolve('/contact')}
				class="project-nav__link"
				onmouseenter={handleMouseLeave}
				onclick={handleMenuLinkClick}>Get in Touch</a
			>
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

		/* Prepare for expansion transition - smoother ease-out-quart for natural deceleration */
		transition:
			top 1s cubic-bezier(0.25, 1, 0.5, 1),
			bottom 1s cubic-bezier(0.25, 1, 0.5, 1),
			left 1s cubic-bezier(0.25, 1, 0.5, 1),
			right 1s cubic-bezier(0.25, 1, 0.5, 1),
			width 1s cubic-bezier(0.25, 1, 0.5, 1),
			height 1s cubic-bezier(0.25, 1, 0.5, 1);
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
	   Animation Template Variations
	   
	   Each template defines unique positions and entry animations for:
	   - Title: Large project name
	   - Description: Short project summary  
	   - Tags: Service/category labels
	   - Image: Device/preview mockup
	   ========================================================================== */

	/* --------------------------------------------------------------------------
	   Template: LAYERS (Default)
	   - Tags: Top-left, slides DOWN from top
	   - Title: Bottom-left, slides RIGHT from left
	   - Description: Bottom-right, slides UP from bottom
	   - Image: Right side, curtain reveal from right to left
	   -------------------------------------------------------------------------- */
	/* (Default styles above handle this template) */

	/* --------------------------------------------------------------------------
	   Template: SUNO (Myeongtae)
	   - Description: Top-right, slides LEFT→RIGHT (from left)
	   - Title: Bottom-left, slides LEFT (from right)
	   - Tags: Bottom area, slides DOWN (from top)
	   - Image: Right side, curtain reveal LEFT→RIGHT
	   -------------------------------------------------------------------------- */
	.template-suno .preview-title {
		left: 18%;
		right: 50%;
		bottom: 30%;
		animation: sunoTitleSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-suno .preview-description {
		top: 15%;
		right: 28%;
		left: auto;
		bottom: auto;
		max-width: 300px;
		text-align: left;
		animation: sunoDescSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-suno .preview-tags {
		top: auto;
		bottom: 18%;
		left: 55%;
		right: auto;
		transform: none;
		animation: sunoTagsSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-suno .preview-image-wrapper {
		top: 25%;
		right: 5%;
		bottom: auto;
		height: 55%;
		width: 28%;
		/* Curtain reveal from right to left */
		clip-path: inset(0 0 0 100%);
		opacity: 1;
		animation: sunoCurtainReveal 1s cubic-bezier(0.7, 0, 0.3, 1) forwards;
	}

	@keyframes sunoTitleSlide {
		from {
			opacity: 0;
			transform: translateX(60px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	/* Description slides from LEFT to RIGHT */
	@keyframes sunoDescSlide {
		from {
			opacity: 0;
			transform: translateX(-50px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	/* Tags slide DOWN from top */
	@keyframes sunoTagsSlide {
		from {
			opacity: 0;
			transform: translateY(-25px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Curtain reveal right to left */
	@keyframes sunoCurtainReveal {
		from {
			clip-path: inset(0 0 0 100%);
		}
		to {
			clip-path: inset(0 0 0 0%);
		}
	}

	/* --------------------------------------------------------------------------
	   Template: RO (Becoming Data)
	   - Description: Top area, slides LEFT (from right)
	   - Title: Right side (more right), slides LEFT (from right)
	   - Tags: Below title, right side, slides UP (from bottom)
	   - Image: Left side (smaller ~28%), curtain reveal LEFT→RIGHT
	   -------------------------------------------------------------------------- */
	.template-ro .preview-title {
		left: auto;
		right: 5%;
		bottom: 35%;
		text-align: right;
		animation: roTitleSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-ro .preview-description {
		top: 12%;
		left: auto;
		right: 5%;
		bottom: auto;
		transform: none;
		max-width: 350px;
		text-align: left;
		animation: roDescSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-ro .preview-tags {
		top: auto;
		bottom: 20%;
		left: auto;
		right: 5%;
		animation: roTagsSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-ro .preview-image-wrapper {
		top: 20%;
		left: 15%;
		right: auto;
		bottom: auto;
		height: 60%;
		width: 28%;
		/* Curtain reveal from left to right */
		clip-path: inset(0 100% 0 0);
		opacity: 1;
		animation: roCurtainReveal 1s cubic-bezier(0.7, 0, 0.3, 1) forwards;
	}

	/* Override fullscreen state for RO template (image on left)
	   Keep using height (not bottom) to ensure smooth transitions */
	.template-ro .preview-image-wrapper.navigating {
		top: 0;
		bottom: auto; /* Keep auto - don't switch layout mode */
		left: 0;
		right: auto;
		width: 100%;
		height: 100%; /* Animate from 60% to 100% */
		clip-path: inset(0 0 0 0);
		animation: none;
	}

	@keyframes roTitleSlide {
		from {
			opacity: 0;
			transform: translateX(60px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes roDescSlide {
		from {
			opacity: 0;
			transform: translateX(50px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes roTagsSlide {
		from {
			opacity: 0;
			transform: translateY(25px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Curtain reveal left to right */
	@keyframes roCurtainReveal {
		from {
			clip-path: inset(0 100% 0 0);
		}
		to {
			clip-path: inset(0 0% 0 0);
		}
	}

	/* --------------------------------------------------------------------------
	   Template: ATOMS (Banchan)
	   - Description: Top-right area, slides LEFT→RIGHT (from left)
	   - Title: Bottom-left, slides LEFT (from right)
	   - Tags: Bottom area, slides DOWN (from top)
	   - Image: Right side, curtain reveal LEFT→RIGHT
	   -------------------------------------------------------------------------- */
	.template-atoms .preview-title {
		left: 18%;
		right: 55%;
		bottom: 28%;
		animation: atomsTitleSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-atoms .preview-description {
		top: 15%;
		right: 28%;
		left: auto;
		bottom: auto;
		max-width: 260px;
		text-align: left;
		animation: atomsDescSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-atoms .preview-tags {
		top: auto;
		bottom: 18%;
		left: auto;
		right: 35%;
		animation: atomsTagsSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-atoms .preview-image-wrapper {
		top: 22%;
		right: 3%;
		bottom: auto;
		height: 60%;
		width: 25%;
		/* Curtain reveal from bottom to up */
		clip-path: inset(100% 0 0 0);
		opacity: 1;
		animation: atomsCurtainReveal 1s cubic-bezier(0.7, 0, 0.3, 1) forwards;
	}

	@keyframes atomsTitleSlide {
		from {
			opacity: 0;
			transform: translateX(70px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	/* Description slides from LEFT to RIGHT */
	@keyframes atomsDescSlide {
		from {
			opacity: 0;
			transform: translateX(-40px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	/* Tags slide DOWN from top */
	@keyframes atomsTagsSlide {
		from {
			opacity: 0;
			transform: translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Curtain reveal bottom to up */
	@keyframes atomsCurtainReveal {
		from {
			clip-path: inset(100% 0 0 0);
		}
		to {
			clip-path: inset(0% 0 0 0);
		}
	}

	/* Override navigating state for suno/atoms templates
	   Keep using height (not bottom) to ensure smooth transitions from auto → numeric */
	.template-suno .preview-image-wrapper.navigating,
	.template-atoms .preview-image-wrapper.navigating {
		top: 0;
		bottom: auto; /* Keep auto - don't switch layout mode */
		right: 0;
		width: 100%;
		height: 100%; /* Animate from 55%/60% to 100% */
		clip-path: inset(0 0 0 0);
		animation: none;
		opacity: 1;
	}

	/* --------------------------------------------------------------------------
	   Template: HYPER (Hyper-Personal)
	   - Description: Top-left area, slides RIGHT (from left)
	   - Title: Bottom-right, slides RIGHT (from left)
	   - Tags: Top-right, slides DOWN (from top)
	   - Image: Left side, curtain reveal RIGHT→LEFT
	   -------------------------------------------------------------------------- */
	.template-hyper .preview-title {
		left: auto;
		right: 15%;
		bottom: 25%;
		text-align: right;
		animation: hyperTitleSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-hyper .preview-description {
		top: 15%;
		left: 45%;
		right: auto;
		bottom: auto;
		max-width: 320px;
		text-align: left;
		animation: hyperDescSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-hyper .preview-tags {
		top: 20%;
		bottom: auto;
		left: auto;
		right: 15%;
		animation: hyperTagsSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-hyper .preview-image-wrapper {
		top: 20%;
		left: 12%;
		right: auto;
		bottom: auto;
		height: 60%;
		width: 30%;
		/* Curtain reveal from left to right */
		clip-path: inset(0 100% 0 0);
		opacity: 1;
		animation: hyperCurtainReveal 1s cubic-bezier(0.7, 0, 0.3, 1) forwards;
	}

	/* Keep using height (not bottom) to ensure smooth transitions */
	.template-hyper .preview-image-wrapper.navigating {
		top: 0;
		bottom: auto; /* Keep auto - don't switch layout mode */
		left: 0;
		right: auto;
		width: 100%;
		height: 100%; /* Animate from 60% to 100% */
		clip-path: inset(0 0 0 0);
		animation: none;
	}

	/* Title slides from LEFT to RIGHT */
	@keyframes hyperTitleSlide {
		from {
			opacity: 0;
			transform: translateX(-60px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	/* Description slides from LEFT to RIGHT */
	@keyframes hyperDescSlide {
		from {
			opacity: 0;
			transform: translateX(-50px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	/* Tags slide DOWN from top */
	@keyframes hyperTagsSlide {
		from {
			opacity: 0;
			transform: translateY(-25px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Curtain reveal left to right */
	@keyframes hyperCurtainReveal {
		from {
			clip-path: inset(0 100% 0 0);
		}
		to {
			clip-path: inset(0 0% 0 0);
		}
	}

	/* --------------------------------------------------------------------------
	   Template: WAITING (Waiting Room)
	   - Description: Bottom-left area, slides UP (from bottom)
	   - Title: Top-right, slides DOWN (from top)
	   - Tags: Bottom-right, slides UP (from bottom)
	   - Image: Center-right, curtain reveal TOP→BOTTOM
	   -------------------------------------------------------------------------- */
	.template-waiting .preview-title {
		left: auto;
		right: 10%;
		top: 15%;
		bottom: auto;
		text-align: right;
		animation: waitingTitleSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-waiting .preview-description {
		top: auto;
		left: 18%;
		right: auto;
		bottom: 15%;
		max-width: 350px;
		text-align: left;
		animation: waitingDescSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-waiting .preview-tags {
		top: auto;
		bottom: 15%;
		left: auto;
		right: 10%;
		animation: waitingTagsSlide 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.template-waiting .preview-image-wrapper {
		top: 20%;
		right: 8%;
		left: auto;
		bottom: auto;
		height: 55%;
		width: 30%;
		/* Curtain reveal from top to bottom */
		clip-path: inset(0 0 100% 0);
		opacity: 1;
		animation: waitingCurtainReveal 1s cubic-bezier(0.7, 0, 0.3, 1) forwards;
	}

	/* Keep using height (not bottom) to ensure smooth transitions */
	.template-waiting .preview-image-wrapper.navigating {
		top: 0;
		bottom: auto; /* Keep auto - don't switch layout mode */
		right: 0;
		left: auto;
		width: 100%;
		height: 100%; /* Animate from 55% to 100% */
		clip-path: inset(0 0 0 0);
		animation: none;
	}

	/* Title slides DOWN from top */
	@keyframes waitingTitleSlide {
		from {
			opacity: 0;
			transform: translateY(-40px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Description slides UP from bottom */
	@keyframes waitingDescSlide {
		from {
			opacity: 0;
			transform: translateY(40px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Tags slide UP from bottom */
	@keyframes waitingTagsSlide {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Curtain reveal top to bottom */
	@keyframes waitingCurtainReveal {
		from {
			clip-path: inset(0 0 100% 0);
		}
		to {
			clip-path: inset(0 0 0% 0);
		}
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

	/* Modal menu state - centered in available space (viewport minus header) */
	.project-nav.menu-open {
		left: 50%;
		/* Center in the available space below header */
		top: calc(var(--header-height) + (100vh - var(--header-height)) / 2);
		transform: translate(-50%, -50%);
		z-index: var(--z-modal);
		opacity: 1;
		pointer-events: auto;
		/* Ensure menu never overlaps with header */
		max-height: calc(100vh - var(--header-height) - var(--space-8));
		overflow: visible;
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
		padding-top: var(--space-4);
		padding-bottom: var(--space-4);
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

	/* Modal menu link styling - larger and more prominent, responsive */
	.project-nav.menu-open .project-nav__link {
		font-size: clamp(var(--text-base), 2.5vw, var(--text-2xl));
		padding: var(--space-2) var(--space-6);
		background: transparent;
		border-color: transparent;
	}

	/* Responsive adjustments for smaller viewport heights */
	@media (max-height: 800px) {
		.project-nav.menu-open {
			max-height: calc(100vh - var(--header-height) - var(--space-4));
		}

		.project-nav.menu-open .project-nav__list {
			gap: var(--space-3);
			padding-top: var(--space-2);
			padding-bottom: var(--space-2);
		}

		.project-nav.menu-open .project-nav__link {
			font-size: clamp(var(--text-sm), 2vw, var(--text-xl));
			padding: var(--space-1) var(--space-4);
		}
	}

	@media (max-height: 600px) {
		.project-nav.menu-open {
			max-height: calc(100vh - var(--header-height) - var(--space-2));
		}

		.project-nav.menu-open .project-nav__list {
			gap: var(--space-2);
			padding-top: var(--space-1);
			padding-bottom: var(--space-1);
		}

		.project-nav.menu-open .project-nav__link {
			font-size: clamp(var(--text-sm), 1.5vw, var(--text-lg));
			padding: var(--space-1) var(--space-3);
		}
	}

	/* Responsive adjustments for smaller viewport widths */
	@media (max-width: 768px) {
		.project-nav.menu-open .project-nav__link {
			font-size: clamp(var(--text-base), 2vw, var(--text-xl));
		}
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
