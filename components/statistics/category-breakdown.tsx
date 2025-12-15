'use client';

import React, { useState, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryData {
  month: string;
  categoryId: string;
  categoryName: string;
  type: string; // 'INCOME' | 'EXPENSE'
  userId: string;
  userName: string;
  amount: number;
}

interface CategoryBreakdownProps {
  data: CategoryData[];
  months: string[]; // Available months
}

export function CategoryBreakdown({ data, months }: CategoryBreakdownProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(months[0] || '');
  const [groupBy, setGroupBy] = useState<'category' | 'user'>('category');

  const filteredData = useMemo(() => {
    const monthData = data.filter(item => item.month === selectedMonth);
    
    // Aggregate data based on grouping
    const aggregatedMap = new Map<string, { name: string; value: number; type: string }>();

    monthData.forEach(item => {
      const key = groupBy === 'category' 
        ? `${item.type}|${item.categoryName}` 
        : `${item.type}|${item.userName}`;
      
      const name = groupBy === 'category' ? item.categoryName : item.userName;
      
      if (!aggregatedMap.has(key)) {
        aggregatedMap.set(key, { name, value: 0, type: item.type });
      }
      
      const current = aggregatedMap.get(key)!;
      current.value += item.amount;
    });

    return Array.from(aggregatedMap.values());
  }, [data, selectedMonth, groupBy]);

  const incomeData = filteredData
    .filter(item => item.type === 'INCOME')
    .map(item => ({ name: item.name, value: item.value }));

  const expenseData = filteredData
    .filter(item => item.type === 'EXPENSE')
    .map(item => ({ name: item.name, value: item.value }));

  const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0);
  const totalExpense = expenseData.reduce((sum, item) => sum + item.value, 0);
  const netIncome = totalIncome - totalExpense;

  const getPieOption = (title: string, data: { name: string; value: number }[]) => ({
    title: {
      text: title,
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: title,
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-card p-4 rounded-lg border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">月份:</span>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="选择月份" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">分组:</span>
            <Select value={groupBy} onValueChange={(v: 'category' | 'user') => setGroupBy(v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="分组方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">按分类</SelectItem>
                <SelectItem value="user">按成员</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">该月净收益</p>
          <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {netIncome >= 0 ? '+' : ''}{netIncome.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>收入分布</span>
              <span className="text-green-600">+{totalIncome.toFixed(2)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incomeData.length > 0 ? (
              <ReactECharts option={getPieOption('收入来源', incomeData)} style={{ height: '300px' }} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">暂无收入数据</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>支出分布</span>
              <span className="text-red-600">-{totalExpense.toFixed(2)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenseData.length > 0 ? (
              <ReactECharts option={getPieOption('支出去向', expenseData)} style={{ height: '300px' }} />
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">暂无支出数据</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
