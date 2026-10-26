interface PageSeo {
  title: string
  description: string
  image?: string
}

// Title, description, canonical e Open Graph di una pagina.
export function usePageSeo({ title, description, image }: PageSeo) {
  const route = useRoute()
  const { siteUrl } = useRuntimeConfig().public
  const url = new URL(route.path, siteUrl).href
  const ogImage = image ? new URL(image, siteUrl).href : undefined

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogUrl: url,
    ogLocale: 'it_IT',
    ogSiteName: 'Jeanne Blue',
    ogImage,
    twitterCard: ogImage ? 'summary_large_image' : 'summary',
  })
  useHead({ link: [{ rel: 'canonical', href: url }] })
}
