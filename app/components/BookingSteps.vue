<script setup lang="ts">
// I passaggi reali di una prenotazione: la numerazione qui è una sequenza vera.
const steps = [
  {
    title: 'Scrivimi',
    text: "Raccontami l'idea, dove la vuoi e quanto grande. Se hai immagini di riferimento, mandamele.",
  },
  {
    title: 'Il disegno',
    text: 'Preparo un disegno pensato per te e per quella zona. Lo vedi prima e lo sistemiamo insieme.',
  },
  {
    title: 'La seduta',
    text: 'Ci vediamo in studio, con calma. Poi ti spiego come curarlo, e trovi tutto anche qui sul sito.',
  },
]

const list = ref<HTMLElement>()

// Un passo dopo l'altro: la linea si disegna, il numero cade dentro il suo
// cerchio d'inchiostro, poi arrivano titolo e testo
useMotion(list, (motion) => {
  const timeline = entranceTimeline(motion, list.value!)
  motion.gsap.utils.toArray<HTMLElement>('.step').forEach((step, i) => {
    const at = i * 0.35
    timeline
      .fromTo(step.querySelector('.rule'), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power3.inOut' }, at)
      .fromTo(step.querySelector('.number'), { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2)' }, at + 0.3)
      .fromTo(step.querySelectorAll('h3, p'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'expo.out' }, at + 0.4)
  })
})
</script>

<template>
  <ol ref="list" class="steps">
    <li v-for="(step, i) in steps" :key="step.title" class="step">
      <span class="rule" aria-hidden="true" />
      <span class="number" aria-hidden="true">{{ i + 1 }}</span>
      <h3>{{ step.title }}</h3>
      <p>
        {{ step.text }}
        <NuxtLink v-if="i === steps.length - 1" to="/cura">Come curare il tatuaggio</NuxtLink>
      </p>
    </li>
  </ol>
</template>

<style scoped>
.steps {
  display: grid;
  gap: 2.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (min-width: 900px) {
  .steps {
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
  }
}

.step {
  position: relative;
  display: grid;
  gap: 0.6rem;
  align-content: start;
  padding-top: 1.75rem;
}

.rule {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  border-radius: 2px;
  background: var(--accent);
  transform-origin: left;
}

.number {
  display: grid;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--accent);
  color: var(--bg);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 700;
}

h3 {
  font-size: var(--text-lg);
}

/* Nascosti da subito solo se l'animazione partirà (data-motion) */
html[data-motion] .rule {
  transform: scaleX(0);
}

html[data-motion] .number {
  transform: scale(0);
}

html[data-motion] .step h3,
html[data-motion] .step p {
  opacity: 0;
}

p a {
  display: block;
  margin-top: 0.5rem;
}
</style>
