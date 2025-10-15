import React from 'react';

interface EnterpriseLayoutProps {
  children: React.ReactNode;
}

const EnterpriseLayout: React.FC<EnterpriseLayoutProps> = ({ children }) => {
  return (
    <div className="enterprise-layout min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-gray-900">Enterprise Suite</h1>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default EnterpriseLayout;
