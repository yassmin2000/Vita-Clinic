'use client';

import { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Edit, Plus, Save, Trash } from 'lucide-react';

import PatientAllergiesForm from './PatientAllergiesForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

import useAccessToken from '@/hooks/useAccessToken';

import type { PatientAllergy } from '@/types/emr.type';

export type PatientAllergyField = PatientAllergy & {
  isNew?: boolean;
  isUpdated?: boolean;
  isDeleted?: boolean;
};

interface PatientAllergiesProps {
  patientId: string;
  patientAllergies: PatientAllergy[];
}

export default function PatientAllergies({
  patientId,
  patientAllergies,
}: PatientAllergiesProps) {
  const [allergies, setAllergies] = useState<PatientAllergyField[]>([
    ...patientAllergies,
  ]);
  const [currentAllergy, setCurrentAllergy] =
    useState<PatientAllergyField | null>(null);

  const accessToken = useAccessToken();
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
          Manage all the allergies of the patient.
        </h3>
      </div>
      <PatientAllergiesForm
        patientAllergies={allergies}
        setAllergies={setAllergies}
        currentAllergy={currentAllergy}
        setCurrentAllergy={setCurrentAllergy}
      />
      <Separator />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allergies
          .filter((allergy) => !allergy.isDeleted)
          .map((allergy) => (
            <Card
              key={allergy.allergyId}
              className="col-span-1 rounded-lg transition-all"
            >
              <div className="truncate px-4 pt-6">
                <div className="flex flex-col gap-0.5">
                  <h3 className="truncate text-lg font-medium">
                    {allergy.allergy.name}
                  </h3>
                  {allergy.patientReaction && (
                    <span className="mt-0.5 truncate">
                      Reaction: {allergy.patientReaction}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {format(new Date(allergy.createdAt), 'dd MMM yyyy')}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={currentAllergy?.id === allergy.id || isPending}
                    onClick={() => setCurrentAllergy(allergy)}
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={currentAllergy?.id === allergy.id || isPending}
                    onClick={() => {
                      if (allergy.id === currentAllergy?.id) {
                        setCurrentAllergy(null);
                      }

                      setAllergies((prev) =>
                        prev.map((alg) =>
                          alg.id === allergy.id
                            ? { ...alg, isDeleted: true }
                            : alg
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
        disabled={isPending}
        onClick={() => mutatePatientAllergies()}
        className="flex w-full items-center gap-2 sm:w-[100px]"
      >
        <Save className="h-5 w-5" /> Save
      </Button>
    </div>
  );
}
