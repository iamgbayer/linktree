import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame } from 'lucide-react';

interface LiveLinkCardProps {
  username: string;
  fixedUsername: string;
}

const LiveLinkCard: React.FC<LiveLinkCardProps> = ({ username, fixedUsername }) => {
  const linkUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${fixedUsername}`;

  return (
    <Card className="mb-6 p-4">
      <CardContent className="flex items-center justify-between p-0">
        <div className="flex items-center">
          <Flame className="text-orange-500 mr-2" size={20} />
          <p>Your Linktree is live:
            <a href={`/${fixedUsername}`} target="_blank" rel="noreferrer" className="text-blue-600 ml-1 hover:underline">
              linktree.ee/{fixedUsername}
            </a>
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(linkUrl)}>
          Copy URL
        </Button>
      </CardContent>
    </Card>
  );
};

export default LiveLinkCard; 