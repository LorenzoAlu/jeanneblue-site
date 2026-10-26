<script setup lang="ts">
// Frase grande che si "inchiostra" parola per parola mentre scorri.
// Senza animazioni è testo pieno normale.
const props = withDefaults(defineProps<{ text: string, size?: 'lg' | 'xl' }>(), { size: 'xl' })

const words = computed(() => props.text.split(' '))
const root = ref<HTMLElement>()

useMotion(root, ({ gsap }) => {
  // Da grafite a inchiostro, non da trasparente: anche a metà il testo resta leggibile (AA)
  const style = getComputedStyle(root.value!)
  gsap.fromTo(root.value!.querySelectorAll('.word'), { color: style.getPropertyValue('--muted') }, {
    color: style.getPropertyValue('--accent'),
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: { trigger: root.value, start: 'top 80%', end: 'clamp(bottom 45%)', scrub: true },
  })
})
</script>

<template>
  <p ref="root" :class="['highlight', size]">
    <span class="visually-hidden">{{ text }}</span>
    <span aria-hidden="true">
      <template v-for="(word, i) in words" :key="i">
        <span class="word">{{ word }}</span>{{ i < words.length - 1 ? ' ' : '' }}
      </template>
    </span>
  </p>
</template>

<style scoped>
.highlight {
  max-width: 22ch;
  color: var(--accent);
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.lg {
  max-width: none;
  font-size: var(--text-lg);
  line-height: 1.35;
  letter-spacing: 0;
}
</style>
