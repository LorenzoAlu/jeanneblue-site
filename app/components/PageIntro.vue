<script setup lang="ts">
defineProps<{ title: string, lead?: string }>()

// L'entrata del sottotitolo è CSS, come il titolo (RisingText load): è spesso l'LCP
// della pagina e non deve aspettare il JS
</script>

<template>
  <div class="intro">
    <h1><RisingText :text="title" mode="load" /></h1>
    <p v-if="lead" class="lead">{{ lead }}</p>
    <slot />
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  gap: 1rem;
  padding-block: clamp(2rem, 1rem + 4vw, 4.5rem) clamp(2rem, 1.5rem + 2vw, 3rem);
}

/* solo se le animazioni sono attive (data-motion, messo nell'head prima del paint) */
html[data-motion] .lead {
  animation: lead-in 1s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both;
}

@keyframes lead-in {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
}

.lead {
  max-width: 38rem;
  font-size: var(--text-lg);
  line-height: 1.35;
}
</style>
