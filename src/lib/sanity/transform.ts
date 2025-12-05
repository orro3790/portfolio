/**
 * Transform functions to convert Sanity data to frontend types.
 * @module lib/sanity/transform
 */
import type {SanitySection, SanityProject, SanityImage} from './types'
import type {Section, Media, Project} from '$lib/schemas/project'
import {getImageUrl} from './imageUrl'

/**
 * Transform Sanity image to frontend Media type with optimized URL.
 */
function imageToMedia(image?: SanityImage, width = 1200): Media {
  if (!image?.asset) {
    return {type: 'image', src: '', alt: ''}
  }
  return {
    type: 'image',
    src: getImageUrl(image, {width}),
    alt: image.alt,
    caption: image.caption,
  }
}

/**
 * Transform Sanity section data to frontend Section type.
 */
export function transformSection(section: SanitySection): Section {
  switch (section._type) {
    case 'tGridSection':
      return {
        type:
          section.variant === 'hero'
            ? 't-grid-hero'
            : section.variant === 'right'
              ? 't-grid-right'
              : 't-grid-left',
        text: section.text || '',
        eyebrow: section.eyebrow,
      }

    case 'fullBleedImage':
      return {
        type: 'fw-std-53',
        media: [imageToMedia(section.image, 1920)],
        revealFrom: section.revealFrom,
      }

    case 'carousel':
      return {
        type: 'carousel',
        media: section.images?.map((img) => imageToMedia(img, 800)) || [],
        initialIndex: section.initialIndex,
        aspectRatio: section.aspectRatio,
      }

    case 'verticalCarousel':
      return {
        type: 'vertical-carousel',
        heading: section.heading || '',
        body: section.body || '',
        eyebrow: section.eyebrow,
        media: section.images?.map((img) => imageToMedia(img, 900)) || [],
      }

    case 'asymmetricGrid':
      return {
        type: 'asymmetric-grid',
        largePosition: section.largePosition,
        smallPosition: section.smallPosition,
        media: [imageToMedia(section.imageLarge, 1000), imageToMedia(section.imageSmall, 600)],
        textContent: section.textContent,
      }

    case 'diagonal':
      return {
        type: 'diagonal',
        media: [imageToMedia(section.imageLarge, 1000), imageToMedia(section.imageSmall, 600)],
      }

    case 'quadGrid':
      return {
        type: 'quad-grid',
        media: section.images?.map((img) => imageToMedia(img, 800)) || [],
        gap: section.gap,
        aspectRatio: section.aspectRatio,
      }

    case 'twoColumn':
      return {
        type: 'two-column',
        heading: section.heading || '',
        body: section.body || '',
        eyebrow: section.eyebrow,
        layout: section.layout,
      }

    case 'imageGrid':
      return {
        type: 'image-grid',
        media: section.images?.map((img) => imageToMedia(img, 600)) || [],
        gap: section.gap,
      }

    default:
      return {type: 't-grid-left', text: 'Unknown section type'}
  }
}

/**
 * Transform full Sanity project to frontend Project type.
 */
export function transformProject(sanityProject: SanityProject): Project {
  return {
    slug: sanityProject.slug,
    title: sanityProject.title,
    subtitle: sanityProject.subtitle,
    meta: {
      projectType: sanityProject.projectType,
      stage: sanityProject.stage || 'Complete',
      deliverables: sanityProject.deliverables || '',
      year: sanityProject.year,
    },
    heroImage: getImageUrl(sanityProject.heroImage, {width: 1920}),
    accentColor: sanityProject.accentColor,
    sections: sanityProject.sections?.map(transformSection) || [],
  }
}


