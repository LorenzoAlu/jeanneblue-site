<script setup lang="ts">
import type { DipintiCollectionItem } from '@nuxt/content'

defineProps<{ painting: DipintiCollectionItem }>()
</script>

<template>
  <div class="label">
    <p class="title">{{ painting.titolo }}</p>
    <p>{{ painting.anno }}</p>
    <p>{{ painting.tecnica }}</p>
    <p>{{ painting.misure }}</p>
    <p v-if="painting.stato === 'venduto'" class="sold">Venduto</p>
    <p v-else>
      Disponibile · <NuxtLink to="/contatti">chiedi info</NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.label {
  display: grid;
  gap: 0.125rem;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  line-height: 1.5;
}

.title {
  margin-bottom: 0.25rem;
  color: var(--text);
  font-weight: 700;
}

.sold {
  /* timbro sulla scheda */
  justify-self: start;
  margin-top: 0.5rem;
  padding: 0.15rem 0.6rem;
  border: 2px solid currentColor;
  border-radius: 4px;
  color: var(--sold);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  rotate: -6deg;
}
</style>
