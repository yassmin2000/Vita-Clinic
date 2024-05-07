'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Edit, Plus, Save, Trash } from 'lucide-react';

import PatientDiagnosesForm from './PatientDiagnosesForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';

import type { PatientDiagnosis } from '@/types/emr.type';

export type PatientDiagnosisField = PatientDiagnosis & {
  isNew?: boolean;
  isUpdated?: boolean;
  isDeleted?: boolean;
};

interface PatientDiagnosesProps {
  patientId: string;
  patientDiagnoses: PatientDiagnosis[];
}

export default function PatientDiagnoses({
  patientId,
  patientDiagnoses,
}: PatientDiagnosesProps) {
  const [diagnoses, setDiagnoses] = useState<PatientDiagnosisField[]>([
    ...patientDiagnoses,
  ]);
  const [currentDiagnosis, setCurrentDiagnosis] =
    useState<PatientDiagnosisField | null>(null);
  const { toast } = useToast();
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

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
          Manage all the diagnoses of the patient.
        </h3>
      </div>
      <PatientDiagnosesForm
        patientDiagnoses={diagnoses}
        setDiagnoses={setDiagnoses}
        currentDiagnosis={currentDiagnosis}
        setCurrentDiagnosis={setCurrentDiagnosis}
      />
      <Separator />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {diagnoses
          .filter((diagnosis) => !diagnosis.isDeleted)
          .map((diagnosis) => (
            <Card
              key={diagnosis.diagnosisId}
              className="col-span-1 rounded-lg transition-all"
            >
              <div className="truncate px-4 pt-6">
                <div className="flex flex-col gap-0.5">
                  <h3 className="truncate text-lg font-medium">
                    {diagnosis.diagnosis.name}
                  </h3>
                  {diagnosis.date && (
                    <span className="mt-0.5 truncate">
                      Diagnosed at:{' '}
                      {format(new Date(diagnosis.date), 'dd MMM yyyy')}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {format(new Date(diagnosis.createdAt), 'dd MMM yyyy')}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={
                      currentDiagnosis?.id === diagnosis.id || isPending
                    }
                    onClick={() => setCurrentDiagnosis(diagnosis)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={
                      currentDiagnosis?.id === diagnosis.id || isPending
                    }
                    onClick={() => {
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
                  >
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
      </div>

      <Button
        onClick={() => mutatePatientDiagnoses()}
        disabled={isPending}
        className="flex w-full items-center gap-2 sm:w-[100px]"
      >
        <Save className="h-5 w-5" /> Save
      </Button>
    </div>
  );
}
