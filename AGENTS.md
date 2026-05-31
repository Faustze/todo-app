# TODO-APP — Контекст проекта

> Последнее обновление: 2026-05-31
> Этот файл читает OWL в начале каждой новой сессии для восстановления контекста.

## Статус: Итерации 1–6 завершены. Детальная страница задачи /task/:id готова. Следующее: типографика, Kanban View, API

## Технологический стек

- Vue 3.5 + TypeScript 6.0
- Vuetify0 (@vuetify/v0 ^1.0.0-alpha.4) — headless, стандартный префикс --v0-\*
- Vue Router 5, Pinia 3 (storeToRefs), Vuelidate 2 (helpers.withMessage)
- UnoCSS 66, Tabler Icons, CSS, Vite 8
- devkey reference: `https://github.com/vuetifyjs/devkey/tree/master`

## Структура файлов

```txt
src/
  main.ts              — createApp, createPinia, registerPlugins
  App.vue              — <RouterView />
  style.css            — глобальные стили (--v0-*)
  router/index.ts      — / → pages/index.vue, /task/:id → pages/tasks/[id].vue
  layouts/
    MainLayout.vue     — header (DkLogo + ThemeToggle), main, footer
  pages/
    index.vue          — FilterSelect + SearchInput + UiSortButtons + TaskList + CreateTaskModal
    tasks/[id].vue     — детальная страница задачи (back button + TaskView)
  components/
    ThemeToggle.vue    — cycle + ViewTransition API
    DkLogo.vue         — SVG логотип (T+D)
    ui/
      UiButton.vue     — Button.Root + IconLoader spinner + variant × size + color prop (ThemeColorKey)
      UiCard.vue       — Atom
      UiToggle.vue     — Single.Root, inheritAttrs:false, class prop
      UiModal.vue      — Dialog.Root + Content (responsive)
      UiInput.vue      — Input.Root(:id) + Control + Error, useId() для fieldId
      UiField.vue      — layout wrapper для Input
      UiSelect.vue     — Select.Root + Activator/Content/Item с v-slot="{ attrs }", defineModel
      UiLayout.vue     — useBreakpoints
      index.ts         — barrel export
    views/
      list/
        TaskList.vue       — TransitionGroup + storeToRefs + modals
        TaskItem.vue       — IconStatus + title + приоритетные стили + TaskItemActions
        TaskItemActions.vue— edit/delete/show actions
        TaskView.vue       — детальный просмотр (статус, приоритет, даты)
        IconStatus.vue     — checkbox toggle in-progress↔done (IconSquare/IconSquareCheck); cancel = static IconBan
        EmptyState.vue     — IconEraser
        ui/
          SearchInput.vue  — SearchInput компонент
          filter/
            FilterSelect.vue   — Select.Root фильтр по статусу с вложенными опциями
            FilterOptionItem.vue — рекурсивный элемент фильтра
          sort/
            UiSortButtons.vue — сортировка по дате/приоритету (toggle field + direction)
          forms/
            TaskForm.vue       — Vuelidate + Input.Root/Control + UiSelect (edit mode с initial values)
          modals/
            CreateTaskModal.vue, UpdateTaskModal.vue, DeleteTaskModal.vue
  types/
    task.ts            — Task, TaskStatus, TaskPriority, TaskFilter, TaskFormValues, TaskItemActionOption, CreateTask, UpdateTask
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
  stores/
    useTasks.ts        — Pinia setup store + persist plugin + afterHydrate → Date, filter 'in-progress', searchQuery, sortBy/sortDir, getTaskById, create, update, remove
  utils/
    tasks-helpers.ts   — save (serialize/deserialize) для localStorage
    task-filters.ts    — FILTER_OPTIONS, filterTasks, searchTasks, sortTasks, countTasksByStatus, matchesTaskFilter
    date.ts            — formatDate, formatTime
    task-display.ts    — statusLabel, priorityLabel, formatDate
  plugins/
    index.ts           — registerPlugins
    vuetify0.ts        — createThemePlugin (default: 'dark', target: 'html')
    todoApp.ts         — createBreakpointsPlugin + createRulesPlugin
  assets/
    styles/            — style.css, _tokens.css, main.css
```

## Ключевые решения

### Тема

- `createThemePlugin` без кастомного адаптера → `--v0-*` на `<html>`
- `colors.ts` — единый источник (23 ключа)
- ThemeToggle: `useTheme().cycle()` + ViewTransition circle-анимация

### Vuetify0: паттерн attrs

**Это Vuetify0 (headless), НЕ Vuetify 3.** Attrs — это **slot prop**, а не `useAttrs()`. Нужно `v-bind="attrs"` на интерактивный элемент.

**Input.Root/Control:**

- `Input.Root` принимает `:id` → передаётся в `Input.Control` через `root.id`
- `Input.Control` **НЕ принимает `:id`** — id только через Input.Root
- `Input.Control` автоматически получает `aria-describedby`, `aria-errormessage`, `aria-invalid` из контекста
- Label: `<label :for="fieldId">` + `<Input.Root :id="fieldId">` — for совпадает с id на `<input>`

**Select.Root/Content/Item:**

- `Select.Activator v-slot="{ attrs }"` → `v-bind="attrs"` на wrapper (`role="combobox"`, `aria-expanded`, `aria-haspopup`, `aria-controls`)
- `Select.Content v-slot="{ attrs }"` → `v-bind="attrs"` на wrapper (`role="listbox"`, `aria-multiselectable`)
- `Select.Item v-slot="{ attrs, isSelected, isHighlighted }"` → `v-bind="attrs"` на option (`role="option"`, `aria-selected`)
- **Label для Select:** не `<label for>` (нет нативного input), а `<label :id="statusId">` + `aria-labelledby="statusId"` на Activator wrapper. Label внутри Activator со стилем `.sr-only`

**UiSelect:**

- `defineModel<string>()` хранит `item.id`
- `computed selectedLabel` — `options.find(opt => opt.id === model.value)?.label`
- Отображение: `<span v-if="selectedLabel">{{ selectedLabel }}</span>` + `<Select.Placeholder v-else>`

### UiToggle

- `inheritAttrs: false` + explicit `class` prop
- `v-bind="attrs"` от Single.Item на кнопку — обязательно для клика
- Конфликт `mandatory` — убрано

### FilterSelect (вложенные фильтры)

- `Select.Root` + `Select.Activator` (UiButton) + recursive `FilterOptionItem`
- `expandedIds: ref<Set<string>>` — ручное управление раскрытием
- `FILTER_OPTIONS` в task-filters.ts — FilterOption[] с `children[]`
- v-model хранит выбранный `id` (TaskFilter)

### Pinia Persist

- `pinia-plugin-persistedstate` с `key: 'todo-app-tasks-store'`
- `afterHydrate` — Date из ISO-строки через `new Date()`
- `watch(tasks, val => save(val), { deep: true })` для сохранения

### IconStatus

- `in-progress` / `done` → кликабельный checkbox (IconSquare / IconSquareCheck)
- `cancel` → статичный IconBan

### Приоритеты задач

- **High**: `border-left: 3px solid var(--v0-error)` + `background: color-mix(error 8%, surface)` + `font-weight: 700`
- **Middle**: `border-left: 3px solid var(--v0-primary)`, `font-weight: 500`
- **Low**: `border-left: 3px solid var(--v0-muted)` + `color: color-mix(muted 80%, transparent)`, `font-weight: 400`

### Валидация

- Vuelidate + `helpers.withMessage()` на русском
- Title: required + minLength(3) + maxLength(200), Description: maxLength(500)

### Accessibility

- Search input: `<label for="task-search" class="sr-only">`, `<input id="task-search" name="search">`
- TaskForm title/description: `<label :for="titleId">` + `<Input.Root :id="titleId">`
- TaskForm priority: `<label :for="priorityId">` + `<select :id="priorityId">`
- TaskForm status: `<label :id="statusId" class="sr-only">` + `aria-labelledby="statusId"` на Select wrapper
- `.sr-only` стили: position absolute, 1x1px, clip, overflow hidden

### Стили

- Plain CSS, без SCSS/sass-embedded
- Глобальные: `style.css`, `_tokens.css` (CSS custom properties), `main.css` (imports)
- `vite.config.ts` — без `css.preprocessorOptions`
