# TODO-APP — План и прогресс

## Текущее состояние

| Фича                                                       | Статус       |
| ---------------------------------------------------------- | ------------ |
| CRUD (create/read/update/delete)                           | ✅ Готово    |
| Pinia store + persist (localStorage)                       | ✅ Готово    |
| Тема (light/dark) + ViewTransition + persist + FOUC-fix    | ✅ Готово    |
| Валидация (Vuelidate)                                      | ✅ Готово    |
| Поиск по названию                                          | ✅ Готово    |
| Сортировка (SortPanel dropdown)                            | ✅ Готово    |
| Фильтрация по статусу (FilterPanel)                        | ✅ Готово    |
| Фильтрация по периоду (FilterPanel: день/неделя/месяц)     | ✅ Готово    |
| Детальная страница (/task/:id)                             | ✅ Готово    |
| Типографика (JetBrains Mono, адаптивный базовый размер)    | ✅ Готово    |
| Vuetify0 компоненты (Button, Input, Select, Modal, Toggle) | ✅ Готово    |
| Toast/notification (Snackbar v0 + useSnackbar)             | ✅ Готово    |
| UiButton: layout-shift fix + custom color + responsive     | ✅ Готово    |
| TaskForm: reset + watch(initial) sync                      | ✅ Готово    |
| Proximity highlight (TaskList pointermove)                  | ✅ Готово    |
| Полировка UX (hover, empty state, focus styles)            | 🔧 Частично  |
| Kanban View                                                | ⬜ Не начато |
| API + Deploy (Vercel + Neon)                               | ⬜ Не начато |

## Архитектура

```txt
pages/index.vue → SearchInput + SortPanel + FilterPanel + TaskList
                        ↓
                  useTasks() — Pinia store (persist: localeStorage) + useSnackbar()
                        ↓
                  task-filters.ts → filterTasks, filterTasksByPreset, searchTasks, sortTasks
```

## Активные задачи

### Global

- [x] Теги init
- [ ] Теги: название тега и border-right + tag color для визуального объединения задач
- [ ] Теги: edit color, name via TagPanel
- [ ] Теги: create dashed border
- [ ] Теги: Компонент выбора цвета тега (палитра) (TagColorPicker)

### P1 — UI List

- [ ] Переключение на Grid Layout из flex-col

### P2 — Полировка UX

- [x] Убрать дёргание UiButton при variant="outline" → variant="solid" (layout shift)
- [x] Toast/notification для CRUD операций (Snackbar v0)
- [x] Hover эффекты только на desktop — @media (hover: hover)
- [x] Адаптивные кнопки (shrink на мобилке)
- [x] UiModal центрирование через native dialog (не position/transform)
- [x] UiButton custom color (prop color) для всех variants включая hover
- [x] TagColorPicker: CSS custom properties вместо UnoCSS dynamic classes
- [ ] Красивый Scroll bar вместо дефолтного

### P3 — Kanban View

- [ ] Toggle-кнопка переключения List ↔ Kanban
- [ ] 3 колонки: «В работе» / «Завершённые» / «Отменённые»
- [ ] Drag'n'drop перемещение между колонками (смена статуса)
- [ ] TaskItem в колонке — без действий (только drag handle + контент)

### P4 — Calendary View

- [ ] Calendar component

### P5 — API + Deploy

**Стек:** Vercel Serverless + Neon Postgres + Drizzle ORM
**Стратегия:** offline-first, переключение через `VITE_API_URL`

```txt
todo-app/
├── api/
│   ├── tasks/index.ts      # GET (list), POST (create)
│   ├── tasks/[id].ts       # GET, PATCH, DELETE
│   └── lib/
│       ├── db.ts           # Neon + Drizzle
│       └── schema.ts       # tasks table
├── src/services/tasks.ts   # HTTP-клиент
├── src/stores/useTasks.ts  # адаптер locale ↔ remote
├── drizzle.config.ts
├── vercel.json
└── .env                    # DATABASE_URL, VITE_API_URL
```

#### Этап 1 — Инфраструктура

- [ ] Neon DB → DATABASE_URL
- [ ] drizzle-orm + @neondatabase/serverless + drizzle-kit
- [ ] Схема tasks (id, title, description, status, priority, created_at, updated_at, sync_at)
- [ ] Endpoints: GET/POST /api/tasks, GET/PATCH/DELETE /api/tasks/:id

#### Этап 2 — Адаптация клиента

- [ ] src/services/tasks.ts — fetch-обёртка
- [ ] useTasks.ts — переключение locale/remote через VITE_API_URL
- [ ] Индикатор синхронизации в UI

#### Этап 3 — Deploy

- [ ] Vercel project → connect GitHub
- [ ] Env vars: DATABASE_URL, VITE_API_URL=/api
- [ ] drizzle-kit push → создать таблицы
- [ ] Проверить /api/tasks в проде

#### Этап 4 — Полировка

- [ ] Обработка ошибок (500, 404) → toast
- [ ] Серверная валидация (zod/drizzle constraints)

## Технический долг

- [x] undefined для кириллицы при UiSnackbar → createNotificationsPlugin() не был подключён
- [x] При обновлении страницы теряется тема (persist не включён) → createThemePlugin({ persist: true }) + createStoragePlugin() + inline script FOUC-fix
- [x] Увеличение UI элементов при приближении курсора (useProximity) → pointermove на TaskList
- [x] UiButton hover не работает с prop color → --btn-hover-color + --custom hover для всех variants
- [x] TaskForm не синхронизируется с props.initial → watch(props.initial) + resetForm only for create
- [x] Store update() не видит title при toggleStatus → fallback title из existing task
- [x] UnoCSS dynamic classes не работают → CSS custom properties

## На подумать

- [ ] При удалении задачи переносить ее в отменённые?

## Завершённые итерации

### Итерации 1–6 (базовые)

CRUD, тема, store+persist, Vuetify0 компоненты, формы, валидация, поиск, сортировка, фильтрация, детальная страница

### Итерация 7 — Типографика

Адаптивный базовый размер через clamp(), JetBrains Mono для всего (sans + mono), self-hosted woff2

### Итерация 8 — Единые панели фильтрации и сортировки

FilterPanel (статус + период) + SortPanel (поле + направление) — dropdown с chip-кнопками, общий panel.css

### Итерация 9 — Snackbar, Theme persist, UiButton polish, Proximity

- Snackbar: useSnackbar composable + UiSnackbar (Portal+Queue) + createNotificationsPlugin
- Theme persist: createStoragePlugin + createThemePlugin({ persist: true }) + FOUC-fix inline script
- UiButton: border 1px transparent (no layout shift), custom color (--btn-color/--btn-on-color/--btn-hover-color) для всех variants, responsive shrink, @media (hover: hover) для всех hover
- UiModal: нативное центрирование через <dialog> showModal()
- TaskForm: watch(props.initial) sync, resetForm() only for create, v$.$reset()
- Store update(): fallback title из existing task
- Proximity highlight: pointermove на TaskList, (hover: hover) guard, transition-[scale,filter]
- UnoCSS dynamic classes → CSS custom properties (TagColorPicker)
