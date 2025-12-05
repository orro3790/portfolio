/**
 * Preview mode API endpoint.
 * Enables preview mode by setting a cookie and redirecting to the target page.
 * @module routes/api/preview/+server
 *
 * Usage: /api/preview?secret=xxx&slug=project-slug
 */
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ url, cookies }) => {
	const secret = url.searchParams.get('secret');
	const slug = url.searchParams.get('slug') || '';

	// Validate the preview secret
	if (secret !== env.SANITY_PREVIEW_SECRET) {
		return new Response('Invalid token', { status: 401 });
	}

	// Set preview cookie
	cookies.set('sanity_preview', 'true', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: true,
		maxAge: 60 * 60 // 1 hour
	});

	// Redirect to the project page
	redirect(307, slug ? `/work/${slug}` : '/');
};
