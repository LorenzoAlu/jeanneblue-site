// Genera immagini SVG segnaposto a tema tattoo in public/img/placeholder/.
// Da eliminare quando arrivano le foto vere della cliente.
// Uso: node scripts/make-placeholders.mjs
import { mkdirSync, writeFileSync } from 'node:fs'

const OUT = 'public/img/placeholder'
mkdirSync(OUT, { recursive: true })

const ink = '#2b2b2b'
const stroke = `fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"`

// Tatuaggi: line art centrata su fondo neutro, formato 4:5 come i post IG
const tattoos = {
  rondine: `
    <path ${stroke} d="M400 470 C 340 420 250 400 170 430 C 250 450 300 480 330 520 C 280 540 230 590 210 660 C 280 610 340 590 380 590 L 400 700 L 420 590 C 460 590 520 610 590 660 C 570 590 520 540 470 520 C 500 480 550 450 630 430 C 550 400 460 420 400 470 Z"/>
    <circle cx="400" cy="440" r="22" ${stroke}/>
    <path ${stroke} d="M400 420 L 400 380"/>`,
  rosa: `
    <circle cx="400" cy="440" r="20" ${stroke}/>
    <path ${stroke} d="M380 440 C 370 400 430 390 440 430 C 450 480 370 500 350 450 C 330 390 420 350 470 400 C 520 460 450 540 380 520 C 300 500 300 400 360 360 C 430 320 520 360 530 440"/>
    <path ${stroke} d="M410 530 C 420 600 400 680 390 760"/>
    <path ${stroke} d="M400 640 C 450 610 500 620 520 650 C 480 670 440 660 400 640 Z"/>
    <path ${stroke} d="M395 700 C 350 670 300 680 285 710 C 320 725 360 720 395 700 Z"/>`,
  luna: `
    <path ${stroke} d="M470 300 A 200 200 0 1 0 470 700 A 160 160 0 1 1 470 300 Z"/>
    <path ${stroke} d="M560 380 l 0 40 M540 400 l 40 0"/>
    <path ${stroke} d="M590 560 l 0 28 M576 574 l 28 0"/>
    <circle cx="520" cy="660" r="5" fill="${ink}"/>`,
  serpente: `
    <path ${stroke} d="M300 800 C 250 720 350 680 420 660 C 520 630 540 560 460 530 C 360 495 270 470 320 400 C 360 345 450 360 480 300"/>
    <path ${stroke} d="M480 300 C 490 270 530 250 560 270 C 580 290 560 320 530 320 C 510 320 490 315 480 300 Z"/>
    <path ${stroke} d="M565 290 l 30 -8 M595 282 l 12 -14 M595 282 l 14 8"/>`,
  pugnale: `
    <path ${stroke} d="M400 250 L 430 330 L 430 600 L 400 680 L 370 600 L 370 330 Z"/>
    <path ${stroke} d="M400 330 L 400 600"/>
    <path ${stroke} d="M310 620 L 490 620"/>
    <path ${stroke} d="M380 620 L 380 730 L 420 730 L 420 620"/>
    <circle cx="400" cy="760" r="28" ${stroke}/>`,
  occhio: `
    <path ${stroke} d="M220 500 C 300 390 500 390 580 500 C 500 610 300 610 220 500 Z"/>
    <circle cx="400" cy="500" r="65" ${stroke}/>
    <circle cx="400" cy="500" r="22" fill="${ink}"/>
    <path ${stroke} d="M260 450 l -30 -40 M330 415 l -15 -50 M400 405 l 0 -55 M470 415 l 15 -50 M540 450 l 30 -40"/>`,
  farfalla: `
    <path ${stroke} d="M400 420 C 340 330 220 320 230 420 C 240 500 330 500 400 470 Z"/>
    <path ${stroke} d="M400 420 C 460 330 580 320 570 420 C 560 500 470 500 400 470 Z"/>
    <path ${stroke} d="M400 480 C 350 520 290 580 320 630 C 350 660 395 600 400 530"/>
    <path ${stroke} d="M400 480 C 450 520 510 580 480 630 C 450 660 405 600 400 530"/>
    <path ${stroke} d="M400 400 L 400 600 M400 400 C 390 360 370 340 350 330 M400 400 C 410 360 430 340 450 330"/>`,
}

for (const [name, body] of Object.entries(tattoos)) {
  writeFileSync(`${OUT}/tatuaggio-${name}.svg`, svg(800, 1000, '#e7e3dd', body, 'segnaposto'))
}

// Dipinti: composizioni astratte in grigi, proporzioni diverse come tele vere
const paintings = {
  'campo-notturno': [800, 1000, `
    <rect x="0" y="560" width="800" height="440" fill="#5a5a5a"/>
    <circle cx="560" cy="300" r="90" fill="#bdbdbd"/>
    <path d="M0 600 C 200 520 420 640 800 560 L 800 620 C 500 700 200 600 0 680 Z" fill="#3c3c3c"/>`],
  'figura-seduta': [800, 1000, `
    <rect x="0" y="0" width="800" height="1000" fill="#a8a8a8"/>
    <ellipse cx="400" cy="330" rx="90" ry="110" fill="#5e5e5e"/>
    <path d="M250 900 C 250 600 300 470 400 460 C 500 470 550 600 550 900 Z" fill="#4a4a4a"/>`],
  'marina': [1200, 800, `
    <rect x="0" y="0" width="1200" height="420" fill="#c9c9c9"/>
    <rect x="0" y="420" width="1200" height="380" fill="#6f6f6f"/>
    <path d="M0 470 C 300 440 600 500 1200 455" stroke="#e6e6e6" stroke-width="8" fill="none"/>`],
  'natura-morta': [1000, 1000, `
    <rect x="0" y="620" width="1000" height="380" fill="#7a7a7a"/>
    <path d="M380 620 L 400 380 L 470 340 L 540 380 L 560 620 Z" fill="#4d4d4d"/>
    <circle cx="680" cy="570" r="60" fill="#9d9d9d"/>
    <circle cx="270" cy="585" r="45" fill="#5a5a5a"/>`],
}

for (const [name, [w, h, body]] of Object.entries(paintings)) {
  writeFileSync(`${OUT}/dipinto-${name}.svg`, svg(w, h, '#dcdcdc', body, 'segnaposto'))
}

// Ritratto per "chi sono"
writeFileSync(`${OUT}/ritratto.svg`, svg(800, 1000, '#dcdcdc', `
    <circle cx="400" cy="400" r="130" fill="#9a9a9a"/>
    <path d="M150 1000 C 150 720 260 600 400 600 C 540 600 650 720 650 1000 Z" fill="#7a7a7a"/>`, 'segnaposto'))

function svg(w, h, bg, body, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  ${body.trim()}
  <text x="${w / 2}" y="${h - 40}" text-anchor="middle" font-family="monospace" font-size="24" fill="#777" letter-spacing="4">${label.toUpperCase()}</text>
</svg>
`
}

console.log(`Segnaposto scritti in ${OUT}`)
