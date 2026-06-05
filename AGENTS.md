# TODO-APP — Контекст проекта

> Последнее обновление: 2026-06-06
> Этот файл читает OWL в начале каждой новой сессии для восстановления контекста.

## Статус: Теги готовы. Следующее: Kanban View, API

## Технологический стек

- Vue 3.5 + TypeScript 6.0
- Vuetify0 (@vuetify/v0 ^1.0.0-alpha.4) — headless, стандартный префикс --v0-\*
- Vue Router 5, Pinia 3 (storeToRefs), Vuelidate 2 (helpers.withMessage)
- UnoCSS 66, Tabler Icons, CSS, Vite 8

## Структура файлов

```txt
src/
  main.ts              — createApp, createPinia, registerPlugins
  App.vue              — <RouterView /> + UiSnackbar (глобальный toast)
  router/index.ts      — / → pages/index.vue, /task/:id → pages/tasks/[id].vue
  layouts/
    MainLayout.vue     — header (DkLogo + ThemeToggle), main, footer
  pages/
    index.vue          — FilterPanel + SortPanel + SearchInput + TaskList + CreateTaskModal
    tasks/[id].vue     — детальная страница задачи (back button + TaskView)
  composables/
    useSnackbar.ts     — обёртка над useNotifications() (show/success/error/warning/info)
  components/
    common/
      ThemeToggle.vue  — cycle + ViewTransition API + persist через useStorage
      DkLogo.vue       — SVG логотип (T+D)
    ui/
      UiButton.vue     — Button.Root + spinner + variant × size + color prop (ThemeColorKey, --btn-color/--btn-on-color/--btn-hover-color)
      UiCard.vue       — Atom
      UiToggle.vue     — Single.Root, inheritAttrs:false, class prop
      UiModal.vue      — Dialog.Root + Content (native dialog centering, mobile bottom sheet)
      UiSnackbar.vue   — Snackbar.Portal + Queue + TransitionGroup + severity colors
      UiInput.vue      — Input.Root(:id) + Control + Error, useId() для fieldId
      UiField.vue      — layout wrapper для Input
      UiSelect.vue     — Select.Root + Activator/Content/Item с v-slot="{ attrs }", defineModel
      UiLayout.vue     — useBreakpoints
      index.ts         — barrel export
    views/
      list/
        TaskList.vue       — TransitionGroup + storeToRefs + modals + proximity highlight (pointermove)
        TaskItem.vue       — IconStatus + title + приоритетные стили + TaskItemActions + transition-[scale,filter]
        TaskItemActions.vue— edit/delete/show actions
        TaskView.vue       — детальный просмотр (статус, приоритет, даты)
        IconStatus.vue     — checkbox toggle in-progress↔done; cancel = static IconBan
        EmptyState.vue     — IconEraser
        ui/
          SearchInput.vue  — SearchInput компонент
          filter/
            FilterPanel.vue    — единая панель фильтрации (статус + период)
            FilterSelect.vue   — [УСТАРЕЛ]
            FilterOptionItem.vue — [УСТАРЕЛ]
            DateRangePicker.vue — [УСТАРЕЛ]
          sort/
            SortPanel.vue      — единая панель сортировки (поле + направление)
            UiSortButtons.vue  — [УСТАРЕЛ]
          forms/
            TaskForm.vue       — Vuelidate + Input.Root/Control + UiSelect + watch(props.initial) sync + resetForm(create only)
          modals/
            CreateTaskModal.vue, UpdateTaskModal.vue, DeleteTaskModal.vue
          tag/
            TagColorPicker.vue — CSS custom properties для color/hoverColor (не UnoCSS dynamic)
  types/
    task.ts            — Task, TaskStatus, TaskPriority, TaskFilter, DatePreset, TaskFormValues, CreateTask, UpdateTask
    tag.ts             — TaskTag, CreateTaskTag, UpdateTaskTag
    filter.ts          — FilterOption (id, label, children?)
    sort.ts            — SortBy, SortDir
  tokens/
    index.ts           — barrel export
    colors.ts          — lightColors + darkColors (23 ключа, единый источник)
    radius.ts          — CSS custom properties для скругления
    spacing.ts         — CSS custom properties для отступов
    typography.ts      — CSS custom properties для типографики
  constants/
    storageKeys.ts     — STORAGE_KEY = 'tasks-sk'
    taskStatuses.ts    — TASK_STATUSES (Record<TaskStatus, { id, color }>)
    taskPriorities.ts  — taskPriorities config
    tag.ts             — TagColorMap + TagColorKey (keyof typeof)
  stores/
    useTasks.ts        — Pinia setup store + persist + useSnackbar + afterHydrate → Date, filter, datePreset, searchQuery, sortBy/sortDir, getTaskById, create, update (fallback title from existing task), remove, setDatePreset, resetFilters
    useTags.ts         — Pinia setup store + persist (key: 'tags-store') + useSnackbar, tags: ref<TaskTag[]>, getTagById, create, update (fallback name), remove
  utils/
    tasks-helpers.ts   — save (serialize/deserialize) для localStorage
    tags-helpers.ts    — save (serialize/deserialize) для tags localStorage
    task-filters.ts    — filterTasks, filterTasksByPreset, getPresetRange, searchTasks, sortTasks, countTasksByStatus
    date.ts            — displayDate
    pointermove.ts     — dock-эффект (onpointermove proximity scaling)
  plugins/
    index.ts           — registerPlugins
    vuetify0.ts        — createStoragePlugin (ДО theme!) + createThemePlugin (persist: true, default: 'dark', target: 'html')
    todoApp.ts         — createBreakpointsPlugin + createRulesPlugin + createNotificationsPlugin
  assets/
    styles/
      style.css        — глобальные стили (fonts, panel, reset)
      _fonts.css       — @font-face для JetBrains Mono
      panel.css        — переиспользуемые стили для dropdown-панелей (.panel-section, .panel-label, .panel-reset)
index.html             — inline script для FOUC-prevention (data-theme из localStorage до JS)
```

## Ключевые решения

### Тема

- `createStoragePlugin()` ДО `createThemePlugin({ persist: true })` — storage нужен для persist/restore
- `createThemePlugin` с `persist: true` → Vuetify0 сам сохраняет/восстанавливает через `useStorage('theme')`
- Inline `<script>` в `index.html` — FOUC-prevention (ставит data-theme на html до JS)
- `colors.ts` — единый источник (23 ключа)
- ThemeToggle: `useTheme().cycle()` + ViewTransition circle-анимация

### Snackbar (уведомления)

- `createNotificationsPlugin()` — обязателен, иначе `useNotifications()` падает
- `useSnackbar()` — composable обёртка (show/success/error/warning/info)
- `UiSnackbar.vue` в `App.vue` — Snackbar.Portal + Queue + TransitionGroup
- Severity colors: success (green), error (red), warning (orange), info (primary)
- Store `update()` берёт title из payload || existing task (fallback для toggleStatus)
- Hover на Queue → pause auto-dismiss (WCAG)

### UiButton: custom color system

- Prop `color?: ThemeColorKey` → CSS vars `--btn-color`, `--btn-on-color`, `--btn-hover-color`
- `--btn-hover-color: color-mix(in srgb, var(--v0-${color}) 70%, var(--v0-text))` — ярче при hover
- `--custom` класс для всех variants (solid, outline, ghost, icon, chip)
- Solid hover: `color-mix(80%, black)` для затемнения
- Text variants hover: `var(--btn-hover-color)` — смещение к текстовому цвету

### UiButton: layout & responsive

- `border: 1px solid transparent` на base — убирает layout shift между variants
- `@media (max-width: 599px)` — md→sm padding, sm→extra-sm
- Все hover внутри `@media (hover: hover)` — нет залипания на тач

### UiModal

- Vuetify0 DialogContent вызывает `showModal()` — нативный `<dialog>` центрируется браузером
- Без position/top/left/transform на десктопе (native centering)
- `[data-mobile]` → bottom sheet (position: fixed, bottom: 0)

### Vuetify0: паттерн attrs

**Это Vuetify0 (headless), НЕ Vuetify 3.** Attrs — это **slot prop**, а не `useAttrs()`. Нужно `v-bind="attrs"` на интерактивный элемент.

**Input.Root/Control:**

- `Input.Root` принимает `:id` → передаётся в `Input.Control` через `root.id`
- `Input.Control` **НЕ принимает `:id`** — id только через Input.Root
- Label: `<label :for="fieldId">` + `<Input.Root :id="fieldId">`

**Select.Root/Content/Item:**

- `Select.Activator v-slot="{ attrs }"` → `v-bind="attrs"` на wrapper
- `Select.Content v-slot="{ attrs }"` → `v-bind="attrs"` на wrapper
- `Select.Item v-slot="{ attrs, isSelected, isHighlighted }"` → `v-bind="attrs"` на option
- **Label для Select:** `<label :id="statusId">` + `aria-labelledby="statusId"` на Activator wrapper

**UiSelect:**

- `defineModel<string>()` хранит `item.id`
- `computed selectedLabel` — `options.find(opt => opt.id === model.value)?.label`

### TaskForm: reset & sync

- `watch(() => props.initial)` — форма синхронизируется с initial при каждом изменении
- `resetForm()` только для `mode === 'create'` (edit обновится через watch)
- `v$.value.$reset()` после очистки — сброс ошибок валидации

### UnoCSS: dynamic classes НЕ работают

- UnoCSS — статический анализатор, `` `text-${color}` `` невидим → класс не генерируется
- Использовать CSS custom properties (`--tag-color`, `--btn-color`) + `:style` биндинг

### Proximity highlight (TaskList)

- `onpointermove` на TransitionGroup — расстояние от курсора до centerY каждого TaskItem
- `t = max(0, 1 - dist / 160)` → scale 1..1.02 + brightness 1..1.06
- `(hover: hover)` guard — только десктоп
- `transition-[border-color,scale,filter]` на TaskItem — плавность

### FilterPanel / SortPanel (dropdown-панели)

- `Select.Root` как контейнер для dropdown (Activator + Content)
- Chip-кнопки через `UiButton variant="chip"` / `variant="solid"` (активный)
- Общие стили в `panel.css`: `.panel-section`, `.panel-label`, `.panel-reset`

### Pinia Persist

- `pinia-plugin-persistedstate` с `key: 'todo-app-tasks-store'`
- `afterHydrate` — Date из ISO-строки через `new Date()`
- `watch(tasks, val => save(val), { deep: true })` для сохранения

### IconStatus

- `in-progress` / `done` → кликабельный checkbox (IconSquare / IconSquareCheck)
- `cancel` → статичный IconBan

### Приоритеты задач

- **High**: `border-left: 2px solid var(--v0-error)` + `background: color-mix(error 8%, surface)` + `font-weight: 700`
- **Middle**: `border-left: 2px solid var(--v0-primary)`, `font-weight: 500`
- **Low**: `border-left: 2px solid var(--v0-muted)` + `color: color-mix(muted 80%, transparent)`, `font-weight: 400`

### Валидация

- Vuelidate + `helpers.withMessage()` на русском
- Title: required + minLength(3) + maxLength(200), Description: maxLength(500)

### Accessibility

- Search input: `<label for="task-search" class="sr-only">`, `<input id="task-search" name="search">`
- `.sr-only` стили: position absolute, 1x1px, clip, overflow hidden

### Стили

- Plain CSS, без SCSS/sass-embedded
- Глобальные: `style.css` (imports: `_fonts.css`, `panel.css`)
- `panel.css` — переиспользуемые классы для dropdown-панелей
- Компонентные стили — только специфичные, не дублирующие UnoCSS
