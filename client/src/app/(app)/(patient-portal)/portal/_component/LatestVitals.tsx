'use client';

import { Icons } from '@/components/Icons';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import useAccessToken from '@/hooks/useAccessToken';
import { cn } from '@/lib/utils';
import { Vitals } from '@/types/appointments.type';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Gauge, HeartPulse, Thermometer } from 'lucide-react';

const vitals = [
  {
    icon: Thermometer,
    name: 'Temperature',
    textColor: 'text-rose-600',
    backgroundColor: 'bg-rose-600/10',
    field: 'temperature',
    unit: '°C',
  },
  {
    icon: HeartPulse,
    name: 'Heart Rate',
    textColor: 'text-cyan-700',
    backgroundColor: 'bg-cyan-700/10',
    field: 'heartRate',
    unit: 'bpm',
  },
  {
    icon: Icons.oxygen,
    name: 'Oxygen Saturation',
    textColor: 'text-amber-500',
    backgroundColor: 'bg-amber-500/10',
    field: 'oxygenSaturation',
    unit: '%',
  },
  {
    icon: Icons.lungs,
    name: 'Respiratory Rate',
    textColor: 'text-green-700',
    backgroundColor: 'bg-green-700/10',
    field: 'respiratoryRate',
    unit: 'bpm',
  },
  {
    icon: Gauge,
    name: 'Systolic Blood Pressure',
    textColor: 'text-blue-700',
    backgroundColor: 'bg-blue-700/10',
    field: 'systolicBloodPressure',
    unit: 'mmHg',
  },
  {
    icon: Gauge,
    name: 'Diastolic Blood Pressure',
    textColor: 'text-fuchsia-600',
    backgroundColor: 'bg-fuchsia-600/10',
    field: 'diastolicBloodPressure',
    unit: 'mmHg',
  },
] as const;

export default function LatestVitals() {
  const accessToken = useAccessToken();
  const { data, isLoading } = useQuery({
    queryKey: [`vitals_latest`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/vitals/latest`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Vitals;
    },
    enabled: !!accessToken,
  });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {vitals.map((item) => (
        <Card key={item.name} className="flex justify-between p-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'flex items-center justify-center rounded-full p-1.5',
                item.textColor,
                item.backgroundColor
              )}
            >
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {item.name}
              </p>
              {!data || isLoading ? (
                <Skeleton className="h-4 w-full" />
              ) : (
                <div className="-mt-0.5 flex gap-0.5">
                  <p className="text-2xl font-semibold text-foreground">
                    {data[item.field]}
                  </p>
                  <p className="mt-2.5 text-sm font-medium text-muted-foreground">
                    {item.unit}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
