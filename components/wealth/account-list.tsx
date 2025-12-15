'use client';

import Link from "next/link";
import { Plus, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AccountCard } from "./account-card";

interface AccountListProps {
  accounts: any[];
  users?: { id: string; name: string | null; email: string }[];
  isVisible?: boolean;
}

export function AccountList({ accounts, users = [], isVisible = true }: AccountListProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("all");

  const formatCurrency = (value: number) => {
    if (!isVisible) return '******';
    return value.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
  };

  const filteredAccounts = selectedUserId === "all" 
    ? accounts 
    : accounts.filter(account => account.userId === selectedUserId);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">账户列表</h2>
          <p className="text-muted-foreground mt-1">管理您的所有资金账户及余额</p>
        </div>
        <div className="flex gap-4">
          {users.length > 0 && (
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="筛选归属人" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部用户</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Link href="/accounts/create">
            <Button className="gap-2 shadow-lg">
              <Plus className="h-4 w-4" /> 添加账户
            </Button>
          </Link>
        </div>
      </div>
      
      {filteredAccounts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
             <CreditCard className="h-12 w-12 mb-4 opacity-20" />
             <p>暂无账户，请添加您的第一个账户。</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAccounts.map((account) => (
            <AccountCard 
              key={account.id} 
              account={account} 
              formatCurrency={formatCurrency} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
