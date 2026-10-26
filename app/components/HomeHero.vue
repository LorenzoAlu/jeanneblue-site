<script setup lang="ts">
import type { TatuaggiCollectionItem } from '@nuxt/content'

defineProps<{ title: string, image: TatuaggiCollectionItem }>()
</script>

<template>
  <SiteContainer class="hero">
    <NuxtImg
      :src="image.image"
      :alt="image.alt"
      width="800"
      height="1000"
      fit="cover"
      sizes="xs:100vw md:55vw lg:660px"
      preload
      loading="eager"
      fetchpriority="high"
      class="image"
    />
    <div class="text">
      <h1>{{ title }}</h1>
      <p class="actions">
        <NuxtLink to="/contatti" class="primary">Scrivimi</NuxtLink>
        <NuxtLink to="/tatuaggi">Guarda i lavori</NuxtLink>
      </p>
    </div>
  </SiteContainer>
</template>

<style scoped>
.hero {
  display: grid;
  gap: 1.5rem;
  padding-top: 0.5rem;
}

@media (min-width: 900px) {
  .hero {
    grid-template-columns: 7fr 5fr;
    align-items: end;
    gap: 3rem;
    padding-top: 1.5rem;
  }
}

.image {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  background: var(--line);
}

.text {
  display: grid;
  gap: 1.5rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.75rem;
  font-weight: 700;
}

.primary {
  padding: 0.75rem 1.5rem;
  background: var(--accent);
  color: var(--bg);
  text-decoration: none;
}

.primary:hover {
  background: var(--notte);
}
</style>
