# Work Template 03 — Editorial Calm (8 sections)

Canonical reference: text-led, contemplative pacing with generous negative space. Feels like a magazine feature—measured reveals and alternating text anchors without visual overload. Uses only section types defined in `@documentation/agent-guidelines/section-types.md`.

---

## Design Philosophy

This template lets the writing breathe. Images punctuate rather than dominate. The asymmetric grid provides focal depth without overwhelming, and the light image-grid creates an airy gallery feel. Text sections alternate left/right to create subtle visual flow without abrupt weight shifts.

---

## Ordered Section Stack

| # | Type | Purpose | Notes |
|---|------|---------|-------|
| 1 | `t-grid-hero` | Soft opening quote | Sets voice without imagery |
| 2 | `two-column` (heading-right) | Context + overview | Right-heading offsets the opening |
| 3 | `fw-std-53` | Single hero image | Grounds story visually |
| 4 | `t-grid-left` | Process note | Maintains narrative momentum |
| 5 | `asymmetric-grid` (large-right, small-top) | Feature + detail | Inverted position for subtle jolt |
| 6 | `t-grid-right` | Short text beat | Resets after imagery |
| 7 | `image-grid` (3 cols, medium) | Light gallery | Shows breadth without dominating |
| 8 | `t-grid-left` | Closing reflection | Finishes with clarity |

---

## ASCII Layout Sketch

```
[1] T-GRID HERO (opening quote)
╔════════════════════════════════════════╗
║  "A quiet statement that               ║
║   sets the tone softly"                ║
╚════════════════════════════════════════╝

[2] TWO-COLUMN (heading-right)
╔════════════════════════════╦══════════╗
║ Body copy that provides    ║ Heading  ║
║ context and overview       ║          ║
╚════════════════════════════╩══════════╝

[3] FULL PHOTO 5:3
╔════════════════════════════════════════╗
║                                        ║
║           ███████████████              ║
║           █  SINGLE HERO  █            ║
║           ███████████████              ║
╚════════════════════════════════════════╝

[4] T-GRID LEFT (process text)
╔════════════════════════════════════════╗
║  Process notes on the left             ║
║  to keep momentum                      ║
╚════════════════════════════════════════╝

[5] ASYMMETRIC (large-right, small-top)
╔═══════╦═══════════╗
║ small ║   LARGE   ║
╠═══════╣           ║
║       ║           ║
╚═══════╩═══════════╝

[6] T-GRID RIGHT (short beat)
╔════════════════════════════════════════╗
║              Brief text                ║
║              on the right              ║
╚════════════════════════════════════════╝

[7] IMAGE GRID (3 columns, medium gap)
╔══════╦══════╦══════╗
║  A   ║  B   ║  C   ║
╠══════╬══════╬══════╣
║  D   ║  E   ║  F   ║  ← airy, keeps images small
╚══════╩══════╩══════╝

[8] T-GRID LEFT (closing reflection)
╔════════════════════════════════════════╗
║  Final thoughts on the left            ║
║  ending with contemplative clarity     ║
╚════════════════════════════════════════╝
```

---

## Sanity Modeling Notes

- Template is an ordered array of 8 section objects; each stores `type` + fields per section-types guide.
- **Fixed at 8 sections** to preserve editorial pacing; disable add/remove in CMS.
- Default `two-column` to `layout: heading-right` to offset opening quote.
- Default `asymmetric-grid` to `largePosition: right`, `smallPosition: top` for the inverted feel.
- Default `image-grid` to `columns: 3`, `gap: medium` to keep gallery light and airy.

---

## Pacing Analysis

```
Section  Visual Weight  Position   Density
─────────────────────────────────────────
1        ████           center     LOW
2        ██████         split      MEDIUM
3        ████████████   full       HIGH
4        ████           left       LOW
5        ████████       asymm      MEDIUM
6        ████           right      LOW
7        ██████         grid       MEDIUM
8        ████           left       LOW
```

Flow: LOW → MEDIUM → HIGH → LOW → MEDIUM → LOW → MEDIUM → LOW

The single full-bleed at position 3 is the only high-density moment. The template deliberately avoids immersive components to maintain its contemplative character.

---

## When to Use

- Photography series with strong written narrative
- Process-focused projects where the story matters as much as the visuals
- Quieter, more introspective work that benefits from breathing room
- Projects where you want the viewer to slow down and read
