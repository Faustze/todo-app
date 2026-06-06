<template>
  <Select.Root v-model="isOpen">
    <Select.Activator v-slot="{ attrs }">
      <UiButton variant="outline" color="primary" size="md" v-bind="attrs">
        <IconFilter size="20" />
      </UiButton>
    </Select.Activator>

    <Select.Content
      class="p-3 rounded-lg border border-divider bg-surface shadow-lg"
      :style="{ minWidth: '220px' }"
    >
      <div class="panel-section">
        <span class="panel-label flex justify-center">Фильтрация</span>

        <!-- Выбор статуса -->
        <div class="mt-2">
          <span class="panel-label">Статус</span>
          <div class="flex flex-wrap gap-1 mt-1">
            <UiButton
              v-for="opt in statusOptions"
              :key="opt.id"
              size="extra-sm"
              color="primary"
              :variant="(statusFilter === opt.id) ? 'solid' : 'chip'"
              @click="statusFilter = opt.id"
            >
              {{ opt.label }}
            </UiButton>
          </div>
        </div>

        <div class="border-t border-divider my-2" />

        <!-- Выбор периода -->
        <div>
          <span class="panel-label">Период</span>
          <div class="flex flex-wrap gap-1 mt-1">
            <UiButton
              v-for="(preset, idx) in presetOptions"
              :key="idx"
              size="extra-sm"
              color="primary"
              :variant="(activePreset === preset.id) ? 'solid' : 'chip'"
              @click="togglePreset(preset.id)"
            >
              {{ preset.label }}
            </UiButton>
          </div>
        </div>

        <div class="border-t border-divider my-2" />

        <button
          type="button"
          class="panel-reset"
          :disabled="!hasActiveFilters"
          @click="onReset"
        >
          Сбросить
        </button>
      </div>
    </Select.Content>
  </Select.Root>
</template>

<script setup lang="ts">
import type { DatePreset, TaskFilter } from '@/types/task'
import { IconFilter } from '@tabler/icons-vue'
import { Select } from '@vuetify/v0'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import { TASK_STATUSES } from '@/constants/taskStatuses'
import { useTasks } from '@/stores/useTasks'

const store = useTasks()
const { filter, datePreset } = storeToRefs(store)
const { setFilter, setDatePreset, resetFilters } = store

const isOpen = ref<string>('false')

const statusOptions = [
  { id: 'all' as TaskFilter, label: 'Все' },
  ...Object.entries(TASK_STATUSES).map(([id, config]) => ({
    id: id as TaskFilter,
    label: config.id,
  })),
]

const presetOptions = [
  { id: 'today' as DatePreset, label: 'День' },
  { id: 'week' as DatePreset, label: 'Неделя' },
  { id: 'month' as DatePreset, label: 'Месяц' },
]

const statusFilter = computed<TaskFilter>({
  get: () => filter.value,
  set: v => setFilter(v),
})

const activePreset = computed<DatePreset>({
  get: () => datePreset.value,
  set: v => setDatePreset(v),
})

const hasActiveFilters = computed(() =>
  filter.value !== 'all' || datePreset.value !== null,
)

function togglePreset(id: DatePreset): void {
  activePreset.value = activePreset.value === id ? null : id
}

function onReset(): void {
  resetFilters()
}
</script>
