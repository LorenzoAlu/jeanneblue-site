<script setup lang="ts">
const { data } = await useAsyncData('home', async () => {
  const [home, about, tatuaggi, dipinti] = await Promise.all([
    queryCollection('pagine').path('/pagine/home').first(),
    queryCollection('pagine').path('/pagine/chi-sono').first(),
    queryCollection('tatuaggi').order('data', 'DESC').limit(7).all(),
    queryCollection('dipinti').order('anno', 'DESC').limit(2).all(),
  ])
  return { home, about, tatuaggi, dipinti }
})

const home = computed(() => data.value?.home)
const about = computed(() => data.value?.about)
// Il tatuaggio più recente fa da hero, i successivi vanno nella selezione
const hero = computed(() => data.value?.tatuaggi[0])
const selection = computed(() => data.value?.tatuaggi.slice(1) ?? [])

usePageSeo({
  title: home.value?.title ?? 'Tatuaggi e dipinti',
  description: home.value?.description ?? '',
  image: hero.value?.image,
})
useHead({ titleTemplate: 'Jeanne Blue · %s' })
</script>

<template>
  <div>
    <HomeHero v-if="home?.hero && hero" :title="home.hero" :image="hero" />
    <HomeAbout v-if="about" :page="about" />
    <InkMarquee :words="['Tatuaggi', 'Dipinti', 'Illustrativo', 'Floreale', 'Jeanne Blue']" />

    <section class="tattoos" aria-labelledby="home-tatuaggi">
      <SiteContainer>
        <SectionHeading id="home-tatuaggi" title="Tatuaggi" :link="{ to: '/tatuaggi', label: 'Tutti i tatuaggi' }">
          <RisingText text="Tatuaggi" />
        </SectionHeading>
        <TattooGrid :items="selection" />
      </SiteContainer>
    </section>

    <HomePaintings v-if="data?.dipinti.length" :items="data.dipinti" />

    <PageSection>
      <h2 class="contact-title">
        <RisingText text="Prenota un tatuaggio" />
      </h2>
      <BookingSteps />
      <div class="contact">
        <ContactLinks />
      </div>
    </PageSection>
  </div>
</template>

<style scoped>
.tattoos {
  /* poco spazio: la parte alta di InkFlood fa già da respiro */
  padding-bottom: clamp(0.5rem, 2vw, 2rem);
}

.contact-title {
  margin-bottom: 2rem;
  font-size: var(--text-xl);
}

.contact {
  margin-top: clamp(3rem, 2rem + 4vw, 5rem);
}
</style>
