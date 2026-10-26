<script setup lang="ts">
// Le pagine con meta.wall (i dipinti) passano tutta la pagina sulla superficie "parete".
// theme-color: stessi valori di --notte e --foglio in tokens.css (qui serve il valore, non la variabile)
const route = useRoute()
const isWall = computed(() => route.meta.wall === true)

useHead({
  htmlAttrs: { class: computed(() => (isWall.value ? 'surface-wall' : '')) },
  meta: [{ name: 'theme-color', content: computed(() => (isWall.value ? '#0E1A33' : '#F4F5F7')) }],
})
</script>

<template>
  <PreviewBanner />
  <SiteHeader />
  <main id="contenuto">
    <slot />
  </main>
  <SiteFooter />
  <InkCursor />
</template>
