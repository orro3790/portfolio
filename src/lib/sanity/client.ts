/**
 * Sanity client configuration with preview mode support.
 * @module lib/sanity/client
 */
import { createClient, type ClientConfig } from '@sanity/client';

const config: ClientConfig = {
	projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'mrcn4yss',
	dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
	apiVersion: '2024-01-01',
	useCdn: true
};

/**
 * Default client for published content (uses CDN)
 */
export const client = createClient(config);

/**
 * Preview client for draft content (no CDN, requires token)
 */
export function getPreviewClient(token: string) {
	return createClient({
		...config,
		useCdn: false,
		token,
		perspective: 'previewDrafts'
	});
}

/**
 * Get the appropriate client based on preview mode
 */
export function getClient(preview?: { token: string }) {
	return preview ? getPreviewClient(preview.token) : client;
}
