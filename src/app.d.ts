// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// Augment svelte/elements for custom action events
declare module 'svelte/elements' {
	interface HTMLAttributes<T> {
		oninview?: (event: CustomEvent<{ inView: boolean; entry: IntersectionObserverEntry }>) => void;
	}
}

export {};
