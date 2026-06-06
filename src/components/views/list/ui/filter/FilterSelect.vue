<template>
  <Select.Root v-model="model">
    <Select.Activator v-slot="{ attrs }">
      <UiButton variant="outline" color="primary" size="sm" v-bind="attrs">
        <IconFilter size="20" />
      </UiButton>
    </Select.Activator>

    <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
      <FilterOptionItem
        v-for="item in options"
        :key="item.id"
        :item="item"
        :depth="0"
        :expanded-ids="expandedIds"
        @toggle="toggle"
      />
    </Select.Content>
  </Select.Root>
</template>

<script setup lang="ts">
import type { FilterOption } from '@/types/filter'
import { IconFilter } from '@tabler/icons-vue'
import { Select } from '@vuetify/v0'
import { ref } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'

import FilterOptionItem from './FilterOptionItem.vue'

defineProps<{
  options: FilterOption[]
  placeholder?: string
}>()

const model = defineModel<string>()
const expandedIds = ref<Set<string>>(new Set())

function toggle(id: string): void {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id)
  }
  else {
    expandedIds.value.add(id)
  }
  expandedIds.value = new Set(expandedIds.value)
}
</script>
