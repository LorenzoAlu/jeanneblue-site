// Geometria della superficie d'inchiostro di InkFlood: una linea d'onda morbida
// (somma di due sinusoidi) chiusa verso il basso, così la parte sotto è "parete".

export interface InkSurface {
  width: number
  height: number
  // 0 = inchiostro sotto il bordo (invisibile), 1 = livello di riposo
  level: number
  // ampiezza dell'onda in px
  amp: number
  // tempo, fa scorrere le onde
  time: number
  // rigonfiamento verso il puntatore: posizione x in px e intensità 0-1
  bumpX?: number
  bump?: number
}

const REST_FRACTION = 0.55
const SEGMENTS = 28
// Il riempimento sborda oltre i lati e il fondo: il filtro goo sfuma i bordi della forma
const BLEED = 40

export const INK_REST = { level: 1, amp: 10, time: 0 }

export function surfaceY({ width, height, level, amp, time, bumpX = 0, bump = 0 }: InkSurface, x: number) {
  const base = height - level * height * REST_FRACTION
  const k = (Math.PI * 2 * 2.2) / width
  const wave = 0.6 * Math.sin(x * k + time) + 0.4 * Math.sin(x * k * 2.3 - time * 1.4 + 1)
  const pull = bump * height * 0.22 * Math.exp(-(((x - bumpX) / 110) ** 2))
  return base - amp * wave - pull
}

export function inkPath(surface: InkSurface) {
  const { width, height } = surface
  const points = Array.from({ length: SEGMENTS + 1 }, (_, i) => {
    const x = (width / SEGMENTS) * i
    return [x, surfaceY(surface, x)] as const
  })

  // Catmull-Rom -> Bézier cubiche, per una curva continua tra i punti
  let d = `M${-BLEED} ${height + BLEED} L${-BLEED} ${points[0]![1].toFixed(1)} L0 ${points[0]![1].toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)]!
    const p1 = points[i]!
    const p2 = points[i + 1]!
    const p3 = points[Math.min(i + 2, points.length - 1)]!
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  const last = points[points.length - 1]![1].toFixed(1)
  return `${d} L${width + BLEED} ${last} L${width + BLEED} ${height + BLEED} Z`
}
