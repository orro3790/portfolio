<script lang="ts">
	import { inView } from '$lib/actions/inView';

	interface Props {
		email?: string;
		instagram?: string;
		linkedin?: string;
	}

	let {
		email = 'hello@example.com',
		instagram = '#',
		linkedin = '#'
	}: Props = $props();
</script>

<footer class="footer">
	<div class="footer__inner container">
		<div class="footer__cta" use:inView>
			<h2 class="footer__heading reveal">
				How can <br />we help?
			</h2>

			<div class="footer__links reveal reveal-delay-1">
				<a href="/contact" class="footer__link">
					<span>Get in touch</span>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M7 17L17 7M17 7H7M17 7V17" />
					</svg>
				</a>
				<a href="mailto:{email}" class="footer__link">
					<span>Say hello</span>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M7 17L17 7M17 7H7M17 7V17" />
					</svg>
				</a>
			</div>
		</div>

		<div class="footer__bottom reveal reveal-delay-2" use:inView>
			<div class="footer__social">
				<a href={instagram} target="_blank" rel="noopener noreferrer" class="footer__social-link">
					Instagram
				</a>
				<a href={linkedin} target="_blank" rel="noopener noreferrer" class="footer__social-link">
					LinkedIn
				</a>
			</div>

			<div class="footer__meta">
				<span class="footer__copyright">© {new Date().getFullYear()}</span>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		padding: var(--space-24) 0 var(--space-12);
		border-top: 1px solid var(--color-border);
	}

	.footer__inner {
		display: flex;
		flex-direction: column;
		gap: var(--space-16);
	}

	.footer__cta {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}

	.footer__heading {
		font-family: var(--font-display);
		font-size: clamp(var(--text-4xl), 8vw, var(--text-6xl));
		font-weight: 300;
		line-height: 1.1;
	}

	.footer__links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-4);
	}

	.footer__link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-5);
		font-size: var(--text-lg);
		color: var(--color-text);
		border: 1px solid var(--color-border);
		border-radius: 100px;
		transition:
			background-color var(--transition-fast),
			border-color var(--transition-fast),
			color var(--transition-fast);
	}

	.footer__link:hover {
		background-color: var(--color-text);
		border-color: var(--color-text);
		color: var(--color-bg);
	}

	.footer__link svg {
		transition: transform var(--transition-fast);
	}

	.footer__link:hover svg {
		transform: translate(2px, -2px);
	}

	.footer__bottom {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		padding-top: var(--space-8);
		border-top: 1px solid var(--color-border);
	}

	@media (min-width: 768px) {
		.footer__bottom {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}

	.footer__social {
		display: flex;
		gap: var(--space-6);
	}

	.footer__social-link {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
		transition: color var(--transition-fast);
	}

	.footer__social-link:hover {
		color: var(--color-text);
	}

	.footer__meta {
		display: flex;
		gap: var(--space-6);
	}

	.footer__copyright {
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}
</style>

