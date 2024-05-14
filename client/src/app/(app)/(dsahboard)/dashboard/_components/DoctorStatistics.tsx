'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import useAccessToken from '@/hooks/useAccessToken';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Cable,
  Calendar,
  Check,
  CheckCheck,
  ClipboardPlus,
  HomeIcon,
  Timer,
  User,
  X,
} from 'lucide-react';

const stats = [
  {
    icon: User,
    name: 'Patients',
    textColor: 'text-emerald-700',
    backgroundColor: 'bg-emerald-700/10',
    field: 'patientsCount',
  },
  {
    icon: Calendar,
    name: 'Upcoming Appointments',
    textColor: 'text-cyan-700',
    backgroundColor: 'bg-cyan-700/10',
    field: 'appointmentsCount',
  },
  {
    icon: Cable,
    name: 'Devices',
    textColor: 'text-amber-500',
    backgroundColor: 'bg-amber-500/10',
    field: 'devicesCount',
  },
] as const;

export default function DoctorStatistics() {
  const accessToken = useAccessToken();

  const { data, isLoading } = useQuery({
    queryKey: [`statistics_general`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/dashboards/general`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as {
        patientsCount: number;
        appointmentsCount: number;
        devicesCount: number;
      };
    },
    enabled: !!accessToken,
  });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {stats.map((item) => (
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
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {data[item.field]}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
