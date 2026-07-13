<template>
  <aside class="sidebar" :class="{ 'sidebar--closed': !isOpen }" :data-mobile="isMobile || undefined">
    <div class="sidebar__inner">
      <div class="sidebar__logo">
        <div class="sidebar__logo-tile">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12l5 5L20 6" />
          </svg>
        </div>
        <div class="sidebar__logo-text">
          <div class="sidebar__logo-title">
            todo-app
          </div>
          <div class="sidebar__logo-sub mono">
            TASK MANAGER
          </div>
        </div>
        <button type="button" class="sidebar__collapse" title="Hide sidebar" @click="close">
          <IconLayoutSidebarLeftCollapse size="16" />
        </button>
      </div>

      <div class="sidebar__progress">
        <div class="sidebar__ring">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="26" fill="none" stroke="var(--v0-border)" stroke-width="5.5" />
            <circle
              cx="30" cy="30" r="26" fill="none" stroke="var(--v0-mint)" stroke-width="5.5"
              stroke-linecap="round" class="sidebar__ring-fill"
              :stroke-dasharray="`${donePercent * 163.4} 163.4`"
            />
          </svg>
          <span class="sidebar__ring-label mono">{{ Math.round(donePercent * 100) }}%</span>
        </div>
        <div class="sidebar__progress-copy">
          <div class="sidebar__progress-label mono">
            PROGRESS
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
        <div class="panel-label sidebar__section-label mono">
          VIEWS
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
          <span class="panel-label sidebar__section-label mono">TAGS</span>
          <button type="button" class="sidebar__tag-add" title="Add tag" @click="createOpen = true">
            <IconPlus size="13" />
          </button>
        </div>
        <div v-for="tag in tags" :key="tag.id" class="sidebar__row sidebar__row--tag">
          <span class="sidebar__dot" :style="{ background: `var(--v0-${tag.color})`, boxShadow: `0 0 8px color-mix(in srgb, var(--v0-${tag.color}) 45%, transparent)` }" />
          <span class="sidebar__row-label">{{ tag.name }}</span>
          <span class="sidebar__row-count mono">{{ tagCounts[tag.id] ?? 0 }}</span>
          <span class="sidebar__row-actions">
            <button type="button" class="sidebar__row-action" title="Edit tag" @click.stop="openEdit(tag)">
              <IconPencil size="13" />
            </button>
            <button type="button" class="sidebar__row-action sidebar__row-action--danger" title="Delete tag" @click.stop="remove(tag.id)">
              <IconTrash size="13" />
            </button>
          </span>
        </div>
      </div>

      <div class="sidebar__footer">
        <a
          href="https://github.com/Faustze/todo-app"
          target="_blank"
          rel="noopener noreferrer"
          class="sidebar__github mono"
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
import { IconLayoutSidebarLeftCollapse, IconPencil, IconPlus, IconTrash } from '@tabler/icons-vue'
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
  { id: 'in-progress', label: 'In Progress', color: 'warning' },
  { id: 'done', label: 'Done', color: 'mint' },
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
  background: color-mix(in srgb, var(--v0-surface) 72%, transparent);
  backdrop-filter: blur(14px);
  overflow: hidden;
  transition: width 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}

.sidebar__inner {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 264px;
  height: 100%;
  padding: 20px 14px;
  overflow-y: auto;
}

/* Desktop: collapse width to reclaim the space, content stays fixed-width and clips */
.sidebar--closed:not([data-mobile]) {
  width: 0;
  flex-basis: 0;
  border-right-color: transparent;
}

/* Mobile: slide over content as an overlay */
.sidebar[data-mobile] {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 60;
  background: var(--v0-surface);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.4);
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
  gap: 10px;
  padding: 0 2px;
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
  transition: background 0.15s ease, color 0.15s ease;
}

.sidebar__collapse:hover {
  background: color-mix(in srgb, var(--v0-text) 8%, transparent);
  color: var(--v0-text);
}

.sidebar__logo-tile {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  flex-shrink: 0;
  background: linear-gradient(135deg, var(--v0-primary-deep), var(--v0-mint));
  box-shadow: 0 0 16px color-mix(in srgb, var(--v0-primary) 35%, transparent);
}

.sidebar__logo-title {
  font-size: 14px;
  font-weight: 650;
  color: var(--v0-text);
}

.sidebar__logo-sub {
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--v0-muted);
}

/* Progress card */
.sidebar__progress {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  background: var(--v0-surface);
  border: 1px solid var(--v0-border);
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
  transition: stroke-dasharray 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  filter: drop-shadow(0 0 5px color-mix(in srgb, var(--v0-mint) 55%, transparent));
}

.sidebar__ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--v0-text);
}

.sidebar__progress-label {
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--v0-muted);
}

.sidebar__progress-value {
  font-size: 13.5px;
  font-weight: 550;
  color: var(--v0-text);
  margin-top: 2px;
}

.sidebar__progress-hint {
  font-size: 11.5px;
  color: var(--v0-muted);
  margin-top: 1px;
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
  font-size: 10.5px;
  letter-spacing: 0.12em;
  color: var(--v0-muted);
  padding: 0 10px 4px;
}

.sidebar__tag-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--v0-muted);
  cursor: pointer;
  transition: all 0.15s ease;
}

.sidebar__tag-add:hover {
  color: var(--v0-primary);
  background: color-mix(in srgb, var(--v0-text) 6%, transparent);
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
  padding: 8px 10px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
  text-align: left;
}

.sidebar__row--tag {
  padding: 6px 10px;
  cursor: default;
}

.sidebar__dot {
  width: 8px;
  height: 8px;
  border-radius: 2.5px;
  flex-shrink: 0;
}

.sidebar__row-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13.5px;
  color: var(--v0-text);
}

.sidebar__row--tag .sidebar__row-label {
  font-size: 13px;
  color: var(--v0-muted);
  transition: color 0.15s ease;
}

.sidebar__row--tag:hover .sidebar__row-label {
  color: var(--v0-text);
}

.sidebar__row-count {
  padding: 1px 6px;
  border-radius: 99px;
  background: var(--v0-surface-2);
  font-size: 11px;
  color: var(--v0-muted);
}

.sidebar__row-actions {
  position: absolute;
  right: 8px;
  display: flex;
  gap: 2px;
  opacity: 0;
  transform: translateX(4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  background: var(--v0-surface);
}

.sidebar__row--tag:hover .sidebar__row-actions {
  opacity: 1;
  transform: translateX(0);
}

.sidebar__row--tag:hover .sidebar__row-count {
  display: none;
}

.sidebar__row-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: var(--v0-muted);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.sidebar__row-action:hover {
  background: color-mix(in srgb, var(--v0-text) 8%, transparent);
  color: var(--v0-text);
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
  background: color-mix(in srgb, var(--v0-primary) 13%, transparent);
  border-color: color-mix(in srgb, var(--v0-primary) 32%, transparent);
}

.sidebar__row--active .sidebar__row-label {
  font-weight: 560;
}

.sidebar__row--active .sidebar__dot {
  box-shadow: 0 0 8px currentcolor;
}

/* Footer */
.sidebar__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--v0-border);
}

.sidebar__github {
  font-size: 11.5px;
  color: var(--v0-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}

.sidebar__github:hover {
  color: var(--v0-primary);
}
</style>
