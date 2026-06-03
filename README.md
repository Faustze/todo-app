# todo-app

Клиентское Todo-приложение на Vue 3 + TypeScript с UI на Vuetify0 (headless), полным CRUD, валидацией форм, уведомлениями и хранением в localStorage.

## Запуск

```bash
npm install
npm run dev      # dev-сервер
npm run build    # production сборка
npm run preview  # просмотр билда
```

## Технологический стек

- **Vue 3.5** + **TypeScript 6.0**
- **Vuetify0** (`@vuetify/v0`) — headless компоненты (Button, Single, Dialog, Input, Select, Atom, Snackbar)
- **Pinia 3** — управление состоянием, `storeToRefs` для реактивности
- **Vuelidate 2** — валидация форм с русскими описаниями ошибок
- **Tabler Icons** — все иконки централизованно через `@tabler/icons-vue`
- **UnoCSS** — утилитарные стили (статические классы только, dynamic → CSS custom properties)
- **CSS** — компонентные стили (plain CSS, без препроцессоров)
- **Vite 8** — сборка

## Функциональность

- **CRUD** — создание, чтение, редактирование, удаление задач
- **Уведомления** — Snackbar toast при каждой CRUD-операции (success/error/info)
- **Валидация** — title: required + minLength(3) + maxLength(200), description: maxLength(500)
- **Фильтрация** — по статусу (Все / В процессе / Выполнено / Отменено) + по периоду (День / Неделя / Месяц)
- **Поиск** по названию (case-insensitive)
- **Сортировка** по дате и приоритету (asc/desc)
- **Персистентность** — localStorage с автоматической синхронизацией (pinia-plugin-persistedstate)
- **Темы** — light/dark с persist через Vuetify0 storage + FOUC-prevention inline script
- **Статус задачи** — быстрый toggle in-progress ↔ done через checkbox; cancel = static
- **Приоритеты** — визуальная иерархия (high=red+tint+bold, middle=primary, low=muted)
- **Детальная страница** — /task/:id с полной информацией
- **Proximity highlight** — элементы рядом с курсором подсвечиваются (desktop only)

## Архитектура

```txt
pages/index.vue
  ├── FilterPanel (статус + период)
  ├── SortPanel (поле + направление)
  ├── SearchInput (поиск)
  ├── TaskList (TransitionGroup + proximity highlight)
  │   └── TaskItem (IconStatus + title + priority styles + actions)
  ├── CreateTaskModal → TaskForm (mode=create, resetForm on submit/cancel)
  ├── UpdateTaskModal → TaskForm (mode=edit, watch(initial) sync)
  └── DeleteTaskModal

App.vue
  └── UiSnackbar (Snackbar.Portal + Queue + severity colors)

Pinia Store (useTasks + persist + useSnackbar)
  ├── tasks: ref<Task[]>
  ├── filter/datePreset/searchQuery/sortBy/sortDir
  ├── filteredTasks: computed (filter → preset → search → sort)
  ├── create/signal → snackbar.success
  ├── update → snackbar.info (title from payload || existing task)
  └── remove → snackbar.error

Plugins (vuetify0.ts + todoApp.ts)
  ├── createStoragePlugin() — ДО theme (persist зависит от storage)
  ├── createThemePlugin({ persist: true }) — restore из localStorage
  ├── createBreakpointsPlugin()
  ├── createRulesPlugin()
  └── createNotificationsPlugin() — для useNotifications/useSnackbar
```
