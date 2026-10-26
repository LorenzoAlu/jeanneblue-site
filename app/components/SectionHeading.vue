<script setup lang="ts">
// Titolo di sezione con link "vedi tutto" allineato a destra.
defineProps<{ title: string, id: string, link?: { to: string, label: string } }>()
</script>

<template>
  <div class="heading">
    <h2 :id="id">{{ title }}</h2>
    <NuxtLink v-if="link" :to="link.to" class="more">{{ link.label }}</NuxtLink>
  </div>
</template>

<style scoped>
.heading {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 2rem;
  margin-bottom: clamp(1.5rem, 1rem + 2vw, 2.5rem);
}

h2 {
  font-size: var(--text-xl);
}
</style>
