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
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';

import useAccessToken from '@/hooks/useAccessToken';
import { cn } from '@/lib/utils';

import type { PatientMedicationField } from './PatientMedications';
import type { Medication } from '@/types/settings.type';

const formSchema = z.object({
  medication: z.object(
    {
      label: z.string(),
      value: z.string(),
      unit: z.string(),
    },
    {
      required_error: 'Medication is required',
    }
  ),
  startDate: z
    .date()
    .max(new Date(), {
      message: 'Medication date cannot be in the future.',
    })
    .optional(),
  endDate: z.date().optional(),
  notes: z.string().optional(),
  dosage: z.number().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  required: z.boolean(),
});

interface PatientMedicationsFormProps {
  patientMedications: PatientMedicationField[];
  setMedications: Dispatch<SetStateAction<PatientMedicationField[]>>;
  currentMedication: PatientMedicationField | null;
  setCurrentMedication: Dispatch<SetStateAction<PatientMedicationField | null>>;
}

export default function PatientMedicationsForm({
  patientMedications,
  setMedications,
  currentMedication,
  setCurrentMedication,
}: PatientMedicationsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      required: false,
    },
  });
  const accessToken = useAccessToken();

  const { data: medications, isLoading: isLoadingMedications } = useQuery({
    queryKey: ['medications_form'],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/settings/medications`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data as Medication[];

      if (data) {
        return data.map((medication) => ({
          label: medication.name,
          value: medication.id,
          unit: medication.unit,
          description: medication.description,
          dosageForm: medication.dosageForm,
          routeOfAdministration: medication.routeOfAdministration,
        }));
      }

      return [];
    },
    enabled: !!accessToken,
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (currentMedication) {
      setMedications((prev) =>
        prev.map((medication) =>
          medication.id === currentMedication.id
            ? {
                ...medication,
                medicationId: data.medication.value,
                startDate: data.startDate
                  ? data.startDate.toISOString()
                  : undefined,
                endDate: data.endDate ? data.endDate.toISOString() : undefined,
                dosage: data.dosage,
                frequency: data.frequency,
                required: data.required,
                notes: data.notes,
                medication: {
                  name: medication.medication.name,
                  unit: medication.medication.unit,
                  description: medication.medication.description,
                  dosageForm: medication.medication.dosageForm,
                  routeOfAdministration:
                    medication.medication.routeOfAdministration,
                },
                updatedAt: new Date().toISOString(),
                isNew: currentMedication.isNew,
                isUpdated: true,
              }
            : medication
        )
      );
    } else {
      setMedications((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          medicationId: data.medication.value,
          startDate: data.startDate ? data.startDate.toISOString() : undefined,
          endDate: data.endDate ? data.endDate.toISOString() : undefined,
          dosage: data.dosage,
          frequency: data.frequency,
          required: data.required,
          notes: data.notes,
          medication: {
            name: data.medication.label,
            unit:
              medications?.find(
                (medication) => medication.value === data.medication.value
              )?.unit || '',
            description: medications?.find(
              (medication) => medication.value === data.medication.value
            )?.description,
            dosageForm:
              medications?.find(
                (medication) => medication.value === data.medication.value
              )?.dosageForm || 'capsule',
            routeOfAdministration:
              medications?.find(
                (medication) => medication.value === data.medication.value
              )?.routeOfAdministration || 'oral',
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isNew: true,
        },
      ]);
    }

    form.reset();
    form.setValue('dosage', undefined);
    form.setValue('frequency', undefined);
    setCurrentMedication(null);
  };

  useEffect(() => {
    if (currentMedication) {
      form.setValue('medication', {
        label: currentMedication.medication.name,
        value: currentMedication.medicationId,
        unit: currentMedication.medication.unit,
      });
      form.setValue('startDate', new Date(currentMedication.startDate || ''));
      form.setValue('endDate', new Date(currentMedication.endDate || ''));
      form.setValue('dosage', currentMedication.dosage);
      form.setValue('frequency', currentMedication.frequency);
      form.setValue('required', currentMedication.required);
      form.setValue('notes', currentMedication.notes);
    }
  }, [currentMedication]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 text-foreground"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <FormField
              name="medication"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel required>Medication</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value?.value || ''}
                      onChange={(e) =>
                        field.onChange({
                          label:
                            medications?.find(
                              (medication) => medication.value === e
                            )?.label || '',
                          value: e,
                          unit: medications?.find(
                            (medication) => medication.value === e
                          )?.unit,
                        })
                      }
                      placeholder="Select medication..."
                      inputPlaceholder="Search medications..."
                      options={
                        medications
                          ? medications.map((medication) => ({
                              label: medication.label,
                              value: medication.value,
                              disabled: patientMedications.some(
                                (alg) =>
                                  !alg.isDeleted &&
                                  alg.medicationId === medication.value
                              ),
                            }))
                          : []
                      }
                      disabled={
                        isLoadingMedications || currentMedication !== null
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="dosage"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Dosage{' '}
                    {form.getValues('medication') &&
                      `(${form.getValues('medication.unit')})`}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10"
                      {...field}
                      onChange={(event) => field.onChange(+event.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="frequency"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Frequency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select dosage frequency"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-center">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Medication Start Date</FormLabel>
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
                            <span>Pick medication start date</span>
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

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Medication End Date</FormLabel>
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
                            <span>Pick medication end date</span>
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
                          date <
                          new Date(form.getValues('startDate') || '1900-01-01')
                        }
                        fromYear={new Date(
                          form.getValues('startDate') || '1900-01-01'
                        ).getFullYear()}
                        toYear={2040}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="required"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-2">
                  <FormLabel className="pointer-events-none opacity-0">
                    Required
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="required"
                        checked={field.value}
                        onClick={() => {
                          field.onChange(!field.value);
                        }}
                      />
                      <label
                        htmlFor="required"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        This medication is required
                      </label>
                    </div>
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
            {currentMedication && (
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setCurrentMedication(null);
                  form.reset();
                }}
                className="flex w-full items-center gap-2 sm:w-[100px]"
              >
                <X className="h-5 w-5" />
                Cancel
              </Button>
            )}

            <Button className="flex w-full items-center gap-2 sm:w-[100px]">
              {currentMedication ? (
                <Edit className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              {currentMedication ? 'Edit' : 'Add'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
