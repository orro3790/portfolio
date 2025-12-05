/**
 * GROQ queries for fetching content from Sanity.
 * Returns full image objects for @sanity/image-url processing.
 * @module lib/sanity/queries
 */

/**
 * Get all published projects for navigation and "All Works" page.
 * Returns full image objects to support hotspot/crop.
 */
export const projectsListQuery = `*[_type == "project"] | order(order asc) {
  _id,
  title,
  "slug": slug.current,
  subtitle,
  projectType,
  year,
  accentColor,
  heroImage,
  "previewImage": coalesce(previewImage, heroImage),
  backgroundImage,
  previewDescription,
  previewTags,
  animationTemplate
}`

/**
 * Get all project slugs for static prerendering.
 */
export const projectSlugsQuery = `*[_type == "project"].slug.current`

/**
 * Get a single project by slug with all section data.
 * Returns full image objects for @sanity/image-url processing.
 */
export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  subtitle,
  template,
  projectType,
  stage,
  deliverables,
  year,
  accentColor,
  heroImage,
  sections[] {
    _type,
    _key,
    
    // Text sections
    variant,
    eyebrow,
    text,
    
    // Two-column
    layout,
    heading,
    body,
    
    // Full-bleed image
    image,
    revealFrom,
    
    // Carousel & Grid images
    images,
    initialIndex,
    aspectRatio,
    
    // Asymmetric & Diagonal
    largePosition,
    smallPosition,
    imageLarge,
    imageSmall,
    textContent,
    staggerAmount,
    
    // Grid options
    gap,
    columns
  }
}`

/**
 * Get site settings (singleton document).
 */
export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  siteTitle,
  artistName,
  artistSubtitle,
  portrait,
  instagram,
  email,
  bioHeading,
  bio,
  heroTitle,
  heroSubtitle
}`

/**
 * Get navigation items (for Header/Footer).
 * Returns full image objects for srcset generation.
 */
export const navigationQuery = `*[_type == "project"] | order(order asc) {
  title,
  "slug": slug.current,
  "previewImage": coalesce(previewImage, heroImage),
  backgroundImage,
  accentColor,
  previewDescription,
  previewTags,
  animationTemplate
}`

