'use client';

import { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useTheme } from 'next-themes';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import type { DateRange } from 'react-day-picker';

import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRangePicker } from '@/components/ui/date-range-picker';

import useAccessToken from '@/hooks/useAccessToken';

type ChartsData = {
  id: string;
  data: {
    x: string;
    y: number;
  }[];
};

export default function InvoicesChart() {
  const [isArea, setIsArea] = useState(true);
  const [currentTab, setCurrentTab] = useState<string | undefined>('week');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [data, setDate] = useState<ChartsData[]>([]);

  const { resolvedTheme } = useTheme();

  const accessToken = useAccessToken();
  const { data: chartsData } = useQuery({
    queryKey: [
      `invoices_start_${dateRange?.from?.toISOString()}_end_${dateRange?.to?.toISOString()}_`,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboards/invoices?${dateRange?.from ? `startDate=${dateRange?.from?.toISOString()}&` : ''}${dateRange?.to ? `endDate=${dateRange?.to?.toISOString()}` : ''}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as ChartsData[];
    },
    enabled: !!accessToken,
  });

  useEffect(() => {
    if (chartsData && chartsData.length > 0) {
      setDate(chartsData);
    }
  }, [chartsData]);

  const daysCount =
    dateRange && dateRange.from && dateRange.to
      ? Math.ceil(
          (dateRange?.to?.getTime() - dateRange?.from?.getTime()) /
            (1000 * 3600 * 24 * 6)
        )
      : 5;

  return (
    <Card className="py-2">
      <div className="px-4 py-2">
        <h2 className="mb-2 text-center text-xl font-bold">Invoices Chart</h2>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="area">
            <TabsList className="flex h-full w-fit flex-wrap justify-start gap-0.5">
              <TabsTrigger value="line" onClick={() => setIsArea(false)}>
                Line
              </TabsTrigger>
              <TabsTrigger value="area" onClick={() => setIsArea(true)}>
                Area
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs value={currentTab} onValueChange={(tab) => setCurrentTab(tab)}>
            <TabsList className="flex h-full w-fit flex-wrap justify-start gap-0.5">
              <TabsTrigger
                value="week"
                onClick={() => {
                  setDateRange({
                    from: new Date(
                      new Date().setDate(new Date().getDate() - 7)
                    ),
                    to: new Date(),
                  });
                }}
              >
                Last Week
              </TabsTrigger>
              <TabsTrigger
                value="month"
                onClick={() => {
                  setDateRange({
                    from: new Date(
                      new Date().setMonth(new Date().getMonth() - 1)
                    ),
                    to: new Date(),
                  });
                }}
              >
                Last Month
              </TabsTrigger>
              <TabsTrigger
                value="threeMonths"
                onClick={() => {
                  setDateRange({
                    from: new Date(
                      new Date().setMonth(new Date().getMonth() - 3)
                    ),
                    to: new Date(),
                  });
                }}
              >
                Last 3 Months
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DateRangePicker
            values={dateRange}
            onValuesChanged={(date) => {
              setCurrentTab(undefined);
              setDateRange(date);
            }}
          />
        </div>
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
              ? ['#15803d', '#c2410c', '#991b1b']
              : ['#22c55e', '#f97516', '#ef4444']
          }
          enablePoints={false}
          enableArea={isArea}
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
