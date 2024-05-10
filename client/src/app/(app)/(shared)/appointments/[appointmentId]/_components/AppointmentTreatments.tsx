'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import NewTreatmentButton from './NewTreatmentButton';
import TreatmentItem from '@/components/TreatmentItem';
import ReportItemSkeleton from '@/components/ReportItemSkeleton';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';

import type { Treatment } from '@/types/appointments.type';

interface AppointmentTreatmentsProps {
  appointmentId: string;
}

export default function AppointmentTreatments({
  appointmentId,
}: AppointmentTreatmentsProps) {
  const accessToken = useAccessToken();
  const { role } = useUserRole();

  const { data: treatments, isLoading } = useQuery({
    queryKey: [`treatments_${appointmentId}`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}/treatments`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as Treatment[];
    },
    enabled: !!accessToken,
  });

  return (
    <div className="flex flex-col gap-4 px-6">
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold text-primary">
          Appointment Treatments
        </span>

        {role === 'doctor' && (
          <NewTreatmentButton appointmentId={appointmentId} />
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <ReportItemSkeleton key={index} />
          ))}
        {treatments &&
          treatments.length > 0 &&
          treatments.map((treatment) => (
            <TreatmentItem key={treatment.id} treatment={treatment} />
          ))}
      </div>
    </div>
  );
}
