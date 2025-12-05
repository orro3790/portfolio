/**
 * TypeScript interfaces for Sanity data structures.
 * @module lib/sanity/types
 */
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import type {AnimationTemplate} from '$lib/schemas/project'

/**
 * Sanity image object with asset reference and optional hotspot/crop.
 */
export interface SanityImage extends SanityImageSource {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
  alt?: string
  caption?: string
}

/**
 * Sanity project document from query.
 */
export interface SanityProject {
  _id: string
  title: string
  slug: string
  subtitle?: string
  template?: string
  projectType: string
  stage?: string
  deliverables?: string
  year?: string
  accentColor?: string
  heroImage: SanityImage
  sections?: SanitySection[]
}

/**
 * Section data from Sanity (union of all section types).
 */
export interface SanitySection {
  _type: string
  _key: string
  // Common fields
  variant?: 'hero' | 'left' | 'right'
  eyebrow?: string
  text?: string
  heading?: string
  body?: string
  layout?: 'heading-left' | 'heading-right'
  // Full-bleed image
  image?: SanityImage
  revealFrom?: 'left' | 'right' | 'bottom'
  // Array of images
  images?: SanityImage[]
  initialIndex?: number
  aspectRatio?: string
  // Asymmetric/Diagonal
  largePosition?: 'left' | 'right'
  smallPosition?: 'top' | 'bottom'
  imageLarge?: SanityImage
  imageSmall?: SanityImage
  textContent?: string
  staggerAmount?: string
  // Grid
  gap?: 'none' | 'small' | 'medium' | 'large'
  columns?: number
}

/**
 * Navigation item from Sanity.
 */
export interface SanityNavItem {
  title: string
  slug: string
  previewImage: SanityImage
  backgroundImage?: SanityImage
  accentColor?: string
  previewDescription?: string
  previewTags?: string[]
  animationTemplate?: AnimationTemplate
}

/**
 * Site settings from Sanity.
 */
export interface SanitySiteSettings {
  siteTitle?: string
  artistName?: string
  artistSubtitle?: string
  portrait?: SanityImage
  instagram?: string
  email?: string
  bioHeading?: string
  bio?: string
  heroTitle?: string
  heroSubtitle?: string
}

/**
 * List item for projects in navigation/grid.
 */
export interface SanityProjectListItem {
  _id: string
  title: string
  slug: string
  subtitle?: string
  projectType: string
  year?: string
  accentColor?: string
  heroImage: SanityImage
  previewImage: SanityImage
  backgroundImage?: SanityImage
  previewDescription?: string
  previewTags?: string[]
  animationTemplate?: AnimationTemplate
}

