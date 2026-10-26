<script setup lang="ts">
import type { TatuaggiCollectionItem } from '@nuxt/content'

// priority: la prima riga è sopra la piega (pagina /tatuaggi), quindi niente lazy
defineProps<{ items: TatuaggiCollectionItem[], priority?: boolean }>()

const selected = ref<TatuaggiCollectionItem | null>(null)
const grid = ref<HTMLElement>()

useMotion(grid, ({ gsap, ScrollTrigger }) => {
  const cards = gsap.utils.toArray<HTMLElement>('.card')

  // Entrata: la foto si apre dal basso come una goccia che si allarga.
  // Solo per le card ancora sotto la piega al mount.
  const hidden = cards.filter(card => !isInViewport(card))
  gsap.set(hidden, { clipPath: 'inset(100% 0% 0% 0% round 50% 50% 0 0)' })
  gsap.set(hidden.map(card => card.querySelector('.image')), { scale: 1.35, yPercent: 8 })
  ScrollTrigger.batch(hidden, {
    start: 'top 92%',
    once: true,
    onEnter: batch =>
      gsap
        .timeline()
        .to(batch, {
          clipPath: 'inset(0% 0% 0% 0% round 0% 0% 0 0)',
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.09,
        })
        .to(batch.map(card => card.querySelector('.image')), {
          scale: 1,
          yPercent: 0,
          duration: 1.4,
          ease: 'expo.out',
          stagger: 0.09,
        }, 0),
  })

  if (!canHover()) return

  // Hover: la card si inclina verso il mouse e la foto si avvicina.
  // Delegato sulla griglia, così vale anche per le card ricreate dal filtro.
  const root = grid.value!
  type QuickTo = ReturnType<typeof gsap.quickTo>
  const tilts = new WeakMap<HTMLElement, { x: QuickTo, y: QuickTo }>()
  const tiltOf = (card: HTMLElement) => {
    let tilt = tilts.get(card)
    if (!tilt) {
      gsap.set(card, { transformPerspective: 900 })
      tilt = {
        x: gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' }),
        y: gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' }),
      }
      tilts.set(card, tilt)
    }
    return tilt
  }
  const cardOf = (event: PointerEvent) => (event.target as Element).closest<HTMLElement>('.card')

  const move = (event: PointerEvent) => {
    const card = cardOf(event)
    if (!card) return
    const rect = card.getBoundingClientRect()
    const tilt = tiltOf(card)
    tilt.y(((event.clientX - rect.left) / rect.width - 0.5) * 10)
    tilt.x(-((event.clientY - rect.top) / rect.height - 0.5) * 10)
  }
  const over = (event: PointerEvent) => {
    const card = cardOf(event)
    if (card && !card.contains(event.relatedTarget as Node)) {
      gsap.to(card.querySelector('.image'), { scale: 1.08, duration: 0.8, ease: 'power3.out' })
    }
  }
  const out = (event: PointerEvent) => {
    const card = cardOf(event)
    if (!card || card.contains(event.relatedTarget as Node)) return
    const tilt = tiltOf(card)
    tilt.x(0)
    tilt.y(0)
    gsap.to(card.querySelector('.image'), { scale: 1, duration: 0.8, ease: 'power3.out' })
  }

  root.addEventListener('pointermove', move)
  root.addEventListener('pointerover', over)
  root.addEventListener('pointerout', out)
  return () => {
    root.removeEventListener('pointermove', move)
    root.removeEventListener('pointerover', over)
    root.removeEventListener('pointerout', out)
  }
})
</script>

<template>
  <div ref="grid">
    <ul role="list" class="grid">
      <li v-for="(item, index) in items" :key="item.id">
        <button type="button" class="open" data-cursor="Apri" @click="selected = item">
          <span class="card">
            <NuxtImg
              :src="item.image"
              :alt="item.alt"
              width="800"
              height="1000"
              fit="cover"
              sizes="xs:50vw md:33vw lg:400px"
              :loading="priority && index < 2 ? 'eager' : 'lazy'"
              :fetchpriority="priority && index === 0 ? 'high' : undefined"
              class="image"
            />
          </span>
          <span class="caption">{{ item.stile }} · {{ item.zona }}</span>
        </button>
      </li>
    </ul>
    <TattooDialog :item="selected" @close="selected = null" />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(0.75rem, 2vw, 1.5rem);
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.open {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: zoom-in;
}

.card {
  display: block;
  overflow: hidden;
  background: var(--line);
  will-change: transform;
}

.image {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.caption {
  position: relative;
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  transition: color 0.3s;
}

/* Sottolineatura che si disegna come un tratto di penna */
.caption::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
}

.open:hover .caption,
.open:focus-visible .caption {
  color: var(--accent);
}

.open:hover .caption::after,
.open:focus-visible .caption::after {
  transform: scaleX(1);
  transform-origin: left;
}
</style>
