<script setup lang="ts">
// Testo che emerge dall'inchiostro lettera per lettera.
// - scroll (default): legato allo scroll, per i titoli di sezione
// - load: parte subito, per il titolo in hero
// Senza JS o con prefers-reduced-motion è testo normale.
const props = withDefaults(defineProps<{ text: string, mode?: 'scroll' | 'load' }>(), { mode: 'scroll' })

// Parole separate da spazi veri, così il titolo va a capo normalmente
const words = computed(() => props.text.split(' ').map(word => [...word]))
const root = ref<HTMLElement>()

useMotion(root, ({ gsap }) => {
  const chars = root.value!.querySelectorAll('.char')
  const from = { yPercent: 115, rotate: 8 }

  if (props.mode === 'load') {
    gsap.from(chars, { ...from, duration: 1.1, stagger: 0.025, ease: 'expo.out', delay: 0.15 })
    return
  }

  gsap.from(chars, {
    ...from,
    stagger: 0.06,
    ease: 'power3.out',
    scrollTrigger: { trigger: root.value, start: 'top 98%', end: 'top 60%', scrub: 0.8 },
  })
})
</script>

<template>
  <span ref="root" class="rising">
    <span class="visually-hidden">{{ text }}</span>
    <template v-for="(word, w) in words" :key="w">
      <span class="word" aria-hidden="true">
        <span v-for="(char, i) in word" :key="i" class="clip"><span class="char">{{ char }}</span></span>
      </span>
      <template v-if="w < words.length - 1">{{ ' ' }}</template>
    </template>
  </span>
</template>

<style scoped>
.word {
  display: inline-block;
  white-space: nowrap;
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
