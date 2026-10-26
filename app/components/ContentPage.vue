<script setup lang="ts">
// Pagina di solo testo da content/pagine/<slug>.md (cura, privacy, cookie).
const props = defineProps<{ slug: string }>()

const { data: page } = await useAsyncData(`pagina-${props.slug}`, () =>
  queryCollection('pagine').path(`/pagine/${props.slug}`).first(),
)
if (!page.value) throw createError({ statusCode: 404, fatal: true })

usePageSeo({ title: page.value.title, description: page.value.description })
</script>

<template>
  <SiteContainer v-if="page" class="page">
    <PageIntro :title="page.title" />
    <ProseContent :value="page" />
  </SiteContainer>
</template>

<style scoped>
.page {
  padding-bottom: var(--space-section);
}
</style>
