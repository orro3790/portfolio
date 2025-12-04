# Project Layout Section Variants

## Overview

This document defines the layout section types available for project pages. The naming convention is designed to be **semantic and self-explanatory**, especially for Sanity CMS integration where content editors need to understand their options.

---

## 1. Layout Properties

All sections (except Carousel, T-Grid Hero, and FW-BG-53) share these defaults:

- **padding:** `0 --gutter`
- **margin:** `auto 0`
- **gap:** `--gutter`

---

## 2. Section Types

### 2.1. Text Section (T-Grid)

**Schema Type:** `t-grid-hero` | `t-grid-left` | `t-grid-right`

6-column text grid for headlines and body copy.

| Variant | Columns | Use Case |
|---------|---------|----------|
| `t-grid-hero` | 1–5 | Large intro text, 3.5rem |
| `t-grid-left` | 2–4 | Body copy, left-aligned |
| `t-grid-right` | 4–6 | Body copy, right-aligned |

**Props:**
- `text` (string, required): Text content, supports `\n` for line breaks
- `eyebrow` (string, optional): Small label above main text

**Animation:** Line-by-line slide-up reveal with staggered delays.

---

### 2.2. Full-Width Image (FW-STD-53)

**Schema Type:** `fw-std-53`

Full-width image with 5:3 aspect ratio.

**Props:**
- `media[0]`: Single image

**Animation:** Curtain reveal (top to bottom).

---

### 2.3. Carousel

**Schema Type:** `carousel`

Horizontal scrolling gallery with drag interaction.

**Props:**
- `media[]`: Array of images (recommended: 6)
- `initialIndex` (number, optional): Starting slide (0-indexed, default: 0)

**Features:**
- Center image fully visible
- Adjacent images peek at edges
- Custom drag cursor
- Scroll-snap behavior

---

### 2.4. Asymmetric Grid

**Schema Type:** `asymmetric-grid`

**REPLACES:** The confusing `TriGrid-2x2*` and `DGU-2x2*` variants.

A flexible 2-column layout with one large image (spanning 2 rows) and one small image. Uses **semantic props** that are easy for content editors to understand in Sanity.

**Props:**
- `largePosition`: `'left'` or `'right'` — which column the large image occupies
- `smallPosition`: `'top'` or `'bottom'` — vertical position of small image
- `media[0]`: Large image
- `media[1]`: Small image
- `textContent` (optional): Text for the empty cell

**Visual Examples:**

```
largePosition='left', smallPosition='top':
╔═══════════╦═══════╗
║           ║ small ║
║   LARGE   ╠═══════╣
║           ║ empty ║
╚═══════════╩═══════╝

largePosition='left', smallPosition='bottom':
╔═══════════╦═══════╗
║           ║ empty ║
║   LARGE   ╠═══════╣
║           ║ small ║
╚═══════════╩═══════╝

largePosition='right', smallPosition='top':
╔═══════╦═══════════╗
║ small ║           ║
╠═══════╣   LARGE   ║
║ empty ║           ║
╚═══════╩═══════════╝

largePosition='right', smallPosition='bottom':
╔═══════╦═══════════╗
║ empty ║           ║
╠═══════╣   LARGE   ║
║ small ║           ║
╚═══════╩═══════════╝
```

**Animation:** Curtain reveal (top to bottom), staggered for small image.

---

### 2.5. Diagonal

**Schema Type:** `diagonal`

Staggered layout creating a visual diagonal.

**Props:**
- `media[0]`: Large image (top-left)
- `media[1]`: Small image (bottom-right)

```
╔════════════╦════════════╗
║ ██████████ ║            ║  ← Large image (1:0.8 aspect)
╠════════════╬════════════╣
║            ║    ██      ║  ← Small image (1:0.8 aspect)
╚════════════╩════════════╝
```

**Animation:** Curtain reveal, staggered timing.

---

## 3. Animations

All image sections use a **curtain reveal** animation that works with any image source (including Unsplash):

- **Mechanism:** CSS `scaleY(1) → scaleY(0)` on a solid-color overlay
- **Direction:** Top to bottom (reveals from top)
- **Duration:** 1s with cubic-bezier easing
- **Image zoom:** Subtle 1.05 → 1.0 scale during reveal

All text uses **fade-in + slide-up** animation:
- **Initial state:** `opacity: 0; transform: translateY(20px)`
- **Final state:** `opacity: 1; transform: translateY(0)`
- **Duration:** 0.6–0.8s depending on context

---

## 4. Sanity Integration Notes

With the `asymmetric-grid` type, Sanity can expose a clean dropdown for editors:

```
Layout Options:
├── "Large image left, small top"
├── "Large image left, small bottom"  
├── "Large image right, small top"
└── "Large image right, small bottom"
```

Each option maps to `largePosition` + `smallPosition` props. Content editors can:
1. Define any number of sections
2. Choose section type from dropdown
3. Upload images
4. See real-time preview

---

## 5. Migration from Legacy Types

| Old Type | New Type | Props |
|----------|----------|-------|
| `trigrid-2x2a` | `asymmetric-grid` | `largePosition='left', smallPosition='top'` |
| `trigrid-2x2b` | `asymmetric-grid` | `largePosition='left', smallPosition='bottom'` + textContent |
| `dgu-2x2a` | `asymmetric-grid` | `largePosition='right', smallPosition='bottom'` |
| `dgu-2x2b` | `asymmetric-grid` | `largePosition='right', smallPosition='bottom'` + textContent |
| `dgu-2x2c` | `asymmetric-grid` | `largePosition='right', smallPosition='top'` |
