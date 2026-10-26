<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)

useSeoMeta({ title: notFound.value ? 'Pagina non trovata' : 'Errore', robots: 'noindex' })
</script>

<template>
  <NuxtLayout>
    <SiteContainer class="page">
      <PageIntro
        :title="notFound ? 'Qui non c\'è niente' : 'Qualcosa è andato storto'"
        :lead="notFound ? 'La pagina che cercavi non esiste o è stata spostata.' : 'Riprova tra poco.'"
      >
        <p><NuxtLink to="/" @click="clearError()">Torna alla home</NuxtLink></p>
      </PageIntro>
    </SiteContainer>
  </NuxtLayout>
</template>

<style scoped>
.page {
  padding-bottom: var(--space-section);
}
</style>
