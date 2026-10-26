<script setup lang="ts">
const { data: page } = await useAsyncData('cura', () =>
  queryCollection('pagine').path('/pagine/cura').first(),
)
if (!page.value) throw createError({ statusCode: 404, fatal: true })

usePageSeo({ title: page.value.title, description: page.value.description })
</script>

<template>
  <SiteContainer v-if="page" class="page">
    <PageIntro :title="page.title" />
    <ProseMotion :value="page" timeline />
    <p class="ask">
      Hai un dubbio sul tuo tatuaggio? <NuxtLink to="/contatti">Scrivimi</NuxtLink>, meglio una domanda in più.
    </p>
  </SiteContainer>
</template>

<style scoped>
.page {
  padding-bottom: var(--space-section);
}

.ask {
  max-width: 40rem;
  margin-top: clamp(3rem, 2rem + 3vw, 5rem);
  font-size: var(--text-lg);
}
</style>
