import React from 'react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface EnterpriseTeamProps {
  members?: TeamMember[];
}

const EnterpriseTeam: React.FC<EnterpriseTeamProps> = ({ members = [] }) => {
  return (
    <div className="enterprise-team">
      <h2 className="text-lg font-semibold mb-4">Team Members</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.length > 0 ? (
          members.map((member) => (
            <div key={member.id} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <span className="text-sm font-medium text-gray-700">
                      {member.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No team members</p>
        )}
      </div>
    </div>
  );
};

export default EnterpriseTeam;
