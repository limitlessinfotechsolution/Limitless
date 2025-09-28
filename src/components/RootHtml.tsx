'use client';

import React from 'react';

export default function RootHtml({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      {children}
    </html>
  );
}
