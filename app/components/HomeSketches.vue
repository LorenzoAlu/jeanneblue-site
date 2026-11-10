<script setup lang="ts">
import { SKETCHES } from '~/utils/sketches'

// I disegni di Jeanne sparsi su un tavolo. La sezione resta ferma e scorrendo:
// 1. la pila di fogli sale dal fondo
// 2. i fogli vengono distribuiti uno a uno sul tavolo, ruotando come lanciati
// 3. il tavolo si svuota: i fogli volano via verso l'alto a velocità diverse
//    e resta il titolo, con l'invito a scriverle
// Senza animazioni: titolo e una griglia di disegni.
const root = ref<HTMLElement>()

useMotion(root, ({ gsap }) => {
  const stage = root.value!.querySelector<HTMLElement>('.table')!
  const sheets = gsap.utils.toArray<HTMLElement>('.sheet', stage)
  const offsetX = (x: number) => () => (x - 0.5) * stage.clientWidth * (stage.clientWidth < 900 ? 0.75 : 1)
  const offsetY = (y: number) => () => (y - 0.5) * stage.clientHeight

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: '+=320%',
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    },
  })

  tl.fromTo('.heading', { scale: 0.7, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }, 0)
    // 1. la pila sale
    .fromTo(sheets, {
      x: 0,
      y: () => stage.clientHeight * 0.9,
      rotation: (i: number) => (i % 2 ? 4 : -4) * (i / 2),
      scale: 0.8,
    }, { y: 0, duration: 1, stagger: 0.04, ease: 'power3.out' }, 0)

  // 2. distribuzione: ogni foglio parte un po' dopo il precedente, con un mezzo giro
  sheets.forEach((sheet, i) => {
    const sketch = SKETCHES[i]!
    tl.to(sheet, {
      x: offsetX(sketch.x),
      y: offsetY(sketch.y),
      rotation: sketch.r + (i % 2 ? 360 : -360) * 0.25,
      scale: 1,
      duration: 1,
      ease: 'power3.out',
    }, 1.1 + i * 0.45)
      .to(sheet, { rotation: sketch.r, duration: 0.5, ease: 'back.out(2)' }, '>-0.3')
  })

  // 3. il tavolo si svuota: chi è più in alto vola via prima
  sheets.forEach((sheet, i) => {
    const sketch = SKETCHES[i]!
    tl.to(sheet, {
      y: () => -stage.clientHeight * (1.1 + sketch.y),
      rotation: sketch.r * 3,
      duration: 1.2 + sketch.y,
      ease: 'power2.in',
    }, 5.4 + sketch.y * 0.6)
  })
  tl.fromTo('.cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 6.6)
})
</script>

<template>
  <section ref="root" class="sketches" aria-labelledby="home-disegni">
    <div class="table">
      <div class="heading">
        <h2 id="home-disegni">Dal mio foglio</h2>
        <p class="cta">
          Ti piace un disegno? <NuxtLink to="/contatti">Scrivimi</NuxtLink>, può diventare il tuo tatuaggio.
        </p>
      </div>
      <ul role="list" class="sheets">
        <li v-for="sketch in SKETCHES" :key="sketch.src" class="sheet" :style="{ '--ratio': sketch.width / sketch.height }">
          <NuxtImg
            format="webp"
            :src="sketch.src"
            :alt="sketch.alt"
            :width="sketch.width"
            :height="sketch.height"
            sizes="xs:50vw md:30vw lg:420px"
            loading="lazy"
            class="image"
          />
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.table {
  display: grid;
  gap: clamp(2rem, 1rem + 3vw, 4rem);
  max-width: var(--container);
  margin-inline: auto;
  padding: var(--space-section) var(--gutter);
}

.heading {
  display: grid;
  justify-items: center;
  gap: 1rem;
  text-align: center;
}

h2 {
  font-size: clamp(3rem, 1.5rem + 8vw, 9rem);
  line-height: 0.9;
}

.cta {
  max-width: 32ch;
  color: var(--muted);
}

.sheets {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(0.75rem, 2vw, 1.5rem);
}

@media (min-width: 900px) {
  .sheets {
    grid-template-columns: repeat(3, 1fr);
  }
}

.sheet {
  aspect-ratio: var(--ratio);
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* foglio appoggiato: ombra netta, niente cornice */
  box-shadow: 0 24px 50px -20px rgb(0 0 0 / 0.7);
}

/* Con le animazioni: un tavolo grande quanto lo schermo, fogli impilati al centro */
html[data-motion] .table {
  position: relative;
  max-width: none;
  height: 100svh;
  padding: 0;
  overflow: clip;
  place-content: center;
}

html[data-motion] .heading {
  position: relative;
  z-index: 0;
}

html[data-motion] .cta {
  opacity: 0;
}

html[data-motion] .sheets {
  position: absolute;
  inset: 0;
  display: block;
  pointer-events: none;
}

html[data-motion] .sheet {
  position: absolute;
  top: 50%;
  left: 50%;
  height: clamp(9rem, 22svh, 20rem);
  max-width: 40vw;
  translate: -50% -50%;
  /* prima del JS i fogli aspettano sotto lo schermo */
  transform: translateY(100svh);
  will-change: transform;
}

@media (min-width: 900px) {
  html[data-motion] .sheet {
    height: clamp(13rem, 34svh, 24rem);
  }
}
</style>
