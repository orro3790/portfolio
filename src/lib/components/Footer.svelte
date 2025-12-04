<script lang="ts">
	/**
	 * Minimalist site footer with contact links and copyright.
	 */
	interface Props {
		email?: string;
		instagram?: string;
	}

	let { email = 'jua1209@naver.com ', instagram = '#' }: Props = $props();

	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="footer__content">
		<a href="mailto:{email}" class="footer__email">{email}</a>

		<nav class="footer__links">
			<a href={instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
			<span class="footer__divider">·</span>
			<span class="footer__copyright">© {year}</span>
		</nav>
	</div>
</footer>

<style>
	.footer {
		padding: var(--space-12) var(--gutter);
	}

	.footer__content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-width: var(--max-width);
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		.footer__content {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
		}
	}

	.footer__email {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text);
		text-decoration: none;
		transition: opacity 0.2s ease;
	}

	.footer__email:hover {
		opacity: 0.6;
	}

	.footer__links {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-text-muted);
	}

	.footer__links a {
		color: var(--color-text-muted);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.footer__links a:hover {
		color: var(--color-text);
	}

	.footer__divider {
		opacity: 0.4;
	}

	.footer__copyright {
		opacity: 0.6;
	}
</style>
