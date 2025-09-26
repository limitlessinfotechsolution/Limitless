'use client';

import React from 'react';
import ResponsiveTest from '../../components/responsive-test/ResponsiveTest';
import Navigation from '../../components/common/Navigation';

const ResponsiveTestPage: React.FC = () => {
  return (
    <div>
      <Navigation />
      <main className="pt-20">
        <ResponsiveTest />
      </main>
    </div>
  );
};

export default ResponsiveTestPage;