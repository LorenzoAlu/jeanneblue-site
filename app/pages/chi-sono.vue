<script setup lang="ts">
const { data: page } = await useAsyncData('chi-sono', () =>
  queryCollection('pagine').path('/pagine/chi-sono').first(),
)
if (!page.value) throw createError({ statusCode: 404, fatal: true })

usePageSeo({ title: page.value.title, description: page.value.description, image: page.value.image })
</script>

<template>
  <SiteContainer v-if="page" class="page">
    <PageIntro :title="page.title" />
    <div class="layout">
      <NuxtImg
        v-if="page.image"
        :src="page.image"
        :alt="page.imageAlt ?? ''"
        width="800"
        height="1000"
        fit="cover"
        sizes="xs:100vw md:40vw lg:480px"
        class="portrait"
      />
      <ProseContent :value="page" />
    </div>
  </SiteContainer>
</template>

<style scoped>
.page {
  padding-bottom: var(--space-section);
}

.layout {
  display: grid;
  gap: 2rem;
}

@media (min-width: 900px) {
  .layout {
    grid-template-columns: 5fr 7fr;
    align-items: start;
    gap: 4rem;
  }
}

.portrait {
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}
</style>
