import { writable } from 'svelte/store';

export const isMenuOpen = writable(false);

/**
 * Tracks when navigating from one project to another.
 * Used to disable view-transition-name on hero image during project-to-project navigation,
 * preventing the old project's hero from appearing in the transition.
 */
export const isProjectToProjectNav = writable(false);
