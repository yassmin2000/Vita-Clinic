'use client';

import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Edit, Plus, X } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Combobox } from '@/components/ui/combobox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

import useAccessToken from '@/hooks/useAccessToken';
import { cn } from '@/lib/utils';

import type { PatientMedicalConditionField } from './PatientMedicalConditions';
import type { Lookup } from '@/types/settings.type';

const formSchema = z.object({
  medicalCondition: z.object(
    {
      label: z.string(),
      value: z.string(),
    },
    {
      required_error: 'MedicalCondition is required',
    }
  ),
  date: z
    .date({
      required_error: 'MedicalCondition date is required.',
    })
    .max(new Date(), {
      message: 'MedicalCondition date cannot be in the future.',
    }),
  notes: z.string().optional().nullable(),
});

interface PatientMedicalConditionsFormProps {
  patientMedicalConditions: PatientMedicalConditionField[];
  setMedicalConditions: Dispatch<
    SetStateAction<PatientMedicalConditionField[]>
  >;
  currentMedicalCondition: PatientMedicalConditionField | null;
  setCurrentMedicalCondition: Dispatch<
    SetStateAction<PatientMedicalConditionField | null>
  >;
}

export default function PatientMedicalConditionsForm({
  patientMedicalConditions,
  setMedicalConditions,
  currentMedicalCondition,
  setCurrentMedicalCondition,
}: PatientMedicalConditionsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const accessToken = useAccessToken();

  const { data: medicalConditions, isLoading: isLoadingMedicalConditions } =
    useQuery({
      queryKey: ['medical-conditions_form'],
      queryFn: async () => {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/medical-conditions`,
          {
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = response.data as Lookup[];

        if (data) {
          return data.map((medicalCondition) => ({
            label: medicalCondition.name,
            value: medicalCondition.id,
            description: medicalCondition.description,
          }));
        }

        return [];
      },
      enabled: !!accessToken,
    });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (currentMedicalCondition) {
      setMedicalConditions((prev) =>
        prev.map((medicalCondition) =>
          medicalCondition.id === currentMedicalCondition.id
            ? {
                ...medicalCondition,
                medicalConditionId: data.medicalCondition.value,
                date: data.date.toISOString(),
                notes: data.notes || undefined,
                medicalCondition: {
                  name: data.medicalCondition.label,
                },
                updatedAt: new Date().toISOString(),
                isNew: currentMedicalCondition.isNew,
                isUpdated: true,
              }
            : medicalCondition
        )
      );
    } else {
      setMedicalConditions((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          medicalConditionId: data.medicalCondition.value,
          date: data.date.toISOString(),
          notes: data.notes || undefined,
          medicalCondition: {
            name: data.medicalCondition.label,
            description: medicalConditions?.find(
              (medicalCondition) =>
                medicalCondition.value === data.medicalCondition.value
            )?.description,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isNew: true,
        },
      ]);
    }

    form.reset();
    // form.resetField('medicalCondition');
    // form.setValue('reaction', '');
    form.setValue('notes', '');
    setCurrentMedicalCondition(null);
  };

  useEffect(() => {
    if (currentMedicalCondition) {
      form.setValue('medicalCondition', {
        label: currentMedicalCondition.medicalCondition.name,
        value: currentMedicalCondition.medicalConditionId,
      });
      form.setValue('date', new Date(currentMedicalCondition.date));
      form.setValue('notes', currentMedicalCondition.notes);
    }
  }, [currentMedicalCondition]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 text-foreground"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <FormField
              name="medicalCondition"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required>Medical Condition</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value?.value || ''}
                      onChange={(e) =>
                        field.onChange({
                          label:
                            medicalConditions?.find(
                              (medicalCondition) => medicalCondition.value === e
                            )?.label || '',
                          value: e,
                        })
                      }
                      placeholder="Select medical condition..."
                      inputPlaceholder="Search medical conditions..."
                      options={
                        medicalConditions
                          ? medicalConditions.map((medicalCondition) => ({
                              label: medicalCondition.label,
                              value: medicalCondition.value,
                              disabled: patientMedicalConditions.some(
                                (alg) =>
                                  !alg.isDeleted &&
                                  alg.medicalConditionId ===
                                    medicalCondition.value
                              ),
                            }))
                          : []
                      }
                      disabled={
                        isLoadingMedicalConditions ||
                        currentMedicalCondition !== null
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required>Medical Condition Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'flex h-10 w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick medical condition date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
            {currentMedicalCondition && (
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setCurrentMedicalCondition(null);
                  form.reset();
                }}
                className="flex w-full items-center gap-2 sm:w-[100px]"
              >
                <X className="h-5 w-5" />
                Cancel
              </Button>
            )}

            <Button className="flex w-full items-center gap-2 sm:w-[100px]">
              {currentMedicalCondition ? (
                <Edit className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              {currentMedicalCondition ? 'Edit' : 'Add'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
