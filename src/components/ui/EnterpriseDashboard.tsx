import React from 'react';

interface EnterpriseDashboardProps {
  title?: string;
  children?: React.ReactNode;
}

const EnterpriseDashboard: React.FC<EnterpriseDashboardProps> = ({
  title = 'Dashboard',
  children
}) => {
  return (
    <div className="enterprise-dashboard">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="dashboard-content">
        {children || <p>Dashboard content goes here</p>}
      </div>
    </div>
  );
};

export default EnterpriseDashboard;
