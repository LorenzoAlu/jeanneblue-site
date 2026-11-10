<script setup lang="ts">
import { STORY_TATTOO } from '~/utils/storyTattoo'

const { data } = await useAsyncData('home', async () => {
  const [home, about, tatuaggi, dipinti, story] = await Promise.all([
    queryCollection('pagine').path('/pagine/home').first(),
    queryCollection('pagine').path('/pagine/chi-sono').first(),
    queryCollection('tatuaggi').order('data', 'DESC').limit(8).all(),
    queryCollection('dipinti').order('anno', 'DESC').limit(6).all(),
    // Il tatuaggio ricalcato in HomeStory: se sparisce dal pannello, torna la hero classica
    queryCollection('tatuaggi').where('image', '=', STORY_TATTOO.entry).first(),
  ])
  return { home, about, tatuaggi, dipinti, story }
})

const home = computed(() => data.value?.home)
const about = computed(() => data.value?.about)
const story = computed(() => data.value?.story)
const tatuaggi = computed(() => data.value?.tatuaggi.filter(item => item.id !== story.value?.id) ?? [])
// Senza il tatuaggio della storia il più recente fa da hero; la selezione sono i 6 successivi
const hero = computed(() => (story.value ? undefined : tatuaggi.value[0]))
const selection = computed(() => tatuaggi.value.slice(story.value ? 0 : 1, story.value ? 6 : 7))

usePageSeo({
  title: home.value?.title ?? 'Tatuaggi e dipinti',
  description: home.value?.description ?? '',
  image: story.value ? STORY_TATTOO.image : hero.value?.image,
})
useHead({ titleTemplate: 'Jeanne Blue · %s' })
</script>

<template>
  <div>
    <HomeStory v-if="home?.hero && story" :title="home.hero" :tattoo="story" />
    <HomeHero v-else-if="home?.hero && hero" :title="home.hero" :image="hero" />
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

    <HomeSketches />

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
