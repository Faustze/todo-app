<template>
  <svg xmlns="http://www.w3.org/2000/svg" :width="size" :height="size" viewBox="0 0 24 24" role="img" aria-hidden="true"><!-- Icon from Solar by 480 Design - https://creativecommons.org/licenses/by/4.0/ -->
    <path fill="currentColor" fillRule="evenodd" d="M11.5 2.75a8.75 8.75 0 1 0 0 17.5a8.75 8.75 0 0 0 0-17.5M1.25 11.5c0-5.66 4.59-10.25 10.25-10.25S21.75 5.84 21.75 11.5S17.16 21.75 11.5 21.75S1.25 17.16 1.25 11.5m18.22 7.97a.75.75 0 0 1 1.06 0l2 2a.75.75 0 1 1-1.06 1.06l-2-2a.75.75 0 0 1 0-1.06" clipRule="evenodd" />
  </svg>
</template>

<script lang="ts">
export default {
  name: 'SolarMinimalisticMagniferOutline',
  props: {
    size: {
      type: String,
      default: '20',
    },
  },
}
</script>
