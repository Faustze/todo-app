<template>
  <Select.Root v-model="model">
    <Select.Activator v-slot="{ attrs }">
      <div class="flex items-center shrink-0">
        <UiButton variant="icon" v-bind="attrs">
          <IconDotsVertical size="20" />
        </UiButton>
      </div>
    </Select.Activator>

    <Select.Content
      position-area="bottom"
      class="p-1 rounded-lg border border-divider bg-surface shadow-lg"
      :style="{ minWidth: 'anchor-size(width)', marginTop: '5px' }"
    >
      <Select.Item
        v-for="item in options"
        :id="item.id"
        :key="item.id"
        :value="item.id"
        @click="item.action?.()"
      >
        <template #default>
          <div class="px-3 py-2 rounded-md cursor-pointer select-none text-sm text-on-surface hover:bg-primary">
            {{ item.label }}
          </div>
        </template>
      </Select.Item>
    </Select.Content>
  </Select.Root>
</template>

<script setup lang="ts">
import type { Task, TaskItemActionOption } from '@/types/task'
import { IconDotsVertical } from '@tabler/icons-vue'
import { Select } from '@vuetify/v0'
import UiButton from '@/components/ui/UiButton.vue'

const props = defineProps<{
  task: Task
}>()
const emit = defineEmits<{
  edit: [task: Task]
  delete: [id: string, title: string]
  show: [id: string]
}>()

const options: TaskItemActionOption[] = [
  { id: 'show', label: 'Открыть', action: () => emit('show', props.task.id) },
  { id: 'edit', label: 'Редактировать', action: () => emit('edit', props.task) },
  { id: 'delete', label: 'Удалить', action: () => emit('delete', props.task.id, props.task.title) },
]

const model = defineModel<string>()
</script>
