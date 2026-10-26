<script setup lang="ts">
import { INK_REST, inkPath, surfaceY } from '~/utils/inkWave'

// Il bordo tra foglio e parete in home, fatto di inchiostro liquido.
// - surge: scorrendo, l'inchiostro sale dal fondo con un'ondata e schizzi di gocce
//   che si staccano e ricadono (filtro "goo" per farle sembrare liquide);
//   poi resta a riposo con un'onda lenta. Col mouse vicino, la superficie si
//   gonfia verso il puntatore.
// - flip: il bordo sotto la parete, solo onda lenta.
// Senza JS o con prefers-reduced-motion resta il profilo statico renderizzato dal server.
const props = defineProps<{ surge?: boolean, flip?: boolean }>()

const SSR_WIDTH = 1440
const SSR_HEIGHT = 200

// Gocce: x (0-1), salto (frazione dell'altezza), deriva orizzontale (px), raggio, quando partono
const DROPS = [
  { x: 0.05, lift: 0.5, drift: -18, r: 8, at: 0.2 },
  { x: 0.12, lift: 0.95, drift: 10, r: 13, at: 0.27 },
  { x: 0.18, lift: 0.4, drift: 24, r: 6, at: 0.34 },
  { x: 0.26, lift: 1.2, drift: -12, r: 15, at: 0.23 },
  { x: 0.33, lift: 0.6, drift: 16, r: 9, at: 0.4 },
  { x: 0.41, lift: 0.8, drift: -22, r: 11, at: 0.3 },
  { x: 0.47, lift: 1.35, drift: 6, r: 17, at: 0.25 },
  { x: 0.54, lift: 0.45, drift: 20, r: 7, at: 0.43 },
  { x: 0.61, lift: 1.05, drift: -8, r: 13, at: 0.29 },
  { x: 0.69, lift: 0.55, drift: 14, r: 8, at: 0.37 },
  { x: 0.75, lift: 1.25, drift: -16, r: 14, at: 0.22 },
  { x: 0.83, lift: 0.7, drift: 18, r: 10, at: 0.33 },
  { x: 0.9, lift: 1, drift: -10, r: 12, at: 0.26 },
  { x: 0.96, lift: 0.5, drift: 8, r: 7, at: 0.39 },
]
const DROP_DURATION = 0.38
// Sotto questo raggio il filtro goo lascia aloni: meglio far sparire la goccia
const MIN_RADIUS = 5

const restPath = inkPath({ width: SSR_WIDTH, height: SSR_HEIGHT, ...INK_REST })
const filterId = `goo-${useId()}`
const drops = props.surge ? DROPS : []

const svg = ref<SVGSVGElement>()
const path = ref<SVGPathElement>()
const circles = ref<SVGCircleElement[]>([])

let cleanup: (() => void) | undefined

onMounted(async () => {
  if (!svg.value || !path.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ])
  gsap.registerPlugin(ScrollTrigger)

  const el = svg.value
  const state = { progress: props.surge ? 0 : 1, time: 0, bump: 0, bumpX: 0 }
  let width = el.clientWidth
  let height = el.clientHeight

  const resize = () => {
    width = el.clientWidth
    height = el.clientHeight
    el.setAttribute('viewBox', `0 0 ${width} ${height}`)
  }
  resize()

  const easeOut = gsap.parseEase('power3.out')

  function render() {
    const p = state.progress
    const level = easeOut(Math.min(p / 0.65, 1))
    // ondata: l'ampiezza sale a metà corsa e poi si calma
    const swell = Math.sin(Math.min(p / 0.85, 1) * Math.PI)
    // su schermi stretti onde e gocce più piccole, sennò diventano punte
    const scale = Math.min(Math.max(width / 1100, 0.45), 1)
    const amp = (INK_REST.amp + 46 * swell * scale) * level
    const surface = { width, height, level, amp, time: state.time, bump: state.bump, bumpX: state.bumpX }

    path.value!.setAttribute('d', inkPath(surface))

    drops.forEach((drop, i) => {
      const circle = circles.value[i]
      if (!circle) return
      const local = (p - drop.at) / DROP_DURATION
      const r = drop.r * 1.3 * Math.max(scale, 0.7) * (1 - local * 0.45)
      if (local <= 0 || local >= 1 || r < MIN_RADIUS) {
        circle.setAttribute('r', '0')
        return
      }
      const x = drop.x * width + drop.drift * local
      const lift = Math.sin(local * Math.PI) * drop.lift * height * 0.5
      circle.setAttribute('cx', x.toFixed(1))
      circle.setAttribute('cy', (surfaceY(surface, x) - lift).toFixed(1))
      circle.setAttribute('r', r.toFixed(1))
    })
  }

  // L'onda si muove solo quando il bordo è visibile
  const tick = (_time: number, delta: number) => {
    state.time += delta * 0.0011
    render()
  }
  const observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) gsap.ticker.add(tick)
    else gsap.ticker.remove(tick)
  })
  observer.observe(el)

  const resizeObserver = new ResizeObserver(() => {
    resize()
    render()
  })
  resizeObserver.observe(el)

  const tween = props.surge
    ? gsap.to(state, {
        progress: 1,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom 30%', scrub: 0.9 },
      })
    : undefined

  // Solo con mouse/trackpad: la superficie si alza verso il puntatore quando è vicino
  const canHover = props.surge && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const onPointerMove = (event: PointerEvent) => {
    const rect = el.getBoundingClientRect()
    const surfaceTop = rect.top + rect.height * 0.45
    const near = event.clientY > surfaceTop - 160 && event.clientY < rect.bottom
    gsap.to(state, {
      bump: near ? 1 : 0,
      bumpX: event.clientX - rect.left,
      duration: 0.7,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }
  if (canHover) window.addEventListener('pointermove', onPointerMove, { passive: true })

  render()

  cleanup = () => {
    tween?.scrollTrigger?.kill()
    tween?.kill()
    gsap.killTweensOf(state)
    gsap.ticker.remove(tick)
    observer.disconnect()
    resizeObserver.disconnect()
    if (canHover) window.removeEventListener('pointermove', onPointerMove)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <svg
    ref="svg"
    :class="['flood', { flip }]"
    :viewBox="`0 0 ${SSR_WIDTH} ${SSR_HEIGHT}`"
    preserveAspectRatio="none"
    aria-hidden="true"
    focusable="false"
  >
    <defs v-if="surge">
      <filter :id="filterId" x="-10%" y="-100%" width="120%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
        <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
      </filter>
    </defs>
    <g :filter="surge ? `url(#${filterId})` : undefined">
      <path ref="path" :d="restPath" />
      <circle v-for="(drop, i) in drops" :key="i" ref="circles" r="0" />
    </g>
  </svg>
</template>

<style scoped>
.flood {
  display: block;
  width: 100%;
  height: clamp(110px, 16vw, 220px);
  margin-bottom: -1px;
  fill: var(--notte);
  overflow: visible;
}

.flip {
  height: clamp(48px, 7vw, 96px);
  margin-top: -1px;
  margin-bottom: 0;
  transform: scaleY(-1);
}
</style>
