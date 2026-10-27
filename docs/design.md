# Design — v0 approvata, da verificare sulle immagini

> Stato: **bozza**. `assets-raw/` è ancora vuoto, quindi questa proposta parte solo dal
> nome ("Jeanne **Blue**", ".ink") e dal tipo di progetto. Appena arrivano le foto
> (export IG o originali) va verificata: se i lavori sono a colori pieni, neo-trad, ecc.
> palette e font cambiano. Approvata per l'implementazione con segnaposto (26/10/2026).

## Idea

L'inchiostro blu. Il blu della biro sul quaderno degli schizzi, che diventa linea sulla pelle
e colore sulla tela. Il sito è un foglio chiaro scritto in blu; quando si entra nei dipinti
il foglio "si bagna" e diventa una parete blu notte, come una galleria.

## Palette

| Nome            | Hex       | Ruolo                                                           |
|-----------------|-----------|-----------------------------------------------------------------|
| Foglio          | `#F4F5F7` | sfondo principale (bianco freddo, non crema)                    |
| Inchiostro      | `#1F3A93` | testo dei titoli, link, linee: il blu biro (AA su Foglio: 9,2:1)  |
| Notte           | `#0E1A33` | testo corrente; sfondo della sezione dipinti                    |
| Grafite         | `#5B6170` | didascalie, metadati (AA su Foglio: 5,7:1)                        |
| Velo            | `#D6DDEE` | campiture leggere, hover, bordi sottili                         |
| Timbro          | `#C2362B` | solo per lo stato "venduto", come un timbro sulla scheda (5:1 su Foglio) |

Su sfondo Notte il testo è Foglio (15,9:1), i metadati Velo (12,7:1) e il Timbro si schiarisce
in `#E8685C` (5,4:1), perché `#C2362B` su Notte non passa AA (3,2:1).

## Font

- **Bricolage Grotesque** (variabile, Google Fonts): titoli e testo. Ha un disegno un po'
  irregolare, "fatto a mano" senza essere calligrafico. Titoli con optical size alta e peso
  700, testo a 400.
- **IBM Plex Mono**: solo per le schede dei dipinti (titolo, anno, tecnica, misure) e le
  etichette stile/zona dei tatuaggi. Fa da cartellino da galleria.

## Wireframe — Home (mobile prima, poi desktop ≥ 900px)

```
MOBILE                          DESKTOP
┌────────────────────┐          ┌──────────────────────────────────────────────┐
│ Jeanne Blue     ☰  │          │ Jeanne Blue      Tatuaggi Dipinti Chi sono … │
├────────────────────┤          ├──────────────────────────────────────────────┤
│ ┌────────────────┐ │          │ ┌─────────────────────┐                      │
│ │                │ │          │ │                     │  Disegno sulla pelle │
│ │  FOTO HERO     │ │          │ │   FOTO HERO         │  e dipingo su tela.  │
│ │  (tatuaggio)   │ │          │ │   (LCP, preload)    │  [frase di lei]      │
│ │                │ │          │ │                     │                      │
│ └────────────────┘ │          │ └─────────────────────┘  Scrivimi  Lavori    │
│ Disegno sulla      │          ├──────────────────────────────────────────────┤
│ pelle e dipingo    │          │ Chi sono: 3 righe + foto piccola  → chi sono │
│ su tela.           │          ├──────────────────────────────────────────────┤
│ [Scrivimi] [Lavori]│          │ TATUAGGI                                     │
├────────────────────┤          │ ┌────┐ ┌────┐ ┌────┐ ┌────┐  (griglia 4:5,   │
│ Chi sono (breve)   │          │ │    │ │    │ │    │ │    │   niente card)   │
├────────────────────┤          │ └────┘ └────┘ └────┘ └────┘  Tutti i tatuaggi│
│ TATUAGGI           │          ╞══════════════════════════════════════════════╡
│ ┌──────┐┌──────┐   │          │▓▓ DIPINTI ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│ │      ││      │ ← swipe      │▓  ┌──────────┐   ┌──────┐                   ▓│
│ └──────┘└──────┘   │          │▓  │          │   │      │  Titolo, 2025     ▓│
╞════════════════════╡  ← il    │▓  └──────────┘   └──────┘  olio su tela     ▓│
│▓ DIPINTI (fondo   ▓│   foglio │▓                           60×80 cm          ▓│
│▓ Notte)           ▓│   diventa│▓                           Tutti i dipinti   ▓│
│▓ ┌──────────────┐ ▓│   blu    ╞══════════════════════════════════════════════╡
│▓ │              │ ▓│          │ Prenota: WhatsApp · Instagram · Studio       │
│▓ └──────────────┘ ▓│          ├──────────────────────────────────────────────┤
│▓ Titolo, anno     ▓│          │ footer: studio, P.IVA, privacy, cookie       │
├────────────────────┤          └──────────────────────────────────────────────┘
│ Prenota (WA / IG)  │
│ footer             │
└────────────────────┘
```

## Wireframe — Galleria (`/tatuaggi` e `/dipinti`)

```
/tatuaggi (fondo Foglio)                 /dipinti (fondo Notte)
┌──────────────────────────────┐         ┌──────────────────────────────┐
│ Tatuaggi                     │         │ Dipinti                      │
│ Tutti · linea fine · blackwork│        │ Disponibili · Tutti          │
│ (filtri solo se servono)     │         ├──────────────────────────────┤
├──────────────────────────────┤         │ ┌──────────────────┐         │
│ ┌──────┐ ┌──────┐ ┌──────┐   │         │ │                  │ TITOLO  │
│ │ 4:5  │ │ 4:5  │ │ 4:5  │   │         │ │  opera intera,   │ 2025    │
│ └──────┘ └──────┘ └──────┘   │         │ │  proporzioni     │ olio    │
│ rosa · avambraccio           │         │ │  vere            │ 60×80   │
│ ┌──────┐ ┌──────┐ ┌──────┐   │         │ └──────────────────┘ ● vend.│
│ │      │ │      │ │      │   │         │  (una opera per riga, come  │
│ └──────┘ └──────┘ └──────┘   │         │   appese in galleria)       │
│ tap → foto grande (dialog)   │         │                              │
└──────────────────────────────┘         └──────────────────────────────┘
```

Tatuaggi: griglia fitta e uniforme (sono tanti, formato IG). Dipinti: pochi, grandi, uno per
riga, con il cartellino in mono accanto. Due ritmi diversi per due mestieri diversi.

## L'elemento memorabile

**Il passaggio dal foglio alla parete.** Scendendo in home, al confine tra tatuaggi e dipinti
lo sfondo passa da Foglio a Notte con un bordo irregolare, come una pennellata d'inchiostro
che si allarga (SVG, niente immagini pesanti). La stessa cosa succede navigando da
`/tatuaggi` a `/dipinti` (view transition). Con `prefers-reduced-motion` il passaggio è
istantaneo. È l'unica animazione del sito.

## Principi

1. **Il lavoro parla, l'interfaccia scrive a margine.** Foto grandi, testo piccolo e in blu,
   niente card, ombre o decorazioni attorno alle immagini.
2. **Due mestieri, due ritmi.** I tatuaggi in griglia densa su carta, i dipinti appesi uno
   alla volta su parete blu. Nient'altro distingue le sezioni.
3. **Parla lei.** Prima persona, frasi corte, nessun linguaggio da marketing. Ogni pagina
   finisce con un modo diretto per scriverle.

## Verifica sulle foto vere (27/10/2026)

I lavori sono illustrativi e floreali in nero (volti femminili, farfalle, peonie, fiori di
ciliegio, ornamenti a puntini), fotografati spesso su fondo scuro con tessuti color malva.
Il nero su pelle sta bene sia sul Foglio sia sulla parete Notte: la palette regge così com'è.

## Da verificare quando arrivano le immagini

- I tatuaggi sono a linea fine / blackwork (blu regge) o a colori pieni (serve palette più neutra)?
- I dipinti hanno dominanti che litigano col blu Notte? Se sì, parete Grafite scura invece di Notte.
- Ha un logo o una firma? Potrebbe sostituire il testo "Jeanne Blue" nell'header.
