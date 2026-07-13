# Contributing to todo-app

Thank you for your interest in contributing! This document outlines the guidelines and workflow for contributing to this project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/todo-app.git`
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development Workflow

1. Make your changes in a feature branch
2. Ensure the project builds: `pnpm build`
3. Ensure there are no type errors: `pnpm build` (runs vue-tsc)
4. Commit your changes with a clear commit message
5. Push to your fork and open a Pull Request

## Code Style

- **Language**: All code, comments, and documentation must be in English
- **TypeScript**: Strict mode is enabled. Avoid `any` types
- **Components**: Use Composition API with `<script setup>`
- **Styling**: Use UnoCSS utility classes. For dynamic values, use CSS custom properties
- **Naming**:
  - Components: `PascalCase` (e.g., `UiButton.vue`, `TaskList.vue`)
  - Composables: `use` prefix (e.g., `useSnackbar.ts`)
  - Types: `PascalCase` (e.g., `TaskStatus`, `TaskPriority`)
  - Constants: `UPPER_SNAKE_CASE` for values, `camelCase` for config objects

## Commit Messages

Use clear, descriptive commit messages in English:

- `feat: add Kanban view with drag'n'drop`
- `fix: prevent layout shift on UiButton variant change`
- `docs: update README with API deployment steps`
- `refactor: extract tag validation to composable`

## Project Structure

- `src/components/ui/` — reusable headless UI components (Vuetify0)
- `src/components/views/` — feature-specific view components
- `src/components/common/` — shared utility components
- `src/composables/` — Vue composables
- `src/stores/` — Pinia stores
- `src/types/` — TypeScript type definitions
- `src/utils/` — utility functions
- `src/constants/` — static configuration
- `src/tokens/` — design tokens (colors, spacing, typography)
- `src/plugins/` — Vue plugins
- `docs/` — project documentation

## Key Architectural Decisions

- **Vuetify0 (headless)**: All UI primitives come from `@vuetify/v0`. Never use `useAttrs()` — attrs are slot props
- **Pinia Persist**: Store state is persisted to `localStorage` via `pinia-plugin-persistedstate`
- **Theme**: Light/dark theme via Vuetify0's `createThemePlugin` with `persist: true`
- **UnoCSS**: Static analysis only — dynamic class names don't work. Use CSS custom properties for dynamic values
- **Validation**: Vuelidate 2 with `helpers.withMessage()` for all form validation

## Testing

Currently the project does not have automated tests. When adding features, please:

- Manually verify the feature works in both light and dark themes
- Test on mobile viewports (responsive behavior)
- Verify keyboard navigation and accessibility

## Questions?

Open a GitHub issue with the "question" label if you have any questions about contributing.
