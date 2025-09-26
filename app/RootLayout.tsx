import React from 'react';
import RootHtml from '../src/components/RootHtml';
import ClientLayout from '../src/components/ClientLayout';
import ErrorBoundary from '../src/components/ErrorBoundary';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootHtml>
      <body>
        <ErrorBoundary>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ErrorBoundary>
      </body>
    </RootHtml>
  );
}