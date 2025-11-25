import React from 'react';
import RootHtml from '../src/components/RootHtml';
import ClientLayout from '../src/components/ClientLayout';
import ErrorBoundary from '../src/components/ErrorBoundary';
import './globals.css';
import './theme.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootHtml>
      <body>
        <ErrorBoundary>
          <main className={`${inter.variable} font-sans antialiased`}>
            <ClientLayout>
              {children}
            </ClientLayout>
          </main>
        </ErrorBoundary>
      </body>
    </RootHtml>
  );
}
