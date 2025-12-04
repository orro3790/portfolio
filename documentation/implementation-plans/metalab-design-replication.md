---
title: Metalab-inspired Art Portfolio Design Implementation
intent: Detailed plan for replicating the Metalab.com UX/UI for the art portfolio
---

## Overview

Replicate the [Metalab](https://www.metalab.com/) website structure and UX for an art portfolio:
- Dark theme with elegant serif typography
- Left sidebar project navigation
- Project detail pages with hero, metadata, and media sections
- Scroll-triggered reveal animations

---

## Design System

### Colors

```css
--color-bg: #0a0a0a;           /* Near-black background */
--color-bg-elevated: #141414;   /* Slightly lighter for cards */
--color-text: #f5f5f5;          /* Off-white text */
--color-text-muted: #888888;    /* Muted text for labels */
--color-accent: #6366f1;        /* Accent (purple/indigo) */
--color-border: #2a2a2a;        /* Subtle borders */
```

### Typography

- **Display/Headings**: Serif font (PP Eiko or similar elegant serif)
- **Body/UI**: Sans-serif (Basis Grotesque or similar clean sans)
- **Title sizes**: ~120px for project names, ~80px for hero text

### Spacing

- Base unit: 8px
- Section padding: 80–120px vertical
- Content max-width: 1400px

---

## Component Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── Header.svelte           # Top nav: menu, logo, contact
│   │   ├── ProjectNav.svelte       # Left sidebar project list
│   │   ├── Footer.svelte           # "How can we help?" + social links
│   │   ├── ProjectHero.svelte      # Title + metadata + hero image
│   │   ├── MediaSection.svelte     # Full-width image/video section
│   │   └── NextProject.svelte      # "Next project" link at bottom
│   ├── actions/
│   │   └── inView.ts               # IntersectionObserver action for animations
│   ├── data/
│   │   └── projects.ts             # Project data (placeholder for now)
│   └── schemas/
│       └── project.ts              # Zod schema for project data
├── routes/
│   ├── +layout.svelte              # Root layout with Header + ProjectNav
│   ├── +page.svelte                # Homepage: hero text + project list
│   └── work/
│       └── [slug]/
│           └── +page.svelte        # Project detail page
└── app.css                         # Global styles
```

---

## Route Structure

| Route | Purpose |
|-------|---------|
| `/` | Homepage with hero text "We make interfaces" and sidebar nav |
| `/work/[slug]` | Individual project case study |

---

## Homepage Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Menu]            Metalab            [Time] [Theme] [Mail]  │  ← Header
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Suno]                                                     │
│  [Uber]               We make                               │
│  [Ro]                 interfaces                            │
│  [Atoms]                                                    │
│  [Midjourney]    Since 2006, we've helped...                │
│  [Upwork]                                                   │
│  [The Atlantic]                                             │
│  [Calvin Klein]                                             │
│  [Headspace]                                                │
│  [All Work]                                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Project Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Menu]            Metalab            [Time] [Theme] [Mail]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [•]                                                        │  ← Scroll indicator
│                                                             │
│     Project Name                                            │  ← Large serif title
│                                                             │
│  Project Type      Stage           Deliverables             │  ← 3-col metadata
│  Full Build        Startup         Product Design, Brand    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     [   HERO IMAGE / VIDEO   ]                              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     [ Section 1: Full-width media ]                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     [ Section 2: Text + media split ]                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     → Next Project: [Project Name]                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│     How can we help?                                        │
│     [Work together] [Join our team] [Just say hello]        │
│                                                             │
│     [LinkedIn] [Instagram] [X] | [Career] [Contact] | [Privacy] │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Animation Strategy

### Scroll-triggered reveals

Use a Svelte action (`use:inView`) that:
1. Observes when an element enters the viewport
2. Adds a `data-visible="true"` attribute
3. CSS handles the transition (opacity + translateY)

```css
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.reveal[data-visible="true"] {
  opacity: 1;
  transform: translateY(0);
}
```

### Staggered animations

For lists (like project nav), use `animation-delay` based on index.

---

## Implementation Steps

### Phase 1: Foundation
1. Create global CSS with design tokens (colors, typography, spacing)
2. Set up fonts (Google Fonts or self-hosted)
3. Create base layout with Header component

### Phase 2: Navigation
4. Build ProjectNav sidebar component
5. Add project data structure with Zod schema

### Phase 3: Homepage
6. Build homepage with hero text
7. Style project list with hover states

### Phase 4: Project Pages
8. Create `/work/[slug]` route
9. Build ProjectHero component (title + metadata)
10. Build MediaSection component for images
11. Add NextProject navigation
12. Build Footer component

### Phase 5: Polish
13. Add inView action for scroll animations
14. Apply reveal animations to all sections
15. Add page transitions between routes
16. Test responsive behavior

---

## Placeholder Content

For initial development, use 6 placeholder art projects:

```ts
const projects = [
  { slug: "project-1", title: "Ethereal Forms", type: "Painting", stage: "Complete", deliverables: "Oil on Canvas" },
  { slug: "project-2", title: "Urban Fragments", type: "Mixed Media", stage: "Complete", deliverables: "Collage, Photography" },
  { slug: "project-3", title: "Light Studies", type: "Photography", stage: "Series", deliverables: "Digital Photography" },
  { slug: "project-4", title: "Ceramic Vessels", type: "Sculpture", stage: "Collection", deliverables: "Stoneware, Glaze" },
  { slug: "project-5", title: "Abstract Narratives", type: "Drawing", stage: "Complete", deliverables: "Charcoal, Ink" },
  { slug: "project-6", title: "Nature Impressions", type: "Watercolor", stage: "Complete", deliverables: "Watercolor on Paper" },
];
```

---

## Font Selection

### Option A: Google Fonts (easiest)
- Display: **Playfair Display** or **Cormorant Garamond** (serif)
- Body: **Inter** or **DM Sans** (sans-serif)

### Option B: Premium (closer to Metalab)
- Display: **PP Eiko** (paid)
- Body: **Basis Grotesque** (paid)

For v1, use Google Fonts for speed; can upgrade later.

