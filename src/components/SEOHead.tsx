import React from 'react';
import Head from 'next/head';
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  generateServiceSchema,
  generateFAQSchema,
  generateArticleSchema
} from '../lib/seoSchemas';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: any[];
  breadcrumbs?: Array<{ name: string; url: string }>;
  pageData?: {
    name: string;
    description: string;
    url: string;
    datePublished?: string;
    dateModified?: string;
  };
  serviceData?: {
    name: string;
    description: string;
    provider: string;
    serviceType: string;
    areaServed?: string[];
    offers?: {
      priceRange?: string;
      description?: string;
    };
  };
  faqData?: Array<{ question: string; answer: string }>;
  articleData?: {
    headline: string;
    description: string;
    author: string;
    datePublished: string;
    dateModified?: string;
    url: string;
    image?: string;
  };
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonical,
  ogImage,
  structuredData = [],
  breadcrumbs,
  pageData,
  serviceData,
  faqData,
  articleData
}) => {
  // Generate structured data based on props
  const schemas = [...structuredData];

  // Always include organization schema
  schemas.push(generateOrganizationSchema());

  // Add breadcrumb schema if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(breadcrumbs));
  }

  // Add webpage schema if provided
  if (pageData) {
    schemas.push(generateWebPageSchema(pageData));
  }

  // Add service schema if provided
  if (serviceData) {
    schemas.push(generateServiceSchema(serviceData));
  }

  // Add FAQ schema if provided
  if (faqData && faqData.length > 0) {
    schemas.push(generateFAQSchema(faqData));
  }

  // Add article schema if provided
  if (articleData) {
    schemas.push(generateArticleSchema(articleData));
  }

  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Structured Data */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0)
          }}
        />
      ))}
    </Head>
  );
};

export default SEOHead;
