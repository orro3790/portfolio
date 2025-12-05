# Work Template 04 — Layered Kinetic (11 sections)

Canonical reference: mirrors the existing "Layers" page—kinetic, image-led, and rhythmically asymmetric. The most dynamic template with continuous visual momentum and alternating weight shifts. Uses only section types defined in `@documentation/agent-guidelines/section-types.md`.

---

## Design Philosophy

This template never lets the eye rest for long. It builds momentum through strategic asymmetry: left-heavy → right-heavy → left-heavy. The horizontal carousel provides an interactive break, while multiple asymmetric grids create a sense of continuous motion. Text sections are short and placed to punctuate rather than pause.

---

## Ordered Section Stack

| # | Type | Purpose | Notes |
|---|------|---------|-------|
| 1 | `t-grid-hero` | Opening quote anchors voice | Brief before visuals take over |
| 2 | `fw-std-53` | Full-bleed sets atmosphere | Immediate visual immersion |
| 3 | `carousel` | Portrait series (mid-start) | Interactive engagement moment |
| 4 | `asymmetric-grid` (large-left, small-top) | Feature + detail, left-heavy | Grounds the flow |
| 5 | `t-grid-right` | Process beat | Right-align shifts weight |
| 6 | `diagonal` | Staircase creates motion | Negative space reset |
| 7 | `t-grid-left` | Materials/process text | Brief pace setter |
| 8 | `fw-std-53` | Second full-bleed | Depth and palette shift |
| 9 | `asymmetric-grid` (large-right, small-top) | Flipped feature/detail | Contrast with #4 |
| 10 | `t-grid-left` | Reflection text | Preps the close |
| 11 | `asymmetric-grid` (large-right, small-bottom) | Final pairing | Detail anchors outro |

---

## ASCII Layout Sketch

```
[1] T-GRID HERO (opening)
╔════════════════════════════════════════╗
║  "Statement that sets the tone"        ║
╚════════════════════════════════════════╝

[2] FULL PHOTO 5:3 (atmosphere)
╔════════════════════════════════════════╗
║             ████████████               ║
║             █  HERO IMG  █             ║
╚════════════════════════════════════════╝

[3] CAROUSEL (portrait series, initialIndex: 2)
╔╤══════════╤══════════╤══════════╤╗
║│  img 1  │  img 2   │  img 3   │║  ← drag/scroll →
╚╧══════════╧══════════╧══════════╧╝

[4] ASYMMETRIC (large-left, small-top)
╔═══════════╦═══════╗
║   LARGE   ║ small ║
║   IMAGE   ╠═══════╣
║           ║       ║
╚═══════════╩═══════╝

[5] T-GRID RIGHT (process)
╔════════════════════════════════════════╗
║              Brief process note        ║
╚════════════════════════════════════════╝

[6] DIAGONAL (motion)
╔════════════╦════════╗
║ ██████████ ║        ║
║ █  LARGE  █║        ║
╠════════════╬════════╣
║            ║  small ║
╚════════════╩════════╝

[7] T-GRID LEFT (materials)
╔════════════════════════════════════════╗
║  Materials note on the left            ║
╚════════════════════════════════════════╝

[8] FULL PHOTO 5:3 (palette shift)
╔════════════════════════════════════════╗
║             ████████████               ║
║             █  SECOND    █             ║
╚════════════════════════════════════════╝

[9] ASYMMETRIC (large-right, small-top) — flipped
╔═══════╦═══════════╗
║ small ║   LARGE   ║
╠═══════╣           ║
║       ║           ║
╚═══════╩═══════════╝

[10] T-GRID LEFT (reflection)
╔════════════════════════════════════════╗
║  Reflection before close               ║
╚════════════════════════════════════════╝

[11] ASYMMETRIC (large-right, small-bottom) — anchors outro
╔═══════╦═══════════╗
║       ║   LARGE   ║
╠═══════╣           ║
║ small ║           ║
╚═══════╩═══════════╝
```

---

## Sanity Modeling Notes

- Template is an ordered array of 11 section objects; each stores `type` + fields per section-types guide.
- **Fixed at 11 sections** to mirror the canonical "Layers" page; disable add/remove in CMS.
- Default `carousel` to `initialIndex: 2` (mid-start) to imply motion on load.
- Asymmetric positions preserve the left→right→left weight shifts; allow overrides sparingly.

---

## Pacing Analysis

```
Section  Visual Weight  Position   Density
─────────────────────────────────────────
1        ████           center     LOW
2        ████████████   full       HIGH
3        ████████████   carousel   HIGH (interactive)
4        ████████       left       MEDIUM
5        ████           right      LOW
6        ██████         diagonal   MEDIUM
7        ████           left       LOW
8        ████████████   full       HIGH
9        ████████       right      MEDIUM
10       ████           left       LOW
11       ████████       right      MEDIUM
```

Flow: LOW → HIGH → HIGH → MEDIUM → LOW → MEDIUM → LOW → HIGH → MEDIUM → LOW → MEDIUM

Three high-density peaks (positions 2, 3, 8) with brief text valleys between. The momentum never fully stops.

---

## Weight Distribution

```
        LEFT                    RIGHT
        ────                    ─────
[1]           ▓▓▓▓
[2]     ████████████████████████████
[3]     ████████████████████████████
[4]     ████████████
[5]                         ████
[6]     ██████████
[7]     ████
[8]     ████████████████████████████
[9]                     ████████████
[10]    ████
[11]                    ████████████
```

Visual weight alternates: center → full → full → LEFT → right → LEFT → left → full → RIGHT → left → RIGHT

The template creates a serpentine visual path that keeps the eye moving.

---

## When to Use

- High-energy, visually dense projects
- Work with many strong images that benefit from continuous display
- Projects where the making process is as important as the result
- Layered, textural work (painting, mixed media, collage)
