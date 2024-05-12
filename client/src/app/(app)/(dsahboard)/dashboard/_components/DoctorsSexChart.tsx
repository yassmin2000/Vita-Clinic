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

export default function DoctorsSexChart() {
  const [data, setData] = useState<
    {
      id: string;
      label: string;
      value: number;
    }[]
  >([]);
  const { resolvedTheme } = useTheme();

  const accessToken = useAccessToken();
  const { data: chartsData } = useQuery({
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
    if (chartsData) {
      setData(
        chartsData.map((item) => ({
          id: capitalize(item.id),
          label: capitalize(item.id),
          value: item.value,
        }))
      );
    }
  }, [chartsData]);

  return (
    <Card className="py-2">
      <div className="px-4 py-2">
        <h1 className="text-center text-xl font-bold">
          Doctors Sex Distribution
        </h1>
        <div className="pointer-events-none flex items-center gap-2 opacity-0">
          <Tabs defaultValue="week">
            <TabsList className="flex h-full w-fit flex-wrap justify-start gap-0.5">
              <TabsTrigger value="week">Last Week</TabsTrigger>
              <TabsTrigger value="month">Last Month</TabsTrigger>
              <TabsTrigger value="threeMonths">Last 3 Months</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
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
          padAngle={0.7}
          cornerRadius={3}
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
