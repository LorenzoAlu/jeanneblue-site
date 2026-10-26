<script setup lang="ts">
import type { PagineCollectionItem, FaqCollectionItem } from '@nuxt/content'

defineProps<{ value: PagineCollectionItem | FaqCollectionItem }>()
</script>

<template>
  <ContentRenderer :value="value" class="prose" />
</template>

<style scoped>
.prose {
  max-width: 40rem;
}

.prose :deep(> * + *) {
  margin-top: 1em;
}

.prose :deep(h2) {
  margin-top: 2.5rem;
}

.prose :deep(h3) {
  margin-top: 2rem;
  font-size: var(--text-base);
}

.prose :deep(ul),
.prose :deep(ol) {
  padding-left: 1.25em;
}

.prose :deep(li + li) {
  margin-top: 0.4em;
}

.prose :deep(strong) {
  color: var(--accent);
}
</style>
