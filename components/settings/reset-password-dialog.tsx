'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { KeyRound, Loader2 } from 'lucide-react';
import { resetUserPassword } from '@/app/actions/user';
import { useToast } from '@/hooks/use-toast';

interface ResetPasswordDialogProps {
  userId: string;
  userName: string;
}

export function ResetPasswordDialog({ userId, userName }: ResetPasswordDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get('newPassword') as string;

    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "密码无效",
        description: "密码长度至少需要6位",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      await resetUserPassword(userId, newPassword);
      toast({
        title: "重置成功",
        description: `已重置用户 ${userName} 的密码`,
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "重置失败",
        description: "发生未知错误，请稍后重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
          <KeyRound className="h-4 w-4" />
          <span className="sr-only">重置密码</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>重置密码</DialogTitle>
          <DialogDescription>
            正在为用户 <strong>{userName}</strong> 重置密码。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="请输入新密码"
                required
                minLength={6}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              确认重置
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
