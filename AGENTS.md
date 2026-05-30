# TODO-APP — Контекст проекта

> Последнее обновление: 2026-05-30
> Этот файл читает OWL в начале каждой новой сессии для восстановления контекста.

## Статус: Итерации 1–5 завершены, полировка UX (итерация 6) в процессе

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
  router/index.ts      — / → MainLayout → pages/index.vue
  layouts/
    MainLayout.vue     — header (DkLogo + ThemeToggle), main, footer
  pages/
    index.vue          — UiToggle filter + search input + TaskList + CreateTaskModal
    tasks.vue          — заглушка
  components/
    ThemeToggle.vue    — cycle + ViewTransition API
    UiSortButtons.vue  — сортировка по дате/приоритету (toggle field + direction)
    DkLogo.vue         — SVG логотип (T+D)
    ui/
      UiButton.vue     — Button.Root + IconLoader spinner + color prop (ThemeColorKey)
      UiCard.vue       — Atom
      UiToggle.vue     — Single.Root, inheritAttrs:false, class prop, default 'in-progress'
      UiModal.vue      — Dialog.Root + Content (responsive)
      UiInput.vue      — Input.Root(:id) + Control + Error, useId() для fieldId
      UiSelect.vue     — Select.Root + Activator/Content/Item с v-slot="{ attrs }", defineModel хранит id, computed selectedLabel
      UiLayout.vue     — useBreakpoints
      index.ts         — barrel export
    tasks/
      TaskList.vue     — TransitionGroup + storeToRefs + modals
      TaskItem.vue     — IconStatus + дата; приоритеты: high=error border+bg tint+bold, middle=warning border, low=muted border+muted title
      IconStatus.vue   — checkbox toggle in-progress↔done (IconSquare/IconSquareCheck); cancel = static IconBan
      TaskForm.vue     — Vuelidate + Input.Root(:id) + .sr-only label для статуса + aria-labelledby на Select
      CreateTaskModal.vue, UpdateTaskModal.vue, DeleteTaskModal.vue
    common/EmptyState.vue — IconEraser
  types/task.ts        — Task, TaskStatus, TaskPriority, TaskFilter, TaskFormValues
  tokens/colors.ts     — lightColors + darkColors (23 ключа, единый источник)
  constants/           — storageKeys, taskStatuses, taskPriorities
  stores/useTasks.ts   — Pinia setup store + watch → localStorage, filter default 'in-progress', searchQuery, sortBy/sortDir
  utils/               — tasks-helpers, task-filters (+searchTasks, +sortTasks), date, task-display (+priorityIcon)
  plugins/             — index (registerPlugins), vuetify0, todoApp
  assets/
    styles/            — style.css, _tokens.css, main.css (plain CSS, без препроцессоров)
    icons/             — IconMagnifer.vue
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
- Default filter: `'in-progress'`

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
