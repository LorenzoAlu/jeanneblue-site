import type { gsap as Gsap } from 'gsap'
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'

export interface Motion {
  gsap: typeof Gsap
  ScrollTrigger: typeof ScrollTriggerType
}

let loading: Promise<Motion | null> | undefined

// Senza animazioni (reduced motion, GSAP non caricato) il CSS non deve più
// nascondere niente: html[data-motion] va tolto, sennò il contenuto resta invisibile
function disableMotion() {
  delete document.documentElement.dataset.motion
  return null
}

// Carica GSAP + ScrollTrigger una volta sola, solo nel browser.
// Restituisce null con prefers-reduced-motion o se il caricamento fallisce.
export function loadMotion(): Promise<Motion | null> {
  if (import.meta.server) return Promise.resolve(null)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve(disableMotion())

  loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
    .then(([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)
      // Disinnesca la rete di sicurezza dello script in <head> (nuxt.config)
      ;(window as { __motion?: boolean }).__motion = true
      // Su mobile la barra degli indirizzi che compare/sparisce non deve ricalcolare tutto
      ScrollTrigger.config({ ignoreMobileResize: true })
      // I font arrivano dopo e cambiano le altezze: ricalcola le posizioni dei trigger
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
      return { gsap, ScrollTrigger }
    })
    .catch(() => {
      // Rete o chunk sparito dopo un deploy: si riprova al prossimo mount
      loading = undefined
      return disableMotion()
    })
  return loading
}

// Durante un cambio pagina il browser non è ancora tornato in cima: le misure
// (isInViewport, posizioni dei trigger) sarebbero quelle della pagina vecchia.
// Il plugin motion.client risolve questa promessa dopo page:finish.
let navigation: Promise<void> = Promise.resolve()
let endNavigation: (() => void) | undefined

export function startNavigation() {
  navigation = new Promise(resolve => (endNavigation = resolve))
}

export function finishNavigation() {
  endNavigation?.()
}

// Esegue setup al mount con GSAP pronto; tutto ciò che crea dentro gsap.context
// (tween, ScrollTrigger) viene annullato all'unmount. setup può restituire un cleanup extra.
export function useMotion(
  scope: Ref<HTMLElement | SVGElement | undefined>,
  setup: (motion: Motion) => void | (() => void),
) {
  let revert: (() => void) | undefined

  let unmounted = false

  onMounted(async () => {
    const [motion] = await Promise.all([loadMotion(), navigation])
    if (!motion || !scope.value || unmounted) return
    let extra: void | (() => void)
    const ctx = motion.gsap.context(() => {
      extra = setup(motion)
    }, scope.value)
    revert = () => {
      extra?.()
      ctx.revert()
    }
  })

  onBeforeUnmount(() => {
    unmounted = true
    revert?.()
  })
}

// Hover con mouse vero (non touch)
export function canHover() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

// Elementi già visibili al mount: non vanno nascosti per animarli (LCP, flash)
export function isInViewport(el: Element) {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

// Punto di partenza "quando il top dell'elemento arriva a fraction dello schermo",
// ma raggiungibile sempre:
// - già visibile al caricamento: è negativo, quindi il trigger scatta subito
// - in fondo alla pagina: mai oltre lo scroll massimo (clamp() non basta: con start
//   esattamente uguale allo scroll massimo onEnter non scatta)
export function reachableStart(ScrollTrigger: Motion['ScrollTrigger'], fraction = 0.85) {
  return (self: { trigger?: Element }) => Math.min(
    self.trigger!.getBoundingClientRect().top + window.scrollY - window.innerHeight * fraction,
    ScrollTrigger.maxScroll(window) - 2,
  )
}

// Timeline d'entrata: parte subito se l'elemento è già visibile al mount,
// altrimenti quando arriva nello schermo scorrendo.
export function entranceTimeline({ gsap, ScrollTrigger }: Motion, trigger: Element, delay = 0.3) {
  return gsap.timeline(
    isInViewport(trigger)
      ? { delay }
      : { scrollTrigger: { trigger, start: reachableStart(ScrollTrigger), once: true } },
  )
}
