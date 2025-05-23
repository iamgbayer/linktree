import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileCardProps {
  username: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ username }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
            <span className="text-2xl font-semibold text-blue-800">{username.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <CardTitle>{username}</CardTitle>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProfileCard; 