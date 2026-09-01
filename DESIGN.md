# Design

## Direction contract

**THESIS.** Eugym is sold in loadable increments, so the interface is built from
the iron itself. It refuses the category default — dark hero photo, condensed
uppercase shout, neon-green "JOIN NOW" — and equally refuses its opposite, pale
wellness minimalism.

**OWN-WORLD.** Machined light ground; cast-iron near-black type and blocks;
IWF competition-plate colours as the tier system, where `#19b24b` is the 10 kg
plate and therefore native material rather than decoration. Hairline steel
rules, 2px machined radii, stamped numerals, knurl texture used as a band and
never as wallpaper.

**STORY.** One membership, many buildings. The visitor reads the tier ladder as
plates that stack, sees which cities each opens, and signs up.

**FIRST VIEWPORT.** The existing split hero is kept. Left column carries the
headline and one action; the right keeps the photography, now in a steel-edged
frame with a stamped tier rail beneath it.

**FORM.** Grounded candidate 3 of 7 (cast-iron plate system), seed `b24284fc`,
scoped by the user to a re-skin: layout and information architecture preserved.

---

## Scope

This is a **material and craft replacement, not a structural one.** Section
order, routes, copy, claims and photography are preserved. What changes is the
palette, type, spacing rhythm, component vocabulary, and state design.

## Color

Strategy: **Committed** — the machined ground owns the surface, cast iron owns
the type, and one plate colour owns the action.

| Token | Value | Role |
|---|---|---|
| `--plate-ground` | `#F2F2EF` | Page field. Machined/chalk, not cream. |
| `--plate-surface` | `#FFFFFF` | Raised panels, cards, inputs. |
| `--plate-iron` | `#16181C` | Primary type, dark blocks. Cast iron. |
| `--plate-steel` | `#5A6068` | Secondary type. |
| `--plate-rule` | `#D5D7D2` | Hairline rules and borders. |
| `--plate-green` | `#19b24b` | **10 kg plate.** Primary action + brand. |
| `--plate-green-deep` | `#0f7a33` | Hover/pressed; passes AA on white text. |
| `--plate-red` | `#C8102E` | 25 kg. Premium tier marker. |
| `--plate-blue` | `#0057B8` | 20 kg. Standard tier marker. |
| `--plate-yellow` | `#FFB81C` | 15 kg. Highlight, badges. |

Tier colours are **identity, not decoration**: a tier keeps its plate colour on
every surface it appears. Never reuse them as generic accents.

## Type

**Archivo** for everything, exploiting its width axis rather than adding a
second family. Display uses the expanded width for stamped-plate presence; body
uses normal width.

Deliberately not: condensed athletic faces (the category cliché), and not the
model-default display serifs.

- Display: 600–700 weight, expanded, tracking `-0.02em`
- Body: 400/500, `1.6` line-height, measure capped at 68ch
- Numerals: `tabular-nums` everywhere a figure can change

## Form and material

- **Radius `2px`.** A machined edge, not a pill. Pills are reserved for status
  chips only.
- **Hairline rules** (`1px solid var(--plate-rule)`) do the separating work;
  heavy shadows do not. Elevation is a `0 1px 2px` at most.
- **Knurl** — a 45° repeating gradient — appears as a narrow band on section
  seams and the auth panel edge. It is a seam treatment, never a background.
- **Stamped numerals** for tier weights and figures: iron on ground with a 1px
  light bottom edge, as a cast numeral catches light.

## Motion

One authored move: **the load.** Elements that represent plates arrive along the
bar axis with weight — `cubic-bezier(.2,.7,.3,1)`, 320ms, from an already-visible
default. No scattered hover lifts. `prefers-reduced-motion` removes travel and
keeps opacity only.

## Accessibility

- Body text ≥ 4.5:1. `--plate-green` on white **fails** (2.80:1) and is
  therefore never used for text on light ground — it is a fill colour, with
  `--plate-green-deep` (5.45:1) for green text and hover states.
- Tier colour is always paired with the tier's name; colour never carries
  meaning alone.
- Focus is a 2px `--plate-iron` outline at 2px offset, never removed.

## Preserved from the incumbent

The logo, the photography, the green, the section order of the landing page, and
all existing copy and claims.
