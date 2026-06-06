<template>
  <Select.Root v-model="isOpen">
    <Select.Activator v-slot="{ attrs }">
      <UiButton variant="outline" color="primary" size="md" v-bind="attrs">
        <IconTag size="20" />
      </UiButton>
    </Select.Activator>

    <Select.Content
      class="p-3 rounded-lg border border-divider bg-surface shadow-lg"
      :style="{ minWidth: '220px' }"
    >
      <div class="panel-section">
        <span class="panel-label flex justify-center">Теги</span>

        <div class="flex flex-col gap-2 mt-2">
          <TagItem
            v-for="tag in tags" :key="tag.id" :tag="tag"
            :all-names="tagNames"
            @delete="(payload: TaskTag) => remove(payload.id)"
            @edit="openEdit"
          />
        </div>
      </div>

      <div class="panel-section border-t border-divider mt-4 pt-4">
        <UiButton variant="outline" color="primary" class="w-full" size="sm" @click="createOpen = true">
          Добавить тег
        </UiButton>
      </div>

      <CreateTagModal
        v-model="createOpen"
        :all-names="tagNames"
        @create="handleCreate"
      />

      <EditTagModal
        v-model="editOpen"
        :tag="editedTag"
        :all-names="tagNames"
        @save="handleSave"
      />
    </Select.Content>
  </Select.Root>
</template>

<script setup lang="ts">
import type { TagColorKey } from '@/constants/tag'
import type { TaskTag } from '@/types/tag.ts'
import { IconTag } from '@tabler/icons-vue'
import { Select } from '@vuetify/v0'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import CreateTagModal from '@/components/views/list/ui/modals/CreateTagModal.vue'
import EditTagModal from '@/components/views/list/ui/modals/EditTagModal.vue'
import { useTags } from '@/stores/useTags'
import TagItem from './TagItem.vue'

const store = useTags()
const { tags } = storeToRefs(store)
const { remove, update, create } = store
const isOpen = ref<string>('false')
const createOpen = ref(false)
const editOpen = ref(false)
const editedTag = ref<TaskTag | null>(null)

const tagNames = computed(() => tags.value.map(t => t.name))

interface CreateTagPayload {
  name: string
  color: TagColorKey
}

function handleCreate(values: CreateTagPayload) {
  create(values)
}

function openEdit(tag: TaskTag) {
  editedTag.value = tag
  editOpen.value = true
}

function handleSave(values: CreateTagPayload) {
  if (!editedTag.value)
    return

  update(editedTag.value.id, values)
}
</script>
