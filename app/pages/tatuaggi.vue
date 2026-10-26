<script setup lang="ts">
const { data: tatuaggi } = await useAsyncData('tatuaggi', () =>
  queryCollection('tatuaggi').order('data', 'DESC').all(),
)

const stili = computed(() => [...new Set(tatuaggi.value?.map(t => t.stile))].sort())
const stile = ref<string | null>(null)
const visibili = computed(() =>
  stile.value ? tatuaggi.value?.filter(t => t.stile === stile.value) ?? [] : tatuaggi.value ?? [],
)

usePageSeo({
  title: 'Tatuaggi',
  description: 'Portfolio dei tatuaggi di Jeanne Blue.',
  image: tatuaggi.value?.[0]?.image,
})
</script>

<template>
  <SiteContainer class="page">
    <PageIntro title="Tatuaggi">
      <TattooFilter v-if="stili.length > 1" v-model="stile" :options="stili" />
    </PageIntro>
    <p class="visually-hidden" aria-live="polite">{{ visibili.length }} tatuaggi</p>
    <TattooGrid :items="visibili" priority />
  </SiteContainer>
</template>

<style scoped>
.page {
  padding-bottom: var(--space-section);
}
</style>
