'use client';

import { useEffect, useState } from 'react';
import { ResponsiveCalendar } from '@nivo/calendar';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from 'next-themes';

import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import useAccessToken from '@/hooks/useAccessToken';

export default function AppointmentsCalendarChart() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [status, setStatus] = useState('completed');
  const { resolvedTheme } = useTheme();

  const accessToken = useAccessToken();
  const { data: chartData } = useQuery({
    queryKey: [`appointments_year_${year}_status_${status}`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboards/appointments?year=${year}&status=${status}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data;
    },
    enabled: !!accessToken,
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    if (chartData) {
      setData(chartData);
    }
  }, [chartData]);

  return (
    <Card>
      <div className="px-4 pt-4">
        <h2 className="mb-4 text-center text-xl font-bold">
          Appointments Per Day
        </h2>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[200px] bg-background">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={`${year}`}
            onValueChange={(value) => setYear(Number(value))}
          >
            <SelectTrigger className="w-[200px] bg-background">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {Array.from(
                { length: new Date().getFullYear() - 2019 },
                (_, i) => (
                  <SelectItem
                    key={i}
                    value={String(new Date().getFullYear() - i)}
                  >
                    {new Date().getFullYear() - i}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="h-[250px]">
        <ResponsiveCalendar
          data={data}
          from={`${year}-01-01`}
          to={`${year}-12-31`}
          emptyColor={resolvedTheme === 'dark' ? '#161B22' : '#EBEDF0'}
          colors={
            resolvedTheme === 'dark'
              ? ['#0E4429', '#006D32', '#26A641', '#39D353']
              : ['#9BE9A8', '#40C463', '#30A14E', '#216E39']
          }
          margin={{ top: 0, right: 40, bottom: 0, left: 40 }}
          yearSpacing={40}
          monthBorderColor={resolvedTheme === 'dark' ? '#020817' : '#fff'}
          dayBorderWidth={4}
          dayBorderColor={resolvedTheme === 'dark' ? '#020817' : '#fff'}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'row',
              translateY: 0,
              itemCount: 4,
              itemWidth: 42,
              itemHeight: 36,
              itemDirection: 'right-to-left',
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
