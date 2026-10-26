import type { gsap as Gsap } from 'gsap'
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'

export interface Motion {
  gsap: typeof Gsap
  ScrollTrigger: typeof ScrollTriggerType
}

let loading: Promise<Motion> | undefined

// Carica GSAP + ScrollTrigger una volta sola, solo nel browser.
// Restituisce null con prefers-reduced-motion: in quel caso niente animazioni.
export function loadMotion(): Promise<Motion | null> {
  if (import.meta.server) return Promise.resolve(null)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve(null)

  loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
    ([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)
      return { gsap, ScrollTrigger }
    },
  )
  return loading
}

// Esegue setup al mount con GSAP pronto; tutto ciò che crea dentro gsap.context
// (tween, ScrollTrigger) viene annullato all'unmount. setup può restituire un cleanup extra.
export function useMotion(
  scope: Ref<HTMLElement | SVGElement | undefined>,
  setup: (motion: Motion) => void | (() => void),
) {
  let revert: (() => void) | undefined

  onMounted(async () => {
    const motion = await loadMotion()
    if (!motion || !scope.value) return
    let extra: void | (() => void)
    const ctx = motion.gsap.context(() => {
      extra = setup(motion)
    }, scope.value)
    revert = () => {
      extra?.()
      ctx.revert()
    }
  })

  onBeforeUnmount(() => revert?.())
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
