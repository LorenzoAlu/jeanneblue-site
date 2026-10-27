<script setup lang="ts">
// Le pagine con meta.wall (i dipinti) passano tutta la pagina sulla superficie "parete".
// theme-color: stessi valori di --parete e --notte in tokens.css (qui serve il valore, non la variabile)
const route = useRoute()
const isWall = computed(() => route.meta.wall === true)

useHead({
  htmlAttrs: { class: computed(() => (isWall.value ? 'surface-wall' : '')) },
  meta: [{ name: 'theme-color', content: computed(() => (isWall.value ? '#ECE4DE' : '#0B0D14')) }],
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
