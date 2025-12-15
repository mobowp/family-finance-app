'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface UserPasswordDisplayProps {
  password: string;
}

export function UserPasswordDisplay({ password }: UserPasswordDisplayProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Check if password looks like a bcrypt hash
  const isHashed = password.startsWith('$2');

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">
        {isVisible ? (
            isHashed ? <span className="text-muted-foreground italic text-xs">已加密</span> : password
        ) : (
            "••••••"
        )}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={() => setIsVisible(!isVisible)}
        title={isVisible ? "隐藏密码" : "显示密码"}
      >
        {isVisible ? (
          <EyeOff className="h-3 w-3" />
        ) : (
          <Eye className="h-3 w-3" />
        )}
        <span className="sr-only">{isVisible ? "隐藏密码" : "显示密码"}</span>
      </Button>
    </div>
  );
}
