# TODO-APP — Plan and Progress

## Current State

| Feature                                                    | Status         |
| ---------------------------------------------------------- | -------------- |
| CRUD (create/read/update/delete)                           | ✅ Done        |
| Pinia store + persist (localStorage)                       | ✅ Done        |
| Theme (light/dark) + ViewTransition + persist + FOUC-fix   | ✅ Done        |
| Validation (Vuelidate)                                     | ✅ Done        |
| Search by title                                            | ✅ Done        |
| Sorting (SortPanel dropdown)                               | ✅ Done        |
| Filtering by status (FilterPanel)                          | ✅ Done        |
| Filtering by period (FilterPanel: day/week/month)          | ✅ Done        |
| Detail page (/task/:id)                                    | ✅ Done        |
| Typography (JetBrains Mono, adaptive base size)            | ✅ Done        |
| Vuetify0 components (Button, Input, Select, Modal, Toggle) | ✅ Done        |
| Toast/notification (Snackbar v0 + useSnackbar)             | ✅ Done        |
| UiButton: layout-shift fix + custom color + responsive     | ✅ Done        |
| TaskForm: reset + watch(initial) sync                      | ✅ Done        |
| Proximity highlight (TaskList pointermove)                 | ✅ Done        |
| UX polish (hover, empty state, focus styles)               | 🔧 Partial     |
| Kanban View                                                | ⬜ Not started |
| API + Deploy (Vercel + Neon)                               | ⬜ Not started |

## Architecture

```txt
pages/index.vue → SearchInput + SortPanel + FilterPanel + TaskList
                        ↓
                  useTasks() — Pinia store (persist: localeStorage) + useSnackbar()
                        ↓
                  task-filters.ts → filterTasks, filterTasksByPreset, searchTasks, sortTasks
```

## Active Tasks

### Global

- [x] Tags init
- [x] Tags: tag name and border-right + tag color for visual grouping of tasks
- [x] Tags: edit color, name via TagPanel
- [x] Tags: Tag color picker component (TagColorPicker)
- [x] Tags: Color palette grid for tags TagColorPalette
- [x] Tags: Color selection modal TagColorPaletteModal
- [x] Tags: Palette uses CSS vars instead of hex (correct colors on dark/light theme)
- [ ] Tags: Tag deletion confirmation modal
- [ ] Common modals: showConfirm (with text field confirmation), showModal (standard modal)

### P1 — UI List

- [ ] Switch from flex-col to Grid Layout

### P2 — UX Polish

- [x] Remove UiButton jitter when switching variant="outline" → variant="solid" (layout shift)
- [x] Toast/notification for CRUD operations (Snackbar v0)
- [x] Hover effects only on desktop — @media (hover: hover)
- [x] Responsive buttons (shrink on mobile)
- [x] UiModal centering via native dialog (not position/transform)
- [x] UiButton custom color (prop color) for all variants including hover
- [x] TagColorPicker: CSS custom properties instead of UnoCSS dynamic classes

### P3 — Kanban View

- [ ] Toggle button for List ↔ Kanban switching
- [ ] 3 columns: "In Progress" / "Done" / "Cancelled"
- [ ] Drag'n'drop between columns (status change)
- [ ] TaskItem in column — no actions (only drag handle + content)

### P4 — Calendar View

- [ ] Calendar component

### P5 — API + Deploy

**Stack:** Vercel Serverless + Neon Postgres + Drizzle ORM
**Strategy:** offline-first, switching via `VITE_API_URL`

```txt
todo-app/
├── api/
│   ├── tasks/index.ts      # GET (list), POST (create)
│   ├── tasks/[id].ts       # GET, PATCH, DELETE
│   └── lib/
│       ├── db.ts           # Neon + Drizzle
│       └── schema.ts       # tasks table
├── src/services/tasks.ts   # HTTP client
├── src/stores/useTasks.ts  # adapter locale ↔ remote
├── drizzle.config.ts
├── vercel.json
└── .env                    # DATABASE_URL, VITE_API_URL
```

#### Stage 1 — Infrastructure

- [ ] Neon DB → DATABASE_URL
- [ ] drizzle-orm + @neondatabase/serverless + drizzle-kit
- [ ] Tasks schema (id, title, description, status, priority, created_at, updated_at, sync_at)
- [ ] Endpoints: GET/POST /api/tasks, GET/PATCH/DELETE /api/tasks/:id

#### Stage 2 — Client Adaptation

- [ ] src/services/tasks.ts — fetch wrapper
- [ ] useTasks.ts — locale/remote switching via VITE_API_URL
- [ ] Sync indicator in UI

#### Stage 3 — Deploy

- [ ] Vercel project → connect GitHub
- [ ] Env vars: DATABASE_URL, VITE_API_URL=/api
- [ ] drizzle-kit push → create tables
- [ ] Verify /api/tasks in production

#### Stage 4 — Polish

- [ ] Error handling (500, 404) → toast
- [ ] Server-side validation (zod/drizzle constraints)

## Technical Debt

- [x] undefined for Cyrillic in UiSnackbar → createNotificationsPlugin() was not connected
- [x] Theme lost on page reload (persist not enabled) → createThemePlugin({ persist: true }) + createStoragePlugin() + inline script FOUC-fix
- [x] UI elements scale on cursor proximity (useProximity) → pointermove on TaskList
- [x] UiButton hover doesn't work with prop color → --btn-hover-color + --custom hover for all variants
- [x] TaskForm doesn't sync with props.initial → watch(props.initial) + resetForm only for create
- [x] Store update() doesn't see title on toggleStatus → fallback title from existing task
- [x] UnoCSS dynamic classes don't work → CSS custom properties

## To Consider

- [ ] When deleting a task, move it to cancelled?

## Completed Iterations

### Iterations 1–6 (basics)

CRUD, theme, store+persist, Vuetify0 components, forms, validation, search, sorting, filtering, detail page

### Iteration 7 — Typography

Adaptive base size via clamp(), JetBrains Mono for everything (sans + mono), self-hosted woff2

### Iteration 8 — Unified Filter and Sort Panels

FilterPanel (status + period) + SortPanel (field + direction) — dropdown with chip buttons, shared panel.css

### Iteration 9 — Snackbar, Theme persist, UiButton polish, Proximity

- Snackbar: useSnackbar composable + UiSnackbar (Portal+Queue) + createNotificationsPlugin
- Theme persist: createStoragePlugin + createThemePlugin({ persist: true }) + FOUC-fix inline script
- UiButton: border 1px transparent (no layout shift), custom color (--btn-color/--btn-on-color/--btn-hover-color) for all variants, responsive shrink, @media (hover: hover) for all hover
- UiModal: native centering via `<dialog>` showModal()
- TaskForm: watch(props.initial) sync, resetForm() only for create, v$.$reset()
- Store update(): fallback title from existing task
- Proximity highlight: pointermove on TaskList, (hover: hover) guard, transition-[scale,filter]
- UnoCSS dynamic classes → CSS custom properties (TagColorPicker)
