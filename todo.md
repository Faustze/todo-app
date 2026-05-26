# TODO-APP — План реализации

## Текущий статус

**Итерации 1–5 — завершены**: каркас, тема, store, CRUD, Vuetify0 primitives, формы и валидация
**Следующая**: полировка UX (итерация 6)

## Что готово

- [x] Vuetify0 плагин с темой (light/dark), стандартный префикс `--v0-*`
- [x] ThemeToggle (cycle + persist + ViewTransition API circle-анимация)
- [x] MainLayout с header (logo + github-иконка + ThemeToggle), main, footer
- [x] Vue Router 5 + вложенные маршруты
- [x] DkButton — Button.Root (variant × size × color из ThemeColorKey)
- [x] DkCard — Atom
- [x] DkToggle — Single.Root для фильтрации (defineModel + @click)
- [x] DkModal — Dialog.Root + Dialog.Content (responsive: center / bottom-sheet)
- [x] DkLayout — адаптивный layout (useBreakpoints)
- [x] TaskList + TaskItem с бейджами, TransitionGroup, storeToRefs
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

- [ ] Checkbox для быстрого переключения статуса
- [ ] Drag'n'drop перемещение задач
- [ ] Toast/notification для CRUD
- [ ] Страница деталей задачи
- [ ] Поиск, сортировка
- [ ] Удалить EditTaskModal.vue (заглушка)
- [ ] Удалить HelloWorld.vue (дефолтный Vite)

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
