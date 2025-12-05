<script lang="ts">
	/**
	 * @component Contact Page
	 * Two-column layout: portrait image with name overlay (left),
	 * centered text block (right). Full viewport, no scrolling.
	 */
	import {page} from '$app/stores';
	import {inview} from '$lib/actions/inView';
	import {getImageUrl} from '$lib/sanity/imageUrl';

	let imageVisible = $state(false);
	let textVisible = $state(false);

	/** Site settings from CMS (via root layout) */
	let siteSettings = $derived($page.data.siteSettings);

	/** Artist data from CMS with fallbacks */
	let artist = $derived({
		name: siteSettings?.artistName || 'Artist Name',
		subtitle: siteSettings?.artistSubtitle || 'Visual Artist',
		portrait: siteSettings?.portrait
			? getImageUrl(siteSettings.portrait, {width: 800, height: 1000})
			: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=1000',
		bio:
			siteSettings?.bio ||
			`Creating at the intersection of traditional craft and contemporary expression. My work explores themes of identity, memory, and the subtle beauty found in everyday moments.

Each piece is an invitation to pause, reflect, and discover something new within the familiar.`,
		email: siteSettings?.email || 'hello@example.com',
	});

	/** Split bio into paragraphs */
	let paragraphs = $derived(artist.bio.split('\n\n').filter((p: string) => p.trim()));
</script>

<svelte:head>
	<title>Contact | {siteSettings?.siteTitle || 'Portfolio'}</title>
	<meta name="description" content="Get in touch with {artist.name}" />
</svelte:head>

<section class="contact">
	<div class="contact__container">
		<!-- Left column: Portrait with name overlay -->
		<div
			class="contact__image-col"
			class:visible={imageVisible}
			use:inview={{ threshold: 0.2 }}
			oninview={() => (imageVisible = true)}
		>
			<div class="contact__image-wrapper">
				<img src={artist.portrait} alt={artist.name} class="contact__image" />
				<!-- Name overlay at bottom left -->
				<div class="contact__image-info">
					<h1 class="contact__name">{artist.name}</h1>
					<span class="contact__subtitle">{artist.subtitle}</span>
				</div>
			</div>
		</div>

		<!-- Right column: Text content -->
		<div
			class="contact__text-col"
			class:visible={textVisible}
			use:inview={{ threshold: 0.2 }}
			oninview={() => (textVisible = true)}
		>
			<div class="contact__text-content">
				<h2 class="contact__heading">About</h2>
				<div class="contact__body">
					{#each paragraphs as paragraph, i (i)}
						<p style="--delay: {i * 100}ms">{paragraph}</p>
					{/each}
				</div>
				<a href="mailto:{artist.email}" class="contact__email">{artist.email}</a>
			</div>
		</div>
	</div>
</section>

<style>
	.contact {
		position: fixed;
		inset: 0;
		overflow: hidden;
	}

	.contact__container {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: 1fr 1fr;
		height: 100%;
		width: 100%;
	}

	@media (min-width: 768px) {
		.contact__container {
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 1fr;
		}
	}

	/* Image column */
	.contact__image-col {
		position: relative;
		overflow: hidden;
		min-height: 0; /* Prevent grid blowout */
		opacity: 0;
		transform: translateX(-40px);
		transition:
			opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
			transform 1s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.contact__image-col.visible {
		opacity: 1;
		transform: translateX(0);
	}

	.contact__image-wrapper {
		position: absolute;
		inset: 0;
	}

	.contact__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 20%; /* Keep face visible */
	}

	/* Name overlay */
	.contact__image-info {
		position: absolute;
		bottom: var(--space-12);
		left: var(--space-12);
		z-index: 2;
	}

	@media (min-width: 1200px) {
		.contact__image-info {
			bottom: var(--space-16);
			left: var(--space-16);
		}
	}

	.contact__name {
		font-family: var(--font-display);
		font-size: clamp(2rem, 5vw, 3.5rem);
		font-weight: 300;
		color: white;
		line-height: 1.1;
		margin: 0 0 var(--space-2);
		text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
	}

	.contact__subtitle {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.8);
		text-shadow: 0 1px 10px rgba(0, 0, 0, 0.3);
	}

	/* Text column */
	.contact__text-col {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-12) var(--space-12);
		opacity: 0;
		transform: translateX(40px);
		transition:
			opacity 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s,
			transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;
	}

	@media (min-width: 1200px) {
		.contact__text-col {
			padding: var(--space-16) var(--space-16);
		}
	}

	.contact__text-col.visible {
		opacity: 1;
		transform: translateX(0);
	}

	.contact__text-content {
		max-width: 420px;
		width: 100%;
	}

	@media (min-width: 1400px) {
		.contact__text-content {
			max-width: 480px;
		}
	}

	.contact__heading {
		font-family: var(--font-display);
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 400;
		color: var(--color-text);
		margin: 0 0 var(--space-6);
		line-height: 1.2;
	}

	.contact__body {
		margin-bottom: var(--space-8);
	}

	.contact__body p {
		font-family: var(--font-body);
		font-size: var(--text-base);
		line-height: 1.7;
		color: var(--color-text-muted);
		margin: 0 0 var(--space-4);
	}

	.contact__body p:last-child {
		margin-bottom: 0;
	}

	.contact__email {
		display: inline-block;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text);
		text-decoration: none;
		padding: var(--space-2) var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: 100px;
		transition:
			background-color 0.2s ease,
			border-color 0.2s ease,
			color 0.2s ease;
	}

	.contact__email:hover {
		background-color: var(--color-text);
		border-color: var(--color-text);
		color: var(--color-bg);
	}

	/* Mobile adjustments */
	@media (max-width: 767px) {
		.contact__image-info {
			bottom: var(--space-6);
			left: var(--space-6);
		}

		.contact__text-col {
			padding: var(--space-6);
		}

		.contact__text-content {
			max-width: none;
		}
	}
</style>
