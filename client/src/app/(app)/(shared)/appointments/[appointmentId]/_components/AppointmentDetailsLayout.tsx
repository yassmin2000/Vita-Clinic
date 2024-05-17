'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import AppointmentDetailsCard from './AppointmentDetailsCard';
import AppointmentReports from './AppointmentReports';
import AppointmentScans from './AppointmentScans';
import AppointmentPrescriptions from './AppointmentPrescriptions';
import { Separator } from '@/components/ui/separator';
import AppointmentDetailsCardSkeleton from './AppointmentDetailsCardSkeleton';
import AppointmentTreatments from './AppointmentTreatments';
import AppointmentTestResults from './AppointmentTestResults';

import useAccessToken from '@/hooks/useAccessToken';
import type { AppointmentDetails } from '@/types/appointments.type';

interface AppointmentDetailsLayoutProps {
  appointmentId: string;
}

export default function AppointmentDetailsLayout({
  appointmentId,
}: AppointmentDetailsLayoutProps) {
  const accessToken = useAccessToken();

  const { data: appointment, isLoading } = useQuery({
    queryKey: [`appointment_${appointmentId}`],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointmentId}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data as AppointmentDetails;
    },
    enabled: !!accessToken,
  });

  return (
    <div className="flex flex-col gap-6">
      {isLoading && <AppointmentDetailsCardSkeleton />}
      {appointment && !isLoading && (
        <AppointmentDetailsCard appointment={appointment} />
      )}

      {appointment &&
        !isLoading &&
        (appointment.status === 'approved' ||
          appointment.status === 'completed') && (
          <>
            <AppointmentReports appointmentId={appointmentId} />
            <Separator className="my-1" />
            <AppointmentScans id={appointmentId} />
            <Separator className="my-1" />
            <AppointmentPrescriptions appointmentId={appointmentId} />
            <Separator className="my-1" />
            <AppointmentTreatments appointmentId={appointmentId} />
            <Separator className="my-1" />
            <AppointmentTestResults appointmentId={appointmentId} />
          </>
        )}
    </div>
  );
}
