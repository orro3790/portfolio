<script lang="ts">
	/**
	 * Project detail page — renders dynamic project content sections.
	 * Section types defined in documentation/agent-guidelines/project-layouts.md
	 */
	import { inview } from '$lib/actions/inView';
	import Footer from '$lib/components/Footer.svelte';
	import type { Project } from '$lib/schemas/project';
	import { isProjectToProjectNav } from '$lib/stores/ui';

	// Layout section components (documented in project-layouts.md)
	import TGridSection from '$lib/components/sections/TGridSection.svelte';
	import FullBleedImage from '$lib/components/sections/FullBleedImage.svelte';
	import Carousel from '$lib/components/sections/Carousel.svelte';
	import VerticalCarousel from '$lib/components/sections/VerticalCarousel.svelte';
	import AsymmetricGrid from '$lib/components/sections/AsymmetricGrid.svelte';
	import Diagonal from '$lib/components/sections/Diagonal.svelte';

	// General-purpose layout sections
	import TwoColumnText from '$lib/components/sections/TwoColumnText.svelte';
	import ImageGrid from '$lib/components/sections/ImageGrid.svelte';
	import QuadGrid from '$lib/components/sections/QuadGrid.svelte';

	interface Props {
		data: {
			project: Project;
		};
	}

	let { data }: Props = $props();

	// Data comes pre-validated from server (404 already handled)
	const project = $derived(data.project);

	// Track visibility for reveal animations (reset by {#key} block)
	let heroVisible = $state(false);
	let metaVisible = $state(false);

	// Conditionally apply view-transition-name only for non-project-to-project navigation
	// This prevents the old project's hero from appearing during transitions
	const heroViewTransition = $derived($isProjectToProjectNav ? undefined : 'project-hero');
</script>

<svelte:head>
	<title>{project?.title} | Portfolio</title>
	<meta name="description" content={project?.subtitle || `${project?.title} - Art project`} />
</svelte:head>

<article class="project">
	<!-- Hero Image (outside {#key} to preserve view-transition-name animation) -->
	<section class="project__hero-image">
		<div class="project__image-wrapper" style:view-transition-name={heroViewTransition}>
			<img src={project.heroImage} alt={project.title} loading="eager" />
			<!-- Placeholder gradient for missing images -->
			<div class="project__image-placeholder" aria-hidden="true">
				<span>{project.title}</span>
			</div>
		</div>
	</section>

	<!-- Key block forces remount when navigating between projects, resetting all animation states -->
	{#key project.slug}
		<!-- Hero Text Section (inside {#key} to reset animations) -->
		<header class="project__hero">
			<div class="project__hero-content container">
				<h1
					class="project__title reveal"
					class:visible={heroVisible}
					use:inview={{ threshold: 0.2 }}
					oninview={() => (heroVisible = true)}
				>
					{project.title}
				</h1>

				<div
					class="project__meta reveal reveal-delay-1"
					class:visible={metaVisible}
					use:inview={{ threshold: 0.2 }}
					oninview={() => (metaVisible = true)}
				>
					<div class="project__meta-item project__meta-item--col-1">
						<span class="project__meta-label">Project Type</span>
						<span class="project__meta-value">{project.meta.projectType}</span>
					</div>
					<div class="project__meta-item project__meta-item--col-4">
						<span class="project__meta-label">Stage</span>
						<span class="project__meta-value">{project.meta.stage}</span>
					</div>
					<div class="project__meta-item project__meta-item--col-5">
						<span class="project__meta-label">Deliverables</span>
						<span class="project__meta-value">{project.meta.deliverables}</span>
					</div>
				</div>
			</div>
		</header>

		<!-- Content Sections (wrapped for CSS ordering) -->
		<div class="project__sections">
			{#if project.sections}
				{#each project.sections as section, index (index)}
					<!-- Text sections (T-Grid) -->
					{#if (section.type === 't-grid-hero' || section.type === 't-grid-left' || section.type === 't-grid-right') && section.text}
						<TGridSection
							text={section.text}
							eyebrow={section.eyebrow}
							variant={section.type === 't-grid-hero'
								? 'hero'
								: section.type === 't-grid-right'
									? 'right'
									: 'left'}
						/>
						<!-- Full-width media -->
					{:else if section.type === 'fw-std-53' && section.media?.[0]}
						<FullBleedImage
							media={section.media[0]}
							caption={section.media[0].caption}
							aspectRatio="5/3"
							revealFrom="bottom"
						/>
						<!-- Carousel (horizontal) -->
					{:else if section.type === 'carousel' && section.media}
						<Carousel media={section.media} initialIndex={section.initialIndex} />
						<!-- Vertical Carousel (scroll-jacked) -->
					{:else if section.type === 'vertical-carousel' && section.media && section.heading && section.body}
						<VerticalCarousel
							media={section.media}
							heading={section.heading}
							body={section.body}
							eyebrow={section.eyebrow}
						/>
						<!-- Asymmetric Grid -->
					{:else if section.type === 'asymmetric-grid' && section.media && section.media.length >= 2 && section.largePosition && section.smallPosition}
						<AsymmetricGrid
							largePosition={section.largePosition}
							smallPosition={section.smallPosition}
							mediaLarge={section.media[0]}
							mediaSmall={section.media[1]}
							textContent={section.textContent}
						/>
						<!-- Diagonal -->
					{:else if section.type === 'diagonal' && section.media && section.media.length >= 2}
						<Diagonal mediaLarge={section.media[0]} mediaSmall={section.media[1]} />
						<!-- General-purpose layout sections -->
					{:else if section.type === 'full-bleed-image' && section.media?.[0]}
						<FullBleedImage
							media={section.media[0]}
							caption={section.media[0].caption}
							revealFrom={section.revealFrom || 'bottom'}
						/>
					{:else if section.type === 'two-column' && section.heading && section.body}
						<TwoColumnText
							heading={section.heading}
							body={section.body}
							eyebrow={section.eyebrow}
							layout={section.layout === 'heading-right' ? 'heading-right' : 'heading-left'}
						/>
					{:else if section.type === 'image-grid' && section.media}
						<ImageGrid
							media={section.media}
							columns={section.columns ? (parseInt(section.columns, 10) as 2 | 3 | 4) : 3}
							gap={section.gap && section.gap !== 'none' ? section.gap : 'medium'}
						/>
					{:else if section.type === 'quad-grid' && section.media && section.media.length >= 4}
						<QuadGrid
							media={[section.media[0], section.media[1], section.media[2], section.media[3]]}
							gap={section.gap === 'large' ? 'medium' : section.gap}
							aspectRatio={section.aspectRatio}
						/>
					{/if}
				{/each}
			{/if}
		</div>
	{/key}
</article>

<Footer />

<style>
	.project {
		padding-bottom: 0;
		/* Flexbox to allow visual reordering while keeping DOM order for view transitions */
		display: flex;
		flex-direction: column;
	}

	/* 
	 * Visual reordering via flexbox order:
	 * DOM order:    hero-image (outside {#key}) → hero header → sections (inside {#key})
	 * Visual order: hero header → hero-image → sections
	 * This preserves view-transition-name on hero-image while resetting animations via {#key}
	 */
	.project__hero {
		padding: var(--space-16) 0 var(--space-12) var(--space-6);
		order: 1; /* Visual first */
	}

	.project__hero-image {
		order: 2; /* Visual second */
	}

	.project__sections {
		order: 3; /* Visual third */
	}

	.project__hero-content {
		padding-left: var(--space-6);
	}

	@media (max-width: 1024px) {
		.project__hero-content {
			padding-left: var(--space-6);
		}
	}

	.project__title {
		font-family: var(--font-display);
		font-size: clamp(3.5rem, 12vw, 9rem);
		font-weight: 300;
		line-height: 0.95;
		letter-spacing: -0.03em;
		margin-bottom: var(--space-12);
	}

	/* Meta Grid - 6 column layout */
	.project__meta {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: var(--gutter, 1.5rem);
		width: 100%;
		max-width: var(--max-width, 1400px);
		margin-top: auto;
	}

	.project__meta-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	/* Column positioning: 1, 4, 5 */
	.project__meta-item--col-1 {
		grid-column: 1 / 2;
	}

	.project__meta-item--col-4 {
		grid-column: 4 / 5;
	}

	.project__meta-item--col-5 {
		grid-column: 5 / 6;
	}

	@media (max-width: 1024px) {
		.project__meta {
			grid-template-columns: repeat(4, 1fr);
		}

		.project__meta-item--col-1 {
			grid-column: 1 / 2;
		}

		.project__meta-item--col-4 {
			grid-column: 3 / 4;
		}

		.project__meta-item--col-5 {
			grid-column: 4 / 5;
		}
	}

	@media (max-width: 768px) {
		.project__meta {
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-6) var(--space-4);
		}

		.project__meta-item--col-1 {
			grid-column: 1 / 2;
		}

		.project__meta-item--col-4 {
			grid-column: 2 / 3;
		}

		.project__meta-item--col-5 {
			grid-column: 1 / 3;
		}
	}

	.project__meta-label {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-text);
	}

	.project__meta-value {
		font-family: var(--font-body);
		font-size: var(--text-base);
		color: var(--color-text);
	}

	/* Hero Image */
	.project__hero-image {
		position: relative;
		width: 100%;
		margin-bottom: var(--space-16);
	}

	.project__image-wrapper {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		background-color: var(--color-bg-elevated);
		overflow: hidden;
	}

	.project__image-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Placeholder for missing images */
	.project__image-placeholder {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-border) 100%);
	}

	.project__image-placeholder span {
		font-family: var(--font-display);
		font-size: var(--text-4xl);
		font-weight: 300;
		color: var(--color-text-muted);
		opacity: 0.3;
	}

	/* Hide placeholder when image loads */
	.project__image-wrapper
		img:not([src='']):not([src*='placeholder'])
		+ .project__image-placeholder {
		display: none;
	}

	/* Reveal animations */
	.reveal {
		opacity: 0;
		transform: translateY(40px);
		transition:
			opacity var(--transition-reveal),
			transform var(--transition-reveal);
	}

	.reveal.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.reveal-delay-1 {
		transition-delay: 150ms;
	}
</style>
