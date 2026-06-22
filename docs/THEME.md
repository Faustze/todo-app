# Theme System Summary

This file describes everything currently related to theme switching in the project.

## Where the logic lives

- Theme initialization: [src/plugins/vuetify0.ts](/home/faust/todo-app/src/plugins/vuetify0.ts:1)
- Theme toggle and circle animation: [src/components/ThemeToggle.vue](/home/faust/todo-app/src/components/ThemeToggle.vue:1)
- Global theme styles and View Transition layers: [src/style.scss](/home/faust/todo-app/src/style.scss:1)

## How the theme is structured

- The project uses `createThemePlugin` from `@vuetify/v0`.
- There are two themes: `light` and `dark`.
- Theme colors come from `lightColors` and `darkColors` tokens.
- Vuetify0 sets runtime CSS variables like `--v0-background`, `--v0-on-background`, `--v0-surface`, `--v0-primary`, etc.
- Components don't hardcode colors, they read them via `var(--v0-*)`.

## How the initial theme is selected

File: [src/plugins/vuetify0.ts](/home/faust/todo-app/src/plugins/vuetify0.ts:1)

The order is:

1. `createStoragePlugin()` is connected first.
2. The `theme` key is read from storage.
3. If storage contains `dark`, start with `dark`.
4. If storage contains `light`, start with `light`.
5. If storage is empty, use the system theme via `matchMedia('(prefers-color-scheme: dark)')`.

Result:

- storage has priority;
- system theme is used as fallback;
- the entire theme is centralized in the Vuetify0 plugin.

## How the theme is persisted

File: [src/components/ThemeToggle.vue](/home/faust/todo-app/src/components/ThemeToggle.vue:1)

- The component uses `useStorage()` and `useTheme()`.
- There is a `watch(() => theme.selectedId.value, ...)`.
- After each toggle, the new theme value is written to storage under the `theme` key.

This means:

- the user's theme survives page reload;
- `ThemeToggle` itself doesn't store a separate theme state, it works on top of `useTheme()`.

## How theme switching happens

File: [src/components/ThemeToggle.vue](/home/faust/todo-app/src/components/ThemeToggle.vue:1)

Main handler: `toggleTheme(event: MouseEvent)`.

Workflow:

1. Determine the next theme: if current is `dark`, target is `light`, otherwise `dark`.
2. If not in a browser, call plain `theme.cycle()`.
3. If user has `prefers-reduced-motion: reduce`, call plain `theme.cycle()`.
4. If browser doesn't support `document.startViewTransition`, call plain `theme.cycle()`.
5. If supported:
   - get click coordinates `event.clientX` and `event.clientY`;
   - calculate radius to the farthest corner of the screen;
   - write CSS variables to `document.documentElement`:
     - `--theme-transition-x`
     - `--theme-transition-y`
     - `--theme-transition-radius`
   - write `data-theme-transition="light"` or `data-theme-transition="dark"` to `html`;
   - call `document.startViewTransition(() => theme.cycle())`.

After `transition.ready`, a manual animation is started via Web Animations API:

- for `light -> dark`, animate `::view-transition-new(root)`;
- for `dark -> light`, animate `::view-transition-old(root)`.

The animation is based on `clipPath: circle(...)`.

Important detail:

- the animation has `fill: 'both'` to prevent a brief snap-back of the pseudo-element to its initial state at the end.

## How circle animation works

Files:

- [src/components/ThemeToggle.vue](/home/faust/todo-app/src/components/ThemeToggle.vue:1)
- [src/style.scss](/home/faust/todo-app/src/style.scss:84)

The essence of the effect:

- the browser creates two snapshots of the page:
  - `::view-transition-old(root)` — old theme;
  - `::view-transition-new(root)` — new theme;
- SCSS disables the default transition API animation;
- then only the needed layer is manually animated via `pseudoElement`.

Layer rules:

- when going to `dark`, the new layer is raised to the top;
- when going to `light`, the old dark layer sits on top and collapses in a circle, revealing the light theme underneath.

## What style.scss does

File: [src/style.scss](/home/faust/todo-app/src/style.scss:1)

What's important specifically for the theme:

- `:root` contains utility variables:
  - `--theme-transition-x`
  - `--theme-transition-y`
  - `--theme-transition-radius`
- `html`, `body`, and `#app` use:
  - `background: var(--v0-background)`
  - `color: var(--v0-on-background)`

This is important because:

- the theme background must be set not only on `#app`, but also at the document level;
- otherwise there may be brief flashes of incorrect backdrop during View Transition.

Also in `style.scss` there are layer settings:

- `::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }`
- `html[data-theme-transition='dark']` controls layer order for transition to dark theme
- `html[data-theme-transition='light']` controls layer order for transition to light theme

## Why the theme is built this way

- Single source of truth: `useTheme()` from Vuetify0.
- Colors change via CSS variables, not via manual class toggling on components.
- Animation doesn't interfere with theme business logic, it only visualizes an already-existing transition.
- There's a fallback without animation for browsers without support and for reduced motion.

## If you need to change something

Safest order to touch the logic:

1. `src/plugins/vuetify0.ts` — only if the way the initial theme is selected changes.
2. `src/components/ThemeToggle.vue` — if the switching scenario or animation changes.
3. `src/style.scss` — if global theme colors, document background, or View Transition layers change.

## Short prompt for a human or AI

Use the project's current theme architecture:

- the theme lives in `@vuetify/v0` via `createThemePlugin` and `useTheme()`;
- theme persistence goes through `useStorage()` under the `theme` key;
- colors in components should only be taken from `var(--v0-*)`;
- for theme switch animation, use `document.startViewTransition()` and circle reveal from click coordinates;
- layers `::view-transition-old(root)` and `::view-transition-new(root)` are configured in `src/style.scss`;
- don't replace this with plain `transition: background-color` if the task is specifically about a full-page animation;
- when making changes, preserve the fallback for `prefers-reduced-motion` and browsers without `startViewTransition`.
