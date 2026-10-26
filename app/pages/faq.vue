<script setup lang="ts">
const { data: domande } = await useAsyncData('faq', () =>
  queryCollection('faq').order('ordine', 'ASC').all(),
)

const list = ref<HTMLElement>()

// Le domande entrano a cascata; la linea sopra l'elenco si disegna per prima
useMotion(list, (motion) => {
  entranceTimeline(motion, list.value!, 0.4)
    .fromTo(list.value!, { '--rule': 0 }, { '--rule': 1, duration: 0.8, ease: 'power3.inOut' })
    .fromTo('.item', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'expo.out' }, 0.2)
})

usePageSeo({
  title: 'Domande frequenti',
  description: 'Prenotazioni, prezzi e tutto quello che mi chiedete più spesso.',
})
</script>

<template>
  <SiteContainer class="page">
    <PageIntro title="Domande frequenti" />
    <div ref="list" class="list">
      <FaqItem v-for="d in domande" :key="d.id" :item="d" class="item" />
    </div>
    <p class="more">
      Non trovi la risposta? <NuxtLink to="/contatti">Scrivimi</NuxtLink>.
    </p>
  </SiteContainer>
</template>

<style scoped>
.page {
  padding-bottom: var(--space-section);
}

.list {
  --rule: 1;
  position: relative;
  max-width: 48rem;
}

/* linea sopra l'elenco, disegnata da sinistra (--rule da 0 a 1) */
.list::before {
  content: '';
  display: block;
  height: 1px;
  background: var(--line);
  transform: scaleX(var(--rule));
  transform-origin: left;
}

/* nascoste da subito solo se l'animazione partirà (data-motion) */
html[data-motion] .item {
  opacity: 0;
}

.more {
  margin-top: 2.5rem;
}
</style>
