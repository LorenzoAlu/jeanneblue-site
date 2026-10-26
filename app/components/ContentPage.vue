<script setup lang="ts">
const props = defineProps<{ slug: string }>()

const { data: page } = await useAsyncData(`pagina-${props.slug}`, () =>
  queryCollection('pagine').path(`/pagine/${props.slug}`).first(),
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Pagina non trovata', fatal: true })
}

useSeoMeta({ title: page.value.title, description: page.value.description })
</script>

<template>
  <SiteContainer>
    <h1>{{ page?.title }}</h1>
    <ContentRenderer v-if="page" :value="page" />
  </SiteContainer>
</template>
