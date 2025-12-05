# Section Types Reference

Primitives used to compose `/work/{slug}` page templates. Each section type is a self-contained layout block with specific content slots and configuration options.

**Media Support:** All media-based sections support both images and videos. Use `{ type: 'image', src: '...', alt: '...' }` for images or `{ type: 'video', src: '...', alt: '...' }` for videos. Videos autoplay, loop, and are muted by default (background video behavior).

---

## Quick Reference

| Type | Purpose | Content Slots |
|------|---------|---------------|
| `t-grid-hero` | Large statement text | text, eyebrow |
| `t-grid-left` | Body text (left-aligned) | text, eyebrow |
| `t-grid-right` | Body text (right-aligned) | text, eyebrow |
| `fw-std-53` | Full-width media (5:3) | media, caption |
| `carousel` | Horizontal swipe gallery | media[4–8], initialIndex |
| `vertical-carousel` | Scroll-linked vertical gallery | media[4–8], heading, body, eyebrow |
| `asymmetric-grid` | Large + small media pairing | mediaLarge, mediaSmall, largePosition, smallPosition, textContent |
| `diagonal` | Staircase two-media layout | mediaLarge, mediaSmall |
| `quad-grid` | 2×2 media grid | media[4], gap, aspectRatio |
| `two-column` | Heading + body side-by-side | heading, body, eyebrow, layout |
| `image-grid` | Flexible multi-media grid | media[n], columns, gap |

---

## Text Sections

### `t-grid-hero`
Large, attention-grabbing text block. Use for opening statements or key quotes.

**Fields:**
- `text` (required) — Main message; use `\n` for line breaks
- `eyebrow` (optional) — Small label above (e.g., "Overview", "01")

**Design notes:** Creates visual anchor; best at section start or after image-heavy sequences.

---

### `t-grid-left` / `t-grid-right`
Body text positioned on the left or right side of the page.

**Fields:**
- `text` (required) — Paragraph content
- `eyebrow` (optional) — Small heading above

**Design notes:** Use to create rhythm between image sections. Alternate left/right to shift visual weight.

---

### `two-column`
Heading on one side, body text on the other. Good for intro/context sections.

**Fields:**
- `heading` (required) — Title text
- `body` (required) — Paragraph text
- `eyebrow` (optional) — Small text above heading
- `layout` — `heading-left` (default) or `heading-right`

**Design notes:** Creates clear hierarchy. Flip layout to offset preceding content.

---

## Media Sections

### `fw-std-53`
Full-width media stretching edge-to-edge with 5:3 aspect ratio. Supports images and videos.

**Fields:**
- `media` (required) — Single media item `{ type: 'image' | 'video', src, alt?, caption? }`
- `caption` (optional) — Text below media
- `aspectRatio` (optional) — Override aspect ratio (default: `'16/9'`)
- `revealFrom` (optional) — `'left'`, `'right'`, or `'bottom'` (default: `'bottom'`)

**Design notes:** High impact; use for hero shots, looping video backgrounds, or palette-shift moments. Don't stack consecutively.

---

### `carousel`
Horizontal gallery with drag/swipe interaction. Center-focused with peek effect. Supports images and videos.

**Fields:**
- `media` (required) — Array of 4–8 media items (6 ideal)
- `aspectRatio` (optional) — CSS aspect ratio (default: `'3/4'`)
- `initialIndex` (optional) — Starting position; **never start at 0**, use mid-index (e.g., 2 for 6 items)

**Design notes:** Best for series/collections. Creates interaction moment. Place after text to reward engagement. Videos will autoplay when visible.

---

### `vertical-carousel`
Scroll-linked vertical carousel with two-column layout. Text on left, media stack on right that rotates as user scrolls. Supports images and videos.

**Fields:**
- `media` (required) — Array of 4–8 portrait media items (6 ideal)
- `heading` (required) — Section title
- `body` (required) — Description text
- `eyebrow` (optional) — Label above heading

**Design notes:** Creates immersive scroll-linked moment. Uses Lenis integration for buttery smooth animation. Reserve for key narrative beats; don't use more than once per page. Videos autoplay when active in the stack.

---

### `asymmetric-grid`
One large "feature" media paired with a smaller "detail" media. Supports images and videos.

**Fields:**
- `mediaLarge` — Large media item `{ type, src, alt?, caption? }`
- `mediaSmall` — Small media item `{ type, src, alt?, caption? }`
- `largePosition` — `'left'` or `'right'`
- `smallPosition` — `'top'` or `'bottom'`
- `textContent` (optional) — Text in empty cell

**Layout options:**
```
large-left, small-top    large-left, small-bottom
╔═══════════╦═══════╗    ╔═══════════╦═══════╗
║   LARGE   ║ small ║    ║   LARGE   ║       ║
║           ╠═══════╣    ║           ╠═══════╣
║           ║       ║    ║           ║ small ║
╚═══════════╩═══════╝    ╚═══════════╩═══════╝

large-right, small-top   large-right, small-bottom
╔═══════╦═══════════╗    ╔═══════╦═══════════╗
║ small ║   LARGE   ║    ║       ║   LARGE   ║
╠═══════╣           ║    ╠═══════╣           ║
║       ║           ║    ║ small ║           ║
╚═══════╩═══════════╝    ╚═══════╩═══════════╝
```

**Design notes:** Shows context + close-up. Flip positions to create visual rhythm across page. Mix image and video for dynamic compositions.

---

### `diagonal`
Two media items arranged diagonally — large top-left, small bottom-right. Supports images and videos.

**Fields:**
- `mediaLarge` — Large media item (top-left) `{ type, src, alt?, caption? }`
- `mediaSmall` — Small media item (bottom-right) `{ type, src, alt?, caption? }`
- `staggerAmount` (optional) — Overlap percentage (default: `'15%'`)

**Design notes:** Creates motion and negative space. Good transition between dense sections.

---

### `quad-grid`
Clean 2×2 grid of four equal media items. Supports images and videos.

**Fields:**
- `media` — Exactly 4 media items (tuple)
- `gap` — `'none'`, `'small'`, or `'medium'`
- `aspectRatio` — `'1/1'` (square), `'4/3'` (landscape), `'3/4'` (portrait)

**Design notes:** Shows collection/series. Use square for consistency. Place after text to avoid visual overload. Mix in video for subtle motion.

---

### `image-grid`
Flexible grid of media items with configurable columns. Supports images and videos.

**Fields:**
- `media` — Array of any number of media items
- `columns` — `2`, `3`, or `4`
- `gap` — `'small'`, `'medium'`, or `'large'`

**Design notes:** Light gallery feel. Use 3 columns with medium gap for airy presentation. Videos add subtle motion to grid layouts.

---

## Composition Guidelines

### Pacing Principles
1. **Alternate density** — Follow image-heavy sections with text beats
2. **Shift visual weight** — Use left/right positioning to create flow
3. **Create breathing room** — Diagonal and text sections add negative space
4. **Vary scale** — Mix full-bleed with contained grids

### Section Sequencing Patterns

**Opening:**
- `t-grid-hero` → `fw-std-53` (voice then visual)
- `fw-std-53` → `t-grid-hero` (visual then voice)

**Mid-page rhythm:**
- `asymmetric-grid` → `t-grid-*` → `diagonal` (image → text → motion)
- `carousel` → `t-grid-*` → `quad-grid` (series → pause → collection)

**Closing:**
- `t-grid-left` or `t-grid-right` (end with reflection)
- `asymmetric-grid` (large-right, small-bottom) (visual anchor)

### Anti-patterns
- ❌ Consecutive full-bleed images
- ❌ More than 2 text sections in a row
- ❌ Carousel immediately after quad-grid (visual overload)
- ❌ Multiple vertical-carousels per page

---

## Schema Reference

All section types are defined in `src/lib/schemas/project.ts`. Component implementations live in `src/lib/components/sections/`.

| Schema Type | Component File |
|-------------|----------------|
| `t-grid-hero` | `TGridSection.svelte` |
| `t-grid-left` | `TGridSection.svelte` |
| `t-grid-right` | `TGridSection.svelte` |
| `fw-std-53` | `FullBleedImage.svelte` |
| `carousel` | `Carousel.svelte` |
| `vertical-carousel` | `VerticalCarousel.svelte` |
| `asymmetric-grid` | `AsymmetricGrid.svelte` |
| `diagonal` | `Diagonal.svelte` |
| `quad-grid` | `QuadGrid.svelte` |
| `two-column` | `TwoColumnText.svelte` |
| `image-grid` | `ImageGrid.svelte` |

### Media Type

All media-based sections use the shared `Media` type from `src/lib/schemas/project.ts`:

```typescript
interface Media {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  caption?: string;
}
```

The `MediaItem` primitive (`src/lib/components/primitives/MediaItem.svelte`) handles rendering for both types.


