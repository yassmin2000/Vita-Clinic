'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useAccessToken from '@/hooks/useAccessToken';
import { capitalize } from '@/lib/utils';
import { ResponsivePie } from '@nivo/pie';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type ChartData = {
  id: string;
  label: string;
  value: number;
};

export default function DoctorsSexChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const { resolvedTheme } = useTheme();

  const accessToken = useAccessToken();
  const { data: chartData } = useQuery({
    queryKey: [`doctors_sex`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboards/doctors`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as { id: string; value: number }[];
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (chartData) {
      setData(
        chartData.map((item) => ({
          id: capitalize(item.id),
          label: capitalize(item.id),
          value: item.value,
        }))
      );
    }
  }, [chartData]);

  return (
    <Card className="flex h-full flex-col justify-center gap-4">
      <div className="px-4">
        <h2 className="text-center text-xl font-bold">
          Doctors Sex Distribution
        </h2>
      </div>
      <div className="h-[350px]">
        <ResponsivePie
          data={data}
          margin={{ top: 20, right: 60, bottom: 20, left: 0 }}
          colors={
            resolvedTheme === 'dark'
              ? ['#3b83f6', '#f472b6']
              : ['#3b83f6', '#f472b6']
          }
          innerRadius={0.5}
          padAngle={0.2}
          cornerRadius={0}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          sortByValue
          legends={[
            {
              anchor: 'top-right',
              direction: 'column',
              justify: false,
              translateX: 20,
              translateY: 0,
              itemsSpacing: 10,
              itemWidth: 100,
              itemHeight: 18,
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
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
