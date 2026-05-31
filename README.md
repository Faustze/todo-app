# todo-app

Клиентское Todo-приложение на Vue 3 + TypeScript с UI на Vuetify0 (headless), полным CRUD, валидацией форм и хранением в localStorage.

## Запуск

```bash
npm install
npm run dev      # dev-сервер
npm run build    # production сборка
npm run preview  # просмотр билда
```

## Технологический стек

- **Vue 3.5** + **TypeScript 6.0**
- **Vuetify0** (`@vuetify/v0`) — headless компоненты (Button, Single, Dialog, Input, Atom)
- **Pinia 3** — управление состоянием, `storeToRefs` для реактивности
- **Vuelidate 2** — валидация форм с русскими описаниями ошибок
- **Tabler Icons** — все иконки централизованно через `@tabler/icons-vue`
- **UnoCSS** — утилитарные стили
- **CSS** — компонентные стили (plain CSS, без препроцессоров)
- **Vite 8** — сборка

## Функциональность

- **CRUD** — создание, чтение, редактирование, удаление задач
- **Валидация** — title: required + minLength(3) + maxLength(200), description: maxLength(500)
- **Фильтрация** по статусу (Все / В процессе / Выполнено / Отменено) через выпадающий список
- **Поиск** по названию (case-insensitive)
- **Сортировка** по дате и приоритету (asc/desc)
- **Персистентность** — localStorage с автоматической синхронизацией (pinia-plugin-persistedstate)
- **Темы** — light/dark с переключением и ViewTransition API
- **Статус задачи** — быстрый toggle in-progress ↔ done через checkbox (IconSquare/IconSquareCheck)
- **Приоритеты** — визуальная иерархия через цветные бордеры (high=red+tint+bold, middle=primary, low=muted)
- **Детальная страница** — /task/:id с полной информацией о задаче

## Архитектура

```txt
pages/index.vue
  ├── FilterSelect (вложенный фильтр по статусу)
  ├── SearchInput (поиск по названию)
  ├── UiSortButtons (сортировка)
  ├── TaskList (TransitionGroup)
  │   └── TaskItem
  │       ├── IconStatus (checkbox toggle + IconBan)
  │       ├── title + TaskItemActions (edit/delete/show)
  │       └── приоритетные стили (high/middle/low)
  ├── CreateTaskModal
  ├── UpdateTaskModal
  └── DeleteTaskModal

pages/tasks/[id].vue (детальная страница)
  ├── BackButton (router.back)
  └── TaskView (статус, приоритет, описание, даты)

Pinia Store (useTasks + persist)
  ├── tasks: ref<Task[]>
  ├── filter: ref<TaskFilter> (default: 'in-progress')
  ├── searchQuery: ref<string>
  ├── sortBy/sortDir
  ├── filteredTasks: computed (filter → search → sort)
  ├── getTaskById(id) → Task | undefined
  └── persist: { afterHydrate → Date, watch → save }
```
