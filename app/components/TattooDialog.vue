<script setup lang="ts">
import type { TatuaggiCollectionItem } from '@nuxt/content'
import { joinURL } from 'ufo'

const props = defineProps<{ item: TatuaggiCollectionItem | null }>()
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLDialogElement>()
const { baseURL } = useRuntimeConfig().app

watch(
  () => props.item,
  async (item) => {
    if (!item) return dialog.value?.close()
    dialog.value?.showModal()
    // L'immagine si apre come una goccia che si allarga
    const motion = await loadMotion()
    if (!motion || !dialog.value) return
    const { gsap } = motion
    gsap.fromTo(dialog.value, { clipPath: 'circle(0% at 50% 50%)' }, {
      clipPath: 'circle(75% at 50% 50%)',
      duration: 0.9,
      ease: 'expo.out',
      clearProps: 'clipPath',
    })
    gsap.from(dialog.value.querySelectorAll('.meta > *'), {
      y: 16, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out', delay: 0.25,
    })
  },
)

const date = computed(() =>
  props.item
    ? new Date(props.item.data).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
    : '',
)

// Click sullo sfondo (fuori dal contenuto) chiude
function onClick(event: MouseEvent) {
  if (event.target === dialog.value) dialog.value?.close()
}
</script>

<template>
  <dialog ref="dialog" class="dialog" aria-labelledby="tattoo-dialog-title" @close="emit('close')" @click="onClick">
    <div v-if="item" class="content">
      <!-- File originale, non ipx: il dialog non esiste al prerender, quindi le varianti
           ridimensionate non verrebbero generate. Le foto in public/img vanno già esportate
           a ~1600px. -->
      <img :src="joinURL(baseURL, item.image)" :alt="item.alt" width="800" height="1000" class="image">
      <div class="meta">
        <p id="tattoo-dialog-title" class="title">{{ item.stile }} · {{ item.zona }}</p>
        <p class="date">{{ date }}</p>
        <button type="button" class="close" @click="dialog?.close()">Chiudi</button>
      </div>
    </div>
  </dialog>
</template>

<style scoped>
.dialog {
  width: min(100% - 2rem, 960px);
  max-height: calc(100dvh - 2rem);
  padding: 0;
  border: 0;
  background: var(--bg);
  color: var(--text);
}

.dialog::backdrop {
  background: rgb(14 26 51 / 0.85);
}

.content {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

@media (min-width: 900px) {
  .content {
    grid-template-columns: 3fr 1fr;
    align-items: end;
    padding: 1.5rem;
  }
}

.image {
  width: 100%;
  max-height: calc(100dvh - 10rem);
  object-fit: contain;
}

.meta {
  display: grid;
  gap: 0.25rem;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

.title {
  color: var(--accent);
  font-weight: 700;
}

.date {
  color: var(--muted);
}

.close {
  justify-self: start;
  min-height: 44px;
  margin-top: 0.5rem;
  padding: 0;
  border: 0;
  background: none;
  color: var(--accent);
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}
</style>
