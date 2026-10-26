// JSON-LD TattooParlor (sottotipo di LocalBusiness) + Person, dai dati in app.config.
export function useSiteJsonLd() {
  const { site, contact } = useAppConfig()
  const { siteUrl } = useRuntimeConfig().public
  const instagram = `https://www.instagram.com/${contact.instagram}/`

  const person = {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: site.name,
    jobTitle: 'Tatuatrice e pittrice',
    url: siteUrl,
    sameAs: [instagram],
  }

  const business = {
    '@type': 'TattooParlor',
    '@id': `${siteUrl}/#studio`,
    name: contact.studio.name,
    url: siteUrl,
    description: site.description,
    founder: { '@id': person['@id'] },
    sameAs: [instagram],
    ...(contact.whatsapp && { telephone: `+${contact.whatsapp}` }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: contact.studio.street,
      postalCode: contact.studio.postalCode,
      addressLocality: contact.studio.city,
      addressCountry: contact.studio.country,
    },
  }

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': [person, business] }),
      },
    ],
  })
}
