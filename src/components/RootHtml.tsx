'use client';

import React from 'react';

import Head from 'next/head';

export default function RootHtml({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>
      {children}
    </html>
  );
}
