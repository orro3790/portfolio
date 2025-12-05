/**
 * Server-side data loading for project detail pages.
 * Fetches project by slug from Sanity with prerender support.
 * @module routes/work/[slug]/+page.server
 */
import { error } from '@sveltejs/kit';
import { client, getClient } from '$lib/sanity/client';
import { projectBySlugQuery, projectsListQuery, projectSlugsQuery } from '$lib/sanity/queries';
import { transformProject } from '$lib/sanity/transform';
import type { PageServerLoad, EntryGenerator } from './$types';
import type { SanityProject } from '$lib/sanity/types';
import { env } from '$env/dynamic/private';

/**
 * Generate entries for static prerendering.
 * Required for adapter-static with dynamic routes.
 */
export const entries: EntryGenerator = async () => {
	const slugs = await client.fetch<string[]>(projectSlugsQuery);
	return slugs.map((slug) => ({ slug }));
};

export const prerender = true;

export const load: PageServerLoad = async ({ params, cookies }) => {
	// Check for preview mode
	const isPreview = cookies.get('sanity_preview') === 'true';
	const sanityClient =
		isPreview && env.SANITY_API_TOKEN ? getClient({ token: env.SANITY_API_TOKEN }) : client;

	const [sanityProject, allProjects] = await Promise.all([
		sanityClient.fetch<SanityProject | null>(projectBySlugQuery, { slug: params.slug }),
		sanityClient.fetch<SanityProject[]>(projectsListQuery)
	]);

	if (!sanityProject) {
		throw error(404, 'Project not found');
	}

	const project = transformProject(sanityProject);

	// Find next project for navigation
	const currentIndex = allProjects.findIndex((p) => p.slug === params.slug);
	const nextIndex = (currentIndex + 1) % allProjects.length;
	const nextProject = allProjects[nextIndex] ? transformProject(allProjects[nextIndex]) : undefined;

	return {
		project,
		nextProject,
		isPreview
	};
};
