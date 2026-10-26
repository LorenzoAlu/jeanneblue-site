<script setup lang="ts">
defineProps<{ title: string, lead?: string }>()
</script>

<template>
  <div class="intro">
    <h1>{{ title }}</h1>
    <p v-if="lead" class="lead">{{ lead }}</p>
    <slot />
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  gap: 1rem;
  padding-block: clamp(2rem, 1rem + 4vw, 4.5rem) clamp(2rem, 1.5rem + 2vw, 3rem);
}

.lead {
  max-width: 38rem;
  font-size: var(--text-lg);
  line-height: 1.35;
}
</style>
