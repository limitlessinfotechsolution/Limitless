import React from 'react';
import EnterpriseLayout from './EnterpriseLayout';
import EnterpriseKPI from './EnterpriseKPI';
import EnterpriseDashboard from './EnterpriseDashboard';
import EnterpriseTeam from './EnterpriseTeam';
import EnterpriseCalendar from './EnterpriseCalendar';
import EnterpriseChat from './EnterpriseChat';
import EnterpriseDataGrid from './EnterpriseDataGrid';
import EnterpriseReporting from './EnterpriseReporting';
import EnterpriseUserProfile from './EnterpriseUserProfile';

const EnterpriseSuiteDemo: React.FC = () => {
  return (
    <EnterpriseLayout>
      <div className="space-y-8">
        <EnterpriseKPI title="Revenue" value="$1.2M" change="+12%" />
        <EnterpriseDashboard title="Main Dashboard" />
        <EnterpriseTeam />
        <EnterpriseCalendar />
        <EnterpriseChat />
        <EnterpriseDataGrid
          data={[] as any[]}
          columns={[
            {
              accessorKey: 'name',
              header: 'Name',
            },
            {
              accessorKey: 'value',
              header: 'Value',
            },
          ]}
        />
        <EnterpriseReporting />
        <EnterpriseUserProfile />
      </div>
    </EnterpriseLayout>
  );
};

export default EnterpriseSuiteDemo;
