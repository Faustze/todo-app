<template>
  <Select.Root v-model="isOpen">
    <Select.Activator v-slot="{ attrs }">
      <UiButton variant="outline" v-bind="attrs">
        <IconStar size="20" />
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
            @edit="(payload: TaskTag) => update(tag.id, { name: payload.name, color: payload.color })"
          />
        </div>
      </div>

      <!-- Добавление тега через выбор цвета и имени -->
    </Select.Content>
  </Select.Root>
</template>

<script setup lang="ts">
import type { TaskTag } from '@/types/tag.ts'
import { IconStar } from '@tabler/icons-vue'
import { Select } from '@vuetify/v0'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import UiButton from '@/components/ui/UiButton.vue'
import { useTags } from '@/stores/useTags'
import TagItem from './TagItem.vue'

const store = useTags()
const { tags } = storeToRefs(store)
const { remove, update } = store
const isOpen = ref<string>('false')

const tagNames = computed(() => tags.value.map(t => t.name))
</script>
