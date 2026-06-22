# todo-app

A client-side Todo application built with Vue 3 + TypeScript, UI on Vuetify0 (headless), full CRUD, form validation, notifications, and localStorage persistence.

## Getting Started

```bash
npm install
npm run dev      # dev server
npm run build    # production build
npm run preview  # preview build
```

## Tech Stack

- **Vue 3.5** + **TypeScript 6.0**
- **Vuetify0** (`@vuetify/v0`) — headless components (Button, Single, Dialog, Input, Select, Atom, Snackbar)
- **Pinia 3** — state management, `storeToRefs` for reactivity
- **Vuelidate 2** — form validation with English error descriptions
- **Tabler Icons** — all icons via `@tabler/icons-vue`
- **UnoCSS** — utility styles (static classes only, dynamic → CSS custom properties)
- **CSS** — component styles (plain CSS, no preprocessors)
- **Vite 8** — build tool

## Features

- **CRUD** — create, read, update, delete tasks
- **Notifications** — Snackbar toast on every CRUD operation (success/error/info)
- **Validation** — title: required + minLength(3) + maxLength(200), description: maxLength(500)
- **Filtering** — by status (All / In Progress / Done / Cancelled) + by period (Day / Week / Month)
- **Search** by title (case-insensitive)
- **Sorting** by date and priority (asc/desc)
- **Persistence** — localStorage with automatic sync (pinia-plugin-persistedstate)
- **Themes** — light/dark with persist via Vuetify0 storage + FOUC-prevention inline script
- **Task status** — quick toggle in-progress ↔ done via checkbox; cancel = static
- **Priorities** — visual hierarchy (high=red+tint+bold, middle=primary, low=muted)
- **Tags** — color-coded task labeling with visual indicator on the right (border-right via inset box-shadow)
- **Detail page** — /task/:id with full information
- **Proximity highlight** — elements near the cursor are highlighted (desktop only)

## Architecture

```txt
pages/index.vue
  ├── FilterPanel (status + period)
  ├── SortPanel (field + direction)
  ├── SearchInput (search)
  ├── TaskList (TransitionGroup + proximity highlight)
  │   └── TaskItem (IconStatus + title + priority styles + actions)
  ├── CreateTaskModal → TaskForm (mode=create, resetForm on submit/cancel)
  ├── UpdateTaskModal → TaskForm (mode=edit, watch(initial) sync)
  └── DeleteTaskModal

App.vue
  └── UiSnackbar (Snackbar.Portal + Queue + severity colors)

Pinia Store (useTasks + persist + useSnackbar)
  ├── tasks: ref<Task[]>
  ├── filter/datePreset/searchQuery/sortBy/sortDir
  ├── filteredTasks: computed (filter → preset → search → sort)
  ├── create/signal → snackbar.success
  ├── update → snackbar.info (title from payload || existing task)
  └── remove → snackbar.error

Plugins (vuetify0.ts + todoApp.ts)
  ├── createStoragePlugin() — BEFORE theme (persist depends on storage)
  ├── createThemePlugin({ persist: true }) — restore from localStorage
  ├── createBreakpointsPlugin()
  ├── createRulesPlugin()
  └── createNotificationsPlugin() — for useNotifications/useSnackbar
```
