<script setup lang="ts">
import type { DipintiCollectionItem } from '@nuxt/content'

// La sezione dove il foglio diventa parete: bordo a pennellata sopra e sotto.
defineProps<{ items: DipintiCollectionItem[] }>()
</script>

<template>
  <section aria-labelledby="home-dipinti">
    <InkEdge />
    <div class="surface-wall wall">
      <SiteContainer>
        <SectionHeading id="home-dipinti" title="Dipinti" :link="{ to: '/dipinti', label: 'Tutti i dipinti' }" />
        <PaintingList :items="items" />
      </SiteContainer>
    </div>
    <InkEdge flip />
  </section>
</template>

<style scoped>
.wall {
  padding-block: clamp(2rem, 1rem + 4vw, 5rem);
}
</style>
