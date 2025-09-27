import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Limitless Infotech',
  description: 'Terms of service for using Limitless Infotech services and website.',
};

const TermsOfService: React.FC = () => {
  return (
    <div className="pt-20">
      <div className="container-custom py-16">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-4xl">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Limitless Infotech's services, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>2. Services</h2>
          <p>
            We provide web development, mobile app development, custom software, CRM solutions, and AI integration services.
          </p>

          <h2>3. User Responsibilities</h2>
          <p>
            You agree to provide accurate information and use our services in compliance with applicable laws and regulations.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            All content, features, and functionality of our services are owned by Limitless Infotech and are protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            In no event shall Limitless Infotech be liable for any indirect, incidental, special, consequential, or punitive damages.
          </p>

          <h2>6. Contact Information</h2>
          <p>
            For questions about these Terms, please contact us at Info@limitlessinfotech.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
