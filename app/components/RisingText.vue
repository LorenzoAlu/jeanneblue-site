<script setup lang="ts">
// Testo che emerge dall'inchiostro lettera per lettera.
// - scroll (default): legato allo scroll, per i titoli di sezione
// - load: parte subito, per il titolo in hero
// - enter: parte una volta quando entra nello schermo (subito se è già visibile),
//   per ciò che sta a fondo pagina, dove lo scroll può non bastare a completarlo
// Senza JS o con prefers-reduced-motion è testo normale.
const props = withDefaults(
  defineProps<{ text: string, mode?: 'scroll' | 'load' | 'enter', end?: string }>(),
  { mode: 'scroll', end: 'clamp(top 60%)' },
)

// Parole separate da spazi veri, così il titolo va a capo normalmente
const words = computed(() => props.text.split(' ').map(word => [...word]))
const root = ref<HTMLElement>()

useMotion(root, (motion) => {
  const { gsap } = motion
  const chars = root.value!.querySelectorAll('.char')
  const from = { yPercent: 115, rotate: 8 }

  if (props.mode === 'load') {
    // Le lettere partono già nascoste dal CSS (data-motion): fromTo, non from
    // y: 0 azzera la traslazione in px che GSAP legge dal CSS iniziale
    gsap.fromTo(chars, { ...from, y: 0 }, { y: 0, yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.025, ease: 'expo.out', delay: 0.1 })
    return
  }

  if (props.mode === 'enter') {
    entranceTimeline(motion, root.value!, 0.1)
      .from(chars, { ...from, duration: 1.1, stagger: 0.04, ease: 'expo.out' })
    return
  }

  gsap.from(chars, {
    ...from,
    stagger: 0.06,
    ease: 'power3.out',
    scrollTrigger: { trigger: root.value, start: 'top 98%', end: props.end, scrub: 0.8 },
  })
})
</script>

<template>
  <span ref="root" :class="['rising', mode]">
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

html[data-motion] .load .char {
  transform: translateY(115%) rotate(8deg);
}
</style>
