'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Edit, Plus, Save, Trash } from 'lucide-react';

import PatientMedicationsForm from './PatientMedicationsForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';

import type { PatientMedication } from '@/types/emr.type';

export type PatientMedicationField = PatientMedication & {
  isNew?: boolean;
  isUpdated?: boolean;
  isDeleted?: boolean;
};

interface PatientMedicationsProps {
  patientId: string;
  patientMedications: PatientMedication[];
}

export default function PatientMedications({
  patientId,
  patientMedications,
}: PatientMedicationsProps) {
  const [medications, setMedications] = useState<PatientMedicationField[]>([
    ...patientMedications,
  ]);
  const [currentMedication, setCurrentMedication] =
    useState<PatientMedicationField | null>(null);
  const { toast } = useToast();
  const accessToken = useAccessToken();
  const queryClient = useQueryClient();

  const { mutate: mutatePatientMedications, isPending } = useMutation({
    mutationFn: async () => {
      const body = {
        medications: {
          deleted: medications
            .filter((medication) => !medication.isNew && medication.isDeleted)
            .map((medication) => medication.medicationId),
          new: medications
            .filter((medication) => medication.isNew && !medication.isDeleted)
            .map((medication) => ({
              medicationId: medication.medicationId,
              notes: medication.notes,
              startDate: medication.startDate,
              endDate: medication.endDate,
              dosage: medication.dosage,
              frequency: medication.frequency,
              required: medication.required,
            })),
          updated: medications
            .filter(
              (medication) =>
                medication.isUpdated &&
                !medication.isNew &&
                !medication.isDeleted
            )
            .map((medication) => ({
              medicationId: medication.medicationId,
              notes: medication.notes,
              startDate: medication.startDate,
              endDate: medication.endDate,
              dosage: medication.dosage,
              frequency: medication.frequency,
              required: medication.required,
            })),
        },
      };

      console.log(body);

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
        title: `Failed to update patient's medications`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`emr_${patientId}`],
      });

      return toast({
        title: `Patient's medications updated successfully`,
        description: `Patient's medications have been updated successfuly.`,
      });
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-primary">
          Patient Medications
        </h2>
        <h3 className="text-sm text-muted-foreground">
          Manage all the medications of the patient.
        </h3>
      </div>
      <PatientMedicationsForm
        patientMedications={medications}
        setMedications={setMedications}
        currentMedication={currentMedication}
        setCurrentMedication={setCurrentMedication}
      />
      <Separator />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {medications
          .filter((medication) => !medication.isDeleted)
          .map((medication) => (
            <Card
              key={medication.medicationId}
              className="col-span-1 rounded-lg transition-all"
            >
              <div className="truncate px-4 pt-6">
                <div className="flex flex-col gap-0.5">
                  <h3 className="truncate text-lg font-medium">
                    {medication.medication.name}
                  </h3>
                  <span className="mt-0.5 truncate">
                    Dosage: {medication.dosage} {medication.medication.unit}{' '}
                    {medication.frequency} (
                    {medication.required ? 'Required' : 'Optional'})
                  </span>
                  <div className="flex items-center gap-1">
                    {medication.startDate && (
                      <span className="mt-0.5 truncate">
                        {format(new Date(medication.startDate), 'dd MMM yyyy')}
                      </span>
                    )}
                    {medication.endDate && (
                      <span className="mt-0.5 truncate">
                        - {format(new Date(medication.endDate), 'dd MMM yyyy')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {format(new Date(medication.createdAt), 'dd MMM yyyy')}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={
                      currentMedication?.id === medication.id || isPending
                    }
                    onClick={() => setCurrentMedication(medication)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={
                      currentMedication?.id === medication.id || isPending
                    }
                    onClick={() => {
                      if (medication.id === currentMedication?.id) {
                        setCurrentMedication(null);
                      }

                      setMedications((prev) =>
                        prev.map((diag) =>
                          diag.id === medication.id
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
        onClick={() => mutatePatientMedications()}
        disabled={isPending}
        className="flex w-full items-center gap-2 sm:w-[100px]"
      >
        <Save className="h-5 w-5" /> Save
      </Button>
    </div>
  );
}
