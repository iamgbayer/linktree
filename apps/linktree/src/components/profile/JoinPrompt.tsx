import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface JoinPromptProps {
  username: string;
}

const JoinPrompt: React.FC<JoinPromptProps> = ({ username }) => {
  return (
    <div className="flex justify-center mb-8">
      <Button variant="default" size="lg" className="shadow-md">
        <Sparkles size={18} className="mr-2" />
        Join {username} on Linktree
      </Button>
    </div>
  );
};

export default JoinPrompt; 