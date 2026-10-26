<script setup lang="ts">
// Le pagine con meta.wall (i dipinti) passano tutta la pagina sulla superficie "parete".
const route = useRoute()
const isWall = computed(() => route.meta.wall === true)

useHead({
  htmlAttrs: { class: computed(() => (isWall.value ? 'surface-wall' : '')) },
  meta: [{ name: 'theme-color', content: computed(() => (isWall.value ? '#0E1A33' : '#F4F5F7')) }],
})
</script>

<template>
  <SiteHeader />
  <main id="contenuto">
    <slot />
  </main>
  <SiteFooter />
</template>
