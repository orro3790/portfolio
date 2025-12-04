<script lang="ts">
	import { inView } from '$lib/actions/inView';
	import Footer from '$lib/components/Footer.svelte';
	import { projects } from '$lib/data/projects';
</script>

<svelte:head>
	<title>All Work | Portfolio</title>
	<meta name="description" content="Browse all art projects and creative works" />
</svelte:head>

<section class="work">
	<header class="work__header container">
		<h1 class="work__title reveal" use:inView>
			All Work
		</h1>
		<p class="work__subtitle reveal reveal-delay-1" use:inView>
			A collection of selected projects across various mediums
		</p>
	</header>

	<div class="work__grid container">
		{#each projects as project, index (project.slug)}
			<article
				class="work__item reveal"
				style="--delay: {index * 100}ms"
				use:inView
			>
				<a href="/work/{project.slug}" class="work__item-link">
					<div class="work__item-image">
						<img
							src={project.heroImage}
							alt={project.title}
							loading="lazy"
						/>
						<div class="work__item-placeholder" aria-hidden="true">
							<span>{project.title}</span>
						</div>
					</div>
					<div class="work__item-info">
						<h2 class="work__item-title">{project.title}</h2>
						<p class="work__item-type">{project.meta.projectType}</p>
					</div>
				</a>
			</article>
		{/each}
	</div>
</section>

<Footer />

<style>
	.work {
		padding: var(--space-16) 0;
		min-height: calc(100vh - var(--header-height));
	}

	.work__header {
		padding-left: calc(var(--sidebar-width) + var(--space-8));
		margin-bottom: var(--space-16);
	}

	@media (max-width: 1024px) {
		.work__header {
			padding-left: var(--space-6);
		}
	}

	.work__title {
		font-family: var(--font-display);
		font-size: clamp(3rem, 10vw, 7rem);
		font-weight: 300;
		line-height: 1;
		margin-bottom: var(--space-4);
	}

	.work__subtitle {
		font-size: var(--text-lg);
		color: var(--color-text-muted);
	}

	.work__grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-8);
		padding-left: calc(var(--sidebar-width) + var(--space-8));
	}

	@media (max-width: 1024px) {
		.work__grid {
			padding-left: var(--space-6);
			grid-template-columns: 1fr;
		}
	}

	.work__item {
		transition-delay: var(--delay);
	}

	.work__item-link {
		display: block;
		text-decoration: none;
		color: var(--color-text);
	}

	.work__item-image {
		position: relative;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background-color: var(--color-bg-elevated);
		margin-bottom: var(--space-4);
	}

	.work__item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--transition-slow);
	}

	.work__item-link:hover .work__item-image img {
		transform: scale(1.05);
	}

	.work__item-placeholder {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(
			135deg,
			var(--color-bg-elevated) 0%,
			var(--color-border) 100%
		);
	}

	.work__item-placeholder span {
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		font-weight: 300;
		color: var(--color-text-muted);
		opacity: 0.3;
	}

	.work__item-image img:not([src=""]):not([src*="placeholder"]) + .work__item-placeholder {
		display: none;
	}

	.work__item-title {
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		font-weight: 400;
		margin-bottom: var(--space-1);
		transition: color var(--transition-fast);
	}

	.work__item-link:hover .work__item-title {
		color: var(--color-accent);
	}

	.work__item-type {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
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

	:global(.reveal-delay-1) {
		transition-delay: 150ms;
	}
</style>

