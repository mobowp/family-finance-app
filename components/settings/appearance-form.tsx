'use client';

import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export function AppearanceForm() {
  const [fontSize, setFontSize] = useState("16px");

  useEffect(() => {
    const savedSize = localStorage.getItem("font-size") || "16px";
    setFontSize(savedSize);
    document.documentElement.style.fontSize = savedSize;
  }, []);

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = e.target.value;
    setFontSize(newSize);
    localStorage.setItem("font-size", newSize);
    document.documentElement.style.fontSize = newSize;
  };

  return (
    <div className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="fontSize">全局字体大小</Label>
        <select 
          id="fontSize" 
          value={fontSize} 
          onChange={handleFontSizeChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="14px">小 (Small)</option>
          <option value="16px">默认 (Default)</option>
          <option value="18px">大 (Large)</option>
          <option value="20px">特大 (Extra Large)</option>
        </select>
        <p className="text-sm text-muted-foreground">
          调整后将立即应用到整个系统。
        </p>
      </div>
    </div>
  );
}
