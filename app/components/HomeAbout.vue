<script setup lang="ts">
import type { PagineCollectionItem } from '@nuxt/content'

defineProps<{ page: PagineCollectionItem }>()
</script>

<template>
  <PageSection>
    <div class="about">
      <InkReveal v-if="page.image" class="portrait">
        <NuxtImg
          format="webp"
          :src="page.image"
          :alt="page.imageAlt ?? ''"
          width="160"
          height="200"
          fit="cover"
          loading="lazy"
          class="image"
        />
      </InkReveal>
      <div class="text">
        <ScrollHighlight v-if="page.description" :text="page.description" size="lg" />
        <NuxtLink to="/chi-sono">Di più su di me</NuxtLink>
      </div>
    </div>
  </PageSection>
</template>

<style scoped>
.about {
  display: grid;
  grid-template-columns: 5rem 1fr;
  align-items: start;
  gap: 1.25rem;
  max-width: 48rem;
}

@media (min-width: 900px) {
  .about {
    grid-template-columns: 8rem 1fr;
    gap: 2rem;
  }
}

.image {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.text {
  display: grid;
  gap: 1rem;
  justify-items: start;
}
</style>
