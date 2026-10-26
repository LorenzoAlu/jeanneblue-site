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
    }),
  },
})
