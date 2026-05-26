<script setup lang="ts">
  import DkModal from '@/components/ui/DkModal.vue'
  import DkButton from '@/components/ui/DkButton.vue'

  defineOptions({ name: 'DeleteTaskModal' })

  const open = defineModel<boolean>({ default: false })

  const props = defineProps<{
    taskTitle?: string
  }>()

  const emit = defineEmits<{
    confirm: []
    cancel: []
  }>()
</script>

<template>
  <DkModal v-model="open">
    <div class="delete-modal">
      <p class="delete-modal__text">
        Вы уверены, что хотите удалить задачу
        <strong>"{{ taskTitle }}"</strong>?
        Это действие нельзя отменить.
      </p>
      <div class="delete-modal__actions">
        <DkButton variant="ghost" @click="emit('cancel')">
          Отмена
        </DkButton>
        <DkButton variant="solid" @click="emit('confirm')">
          Удалить
        </DkButton>
      </div>
    </div>
  </DkModal>
</template>

<style scoped>
  .delete-modal {
    padding: 1.5rem;
  }

  .delete-modal__text {
    color: var(--v0-text);
    font-size: 0.9375rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  .delete-modal__actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }
</style>
