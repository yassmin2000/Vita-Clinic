'use client';

import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Info, Pencil, Plus } from 'lucide-react';

import NewTreatmentButton from './NewTreatmentButton';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
            <Card
              key={treatment.id}
              className="col-span-1 divide-y divide-accent rounded-lg transition-all hover:shadow-lg dark:shadow-white/10"
            >
              <div className="truncate px-4 pt-6">
                <div className="flex flex-col gap-0.5">
                  <h3 className="truncate text-lg font-medium">
                    {treatment.name} - {treatment.therapy.name}
                  </h3>
                  <span className="mt-0.5 truncate">
                    Dosage: {treatment.dosage} {treatment.therapy.unit} for{' '}
                    {treatment.duration} Cycles
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-6 px-6 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {format(new Date(treatment.createdAt), 'dd MMM yyyy')}
                </div>
                <span />

                <div className="flex gap-1">
                  {role && role === 'doctor' && (
                    <Button size="sm">
                      <Pencil className="h-4 w-4 sm:mr-2" />
                      <span className="sr-only sm:not-sr-only">Edit</span>
                    </Button>
                  )}
                  {role && role !== 'doctor' && (
                    <Button size="sm">
                      <Info className="h-4 w-4 sm:mr-2" />
                      <span className="sr-only sm:not-sr-only">Details</span>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
}