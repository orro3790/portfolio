/**
 * Server-side data loading for project detail pages.
 * Validates project exists and returns 404 if not found.
 */
import { error } from '@sveltejs/kit';
import { getProjectBySlug, getNextProject } from '$lib/data/projects';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const project = getProjectBySlug(params.slug);

	if (!project) {
		throw error(404, 'Project not found');
	}

	const nextProject = getNextProject(params.slug);

	return {
		project,
		nextProject
	};
};

