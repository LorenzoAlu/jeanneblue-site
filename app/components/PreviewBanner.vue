<script setup lang="ts">
// Solo sulle anteprime (NUXT_PUBLIC_NOINDEX=true): chiarisce che foto e testi sono di esempio.
const { noindex } = useRuntimeConfig().public
</script>

<template>
  <p v-if="noindex" class="banner">
    Anteprima: i dipinti e i testi sono ancora di esempio.
  </p>
</template>

<style scoped>
.banner {
  padding: 0.5rem var(--gutter);
  background: var(--inchiostro);
  color: var(--foglio);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  text-align: center;
}
</style>
