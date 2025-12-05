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
			tags: ['Painting', 'Acrylic'],
			animationTemplate: 'slide-right'
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
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=450&h=600&fit=crop',
						alt: 'Abstract painting detail 1'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=450&h=600&fit=crop',
						alt: 'Abstract painting detail 2'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=450&h=600&fit=crop',
						alt: 'Abstract painting detail 3'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1551913902-c92207136625?w=450&h=600&fit=crop',
						alt: 'Abstract painting detail 4'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=450&h=600&fit=crop',
						alt: 'Abstract painting detail 5'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=450&h=600&fit=crop',
						alt: 'Abstract painting detail 6'
					}
				]
			},
			// 4. AsymmetricGrid: Large left, small top (like old TriGrid-2x2A)
			{
				type: 'asymmetric-grid',
				largePosition: 'left',
				smallPosition: 'top',
				media: [
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=600&fit=crop',
						alt: 'Layers composition - large'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=500&h=425&fit=crop',
						alt: 'Layers composition - small'
					}
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
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=640&fit=crop',
						alt: 'Layers large diagonal'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=400&h=320&fit=crop',
						alt: 'Layers small diagonal'
					}
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
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=700&h=560&fit=crop',
						alt: 'Layers DGU large image'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=480&h=410&fit=crop',
						alt: 'Layers DGU small image'
					}
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
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1573096108468-702f6014ef28?w=700&h=560&fit=crop',
						alt: 'Layers final large image'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=480&h=410&fit=crop',
						alt: 'Layers final small image'
					}
				]
			}
		]
	},
	{
		slug: 'urban-fragments',
		title: 'Myeongtae',
		subtitle: 'Mixed media collages capturing the essence of city life',
		meta: {
			projectType: 'Mixed Media',
			stage: 'Complete',
			deliverables: 'Collage, Photography',
			year: '2024'
		},
		heroImage: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&h=800&fit=crop',
		backgroundImage:
			'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=1920&h=1080&fit=crop',
		previewImage: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&h=800&fit=crop',
		accentColor: 'hsl(210, 25%, 20%)',
		preview: {
			description: 'Layered narratives from urban environments through collage and photography.',
			tags: ['Mixed Media', 'Collage'],
			animationTemplate: 'sweep-left'
		},
		sections: [
			{
				type: 't-grid-hero',
				eyebrow: 'Overview',
				text: 'Collaged street fragments become a map of motion,\nlayered with light leaks, xerox textures, and tape.'
			},
			{
				type: 'fw-std-53',
				media: [
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&h=960&fit=crop',
						alt: 'City collage full bleed'
					}
				]
			},
			{
				type: 'two-column',
				heading: 'Context',
				body: 'Shot across Seoul alleyways at blue hour, then deconstructed into fragments. Each layer keeps a trace of transit—metro tickets, neon reflections, and archival scans.',
				eyebrow: 'Story',
				layout: 'heading-left'
			},
			{
				type: 'asymmetric-grid',
				largePosition: 'left',
				smallPosition: 'top',
				media: [
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=900&h=720&fit=crop',
						alt: 'Mixed media collage feature'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?w=700&h=560&fit=crop',
						alt: 'Detail of layered paper textures'
					}
				],
				textContent:
					'Hand-torn edges sit beside clean digital cuts to keep the tension between analog and screen.'
			},
			{
				type: 't-grid-left',
				eyebrow: 'Process',
				text: 'Print → tear → rescan → stitch. Each pass adds grit while preserving the glow of streetlights.'
			},
			{
				type: 'vertical-carousel',
				heading: 'Vertical Sequence',
				body: 'Six portrait panels rotate through a pinned stack. Each frame mixes paper texture, neon wash, and xerox haze to show how the city shifts as you move through it.',
				eyebrow: 'Series',
				media: [
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&h=1200',
						alt: 'Collage panel 1'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&h=1200',
						alt: 'Collage panel 2'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&h=1200',
						alt: 'Collage panel 3'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&h=1200',
						alt: 'Collage panel 4'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=900&h=1200',
						alt: 'Collage panel 5'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&h=1200',
						alt: 'Collage panel 6'
					}
				]
			},
			{
				type: 'quad-grid',
				gap: 'medium',
				aspectRatio: '1/1',
				media: [
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=640&h=480&fit=crop',
						alt: 'Quadrant collage A'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=640&h=480&fit=crop',
						alt: 'Quadrant collage B'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=640&h=480&fit=crop',
						alt: 'Quadrant collage C'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=640&h=480&fit=crop',
						alt: 'Quadrant collage D'
					}
				]
			},
			{
				type: 't-grid-right',
				eyebrow: 'Field Notes',
				text: 'I collect fragments during long walks—ticket stubs, newsprint, and building reflections—then orchestrate them like a skyline.'
			},
			{
				type: 'diagonal',
				media: [
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&h=720&fit=crop',
						alt: 'Diagonal large collage'
					},
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1441123100240-f9f3f77ed41b?w=600&h=480&fit=crop',
						alt: 'Diagonal small collage'
					}
				]
			},
			{
				type: 'fw-std-53',
				media: [
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=960&fit=crop',
						alt: 'Full bleed night collage'
					}
				]
			},
			{
				type: 't-grid-left',
				eyebrow: 'Reflection',
				text: 'These pieces sit between documentary and dreamscape—holding the hum of the city while softening its edges.'
			}
		]
	},
	{
		slug: 'light-studies',
		title: 'Becoming Data',
		subtitle: 'A photographic exploration of natural light in interior spaces',
		meta: {
			projectType: 'Photography',
			stage: 'Series',
			deliverables: 'Digital Photography',
			year: '2023'
		},
		heroImage: 'https://images.unsplash.com/photo-1502759683299-cdcd6974244f?w=1200&h=800&fit=crop',
		backgroundImage:
			'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop',
		previewImage:
			'https://images.unsplash.com/photo-1502759683299-cdcd6974244f?w=1200&h=800&fit=crop',
		accentColor: 'hsl(45, 30%, 25%)',
		preview: {
			description: 'Capturing the poetry of natural light as it transforms interior spaces.',
			tags: ['Photography', 'Digital'],
			animationTemplate: 'image-left'
		},
		sections: [
			{
				type: 'full-bleed-image',
				media: [
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1502759683299-cdcd6974244f?w=1200&h=800&fit=crop',
						alt: 'Light Studies main photograph'
					}
				]
			}
		]
	},
	{
		slug: 'ceramic-vessels',
		title: 'Banchan',
		subtitle: 'Handcrafted stoneware exploring organic forms',
		meta: {
			projectType: 'Sculpture',
			stage: 'Collection',
			deliverables: 'Stoneware, Glaze',
			year: '2023'
		},
		heroImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&h=800&fit=crop',
		backgroundImage:
			'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=1920&h=1080&fit=crop',
		previewImage:
			'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&h=800&fit=crop',
		accentColor: 'hsl(25, 35%, 30%)',
		preview: {
			description: 'Handcrafted stoneware vessels inspired by organic forms found in nature.',
			tags: ['Sculpture', 'Ceramics'],
			animationTemplate: 'cascade-left'
		},
		sections: [
			{
				type: 'full-bleed-image',
				media: [
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&h=800&fit=crop',
						alt: 'Ceramic Vessels collection'
					}
				]
			}
		]
	},
	{
		slug: 'abstract-narratives',
		title: 'Hyper-Personal',
		subtitle: 'Charcoal and ink drawings telling wordless stories',
		meta: {
			projectType: 'Drawing',
			stage: 'Complete',
			deliverables: 'Charcoal, Ink',
			year: '2024'
		},
		heroImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&h=800&fit=crop',
		backgroundImage:
			'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1920&h=1080&fit=crop',
		previewImage:
			'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&h=800&fit=crop',
		accentColor: 'hsl(220, 25%, 15%)',
		preview: {
			description: 'Wordless stories told through expressive charcoal and ink compositions.',
			tags: ['Drawing', 'Charcoal'],
			animationTemplate: 'slide-right'
		},
		sections: [
			{
				type: 'full-bleed-image',
				media: [
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&h=800&fit=crop',
						alt: 'Hyper-Personal main drawing'
					}
				]
			}
		]
	},
	{
		slug: 'dental-chair',
		title: 'Waiting Room',
		subtitle: 'Exploring childhood memories and waiting room experiences',
		meta: {
			projectType: 'Installation',
			stage: 'Complete',
			deliverables: 'Mixed Media',
			year: '2024'
		},
		heroImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=800&fit=crop',
		backgroundImage:
			'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=1920&h=1080&fit=crop',
		previewImage:
			'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=800&fit=crop',
		accentColor: 'hsl(180, 30%, 25%)',
		preview: {
			description:
				'An exploration of childhood memories through the lens of waiting room experiences.',
			tags: ['Installation', 'Mixed Media'],
			animationTemplate: 'sweep-left'
		},
		sections: [
			{
				type: 'full-bleed-image',
				media: [
					{
						type: 'image',
						src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&h=800&fit=crop',
						alt: 'Waiting Room installation'
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
	preview: p.preview,
	animationTemplate: p.preview?.animationTemplate
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
