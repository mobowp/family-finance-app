'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendChart } from "./trend-chart";
import { CategoryBreakdown } from "./category-breakdown";

interface StatisticsDashboardProps {
  monthlyStats: {
    month: string;
    income: number;
    expense: number;
    net: number;
  }[];
  categoryStats: {
    month: string;
    categoryId: string;
    categoryName: string;
    type: string;
    userId: string;
    userName: string;
    amount: number;
  }[];
}

export function StatisticsDashboard({ monthlyStats, categoryStats }: StatisticsDashboardProps) {
  const months = monthlyStats.map(m => m.month).sort().reverse(); // Descending for selector

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">月度概览</TabsTrigger>
          <TabsTrigger value="details">分类详情</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>月度收支趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendChart data={monthlyStats} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>月度收支明细</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="h-12 px-4 font-medium text-muted-foreground">月份</th>
                      <th className="h-12 px-4 font-medium text-muted-foreground text-right">收入</th>
                      <th className="h-12 px-4 font-medium text-muted-foreground text-right">支出</th>
                      <th className="h-12 px-4 font-medium text-muted-foreground text-right">净收益</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...monthlyStats].reverse().map((stat) => (
                      <tr key={stat.month} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium">{stat.month}</td>
                        <td className="p-4 text-right text-green-600 font-mono">+{stat.income.toFixed(2)}</td>
                        <td className="p-4 text-right text-red-600 font-mono">-{stat.expense.toFixed(2)}</td>
                        <td className={`p-4 text-right font-mono font-bold ${stat.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                          {stat.net >= 0 ? '+' : ''}{stat.net.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <CategoryBreakdown data={categoryStats} months={months} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
