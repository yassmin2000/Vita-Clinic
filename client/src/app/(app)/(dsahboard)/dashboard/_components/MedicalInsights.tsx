'use client';

import { Card } from '@/components/ui/card';
import useAccessToken from '@/hooks/useAccessToken';
import { ResponsiveBar } from '@nivo/bar';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

type ChartData = {
  name: string;
  count: number;
};

type ChartsData = {
  diagnoses: ChartData[];
  medications: ChartData[];
  surgeries: ChartData[];
  allergies: ChartData[];
};

const columns = [
  {
    title: 'Most Common Diagnoses',
    field: 'diagnoses',
  },
  {
    title: 'Most Common Medications',
    field: 'medications',
  },
  {
    title: 'Most Common Surgeries',
    field: 'surgeries',
  },
  {
    title: 'Most Common Allergies',
    field: 'allergies',
  },
] as const;

export default function MedicalInsights() {
  const { resolvedTheme } = useTheme();
  const [data, setData] = useState<ChartsData>({
    diagnoses: [],
    medications: [],
    surgeries: [],
    allergies: [],
  });

  const accessToken = useAccessToken();
  const { data: chartData } = useQuery({
    queryKey: [`medical_insights`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboards/insights/medical`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as ChartsData;
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (chartData) {
      setData(chartData);
    }
  }, [chartData]);

  return (
    <div className="flex w-full flex-col gap-4 md:grid md:grid-cols-2">
      {columns.map((column) => (
        <Card key={column.title}>
          <div className="px-4 py-4">
            <h2 className="text-center text-xl font-bold">{column.title}</h2>
          </div>
          <div className="h-[400px]">
            <ResponsiveBar
              data={data[column.field].toReversed()}
              keys={['count']}
              indexBy="name"
              margin={{ top: 20, right: 60, bottom: 50, left: 120 }}
              padding={0.3}
              layout="horizontal"
              colors={{ scheme: 'category10' }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              animate={true}
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
                    borderColor:
                      resolvedTheme === 'dark' ? '#1e293b' : '#e2e8f0',
                  },
                },
              }}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
