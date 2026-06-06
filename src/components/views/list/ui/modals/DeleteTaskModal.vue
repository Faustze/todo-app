<template>
  <UiModal v-model="open">
    <div class="delete-modal">
      <div class="delete-modal__header">
        <div class="delete-modal__icon">
          <IconAlertTriangle size="28" />
        </div>
        <div class="flex flex-col gap-2 items-center">
          <p class="delete-modal__title text-lg font-semibold text-text leading-snug mb-2">
            Удалить задачу?
          </p>
          <p v-if="taskTitle" class="delete-modal__task text-base font-semibold text-error leading-normal mb-1.5 wrap-break-word">
            «{{ taskTitle }}»
          </p>
        </div>

        <p class="delete-modal__hint text-xs text-muted leading-normal mb-6">
          Это действие нельзя отменить
        </p>
      </div>
      <div class="delete-modal__actions">
        <UiButton variant="text" color="text" size="md" @click="emit('cancel')">
          <p class="text-text hover:text-primary">
            Отмена
          </p>
        </UiButton>
        <UiButton variant="solid" color="error" size="md" @click="emit('confirm')">
          Удалить
        </UiButton>
        <button
          class="delete-modal__close-btn"
          type="button"
          @click="emit('cancel')"
        >
          <IconX class="text-text hover:text-primary" size="22" />
        </button>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { IconAlertTriangle, IconX } from '@tabler/icons-vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiModal from '@/components/ui/UiModal.vue'

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
    line-height: 1.4;
    margin: 0 0 0.5rem;
  }

  .delete-modal__task {
    color: var(--v0-error);
    line-height: 1.5;
    margin: 0 0 0.375rem;
    word-break: break-word;
  }

  .delete-modal__hint {
    color: var(--v0-muted);
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
