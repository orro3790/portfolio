<script lang="ts">
	import { inView } from '$lib/actions/inView';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Portfolio | Art & Design</title>
</svelte:head>

<section class="hero">
	<div class="hero__content">
		<h1 class="hero__title reveal" use:inView>
			Creating<br />
			<span class="hero__title-accent">art</span>
		</h1>

		<p class="hero__subtitle reveal reveal-delay-1" use:inView>
			A collection of works exploring form, color, and emotion through various mediums. Each piece
			tells a story of creative exploration and artistic growth.
		</p>
	</div>

	<!-- Background decoration -->
	<div class="hero__bg" aria-hidden="true">
		<div class="hero__bg-shape"></div>
	</div>
</section>

<Footer />

<style>
	.hero {
		position: relative;
		min-height: calc(100vh - var(--header-height));
		display: flex;
		align-items: center;
		padding: var(--space-16) var(--space-6);
		overflow: hidden;
	}

	.hero__content {
		position: relative;
		z-index: 1;
		max-width: 900px;
		margin-left: auto;
		margin-right: auto;
		/* Offset for sidebar on desktop */
		padding-left: calc(var(--sidebar-width) + var(--space-8));
	}

	@media (max-width: 1024px) {
		.hero__content {
			padding-left: 0;
			text-align: center;
		}
	}

	.hero__title {
		font-family: var(--font-display);
		font-size: clamp(4rem, 15vw, 10rem);
		font-weight: 300;
		line-height: 0.95;
		letter-spacing: -0.03em;
		margin-bottom: var(--space-8);
	}

	.hero__title-accent {
		font-style: italic;
	}

	.hero__subtitle {
		font-family: var(--font-body);
		font-size: var(--text-lg);
		line-height: 1.7;
		color: var(--color-text-muted);
		max-width: 50ch;
	}

	@media (max-width: 1024px) {
		.hero__subtitle {
			margin: 0 auto;
		}
	}

	/* Background decoration */
	.hero__bg {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.hero__bg-shape {
		position: absolute;
		top: 50%;
		right: -20%;
		width: 80vw;
		height: 80vw;
		max-width: 1000px;
		max-height: 1000px;
		transform: translateY(-50%);
		background: radial-gradient(
			ellipse at center,
			rgba(99, 102, 241, 0.08) 0%,
			rgba(99, 102, 241, 0.02) 40%,
			transparent 70%
		);
		border-radius: 50%;
		filter: blur(60px);
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
