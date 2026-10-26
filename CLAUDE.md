# Sito jeanneblue.ink

Sito vetrina per una tatuatrice (IG: @jeanneblue.ink) che espone anche i suoi dipinti.
Richiesta della cliente: "qualcosa di semplice però figo, con anche i miei dipinti".

## Stack
- Nuxt 4, generazione statica (`nuxt generate`), deploy su hosting statico gratuito
- @nuxt/content v3 per tatuaggi, dipinti, FAQ e testi (niente backend/DB)
- @nuxt/image per ottimizzazione immagini (webp/avif, srcset)
- @nuxt/fonts per i font
- CSS scoped nei componenti + variabili globali in `app/assets/css/tokens.css`. Niente UI kit:
  è un portfolio, ogni elemento deve sembrare disegnato apposta.
- pnpm

## Convenzioni di codice
- Componenti piccoli e separati per responsabilità, niente hack con media query dove basta
  un componente dedicato
- Font size responsive con `clamp()`, breakpoint mobile principale 900px
- Sfondi full-width separati dal container a max-width
- Quando un file diventa complesso, riscrivilo intero invece di patch parziali
- Italiano per testi e contenuti, inglese per codice e nomi file

## Riferimento
`docs/reference.md` descrive il sito di riferimento (yooyaee.com). Va preso come
ispirazione per **struttura e tono** (semplice, personale, focalizzato sul lavoro),
NON va copiato: niente testi, layout identici, palette o elementi grafici ripresi da lì.
La cliente vuole un'identità sua.

## Sitemap prevista
- `/` Home: hero col lavoro, chi sono in breve, selezione tatuaggi, selezione dipinti, CTA contatto
- `/chi-sono`
- `/tatuaggi` portfolio filtrabile per stile/zona se i contenuti lo giustificano
- `/dipinti` galleria opere (titolo, anno, tecnica, misure, disponibile/venduto)
- `/cura` istruzioni di guarigione
- `/faq`
- `/contatti` WhatsApp + DM Instagram + indirizzo studio; niente form all'inizio
- `/privacy`, `/cookie` (footer con P.IVA)

## Contenuti
- `content/tatuaggi/*.yml`  -> image, alt, zona, stile, data
- `content/dipinti/*.yml`   -> image, alt, titolo, anno, tecnica, misure, stato
- `content/faq/*.md`
- `content/pagine/*.md`     -> chi-sono, cura, privacy
- Immagini sorgente in `assets-raw/`, quelle pubblicate in `public/img/` (o via @nuxt/image)
- Ogni immagine ha un alt descrittivo vero (cosa è tatuato e dove), mai "tattoo 1"

## Design
Prima di scrivere codice di UI:
1. Guarda le immagini in `assets-raw/` (tatuaggi e dipinti) e ricava da LÌ la direzione:
   palette, mood, tratto. Il nome "jeanne blue" e lo stile reale dei lavori sono il punto di partenza.
2. Proponi in `docs/design.md`: 4-6 colori hex con nome, 1-2 font con ruoli, wireframe ASCII
   di home e galleria, 3 principi. Aspetta conferma prima di implementare.
3. Le immagini dei lavori sono protagoniste: interfaccia sobria intorno, un solo elemento
   memorabile (es. il modo in cui si passa da tatuaggi a dipinti).
Evita i default da template: crema + serif + accento terracotta, nero + accento acido,
card arrotondate tutte uguali con ombra grigia, eyebrow in maiuscolo sopra ogni titolo,
numerazioni 01/02/03 senza sequenza reale, fade-in su ogni sezione, "→" su ogni link.
Qualità minima: mobile-first, focus da tastiera visibile, `prefers-reduced-motion`, contrasto AA.

## Performance / SEO
- Lighthouse > 95 su mobile
- Meta e OG per pagina, JSON-LD `LocalBusiness`/`Person` con indirizzo studio
- Lazy loading immagini sotto la piega, LCP sull'immagine hero precaricata

## Info mancanti dalla cliente
Vedi `docs/todo-cliente.md`. Finché mancano usa placeholder espliciti `[[DA CHIEDERE: ...]]`.

## Primo task
1. Scaffold Nuxt 4 nella root (`pnpm dlx nuxi@latest init . --packageManager pnpm`)
2. Aggiungi i moduli: `pnpm dlx nuxi module add content image fonts`
3. Crea struttura content + layout base vuoto
4. Poi fase design (sezione Design), poi implementazione pagina per pagina
