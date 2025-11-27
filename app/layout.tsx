import React from 'react';
import { Inter, Outfit } from 'next/font/google';
import { Metadata } from 'next';
import ClientLayout from '../src/components/ClientLayout';
import ErrorBoundary from '../src/components/ErrorBoundary';
import '../src/index.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Limitless Infotech | Digital Solutions',
    template: '%s | Limitless Infotech',
  },
  description: 'Limitless Infotech provides cutting-edge digital solutions, web development, and enterprise software to elevate your business.',
  keywords: ['web development', 'software solutions', 'enterprise', 'digital transformation', 'limitless infotech'],
  authors: [{ name: 'Limitless Infotech Team' }],
  creator: 'Limitless Infotech',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.limitlessinfotech.com',
    title: 'Limitless Infotech | Digital Solutions',
    description: 'Limitless Infotech provides cutting-edge digital solutions, web development, and enterprise software to elevate your business.',
    siteName: 'Limitless Infotech',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Limitless Infotech | Digital Solutions',
    description: 'Limitless Infotech provides cutting-edge digital solutions, web development, and enterprise software to elevate your business.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 text-secondary-900 dark:text-white">
        <ErrorBoundary>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ErrorBoundary>
      </body>
    </html>
  );
}
