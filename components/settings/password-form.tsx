'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/app/actions/settings";
import { useState } from "react";

export function PasswordForm() {
  const [loading, setLoading] = useState(false);

  return (
    <form 
      action={async (formData) => {
        setLoading(true);
        await changePassword(formData);
        setLoading(false);
        alert("密码已修改");
      }} 
      className="space-y-4 max-w-md"
    >
      <div className="space-y-2">
        <Label htmlFor="currentPassword">当前密码</Label>
        <Input id="currentPassword" name="currentPassword" type="password" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">新密码</Label>
        <Input id="newPassword" name="newPassword" type="password" required />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "修改中..." : "修改密码"}
      </Button>
    </form>
  );
}
