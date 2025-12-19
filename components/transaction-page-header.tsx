'use client';

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVisibilityState } from "@/hooks/use-visibility-state";

export function TransactionPageHeader() {
  const { isVisible, toggleVisibility } = useVisibilityState();

  return (
    <div className="flex items-center gap-3">
      <h1 className="text-3xl font-bold tracking-tight">交易记录</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleVisibility}
        className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
      >
        {isVisible ? (
          <Eye className="h-5 w-5 text-muted-foreground" />
        ) : (
          <EyeOff className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}
