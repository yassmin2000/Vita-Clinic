'use client';

import { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from 'next-themes';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { Card } from '@/components/ui/card';

import useAccessToken from '@/hooks/useAccessToken';

type ChartData = {
  id: string;
  data: {
    x: string;
    y: number;
  }[];
};

export default function VitalsChart() {
  const [data, setDate] = useState<ChartData[]>([]);
  const [daysCount, setDaysCount] = useState(7);

  const { resolvedTheme } = useTheme();

  const accessToken = useAccessToken();
  const { data: chartData } = useQuery({
    queryKey: ['vitals'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/vitals`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as ChartData[];
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      setDate(chartData);
      // Count the days between first and last entry
      const firstDate = new Date(chartData[0].data[0].x);
      const lastDate = new Date(
        chartData[0].data[chartData[0].data.length - 1].x
      );
      const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      console.log(diffDays);
      setDaysCount(Math.floor(diffDays / 10));
    }
  }, [chartData]);

  useEffect(() => {
    console.log(daysCount);
  }, [daysCount]);

  return (
    <Card>
      <div className="px-4 pb-2 pt-4">
        <h2 className="mb-4 text-center text-xl font-bold">
          Vital Signs Across Appointments
        </h2>
      </div>
      <div className="h-[400px]">
        <ResponsiveLine
          data={data}
          margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'time', format: '%Y-%m-%d', precision: 'day' }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: 'linear',
            min: 0,
            max: 'auto',
            stacked: true,
            reverse: false,
          }}
          curve="monotoneX"
          axisBottom={{
            format: '%b %d',
            tickValues: `every ${daysCount} days`,
            legend: 'Date',
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            legend: 'Price',
            format: (value) => `$${value}`,
            legendOffset: -50,
            legendPosition: 'middle',
          }}
          colors={
            resolvedTheme === 'dark'
              ? [
                  '#be123c',
                  '#0e7490',
                  '#d97706',
                  '#15803d',
                  '#1d4ed8',
                  '#a21caf',
                ]
              : [
                  '#e11d48',
                  '#0891b2',
                  '#f59e0b',
                  '#16a34a',
                  '#2563eb',
                  '#c026d3',
                ]
          }
          enablePoints={false}
          useMesh
          enableSlices="x"
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground:
                      resolvedTheme === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          theme={{
            text: {
              fill: resolvedTheme === 'dark' ? '#F8FAFC' : '#020817',
            },
            grid: {
              line: {
                stroke: resolvedTheme === 'dark' ? '#333' : '#ddd',
              },
            },
            axis: {
              ticks: {
                line: {
                  stroke: resolvedTheme === 'dark' ? '#ddd' : '#333',
                },
              },
              domain: {
                line: {
                  stroke: resolvedTheme === 'dark' ? '#ddd' : '#333',
                },
              },
            },
            tooltip: {
              container: {
                background: resolvedTheme === 'dark' ? '#020817' : '#fff',
                borderWidth: 1,
                borderColor: resolvedTheme === 'dark' ? '#1e293b' : '#e2e8f0',
              },
            },
          }}
        />
      </div>
    </Card>
  );
}
