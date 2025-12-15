'use client';

import Link from "next/link";
import { Plus, TrendingUp, TrendingDown, DollarSign, Layers, Edit, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshAssetButton } from "./refresh-asset-button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AssetListProps {
  assets: any[];
  assetTypes?: any[];
  users?: { id: string; name: string | null; email: string }[];
  isVisible?: boolean;
}

export function AssetList({ assets, assetTypes = [], users = [], isVisible = true }: AssetListProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>("all");

  const formatCurrency = (value: number) => {
    if (!isVisible) return '******';
    return value.toLocaleString('zh-CN', { minimumFractionDigits: 2 });
  };

  const formatPercent = (value: number) => {
    if (!isVisible) return '***';
    return value.toFixed(2) + '%';
  };

  const filteredAssets = selectedUserId === "all" ? assets : assets.filter(asset => asset.userId === selectedUserId);

  const totalCost = filteredAssets.reduce((sum, asset) => sum + (asset.costPrice * asset.quantity), 0);
  const totalMarketValue = filteredAssets.reduce((sum, asset) => sum + ((asset.marketPrice || asset.costPrice) * asset.quantity), 0);
  const totalProfit = totalMarketValue - totalCost;
  const profitRate = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  const typeMap = assetTypes.reduce((acc, type) => {
    acc[type.code] = type.name;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">投资资产</h2>
          <p className="text-muted-foreground mt-1">实时追踪您的投资组合表现</p>
        </div>
        <div className="flex gap-2">
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
          <RefreshAssetButton />
          <Link href="/assets/create">
            <Button className="gap-2 shadow-md">
              <Plus className="h-4 w-4" /> 添加资产
            </Button>
          </Link>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> 总资产 (市值)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{formatCurrency(totalMarketValue)}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-gray-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4" /> 总投入成本
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">¥{formatCurrency(totalCost)}</div>
          </CardContent>
        </Card>
        <Card className={`border-l-4 shadow-sm ${totalProfit >= 0 ? 'border-l-red-500' : 'border-l-green-500'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {totalProfit >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />} 
              浮动盈亏
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
            </div>
          </CardContent>
        </Card>
        <Card className={`border-l-4 shadow-sm ${profitRate >= 0 ? 'border-l-red-500' : 'border-l-green-500'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
               收益率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitRate >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {profitRate >= 0 ? '+' : ''}{formatPercent(profitRate)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 资产列表 */}
      <Card className="shadow-sm border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
        <div className="overflow-x-auto">
          {filteredAssets.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
               <p>暂无资产数据</p>
               <Link href="/assets/create" className="mt-4 text-primary hover:underline">
                 添加您的第一项资产
               </Link>
             </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="h-12 px-4 font-medium text-muted-foreground">资产名称</th>
                  <th className="h-12 px-4 font-medium text-muted-foreground">类型</th>
                  <th className="h-12 px-4 font-medium text-muted-foreground text-right">持仓</th>
                  <th className="h-12 px-4 font-medium text-muted-foreground text-right">成本/现价</th>
                  <th className="h-12 px-4 font-medium text-muted-foreground text-right">市值</th>
                  <th className="h-12 px-4 font-medium text-muted-foreground text-right">盈亏</th>
                  <th className="h-12 px-4 font-medium text-muted-foreground text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => {
                  const marketPrice = asset.marketPrice || asset.costPrice;
                  const marketValue = marketPrice * asset.quantity;
                  const profit = marketValue - (asset.costPrice * asset.quantity);
                  const profitPercent = asset.costPrice > 0 ? (profit / (asset.costPrice * asset.quantity)) * 100 : 0;

                  return (
                    <tr key={asset.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-foreground">{asset.name}</div>
                        {asset.symbol && <div className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded w-fit mt-1">{asset.symbol}</div>}
                        {asset.user && (
                          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{asset.user.name || asset.user.email}</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-md border border-input bg-background px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm">
                          {typeMap[asset.type] || (
                            <>
                              {asset.type === 'STOCK' && '股票'}
                              {asset.type === 'FUND' && '基金'}
                              {asset.type === 'REAL_ESTATE' && '房产'}
                              {asset.type === 'GOLD' && '黄金'}
                              {asset.type === 'OTHER' && '其他'}
                              {!['STOCK', 'FUND', 'REAL_ESTATE', 'GOLD', 'OTHER'].includes(asset.type) && asset.type}
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono">{asset.quantity}</td>
                      <td className="p-4 text-right font-mono text-xs text-muted-foreground">
                        <div>C: ¥{formatCurrency(asset.costPrice)}</div>
                        <div>M: ¥{formatCurrency(marketPrice)}</div>
                      </td>
                      <td className="p-4 text-right font-bold font-mono">¥{formatCurrency(marketValue)}</td>
                      <td className="p-4 text-right">
                        <div className={`font-medium ${profit >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                        </div>
                        <div className={`text-xs ${profit >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatPercent(profitPercent)}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/assets/${asset.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
