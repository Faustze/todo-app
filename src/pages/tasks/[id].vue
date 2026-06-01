<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-start">
      <UiButton variant="icon" @click="router.back()">
        <IconArrowLeft size="20" />
      </UiButton>
    </div>

    <TaskView :task="task" />
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UiButton from '@/components/ui/UiButton.vue'
import TaskView from '@/components/views/list/TaskView.vue'
import { useTasks } from '@/stores/useTasks'

const route = useRoute()
const router = useRouter()

const taskId = route.params.id as string

const store = useTasks()
const task = computed(() => store.getTaskById(taskId))
</script>
