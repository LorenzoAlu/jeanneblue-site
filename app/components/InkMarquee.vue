<script setup lang="ts">
// Nastro di parole giganti che scorre all'infinito. Va nel verso dello scroll e
// accelera quando scorri veloce, poi torna alla sua andatura. Le parole alternano
// un blu chiaro (#7a88b5, 3,2:1 su Foglio: AA per testo grande) e inchiostro. Niente contorno: il font variabile ha sovrapposizioni
// interne che con -webkit-text-stroke si vedono.
// Decorativo (aria-hidden): senza animazioni resta fermo.
defineProps<{ words: string[] }>()

const root = ref<HTMLElement>()

useMotion(root, ({ gsap, ScrollTrigger }) => {
  const track = root.value!.querySelector<HTMLElement>('.track')!
  // La traccia contiene due copie identiche: scorrere di metà larghezza è un giro
  const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 })
  // Un tween ripetuto all'indietro si ferma al tempo 0: lo porto molto avanti
  loop.totalTime(loop.duration() * 1000)

  let direction = 1
  const trigger = ScrollTrigger.create({
    trigger: root.value,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      direction = self.direction
      const boost = Math.min(Math.abs(self.getVelocity()) / 250, 6)
      gsap.to(loop, { timeScale: direction * (1 + boost), duration: 0.2, overwrite: true })
      gsap.to(loop, { timeScale: direction, duration: 1.2, delay: 0.2, ease: 'power2.out' })
    },
    onToggle: self => (self.isActive ? loop.resume() : loop.pause()),
  })

  return () => trigger.kill()
})
</script>

<template>
  <div ref="root" class="marquee" aria-hidden="true">
    <div class="track">
      <template v-for="copy in 2" :key="copy">
        <span v-for="(word, i) in words" :key="`${copy}-${i}`" :class="['word', { filled: i % 2 === 1 }]">
          {{ word }}<span class="dot">●</span>
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  padding-block: clamp(2rem, 1rem + 4vw, 4rem);
}

.track {
  display: flex;
  width: max-content;
}

.word {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  padding-right: 0.4em;
  color: #7a88b5;
  font-size: clamp(3.5rem, 2rem + 8vw, 9rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  white-space: nowrap;
}

.filled {
  color: var(--accent);
}

.dot {
  color: var(--accent);
  font-size: 0.25em;
}
</style>
