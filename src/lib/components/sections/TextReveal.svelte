<script lang="ts">
	/**
	 * TextReveal Section
	 * Large statement text with staggered line-by-line reveal animation.
	 * Each line slides up and fades in when the section enters viewport.
	 */
	import { inview } from '$lib/actions/inView';

	interface Props {
		/** The text to display. Can include line breaks with \n */
		text: string;
		/** Optional eyebrow/label above the main text */
		eyebrow?: string;
		/** Text alignment */
		align?: 'left' | 'center';
		/** Delay before animation starts (ms) */
		delay?: number;
	}

	let { text, eyebrow, align = 'left', delay = 0 }: Props = $props();

	let visible = $state(false);

	// Split text into lines for staggered animation
	const lines = $derived(text.split('\n').filter((line) => line.trim()));

	function handleInview() {
		console.log('TextReveal: inview triggered');
		if (delay > 0) {
			setTimeout(() => (visible = true), delay);
		} else {
			visible = true;
		}
	}

	// Auto-trigger after mount as fallback
	$effect(() => {
		const timer = setTimeout(() => {
			if (!visible) {
				console.log('TextReveal: auto-triggering after timeout');
				visible = true;
			}
		}, 500);
		return () => clearTimeout(timer);
	});
</script>

<section
	class="text-reveal"
	class:visible
	class:center={align === 'center'}
	use:inview={{ threshold: 0.3 }}
	oninview={handleInview}
>
	<div class="text-reveal__container">
		{#if eyebrow}
			<span class="text-reveal__eyebrow">{eyebrow}</span>
		{/if}
		<h2 class="text-reveal__heading">
			{#each lines as line, i}
				<span class="text-reveal__line" style="--delay: {i * 100}ms">
					<span class="text-reveal__line-inner">{line}</span>
				</span>
			{/each}
		</h2>
	</div>
</section>

<style>
	.text-reveal {
		padding: var(--space-24) var(--space-6);
		overflow: hidden;
	}

	.text-reveal__container {
		max-width: var(--max-width);
		margin: 0 auto;
	}

	.text-reveal.center {
		text-align: center;
	}

	.text-reveal__eyebrow {
		display: block;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-muted);
		margin-bottom: var(--space-4);
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.text-reveal.visible .text-reveal__eyebrow {
		opacity: 1;
		transform: translateY(0);
	}

	.text-reveal__heading {
		font-family: var(--font-display);
		font-size: clamp(2rem, 5vw, 4rem);
		font-weight: 400;
		line-height: 1.2;
		color: var(--color-text);
		margin: 0;
	}

	.text-reveal__line {
		display: block;
		overflow: hidden;
	}

	.text-reveal__line-inner {
		display: block;
		opacity: 0;
		transform: translateY(100%);
		transition:
			opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
			transform 1s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: var(--delay);
	}

	.text-reveal.visible .text-reveal__line-inner {
		opacity: 1;
		transform: translateY(0);
	}
</style>

