# Theme System Summary

Этот файл описывает все, что сейчас связано со сменой темы в проекте.

## Где находится логика

- Инициализация темы: [src/plugins/vuetify0.ts](/home/faust/todo-app/src/plugins/vuetify0.ts:1)
- Переключатель темы и circle animation: [src/components/ThemeToggle.vue](/home/faust/todo-app/src/components/ThemeToggle.vue:1)
- Глобальные стили темы и слои View Transition: [src/style.scss](/home/faust/todo-app/src/style.scss:1)

## Как устроена тема

- Проект использует `createThemePlugin` из `@vuetify/v0`.
- Есть две темы: `light` и `dark`.
- Цвета тем приходят из токенов `lightColors` и `darkColors`.
- Vuetify0 выставляет runtime CSS variables вида `--v0-background`, `--v0-on-background`, `--v0-surface`, `--v0-primary` и т.д.
- Компоненты не хардкодят цвета, а читают их через `var(--v0-*)`.

## Как выбирается стартовая тема

Файл: [src/plugins/vuetify0.ts](/home/faust/todo-app/src/plugins/vuetify0.ts:1)

Порядок такой:

1. Сначала подключается `createStoragePlugin()`.
2. Из storage читается ключ `theme`.
3. Если в storage лежит `dark`, стартуем с `dark`.
4. Если в storage лежит `light`, стартуем с `light`.
5. Если в storage ничего нет, берем системную тему через `matchMedia('(prefers-color-scheme: dark)')`.

Итог:

- storage имеет приоритет;
- системная тема используется как fallback;
- вся тема централизована в Vuetify0 plugin.

## Как тема сохраняется

Файл: [src/components/ThemeToggle.vue](/home/faust/todo-app/src/components/ThemeToggle.vue:1)

- В компоненте берется `useStorage()` и `useTheme()`.
- Есть `watch(() => theme.selectedId.value, ...)`.
- После каждого переключения новое значение темы записывается в storage по ключу `theme`.

Это значит:

- пользовательская тема переживает перезагрузку страницы;
- сам `ThemeToggle` не хранит отдельный state темы, а работает поверх `useTheme()`.

## Как происходит переключение темы

Файл: [src/components/ThemeToggle.vue](/home/faust/todo-app/src/components/ThemeToggle.vue:1)

Основной обработчик: `toggleTheme(event: MouseEvent)`.

Поток работы:

1. Определяется следующая тема: если сейчас `dark`, то целевая тема `light`, иначе `dark`.
2. Если код не в браузере, вызывается обычный `theme.cycle()`.
3. Если у пользователя `prefers-reduced-motion: reduce`, вызывается обычный `theme.cycle()`.
4. Если браузер не поддерживает `document.startViewTransition`, вызывается обычный `theme.cycle()`.
5. Если поддержка есть:
   - берутся координаты клика `event.clientX` и `event.clientY`;
   - считается радиус до самого дальнего угла экрана;
   - в `document.documentElement` записываются CSS variables:
     - `--theme-transition-x`
     - `--theme-transition-y`
     - `--theme-transition-radius`
   - в `html` пишется `data-theme-transition="light"` или `data-theme-transition="dark"`;
   - вызывается `document.startViewTransition(() => theme.cycle())`.

После `transition.ready` запускается ручная анимация через Web Animations API:

- для `light -> dark` анимируется `::view-transition-new(root)`;
- для `dark -> light` анимируется `::view-transition-old(root)`.

Анимация строится на `clipPath: circle(...)`.

Важная деталь:

- у анимации стоит `fill: 'both'`, чтобы в конце не было краткого возврата pseudo-element в исходное состояние.

## Как работает circle animation

Файлы:

- [src/components/ThemeToggle.vue](/home/faust/todo-app/src/components/ThemeToggle.vue:1)
- [src/style.scss](/home/faust/todo-app/src/style.scss:84)

Суть эффекта:

- браузер создает два снимка страницы:
  - `::view-transition-old(root)` — старая тема;
  - `::view-transition-new(root)` — новая тема;
- SCSS отключает дефолтную анимацию transition API;
- дальше вручную анимируется только нужный слой через `pseudoElement`.

Правила слоев:

- когда идем в `dark`, новый слой поднимается наверх;
- когда идем в `light`, старый темный слой лежит сверху и схлопывается кругом, открывая светлую тему снизу.

## Что делает style.scss

Файл: [src/style.scss](/home/faust/todo-app/src/style.scss:1)

Что важно именно для темы:

- в `:root` лежат служебные переменные:
  - `--theme-transition-x`
  - `--theme-transition-y`
  - `--theme-transition-radius`
- `html`, `body` и `#app` используют:
  - `background: var(--v0-background)`
  - `color: var(--v0-on-background)`

Это важно, потому что:

- фон темы должен быть задан не только на `#app`, но и на уровне документа;
- иначе при View Transition могут быть короткие вспышки неправильного backdrop.

Также в `style.scss` есть настройка слоев:

- `::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }`
- `html[data-theme-transition='dark']` управляет порядком слоев для перехода в темную тему
- `html[data-theme-transition='light']` управляет порядком слоев для перехода в светлую тему

## Почему тема построена именно так

- Источник истины один: `useTheme()` из Vuetify0.
- Цвета меняются через CSS variables, а не через ручное переключение классов у компонентов.
- Анимация не вмешивается в бизнес-логику темы, а только визуализирует already-existing transition.
- Есть fallback без анимации для браузеров без поддержки и для reduced motion.

## Если нужно что-то менять дальше

Безопаснее всего трогать логику в таком порядке:

1. `src/plugins/vuetify0.ts` — только если меняется способ выбора стартовой темы.
2. `src/components/ThemeToggle.vue` — если меняется сценарий переключения или анимация.
3. `src/style.scss` — если меняются глобальные theme colors, document background или слои View Transition.

## Короткий prompt для человека или ИИ

Используй текущую архитектуру темы проекта:

- тема живет в `@vuetify/v0` через `createThemePlugin` и `useTheme()`;
- сохранение темы идет через `useStorage()` по ключу `theme`;
- цвета в компонентах брать только из `var(--v0-*)`;
- для анимации смены темы используется `document.startViewTransition()` и circle reveal от координат клика;
- слои `::view-transition-old(root)` и `::view-transition-new(root)` настраиваются в `src/style.scss`;
- не заменяй это на обычные `transition: background-color`, если задача именно про цельную анимацию всей страницы;
- при изменениях сохраняй fallback для `prefers-reduced-motion` и браузеров без `startViewTransition`.
