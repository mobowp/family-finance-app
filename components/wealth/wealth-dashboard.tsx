'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountList } from "@/components/wealth/account-list";
import { AssetList } from "@/components/wealth/asset-list";
import { Button } from "@/components/ui/button";

interface WealthDashboardProps {
  totalWealth: number;
  totalAccountBalance: number;
  totalAssetValue: number;
  accounts: any[];
  assets: any[];
  assetTypes: any[];
  users: any[];
  defaultTab: string;
}

export function WealthDashboard({
  totalWealth,
  totalAccountBalance,
  totalAssetValue,
  accounts,
  assets,
  assetTypes,
  users,
  defaultTab
}: WealthDashboardProps) {
  const [isVisible, setIsVisible] = useState(false);

  const formatCurrency = (value: number) => {
    if (!isVisible) return '******';
    return `¥${value.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">我的财富</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(!isVisible)}
            className="rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            {isVisible ? (
              <Eye className="h-5 w-5 text-muted-foreground" />
            ) : (
              <EyeOff className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        </div>
        
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-white/80 flex items-center gap-2">
              <Wallet className="h-5 w-5" /> 总资产净值
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-mono">
              {formatCurrency(totalWealth)}
            </div>
            <div className="mt-4 flex gap-8 text-sm">
              <div>
                <div className="text-white/60">资金账户</div>
                <div className="font-mono text-lg">{formatCurrency(totalAccountBalance)}</div>
              </div>
              <div>
                <div className="text-white/60">投资资产</div>
                <div className="font-mono text-lg">{formatCurrency(totalAssetValue)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="accounts">资金账户</TabsTrigger>
          <TabsTrigger value="assets">投资资产</TabsTrigger>
        </TabsList>
        <TabsContent value="accounts" className="mt-6">
          <AccountList accounts={accounts} users={users} isVisible={isVisible} />
        </TabsContent>
        <TabsContent value="assets" className="mt-6">
          <AssetList assets={assets} assetTypes={assetTypes} users={users} isVisible={isVisible} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
