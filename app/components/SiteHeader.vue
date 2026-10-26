<script setup lang="ts">
// Su desktop l'header resta in alto: sparisce scorrendo giù, torna scorrendo su.
// Su mobile no (il pannello del menu è position: fixed dentro l'header, e una
// trasformazione sull'header lo romperebbe).
const hidden = ref(false)
const scrolled = ref(false)

let last = 0
let ticking = false

function update() {
  const y = window.scrollY
  scrolled.value = y > 8
  hidden.value = window.matchMedia('(min-width: 900px)').matches && y > 160 && y > last
  last = y
  ticking = false
}

function onScroll() {
  if (!ticking) requestAnimationFrame(update)
  ticking = true
}

onMounted(() => {
  last = window.scrollY
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header :class="['header', { hidden, scrolled }]">
    <a class="skip" href="#contenuto">Vai al contenuto</a>
    <SiteContainer class="bar">
      <NuxtLink to="/" class="logo" aria-label="Jeanne Blue, home">
        <RisingText text="Jeanne Blue" mode="load" />
      </NuxtLink>
      <SiteNav class="desktop" />
      <MobileMenu class="mobile" />
    </SiteContainer>
  </header>
</template>

<style scoped>
.header {
  position: relative;
  z-index: 40;
  background: var(--bg);
}

@media (min-width: 900px) {
  .header {
    position: sticky;
    top: 0;
    transition:
      translate 0.6s cubic-bezier(0.65, 0, 0.35, 1),
      box-shadow 0.4s;
  }

  .header.scrolled {
    box-shadow: 0 1px 0 var(--line);
  }

  .header.hidden {
    translate: 0 -100%;
  }

  /* Da tastiera il focus può rientrare nell'header nascosto: deve vedersi */
  .header:focus-within {
    translate: none;
  }
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  min-height: 4.5rem;
}

.logo {
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: -0.03em;
  text-decoration: none;
}

.skip {
  position: absolute;
  left: var(--gutter);
  top: 0;
  translate: 0 -200%;
  z-index: 10;
  padding: 0.5rem 1rem;
  background: var(--accent);
  color: var(--bg);
}

.skip:focus {
  translate: 0 0.5rem;
}

.desktop {
  display: none;
}

@media (min-width: 900px) {
  .desktop {
    display: block;
  }

  .mobile {
    display: none;
  }
}
</style>
