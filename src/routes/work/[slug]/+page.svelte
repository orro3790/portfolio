<script lang="ts">
	/**
	 * Project detail page — renders dynamic project content sections.
	 * Section types defined in documentation/agent-guidelines/project-layouts.md
	 */
	import { inView } from '$lib/actions/inView';
	import Footer from '$lib/components/Footer.svelte';
	import { getProjectBySlug, getNextProject } from '$lib/data/projects';

	// Layout section components (documented in project-layouts.md)
	import TGridSection from '$lib/components/sections/TGridSection.svelte';
	import FullBleedImage from '$lib/components/sections/FullBleedImage.svelte';
	import Carousel from '$lib/components/sections/Carousel.svelte';
	import AsymmetricGrid from '$lib/components/sections/AsymmetricGrid.svelte';
	import Diagonal from '$lib/components/sections/Diagonal.svelte';

	// General-purpose layout sections
	import TwoColumnText from '$lib/components/sections/TwoColumnText.svelte';
	import ImageGrid from '$lib/components/sections/ImageGrid.svelte';
	import QuadGrid from '$lib/components/sections/QuadGrid.svelte';
	import { error } from '@sveltejs/kit';

	interface Props {
		data: {
			slug: string;
		};
	}

	let { data }: Props = $props();

	const project = $derived(getProjectBySlug(data.slug));
	const nextProject = $derived(project ? getNextProject(project.slug) : undefined);

	// Show 404 if project not found (reactive check)
	$effect(() => {
		if (!project) {
			error(404, 'Project not found');
		}
	});
</script>

<svelte:head>
	<title>{project?.title} | Portfolio</title>
	<meta name="description" content={project?.subtitle || `${project?.title} - Art project`} />
</svelte:head>

{#if project}
	<article class="project">
		<!-- Hero Section -->
		<header class="project__hero">
			<div class="project__hero-content container">
				<h1 class="project__title reveal" use:inView>
					{project.title}
				</h1>

				<div class="project__meta reveal reveal-delay-1" use:inView>
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

		<!-- Hero Image -->
		<section class="project__hero-image" use:inView>
			<div class="project__image-wrapper" style="view-transition-name: project-hero-{project.slug}">
				<img src={project.heroImage} alt={project.title} loading="eager" />
				<!-- Placeholder gradient for missing images -->
				<div class="project__image-placeholder" aria-hidden="true">
					<span>{project.title}</span>
				</div>
			</div>
		</section>

		<!-- Content Sections -->
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
					<!-- Full-width image -->
				{:else if section.type === 'fw-std-53' && section.media?.[0]}
					<FullBleedImage
						src={section.media[0].src}
						alt={section.media[0].alt || ''}
						caption={section.media[0].caption}
						aspectRatio="5/3"
						revealFrom="bottom"
					/>
					<!-- Carousel -->
				{:else if section.type === 'carousel' && section.media}
					<Carousel
						images={section.media.map((m) => ({
							src: m.src,
							alt: m.alt || '',
							caption: m.caption
						}))}
						initialIndex={section.initialIndex}
					/>
					<!-- Asymmetric Grid -->
				{:else if section.type === 'asymmetric-grid' && section.media && section.media.length >= 2 && section.largePosition && section.smallPosition}
					<AsymmetricGrid
						largePosition={section.largePosition}
						smallPosition={section.smallPosition}
						imageLarge={{ src: section.media[0].src, alt: section.media[0].alt || '' }}
						imageSmall={{ src: section.media[1].src, alt: section.media[1].alt || '' }}
						textContent={section.textContent}
					/>
					<!-- Diagonal -->
				{:else if section.type === 'diagonal' && section.media && section.media.length >= 2}
					<Diagonal
						imageLarge={{ src: section.media[0].src, alt: section.media[0].alt || '' }}
						imageSmall={{ src: section.media[1].src, alt: section.media[1].alt || '' }}
					/>
					<!-- General-purpose layout sections -->
				{:else if section.type === 'full-bleed-image' && section.media?.[0]}
					<FullBleedImage
						src={section.media[0].src}
						alt={section.media[0].alt || ''}
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
					<ImageGrid images={section.media.map((m) => ({ src: m.src, alt: m.alt || '' }))} />
				{:else if section.type === 'quad-grid' && section.media && section.media.length >= 4}
					<QuadGrid
						images={[
							{
								src: section.media[0].src,
								alt: section.media[0].alt || '',
								caption: section.media[0].caption
							},
							{
								src: section.media[1].src,
								alt: section.media[1].alt || '',
								caption: section.media[1].caption
							},
							{
								src: section.media[2].src,
								alt: section.media[2].alt || '',
								caption: section.media[2].caption
							},
							{
								src: section.media[3].src,
								alt: section.media[3].alt || '',
								caption: section.media[3].caption
							}
						]}
						gap={section.gap}
						aspectRatio={section.aspectRatio}
					/>
				{/if}
			{/each}
		{/if}
	</article>
{/if}

<Footer />

<style>
	.project {
		padding-bottom: 0;
	}

	/* Hero Section */
	.project__hero {
		padding: var(--space-16) 0 var(--space-12) var(--space-6);
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

	/* Content Sections */
	.project__section {
		padding: var(--space-16) 0;
	}

	.project__section--text {
		max-width: 800px;
		margin: 0 auto;
	}

	.project__section-title {
		font-family: var(--font-display);
		font-size: var(--text-3xl);
		font-weight: 400;
		margin-bottom: var(--space-6);
	}

	.project__section-text {
		font-size: var(--text-lg);
		line-height: 1.8;
		color: var(--color-text-muted);
	}

	/* Next Project */
	.project__next {
		display: flex;
		justify-content: center;
		padding: var(--space-16) var(--space-6);
	}

	.project__next-btn {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		padding: var(--space-2) var(--space-5);
		line-height: 1.4;
		text-decoration: none;
		color: var(--color-text);
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 100px;
		transition:
			background-color var(--transition-fast),
			border-color var(--transition-fast),
			transform var(--transition-fast);
	}

	.project__next-btn:hover {
		background: transparent;
		border-color: var(--color-text);
		transform: scale(1.05);
	}

	/* Reveal animations */
	:global(.reveal) {
		opacity: 0;
		transform: translateY(40px);
		transition:
			opacity var(--transition-reveal),
			transform var(--transition-reveal);
	}

	:global(.reveal[data-visible='true']) {
		opacity: 1;
		transform: translateY(0);
	}

	:global(.reveal-scale) {
		opacity: 0;
		transform: scale(0.98);
		transition:
			opacity var(--transition-reveal),
			transform var(--transition-reveal);
	}

	:global(.reveal-scale[data-visible='true']) {
		opacity: 1;
		transform: scale(1);
	}

	:global(.reveal-delay-1) {
		transition-delay: 150ms;
	}
</style>
