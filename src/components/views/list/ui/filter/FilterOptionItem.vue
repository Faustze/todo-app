<template>
  <template v-if="!item.children">
    <Select.Item :id="item.id" :value="item.id">
      <template #default="{ isSelected, isHighlighted }">
        <div
          class="px-3 py-2 rounded-md cursor-pointer select-none text-sm"
          :class="[
            isHighlighted
              ? 'bg-primary text-on-primary'
              : isSelected
                ? 'text-primary font-medium'
                : 'text-on-surface hover:bg-background',
          ]"
        >
          {{ item.label }}
        </div>
      </template>
    </Select.Item>
  </template>

  <template v-else>
    <div
      class="flex items-center gap-2 px-3 py-2 cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-muted"
      :style="{ marginTop: depth > 0 ? '0.25rem' : 0 }"
      @click="$emit('toggle', item.id)"
    >
      <IconChevronRight
        size="14"
        class="shrink-0 transition-transform"
        :class="{ 'rotate-90': expandedIds?.has(item.id) }"
      />
      {{ item.label }}
    </div>

    <div :style="{ display: expandedIds?.has(item.id) ? undefined : 'none' }">
      <FilterOptionItem
        v-for="child in item.children"
        :id="child.id"
        :key="child.id"
        :item="child"
        :depth="depth + 1"
        :expanded-ids="expandedIds"
        @toggle="$emit('toggle', $event)"
      />
    </div>
  </template>
</template>

<script setup lang="ts">
import type { FilterOption } from '@/types/filter'
import { IconChevronRight } from '@tabler/icons-vue'
import { Select } from '@vuetify/v0'

defineProps<{
  item: FilterOption
  depth: number
  expandedIds?: Set<string>
}>()

defineEmits<{
  toggle: [id: string]
}>()
</script>
