const PrivacyPolicy = () => {
  return (
    <div className="pt-20">
      <div className="container-custom py-16">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-4xl">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you contact us, request services, or communicate with us.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, communicate with you, and comply with legal obligations.
          </p>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at Info@limitlessinfotech.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
