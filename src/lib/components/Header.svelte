<script lang="ts">
	import { page } from '$app/stores';
	import { isMenuOpen } from '$lib/stores/ui';

	// Hide header on desktop for landing pages
	let isLandingPage = $derived($page.url.pathname === '/work' || $page.url.pathname === '/');
</script>

<header class="header" class:desktop-hidden={isLandingPage} class:menu-active={$isMenuOpen}>
	<div class="header__inner">
		<button
			class="header__menu-btn btn"
			class:menu-active={$isMenuOpen}
			onclick={() => ($isMenuOpen = !$isMenuOpen)}
			aria-label="Toggle navigation menu"
			aria-expanded={$isMenuOpen}
		>
			{$isMenuOpen ? 'Close' : 'Menu'}
		</button>
	</div>
</header>

<style>
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: var(--z-sticky);
		padding: var(--space-4) var(--space-6);
		pointer-events: none;
		transition:
			opacity 0.3s ease,
			z-index 0s;
	}

	/* Elevate header above modal backdrop when menu is open */
	.header.menu-active {
		z-index: calc(var(--z-modal) + 1);
		opacity: 1;
		pointer-events: auto;
	}

	/* Hide on desktop landing page */
	@media (min-width: 1024px) {
		.header.desktop-hidden {
			opacity: 0;
			pointer-events: none;
		}

		/* Show header when menu is active even on landing pages */
		.header.desktop-hidden.menu-active {
			opacity: 1;
			pointer-events: auto;
		}
	}

	.header__inner {
		display: flex;
		align-items: center;
		justify-content: center; /* Center the menu button */
		width: 100%;
	}

	.header__menu-btn {
		pointer-events: auto;
		font-size: var(--text-sm);
		padding: var(--space-2) var(--space-5);
		height: auto;
		line-height: 1.4;

		/* Glassy default state */
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 100px;
		color: var(--color-text);
		transition:
			background-color var(--transition-fast),
			border-color var(--transition-fast),
			transform var(--transition-fast);
	}

	/* Menu button active state - more prominent */
	.header__menu-btn.menu-active {
		background: rgba(255, 255, 255, 0.15);
		border-color: rgba(255, 255, 255, 0.4);
	}

	.header__menu-btn:hover,
	.header__menu-btn:focus {
		background-color: transparent;
		border-color: var(--color-text);
		outline: none;
		transform: scale(1.05);
	}
</style>
