<script setup lang="ts">
// Filtro per stile: una pillola d'inchiostro scivola sotto l'opzione attiva.
const props = defineProps<{ options: string[] }>()
const model = defineModel<string | null>({ required: true })

const root = ref<HTMLElement>()
const pill = ref({ x: 0, y: 0, width: 0, height: 0, ready: false })

const all = computed(() => [null, ...props.options])

function place() {
  const active = root.value?.querySelector<HTMLElement>('[aria-pressed="true"]')
  if (!active) return
  pill.value = {
    x: active.offsetLeft,
    y: active.offsetTop,
    width: active.offsetWidth,
    height: active.offsetHeight,
    ready: true,
  }
}

watch(model, () => nextTick(place))

onMounted(() => {
  place()
  // Il font caricato dopo cambia le larghezze: ricalcola
  document.fonts?.ready.then(place)
  window.addEventListener('resize', place)
})

onBeforeUnmount(() => window.removeEventListener('resize', place))
</script>

<template>
  <div ref="root" :class="['filter', { 'has-pill': pill.ready }]" role="group" aria-label="Filtra per stile">
    <span
      v-if="pill.ready"
      class="pill"
      aria-hidden="true"
      :style="{
        width: `${pill.width}px`,
        height: `${pill.height}px`,
        transform: `translate(${pill.x}px, ${pill.y}px)`,
      }"
    />
    <button
      v-for="option in all"
      :key="option ?? 'tutti'"
      type="button"
      class="option"
      :aria-pressed="model === option"
      @click="model = option"
    >
      {{ option ?? 'Tutti' }}
    </button>
  </div>
</template>

<style scoped>
.filter {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pill {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 999px;
  background: var(--accent);
  transition:
    transform 0.6s cubic-bezier(0.65, 0, 0.35, 1),
    width 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}

.option {
  position: relative;
  min-height: 44px;
  padding: 0 1rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: none;
  color: var(--muted);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  cursor: pointer;
  transition:
    color 0.4s,
    border-color 0.4s;
}

.option:not([aria-pressed='true']):hover {
  border-color: var(--accent);
  color: var(--accent);
}

.option[aria-pressed='true'] {
  border-color: transparent;
  color: var(--bg);
}

/* Prima che la pillola sia misurata (o senza JS) il fondo sta sul bottone */
.filter:not(.has-pill) .option[aria-pressed='true'] {
  background: var(--accent);
}
</style>
