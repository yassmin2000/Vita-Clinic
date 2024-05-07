'use client';

import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Plus, X } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';

import useAccessToken from '@/hooks/useAccessToken';

import type { PatientAllergyField } from './PatientAllergies';
import type { Lookup } from '@/types/settings.type';

const formSchema = z.object({
  allergy: z.object(
    {
      label: z.string(),
      value: z.string(),
    },
    {
      required_error: 'Allergy is required',
    }
  ),
  reaction: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

interface PatientAllergiesFormProps {
  patientAllergies: PatientAllergyField[];
  setAllergies: Dispatch<SetStateAction<PatientAllergyField[]>>;
  currentAllergy: PatientAllergyField | null;
  setCurrentAllergy: Dispatch<SetStateAction<PatientAllergyField | null>>;
}

export default function PatientAllergiesForm({
  patientAllergies,
  setAllergies,
  currentAllergy,
  setCurrentAllergy,
}: PatientAllergiesFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const accessToken = useAccessToken();

  const { data: allergies, isLoading: isLoadingAllergies } = useQuery({
    queryKey: ['allergies_form'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/allergies`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as Lookup[];

      if (data) {
        return data.map((allergy) => ({
          label: allergy.name,
          value: allergy.id,
          description: allergy.description,
        }));
      }

      return [];
    },
    enabled: !!accessToken,
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (currentAllergy) {
      setAllergies((prev) =>
        prev.map((allergy) =>
          allergy.id === currentAllergy.id
            ? {
                ...allergy,
                allergyId: data.allergy.value,
                patientReaction: data.reaction || undefined,
                notes: data.notes || undefined,
                allergy: {
                  name: data.allergy.label,
                },
                updatedAt: new Date().toISOString(),
                isNew: currentAllergy.isNew,
                isUpdated: true,
              }
            : allergy
        )
      );
    } else {
      setAllergies((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          allergyId: data.allergy.value,
          patientReaction: data.reaction || undefined,
          notes: data.notes || undefined,
          allergy: {
            name: data.allergy.label,
            description:
              allergies?.find((allergy) => allergy.value === data.allergy.value)
                ?.description || undefined,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isNew: true,
        },
      ]);
    }

    form.resetField('allergy');
    form.setValue('reaction', '');
    form.setValue('notes', '');
    setCurrentAllergy(null);
  };

  useEffect(() => {
    if (currentAllergy) {
      form.setValue('allergy', {
        label: currentAllergy.allergy.name,
        value: currentAllergy.allergyId,
      });
      form.setValue('reaction', currentAllergy.patientReaction);
      form.setValue('notes', currentAllergy.notes);
    }
  }, [currentAllergy]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 text-foreground"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <FormField
              name="allergy"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required>Allergy</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value?.value || ''}
                      onChange={(e) =>
                        field.onChange({
                          label:
                            allergies?.find((allergy) => allergy.value === e)
                              ?.label || '',
                          value: e,
                        })
                      }
                      placeholder="Select allergy..."
                      inputPlaceholder="Search allergies..."
                      options={
                        allergies
                          ? allergies.map((allergy) => ({
                              label: allergy.label,
                              value: allergy.value,
                              disabled: patientAllergies.some(
                                (alg) =>
                                  !alg.isDeleted &&
                                  alg.allergyId === allergy.value
                              ),
                            }))
                          : []
                      }
                      disabled={isLoadingAllergies || currentAllergy !== null}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="reaction"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Patient Reaction</FormLabel>
                  <FormControl>
                    <Input
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Cough"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            name="notes"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    value={field.value || ''}
                    onChange={field.onChange}
                    placeholder="Notes..."
                    minRows={4}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-4">
            {currentAllergy && (
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setCurrentAllergy(null);
                  form.reset();
                }}
                className="flex w-full items-center gap-2 sm:w-[100px]"
              >
                <X className="h-5 w-5" />
                Cancel
              </Button>
            )}

            <Button className="flex w-full items-center gap-2 sm:w-[100px]">
              {currentAllergy ? (
                <Edit className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              {currentAllergy ? 'Edit' : 'Add'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
