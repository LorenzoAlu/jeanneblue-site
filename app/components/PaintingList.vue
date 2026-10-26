<script setup lang="ts">
import type { DipintiCollectionItem } from '@nuxt/content'

// priority: la prima opera è sopra la piega (pagina /dipinti), quindi niente lazy
defineProps<{ items: DipintiCollectionItem[], priority?: boolean }>()

const list = ref<HTMLElement>()

useMotion(list, ({ gsap }) => {
  gsap.utils.toArray<HTMLElement>('.painting').forEach((painting) => {
    const frame = painting.querySelector('.frame')!
    const image = painting.querySelector('.image')!
    const lines = painting.querySelectorAll('.label > *')

    // Parallasse: la tela scorre un filo più lenta del cartellino.
    // Si muove la cornice intera, non la foto dentro: l'opera non va mai tagliata.
    gsap.fromTo(frame, { y: 40 }, {
      y: -40,
      ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
    })

    if (isInViewport(painting)) return

    // Entrata: il telo si alza dal basso, la tela si assesta, il cartellino si scrive
    gsap
      .timeline({ scrollTrigger: { trigger: painting, start: 'top 85%', once: true } })
      .from(frame, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' })
      .from(image, { scale: 1.3, duration: 1.8, ease: 'expo.out' }, 0.3)
      .from(lines, { yPercent: 100, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out' }, 0.7)
  })
})
</script>

<template>
  <ul ref="list" role="list" class="list">
    <li v-for="(painting, index) in items" :key="painting.id">
      <figure class="painting">
        <div class="frame" :style="{ '--ratio': painting.width / painting.height }">
          <NuxtImg
            :src="painting.image"
            :alt="painting.alt"
            :width="painting.width"
            :height="painting.height"
            sizes="xs:100vw md:66vw lg:780px"
            :loading="priority && index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="priority && index === 0 ? 'high' : undefined"
            class="image"
          />
        </div>
        <figcaption>
          <PaintingLabel :painting="painting" />
        </figcaption>
      </figure>
    </li>
  </ul>
</template>

<style scoped>
.list {
  display: grid;
  gap: var(--space-section);
}

.painting {
  display: grid;
  gap: 1rem;
  margin: 0;
}

@media (min-width: 900px) {
  .painting {
    grid-template-columns: 2fr 1fr;
    align-items: end;
    gap: 2.5rem;
  }
}

.frame {
  /* Larghezza decisa dal CSS, così il box è riservato prima del caricamento */
  width: min(100%, calc(80vh * var(--ratio)));
  aspect-ratio: var(--ratio);
  justify-self: center;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: scale 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (hover: hover) {
  .painting:hover .image {
    scale: 1.05;
  }
}
</style>
