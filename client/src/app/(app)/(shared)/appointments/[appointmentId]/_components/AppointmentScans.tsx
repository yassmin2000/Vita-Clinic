'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import ScanItem from '@/components/lists/ScanItem';
import NewScanButton from './NewScanButton';
import ScanItemSkeleton from '@/components/skeletons/ScanItemSkeleton';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';

import type { Scan } from '@/types/appointments.type';

interface AppointmentScansProps {
  id: string;
}

export default function AppointmentScans({ id }: AppointmentScansProps) {
  const accessToken = useAccessToken();
  const { role } = useUserRole();

  const { data: scans, isLoading } = useQuery({
    queryKey: [`scans_${id}`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${id}/scans`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Scan[];
    },
    enabled: !!accessToken,
  });

  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold text-primary">
          Appointment Scans
        </span>

        {role === 'doctor' && <NewScanButton appointmentId={id} />}
      </div>
      <div className="grid grid-cols-1 gap-6 divide-y divide-accent md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ScanItemSkeleton key={index} />
          ))}
        {scans &&
          scans.length > 0 &&
          scans.map((scan) => <ScanItem key={scan.id} scan={scan} />)}
      </div>
    </div>
  );
}
