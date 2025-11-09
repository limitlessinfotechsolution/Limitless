'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from './common/Navigation';
import Footer from './common/Footer';
import ChatbotWidget from './chatbot/ChatbotWidget';
import PWA from './PWA';
import '../lib/utils/i18n';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminOrEnterprise = pathname.startsWith('/admin') || pathname.startsWith('/enterprise');

  useEffect(() => {
    document.documentElement.setAttribute('crxlauncher', '');
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {!isAdminOrEnterprise && <Navigation />}
      <main>
        {children}
      </main>
      {!isAdminOrEnterprise && <Footer />}
      {!isAdminOrEnterprise && <ChatbotWidget />}
      <PWA />
    </div>
  );
}
