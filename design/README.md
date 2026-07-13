# Handoff: Todo App v2 Redesign (Linear/Raycast style)

## Overview
A restyle of https://github.com/Faustze/todo-app (production: https://todo.faustze.tech). Same features and data model, new look: dark-first Linear/Raycast aesthetic with glow accents, a stats sidebar, and rich micro-animations. Light theme included, switched via animated circle-reveal.

## About the Design Files
The files in this bundle are **design references created in HTML** (`Todo App Redesign.dc.html` — open it in a browser together with `support.js` in the same folder to see the live, interactive design). They are prototypes showing intended look and behavior, **not production code to copy directly**. The task is to **recreate this design in the existing Vue 3 codebase**, using its established patterns: SFC components under `src/components/`, design tokens under `src/tokens/`, composables under `src/composables/`.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, and animation timings below are final — recreate pixel-perfectly.

## Mapping to the existing codebase
- `src/tokens/colors.ts` → replace palette with the Design Tokens below (keep the token-file pattern; expose as CSS custom properties so themes switch by a `data-theme` attribute on `<html>`)
- `src/layouts/MainLayout.vue` → becomes the two-pane shell (sidebar + scrollable main)
- New `Sidebar.vue` (or extend layout): progress ring, status nav, tags list, footer
- `src/components/views/list/TaskItem.vue` → restyled row (spec below)
- `src/components/views/list/ui/SearchInput.vue` → new input with ⌘K badge and focus glow
- `src/components/views/list/ui/filter/FilterPanel.vue` → status filters move to sidebar; period filter becomes segmented control in toolbar
- `src/composables/useProximity.ts` → reuse for the list proximity-hover effect
- Task form/modal → restyle per Modal spec
- Add a toast system (3 max, auto-dismiss 3.3s)

## Screens / Views

### Main screen — two-pane layout
Full viewport height (`100dvh`), `display:flex`, `overflow:hidden` on the shell; only main column scrolls.

**Ambient background (behind everything, pointer-events none):**
Two blurred orbs, `border-radius:50%`, `filter:blur(90–100px)`:
- Orb A: 520×520, `radial-gradient(circle, <primary-deep>, transparent 65%)`, top:-180px left:18%, opacity `.15` dark / `.10` light, drifts `translate(60px,40px) scale(1.15)` over 26s ease-in-out infinite alternate
- Orb B: 480×480, mint gradient, bottom:-220px right:-80px, opacity ×0.7, drifts `translate(-70px,-30px)` over 32s

### Sidebar (264px fixed)
`padding: 20px 14px`, right border 1px `--border`, background `color-mix(in srgb, var(--surface) 72%, transparent)` + `backdrop-filter: blur(14px)`. Vertical stack, gap 18px:

1. **Logo row**: 28×28 icon tile, radius 8, `linear-gradient(135deg, --primary-deep, --mint)`, white checkmark SVG, glow `0 0 16px primary@35%`. Text: "todo-app" 14px/650; under it mono 10px muted, letter-spacing .08em.
2. **Progress card**: padding 14, `--surface`, border `--border`, radius 12. Left: 60×60 SVG ring — track circle r=26 stroke `--border` width 5.5; progress circle stroke `--mint`, round linecap, rotated -90°, `stroke-dasharray: (pct×163.4) 163.4`, transition `.8s cubic-bezier(.2,.8,.2,1)`, `drop-shadow(0 0 5px mint@55%)`; centered mono % label 12.5px/600. Right: mono label "PROGRESS" 10px letter-spacing .12em muted; "N of M done" 13.5px/550; "this week" 11.5px muted.
3. **VIEWS nav** (mono section label 10.5px, .12em): one button per status — All tasks / In Progress / Done / Cancelled. Row: padding 8px 10px, radius 8, 8×8 rounded-square dot (colors: primary / warning / mint / error) + label 13.5px + mono count pill (11px, radius 99, bg `--surface-2`). Active: bg `primary@13%`, border `primary@32%`, text `--text`, weight 560, dot glow `0 0 8px`. Hover (inactive): bg `text@6%`. Transitions .18s.
4. **TAGS list**: rows padding 6px 10px radius 8 — 8px round dot in tag color with `0 0 8px color@45%` glow, label 13px muted (hover → text), mono count.
5. **Footer** (pinned bottom, divider above): "GitHub ↗" mono link 11.5px; theme toggle button — padding 7px 11px, radius 8, `--surface`, border `--border`, mono 11px, sun/moon SVGs cross-fade + rotate(±90°) scale(.5) .3–.4s; hover: border→primary@50%, glow `0 0 12px primary@20%`.

### Main column
`max-width: 780px`, centered, `padding: 40px 32px 90px`.

**Header row** (space-between, margin-bottom 22px):
- "Tasks" 23px/680, letter-spacing -0.02em; below: mono 11.5px muted "N shown · N active · N done"
- **New task button**: padding 9px 16px, radius 9, `linear-gradient(180deg, --primary, --primary-deep)`, white 13.5px/600, border 1px `primary@60%`, glow `0 0 24px primary@40%, 0 2px 8px rgba(0,0,0,.35)`; plus icon 14px. Hover: `translateY(-1px)`, `brightness(1.07)`, glow →55%. Active: `scale(.97)`. Transitions .18–.25s.

**Toolbar** (flex, gap 10, margin-bottom 18px):
- **Search** (flex 1, max 330px): radius 9, `--surface`, border `--border`, padding 9px 34px (search icon left), 13px. Right inside: "⌘K" mono 10px badge (border `--border`, bg `--surface-2`, radius 6). Focus: border `primary@65%`, ring `0 0 0 3px primary@18%` + `0 0 18px primary@15%`. ⌘K/Ctrl+K focuses it; Esc closes modal.
- **Sort button** "Date ↓/↑": padding 9px 13px, radius 9, arrow mono in `--primary`; hover border/glow like theme toggle.
- **Period segmented control**: container padding 3, radius 10, border, `--surface`; segments Day / Week / Month, padding 6px 13px, radius 7, 12.5px. Active: bg `--seg-active`, weight 560, shadow `0 1px 3px rgba(0,0,0,.25), 0 0 0 1px var(--border)`. Click active segment again = off.

**Task row** (`TaskItem`): flex, gap 12, padding 13px 16px, margin-bottom 8, radius 10, bg `--surface`, border 1px `--border`, **left border 2px = priority accent**.
- Priority: high → accent `--error`, title weight 620, arrow "↑" red, plus row bg `linear-gradient(90deg, error@6%, transparent 45%)`; middle → `--primary`, "→"; low → `--border-strong`, "↓" muted, weight 430.
- **Checkbox** 22×22 radius 7: unchecked — transparent, border 1.5px `--border-strong`; hover border `--mint` + glow `0 0 12px mint@50%`. Checked — bg/border `--mint`, dark-ink check (`#052e1f` dark theme / white light theme).
- **Title** 14px, -0.01em; done/cancelled → muted color + animated line-through (pseudo-element 1px line, width 0→100% .35s). Done row opacity .6, cancelled .5.
- Cancelled rows: checkbox replaced by red ⊘ icon (circle + diagonal), 18px.
- **Meta right side**: date mono 11px muted · priority arrow mono 13px/600 · tag pill (padding 2px 9px, radius 99, 11.5px/500, text = tag color, border `tagColor@45%`, bg `tagColor@10%`).
- **Hover actions** (edit ✎, delete 🗑 as stroke SVGs 14px): hidden (`opacity:0, translateX(4px)`), shown on row hover, .2s; 26×26 radius 7; edit hover bg `text@8%`; delete hover bg `error@14%` + red icon. Always visible on touch devices.
- **Row hover**: border → `primary@50%`, `translateY(-1px)`, glow `0 0 0 1px primary@16%, 0 6px 24px -6px primary@30%`.
- **Proximity effect** (from `useProximity`): on pointer-move over the list, rows scale up to 1.02 and brighten up to 1.06 proportional to cursor distance (falloff 160px); reset on leave; disabled on touch.

**Empty state**: dashed border `--border-strong`, radius 12, padding 40px 24px, centered; mono 12px "No tasks match your filters" + "Reset filters" outline button.

### Modal — create/edit task
Fixed overlay: backdrop `bg@55%` + `backdrop-filter: blur(8px)`, fade .25s. Panel: min(440px, 100%), bg `--surface`, border `--border-strong`, radius 14, padding 22, shadow `0 24px 80px -12px rgba(0,0,0,.6)`; enter `translateY(16px) scale(.96)→none` .32s cubic-bezier(.16,.84,.3,1).
- Header: "New task"/"Edit task" 16px/650 + ✕ button.
- Fields (labels mono 10.5px .1em muted): TITLE input, DESCRIPTION textarea (2 rows) — bg `--surface-2`, radius 8, padding 9px 12px, focus ring as search.
- PRIORITY: 3-column grid of buttons; active tints border/bg with priority color (low→primary, medium→warning, high→error @13%).
- TAG: pill buttons (same style as row pills); active = brighter border + bg@16% + soft glow; click again deselects.
- Footer: "Cancel" ghost + submit gradient button (same as New task). Submit disabled (opacity .45) while title < 3 chars.

### Toasts
Fixed bottom-right, stack max 3, width 290. `--surface-2`, radius 10, border tinted by type, 8px glowing dot, 13px text; bottom 2px progress bar animating width 100%→0 over 3.2s linear; enter `translateY(16px) scale(.96)` .35s. Auto-dismiss 3.3s. Types: success=mint ("Task created"), info=primary ("Task updated", "Marked as done", "Returned to progress"), error ("Task deleted").

## Interactions & Behavior
- **Add task**: new row animates in (`taskIn`: opacity 0, translateY(14px), scale(.98) → none, .5s cubic-bezier(.16,.84,.3,1)). On initial list render, stagger delay 40ms×index, capped at 360ms.
- **Delete / filtered-out removal**: row collapses — opacity→0, translateX(36px), max-height→0, vertical padding/margin→0, ~340ms; then remove from DOM. When toggling status makes a row no longer match the active filter, wait ~550ms, then play the same collapse.
- **Checkbox toggle**: check draws via `stroke-dashoffset` 14→0 (.32s, .05s delay) + container pop `scale(.8→1.14→1)` .35s; strike-through animates simultaneously. Toggling back reverses.
- **Filter/sort/period change**: re-render list with the stagger entrance (bump a list `key`/epoch).
- **Theme switch**: View Transitions API circle reveal from the click point — `clip-path: circle(0 → cover-radius)` 520ms ease-in-out; to-dark expands the new view, to-light shrinks the old (see the `data-theme-transition` CSS in the reference file). Fallback: instant swap when API unavailable.
- **Keyboard**: ⌘K/Ctrl+K → focus search; Esc → close modal.
- **Reduced motion**: all animations effectively disabled under `prefers-reduced-motion: reduce`.

## State Management
- `tasks: { id, title, description?, status: 'in-progress'|'done'|'cancel', priority: 'low'|'middle'|'high', tag: string|null, createdAt }[]`
- `filter` (status|all), `period` (today|week|month|null), `search`, `sortDir` (asc|desc)
- `theme: 'dark'|'light'` — persist (localStorage), set `data-theme` on `<html>`
- Modal: `open`, `editingId`, form fields; validation: title ≥ 3 chars
- `toasts: { id, type, msg }[]`
- Derived: counts per status/tag, done percentage for the ring

## Design Tokens

Fonts: **Geist** (UI), **Geist Mono** (labels, counts, dates, badges) — Google Fonts, weights 300–800.

Dark theme:
- bg `#0e0e11` · surface `#16161a` · surface-2 `#1c1c21` · seg-active `#26262d`
- text `#f1f5f9` · muted `#94a3b8` · border `#26262c` · border-strong `#3a3a42`
- primary `#818cf8` · primary-deep `#6366f1` · mint `#27e89e` · error `#f87171` · warning `#fb923c` · check-ink `#052e1f`
- tags: feature `#60a5fa` · bug `#f87171` · study `#818cf8` · docs `#38bdf8` · refactor `#4ade80`

Light theme:
- bg `#f8fafc` · surface `#ffffff` · surface-2 `#f1f5f9` · seg-active `#ffffff`
- text `#0f172a` · muted `#64748b` · border `#e2e8f0` · border-strong `#c9d3e0`
- primary `#6366f1` · primary-deep `#4f46e5` · mint `#0fbe83` · error `#ef4444` · warning `#f59e0b` · check-ink `#ffffff`
- tags: `#3b82f6` / `#ef4444` / `#6366f1` / `#0ea5e9` / `#22c55e`

Radii: rows/toolbar 9–10 · cards/modal 12–14 · inputs/buttons 8 · pills 99. Translucent tints via `color-mix(in srgb, <color> N%, transparent)`. Scrollbar: 10px, thumb `--border-strong` radius 99.

## Assets
No external images. All icons are inline stroke SVGs (~1.4–1.9 stroke width, round caps): check, plus, search, sun/moon, pencil, trash, ✕, ⊘. Priority arrows are text glyphs `↑ → ↓`.

## Files
- `Todo App Redesign.dc.html` — the full interactive reference (single file; template = markup, `class Component` = behavior). Open in a browser with `support.js` alongside.
- `support.js` — runtime for the reference file only; **not** part of the implementation.
