'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Info, Pencil, Plus } from 'lucide-react';

import NewPrescriptionButton from './NewPrescriptionButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReportItemSkeleton from '@/components/skeletons/ReportItemSkeleton';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';

import type { Prescription } from '@/types/appointments.type';
import PrescriptionItem from '@/components/lists/PrescriptionItem';

interface AppointmentPrescriptionsProps {
  appointmentId: string;
}

export default function AppointmentPrescriptions({
  appointmentId,
}: AppointmentPrescriptionsProps) {
  const accessToken = useAccessToken();
  const { role } = useUserRole();

  const { data: prescriptions, isLoading } = useQuery({
    queryKey: [`prescriptions_${appointmentId}`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}/prescriptions`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Prescription[];
    },
    enabled: !!accessToken,
  });

  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-0">
        <span className="text-xl font-semibold text-primary">
          Appointment Prescriptions
        </span>

        {role === 'doctor' && (
          <NewPrescriptionButton appointmentId={appointmentId} />
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ReportItemSkeleton key={index} />
          ))}
        {prescriptions &&
          prescriptions.length > 0 &&
          prescriptions.map((prescription) => (
            <PrescriptionItem
              key={prescription.id}
              prescription={prescription}
            />
          ))}
      </div>
    </div>
  );
}
