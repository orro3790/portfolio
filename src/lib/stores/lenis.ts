/**
 * Lenis scroll store - exposes the global Lenis instance for scroll-linked animations.
 */
import { writable } from 'svelte/store';
import type Lenis from 'lenis';

/**
 * Global Lenis instance store.
 * Set from +layout.svelte, consumed by scroll-linked components.
 */
export const lenisStore = writable<Lenis | null>(null);
