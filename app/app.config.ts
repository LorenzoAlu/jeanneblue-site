// Dati della cliente usati da header, footer, contatti e JSON-LD.
// I valori tra [[ ]] vanno sostituiti: vedi docs/todo-cliente.md.
export default defineAppConfig({
  site: {
    name: 'Jeanne Blue',
    description: 'Tatuaggi e dipinti di Jeanne Blue. [[DA CHIEDERE: città]]',
  },
  contact: {
    instagram: 'jeanneblue.ink',
    // Solo cifre con prefisso internazionale, es. 393331234567. Vuoto = non mostrato come link.
    whatsapp: '',
    studio: {
      name: '[[DA CHIEDERE: nome studio]]',
      street: '[[DA CHIEDERE: via e civico]]',
      postalCode: '[[DA CHIEDERE: CAP]]',
      city: '[[DA CHIEDERE: città]]',
      country: 'IT',
    },
    vat: '[[DA CHIEDERE: P.IVA]]',
  },
})
