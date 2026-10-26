<script setup lang="ts">
import type { TatuaggiCollectionItem } from '@nuxt/content'
import type { Flip as FlipPlugin } from 'gsap/Flip'
import type { Motion } from '~/composables/useMotion'
import type { ViewerImage } from '~/utils/viewer'

// priority: la prima riga è sopra la piega (pagina /tatuaggi), quindi niente lazy.
// filter: stile da mostrare (null = tutti). Le card escluse restano nel DOM nascoste,
// così il cambio filtro può animare chi esce, chi entra e chi si sposta (GSAP Flip).
const props = defineProps<{ items: TatuaggiCollectionItem[], priority?: boolean, filter?: string | null }>()

const selected = ref<TatuaggiCollectionItem | null>(null)
const viewer = computed<ViewerImage | null>(() => {
  const item = selected.value
  if (!item) return null
  return {
    src: item.image,
    alt: item.alt,
    width: 800,
    height: 1000,
    title: `${item.stile} · ${item.zona}`,
    lines: [new Date(item.data).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })],
  }
})
const grid = ref<HTMLElement>()

const shown = (item: TatuaggiCollectionItem) => !props.filter || item.stile === props.filter

let tools: (Motion & { Flip: typeof FlipPlugin }) | undefined
let reveal: ((cards: HTMLElement[], delay?: number) => void) | undefined

useMotion(grid, (motion) => {
  const { gsap, ScrollTrigger } = motion

  // Flip serve solo quando si filtra: lo carico subito, così al click è pronto
  import('gsap/Flip').then(({ Flip }) => {
    gsap.registerPlugin(Flip)
    tools = { ...motion, Flip }
  })

  // Entrata: un telo color carta si ritira verso l'alto come una goccia che risale,
  // la foto si assesta. Le card visibili partono subito, le altre allo scroll
  // (o quando un filtro le porta in vista). Il telo copre la foto ma non la
  // nasconde all'LCP: l'immagine è già dipinta.
  reveal = (cards: HTMLElement[], delay = 0) => {
    const fresh = cards.filter(card => !card.dataset.revealed)
    if (!fresh.length) return
    fresh.forEach(card => (card.dataset.revealed = ''))
    gsap
      .timeline({ delay })
      .to(fresh.map(card => card.querySelector('.curtain')), {
        scaleY: 0,
        duration: 1.1,
        ease: 'expo.inOut',
        stagger: 0.09,
      })
      .from(fresh.map(card => card.querySelector('.image')), {
        scale: 1.35,
        yPercent: 8,
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.09,
      }, 0.25)
      .fromTo(fresh.map(card => card.parentElement!.querySelector('.caption')), { y: 12, opacity: 0 }, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.09,
        ease: 'power3.out',
      }, 0.6)
  }
  ScrollTrigger.batch(gsap.utils.toArray<HTMLElement>('.card'), {
    start: 'clamp(top 95%)',
    once: true,
    onEnter: batch => reveal?.(batch as HTMLElement[], batch.some(isInViewport) ? 0.35 : 0),
  })

  if (!canHover()) return

  // Hover: la card si inclina verso il mouse e la foto si avvicina.
  // Delegato sulla griglia, così vale per tutte le card anche dopo i filtri.
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

// Cambio filtro: le card restano e scivolano al nuovo posto; chi esce si rimpicciolisce
// e sparisce, chi entra cresce. Il watch gira prima che Vue aggiorni il DOM, quindi
// qui si fotografa lo stato "prima" senza await in mezzo.
watch(
  () => props.filter,
  async () => {
    if (!tools || !grid.value) return
    const { gsap, Flip, ScrollTrigger } = tools
    const state = Flip.getState(grid.value.querySelectorAll('.tile'))
    await nextTick()
    Flip.from(state, {
      duration: 0.75,
      ease: 'expo.inOut',
      stagger: 0.03,
      absolute: true,
      onEnter: (els) => {
        // Card mai viste (erano sotto la piega): scoprile adesso, insieme all'entrata
        reveal?.(els.map(el => el.querySelector<HTMLElement>('.card')!), 0.2)
        return gsap.fromTo(els, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out', delay: 0.25 })
      },
      onLeave: els => gsap.to(els, { opacity: 0, scale: 0.6, duration: 0.4, ease: 'power2.in' }),
      onComplete: () => ScrollTrigger.refresh(),
    })
  },
)
</script>

<template>
  <div ref="grid">
    <ul role="list" class="grid">
      <li v-for="(item, index) in items" v-show="shown(item)" :key="item.id" class="tile">
        <button type="button" class="open" data-cursor="Apri" @click="selected = item">
          <span class="card">
            <NuxtImg
              format="webp"
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
            <span class="curtain" aria-hidden="true" />
          </span>
          <span class="caption">{{ item.stile }} · {{ item.zona }}</span>
        </button>
      </li>
    </ul>
    <ImageDialog :image="viewer" @close="selected = null" />
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
  position: relative;
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

/* Telo d'entrata: il fondo arrotondato lo fa sembrare una goccia che risale */
.curtain {
  position: absolute;
  inset: -2px;
  border-radius: 0 0 50% 50% / 0 0 18% 18%;
  background: var(--bg);
  transform: scaleY(0);
  transform-origin: top;
}

/* Telo e didascalia partono nascosti solo se le animazioni partiranno (data-motion) */
html[data-motion] .curtain {
  transform: scaleY(1.15);
}

html[data-motion] .caption {
  opacity: 0;
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
