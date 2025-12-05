/**
 * Root layout server load.
 * Provides navigation data and site settings to all pages.
 * @module routes/+layout.server
 */
import { client, getClient } from '$lib/sanity/client';
import { navigationQuery, siteSettingsQuery } from '$lib/sanity/queries';
import type { LayoutServerLoad } from './$types';
import type { NavItemWithPreview } from '$lib/schemas/project';
import type { SanityNavItem, SanitySiteSettings } from '$lib/sanity/types';
import { getImageUrl } from '$lib/sanity/imageUrl';
import { env } from '$env/dynamic/private';

export const load: LayoutServerLoad = async ({ cookies }) => {
	// Check for preview mode
	const isPreview = cookies.get('sanity_preview') === 'true';
	const sanityClient =
		isPreview && env.SANITY_API_TOKEN ? getClient({ token: env.SANITY_API_TOKEN }) : client;

	const [navigationRaw, siteSettings] = await Promise.all([
		sanityClient.fetch<SanityNavItem[]>(navigationQuery),
		sanityClient.fetch<SanitySiteSettings>(siteSettingsQuery)
	]);

	const navigation: NavItemWithPreview[] = navigationRaw.map((item) => ({
		slug: item.slug,
		title: item.title,
		subtitle: undefined,
		previewImage: getImageUrl(item.previewImage, { width: 1200 }) || '',
		heroImage: getImageUrl(item.previewImage, { width: 1200 }) || undefined,
		backgroundImage: getImageUrl(item.backgroundImage, { width: 1920 }) || undefined,
		accentColor: item.accentColor,
		preview:
			item.previewDescription || item.previewTags
				? {
						description: item.previewDescription ?? '',
						tags: item.previewTags ?? []
					}
				: undefined,
		animationTemplate: item.animationTemplate
	}));

	return {
		navigation,
		siteSettings,
		isPreview
	};
};
