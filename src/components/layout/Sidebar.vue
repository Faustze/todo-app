<template>
  <aside class="sidebar" :class="{ 'sidebar--closed': !isOpen }" :data-mobile="isMobile || undefined">
    <div class="sidebar__inner">
      <div class="sidebar__logo">
        <div class="sidebar__logo-tile">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--v0-on-primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12l5 5L20 6" />
          </svg>
        </div>
        <div class="sidebar__logo-text">
          <div class="sidebar__logo-title">
            todo-app
          </div>
          <div class="sidebar__logo-sub">
            Task manager
          </div>
        </div>
        <button type="button" class="sidebar__collapse" title="Hide sidebar" @click="close">
          <PhSidebarSimple size="16" />
        </button>
      </div>

      <div class="sidebar__progress">
        <div class="sidebar__ring">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="26" fill="none" stroke="var(--v0-border)" stroke-width="5.5" />
            <circle
              cx="30" cy="30" r="26" fill="none" stroke="var(--v0-success)" stroke-width="5.5"
              stroke-linecap="round" class="sidebar__ring-fill"
              :stroke-dasharray="`${donePercent * 163.4} 163.4`"
            />
          </svg>
          <span class="sidebar__ring-label mono">{{ Math.round(donePercent * 100) }}%</span>
        </div>
        <div class="sidebar__progress-copy">
          <div class="sidebar__progress-label">
            Progress
          </div>
          <div class="sidebar__progress-value">
            {{ doneCount }} of {{ totalCount }} done
          </div>
          <div class="sidebar__progress-hint">
            this week
          </div>
        </div>
      </div>

      <nav class="sidebar__section">
        <div class="panel-label sidebar__section-label">
          Views
        </div>
        <button
          v-for="view in views"
          :key="view.id"
          type="button"
          class="sidebar__row"
          :class="{ 'sidebar__row--active': filter === view.id }"
          @click="selectView(view.id)"
        >
          <span class="sidebar__dot" :style="{ background: `var(--v0-${view.color})` }" />
          <span class="sidebar__row-label">{{ view.label }}</span>
          <span class="sidebar__row-count mono">{{ statusCounts[view.id] }}</span>
        </button>
      </nav>

      <div class="sidebar__section sidebar__tags">
        <div class="sidebar__section-header">
          <span class="panel-label sidebar__section-label">Tags</span>
          <button type="button" class="sidebar__tag-add" title="Add tag" @click="createOpen = true">
            <PhPlus size="14" />
          </button>
        </div>
        <div v-for="tag in tags" :key="tag.id" class="sidebar__row sidebar__row--tag">
          <span class="sidebar__dot" :style="{ background: `var(--v0-${tag.color})` }" />
          <span class="sidebar__row-label">{{ tag.name }}</span>
          <span class="sidebar__row-count mono">{{ tagCounts[tag.id] ?? 0 }}</span>
          <span class="sidebar__row-actions">
            <button type="button" class="sidebar__row-action" title="Edit tag" @click.stop="openEdit(tag)">
              <PhPencilSimple size="14" />
            </button>
            <button type="button" class="sidebar__row-action sidebar__row-action--danger" title="Delete tag" @click.stop="remove(tag.id)">
              <PhTrash size="14" />
            </button>
          </span>
        </div>
      </div>

      <div class="sidebar__footer">
        <a
          href="https://github.com/Faustze/todo-app"
          target="_blank"
          rel="noopener noreferrer"
          class="sidebar__github"
        >GitHub ↗</a>
        <ThemeToggle />
      </div>
    </div>

    <CreateTagModal v-model="createOpen" :all-names="tagNames" @create="handleCreate" />
    <EditTagModal v-model="editOpen" :tag="editedTag" :all-names="tagNames" @save="handleSave" />
  </aside>
</template>

<script setup lang="ts">
import type { TagColorKey } from '@/constants/tag'
import type { TaskTag } from '@/types/tag'
import type { TaskFilter } from '@/types/task'
import { PhPencilSimple, PhPlus, PhSidebarSimple, PhTrash } from '@phosphor-icons/vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import CreateTagModal from '@/components/views/list/ui/modals/CreateTagModal.vue'
import EditTagModal from '@/components/views/list/ui/modals/EditTagModal.vue'
import { useSidebar } from '@/composables/useSidebar'
import { useTags } from '@/stores/useTags'
import { useTasks } from '@/stores/useTasks'

const { isOpen, isMobile, close } = useSidebar()

const tasksStore = useTasks()
const { filter, doneCount, totalCount, donePercent, statusCounts, tagCounts } = storeToRefs(tasksStore)
const { setFilter } = tasksStore

const tagsStore = useTags()
const { tags } = storeToRefs(tagsStore)
const { remove, update, create } = tagsStore

const views: { id: TaskFilter, label: string, color: string }[] = [
  { id: 'all', label: 'All tasks', color: 'primary' },
  { id: 'in-progress', label: 'In progress', color: 'warning' },
  { id: 'done', label: 'Done', color: 'success' },
  { id: 'cancel', label: 'Cancelled', color: 'error' },
]

const createOpen = ref(false)
const editOpen = ref(false)
const editedTag = ref<TaskTag | null>(null)
const tagNames = computed(() => tags.value.map(t => t.name))

function selectView(id: TaskFilter) {
  setFilter(id)
  if (isMobile.value)
    close()
}

interface TagFormPayload {
  name: string
  color: TagColorKey
}

function handleCreate(values: TagFormPayload) {
  create(values)
}

function openEdit(tag: TaskTag) {
  editedTag.value = tag
  editOpen.value = true
}

function handleSave(values: TagFormPayload) {
  if (!editedTag.value)
    return
  update(editedTag.value.id, values)
}
</script>

<style scoped>
.sidebar {
  position: relative;
  flex: 0 0 264px;
  width: 264px;
  height: 100dvh;
  border-right: 1px solid var(--v0-border);
  background: var(--v0-surface);
  overflow: hidden;
  /* Width collapse is kept on desktop so the task list reflows with the panel */
  transition:
    width var(--dur-move) var(--ease-out),
    border-color var(--dur-color) var(--ease-out),
    transform var(--dur-move) var(--ease-out);
}

.sidebar__inner {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 264px;
  height: 100%;
  padding: 24px 16px 16px;
  overflow-y: auto;
}

/* Desktop: collapse width to reclaim the space, content stays fixed-width and clips */
.sidebar--closed:not([data-mobile]) {
  width: 0;
  flex-basis: 0;
  border-right-color: transparent;
}

/* Mobile: full height panel that slides over the content */
.sidebar[data-mobile] {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 60;
  background: color-mix(in srgb, var(--v0-surface) 92%, transparent);
  backdrop-filter: blur(24px);
}

.sidebar[data-mobile]:not(.sidebar--closed) {
  box-shadow: 0 0 48px color-mix(in srgb, var(--v0-background) 60%, #000);
}

.sidebar[data-mobile].sidebar--closed {
  transform: translateX(-100%);
}

@media (prefers-reduced-motion: reduce) {
  .sidebar {
    transition: none;
  }
}

/* Logo */
.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 4px;
}

.sidebar__collapse {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: auto;
  flex-shrink: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--v0-muted);
  cursor: pointer;
  transition:
    background var(--dur-color) var(--ease-out),
    color var(--dur-color) var(--ease-out);
}

.sidebar__collapse:hover {
  background: color-mix(in srgb, var(--v0-text) 8%, transparent);
  color: var(--v0-text);
}

.sidebar__collapse:active {
  transform: scale(0.98);
}

.sidebar__logo-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  flex-shrink: 0;
  background: var(--v0-primary);
}

.sidebar__logo-title {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--v0-text);
}

.sidebar__logo-sub {
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--v0-muted);
}

/* Progress card */
.sidebar__progress {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: var(--v0-surface-2);
}

.sidebar__ring {
  position: relative;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
}

.sidebar__ring svg {
  transform: rotate(-90deg);
}

.sidebar__ring-fill {
  transition: stroke-dasharray 800ms var(--ease-out);
}

.sidebar__ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 500;
  color: var(--v0-text);
}

.sidebar__progress-label {
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--v0-muted);
}

.sidebar__progress-value {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: var(--v0-text);
  margin-top: 2px;
}

.sidebar__progress-hint {
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--v0-muted);
}

/* Sections */
.sidebar__section {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar__section-label {
  padding: 0 12px 4px;
}

.sidebar__section-header .sidebar__section-label {
  padding-right: 0;
}

.sidebar__tag-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--v0-muted);
  cursor: pointer;
  transition:
    background var(--dur-color) var(--ease-out),
    color var(--dur-color) var(--ease-out);
}

.sidebar__tag-add:hover {
  color: var(--v0-primary);
  background: color-mix(in srgb, var(--v0-text) 6%, transparent);
}

.sidebar__tag-add:active {
  transform: scale(0.98);
}

.sidebar__tags {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

/* Rows */
.sidebar__row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition:
    background var(--dur-color) var(--ease-out),
    color var(--dur-color) var(--ease-out);
  text-align: left;
}

.sidebar__row:not(.sidebar__row--tag):active {
  transform: scale(0.98);
}

.sidebar__row--tag {
  padding: 4px 12px;
  min-height: 32px;
  cursor: default;
}

.sidebar__dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}

.sidebar__row-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: var(--v0-text);
}

.sidebar__row--tag .sidebar__row-label {
  color: var(--v0-muted);
  transition: color var(--dur-color) var(--ease-out);
}

.sidebar__row--tag:hover .sidebar__row-label {
  color: var(--v0-text);
}

.sidebar__row-count {
  padding: 0 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--v0-muted);
}

.sidebar__row-actions {
  position: absolute;
  right: 8px;
  display: flex;
  gap: 2px;
  opacity: 0;
  transform: translateX(4px);
  transition:
    opacity var(--dur-color) var(--ease-out),
    transform var(--dur-color) var(--ease-out);
  background: var(--v0-surface);
}

.sidebar__row--tag:hover .sidebar__row-actions,
.sidebar__row--tag:focus-within .sidebar__row-actions {
  opacity: 1;
  transform: translateX(0);
}

.sidebar__row--tag:hover .sidebar__row-count,
.sidebar__row--tag:focus-within .sidebar__row-count {
  visibility: hidden;
}

.sidebar__row-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--v0-muted);
  cursor: pointer;
  transition:
    background var(--dur-color) var(--ease-out),
    color var(--dur-color) var(--ease-out);
}

.sidebar__row-action:hover {
  background: color-mix(in srgb, var(--v0-text) 8%, transparent);
  color: var(--v0-text);
}

.sidebar__row-action:active {
  transform: scale(0.98);
}

.sidebar__row-action--danger:hover {
  background: color-mix(in srgb, var(--v0-error) 14%, transparent);
  color: var(--v0-error);
}

@media (hover: hover) {
  .sidebar__row:not(.sidebar__row--active):not(.sidebar__row--tag):hover {
    background: color-mix(in srgb, var(--v0-text) 6%, transparent);
  }
}

.sidebar__row--active {
  background: color-mix(in srgb, var(--v0-primary) 14%, transparent);
}

.sidebar__row--active .sidebar__row-label {
  font-weight: 500;
}

.sidebar__row--active .sidebar__row-count {
  color: var(--v0-text);
}

/* Footer */
.sidebar__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--v0-border);
}

.sidebar__github {
  padding: 4px;
  border-radius: 4px;
  font-size: 0.75rem;
  line-height: 1rem;
  color: var(--v0-muted);
  text-decoration: none;
  transition: color var(--dur-color) var(--ease-out);
}

.sidebar__github:hover {
  color: var(--v0-primary);
}
</style>
