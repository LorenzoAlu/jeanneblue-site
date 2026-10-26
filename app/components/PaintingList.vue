<script setup lang="ts">
import type { DipintiCollectionItem } from '@nuxt/content'
import type { ViewerImage } from '~/utils/viewer'

// priority: la prima opera è sopra la piega (pagina /dipinti), quindi niente lazy
defineProps<{ items: DipintiCollectionItem[], priority?: boolean }>()

const list = ref<HTMLElement>()
const selected = ref<DipintiCollectionItem | null>(null)
const viewer = computed<ViewerImage | null>(() => {
  const item = selected.value
  if (!item) return null
  return {
    src: item.image,
    alt: item.alt,
    width: item.width,
    height: item.height,
    title: item.titolo,
    lines: [String(item.anno), item.tecnica, item.misure, item.stato === 'venduto' ? 'Venduto' : 'Disponibile'],
  }
})

useMotion(list, ({ gsap }) => {
  gsap.utils.toArray<HTMLElement>('.painting').forEach((painting, index) => {
    const frame = painting.querySelector('.frame')!
    const curtain = painting.querySelector('.curtain')!
    const image = painting.querySelector('.image')!
    const lines = painting.querySelectorAll('.label > p:not(.sold)')
    const stamp = painting.querySelector('.sold')

    // Parallasse: la tela scorre un filo più lenta del cartellino.
    // Si muove la cornice intera, non la foto dentro: l'opera non va mai tagliata.
    gsap.fromTo(frame, { y: 40 }, {
      y: -40,
      ease: 'none',
      scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
    })

    // Entrata: un telo color parete si alza e scopre la tela, che si assesta;
    // poi il cartellino si scrive riga per riga e, se venduta, arriva il timbro.
    // Il telo copre la foto ma non la nasconde: l'immagine è già dipinta (LCP ok).
    const visible = isInViewport(painting)
    const timeline = gsap.timeline(
      visible
        ? { delay: 0.35 + index * 0.15 }
        : { scrollTrigger: { trigger: painting, start: 'top 80%', once: true } },
    )
    timeline
      .fromTo(curtain, { scaleY: 1 }, { scaleY: 0, duration: 1.3, ease: 'expo.inOut' })
      .from(image, { scale: 1.25, duration: 1.8, ease: 'expo.out' }, 0.35)
      .from(lines, { yPercent: 100, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out' }, 0.75)
    if (stamp) {
      timeline.from(stamp, {
        scale: 2.6,
        rotate: -28,
        opacity: 0,
        duration: 0.55,
        ease: 'back.out(2.2)',
      }, '>-0.1')
    }
  })

  if (!canHover()) return

  // Luce da galleria: un faretto morbido segue il mouse sulla tela
  const root = list.value!
  const move = (event: PointerEvent) => {
    const frame = (event.target as Element).closest<HTMLElement>('.frame')
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    frame.style.setProperty('--light-x', `${event.clientX - rect.left}px`)
    frame.style.setProperty('--light-y', `${event.clientY - rect.top}px`)
  }
  root.addEventListener('pointermove', move)
  return () => root.removeEventListener('pointermove', move)
})

function open(painting: DipintiCollectionItem) {
  selected.value = painting
}
</script>

<template>
  <div>
    <ul ref="list" role="list" class="list">
      <li v-for="(painting, index) in items" :key="painting.id">
        <figure class="painting">
          <button
            type="button"
            class="frame"
            data-cursor="Guarda"
            :style="{ '--ratio': painting.width / painting.height }"
            :aria-label="`Guarda da vicino: ${painting.titolo}`"
            @click="open(painting)"
          >
            <NuxtImg
              format="webp"
              :src="painting.image"
              :alt="painting.alt"
              :width="painting.width"
              :height="painting.height"
              sizes="xs:100vw md:66vw lg:780px"
              :loading="priority && index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="priority && index === 0 ? 'high' : undefined"
              class="image"
            />
            <span class="curtain" aria-hidden="true" />
          </button>
          <figcaption>
            <PaintingLabel :painting="painting" />
          </figcaption>
        </figure>
      </li>
    </ul>
    <ImageDialog :image="viewer" @close="selected = null" />
  </div>
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
  position: relative;
  /* Larghezza decisa dal CSS, così il box è riservato prima del caricamento */
  width: min(100%, calc(80vh * var(--ratio)));
  aspect-ratio: var(--ratio);
  justify-self: center;
  overflow: hidden;
  padding: 0;
  border: 0;
  background: none;
  cursor: zoom-in;
  /* ombra da quadro appeso: la tela si stacca dalla parete */
  box-shadow: 0 30px 60px -30px rgb(0 0 0 / 0.6);
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: scale 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.curtain {
  position: absolute;
  inset: 0;
  background: var(--bg);
  transform-origin: top;
  /* il telo c'è solo se le animazioni partiranno (data-motion, vedi nuxt.config) */
  transform: scaleY(0);
}

html[data-motion] .curtain {
  transform: scaleY(1);
}

/* Faretto: luce calda che segue il mouse, solo all'hover */
.frame::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle 260px at var(--light-x, 50%) var(--light-y, 50%),
    rgb(255 244 220 / 0.35),
    transparent 70%
  );
  mix-blend-mode: soft-light;
  opacity: 0;
  transition: opacity 0.6s;
  pointer-events: none;
}

@media (hover: hover) {
  .frame:hover .image {
    scale: 1.04;
  }

  .frame:hover::after {
    opacity: 1;
  }
}
</style>
