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

import type { PatientDiagnosisField } from './PatientDiagnoses';
import type { Lookup } from '@/types/settings.type';

const formSchema = z.object({
  diagnosis: z.object(
    {
      label: z.string(),
      value: z.string(),
    },
    {
      required_error: 'Diagnosis is required',
    }
  ),
  date: z
    .date({
      required_error: 'Diagnosis date is required.',
    })
    .max(new Date(), {
      message: 'Diagnosis date cannot be in the future.',
    }),
  notes: z.string().optional().nullable(),
});

interface PatientDiagnosesFormProps {
  patientDiagnoses: PatientDiagnosisField[];
  setDiagnoses: Dispatch<SetStateAction<PatientDiagnosisField[]>>;
  currentDiagnosis: PatientDiagnosisField | null;
  setCurrentDiagnosis: Dispatch<SetStateAction<PatientDiagnosisField | null>>;
}

export default function PatientDiagnosesForm({
  patientDiagnoses,
  setDiagnoses,
  currentDiagnosis,
  setCurrentDiagnosis,
}: PatientDiagnosesFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const accessToken = useAccessToken();

  const { data: diagnoses, isLoading: isLoadingDiagnoses } = useQuery({
    queryKey: ['diagnoses_form'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/diagnoses`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as Lookup[];

      if (data) {
        return data.map((diagnosis) => ({
          label: diagnosis.name,
          value: diagnosis.id,
        }));
      }

      return [];
    },
    enabled: !!accessToken,
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (currentDiagnosis) {
      setDiagnoses((prev) =>
        prev.map((diagnosis) =>
          diagnosis.id === currentDiagnosis.id
            ? {
                ...diagnosis,
                diagnosisId: data.diagnosis.value,
                date: data.date.toISOString(),
                notes: data.notes || undefined,
                diagnosis: {
                  name: data.diagnosis.label,
                },
                updatedAt: new Date().toISOString(),
                isNew: currentDiagnosis.isNew,
                isUpdated: true,
              }
            : diagnosis
        )
      );
    } else {
      setDiagnoses((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          diagnosisId: data.diagnosis.value,
          date: data.date.toISOString(),
          notes: data.notes || undefined,
          diagnosis: {
            name: data.diagnosis.label,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isNew: true,
        },
      ]);
    }

    form.reset();
    // form.resetField('diagnosis');
    // form.setValue('reaction', '');
    form.setValue('notes', '');
    setCurrentDiagnosis(null);
  };

  useEffect(() => {
    if (currentDiagnosis) {
      form.setValue('diagnosis', {
        label: currentDiagnosis.diagnosis.name,
        value: currentDiagnosis.diagnosisId,
      });
      form.setValue('date', new Date(currentDiagnosis.date));
      form.setValue('notes', currentDiagnosis.notes);
    }
  }, [currentDiagnosis]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 text-foreground"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <FormField
              name="diagnosis"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required>Diagnosis</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value?.value || ''}
                      onChange={(e) =>
                        field.onChange({
                          label:
                            diagnoses?.find(
                              (diagnosis) => diagnosis.value === e
                            )?.label || '',
                          value: e,
                        })
                      }
                      placeholder="Select diagnosis..."
                      inputPlaceholder="Search diagnoses..."
                      options={
                        diagnoses
                          ? diagnoses.map((diagnosis) => ({
                              label: diagnosis.label,
                              value: diagnosis.value,
                              disabled: patientDiagnoses.some(
                                (alg) =>
                                  !alg.isDeleted &&
                                  alg.diagnosisId === diagnosis.value
                              ),
                            }))
                          : []
                      }
                      disabled={isLoadingDiagnoses || currentDiagnosis !== null}
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
                  <FormLabel required>Diagnosis Date</FormLabel>
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
                            <span>Pick diagnosis date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
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
            {currentDiagnosis && (
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setCurrentDiagnosis(null);
                  form.reset();
                }}
                className="flex w-full items-center gap-2 sm:w-[100px]"
              >
                <X className="h-5 w-5" />
                Cancel
              </Button>
            )}

            <Button className="flex w-full items-center gap-2 sm:w-[100px]">
              {currentDiagnosis ? (
                <Edit className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              {currentDiagnosis ? 'Edit' : 'Add'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
