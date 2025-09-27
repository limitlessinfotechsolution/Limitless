import { generateOrganizationSchema, generateWebPageSchema } from '../src/lib/seoSchemas';

export const metadata = {
  title: 'Limitless Infotech - Innovative Tech Solutions | Web Development, AI & CRM',
  description: 'Transform your business with cutting-edge technology solutions. Expert web development, mobile apps, custom software, CRM systems, and AI automation. Trusted by startups and enterprises worldwide.',
  keywords: ['web development', 'mobile apps', 'custom software', 'CRM systems', 'AI automation', 'digital transformation', 'technology solutions', 'software development company'],
  openGraph: {
    title: 'Limitless Infotech - Innovative Tech Solutions',
    description: 'Transform your business with cutting-edge technology solutions. Expert web development, mobile apps, custom software, CRM systems, and AI automation.',
    url: 'https://limitlessinfotech.com',
    siteName: 'Limitless Infotech',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Limitless Infotech - Innovative Tech Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Limitless Infotech - Innovative Tech Solutions',
    description: 'Transform your business with cutting-edge technology solutions. Expert web development, mobile apps, custom software, CRM systems, and AI automation.',
    images: ['/og-image.jpg'],
    creator: '@limitlessinfotech',
  },
  alternates: {
    canonical: 'https://limitlessinfotech.com',
  },
  other: {
    'application/ld+json': JSON.stringify([
      generateOrganizationSchema(),
      generateWebPageSchema({
        name: 'Limitless Infotech - Innovative Tech Solutions',
        description: 'Transform your business with cutting-edge technology solutions. Expert web development, mobile apps, custom software, CRM systems, and AI automation.',
        url: '/',
        datePublished: '2024-01-01',
        dateModified: new Date().toISOString().split('T')[0]
      })
    ])
  }
};
