import type { Project, NavItem, NavItemWithPreview } from '$lib/schemas/project';

/**
 * Placeholder art projects for the portfolio.
 * Replace with actual content from the artist's portfolio PDF.
 */
export const projects: Project[] = [
	{
		slug: 'layers',
		title: 'Layers',
		subtitle: 'A collection of abstract acrylic studies',
		meta: {
			projectType: 'Painting',
			stage: 'Complete',
			deliverables: 'Acrylic on Paper',
			year: '2024'
		},
		heroImage: '/images/portfolio-processed/layers/landing-page-thumbnail.png',
		backgroundImage: '/images/portfolio-processed/layers/landing-page-bg.png',
		previewImage: '/images/portfolio-processed/layers/landing-page-thumbnail.png',
		accentColor: 'hsl(340, 45%, 25%)',
		preview: {
			description:
				'Exploring color relationships and texture through layered acrylic compositions.',
			tags: ['Painting', 'Acrylic']
		},
		sections: [
			// 1. T-grid-hero: Overview intro text
			{
				type: 't-grid-hero',
				eyebrow: 'Overview',
				text: 'A visual exploration of depth, texture,\nand the interplay between chaos\nand intentional structure.'
			},
			// 2. FW-STD-53: Full-width hero image (5:3 aspect)
			{
				type: 'fw-std-53',
				media: [
					{
						type: 'image',
						src: '/images/portfolio-processed/layers/landing-page-bg.png',
						alt: 'Layers hero composition'
					}
				]
			},
			// 3. Carousel: 6 portrait images (3:4 aspect), start on photo 3
			{
				type: 'carousel',
				initialIndex: 2,
				media: [
					{ type: 'image', src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=450&h=600&fit=crop', alt: 'Abstract painting detail 1' },
					{ type: 'image', src: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=450&h=600&fit=crop', alt: 'Abstract painting detail 2' },
					{ type: 'image', src: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=450&h=600&fit=crop', alt: 'Abstract painting detail 3' },
					{ type: 'image', src: 'https://images.unsplash.com/photo-1551913902-c92207136625?w=450&h=600&fit=crop', alt: 'Abstract painting detail 4' },
					{ type: 'image', src: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=450&h=600&fit=crop', alt: 'Abstract painting detail 5' },
					{ type: 'image', src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=450&h=600&fit=crop', alt: 'Abstract painting detail 6' }
				]
			},
			// 4. AsymmetricGrid: Large left, small top (like old TriGrid-2x2A)
			{
				type: 'asymmetric-grid',
				largePosition: 'left',
				smallPosition: 'top',
				media: [
					{ type: 'image', src: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=600&fit=crop', alt: 'Layers composition - large' },
					{ type: 'image', src: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&h=425&fit=crop', alt: 'Layers composition - small' }
				]
			},
			// 5. T-grid-right: Process description
			{
				type: 't-grid-right',
				eyebrow: 'Process',
				text: 'Each piece begins with a foundation\nof spontaneous marks, gradually\nrefined through layering.'
			},
			// 6. Diagonal: Large top-left, small bottom-right
			{
				type: 'diagonal',
				media: [
					{ type: 'image', src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=640&fit=crop', alt: 'Layers large diagonal' },
					{ type: 'image', src: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=400&h=320&fit=crop', alt: 'Layers small diagonal' }
				]
			},
			// 7. T-grid-left: Materials description
			{
				type: 't-grid-left',
				eyebrow: 'Materials',
				text: 'Acrylic on heavyweight paper,\nbuilding surface tension through\nmultiple transparent washes.'
			},
			// 8. FW-STD-53: Another full-width image
			{
				type: 'fw-std-53',
				media: [
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200&h=720&fit=crop',
						alt: 'Layers full-width detail'
					}
				]
			},
			// 9. AsymmetricGrid: Large right, small top (flipped from #4)
			{
				type: 'asymmetric-grid',
				largePosition: 'right',
				smallPosition: 'top',
				media: [
					{ type: 'image', src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=700&h=560&fit=crop', alt: 'Layers DGU large image' },
					{ type: 'image', src: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=480&h=410&fit=crop', alt: 'Layers DGU small image' }
				]
			},
			// 10. T-grid-left: Reflection
			{
				type: 't-grid-left',
				eyebrow: 'Reflection',
				text: 'The finished works reveal moments\nof tension and release, capturing\nthe essence of the creative process.'
			},
			// 11. AsymmetricGrid: Large right, small bottom
			{
				type: 'asymmetric-grid',
				largePosition: 'right',
				smallPosition: 'bottom',
				media: [
					{ type: 'image', src: 'https://images.unsplash.com/photo-1573096108468-702f6014ef28?w=700&h=560&fit=crop', alt: 'Layers final large image' },
					{ type: 'image', src: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=480&h=410&fit=crop', alt: 'Layers final small image' }
				]
			}
		]
	},
	{
		slug: 'urban-fragments',
		title: '명태',
		subtitle: 'Mixed media collages capturing the essence of city life',
		meta: {
			projectType: 'Mixed Media',
			stage: 'Complete',
			deliverables: 'Collage, Photography',
			year: '2024'
		},
		heroImage: '/images/placeholder-2.svg',
		previewImage: '/images/placeholder-2.svg',
		accentColor: 'hsl(210, 25%, 20%)',
		preview: {
			description: 'Layered narratives from urban environments through collage and photography.',
			tags: ['Mixed Media', 'Collage']
		},
		sections: [
			{
				type: 'fullwidth',
				media: [
					{
						type: 'image',
						src: '/images/placeholder-2.svg',
						alt: 'Urban Fragments main artwork'
					}
				]
			},
			{
				type: 'text',
				title: 'Process',
				text: "Each piece in this series combines found materials from urban environments with original photography. The layering technique creates depth and tells stories of the city's hidden narratives."
			}
		]
	},
	{
		slug: 'light-studies',
		title: '데이터가 된 나',
		subtitle: 'A photographic exploration of natural light in interior spaces',
		meta: {
			projectType: 'Photography',
			stage: 'Series',
			deliverables: 'Digital Photography',
			year: '2023'
		},
		heroImage: '/images/placeholder-3.svg',
		previewImage: '/images/placeholder-3.svg',
		accentColor: 'hsl(45, 30%, 25%)',
		preview: {
			description: 'Capturing the poetry of natural light as it transforms interior spaces.',
			tags: ['Photography', 'Digital']
		},
		sections: [
			{
				type: 'fullwidth',
				media: [
					{
						type: 'image',
						src: '/images/placeholder-3.svg',
						alt: 'Light Studies main photograph'
					}
				]
			}
		]
	},
	{
		slug: 'ceramic-vessels',
		title: '반찬',
		subtitle: 'Handcrafted stoneware exploring organic forms',
		meta: {
			projectType: 'Sculpture',
			stage: 'Collection',
			deliverables: 'Stoneware, Glaze',
			year: '2023'
		},
		heroImage: '/images/placeholder-4.svg',
		previewImage: '/images/placeholder-4.svg',
		accentColor: 'hsl(25, 35%, 30%)',
		preview: {
			description: 'Handcrafted stoneware vessels inspired by organic forms found in nature.',
			tags: ['Sculpture', 'Ceramics']
		},
		sections: [
			{
				type: 'fullwidth',
				media: [
					{
						type: 'image',
						src: '/images/placeholder-4.svg',
						alt: 'Ceramic Vessels collection'
					}
				]
			}
		]
	},
	{
		slug: 'abstract-narratives',
		title: '초개인화',
		subtitle: 'Charcoal and ink drawings telling wordless stories',
		meta: {
			projectType: 'Drawing',
			stage: 'Complete',
			deliverables: 'Charcoal, Ink',
			year: '2024'
		},
		heroImage: '/images/placeholder-5.svg',
		previewImage: '/images/placeholder-5.svg',
		accentColor: 'hsl(220, 25%, 15%)',
		preview: {
			description: 'Wordless stories told through expressive charcoal and ink compositions.',
			tags: ['Drawing', 'Charcoal']
		},
		sections: [
			{
				type: 'fullwidth',
				media: [
					{
						type: 'image',
						src: '/images/placeholder-5.jpg',
						alt: 'Abstract Narratives main drawing'
					}
				]
			}
		]
	},
	{
		slug: 'dental-chair',
		title: '어린이치과 대기실 의자',
		subtitle: 'Exploring childhood memories and waiting room experiences',
		meta: {
			projectType: 'Installation',
			stage: 'Complete',
			deliverables: 'Mixed Media',
			year: '2024'
		},
		heroImage: '/images/placeholder-6.svg',
		previewImage: '/images/placeholder-6.svg',
		accentColor: 'hsl(180, 30%, 25%)',
		preview: {
			description: 'An exploration of childhood memories through the lens of waiting room experiences.',
			tags: ['Installation', 'Mixed Media']
		},
		sections: [
			{
				type: 'fullwidth',
				media: [
					{
						type: 'image',
						src: '/images/placeholder-6.svg',
						alt: 'Dental chair installation'
					}
				]
			}
		]
	}
];

/**
 * Get navigation items from projects
 */
export const navItems: NavItem[] = projects.map((p) => ({
	slug: p.slug,
	title: p.title
}));

/**
 * Get navigation items with full preview data
 */
export const navItemsWithPreview: NavItemWithPreview[] = projects.map((p) => ({
	slug: p.slug,
	title: p.title,
	subtitle: p.subtitle,
	previewImage: p.previewImage || p.heroImage,
	heroImage: p.heroImage,
	backgroundImage: p.backgroundImage,
	accentColor: p.accentColor,
	preview: p.preview
}));

/**
 * Find a project by slug
 */
export function getProjectBySlug(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug);
}

/**
 * Get the next project (for navigation)
 */
export function getNextProject(currentSlug: string): Project | undefined {
	const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
	if (currentIndex === -1) return undefined;
	const nextIndex = (currentIndex + 1) % projects.length;
	return projects[nextIndex];
}

/**
 * Get the previous project (for navigation)
 */
export function getPreviousProject(currentSlug: string): Project | undefined {
	const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
	if (currentIndex === -1) return undefined;
	const prevIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
	return projects[prevIndex];
}
