'use client';

import React from 'react';
import Navigation from '../../components/common/Navigation';
import MobileRefinementTest from '../../components/responsive-test/MobileRefinementTest';

const MobileTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="pt-24 pb-8">
        <MobileRefinementTest />
      </main>
    </div>
  );
};

export default MobileTestPage;