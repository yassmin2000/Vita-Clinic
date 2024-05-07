'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Edit, Plus, Save, Trash } from 'lucide-react';

import PatientSurgeriesForm from './PatientSurgeriesForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';

import type { PatientSurgery } from '@/types/emr.type';

export type PatientSurgeryField = PatientSurgery & {
  isNew?: boolean;
  isUpdated?: boolean;
  isDeleted?: boolean;
};

interface PatientSurgeriesProps {
  patientId: string;
  patientSurgeries: PatientSurgery[];
}

export default function PatientSurgeries({
  patientId,
  patientSurgeries,
}: PatientSurgeriesProps) {
  const [surgeries, setSurgeries] = useState<PatientSurgeryField[]>([
    ...patientSurgeries,
  ]);
  const [currentSurgery, setCurrentSurgery] =
    useState<PatientSurgeryField | null>(null);
  const { toast } = useToast();
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

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
          Manage all the surgeries of the patient.
        </h3>
      </div>
      <PatientSurgeriesForm
        patientSurgeries={surgeries}
        setSurgeries={setSurgeries}
        currentSurgery={currentSurgery}
        setCurrentSurgery={setCurrentSurgery}
      />
      <Separator />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {surgeries
          .filter((surgery) => !surgery.isDeleted)
          .map((surgery) => (
            <Card
              key={surgery.surgeryId}
              className="col-span-1 rounded-lg transition-all"
            >
              <div className="truncate px-4 pt-6">
                <div className="flex flex-col gap-0.5">
                  <h3 className="truncate text-lg font-medium">
                    {surgery.surgery.name}
                  </h3>
                  {surgery.date && (
                    <span className="mt-0.5 truncate">
                      Performed at:{' '}
                      {format(new Date(surgery.date), 'dd MMM yyyy')}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {format(new Date(surgery.createdAt), 'dd MMM yyyy')}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={currentSurgery?.id === surgery.id || isPending}
                    onClick={() => setCurrentSurgery(surgery)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={currentSurgery?.id === surgery.id || isPending}
                    onClick={() => {
                      if (surgery.id === currentSurgery?.id) {
                        setCurrentSurgery(null);
                      }

                      setSurgeries((prev) =>
                        prev.map((diag) =>
                          diag.id === surgery.id
                            ? { ...diag, isDeleted: true }
                            : diag
                        )
                      );
                    }}
                  >
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </div>

      <Button
        onClick={() => mutatePatientSurgeries()}
        disabled={isPending}
        className="flex w-full items-center gap-2 sm:w-[100px]"
      >
        <Save className="h-5 w-5" /> Save
      </Button>
    </div>
  );
}
