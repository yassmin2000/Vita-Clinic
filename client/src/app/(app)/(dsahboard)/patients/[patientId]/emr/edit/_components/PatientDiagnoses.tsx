'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';

import PatientDiagnosesForm from './PatientDiagnosesForm';
import PatientDiagnosisItem from './PatientDiagnosisItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';

import type { PatientDiagnosis } from '@/types/emr.type';

export type PatientDiagnosisField = PatientDiagnosis & {
  isNew?: boolean;
  isUpdated?: boolean;
  isDeleted?: boolean;
};

interface PatientDiagnosesProps {
  patientId: string;
  patientDiagnoses: PatientDiagnosis[];
  view?: boolean;
}

export default function PatientDiagnoses({
  patientId,
  patientDiagnoses,
  view = false,
}: PatientDiagnosesProps) {
  const [diagnoses, setDiagnoses] = useState<PatientDiagnosisField[]>([
    ...patientDiagnoses,
  ]);
  const [currentDiagnosis, setCurrentDiagnosis] =
    useState<PatientDiagnosisField | null>(null);

  const accessToken = useAccessToken();
  const { role } = useUserRole();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: mutatePatientDiagnoses, isPending } = useMutation({
    mutationFn: async () => {
      const body = {
        diagnoses: {
          deleted: diagnoses
            .filter((diagnosis) => !diagnosis.isNew && diagnosis.isDeleted)
            .map((diagnosis) => diagnosis.diagnosisId),
          new: diagnoses
            .filter((diagnosis) => diagnosis.isNew && !diagnosis.isDeleted)
            .map((diagnosis) => ({
              diagnosisId: diagnosis.diagnosisId,
              notes: diagnosis.notes,
              date: diagnosis.date,
            })),
          updated: diagnoses
            .filter(
              (diagnosis) =>
                diagnosis.isUpdated && !diagnosis.isNew && !diagnosis.isDeleted
            )
            .map((diagnosis) => ({
              diagnosisId: diagnosis.diagnosisId,
              notes: diagnosis.notes,
              date: diagnosis.date,
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
        title: `Failed to update patient's diagnoses`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`emr_${patientId}`],
      });

      return toast({
        title: `Patient's diagnoses updated successfully`,
        description: `Patient's diagnoses have been updated successfuly.`,
      });
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-primary">
          Patient Diagnoses
        </h2>
        <h3 className="text-sm text-muted-foreground">
          {view
            ? role === 'patient'
              ? 'View your diagnoses information.'
              : 'View the diagnoses information of the patient.'
            : 'Manage all the diagnoses of the patient.'}
        </h3>
      </div>
      {!view && (
        <>
          <PatientDiagnosesForm
            patientDiagnoses={diagnoses}
            setDiagnoses={setDiagnoses}
            currentDiagnosis={currentDiagnosis}
            setCurrentDiagnosis={setCurrentDiagnosis}
          />
          <Separator />
        </>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {diagnoses
          .filter((diagnosis) => !diagnosis.isDeleted)
          .map((diagnosis) => (
            <PatientDiagnosisItem
              key={diagnosis.id}
              diagnosis={diagnosis}
              isEditDisabled={
                currentDiagnosis?.id === diagnosis.id || isPending
              }
              onEdit={() => setCurrentDiagnosis(diagnosis)}
              isDeleteDisabled={
                currentDiagnosis?.id === diagnosis.id || isPending
              }
              onDelete={() => {
                if (diagnosis.id === currentDiagnosis?.id) {
                  setCurrentDiagnosis(null);
                }

                setDiagnoses((prev) =>
                  prev.map((diag) =>
                    diag.id === diagnosis.id
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
          onClick={() => mutatePatientDiagnoses()}
          disabled={isPending}
          className="flex w-full items-center gap-2 sm:w-[100px]"
        >
          <Save className="h-5 w-5" /> Save
        </Button>
      )}
    </div>
  );
}
