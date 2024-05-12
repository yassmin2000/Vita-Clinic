'use client';

import { Card } from '@/components/ui/card';
import useAccessToken from '@/hooks/useAccessToken';
import { ResponsiveBar } from '@nivo/bar';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type ChartData = {
  ageGroup: string;
  male: number;
  female: number;
};

export default function PatientsAgeSexDistributionChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const { resolvedTheme } = useTheme();

  const accessToken = useAccessToken();
  const { data: chartsData } = useQuery({
    queryKey: [`patients_age_sex`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboards/patients`,
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
    if (chartsData) {
      setData(chartsData);
    }
  }, [chartsData]);

  return (
    <Card className="py-2">
      <div className="px-4 py-2">
        <h2 className="mb-2 text-center text-xl font-bold">
          Patients Age & Sex Distribution
        </h2>
      </div>
      <div className="h-[400px]">
        <ResponsiveBar
          data={data}
          keys={['male', 'female']}
          indexBy="ageGroup"
          margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
          padding={0.2}
          groupMode="grouped"
          colors={
            resolvedTheme === 'dark'
              ? ['#3b83f6', '#f472b6']
              : ['#3b83f6', '#f472b6']
          }
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Age Group',
            legendPosition: 'middle',
            legendOffset: 36,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Number of Patients',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          animate={true}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'top-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
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
