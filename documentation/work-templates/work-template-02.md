# Work Template 02 — Gallery-Led Spotlight (9 sections)

Canonical reference: image-forward rhythm that alternates scale and pacing. Features an immersive scroll-linked vertical carousel as the centerpiece gallery moment. Uses only section types defined in `@documentation/agent-guidelines/section-types.md`.

---

## Design Philosophy

This template treats images as the primary narrative vehicle. The vertical carousel provides an immersive scroll-linked experience at the midpoint, with text sections acting as pace-setters rather than focal points. Visual weight shifts left→right→center to create dynamic flow.

---

## Ordered Section Stack

| # | Type | Purpose | Notes |
|---|------|---------|-------|
| 1 | `fw-std-53` | Hero image sets tone immediately | Full-bleed impact |
| 2 | `t-grid-hero` | Big quote frames the project voice | Breathing room after hero |
| 3 | `two-column` (heading-left) | Context + overview | Grounds the story |
| 4 | `quad-grid` (medium, 1/1) | Equal-weight set shows range | Square format for consistency |
| 5 | `t-grid-right` | Text beat resets rhythm | Right-align shifts weight |
| 6 | `vertical-carousel` | **Immersive scroll-linked gallery** | Centerpiece moment |
| 7 | `diagonal` | Staircase reintroduces motion | Breathing room after immersion |
| 8 | `asymmetric-grid` (large-left, small-bottom) | Feature + detail anchors the close | Left-heavy to balance |
| 9 | `t-grid-left` | Closing reflection | Narrative clarity |

---

## ASCII Layout Sketch

```
[1] FULL PHOTO 5:3 (hero)
╔════════════════════════════════════════╗
║             ████████████               ║
║             █  HERO IMG  █             ║
║             ████████████               ║
╚════════════════════════════════════════╝

[2] T-GRID HERO (big quote)
╔════════════════════════════════════════╗
║  "Statement text that anchors          ║
║   the project's voice"                 ║
╚════════════════════════════════════════╝

[3] TWO-COLUMN (heading-left)
╔══════════╦════════════════════════════╗
║ Heading  ║ Body copy providing        ║
║          ║ context and overview       ║
╚══════════╩════════════════════════════╝

[4] QUAD GRID (medium gap, 1/1)
╔══════╦══════╗
║  A   ║  B   ║
╠══════╬══════╣
║  C   ║  D   ║
╚══════╩══════╝

[5] T-GRID RIGHT (pace reset)
╔════════════════════════════════════════╗
║              Short text beat           ║
║              on the right side         ║
╚════════════════════════════════════════╝

[6] VERTICAL CAROUSEL (scroll-linked)
╔════════════════╦═══════════════════════╗
║  SERIES        ║     ┌─────────┐       ║
║  Eyebrow       ║     │  img 3  │ ←active║
║                ║     └─────────┘       ║
║  Heading       ║   ┌───┐     ┌───┐    ║
║                ║   │ 2 │     │ 4 │    ║
║  Body text     ║   └───┘     └───┘    ║
║  describing    ║                       ║
║  the series    ║     1/6   ━━━━━      ║
╚════════════════╩═══════════════════════╝
        ↑ scroll drives carousel rotation

[7] DIAGONAL (breathing room)
╔════════════╦════════╗
║ ██████████ ║        ║
║ █  LARGE  █║        ║
╠════════════╬════════╣
║            ║  small ║
╚════════════╩════════╝

[8] ASYMMETRIC (large-left, small-bottom)
╔═══════════╦═══════╗
║   LARGE   ║       ║
║   IMAGE   ╠═══════╣
║           ║ small ║
╚═══════════╩═══════╝

[9] T-GRID LEFT (closing reflection)
╔════════════════════════════════════════╗
║  Final thoughts on the left            ║
║  to end with narrative clarity         ║
╚════════════════════════════════════════╝
```

---

## Sanity Modeling Notes

- Template is an ordered array of 9 section objects; each stores `type` + fields per section-types guide.
- **Fixed at 9 sections** to preserve gallery-led pacing; disable add/remove in CMS.
- Default `quad-grid` to `gap: medium`, `aspectRatio: 1/1` for visual consistency.
- Default `vertical-carousel` to `initialIndex: 0`; requires `heading`, `body`, and 4–8 portrait images.
- Default `asymmetric-grid` to `largePosition: left`, `smallPosition: bottom`.

---

## Pacing Analysis

```
Section  Visual Weight  Position   Density
─────────────────────────────────────────
1        ████████████   full       HIGH
2        ████           left       LOW
3        ████████       split      MEDIUM
4        ████████████   grid       HIGH
5        ████           right      LOW
6        ████████████   split      HIGH (immersive)
7        ██████         diagonal   MEDIUM
8        ████████       asymm      MEDIUM
9        ████           left       LOW
```

Flow: HIGH → LOW → MEDIUM → HIGH → LOW → **HIGH** → MEDIUM → MEDIUM → LOW

The vertical carousel at position 6 creates the apex moment, with decreasing intensity toward the close.
