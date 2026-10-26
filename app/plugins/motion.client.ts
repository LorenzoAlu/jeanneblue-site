// Cambi pagina e animazioni:
// - finché la nuova pagina non è a posto (scroll in cima, altezze vere) i setup di
//   useMotion aspettano: vedi startNavigation/finishNavigation in useMotion
// - il layout (header, footer) resta montato e i suoi ScrollTrigger hanno posizioni
//   calcolate sulla pagina precedente: vanno ricalcolate, sennò il footer non entra mai
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:start', () => startNavigation())
  nuxtApp.hook('page:finish', () => {
    // Nuxt torna in cima dopo page:finish: aspetto il frame successivo
    requestAnimationFrame(async () => {
      finishNavigation()
      const motion = await loadMotion()
      motion?.ScrollTrigger.refresh()
    })
  })
})
