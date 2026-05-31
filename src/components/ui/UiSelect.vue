<template>
  <Select.Root v-model="model">
    <Select.Activator class="flex items-center justify-between w-full px-3 py-2 rounded-md border border-border bg-surface text-on-surface text-sm cursor-pointer focus-within:border-primary">
      <Select.Value v-slot="{ selectedValue }">
        {{ options.find(opt => opt.id === selectedValue)?.label }}
      </Select.Value>

      <Select.Placeholder class="text-on-surface-variant">
        {{ placeholder }}
      </Select.Placeholder>

      <Select.Cue v-slot="{ isOpen }" class="text-xs opacity-50">
        <component :is="isOpen ? IconChevronUp : IconChevronDown" :size="20" />
      </Select.Cue>
    </Select.Activator>

    <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
      <Select.Item
        v-for="item in options"
        :id="item.id"
        :key="item.id"
        :value="item.id"
      >
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
    </Select.Content>
  </Select.Root>
</template>

<script setup lang="ts">
import { IconChevronDown, IconChevronUp } from '@tabler/icons-vue'
import { Select } from '@vuetify/v0'
import { shallowRef } from 'vue'

defineProps<{
  options: { id: string, label: string }[]
  placeholder?: string
}>()

const model = shallowRef<string>()
</script>
