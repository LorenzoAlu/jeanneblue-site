<script setup lang="ts">
import type { FaqCollectionItem } from '@nuxt/content'

// Domanda a fisarmonica su <details>: con GSAP apertura e chiusura scorrono
// in altezza invece di scattare; senza, resta il comportamento nativo.
defineProps<{ item: FaqCollectionItem }>()

const details = ref<HTMLDetailsElement>()
const body = ref<HTMLElement>()
let busy = false

async function onToggle(event: MouseEvent) {
  // Con reduced motion lascia fare al browser
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // preventDefault va chiamato subito, prima di qualsiasi await
  event.preventDefault()
  if (busy || !details.value || !body.value) return
  busy = true
  const motion = await loadMotion()
  if (!motion) {
    details.value.open = !details.value.open
    busy = false
    return
  }
  const { gsap } = motion

  if (details.value.open) {
    await gsap.to(body.value, { height: 0, opacity: 0, duration: 0.45, ease: 'power3.inOut' })
    details.value.open = false
  }
  else {
    details.value.open = true
    await gsap.fromTo(body.value, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.6, ease: 'expo.out' })
  }
  gsap.set(body.value, { clearProps: 'height,opacity' })
  // La pagina ha cambiato altezza: i trigger più in basso (footer) vanno ricalcolati
  motion.ScrollTrigger.refresh()
  busy = false
}
</script>

<template>
  <details ref="details" class="item">
    <summary @click="onToggle">
      <span>{{ item.title }}</span>
      <span class="icon" aria-hidden="true" />
    </summary>
    <div ref="body" class="body">
      <ProseContent :value="item" class="answer" />
    </div>
  </details>
</template>

<style scoped>
.item {
  position: relative;
  border-bottom: 1px solid var(--line);
}

/* Tratto d'inchiostro a sinistra all'hover e quando è aperta */
.item::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -1rem;
  width: 3px;
  border-radius: 3px;
  background: var(--accent);
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
}

.item:hover::before,
.item[open]::before {
  transform: scaleY(1);
}

summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-block: 1.25rem;
  color: var(--accent);
  font-size: var(--text-lg);
  font-weight: 700;
  line-height: 1.25;
  list-style: none;
  cursor: pointer;
  transition: translate 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

summary::-webkit-details-marker {
  display: none;
}

@media (hover: hover) {
  summary:hover {
    translate: 0.5rem 0;
  }
}

/* + che diventa − ruotando */
.icon {
  position: relative;
  flex: none;
  width: 1.1rem;
  height: 1.1rem;
}

.icon::before,
.icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  margin-top: -1px;
  border-radius: 2px;
  background: currentColor;
  transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
}

.icon::after {
  transform: rotate(90deg);
}

.item[open] .icon::before {
  transform: rotate(180deg);
}

.item[open] .icon::after {
  transform: rotate(180deg);
}

.body {
  overflow: hidden;
}

.answer {
  padding-bottom: 1.5rem;
}
</style>
