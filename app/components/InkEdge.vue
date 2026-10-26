<script setup lang="ts">
// Bordo irregolare tra foglio e parete: la "pennellata" che apre e chiude la sezione dipinti.
defineProps<{ flip?: boolean }>()
</script>

<template>
  <svg
    :class="['edge', { flip }]"
    viewBox="0 0 1440 80"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M0 80 L0 46 C 90 40 150 58 240 50 C 330 42 380 22 480 30 C 590 39 620 60 730 56 C 840 52 880 18 990 24 C 1090 30 1130 52 1220 46 C 1300 41 1360 28 1440 34 L1440 80 Z"
    />
  </svg>
</template>

<style scoped>
.edge {
  display: block;
  width: 100%;
  height: clamp(28px, 5vw, 72px);
  margin-bottom: -1px;
  fill: var(--notte);
}

.flip {
  margin-top: -1px;
  margin-bottom: 0;
  transform: scaleY(-1);
}
</style>
