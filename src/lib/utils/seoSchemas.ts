// JSON-LD Structured Data Schemas for SEO

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Limitless Infotech',
  url: 'https://limitlessinfotech.com',
  logo: 'https://limitlessinfotech.com/logo.png',
  description: 'Leading provider of web development, mobile apps, custom software, CRM systems, and AI automation solutions.',
  foundingDate: '2020',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-XXXXXXXXXX',
    contactType: 'customer service',
    email: 'Info@limitlessinfotech.com',
    areaServed: ['IN', 'US', 'AE', 'GB'],
    availableLanguage: ['English', 'Hindi']
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Office Address',
    addressLocality: 'Mumbai',
    addressRegion: 'Maharashtra',
    postalCode: '400001',
    addressCountry: 'IN'
  },
  sameAs: [
    'https://www.linkedin.com/company/limitless-infotech',
    'https://twitter.com/limitlessinfotech',
    'https://www.facebook.com/limitlessinfotech'
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Technology Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web Development',
          description: 'Custom web applications, responsive websites, and e-commerce solutions'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Mobile App Development',
          description: 'Native and cross-platform mobile applications for iOS and Android'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Custom Software Development',
          description: 'Tailored software solutions for business automation and digital transformation'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'CRM Solutions',
          description: 'Customer relationship management systems and business intelligence tools'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'AI Integration',
          description: 'Artificial intelligence and machine learning solutions for business optimization'
        }
      }
    ]
  }
});

export const generateBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: `https://limitlessinfotech.com${crumb.url}`
  }))
});

export const generateWebPageSchema = (pageData: {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: pageData.name,
  description: pageData.description,
  url: `https://limitlessinfotech.com${pageData.url}`,
  inLanguage: 'en-US',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Limitless Infotech',
    url: 'https://limitlessinfotech.com'
  },
  ...(pageData.datePublished && { datePublished: pageData.datePublished }),
  ...(pageData.dateModified && { dateModified: pageData.dateModified })
});

export const generateServiceSchema = (serviceData: {
  name: string;
  description: string;
  provider: string;
  serviceType: string;
  areaServed?: string[];
  offers?: {
    priceRange?: string;
    description?: string;
  };
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: serviceData.name,
  description: serviceData.description,
  provider: {
    '@type': 'Organization',
    name: serviceData.provider,
    url: 'https://limitlessinfotech.com'
  },
  serviceType: serviceData.serviceType,
  ...(serviceData.areaServed && { areaServed: serviceData.areaServed }),
  ...(serviceData.offers && {
    offers: {
      '@type': 'Offer',
      ...serviceData.offers
    }
  })
});

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

export const generateArticleSchema = (articleData: {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  image?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: articleData.headline,
  description: articleData.description,
  author: {
    '@type': 'Person',
    name: articleData.author
  },
  publisher: {
    '@type': 'Organization',
    name: 'Limitless Infotech',
    logo: {
      '@type': 'ImageObject',
      url: 'https://limitlessinfotech.com/logo.png'
    }
  },
  datePublished: articleData.datePublished,
  ...(articleData.dateModified && { dateModified: articleData.dateModified }),
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://limitlessinfotech.com${articleData.url}`
  },
  ...(articleData.image && {
    image: {
      '@type': 'ImageObject',
      url: articleData.image
    }
  })
});
