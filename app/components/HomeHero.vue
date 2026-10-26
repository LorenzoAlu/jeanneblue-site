<script setup lang="ts">
import type { TatuaggiCollectionItem } from '@nuxt/content'

defineProps<{ title: string, image: TatuaggiCollectionItem }>()

const root = ref<HTMLElement>()

// Entrata: la foto si scopre con la pennellata di InkReveal, poi i bottoni.
// Col mouse la foto segue il puntatore di qualche pixel, come vista da più vicino.
useMotion(root, ({ gsap }) => {
  // yPercent e non y: MagneticLink sposta lo stesso elemento su x/y
  gsap.fromTo('.actions > *', { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'expo.out', delay: 0.6 })

  if (!canHover()) return
  const el = root.value!
  const image = el.querySelector('.image')
  const x = gsap.quickTo(image, 'x', { duration: 1.2, ease: 'power3.out' })
  const y = gsap.quickTo(image, 'y', { duration: 1.2, ease: 'power3.out' })
  const move = (event: PointerEvent) => {
    x((event.clientX / window.innerWidth - 0.5) * -24)
    y((event.clientY / window.innerHeight - 0.5) * -24)
  }
  el.addEventListener('pointermove', move)
  return () => el.removeEventListener('pointermove', move)
})
</script>

<template>
  <div ref="root">
    <SiteContainer class="hero">
      <InkReveal class="frame">
        <NuxtImg
          format="webp"
          :src="image.image"
          :alt="image.alt"
          width="800"
          height="1000"
          fit="cover"
          sizes="xs:100vw md:55vw lg:660px"
          preload
          loading="eager"
          fetchpriority="high"
          class="image"
        />
      </InkReveal>
      <div class="text">
        <h1><RisingText :text="title" mode="load" /></h1>
        <p class="actions">
          <MagneticLink to="/contatti">Scrivimi</MagneticLink>
          <NuxtLink to="/tatuaggi" class="secondary">Guarda i lavori</NuxtLink>
        </p>
      </div>
    </SiteContainer>
  </div>
</template>

<style scoped>
.hero {
  display: grid;
  gap: 1.5rem;
  padding-top: 0.5rem;
}

@media (min-width: 900px) {
  .hero {
    grid-template-columns: 7fr 5fr;
    align-items: end;
    gap: 3rem;
    padding-top: 1.5rem;
  }
}

.frame {
  background: var(--line);
}

.image {
  width: 100%;
  aspect-ratio: 4 / 5;
  /* su desktop la hero sta tutta nello schermo, con i bottoni visibili */
  max-height: calc(100svh - 9rem);
  object-fit: cover;
}

.text {
  display: grid;
  gap: 1.5rem;
}

/* nascosti da subito solo se l'animazione partirà (data-motion) */
html[data-motion] .actions > * {
  opacity: 0;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.75rem;
  font-weight: 700;
}

.secondary {
  text-decoration-thickness: 1px;
  transition: text-underline-offset 0.3s;
}

.secondary:hover {
  text-underline-offset: 0.4em;
}
</style>
