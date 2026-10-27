<script setup lang="ts">
// Solo sulle anteprime (NUXT_PUBLIC_NOINDEX=true): chiarisce che dipinti e testi sono
// di esempio e permette di confrontare le palette (vedi tokens.css e lo script in nuxt.config).
const { noindex } = useRuntimeConfig().public
</script>

<template>
  <p v-if="noindex" class="banner">
    Anteprima: i dipinti e i testi sono ancora di esempio. Palette:
    <a href="?palette=blu">blu</a> ·
    <a href="?palette=malva">malva</a>
  </p>
</template>

<style scoped>
.banner {
  padding: 0.5rem var(--gutter);
  background: var(--accent);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  text-align: center;
}

.banner a {
  color: inherit;
  font-weight: 700;
}
</style>
