<script setup lang="ts">
// Scopre il contenuto con una pennellata: una striscia d'inchiostro attraversa il
// riquadro da sinistra, lascia l'immagine scoperta e si ritira a destra.
// Poi l'immagine scorre piano con lo scroll (parallasse interna).
// Il telo copre solo se le animazioni partiranno (html[data-motion]).
const root = ref<HTMLElement>()

useMotion(root, ({ gsap }) => {
  const el = root.value!
  const cover = el.querySelector('.cover')
  const stroke = el.querySelector('.stroke')
  const media = el.querySelector('.media')

  const timeline = gsap.timeline(
    isInViewport(el)
      ? { delay: 0.3 }
      : { scrollTrigger: { trigger: el, start: 'clamp(top 80%)', once: true } },
  )
  timeline
    .fromTo(stroke, { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: 0.6, ease: 'expo.in' })
    .set(cover, { autoAlpha: 0 })
    .set(stroke, { transformOrigin: 'right' })
    .to(stroke, { scaleX: 0, duration: 0.8, ease: 'expo.out' })
    .from(media, { scale: 1.3, duration: 1.6, ease: 'expo.out' }, '<')

  gsap.fromTo(media, { yPercent: -4 }, {
    yPercent: 4,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
  })
})
</script>

<template>
  <div ref="root" class="reveal">
    <div class="media">
      <slot />
    </div>
    <span class="cover" aria-hidden="true" />
    <span class="stroke" aria-hidden="true" />
  </div>
</template>

<style scoped>
.reveal {
  position: relative;
  overflow: hidden;
}

/* margine per la parallasse interna */
.media {
  scale: 1.1;
}

.cover,
.stroke {
  position: absolute;
  inset: 0;
  visibility: hidden;
}

.cover {
  background: var(--bg);
}

.stroke {
  background: var(--accent);
  transform: scaleX(0);
}

html[data-motion] .cover {
  visibility: visible;
}

html[data-motion] .stroke {
  visibility: visible;
}
</style>
