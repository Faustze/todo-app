# TODO-APP — План реализации

## Текущий статус

**Итерации 1–6 — завершены**: CRUD, тема, store+persist, Vuetify0, формы, валидация, поиск, сортировка, фильтрация, детальная страница
**Следующее**: типографика, Kanban View, API

## Что готово

- [x] Vuetify0 плагин с темой (light/dark), стандартный префикс `--v0-*`
- [x] ThemeToggle (cycle + persist + ViewTransition API circle-анимация)
- [x] MainLayout с header (github-иконка + ThemeToggle), main, footer
- [x] Vue Router 5 + вложенные маршруты
- [x] UiButton — Button.Root (variant × size × color из ThemeColorKey)
- [x] UiCard — Atom
- [x] UiToggle — Single.Root для фильтрации (defineModel + @click)
- [x] UiModal — Dialog.Root + Dialog.Content (responsive: center / bottom-sheet)
- [x] UiLayout — адаптивный layout (useBreakpoints)
- [x] TaskList + TaskItem с цветными бордерами приоритета, TransitionGroup, storeToRefs
- [x] TaskForm — Vuelidate + Input.Root/Control/Error, reactive form
  - title: required + minLength(3) + maxLength(200)
  - description: maxLength(500)
  - select appearance:none с кастомной SVG-стрелкой
- [x] Create/Update/DeleteTaskModal + EmptyState
- [x] Фильтрация по статусу (UiToggle → storeToRefs → filteredTasks)
- [x] Статус- и приоритет-бейджи, счётчики задач
- [x] task-filters.ts, taskPriorities.ts, task-display.ts, taskStatuses.ts
- [x] tokens/colors.ts — единый источник (23 ключа)
- [x] plugins: vuetify0 + todoApp (Breakpoints + Rules) + registerPlugins
- [x] Pinia store с **persist plugin** (послеГидрация → Date, key: 'todo-app-tasks-store')
- [x] helpers.withMessage() — русские описания ошибок валидации
- [x] **Поиск** — SearchInput на pages/index.vue (storeToRefs searchQuery → searchTasks)
- [x] **Сортировка** — UiSortButtons (дата/приоритет, asc/desc), sortTasks() в task-filters
- [x] **FilterSelect** — вложенный фильтр по статусу (Select.Root + recursive FilterOptionItem)
- [x] **Детальная страница** — /task/:id (back button + TaskView с мета-данными)

## Архитектура

```txt
TaskItem.vue → TaskList.vue → pages/index.vue
                    ↓
              useTasks()  ←  Pinia store
                    ↓
            tasks-helpers  ←  serialize/deserialize
                    ↓
              localStorage (tasks-sk)
```

## Итерация 6 — Полировка UX ✓ ЗАВЕРШЕНА

- [x] **Поиск по названию** — SearchInput на pages/index.vue (storeToRefs searchQuery → searchTasks)
- [x] **Сортировка TaskItem** — UiSortButtons: по дате createdAtUtc (asc/desc), по приоритету (asc/desc)
- [x] **IconStatus вместо Chip** — иконка статуса с hover tooltip (IconCircleCheck/IconLoader/IconBan)
- [x] **Централизованные иконки** — все Icon\* через Tabler icons единообразно
- [x] **Цвета приоритета TaskItem** — high: error border+tint+bold, middle: primary border, low: muted border+muted title
- [x] **IconClose для UiModal** — кнопка закрытия в модалке (IconX)
- [x] **TaskForm** — режим edit заполняет поля из initial, create — пустые
- [x] Hover на TaskItem — border-color: primary
- [x] Дата отображается через formatDate в TaskView
- [x] Checkbox для быстрого переключения статуса (in-progress ↔ done)
- [x] Фильтр заменён на FilterSelect (Select.Root + filter icon)
- [x] Magnifier icon для SearchInput
- [x] UiSelect (Vuetify0 Select) для модалок
- [x] Общий Input (Input.Root/Control)
- [x] Вложенные фильтры (FilterSelect + FilterOptionItem)
- [x] Страница деталей задачи (/task/:id)
- [ ] Сделать фильтрацию по отрезку времени
- [ ] Toast/notification для CRUD (Snackbar v0)

## Итерация 7 — Типографика

- [ ] Выбрать шрифт и подобрать его размеры адаптивно
- [ ] Разобраться с типографией (tokens/typography.ts создан, но не привязан)

## Итерация 8 — Kanban View

- [ ] Ui toggle button между двумя видами (Kanban, List)
- [ ] 3 колонки: «В работе» (in-progress), «Завершённые» (done), «Все задачи»
- [ ] Drag'n'drop перемещение задач (TaskItem без Actions) между состояниями
- [ ] Cancel-задачи — не отображаются или сортируются в конец

## Итерация 9 — API + Deploy на Vercel

### Стек API

- **Vercel Serverless Functions** (Edge/Node runtime) — бесплатно, Hobby tier (10s timeout, 12 functions)
- **Neon Postgres** — бесплатный tier (512MB, автосleep, подключение через `@neondatabase/serverless`)
- **Drizzle ORM** — лёгкий, без overseed, схема в TS, миграции через drizzle-kit
- **НЕ отдельный Node.js сервер** — serverless functions дешевле и проще в деплое

### Стратегия внедрения: двойной режим (offline-first)

Фронтенд работает в двух режимах — locale (localStorage) и remote (API). Переключение через env:

- `VITE_API_URL` = '' → текущее поведение (localStorage)
- `VITE_API_URL` = '/api' → запросы идут на бекенд

Это позволяет сохранить рабочий local-first режим и плавно добавить серверный.

### Структура

```txt
todo-app/
├── api/                        # Vercel Serverless Functions
│   ├── tasks/
│   │   ├── index.ts            # GET /api/tasks (list), POST /api/tasks (create)
│   │   └── [id].ts             # GET /api/tasks/:id, PATCH /api/tasks/:id, DELETE /api/tasks/:id
│   └── lib/
│       ├── db.ts               # Neon Pool + Drizzle instance
│       └── schema.ts           # tasks table schema (Drizzle)
├── src/
│   ├── services/
│   │   └── tasks.ts            # HTTP-клиент: fetch wrapper для CRUD
│   └── stores/
│       └── useTasks.ts         # адаптер: locale ↔ remote (смотрит на VITE_API_URL)
├── drizzle.config.ts
├── vercel.json                 # rewrites: /api/* → api/*.ts
└── .env                        # DATABASE_URL=postgres://...; VITE_API_URL=/api
```

### Схема данных (Neon + Drizzle)

```ts
// api/lib/schema.ts
export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(), // UUID генерится на клиенте
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("in-progress"), // enum через CHECK
  priority: text("priority").notNull().default("middle"),
  created_at: timestamp("created_at").notNull(),
  updated_at: timestamp("updated_at").notNull(),
  sync_at: timestamp("sync_at"), // когда последний раз синхронизировалось с сервером
});
```

### API Endpoints

| Method | Path           | Body       | Response       |
| ------ | -------------- | ---------- | -------------- |
| GET    | /api/tasks     | —          | Task[]         |
| POST   | /api/tasks     | CreateTask | Task           |
| GET    | /api/tasks/:id | —          | Task           |
| PATCH  | /api/tasks/:id | UpdateTask | Task           |
| DELETE | /api/tasks/:id | —          | 204 No Content |

**Пагинация/поиск/сортировка — только клиентские** на первом этапе (храним в памяти, как сейчас).

### Vercel Deploy

1. Создаётся Neon DB → connection string → сохраняется в Vercel env vars
2. `DATABASE_URL` — для serverless functions (Edge runtime, pooled connection)
3. `VITE_API_URL=/api` — для фронтенда на билде
4. `vercel deploy --prod` — фронтенд + API деплоятся вместе, единый домен
5. Миграции: `npx drizzle-kit push` (или migration file) — ручной запуск перед деплоем

### Offline-поддержка (опционально, позже)

- Pinia store с `optimistic updates` + `sync queue`
- При отсутствии сети — запись в IndexedDB, синхронизация при reconnect

### Альтернатива: Vercel KV (Redis)

Если Postgres кажется тяжёлым для MVP:

- **Vercel KV** — key-value store, бесплатно до 6000 запросов/день
- Структура: `tasks` → JSON-массив, `tasks:{id}` → отдельная задача
- Минус: нет SQL-запросов, сложно фильтровать/сортировать на сервере
- Рекомендую начать с Neon — более масштабируемый

### План работы (этапы)

#### Этап 9.1 — Подготовка инфраструктуры

- [ ] Создать аккаунт на Neon, получить DATABASE_URL
- [ ] `npm install drizzle-orm @neondatabase/serverless` + `drizzle-kit`
- [ ] `drizzle.config.ts` + `api/lib/schema.ts` + `api/lib/db.ts`
- [ ] Протянуть DATABASE_URL через env (`.env` для dev, Vercel env для prod)
- [ ] `api/tasks/index.ts` (GET + POST), `api/tasks/[id].ts` (GET/PATCH/DELETE)
- [ ] Протестировать локально: `vercel dev`

#### Этап 9.2 — Адаптация клиента

- [ ] `src/services/tasks.ts` — fetch-обёртка с типами (CreateTask, UpdateTask, Task[])
- [ ] Рефактор `useTasks.ts`: добавить `isRemote: boolean` + switch locale/remote
  - locale: как сейчас (localStorage)
  - remote: fetch → state
- [ ] `VITE_API_URL` для переключения между режимами
- [ ] В UI — индикатор статуса синхронизации (опционально)

#### Этап 9.3 — Deploy

- [ ] Vercel project → connect GitHub / `vercel deploy`
- [ ] Задать env vars в Vercel: `DATABASE_URL`, `VITE_API_URL`
- [ ] `npx drizzle-kit push` для создания таблиц в Neon
- [ ] Проверить /api/tasks в проде, задеплоить фронтенд

#### Этап 9.4 — Полировка API

- [ ] Обработка ошибок (500, 404) на UI — toast/snackbar
- [ ] Валидация на сервере (zod/drizzle constraints)
- [ ] Лимиты: rate limiting через Vercel Edge Config (опционально)

---

## Functional Acceptance Checklist

- [x] **Create** — модал + Vuelidate блокирует пустое название
- [x] **Read** — список отображает данные из store (+ детальная страница /task/:id)
- [x] **Update** — модал с initial values, id не меняется
- [x] **Delete** — только после подтверждения
- [x] **Persistence** — pinia-plugin-persistedstate, восстановление после перезагрузки
- [x] **Validation** — Vuelidate (title min 3 / max 200, description max 500)
- [x] **Filter** — FilterSelect → storeToRefs → filteredTasks
- [x] **Empty state** — EmptyState
- [x] **Modal flow** — Create/Edit/Delete через модалы
- [x] **Vuetify0 primitives** — Button, Single, Dialog, Select, Input, Atom, Breakpoints
- [x] **Responsive modal** — center desktop / bottom-sheet mobile
- [x] **Select styling** — UiSelect с Vuetify0 Select primitives
- [x] **Search** — инпут по названию, case-insensitive
- [x] **Sort** — по дате и приоритету, asc/desc
- [x] **Detail page** — /task/:id с TaskView
