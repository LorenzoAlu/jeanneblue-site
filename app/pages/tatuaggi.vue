<script setup lang="ts">
const { data: tatuaggi } = await useAsyncData('tatuaggi', () =>
  queryCollection('tatuaggi').order('data', 'DESC').all(),
)

const { contact } = useAppConfig()
const stili = computed(() => [...new Set(tatuaggi.value?.map(t => t.stile))].sort())
const stile = ref<string | null>(null)
const visibili = computed(() =>
  stile.value ? tatuaggi.value?.filter(t => t.stile === stile.value).length ?? 0 : tatuaggi.value?.length ?? 0,
)

usePageSeo({
  title: 'Tatuaggi',
  description: 'Portfolio dei tatuaggi di Jeanne Blue.',
  image: tatuaggi.value?.[0]?.image,
})
</script>

<template>
  <SiteContainer class="page">
    <PageIntro
      title="Tatuaggi"
      lead="Una selezione dei lavori degli ultimi mesi. Ogni disegno è nato per la persona che lo porta."
    >
      <TattooFilter v-if="stili.length > 1" v-model="stile" :options="stili" />
    </PageIntro>
    <p class="visually-hidden" aria-live="polite">{{ visibili }} tatuaggi</p>
    <TattooGrid :items="tatuaggi ?? []" :filter="stile" priority />
    <p class="more">
      Gli altri lavori sono su
      <a :href="`https://www.instagram.com/${contact.instagram}/`" rel="noopener">Instagram</a>.
      Ti piace qualcosa? <NuxtLink to="/contatti">Scrivimi</NuxtLink>.
    </p>
  </SiteContainer>
</template>

<style scoped>
.page {
  padding-bottom: var(--space-section);
}

.more {
  margin-top: clamp(2.5rem, 2rem + 2vw, 4rem);
  font-size: var(--text-lg);
}
</style>
