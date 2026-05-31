<template>
  <UiModal v-model="open">
    <div class="delete-modal">
      <div class="delete-modal__header">
        <div class="delete-modal__icon">
          <IconAlertTriangle size="28" />
        </div>
        <div class="flex flex-row gap-2 items-center">
          <p class="delete-modal__title">
            Удалить задачу
          </p>
          <p v-if="taskTitle" class="delete-modal__task">
            «{{ taskTitle }}»?
          </p>
        </div>

        <p class="delete-modal__hint">
          Это действие нельзя отменить
        </p>
      </div>
      <div class="delete-modal__actions">
        <UiButton variant="ghost" @click="emit('cancel')">
          Отмена
        </UiButton>
        <UiButton variant="solid" color="error" @click="emit('confirm')">
          Удалить
        </UiButton>
        <button
          class="delete-modal__close-btn"
          type="button"
          @click="emit('cancel')"
        >
          <IconX size="22" />
        </button>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { IconAlertTriangle, IconX } from '@tabler/icons-vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiModal from '@/components/ui/UiModal.vue'

defineOptions({ name: 'DeleteTaskModal' })

defineProps<{
  taskTitle?: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const open = defineModel<boolean>({ default: false })
</script>

<style scoped>
  .delete-modal {
    padding: 1rem;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .delete-modal__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .delete-modal__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--v0-error) 12%, transparent);
    color: var(--v0-error);
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
    color: var(--v0-error);
    font-size: 1rem;
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
    display: flex;
    flex-direction: row;
    justify-content: end;
    gap: 0.5rem;
  }
</style>
