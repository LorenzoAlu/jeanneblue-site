<script setup lang="ts">
// Menu desktop (il mobile è MobileMenu).
// - entrata: le voci scendono una alla volta al primo caricamento
// - hover: le lettere "rotolano" e lasciano il posto a una copia che sale da sotto,
//   e una macchia d'inchiostro chiaro scivola dietro la voce sotto il mouse;
//   uscendo dal menu torna sulla pagina attuale
const route = useRoute()

const list = ref<HTMLElement>()
const blob = ref({ x: 0, width: 0, visible: false })

// item: il <li> (posizionato rispetto a .nav, come la macchia)
function moveBlobTo(item: HTMLElement | null | undefined) {
  if (!item) {
    blob.value.visible = false
    return
  }
  blob.value = { x: item.offsetLeft, width: item.offsetWidth, visible: true }
}

const activeItem = () => list.value?.querySelector<HTMLElement>('.link.router-link-active')?.closest<HTMLElement>('.item')

function onEnter(event: Event) {
  moveBlobTo(event.currentTarget as HTMLElement)
}

function onLeave() {
  moveBlobTo(activeItem())
}

watch(() => route.path, () => nextTick(onLeave))

onMounted(() => {
  // Le larghezze cambiano quando arriva il font
  document.fonts?.ready.then(onLeave)
  onLeave()
})

useMotion(list, ({ gsap }) => {
  gsap.fromTo('.item', { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'expo.out', delay: 0.2 })
})
</script>

<template>
  <nav ref="list" aria-label="Principale" class="nav">
    <span
      class="blob"
      aria-hidden="true"
      :style="{ width: `${blob.width}px`, transform: `translateX(${blob.x}px)`, opacity: blob.visible ? 1 : 0 }"
    />
    <ul role="list" class="list" @pointerleave="onLeave" @focusout="onLeave">
      <li
        v-for="link in mainNav"
        :key="link.to"
        class="item"
        @pointerenter="onEnter"
        @focusin="onEnter"
      >
        <NuxtLink :to="link.to" class="link">
          <span class="visually-hidden">{{ link.label }}</span>
          <span class="roll" aria-hidden="true">
            <span v-for="(char, i) in [...link.label]" :key="i" class="char" :style="{ '--i': i }">
              <span class="face">{{ char === ' ' ? ' ' : char }}</span>
              <span class="face copy">{{ char === ' ' ? ' ' : char }}</span>
            </span>
          </span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav {
  position: relative;
}

.list {
  display: flex;
  gap: 0.25rem;
}

.item {
  position: relative;
}

html[data-motion] .item {
  opacity: 0;
}

/* Macchia d'inchiostro chiaro dietro la voce */
.blob {
  position: absolute;
  top: 50%;
  left: 0;
  height: 2.4em;
  margin-top: -1.2em;
  border-radius: 999px;
  background: var(--line);
  transition:
    transform 0.55s cubic-bezier(0.65, 0, 0.35, 1),
    width 0.55s cubic-bezier(0.65, 0, 0.35, 1),
    opacity 0.3s;
}

.link {
  display: block;
  padding: 0.35em 0.85em;
  text-decoration: none;
}

/* Tratto di penna sotto la pagina attuale */
.link::after {
  content: '';
  /* posizionato rispetto a .item */
  position: absolute;
  left: 0.85em;
  right: 0.85em;
  bottom: 0.15em;
  height: 2px;
  border-radius: 2px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.5s cubic-bezier(0.65, 0, 0.35, 1);
}

.link.router-link-active::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* Rotolamento: ogni lettera ha due facce impilate, all'hover salgono entrambe */
.roll {
  display: inline-flex;
}

.char {
  display: inline-flex;
  flex-direction: column;
  height: 1.6em;
  overflow: hidden;
  line-height: 1.6;
}

.face {
  display: block;
  transition: translate 0.45s cubic-bezier(0.65, 0, 0.35, 1);
  transition-delay: calc(var(--i) * 18ms);
}

.link:hover .face,
.link:focus-visible .face {
  translate: 0 -100%;
}

@media (prefers-reduced-motion: reduce) {
  .face {
    transition: none;
  }

  .link:hover .face,
  .link:focus-visible .face {
    translate: none;
  }
}
</style>
