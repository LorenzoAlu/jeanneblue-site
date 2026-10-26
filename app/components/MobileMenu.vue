<script setup lang="ts">
// Menu mobile a tutto schermo: l'inchiostro si allarga dal bottone e riempie lo
// schermo, poi le voci salgono una alla volta. Chiudendo, l'inchiostro si ritira.
// Senza GSAP (prefers-reduced-motion) apre e chiude secco.
const { contact } = useAppConfig()
const route = useRoute()

const open = ref(false)
const panel = ref<HTMLElement>()
const toggle = ref<HTMLButtonElement>()
let animating = false

// Centro del cerchio d'inchiostro: il bottone
function origin() {
  const rect = toggle.value!.getBoundingClientRect()
  return `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`
}

async function show() {
  open.value = true
  document.documentElement.style.overflow = 'hidden'
  await nextTick()
  const motion = await loadMotion()
  if (motion && panel.value) {
    animating = true
    const { gsap } = motion
    await gsap
      .timeline()
      .fromTo(panel.value, { clipPath: `circle(0% at ${origin()})` }, {
        clipPath: `circle(150% at ${origin()})`,
        duration: 0.9,
        ease: 'expo.inOut',
      })
      .from(panel.value.querySelectorAll('.link'), {
        yPercent: 110,
        rotate: 6,
        duration: 0.8,
        stagger: 0.06,
        ease: 'expo.out',
      }, 0.35)
      .from(panel.value.querySelectorAll('.brand, .extra > *'), {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
      }, 0.6)
    animating = false
  }
  panel.value?.querySelector<HTMLElement>('.link')?.focus()
}

async function hide({ restoreFocus = true } = {}) {
  const motion = await loadMotion()
  if (motion && panel.value) {
    animating = true
    const { gsap } = motion
    await gsap
      .timeline()
      .to(panel.value.querySelectorAll('.link, .brand, .extra > *'), {
        yPercent: -60,
        opacity: 0,
        duration: 0.35,
        stagger: 0.03,
        ease: 'power2.in',
      })
      .to(panel.value, { clipPath: `circle(0% at ${origin()})`, duration: 0.7, ease: 'expo.inOut' }, 0.15)
    gsap.set(panel.value.querySelectorAll('.link, .brand, .extra > *'), { clearProps: 'all' })
    animating = false
  }
  open.value = false
  document.documentElement.style.overflow = ''
  if (restoreFocus) toggle.value?.focus()
}

function onToggle() {
  if (animating) return
  if (open.value) hide()
  else show()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && open.value && !animating) hide()
}

// Cambio pagina: chiude senza rubare il focus alla nuova pagina
watch(() => route.path, () => {
  if (open.value) hide({ restoreFocus: false })
})

onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
})
</script>

<template>
  <div class="menu" @keydown="onKeydown">
    <button
      ref="toggle"
      type="button"
      :class="['toggle', { open }]"
      :aria-expanded="open"
      aria-controls="menu-mobile"
      @click="onToggle"
    >
      <span class="lines" aria-hidden="true"><span /><span /></span>
      {{ open ? 'Chiudi' : 'Menu' }}
    </button>

    <div v-show="open" id="menu-mobile" ref="panel" class="panel surface-wall">
      <NuxtLink to="/" class="brand" @click="route.path === '/' && hide()">Jeanne Blue</NuxtLink>
      <nav aria-label="Principale">
        <ul role="list" class="list">
          <li v-for="link in mainNav" :key="link.to" class="item">
            <NuxtLink :to="link.to" class="link" @click="link.to === route.path && hide()">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </nav>
      <div class="extra">
        <p class="kind">Scrivimi</p>
        <a :href="`https://ig.me/m/${contact.instagram}`" rel="noopener">DM su Instagram</a>
        <NuxtLink to="/contatti">WhatsApp e studio</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toggle {
  position: relative;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 44px;
  padding: 0 1rem;
  border: 1.5px solid currentColor;
  border-radius: 999px;
  background: none;
  color: var(--accent);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.4s;
}

.toggle.open {
  color: var(--foglio);
}

.lines {
  display: grid;
  gap: 5px;
  width: 16px;
}

.lines span {
  display: block;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
  transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
}

/* Le due linee diventano una X */
.open .lines span:first-child {
  transform: translateY(3.5px) rotate(45deg);
}

.open .lines span:last-child {
  transform: translateY(-3.5px) rotate(-45deg);
}

.panel {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  align-content: space-between;
  gap: 2rem;
  padding: 6.5rem var(--gutter) 2.5rem;
  overflow-y: auto;
}

.list {
  display: grid;
  gap: 0.25rem;
}

.item {
  /* le voci salgono da sotto questo bordo; il padding lascia spazio al focus */
  overflow: clip;
  padding: 4px 6px;
  margin: -4px -6px;
}

.brand {
  position: absolute;
  top: 0;
  left: var(--gutter);
  display: flex;
  align-items: center;
  min-height: 4.5rem;
  color: var(--foglio);
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: -0.03em;
  text-decoration: none;
}

.link {
  display: inline-block;
  color: var(--foglio);
  font-size: clamp(2.5rem, 11vw, 3.75rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  text-decoration: none;
}

.link.router-link-active {
  color: var(--velo);
  text-decoration: underline;
  text-decoration-thickness: 3px;
  text-underline-offset: 0.12em;
}

.extra {
  display: grid;
  gap: 0.35rem;
  justify-items: start;
}

.kind {
  color: var(--velo);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.extra a {
  color: var(--foglio);
  font-size: var(--text-lg);
}
</style>
