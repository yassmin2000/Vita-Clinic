'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Edit, Plus, Save, Trash } from 'lucide-react';

import PatientMedicalConditionsForm from './PatientMedicalConditionsForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';

import type { PatientMedicalCondition } from '@/types/emr.type';

export type PatientMedicalConditionField = PatientMedicalCondition & {
  isNew?: boolean;
  isUpdated?: boolean;
  isDeleted?: boolean;
};

interface PatientMedicalConditionsProps {
  patientId: string;
  patientMedicalConditions: PatientMedicalCondition[];
}

export default function PatientMedicalConditions({
  patientId,
  patientMedicalConditions,
}: PatientMedicalConditionsProps) {
  const [medicalConditions, setMedicalConditions] = useState<
    PatientMedicalConditionField[]
  >([...patientMedicalConditions]);
  const [currentMedicalCondition, setCurrentMedicalCondition] =
    useState<PatientMedicalConditionField | null>(null);
  const { toast } = useToast();
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

  const { mutate: mutatePatientMedicalConditions, isPending } = useMutation({
    mutationFn: async () => {
      const body = {
        medicalConditions: {
          deleted: medicalConditions
            .filter(
              (medicalCondition) =>
                !medicalCondition.isNew && medicalCondition.isDeleted
            )
            .map((medicalCondition) => medicalCondition.medicalConditionId),
          new: medicalConditions
            .filter(
              (medicalCondition) =>
                medicalCondition.isNew && !medicalCondition.isDeleted
            )
            .map((medicalCondition) => ({
              medicalConditionId: medicalCondition.medicalConditionId,
              notes: medicalCondition.notes,
              date: medicalCondition.date,
            })),
          updated: medicalConditions
            .filter(
              (medicalCondition) =>
                medicalCondition.isUpdated &&
                !medicalCondition.isNew &&
                !medicalCondition.isDeleted
            )
            .map((medicalCondition) => ({
              medicalConditionId: medicalCondition.medicalConditionId,
              notes: medicalCondition.notes,
              date: medicalCondition.date,
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
        title: `Failed to update patient's medicalConditions`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`emr_${patientId}`],
      });

      return toast({
        title: `Patient's medicalConditions updated successfully`,
        description: `Patient's medicalConditions have been updated successfuly.`,
      });
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-primary">
          Patient MedicalConditions
        </h2>
        <h3 className="text-sm text-muted-foreground">
          Manage all the medicalConditions of the patient.
        </h3>
      </div>
      <PatientMedicalConditionsForm
        patientMedicalConditions={medicalConditions}
        setMedicalConditions={setMedicalConditions}
        currentMedicalCondition={currentMedicalCondition}
        setCurrentMedicalCondition={setCurrentMedicalCondition}
      />
      <Separator />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {medicalConditions
          .filter((medicalCondition) => !medicalCondition.isDeleted)
          .map((medicalCondition) => (
            <Card
              key={medicalCondition.medicalConditionId}
              className="col-span-1 rounded-lg transition-all"
            >
              <div className="truncate px-4 pt-6">
                <div className="flex flex-col gap-0.5">
                  <h3 className="truncate text-lg font-medium">
                    {medicalCondition.medicalCondition.name}
                  </h3>
                  {medicalCondition.date && (
                    <span className="mt-0.5 truncate">
                      Diagnosed at:{' '}
                      {format(new Date(medicalCondition.date), 'dd MMM yyyy')}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {format(new Date(medicalCondition.createdAt), 'dd MMM yyyy')}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={
                      currentMedicalCondition?.id === medicalCondition.id ||
                      isPending
                    }
                    onClick={() => setCurrentMedicalCondition(medicalCondition)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={
                      currentMedicalCondition?.id === medicalCondition.id ||
                      isPending
                    }
                    onClick={() => {
                      if (medicalCondition.id === currentMedicalCondition?.id) {
                        setCurrentMedicalCondition(null);
                      }

                      setMedicalConditions((prev) =>
                        prev.map((diag) =>
                          diag.id === medicalCondition.id
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
        onClick={() => mutatePatientMedicalConditions()}
        disabled={isPending}
        className="flex w-full items-center gap-2 sm:w-[100px]"
      >
        <Save className="h-5 w-5" /> Save
      </Button>
    </div>
  );
}
