# Work Template 02 — Gallery-Led Spotlight (9 sections)

Canonical reference: image-forward rhythm that alternates scale and pacing to keep attention while giving breathing room between dense visuals. Uses only layouts defined in `@documentation/agent-guidelines/project-layouts.md`.

## Ordered section stack
1) `fw-std-53` — Full-bleed hero image to set tone immediately.
2) `t-grid-hero` — Big quote to frame the project with a clear voice.
3) `two-column` (heading-left) — Context + overview to ground the story.
4) `quad-grid` (medium gap, 4/3) — Equal-weight set to show range without overwhelming.
5) `t-grid-right` — Text beat on the right to reset rhythm after grids.
6) `asymmetric-grid` (large-left, small-bottom) — Feature + detail pairing for focal depth.
7) `carousel` — Swipeable series for extended gallery moments.
8) `diagonal` — Diagonal two-up to reintroduce motion and negative space.
9) `t-grid-left` — Closing reflection to end with narrative clarity.

## ASCII layout sketch (top → bottom)
```
[1] FULL PHOTO 5:3 (hero)
╔════════════════════════════════════════╗
║                                        ║
║             ████████████               ║
║             █  HERO IMG  █             ║
║             ████████████               ║
╚════════════════════════════════════════╝

[2] T-GRID HERO (big quote)

[3] TWO-COLUMN (heading-left)
╔══════════╦════════════════════════════╗
║ Heading  ║ Body copy                  ║
╚══════════╩════════════════════════════╝

[4] QUAD GRID (medium gap, 4/3)
╔══════╦══════╗
║ A    ║ B    ║
╠══════╬══════╣
║ C    ║ D    ║
╚══════╩══════╝

[5] T-GRID RIGHT (story beat)

[6] ASYMMETRIC (large-left, small-bottom)
╔═══════════╦═══════╗
║   LARGE   ║       ║
║   IMAGE   ╠═══════╣
║           ║ small ║
╚═══════════╩═══════╝

[7] CAROUSEL (swipe horizontal)
╔╤══════════╤══════════╤══════════╤╗
║│  img 1  │  img 2   │  img 3   │║  ← drag/scroll →
╚╧══════════╧══════════╧══════════╧╝

[8] DIAGONAL
╔════════════╦════════╗
║ ██████████ ║        ║
║ █  LARGE  █║        ║
╠════════════╬════════╣
║            ║  small ║
╚════════════╩════════╝

[9] T-GRID LEFT (closing reflection)
```

## Notes for Sanity modeling
- Represent the template as an ordered array of section objects; each entry stores its `type` plus the fields specified in the project-layouts guide (e.g., `media`, `eyebrow`, `text`, `layout`, `largePosition`, `smallPosition`, `initialIndex`, `spacing`, `shape`).
- Keep this template fixed at 9 sections to preserve the gallery-led pacing; disable add/remove to reduce editing decisions while still allowing per-section copy/media overrides.
- Default `quad-grid` to `spacing: medium`, `shape: 4/3` for consistent rhythm; allow overrides if needed.
- Default `asymmetric-grid` to `largePosition: left` and `smallPosition: bottom` to keep the flow after the right-aligned text beat; allow overrides for edge cases.

