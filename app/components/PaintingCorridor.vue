<script setup lang="ts">
import type { DipintiCollectionItem } from '@nuxt/content'
import type { ViewerImage } from '~/utils/viewer'

// I dipinti in home come un corridoio di galleria: la sezione resta ferma e
// scorrendo giù le tele passano da destra a sinistra, ognuna scoperta da un telo
// color parete, con la tela che scorre un filo dentro la cornice.
// Senza animazioni è una fila orizzontale da scorrere a mano (scroll-snap).
// Lo slot sta sopra la fila e resta fermo con lei (titolo della sezione).
defineProps<{ items: DipintiCollectionItem[] }>()

const root = ref<HTMLElement>()

const sizeOf = (painting: DipintiCollectionItem) => ({
  width: painting.width ?? 1200,
  height: painting.height ?? 1500,
})
const selected = ref<DipintiCollectionItem | null>(null)
const viewer = computed<ViewerImage | null>(() => {
  const item = selected.value
  if (!item) return null
  return {
    src: item.image,
    alt: item.alt,
    ...sizeOf(item),
    title: item.titolo,
    lines: [String(item.anno), item.tecnica, item.misure, item.stato === 'venduto' ? 'Venduto' : 'Disponibile'],
  }
})

useMotion(root, ({ gsap }) => {
  const el = root.value!
  const track = el.querySelector<HTMLElement>('.track')!
  // Fino al bordo destro dell'ultima tela più il margine: scrollWidth conterebbe
  // anche ciò che sborda trasformato (tele ingrandite, ombre)
  const distance = () => {
    const last = track.lastElementChild as HTMLElement | null
    if (!last) return 0
    const end = last.offsetLeft + last.offsetWidth + parseFloat(getComputedStyle(track).paddingRight)
    return Math.max(end - el.clientWidth, 0)
  }

  const slide = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'center center',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  })

  gsap.utils.toArray<HTMLElement>('.item', el).forEach((item) => {
    const image = item.querySelector('.image')
    const curtain = item.querySelector('.curtain')
    const label = item.querySelectorAll('.label > *')
    const along = { trigger: item, containerAnimation: slide }

    gsap.fromTo(image, { xPercent: 6 }, {
      xPercent: -6,
      ease: 'none',
      scrollTrigger: { ...along, start: 'left right', end: 'right left', scrub: true },
    })
    gsap.timeline({ scrollTrigger: { ...along, start: 'left 90%', toggleActions: 'play none none reverse' } })
      .fromTo(curtain, { scaleY: 1 }, { scaleY: 0, duration: 1.1, ease: 'expo.inOut' })
      .fromTo(label, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, 0.5)
  })

  // Da tastiera: il focus su una tela fuori schermo porta lo scroll fin lì
  const onFocus = (event: FocusEvent) => {
    const item = (event.target as Element).closest<HTMLElement>('.item')
    const st = slide.scrollTrigger
    if (!item || !st || !distance()) return
    const progress = Math.min(Math.max((item.offsetLeft - el.clientWidth * 0.2) / distance(), 0), 1)
    window.scrollTo({ top: st.start + (st.end - st.start) * progress, behavior: 'instant' })
  }
  el.addEventListener('focusin', onFocus)

  // Le tele arrivano da destra mentre la fila scorre: si scaricano con uno schermo d'anticipo
  const stopLoading = loadWhenNear(gsap.utils.toArray('.item', el), '0px 100% 100% 0px')
  return () => {
    stopLoading()
    el.removeEventListener('focusin', onFocus)
  }
})
</script>

<template>
  <div ref="root" class="corridor">
    <slot />
    <ul role="list" class="track">
      <li v-for="painting in items" :key="painting.id" class="item">
        <button
          type="button"
          class="frame"
          data-cursor="Guarda"
          :style="{ '--ratio': sizeOf(painting).width / sizeOf(painting).height }"
          :aria-label="`Guarda da vicino: ${painting.titolo}`"
          @click="selected = painting"
        >
          <NuxtImg
            format="webp"
            :src="painting.image"
            :alt="painting.alt"
            :width="sizeOf(painting).width"
            :height="sizeOf(painting).height"
            sizes="xs:90vw md:50vw lg:640px"
            loading="lazy"
            class="image"
          />
          <span class="curtain" aria-hidden="true" />
        </button>
        <PaintingLabel :painting="painting" />
      </li>
    </ul>
    <ImageDialog :image="viewer" @close="selected = null" />
  </div>
</template>

<style scoped>
.corridor {
  overflow-x: clip;
}

.track {
  display: flex;
  align-items: flex-end;
  gap: clamp(2rem, 1rem + 5vw, 6rem);
  overflow-x: auto;
  padding-inline: max(var(--gutter), (100vw - var(--container)) / 2 + var(--gutter));
  padding-bottom: 1rem;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--gutter);
}

.item {
  display: grid;
  gap: 1rem;
  flex: none;
  scroll-snap-align: start;
}

.frame {
  position: relative;
  height: clamp(16rem, 52svh, 36rem);
  max-width: 80vw;
  aspect-ratio: var(--ratio);
  overflow: hidden;
  padding: 0;
  border: 0;
  background: none;
  cursor: zoom-in;
  box-shadow: 0 30px 60px -30px rgb(0 0 0 / 0.6);
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.curtain {
  position: absolute;
  inset: 0;
  background: var(--bg);
  transform-origin: top;
  transform: scaleY(0);
}

/* Con le animazioni la fila la muove lo scroll verticale, non il dito */
html[data-motion] .track {
  overflow-x: visible;
  scroll-snap-type: none;
}

html[data-motion] .image {
  /* margine per lo scorrimento della tela dentro la cornice */
  scale: 1.15;
}

html[data-motion] .curtain {
  transform: scaleY(1);
}

/* Tele lontane: si scaricano solo quando si avvicinano (loadWhenNear) */
html[data-motion] .item:not([data-near]) .image {
  display: none;
}
</style>
