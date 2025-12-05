/**
 * Image URL builder with automatic crop/hotspot support.
 * Uses @sanity/image-url to generate optimized CDN URLs.
 * @module lib/sanity/imageUrl
 */
import {createImageUrlBuilder} from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {client} from './client'

const builder = createImageUrlBuilder(client)

/**
 * Build image URL with automatic crop/hotspot application
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Get optimized image URL with specified dimensions.
 * Automatically applies hotspot/crop from Sanity.
 */
export function getImageUrl(
  source: SanityImageSource | undefined | null,
  options?: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
  }
): string {
  if (!source) return ''

  let img = builder.image(source).auto('format')

  if (options?.width) img = img.width(options.width)
  if (options?.height) img = img.height(options.height)
  if (options?.quality) img = img.quality(options.quality)
  if (options?.format) img = img.format(options.format)

  return img.url()
}

/**
 * Get responsive image srcset for various widths.
 */
export function getImageSrcSet(
  source: SanityImageSource | undefined | null,
  widths: number[] = [400, 800, 1200, 1600, 2000]
): string {
  if (!source) return ''

  return widths
    .map((w) => `${urlFor(source).width(w).auto('format').url()} ${w}w`)
    .join(', ')
}


