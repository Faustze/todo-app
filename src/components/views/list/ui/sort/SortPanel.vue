<template>
  <Select.Root v-model="isOpen">
    <Select.Activator v-slot="{ attrs }">
      <button class="sort-trigger" v-bind="attrs">
        {{ activeLabel }}
        <span class="sort-trigger__arrow mono">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
      </button>
    </Select.Activator>

    <Select.Content
      class="p-3 rounded-xl border border-divider bg-surface shadow-lg"
      :style="{ minWidth: '180px' }"
    >
      <div class="panel-section">
        <!-- Sort by field -->
        <div>
          <span class="panel-label flex justify-center">Sort by</span>
          <div class="flex flex-col gap-1 mt-2">
            <UiButton
              v-for="(opt, idx) in sortOptions"
              :key="idx"
              size="extra-sm"
              color="primary"
              :variant="(sortBy === opt.id) ? 'solid' : 'chip'"
              @click="onSortClick(opt.id)"
            >
              <div class="flex flex-row gap-2 items-center">
                <component :is="opt.icon" size="16" />
                <span>{{ opt.label }}</span>
                <span class="ml-auto">
                  <component
                    :is="sortDirIcon"
                    v-if="sortBy === opt.id"
                    size="14"
                  />
                </span>
              </div>
            </UiButton>
          </div>
        </div>

        <div class="border-t border-divider my-2" />

        <button
          type="button"
          class="panel-reset"
          :disabled="!hasSorting"
          @click="onReset"
        >
          Reset
        </button>
      </div>
    </Select.Content>
  </Select.Root>
</template>

<script setup lang="ts">
import type { SortBy } from '@/types/sort'
import { PhCalendarBlank, PhFlag, PhSortAscending, PhSortDescending } from '@phosphor-icons/vue'
import { Select } from '@vuetify/v0'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import { useTasks } from '@/stores/useTasks'

const store = useTasks()
const { sortBy, sortDir } = storeToRefs(store)
const { setSortBy, toggleSortDir } = store

const isOpen = ref<string>('false')

const sortOptions = [
  { id: 'date' as SortBy, label: 'Date', icon: PhCalendarBlank },
  { id: 'priority' as SortBy, label: 'Priority', icon: PhFlag },
]

const sortDirIcon = computed(() =>
  sortDir.value === 'asc' ? PhSortAscending : PhSortDescending,
)

const activeLabel = computed(() =>
  sortOptions.find(opt => opt.id === sortBy.value)?.label ?? 'Date',
)

const hasSorting = computed(() =>
  sortBy.value !== 'date' || sortDir.value !== 'desc',
)

function onSortClick(id: SortBy): void {
  if (sortBy.value === id) {
    toggleSortDir()
  }
  else {
    setSortBy(id)
  }
}

function onReset(): void {
  setSortBy('date')
  if (sortDir.value !== 'desc')
    toggleSortDir()
}
</script>

<style scoped>
.sort-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--v0-border);
  background: var(--v0-surface);
  color: var(--v0-text);
  font-size: 0.875rem;
  line-height: 1.25rem;
  cursor: pointer;
  transition:
    background var(--dur-color) var(--ease-out),
    border-color var(--dur-color) var(--ease-out);
}

.sort-trigger:hover {
  background: var(--v0-surface-2);
  border-color: var(--v0-border-strong);
}

.sort-trigger:active {
  transform: scale(0.98);
}

.sort-trigger__arrow {
  color: var(--v0-primary);
  font-weight: 600;
}
</style>
