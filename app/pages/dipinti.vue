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
    <PageIntro title="Dipinti" lead="[[DA CHIEDERE: una frase sua sui dipinti]]" />
    <PaintingList :items="dipinti ?? []" priority />
  </SiteContainer>
</template>

<style scoped>
.page {
  padding-bottom: var(--space-section);
}
</style>
