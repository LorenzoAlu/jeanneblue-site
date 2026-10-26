<script setup lang="ts">
import type { TatuaggiCollectionItem } from '@nuxt/content'

// priority: la prima riga è sopra la piega (pagina /tatuaggi), quindi niente lazy
defineProps<{ items: TatuaggiCollectionItem[], priority?: boolean }>()

const selected = ref<TatuaggiCollectionItem | null>(null)
</script>

<template>
  <div>
    <ul role="list" class="grid">
      <li v-for="(item, index) in items" :key="item.id">
        <button type="button" class="open" @click="selected = item">
          <NuxtImg
            :src="item.image"
            :alt="item.alt"
            width="800"
            height="1000"
            fit="cover"
            sizes="xs:50vw md:33vw lg:400px"
            :loading="priority && index < 2 ? 'eager' : 'lazy'"
            :fetchpriority="priority && index === 0 ? 'high' : undefined"
            class="image"
          />
          <span class="caption">{{ item.stile }} · {{ item.zona }}</span>
        </button>
      </li>
    </ul>
    <TattooDialog :item="selected" @close="selected = null" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(0.75rem, 2vw, 1.5rem);
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.open {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: zoom-in;
}

.image {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  background: var(--line);
}

.caption {
  display: block;
  margin-top: 0.5rem;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.open:hover .caption {
  color: var(--accent);
}
</style>
