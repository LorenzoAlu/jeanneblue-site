<template>
  <header class="header">
    <a class="skip" href="#contenuto">Vai al contenuto</a>
    <SiteContainer class="bar">
      <NuxtLink to="/" class="logo">Jeanne Blue</NuxtLink>
      <SiteNav class="desktop" />
      <MobileMenu class="mobile" />
    </SiteContainer>
  </header>
</template>

<style scoped>
.header {
  position: relative;
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
