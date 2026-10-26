<script setup lang="ts">
definePageMeta({
  wall: true,
  viewTransition: { toTypes: ['to-wall'], fromTypes: ['from-wall'] },
})

const { data: dipinti } = await useAsyncData('dipinti', () =>
  queryCollection('dipinti').order('anno', 'DESC').all(),
)

usePageSeo({
  title: 'Dipinti',
  description: 'Le opere su tela di Jeanne Blue: titolo, anno, tecnica, misure e disponibilità.',
  image: dipinti.value?.[0]?.image,
})
</script>

<template>
  <SiteContainer class="page">
    <PageIntro title="Dipinti" lead="La parte lenta del mio lavoro. Le tele disponibili si possono prendere: scrivimi e ti mando foto, prezzo e dettagli." />
    <PaintingList :items="dipinti ?? []" priority />
    <div class="ask">
      <h2>Ti interessa un'opera?</h2>
      <p>Scrivimi in DM o su WhatsApp: ti mando altre foto, il prezzo e come riceverla.</p>
      <NuxtLink to="/contatti">Contattami</NuxtLink>
    </div>
  </SiteContainer>
</template>

<style scoped>
.page {
  padding-bottom: var(--space-section);
}

.ask {
  display: grid;
  gap: 1rem;
  justify-items: start;
  max-width: 36rem;
  margin-top: var(--space-section);
  padding-top: 2rem;
  border-top: 1px solid var(--line);
}

.ask h2 {
  font-size: var(--text-xl);
}

.ask a {
  font-size: var(--text-lg);
  font-weight: 700;
}
</style>
