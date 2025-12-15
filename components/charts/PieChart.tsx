'use client';

import React from 'react';
import ReactECharts from 'echarts-for-react';

interface PieChartProps {
  data: { name: string; value: number }[];
  title: string;
}

export function PieChart({ data, title }: PieChartProps) {
  const option = {
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
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
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: '300px' }} />;
}
