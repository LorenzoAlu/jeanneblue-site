<script setup lang="ts">
// Goccia d'inchiostro che segue il mouse (solo desktop, il cursore di sistema resta).
// Sopra un elemento con data-cursor="Testo" si allarga e mostra il testo.
const root = ref<HTMLElement>()
const label = ref('')

useMotion(root, ({ gsap }) => {
  if (!canHover()) return

  const el = root.value!
  const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
  const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
  let active: Element | null = null

  const move = (event: PointerEvent) => {
    x(event.clientX)
    y(event.clientY)
    const target = (event.target as Element).closest?.('[data-cursor]') ?? null
    if (target === active) return
    active = target
    label.value = target?.getAttribute('data-cursor') ?? ''
    gsap.to(el, {
      scale: target ? 1 : 0.16,
      duration: 0.5,
      ease: target ? 'back.out(1.7)' : 'power3.out',
      overwrite: 'auto',
    })
  }
  const hide = () => gsap.to(el, { autoAlpha: 0, duration: 0.3 })
  const show = () => gsap.to(el, { autoAlpha: 1, duration: 0.3 })
  const press = () => gsap.to(el, { scale: active ? 0.85 : 0.1, duration: 0.15 })
  const release = () => gsap.to(el, { scale: active ? 1 : 0.16, duration: 0.4, ease: 'back.out(2)' })

  gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0.16, autoAlpha: 0 })
  window.addEventListener('pointermove', move, { passive: true })
  window.addEventListener('pointermove', show, { once: true })
  document.documentElement.addEventListener('pointerleave', hide)
  document.documentElement.addEventListener('pointerenter', show)
  window.addEventListener('pointerdown', press)
  window.addEventListener('pointerup', release)

  return () => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointermove', show)
    document.documentElement.removeEventListener('pointerleave', hide)
    document.documentElement.removeEventListener('pointerenter', show)
    window.removeEventListener('pointerdown', press)
    window.removeEventListener('pointerup', release)
  }
})
</script>

<template>
  <div ref="root" class="cursor" aria-hidden="true">
    <span class="label">{{ label }}</span>
  </div>
</template>

<style scoped>
.cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: var(--inchiostro);
  box-shadow: 0 0 0 1.5px var(--foglio);
  pointer-events: none;
  visibility: hidden;
}

.label {
  color: var(--foglio);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
}

@media (hover: none), (pointer: coarse) {
  .cursor {
    display: none;
  }
}
</style>
