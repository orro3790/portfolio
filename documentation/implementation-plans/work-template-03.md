# Work Template 03 — Editorial Calm (8 sections)

Canonical reference: text-led, quiet pacing with generous negative space and restrained imagery. Feels like a magazine feature—measured reveals and alternating text anchors to keep flow without visual overload. Uses only layouts defined in `@documentation/agent-guidelines/project-layouts.md`.

## Ordered section stack
1) `t-grid-hero` — Soft opening quote to set voice without imagery.
2) `two-column` (heading-right) — Context + overview; heading on the right to offset the hero.
3) `fw-std-53` — Single full-bleed image to ground the story visually.
4) `t-grid-left` — Process note to keep narrative momentum.
5) `asymmetric-grid` (large-right, small-top) — Feature + detail with inversion for a subtle jolt.
6) `t-grid-right` — Short text beat to reset after imagery.
7) `image-grid` (3 columns, medium spacing) — Light gallery to show breadth without dominating.
8) `t-grid-left` — Closing reflection to finish with clarity.

## ASCII layout sketch (top → bottom)
```
[1] T-GRID HERO (big quote)

[2] TWO-COLUMN (heading-right)
╔════════════════════════════╦══════════╗
║ Body copy                  ║ Heading  ║
╚════════════════════════════╩══════════╝

[3] FULL PHOTO 5:3
╔════════════════════════════════════════╗
║                                        ║
║           ███████████████              ║
║           █  SINGLE HERO  █            ║
║           ███████████████              ║
╚════════════════════════════════════════╝

[4] T-GRID LEFT (process text)

[5] ASYMMETRIC (large-right, small-top)
╔═══════╦═══════════╗
║ small ║   LARGE   ║
╠═══════╣           ║
║       ║           ║
╚═══════╩═══════════╝

[6] T-GRID RIGHT (short beat)

[7] IMAGE GRID (3 columns, medium gap)
╔══╦══╦══╗
║A ║B ║C ║
╠══╬══╬══╣
║D ║E ║F ║  ← airy grid, keeps images small
╚══╩══╩══╝

[8] T-GRID LEFT (closing reflection)
```

## Notes for Sanity modeling
- Represent the template as an ordered array of section objects; each entry stores its `type` plus the fields specified in the project-layouts guide (`media`, `eyebrow`, `text`, `layout`, `largePosition`, `smallPosition`, `spacing`, `columns`, `shape`, `initialIndex` where applicable).
- Keep this template fixed at 8 sections to preserve the editorial pacing; disable add/remove to minimize decision load while allowing per-section copy/media overrides.
- Default `two-column` to `layout: heading-right` to offset the opening quote; allow override if needed.
- Default `asymmetric-grid` to `largePosition: right`, `smallPosition: top` for the subtle inversion; allow override for edge cases.
- Default `image-grid` to `columns: 3`, `spacing: medium`, `shape: 4/3` to keep the gallery light; permit overrides when more breathing room is required.

