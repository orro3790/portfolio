# Project Page Layouts

A simple guide to all the layout blocks you can use when building project pages.

---

## Quick Reference

| What It's Called | What It Does | Best For |
|------------------|--------------|----------|
| **Big Quote** | Large statement text | Opening lines, key messages |
| **Body Text (Left)** | Paragraph text on the left | Descriptions, stories |
| **Body Text (Right)** | Paragraph text on the right | Alternate positioning |
| **Full Photo** | Edge-to-edge image | Hero shots, big moments |
| **Photo Slider** | Swipeable photo gallery | Multiple related images |
| **Feature + Detail** | One big photo + one small photo | Showing scale & detail |
| **Staircase** | Diagonal arrangement | Visual rhythm, flow |
| **Four Square** | 2×2 grid of photos | Collections, series |
| **Side by Side** | Heading + paragraph text | Intro sections |
| **Photo Grid** | Flexible image grid | Multiple photos |

---

## Layout Blocks

### 1. Big Quote

A large, attention-grabbing text block. Perfect for opening statements or key quotes.

```
Schema type: t-grid-hero
```

**You provide:**
- **Text** — The main message (press Enter for new lines)
- **Label** *(optional)* — Small text above the quote (like "About" or "01")

**Example:**
```
╔════════════════════════════════════════╗
║  ABOUT                                 ║
║                                        ║
║  We create spaces that               ║
║  inspire wonder and                  ║
║  spark imagination.                  ║
╚════════════════════════════════════════╝
```

---

### 2. Body Text (Left / Right)

Regular paragraph text positioned on the left or right side of the page.

```
Schema type: t-grid-left  or  t-grid-right
```

**You provide:**
- **Text** — Your paragraph content
- **Label** *(optional)* — Small heading above

**Example (left-aligned):**
```
╔════════════════════════════════════════╗
║        Our approach combines           ║
║        traditional craft with          ║
║        modern techniques...            ║
╚════════════════════════════════════════╝
```

---

### 3. Full Photo

A full-width image that stretches edge-to-edge.

```
Schema type: fw-std-53
```

**You provide:**
- **Image** — Upload one photo
- **Caption** *(optional)* — Text below the image

**Example:**
```
╔════════════════════════════════════════╗
║                                        ║
║     ████████████████████████████       ║
║     ██                        ██       ║
║     ██   [  YOUR PHOTO  ]     ██       ║
║     ██                        ██       ║
║     ████████████████████████████       ║
║                                        ║
╚════════════════════════════════════════╝
```

---

### 4. Photo Slider

A horizontal gallery you can drag/swipe through. Great for showing a series of related images.

```
Schema type: carousel
```

**You provide:**
- **Images** — Upload 4-8 photos (6 is ideal)
- **Start at** *(optional)* — Which photo shows first (1, 2, 3...)

**Example:**
```
╔════════════════════════════════════════╗
║                                        ║
║   ▐▌  ┌─────────┐  ▐▌                 ║
║   ▐▌  │         │  ▐▌                 ║
║   ▐▌  │ CURRENT │  ▐▌                 ║
║   ▐▌  │  PHOTO  │  ▐▌                 ║
║   ▐▌  │         │  ▐▌                 ║
║   ▐▌  └─────────┘  ▐▌                 ║
║                                        ║
║         ← drag to scroll →             ║
╚════════════════════════════════════════╝
```

---

### 5. Feature + Detail

One large "feature" photo paired with a smaller "detail" photo. Perfect for showing context and close-ups together.

```
Schema type: asymmetric-grid
```

**You provide:**
- **Large image** — The main/feature photo
- **Small image** — The detail/secondary photo
- **Large image side** — `left` or `right`
- **Small image position** — `top` or `bottom`
- **Text** *(optional)* — Goes in the empty space

**Layout options:**

```
Large LEFT, small TOP:        Large LEFT, small BOTTOM:
╔═══════════╦═══════╗         ╔═══════════╦═══════╗
║           ║ small ║         ║           ║       ║
║   LARGE   ╠═══════╣         ║   LARGE   ╠═══════╣
║           ║       ║         ║           ║ small ║
╚═══════════╩═══════╝         ╚═══════════╩═══════╝

Large RIGHT, small TOP:       Large RIGHT, small BOTTOM:
╔═══════╦═══════════╗         ╔═══════╦═══════════╗
║ small ║           ║         ║       ║           ║
╠═══════╣   LARGE   ║         ╠═══════╣   LARGE   ║
║       ║           ║         ║ small ║           ║
╚═══════╩═══════════╝         ╚═══════╩═══════════╝
```

---

### 6. Staircase

Two photos arranged diagonally — big one top-left, small one bottom-right. Creates a nice visual flow.

```
Schema type: diagonal
```

**You provide:**
- **Image 1** — Large photo (top-left)
- **Image 2** — Small photo (bottom-right)

**Example:**
```
╔════════════╦════════════╗
║ ██████████ ║            ║
║ ██ LARGE ██║            ║
║ ██████████ ║            ║
╠════════════╬════════════╣
║            ║   ████     ║
║            ║   small    ║
╚════════════╩════════════╝
```

---

### 7. Four Square

A clean 2×2 grid of four equal photos. Great for showing a collection or series.

```
Schema type: quad-grid
```

**You provide:**
- **Images** — Exactly 4 photos
- **Spacing** — `none`, `small`, or `medium`
- **Shape** — `1/1` (square), `4/3` (landscape), `3/4` (portrait)

**Example:**
```
╔═══════════╦═══════════╗
║   Photo   ║   Photo   ║
║     A     ║     B     ║
╠═══════════╬═══════════╣
║   Photo   ║   Photo   ║
║     C     ║     D     ║
╚═══════════╩═══════════╝
```

---

### 8. Side by Side

A heading on one side with paragraph text on the other. Good for intro sections.

```
Schema type: two-column
```

**You provide:**
- **Heading** — The title text
- **Body** — The paragraph text
- **Label** *(optional)* — Small text above heading
- **Layout** — `heading-left` or `heading-right`

**Example:**
```
╔════════════════╦═══════════════════════╗
║  The Process   ║  We start by under-   ║
║                ║  standing your vision ║
║                ║  and goals. Then we   ║
║                ║  develop concepts...  ║
╚════════════════╩═══════════════════════╝
```

---

### 9. Photo Grid

A flexible grid of photos. You control how many columns.

```
Schema type: image-grid
```

**You provide:**
- **Images** — Any number of photos
- **Columns** — 2, 3, or 4
- **Spacing** — `small`, `medium`, or `large`

---

## Tips for Building Great Pages

1. **Start with a Big Quote** — Hook viewers with a strong opening statement
2. **Alternate layouts** — Mix large images with text sections for rhythm
3. **Use Photo Slider for series** — When you have 4+ related images
4. **Feature + Detail for impact** — Show the big picture AND the close-up
5. **End with a statement** — Use Body Text for a closing thought

---

## Technical Reference

For developers — here's how schema types map to components:

| Schema Type | Component File | Notes |
|-------------|----------------|-------|
| `t-grid-hero` | `TGridSection.svelte` | variant="hero" |
| `t-grid-left` | `TGridSection.svelte` | variant="left" |
| `t-grid-right` | `TGridSection.svelte` | variant="right" |
| `fw-std-53` | `FullBleedImage.svelte` | 5:3 aspect ratio |
| `carousel` | `Carousel.svelte` | |
| `asymmetric-grid` | `AsymmetricGrid.svelte` | |
| `diagonal` | `Diagonal.svelte` | |
| `quad-grid` | `QuadGrid.svelte` | |
| `two-column` | `TwoColumnText.svelte` | |
| `image-grid` | `ImageGrid.svelte` | |
