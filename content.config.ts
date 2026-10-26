import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    tatuaggi: defineCollection({
      type: 'data',
      source: 'tatuaggi/*.yml',
      schema: z.object({
        image: z.string(),
        alt: z.string(),
        zona: z.string(),
        stile: z.string(),
        data: z.date(),
      }),
    }),
    dipinti: defineCollection({
      type: 'data',
      source: 'dipinti/*.yml',
      schema: z.object({
        image: z.string(),
        // Dimensioni in pixel della foto, per riservare lo spazio (niente layout shift).
        // Se mancano (dipinti caricati dal pannello) le legge nuxt.config dal file.
        width: z.number().optional(),
        height: z.number().optional(),
        alt: z.string(),
        titolo: z.string(),
        anno: z.number(),
        tecnica: z.string(),
        misure: z.string(),
        stato: z.enum(['disponibile', 'venduto']),
      }),
    }),
    faq: defineCollection({
      type: 'page',
      source: 'faq/*.md',
      schema: z.object({
        ordine: z.number(),
      }),
    }),
    pagine: defineCollection({
      type: 'page',
      source: 'pagine/*.md',
      schema: z.object({
        // Frase principale della home (solo home.md)
        hero: z.string().optional(),
        // Foto della pagina (chi-sono.md: ritratto)
        image: z.string().optional(),
        imageAlt: z.string().optional(),
      }),
    }),
  },
})
