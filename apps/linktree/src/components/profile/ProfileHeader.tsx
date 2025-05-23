import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileHeaderProps {
  username: string;
  avatarUrl?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username, avatarUrl }) => {
  return (
    <Card className="w-full mb-8 shadow-lg">
      <CardContent className="pt-6 flex flex-col items-center">
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={avatarUrl || `https://avatar.vercel.sh/${username}.png`} alt={username} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-semibold mb-2 dark:text-white">{username}</h1>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader; 