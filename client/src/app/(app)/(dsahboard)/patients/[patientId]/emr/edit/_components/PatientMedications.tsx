'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';

import PatientMedicationsForm from './PatientMedicationsForm';
import PatientMedicationItem from './PatientMedicationItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';

import type { PatientMedication } from '@/types/emr.type';

export type PatientMedicationField = PatientMedication & {
  isNew?: boolean;
  isUpdated?: boolean;
  isDeleted?: boolean;
};

interface PatientMedicationsProps {
  patientId: string;
  patientMedications: PatientMedication[];
  view?: boolean;
}

export default function PatientMedications({
  patientId,
  patientMedications,
  view = false,
}: PatientMedicationsProps) {
  const [medications, setMedications] = useState<PatientMedicationField[]>([
    ...patientMedications,
  ]);
  const [currentMedication, setCurrentMedication] =
    useState<PatientMedicationField | null>(null);

  const accessToken = useAccessToken();
  const { role } = useUserRole();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
          {view
            ? role === 'patient'
              ? 'View your medications information.'
              : 'View the medications information of the patient.'
            : 'Manage all the medications of the patient.'}{' '}
        </h3>
      </div>
      {!view && (
        <>
          <PatientMedicationsForm
            patientMedications={medications}
            setMedications={setMedications}
            currentMedication={currentMedication}
            setCurrentMedication={setCurrentMedication}
          />
          <Separator />
        </>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {medications
          .filter((medication) => !medication.isDeleted)
          .map((medication) => (
            <PatientMedicationItem
              key={medication.id}
              medication={medication}
              isEditDisabled={
                currentMedication?.id === medication.id || isPending
              }
              onEdit={() => setCurrentMedication(medication)}
              isDeleteDisabled={
                currentMedication?.id === medication.id || isPending
              }
              onDelete={() =>
                setMedications((prev) =>
                  prev.map((med) =>
                    med.id === medication.id
                      ? {
                          ...med,
                          isDeleted: true,
                          isUpdated: false,
                        }
                      : med
                  )
                )
              }
              view={view}
            />
          ))}
      </div>

      {!view && (
        <Button
          onClick={() => mutatePatientMedications()}
          disabled={isPending}
          className="flex w-full items-center gap-2 sm:w-[100px]"
        >
          <Save className="h-5 w-5" /> Save
        </Button>
      )}
    </div>
  );
}
