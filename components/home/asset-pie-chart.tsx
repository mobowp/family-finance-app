'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useTheme } from 'next-themes';

interface AssetPieChartProps {
  data: { name: string; value: number }[];
}

export function AssetPieChart({ data }: AssetPieChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      borderColor: isDark ? '#374151' : '#e5e7eb',
      textStyle: {
        color: isDark ? '#f3f4f6' : '#1f2937',
      },
    },
    legend: {
      bottom: '0%',
      left: 'center',
      textStyle: {
        color: isDark ? '#9ca3af' : '#4b5563',
      },
    },
    series: [
      {
        name: '资产分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: isDark ? '#020617' : '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#000',
          },
        },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  };

  return (
    <div className="w-full h-[300px]">
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} theme={isDark ? 'dark' : undefined} />
    </div>
  );
}
