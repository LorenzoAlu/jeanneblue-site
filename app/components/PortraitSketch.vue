<script setup lang="ts">
import { PORTRAIT_TRACE } from '~/utils/portraitTrace'

// Il ritratto di Chi sono che si disegna da solo, come il tatuaggio in home:
// prima le linee blu (ricalco della foto), poi la foto si allarga dal viso e le
// linee si posano sopra e svaniscono. Col mouse sopra, il disegno riaffiora.
// Senza animazioni è la foto e basta.
const props = defineProps<{ src: string, alt: string }>()

const root = ref<HTMLElement>()
const { width, height, origin, paths } = PORTRAIT_TRACE

// Riquadro 4:5 con la foto in cover: in verticale si vede solo la fascia centrale.
// Il punto d'origine va riportato in % del riquadro, non della foto.
const RATIO = 4 / 5
const visibleHeight = Math.min(height, width / RATIO)
const focusAt = `${((origin.x / width) * 100).toFixed(1)}% ${(((origin.y - (height - visibleHeight) / 2) / visibleHeight) * 100).toFixed(1)}%`

useMotion(root, (motion) => {
  const { gsap } = motion
  const el = root.value!
  const strokes = el.querySelectorAll('.lines path')

  entranceTimeline(motion, el, 0.45)
    .to(strokes, { strokeDashoffset: 0, duration: 0.6, stagger: 1.2 / strokes.length, ease: 'power1.inOut' })
    .fromTo('.photo', { clipPath: `circle(0% at ${focusAt})` }, { clipPath: `circle(120% at ${focusAt})`, duration: 1.3, ease: 'power2.inOut' }, '-=0.5')
    .to('.lines', { opacity: 0, duration: 0.9, ease: 'power1.out' }, '-=0.7')

  if (!canHover()) return
  const show = () => gsap.to('.lines', { opacity: 0.9, duration: 0.5, overwrite: 'auto' })
  const hide = () => gsap.to('.lines', { opacity: 0, duration: 0.7, overwrite: 'auto' })
  el.addEventListener('pointerenter', show)
  el.addEventListener('pointerleave', hide)
  return () => {
    el.removeEventListener('pointerenter', show)
    el.removeEventListener('pointerleave', hide)
  }
})
</script>

<template>
  <div ref="root" class="sketch" :style="{ '--focus': focusAt }">
    <NuxtImg
      format="webp"
      :src="props.src"
      :alt="props.alt"
      width="800"
      height="1000"
      fit="cover"
      sizes="xs:100vw md:40vw lg:480px"
      class="photo"
    />
    <svg
      class="lines"
      :viewBox="`0 0 ${width} ${height}`"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <path v-for="(d, i) in paths" :key="i" :d="d" pathLength="1" />
    </svg>
  </div>
</template>

<style scoped>
.sketch {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--line);
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: var(--accent);
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  pointer-events: none;
}

/* Con le animazioni: foglio vuoto, linee pronte da disegnare, foto chiusa */
html[data-motion] .sketch {
  background: none;
}

html[data-motion] .photo {
  clip-path: circle(0% at var(--focus));
}

html[data-motion] .lines {
  opacity: 1;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
</style>
