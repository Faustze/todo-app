# todo-app

Клиентское Todo-приложение на Vue 3 + TypeScript с UI на Vuetify0 (headless), полным CRUD, валидацией форм и хранением в localStorage.

## Технологический стек

- **Vue 3.5** + **TypeScript 6.0**
- **Vuetify0** (`@vuetify/v0`) — headless компоненты (Button, Single, Dialog, Input, Atom)
- **Pinia 3** — управление состоянием, `storeToRefs` для реактивности
- **Vuelidate 2** — валидация форм с русскими описаниями ошибок
- **Tabler Icons** — все иконки централизованно через `@tabler/icons-vue`
- **UnoCSS** — утилитарные стили
- **SCSS** — компонентные стили
- **Vite 8** — сборка

## Функциональность

- **CRUD** — создание, чтение, редактирование, удаление задач
- **Валидация** — title: required + minLength(3) + maxLength(200), description: maxLength(500)
- **Фильтрация** по статусу (Все / В процессе / Выполнено / Отменено)
- **Поиск** по названию (case-insensitive)
- **Сортировка** по дате и приоритету (asc/desc)
- **Персистентность** — localStorage с автоматической синхронизацией
- **Темы** — light/dark с переключением и ViewTransition API
- **Статус задачи** — быстрый toggle in-progress ↔ done через checkbox (IconSquare/IconSquareCheck)
- **Приоритеты** — визуальная иерархия через цветные бордеры (high=red+tint+bold, middle=warning, low=muted)

## Модель данных

```typescript
interface Task {
  id: string              // crypto.randomUUID()
  title: string           // обязательное, 3-200 символов
  description?: string    // опционально, до 500 символов
  status: 'in-progress' | 'done' | 'cancel'
  priority: 'low' | 'middle' | 'high'
  createdAtUtc: Date
  updatedAtUtc: Date
}
```

## Архитектура

```
pages/index.vue
  ├── DkToggle (фильтрация по статусу)
  ├── SearchInput (поиск по названию)
  ├── DkSortButtons (сортировка)
  ├── TaskList (TransitionGroup)
  │   └── TaskItem
  │       ├── IconStatus (checkbox toggle + IconBan)
  │       ├── title + date
  │       └── DkButton (edit/delete)
  ├── CreateTaskModal
  ├── UpdateTaskModal
  └── DeleteTaskModal

Pinia Store (useTasks)
  ├── tasks: ref<Task[]>
  ├── filter: ref<TaskFilter> (default: 'in-progress')
  ├── searchQuery: ref<string>
  ├── sortBy/sortDir
  ├── filteredTasks: computed (filter → search → sort)
  └── watch(tasks) → localStorage
```

## Ключевые решения

### Vuetify0 паттерны
- **Single.Root** (DkToggle) — `inheritAttrs: false` + explicit `class` prop, `v-bind="attrs"` на Single.Item обязателен для клика
- **Button.Root** — `loading` через `Button.Loading` sub-component, кастомный spinner через `IconLoader`
- **Dialog.Root** — без Teleport, внутренний portal

### Иконки
- Все иконки через Tabler Icons: `IconBrandGithub`, `IconEraser`, `IconLoader`, `IconSquare`, `IconSquareCheck`, `IconBan`, `IconEdit`, `IconTrash`, `IconSearch`, `IconChevronDown`
- Inline SVG в шаблонах полностью заменены на Tabler-компоненты

### Визуальная иерархия приоритетов
| Приоритет | Бордер | Фон | Текст |
|---|---|---|---|
| High | `3px solid error` | `error 4% tint` | `font-weight: 600` |
| Middle | `3px solid warning` | — | normal |
| Low | `3px solid muted` | — | `color: muted` |

## Запуск

```bash
npm install
npm run dev      # dev-сервер
npm run build    # production сборка
npm run preview  # просмотр билда
```
