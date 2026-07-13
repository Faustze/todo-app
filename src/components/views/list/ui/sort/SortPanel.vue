<template>
  <Select.Root v-model="isOpen">
    <Select.Activator v-slot="{ attrs }">
      <button class="sort-trigger" v-bind="attrs">
        {{ activeLabel }}
        <span class="sort-trigger__arrow mono">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
      </button>
    </Select.Activator>

    <Select.Content
      class="p-3 rounded-lg border border-divider bg-surface shadow-lg"
      :style="{ minWidth: '180px' }"
    >
      <div class="panel-section">
        <!-- Sort by field -->
        <div>
          <span class="panel-label flex justify-center">Sort</span>
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
import { IconCalendar, IconFlag, IconSortAscending, IconSortDescending } from '@tabler/icons-vue'
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
  { id: 'date' as SortBy, label: 'Date', icon: IconCalendar },
  { id: 'priority' as SortBy, label: 'Priority', icon: IconFlag },
]

const sortDirIcon = computed(() =>
  sortDir.value === 'asc' ? IconSortAscending : IconSortDescending,
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
  gap: 6px;
  padding: 9px 13px;
  border-radius: 9px;
  border: 1px solid var(--v0-border);
  background: var(--v0-surface);
  color: var(--v0-text);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.sort-trigger:hover {
  border-color: color-mix(in srgb, var(--v0-primary) 50%, transparent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--v0-primary) 20%, transparent);
}

.sort-trigger__arrow {
  color: var(--v0-primary);
  font-weight: 600;
}
</style>
