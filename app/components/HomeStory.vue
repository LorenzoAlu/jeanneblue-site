<script setup lang="ts">
import type { TatuaggiCollectionItem } from '@nuxt/content'
import { STORY_TATTOO } from '~/utils/storyTattoo'

// Apertura della home, raccontata dallo scroll (sezione bloccata sullo schermo):
// 1. la frase di Jeanne e una goccia d'inchiostro sospesa
// 2. scorrendo la goccia cade, si schiaccia e diventa la punta che disegna il tatuaggio
// 3. sotto il disegno si allarga la foto del tatuaggio vero: le linee ci cadono sopra
// 4. la camera si allontana e mostra tutto il tatuaggio
// Senza JS o con prefers-reduced-motion: la frase e sotto la foto, niente blocco.
// tattoo: la scheda del tatuaggio (alt, stile, zona); la foto è il primo piano del ricalco.
defineProps<{ title: string, tattoo: TatuaggiCollectionItem }>()

const root = ref<HTMLElement>()
const { image, width, height, origin, paths } = STORY_TATTOO
// Dove cade la goccia, in % della foto: centro dello zoom e della macchia
const focus = { x: (origin.x / width) * 100, y: (origin.y / height) * 100 }
const focusAt = `${focus.x.toFixed(1)}% ${focus.y.toFixed(1)}%`

useMotion(root, ({ gsap }) => {
  const stage = root.value!.querySelector<HTMLElement>('.stage')!
  const camera = stage.querySelector('.camera')
  const drop = stage.querySelector('.drop')
  const strokes = stage.querySelectorAll('.lines path')

  // Entrata dei bottoni, come la vecchia hero
  gsap.fromTo('.actions > *', { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'expo.out', delay: 0.6 })
  // A riposo la goccia galleggia (sul corpo interno: la posizione la decide lo scroll)
  gsap.to('.drop-body', { y: -14, rotate: 4, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
  gsap.from('.drop-body', { scale: 0, duration: 1.4, ease: 'elastic.out(1, 0.5)', delay: 0.5 })

  // Camera stretta sul pistillo: con l'origine lì, lo scale lo lascia al centro dello schermo
  gsap.set(camera, {
    transformOrigin: focusAt,
    xPercent: 50 - focus.x,
    yPercent: 50 - focus.y,
    scale: 1.8,
  })

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: stage,
      start: 'top top',
      end: '+=380%',
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  })

  // 1. la frase sale e se ne va, la goccia cade al centro allungandosi
  tl.to('.intro', { yPercent: -40, opacity: 0, duration: 1, ease: 'power2.in' }, 0)
    .to('.hint', { opacity: 0, duration: 0.3 }, 0)
    // stesso punto di partenza del CSS (translate), che da qui in poi passa a GSAP
    .fromTo(drop, {
      translate: 'none',
      x: () => Math.min(window.innerWidth * 0.26, 384),
      y: () => -window.innerHeight * 0.26,
    }, { x: 0, y: 0, duration: 1.2, ease: 'power2.in' }, 0)
    .to(drop, { scaleY: 1.35, scaleX: 0.8, duration: 1, ease: 'power2.in' }, 0.1)
    // 2. impatto: si schiaccia, poi si stringe fino a diventare la punta dell'ago
    .to(drop, { scaleY: 0.45, scaleX: 1.6, duration: 0.25, ease: 'power3.out' }, 1.2)
    .to(drop, { scale: 0.12, opacity: 0, duration: 0.45, ease: 'power2.in' }, 1.45)
    .to(strokes, { strokeDashoffset: 0, duration: 0.6, stagger: 3.6 / strokes.length }, 1.4)
    .fromTo('.beat-draw', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1.8)
    .to('.beat-draw', { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' }, 4.6)
    // 3. la foto si allarga come inchiostro dal pistillo, le linee si posano sul tatuaggio
    .fromTo('.photo', { clipPath: `circle(0% at ${focusAt})` }, { clipPath: `circle(120% at ${focusAt})`, duration: 1.8, ease: 'power2.inOut' }, 5)
    .to('.lines', { opacity: 0, duration: 1.2 }, 5.9)
    .fromTo('.beat-skin', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 5.4)
    .to('.beat-skin', { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' }, 7.4)
    // 4. la camera si allontana: tutta la spalla, con la didascalia
    .to(camera, { xPercent: 0, yPercent: 0, scale: 1, duration: 2, ease: 'power2.inOut' }, 7)
    .fromTo('.caption', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 8.4)
    // respiro finale prima che la sezione si sblocchi
    .to({}, { duration: 0.8 }, 9)
})
</script>

<template>
  <section
    ref="root"
    class="story"
    aria-labelledby="story-title"
    :style="{ '--ratio': width / height, '--focus': focusAt }"
  >
    <div class="stage">
      <div class="intro">
        <SiteContainer class="intro-inner">
          <h1 id="story-title"><RisingText :text="title" mode="load" /></h1>
          <p class="actions">
            <MagneticLink to="/contatti">Scrivimi</MagneticLink>
            <NuxtLink to="/tatuaggi" class="secondary">Guarda i lavori</NuxtLink>
          </p>
        </SiteContainer>
      </div>

      <figure class="piece">
        <div class="camera">
          <NuxtImg
            format="webp"
            :src="image"
            :alt="tattoo.alt"
            :width="width"
            :height="height"
            sizes="xs:100vw md:60vw lg:720px"
            loading="eager"
            class="photo"
          />
          <svg class="lines" :viewBox="`0 0 ${width} ${height}`" aria-hidden="true" focusable="false">
            <path v-for="(d, i) in paths" :key="i" :d="d" pathLength="1" />
          </svg>
        </div>
        <figcaption class="caption">{{ tattoo.stile }} · {{ tattoo.zona }}</figcaption>
      </figure>

      <svg class="drop" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="story-ink" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="var(--accent)" />
            <stop offset="1" stop-color="var(--highlight)" />
          </linearGradient>
        </defs>
        <g class="drop-body">
          <path d="M32 6 C 32 6 13 30 13 41 a 19 19 0 0 0 38 0 C 51 30 32 6 32 6 Z" fill="url(#story-ink)" />
          <ellipse cx="24" cy="41" rx="3.4" ry="6" fill="var(--text)" opacity="0.5" transform="rotate(-18 24 41)" />
        </g>
      </svg>

      <p class="beat beat-draw" aria-hidden="true">Prima il disegno, fatto per te.</p>
      <p class="beat beat-skin" aria-hidden="true">Poi la pelle.</p>
      <p class="hint" aria-hidden="true">Scorri</p>
    </div>
  </section>
</template>

<style scoped>
/*
 * Senza animazioni: frase in alto, foto sotto, in flusso.
 * Con html[data-motion]: tutto impilato in uno schermo, lo scroll fa il resto.
 */
.stage {
  position: relative;
  display: grid;
  gap: 2rem;
  padding-block: 1rem var(--space-section);
}

.intro-inner {
  display: grid;
  gap: 1.5rem;
}

h1 {
  max-width: 14ch;
  font-size: clamp(2.75rem, 1.5rem + 6vw, 7rem);
  line-height: 0.95;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem 1.75rem;
  font-weight: 700;
}

.secondary {
  transition: text-underline-offset 0.3s;
}

.secondary:hover {
  text-underline-offset: 0.4em;
}

.piece {
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  margin: 0;
}

.camera {
  position: relative;
  width: min(100% - 2 * var(--gutter), 74svh * var(--ratio));
  aspect-ratio: var(--ratio);
  background: var(--line);
}

.photo {
  position: absolute;
  inset: 0;
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
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  display: none;
}

.caption {
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.drop,
.beat,
.hint {
  display: none;
}

html[data-motion] .stage {
  height: 100svh;
  padding: 0;
  overflow: clip;
}

html[data-motion] .intro {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  align-content: center;
  pointer-events: none;
}

html[data-motion] .intro a {
  pointer-events: auto;
}

html[data-motion] .actions > * {
  opacity: 0;
}

html[data-motion] .piece {
  position: absolute;
  inset: 0;
  place-content: center;
}

/* in una griglia centrata il 100% non c'è: la larghezza si misura sullo schermo */
html[data-motion] .camera {
  width: min(100vw - 2 * var(--gutter), 74svh * var(--ratio));
  background: none;
}

html[data-motion] .photo {
  clip-path: circle(0% at var(--focus));
}

html[data-motion] .lines {
  display: block;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}

html[data-motion] .caption {
  opacity: 0;
}

html[data-motion] .drop {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 3;
  display: block;
  width: clamp(56px, 8vw, 104px);
  margin: calc(clamp(56px, 8vw, 104px) / -2);
  overflow: visible;
  /* l'impatto avviene sulla punta in basso, non al centro */
  transform-origin: 50% 90%;
  /* spostamento iniziale (fuori dal centro) messo da GSAP: prima del JS sta in alto a destra */
  translate: min(26vw, 24rem) -26svh;
}

html[data-motion] .beat {
  position: absolute;
  left: var(--gutter);
  bottom: clamp(1.5rem, 6svh, 4rem);
  z-index: 2;
  display: block;
  max-width: 18ch;
  color: var(--heading);
  font-size: var(--text-lg);
  font-weight: 700;
  line-height: 1.1;
  opacity: 0;
}

html[data-motion] .hint {
  position: absolute;
  /* lo schermo comincia sotto l'header: senza margine il filo finirebbe fuori */
  bottom: 5.5rem;
  left: 50%;
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  translate: -50% 0;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

/* filo d'inchiostro che scende, invita a scorrere */
.hint::after {
  content: '';
  width: 1px;
  height: 2.5rem;
  background: currentColor;
  transform-origin: top;
  animation: hint 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes hint {
  0% { transform: scaleY(0); }
  50% { transform: scaleY(1); transform-origin: top; }
  51% { transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

@media (min-width: 900px) {
  /* a sinistra: il tatuaggio si allarga verso destra (ali) */
  html[data-motion] .beat {
    left: max(var(--gutter), (100vw - var(--container)) / 2 + var(--gutter));
    bottom: 50%;
    translate: 0 50%;
  }
}
</style>
