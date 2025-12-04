/**
 * Svelte actions for scroll-triggered animations.
 *
 * @example
 * ```svelte
 * <!-- Legacy: Sets data-visible attribute -->
 * <div class="reveal" use:inView>Content</div>
 *
 * <!-- New: Dispatches custom event -->
 * <div use:inview={{ threshold: 0.2 }} oninview={() => visible = true}>
 *   Content
 * </div>
 * ```
 */

export interface InviewOptions {
	/** Percentage of element visible before triggering (0-1). Default: 0.2 */
	threshold?: number;
	/** Root margin for earlier/later triggering. Default: '0px' */
	rootMargin?: string;
	/** Only trigger once. Default: true */
	once?: boolean;
}

export interface InviewEvent {
	inView: boolean;
	entry: IntersectionObserverEntry;
}

/**
 * Legacy action that sets data-visible attribute when element enters viewport.
 * Used with CSS reveal animations.
 */
export function inView(node: HTMLElement) {
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					node.setAttribute('data-visible', 'true');
					observer.unobserve(node);
				}
			});
		},
		{ threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}

/**
 * Intersection Observer action for scroll-triggered animations.
 * Dispatches 'inview' custom event when element enters viewport.
 */
export function inview(node: HTMLElement, options: InviewOptions = {}) {
	const { threshold = 0.2, rootMargin = '0px', once = true } = options;

	let hasTriggered = false;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && (!once || !hasTriggered)) {
					hasTriggered = true;
					node.dispatchEvent(
						new CustomEvent<InviewEvent>('inview', {
							detail: { inView: true, entry }
						})
					);

					if (once) {
						observer.unobserve(node);
					}
				} else if (!entry.isIntersecting && !once) {
					node.dispatchEvent(
						new CustomEvent<InviewEvent>('inview', {
							detail: { inView: false, entry }
						})
					);
				}
			});
		},
		{ threshold, rootMargin }
	);

	observer.observe(node);

	let currentObserver = observer;

	return {
		destroy() {
			currentObserver.disconnect();
		},
		update(newOptions: InviewOptions) {
			currentObserver.disconnect();
			const { threshold: t = 0.2, rootMargin: r = '0px', once: o = true } = newOptions;
			hasTriggered = false;

			currentObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting && (!o || !hasTriggered)) {
							hasTriggered = true;
							node.dispatchEvent(
								new CustomEvent<InviewEvent>('inview', {
									detail: { inView: true, entry }
								})
							);
							if (o) {
								currentObserver.unobserve(node);
							}
						} else if (!entry.isIntersecting && !o) {
							node.dispatchEvent(
								new CustomEvent<InviewEvent>('inview', {
									detail: { inView: false, entry }
								})
							);
						}
					});
				},
				{ threshold: t, rootMargin: r }
			);
			currentObserver.observe(node);
		}
	};
}
