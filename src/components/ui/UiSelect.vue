<template>
  <Select.Root v-model="modelValue">
    <Select.Activator
      class="flex items-center justify-between w-full px-3 py-2 rounded-lg border border-border bg-surface text-on-surface text-sm cursor-pointer focus-within:border-primary"
    >
      <Select.Value v-slot="{ selectedValue }">
        {{ options.find(opt => opt.id === selectedValue)?.label }}
      </Select.Value>

      <Select.Placeholder class="text-on-surface-variant">
        {{ placeholder }}
      </Select.Placeholder>

      <Select.Cue v-slot="{ isOpen }" class="text-xs opacity-50">
        <component :is="isOpen ? PhCaretUp : PhCaretDown" :size="20" />
      </Select.Cue>
    </Select.Activator>

    <Select.Content
      class="p-1 rounded-xl border border-divider bg-surface shadow-lg"
      :style="{ minWidth: 'anchor-size(width)' }"
    >
      <Select.Item v-for="item in options" :key="item.id" :value="item.id">
        <template #default="{ isSelected, isHighlighted }">
          <div
            class="px-3 py-2 rounded-lg cursor-pointer select-none text-sm"
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
import { PhCaretDown, PhCaretUp } from '@phosphor-icons/vue'
import { Select } from '@vuetify/v0'

defineProps<{
  options: { id: string, label: string }[]
  placeholder?: string
}>()

const modelValue = defineModel<string>()
</script>
