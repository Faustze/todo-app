<script setup lang="ts">
  import DkModal from '@/components/ui/DkModal.vue'
  import DkButton from '@/components/ui/DkButton.vue'
  import { IconAlertTriangle, IconX } from '@tabler/icons-vue'

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
      <div class="delete-modal__header">
        <div class="delete-modal__icon">
          <IconAlertTriangle size="28" />
        </div>
      </div>
      <p class="delete-modal__title">
        Удалить задачу?
      </p>
      <p v-if="taskTitle" class="delete-modal__task">
        «{{ taskTitle }}»
      </p>
      <p class="delete-modal__hint">
        Это действие нельзя отменить
      </p>
      <div class="delete-modal__actions">
        <DkButton variant="ghost" @click="emit('cancel')">
          Отмена
        </DkButton>
        <DkButton variant="solid" color="error" @click="emit('confirm')">
          Удалить
        </DkButton>
        <button
          class="delete-modal__close-btn"
          @click="emit('cancel')"
          type="button"
        >
          <IconX size="22" />
        </button>
      </div>
    </div>
  </DkModal>
</template>

<style scoped lang="scss">
  .delete-modal {
    padding: 1rem;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .delete-modal__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .delete-modal__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba($color-error, 0.12);
    color: $color-error;
    flex-shrink: 0;
  }

  .delete-modal__close-btn {
    position: absolute;
    top: 0rem;
    right: 0rem;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: none;
    color: var(--v0-muted);
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      color: var(--v0-primary);
    }
  }

  .delete-modal__title {
    color: var(--v0-text);
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.4;
    margin: 0 0 0.5rem;
  }

  .delete-modal__task {
    color: var(--v0-text);
    font-size: 0.9375rem;
    font-weight: 600;
    line-height: 1.5;
    margin: 0 0 0.375rem;
    word-break: break-word;
  }

  .delete-modal__hint {
    color: var(--v0-muted);
    font-size: 0.8125rem;
    line-height: 1.5;
    margin: 0 0 1.5rem;
  }

  .delete-modal__actions {
    display: inline-flex;
    flex-direction: row;
    justify-self: end;
    gap: 0.5rem;
  }
</style>
