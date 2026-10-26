<script setup lang="ts">
import type { DipintiCollectionItem } from '@nuxt/content'

// priority: la prima opera è sopra la piega (pagina /dipinti), quindi niente lazy
defineProps<{ items: DipintiCollectionItem[], priority?: boolean }>()
</script>

<template>
  <ul role="list" class="list">
    <li v-for="(painting, index) in items" :key="painting.id">
      <figure class="painting">
        <NuxtImg
          :src="painting.image"
          :alt="painting.alt"
          :width="painting.width"
          :height="painting.height"
          sizes="xs:100vw md:66vw lg:780px"
          :loading="priority && index === 0 ? 'eager' : 'lazy'"
          :fetchpriority="priority && index === 0 ? 'high' : undefined"
          :style="{ '--ratio': painting.width / painting.height }"
          class="image"
        />
        <figcaption>
          <PaintingLabel :painting="painting" />
        </figcaption>
      </figure>
    </li>
  </ul>
</template>

<style scoped>
.list {
  display: grid;
  gap: var(--space-section);
}

.painting {
  display: grid;
  gap: 1rem;
  margin: 0;
}

@media (min-width: 900px) {
  .painting {
    grid-template-columns: 2fr 1fr;
    align-items: end;
    gap: 2.5rem;
  }
}

.image {
  /* Larghezza decisa dal CSS, così il box è riservato prima del caricamento */
  width: min(100%, calc(80vh * var(--ratio)));
  justify-self: center;
}
</style>
