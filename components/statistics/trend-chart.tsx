'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';

interface TrendChartProps {
  data: {
    month: string;
    income: number;
    expense: number;
    net: number;
  }[];
}

export function TrendChart({ data }: TrendChartProps) {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    toolbox: {
      feature: {
        magicType: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      data: ['收入', '支出', '净收益']
    },
    xAxis: [
      {
        type: 'category',
        data: data.map(item => item.month),
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '金额',
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '收入',
        type: 'bar',
        itemStyle: { color: '#10B981' }, // Green
        data: data.map(item => item.income)
      },
      {
        name: '支出',
        type: 'bar',
        itemStyle: { color: '#EF4444' }, // Red
        data: data.map(item => item.expense)
      },
      {
        name: '净收益',
        type: 'line',
        itemStyle: { color: '#3B82F6' }, // Blue
        lineStyle: { width: 3 },
        data: data.map(item => item.net)
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '400px' }} />;
}
