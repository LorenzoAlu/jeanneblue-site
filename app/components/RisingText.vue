<script setup lang="ts">
// Testo che emerge dall'inchiostro lettera per lettera, legato allo scroll.
// Va dentro un titolo; senza JS o con prefers-reduced-motion è testo normale.
const props = defineProps<{ text: string }>()

const chars = computed(() => [...props.text])
const root = ref<HTMLElement>()

let cleanup: (() => void) | undefined

onMounted(async () => {
  if (!root.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ])
  gsap.registerPlugin(ScrollTrigger)

  const tween = gsap.from(root.value.querySelectorAll('.char'), {
    yPercent: 115,
    rotate: 8,
    stagger: 0.06,
    ease: 'power3.out',
    scrollTrigger: { trigger: root.value, start: 'top 98%', end: 'top 60%', scrub: 0.8 },
  })

  cleanup = () => {
    tween.scrollTrigger?.kill()
    tween.revert()
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <span ref="root" class="rising">
    <span class="visually-hidden">{{ text }}</span>
    <span v-for="(char, i) in chars" :key="i" class="clip" aria-hidden="true">
      <span class="char">{{ char === ' ' ? ' ' : char }}</span>
    </span>
  </span>
</template>

<style scoped>
.rising {
  display: inline-block;
}

.clip {
  display: inline-block;
  overflow: clip;
  /* spazio per le discendenti, altrimenti il clip le taglia */
  padding-bottom: 0.12em;
  margin-bottom: -0.12em;
}

.char {
  display: inline-block;
  transform-origin: 0 100%;
}
</style>
