'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';

import PatientAllergiesForm from './PatientAllergiesForm';
import PatientAllergyItem from './PatientAllergyItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';
import useUserRole from '@/hooks/useUserRole';

import type { PatientAllergy } from '@/types/emr.type';

export type PatientAllergyField = PatientAllergy & {
  isNew?: boolean;
  isUpdated?: boolean;
  isDeleted?: boolean;
};

interface PatientAllergiesProps {
  patientId: string;
  patientAllergies: PatientAllergy[];
  view?: boolean;
}

export default function PatientAllergies({
  patientId,
  patientAllergies,
  view = false,
}: PatientAllergiesProps) {
  const [allergies, setAllergies] = useState<PatientAllergyField[]>([
    ...patientAllergies,
  ]);
  const [currentAllergy, setCurrentAllergy] =
    useState<PatientAllergyField | null>(null);

  const accessToken = useAccessToken();
  const { role } = useUserRole();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: mutatePatientAllergies, isPending } = useMutation({
    mutationFn: async () => {
      const body = {
        allergies: {
          deleted: allergies
            .filter((allergy) => !allergy.isNew && allergy.isDeleted)
            .map((allergy) => allergy.allergyId),
          new: allergies
            .filter((allergy) => allergy.isNew && !allergy.isDeleted)
            .map((allergy) => ({
              allergyId: allergy.allergyId,
              notes: allergy.notes,
              reaction: allergy.patientReaction,
            })),
          updated: allergies
            .filter(
              (allergy) =>
                allergy.isUpdated && !allergy.isNew && !allergy.isDeleted
            )
            .map((allergy) => ({
              allergyId: allergy.allergyId,
              notes: allergy.notes,
              reaction: allergy.patientReaction,
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
        title: `Failed to update patient's allergies`,
        description: 'Please try again later.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`emr_${patientId}`],
      });

      return toast({
        title: `Patient's allergies updated successfully`,
        description: `Patient's allergies have been updated successfuly.`,
      });
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold text-primary">
          Patient Allergies
        </h2>
        <h3 className="text-sm text-muted-foreground">
          {view
            ? role === 'patient'
              ? 'View your allergies information.'
              : 'View the allergies information of the patient.'
            : 'Manage all the allergies of the patient.'}
        </h3>
      </div>
      {!view && (
        <>
          <PatientAllergiesForm
            patientAllergies={allergies}
            setAllergies={setAllergies}
            currentAllergy={currentAllergy}
            setCurrentAllergy={setCurrentAllergy}
          />
          <Separator />
        </>
      )}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allergies
          .filter((allergy) => !allergy.isDeleted)
          .map((allergy) => (
            <PatientAllergyItem
              key={allergy.id}
              allergy={allergy}
              isEditDisabled={currentAllergy?.id === allergy.id || isPending}
              onEdit={() => setCurrentAllergy(allergy)}
              isDeleteDisabled={currentAllergy?.id === allergy.id || isPending}
              onDelete={() => {
                if (allergy.id === currentAllergy?.id) {
                  setCurrentAllergy(null);
                }
                setAllergies((prev) =>
                  prev.map((alg) =>
                    alg.id === allergy.id ? { ...alg, isDeleted: true } : alg
                  )
                );
              }}
              view={view}
            />
          ))}
      </div>

      {!view && (
        <Button
          disabled={isPending}
          onClick={() => mutatePatientAllergies()}
          className="flex w-full items-center gap-2 sm:w-[100px]"
        >
          <Save className="h-5 w-5" /> Save
        </Button>
      )}
    </div>
  );
}
