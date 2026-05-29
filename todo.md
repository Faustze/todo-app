# TODO-APP — План реализации

## Текущий статус

**Итерации 1–5 — завершены**: каркас, тема, store, CRUD, Vuetify0 primitives, формы и валидация
**Следующая**: полировка UX (итерация 6)

## Что готово

- [x] Vuetify0 плагин с темой (light/dark), стандартный префикс `--v0-*`
- [x] ThemeToggle (cycle + persist + ViewTransition API circle-анимация)
- [x] MainLayout с header (github-иконка + ThemeToggle), main, footer
- [x] Vue Router 5 + вложенные маршруты
- [x] DkButton — Button.Root (variant × size × color из ThemeColorKey)
- [x] DkCard — Atom
- [x] DkToggle — Single.Root для фильтрации (defineModel + @click)
- [x] DkModal — Dialog.Root + Dialog.Content (responsive: center / bottom-sheet)
- [x] DkLayout — адаптивный layout (useBreakpoints)
- [x] TaskList + TaskItem с цветными бордерами приоритета, TransitionGroup, storeToRefs
- [x] TaskForm — Vuelidate + Input.Root/Control/Error, reactive form
  - title: required + minLength(3) + maxLength(200)
  - description: maxLength(500)
  - select appearance:none с кастомной SVG-стрелкой
- [x] Create/Update/DeleteTaskModal + EmptyState
- [x] Фильтрация по статусу (DkToggle → storeToRefs → filteredTasks)
- [x] Статус- и приоритет-бейджи, счётчики задач
- [x] task-filters.ts, taskPriorities.ts, task-display.ts, taskStatuses.ts
- [x] tokens/colors.ts — единый источник (23 ключа)
- [x] plugins: vuetify0 + todoApp (Breakpoints + Rules) + registerPlugins
- [x] Pinia store с watch → localStorage, storeToRefs pattern
- [x] helpers.withMessage() — русские описания ошибок валидации
- [x] **DkLogo** — SVG логотип (T+D), в MainLayout вместо текстового заголовка
- [x] **Поиск** — инпут по названию на pages/index.vue, searchTasks() в task-filters
- [x] **Сортировка** — DkSortButtons (дата/приоритет, asc/desc), sortTasks() в task-filters

## Архитектура

```
TaskItem.vue → TaskList.vue → pages/index.vue
                    ↓
              useTasks()  ←  Pinia store
                    ↓
            tasks-helpers  ←  serialize/deserialize
                    ↓
              localStorage (tasks-sk)
```

## Итерация 6 — Полировка UX

- [x] **Поиск по названию** — инпут на pages/index.vue под DkToggle (storeToRefs searchQuery → searchTasks)
- [x] **Сортировка TaskItem** — DkSortButtons: по дате createdAtUtc (asc/desc), по приоритету (asc/desc)
- [x] **IconStatus вместо Chip** — иконка статуса с hover tooltip (IconCircleCheck/IconLoader/IconBan)
- [x] **Централизованные иконки** — все Icon* через Tabler icons единообразно
- [x] **Цвета приоритета TaskItem** — high: error border+tint+bold, middle: warning border, low: muted border+muted title; бейдж убран
- [x] **IconClose для DkModal** — кнопка закрытия в модалке (Vuetify0 Dialog.Close или IconX)
- [x] **TaskForm** При редактировании задачи надо в полях оставлять данные которые в нее записаны, а не оставлять их пустыми. При создании задачи естественно нужно оставлять пустыми
- [x] Поменять цвет hover при наведении на TaskItem, сделать его более нейтральным (серым)
- [x] Подумать где лучше расположить дату и время и что отображать
- [x] Checkbox для быстрого переключения статуса
- [ ] Поменять DkToggle на button (filter icon) -> Treeview with checkboxes
- [ ] Поменять magnifer icon для search input
- [ ] Сделать удобный v0-Select для модалок (Create, Update). Как поменять иконку. border цвет?
- [ ] Drag'n'drop перемещение задач
- [ ] Toast/notification для CRUD (Snackbar v0)
- [ ] Страница деталей задачи
- [ ] Выбрать шрифт и подобрать его размеры адаптивно
- [ ] **Переписать README.md**

---

## Functional Acceptance Checklist

- [x] **Create** — модал + Vuelidate блокирует пустое название
- [x] **Read** — список отображает данные из store
- [x] **Update** — модал, id не меняется
- [x] **Delete** — только после подтверждения
- [x] **Persistence** — восстановление после перезагрузки
- [x] **Validation** — Vuelidate (title min 3 / max 200, description max 500)
- [x] **Filter** — DkToggle → storeToRefs → filteredTasks
- [x] **Empty state** — EmptyState
- [x] **Modal flow** — Create/Edit/Delete через модалы
- [x] **Vuetify0 primitives** — Button, Single, Dialog, Atom, Input, Breakpoints
- [x] **Responsive modal** — center desktop / bottom-sheet mobile
- [x] **Select styling** — appearance:none, custom SVG arrow, focus state
- [x] **Search** — инпут по названию, case-insensitive
- [x] **Sort** — по дате и приоритету, asc/desc
