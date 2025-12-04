import { z } from 'zod';

/**
 * Schema for a media item (image or video)
 */
export const mediaSchema = z.object({
	type: z.enum(['image', 'video']),
	src: z.string(),
	alt: z.string().optional(),
	caption: z.string().optional()
});

export type Media = z.infer<typeof mediaSchema>;

/**
 * Schema for a content section within a project.
 *
 * Section Type Naming Convention (simplified):
 * - t-grid-*: Text-only sections on 6-column grid (hero/left/right)
 * - fw-*: Full-width image sections
 * - carousel: Horizontal scrolling gallery
 * - asymmetric-grid: 2-column layout with large+small images
 * - diagonal: Staggered large/small image layout
 */
export const sectionSchema = z.object({
	type: z.enum([
		// Animated section templates
		'text-reveal',
		'full-bleed-image',
		'double-image',
		'two-column',
		'image-grid',
		// Text sections (6-column grid)
		't-grid-hero',
		't-grid-left',
		't-grid-right',
		// Full-width image section
		'fw-std-53',
		// Carousel
		'carousel',
		// Asymmetric grid
		'asymmetric-grid',
		// Diagonal layout
		'diagonal'
	]),
	// Media items (for image-based sections)
	media: z.array(mediaSchema).optional(),
	// Text content
	title: z.string().optional(),
	text: z.string().optional(),
	heading: z.string().optional(),
	body: z.string().optional(),
	eyebrow: z.string().optional(),
	// Layout options
	layout: z.enum(['left', 'right', 'center', 'heading-left', 'heading-right']).optional(),
	// Animation options
	revealFrom: z.enum(['left', 'right', 'bottom']).optional(),
	// Grid options
	gap: z.enum(['none', 'small', 'medium', 'large']).optional(),
	aspectRatio: z.string().optional(),
	// Carousel options
	initialIndex: z.number().optional(),
	// Asymmetric grid options (semantic naming for Sanity)
	largePosition: z.enum(['left', 'right']).optional(),
	smallPosition: z.enum(['top', 'bottom']).optional(),
	textContent: z.string().optional()
});

export type Section = z.infer<typeof sectionSchema>;

/**
 * Schema for project metadata
 */
export const projectMetaSchema = z.object({
	projectType: z.string(),
	stage: z.string(),
	deliverables: z.string(),
	year: z.string().optional()
});

export type ProjectMeta = z.infer<typeof projectMetaSchema>;

/**
 * Schema for hover preview data
 */
export const previewSchema = z.object({
	description: z.string(),
	tags: z.array(z.string()),
	backgroundColor: z.string().optional(),
	backgroundImage: z.string().optional()
});

export type Preview = z.infer<typeof previewSchema>;

/**
 * Full project schema
 */
export const projectSchema = z.object({
	slug: z.string(),
	title: z.string(),
	subtitle: z.string().optional(),
	meta: projectMetaSchema,
	heroImage: z.string(),
	backgroundImage: z.string().optional(),
	previewImage: z.string().optional(),
	accentColor: z.string().optional(),
	preview: previewSchema.optional(),
	sections: z.array(sectionSchema).optional()
});

export type Project = z.infer<typeof projectSchema>;

/**
 * Schema for navigation item (basic)
 */
export const navItemSchema = z.object({
	slug: z.string(),
	title: z.string()
});

export type NavItem = z.infer<typeof navItemSchema>;

/**
 * Schema for navigation item with full preview data
 */
export const navItemWithPreviewSchema = z.object({
	slug: z.string(),
	title: z.string(),
	subtitle: z.string().optional(),
	previewImage: z.string(),
	heroImage: z.string().optional(),
	backgroundImage: z.string().optional(),
	accentColor: z.string().optional(),
	preview: previewSchema.optional()
});

export type NavItemWithPreview = z.infer<typeof navItemWithPreviewSchema>;
