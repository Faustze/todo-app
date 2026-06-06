<template>
  <Select.Root v-model="isOpen">
    <Select.Activator v-slot="{ attrs }">
      <UiButton variant="outline" color="primary" size="md" v-bind="attrs">
        <IconArrowsSort size="20" />
      </UiButton>
    </Select.Activator>

    <Select.Content
      class="p-3 rounded-lg border border-divider bg-surface shadow-lg"
      :style="{ minWidth: '180px' }"
    >
      <div class="panel-section">
        <!-- Сортировка по полю -->
        <div>
          <span class="panel-label flex justify-center">Сортировка</span>
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
          Сбросить
        </button>
      </div>
    </Select.Content>
  </Select.Root>
</template>

<script setup lang="ts">
import type { SortBy } from '@/types/sort'
import { IconArrowsSort, IconCalendar, IconFlag, IconSortAscending, IconSortDescending } from '@tabler/icons-vue'
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
  { id: 'date' as SortBy, label: 'Дата', icon: IconCalendar },
  { id: 'priority' as SortBy, label: 'Приоритет', icon: IconFlag },
]

const sortDirIcon = computed(() =>
  sortDir.value === 'asc' ? IconSortAscending : IconSortDescending,
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
