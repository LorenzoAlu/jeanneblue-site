# Pannello di gestione (/admin)

Il sito non ha un backend: i contenuti sono file nel repo. Il pannello è
[Sveltia CMS](https://sveltiacms.app), una pagina statica in `public/admin/` che legge e
scrive quei file su GitHub. Ogni "Salva" è un commit su `main`; GitHub Actions ricostruisce
il sito e in circa 2 minuti la modifica è online.

- Indirizzo: https://lorenzoalu.github.io/jeanneblue-site/admin/
- Configurazione: `public/admin/config.yml` (versione di Sveltia fissata in `public/admin/index.html`)
- Cosa si modifica: tatuaggi, dipinti, FAQ, testi delle pagine, contatti (`data/sito.json`)
- Le foto caricate diventano WebP max 2000px e finiscono in `public/img/tatuaggi`,
  `public/img/dipinti`, `public/img/pagine`. Le misure in pixel dei dipinti le calcola il
  build (hook in `nuxt.config.ts`).

## Dare accesso a Jeanne (Lorenzo, una volta sola)

1. Jeanne si crea un account su https://github.com/signup (gratis).
2. La aggiungi come collaboratrice con permesso di scrittura:
   ```
   gh api -X PUT repos/LorenzoAlu/jeanneblue-site/collaborators/USERNAME_DI_JEANNE -f permission=push
   ```
   Le arriva una mail di invito da accettare.
3. Jeanne crea un token (serve finché non configuriamo il login con un clic, vedi sotto):
   GitHub → foto profilo → Settings → Developer settings → Personal access tokens →
   **Tokens (classic)** → Generate new token (classic). Nome "Pannello sito", scadenza 1 anno,
   spunta solo **public_repo**. Copia il token (inizia con `ghp_`).
   I token "fine-grained" non vanno bene: non danno accesso ai repo di un altro utente
   in cui si è collaboratori.
4. Su /admin sceglie **Accedi con Token di Accesso** e incolla il token. Il browser lo ricorda.

### Più avanti: login con un clic ("Accedi con GitHub")

Serve un piccolo server OAuth gratuito su Cloudflare Workers
([sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth)) e una OAuth App su GitHub.
Poi si aggiunge `base_url: <url del worker>` sotto `backend` in `config.yml`.
Richiede un account Cloudflare (gratis): da fare quando il sito passa al dominio vero.

## Guida per Jeanne

**Aggiungere un tatuaggio**
1. Apri il pannello → **Tatuaggi** → **Nuovo Tatuaggio**.
2. Carica la foto (meglio l'originale dal telefono, non quella di Instagram).
3. Scrivi la descrizione: cosa è tatuato e dove ("rondine a linea fine sulla clavicola").
   La leggono i non vedenti e Google, quindi conta.
4. Zona e stile: usa sempre le stesse parole (gli stili diventano i filtri della pagina).
5. Data del tatuaggio → **Salva**. Dopo un paio di minuti è sul sito, e se è il più
   recente finisce anche in apertura della home.

**Aggiungere un dipinto**: come sopra, da **Dipinti**. Foto dritta, solo la tela, luce
naturale. Quando lo vendi, apri il dipinto e cambia **Stato** in "Venduto".

**Modificare testi e contatti**: **Pagine** (home, chi sono, cura, privacy, cookie) e
**Impostazioni** (WhatsApp, indirizzo, P.IVA).

**Domande frequenti**: **Domande frequenti** → nuova domanda. "Posizione" decide l'ordine.

Se qualcosa non torna non si rompe niente: ogni modifica è salvata nella cronologia e
Lorenzo può sempre tornare indietro.
