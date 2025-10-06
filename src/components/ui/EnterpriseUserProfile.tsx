import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import Button from './Button';

interface EnterpriseUserProfileProps {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

const EnterpriseUserProfile: React.FC<EnterpriseUserProfileProps> = ({
  user,
  onEdit,
  onDelete
}) => {
  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No user data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enterprise User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full" />
            ) : (
              <span className="text-2xl font-bold text-gray-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
        </div>

        <div className="flex space-x-2">
          {onEdit && (
            <Button onClick={onEdit} variant="outline" size="sm">
              Edit
            </Button>
          )}
          {onDelete && (
            <Button onClick={onDelete} variant="destructive" size="sm">
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnterpriseUserProfile;
