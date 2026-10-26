<script setup lang="ts">
defineProps<{ title: string, lead?: string }>()

const root = ref<HTMLElement>()

useMotion(root, ({ gsap }) => {
  gsap.fromTo('.lead', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.45 })
})
</script>

<template>
  <div ref="root" class="intro">
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

/* parte nascosta solo se l'animazione partirà (data-motion) */
html[data-motion] .lead {
  opacity: 0;
}

.lead {
  max-width: 38rem;
  font-size: var(--text-lg);
  line-height: 1.35;
}
</style>
