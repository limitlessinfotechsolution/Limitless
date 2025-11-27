'use client';
import { Suspense } from 'react';
import Pricing from '@/components/enterprise/Pricing';
import Skeleton from '@/components/ui/Skeleton';

const PricingContent = () => {
  const handlePlanSelect = (planId: string) => {
    // Handle plan selection, e.g., redirect to checkout or open modal
    console.log('Selected plan:', planId);
    // In production, integrate with Stripe or payment gateway
    alert(`Selected ${planId} plan. Redirecting to payment...`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Pricing Plans</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose the perfect plan for your business needs. All plans include a 14-day free trial.
        </p>
      </div>

      <Suspense fallback={<PricingLoading />}>
        <Pricing onPlanSelect={handlePlanSelect} />
      </Suspense>
    </div>
  );
};

const PricingLoading = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="space-y-4">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-6 w-64 mx-auto" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} className="h-4 w-full" />
          ))}
        </div>
        <Skeleton className="h-10 w-32 mx-auto" />
      </div>
    ))}
  </div>
);

export default function PricingPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading pricing...</div>}>
      <PricingContent />
    </Suspense>
  );
}
