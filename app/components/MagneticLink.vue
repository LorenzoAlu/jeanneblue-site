<script setup lang="ts">
// Link-bottone "magnetico": col mouse vicino si sposta verso il puntatore,
// e il fondo si riempie d'inchiostro dal basso all'hover.
defineProps<{ to: string }>()

const root = ref<HTMLElement>()

useMotion(root, ({ gsap }) => {
  if (!canHover()) return
  const el = root.value!
  const inner = el.querySelector('.text')
  const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  const tx = gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  const ty = gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })

  const move = (event: PointerEvent) => {
    const rect = el.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    x(dx * 0.35)
    y(dy * 0.35)
    tx(dx * 0.15)
    ty(dy * 0.15)
  }
  const leave = () => {
    x(0)
    y(0)
    tx(0)
    ty(0)
  }
  el.addEventListener('pointermove', move)
  el.addEventListener('pointerleave', leave)
  return () => {
    el.removeEventListener('pointermove', move)
    el.removeEventListener('pointerleave', leave)
  }
})
</script>

<template>
  <span ref="root" class="magnetic">
    <NuxtLink :to="to" class="button">
      <span class="text"><slot /></span>
    </NuxtLink>
  </span>
</template>

<style scoped>
.magnetic {
  display: inline-block;
  /* area di aggancio più larga del bottone */
  padding: 1.25rem;
  margin: -1.25rem;
}

.button {
  position: relative;
  display: inline-block;
  overflow: hidden;
  padding: 0.85rem 1.75rem;
  border-radius: 999px;
  background: var(--accent);
  color: var(--bg);
  font-weight: 700;
  text-decoration: none;
  isolation: isolate;
}

/* Inchiostro più scuro che sale dal basso */
.button::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 50% 50% 0 0;
  background: var(--notte);
  transform: translateY(101%);
  transition:
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    border-radius 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.button:hover::before,
.button:focus-visible::before {
  border-radius: 0;
  transform: translateY(0);
}

.text {
  display: inline-block;
}
</style>
