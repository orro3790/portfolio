/**
 * Server-side data loading for the All Works page.
 * Fetches all projects from Sanity for the grid display.
 * @module routes/work/+page.server
 */
import {client, getClient} from '$lib/sanity/client'
import {projectsListQuery} from '$lib/sanity/queries'
import type {PageServerLoad} from './$types'
import type {SanityProjectListItem} from '$lib/sanity/types'
import {env} from '$env/dynamic/private'

export const prerender = true

export const load: PageServerLoad = async ({cookies}) => {
  // Check for preview mode
  const isPreview = cookies.get('sanity_preview') === 'true'
  const sanityClient =
    isPreview && env.SANITY_API_TOKEN ? getClient({token: env.SANITY_API_TOKEN}) : client

  const projects = await sanityClient.fetch<SanityProjectListItem[]>(projectsListQuery)

  return {
    projects,
    isPreview,
  }
}


