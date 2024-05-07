'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';

import PatientSurgeriesForm from './PatientSurgeriesForm';
import PatientSurgeryItem from './PatientSurgeryItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';

import type { PatientSurgery } from '@/types/emr.type';

export type PatientSurgeryField = PatientSurgery & {
  isNew?: boolean;
  isUpdated?: boolean;
  isDeleted?: boolean;
};

interface PatientSurgeriesProps {
  patientId: string;
  patientSurgeries: PatientSurgery[];
  view?: boolean;
}

export default function PatientSurgeries({
  patientId,
  patientSurgeries,
  view = false,
}: PatientSurgeriesProps) {
  const [surgeries, setSurgeries] = useState<PatientSurgeryField[]>([
    ...patientSurgeries,
  ]);
  const [currentSurgery, setCurrentSurgery] =
    useState<PatientSurgeryField | null>(null);

  const accessToken = useAccessToken();
  const { role } = useUserRole();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: mutatePatientSurgeries, isPending } = useMutation({
    mutationFn: async () => {
      const body = {
        surgeries: {
          deleted: surgeries
            .filter((surgery) => !surgery.isNew && surgery.isDeleted)
            .map((surgery) => surgery.surgeryId),
          new: surgeries
            .filter((surgery) => surgery.isNew && !surgery.isDeleted)
            .map((surgery) => ({
              surgeryId: surgery.surgeryId,
              notes: surgery.notes,
              date: surgery.date,
            })),
          updated: surgeries
            .filter(
              (surgery) =>
                surgery.isUpdated && !surgery.isNew && !surgery.isDeleted
            )
            .map((surgery) => ({
              surgeryId: surgery.surgeryId,
              notes: surgery.notes,
              date: surgery.date,
            })),
        },
      };

      return await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/emr/${patientId}`,
        body,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    onError: () => {
      return toast({
        title: `Failed to update patient's surgeries`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`emr_${patientId}`],
      });

      return toast({
        title: `Patient's surgeries updated successfully`,
        description: `Patient's surgeries have been updated successfuly.`,
      });
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-primary">
          Patient Surgeries
        </h2>
        <h3 className="text-sm text-muted-foreground">
          {view
            ? role === 'patient'
              ? 'View your surgeries information.'
              : 'View the surgeries information of the patient.'
            : 'Manage all the surgeries of the patient.'}{' '}
        </h3>
      </div>
      {!view && (
        <>
          <PatientSurgeriesForm
            patientSurgeries={surgeries}
            setSurgeries={setSurgeries}
            currentSurgery={currentSurgery}
            setCurrentSurgery={setCurrentSurgery}
          />
          <Separator />
        </>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {surgeries
          .filter((surgery) => !surgery.isDeleted)
          .map((surgery) => (
            <PatientSurgeryItem
              key={surgery.id}
              surgery={surgery}
              isEditDisabled={currentSurgery?.id === surgery.id || isPending}
              onEdit={() => setCurrentSurgery(surgery)}
              isDeleteDisabled={currentSurgery?.id === surgery.id || isPending}
              onDelete={() => {
                if (surgery.id === currentSurgery?.id) {
                  setCurrentSurgery(null);
                }

                setSurgeries((prev) =>
                  prev.map((diag) =>
                    diag.id === surgery.id ? { ...diag, isDeleted: true } : diag
                  )
                );
              }}
              view={view}
            />
          ))}
      </div>

      {!view && (
        <Button
          onClick={() => mutatePatientSurgeries()}
          disabled={isPending}
          className="flex w-full items-center gap-2 sm:w-[100px]"
        >
          <Save className="h-5 w-5" /> Save
        </Button>
      )}
    </div>
  );
}
