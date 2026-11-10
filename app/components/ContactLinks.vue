<script setup lang="ts">
const { contact } = useAppConfig()

const whatsappUrl = contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : null
const instagramDm = `https://ig.me/m/${contact.instagram}`

// load: in cima alla pagina (Contatti). Entrata da foglio a righe, tutta CSS: sopra
// ogni voce si traccia una riga e il testo ne emerge, come i titoli (RisingText).
// Sono l'LCP della pagina e non devono aspettare il JS.
const props = defineProps<{ load?: boolean }>()

const list = ref<HTMLElement>()

// Poi sotto ogni link passa un colpo d'evidenziatore che si ritira (lo stesso che
// resta all'hover). Senza load anche le voci entrano qui, quando arrivano in vista.
useMotion(list, (motion) => {
  // Durante l'entrata --mark lo muove GSAP: la transizione CSS lo rallenterebbe
  const el = list.value!
  el.classList.add('entering')
  const timeline = props.load ? motion.gsap.timeline({ delay: 1.3 }) : entranceTimeline(motion, el)
  timeline.eventCallback('onComplete', () => el.classList.remove('entering'))
  if (!props.load) {
    timeline.fromTo('.item', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'expo.out' })
  }
  timeline
    .fromTo('.link', { '--mark': 0 }, { '--mark': 1, duration: 0.5, stagger: 0.12, ease: 'power3.in' }, props.load ? 0 : 0.4)
    .to('.link', { '--mark': 0, duration: 0.6, stagger: 0.12, ease: 'power3.out', clearProps: '--mark' }, '>')
})
</script>

<template>
  <ul ref="list" role="list" :class="['links', { load }]">
    <li class="item" style="--i: 0">
      <div class="body">
        <span class="kind">WhatsApp</span>
        <a v-if="whatsappUrl" :href="whatsappUrl" rel="noopener" class="link">Scrivimi su WhatsApp</a>
        <span v-else>[[DA CHIEDERE: numero WhatsApp]]</span>
      </div>
    </li>
    <li class="item" style="--i: 1">
      <div class="body">
        <span class="kind">Instagram</span>
        <a :href="instagramDm" rel="noopener" class="link">Mandami un DM a @{{ contact.instagram }}</a>
      </div>
    </li>
    <li class="item" style="--i: 2">
      <div class="body">
        <span class="kind">Studio</span>
        <address>
          {{ contact.studio.name }}<br>
          {{ contact.studio.street }}, {{ contact.studio.postalCode }} {{ contact.studio.city }}
        </address>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.links {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 900px) {
  .links {
    grid-template-columns: repeat(3, 1fr);
  }
}

html[data-motion] .links:not(.load) .item {
  opacity: 0;
}

/* Foglio a righe: una riga sottile sopra ogni voce */
.load .item {
  position: relative;
  padding-top: 0.9rem;
}

.load .item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--line);
  transform-origin: left;
}

/*
 * Entrata: la riga si traccia da sinistra, poi sotto la riga un telo color carta
 * si ritira verso il basso e scopre il testo, che intanto si assesta.
 * Il testo è dipinto da subito sotto il telo: per l'LCP conta già (come le foto
 * della griglia tatuaggi), mentre nasconderlo con un ritaglio lo ritarderebbe.
 */
html[data-motion] .load .item::before {
  animation: rule 0.7s cubic-bezier(0.65, 0, 0.35, 1) calc(0.15s + var(--i) * 0.12s) both;
}

html[data-motion] .load .item::after {
  content: '';
  position: absolute;
  /* in basso sborda quanto il testo è spostato (settle), sennò ne spunta un filo */
  inset: calc(0.9rem - 1px) -0.25rem -1rem;
  background: var(--bg);
  transform-origin: bottom;
  pointer-events: none;
  animation: uncover 0.9s cubic-bezier(0.65, 0, 0.35, 1) calc(0.5s + var(--i) * 0.12s) both;
}

html[data-motion] .load .body {
  animation: settle 1.3s cubic-bezier(0.16, 1, 0.3, 1) calc(0.5s + var(--i) * 0.12s) both;
}

@keyframes rule {
  from {
    transform: scaleX(0);
  }
}

@keyframes uncover {
  to {
    transform: scaleY(0);
  }
}

@keyframes settle {
  from {
    transform: translateY(0.75rem);
  }
}

.kind {
  display: block;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

/* Evidenziatore: --mark da 0 a 1 riempie la metà bassa del testo */
.link {
  --mark: 0;
  font-size: var(--text-lg);
  font-weight: 700;
  line-height: 1.2;
  background-image: linear-gradient(var(--line), var(--line));
  background-repeat: no-repeat;
  background-position: 0 88%;
  background-size: calc(var(--mark) * 100%) 0.45em;
  transition: background-size 0.5s cubic-bezier(0.65, 0, 0.35, 1);
}

.entering .link {
  transition: none;
}

.link:hover,
.link:focus-visible {
  background-size: 100% 0.45em;
}

address {
  font-style: normal;
}
</style>
