# Work Template 01 — Balanced Narrative (11 sections)

Canonical reference: balanced rhythm alternating between image density and text breathing room. Features both horizontal carousel and structured grids for visual variety. Uses only section types defined in `@documentation/agent-guidelines/section-types.md`.

---

## Design Philosophy

This template balances visual impact with narrative clarity. It opens strong with text+image, builds through varied image formats (asymmetric, carousel, grid), and closes with a reflective anchor. The midpoint carousel provides interactive engagement, while the quad-grid creates a gallery moment without overwhelming.

---

## Ordered Section Stack

| # | Type | Purpose | Notes |
|---|------|---------|-------|
| 1 | `t-grid-hero` | Opening statement sets tone | Hierarchy before visuals |
| 2 | `fw-std-53` | Full-bleed hero visual | Immediate immersion |
| 3 | `two-column` (heading-left) | Project context | Grounds the narrative |
| 4 | `asymmetric-grid` (large-left, small-top) | Feature + detail | Focal point + texture |
| 5 | `t-grid-left` | Process note | Breathing room |
| 6 | `carousel` | Swipeable series | Interactive midpoint |
| 7 | `quad-grid` (medium, 4/3) | Equal-weight set | Variations showcase |
| 8 | `t-grid-right` | Story beat | Alternate flow |
| 9 | `diagonal` | Staggered two-up | Motion + negative space |
| 10 | `fw-std-53` | Secondary full-bleed | Anchors the close |
| 11 | `t-grid-left` | Closing reflection | Narrative clarity |

---

## ASCII Layout Sketch

```
[1] T-GRID HERO (opening)
╔════════════════════════════════════════╗
║  "Statement that establishes           ║
║   the project's voice"                 ║
╚════════════════════════════════════════╝

[2] FULL PHOTO 5:3 (hero)
╔════════════════════════════════════════╗
║             ████████████               ║
║             █  HERO IMG  █             ║
╚════════════════════════════════════════╝

[3] TWO-COLUMN (heading-left)
╔══════════╦════════════════════════════╗
║ Heading  ║ Body copy providing        ║
║          ║ context and overview       ║
╚══════════╩════════════════════════════╝

[4] ASYMMETRIC (large-left, small-top)
╔═══════════╦═══════╗
║   LARGE   ║ small ║
║   IMAGE   ╠═══════╣
║           ║       ║
╚═══════════╩═══════╝

[5] T-GRID LEFT (process)
╔════════════════════════════════════════╗
║  Process notes on the left             ║
╚════════════════════════════════════════╝

[6] CAROUSEL (initialIndex: 2)
╔╤══════════╤══════════╤══════════╤╗
║│  img 1  │  img 2   │  img 3   │║  ← drag/scroll →
╚╧══════════╧══════════╧══════════╧╝

[7] QUAD GRID (medium gap, 4/3)
╔══════╦══════╗
║  A   ║  B   ║
╠══════╬══════╣
║  C   ║  D   ║
╚══════╩══════╝

[8] T-GRID RIGHT (story beat)
╔════════════════════════════════════════╗
║              Story beat on right       ║
╚════════════════════════════════════════╝

[9] DIAGONAL (motion)
╔════════════╦════════╗
║ ██████████ ║        ║
║ █  LARGE  █║        ║
╠════════════╬════════╣
║            ║  small ║
╚════════════╩════════╝

[10] FULL PHOTO 5:3 (anchor)
╔════════════════════════════════════════╗
║             ████████████               ║
║             █  CLOSING   █             ║
╚════════════════════════════════════════╝

[11] T-GRID LEFT (reflection)
╔════════════════════════════════════════╗
║  Final reflection on the left          ║
╚════════════════════════════════════════╝
```

---

## Sanity Modeling Notes

- Template is an ordered array of 11 section objects; each stores `type` + fields per section-types guide.
- **Fixed at 11 sections** to preserve balanced pacing; disable add/remove in CMS.
- Default `carousel` to `initialIndex: 2` (mid-start) for implied motion.
- Default `quad-grid` to `gap: medium`, `aspectRatio: 4/3` for landscape feel.
- Default `asymmetric-grid` to `largePosition: left`, `smallPosition: top`.

---

## Pacing Analysis

```
Section  Visual Weight  Position   Density
─────────────────────────────────────────
1        ████           center     LOW
2        ████████████   full       HIGH
3        ██████         split      MEDIUM
4        ████████       left       MEDIUM
5        ████           left       LOW
6        ████████████   carousel   HIGH (interactive)
7        ████████████   grid       HIGH
8        ████           right      LOW
9        ██████         diagonal   MEDIUM
10       ████████████   full       HIGH
11       ████           left       LOW
```

Flow: LOW → HIGH → MEDIUM → MEDIUM → LOW → HIGH → HIGH → LOW → MEDIUM → HIGH → LOW

Four high-density peaks distributed across the page with text valleys between. The carousel+quad back-to-back creates a gallery arc at the midpoint.

---

## When to Use

- Projects that need both visual impact and clear narrative
- Work with diverse image formats (portraits, landscapes, details)
- Projects where process explanation is as important as final results
- Balanced presentations suitable for varied audiences
