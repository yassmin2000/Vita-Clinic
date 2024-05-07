'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';

import PatientMedicalConditionsForm from './PatientMedicalConditionsForm';
import PatientMedicalConditionItem from './PatientMedicalConditionItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';

import type { PatientMedicalCondition } from '@/types/emr.type';

export type PatientMedicalConditionField = PatientMedicalCondition & {
  isNew?: boolean;
  isUpdated?: boolean;
  isDeleted?: boolean;
};

interface PatientMedicalConditionsProps {
  patientId: string;
  patientMedicalConditions: PatientMedicalCondition[];
  view?: boolean;
}

export default function PatientMedicalConditions({
  patientId,
  patientMedicalConditions,
  view = false,
}: PatientMedicalConditionsProps) {
  const [medicalConditions, setMedicalConditions] = useState<
    PatientMedicalConditionField[]
  >([...patientMedicalConditions]);
  const [currentMedicalCondition, setCurrentMedicalCondition] =
    useState<PatientMedicalConditionField | null>(null);

  const accessToken = useAccessToken();
  const { role } = useUserRole();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
          Patient Medical Conditions
        </h2>
        <h3 className="text-sm text-muted-foreground">
          {view
            ? role === 'patient'
              ? 'View your medical conditions information.'
              : 'View the medical conditions information of the patient.'
            : 'Manage all the medical conditions of the patient.'}
        </h3>
      </div>
      {!view && (
        <>
          <PatientMedicalConditionsForm
            patientMedicalConditions={medicalConditions}
            setMedicalConditions={setMedicalConditions}
            currentMedicalCondition={currentMedicalCondition}
            setCurrentMedicalCondition={setCurrentMedicalCondition}
          />
          <Separator />
        </>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {medicalConditions
          .filter((medicalCondition) => !medicalCondition.isDeleted)
          .map((medicalCondition) => (
            <PatientMedicalConditionItem
              key={medicalCondition.medicalConditionId}
              medicalCondition={medicalCondition}
              isEditDisabled={
                currentMedicalCondition?.id === medicalCondition.id || isPending
              }
              onEdit={() => setCurrentMedicalCondition(medicalCondition)}
              isDeleteDisabled={
                currentMedicalCondition?.id === medicalCondition.id || isPending
              }
              onDelete={() => {
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
              view={view}
            />
          ))}
      </div>

      {!view && (
        <Button
          onClick={() => mutatePatientMedicalConditions()}
          disabled={isPending}
          className="flex w-full items-center gap-2 sm:w-[100px]"
        >
          <Save className="h-5 w-5" /> Save
        </Button>
      )}
    </div>
  );
}
