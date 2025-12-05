# Sanity CMS Integration Plan

**Goal:** Enable non-technical users to create and manage `/work/{slug}` portfolio pages through Sanity Studio, with automatic navigation updates, template selection, and configurable section layouts.

**Revision Note:** Updated to integrate with existing Studio at `/studio-art-portfolio/`, fix hotspot schema syntax, implement proper image URL handling with crop/hotspot, add prerender support for static builds, and complete preview mode implementation.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Phase 1: Existing Studio Integration](#phase-1-existing-studio-integration)
4. [Phase 2: Schema Design](#phase-2-schema-design)
5. [Phase 3: SvelteKit Integration](#phase-3-sveltekit-integration)
6. [Phase 4: Template System](#phase-4-template-system)
7. [Phase 5: Static Build & Preview Mode](#phase-5-static-build--preview-mode)
8. [Phase 6: Deployment](#phase-6-deployment)
9. [Suggested Additional Features](#suggested-additional-features)
10. [Technical Reference](#technical-reference)

---

## Overview

### Key User Stories

1. **Create a project page:** User selects a template, fills in project metadata, and the page is automatically available at `/work/{slug}` with navigation updates.
2. **Customize sections:** User can override template defaults, reorder sections, and configure section-specific options (layout, media placement).
3. **Upload images with guidance:** User sees aspect ratio recommendations for each image slot to maintain design consistency.
4. **Preview before publish:** User can preview draft changes before making them live.

### Design Principles

- **Template-first workflow:** Users start by selecting one of 4 pre-designed templates, then customize as needed.
- **Visual guidance:** Clear descriptions and aspect ratio hints throughout the CMS.
- **Guardrails:** Prevent anti-patterns (e.g., consecutive full-bleed images) through validation.
- **Zero-code updates:** Navigation, footer, and "All Works" page update automatically from Sanity content.

---

## Architecture

```
┌─────────────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Sanity Studio          │────▶│  Content Lake   │────▶│   SvelteKit     │
│  /studio-art-portfolio  │     │  (API/CDN)      │     │   (Frontend)    │
└─────────────────────────┘     └─────────────────┘     └─────────────────┘
        │                               │                       │
        │                               │                       │
   [Schema Types]                [GROQ Queries]          [Static Build]
   - project                     - Full asset refs       - Prerender entries
   - siteSettings                - With hotspot/crop     - Webhook rebuilds
   - section objects             - Navigation data       - @sanity/image-url
```

### Data Flow

1. **Build time:** SvelteKit fetches all project slugs, prerenders each `/work/[slug]` page.
2. **On publish:** Webhook triggers Vercel rebuild (full site rebuild for static adapter).
3. **Image delivery:** `@sanity/image-url` applies crop/hotspot transforms via Sanity CDN.
4. **Preview mode:** Cookie enables draft content via `useCdn: false` + API token.

---

## Phase 1: Existing Studio Integration

### 1.1 Existing Studio Location

The studio already exists at `/studio-art-portfolio/` with:
- **Project ID:** `mrcn4yss`
- **Dataset:** `production`
- **Schema types:** Empty array (ready for new schemas)

**No re-initialization required.** We will add schemas directly to the existing project.

### 1.2 Directory Structure (After Integration)

```
portfolio/
├── studio-art-portfolio/           # EXISTING Sanity Studio
│   ├── sanity.config.ts           # Update: add document actions
│   ├── sanity.cli.ts
│   ├── schemaTypes/
│   │   ├── index.ts               # Update: export all schemas
│   │   ├── documents/
│   │   │   ├── project.ts         # NEW
│   │   │   └── siteSettings.ts    # NEW
│   │   └── objects/
│   │       └── sections/
│   │           ├── tGridSection.ts      # NEW
│   │           ├── fullBleedImage.ts    # NEW
│   │           ├── carousel.ts          # NEW
│   │           ├── verticalCarousel.ts  # NEW
│   │           ├── asymmetricGrid.ts    # NEW
│   │           ├── diagonal.ts          # NEW
│   │           ├── quadGrid.ts          # NEW
│   │           ├── twoColumn.ts         # NEW
│   │           └── imageGrid.ts         # NEW
│   ├── actions/
│   │   ├── applyTemplate.ts       # NEW: template action
│   │   └── templateDefinitions.ts # NEW: template presets
│   └── structure/
│       └── deskStructure.ts       # NEW: custom desk structure
├── src/
│   ├── lib/
│   │   └── sanity/                # NEW: Sanity client & queries
│   │       ├── client.ts
│   │       ├── imageUrl.ts        # Image URL builder with transforms
│   │       ├── queries.ts
│   │       ├── types.ts
│   │       └── transform.ts
```

### 1.3 Environment Configuration

**`studio-art-portfolio/.env.local`** (gitignored):
```env
# Optional: Override project ID for local dev
# SANITY_STUDIO_PROJECT_ID=mrcn4yss
# SANITY_STUDIO_DATASET=production
```

**`portfolio/.env.local`** (gitignored):
```env
PUBLIC_SANITY_PROJECT_ID=mrcn4yss
PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-read-token        # Server-side only, for preview mode
SANITY_PREVIEW_SECRET=your-secret-key   # For preview mode authentication
```

---

## Phase 2: Schema Design

### 2.1 Hotspot Configuration (CORRECTED)

**Important:** The `hotspot` option accepts either a boolean OR an object with previews, NOT both. When providing previews, omit `hotspot: true`.

```typescript
// ✅ CORRECT: Object with previews (implicitly enables hotspot)
options: {
  hotspot: {
    previews: [
      { title: '5:3 (Landscape)', aspectRatio: 5 / 3 },
      { title: '16:9 (Cinematic)', aspectRatio: 16 / 9 }
    ]
  }
}

// ✅ CORRECT: Boolean only (no previews)
options: {
  hotspot: true
}

// ❌ WRONG: Both boolean and object (second overwrites first)
options: {
  hotspot: true,
  hotspot: { previews: [...] }  // This overwrites the boolean!
}
```

### 2.2 Section Schemas

Each section type as a separate object schema with clear descriptions and aspect ratio guidance.

```typescript
// studio-art-portfolio/schemaTypes/objects/sections/tGridSection.ts
import {defineType, defineField} from 'sanity'
import {TextIcon} from '@sanity/icons'

export const tGridSectionType = defineType({
  name: 'tGridSection',
  title: 'Text Section',
  type: 'object',
  icon: TextIcon,
  description: 'Large text block for statements, quotes, or process notes',
  fields: [
    defineField({
      name: 'variant',
      title: 'Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Hero (Large, Centered)', value: 'hero'},
          {title: 'Left Aligned', value: 'left'},
          {title: 'Right Aligned', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      description: 'Hero is large statement text. Left/Right shifts the visual weight.',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small label above the text (e.g., "Overview", "Process", "01")',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 4,
      description: 'Main text content. Use line breaks for intentional formatting.',
      validation: (Rule) => Rule.required().error('Text content is required'),
    }),
  ],
  preview: {
    select: {
      text: 'text',
      variant: 'variant',
      eyebrow: 'eyebrow',
    },
    prepare({text, variant, eyebrow}) {
      const variantLabels: Record<string, string> = {
        hero: '📣 Hero',
        left: '◀️ Left',
        right: '▶️ Right',
      }
      return {
        title: text?.substring(0, 50) + (text && text.length > 50 ? '...' : '') || 'Empty text section',
        subtitle: `${variantLabels[variant || 'left'] || variant}${eyebrow ? ` · ${eyebrow}` : ''}`,
      }
    },
  },
})
```

```typescript
// studio-art-portfolio/schemaTypes/objects/sections/fullBleedImage.ts
import {defineType, defineField} from 'sanity'
import {ImageIcon} from '@sanity/icons'

export const fullBleedImageType = defineType({
  name: 'fullBleedImage',
  title: 'Full-Width Image',
  type: 'object',
  icon: ImageIcon,
  description: 'Edge-to-edge image with high visual impact. Best for hero shots.',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: {
          previews: [
            {title: '5:3 (Recommended)', aspectRatio: 5 / 3},
            {title: '16:9 (Cinematic)', aspectRatio: 16 / 9},
          ],
        },
      },
      description: '📐 Recommended aspect ratio: 5:3 (landscape). Upload at least 1920px wide.',
      validation: (Rule) => Rule.required().error('Image is required'),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Describe the image for accessibility',
          validation: (Rule) => Rule.required().warning('Alt text improves accessibility'),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional text displayed below the image',
        }),
      ],
    }),
    defineField({
      name: 'revealFrom',
      title: 'Reveal Animation',
      type: 'string',
      options: {
        list: [
          {title: 'From Bottom (Default)', value: 'bottom'},
          {title: 'From Left', value: 'left'},
          {title: 'From Right', value: 'right'},
        ],
      },
      initialValue: 'bottom',
    }),
  ],
  preview: {
    select: {
      media: 'image',
      alt: 'image.alt',
    },
    prepare({media, alt}) {
      return {
        title: alt || 'Full-width image',
        subtitle: 'Full-bleed 5:3',
        media: media,
      }
    },
  },
})
```

```typescript
// studio-art-portfolio/schemaTypes/objects/sections/carousel.ts
import {defineType, defineField} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export const carouselType = defineType({
  name: 'carousel',
  title: 'Horizontal Carousel',
  type: 'object',
  icon: ImagesIcon,
  description: 'Swipeable gallery with center focus. Best for portrait series (3:4 aspect).',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: {
              previews: [{title: '3:4 (Portrait)', aspectRatio: 3 / 4}],
            },
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        },
      ],
      description: '📐 Use 4-8 portrait images (3:4 aspect ratio). 6 is ideal.',
      validation: (Rule) => Rule.min(4).max(8).error('Carousel requires 4-8 images'),
    }),
    defineField({
      name: 'initialIndex',
      title: 'Starting Position',
      type: 'number',
      description:
        'Which image to show first (starts at 0). Tip: Use middle index for better visual effect.',
      initialValue: 2,
      validation: (Rule) =>
        Rule.min(0).warning('Use a middle index (e.g., 2 for 6 images) for visual impact'),
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          {title: '3:4 Portrait (Default)', value: '3/4'},
          {title: '4:5 Instagram Portrait', value: '4/5'},
          {title: '1:1 Square', value: '1/1'},
        ],
      },
      initialValue: '3/4',
    }),
  ],
  preview: {
    select: {
      images: 'images',
      image0: 'images.0',
    },
    prepare({images, image0}) {
      return {
        title: `Carousel (${images?.length || 0} images)`,
        subtitle: 'Horizontal swipe gallery',
        media: image0,
      }
    },
  },
})
```

```typescript
// studio-art-portfolio/schemaTypes/objects/sections/verticalCarousel.ts
import {defineType, defineField} from 'sanity'
import {StackCompactIcon} from '@sanity/icons'

export const verticalCarouselType = defineType({
  name: 'verticalCarousel',
  title: 'Vertical Carousel',
  type: 'object',
  icon: StackCompactIcon,
  description:
    '⚠️ Immersive scroll-linked gallery. Use only ONCE per page. Text on left, rotating images on right.',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small label above heading (e.g., "Series")',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: {
              previews: [{title: '3:4 (Portrait)', aspectRatio: 3 / 4}],
            },
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        },
      ],
      description: '📐 Use 4-8 PORTRAIT images (3:4 aspect). These rotate as user scrolls.',
      validation: (Rule) => Rule.min(4).max(8).error('Requires 4-8 portrait images'),
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      images: 'images',
      image0: 'images.0',
    },
    prepare({heading, images, image0}) {
      return {
        title: heading || 'Vertical Carousel',
        subtitle: `Scroll-linked · ${images?.length || 0} images`,
        media: image0,
      }
    },
  },
})
```

```typescript
// studio-art-portfolio/schemaTypes/objects/sections/asymmetricGrid.ts
import {defineType, defineField} from 'sanity'
import {BlockElementIcon} from '@sanity/icons'

export const asymmetricGridType = defineType({
  name: 'asymmetricGrid',
  title: 'Asymmetric Grid',
  type: 'object',
  icon: BlockElementIcon,
  description: 'One large "feature" image paired with a smaller "detail" image.',
  fieldsets: [
    {name: 'layout', title: 'Layout Options'},
    {name: 'images', title: 'Images'},
  ],
  fields: [
    defineField({
      name: 'largePosition',
      title: 'Large Image Position',
      type: 'string',
      fieldset: 'layout',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'smallPosition',
      title: 'Small Image Position',
      type: 'string',
      fieldset: 'layout',
      options: {
        list: [
          {title: 'Top', value: 'top'},
          {title: 'Bottom', value: 'bottom'},
        ],
        layout: 'radio',
      },
      initialValue: 'top',
    }),
    defineField({
      name: 'imageLarge',
      title: 'Large Image (Feature)',
      type: 'image',
      fieldset: 'images',
      options: {
        hotspot: {
          previews: [
            {title: '1:1 (Square)', aspectRatio: 1},
            {title: '4:5 (Tall)', aspectRatio: 4 / 5},
          ],
        },
      },
      description: '📐 Recommended: Square (1:1) or slightly tall (4:5). At least 800px wide.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageSmall',
      title: 'Small Image (Detail)',
      type: 'image',
      fieldset: 'images',
      options: {
        hotspot: {
          previews: [
            {title: '4:3 (Landscape)', aspectRatio: 4 / 3},
            {title: '3:2', aspectRatio: 3 / 2},
          ],
        },
      },
      description: '📐 Recommended: Landscape (4:3 or 3:2). At least 500px wide.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'textContent',
      title: 'Optional Text',
      type: 'text',
      rows: 3,
      description: 'Text displayed in the empty cell (opposite the small image)',
    }),
  ],
  preview: {
    select: {
      largePosition: 'largePosition',
      smallPosition: 'smallPosition',
      imageLarge: 'imageLarge',
    },
    prepare({largePosition, smallPosition, imageLarge}) {
      return {
        title: 'Asymmetric Grid',
        subtitle: `Large: ${largePosition}, Small: ${smallPosition}`,
        media: imageLarge,
      }
    },
  },
})
```

```typescript
// studio-art-portfolio/schemaTypes/objects/sections/diagonal.ts
import {defineType, defineField} from 'sanity'
import {InlineIcon} from '@sanity/icons'

export const diagonalType = defineType({
  name: 'diagonal',
  title: 'Diagonal Layout',
  type: 'object',
  icon: InlineIcon,
  description:
    'Staircase layout: large image top-left, small image bottom-right. Creates motion and negative space.',
  fields: [
    defineField({
      name: 'imageLarge',
      title: 'Large Image (Top-Left)',
      type: 'image',
      options: {
        hotspot: {
          previews: [{title: '5:4 (Recommended)', aspectRatio: 5 / 4}],
        },
      },
      description: '📐 Recommended: 5:4 or 4:3 landscape. At least 800px wide.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageSmall',
      title: 'Small Image (Bottom-Right)',
      type: 'image',
      options: {
        hotspot: {
          previews: [{title: '4:3 (Landscape)', aspectRatio: 4 / 3}],
        },
      },
      description: '📐 Recommended: 4:3 landscape. At least 400px wide.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'staggerAmount',
      title: 'Stagger Amount',
      type: 'string',
      options: {
        list: [
          {title: 'Default (15%)', value: '15%'},
          {title: 'More overlap (10%)', value: '10%'},
          {title: 'Less overlap (20%)', value: '20%'},
        ],
      },
      initialValue: '15%',
    }),
  ],
  preview: {
    select: {
      imageLarge: 'imageLarge',
    },
    prepare({imageLarge}) {
      return {
        title: 'Diagonal Layout',
        subtitle: 'Staircase two-image layout',
        media: imageLarge,
      }
    },
  },
})
```

```typescript
// studio-art-portfolio/schemaTypes/objects/sections/quadGrid.ts
import {defineType, defineField} from 'sanity'
import {ThLargeIcon} from '@sanity/icons'

export const quadGridType = defineType({
  name: 'quadGrid',
  title: 'Quad Grid (2×2)',
  type: 'object',
  icon: ThLargeIcon,
  description: 'Four equal-sized images in a 2×2 grid. Good for showing variations or a collection.',
  fields: [
    defineField({
      name: 'images',
      title: 'Images (exactly 4)',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: {
              previews: [
                {title: '1:1 (Square)', aspectRatio: 1},
                {title: '4:3 (Landscape)', aspectRatio: 4 / 3},
                {title: '3:4 (Portrait)', aspectRatio: 3 / 4},
              ],
            },
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        },
      ],
      description: '📐 All 4 images should use the same aspect ratio for consistency.',
      validation: (Rule) => Rule.length(4).error('Quad grid requires exactly 4 images'),
    }),
    defineField({
      name: 'gap',
      title: 'Gap Size',
      type: 'string',
      options: {
        list: [
          {title: 'None (Edge-to-edge)', value: 'none'},
          {title: 'Small', value: 'small'},
          {title: 'Medium (Default)', value: 'medium'},
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          {title: '1:1 Square', value: '1/1'},
          {title: '4:3 Landscape', value: '4/3'},
          {title: '3:4 Portrait', value: '3/4'},
        ],
      },
      initialValue: '1/1',
      description: 'Applied to all 4 images for consistency',
    }),
  ],
  preview: {
    select: {
      images: 'images',
      image0: 'images.0',
    },
    prepare({images, image0}) {
      return {
        title: 'Quad Grid',
        subtitle: `2×2 grid · ${images?.length || 0}/4 images`,
        media: image0,
      }
    },
  },
})
```

```typescript
// studio-art-portfolio/schemaTypes/objects/sections/twoColumn.ts
import {defineType, defineField} from 'sanity'
import {SplitVerticalIcon} from '@sanity/icons'

export const twoColumnType = defineType({
  name: 'twoColumn',
  title: 'Two Column Text',
  type: 'object',
  icon: SplitVerticalIcon,
  description: 'Heading on one side, body text on the other. Good for project context.',
  fields: [
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Heading Left, Body Right', value: 'heading-left'},
          {title: 'Heading Right, Body Left', value: 'heading-right'},
        ],
        layout: 'radio',
      },
      initialValue: 'heading-left',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small label above heading (e.g., "Context", "Story")',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 6,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      layout: 'layout',
    },
    prepare({heading, layout}) {
      return {
        title: heading || 'Two Column',
        subtitle: layout === 'heading-right' ? 'Heading right' : 'Heading left',
      }
    },
  },
})
```

```typescript
// studio-art-portfolio/schemaTypes/objects/sections/imageGrid.ts
import {defineType, defineField} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export const imageGridType = defineType({
  name: 'imageGrid',
  title: 'Image Grid',
  type: 'object',
  icon: ImagesIcon,
  description: 'Flexible grid of images. Light gallery feel with configurable columns.',
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
          ],
        },
      ],
      description: 'Add any number of images. They will flow into the grid.',
      validation: (Rule) => Rule.min(2).error('At least 2 images required'),
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      options: {
        list: [
          {title: '2 Columns', value: 2},
          {title: '3 Columns (Airy)', value: 3},
          {title: '4 Columns (Dense)', value: 4},
        ],
      },
      initialValue: 3,
    }),
    defineField({
      name: 'gap',
      title: 'Gap Size',
      type: 'string',
      options: {
        list: [
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
        ],
      },
      initialValue: 'medium',
    }),
  ],
  preview: {
    select: {
      images: 'images',
      columns: 'columns',
      image0: 'images.0',
    },
    prepare({images, columns, image0}) {
      return {
        title: 'Image Grid',
        subtitle: `${columns} columns · ${images?.length || 0} images`,
        media: image0,
      }
    },
  },
})
```

### 2.3 Project Document Schema

```typescript
// studio-art-portfolio/schemaTypes/documents/project.ts
import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'meta', title: 'Metadata'},
    {name: 'seo', title: 'SEO & Preview'},
  ],
  fields: [
    // --- Content Group ---
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      group: 'content',
      description: 'The name displayed in navigation and page header',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      description: 'The URL path for this project (e.g., "layers" → /work/layers)',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      group: 'content',
      description: 'Short description shown below the title',
    }),
    defineField({
      name: 'template',
      title: 'Page Template',
      type: 'string',
      group: 'content',
      description: 'Select a pre-designed layout. Click "Apply Template" to populate sections.',
      options: {
        list: [
          {title: '01 — Balanced Narrative (11 sections)', value: 'template-01'},
          {title: '02 — Gallery-Led Spotlight (9 sections)', value: 'template-02'},
          {title: '03 — Editorial Calm (8 sections)', value: 'template-03'},
          {title: '04 — Layered Kinetic (11 sections)', value: 'template-04'},
          {title: 'Custom (Build from scratch)', value: 'custom'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'template-01',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'content',
      description: '📐 Recommended: 16:9 landscape, at least 1920px wide. Shown at top of project page.',
      options: {
        hotspot: {
          previews: [{title: '16:9 (Hero)', aspectRatio: 16 / 9}],
        },
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      group: 'content',
      description: 'Customize the page layout. Drag to reorder.',
      of: [
        defineArrayMember({type: 'tGridSection'}),
        defineArrayMember({type: 'fullBleedImage'}),
        defineArrayMember({type: 'carousel'}),
        defineArrayMember({type: 'verticalCarousel'}),
        defineArrayMember({type: 'asymmetricGrid'}),
        defineArrayMember({type: 'diagonal'}),
        defineArrayMember({type: 'quadGrid'}),
        defineArrayMember({type: 'twoColumn'}),
        defineArrayMember({type: 'imageGrid'}),
      ],
    }),

    // --- Metadata Group ---
    defineField({
      name: 'projectType',
      title: 'Project Type',
      type: 'string',
      group: 'meta',
      description: 'E.g., "Painting", "Photography", "Mixed Media"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stage',
      title: 'Stage',
      type: 'string',
      group: 'meta',
      description: 'E.g., "Complete", "In Progress", "Series"',
      initialValue: 'Complete',
    }),
    defineField({
      name: 'deliverables',
      title: 'Deliverables / Medium',
      type: 'string',
      group: 'meta',
      description: 'E.g., "Acrylic on Paper", "Digital Photography"',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'meta',
      description: 'Year completed (e.g., "2024")',
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      group: 'meta',
      description: 'HSL color for accents (e.g., "hsl(340, 45%, 25%)")',
    }),

    // --- SEO Group ---
    defineField({
      name: 'previewImage',
      title: 'Preview Image',
      type: 'image',
      group: 'seo',
      description: '📐 Recommended: 4:3, at least 800px wide. Used in "All Works" grid and navigation.',
      options: {
        hotspot: {
          previews: [{title: '4:3 (Grid)', aspectRatio: 4 / 3}],
        },
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      group: 'seo',
      description: 'Used as subtle background in navigation preview',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'previewDescription',
      title: 'Preview Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      description: 'Short description for cards and hover previews',
    }),
    defineField({
      name: 'previewTags',
      title: 'Preview Tags',
      type: 'array',
      group: 'seo',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
      description: 'Tags shown on hover preview (e.g., "Painting", "Acrylic")',
    }),
    defineField({
      name: 'animationTemplate',
      title: 'Hover Animation Style',
      type: 'string',
      group: 'seo',
      options: {
        list: [
          {title: 'Layers (Default)', value: 'layers'},
          {title: 'Suno', value: 'suno'},
          {title: 'Ro', value: 'ro'},
          {title: 'Atoms', value: 'atoms'},
          {title: 'Hyper', value: 'hyper'},
          {title: 'Waiting', value: 'waiting'},
        ],
      },
      initialValue: 'layers',
    }),

    // --- Ordering ---
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first in navigation',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
    {
      title: 'Title',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'projectType',
      media: 'heroImage',
    },
  },
})
```

### 2.4 Site Settings Document (Singleton)

```typescript
// studio-art-portfolio/schemaTypes/documents/siteSettings.ts
import {defineType, defineField} from 'sanity'
import {CogIcon} from '@sanity/icons'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description: 'Main title shown in browser tab and SEO',
    }),
    defineField({
      name: 'artistName',
      title: 'Artist Name',
      type: 'string',
      description: 'Your name for copyright and attribution',
    }),
    defineField({
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      description: 'Full Instagram profile URL (shown in footer)',
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      description: 'Email address for the contact page',
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      description: 'Short biography for the about/contact page',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Homepage Hero Title',
      type: 'string',
      description: 'Main heading on the homepage',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Homepage Hero Subtitle',
      type: 'text',
      rows: 3,
      description: 'Subtitle text on the homepage',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
      }
    },
  },
})
```

### 2.5 Schema Index

```typescript
// studio-art-portfolio/schemaTypes/index.ts

// Documents
import {projectType} from './documents/project'
import {siteSettingsType} from './documents/siteSettings'

// Section Objects
import {tGridSectionType} from './objects/sections/tGridSection'
import {fullBleedImageType} from './objects/sections/fullBleedImage'
import {carouselType} from './objects/sections/carousel'
import {verticalCarouselType} from './objects/sections/verticalCarousel'
import {asymmetricGridType} from './objects/sections/asymmetricGrid'
import {diagonalType} from './objects/sections/diagonal'
import {quadGridType} from './objects/sections/quadGrid'
import {twoColumnType} from './objects/sections/twoColumn'
import {imageGridType} from './objects/sections/imageGrid'

export const schemaTypes = [
  // Documents
  projectType,
  siteSettingsType,

  // Section Objects
  tGridSectionType,
  fullBleedImageType,
  carouselType,
  verticalCarouselType,
  asymmetricGridType,
  diagonalType,
  quadGridType,
  twoColumnType,
  imageGridType,
]
```

---

## Phase 3: SvelteKit Integration

### 3.1 Install Dependencies

```bash
# In the portfolio (SvelteKit) root
npm install @sanity/client @sanity/image-url
```

### 3.2 Sanity Client with Preview Mode Support

```typescript
// src/lib/sanity/client.ts
import {createClient, type ClientConfig} from '@sanity/client'

const config: ClientConfig = {
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'mrcn4yss',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
}

/**
 * Default client for published content (uses CDN)
 */
export const client = createClient(config)

/**
 * Preview client for draft content (no CDN, requires token)
 */
export function getPreviewClient(token: string) {
  return createClient({
    ...config,
    useCdn: false,
    token,
    perspective: 'previewDrafts',
  })
}

/**
 * Get the appropriate client based on preview mode
 */
export function getClient(preview?: {token: string}) {
  return preview ? getPreviewClient(preview.token) : client
}
```

### 3.3 Image URL Builder with Crop/Hotspot Support

```typescript
// src/lib/sanity/imageUrl.ts
import imageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import {client} from './client'

const builder = imageUrlBuilder(client)

/**
 * Build image URL with automatic crop/hotspot application
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/**
 * Get optimized image URL with specified dimensions
 * Automatically applies hotspot/crop from Sanity
 */
export function getImageUrl(
  source: SanityImageSource,
  options?: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
  }
): string {
  let img = builder.image(source).auto('format')

  if (options?.width) img = img.width(options.width)
  if (options?.height) img = img.height(options.height)
  if (options?.quality) img = img.quality(options.quality)
  if (options?.format) img = img.format(options.format)

  return img.url()
}

/**
 * Get responsive image srcset
 */
export function getImageSrcSet(
  source: SanityImageSource,
  widths: number[] = [400, 800, 1200, 1600, 2000]
): string {
  return widths
    .map((w) => `${urlFor(source).width(w).auto('format').url()} ${w}w`)
    .join(', ')
}
```

### 3.4 GROQ Queries with Full Asset References

```typescript
// src/lib/sanity/queries.ts

/**
 * Get all published projects for navigation and "All Works" page
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
 * Get all project slugs for prerendering
 */
export const projectSlugsQuery = `*[_type == "project"].slug.current`

/**
 * Get a single project by slug with all section data
 * Returns full image objects for @sanity/image-url processing
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
    
    // Full-bleed image (returns full image object with asset ref)
    "image": image,
    revealFrom,
    
    // Carousel & Grid images (returns array of image objects)
    images,
    initialIndex,
    aspectRatio,
    
    // Asymmetric & Diagonal (returns full image objects)
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
 * Get site settings (singleton)
 */
export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  siteTitle,
  artistName,
  instagram,
  email,
  bio,
  heroTitle,
  heroSubtitle
}`

/**
 * Get navigation items (for Header/Footer)
 * Returns full image objects for srcset generation
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
```

### 3.5 Type Definitions

```typescript
// src/lib/sanity/types.ts
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'
import type {AnimationTemplate} from '$lib/schemas/project'

/**
 * Sanity image object with asset reference
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
 * Sanity project document from query
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
 * Section data from Sanity (union of all section types)
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
 * Navigation item from Sanity
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
 * Site settings from Sanity
 */
export interface SanitySiteSettings {
  siteTitle?: string
  artistName?: string
  instagram?: string
  email?: string
  bio?: string
  heroTitle?: string
  heroSubtitle?: string
}
```

### 3.6 Transform Sanity Data to Frontend Types

```typescript
// src/lib/sanity/transform.ts
import type {SanitySection, SanityProject, SanityImage} from './types'
import type {Section, Media, Project} from '$lib/schemas/project'
import {getImageUrl} from './imageUrl'

/**
 * Transform Sanity image to frontend Media type with optimized URL
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
 * Transform Sanity section data to frontend Section type
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
 * Transform full Sanity project to frontend Project type
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
```

---

## Phase 4: Template System

### 4.1 Template Action (with Dynamic Keys)

```typescript
// studio-art-portfolio/actions/applyTemplate.ts
import {useDocumentOperation, DocumentActionProps} from 'sanity'
import {templates} from './templateDefinitions'

/**
 * Generate unique _key for array items
 */
function generateKey(): string {
  return Math.random().toString(36).substring(2, 10)
}

export function ApplyTemplateAction(props: DocumentActionProps) {
  const {patch} = useDocumentOperation(props.id, props.type)
  const {draft, published} = props

  const doc = draft || published
  const selectedTemplate = doc?.template as string | undefined
  const hasSections = Array.isArray(doc?.sections) && doc.sections.length > 0

  // Only show action when:
  // 1. A template is selected (not 'custom')
  // 2. Sections array is empty
  if (!selectedTemplate || selectedTemplate === 'custom' || hasSections) {
    return null
  }

  const templateSections = templates[selectedTemplate]
  if (!templateSections) {
    return null
  }

  return {
    label: 'Apply Template',
    tone: 'primary' as const,
    onHandle: () => {
      // Generate unique keys for each section
      const sectionsWithKeys = templateSections.map((section) => ({
        ...section,
        _key: generateKey(),
      }))

      patch.execute([{set: {sections: sectionsWithKeys}}])
    },
  }
}
```

### 4.2 Template Definitions

```typescript
// studio-art-portfolio/actions/templateDefinitions.ts

interface TemplateSectionBase {
  _type: string
  variant?: string
  eyebrow?: string
  text?: string
  layout?: string
  heading?: string
  body?: string
  largePosition?: string
  smallPosition?: string
  gap?: string
  aspectRatio?: string
  initialIndex?: number
  columns?: number
}

/**
 * Template 01: Balanced Narrative (11 sections)
 * See: documentation/work-templates/work-template-01.md
 */
export const template01: TemplateSectionBase[] = [
  {_type: 'tGridSection', variant: 'hero', eyebrow: 'Overview', text: 'Your opening statement here...'},
  {_type: 'fullBleedImage'},
  {_type: 'twoColumn', layout: 'heading-left', heading: 'Context', body: 'Project context and overview...'},
  {_type: 'asymmetricGrid', largePosition: 'left', smallPosition: 'top'},
  {_type: 'tGridSection', variant: 'left', eyebrow: 'Process', text: 'Process notes...'},
  {_type: 'carousel', initialIndex: 2},
  {_type: 'quadGrid', gap: 'medium', aspectRatio: '4/3'},
  {_type: 'tGridSection', variant: 'right', text: 'Story beat...'},
  {_type: 'diagonal'},
  {_type: 'fullBleedImage'},
  {_type: 'tGridSection', variant: 'left', eyebrow: 'Reflection', text: 'Closing reflection...'},
]

/**
 * Template 02: Gallery-Led Spotlight (9 sections)
 */
export const template02: TemplateSectionBase[] = [
  {_type: 'fullBleedImage'},
  {_type: 'tGridSection', variant: 'hero', text: 'Statement text that anchors the project voice...'},
  {_type: 'twoColumn', layout: 'heading-left', heading: 'Context', body: 'Context and overview...'},
  {_type: 'quadGrid', gap: 'medium', aspectRatio: '1/1'},
  {_type: 'tGridSection', variant: 'right', text: 'Pace reset...'},
  {_type: 'verticalCarousel', eyebrow: 'Series', heading: 'Vertical Sequence', body: 'Description of the series...'},
  {_type: 'diagonal'},
  {_type: 'asymmetricGrid', largePosition: 'left', smallPosition: 'bottom'},
  {_type: 'tGridSection', variant: 'left', eyebrow: 'Reflection', text: 'Closing reflection...'},
]

/**
 * Template 03: Editorial Calm (8 sections)
 */
export const template03: TemplateSectionBase[] = [
  {_type: 'tGridSection', variant: 'hero', text: 'A quiet statement that sets the tone softly...'},
  {_type: 'twoColumn', layout: 'heading-right', heading: 'Context', body: 'Context and overview...'},
  {_type: 'fullBleedImage'},
  {_type: 'tGridSection', variant: 'left', eyebrow: 'Process', text: 'Process notes...'},
  {_type: 'asymmetricGrid', largePosition: 'right', smallPosition: 'top'},
  {_type: 'tGridSection', variant: 'right', text: 'Brief text beat...'},
  {_type: 'imageGrid', columns: 3, gap: 'medium'},
  {_type: 'tGridSection', variant: 'left', eyebrow: 'Reflection', text: 'Contemplative closing...'},
]

/**
 * Template 04: Layered Kinetic (11 sections)
 */
export const template04: TemplateSectionBase[] = [
  {_type: 'tGridSection', variant: 'hero', text: 'Statement that sets the tone...'},
  {_type: 'fullBleedImage'},
  {_type: 'carousel', initialIndex: 2},
  {_type: 'asymmetricGrid', largePosition: 'left', smallPosition: 'top'},
  {_type: 'tGridSection', variant: 'right', eyebrow: 'Process', text: 'Brief process note...'},
  {_type: 'diagonal'},
  {_type: 'tGridSection', variant: 'left', eyebrow: 'Materials', text: 'Materials note...'},
  {_type: 'fullBleedImage'},
  {_type: 'asymmetricGrid', largePosition: 'right', smallPosition: 'top'},
  {_type: 'tGridSection', variant: 'left', eyebrow: 'Reflection', text: 'Reflection before close...'},
  {_type: 'asymmetricGrid', largePosition: 'right', smallPosition: 'bottom'},
]

export const templates: Record<string, TemplateSectionBase[]> = {
  'template-01': template01,
  'template-02': template02,
  'template-03': template03,
  'template-04': template04,
}
```

### 4.3 Register Template Action in sanity.config.ts

```typescript
// studio-art-portfolio/sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {ApplyTemplateAction} from './actions/applyTemplate'

export default defineConfig({
  name: 'default',
  title: 'Art Portfolio',

  projectId: 'mrcn4yss',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      // Add template action only for project documents
      if (context.schemaType === 'project') {
        return [ApplyTemplateAction, ...prev]
      }
      return prev
    },
  },
})
```

---

## Phase 5: Static Build & Preview Mode

### 5.1 Prerender Configuration for Static Builds

```typescript
// src/routes/work/[slug]/+page.server.ts
import {error} from '@sveltejs/kit'
import {client, getClient} from '$lib/sanity/client'
import {projectBySlugQuery, projectsListQuery, projectSlugsQuery} from '$lib/sanity/queries'
import {transformProject} from '$lib/sanity/transform'
import type {PageServerLoad, EntryGenerator} from './$types'
import type {SanityProject} from '$lib/sanity/types'
import {env} from '$env/dynamic/private'

/**
 * Generate entries for static prerendering
 * Required for adapter-static with dynamic routes
 */
export const entries: EntryGenerator = async () => {
  const slugs = await client.fetch<string[]>(projectSlugsQuery)
  return slugs.map((slug) => ({slug}))
}

export const prerender = true

export const load: PageServerLoad = async ({params, cookies}) => {
  // Check for preview mode
  const isPreview = cookies.get('sanity_preview') === 'true'
  const sanityClient = isPreview && env.SANITY_API_TOKEN
    ? getClient({token: env.SANITY_API_TOKEN})
    : client

  const [sanityProject, allProjects] = await Promise.all([
    sanityClient.fetch<SanityProject | null>(projectBySlugQuery, {slug: params.slug}),
    sanityClient.fetch<SanityProject[]>(projectsListQuery),
  ])

  if (!sanityProject) {
    throw error(404, 'Project not found')
  }

  const project = transformProject(sanityProject)

  // Find next project for navigation
  const currentIndex = allProjects.findIndex((p) => p.slug === params.slug)
  const nextIndex = (currentIndex + 1) % allProjects.length
  const nextProject = allProjects[nextIndex] ? transformProject(allProjects[nextIndex]) : undefined

  return {
    project,
    nextProject,
    isPreview,
  }
}
```

### 5.2 Layout Server Load with Preview Support

```typescript
// src/routes/+layout.server.ts
import {client, getClient} from '$lib/sanity/client'
import {navigationQuery, siteSettingsQuery} from '$lib/sanity/queries'
import type {LayoutServerLoad} from './$types'
import type {SanityNavItem, SanitySiteSettings} from '$lib/sanity/types'
import {env} from '$env/dynamic/private'

export const load: LayoutServerLoad = async ({cookies}) => {
  // Check for preview mode
  const isPreview = cookies.get('sanity_preview') === 'true'
  const sanityClient = isPreview && env.SANITY_API_TOKEN
    ? getClient({token: env.SANITY_API_TOKEN})
    : client

  const [navigation, siteSettings] = await Promise.all([
    sanityClient.fetch<SanityNavItem[]>(navigationQuery),
    sanityClient.fetch<SanitySiteSettings>(siteSettingsQuery),
  ])

  return {
    navigation,
    siteSettings,
    isPreview,
  }
}
```

### 5.3 Preview API Routes

```typescript
// src/routes/api/preview/+server.ts
import {redirect} from '@sveltejs/kit'
import type {RequestHandler} from './$types'
import {env} from '$env/dynamic/private'

/**
 * Enable preview mode
 * Usage: /api/preview?secret=xxx&slug=project-slug
 */
export const GET: RequestHandler = async ({url, cookies}) => {
  const secret = url.searchParams.get('secret')
  const slug = url.searchParams.get('slug') || ''

  if (secret !== env.SANITY_PREVIEW_SECRET) {
    return new Response('Invalid token', {status: 401})
  }

  // Set preview cookie
  cookies.set('sanity_preview', 'true', {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    maxAge: 60 * 60, // 1 hour
  })

  // Redirect to the project page
  redirect(307, slug ? `/work/${slug}` : '/')
}
```

```typescript
// src/routes/api/preview/exit/+server.ts
import {redirect} from '@sveltejs/kit'
import type {RequestHandler} from './$types'

/**
 * Exit preview mode
 */
export const GET: RequestHandler = async ({cookies}) => {
  cookies.delete('sanity_preview', {path: '/'})
  redirect(307, '/')
}
```

### 5.4 Preview Banner Component

```svelte
<!-- src/lib/components/PreviewBanner.svelte -->
<script lang="ts">
  /**
   * Banner shown when preview mode is active
   */
</script>

<div class="preview-banner">
  <span>Preview Mode</span>
  <a href="/api/preview/exit">Exit Preview</a>
</div>

<style>
  .preview-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    background: hsl(340, 80%, 50%);
    color: white;
    padding: var(--space-2) var(--space-4);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-4);
    font-size: var(--text-sm);
  }

  .preview-banner a {
    color: white;
    text-decoration: underline;
  }
</style>
```

---

## Phase 6: Deployment

### 6.1 Vercel Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `PUBLIC_SANITY_PROJECT_ID` | `mrcn4yss` | All |
| `PUBLIC_SANITY_DATASET` | `production` | All |
| `SANITY_API_TOKEN` | Read token from Sanity | All (server only) |
| `SANITY_PREVIEW_SECRET` | Random secure string | All (server only) |

### 6.2 Webhook for Rebuilds

1. In Sanity Dashboard → API → Webhooks → Add webhook
2. URL: `https://api.vercel.com/v1/integrations/deploy/prj_xxxxx/xxxx` (from Vercel Deploy Hooks)
3. Trigger: On Create, Update, Delete for `project` and `siteSettings`

**Note:** With `adapter-static`, each content change triggers a full site rebuild. For small portfolios (< 50 pages), this is typically fast enough (< 1 minute).

### 6.3 Studio Deployment

```bash
cd studio-art-portfolio
npx sanity deploy
```

This deploys to `art-portfolio.sanity.studio` (or your chosen subdomain).

---

## Suggested Additional Features

### 7.1 Preview Link in Sanity Studio

Add a preview action to open the page in a new tab:

```typescript
// studio-art-portfolio/actions/openPreview.ts
import {DocumentActionProps} from 'sanity'

const PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:5173'
const PREVIEW_SECRET = process.env.SANITY_STUDIO_PREVIEW_SECRET

export function OpenPreviewAction(props: DocumentActionProps) {
  const {draft, published} = props
  const doc = draft || published
  const slug = doc?.slug?.current

  if (!slug) return null

  return {
    label: 'Open Preview',
    onHandle: () => {
      const url = `${PREVIEW_URL}/api/preview?secret=${PREVIEW_SECRET}&slug=${slug}`
      window.open(url, '_blank')
    },
  }
}
```

### 7.2 About/Bio Page Content

See schema in original plan - unchanged.

### 7.3 Contact Form Submissions

See schema in original plan - unchanged.

---

## Technical Reference

### Documentation Consulted

1. **Sanity Docs - Image Type** (`/docs/studio/image-type`)
   - Hotspot configuration: `hotspot: { previews: [...] }` OR `hotspot: true`, NOT both

2. **Sanity Docs - Environment Variables** (`/docs/studio/environment-variables`)
   - `SANITY_STUDIO_` prefix for Studio, standard env vars for client

3. **SvelteKit Docs - Prerendering** (`kit.svelte.dev/docs/page-options`)
   - `entries` function for dynamic route prerendering with adapter-static

4. **@sanity/image-url** (`sanity.io/docs/image-urls`)
   - Automatic crop/hotspot application when using image builder

### File Changes Summary

| File | Action | Purpose |
|------|--------|---------|
| `studio-art-portfolio/schemaTypes/**` | Create | All schema files |
| `studio-art-portfolio/actions/**` | Create | Template action + definitions |
| `studio-art-portfolio/sanity.config.ts` | Modify | Register document actions |
| `src/lib/sanity/**` | Create | Client, queries, types, transforms |
| `src/routes/+layout.server.ts` | Create | Global navigation + settings |
| `src/routes/work/[slug]/+page.server.ts` | Modify | Sanity fetch + prerender entries |
| `src/routes/api/preview/**` | Create | Preview mode endpoints |

---

## Implementation Checklist

- [ ] **Phase 1:** Verify existing studio runs (`cd studio-art-portfolio && npm run dev`)
- [ ] **Phase 2:** Create section schemas in `schemaTypes/objects/sections/`
- [ ] **Phase 3:** Create document schemas (`project.ts`, `siteSettings.ts`)
- [ ] **Phase 4:** Update `schemaTypes/index.ts` with all exports
- [ ] **Phase 5:** Create template action and register in `sanity.config.ts`
- [ ] **Phase 6:** Install `@sanity/client` and `@sanity/image-url` in SvelteKit
- [ ] **Phase 7:** Create Sanity client and image URL utilities
- [ ] **Phase 8:** Create GROQ queries and transform functions
- [ ] **Phase 9:** Add prerender entries to `+page.server.ts`
- [ ] **Phase 10:** Implement preview mode API routes
- [ ] **Phase 11:** Set Vercel environment variables
- [ ] **Phase 12:** Configure Sanity webhook for Vercel rebuild
- [ ] **Phase 13:** Test full workflow (create project → preview → publish → view)
