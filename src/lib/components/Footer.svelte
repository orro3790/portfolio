<script lang="ts">
	/**
	 * @component Footer
	 * Site footer with project navigation and contact link.
	 * Shows active state for current page.
	 */
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import type { NavItemWithPreview } from '$lib/schemas/project';

	interface Props {
		instagram?: string;
	}

	let { instagram }: Props = $props();

	const year = new Date().getFullYear();

	// Get current path for active state (page from $app/state is reactive object, not a function)
	const currentPath = $derived(page.url.pathname);

	// Navigation from root layout (Sanity-backed)
	const navItems = $derived((page.data.navigation as NavItemWithPreview[]) ?? []);
</script>

<footer class="footer">
	<div class="footer__content">
		<!-- Project links column -->
		<nav class="footer__projects" aria-label="Projects">
			<ul class="footer__project-list">
				{#each navItems as item (item.slug)}
					<li>
						<a
							href={resolve('/work/[slug]', { slug: item.slug })}
							class="footer__project-link"
							class:active={currentPath === `/work/${item.slug}`}
						>
							{item.title}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<!-- Right column: Contact + meta -->
		<div class="footer__right">
			<a
				href={resolve('/contact')}
				class="footer__contact-link"
				class:active={currentPath === '/contact'}
			>
				Contact
			</a>

			<div class="footer__meta">
				{#if instagram}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external link -->
					<a href={instagram} target="_blank" rel="noopener noreferrer" class="footer__social">
						Instagram
					</a>
					<span class="footer__divider">·</span>
				{/if}
				<span class="footer__copyright">© {year}</span>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		padding: var(--space-16) var(--gutter);
		border-top: 1px solid var(--color-border);
		margin-top: var(--space-24);
	}

	.footer__content {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-8);
		max-width: var(--max-width);
		margin: 0 auto;
	}

	@media (min-width: 768px) {
		.footer__content {
			grid-template-columns: 1fr auto;
			align-items: start;
		}
	}

	/* Project links */
	.footer__projects {
		order: 2;
	}

	@media (min-width: 768px) {
		.footer__projects {
			order: 1;
		}
	}

	.footer__project-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.footer__project-link {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		text-decoration: none;
		transition: color 0.2s ease;
		display: inline-block;
	}

	.footer__project-link:hover {
		color: var(--color-text);
	}

	.footer__project-link.active {
		color: var(--color-text);
		font-weight: 500;
	}

	/* Right column */
	.footer__right {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		order: 1;
	}

	@media (min-width: 768px) {
		.footer__right {
			order: 2;
			align-items: flex-end;
			text-align: right;
		}
	}

	.footer__contact-link {
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		font-weight: 400;
		color: var(--color-text);
		text-decoration: none;
		transition: opacity 0.2s ease;
	}

	.footer__contact-link:hover {
		opacity: 0.6;
	}

	.footer__contact-link.active {
		text-decoration: underline;
		text-underline-offset: 4px;
	}

	.footer__meta {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-family: var(--font-body);
		font-size: var(--text-xs);
		color: var(--color-text-muted);
	}

	.footer__social {
		color: var(--color-text-muted);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.footer__social:hover {
		color: var(--color-text);
	}

	.footer__divider {
		opacity: 0.4;
	}

	.footer__copyright {
		opacity: 0.6;
	}
</style>
