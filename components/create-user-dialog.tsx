'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { createUser } from "@/app/actions/user";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> 代创建成员
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>代创建家庭成员</DialogTitle>
          <DialogDescription>
            为没有邮箱或不便操作的老人/儿童创建账号。默认密码为 "password"。
          </DialogDescription>
        </DialogHeader>
        <form 
          action={async (formData) => {
            try {
              setIsLoading(true);
              await createUser(formData);
              toast({
                title: "创建成功",
                description: "用户已成功创建",
              });
              setOpen(false);
            } catch (error) {
              toast({
                title: "创建失败",
                description: error instanceof Error ? error.message : "发生未知错误",
                variant: "destructive",
              });
            } finally {
              setIsLoading(false);
            }
          }}
          className="space-y-4 py-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input id="name" name="name" placeholder="例如：张三" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" name="email" type="email" placeholder="zhangsan@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">角色</Label>
            <Select name="role" defaultValue="USER">
              <SelectTrigger>
                <SelectValue placeholder="选择角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">普通用户</SelectItem>
                <SelectItem value="ADMIN">管理员</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">初始密码</Label>
            <Input id="password" name="password" type="text" defaultValue="password" required />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "创建中..." : "创建用户"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
