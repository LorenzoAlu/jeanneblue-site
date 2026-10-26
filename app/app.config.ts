// Dati della cliente usati da header, footer, contatti e JSON-LD.
// Stanno in data/sito.json così Jeanne li modifica dal pannello (/admin, "Impostazioni").
// I valori tra [[ ]] vanno sostituiti: vedi docs/todo-cliente.md.
import sito from '../data/sito.json'

export default defineAppConfig(sito)
