<template>
  <UiModal v-model="open">
    <div class="delete-modal">
      <div class="delete-modal__header">
        <div class="delete-modal__icon">
          <PhWarning size="24" />
        </div>
        <div class="flex flex-col gap-2 items-center">
          <p class="delete-modal__title text-lg font-semibold text-text leading-snug mb-2">
            Delete task?
          </p>
          <p v-if="taskTitle" class="delete-modal__task text-base font-semibold text-error leading-normal mb-2 wrap-break-word">
            «{{ taskTitle }}»
          </p>
        </div>

        <p class="delete-modal__hint text-xs text-muted leading-normal mb-6">
          This action cannot be undone
        </p>
      </div>
      <div class="delete-modal__actions">
        <UiButton variant="text" color="text" size="md" @click="emit('cancel')">
          Cancel
        </UiButton>
        <UiButton variant="solid" color="error" size="md" @click="emit('confirm')">
          Delete
        </UiButton>
        <button
          class="delete-modal__close-btn"
          type="button"
          @click="emit('cancel')"
        >
          <PhX size="20" />
        </button>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { PhWarning, PhX } from '@phosphor-icons/vue'
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
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--v0-error) 12%, transparent);
    color: var(--v0-error);
    flex-shrink: 0;
  }

  .delete-modal__close-btn {
    position: absolute;
    top: 0rem;
    right: 0rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--v0-muted);
    cursor: pointer;
    transition:
      background var(--dur-color) var(--ease-out),
      color var(--dur-color) var(--ease-out);

    &:hover {
      color: var(--v0-text);
      background: color-mix(in srgb, var(--v0-text) 8%, transparent);
    }

    &:active {
      transform: scale(0.98);
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
    margin: 0 0 0.5rem;
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
