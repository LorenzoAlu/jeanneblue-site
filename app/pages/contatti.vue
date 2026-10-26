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
  </SiteContainer>
</template>

<style scoped>
.page {
  padding-bottom: var(--space-section);
}
</style>
