<script setup lang="ts">
import type { DipintiCollectionItem } from '@nuxt/content'

// La sezione dove il foglio diventa parete: l'inchiostro sale scorrendo (InkFlood).
defineProps<{ items: DipintiCollectionItem[] }>()
</script>

<template>
  <section class="paintings" aria-labelledby="home-dipinti">
    <InkFlood surge />
    <div class="surface-wall wall">
      <SiteContainer>
        <SectionHeading id="home-dipinti" title="Dipinti" :link="{ to: '/dipinti', label: 'Tutti i dipinti' }">
          <RisingText text="Dipinti" />
        </SectionHeading>
        <PaintingList :items="items" />
      </SiteContainer>
    </div>
    <InkFlood flip />
  </section>
</template>

<style scoped>
.paintings {
  /* l'inchiostro sborda ai lati: niente scroll orizzontale, ma le gocce possono salire */
  overflow-x: clip;
}

.wall {
  position: relative;
  padding-block: clamp(1rem, 0.5rem + 3vw, 4rem) clamp(2rem, 1rem + 4vw, 5rem);
}
</style>
