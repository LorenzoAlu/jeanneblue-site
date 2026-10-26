<script setup lang="ts">
import type { PagineCollectionItem } from '@nuxt/content'

// Testo lungo animato con lo scroll: i titoli salgono con un tratto di penna sotto,
// paragrafi e voci di elenco arrivano a gruppi.
// timeline: linea d'inchiostro a sinistra che si riempie leggendo, con un punto
// per ogni titolo che si accende quando lo raggiungi (pagina cura).
defineProps<{ value: PagineCollectionItem, timeline?: boolean }>()

const root = ref<HTMLElement>()

useMotion(root, ({ gsap, ScrollTrigger }) => {
  const el = root.value!
  const below = (els: Element[]) => els.filter(item => !isInViewport(item))

  below(gsap.utils.toArray<HTMLElement>('.prose > h2')).forEach((heading) => {
    gsap.timeline({ scrollTrigger: { trigger: heading, start: 'top 85%', once: true } })
      .from(heading, { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out' })
      .fromTo(heading, { '--underline': 0 }, { '--underline': 1, duration: 0.8, ease: 'power3.inOut' }, 0.2)
  })

  const blocks = below(gsap.utils.toArray<HTMLElement>('.prose > p, .prose > ul > li, .prose > ol > li'))
  if (blocks.length) {
    gsap.set(blocks, { y: 28, opacity: 0 })
    ScrollTrigger.batch(blocks, {
      start: 'top 90%',
      once: true,
      onEnter: batch => gsap.to(batch, { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'expo.out' }),
    })
  }

  if (!el.querySelector('.fill')) return

  gsap.fromTo('.fill', { scaleY: 0 }, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top 60%', end: 'bottom 60%', scrub: 0.5 },
  })
  gsap.utils.toArray<HTMLElement>('.prose > h2').forEach((heading) => {
    ScrollTrigger.create({
      trigger: heading,
      start: 'top 60%',
      onEnter: () => heading.classList.add('reached'),
      onLeaveBack: () => heading.classList.remove('reached'),
    })
  })
})
</script>

<template>
  <div ref="root" :class="['motion', { timeline }]">
    <template v-if="timeline">
      <span class="track" aria-hidden="true" />
      <span class="fill" aria-hidden="true" />
    </template>
    <ProseContent :value="value" />
  </div>
</template>

<style scoped>
.motion {
  position: relative;
}

/* Tratto sotto i titoli: --underline va da 0 a 1 (animato), 1 senza animazioni */
.motion :deep(.prose h2) {
  --underline: 1;
  position: relative;
  padding-bottom: 0.35em;
}

.motion :deep(.prose h2)::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 3rem;
  height: 3px;
  border-radius: 3px;
  background: currentColor;
  transform: scaleX(var(--underline));
  transform-origin: left;
}

.timeline {
  padding-left: 2.25rem;
}

.track,
.fill {
  position: absolute;
  top: 0.5rem;
  bottom: 0;
  left: 0.45rem;
  width: 2px;
  border-radius: 2px;
}

.track {
  background: var(--line);
}

.fill {
  background: var(--accent);
  transform-origin: top;
}

/* Punto sulla linea per ogni titolo: vuoto, poi pieno quando lo raggiungi */
.timeline :deep(.prose h2)::before {
  content: '';
  position: absolute;
  top: 0.3em;
  left: calc(-2.25rem + 0.45rem + 1px - 0.5rem);
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--accent);
  border-radius: 50%;
  background: var(--bg);
  transition:
    background 0.4s,
    scale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.timeline :deep(.prose h2.reached)::before {
  background: var(--accent);
  scale: 1.25;
}
</style>
