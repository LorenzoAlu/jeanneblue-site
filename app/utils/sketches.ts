// Disegni e opere di Jeanne per la sezione "tavolo" della home (HomeSketches).
// Prototipo: se la sezione resta, va spostato in una collection di content
// (e nel pannello /admin), così Jeanne può cambiarli da sola.
// x, y: dove si posa il foglio sul tavolo (frazioni dello schermo); r: rotazione.

export interface Sketch {
  src: string
  alt: string
  width: number
  height: number
  x: number
  y: number
  r: number
}

export const SKETCHES: Sketch[] = [
  {
    src: '/img/opere/falena.jpg',
    alt: 'Disegno a colori: volto di ragazza con ali di falena al posto delle orecchie e una lacrima che cola sul mento',
    width: 1190,
    height: 1432,
    x: 0.15,
    y: 0.3,
    r: -9,
  },
  {
    src: '/img/opere/fiamme.jpg',
    alt: 'Disegno a colori: ragazza dai capelli mossi con fiamme arancioni che le coprono gli occhi',
    width: 1165,
    height: 1618,
    x: 0.85,
    y: 0.3,
    r: 8,
  },
  {
    src: '/img/opere/cuori.jpg',
    alt: 'Disegno a linea nera: ragazza con le orecchie a punta che stringe un cuore avvolto nei capelli',
    width: 1540,
    height: 1654,
    x: 0.27,
    y: 0.74,
    r: 6,
  },
  {
    src: '/img/opere/busto.jpg',
    alt: 'Disegno a linea nera: busto di donna dal collo lungo, con un secondo volto nascosto dietro la nuca',
    width: 1200,
    height: 1662,
    x: 0.73,
    y: 0.72,
    r: -5,
  },
  {
    src: '/img/opere/profilo-blu.jpg',
    alt: 'Disegno in nero e blu: profilo di ragazza con la frangia, lentiggini a puntini e ali di farfalla',
    width: 1582,
    height: 1636,
    x: 0.38,
    y: 0.22,
    r: -3,
  },
  {
    src: '/img/opere/tigre.jpg',
    alt: 'Dipinto: donna seduta con la testa di tigre, pennellate nere come strisce e fiori di ibisco arancioni',
    width: 1615,
    height: 1600,
    x: 0.6,
    y: 0.5,
    r: 3,
  },
]
