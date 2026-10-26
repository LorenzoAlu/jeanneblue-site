<script setup lang="ts">
usePageSeo({
  title: 'Contatti',
  description: 'Prenota un tatuaggio o chiedi di un dipinto: WhatsApp, Instagram, studio.',
})
</script>

<template>
  <SiteContainer class="page">
    <PageIntro
      title="Contatti"
      lead="Per prenotare scrivimi su WhatsApp o in DM: raccontami l'idea, la zona e la misura, e se hai riferimenti mandameli."
    />
    <ContactLinks />
    <h2 class="steps-title">Come funziona</h2>
    <BookingSteps />
    <p class="faq">Altre domande? <NuxtLink to="/faq">Leggi le risposte più frequenti</NuxtLink>.</p>
  </SiteContainer>
</template>

<style scoped>
.page {
  padding-bottom: var(--space-section);
}

.steps-title {
  margin: clamp(3rem, 2rem + 4vw, 5rem) 0 1.5rem;
}

.faq {
  margin-top: 2.5rem;
}
</style>
