'use client';

import { Card } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useAccessToken from '@/hooks/useAccessToken';
import { ResponsivePie } from '@nivo/pie';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';

type ChartData = {
  id: string;
  label: string;
  value: number;
};

export default function DoctorsCompletedAppointmentsChart() {
  const [currentTab, setCurrentTab] = useState<string | undefined>('week');
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });
  const [data, setDate] = useState<ChartData[]>([]);

  const { resolvedTheme } = useTheme();

  const accessToken = useAccessToken();
  const { data: chartData } = useQuery({
    queryKey: [
      `doctors_appointments_chart_${dateRange?.from?.toISOString()}_end_${dateRange?.to?.toISOString()}_`,
    ],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboards/doctors/appointments?${dateRange?.from ? `startDate=${dateRange?.from?.toISOString()}&` : ''}${dateRange?.to ? `endDate=${dateRange?.to?.toISOString()}` : ''}`,
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
    }
  }, [chartData]);

  return (
    <Card>
      <div className="px-4 py-4">
        <h2 className="mb-4 text-center text-xl font-bold">
          Doctors Completed Appointments Distribution
        </h2>
        <div className="flex flex-col gap-2">
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

      <div className="h-[350px]">
        <ResponsivePie
          data={data}
          margin={{ top: 20, right: 60, bottom: 20, left: 0 }}
          innerRadius={0.5}
          padAngle={0.2}
          cornerRadius={0}
          colors={{ scheme: 'category10' }}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
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
