# Implementation Plan: Portfolio v1

## Order of Operations

| Phase | Scope | Deliverables | Status |
|-------|-------|--------------|--------|
| **1. Templates** | Build section templates with placeholder content and animations | 2-4 reusable section components, scroll-triggered animations | 🟡 In Progress |
| **2. Sanity** | Initialize Sanity, define schemas, wire up content fetching | Sanity Studio, content schemas, typed queries | ⬜ Not Started |
| **3. Refactor** | Apply conventions, consolidate, clean up technical debt | Code review pass, documentation | ⬜ Not Started |

---

## Phase 1: Templates

### Goal
Create polished, reusable section components with scroll-triggered animations that match the Metalab reference site.

### Section Templates

| Template | Description | Animation | Status |
|----------|-------------|-----------|--------|
| `HeroSection` | Full-bleed hero with title, metadata, and background image | Fade-in on load, parallax on scroll | ✅ |
| `FullBleedImage` | Edge-to-edge image with optional caption | Curtain reveal on scroll | ✅ |
| `TextReveal` | Large statement text with staggered word/line reveals | Slide-up + fade per line on scroll | ✅ |
| `ImageGrid` | 2-4 images in responsive grid | Staggered fade-in on scroll | ✅ |
| `TwoColumnText` | Heading left, body right (or vice versa) | Slide-in from sides on scroll | ✅ |
| `DoubleImage` | Side-by-side images with configurable gap/aspect | Staggered fade-in | ✅ |
| `TGridSection` | 6-column text grid (hero/left/right variants) | Line-by-line reveal | ⬜ |
| `Carousel` | Horizontal carousel with peek effect | Fade-in, smooth scroll | ⬜ |
| `Asymmetric Grid` | Asymmetric 2-col grid with large/small images | Staggered cell reveal | ⬜ |
| `Diagonal` | Diagonal image arrangement | Staggered reveal | ⬜ |

### Animation Patterns

- **Trigger**: Intersection Observer (when element enters viewport)
- **Easing**: `cubic-bezier(0.16, 1, 0.3, 1)` (smooth deceleration)
- **Duration**: 0.8s–1.2s for major reveals
- **Stagger**: 100–150ms between sibling elements

### Acceptance Criteria

- [ ] Each template works with typed placeholder props
- [ ] Animations trigger reliably on scroll
- [ ] No janky reflows or layout shifts
- [ ] Works on mobile viewports

---

## Layers Project Layout

### Section Order (after background image)

| # | Section Type | Layout Identifier | Description |
|---|--------------|-------------------|-------------|
| 1 | **T-grid-hero** | `t-grid-hero` | Hero text spanning columns 1–5 of 6-column grid, 3.5rem font |
| 2 | **FW-STD-53** | `fw-std-53` | Full-width image, 5:3 aspect ratio |
| 3 | **Carousel** | `carousel-6` | 6-image carousel with center focus, [a]/[c] peek effect |
| 4 | **Asymmetric Grid** | `asymmetric-grid` | Large left, small top |
| 5 | **T-grid-right** | `t-grid-right` | Text columns 4–6 of 6-column grid |
| 6 | **Diagonal** | `diagonal` | 2-row, 2-col diagonal layout; large img top-left, small bottom-right |
| 7 | **T-grid-left** | `t-grid-left` | Text columns 2–4 of 6-column grid |
| 8 | **FW-STD-53** | `fw-std-53` | Full-width image, 5:3 aspect ratio |
| 9 | **Asymmetric Grid** | `asymmetric-grid` | Large right, small top |
| 10 | **T-grid-left** | `t-grid-left` | Text columns 2–4 of 6-column grid |
| 11 | **Asymmetric Grid** | `asymmetric-grid` | Large right, small bottom |

### New Components Required

| Component | File | Variants | Props |
|-----------|------|----------|-------|
| `TGridSection` | `sections/TGridSection.svelte` | `hero`, `left`, `right` | `text`, `eyebrow?`, `variant` |
| `Carousel` | `sections/Carousel.svelte` | `peek-3`, `peek-6` | `images[]`, `peekCount?` |
| `AsymmetricGrid` | `sections/AsymmetricGrid.svelte` | — | `largePosition`, `smallPosition`, `imageLarge`, `imageSmall` |
| `Diagonal` | `sections/Diagonal.svelte` | — | `imageLarge`, `imageSmall` |

### Grid Specifications

#### T-Grid (6-column text layouts)
```css
/* Base 6-column grid */
display: grid;
grid-template-columns: repeat(6, 1fr);
gap: var(--gutter);
padding: 0 var(--gutter);

/* T-grid-hero: columns 1–5 */
.t-grid-hero .content { grid-column: 1 / 6; font-size: 3.5rem; }

/* T-grid-left: columns 2–4 */
.t-grid-left .content { grid-column: 2 / 5; }

/* T-grid-right: columns 4–6 */
.t-grid-right .content { grid-column: 4 / 7; }
```

#### Asymmetric Grid
```css
display: grid;
/* 2-column grid with varying widths based on large position */
grid-template-columns: var(--grid-columns); /* e.g. 1.1fr 0.9fr */
grid-template-areas: var(--grid-areas);
/* Areas example:
   "large small"
   "large empty"
*/
```

#### Diagonal Layout
```css
display: grid;
grid-template-columns: 1fr 1fr;
grid-template-rows: auto auto;
/* Row 1: large image left, empty right */
/* Row 2: empty left, small image right */
/* Both images 1:0.8 aspect; large ~800px, small ~340px */
```

### Implementation Tasks

#### Phase 1A: Schema Updates
- [ ] Add new section types to `src/lib/schemas/project.ts`:
  - `t-grid-hero`, `t-grid-left`, `t-grid-right`
  - `fw-std-53`
  - `carousel`
  - `asymmetric-grid`
  - `diagonal`

#### Phase 1B: Component Development
- [ ] **TGridSection** — 6-column text grid with hero/left/right variants
- [ ] **Carousel** — Horizontal scroll with peek effect, 6 images
- [ ] **AsymmetricGrid** — Unified asymmetric 2-column layout
- [ ] **Diagonal** — Staggered diagonal image arrangement

#### Phase 1C: Page Assembly
- [ ] Update `src/lib/data/projects.ts` Layers entry with new section structure
- [ ] Wire up section renderer in `src/routes/work/[slug]/+page.svelte`
- [ ] Add placeholder images for each slot

### Animation Patterns per Section

| Section | Animation |
|---------|-----------|
| T-grid-* | Line-by-line text reveal (existing pattern) |
| FW-STD-53 | Curtain reveal with scale (existing FullBleedImage) |
| Carousel | Fade-in items, smooth horizontal scroll |
| Asymmetric Grid | Staggered reveal: large → small/text |
| Diagonal | Large image first, small 200ms later |

---

## Phase 2: Sanity Integration

### Goal
Replace placeholder content with CMS-managed content while preserving all animations.

### Steps

1. Initialize Sanity project in repo (`sanity init`)
2. Define document schemas matching template props
3. Create GROQ queries for each page type
4. Wire up SvelteKit `+page.server.ts` loaders
5. Map Sanity Portable Text to Svelte components

### Schema Mapping (Draft)

| Template | Sanity Schema Fields |
|----------|---------------------|
| `HeroSection` | `title`, `subtitle`, `backgroundImage`, `metadata[]` |
| `FullBleedImage` | `image`, `alt`, `caption?`, `aspectRatio?` |
| `TextReveal` | `text` (string or Portable Text) |
| `ImageGrid` | `images[]` (array of image refs) |
| `TwoColumnText` | `heading`, `body` (Portable Text) |
| `TGridSection` | `text`, `eyebrow?`, `variant` (hero/left/right) |
| `Carousel` | `images[]`, `peekCount?` |
| `AsymmetricGrid` | `largePosition`, `smallPosition`, `imageLarge`, `imageSmall`, `textContent?` |
| `Diagonal` | `imageLarge`, `imageSmall` |

---

## Phase 3: Refactor

### Goal
Apply project conventions, remove technical debt, ensure maintainability.

### Checklist

- [ ] Code review per `documentation/agent-guidelines/conventions.md`
- [ ] Remove unused variables and dead code
- [ ] Consolidate duplicate styles
- [ ] Add JSDoc to all public functions
- [ ] Verify no linter errors
- [ ] Update README with setup instructions

---

## Reference

- **Metalab**: https://www.metalab.com/work/midjourney
- **Conventions**: `documentation/agent-guidelines/conventions.md`
- **Project Structure**: `documentation/agent-guidelines/index.md`

