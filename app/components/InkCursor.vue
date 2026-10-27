<script setup lang="ts">
// Cursore "macchinetta" (solo desktop, il cursore di sistema resta):
// - la punta lascia una scia di linea fine che si assottiglia e svanisce, come un
//   tratto d'inchiostro appena steso
// - sopra un elemento con data-cursor="Testo" si apre in un cerchio con il testo,
//   circondato da un tratteggio da stencil che gira, e vibra come una macchinetta accesa
// - al click schizza qualche goccia d'inchiostro
const root = ref<HTMLElement>()
const canvas = ref<HTMLCanvasElement>()
const splashes = ref<HTMLElement>()
const label = ref('')

// Quanto resta visibile un pezzo di scia (ms) e lo spessore massimo (px)
const TRAIL_LIFE = 380
const TRAIL_WIDTH = 2.6

useMotion(root, ({ gsap }) => {
  if (!canHover()) return

  const el = root.value!
  const head = el.querySelector<HTMLElement>('.head')!
  const ctx = canvas.value!.getContext('2d')!
  const x = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' })
  const y = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' })
  const points: { x: number, y: number, t: number }[] = []
  let active: Element | null = null
  let ink = '#8ea2ff'

  // Canvas a tutta finestra, nitido sugli schermi retina
  const resize = () => {
    const ratio = window.devicePixelRatio || 1
    canvas.value!.width = window.innerWidth * ratio
    canvas.value!.height = window.innerHeight * ratio
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  }
  resize()

  // Colore della scia: quello dell'inchiostro sulla superficie sotto il mouse
  const inkAt = (target: Element) =>
    getComputedStyle(target.closest('.surface-wall') ?? document.body).getPropertyValue('--accent').trim() || ink

  // La scia: segmenti dal più vecchio al più nuovo, più sottili e trasparenti verso la coda
  const draw = () => {
    const now = performance.now()
    while (points.length && now - points[0]!.t > TRAIL_LIFE) points.shift()
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    ctx.strokeStyle = ink
    ctx.lineCap = 'round'
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1]!
      const b = points[i]!
      const life = 1 - (now - b.t) / TRAIL_LIFE
      ctx.globalAlpha = life
      ctx.lineWidth = TRAIL_WIDTH * life
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
    // L'elemento sotto il mouse è sparito (cambio pagina, dialog) senza che il mouse
    // si muovesse: chiudi il cerchio, sennò vibra all'infinito su un nodo staccato
    if (active && !active.isConnected) setActive(null)
    // Macchinetta accesa: la testa vibra di mezzo pixel quando è sopra una foto
    if (active) gsap.set(head, { x: gsap.utils.random(-0.8, 0.8), y: gsap.utils.random(-0.8, 0.8) })
    if (!points.length && !active) gsap.ticker.remove(draw)
  }
  const wake = () => {
    gsap.ticker.remove(draw)
    gsap.ticker.add(draw)
  }

  const move = (event: PointerEvent) => {
    x(event.clientX)
    y(event.clientY)
    points.push({ x: event.clientX, y: event.clientY, t: performance.now() })
    wake()

    ink = inkAt(event.target as Element)
    setActive((event.target as Element).closest?.('[data-cursor]') ?? null)
  }

  function setActive(target: Element | null) {
    if (target === active) return
    active = target
    label.value = target?.getAttribute('data-cursor') ?? ''
    el.classList.toggle('open', !!target)
    gsap.to(head, {
      scale: target ? 1 : 0.14,
      duration: 0.5,
      ease: target ? 'back.out(1.7)' : 'power3.out',
      overwrite: 'auto',
    })
    if (!target) gsap.to(head, { x: 0, y: 0, duration: 0.2 })
  }

  // Click: 6-9 gocce che schizzano dal punto e cadono un po'
  const splash = (event: PointerEvent) => {
    gsap.to(head, { scale: active ? 0.85 : 0.08, duration: 0.12, yoyo: true, repeat: 1 })
    const count = gsap.utils.random(6, 9, 1)
    for (let i = 0; i < count; i++) {
      const drop = document.createElement('span')
      drop.className = 'drop'
      drop.style.background = ink
      splashes.value!.appendChild(drop)
      const angle = gsap.utils.random(0, Math.PI * 2)
      const distance = gsap.utils.random(18, 56)
      const size = gsap.utils.random(3, 8)
      gsap.set(drop, { x: event.clientX, y: event.clientY, width: size, height: size, xPercent: -50, yPercent: -50 })
      gsap.timeline({ onComplete: () => drop.remove() })
        .to(drop, {
          x: event.clientX + Math.cos(angle) * distance,
          y: event.clientY + Math.sin(angle) * distance,
          duration: 0.45,
          ease: 'expo.out',
        })
        .to(drop, { y: `+=${gsap.utils.random(8, 22)}`, scale: 0.3, opacity: 0, duration: 0.5, ease: 'power2.in' })
    }
  }

  const hide = () => gsap.to(el, { autoAlpha: 0, duration: 0.3 })
  const show = () => gsap.to(el, { autoAlpha: 1, duration: 0.3 })

  gsap.set(el, { autoAlpha: 0 })
  gsap.set(head, { xPercent: -50, yPercent: -50, scale: 0.14 })
  window.addEventListener('pointermove', move, { passive: true })
  window.addEventListener('pointermove', show, { once: true })
  window.addEventListener('pointerdown', splash)
  window.addEventListener('resize', resize)
  document.documentElement.addEventListener('pointerleave', hide)
  document.documentElement.addEventListener('pointerenter', show)

  return () => {
    gsap.ticker.remove(draw)
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointermove', show)
    window.removeEventListener('pointerdown', splash)
    window.removeEventListener('resize', resize)
    document.documentElement.removeEventListener('pointerleave', hide)
    document.documentElement.removeEventListener('pointerenter', show)
  }
})
</script>

<template>
  <div class="layer" aria-hidden="true">
    <canvas ref="canvas" class="trail" />
    <div ref="splashes" class="splashes" />
    <div ref="root" class="cursor">
      <div class="head">
        <svg class="stencil" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="47" />
        </svg>
        <span class="label">{{ label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layer {
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
}

.trail {
  width: 100%;
  height: 100%;
}

.cursor {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
}

.head {
  position: absolute;
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 1.5px var(--bg);
}

/* Tratteggio da stencil intorno al cerchio, che gira piano quando è aperto */
.stencil {
  position: absolute;
  inset: -12px;
  width: calc(100% + 24px);
  height: calc(100% + 24px);
  fill: none;
  stroke: var(--accent);
  stroke-width: 1.5;
  stroke-dasharray: 4 5;
  opacity: 0;
  transition: opacity 0.3s;
}

.open .stencil {
  opacity: 1;
  animation: spin 6s linear infinite;
}

@keyframes spin {
  to {
    rotate: 1turn;
  }
}

.label {
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
}

.splashes :deep(.drop) {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
}

@media (hover: none), (pointer: coarse) {
  .layer {
    display: none;
  }
}
</style>
