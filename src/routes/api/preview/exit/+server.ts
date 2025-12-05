/**
 * Exit preview mode API endpoint.
 * Clears the preview cookie and redirects to home.
 * @module routes/api/preview/exit/+server
 */
import {redirect} from '@sveltejs/kit'
import type {RequestHandler} from './$types'

export const GET: RequestHandler = async ({cookies}) => {
  // Clear the preview cookie
  cookies.delete('sanity_preview', {path: '/'})

  // Redirect to home
  redirect(307, '/')
}


