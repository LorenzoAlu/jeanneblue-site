<script setup lang="ts">
const { contact } = useAppConfig()

const whatsappUrl = contact.whatsapp ? `https://wa.me/${contact.whatsapp}` : null
const instagramDm = `https://ig.me/m/${contact.instagram}`

const list = ref<HTMLElement>()

// Entrata: le voci salgono a cascata, poi sotto ogni link passa un colpo
// d'evidenziatore che si ritira (lo stesso che resta all'hover)
useMotion(list, (motion) => {
  entranceTimeline(motion, list.value!)
    .fromTo('.item', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'expo.out' })
    .fromTo('.link', { '--mark': 0 }, { '--mark': 1, duration: 0.5, stagger: 0.12, ease: 'power3.in' }, 0.4)
    .to('.link', { '--mark': 0, duration: 0.6, stagger: 0.12, ease: 'power3.out', clearProps: '--mark' }, '>')
})
</script>

<template>
  <ul ref="list" role="list" class="links">
    <li class="item">
      <span class="kind">WhatsApp</span>
      <a v-if="whatsappUrl" :href="whatsappUrl" rel="noopener" class="link">Scrivimi su WhatsApp</a>
      <span v-else>[[DA CHIEDERE: numero WhatsApp]]</span>
    </li>
    <li class="item">
      <span class="kind">Instagram</span>
      <a :href="instagramDm" rel="noopener" class="link">Mandami un DM a @{{ contact.instagram }}</a>
    </li>
    <li class="item">
      <span class="kind">Studio</span>
      <address>
        {{ contact.studio.name }}<br>
        {{ contact.studio.street }}, {{ contact.studio.postalCode }} {{ contact.studio.city }}
      </address>
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

html[data-motion] .item {
  opacity: 0;
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

.link:hover,
.link:focus-visible {
  background-size: 100% 0.45em;
}

address {
  font-style: normal;
}
</style>
