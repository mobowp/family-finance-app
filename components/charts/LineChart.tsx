'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';

interface LineChartProps {
  dates: string[];
  incomes: number[];
  expenses: number[];
}

export function LineChart({ dates, incomes, expenses }: LineChartProps) {
  const option = {
    title: {
      text: '收支趋势',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['收入', '支出'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '收入',
        type: 'line',
        data: incomes,
        itemStyle: { color: '#10B981' }, // green
        areaStyle: { opacity: 0.1, color: '#10B981' },
      },
      {
        name: '支出',
        type: 'line',
        data: expenses,
        itemStyle: { color: '#EF4444' }, // red
        areaStyle: { opacity: 0.1, color: '#EF4444' },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '300px' }} />;
}
