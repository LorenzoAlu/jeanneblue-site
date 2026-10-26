<script setup lang="ts">
// Footer: la linea in alto si disegna, le colonne salgono a cascata, e in fondo
// la firma "Jeanne Blue" gigante emerge lettera per lettera mentre arrivi in fondo.
const { site, contact } = useAppConfig()

const root = ref<HTMLElement>()

useMotion(root, (motion) => {
  entranceTimeline(motion, root.value!)
    .fromTo(root.value!, { '--rule': 0 }, { '--rule': 1, duration: 1, ease: 'power3.inOut' })
    .fromTo('.column', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'expo.out' }, 0.2)
})

function toTop() {
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })
  // Il focus torna in cima, per chi naviga da tastiera
  document.querySelector<HTMLElement>('header .logo')?.focus({ preventScroll: true })
}
</script>

<template>
  <footer ref="root" class="footer">
    <SiteContainer class="inner">
      <div class="column">
        <p class="name">{{ site.name }}</p>
        <p>
          <a :href="`https://www.instagram.com/${contact.instagram}/`" rel="noopener">@{{ contact.instagram }}</a>
        </p>
        <address>
          {{ contact.studio.name }}<br>
          {{ contact.studio.street }}, {{ contact.studio.postalCode }} {{ contact.studio.city }}
        </address>
      </div>
      <div class="column legal">
        <p>P.IVA {{ contact.vat }}</p>
        <p>
          <NuxtLink to="/privacy">Privacy</NuxtLink>
          ·
          <NuxtLink to="/cookie">Cookie</NuxtLink>
        </p>
      </div>
      <div class="column">
        <button type="button" class="top" @click="toTop">
          <span class="text">Torna su</span>
        </button>
      </div>
    </SiteContainer>
    <SiteContainer>
      <p class="signature" aria-hidden="true">
        <!-- ultima cosa della pagina: su pagine corte è già visibile, quindi "enter" e non scrub -->
        <RisingText :text="site.name" mode="enter" />
      </p>
    </SiteContainer>
  </footer>
</template>

<style scoped>
.footer {
  --rule: 1;
  padding-top: 3rem;
  overflow: hidden;
  color: var(--muted);
  font-size: var(--text-sm);
}

/* Linea in alto, disegnata da sinistra (--rule da 0 a 1) */
.footer::before {
  content: '';
  display: block;
  height: 1px;
  margin-top: -3rem;
  margin-bottom: 3rem;
  background: var(--line);
  transform: scaleX(var(--rule));
  transform-origin: left;
}

.inner {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem 3rem;
}

html[data-motion] .column {
  opacity: 0;
}

.name {
  color: var(--accent);
  font-weight: 700;
}

address {
  font-style: normal;
}

.legal a {
  color: inherit;
}

/* "Torna su": pillola che si riempie d'inchiostro dal basso */
.top {
  position: relative;
  overflow: hidden;
  min-height: 44px;
  padding: 0 1.25rem;
  border: 1.5px solid var(--accent);
  border-radius: 999px;
  background: none;
  color: var(--accent);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  isolation: isolate;
  transition: color 0.4s;
}

.top::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: 50% 50% 0 0;
  background: var(--accent);
  transform: translateY(101%);
  transition:
    transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    border-radius 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.top:hover,
.top:focus-visible {
  color: var(--bg);
}

.top:hover::before,
.top:focus-visible::before {
  border-radius: 0;
  transform: translateY(0);
}

.top .text {
  display: inline-block;
  transition: translate 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.top:hover .text {
  translate: 0 -2px;
}

/* Firma gigante: larga quanto il contenitore, tagliata un filo in basso */
.signature {
  margin-top: clamp(2rem, 1rem + 4vw, 4rem);
  /* taglio leggero sul fondo pagina, come una firma che esce dal foglio */
  margin-bottom: -0.06em;
  color: var(--accent);
  font-size: min(16.5vw, 12.5rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.05em;
  white-space: nowrap;
}
</style>
