'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import AppointmentDetailsCard from './AppointmentDetailsCard';
import AppointmentReports from './AppointmentReports';
import AppointmentScans from './AppointmentScans';
import { Separator } from '@/components/ui/separator';
import AppointmentDetailsCardSkeleton from './AppointmentDetailsCardSkeleton';

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
        <AppointmentDetailsCard
          id={appointmentId}
          appointmentNumber={appointment.number}
          status={appointment.status}
          doctorId={appointment.doctor?.id}
          doctorName={
            appointment.doctor
              ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
              : undefined
          }
          patientId={appointment.patient.id}
          patientName={`${appointment.patient.firstName} ${appointment.patient.lastName}`}
          date={appointment.date}
          cancelledDate={appointment.updatedAt}
          serviceName={appointment.services.service?.name}
          therapyName={appointment.services.therapy?.name}
          serviceScans={appointment.services.scans.map((scan) => scan.name)}
          serviceLabWorks={appointment.services.labWorks.map(
            (laboratoryTest) => laboratoryTest.name
          )}
          billingNumber={appointment.billing.number}
          billingStatus={appointment.billing.status}
          billingAmount={appointment.billing.amount}
        />
      )}

      {appointment && !isLoading && (
        <AppointmentReports appointmentId={appointmentId} />
      )}
      {appointment && !isLoading && (
        <>
          <Separator className="my-1" />

          <AppointmentScans id={appointmentId} />
        </>
      )}
    </div>
  );
}
