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
</script>

<template>
  <ol class="steps">
    <li v-for="(step, i) in steps" :key="step.title" class="step">
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
  gap: 2rem;
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
  display: grid;
  gap: 0.5rem;
  align-content: start;
  padding-top: 1rem;
  border-top: 1px solid var(--line);
}

.number {
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

h3 {
  font-size: var(--text-lg);
}

p a {
  display: block;
  margin-top: 0.5rem;
}
</style>
