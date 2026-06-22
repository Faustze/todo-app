# TODO-APP — Project Context

> Last updated: 2026-06-06
> This file is read by OWL at the start of each new session to restore context.

## Status: Tags are ready. Next: Kanban View, API

## Tech Stack

- Vue 3.5 + TypeScript 6.0
- Vuetify0 (@vuetify/v0 ^1.0.0-alpha.4) — headless, default prefix --v0-\*
- Vue Router 5, Pinia 3 (storeToRefs), Vuelidate 2 (helpers.withMessage)
- UnoCSS 66, Tabler Icons, CSS, Vite 8

## File Structure

```txt
src/
  main.ts              — createApp, createPinia, registerPlugins
  App.vue              — <RouterView /> + UiSnackbar (global toast)
  router/index.ts      — / → pages/index.vue, /task/:id → pages/tasks/[id].vue
  layouts/
    MainLayout.vue     — header (DkLogo + ThemeToggle), main, footer
  pages/
    index.vue          — FilterPanel + SortPanel + SearchInput + TaskList + CreateTaskModal
    tasks/[id].vue     — task detail page (back button + TaskView)
  composables/
    useSnackbar.ts     — wrapper around useNotifications() (show/success/error/warning/info)
  components/
    common/
      ThemeToggle.vue  — cycle + ViewTransition API + persist via useStorage
      DkLogo.vue       — SVG logo (T+D)
    ui/
      UiButton.vue     — Button.Root + spinner + variant × size + color prop (ThemeColorKey, --btn-color/--btn-on-color/--btn-hover-color)
      UiCard.vue       — Atom
      UiToggle.vue     — Single.Root, inheritAttrs:false, class prop
      UiModal.vue      — Dialog.Root + Content (native dialog centering, mobile bottom sheet)
      UiSnackbar.vue   — Snackbar.Portal + Queue + TransitionGroup + severity colors
      UiInput.vue      — Input.Root(:id) + Control + Error, useId() for fieldId
      UiField.vue      — layout wrapper for Input
      UiSelect.vue     — Select.Root + Activator/Content/Item with v-slot="{ attrs }", defineModel
      UiLayout.vue     — useBreakpoints
      index.ts         — barrel export
    views/
      list/
        TaskList.vue       — TransitionGroup + storeToRefs + modals + proximity highlight (pointermove)
        TaskItem.vue       — IconStatus + title + priority styles + TaskItemActions + transition-[scale,filter]
        TaskItemActions.vue— edit/delete/show actions
        TaskView.vue       — detail view (status, priority, dates)
        IconStatus.vue     — checkbox toggle in-progress↔done; cancel = static IconBan
        EmptyState.vue     — IconEraser
        ui/
          SearchInput.vue  — SearchInput component
          filter/
            FilterPanel.vue    — unified filter panel (status + period)
            FilterSelect.vue   — [DEPRECATED]
            FilterOptionItem.vue — [DEPRECATED]
            DateRangePicker.vue — [DEPRECATED]
          sort/
            SortPanel.vue      — unified sort panel (field + direction)
            UiSortButtons.vue  — [DEPRECATED]
          forms/
            TaskForm.vue       — Vuelidate + Input.Root/Control + UiSelect + watch(props.initial) sync + resetForm(create only)
          modals/
            CreateTaskModal.vue, UpdateTaskModal.vue, DeleteTaskModal.vue
          tag/
            TagColorPicker.vue — CSS custom properties for color/hoverColor (not UnoCSS dynamic)
  types/
    task.ts            — Task, TaskStatus, TaskPriority, TaskFilter, DatePreset, TaskFormValues, CreateTask, UpdateTask
    tag.ts             — TaskTag, CreateTaskTag, UpdateTaskTag
    filter.ts          — FilterOption (id, label, children?)
    sort.ts            — SortBy, SortDir
  tokens/
    index.ts           — barrel export
    colors.ts          — lightColors + darkColors (23 keys, single source)
    radius.ts          — CSS custom properties for border radius
    spacing.ts         — CSS custom properties for spacing
    typography.ts      — CSS custom properties for typography
  constants/
    storageKeys.ts     — STORAGE_KEY = 'tasks-sk'
    taskStatuses.ts    — TASK_STATUSES (Record<TaskStatus, { id, color }>)
    taskPriorities.ts  — taskPriorities config
    tag.ts             — TagColorMap + TagColorKey (keyof typeof)
  stores/
    useTasks.ts        — Pinia setup store + persist + useSnackbar + afterHydrate → Date, filter, datePreset, searchQuery, sortBy/sortDir, getTaskById, create, update (fallback title from existing task), remove, setDatePreset, resetFilters
    useTags.ts         — Pinia setup store + persist (key: 'tags-store') + useSnackbar, tags: ref<TaskTag[]>, getTagById, create, update (fallback name), remove
  utils/
    tasks-helpers.ts   — save (serialize/deserialize) for localStorage
    tags-helpers.ts    — save (serialize/deserialize) for tags localStorage
    task-filters.ts    — filterTasks, filterTasksByPreset, getPresetRange, searchTasks, sortTasks, countTasksByStatus
    date.ts            — displayDate
    pointermove.ts     — dock effect (onpointermove proximity scaling)
  plugins/
    index.ts           — registerPlugins
    vuetify0.ts        — createStoragePlugin (BEFORE theme!) + createThemePlugin (persist: true, default: 'dark', target: 'html')
    todoApp.ts         — createBreakpointsPlugin + createRulesPlugin + createNotificationsPlugin
  assets/
    styles/
      style.css        — global styles (fonts, panel, reset)
      _fonts.css       — @font-face for JetBrains Mono
      panel.css        — reusable styles for dropdown panels (.panel-section, .panel-label, .panel-reset)
index.html             — inline script for FOUC-prevention (data-theme from localStorage before JS)
```

## Key Decisions

### Theme

- `createStoragePlugin()` BEFORE `createThemePlugin({ persist: true })` — storage is needed for persist/restore
- `createThemePlugin` with `persist: true` → Vuetify0 saves/restores via `useStorage('theme')`
- Inline `<script>` in `index.html` — FOUC-prevention (sets data-theme on html before JS)
- `colors.ts` — single source (23 keys)
- ThemeToggle: `useTheme().cycle()` + ViewTransition circle animation

### Snackbar (notifications)

- `createNotificationsPlugin()` — required, otherwise `useNotifications()` crashes
- `useSnackbar()` — composable wrapper (show/success/error/warning/info)
- `UiSnackbar.vue` in `App.vue` — Snackbar.Portal + Queue + TransitionGroup
- Severity colors: success (green), error (red), warning (orange), info (primary)
- Store `update()` takes title from payload || existing task (fallback for toggleStatus)
- Hover on Queue → pause auto-dismiss (WCAG)

### UiButton: custom color system

- Prop `color?: ThemeColorKey` → CSS vars `--btn-color`, `--btn-on-color`, `--btn-hover-color`
- `--btn-hover-color: color-mix(in srgb, var(--v0-${color}) 70%, var(--v0-text))` — brighter on hover
- `--custom` class for all variants (solid, outline, ghost, icon, chip)
- Solid hover: `color-mix(80%, black)` for darkening
- Text variants hover: `var(--btn-hover-color)` — shift toward text color

### UiButton: layout & responsive

- `border: 1px solid transparent` on base — removes layout shift between variants
- `@media (max-width: 599px)` — md→sm padding, sm→extra-sm
- All hover inside `@media (hover: hover)` — no sticky hover on touch

### UiModal

- Vuetify0 DialogContent calls `showModal()` — native `<dialog>` is centered by browser
- No position/top/left/transform on desktop (native centering)
- `[data-mobile]` → bottom sheet (position: fixed, bottom: 0)

### Vuetify0: attrs pattern

**This is Vuetify0 (headless), NOT Vuetify 3.** Attrs are a **slot prop**, not `useAttrs()`. Use `v-bind="attrs"` on the interactive element.

**Input.Root/Control:**

- `Input.Root` accepts `:id` → passed to `Input.Control` via `root.id`
- `Input.Control` does **NOT accept `:id`** — id only via Input.Root
- Label: `<label :for="fieldId">` + `<Input.Root :id="fieldId">`

**Select.Root/Content/Item:**

- `Select.Activator v-slot="{ attrs }"` → `v-bind="attrs"` on wrapper
- `Select.Content v-slot="{ attrs }"` → `v-bind="attrs"` on wrapper
- `Select.Item v-slot="{ attrs, isSelected, isHighlighted }"` → `v-bind="attrs"` on option
- **Label for Select:** `<label :id="statusId">` + `aria-labelledby="statusId"` on Activator wrapper

**UiSelect:**

- `defineModel<string>()` stores `item.id`
- `computed selectedLabel` — `options.find(opt => opt.id === model.value)?.label`

### TaskForm: reset & sync

- `watch(() => props.initial)` — form syncs with initial on every change
- `resetForm()` only for `mode === 'create'` (edit updates via watch)
- `v$.value.$reset()` after clearing — reset validation errors

### UnoCSS: dynamic classes do NOT work

- UnoCSS is a static analyzer, `` `text-${color}` `` is invisible → class not generated
- Use CSS custom properties (`--tag-color`, `--btn-color`) + `:style` binding

### Proximity highlight (TaskList)

- `onpointermove` on TransitionGroup — distance from cursor to centerY of each TaskItem
- `t = max(0, 1 - dist / 160)` → scale 1..1.02 + brightness 1..1.06
- `(hover: hover)` guard — desktop only
- `transition-[border-color,scale,filter]` on TaskItem — smoothness

### FilterPanel / SortPanel (dropdown panels)

- `Select.Root` as dropdown container (Activator + Content)
- Chip buttons via `UiButton variant="chip"` / `variant="solid"` (active)
- Shared styles in `panel.css`: `.panel-section`, `.panel-label`, `.panel-reset`

### Pinia Persist

- `pinia-plugin-persistedstate` with `key: 'todo-app-tasks-store'`
- `afterHydrate` — Date from ISO string via `new Date()`
- `watch(tasks, val => save(val), { deep: true })` for saving

### IconStatus

- `in-progress` / `done` → clickable checkbox (IconSquare / IconSquareCheck)
- `cancel` → static IconBan

### Task Priorities

- **High**: `border-left: 2px solid var(--v0-error)` + `background: color-mix(error 8%, surface)` + `font-weight: 700`
- **Middle**: `border-left: 2px solid var(--v0-primary)`, `font-weight: 500`
- **Low**: `border-left: 2px solid var(--v0-muted)` + `color: color-mix(muted 80%, transparent)`, `font-weight: 400`

### Validation

- Vuelidate + `helpers.withMessage()` in English
- Title: required + minLength(3) + maxLength(200), Description: maxLength(500)

### Accessibility

- Search input: `<label for="task-search" class="sr-only">`, `<input id="task-search" name="search">`
- `.sr-only` styles: position absolute, 1x1px, clip, overflow hidden

### Styles

- Plain CSS, no SCSS/sass-embedded
- Global: `style.css` (imports: `_fonts.css`, `panel.css`)
- `panel.css` — reusable classes for dropdown panels
- Component styles — only specific, non-duplicating UnoCSS
