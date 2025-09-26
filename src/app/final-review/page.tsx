'use client';

import React from 'react';
import Navigation from '../../components/common/Navigation';
import FinalInterfaceReview from '../../components/maturity-review/FinalInterfaceReview';

const FinalReviewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="pt-24 pb-8">
        <FinalInterfaceReview />
      </main>
    </div>
  );
};

export default FinalReviewPage;