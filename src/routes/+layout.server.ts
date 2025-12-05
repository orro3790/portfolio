/**
 * Root layout server load.
 * Provides navigation data and site settings to all pages.
 * @module routes/+layout.server
 */
import { client, getClient } from '$lib/sanity/client';
import { navigationQuery, siteSettingsQuery } from '$lib/sanity/queries';
import type { LayoutServerLoad } from './$types';
import type { SanityNavItem, SanitySiteSettings } from '$lib/sanity/types';
import { env } from '$env/dynamic/private';

export const load: LayoutServerLoad = async ({ cookies }) => {
	// Check for preview mode
	const isPreview = cookies.get('sanity_preview') === 'true';
	const sanityClient =
		isPreview && env.SANITY_API_TOKEN ? getClient({ token: env.SANITY_API_TOKEN }) : client;

	const [navigation, siteSettings] = await Promise.all([
		sanityClient.fetch<SanityNavItem[]>(navigationQuery),
		sanityClient.fetch<SanitySiteSettings>(siteSettingsQuery)
	]);

	return {
		navigation,
		siteSettings,
		isPreview
	};
};
